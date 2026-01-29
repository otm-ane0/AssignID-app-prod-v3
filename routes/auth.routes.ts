import express, { NextFunction, Request, Response } from 'express'
import Client from '../middlewares/client'
import prisma from '../provider/prisma'
import AccountService from '../services/account'
import HttpError from '../utils/httpError'
import { ExtendedRequest } from '../utils/types'
import AssignSession from 'assign-login'
import { encryptPasscode, verifyPasscode } from '../utils/passwd'
import path from 'path'
import fs from 'fs'
import formidable, { errors as formidableErrors } from 'formidable'

const router = express.Router()

router.get('/', (_, res: Response) => {
  res.send('Ok')
})

router.delete(
  '/unlink',
  Client.serializeClient,
  Client.clientAccessGuard,
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.locals) {
        return
      }

      console.log('XXX Client passed')

      const access_token = req.headers['x-assign-token'] as string
      if (!access_token) {
        throw new HttpError(401, 'Access token not provided.')
      }

      // no need to put prefix
      const accountId = await AccountService.decodeJWTAuthToken(
        access_token,
        req.locals.client?.id || '',
      )

      console.log('Account passed')

      if (!accountId) {
        throw new HttpError(401, 'Invalid access token.')
      }

      const unlink_provider = req.query['provider']

      await AccountService.unlinkSocialAccount(
        accountId,
        `${unlink_provider?.toString().trim()}`,
      )

      return res.status(200).json({})
    } catch (error: HttpError | any) {
      console.warn(error)
      if (error.httpError) {
        return res.status(error.code).json({
          message: error.message,
        })
      }
      return res.status(500).json({
        message: 'Internal server error!',
      })
    }
  },
)

router.post('/get_accss_token', async (req: Request, res: Response) => {
  try {
    const { authcode, sessionId } = req.body
    const sessDoc = await prisma.clientAuthSession.findFirst({
      where: {
        id: sessionId,
      },
    })
    const client_ = await prisma.client.findFirst({
      where: {
        id: sessDoc?.clientId,
      },
    })
    if (!client_) {
      return res.status(400).json({})
    }
    let sc = await prisma.clientSecret.findFirst({
      where: {
        clientId: client_.id,
      },
    })
    let account = await AssignSession.resolveAuthcoded(
      {
        clientId: client_.id || '',
        clientSecret: sc?.token || '',
      },
      authcode,
    )
    // let account = await AssignSession.resolveAuthcoded({
    //   clientId: process.env["ASSIGN_CLIENT_ID"] || "",
    //   clientSecret: process.env["ASSIGN_CLIENT_SECRET"] || ""
    // }, authcode);
    console.log('account :: ', sc, account, sessionId)
    if (account) {
      let tk = await AccountService.generateLoginSignAccessToken(
        (account as any).id,
        sessionId,
      )
      return res.status(200).json({
        token: tk,
      })
    }
    return res.status(400).json({})
  } catch (error) {
    console
    return res.status(400).json({})
  }
})

router.get(
  '/ls_me',
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
    console.log('ACCCC :: ', ac)
    ;(req as any).local = {
      account: ac,
    }
    return next()
  },
  async (req: Request & { local?: any }, res: Response) => {
    return res.status(200).json({
      success: true,
      account: req.local.account,
    })
  },
)

router.delete(
  '/ls_picture',
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
  async (req: Request & { local?: any }, res: Response, next: NextFunction) => {
    await prisma.account.update({
      where: { id: req.local?.account.id },
      data: {
        picture: null,
      },
    })

    return res.status(200).json({
      success: true,
      // filePath: filePath, // You can return the file path or any other info
    })
  },
)

router.get(
  '/fetch_emails',
  Client.serializeClient,
  Client.clientAccessGuard,
  async (req: Request, res: Response, next: NextFunction) => {
    let {assignId} = req.body;
    let real_emails = ['s@mail.com'];
    return res.status(200).json({
      emails: real_emails
    });
  }
)

router.put(
  '/ls_picture',
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
  async (req: Request & { local?: any }, res: Response, next: NextFunction) => {
    // Setup formidable to handle file uploads
    const uploadDir = path.join(__dirname, '..', 'uploads')

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const form = formidable({
      multiples: false, // Set to true if you want to allow multiple files
      uploadDir: uploadDir, // The directory to save uploaded files
      keepExtensions: true, // Keep file extensions
      // maxFileSize: 50 * 1024 * 1024, // Set file size limit (5MB)
    })

    const accountId = req.local?.account?.id

    // Parse the incoming request containing the form-data
    form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) {
        console.error('Formidable error:', err)
        return res
          .status(500)
          .json({ success: false, message: 'Error processing file upload.' })
      }

      console.log('FF :: ', files)

      const uploadedFile = files.file as File

      // If no file is uploaded
      if (!uploadedFile) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded.',
        })
      }

      console.log('U :: ', (uploadedFile as any)[0].filepath)

      // The file has been saved in the uploads directory automatically by formidable
      const filePath = path.join(
        'uploads',
        path.basename((uploadedFile as any)[0].filepath),
      ) // Path of the uploaded file

      await prisma.account.update({
        where: { id: accountId },
        data: {
          picture: (uploadedFile as any)[0].newFilename,
        },
      })

      return res.status(200).json({
        success: true,
        message: 'File uploaded successfully!',
        // filePath: filePath, // You can return the file path or any other info
      })
    })
  },
)

router.delete(
  '/ls_me',
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
  async (req: Request & { local?: any }, res: Response) => {},
)

router.put(
  '/ls_me',
  (req: Request, res: Response, next: NextFunction) => {
      console.log("XYIZ")
      next();
  },
  async (req: Request, res: Response, next: NextFunction) => {
    let accountId = await AccountService.decodeLoginSignAuthToken(
      req.headers['authorization'] || '',
    )
    console.log("Account Id :: ", accountId)

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
  async (req: Request & { local?: any }, res: Response) => {
    const {
      name,
      email,
      password,
      new_password,
      newsletter,
      delete_account,
      setted_up,
      name_w,
    } = req.body
    const accountId = req.local?.account?.id
    const connectionId = req.local?.account?.connections?.[0]?.id

    try {
      let native_account = await prisma.nativeAccount.findUnique({
        where: {
          userName: req.local?.account?.connections?.[0]?.providerUsername,
        },
      })

      console.log('N :: ', native_account, connectionId)

      if (!native_account) {
        return res.status(400).json({})
      }

      let compare_result = await verifyPasscode(
        password || '',
        native_account.password,
      )

      // Ensure accountId and connectionId exist before proceeding
      if (!accountId || !connectionId) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid account information.' })
      }

      if (newsletter !== undefined) {
        await prisma.account.update({
          where: {
            id: accountId,
          },
          data: {
            newsletter: newsletter,
          },
        })
      }

      if (setted_up !== undefined) {
        await prisma.account.update({
          where: {
            id: accountId,
          },
          data: {
            setted_up: setted_up,
          },
        })
      }

      if (delete_account) {
        if (compare_result) {
          return res.status(200).json({})
        }
        return res.status(400).json({
          error: {
            field: 'pwd',
            message: "Password didn't match.",
          },
        })
      }

      try {
        // Prepare data for the account update
        const accountUpdateData: any = {}

        if (name_w) {
          const [firstNameX, ...lastNamePartsX] = name_w.split(' ')
          accountUpdateData.firstName = firstNameX || ''
          accountUpdateData.familyName = lastNamePartsX.join(' ') || ''
        }

        if (name) {
          // if(compare_result) {
          const [firstName, ...lastNameParts] = name.split(' ')
          accountUpdateData.firstName = firstName || ''
          accountUpdateData.familyName = lastNameParts.join(' ') || ''
          // }
          // else
          // {
          //   return res.status(400).json({
          //     error: {
          //       field: "pwd",
          //       message: "Password didn't match."
          //     }
          //   });
          // }
        }

        // Update account if there's data to update
        if (Object.keys(accountUpdateData).length > 0) {
          await prisma.account.update({
            where: { id: accountId },
            data: accountUpdateData,
          })
        }

        // Prepare data for nativeAccount update
        const nativeAccountUpdateData: any = {}

        if (new_password) {
          // if(compare_result) {
          const encryptedPassword = await encryptPasscode(new_password)
          nativeAccountUpdateData.password = encryptedPassword
          // }
          // else
          // {
          //   return res.status(400).json({
          //     error: {
          //       field: "pwd",
          //       message: "Password didn't match."
          //     }
          //   });
          // }
        }

        if (email) {
          // if (compare_result) {
          let is_email_already_exist = await prisma.nativeAccount.findFirst({
            where: {
              userName: email,
            },
          })
          if (is_email_already_exist) {
            return res.status(400).json({
              error: {
                field: 'nemail',
                message: 'Email already in use.',
              },
            })
          } else {
            nativeAccountUpdateData.userName = email
            await prisma.socialConnection.update({
              where: {
                id: connectionId,
              },
              data: {
                providerUsername: email,
              },
            })
          }
          // } else {
          //   return res.status(400).json({
          //     error: {
          //       field: 'pwd',
          //       message: "Password didn't match.",
          //     },
          //   })
          // }
        }

        console.log('X :: ', connectionId)
        // Update nativeAccount if there's data to update
        if (Object.keys(nativeAccountUpdateData).length > 0) {
          await prisma.nativeAccount.update({
            where: { id: native_account.id },
            data: nativeAccountUpdateData,
          })
        }

        // Return success response
        return res.status(200).json({
          success: true,
          account: req.local.account,
        })
      } catch (error) {
        console.error('Error updating account:', error)
        return res.status(500).json({
          success: false,
          message: 'Error updating account information.',
        })
      }
    } catch (error) {
      console.log('error :: ', error)
      return res.status(400).json({})
    }
  },
)

router.get(
  '/me',
  Client.serializeClient,
  Client.clientAccessGuard,
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.locals) {
        return
      }

      console.log('XXX Client passed')

      const access_token = req.headers['x-assign-token'] as string
      if (!access_token) {
        throw new HttpError(401, 'Access token not provided.')
      }

      // no need to put prefix
      const accountId = await AccountService.decodeJWTAuthToken(
        access_token,
        req.locals.client?.id || '',
      )

      console.log('Account passed')

      if (!accountId) {
        throw new HttpError(401, 'Invalid access token.')
      }

      const account = await AccountService.getAccountWithId(accountId)

      return res.status(200).json({
        account: {
          ...account,
          picture: account?.picture
            ? `${process.env['APP_URI']}/p/${account?.picture}`
            : null,
        },
      })
    } catch (error: HttpError | any) {
      console.warn(error)
      if (error.httpError) {
        return res.status(error.code).json({
          message: error.message,
        })
      }
      return res.status(500).json({
        message: 'Internal server error!',
      })
    }
  },
)

export default router
