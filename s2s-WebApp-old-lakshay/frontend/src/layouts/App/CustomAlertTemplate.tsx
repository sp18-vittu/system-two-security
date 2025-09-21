import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'

const CustomAlertTemplate = ({ message, options, close }: any) => {
  const { timeout, position, type } = options
  const [progress, setProgress] = useState(100) // Start with full progress (100%)

  // Calculate the width of the alert based on message length
  const alertWidth = '25%' // Adjust the max width as needed

  // Set up a progress bar timer based on the timeout
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval)
          close() // Close the alert when progress is done
          return 0
        }
        return prev - 100 / (timeout / 100) // Adjust the progress decrement based on timeout
      })
    }, 100)

    return () => clearInterval(interval) // Clean up the interval on component unmount
  }, [timeout, close])

  // Conditionally set the background color based on alert type
  const getAlertBackgroundColor = () => {
    switch (options.type) {
      case 'success':
        return '#4CAF50' // Green for success
      case 'warning':
        return '#FF9800' // Orange for warning
      case 'info':
        return '#2196F3' // Blue for info
      case 'error':
        return '#F44336' // Red for error
      default:
        return '#4CAF50' // Default to success if no type is provided
    }
  }

  // Center the alert (top or bottom) using Flexbox
  const alertPositionStyle = position.includes('top')
    ? { top: '10px', transform: 'translateX(-50%)', left: '50%' }
    : position.includes('bottom')
    ? { bottom: '10px', transform: 'translateX(-50%)', left: '50%' }
    : {} // Default position if no top or bottom is specified

  return (
    <div
      className='custom-alert'
      style={{
        backgroundColor: 'white', // Set dynamic background color
        color: '#000', // White text
        padding: '10px 20px',
        borderRadius: '5px',
        position: 'absolute',
        ...alertPositionStyle, // Apply the calculated position style
        zIndex: 1000,
        width: alertWidth, // Dynamically adjust width based on message length
      }}
    >
      <div>{message}</div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: `${progress}%`, // Adjust width based on progress state
          height: '5px',
          backgroundColor: getAlertBackgroundColor(), // Yellow color for the progress bar (you can adjust)
          borderRadius: '5px 5px 0 0',
        }}
      ></div>

      <button onClick={close} style={{ position: 'absolute', top: '5px', right: '10px' }}>
        <CloseIcon className='text-gray-800 hover:text-gray-600' />
      </button>
    </div>
  )
}

export default CustomAlertTemplate
