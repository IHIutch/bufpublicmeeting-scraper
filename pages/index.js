import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { getMeetings } from '../utils/axios/meetings'
import { useGetMeetings } from '../utils/react-query/meetings'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import uniq from 'lodash/uniq'
import { defaultFilterConstants, handleFilterMeetings } from '../utils'
import slugify from 'slugify'
import dynamic from 'next/dynamic'
import {
  Checkbox,
  Stack,
  Button,
  RadioGroup,
  Text,
  Radio,
  Box,
  CheckboxGroup,
  Flex,
  Heading,
  Link,
  Tag,
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import { parseDate } from '@internationalized/date'

const RangeCalendar = dynamic(() => import('../components/rangeCalendar'), {
  ssr: false,
})

export default function Home({ filterGroups }) {
  const router = useRouter()
  const query = router.query

  const sortQuery = query?.sort || defaultFilterConstants.SORT
  const dateRateQuery = query?.range || defaultFilterConstants.DATE_RANGE

  const { data: meetings } = useGetMeetings({
    sort: query?.sort || null,
    range: query?.range || null,
  })

  const updateRouteQuery = (params) => {
    router.replace(
      {
        pathname: router.pathname,
        query: params,
      },
      undefined,
      {
        shallow: true,
      }
    )
  }

  const handleSetFilter = (values) => {
    updateRouteQuery({
      ...query,
      filter: values,
    })
  }

  const handleSetSort = (value) => {
    updateRouteQuery({
      ...query,
      sort: value,
    })
  }

  const handleSetDateRange = ({ start, end }) => {
    updateRouteQuery({
      ...query,
      range: [
        dayjs(start.toString()).format('YYYY-MM-DD'),
        dayjs(end.toString()).format('YYYY-MM-DD'),
      ],
    })
  }

  const filterQuery = [].concat(query.filter || defaultFilterConstants.FILTER)
  const filteredMeetings = (meetings || []).filter((m) =>
    filterQuery.length ? filterQuery.includes(slugify(m.meetingGroup)) : true
  )

  const getCount = (value) => {
    return (meetings || []).filter((m) => m.meetingGroup === value).length
  }

  return (
    <Box maxW="container.xl" mx="auto" px="4" display="flex">
      <Box
        as="aside"
        w={1 / 4}
        position="sticky"
        top="0"
        h="100vh"
        overflow="auto"
        px="3"
        py="4"
      >
        <div className="my-5">
          <Box
            borderWidth="1px"
            borderColor="gray.200"
            rounded="md"
            p="3"
            mb="4"
          >
            <fieldset>
              <Text as="legend" fontWeight="medium" fontSize="lg">
                Sort by:
              </Text>
              <RadioGroup defaultValue={sortQuery} onChange={handleSetSort}>
                <Stack>
                  <Radio value="date-desc">Meeting Date (Desc)</Radio>
                  <Radio value="date-asc">Meeting Date (Asc)</Radio>
                  <Radio value="name-desc">Meeting Name (Desc)</Radio>
                  <Radio value="name-asc">Meeting Name (Asc)</Radio>
                </Stack>
              </RadioGroup>
            </fieldset>
          </Box>
          <Box rounded="md" borderWidth="1px" borderColor="gray.200" p="3">
            <Box mb="6">
              <RangeCalendar
                value={{
                  start: parseDate(dateRateQuery[0]),
                  end: parseDate(dateRateQuery[1]),
                }}
                onChange={handleSetDateRange}
              />
            </Box>

            <fieldset>
              <Box mb="4">
                <Text as="legend" fontWeight="medium" fontSize="lg">
                  Filter Meeting Type:
                </Text>
                <Button
                  onClick={() => handleSetFilter([])}
                  cursor="pointer"
                  variant="link"
                  colorScheme="blue"
                  isDisabled={!filterQuery.length}
                  size="sm"
                >
                  Clear Filters
                </Button>
              </Box>
              <CheckboxGroup value={filterQuery} onChange={handleSetFilter}>
                <Stack>
                  {filterGroups.map((fg, idx) => (
                    <Flex key={idx} justify="space-between" align="center">
                      <Checkbox value={fg.value}>{fg.label}</Checkbox>
                      <Tag
                        flexShrink="0"
                        size="sm"
                        colorScheme={getCount(fg.label) ? 'blue' : 'gray'}
                        borderRadius="full"
                      >
                        {getCount(fg.label)}
                      </Tag>
                    </Flex>
                  ))}
                </Stack>
              </CheckboxGroup>
            </fieldset>
          </Box>
        </div>
      </Box>
      <Box as="main" w={3 / 4} ml="auto" px="3" py="4">
        <Stack>
          {(filteredMeetings || []).map((meeting) => (
            <Box
              key={meeting.id}
              borderWidth="1px"
              borderColor="gray.200"
              rounded="md"
              p="4"
            >
              <Flex>
                <Heading as="h2" fontSize="xl" fontWeight="semibold">
                  <NextLink href={meeting.path} passHref>
                    <Link>{meeting.title}</Link>
                  </NextLink>
                </Heading>
              </Flex>
              <Box mb="2">
                <Text color="gray.500">{meeting.date}</Text>
              </Box>
              <Box mb="2">
                <Stack direction="row" className="flex -mx-4">
                  {(meeting?.links || []).map((link, idx) => (
                    <Box key={idx}>
                      <Link
                        color="blue.500"
                        fontWeight="medium"
                        href={link.linkUrl || '#'}
                        isExternal
                      >
                        {link.linkText}
                      </Link>
                    </Box>
                  ))}
                </Stack>
              </Box>
              <Text>{meeting.details}</Text>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

export async function getServerSideProps({ query }) {
  const queryClient = new QueryClient()

  const meetings = await getMeetings()
  const filterGroups = uniq(meetings.map((m) => m.meetingGroup))
    .sort()
    .map((m) => ({
      label: m,
      value: slugify(m),
    }))

  const filterParams = {
    sort: query?.sort || null,
    range: query?.range || null,
  }

  const data = await handleFilterMeetings({
    meetings,
    params: filterParams,
  })

  await queryClient.prefetchQuery(['meetings', filterParams], async () => data)

  return {
    props: {
      filterGroups,
      dehydratedState: dehydrate(queryClient),
    },
  }
}
