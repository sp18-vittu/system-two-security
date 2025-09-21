import React from 'react'
import Notification from './Notification'
import './Notification.css'

const NotificationList = ({
  notificationmessages,
  handleClear,
  handleClearAll,
  closeMenuNotification,
  datavalut,
}: any) => {
  return (
    <div className='absolute right-0 mt-4 w-80 bg-white rounded-lg shadow-lg z-[999px] p-2'>
      <div className='flex justify-between items-center mb-2'>
        <h3 className='font-semibold text-lg'></h3>
        <button
          type='button'
          className='cursor-pointer  text-[14px] text-[#344054]'
          onClick={handleClearAll}
        >
          Clear All
        </button>
      </div>
      <div className='h-80 overflow-y-auto scrollbar scrollbar-thumb-gray-700 scrollbar-track-gray-300 scrollbar-thumb-rounded scrollbar-hide'>
        {notificationmessages?.length > 0 ? (
          <>
            {notificationmessages.map((notification: any, index: any) => (
              <Notification
                key={index}
                data={notification}
                handleClear={handleClear}
                index={index}
                closeMenuNotification={closeMenuNotification}
                datavalut={datavalut}
              />
            ))}
          </>
        ) : (
          <a href='#' className='block px-4 py-2 text-gray-800 hover:bg-gray-100'>
            No Data
          </a>
        )}
      </div>
    </div>
  )
}

export default NotificationList
