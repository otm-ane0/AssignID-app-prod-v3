import { NextFunction, Response } from 'express'
import ClientService from '../services/client'
import HttpError from '../utils/httpError'
import { getUnixMilliseconds } from '../utils/token'
import { ExtendedRequest } from '../utils/types'

function minutesToMilliseconds(minutes: number) {
  return minutes * 60 * 1000
}

export default class Client {
  static async serializeSession(
    req: ExtendedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.locals) {
        req.locals = {
          session: null,
          client: null,
        }
      }

      const sessID = req.query['sess_id'] as string

      if (!sessID) {
        req.locals['session'] = null
        return next()
      }

      const session = await ClientService.getSessionWithID(sessID)

      if (session) {
        /** @todo Check for expired time */

        req.locals['session'] = session
      } else {
        req.locals['session'] = null
      }

      return next()
    } catch (error: HttpError | any) {
      console.log(error)
      if (error.code) {
        return res.status(error.code).json({
          message: error.message,
        })
      }
      console.log(error)
      return res.status(500).json({
        message: 'Internal server error!',
      })
    }
  }

  static async sessionAccessGuard(
    req: ExtendedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.locals?.session) {
        throw new HttpError(401, 'unauthorized_session')
      } else {
        // 10 minutes expiry time for sessions
        if (
          parseInt(getUnixMilliseconds()) -
            parseInt(req.locals.session.createdAt) >
          minutesToMilliseconds(10)
        ) {
          throw new HttpError(401, 'session_expired')
        }
      }

      return next()
    } catch (error: HttpError | any) {
      console.log(error)
      if (error.httpError) {
        return res.status(400).json({
          message: error.message,
        })
      }
      return res.status(500).json({
        message: 'Internal server error!',
      })
    }
  }

  static async serializeClientWithoutSecret(
    req: ExtendedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const clientID = req.headers['x-assign-app-id'] as string
      if (!clientID) {
        req.locals = {
          client: null,
        }

        return next()
      }
      const client = await ClientService.getClientWithId(clientID)
      if (client) {
        req.locals = {
          client: client,
        }
      } else {
        req.locals = {
          client: null,
        }
      }

      return next()
    } catch (error: HttpError | any) {
      if (error.code) {
        return res.status(400).json({
          message: error.message,
        })
      }
      return res.status(500).json({
        message: 'Internal server error!',
      })
    }
  }

  static async serializeClient(
    req: ExtendedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const clientID = req.headers['x-assign-app-id'] as string
      const clientSecret = req.headers['x-assign-app-secret'] as string

      if (!clientID || !clientSecret) {
        req.locals = {
          client: null,
        }

        return next()
      }

      console.log('Client id ::: ', clientID, clientSecret)

      const client = await ClientService.getClientWithIDAndValidSecret(
        clientID,
        clientSecret,
      )

      if (client) {
        req.locals = {
          client: client,
        }
      } else {
        req.locals = {
          client: null,
        }
      }

      console.log('ARRIVEEEEEE ::: ', req.locals)

      return next()
    } catch (error: HttpError | any) {
      console.log('ERRIR ::: ', error)
      if (error.code) {
        return res.status(400).json({
          message: error.message,
        })
      }
      return res.status(500).json({
        message: 'Internal server error!',
      })
    }
  }

  static async clientAccessGuard(
    req: ExtendedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.locals?.client) {
        throw new HttpError(401, 'unauthorized')
      }

      return next()
    } catch (error: HttpError | any) {
      console.log('ERRIR ::: ', error)
      if (error.httpError) {
        return res.status(400).json({
          message: error.message,
        })
      }
      return res.status(500).json({
        message: 'Internal server error!',
      })
    }
  }
}
