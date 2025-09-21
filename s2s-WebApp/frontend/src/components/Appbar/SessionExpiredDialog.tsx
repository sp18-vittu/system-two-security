import React from 'react'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'

interface SessionExpiredDialogProps {
  isOpen: boolean
  onClose: () => void
}

const SessionExpiredDialog: React.FC<SessionExpiredDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className=' justify-center backdrop-blur-sm items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
      <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
        <div className='bg-white rounded-lg p-6 shadow-lg w-[400px]'>
          <div className='flex justify-center mb-4'>
            <div className='flex justify-center items-center mt-[-35px] mr-[35px]'>
              <div className='relative'>
                <div className='w-12 h-12 rounded-full bg-[#FFFAEB] absolute'></div>

                <div className='w-8 h-8 rounded-full bg-[#FEF0C7] absolute top-2 left-2 flex justify-center items-center'>
                  <AccessAlarmIcon style={{ width: 20, height: 20, color: '#DC6803' }} />
                </div>
              </div>
            </div>
          </div>
          <div className='text-center mb-8 mt-8'>
            <h2 className='text-lg font-semibold text-gray-800'>Session Expired</h2>
            <p className='text-gray-600'>Please log in again.</p>
          </div>
          <div className='text-center'>
            <button
              onClick={onClose}
              className='bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-[10px] w-full'
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionExpiredDialog
