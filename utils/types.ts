import { Client, ClientAuthSession } from '@prisma/client'
import { Request } from 'express'

export type ExtendedRequest = Request & {
  locals?: {
    // user?: User | null,
    client?: Client | null
    session?: ClientAuthSession | null
  }
}
