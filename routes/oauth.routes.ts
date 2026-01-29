import express, { NextFunction, Request, Response } from 'express'
import prisma from '../provider/prisma'
import { ExtendedRequest } from '../utils/types'
import passport from '../provider/google'
import passportFb from '../provider/facebook'
// import pasportX from "../provider/twitter";
import pasportX from '../provider/twitter_oauth_v1'
import passportNative from '../provider/native'
import Client from '../middlewares/client'
import ClientService from '../services/client'
import AccountService from '../services/account'
import { Runtime } from '../runtime'
import {
  AuthSessionType,
  ClientAuthSession,
  Prisma,
  Client as ClientModel,
  Account,
} from '@prisma/client'
import { nextApp } from '../next'
import { getInfiniteExpiryMagic, getUnixMilliseconds } from '../utils/token'
import { encryptPasscode } from '../utils/passwd'

const router = express.Router()
const handle = nextApp.getRequestHandler()

router.get('/', (_, res: Response) => {
  res.send('Ok')
})

// router.get("/loginui", (req: ExtendedRequest, res: Response) => {
//   res.render("login_ui", {
//     logo: "https://f.start.me/us.gov",
//     name: "Shortkey",
//     sessionId: "",
//     color: "#0066ff",
//   });
// });

// router.get("/redirectui", (req: ExtendedRequest, res: Response) => {
//   res.render("redirect_ui", {
//     logo: "https://f.start.me/us.gov",
//     name: "Shortkey",
//     sessionId: "",
//     color: "#0066ff",
//     clientOrigins: ["http://localhost:5500"],
//   });
// });

// Client.serializeClient, Client.clientAccessGuard
router.get('/login', async (req: ExtendedRequest, res: Response) => {
  const session_id = req.query['sess_id'] as string

  const session = await ClientService.getSessionWithID(session_id)

  if (!session) {
    return res.status(400).json({
      message: 'session undefined',
    })
  }

  console.log('Sessiosn :: ', session)

  const client = session.client
  let connectedClient: ClientModel | null = null
  let connectedAccount: (Account & any) | null = null

  if (
    session.connectedClientId &&
    session.connectedAccountId &&
    session.type === AuthSessionType.ConnectApp
  ) {
    connectedClient = await ClientService.getClientWithId(
      session.connectedClientId,
    )
    connectedAccount = await AccountService.getAccountWithId(
      session.connectedAccountId,
    )
  }

  let userEmail = connectedAccount ? connectedAccount.assignId : null

  if (connectedAccount) {
    ;(connectedAccount.connections || []).map((c: any) => {
      if (c.provider === 'Native') {
        userEmail = c.providerUsername
      }
    })
  }

  let pp = !connectedClient
    ? {}
    : {
        ccLogo: connectedClient.logo,
        ccName: connectedClient.name,
        ccColor: connectedClient.color,
        ccId: connectedClient.id,
        firstName: connectedAccount.firstName,
        lastName: connectedAccount.lastName,
        picture: connectedAccount.picture,
        email: userEmail,
      }

  let params = {
    logo: client?.logo || '',
    name: client?.name || '',
    color: client?.color || '',
    sessionId: session_id,
    sessionType: session.type,
    appURL: Runtime.getAppURL(),
    userAppUrl: client.origins.length > 0 ? client.origins[0] : null,
    ...pp,
  }
  // res.render('login_ui', {
  //   logo: client?.logo || '',
  //   name: client?.name || '',
  //   color: client?.color || '',
  //   sessionId: session_id,
  //   appURL: Runtime.getAppURL(),
  // })

  if (session.type === AuthSessionType.ConnectApp) {
    nextApp.render(req, res, '/connect', params as any)
  } else {
    nextApp.render(req, res, '/login', params as any)
  }
})

// verify session too
router.get(
  '/google',
  Client.serializeSession,
  /** Add verifier for PopupSessionType */
  Client.sessionAccessGuard,

  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.locals) return
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state: `${req.locals.session?.clientId}/${req.locals.session?.id}`,
    })(req, res, next)
  },
)

/** @todo. */
router.get('/verify_code', async (req: Request, res: Response) => {
  try {
    let { code, reqd } = req.params
    /** verify here by POST request to /oauth/challenge_native */
  } catch (error) {}
})

router.get(
  '/x',
  Client.serializeSession,
  Client.sessionAccessGuard,
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.locals) return
    const pt = pasportX.authenticate('twitter', {
      session: true,
      // state: "hi"
    })

    // console.log("---------------------------------");

    // console.log("Session In x before setting uniqueState :::: ", req.session);

    // console.log("---------------------------------");

    ;(req.session as any)['uniqueState'] =
      `${req.locals.session?.clientId}/${req.locals.session?.id}`

    // console.log("---------------------------------");

    // console.log("Session In x after setting uniqueState :::: ", req.session);

    // console.log("---------------------------------");

    // (req.session as any) = {}

    pt(req, res, next)
  },
)

router.post(
  '/oauth_user_get',
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    console.log('POST /oauth_user_get - Starting migration process')
    const { id } = req.body
    console.log('Request body:', { id })

    const user = await prisma.account.findUnique({
      where: {
        id: id,
      },
    });

    if(!user) {
      return res.status(400).json({
        message: 'User not found',
      });
    }

    let socialConnection = await prisma.socialConnection.findFirst({
      where: {
        accountId: user.id,
      },
    });

    const username = socialConnection?.providerUsername;

    return res.status(200).json({
      email: username,
      id: user.id,
      assignId: user.assignId,
      firstName: user.firstName,
      lastName: user.familyName,
    });
  },
)

router.post(
  '/native_migrate2',
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    console.log('POST /native_migrate - Starting migration process')
    const { firstName, familyName, epassword, picture, newsletter, email } =
      req.body
    console.log('Request body:', {
      firstName,
      familyName,
      email,
      newsletter,
      picture: !!picture,
    })

    let native_account = await prisma.nativeAccount.findFirst({
      where: {
        userName: email,
      },
    })

    if (native_account) {
      const socialConnection = await prisma.socialConnection.findFirst({
        where: {
          providerId: native_account.id,
        },
      })

      if (!socialConnection || !socialConnection.accountId) {
        return res.status(400).json({
          message: 'Social connection not found',
        })
      }

      const account = await prisma.account.findFirst({
        where: {
          id: socialConnection.accountId,
        },
      })

      if (!account) {
        return res.status(400).json({
          message: 'Account not found',
        })
      }

      let k = null

      try {
        k = JSON.stringify(account)
        console.log('Successfully serialized account')
      } catch (error) {
        console.error('Failed to serialize account:', error)
        console.log('kxweerr : ', error)
      }

      return res.status(200).json({
        exist: true,
        assignId: account.assignId,
        id: account.id,
        k: k,
      })
    }

    console.log('Creating new native account')
    native_account = await prisma.nativeAccount.create({
      data: {
        userName: email,
        password: `bk:${epassword}`,
        verified: true,
      },
    })
    console.log('Created native account:', { id: native_account.id, email })

    const assignId =
      (await AccountService.randomNameGenerator(8)) + '@loginsign.com'
    console.log('Generated assignId:', assignId)

    console.log('Creating new account')
    let account = await AccountService.createAccount({
      firstName: firstName || null,
      familyName: familyName || null,
      picture: picture || null,
      assignId: assignId,
      setted_up: true,
      connections: {
        create: {
          provider: 'Native',
          providerId: native_account.id,
          providerUsername: native_account['userName'] || '-1',
          lastUsed: getUnixMilliseconds(),
          connectedAt: getUnixMilliseconds(),
          token: {
            create: {
              accessToken: 'null',
              refreshToken: null,
              expireAt: getInfiniteExpiryMagic(),
              createdAt: getUnixMilliseconds(),
            },
          },
        },
      },
    })
    console.log('Created new account:', { accountId: account.id })

    let k = null

    try {
      k = JSON.stringify(account)
      console.log('Successfully serialized account')
    } catch (error) {
      console.error('Failed to serialize account:', error)
      console.log('kxweerr : ', error)
    }

    console.log('Migration completed successfully')
    return res.status(200).json({
      exist: true,
      assignId: assignId,
      id: account.id,
      k: k,
    })
  },
)

// router.post(
//   '/native_migrate',
//   async (req: ExtendedRequest, res: Response, next: NextFunction) => {
//     console.log('POST /native_migrate - Starting migration process');
//     const {firstName, familyName, epassword, picture, newsletter, email} = req.body;
//     console.log('Request body:', {firstName, familyName, email, newsletter, picture: !!picture});

//     let native_account = await prisma.nativeAccount.findFirst({
//       where: {
//         userName: email,
//       },
//     });
//     console.log('Checking if native account exists:', {exists: !!native_account});

//     if(native_account) {
//       console.log('Account already exists for email:', email);
//       /** ACCOUNT ALREADY EXIST CAN"T CREATE */

//       /** update it's password to bk:${epassword} */
//       // await prisma.nativeAccount.update({
//       //   where: {
//       //     id: native_account.id
//       //   },
//       //   data: {
//       //     password: `bk:${epassword}`
//       //   }
//       // });

//       /** update it's email to something else like bk_backup_ */
//       console.log('Updating email to bk_backup_email');
//       await prisma.nativeAccount.update({
//         where: {
//           id: native_account.id
//         },
//         data: {
//           userName: `bk_backup_email_${native_account.userName}`
//         }
//       });

//       const socialConnection = await prisma.socialConnection.findFirst({
//         where: {
//           providerId: native_account.id
//         }
//       });

//       if(!socialConnection) {
//         console.log('Social connection not found');
//         return res.status(400).json({
//           message: 'Social connection not found',
//         });
//       }

//       await prisma.socialConnection.update({
//         where: {
//           id: socialConnection.id
//         },
//         data: {
//           providerUsername: `bk_backup_email_${native_account.userName}`
//         }
//       });

//       console.log('Email updated to bk_backup_email, now continuing creation');
//       // return res.status(400).json({
//       //   message: 'Account already exists',
//       // });
//     }

//     console.log('Creating new native account');
//     native_account = await prisma.nativeAccount.create({
//       data: {
//         userName: email,
//         password: `bk:${epassword}`,
//         verified: true
//       }
//     });
//     console.log('Created native account:', {id: native_account.id, email});

//     const assignId = (await AccountService.randomNameGenerator(8)) + '@loginsign.com';
//     console.log('Generated assignId:', assignId);

//     console.log('Creating new account');
//     let account = await AccountService.createAccount({
//       firstName: firstName || null,
//       familyName: familyName || null,
//       picture: picture || null,
//       assignId: assignId,
//       setted_up: true,
//       connections: {
//         create: {
//           provider: "Native",
//           providerId: native_account.id,
//           providerUsername: native_account['userName'] || '-1',
//           lastUsed: getUnixMilliseconds(),
//           connectedAt: getUnixMilliseconds(),
//           token: {
//             create: {
//               accessToken: 'null',
//               refreshToken: null,
//               expireAt: getInfiniteExpiryMagic(),
//               createdAt: getUnixMilliseconds()
//             }
//           }
//         }
//       }
//     });
//     console.log('Created new account:', {accountId: account.id});

//     let k = null;

//     try {
//       k = JSON.stringify(account)
//       console.log('Successfully serialized account');
//     } catch (error) {
//       console.error("Failed to serialize account:", error);
//       console.log("kxweerr : " ,error)
//     }

//     console.log('Migration completed successfully');
//     return res.status(200).json({
//       assignId: assignId,
//       id: account.id,
//       k: k,
//     })
//   }
// )

router.get(
  '/native',
  Client.serializeSession,
  Client.sessionAccessGuard,
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.locals) return
    ;(req.session as any)['uniqueState'] =
      `${req.locals.session?.clientId}/${req.locals.session?.id}`

    const session_id = req.locals.session?.id as string

    const session = await ClientService.getSessionWithID(session_id)

    if (!session) {
      return res.status(400).json({
        message: 'session undefined',
      })
    }

    const client = session.client

    res.render('email_passwd', {
      logo: client?.logo || '',
      name: client?.name || '',
      color: client?.color || '',
      sessionId: session_id,
      sessionType: session.type,
      appURL: Runtime.getAppURL(),
    })
  },
)
router.post(
  '/native_user',
  Client.serializeSession,
  Client.sessionAccessGuard,
  async (req: Request, res: Response, next: NextFunction) => {
    let accountId = await AccountService.decodeLoginSignAuthToken(
      req.headers['authorization'] || '',
    )
    if (!accountId) {
      return res.status(401).json({})
    }
    let ac =
      await AccountService.getAccountWithIdAlsoSelectSocialConnectionId(
        accountId,
      )
    ;(req as any).local = {
      account: ac,
    }
    return next()
  },
  async (req: ExtendedRequest & { local?: any }, res: Response) => {
    const session = req.locals ? req.locals['session'] : null
    if (!session) {
      return res.status(500).json({})
    }

    let status = 500
    let data: any = null

    let account_result = await AccountService.loginAlreadyExist(
      session,
      req.local.account,
    )

    if (account_result.message === 'PASSWORD_AUTH_PASSED') {
      status = 200
      data = account_result.data // login tokens
    }

    console.log('ac ::: ', account_result)

    return res.status(status).json(data)
  },
)


router.post(
  '/native',
  Client.serializeSession,
  Client.sessionAccessGuard,
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    console.log("BEFORE PASSPORT :: ", req.body)
    const pt = passportNative.authenticate('local', {
      session: true,
    })
    console.log("AFTER PASSPORT")
    pt(req, res, next)
  },
  async (req: ExtendedRequest, res: Response) => {
    let status = 500
    let data: any = null

    let user = req.user as {
      email: string
      password: string
      login_cookie?: string
      challenge_type?: string
    }

    if(user &&
      user.email &&
      (
        user.email.indexOf('@loginsign.com')>=0 ||
        user.email.indexOf('@aid.com')>=0
      )){
      //replace loginsign generated email with user email
      let account = await prisma.account.findFirst({
        where:{
          assignId: user.email
        }
      })
      if(account){
        let account_id = account.id
        let sociel_connection = await prisma.socialConnection.findFirst({
          where: {
            accountId: account_id
          }
        })
        user.email=(sociel_connection as any).providerUsername
      }
    } else {
      user.email = user.email?.toLowerCase();
    }

    const session = req.locals ? req.locals['session'] : null

    const currentForm = req.body.currentForm

    if(currentForm === 'reset_password') {
      let account_result = await AccountService.resetPassword(
        {
          email: user.email,
          password: user.password,
          login_cookie: user.login_cookie || null,
        },
        session as ClientAuthSession,
        undefined, undefined,
        req.body.fromEmail,
        req.body.emailTemplate,
      );

      if (
        account_result.message === 'PASSWORD_AUTH_PASSED_AND_OTP_AUTH_REQUIRED'
      ) {
        status = 200
        data = account_result.data
      }
      else if(account_result.message === 'ACCOUNT_NOT_FOUND') {
        status = 404
        data = {
          message: 'Account not found',
        }
      }

      return res.status(status).json(data)
    }
    else if(currentForm === 'reset_password_after') {
      let {otp_code, request_id, new_password} = req.body;
      let account_result = await AccountService.verifyNativeAccount(
        {
          request_id: request_id,
          otp: otp_code,
        },
        session as ClientAuthSession,
      );

      if(account_result && account_result.data && account_result.message === 'PASSED') {
        let update_password_result = await AccountService.updatePassword(
          account_result.data.nativeAccountId,
          new_password
        );
        if(update_password_result.message === 'PASSWORD_UPDATED') {
          status = 200
          data = {
            message: 'PASSWORD_UPDATED_AND_LOGIN_SUCCESS',
            accessToken: account_result.data.accessToken,
            cookieToken: account_result.data.cookieToken
          }
        }
        else {
          status = 404
          data = {
            message: 'Account not found',
          }
        }
      }
      else
      {
        status = 404
        data = {
          message: 'Account not found',
        }
      }

      return res.status(status).json(data)
    } else if(currentForm === 'reset_password_from_app') {
      let {old_password, new_password} = req.body;
      let nativeAccountId = await AccountService.verifyPassword(
        {
          email: user.email,
          password: old_password,
        }
      );

      if(nativeAccountId) {
        let encrypted_passwd = await encryptPasscode(new_password)

        const update_password_result = await prisma.nativeAccount.update({
          where: { id: nativeAccountId },
          data: { password: encrypted_passwd },
        });

        status = 200
        data = {
          message: 'PASSWORD_UPDATED_SUCCESS'
        }
      } else {
        status = 404
        data = {
          message: 'Wrong password',
        }
      }

      return res.status(status).json(data)
    } else if(currentForm === 'change_email_from_app') {
      let {passwd, old_email, new_email} = req.body;

      if(old_email.indexOf('@loginsign.com')<0 && old_email.indexOf('@aid.com')<0){
        old_email = old_email?.toLowerCase();
      }
      if(new_email.indexOf('@loginsign.com')<0 && new_email.indexOf('@aid.com')<0){
        new_email = new_email?.toLowerCase();
      }

      let checkNewEmailExist:any = await prisma.account.findFirst({
        where:{
          assignId: new_email
        }
      })
      if(!checkNewEmailExist){
        checkNewEmailExist = await prisma.socialConnection.findFirst({
          where:{
            providerUsername: new_email
          }
        })
      }
      if(checkNewEmailExist){
        return res.status(400).json({message:"EMAIL_EXIST"});
      }

      let nativeAccountId = await AccountService.verifyPassword(
        {
          email: user.email,
          password: passwd,
        }
      );

      if(nativeAccountId) {
        const updateAccountResult = await prisma.nativeAccount.update({
          where:{
            userName: user.email,
          },
          data:{
            userName: new_email,
          }
        })
        let updateSocielConnectionResult = await prisma.socialConnection.updateMany({
          where: {
              providerUsername: user.email
            },
          data: {
            providerUsername: new_email,
          }
        })

        if(old_email.indexOf('@loginsign.com')>=0){
          let account = await prisma.account.findFirst({
            where:{
              assignId: user.email
            }
          })
          if(account){
            const updateAccountResult = await prisma.account.update({
              where:{
                assignId: user.email,
              },
              data:{
                assignId: new_email,
              }
            })
            let updateSocielConnectionResult = await prisma.socialConnection.updateMany({
              where: {
                  providerUsername: user.email
                },
              data: {
                providerUsername: new_email,
              }
            })
          }
        }

        status = 200
        data = {
          message: 'EMAIL_UPDATED_SUCCESS'
        }
      } else {
        status = 404
        data = {
          message: 'Wrong password',
        }
      }

      return res.status(status).json(data)
    }

    let account_result = await AccountService.createNativeAccount(
      {
        email: user.email,
        password: user.password,
        login_cookie: user.login_cookie || null,
      },
      session as ClientAuthSession,
      user.challenge_type,
      currentForm, // it will create new user ifn't exist, and login the user via signup.
    )

    if (account_result.message === 'PASSWORD_AUTH_PASSED') {
      status = 200
      data = account_result.data // login tokens
    }

    console.log('ac ::: ', account_result)

    if (account_result.message === 'PASSWORD_AUTH_FAIL') {
      status = 404
      data = {
        message: 'Wrong credentials.',
      }
    }

    if (account_result.message === 'ACCOUNT_NOT_FOUND') {
      status = 404
      data = {
        message: 'Wrong credentials.',
      }
    }

    if (account_result.message === 'EMAIL_ALREADY_EXIST') {
      status = 404
      data = {
        message: 'Email already exists.',
      }
    }

    if (
      account_result.message === 'PASSWORD_AUTH_PASSED_AND_OTP_AUTH_REQUIRED'
    ) {
      status = 201
      data = account_result.data
    }

    return res.status(status).json(data)
  },
)

router.post(
  '/get_native_user_email',
  Client.serializeSession,
  Client.sessionAccessGuard,
  async (req: Request, res: Response) => {
    try {
      if(!req.body.assignId){
        throw new Error('No assignId provided.');
      }
      const account = await prisma.account.findFirst({
        where: {
          assignId: req.body.assignId,
        }
      })
      if (account) {
        const account_id = account.id
        const sociel_connection = await prisma.socialConnection.findFirst({
          where: {
            accountId: account_id
          }
        })
        return res.status(200).json({ email: (sociel_connection as any).providerUsername });
      }
    }catch(err){}
    return res.status(404).json({});
  }
)

router.post(
  '/connect_native',
  Client.serializeSession,
  Client.sessionAccessGuard,
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const pt = passportNative.authenticate('local', {
      session: true,
    })
    pt(req, res, next)
  },
  async (req: ExtendedRequest, res: Response) => {
    let status = 500
    let data: any = null

    let user = req.user as {
      password: string
      login_cookie?: string
      challenge_type?: string
    }

    const session = req.locals ? req.locals['session'] : null

    const currentForm = req.body.currentForm

    let account_result = await AccountService.connectNativeAccount(
      {
        password: user.password,
        login_cookie: user.login_cookie || null,
      },
      session as ClientAuthSession,
      user.challenge_type,
      currentForm, // it will create new user ifn't exist, and login the user via signup.
    )

    if (!account_result) {
      return res.status(500).json({})
    }

    if (account_result.message === 'PASSWORD_AUTH_PASSED') {
      status = 200
      data = account_result.data // login tokens
    }

    console.log('ac ::: ', account_result)

    if (account_result.message === 'PASSWORD_AUTH_FAIL') {
      status = 404
      data = {
        message: 'Wrong credentials.',
      }
    }

    if (account_result.message === 'ACCOUNT_NOT_FOUND') {
      status = 404
      data = {
        message: 'Wrong credentials.',
      }
    }

    if (account_result.message === 'EMAIL_ALREADY_EXIST') {
      status = 404
      data = {
        message: 'Email already exists.',
      }
    }

    if (
      account_result.message === 'PASSWORD_AUTH_PASSED_AND_OTP_AUTH_REQUIRED'
    ) {
      status = 201
      data = account_result.data
    }

    return res.status(status).json(data)
  },
)

// router.get(
//   '/challenge_native_callback',
//   Client.serializeSession,
//   Client.sessionAccessGuard,
//   async (req: ExtendedRequest, res: Response) => {

//   }
// )

router.post(
  '/challenge_native',
  Client.serializeSession,
  Client.sessionAccessGuard,
  async (req: ExtendedRequest, res: Response) => {
    let { otp_code, request_id } = req.body

    const session_ = req.locals ? req.locals['session'] : null
    const session = await ClientService.getSessionWithID(
      (session_ as ClientAuthSession)?.id,
    )

    if (!session) {
      console.log('s ::: ', req.locals)
      return res.status(400).json({
        message: 'SESSION_FAILED',
      })
    }

    let result = await AccountService.verifyNativeAccount(
      {
        request_id: request_id,
        otp: otp_code,
      },
      session as ClientAuthSession,
    )

    if (result?.message === 'PASSED') {
      const params = {
        sessionSecret: session?.secret,
        sessionStatus: session?.status,
        accessToken: result.data?.accessToken,
        cookieToken: result.data?.cookieToken,
        logo: session.client.logo,
        name: session.client.name,
        sessionId: session.id,
        color: session.client.color,
        clientOrigins: session.client.origins,
      }

      // return res.status(200).redirect('/')

      // nextApp.render(req, res, '/redirect', params)

      return res.status(200).json(params)
    } else if (result?.message === 'FAILED') {
      return res.status(400).json(result.data)
    }

    return res.status(500).json({})
  },
)

/*
router.get(
  '/native',
  Client.serializeSession,
  Client.sessionAccessGuard,
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.locals) return
    const pt = passportNative.authenticate('local', {
      session: true
      // state: "hi"
    })

    // console.log("---------------------------------");

    // console.log("Session In x before setting uniqueState :::: ", req.session);

    // console.log("---------------------------------");

    ;(req.session as any)['uniqueState'] =
      `${req.locals.session?.clientId}/${req.locals.session?.id}`

    // console.log("---------------------------------");

    console.log("Session In x after setting uniqueState :::: ", req.session);

    // console.log("---------------------------------");

    // (req.session as any) = {}

    pt(req, res, next)
  },
)*/

router.get(
  '/facebook',
  Client.serializeSession,
  Client.sessionAccessGuard,
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.locals) return
    passportFb.authenticate('facebook', {
      state: `${req.locals.session?.clientId}/${req.locals.session?.id}`,
    })(req, res, next)
  },
)

router.get('/failed', (req: Request, res: Response) => {
  console.log(req)
  return res.status(200).json({})
})

router.get(
  '/x_callback',
  async (req: any, res: any, next: any) => {
    try {
      // console.log("---------------------------------");

      // console.log("x_callback 1st Query :::: ", req.query);

      // console.log("---------------------------------");

      const uniqueState = (req.session as any)['uniqueState']
      const sessionHelperVal1 = req.query['oauth_verifier']
      const sessionHelperVal2 = req.query['oauth_token']
      const client_session = (uniqueState || '/').split('/')

      // console.log("---------------------------------");

      // console.log("Session In x_callback :::: ", req.session);

      // console.log("---------------------------------");

      await AccountService.createSessionHelper(
        sessionHelperVal1,
        sessionHelperVal2,
        client_session[0],
        client_session[1],
      )

      try {
        const result = pasportX.authenticate('twitter', {
          session: true,
        })

        result(req, res, next)
      } catch (error) {
        console.log('---------------------------------')

        console.log('ERROR TRY_CATCH In x_callback :::: ', req.session)

        console.log('---------------------------------')
      }

      // await new Promise((resolve, reject) => {
      //   const result = passport.authenticate("twitter", {
      //     session: true,
      //   }, (err: any, user: any, info: any) => {
      //     if (err) {
      //       console.log("Error in passport.authenticate:", err);
      //       reject(err);
      //     }
      //     resolve({ user, info });
      //   });
      //   result(req, res, next);
      // });
    } catch (error) {
      console.log('ERROR err ::: ', error)
    }
  },
  async (req: Request & { user?: any }, res: Response) => {
    // console.log("---------------------------------");

    // console.log("x_callback 2nd Query :::: ", req.query);

    // console.log("---------------------------------");

    const sessionHelperVal1 = req.query['oauth_verifier']
    const sessionHelperVal2 = req.query['oauth_token']

    const data = await AccountService.getSessionHelper(
      `${sessionHelperVal1}`,
      `${sessionHelperVal2}`,
    )

    if (!data) {
      return
    }

    const st = [data.clientId, data.sessionId]

    const x_user = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email || '-1',
      accessToken: req.user.tokens.access_token,
      refreshToken: req.user.tokens.refresh_token,
      name: (req.user.profile.displayName || '').split(' ')[0],
      familyName: (req.user.profile.displayName || '').split(' ')[1],
      locale: '-1',
      picture: req.user.profile.url || '-1',
    }

    const session = await ClientService.getSessionWithID(st[1])

    if (!session) {
      return
    }

    if (session.type === AuthSessionType.PopupSession) {
      const accountToken = await AccountService.createXAccount(x_user, session)

      // return res.render('redirect_ui', {
      //   sessionSecret: session?.secret,
      //   sessionStatus: session?.status,
      //   accessToken: accountToken,
      //   logo: session.client.logo,
      //   name: session.client.name,
      //   sessionId: session.id,
      //   color: session.client.color,
      //   clientOrigins: session.client.origins,
      //   appURL: Runtime.getAppURL(),
      // })
      const params = {
        sessionSecret: session?.secret,
        sessionStatus: session?.status,
        accessToken: accountToken,
        logo: session.client.logo,
        name: session.client.name,
        sessionId: session.id,
        color: session.client.color,
        clientOrigins: session.client.origins,
      }

      nextApp.render(req, res, '/redirect', params)
    } else if (session.type === AuthSessionType.LinkSocialAccount) {
      const status = await AccountService.linkXAccount(x_user, session)

      return res.render('link_success', {
        status: status ? 'success' : 'failed',
      })
    }
  },
)

router.get(
  '/facebook_callback',
  passportFb.authenticate('facebook', {
    session: false,
    // successRedirect: "/",
    // failureRedirect: "/"
  }),
  async (req: Request & { user?: any }, res: Response) => {
    const state = req.query['state'] as string

    const st = state.split('/')

    const fb_user = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      accessToken: req.user.tokens.access_token,
      refreshToken: req.user.tokens.refresh_token,
      name: (req.user.profile.displayName || '').split(' ')[0],
      familyName: (req.user.profile.displayName || '').split(' ')[1],
      locale: '-1',
      picture: req.user.profile.url || '-1',
    }

    // console.log("fb user ::: ", fb_user);

    const session = await ClientService.getSessionWithID(st[1])

    if (!session) {
      return
    }

    if (session.type === AuthSessionType.PopupSession) {
      const accountToken = await AccountService.createFacebookAccount(
        fb_user,
        session,
      )

      // return res.render('redirect_ui', {
      //   sessionSecret: session?.secret,
      //   sessionStatus: session?.status,
      //   accessToken: accountToken,
      //   logo: session.client.logo,
      //   name: session.client.name,
      //   sessionId: session.id,
      //   color: session.client.color,
      //   clientOrigins: session.client.origins,
      //   appURL: Runtime.getAppURL(),
      // })
      const params = {
        sessionSecret: session?.secret,
        sessionStatus: session?.status,
        accessToken: accountToken,
        logo: session.client.logo,
        name: session.client.name,
        sessionId: session.id,
        color: session.client.color,
        clientOrigins: session.client.origins,
      }

      nextApp.render(req, res, '/redirect', params)
    } else if (session.type === AuthSessionType.LinkSocialAccount) {
      const status = await AccountService.linkFacebookAccount(fb_user, session)

      return res.render('link_success', {
        status: status ? 'success' : 'failed',
      })
    }
  },
)

router.get(
  '/google_callback',
  passport.authenticate('google', { session: false }),
  async (req: Request & { user?: any }, res: Response) => {
    const state = req.query['state'] as string

    const st = state.split('/')

    const google_user = {
      id: req.user.id,
      email: req.user.email,
      accessToken: req.user.tokens.access_token,
      refreshToken: req.user.tokens.refresh_token,
      name: req.user.profile.name.givenName,
      familyName: req.user.profile.name.familyName,
      locale: req.user.profile._json.locale,
      picture: req.user.profile._json.picture,
    }

    const session = await ClientService.getSessionWithID(st[1])

    if (!session) {
      return
    }

    // console.log("session :::::; ", session);

    if (session.type === AuthSessionType.PopupSession) {
      console.log('Here')
      const accountToken = await AccountService.createGoogleAccount(
        google_user,
        session,
      )

      // return res.render('redirect_ui', {
      //   sessionSecret: session?.secret,
      //   sessionStatus: session?.status,
      //   accessToken: accountToken,
      //   logo: session.client.logo,
      //   name: session.client.name,
      //   sessionId: session.id,
      //   color: session.client.color,
      //   clientOrigins: session.client.origins,
      // })

      const params = {
        sessionSecret: session?.secret,
        sessionStatus: session?.status,
        accessToken: accountToken,
        logo: session.client.logo,
        name: session.client.name,
        sessionId: session.id,
        color: session.client.color,
        clientOrigins: session.client.origins,
      }

      nextApp.render(req, res, '/redirect', params)
    } else if (session.type === AuthSessionType.LinkSocialAccount) {
      const status = await AccountService.linkGoogleAccount(
        google_user,
        session,
      )

      if (status.success) {
        return res.render('link_success', {
          status: 'success',
        })
      } else {
        return res.render('link_error', {
          error: status.error,
        })
      }
    }
  },
)

export default router
