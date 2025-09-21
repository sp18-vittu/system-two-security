import React, { useState, useEffect } from 'react'
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
} from 'date-fns'

interface TimeAgoProps {
  createdAt: string // ISO date string passed as a prop
}

const TimeAgo: React.FC<TimeAgoProps> = ({ createdAt }) => {
  const [timeAgo, setTimeAgo] = useState<string>('')

  useEffect(() => {
    const calculateTimeDifference = () => {
      if(!createdAt) return
      const date = new Date(createdAt)
      const now = new Date()

      const years = differenceInYears(now, date)
      if (years > 0) {
        setTimeAgo(`${years} ${years > 1 ? 'years' : 'year'} ago`)
        return
      }

      const months = differenceInMonths(now, date)
      if (months > 0) {
        setTimeAgo(`${months} ${months > 1 ? 'months' : 'month'} ago`)
        return
      }

      const weeks = differenceInWeeks(now, date)
      if (weeks > 0) {
        setTimeAgo(`${weeks} ${weeks > 1 ? 'weeks' : 'week'} ago`)
        return
      }

      const days = differenceInDays(now, date)
      if (days > 0) {
        setTimeAgo(`${days} ${days > 1 ? 'days' : 'day'} ago`)
        return
      }

      const hours = differenceInHours(now, date)
      if (hours > 0) {
        setTimeAgo(`${hours} ${hours > 1 ? 'hours' : 'hour'} ago`)
        return
      }

      const minutes = differenceInMinutes(now, date)
      setTimeAgo(`${minutes} ${minutes > 1 ? 'minutes' : 'minute'} ago`)
    }

    // Calculate time difference when component mounts
    calculateTimeDifference()

    // Optionally, update every minute
    const intervalId = setInterval(calculateTimeDifference, 60000)

    // Clear interval on component unmount
    return () => clearInterval(intervalId)
  }, [createdAt])

  return <span>{timeAgo}</span>
}

export default TimeAgo
