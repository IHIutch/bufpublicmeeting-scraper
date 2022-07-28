import { getMeetings } from '../../utils/axios/meetings'
import { handleFilterMeetings } from '../../utils/function'

const handler = async (req, res) => {
  const { method, query } = req

  switch (method) {
    // Get
    case 'GET':
      try {
        const meetings = await getMeetings()
        const data = await handleFilterMeetings({
          meetings,
          params: query,
        })

        console.log()
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
