import express from 'express'
import passport from 'passport'
import { Strategy as AppleStrategy } from 'passport-apple'

passport.use(
  new AppleStrategy(
    {
      clientID: 'r43f',
      teamID: 'e4rf',
      callbackURL: '4rf',
      keyID: '43rf',
      privateKeyLocation: '4rw',
      passReqToCallback: true,
    },
    function (req, accessToken, refreshToken, idToken, profile, cb) {
      const user = {}
      cb(null, user)
    },
  ),
)

export default passport
