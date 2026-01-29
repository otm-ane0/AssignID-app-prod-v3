import express from 'express'
import passport from 'passport'
//@ts-ignore
import { Strategy as TwitterStrategy } from 'passport-twitter'
import { Runtime } from '../runtime'

passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser(function (obj, done) {
  done(null, obj as any)
})

passport.use(
  new TwitterStrategy(
    {
      consumerKey: Runtime.getTwitterClientID(),
      consumerSecret: Runtime.getTwitterClientSecret(),
      callbackURL: Runtime.getTwitterCallbackURL(),
      includeEmail: true,
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: (err: Error | null, user: any) => {},
    ) => {
      let e = ''
      if (profile.emails && profile.emails?.length > 0) {
        e = profile.emails[0].value
      }

      const user = {
        id: profile.id,
        username: profile.username,
        tokens: { access_token: accessToken, refresh_token: refreshToken },
        email: e,
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
