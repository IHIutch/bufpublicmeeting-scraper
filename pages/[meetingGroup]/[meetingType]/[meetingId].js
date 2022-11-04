import { Container } from '@chakra-ui/react'
import { Prose } from '@nikolovlazar/chakra-ui-prose'
import React from 'react'
import axios from 'redaxios'
import slugify from 'slugify'
import { getMeeting } from '../../../utils/axios/meetings'

export default function meetingId({ date, internalLinks, details, title }) {
  return (
    <Container>
      <main role="main">
        <h1 className="text-3xl">{title}</h1>
        <div>{date}</div>
        <Prose>
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
        </Prose>
      </main>
    </Container>
  )
}

export async function getStaticPaths() {
  const { data } = await axios.get(
    'https://raw.githubusercontent.com/IHIutch/bufpublicmeeting-scraper/data/index.json'
  )

  return {
    paths: data.map((meeting) => {
      const typeUrlify = slugify(meeting.meetingType)
      const groupUrlify = slugify(meeting.meetingGroup)
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

  const meetingData = await getMeeting(meetingId)

  return {
    props: {
      ...meetingData,
      id: meetingData.meetingId,
      groupUrlify: meetingGroup,
      typeUrlify: meetingType,
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
