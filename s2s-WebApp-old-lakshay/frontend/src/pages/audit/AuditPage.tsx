import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AuditList } from '../../redux/nodes/audit/action'
import local from '../../utils/local'
const AuditPage: React.FC = () => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  const [showdropdown, setShowDropdown] = React.useState(false)
  const [dayList, setdayList] = useState([])

  const tenantDetails = useSelector((state: any) => state.AuditDetailreducer)
  const { auditDetail } = tenantDetails

  useEffect(() => {
    Axios.get('../assets/audit.json').then((response) => {
      setdayList(response.data.dayLists)
    })
  }, [])

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(AuditList(token) as any)
  }, [])

  const auditDropdown = () => {
    {
      showdropdown ? setShowDropdown(false) : null
    }
  }
  return (
    <>
      <div className='pt-16 bg-slate-200 w-full h-fit pb-20' onClick={auditDropdown}>
        <div className='container'>
          <div className='fixed top-20 right-9'>
            {showdropdown ? (
              <div data-te-dropdown-position='dropstart'>
                <button
                  className='bg-teal-800 text-white focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center '
                  onClick={() => setShowDropdown(false)}
                  type='button'
                >
                  Today
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='none'
                  >
                    <path
                      d='M15 12.5L10 7.5L5 12.5'
                      stroke='white'
                      strokeWidth='1.66667'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                className='text-gray-700 bg-white focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center '
                onClick={() => setShowDropdown(true)}
                type='button'
              >
                Today
                <svg
                  className='w-2.5 h-2.5 ml-2.5'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 10 6'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 1 4 4 4-4'
                  />
                </svg>
              </button>
            )}
            {showdropdown ? (
              <>
                <div className='fixed right-5 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44'>
                  <ul className='py-2 text-sm text-gray-700'>
                    {dayList?.map((item: any, key: any) => (
                      <li key={key}>
                        <a className='cursor-pointer block px-4 py-2 hover:bg-gray-100 '>
                          {' '}
                          {item.dayListsname}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : null}
          </div>
          <div className='grid grid-cols-4 gap-3 mt-3 mx-9'>
            <div className='rounded-lg bg-white p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] h-24'>
              <div style={{ display: 'inline-flex' }}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='32'
                  height='32'
                  viewBox='0 0 32 32'
                  fill='none'
                >
                  <path
                    d='M10.6663 12.6667H15.9997M10.6663 17.3333H19.9997M16.6663 26.6667C22.9256 26.6667 27.9997 21.5926 27.9997 15.3333C27.9997 9.07411 22.9256 4 16.6663 4C10.4071 4 5.333 9.07411 5.333 15.3333C5.333 16.6 5.54079 17.8181 5.92416 18.9555C6.06842 19.3835 6.14056 19.5975 6.15357 19.7619C6.16641 19.9243 6.1567 20.0381 6.11653 20.1959C6.07586 20.3558 5.98606 20.522 5.80645 20.8544L3.62558 24.8911C3.3145 25.4669 3.15896 25.7548 3.19377 25.977C3.22409 26.1706 3.33799 26.341 3.50523 26.443C3.69723 26.5601 4.02273 26.5265 4.67372 26.4592L11.5017 25.7534C11.7085 25.732 11.8119 25.7213 11.9061 25.7249C11.9988 25.7284 12.0643 25.7371 12.1546 25.758C12.2465 25.7792 12.3621 25.8237 12.5932 25.9127C13.8573 26.3997 15.2306 26.6667 16.6663 26.6667Z'
                    stroke='#1570EF'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <h3 className='my-1 mx-1 text-sm font-semibold text-[#101828]'>
                  Total Conversations
                </h3>
              </div>
              <div className='px-1 text-lg text-[#101828] font-semibold'>
                <span>{auditDetail?.result?.total_conversations}</span>
              </div>
            </div>
            <div className='rounded-lg bg-white p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] h-24'>
              <div style={{ display: 'inline-flex' }}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='32'
                  height='32'
                  viewBox='0 0 32 32'
                  fill='none'
                >
                  <path
                    d='M10.6663 12.6667H15.9997M10.6663 17.3333H19.9997M16.6663 26.6667C22.9256 26.6667 27.9997 21.5926 27.9997 15.3333C27.9997 9.07411 22.9256 4 16.6663 4C10.4071 4 5.333 9.07411 5.333 15.3333C5.333 16.6 5.54079 17.8181 5.92416 18.9555C6.06842 19.3835 6.14056 19.5975 6.15357 19.7619C6.16641 19.9243 6.1567 20.0381 6.11653 20.1959C6.07586 20.3558 5.98606 20.522 5.80645 20.8544L3.62558 24.8911C3.3145 25.4669 3.15896 25.7548 3.19377 25.977C3.22409 26.1706 3.33799 26.341 3.50523 26.443C3.69723 26.5601 4.02273 26.5265 4.67372 26.4592L11.5017 25.7534C11.7085 25.732 11.8119 25.7213 11.9061 25.7249C11.9988 25.7284 12.0643 25.7371 12.1546 25.758C12.2465 25.7792 12.3621 25.8237 12.5932 25.9127C13.8573 26.3997 15.2306 26.6667 16.6663 26.6667Z'
                    stroke='#1570EF'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <h2 className='my-1 mx-1 text-sm font-semibold text-[#101828]'>Total Messages</h2>
              </div>
              <div className='px-1 text-lg text-[#101828] font-semibold'>
                <span>{auditDetail?.result?.total_messages}</span>
              </div>
            </div>
            <div className='rounded-lg bg-white p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] h-24'>
              <div style={{ display: 'inline-flex' }}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='32'
                  height='32'
                  viewBox='0 0 32 32'
                  fill='none'
                >
                  <path
                    d='M10.6663 12.6667H15.9997M10.6663 17.3333H19.9997M16.6663 26.6667C22.9256 26.6667 27.9997 21.5926 27.9997 15.3333C27.9997 9.07411 22.9256 4 16.6663 4C10.4071 4 5.333 9.07411 5.333 15.3333C5.333 16.6 5.54079 17.8181 5.92416 18.9555C6.06842 19.3835 6.14056 19.5975 6.15357 19.7619C6.16641 19.9243 6.1567 20.0381 6.11653 20.1959C6.07586 20.3558 5.98606 20.522 5.80645 20.8544L3.62558 24.8911C3.3145 25.4669 3.15896 25.7548 3.19377 25.977C3.22409 26.1706 3.33799 26.341 3.50523 26.443C3.69723 26.5601 4.02273 26.5265 4.67372 26.4592L11.5017 25.7534C11.7085 25.732 11.8119 25.7213 11.9061 25.7249C11.9988 25.7284 12.0643 25.7371 12.1546 25.758C12.2465 25.7792 12.3621 25.8237 12.5932 25.9127C13.8573 26.3997 15.2306 26.6667 16.6663 26.6667Z'
                    stroke='#1570EF'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <h2 className='my-1 mx-1 text-sm font-semibold text-[#101828]'>
                  Avg.Messages / User
                </h2>
              </div>
              <div className='px-1 text-lg text-[#101828] font-semibold'>
                <span>{auditDetail?.result?.prompts_per_user?.toFixed(2)}</span>
              </div>
            </div>
            <div className='rounded-lg bg-white p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] h-24'>
              <div style={{ display: 'inline-flex' }}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='32'
                  height='32'
                  viewBox='0 0 32 32'
                  fill='none'
                >
                  <path
                    d='M10.6663 12.6667H15.9997M10.6663 17.3333H19.9997M16.6663 26.6667C22.9256 26.6667 27.9997 21.5926 27.9997 15.3333C27.9997 9.07411 22.9256 4 16.6663 4C10.4071 4 5.333 9.07411 5.333 15.3333C5.333 16.6 5.54079 17.8181 5.92416 18.9555C6.06842 19.3835 6.14056 19.5975 6.15357 19.7619C6.16641 19.9243 6.1567 20.0381 6.11653 20.1959C6.07586 20.3558 5.98606 20.522 5.80645 20.8544L3.62558 24.8911C3.3145 25.4669 3.15896 25.7548 3.19377 25.977C3.22409 26.1706 3.33799 26.341 3.50523 26.443C3.69723 26.5601 4.02273 26.5265 4.67372 26.4592L11.5017 25.7534C11.7085 25.732 11.8119 25.7213 11.9061 25.7249C11.9988 25.7284 12.0643 25.7371 12.1546 25.758C12.2465 25.7792 12.3621 25.8237 12.5932 25.9127C13.8573 26.3997 15.2306 26.6667 16.6663 26.6667Z'
                    stroke='#1570EF'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <h2 className='my-1 mx-1 text-sm font-semibold text-[#101828]'>
                  Avg. Messages Token count
                </h2>
              </div>
              <div className='px-1 text-lg text-[#101828] font-semibold'>
                <span>{auditDetail?.result?.avg_prompt_token_count?.toFixed(2)}</span>
              </div>
            </div>
            <div className='rounded-lg bg-white p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] h-24'>
              <div style={{ display: 'inline-flex' }}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='32'
                  height='32'
                  viewBox='0 0 32 32'
                  fill='none'
                >
                  <path
                    d='M9.33317 29.3337V14.667M2.6665 17.3337V26.667C2.6665 28.1398 3.86041 29.3337 5.33317 29.3337H23.2348C25.2091 29.3337 26.8881 27.8932 27.1883 25.9419L28.6242 16.6086C28.997 14.1855 27.1223 12.0003 24.6707 12.0003H19.9998C19.2635 12.0003 18.6665 11.4034 18.6665 10.667V5.95478C18.6665 4.13898 17.1945 2.66699 15.3787 2.66699C14.9456 2.66699 14.5531 2.92205 14.3772 3.31782L9.68509 13.8752C9.47109 14.3567 8.99359 14.667 8.46667 14.667H5.33317C3.86041 14.667 2.6665 15.8609 2.6665 17.3337Z'
                    stroke='#079455'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <h2 className='my-1 mx-1 text-sm font-semibold text-[#101828]'>
                  Positivity Feedback
                </h2>
              </div>
              <div className='px-1 text-lg text-[#101828] font-semibold'>
                <span>{auditDetail?.result?.total_positive}%</span>
              </div>
            </div>
            <div className='rounded-lg bg-white p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] h-24'>
              <div style={{ display: 'inline-flex' }}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='32'
                  height='32'
                  viewBox='0 0 32 32'
                  fill='none'
                >
                  <path
                    d='M22.6666 2.66699V17.3337M29.3332 13.067V6.93366C29.3332 5.44019 29.3332 4.69345 29.0426 4.12302C28.7869 3.62125 28.379 3.2133 27.8772 2.95764C27.3068 2.66699 26.56 2.66699 25.0666 2.66699H10.8239C8.87528 2.66699 7.90096 2.66699 7.11402 3.02357C6.42044 3.33784 5.83097 3.84356 5.41489 4.48128C4.9428 5.20485 4.79465 6.16784 4.49834 8.09382L3.80091 12.6272C3.4101 15.1674 3.2147 16.4375 3.59165 17.4258C3.9225 18.2932 4.54477 19.0186 5.3518 19.4775C6.27128 20.0003 7.55635 20.0003 10.1265 20.0003H11.1999C11.9466 20.0003 12.32 20.0003 12.6052 20.1457C12.8561 20.2735 13.0601 20.4775 13.1879 20.7283C13.3332 21.0136 13.3332 21.3869 13.3332 22.1337V26.0459C13.3332 27.8617 14.8052 29.3337 16.621 29.3337C17.0541 29.3337 17.4466 29.0786 17.6225 28.6828L22.1035 18.6006C22.3073 18.142 22.4092 17.9127 22.5703 17.7446C22.7127 17.596 22.8875 17.4823 23.0812 17.4126C23.3002 17.3337 23.5511 17.3337 24.053 17.3337H25.0666C26.56 17.3337 27.3068 17.3337 27.8772 17.043C28.379 16.7873 28.7869 16.3794 29.0426 15.8776C29.3332 15.3072 29.3332 14.5605 29.3332 13.067Z'
                    stroke='#F04438'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <h2 className='my-1 mx-1 text-sm font-semibold text-[#101828]'>
                  Negative Feedback
                </h2>
              </div>
              <div className='px-1 text-lg text-[#101828] font-semibold'>
                <span>{auditDetail?.result?.total_negative}%</span>
              </div>
            </div>
            <div className='rounded-lg bg-white p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] h-24'>
              <div style={{ display: 'inline-flex' }}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='32'
                  height='32'
                  viewBox='0 0 32 32'
                  fill='none'
                >
                  <path
                    d='M10.6663 12.6667H15.9997M10.6663 17.3333H19.9997M16.6663 26.6667C22.9256 26.6667 27.9997 21.5926 27.9997 15.3333C27.9997 9.07411 22.9256 4 16.6663 4C10.4071 4 5.333 9.07411 5.333 15.3333C5.333 16.6 5.54079 17.8181 5.92416 18.9555C6.06842 19.3835 6.14056 19.5975 6.15357 19.7619C6.16641 19.9243 6.1567 20.0381 6.11653 20.1959C6.07586 20.3558 5.98606 20.522 5.80645 20.8544L3.62558 24.8911C3.3145 25.4669 3.15896 25.7548 3.19377 25.977C3.22409 26.1706 3.33799 26.341 3.50523 26.443C3.69723 26.5601 4.02273 26.5265 4.67372 26.4592L11.5017 25.7534C11.7085 25.732 11.8119 25.7213 11.9061 25.7249C11.9988 25.7284 12.0643 25.7371 12.1546 25.758C12.2465 25.7792 12.3621 25.8237 12.5932 25.9127C13.8573 26.3997 15.2306 26.6667 16.6663 26.6667Z'
                    stroke='#1570EF'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <h2 className='my-1 mx-1 text-sm font-semibold text-[#101828]'>
                  Avg. Response Token count
                </h2>
              </div>
              <div className='px-1 text-lg text-[#101828] font-semibold'>
                <span>{auditDetail?.result?.avg_response_token_count?.toFixed(2)}</span>
              </div>
            </div>
            <div className='rounded-lg bg-white p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] h-24'>
              <div style={{ display: 'inline-flex' }}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='32'
                  height='32'
                  viewBox='0 0 32 32'
                  fill='none'
                >
                  <path
                    d='M10.6663 12.6667H15.9997M10.6663 17.3333H19.9997M16.6663 26.6667C22.9256 26.6667 27.9997 21.5926 27.9997 15.3333C27.9997 9.07411 22.9256 4 16.6663 4C10.4071 4 5.333 9.07411 5.333 15.3333C5.333 16.6 5.54079 17.8181 5.92416 18.9555C6.06842 19.3835 6.14056 19.5975 6.15357 19.7619C6.16641 19.9243 6.1567 20.0381 6.11653 20.1959C6.07586 20.3558 5.98606 20.522 5.80645 20.8544L3.62558 24.8911C3.3145 25.4669 3.15896 25.7548 3.19377 25.977C3.22409 26.1706 3.33799 26.341 3.50523 26.443C3.69723 26.5601 4.02273 26.5265 4.67372 26.4592L11.5017 25.7534C11.7085 25.732 11.8119 25.7213 11.9061 25.7249C11.9988 25.7284 12.0643 25.7371 12.1546 25.758C12.2465 25.7792 12.3621 25.8237 12.5932 25.9127C13.8573 26.3997 15.2306 26.6667 16.6663 26.6667Z'
                    stroke='#1570EF'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <h2 className='my-1 mx-1 text-sm font-semibold text-[#101828]'>
                  Avg. Response Time taken
                </h2>
              </div>
              <div className='px-1 text-lg text-[#101828] font-semibold'>
                <span>{auditDetail?.result?.avg_response_time?.toFixed(2)}</span>
              </div>
            </div>
            <div className='rounded-lg bg-white p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] h-24'>
              <div style={{ display: 'inline-flex' }}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='32'
                  height='32'
                  viewBox='0 0 32 32'
                  fill='none'
                >
                  <path
                    d='M9.19984 15.2596V18.9633M9.19984 15.2596V6.3707C9.19984 5.1434 10.2147 4.14847 11.4665 4.14847C12.7183 4.14847 13.7332 5.1434 13.7332 6.3707M9.19984 15.2596C9.19984 14.0323 8.18502 13.0374 6.93317 13.0374C5.68133 13.0374 4.6665 14.0323 4.6665 15.2596V18.2225C4.6665 24.359 9.74061 29.3337 15.9998 29.3337C22.2591 29.3337 27.3332 24.359 27.3332 18.2225V10.8151C27.3332 9.58784 26.3184 8.59292 25.0665 8.59292C23.8147 8.59292 22.7998 9.58784 22.7998 10.8151M13.7332 6.3707V14.5188M13.7332 6.3707V4.88921C13.7332 3.66192 14.748 2.66699 15.9998 2.66699C17.2517 2.66699 18.2665 3.66192 18.2665 4.88921V6.3707M18.2665 6.3707V14.5188M18.2665 6.3707C18.2665 5.1434 19.2813 4.14847 20.5332 4.14847C21.785 4.14847 22.7998 5.1434 22.7998 6.3707V10.8151M22.7998 10.8151V14.5188'
                    stroke='#667085'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <h2 className='my-1 mx-1 text-sm font-semibold text-[#101828]'>Failed Messages</h2>
              </div>
              <div className='px-1 text-lg text-[#101828] font-semibold'>
                <span>{auditDetail?.result?.total_failed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default AuditPage
