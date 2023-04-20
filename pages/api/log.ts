import '../../server-side/logging'
import logger from 'winston'
import { NextApiResponse, NextApiRequest } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  logger.info('Beacon', { body: req.body })
  res.json({ message: 'Handled' })
}

export default handler

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}
