import React from 'react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

interface NotificationProps {
  data: any
  handleClear: any
  index: any
  closeMenuNotification: any
  datavalut: any
}

const Notification = ({ data, handleClear, index, closeMenuNotification }: NotificationProps) => {
  const navigateTo = useNavigate()
  const handlenavvalut = (value: any) => {
    sessionStorage.setItem('active', 'sources')
    navigateTo('/app/sourcespage')
    sessionStorage.setItem('srcactiveTab', JSON.stringify(1))
  }

  const handlenavvalutreport = (value: any) => {
    sessionStorage.setItem('active', 'sources')
    navigateTo('/app/sourcespage')
    sessionStorage.setItem('srcactiveTab', JSON.stringify(1))
  }

  return (
    <div className='flex justify-between items-center p-2 border-b border-gray-200'>
      <div className='items-center'>
        <div className='flex items-center w-64'>
          {data.eventType == 'document locked' && (
            <p className='cursor-pointer font-bold text-[14px] text-[#f1f1f1] truncate hover:underline hover:text-[#EE7103]'>
              {'Document Locked'}
            </p>
          )}
          {data.eventType == 'document unlocked' && (
            <p className='cursor-pointer font-bold text-[14px] text-[#f1f1f1] truncate hover:underline hover:text-[#EE7103]'>
              {'Document Unlocked'}
            </p>
          )}
          {data.eventType == 'datavault created' && (
            <p
              className='cursor-pointer font-bold text-[14px] text-[#f1f1f1] truncate hover:underline hover:text-[#EE7103]'
              onClick={() => handlenavvalut(data?.data)}
            >
              {'Repository Created'}
            </p>
          )}
          {data.eventType == 'cti processing failed' && (
            <p
              className='cursor-pointer font-bold text-[14px] text-[#f1f1f1] truncate hover:underline hover:text-[#EE7103]'
              onClick={() => handlenavvalut(data?.data?.datavault)}
            >
              {'Report processing failed '}
            </p>
          )}
          {data.eventType == 'cti analysing failed' && (
            <p
              className='cursor-pointer font-bold text-[14px] text-[#f1f1f1] truncate hover:underline hover:text-[#EE7103]'
              onClick={() => handlenavvalut(data?.data?.datavault)}
            >
              {'Report IoCs failed '}
            </p>
          )}
          {data.eventType == 'datavault deleted' && (
            <p className=' font-bold text-[14px] text-[#f1f1f1] truncate'>{'Repository Deleted'}</p>
          )}
          {data.eventType == 'cti processing completed' && (
            <p
              className='cursor-pointer font-bold text-[14px] text-[#f1f1f1] truncate hover:underline hover:text-[#EE7103]'
              onClick={() => handlenavvalutreport(data?.data)}
            >
              {'Report processed successfully.'}
            </p>
          )}
          {data.eventType == 'cti analysing completed' && (
            <p
              className='cursor-pointer font-bold text-[14px] text-[#f1f1f1] truncate hover:underline hover:text-[#EE7103]'
              onClick={() => handlenavvalut(data?.data?.datavault)}
            >
              {'Report IoCs updated successfully'}
            </p>
          )}
          {data.eventType == 'threatbrief processing started' && (
            <p className='cursor-pointer font-bold text-[14px] text-[#f1f1f1] truncate hover:underline hover:text-[#EE7103]'>
              {'Threat Briefs Processing'}
            </p>
          )}
          {data.eventType == 'threatbrief generatesigma completed' && (
            <p className='cursor-pointer font-bold text-[14px] text-[#f1f1f1] truncate hover:underline hover:text-[#EE7103]'>
              {'Threat Briefs Processing'}
            </p>
          )}
          {data.eventType == 'threatbrief processing succeeded' && (
            <p className='cursor-pointer font-bold text-[14px] text-[#f1f1f1] truncate hover:underline hover:text-[#EE7103]'>
              {'Threat Briefs Completed'}
            </p>
          )}
          {data.eventType == 'threatbrief processing failed' && (
            <p className='cursor-pointer font-bold text-[14px] text-[#f1f1f1] truncate hover:underline hover:text-[#EE7103]'>
              {'Threat Briefs Processing Failed'}
            </p>
          )}
          {data.eventType == 'query executed' && (
            <p className='cursor-pointer font-bold text-[14px] text-[#f1f1f1] truncate hover:underline hover:text-[#EE7103]'>
              {data?.data?.target ? data?.data?.target + ' ' + 'Query Executed' : 'Query Executed'}
            </p>
          )}
          {data.eventType == 'user created' && (
            <p className='font-bold text-[14px] text-[#f1f1f1] truncate'>
              {'User ' + data?.data?.firstName + ' created'}
            </p>
          )}
          {data.eventType == 'user deleted' && (
            <p className='font-bold text-[14px] text-[#f1f1f1] truncate'>
              {'User ' + data?.data?.firstName + ' deleted'}
            </p>
          )}

          {data.eventType == 'imported DAC' && (
            <p className='font-bold text-[14px] text-[#f1f1f1] truncate'>
              {'DAC ' + data?.data?.name}
            </p>
          )}

          {data.eventType == 'deleting DAC' && (
            <p className='font-bold text-[14px] text-[#f1f1f1] truncate'>
              {'DAC Deleting ' + data?.data?.name}
            </p>
          )}
          {data.eventType == 'deleted DAC' && (
            <p className='font-bold text-[14px] text-[#f1f1f1] truncate'>
              {'DAC Deleted ' + data?.data?.name}
            </p>
          )}
        </div>
        {data?.create_at && (
          <p className='text-[12px] font-medium text-[#f1f1f1]'>
            {moment(data?.create_at).format('MM-DD-YYYY - hh:mm A')}
          </p>
        )}
      </div>

      <button
        type='button'
        className={`ml-2 text-[#f1f1f1]  ${data?.create_at ? 'mt-[-20px]' : ''}`}
        onClick={() => {
          handleClear(data, index), closeMenuNotification('clear')
        }}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path
            fillRule='evenodd'
            d='M10 8.586L5.707 4.293a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 001.414 1.414L10 11.414l4.293 4.293a1 1 0 001.414-1.414L11.414 10l4.293-4.293a1 1 0 00-1.414-1.414L10 8.586z'
            clipRule='evenodd'
          />
        </svg>
      </button>
    </div>
  )
}

export default Notification
