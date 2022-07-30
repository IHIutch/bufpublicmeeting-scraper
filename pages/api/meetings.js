import { getMeetings } from '../../utils/axios/meetings'
import { handleFilterMeetings } from '../../utils'
import qs from 'qs'

const handler = async (req, res) => {
  const { method, query } = req

  console.log(qs.parse(query))

  switch (method) {
    // Get
    case 'GET':
      try {
        const meetings = await getMeetings()
        const data = await handleFilterMeetings({
          meetings,
          params: qs.parse(query),
        })
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
