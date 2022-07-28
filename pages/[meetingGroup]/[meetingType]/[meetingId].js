import React from 'react'
import axios from 'redaxios'

export default function meetingId({ date, internalLinks, details, title }) {
  return (
    <div className="container mx-auto px-4 flex">
      <main role="main">
        <h1 className="text-3xl">{title}</h1>
        <div>{date}</div>
        <div>{details}</div>
        <ul className="list-disc pl-4">
          {internalLinks.map((link, idx) => (
            <li key={idx}>
              <a
                className="text-teal-700 hover:text-teal-900 hover:underline"
                href={link.linkUrl}
              >
                {link.linkText}
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

export async function getStaticPaths() {
  const urlify = (string) => {
    return string.split(' ').join('-').toLowerCase()
  }
  const { data } = await axios.get(
    'https://raw.githubusercontent.com/IHIutch/bufpublicmeeting-scraper/data/index.json'
  )

  return {
    paths: data.map((meeting) => {
      const typeUrlify = urlify(meeting.meetingType)
      const groupUrlify = urlify(meeting.meetingGroup)
      return {
        params: {
          meetingGroup: groupUrlify,
          meetingType: typeUrlify,
          meetingId: meeting.meetingId,
        },
      }
    }),
    fallback: false, // can also be true or 'blocking'
  }
}

export async function getStaticProps({ params }) {
  const { meetingGroup, meetingType, meetingId } = params

  const { data } = await axios.get(
    'https://raw.githubusercontent.com/IHIutch/bufpublicmeeting-scraper/data/index.json'
  )

  const meetingData = data.find((meeting) => meeting.meetingId === meetingId)

  return {
    props: {
      ...meetingData,
      groupUrlify: meetingGroup,
      typeUrlify: meetingType,
      id: meetingData.meetingId,
      meetingGroup: {
        value: meetingGroup,
        text: meetingData.meetingGroup,
      },
      meetingType: {
        value: meetingType,
        text: meetingData.meetingType,
      },
      date: new Date(meetingData.date).toDateString(),
      title: `${meetingData.meetingGroup} - ${meetingData.meetingType}`,
    },
  }
}
