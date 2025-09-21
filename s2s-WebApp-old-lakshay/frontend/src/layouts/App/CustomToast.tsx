import React from 'react'
import CloseIcon from '@mui/icons-material/Close'

interface CustomToastProps {
  message: string
  onClose: () => void
}

const CustomToast: React.FC<CustomToastProps> = ({ message, onClose }) => {
  return (
    <div className='flex justify-between items-center w-full'>
      <span>{message}</span>
      <CloseIcon className='text-gray-800 hover:text-gray-600' onClick={onClose} />
    </div>
  )
}

export default CustomToast
