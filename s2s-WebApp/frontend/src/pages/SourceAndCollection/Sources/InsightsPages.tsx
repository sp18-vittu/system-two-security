import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'

import CircularProgress from '@mui/material/CircularProgress'
import ThreatebriefAccordian from './ThreatebriefAccordian'
import useWindowResolution from '../../../layouts/Dashboard/useWindowResolution'

function InsightsPages({ brief, loader }: any) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { height } = useWindowResolution()
  const dynamicHeight = Math.max(400, height * 0.8)
  // Toggle expanded state
  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const renderers = {
    text: ({ children }: any) => (
      <span className='font-medium text-base text-[#98A2B3]'>{children}</span>
    ),
  }

  return (
    <div className='mx-auto shadow-lg w-full  p-6'>
      {brief ? (
        <div className='grid grid-cols-12 gap-2'>
          {/* Left Side: Threat Summary */}
          <div
            className='col-span-4 overflow-y-scroll scrollbar-hide max-lg:col-span-12 max-lg:!max-h-[unset] max-lg:overflow-y-auto'
            style={{ maxHeight: `calc(${dynamicHeight}px - 20px)` }}
          >
            <div className='w-full h-auto p-8 bg-[#1D2939] rounded-md flex flex-col justify-start gap-5'>
              {/* Summary Section (Always visible) */}
              <h2 className='text-white text-2xl font-semibold leading-5 break-words '>Summary</h2>

              {/* Key Points Section (Expandable) */}
              <div
                className={`flex flex-col justify-start items-start gap-2 overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'h-auto' : 'max-h-[500px] max-lg:max-h-[200px]'
                }`}
              >
                <ul>
                  {brief &&
                    brief?.summary?.split('<br>')?.map((item: any, index: number) => {
                      if (!item) return <div key={index}></div>
                      return (
                        <li key={index} className='flex justify-start items-center'>
                          <ReactMarkdown
                            components={{ text: renderers.text }}
                            className='font-medium font-inter text-base text-[#98A2B3] markDown-ThreadBreif'
                          >
                            {item}
                          </ReactMarkdown>
                        </li>
                      )
                    })}
                </ul>
              </div>

              {/* Learn More Button */}
              <button
                onClick={toggleExpand}
                className='flex justify-end items-end gap-2 text-[#EE7103] text-lg font-semibold leading-6 mt-4'
              >
                {isExpanded ? 'Close' : 'Learn More'}
              </button>
            </div>
          </div>

          <div
            className='col-span-8 overflow-y-scroll max-lg:col-span-12 max-lg:!max-h-[unset] max-lg:overflow-y-auto'
            style={{ maxHeight: `calc(${dynamicHeight}px - 20px)` }}
          >
            <ThreatebriefAccordian brief={brief} />
          </div>
        </div>
      ) : (
        <>
          {loader ? (
            <div className='flex items-center justify-center min-h-screen mt-[-200px]'>
              <CircularProgress size='3rem' sx={{ color: '#EE7103' }} />
            </div>
          ) : (
            <div
              className='flex items-center justify-center min-h-screen mt-[-200px] text-white'
              style={{ maxHeight: `calc(${dynamicHeight}px - 75px)` }}
            >
              Data Not Available
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default InsightsPages
