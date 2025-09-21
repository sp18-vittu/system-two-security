import Axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const eventBus = new EventTarget()

export default function ChatPage() {
  const navigateTo = useNavigate()
  let get_chat_id = sessionStorage.getItem('chatid')
  const selectSources = (item: any) => {
    if (item.id == 2 || item.id == 3) {
      navigateTo(`/app/selectsource/${get_chat_id}`, { state: 3 })
    }
  }
  const [selectindex, setselectindex] = useState(0)
  const selectCard = (item: any, key: any) => {
    sessionStorage.setItem('setCard', JSON.stringify(key))

    setselectindex(key)
    const event = new CustomEvent('customEvent', { detail: key })
    eventBus.dispatchEvent(event)
  }

  const [datadetail, setDatadetail] = useState([])
  useEffect(() => {
    Axios.get('../assets/chat.json').then((response) => {
      setDatadetail(response.data)
    })
  }, [])
  return (
    <div className='flex flex-wrap w-full '>
      {datadetail.map((item: any, key: any) => (
        <div className='w-full mb-3 md:w-1/2 '>
          <div className=' mx-3'>
            <div
              className={`mb-9  bg-[#1D2939] rounded-xl py-5 px-7 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] transition-all sm:p-9 lg:px-6 xl:px-7 h-56   border w-full ${
                selectindex == key ? 'border-1 border-blue-500 bg-[#1D2939]' : ''
              } text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
              onClick={() => {
                selectCard(item, key)
              }}
            >
              <div className='mx-auto mb-2 inline-block'>
                <svg
                  width='30'
                  height='30'
                  viewBox='0 0 30 30'
                  fill='none'
                  dangerouslySetInnerHTML={{ __html: item.upload }}
                ></svg>
              </div>
              <div>
                <h3 className='mb-4 font-semibold text-white sm:text-2xl lg:text-lg xl:text-2xl'>
                  {' '}
                  {item.name}
                </h3>
                <p className='text-base xl:text-lg lg:text-sm font-normal text-white'>
                  {' '}
                  {item.description}
                </p>

                <button
                  className='mt-3 text-base inline-flex items-center text-white font-medium'
                  onClick={() => {
                    selectSources(item)
                  }}
                >
                  Get Started
                  <svg
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M4.1665 9.99984H15.8332M15.8332 9.99984L9.99984 4.1665M15.8332 9.99984L9.99984 15.8332'
                      stroke='#fff'
                      strokeWidth='1.66667'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
