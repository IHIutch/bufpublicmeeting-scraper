import dayjs from 'dayjs'
import slugify from 'slugify'
import axios from 'redaxios'

export const getMeetings = async (params = {}) => {
  const { data } = await axios
    .get(
      'https://raw.githubusercontent.com/IHIutch/bufpublicmeeting-scraper/data/index.json'
    )
    .catch((res) => {
      throw new Error(res.data.error)
    })

  return data
    .filter((m) => {
      // Date Range
      const meetingDate = dayjs(m.date)
      const dateRangeStart = params?.dateRange?.[0]
        ? dayjs(params.dateRange[0]).startOf('day')
        : dayjs().startOf('week')

      const dateRangeEnd = params?.dateRange?.[1]
        ? dayjs(params.dateRange[1]).startOf('day')
        : dayjs().add(1, 'week')

      return (
        meetingDate.isAfter(dateRangeStart) &&
        meetingDate.isBefore(dateRangeEnd)
      )
    })
    .filter((m) => {
      // Meeting Type
      if (!params?.filter) return true
      const groupUrlify = slugify(m.meetingGroup)
      return params.filter.includes(groupUrlify)
    })
    .map((meeting) => {
      const typeUrlify = slugify(meeting.meetingType)
      const groupUrlify = slugify(meeting.meetingGroup)

      return {
        ...meeting,
        id: meeting.meetingId,
        groupUrlify,
        date: new Date(meeting.date).toDateString(),
        path: '/' + groupUrlify + '/' + typeUrlify + '/' + meeting.meetingId,
        title: `${meeting.meetingGroup} - ${meeting.meetingType}`,
      }
    })
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
