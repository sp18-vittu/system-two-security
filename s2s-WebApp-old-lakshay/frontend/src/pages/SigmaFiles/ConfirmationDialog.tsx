import React from 'react'
import CloseIcon from '@mui/icons-material/Close'

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  message?: string
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-lg shadow-lg w-96 h-auto p-6 relative'>
        {/* Delete Icon on the left */}
        <div className='absolute top-2 left-4'>
          <div
            className='Content'
            style={{
              alignSelf: 'stretch',
              height: '160px',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: '16px',
              display: 'flex',
            }}
          >
            <div
              className='FeaturedIcon'
              style={{
                width: '48px',
                height: '48px',
                padding: '12px',
                background: '#FEE4E2',
                borderRadius: '28px',
                border: '8px solid #FEF3F2',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'inline-flex',
              }}
            >
              {/* Using Material-UI Delete Icon */}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
              >
                <path
                  d='M4.93 4.93L19.07 19.07M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z'
                  stroke='#D92D20'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Close Icon on the right */}
        <div className='absolute top-4 right-4 cursor-pointer' onClick={onClose}>
          <CloseIcon className='text-gray-800 hover:text-gray-600' />
        </div>

        <h2 className=' text-lg font-semibold text-gray-800 mt-8'>Discard Updates</h2>
        <p className='mt-1 text-gray-600 '>{message}</p>

        <div className='mt-6 flex justify-center space-x-2 w-full'>
          <button
            onClick={onClose}
            className='px-4 py-2 border border-gray-300 bg-[#fff] rounded-lg hover:bg-[#6941C6] text-[#344054] hover:text-white transition w-full '
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className='px-4 py-2 bg-[#EE7103] text-white rounded-lg hover:bg-[#6941C6] transition w-full'
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationDialog
