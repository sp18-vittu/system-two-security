import React, { ReactNode, useState } from 'react'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className='relative inline-block z-[100]'>
      <div
        className='cursor-pointer'
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>
      {visible && (
        <div className='absolute top-full mt-2 w-auto max-w-xs p-2 text-sm text-white bg-black rounded-md shadow-lg transition-opacity duration-300 opacity-100'>
          {content}
        </div>
      )}
    </div>
  )
}

export default Tooltip
