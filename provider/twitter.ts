import express from 'express'
import passport from 'passport'
import { Strategy as XStrategy } from '@superfaceai/passport-twitter-oauth2'
import { Runtime } from '../runtime'

passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser(function (obj, done) {
  done(null, obj as any)
})

passport.use(
  new XStrategy(
    {
      clientID: Runtime.getTwitterClientID(),
      clientSecret: Runtime.getTwitterClientSecret(),
      callbackURL: Runtime.getTwitterCallbackURL(),
      clientType: 'confidential',
      scope: ['tweet.read', 'users.read', 'offline.access'],
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        username: profile.username,
        tokens: { access_token: accessToken, refresh_token: refreshToken },
        email: null,
        profile: {
          displayName: profile.displayName,
          url: (profile._json as any)['profile_image_url'],
          emails: profile.emails || [],
        },
      }
      done(null, user)
    },
  ),
)

export default passport
