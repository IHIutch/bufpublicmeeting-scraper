import React, { useRef } from 'react'
import { getWeeksInMonth, createCalendar } from '@internationalized/date'
import { useLocale } from '@react-aria/i18n'
import { useRangeCalendarState } from 'react-stately'
import {
  useCalendarGrid,
  useRangeCalendar,
  useCalendarCell,
} from '@react-aria/calendar'
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Box,
  Heading,
  Flex,
} from '@chakra-ui/react'
import { useButton } from '@react-aria/button'
import { isSameDay } from '@internationalized/date'

export default function RangeCalendar(props) {
  const { locale } = useLocale()
  const state = useRangeCalendarState({
    ...props,
    locale,
    createCalendar,
  })

  const ref = useRef()
  const { calendarProps, prevButtonProps, nextButtonProps, title } =
    useRangeCalendar(props, state, ref)

  return (
    <Box {...calendarProps} ref={ref} className="calendar">
      <Flex justify="space-between" align="center">
        <CalendarButton size="sm" {...prevButtonProps}>
          &lt;
        </CalendarButton>
        <Heading as="h2" fontSize="lg">
          {title}
        </Heading>
        <CalendarButton size="sm" {...nextButtonProps}>
          &gt;
        </CalendarButton>
      </Flex>
      <CalendarGrid state={state} />
    </Box>
  )
}

const CalendarGrid = ({ state, ...props }) => {
  const { locale } = useLocale()
  const { gridProps, headerProps, weekDays } = useCalendarGrid(props, state)

  // Get the number of weeks in the month so we can render the proper number of rows.
  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale)

  return (
    <Table {...gridProps} size="sm">
      <Thead {...headerProps}>
        <Tr>
          {weekDays.map((day, index) => (
            <Th px="0" textAlign="center" key={index}>
              {day}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <Tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex)
              .map((date, i) =>
                date ? (
                  <CalendarCell key={i} state={state} date={date} />
                ) : (
                  <Td border="none" px="0" textAlign="center" key={i} />
                )
              )}
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

const CalendarCell = ({ state, date }) => {
  const ref = useRef()
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    isUnavailable,
    formattedDate,
  } = useCalendarCell({ date }, state, ref)

  // The start and end date of the selected range will have
  // an emphasized appearance.
  const isSelectionStart = state.highlightedRange
    ? isSameDay(date, state.highlightedRange.start)
    : isSelected
  const isSelectionEnd = state.highlightedRange
    ? isSameDay(date, state.highlightedRange.end)
    : isSelected

  return (
    <Td border="none" p="0" textAlign="center" h="9" {...cellProps}>
      <Flex
        {...buttonProps}
        ref={ref}
        hidden={isOutsideVisibleRange}
        bg={isSelected && 'blue.50'}
        boxSize="full"
        roundedLeft={isSelectionStart && 'full'}
        roundedRight={isSelectionEnd && 'full'}
      >
        <Flex
          boxSize="full"
          rounded={(isSelectionStart || isSelectionEnd) && 'full'}
          color={(isSelectionStart || isSelectionEnd) && 'white'}
          bg={(isSelectionStart || isSelectionEnd) && 'blue.500'}
          align="center"
          justify="center"
        >
          {formattedDate}
        </Flex>
      </Flex>
    </Td>
  )
}

const CalendarButton = (props) => {
  let ref = useRef()
  let { buttonProps } = useButton(props, ref)
  return (
    <Button {...buttonProps} ref={ref} size="sm">
      {props.children}
    </Button>
  )
}
