import dayjs from 'dayjs'
import slugify from 'slugify'

export const handleFilterMeetings = async ({ meetings = [], params = {} }) => {
  return meetings
    .filter((m) => {
      // Date Range
      const meetingDate = dayjs(m.date)
      const dateRangeStart = params?.range?.[0]
        ? dayjs(params.range[0])
        : dayjs().startOf('week')

      const dateRangeEnd = params?.range?.[1]
        ? dayjs(params.range[1])
        : dayjs().add(6, 'days')

      return (
        meetingDate.isAfter(dateRangeStart) &&
        meetingDate.isBefore(dateRangeEnd)
      )
    })
    .map((meeting) => {
      const typeUrlify = slugify(meeting.meetingType)
      const groupUrlify = slugify(meeting.meetingGroup)

      return {
        ...meeting,
        id: meeting.meetingId,
        groupUrlify,
        date: dayjs(meeting.date).format('ddd, MMM D, YYYY'),
        path: '/' + groupUrlify + '/' + typeUrlify + '/' + meeting.meetingId,
        title: `${meeting.meetingGroup} - ${meeting.meetingType}`,
      }
    })
    .sort((a, b) => {
      const sortValue = params.sort || defaultFilterConstants.SORT
      const [val, dir] = sortValue.split('-')

      if (val === 'date') {
        const dateA = dayjs(a.date)
        const dateB = dayjs(b.date)
        return dir === 'asc' ? dateB - dateA : dateA - dateB
      } else if (val === 'name') {
        return dir === 'asc'
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title)
      } else {
        return 0
      }
    })
}

export const defaultFilterConstants = Object.freeze({
  SORT: 'date-desc',
  DATE_RANGE: [
    dayjs().startOf('week').format('YYYY-MM-DD'),
    dayjs().startOf('week').add(6, 'days').format('YYYY-MM-DD'),
  ],
  FILTER: [],
})
