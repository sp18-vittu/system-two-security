import React from 'react'
import Notification from '../Appbar/Notification'
import { useLocation, useParams } from 'react-router-dom'
import '../Appbar/Notification.css'

function NotificationSidebar({
  openNotification,
  notificationmessages,
  handleClear,
  handleClearAll,
  closeMenuNotification,
  datavalut,
}: any) {
  const { id } = useParams()
  const location = useLocation()

  return (
    <div
      className={`bg-[#101828] fixed right-0 ${
        location.pathname == `/app/Repository/${id}` ||
        location.pathname == `/app/VaultPermission/${id}`
          ? 'top-[110px]'
          : 'top-[70px]'
      } h-screen w-[350px] transition-all duration-300 ease-in z-50
        ${openNotification ? 'translate-x-0' : 'translate-x-full'}
        `}
    >
      <div className='relative'>
        <div id='list' className={`p-[24px]`} onClick={(e) => e.stopPropagation()}>
          <div className='flex flex-col justify-between items-center mb-4'>
            <div className='flex justify-between items-center mb-2 w-full'>
              <div>
                <h3 className='font-semibold text-lg text-[#f1f1f1]'>Notification</h3>
              </div>
              <div>
                <button
                  type='button'
                  className='cursor-pointer  text-[14px] text-[#f1f1f1]'
                  onClick={handleClearAll}
                >
                  Clear All
                </button>
              </div>
            </div>
            <div className='h-[796px] overflow-y-auto scrollbar scrollbar-thumb-gray-700 scrollbar-track-gray-300 scrollbar-thumb-rounded w-full'>
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
        </div>
      </div>
    </div>
  )
}

export default NotificationSidebar
