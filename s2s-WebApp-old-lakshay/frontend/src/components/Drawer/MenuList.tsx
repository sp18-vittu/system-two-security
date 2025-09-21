// MenuList.js
import moment from 'moment'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CHAT_DELETE_RESET, CHAT_UPDATE_RESET } from '../../redux/nodes/chat/action'
import ChatMessage from './ChatMessage'
import './Sidebar.css'
import { useData } from '../../layouts/shared/DataProvider'

interface props {
  toggleDropdown: any
  setsubMenuList: any
  isOpen: any
  subMenuList: any
  openDataVaultSideMenu: any
  closeChatMenu: any
  chatLists: any
  setChatMessages: any
  chatmessage: any
}

const MenuList = ({ setsubMenuList, isOpen, closeChatMenu, chatLists, setChatMessages, chatmessage }: props) => {

  const navigateTo = useNavigate()
  const dispatch = useDispatch()
  const { setCtiFileName, setWrokbenchHome }: any = useData()
  const todayDate = moment().format('D-MM-YYYY')
  const yesterdayDate = moment().subtract(1, 'days').format('D-MM-YYYY')

  const detailsreduce = useSelector((state: any) => state.chatDetailreducer)
  const { chatDetaillist } = detailsreduce

  const deletechat = useSelector((state: any) => state.chatDeletereducer)
  const { success: removesuccess } = deletechat

  const createNewChat = () => {
    closeChatMenu()
    setCtiFileName('')
    sessionStorage.setItem('createNewChat', JSON.stringify({ createNewChat: true }))
    sessionStorage.removeItem('chatid')
    sessionStorage.removeItem('workartifacts')
    sessionStorage.removeItem('chatid')
    navigateTo(`/app/chatworkbench`, { state: { createChat: true } })
    setWrokbenchHome(false)
  }

  let todayDatevalue: any = []
  let yesterdayvalue: any = []
  let lastsevendayvalue: any = []

  useEffect(() => {
    todayDatevalue = []
    yesterdayvalue = []
    lastsevendayvalue = []
    if (removesuccess) {
      dispatch({ type: CHAT_DELETE_RESET })
    }
    chatDetaillist?.map((chat: any) => {
      if (moment(chat.createdDateTime).format('D-MM-YYYY') == todayDate) {
        todayDatevalue.push(chat)
      } else if (moment(chat.createdDateTime).format('D-MM-YYYY') == yesterdayDate) {
        yesterdayvalue.push(chat)
      } else {
        lastsevendayvalue.push(chat)
      }
    })
  }, [chatDetaillist, removesuccess])

  const updateSetting = useSelector((state: any) => state.chatupdatereducer)
  const { success: updateSettingsuccess } = updateSetting

  useEffect(() => {
    if (updateSettingsuccess) {
      dispatch({
        type: CHAT_UPDATE_RESET,
      })
    }
  }, [updateSettingsuccess])

  const userUpdateDetails = useSelector((state: any) => state.userSettingUpdatereducer)
  const { userUpdateDetail } = userUpdateDetails

  useEffect(() => { }, [
    userUpdateDetail?.firstName,
    userUpdateDetail?.lastName,
    userUpdateDetail?.photo,
  ])

  return (
    <div
      className={`w-80 box-border bg-gray-900 border-r border-[#3e4b5d] p-6 flex flex-col gap-4 items-start justify-star fixed top-0 mt-0 h-full right-54 ${isOpen ? 'left-14' : ''
        }`}
    >
      <div className='flex flex-row items-center justify-between self-stretch flex-shrink-0 relative'>
        <div className='text-white text-left font-medium text-[16px] leading-[24px] relative'>
          Chat Sessions
        </div>
        <div
          className='flex flex-row gap-[6px] items-center justify-center flex-shrink-0 relative overflow-hidden cursor-pointer'
          onClick={createNewChat}
        >
          <div className='text-[#ee7103] text-left font-semibold text-[14px] leading-[20px] relative'>
            New
          </div>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
          >
            <path
              d='M10.0001 4.16667V15.8333M4.16675 10H15.8334'
              stroke='#EE7103'
              stroke-width='1.66667'
              stroke-linecap='round'
              stroke-linejoin='round'
            />
          </svg>
        </div>
      </div>

      <div className='flex flex-col gap-[16px] items-start justify-start flex-shrink-0 relative max-h-[95%] overflow-y-scroll  hide-scrollbar'>
        <>
          {chatLists?.map((item: any) => (
            <ChatMessage
              chatValue={chatLists}
              message={item}
              setsubMenuList={setsubMenuList}
              closeChatMenu={closeChatMenu}
              setChatMessages={setChatMessages}
              chatmessage={chatmessage}
            />
          ))}
        </>
      </div>
    </div>
  )
}

export default MenuList
