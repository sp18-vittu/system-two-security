import { Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material'
import { useState } from 'react'

import useWindowResolution from '../../../layouts/Dashboard/useWindowResolution'

function AttackGraph({ brief }: any) {
  const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(() => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: '#fff',
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#fff',
      color: '#000',
    },
  }))

  const { height } = useWindowResolution()
  const dynamicHeight = Math.max(400, height * 0.8)
  const [scale, setScale] = useState(1) // Default scale for zoom
  const [position, setPosition] = useState({ x: 0, y: 0 }) // For pan
  const [isDragging, setIsDragging] = useState(false) // Track drag state
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 }) // Initial mouse position during drag

  // Handlers
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 5)) // Max zoom level
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5)) // Min zoom level
  const resetZoom = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => setIsDragging(false)

  const handleMouseLeave = () => setIsDragging(false) // Stop dragging if the cursor leaves the container

  return (
    <div className='w-full  p-6'>
      <div className='flex flex-col items-start space-y-4'>
        <div className='flex space-x-4'>
          <button onClick={() => zoomIn()}>
            <BootstrapTooltip
              title={
                <div>
                  <h2>zoom in</h2>
                </div>
              }
              arrow
              placement='top'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 22 22'
                fill='none'
              >
                <path
                  d='M21 21L16.65 16.65M11 8V14M8 11H14M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z'
                  stroke='white'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                />
              </svg>
            </BootstrapTooltip>
          </button>
          <button onClick={() => zoomOut()}>
            <BootstrapTooltip
              title={
                <div>
                  <h2>zoom out</h2>
                </div>
              }
              arrow
              placement='top'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 22 22'
                fill='none'
              >
                <path
                  d='M21 21L16.65 16.65M8 11H14M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z'
                  stroke='white'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                />
              </svg>
            </BootstrapTooltip>
          </button>
          <button onClick={() => resetZoom()}>
            <BootstrapTooltip
              title={
                <div>
                  <h2>reset view</h2>
                </div>
              }
              arrow
              placement='top'
            >
              <svg
                className='mt-0.5'
                width='22'
                height='22'
                viewBox='0 0 22 22'
                xmlns='http://www.w3.org/2000/svg'
              >
                <g
                  fill='none'
                  fill-rule='evenodd'
                  stroke='#fff'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  transform='matrix(0 1 1 0 2.5 2.5)'
                >
                  <path d='m3.98652376 1.07807068c-2.38377179 1.38514556-3.98652376 3.96636605-3.98652376 6.92192932 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8' />
                  <path d='m4 1v4h-4' transform='matrix(1 0 0 -1 0 6)' />
                </g>
              </svg>
            </BootstrapTooltip>
          </button>
        </div>
        <div
          className='relative overflow-y-scroll max-h-[690px] scrollbar-hide w-full  border border-gray-300 rounded-lg cursor-grab'
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{
            cursor: isDragging ? 'grabbing' : 'grab', // Change cursor during drag
            maxHeight: `calc(${dynamicHeight}px - 75px)`,
          }}
        >
          <div
            className='w-full h-full flex items-center justify-center transform'
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: 'center center', // Scale from the center
            }}
          >
            <img
              src={brief?.attackFlow}
              alt='Attack Flow'
              className='w-auto h-auto'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttackGraph
