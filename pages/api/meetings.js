import { getMeetings } from '../../utils/axios/meetings'

const handler = async (req, res) => {
  const { method, query } = req

  switch (method) {
    // Get
    case 'GET':
      try {
        const data = await getMeetings(query)
        res.status(200).json(data)
      } catch (error) {
        res.status(400).json({ error: error.message })
      }
      break

    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default handler
