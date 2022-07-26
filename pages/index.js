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
    <div className="container mx-auto px-4 flex">
      <aside className="w-1/4 sticky top-0 h-screen overflow-y-scroll px-3">
        <div className="my-5">
          <h2 className="font-medium text-2xl mb-2">Sorting &amp; Filters</h2>
          <div className="border rounded p-3 mb-4">
            <fieldset>
              <legend className="font-medium text-xl">Sort by:</legend>
              <div>
                <label className="cursor-pointer hover:underline flex items-center py-1">
                  <input
                    className="mr-2"
                    type="radio"
                    name="sorting"
                    onChange={(e) => updateRouteQuery(e.target.value)}
                  />
                  <span>Meeting Date (Desc)</span>
                </label>
              </div>
              <div>
                <label className="cursor-pointer hover:underline flex items-center py-1">
                  <input
                    className="mr-2"
                    type="radio"
                    name="sorting"
                    onChange={(e) => updateRouteQuery(e.target.value)}
                  />
                  <span>Meeting Date (Asc)</span>
                </label>
              </div>
              <div>
                <label className="cursor-pointer hover:underline flex items-center py-1">
                  <input
                    className="mr-2"
                    type="radio"
                    name="sorting"
                    onChange={(e) => updateRouteQuery(e.target.value)}
                  />
                  <span>Meeting Name (Desc)</span>
                </label>
              </div>
              <div>
                <label className="cursor-pointer hover:underline flex items-center py-1">
                  <input
                    className="mr-2"
                    type="radio"
                    name="sorting"
                    onChange={(e) => updateRouteQuery(e.target.value)}
                  />
                  <span>Meeting Name (Asc)</span>
                </label>
              </div>
            </fieldset>
          </div>
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
          <div className="border rounded p-3">
            <fieldset>
              <legend className="font-medium text-xl">
                Filter Meeting Type:
              </legend>
              <button
                disabled={filters.length}
                className="cursor-pointer hover:underline text-teal-700 focus:outline-none"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
              {Object.entries(filterGroups).map(([key, val], idx) => (
                <div key={key}>
                  <label className="cursor-pointer hover:underline flex items-center py-1">
                    <input
                      className="mr-2 cursor-pointer"
                      type="checkbox"
                      name="filtering"
                      onChange={(e) => updateRouteQuery(e.target.value)}
                    />
                    <div>
                      <span className="mr-2">{val.text}</span>
                      <span className="px-2 inline-block text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {val.values.length}
                      </span>
                    </div>
                  </label>
                </div>
              ))}
            </fieldset>
          </div>
        </div>
      </aside>
      <main role="main" className="w-3/4 ml-auto px-3">
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
      </main>
    </div>
  )
}

export async function getStaticProps() {
  const urlify = (string) => {
    return string.split(' ').join('-').toLowerCase()
  }

  const res = await fetch(
    'https://raw.githubusercontent.com/IHIutch/bufpublicmeeting-scraper/data/index.json'
  )
  const json = await res.json()

  const meetingData = json.map((meeting) => {
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
