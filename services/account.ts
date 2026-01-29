import {
  Account,
  ClientAuthSession,
  Prisma,
  SocialProvider,
  Client as ClientModel,
} from '@prisma/client'
import prisma from '../provider/prisma'
import { signJwt, signJwtForApp, verifyJwt } from '../utils/jwt'
import { getInfiniteExpiryMagic, getUnixMilliseconds } from '../utils/token'
import ClientService from './client'
import HttpError from '../utils/httpError'
import { encryptPasscode, verifyPasscode } from '../utils/passwd'
import { sendVerificationEmail } from '../helpers/email_sender'

export default class AccountService {
  static async randomNameGenerator(length: number) {
    let result = ''
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    /**
     * Generate two words from wordlist.txt and merge them while generating the name
     */
    return result
  }

  static async randomNumberGenerator(length: number) {
    let result = ''
    const characters = '0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    /**
     * Generate two words from wordlist.txt and merge them while generating the name
     */
    return result
  }

  static async createAccount(input: Prisma.AccountCreateInput) {
    return await prisma.account.create({
      data: input,
    })
  }

  static async updateAccount(id: string, data: any) {
    return await prisma.account.update({
      where: {
        id: id,
      },
      data: data,
    })
  }

  static async generateAssignId() {
    const random = 0
  }

  static async generateJWTAuthToken(accountId: string, secret: string) {
    return signJwt(
      {
        accountId: accountId,
      },
      secret,
      'accessTokenPrivateKey',
      {},
    )
  }

  static async generateJWTAuthTokenForLoginSign(
    accountId: string,
    sessionId: string,
    secret: string,
  ) {
    return signJwt(
      {
        accountId: accountId,
        sessionId: sessionId,
      },
      secret,
      'accessTokenPrivateKey',
      {},
    )
  }

  /** secret is toApp:clientsecret */
  static async generateJWTAppToken(
    accountId: string,
    fromAppId: string,
    toAppId: string,
    secret: string,
  ) {
    return signJwtForApp(
      {
        accountId: accountId,
        appId: fromAppId,
        connectedAppId: toAppId,
      },
      secret,
      {},
    )
  }

  static async getAuthTokenForAccount(
    accountId: string,
    secret: string,
    sessionId: string,
  ) {
    const tk = await this.generateJWTAuthToken(accountId, secret)
    return `${tk}/${sessionId}`
  }

  static async getAppTokenForAccount(
    accountId: string,
    appId: string,
    connectedAppSecret: string,
    connectedAppId: string,
    sessionId: string,
  ) {
    const tk = await this.generateJWTAppToken(
      accountId,
      appId,
      connectedAppId,
      connectedAppSecret,
    )
    return `${tk}/${sessionId}`
  }

  static async generateLoginSignAccessToken(
    accountId: string,
    sessionId: string,
  ) {
    const tk = await this.generateJWTAuthTokenForLoginSign(
      accountId,
      sessionId,
      process.env['JWT_SUPER_PRIVATE_KEY'] || '',
    )
    // return `${tk}/${sessionId}`;
    return `${tk}`
  }

  static async decodeLoginSignAuthToken(accessToken: string) {
    try {
      const acTkS = accessToken.split('/')
    const realAccessToken = acTkS[0]
    const sessId = acTkS[1]
    console.log("Session ID :: ", sessId, realAccessToken, acTkS)
    const v = verifyJwt(
      realAccessToken,
      process.env['JWT_SUPER_PRIVATE_KEY'] || '',
      'accessTokenPublicKey',
    ) as {
      accountId: string
    }
    return v.accountId
    } catch (error) {
      console.log("error :: ", error);
      return null;
    }
  }

  static async decodeJWTAuthToken(accessToken: string, clientId: string) {
    const acTkS = accessToken.split('/')
    const realAccessToken = acTkS[0]
    const sessId = acTkS[1]
    const sess = await ClientService.getSessionWithIDAndClient(sessId, clientId)
    if (!sess) {
      return false
    }
    const v = verifyJwt(
      realAccessToken,
      sess.secret,
      'accessTokenPublicKey',
    ) as {
      accountId: string
    }
    // success account id doesn't match with the token one.
    if (sess.accountId !== v.accountId) {
      return false
    }
    return v.accountId
  }

  static async getAccountWithId(id: string) {
    const assignAccount = await prisma.account.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        assignId: true,
        firstName: true,
        familyName: true,
        picture: true,
        connections: {
          select: {
            provider: true,
            providerId: false,
            providerUsername: true,
          },
        },
      },
    })
    console.log('Account ::: ', assignAccount)
    return assignAccount
  }

  static async getAccountWithIdAlsoSelectSocialConnectionId(id: string) {
    const assignAccount = await prisma.account.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        assignId: true,
        firstName: true,
        familyName: true,
        picture: true,
        setted_up: true,
        newsletter: true,
        connections: {
          select: {
            id: true,
            provider: true,
            providerId: false,
            providerUsername: true,
          },
        },
      },
    })
    console.log('Account ::: ', assignAccount)
    return assignAccount
  }

  static async completeSession(id: string, accountId: string) {
    return await prisma.clientAuthSession.update({
      where: {
        id: id,
      },
      data: {
        status: 'Success',
        accountId: accountId,
        updatedAt: getUnixMilliseconds(),
      },
    })
  }

  static async createXAccount(x_user: any, session: ClientAuthSession) {
    let account = await prisma.account.findFirst({
      where: {
        // email: google_user.email,
        connections: {
          some: {
            providerId: x_user.id,
            provider: SocialProvider.Twitter,
          },
        },
      },
    })

    if (!account) {
      const assignId = (await this.randomNameGenerator(11)) + '@aid.com'

      account = await this.createAccount({
        firstName: x_user['name'],
        familyName: x_user['familyName'],
        // email: google_user['email'],
        picture: x_user['picture'], // clone the picture
        assignId: assignId,
        connections: {
          create: {
            provider: SocialProvider.Twitter,
            providerId: x_user.id,
            providerUsername: x_user['email'] || '-1',
            lastUsed: getUnixMilliseconds(),
            connectedAt: getUnixMilliseconds(),
            token: {
              create: {
                accessToken: x_user.accessToken,
                refreshToken: x_user.refreshToken,
                expireAt: getInfiniteExpiryMagic(),
                createdAt: getUnixMilliseconds(),
              },
            },
          },
        },
      })
    }

    const acTk = await this.getAuthTokenForAccount(
      account.id,
      session.secret,
      session.id,
    )

    const accessTk = await prisma.accountAccessToken.create({
      data: {
        clientAuthSessionId: session.id,
        createdAt: getUnixMilliseconds(),
        expireAt: getInfiniteExpiryMagic(),
        isRevoked: false,
        accessToken: acTk,
      },
    })

    await this.completeSession(session.id, account.id)

    return accessTk.accessToken
  }

  static async generateEmailOtpChallenge(user_id: string, user_email: string, fromEmail?:string, resetPasswordEmailTemplate?: string) {
    let code = await this.randomNumberGenerator(6)
    let challenge = await prisma.accountChallenge.create({
      data: {
        nativeAccountId: user_id,
        otpCode: code,
      },
    })
    await sendVerificationEmail(user_email, challenge.id, code, fromEmail, resetPasswordEmailTemplate)
    return challenge.id
  }

  static async connectNativeAccount(
    native_user: any,
    session: ClientAuthSession,
    challenge_type?: string,
    formMode?: string,
  ) {
    if (!session.connectedAccountId || !session.connectedClientId) {
      return
    }
    console.log('challenge type ;; ', challenge_type)
    if (challenge_type !== 'email') {
      let account = await prisma.account.findFirst({
        where: {
          id: session.connectedAccountId,
          connections: {
            some: {
              provider: 'Native',
            },
          },
        },
        include: {
          connections: true,
        },
      })
      if (!account) {
        console.log('no account found.')
        return
      }
      let native_conn_id = null
      account.connections.map((conn) => {
        if (conn.provider === 'Native') {
          native_conn_id = conn.providerId
        }
      })
      if (!native_conn_id) {
        console.log('no native account id found.')
        return
      }
      let native_account = await prisma.nativeAccount.findFirst({
        where: {
          id: native_conn_id,
        },
      })
      if (!native_account) {
        console.log('no native account found.')
        return
      }
      if (!native_account.verified) {
        console.log('native account not verified.')
        return
      }
      /** MAtch password now */
      let encrypted_passwd = await encryptPasscode(native_user.password)
      let compare_result = await verifyPasscode(
        native_user.password,
        native_account.password,
      )
      if (compare_result) {
        let connected_client = await ClientService.getClientWithId(
          session.connectedClientId,
        )

        if (!connected_client) {
          console.log('client not found.')
          return
        }

        /** sort to latest clientsecret */
        let connected_client_secret = await prisma.clientSecret.findFirst({
          where: {
            clientId: connected_client.id,
          },
        })

        if (!connected_client_secret) {
          console.log('client secret not found.')
          return
        }

        const acTk = await this.getAppTokenForAccount(
          account.id,
          session.clientId,
          connected_client_secret.token,
          connected_client.id,
          session.id,
        )

        const accessTk = await prisma.accountAccessToken.create({
          data: {
            clientAuthSessionId: session.id,
            sourceApp: session.clientId,
            // accountId: account.id,
            connectedApp: connected_client.id,
            createdAt: getUnixMilliseconds(),
            expireAt: getInfiniteExpiryMagic(),
            isRevoked: false,
            accessToken: acTk,
          },
        })

        await this.completeSession(session.id, account.id)

        // new cookie token
        // let ctoken = await this.randomNameGenerator(20)
        // let easy_auth_cookie =
        //   await prisma.nativeAccountAuthCookie.create({
        //     data: {
        //       cookieToken: ctoken,
        //       nativeAccountId: native_account.id,
        //     },
        //   })

        return {
          message: 'PASSWORD_AUTH_PASSED',
          data: {
            accessToken: accessTk.accessToken,
          },
        }
      }
    }
  }

  static async loginAlreadyExist(session: ClientAuthSession, account: Account) {
    const acTk = await AccountService.getAuthTokenForAccount(
      account.id,
      session.secret,
      session.id,
    )
    const accessTk = await prisma.accountAccessToken.create({
      data: {
        clientAuthSessionId: session.id,
        createdAt: getUnixMilliseconds(),
        expireAt: getInfiniteExpiryMagic(),
        isRevoked: false,
        accessToken: acTk,
      },
    })
    await AccountService.completeSession(session.id, account.id)

    /** @TODO Connect it here ---> shortkey with notes. */
    const notes_client_id = 'f957dfb5-8b82-4eb4-a448-c2c281e8eabd'
    const shortkey_client_id = '6a9770de-f03d-4e2b-ba97-0881db1b62b2'
    let conencted_access_tok = null

    if (session.clientId === shortkey_client_id) {
      /** Connect it. */
      /** @TODO get this notes_client_id and shortkey_clinet_id from request itself. */
      let connected_client = await ClientService.getClientWithId(
        notes_client_id,
      )

      if (connected_client) {
        let connected_client_secret = await prisma.clientSecret.findFirst({
          where: {
            clientId: connected_client.id,
          },
        })
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
          } else {
            const acTkx = await this.getAppTokenForAccount(
              account.id,
              session.clientId,
              connected_client_secret.token,
              connected_client.id,
              session.id,
            )

            const connectedAccessTk = await prisma.accountAccessToken.create({
              data: {
                clientAuthSessionId: session.id,
                sourceApp: session.clientId,
                connectedApp: connected_client.id,
                createdAt: getUnixMilliseconds(),
                expireAt: getInfiniteExpiryMagic(),
                isRevoked: false,
                accessToken: acTkx,
              },
            })

            conencted_access_tok = acTkx
          }
        }
      }
    }

    await this.completeSession(session.id, account.id)

    return {
      message: 'PASSWORD_AUTH_PASSED',
      data: {
        cookieToken: null,
        // accessToken: accessTk.accessToken,
        accessToken:
          acTk +
          (conencted_access_tok !== null ? `|${conencted_access_tok}` : ''),
        /** @TODO send the app info too (connected) ---- for now it will be null for other app than shortkey. */
        connectedAccessToken: conencted_access_tok,
      },
    }
  }

  static async verifyPassword(user: { email: string, password: string }) {
    let native_account = await prisma.nativeAccount.findFirst({
      where: {
        userName: user.email,
      },
    })
    if(!native_account) {
      return null;
    }
    let passcodeCorrect = await verifyPasscode(
      user.password,
      native_account.password,
    )
    if(!passcodeCorrect) {
      return null;
    }

    return native_account.id;
  }

  static async resetPassword(
    native_user: any,
    session: ClientAuthSession,
    challenge_type?: string,
    formMode?: string,
    fromEmail?: string,
    resetPasswordEmailTemplate?: string,
  ) {
    let native_account = await prisma.nativeAccount.findFirst({
      where: {
        userName: native_user.email,
      },
    });

    if(native_account) {
      let otp_auth_id = await this.generateEmailOtpChallenge(
        native_account.id,
        native_account.userName,
        fromEmail,
        resetPasswordEmailTemplate,
      )
      return {
        message: 'PASSWORD_AUTH_PASSED_AND_OTP_AUTH_REQUIRED',
        data: {
          request_id: otp_auth_id,
        },
      }
    }
    else
    {
      return {
        message: 'ACCOUNT_NOT_FOUND',
      }
    }
  }

  static async createNativeAccount(
    native_user: any,
    session: ClientAuthSession,
    challenge_type?: string,
    formMode?: string,
  ) {
    // let account = await prisma.account.findFirst({
    //   where: {
    //     connections: {
    //       some: {
    //         providerUsername: native_user.email,
    //         provider: 'Native',
    //       },
    //     },
    //   },
    // })

    console.log('challenge typeXX ;; ', challenge_type)

    if (challenge_type !== 'email') {
      let native_account = await prisma.nativeAccount.findFirst({
        where: {
          userName: native_user.email,
        },
      })

      let encrypted_passwd = await encryptPasscode(native_user.password)

      if (native_account) {
        if (formMode === 'signup') {
          return {
            message: 'EMAIL_ALREADY_EXIST',
            data: {},
          }
        }

        if (native_account.verified) {
          /** compare the password */
          let compare_result = await verifyPasscode(
            native_user.password,
            native_account.password,
          )
          if (compare_result) {
            let cookie_found_and_valid = true
            /** DISABLE EASY-AUTH AND ALLOW IT FOR ALL (AND DEFAULT WIHTOUT OTP) */
            /** check if access token is sent, check if it present in db else send a email verification request */
            // let login_cookie = native_user.login_cookie

            // let cookie_found_and_valid = false
            // /** @todo generate access tokens */

            // let ctk = null

            // if (login_cookie) {
            //   ctk = await prisma.nativeAccountAuthCookie.findFirst({
            //     where: {
            //       cookieToken: login_cookie,
            //     },
            //   })
            // }

            // if (ctk && ctk.nativeAccountId === native_account.id) {
            //   cookie_found_and_valid = true
            // }
            /** END OF DISABLE EASY-AUTH AND ALLOW IT FOR ALL (AND DEFAULT WIHTOUT OTP) */

            if (cookie_found_and_valid) {
              let account = await prisma.account.findFirst({
                where: {
                  connections: {
                    some: {
                      providerId: native_account.id,
                      provider: 'Native',
                    },
                  },
                },
              })

              console.log('ACCOUNT :: ', native_account, account)

              if (!account) {
                return {
                  message: 'ACCOUNT_NOT_FOUND',
                }
              }

              /** DISABLE EASY-AUTH AND ALLOW IT FOR ALL (AND DEFAULT WIHTOUT OTP) */
              /** delete used cookie */
              // await prisma.nativeAccountAuthCookie.delete({
              //   where: {
              //     id: ctk?.id,
              //   },
              // })
              /** END OF DISABLE EASY-AUTH AND ALLOW IT FOR ALL (AND DEFAULT WIHTOUT OTP) */

              const acTk = await this.getAuthTokenForAccount(
                account.id,
                session.secret,
                session.id,
              )

              const accessTk = await prisma.accountAccessToken.create({
                data: {
                  clientAuthSessionId: session.id,
                  createdAt: getUnixMilliseconds(),
                  expireAt: getInfiniteExpiryMagic(),
                  isRevoked: false,
                  accessToken: acTk,
                },
              })

              /** @TODO Connect it here ---> shortkey with notes. */
              const notes_client_id = 'f957dfb5-8b82-4eb4-a448-c2c281e8eabd'
              const shortkey_client_id = '6a9770de-f03d-4e2b-ba97-0881db1b62b2'
              let conencted_access_tok = null

              if (session.clientId === shortkey_client_id) {
                /** Connect it. */
                /** @TODO get this notes_client_id and shortkey_clinet_id from request itself. */
                let connected_client = await ClientService.getClientWithId(
                  notes_client_id,
                )

                if (connected_client) {
                  let connected_client_secret =
                    await prisma.clientSecret.findFirst({
                      where: {
                        clientId: connected_client.id,
                      },
                    })
                  if (connected_client_secret) {
                    let already_exist =
                      await prisma.accountAccessToken.findFirst({
                        where: {
                          clientAuthSessionId: session.id,
                          sourceApp: session.clientId,
                          connectedApp: connected_client.id,
                          isRevoked: false,
                        },
                      })

                    if (already_exist) {
                      conencted_access_tok = already_exist.accessToken
                    } else {
                      const acTkx = await this.getAppTokenForAccount(
                        account.id,
                        session.clientId,
                        connected_client_secret.token,
                        connected_client.id,
                        session.id,
                      )

                      const connectedAccessTk =
                        await prisma.accountAccessToken.create({
                          data: {
                            clientAuthSessionId: session.id,
                            sourceApp: session.clientId,
                            connectedApp: connected_client.id,
                            createdAt: getUnixMilliseconds(),
                            expireAt: getInfiniteExpiryMagic(),
                            isRevoked: false,
                            accessToken: acTkx,
                          },
                        })

                      conencted_access_tok = acTkx
                    }
                  }
                }
              }

              await this.completeSession(session.id, account.id)

              // new cookie token
              let ctoken = await this.randomNameGenerator(20)
              let easy_auth_cookie =
                await prisma.nativeAccountAuthCookie.create({
                  data: {
                    cookieToken: ctoken,
                    nativeAccountId: native_account.id,
                  },
                })

              return {
                message: 'PASSWORD_AUTH_PASSED',
                data: {
                  cookieToken: ctoken,
                  // accessToken: accessTk.accessToken,
                  accessToken:
                    acTk +
                    (conencted_access_tok !== null
                      ? `|${conencted_access_tok}`
                      : ''),
                  /** @TODO send the app info too (connected) ---- for now it will be null for other app than shortkey. */
                  connectedAccessToken: conencted_access_tok,
                },
              }
            } else {
              // console.log("COOKIE NOT FOUND IN DB :: ", cookie_found_and_valid, login_cookie, ctk)

              /** generate otp creds */
              let otp_auth_id = await this.generateEmailOtpChallenge(
                native_account.id,
                native_account.userName,
              )
              return {
                message: 'PASSWORD_AUTH_PASSED_AND_OTP_AUTH_REQUIRED',
                data: {
                  request_id: otp_auth_id,
                },
              }
            }
          } else {
            return {
              message: 'PASSWORD_AUTH_FAIL',
            }
          }
        } else {
          await prisma.nativeAccount.update({
            where: {
              id: native_account.id,
            },
            data: {
              password: encrypted_passwd,
            },
          })

          /** send the verification email */
          let otp_auth_id = await this.generateEmailOtpChallenge(
            native_account.id,
            native_account.userName,
          )

          return {
            message: 'PASSWORD_AUTH_PASSED_AND_OTP_AUTH_REQUIRED',
            data: {
              request_id: otp_auth_id,
            },
          }
        }
      } else {
        /** Account not found */
        if (formMode === 'login') {
          return {
            message: 'ACCOUNT_NOT_FOUND',
            data: {},
          }
        }

        console.log("Current form :: ", formMode)

        native_account = await prisma.nativeAccount.create({
          data: {
            userName: native_user.email,
            password: encrypted_passwd,
            /** disabling verification for now */
            // verified: false,
            verified: true,
          },
        })

        /** disabling verification for now start */
        /** send the verification email */
        // let otp_auth_id = await this.generateEmailOtpChallenge(
        //   native_account.id,
        //   native_account.userName,
        // )
        // return {
        //   message: 'PASSWORD_AUTH_PASSED_AND_OTP_AUTH_REQUIRED',
        //   data: {
        //     request_id: otp_auth_id,
        //   },
        // }
        /** disabling verification for now end */


        /** enabling otp less signup **/
        const assignId = (await this.randomNameGenerator(11)) + '@loginsign.com'

        let account = await this.createAccount({
          firstName: null,
          familyName: null,
          picture: null, // clone the picture
          assignId: assignId,
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

        // if (!account) {
        //   console.log('ERROR AC NOT FOUND :: ', account)
        //   return {
        //     message: 'ACCOUNT_NOT_FOUND',
        //   }
        // }

        const acTk = await this.getAuthTokenForAccount(
          account.id,
          session.secret,
          session.id,
        )

        console.log('Generated access token :: ', acTk)

        const accessTk = await prisma.accountAccessToken.create({
          data: {
            clientAuthSessionId: session.id,
            createdAt: getUnixMilliseconds(),
            expireAt: getInfiniteExpiryMagic(),
            isRevoked: false,
            accessToken: acTk,
          },
        })

        console.log('Generated access token record :: ', accessTk)

        /** @TODO Connect it here ---> shortkey with notes. **/
        const notes_client_id = 'f957dfb5-8b82-4eb4-a448-c2c281e8eabd'
        const shortkey_client_id = '6a9770de-f03d-4e2b-ba97-0881db1b62b2'
        let conencted_access_tok = null

        if (session.clientId === shortkey_client_id) {
          /** Connect it. */
          /** @TODO get this notes_client_id and shortkey_clinet_id from request itself. **/
          let connected_client = await ClientService.getClientWithId(
            notes_client_id,
          )

          if (connected_client) {
            let connected_client_secret = await prisma.clientSecret.findFirst({
              where: {
                clientId: connected_client.id,
              },
            })
            if (connected_client_secret) {
              const acTkx = await this.getAppTokenForAccount(
                account.id,
                session.clientId,
                connected_client_secret.token,
                connected_client.id,
                session.id,
              )

              const connectedAccessTk = await prisma.accountAccessToken.create({
                data: {
                  clientAuthSessionId: session.id,
                  sourceApp: session.clientId,
                  connectedApp: connected_client.id,
                  createdAt: getUnixMilliseconds(),
                  expireAt: getInfiniteExpiryMagic(),
                  isRevoked: false,
                  accessToken: acTkx,
                },
              })

              conencted_access_tok = acTkx
            }
          }
        }

        await this.completeSession(session.id, account.id)

        let ctoken = await this.randomNameGenerator(20)
        let easy_auth_cookie = await prisma.nativeAccountAuthCookie.create({
          data: {
            cookieToken: ctoken,
            nativeAccountId: native_account.id,
          },
        })

        console.log('Connected access token :: ', conencted_access_tok)

        return {
          message: 'PASSWORD_AUTH_PASSED',
          data: {
            cookieToken: ctoken,
            // accessToken: accessTk.accessToken,
            accessToken:
              acTk +
              (conencted_access_tok !== null ? `|${conencted_access_tok}` : ''),
            /** @TODO send the app info too (connected) ---- for now it will be null for other app than shortkey. **/
            connectedAccessToken: conencted_access_tok,
          },
        }

        /** enabling otp less signup END **/
      }
    } else {
      let native_account = await prisma.nativeAccount.findFirst({
        where: {
          userName: native_user.email,
        },
      })
      if (!native_account) {
        return {
          message: 'ACCOUNT_NOT_FOUND',
        }
      } else {
        let otp_auth_id = await this.generateEmailOtpChallenge(
          native_account.id,
          native_account.userName,
        )

        return {
          message: 'PASSWORD_AUTH_PASSED_AND_OTP_AUTH_REQUIRED',
          data: {
            request_id: otp_auth_id,
          },
        }
      }
    }
  }

  static async updatePassword(
    nativeAccountId: string,
    newPassword: string,
  ) {

    let encrypted_passwd = await encryptPasscode(newPassword)

    await prisma.nativeAccount.update({
      where: { id: nativeAccountId },
      data: { password: encrypted_passwd },
    });

    return {
      status: 200,
      message: 'PASSWORD_UPDATED',
    }
  }

  static async verifyNativeAccount(
    data: { request_id: string; otp: string },
    session: ClientAuthSession,
  ) {

    if((data.otp || "").trim().length < 1) {
      return {
        message: 'FAILED',
      }
    }

    let otp_auth = await prisma.accountChallenge.findFirst({
      where: {
        id: data.request_id,
        otpCode: data.otp,
      },
    })

    console.log('a :: ', otp_auth)

    if (otp_auth) {
      /** @todo check time */
      if (!otp_auth.createdAt) {
        return {
          message: 'EXPIRED',
        }
      }

      let native_account_id = otp_auth.nativeAccountId

      let native_account = await prisma.nativeAccount.findFirst({
        where: {
          id: native_account_id,
        },
      })

      console.log('native account ::: ', native_account)

      await prisma.accountChallenge.delete({
        where: {
          id: otp_auth.id,
        },
      })

      if (!native_account) {
        return {}
      }

      if (native_account.verified === false) {
        await prisma.nativeAccount.update({
          where: {
            id: native_account_id,
          },
          data: {
            verified: true,
          },
        })
      }

      let account = await prisma.account.findFirst({
        where: {
          connections: {
            some: {
              providerId: native_account_id,
              provider: 'Native',
            },
          },
        },
      })

      console.log('account ::: ', account)

      if (!account) {
        const assignId = (await this.randomNameGenerator(11)) + '@loginsign.com'

        account = await this.createAccount({
          firstName: null,
          familyName: null,
          picture: null, // clone the picture
          assignId: assignId,
          connections: {
            create: {
              provider: 'Native',
              providerId: native_account_id,
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
      }

      const acTk = await this.getAuthTokenForAccount(
        account.id,
        session.secret,
        session.id,
      )

      const accessTk = await prisma.accountAccessToken.create({
        data: {
          clientAuthSessionId: session.id,
          createdAt: getUnixMilliseconds(),
          expireAt: getInfiniteExpiryMagic(),
          isRevoked: false,
          accessToken: acTk,
        },
      })

      await this.completeSession(session.id, account.id)

      let ctoken = await this.randomNameGenerator(20)

      let easy_auth_cookie = await prisma.nativeAccountAuthCookie.create({
        data: {
          cookieToken: ctoken,
          nativeAccountId: native_account_id,
        },
      })

      return {
        message: 'PASSED',
        data: {
          accessToken: accessTk.accessToken,
          cookieToken: ctoken,
          accountId: account.id,
          nativeAccountId: native_account_id,
          /** a cookie for auth */
        },
      }
    } else {
      return {
        message: 'FAILED',
      }
    }
  }

  static async createFacebookAccount(fb_user: any, session: ClientAuthSession) {
    let account = await prisma.account.findFirst({
      where: {
        // email: google_user.email,
        connections: {
          some: {
            providerId: fb_user.id,
            provider: 'Facebook',
          },
        },
      },
    })

    if (!account) {
      const assignId = (await this.randomNameGenerator(11)) + '@aid.com'

      account = await this.createAccount({
        firstName: fb_user['name'],
        familyName: fb_user['familyName'],
        // email: google_user['email'],
        picture: fb_user['picture'], // clone the picture
        assignId: assignId,
        connections: {
          create: {
            provider: 'Facebook',
            providerId: fb_user.id,
            providerUsername: fb_user['email'] || '-1',
            lastUsed: getUnixMilliseconds(),
            connectedAt: getUnixMilliseconds(),
            token: {
              create: {
                accessToken: fb_user.accessToken,
                refreshToken: fb_user.refreshToken,
                expireAt: getInfiniteExpiryMagic(),
                createdAt: getUnixMilliseconds(),
              },
            },
          },
        },
      })
    }

    const acTk = await this.getAuthTokenForAccount(
      account.id,
      session.secret,
      session.id,
    )

    const accessTk = await prisma.accountAccessToken.create({
      data: {
        clientAuthSessionId: session.id,
        createdAt: getUnixMilliseconds(),
        expireAt: getInfiniteExpiryMagic(),
        isRevoked: false,
        accessToken: acTk,
      },
    })

    await this.completeSession(session.id, account.id)

    return accessTk.accessToken
  }

  static async unlinkSocialAccount(accountId: string, provider: string) {
    const account =
      await AccountService.getAccountWithIdAlsoSelectSocialConnectionId(
        accountId,
      )

    let conn: number | null = null

    /** 1 is requried */
    if (account?.connections.length === 1) {
      return false
    }

    account?.connections.map((c) => {
      if (c.provider === provider) {
        conn = c.id
      }
    })

    if (conn) {
      await prisma.socialConnection.delete({
        where: {
          id: conn,
        },
        include: {
          token: true,
        },
      })
      return true
    } else {
      return false
    }
  }

  static async linkXAccount(x_user: any, session: ClientAuthSession) {
    if (!session.accountId) {
      return {
        error: null,
        success: false,
      }
    }

    const account = await prisma.account.findFirst({
      where: {
        // email: google_user.email,
        connections: {
          some: {
            providerId: x_user.id,
            provider: SocialProvider.Twitter,
          },
        },
      },
    })

    if (account) {
      if (account.id === session.accountId) {
        /** THE SAME USER TRYING TO LINK AGAIN */
        /** update info */
        return {
          error: null,
          success: true,
        }
      } else {
        /** This google account is already linked with some other account */
        // throw new HttpError(400, "AccountAlreadyLinked");
        return {
          error: 'ALREADY_LINKED',
          success: false,
        }
      }
    }

    await prisma.account.update({
      where: {
        id: session.accountId,
      },
      data: {
        connections: {
          create: {
            provider: SocialProvider.Twitter,
            providerId: x_user.id,
            providerUsername: x_user['email'] || '-1',
            lastUsed: getUnixMilliseconds(),
            connectedAt: getUnixMilliseconds(),
            token: {
              create: {
                accessToken: x_user.accessToken,
                refreshToken: x_user.refreshToken,
                expireAt: getInfiniteExpiryMagic(),
                createdAt: getUnixMilliseconds(),
              },
            },
          },
        },
      },
    })

    await this.completeSession(session.id, session.accountId)

    return {
      error: null,
      success: true,
    }
  }

  static async linkFacebookAccount(fb_user: any, session: ClientAuthSession) {
    if (!session.accountId) {
      return {
        error: null,
        success: false,
      }
    }

    const account = await prisma.account.findFirst({
      where: {
        // email: google_user.email,
        connections: {
          some: {
            providerId: fb_user.id,
            provider: 'Facebook',
          },
        },
      },
    })

    if (account) {
      if (account.id === session.accountId) {
        /** THE SAME USER TRYING TO LINK AGAIN */
        /** update info */
        return {
          error: null,
          success: true,
        }
      } else {
        /** This google account is already linked with some other account */
        // throw new HttpError(400, "AccountAlreadyLinked");
        return {
          error: 'ALREADY_LINKED',
          success: false,
        }
      }
    }

    await prisma.account.update({
      where: {
        id: session.accountId,
      },
      data: {
        connections: {
          create: {
            provider: 'Facebook',
            providerId: fb_user.id,
            providerUsername: fb_user['email'] || '-1',
            lastUsed: getUnixMilliseconds(),
            connectedAt: getUnixMilliseconds(),
            token: {
              create: {
                accessToken: fb_user.accessToken,
                refreshToken: fb_user.refreshToken,
                expireAt: getInfiniteExpiryMagic(),
                createdAt: getUnixMilliseconds(),
              },
            },
          },
        },
      },
    })

    await this.completeSession(session.id, session.accountId)

    return {
      error: null,
      success: true,
    }
  }

  static async linkGoogleAccount(google_user: any, session: ClientAuthSession) {
    if (!session.accountId) {
      return {
        error: null,
        success: false,
      }
    }

    const account = await prisma.account.findFirst({
      where: {
        // email: google_user.email,
        connections: {
          some: {
            providerId: google_user.id,
            provider: 'Google',
          },
        },
      },
    })

    if (account) {
      if (account.id === session.accountId) {
        /** THE SAME USER TRYING TO LINK AGAIN */
        /** update info */
        return {
          error: null,
          success: true,
        }
      } else {
        /** This google account is already linked with some other account */
        // throw new HttpError(400, "AccountAlreadyLinked");
        return {
          error: 'ALREADY_LINKED',
          success: false,
        }
      }
    }

    await prisma.account.update({
      where: {
        id: session.accountId,
      },
      data: {
        connections: {
          create: {
            provider: 'Google',
            providerId: google_user.id,
            providerUsername: google_user['email'],
            lastUsed: getUnixMilliseconds(),
            connectedAt: getUnixMilliseconds(),
            token: {
              create: {
                accessToken: google_user.accessToken,
                refreshToken: google_user.refreshToken,
                expireAt: getInfiniteExpiryMagic(),
                createdAt: getUnixMilliseconds(),
              },
            },
          },
        },
      },
    })

    await this.completeSession(session.id, session.accountId)

    return {
      error: null,
      success: true,
    }
  }

  static async createGoogleAccount(
    google_user: any,
    session: ClientAuthSession,
  ) {
    let account = await prisma.account.findFirst({
      where: {
        // email: google_user.email,
        connections: {
          some: {
            providerId: google_user.id,
            provider: 'Google',
          },
        },
      },
    })

    if (!account) {
      const assignId = (await this.randomNameGenerator(11)) + '@aid.com'

      account = await this.createAccount({
        firstName: google_user['name'],
        familyName: google_user['familyName'],
        // email: google_user['email'],
        picture: google_user['picture'], // clone the picture
        assignId: assignId,
        connections: {
          create: {
            provider: 'Google',
            providerId: google_user.id,
            providerUsername: google_user['email'],
            lastUsed: getUnixMilliseconds(),
            connectedAt: getUnixMilliseconds(),
            token: {
              create: {
                accessToken: google_user.accessToken,
                refreshToken: google_user.refreshToken,
                expireAt: getInfiniteExpiryMagic(),
                createdAt: getUnixMilliseconds(),
              },
            },
          },
        },
      })
    }

    const acTk = await this.getAuthTokenForAccount(
      account.id,
      session.secret,
      session.id,
    )

    const accessTk = await prisma.accountAccessToken.create({
      data: {
        clientAuthSessionId: session.id,
        createdAt: getUnixMilliseconds(),
        expireAt: getInfiniteExpiryMagic(),
        isRevoked: false,
        accessToken: acTk,
      },
    })

    await this.completeSession(session.id, account.id)

    return accessTk.accessToken
  }

  static async createSessionHelper(
    val1: string,
    val2: string,
    clientId: string,
    sessionId: string,
  ) {
    return await prisma.sessionHelper.create({
      data: {
        helperVal1: val1,
        helperVal2: val2,
        clientId: clientId,
        sessionId: sessionId,
      },
    })
  }
  static async getSessionHelper(val1: string, val2: string) {
    let data: {
      clientId: string
      sessionId: string
    } | null = null
    const s = await prisma.sessionHelper.findUnique({
      where: {
        helperVal1: val1,
      },
    })
    if (s && s.helperVal2 === val2) {
      data = {
        clientId: s.clientId,
        sessionId: s.sessionId,
      }
      await prisma.sessionHelper.delete({
        where: {
          id: s.id,
        },
      })
    }
    return data
  }
}
