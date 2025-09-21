import { CircularProgress } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PromptQuery from '../../components/Prompt/PromptQuery'
import {
  CHAT_CONVERSATION_RESET,
  chatSession,
  chatSessionHistoryPost,
  createNewupdateChat,
  getAddSourceId,
} from '../../redux/nodes/chat/action'
import local from '../../utils/local'
import ChatPage from './Chatpage'
import { useForm } from 'react-hook-form'
import { feedbackSession } from '../../redux/nodes/audit/action'

const useStyles = makeStyles((theme: any) => ({
  container: {
    paddingTop: theme.spacing(5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    width: '100%',
    height: '87.5vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#101828',
  },
  promptContainer: {
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'coloum-revert',
    width: '100%',
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column-reverse',
    flexGrow: '8',
    overflowY: 'auto',
    paddingBottom: '15px',
  },
  searchInputContainer: {
    display: 'flex',
    alignSelf: 'end',
    width: '100%',
    marginTop: 'auto',
    border: '1px solid #0c0c0c',
  },
}))

export default function HistoryPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isDirty },
    reset,
  } = useForm({
    defaultValues: {
      message: '',
    },
  })

  const { state } = useLocation()

  const { id } = useParams()

  const location = useLocation()
  const classes = useStyles()
  const dispatch = useDispatch()

  const navigateTo = useNavigate()
  const historylocalStorage = local.getItem('bearerToken')
  const token = JSON.parse(historylocalStorage as any)
  const [historyRes, setHistoryRes] = useState([] as any)
  const [message, setMessage] = useState(null)

  const app = useSelector((state: any) => state.app)
  const chatDetails = useSelector((state: any) => state.chatHistoryreducer)
  const { chatHistorylist, loadings, success: chatListSuccess } = chatDetails
  const { chatHistorySavelist, success: historySuccess } = useSelector(
    (state: any) => state.chatHistorySavereducer,
  )

  const detailsreduce = useSelector((state: any) => state.chatDetailreducer)
  const { chatDetaillist } = detailsreduce
  const items = app.results ? app.results : []
  const loadingPromtRes = app.loading ? app.loading : false
  let [newchatid, name] = location.pathname.split('/')
  let chatid: any = JSON.parse(sessionStorage.getItem('newchatsessionid') || '[]')
  const chatUser = local.getItem('auth')
  const sessionUser = JSON.parse(chatUser as any)
  const user = sessionUser?.user?.user
  let prevId: any = JSON.parse(sessionStorage.getItem('prevId') || 'null')
  const prompt_value = localStorage?.getItem('prompthistory')
  const prompt_value1 = JSON.parse(prompt_value as any)
  let prompt_value2 = prompt_value1?.length > 0 ? prompt_value1 : []
  let addSource: any
  addSource = JSON.parse(sessionStorage.getItem('promptSource') || '{}')
  let get_chat_id = sessionStorage.getItem('chatid')
  let sessionId = JSON.parse(get_chat_id as any)
  const { getAddSourceDetail } = useSelector((state: any) => state.getAddSourcereducer)

  useEffect(() => {
    let paramId = id ? id : sessionId
    if (prompt_value2?.length > 0 || prompt_value2?.length == 3) {
      let chatSessionHistory = {
        tenant: user.tenantId,
        userEmail: user.email,
        chatSessionId: prompt_value2?.length == 3 ? id : prevId,
        chatSessionName: 'New Chat',
        prompts: prompt_value1,
      }
      if (conversation_success) {
        dispatch(chatSessionHistoryPost(chatSessionHistory) as any)
      }
    }
    sessionStorage.setItem('prevId', JSON.stringify(paramId))
    dispatch({ type: CHAT_CONVERSATION_RESET })
  }, [id, prompt_value2?.length == 3])

  useEffect(() => {
    if (id) {
    }
  }, [id, historySuccess == true && prompt_value2?.length == 0])

  useEffect(() => {
    let prompts = chatHistorylist?.prompts?.length > 0 ? chatHistorylist?.prompts : null
    if (prompt_value2?.length > 0) {
      let array: any = []
      if (prompts?.length > 0) {
        array = [...prompts, ...prompt_value2]
      } else {
        array = [...prompt_value2]
      }
      setMessage(null)
      setHistoryRes(array)
    } else {
      if (prompts?.length > 0) {
        setMessage(null)
        setHistoryRes(prompts)
      } else {
        setHistoryRes([])
      }
    }
  }, [prompt_value2?.length, chatHistorylist?.prompts?.length, id, chatListSuccess]) //chatListSuccess

  useEffect(() => {
    if (id) {
      dispatch(getAddSourceId(token, id) as any)
    }
  }, [id])
  const [selectSourceList, setSelectSourceList] = useState([] as any)
  const dataVaultlists = useSelector((state: any) => state.dataVaultreducer)
  const { dataVaultlist } = dataVaultlists

  useEffect(() => {
    setSelectSourceList(dataVaultlist)
  }, [dataVaultlist])

  let chatCardId: any = JSON.parse(sessionStorage.getItem('setCard') || '{}')

  const onSubmit = (data: any) => {
    setMessage(data.message)
    let paramId = id ? id : sessionId

    if (getAddSourceDetail?.sessionVaults || addSource.length > 0) {
      dataVaultId = getAddSourceDetail?.sessionVaults
        ? getAddSourceDetail?.sessionVaults?.map((opaque: any) => opaque.id)
        : addSource?.map((opaque: any) => opaque.id)
    }

    let dataVaultDoc: any = []

    if (getAddSourceDetail?.sessionVaults || addSource.length > 0) {
      if (getAddSourceDetail?.sessionVaults) {
        getAddSourceDetail?.sessionVaults.map((doc: any) => {
          doc.documents?.map((item: any) => {
            dataVaultDoc?.push(item.id)
          })
        })
      } else {
        addSource?.map((doc: any) => {
          doc.documents?.map((item: any) => {
            dataVaultDoc?.push(item.id)
          })
        })
      }
    }
    let sendSelectSourceId: any = []
    let sendSelectSource: any = []
    let sendSelectdocid: any = []
    if (addSource.length > 0) {
      selectSourceList.map((select: any) => {
        addSource?.map((source: any) => {
          if (source.id == select.id) {
            if (select.docCount == source.documents.length) {
              sendSelectSourceId.push(source.id)
            }

            if (select.docCount !== source.documents.length) {
              sendSelectSource = [...source.documents, ...sendSelectSource]
            }
          }
        })
      })

      sendSelectSource.map((value: any) => {
        sendSelectdocid.push(value.id)
      })
    } else {
      selectSourceList.map((select: any) => {
        getAddSourceDetail?.sessionVaults?.map((source: any) => {
          if (source.id == select.id) {
            if (select.docCount == source.documents.length) {
              sendSelectSourceId.push(source.id)
            }

            if (select.docCount !== source.documents.length) {
              sendSelectSource = [...source.documents, ...sendSelectSource]
            }
          }
        })
      })

      sendSelectSource.map((value: any) => {
        sendSelectdocid.push(value.id)
      })
    }

    const chatConversation = {
      user: user.id,
      tenant: user.tenantId,
      conversation_id: paramId,
      vaults:
        chatCardId == 0
          ? []
          : chatCardId == 1
          ? sendSelectSourceId
          : selectSourceList?.map((opaque: any) => opaque.id),
      prompt: data.message,
      documents: chatCardId == 0 ? [] : chatCardId == 1 ? sendSelectdocid : [],
      rag: chatCardId == 0 ? false : true,
    }

    if (location.pathname === `/app/history/newchat/${id}`) {
      if (id) {
        dispatch(chatSession(chatConversation, id) as any)
      }
      reset()
    } else {
      const addSourceChat = {
        sessionName: data.message,
        sessionSourceValue: chatCardId,
      }
      if (chatDetaillist[0]?.sessionName == 'New Chat' && id == sessionId) {
        sessionStorage.setItem('prevId', JSON.stringify(id))
        dispatch(createNewupdateChat(addSourceChat, id, 'HistoryPage') as any) //,'HistoryPage'
      } else if (!id && chatDetaillist[0]?.sessionName == 'New Chat') {
        sessionStorage.setItem('prevId', JSON.stringify(sessionId))
        dispatch(createNewupdateChat(addSourceChat, sessionId, 'HistoryPage') as any)
        navigateTo(`/app/history/${sessionId}`)
      }

      dispatch(chatSession(chatConversation, paramId) as any)

      reset()
    }
  }

  useEffect(() => {
    if (state) {
      setValue('message', state, { shouldDirty: true })
    }
  }, [state])

  const thumpsStatus = (id: any, status: any) => {
    const likeStatus = status == 'up' ? true : false

    const feed = {
      tenant: user.tenantId,
      msg_id: id,
      like: likeStatus,
    }
    dispatch(feedbackSession(feed) as any)

    let prompts = chatHistorylist?.prompts?.length > 0 ? chatHistorylist?.prompts : null

    if (prompt_value2?.length > 0) {
      let array: any = []
      prompt_value2?.filter((item: any) => {
        if (item.responseId == id) {
          item.liked = status == 'up' ? !item.liked : false
          item.disliked = status == 'down' ? !item.disliked : false
        }
        return item
      })

      if (prompts?.length > 0) {
        array = [...prompts, ...prompt_value2]
      } else {
        array = [...prompt_value2]
      }
      localStorage.setItem('prompthistory', JSON.stringify([...prompt_value2]))
      setHistoryRes(array)
    }
  }

  return (
    <div className={classes.container}>
      {(items.length == 0 && !id && newchatid !== 'newchat') ||
      (!items && !id && newchatid !== 'newchat') ||
      location.pathname === `/app/history` ? (
        <div className={classes.promptContainer}>
          <ChatPage />
        </div>
      ) : (
        ''
      )}

      {location.pathname === `/app/history/newchat/${name}` ||
      location.pathname === `/app/history/${id}` ||
      chatid == name ? (
        <div className={classes.chatContainer}>
          {loadings ? (
            <>
              <PromptQuery
                onClick={thumpsStatus}
                message={historyRes}
                question={message}
                loader={
                  id && chatHistorylist?.prompts?.length >= 2
                    ? historyRes?.length == 0
                      ? true
                      : false
                    : false
                }
              />
            </>
          ) : (
            <></>
          )}
        </div>
      ) : (
        ''
      )}

      {loadingPromtRes && (
        <CircularProgress color='inherit' size={55} style={{ marginBottom: 20, marginLeft: 20 }} />
      )}

      <div className='mt-auto'>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <div className=''>
            <div className='flex items-center'>
              <div className='w-[90%]'>
                <input
                  type='search'
                  className={`'w-[90vw] text-white p-4 pl-5 bg-[#101828] border-solid outline-none border-2 border-white  text-sm rounded-lg'`}
                  placeholder='Send a message'
                  required
                  style={{ maxLines: '4096', width: '100%' }}
                  {...register('message')}
                ></input>
              </div>
              <div className='w-[10%] ml-3.5'>
                <button
                  type='submit'
                  disabled={message ? true : false}
                  className={`${
                    isDirty && !message
                      ? 'bg-[#EE7103] cursor-pointer text-white'
                      : ' text-[#000] bg-slate-200 cursor-not-allowed  '
                  } cursor-default  w-24 mr-10  font-medium rounded-lg text-sm px-4 py-2`}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
