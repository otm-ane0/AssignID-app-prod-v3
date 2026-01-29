import express from 'express'
import passport from 'passport'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Runtime } from '../runtime'

passport.use(
  new FacebookStrategy(
    {
      clientID: Runtime.getFacebookClientID(),
      clientSecret: Runtime.getFacebookClientSecret(),
      callbackURL: Runtime.getFacebookCallbackURL(),
      profileFields: ['id', 'name', 'emails'],
    },
    (accessToken, refreshToken, profile, done) => {
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
          displayName: `${profile.name?.givenName}${profile.name?.middleName ? ' ' + profile.name?.middleName : ''} ${profile.name?.familyName}`,
          birthday: profile.birthday,
          url: profile.profileUrl,
          emails: profile.emails,
        },
      }

      done(null, user)
    },
  ),
)

export default passport
