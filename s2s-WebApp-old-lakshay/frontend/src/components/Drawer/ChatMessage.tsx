import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  CHAT_HISTORY_RESET,
  CHAT_UPDATE_RESET,
  DeleteChat,
  createNewupdateChat
} from '../../redux/nodes/chat/action'
import { chatHistory } from '../../redux/nodes/chatPage/action'
import local from '../../utils/local'

interface props {
  message: any
  setsubMenuList: any
  chatValue: any;
  closeChatMenu: any;
  setChatMessages: any;
  chatmessage: any;
  index: any
}
function ChatMessage({ message, setsubMenuList, setChatMessages, chatmessage, index }: props) {

  const navigateTo = useNavigate()
  const location = useLocation()
  const params = useParams();
  const { id } = params
  const localToken = local.getItem('bearerToken')
  const token = JSON.parse(localToken as any)
  const [editable, setEditable] = useState(false)

  const [messageText, setMessageText] = useState('')
  const updateSetting = useSelector((state: any) => state.chatupdatereducer)
  const { success: updateSettingsuccess } = updateSetting


  useEffect(() => {
    if (updateSettingsuccess) {
      dispatch({
        type: CHAT_UPDATE_RESET,
      })
    }
  }, [updateSettingsuccess]);
  const [sessionValue, setSessionValue] = useState()
  const [indexCount, setIndexCount] = useState(0 as any)
  const handleEdit = (event: any, params: any, i: any) => {
    event.stopPropagation()
    setSessionValue(params.sessionSourceValue)
    setMessageText(params.sessionName)
    setEditable(true);
    setAnchorE6(null);
    setChatMessages(true);
    setIndexCount(i)
  }

  const chatone = (params: any) => {
    dispatch(chatHistory(token, params.id) as any).then((response: any) => {
      if (response.payload) {
        let selectedFile = { ctiName: params.sessionName, vaultId: response?.payload?.vaultId, id: response?.payload?.reportId }
        sessionStorage.setItem('chatid', message.id)
        navigateTo(`/app/chatworkbench/${message.id}`, { state: selectedFile });
        setsubMenuList()
      }
    })
  }
  const dispatch = useDispatch()
  const handleSave = (e: any, params: any, i: any) => {
    e.stopPropagation()
    setMessageText(params.sessionName)
    setEditable(false)
    setErrorValue(false);
    setChatMessages(null);
    setIndexCount(i)
  }

  const [errovalue, setErrorValue] = useState(false);
  const handleSaveupdate = (e: any, params: any, i: any) => {
    e.stopPropagation()
    if (messageText) {
      const addSourceChat = {
        sessionName: messageText.trim(),
        sessionSourceValue: sessionValue
      };

      dispatch(createNewupdateChat(addSourceChat, params.id, 'ChatMessage') as any).then((res: any) => {
        if (res.type == "GET_CHAT_UPDATE_SUCCESS") {
          setChatMessages('edit')
          setErrorValue(false);
          setIndexCount(i)
        }
      });


    } else {
      setErrorValue(true);
    }
  };

  const handelChanges = (e: any) => {
    const inputValue = e.target.value;
    const trimmedValue = inputValue.trimStart();
    setErrorValue(false);
    setMessageText(trimmedValue)
  }

  const handledelete = (e: any) => {
    e.stopPropagation()
    setAnchorE6(null)
    setToShowDeleteIcons(true)
  }
  const handledelete1 = (e: any, params: any) => {
    e.stopPropagation()
    dispatch(DeleteChat(params?.id) as any).then((res: any) => {
      const chatObj = { sessionName: 'WorkBench' }
      if (res?.type === 'CHAT_DELETE_SUCCESS') {
        navigateTo(`/app/chatworkbench`);
        setChatMessages('edit')
        const selectFiles = { vaultId: 0, id: 0, mitreLocation: null, global: false, sessionItem: true }

      }
    })
    dispatch({ type: CHAT_HISTORY_RESET })
    setAnchorE6(null)
    setToShowDeleteIcons(false)

  }
  const [toShowdeleteIcons, setToShowDeleteIcons] = useState(false)
  const [anchorE6, setAnchorE6] = useState(null)

  const [mouseHovered, setMouseHovered] = useState(false);
  useEffect(() => {
    if (editable && !chatmessage) {
      setEditable(false)
    }
  }, [chatmessage])

  return (
    <div className='mt-1'>
      {(chatmessage && editable && indexCount == index) ? (
        <div className={`box-border  rounded-[12px] ${(!mouseHovered && message.id != id) ? `bg-[#101828] border border-[#1d2939]` : `border border-[#ee7103] bg-[#1d2939]`} p-[16px] flex flex-col gap-[12px] items-start justify-end w-[272px] relative shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-pointer`}>
          <div className="flex flex-row gap-[8px] items-center justify-start self-stretch flex-shrink-0 relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M11.6668 1.89124V5.33335C11.6668 5.80006 11.6668 6.03342 11.7577 6.21168C11.8376 6.36848 11.965 6.49596 12.1218 6.57586C12.3001 6.66669 12.5335 6.66669 13.0002 6.66669H16.4423M13.3335 10.8333H6.66683M13.3335 14.1666H6.66683M8.3335 7.49996H6.66683M11.6668 1.66663H7.3335C5.93336 1.66663 5.2333 1.66663 4.69852 1.93911C4.22811 2.17879 3.84566 2.56124 3.60598 3.03165C3.3335 3.56643 3.3335 4.26649 3.3335 5.66663V14.3333C3.3335 15.7334 3.3335 16.4335 3.60598 16.9683C3.84566 17.4387 4.22811 17.8211 4.69852 18.0608C5.2333 18.3333 5.93336 18.3333 7.3335 18.3333H12.6668C14.067 18.3333 14.767 18.3333 15.3018 18.0608C15.7722 17.8211 16.1547 17.4387 16.3943 16.9683C16.6668 16.4335 16.6668 15.7334 16.6668 14.3333V6.66663L11.6668 1.66663Z" stroke="#309F00" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div className="text-white text-left font-inter font-semibold text-[14px] leading-[20px] font-semibold relative flex-1 text-ellipsis overflow-hidden whitespace-nowrap">
              <input
                type='text'
                maxLength={80}
                value={messageText}
                onChange={(e) => handelChanges(e)}
                className={`w-full pl-3 h-[30px] pr-2 pt-2 pb-2 text-lg bg-[#667085] text-white border rounded  focus:outline-none  ${errovalue ? 'border-2  border-[red]' : ''}`}
              />
            </div>
            <div className="flex-shrink-0 w-[20px] h-[20px] relative" onClick={(e: any) => handleSaveupdate(e, message, index)}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 48 48'
                width='17px'
                height='17px'
              >
                <path
                  fill='#fff'
                  d='M40.6 12.1L17 35.7 7.4 26.1 4.6 29 17 41.3 43.4 14.9z'
                />
              </svg>
            </div>
            <div className="flex-shrink-0 w-[20px] h-[20px] relative" onClick={(e: any) => handleSave(e, message, index)}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 50 50'
                width='17px'
                height='17px'
              >
                <path
                  fill='#fff'
                  d='M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z'
                />
              </svg>
            </div>
          </div>
        </div>
      ) : (

        <div onMouseOver={() => setMouseHovered(true)} onMouseOut={() => setMouseHovered(false)} onClick={() => chatone(message)} className={`box-border  rounded-[12px] ${(!mouseHovered && message.id != id) ? `bg-[#101828] border border-[#1d2939]` : `border border-[#ee7103] bg-[#1d2939]`} p-[16px] flex flex-col gap-[12px] items-start justify-end w-[272px] relative shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-pointer`}>
          <div className="flex flex-row gap-[8px] items-center justify-start self-stretch flex-shrink-0 relative">
            {(mouseHovered || message.id == id) ? (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M11.6668 1.89124V5.33335C11.6668 5.80006 11.6668 6.03342 11.7577 6.21168C11.8376 6.36848 11.965 6.49596 12.1218 6.57586C12.3001 6.66669 12.5335 6.66669 13.0002 6.66669H16.4423M13.3335 10.8333H6.66683M13.3335 14.1666H6.66683M8.3335 7.49996H6.66683M11.6668 1.66663H7.3335C5.93336 1.66663 5.2333 1.66663 4.69852 1.93911C4.22811 2.17879 3.84566 2.56124 3.60598 3.03165C3.3335 3.56643 3.3335 4.26649 3.3335 5.66663V14.3333C3.3335 15.7334 3.3335 16.4335 3.60598 16.9683C3.84566 17.4387 4.22811 17.8211 4.69852 18.0608C5.2333 18.3333 5.93336 18.3333 7.3335 18.3333H12.6668C14.067 18.3333 14.767 18.3333 15.3018 18.0608C15.7722 17.8211 16.1547 17.4387 16.3943 16.9683C16.6668 16.4335 16.6668 15.7334 16.6668 14.3333V6.66663L11.6668 1.66663Z" stroke="#309F00" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
            </svg>) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M11.6666 1.89128V5.3334C11.6666 5.80011 11.6666 6.03346 11.7574 6.21172C11.8373 6.36853 11.9648 6.49601 12.1216 6.5759C12.2999 6.66673 12.5332 6.66673 12.9999 6.66673H16.442M13.3333 10.8333H6.66659M13.3333 14.1667H6.66659M8.33325 7.50001H6.66659M11.6666 1.66667H7.33325C5.93312 1.66667 5.23306 1.66667 4.69828 1.93916C4.22787 2.17884 3.84542 2.56129 3.60574 3.0317C3.33325 3.56647 3.33325 4.26654 3.33325 5.66667V14.3333C3.33325 15.7335 3.33325 16.4335 3.60574 16.9683C3.84542 17.4387 4.22787 17.8212 4.69828 18.0609C5.23306 18.3333 5.93312 18.3333 7.33325 18.3333H12.6666C14.0667 18.3333 14.7668 18.3333 15.3016 18.0609C15.772 17.8212 16.1544 17.4387 16.3941 16.9683C16.6666 16.4335 16.6666 15.7335 16.6666 14.3333V6.66667L11.6666 1.66667Z" stroke="#657890" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            )}
            <div className="text-white text-left font-inter  text-[14px] leading-[20px] font-semibold relative flex-1 text-ellipsis overflow-hidden whitespace-nowrap">{message?.sessionName}</div>
            {(mouseHovered || message.id == id) && (
              <>
                {toShowdeleteIcons ? (<>

                  <div className="flex-shrink-0 w-[20px] h-[20px] relative" onClick={(e: any) => { e.stopPropagation(), setToShowDeleteIcons(false) }} >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 50 50'
                      width='17px'
                      height='17px'
                    >
                      <path
                        fill='#fff'
                        d='M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z'
                      />
                    </svg>
                  </div>
                  <div className="flex-shrink-0 w-[20px] h-[20px] relative" onClick={(e: any) => handledelete1(e, message)}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 48 48'
                      width='17px'
                      height='17px'
                    >
                      <path
                        fill='#fff'
                        d='M40.6 12.1L17 35.7 7.4 26.1 4.6 29 17 41.3 43.4 14.9z'
                      />
                    </svg>
                  </div>
                </>) : (
                  <>
                    <div className="flex-shrink-0 w-[20px] h-[20px] relative" onClick={(event: any) => handleEdit(event, message, index)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M17.5 15L16.6666 15.9117C16.2245 16.3951 15.6251 16.6667 15.0001 16.6667C14.3751 16.6667 13.7757 16.3951 13.3337 15.9117C12.891 15.4293 12.2916 15.1584 11.6668 15.1584C11.042 15.1584 10.4426 15.4293 9.99998 15.9117M2.5 16.6667H3.89545C4.3031 16.6667 4.50693 16.6667 4.69874 16.6206C4.8688 16.5798 5.03138 16.5125 5.1805 16.4211C5.34869 16.318 5.49282 16.1739 5.78107 15.8856L16.25 5.41669C16.9404 4.72634 16.9404 3.60705 16.25 2.91669C15.5597 2.22634 14.4404 2.22634 13.75 2.91669L3.28105 13.3856C2.9928 13.6739 2.84867 13.818 2.7456 13.9862C2.65422 14.1353 2.58688 14.2979 2.54605 14.468C2.5 14.6598 2.5 14.8636 2.5 15.2713V16.6667Z" stroke="#657890" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                    <div className="flex-shrink-0 w-[20px] h-[20px] relative" onClick={(e: any) => handledelete(e)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M13.3333 4.99996V4.33329C13.3333 3.39987 13.3333 2.93316 13.1517 2.57664C12.9919 2.26304 12.7369 2.00807 12.4233 1.84828C12.0668 1.66663 11.6001 1.66663 10.6667 1.66663H9.33333C8.39991 1.66663 7.9332 1.66663 7.57668 1.84828C7.26308 2.00807 7.00811 2.26304 6.84832 2.57664C6.66667 2.93316 6.66667 3.39987 6.66667 4.33329V4.99996M8.33333 9.58329V13.75M11.6667 9.58329V13.75M2.5 4.99996H17.5M15.8333 4.99996V14.3333C15.8333 15.7334 15.8333 16.4335 15.5608 16.9683C15.3212 17.4387 14.9387 17.8211 14.4683 18.0608C13.9335 18.3333 13.2335 18.3333 11.8333 18.3333H8.16667C6.76654 18.3333 6.06647 18.3333 5.53169 18.0608C5.06129 17.8211 4.67883 17.4387 4.43915 16.9683C4.16667 16.4335 4.16667 15.7334 4.16667 14.3333V4.99996" stroke="#657890" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

      )}
    </div>
  )
}
export default ChatMessage
