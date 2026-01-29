import express from 'express'
import passport from 'passport'
import { Runtime } from '../runtime'
import OAuth2Strategy = require('passport-oauth2')

passport.use(
  'twitter',
  new OAuth2Strategy(
    {
      clientID: Runtime.getTwitterClientID(),
      clientSecret: Runtime.getTwitterClientSecret(),
      callbackURL: Runtime.getTwitterCallbackURL(),
      authorizationURL: 'https://twitter.com/i/oauth2/authorize',
      tokenURL: 'https://api.twitter.com/2/oauth2/token',
      customHeaders: {
        Authorization:
          'Basic ' +
          Buffer.from(
            `${Runtime.getTwitterClientID()}:${Runtime.getTwitterClientSecret()}`,
          ).toString('base64'),
      },
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: (err: Error | null, user: any) => {},
    ) => {
      console.log('pro :::: ', profile)
      done(null, { id: profile.id })
    },
  ),
)

export default passport
