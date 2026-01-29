require('dotenv').config()
import express, { NextFunction, Response, Request } from 'express'
const session = require('express-session')
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'
import { nextApp } from './next'

import passport from './provider/google'
import passportFb from './provider/facebook'
import passportX from './provider/twitter'
import passportApple from './provider/apple'
import passportNative from './provider/native'
import prisma, { initializePrisma } from './provider/prisma'
import appLog from './services/log'
import HttpError from './utils/httpError'

import authRouter from './routes/auth.routes'
import oAuthRouter from './routes/oauth.routes'
import oAuthLinkRouter from './routes/oauth-link.routes'
import clientRouter from './routes/client.routes'

import ClientService from './services/client'

import ksessionMiddleware from './services/ksession'

async function initialBoot() {
  appLog.log('running initial boot...')
  const ClientName = 'test'
  let client: any = await prisma.client.findFirst({
    where: {
      name: ClientName,
    },
    include: {
      secret: true,
    },
  })
  let secret = null
  if (!client) {
    client = await ClientService.createClient({
      name: ClientName,
      logo: `{type: "text", value: "Test"}`,
      color: '#0066ff',
    })

    secret = await ClientService.getNewSecretKey(client.id)
  }

  console.log(client)
  console.log(secret)
  appLog.log('done...')
}

async function initializeApp() {
  await initializePrisma()
  const app = express()
  const handle = nextApp.getRequestHandler()

  app.use(
    session({
      secret: 'SECRET', // Replace with a secret key for session encryption
      resave: false,
      saveUninitialized: true,
    }),
  )

  // app.use(ksessionMiddleware);

  app.use(cors())

  app.set('view engine', 'pug')
  app.set('views', `${__dirname}/views`)

  /** body parser */
  app.use(express.json({ limit: '10mb' }))

  if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

  app.use(passport.initialize())
  app.use(passportFb.initialize())
  app.use(passportX.initialize())
  app.use(passportApple.initialize())
  app.use(passportNative.initialize())

  // app.use(passportX.session());

  /** Routes */
  app.use('/api/auth', authRouter)
  app.use('/oauth', oAuthRouter)
  app.use('/oauth-link', oAuthLinkRouter)

  app.use('/api/client', clientRouter)

  app.get('/api/status', (_, res: Response) => {
    res.render('health', {
      status: 'OK',
    })
  })

  app.use('/static', express.static(path.join(__dirname, './public')))
  app.use('/p', express.static(path.join(__dirname, './uploads')))

  // app.all('*', (req: Request, res: Response, next: NextFunction) => {
  //   next(new HttpError(404, 'route not found.'))
  // })

  const port = process.env.PORT || 6127

  nextApp.prepare().then(() => {
    app.all('*', (req, res) => {
      return handle(req, res)
    })
    // app.all('/login', (req, res) => {
    //   return handle(req, res)
    // })
    app.listen(port, () => {
      appLog.log('Server running on port: ', port)
      // initialBoot();
    })
  })
}

initializeApp().catch((err) => {
  throw err
})
