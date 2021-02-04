// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
const axios = require('axios')

const getData = async () => {
  const res = await axios(
    'https://raw.githubusercontent.com/IHIutch/bufpublicmeeting-scraper/data/index.json'
  )
  return await res.data
}

const urlify = (string) => {
  return string.split(' ').join('-').toLowerCase()
}

module.exports = function (api) {
  api.loadSource(async (actions) => {
    const meetingData = await getData()
    // const meetingData = require('./data/index.json')

    const contentType = actions.addCollection({
      typeName: 'Meeting',
    })

    meetingData.forEach((meeting) => {
      const typeUrlify = urlify(meeting.meetingType)
      const groupUrlify = urlify(meeting.meetingGroup)

      const meetingObj = {
        ...meeting,
        groupUrlify,
        typeUrlify,
        id: meeting.meetingId,
        meetingGroup: {
          value: groupUrlify,
          text: meeting.meetingGroup,
        },
        meetingType: {
          value: typeUrlify,
          text: meeting.meetingType,
        },
        date: new Date(meeting.date),
        path: groupUrlify + '/' + typeUrlify + '/' + meeting.meetingId,
      }

      contentType.addNode(meetingObj)
    })
  })

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  })
}
