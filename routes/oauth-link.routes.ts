import express, { Request, Response, NextFunction } from 'express'
import Client from '../middlewares/client'
import { ExtendedRequest } from '../utils/types'
import passport from 'passport'

const router = express.Router()

router.get('/', (_, res: Response) => {
  return res.status(200).json({
    message: 'OK',
  })
})

/** To link other providers to user accounts we need:
 *
 * 1. Client id authorization
 * 2. Assign account info
 * 3. Then confirm via client secret? for that specific link session
 *
 *
 * - The app will get new session for social connection
 * - They can open popup with that session as same as current
 */

router.get(
  '/google',
  Client.serializeSession,
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.locals) return
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state: `${req.locals.session?.clientId}/${req.locals.session?.id}`,
    })(req, res, next)
  },
)

export default router
