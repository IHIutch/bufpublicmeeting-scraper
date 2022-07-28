import { Checkbox } from '@chakra-ui/react'
import { Stack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { RadioGroup } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import { Radio } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { CheckboxGroup } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { getMeetings } from '../utils/axios/meetings'
import { useGetMeetings } from '../utils/react-query/meetings'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import groupBy from 'lodash/groupBy'
import { Flex } from '@chakra-ui/react'
import { Heading } from '@chakra-ui/react'
import { Link } from '@chakra-ui/react'
import { Center } from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/react'
import { handleFilterMeetings } from '../utils/function'
import slugify from 'slugify'
import { Tag } from '@chakra-ui/react'

export default function Home({ filterGroups }) {
  const router = useRouter()
  const query = router.query

  const filterQuery = [].concat(query.filter || [])

  const { data: meetings, isLoading } = useGetMeetings({
    filter: filterQuery,
    sort: query.sort || 'date-desc',
    dateRange: query?.dateRange || [],
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
      filter: values,
      sort: query.sort || 'date-desc',
    })
  }

  const handleSetSort = (value) => {
    updateRouteQuery({
      filter: query.filter || [],
      sort: value,
    })
  }

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
              <RadioGroup
                value={query?.sort || 'date-desc'}
                onChange={handleSetSort}
              >
                <Stack>
                  <Radio value="date-desc">Meeting Date (Desc)</Radio>
                  <Radio value="date-asc">Meeting Date (Asc)</Radio>
                  <Radio value="name-desc">Meeting Name (Desc)</Radio>
                  <Radio value="name-asc">Meeting Name (Asc)</Radio>
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
          <Box rounded="md" borderWidth="1px" p="3">
            <fieldset>
              <Box mb="2">
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
                        colorScheme="blue"
                        borderRadius="full"
                      >
                        {fg.count}
                      </Tag>
                    </Flex>
                  ))}
                </Stack>
              </CheckboxGroup>
            </fieldset>
          </Box>
        </div>
      </Box>
      <Box as="main" w={3 / 4} ml="auto" px="3">
        {isLoading || !meetings ? (
          <Center h="20">
            <Spinner />
          </Center>
        ) : (
          <Stack>
            {(meetings || []).map((meeting) => (
              <Box key={meeting.id} borderWidth="1px" rounded="md" p="4">
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
                    {meeting.links.map((link, idx) => (
                      <Box key={idx}>
                        <Link
                          color="blue.500"
                          fontWeight="medium"
                          href={link.linkUrl}
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
        )}
      </Box>
    </Box>
  )
}

export async function getServerSideProps({ query }) {
  const queryClient = new QueryClient()

  const filterQuery = [].concat(query.filter || [])
  const filterParams = {
    filter: filterQuery,
    sort: query.sort || 'date-desc',
    dateRange: query?.dateRange || [],
  }

  const meetings = await getMeetings()
  const filterGroups = Object.entries(groupBy(meetings, 'meetingGroup'))
    .map(([key, value]) => ({
      label: key,
      value: slugify(key),
      count: value.length,
    }))
    .sort((a, b) => a.value.localeCompare(b.value))

  console.log(filterGroups)

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
