import { PrismaClient } from '@prisma/client'
import appLog from '../services/log'

const prisma = new PrismaClient()

export async function initializePrisma() {
  await prisma
    .$connect()
    .then(() => {
      appLog.log('Prisma connected successfully!')
    })
    .catch(async (e) => {
      appLog.error(e)
      await prisma.$disconnect()
      // process.exit(1);

      appLog.log('Trying to reconnect in 6 seconds!')

      setTimeout(async () => {
        await initializePrisma()
      }, 6000)
    })
}

export default prisma
