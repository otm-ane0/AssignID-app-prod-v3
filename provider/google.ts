import express from 'express'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Runtime } from '../runtime'

passport.use(
  new GoogleStrategy(
    {
      clientID: Runtime.getGoogleClientID(),
      clientSecret: Runtime.getGoogleClientSecret(),
      callbackURL: Runtime.getGoogleCallbackURL(),
    },
    (accessToken, refreshToken, profile, done) => {
        // profile.name.givenName
      const user = {
        id: profile.id,
        email: profile.emails![0].value,
        tokens: { access_token: accessToken, refresh_token: refreshToken },
        profile: profile,
      }

      done(null, user)
    },
  ),
)

export default passport
