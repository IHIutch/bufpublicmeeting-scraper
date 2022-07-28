import axios from 'redaxios'

export const getMeetings = async () => {
  const { data } = await axios
    .get(
      'https://raw.githubusercontent.com/IHIutch/bufpublicmeeting-scraper/data/index.json'
    )
    .catch((res) => {
      throw new Error(res.data.error)
    })
  return data
}

export const getMeeting = async (id) => {
  const { data } = await axios
    .get(
      'https://raw.githubusercontent.com/IHIutch/bufpublicmeeting-scraper/data/index.json'
    )
    .catch((res) => {
      throw new Error(res.data.error)
    })
  return data.find((m) => m.meetingId === id)
}
