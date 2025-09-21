import React from 'react'
interface RepoProcessDialogProps {
  isOpen: boolean
}

const RepoProcessDialog: React.FC<RepoProcessDialogProps> = ({ isOpen }) => {
  if (!isOpen) return null
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-[#1d2939] rounded-lg p-10 flex flex-col gap-6 items-center justify-center relative shadow-xl'>
        <div className='flex flex-col gap-0 items-center justify-start'>
          <div className='p-6 flex flex-col gap-4 items-center justify-start relative'>
            <div className='bg-[#32435a] rounded-full w-12 h-12 flex items-center justify-center relative'>
              <svg
                className='animate-combined-spin-blink-color'
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
              >
                <path
                  d='M12 2V6M12 18V22M6 12H2M22 12H18M19.0784 19.0784L16.25 16.25M19.0784 4.99994L16.25 7.82837M4.92157 19.0784L7.75 16.25M4.92157 4.99994L7.75 7.82837'
                  stroke='white'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                />
              </svg>
            </div>
            <div className='flex flex-col gap-1 items-center justify-start relative'>
              <div className='text-white text-lg font-semibold text-center'>
                {'Adding DAC Repo...'}
              </div>
              <div className='text-gray-400 text-md text-center'>
                {'The process may take 2 to 3 min'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RepoProcessDialog
