import { Checkbox } from '@chakra-ui/react'
import { Stack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { RadioGroup } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import { Radio } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { CheckboxGroup } from '@chakra-ui/react'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export default function Home({ meetingData }) {
  const [filters, setFilters] = useState([])

  const clearFilters = () => {
    console.log('clear filters')
  }

  const updateRouteQuery = (query) => {
    console.log('update route query', query)
  }

  const filteredMeetings = useMemo(() => {
    return meetingData.filter((m) => m)
  }, [meetingData])

  const filterGroups = useMemo(() => {
    const obj = {}
    meetingData.forEach((meeting) => {
      const groupIdx = meeting.meetingGroup.value
      if (!Object.keys(obj).includes(groupIdx)) {
        obj[groupIdx] = {
          text: meeting.meetingGroup.text,
          values: [],
        }
      }
      obj[groupIdx].values.push(meeting)
    })
    return obj
  }, [meetingData])

  console.log({ filteredMeetings, filterGroups })

  return (
    <Box maxW="container.xl" mx="auto" px="4" display="flex">
      <Box
        as="aside"
        w={1 / 4}
        position="sticky"
        top="0"
        h="full"
        overflow="auto"
        px="3"
      >
        <div className="my-5">
          <h2 className="font-medium text-2xl mb-2">Sorting &amp; Filters</h2>
          <Box borderWidth="1px" rounded="md" p="3" mb="4">
            <fieldset>
              <Text as="legend" fontWeight="medium" fontSize="lg">
                Sort by:
              </Text>
              <RadioGroup>
                <Stack>
                  <Radio value="date-asc">Meeting Date (Desc)</Radio>
                  <Radio value="date-desc">Meeting Date (Asc)</Radio>
                  <Radio value="name-asc">Meeting Name (Desc)</Radio>
                  <Radio value="name-desc">Meeting Name (Asc)</Radio>
                </Stack>
              </RadioGroup>
            </fieldset>
          </Box>
          <div className="border rounded p-3 mb-4">
            <label
              htmlFor="showPrevious"
              className="cursor-pointer hover:underline flex items-center py-1"
            >
              <input
                id="showPrevious"
                className="mr-2 cursor-pointer"
                type="checkbox"
                name="showPrevious"
                onChange={(e) => updateRouteQuery(e.target.value)}
              />
              <span>Show Past Meetings</span>
            </label>
          </div>
          <Box rounded="md" borderWidth="1px">
            <fieldset>
              <Box mb="2">
                <Text as="legend" fontWeight="medium" fontSize="lg">
                  Filter Meeting Type:
                </Text>
                <Button
                  onClick={clearFilters}
                  cursor="pointer"
                  variant="link"
                  colorScheme="blue"
                  isDisabled={filters.length}
                  size="sm"
                >
                  Clear Filters
                </Button>
              </Box>
              <CheckboxGroup>
                <Stack>
                  {Object.entries(filterGroups).map(([key, val], idx) => (
                    <Checkbox key={key} value={key}>
                      {val.text}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </fieldset>
          </Box>
        </div>
      </Box>
      <Box as="main" w={3 / 4} ml="auto" px="3">
        {filteredMeetings.map((meeting) => (
          <div key={meeting.meetingId}>
            <div className="border rounded p-4 mb-4">
              <div className="flex">
                <h2 className="text-2xl font-medium">
                  <Link href={meeting.path} className="hover:underline">
                    {meeting.title}
                  </Link>
                </h2>
              </div>
              <div className="flex mb-3">
                <div>
                  <span className="text-muted font-weight-bold">
                    {meeting.date}
                  </span>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex -mx-4">
                  {meeting.links.map((link, idx) => (
                    <div key={idx} className="px-4">
                      <a
                        href={link.linkUrl}
                        className="text-teal-700 hover:text-teal-900 hover:underline"
                      >
                        {link.linkText}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              <p>{meeting.details}</p>
            </div>
          </div>
        ))}
      </Box>
    </Box>
  )
}

export async function getServerSideProps() {
  const urlify = (string) => {
    return string.split(' ').join('-').toLowerCase()
  }

  const res = await fetch(
    'https://raw.githubusercontent.com/IHIutch/bufpublicmeeting-scraper/data/index.json'
  )
  const json = await res.json()

  const meetingData = json
    .filter((m) => {
      const meetingDate = dayjs(m.date)
      return (
        meetingDate.isAfter(dayjs().startOf('week')) &&
        meetingDate.isBefore(dayjs().add(1, 'week'))
      )
    })
    .map((meeting) => {
      const typeUrlify = urlify(meeting.meetingType)
      const groupUrlify = urlify(meeting.meetingGroup)

      return {
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
        date: new Date(meeting.date).toDateString(),
        path: groupUrlify + '/' + typeUrlify + '/' + meeting.meetingId,
        title: `${meeting.meetingGroup} - ${meeting.meetingType}`,
      }
    })

  return {
    props: {
      meetingData,
    },
  }
}
