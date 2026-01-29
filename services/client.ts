import {
  AuthSessionStatus,
  AuthSessionType,
  Client,
  Prisma,
} from '@prisma/client'
import prisma from '../provider/prisma'
import {
  genCSecret,
  getInfiniteExpiryMagic,
  getUnixMilliseconds,
} from '../utils/token'

export default class ClientService {
  static async createClient(input: Prisma.ClientCreateInput) {
    return await prisma.client.create({
      data: input,
    })
  }

  static async getClient(clientId: string) {
    return await prisma.client.findUnique({
      where: {
        id: clientId,
      },
    })
  }

  static async createSecretKey(input: Prisma.ClientSecretCreateInput) {
    return await prisma.clientSecret.create({
      data: input,
    })
  }

  static async getNewSecretKey(clientId: string) {
    return await this.createSecretKey({
      token: genCSecret(),
      client: {
        connect: {
          id: clientId,
        },
      },
      createdAt: getUnixMilliseconds(),
      expireAt: getInfiniteExpiryMagic(),
    })
  }

  static async getClientWithId(clientId: string) {
    return await prisma.client.findFirst({
      where: {
        id: clientId,
      },
    })
  }

  static async getClientWithIDAndValidSecret(clientId: string, secret: string) {
    return await prisma.client.findFirst({
      where: {
        id: clientId,
        secret: {
          some: {
            token: secret,
            expireAt: {
              lt: getUnixMilliseconds(),
            },
          },
        },
      },
    })
  }

  static async getSessionWithID(sessId: string) {
    return await prisma.clientAuthSession.findFirst({
      where: {
        id: sessId,
      },
      include: {
        client: true,
      },
    })
  }

  static async getSessionWithIDAndClient(sessId: string, clientId: string) {
    return await prisma.clientAuthSession.findFirst({
      where: {
        id: sessId,
        clientId: clientId,
      },
    })
  }

  static async getNewSession(
    client: Client,
    sessType: AuthSessionType,
    connectingClientId: string | null,
    connectingAccountId: string | null,
    extraInfo: string,
    accountId?: string,
  ) {
    const session = await prisma.clientAuthSession.create({
      data: {
        secret: genCSecret(),
        status: AuthSessionStatus.Waiting,
        clientId: client.id,
        connectedClientId: connectingClientId,
        connectedAccountId: connectingAccountId,
        accountId: accountId || undefined,
        createdAt: getUnixMilliseconds(),
        updatedAt: getUnixMilliseconds(),
        extraInfo: extraInfo,
        type: sessType,
      },
    })

    return session
  }

  static async updateClientForSuccess(
    client: Client,
    successAccountId: string,
  ) {}

  // static async serializeSession()
}
