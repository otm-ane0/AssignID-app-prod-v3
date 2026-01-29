import { AuthSessionType } from '@prisma/client'
import express, { NextFunction, Request, Response } from 'express'
import Client from '../middlewares/client'
import prisma from '../provider/prisma'
import { Runtime } from '../runtime'
import ClientService from '../services/client'
import HttpError from '../utils/httpError'
import { ExtendedRequest } from '../utils/types'
import AccountService from '../services/account'

const router = express.Router()

router.get('/status', (_, res: Response) => {
  res.send('Ok')
})

/**
 * Create client app
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, logo, color } = req.query

    const client = await ClientService.createClient({
      name: `${name}`,
      logo: `${logo}`,
      color: `${color}`,
    })

    const secret = await ClientService.getNewSecretKey(client.id)

    return res.status(201).json({
      client: client,
      secret: secret,
    })
  } catch (error: HttpError | any) {
    if (error.httpError) {
      return res.status(error.code).json({
        message: error.message,
      })
    }
    console.warn(error)
    return res.status(500).json({
      message: 'Internal server error!',
    })
  }
})

// router.get(
//   "/session",
//   Client.serializeClientWithoutSecret,
//   Client.clientAccessGuard,
//   async (req: ExtendedRequest, res: Response) => {
//     try {
//       if (!req.locals?.client) return;
//       let { sess_id } = req.query;
//       let session = await ClientService.getSessionWithIDAndClient(
//         `${sess_id}`,
//         req.locals.client.id
//       );

//       if (session) {
//         let accessToken = null;

//         if (session.status === "Success" && session.accountId) {
//           let accessTk = await prisma.accountAccessToken.findFirst({
//             where: {
//               clientAuthSessionId: session.id,
//               isRevoked: false,
//             },
//           });
//           accessToken = accessTk?.accessToken;
//         }

//         return res.status(200).json({
//           session: session,
//           access_token: accessToken,
//         });
//       } else {
//         return res.status(404).json({});
//       }
//     } catch (error: HttpError | any) {
//       if (error.httpError) {
//         return res.status(error.code).json({
//           message: error.message,
//         });
//       }
//       console.warn(error);
//       return res.status(500).json({
//         message: "Internal server error!",
//       });
//     }
//   }
// );

/**
 * Get session info
 */

router.get(
  '/session',
  Client.serializeClientWithoutSecret,
  Client.clientAccessGuard,
  async (req: ExtendedRequest, res: Response) => {
    try {
      if (!req.locals?.client) return

      const { sess_id } = req.query

      const session = await ClientService.getSessionWithIDAndClient(
        `${sess_id}`,
        req.locals.client.id,
      )

      if (session) {
        let accessToken = null

        const notes_client_id = 'f957dfb5-8b82-4eb4-a448-c2c281e8eabd'
        const shortkey_client_id = '6a9770de-f03d-4e2b-ba97-0881db1b62b2'
        let conencted_access_tok = null


        if (session.status === 'Success' && session.accountId) {
          const accessTk = await prisma.accountAccessToken.findFirst({
            where: {
              clientAuthSessionId: session.id,
              isRevoked: false,
            },
          })
          accessToken = accessTk?.accessToken

          if (session.clientId === shortkey_client_id) {
            /** Connect it. */
            /** @TODO get this notes_client_id and shortkey_clinet_id from request itself. */
            let connected_client =
              await ClientService.getClientWithId(notes_client_id)
            if (connected_client) {
              let connected_client_secret = await prisma.clientSecret.findFirst(
                {
                  where: {
                    clientId: connected_client.id,
                  },
                },
              )
              if (connected_client_secret) {
                let already_exist = await prisma.accountAccessToken.findFirst({
                  where: {
                    clientAuthSessionId: session.id,
                    sourceApp: session.clientId,
                    connectedApp: connected_client.id,
                    isRevoked: false,
                  },
                })

                if (already_exist) {
                  conencted_access_tok = already_exist.accessToken
                }
              }
            }
          }
        }

        return res.status(200).json({
          // session: session,
          // access_token: accessToken,
          access_token: accessToken + (conencted_access_tok !== null ? `|${conencted_access_tok}` : ""),
          connectedCode: conencted_access_tok
        })
      } else {
        return res.status(404).json({})
      }
    } catch (error: HttpError | any) {
      if (error.httpError) {
        return res.status(error.code).json({
          message: error.message,
        })
      }
      console.warn(error)
      return res.status(500).json({
        message: 'Internal server error!',
      })
    }
  },
)

/** Don't give access token here */
// router.get(
//   "/session",
//   Client.serializeClient,
//   Client.clientAccessGuard,
//   async (req: ExtendedRequest, res: Response) => {
//     try {
//       if (!req.locals?.client) return;

//       let { sess_id } = req.query;

//       let session = await ClientService.getSessionWithIDAndClient(
//         `${sess_id}`,
//         req.locals.client.id
//       );

//       if (session) {
//         let accessToken = null;

//         if (session.status === "Success" && session.accountId) {
//           let accessTk = await prisma.accountAccessToken.findFirst({
//             where: {
//               clientAuthSessionId: session.id,
//               isRevoked: false,
//             },
//           });
//           accessToken = accessTk?.accessToken;
//         }

//         return res.status(200).json({
//           session: session,
//           access_token: accessToken,
//         });
//       } else {
//         return res.status(404).json({});
//       }
//     } catch (error: HttpError | any) {
//       if (error.httpError) {
//         return res.status(error.code).json({
//           message: error.message,
//         });
//       }
//       console.warn(error);
//       return res.status(500).json({
//         message: "Internal server error!",
//       });
//     }
//   }
// );

/** OAuth Popup flow start */

/**
 * /// Unlink by verifying in assign by user later
 * Session to link/unlink account
 */

router.post(
  '/signed-session',
  Client.serializeClient,
  Client.clientAccessGuard,
  async (req: ExtendedRequest, res: Response) => {
    try {
      if (!req.locals) {
        return
      }
      if (!req.locals?.client) return

      const sessType =
        (req.query['sess_type'] as string as AuthSessionType) || undefined

      if (!sessType) {
        throw new HttpError(400, 'sess_type is required.')
      }

      if (sessType === AuthSessionType.PopupSession) {
        throw new HttpError(400, 'unsupported sess_type.')
      }

      const access_token = req.headers['x-assign-token'] as string
      if (!access_token) {
        throw new HttpError(401, 'Access token not provided.')
      }

      // no need to put prefix
      const accountId = await AccountService.decodeJWTAuthToken(
        access_token,
        req.locals.client?.id || '',
      )
      if (!accountId) {
        throw new HttpError(401, 'Invalid access token.')
      }

      const account = await AccountService.getAccountWithId(accountId)

      if (!account) {
        throw new HttpError(401, 'Something went wrong.')
      }

      /** create session for this also include account id. */
      const session = await ClientService.getNewSession(
        req.locals?.client,
        sessType,
        null,
        null,
        req.body['extra'] || JSON.stringify({}),
        accountId,
      )

      return res.status(200).json({
        session: {
          id: session.id,
          type: session.type,
          status: session.status,
          url: `${Runtime.getAppURL()}/oauth/login?sess_id=${session.id}&type=${
            session.type
          }`,
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

/**
 * Create a session to get access to a user account
 */

router.post(
  '/session',
  // Client.serializeClient,
  Client.serializeClientWithoutSecret,
  Client.clientAccessGuard,
  async (req: ExtendedRequest, res: Response) => {
    try {
      if (!req.locals?.client) return

      const sessType =
        (req.query['sess_type'] as string as AuthSessionType) || undefined

      if (!sessType) {
        throw new HttpError(400, 'sess_type is required.')
      }

      if (
        sessType === AuthSessionType.LinkSocialAccount ||
        sessType === AuthSessionType.UnlinkSocialAccount
      ) {
        throw new HttpError(400, 'unsupported sess_type.')
      }

      /** for
       * sessType === LinkAccount, provide user accessToken (assignAccessToken - fetch from server)
       */

      console.log('ACCOUNT ID :: ', req.body)

      const session = await ClientService.getNewSession(
        req.locals?.client,
        sessType,
        sessType === AuthSessionType.ConnectApp ? req.body.connection : null,
        sessType === AuthSessionType.ConnectApp ? req.body.accountId : null,
        req.body['extra'] || JSON.stringify({}),
      )

      return res.status(200).json({
        session: {
          id: session.id,
          type: session.type,
          status: session.status,
          url: `${Runtime.getAppURL()}/oauth/login?sess_id=${session.id}&type=${
            session.type
          }`,
        },
      })
    } catch (error: HttpError | any) {
      if (error.httpError) {
        return res.status(400).json({
          message: error.message,
        })
      }
      console.warn(error)
      return res.status(500).json({
        message: 'Internal server error!',
      })
    }
  },
)

/**
 * 3rd party are not allowed to access these routes: "/signin"
 */

export default router
