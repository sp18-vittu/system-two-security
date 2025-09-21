import React, { RefObject, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import local from '../../utils/local'
import useWindowResolution from '../../layouts/Dashboard/useWindowResolution'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { environment } from '../../environment/environment'
import { createChat } from '../../redux/nodes/chatPage/action'
import { ChatHistoryDetails, chatSideList } from '../../redux/nodes/chat/action'
import { v4 as uuidv4 } from 'uuid'
import { useData } from '../../layouts/shared/DataProvider'
import {
  getallCollection,
  getinboxCollection,
  workbenchyamlFileUpdate,
  yamlFileValidation,
} from '../../redux/nodes/Collections/action'
import CustomToast from '../../layouts/App/CustomToast'
const yaml = require('js-yaml')
import toast from 'react-hot-toast'
import CopyAndNewCollectionsDialog from '../SourceAndCollection/Collection/CopyAndNewCollectionsDialog'

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

function RuleAgentChat() {
  const dispatch = useDispatch()
  const navigateTo = useNavigate()
  const { id } = useParams()
  const Token = local.getItem('bearerToken')
  const token = JSON.parse(Token as any)
  const { height } = useWindowResolution()
  const dynamicHeight = Math.max(100, height * 0.9)
  const localStorageauth = local.getItem('auth')
  const localss = JSON.parse(localStorageauth as any)
  const userIdchat: any = localss?.user?.user?.id
  const [sessionList, setSessionList] = useState([] as any)
  const [messages, setMessages] = useState<any[]>([])
  const [inputMessage, setInputMessage] = useState<any[]>([])
  const [sendmessage, setSendmessage] = useState('' as any)
  const socketRef = useRef<WebSocket | null>(null)
  const [ctiChat, setctiChat] = useState([] as any)
  const [sessionid, setSessionId] = useState(null)
  const [showPopover, setShowPopover] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const divRef: RefObject<HTMLDivElement> = useRef(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [inboxList, setInboxList] = useState([] as any)
  const [collectionorcti, setCollectionorcti] = useState(null as any)
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState([] as any)
  const [collectiondata, setCollectiondata] = useState([] as any)
  const [readOnly, setReadOnly] = useState(false)
  const [cancelChat, setCancelChat] = useState(false);
  const {
    chatinputwss,
    responceChatwss,
    Chatmessage,
    setChatmessage,
    sendwssconnect,
    setSendwssconnect,
  }: any = useData()

  useEffect(() => {
    fetchSessiondetails()
    dispatch(getinboxCollection() as any).then((res: any) => {
      if (res?.type == 'INBOX_COLLECTION_GET_SUCCESS') {
        setInboxList(res.payload)
      }
    })
    dispatch(getallCollection() as any).then((res: any) => {
      if (res?.payload?.length > 0) {
        let collection = [{ name: '+ New' }, ...res.payload]
        setCollectiondata(collection)
      } else {
        let collection = [{ name: '+ New' }]
        setCollectiondata(collection)
      }
    })
  }, [])

  useEffect(() => {
    if (responceChatwss?.length == 0 && chatinputwss?.length == 0) {
      fetchHistoryAllData()
    }
  }, [responceChatwss])

  const handlecopyToinbox = (codeContent: any) => {
    const validation = {
      sigma_rule: codeContent,
    }
    dispatch(yamlFileValidation(validation) as any).then((res: any) => {
      if (res.type == 'VALIDATION_YAML_FILE_SUCCESS') {
        if (res?.payload.valid) {
          toast.success(
            <CustomToast
              message={`Validated Successfully`}
              onClose={() => toast.dismiss()} // Dismiss only this toast
            />,
            {
              duration: 2000,
              position: 'top-center',
              style: {
                background: '#fff',
                color: '#000', // White text color
                width: '500px',
              },
            },
          )
          let parsedJSON = yaml.load(codeContent)
          const blob = new Blob([codeContent], { type: 'text/plain' })
          const file = new File([blob], `${parsedJSON?.title}.yml`, { type: 'text/plain' })
          const data = new FormData()
          data.append('file', file)
          dispatch(workbenchyamlFileUpdate(inboxList?.id, Number(id), data) as any)
            .then((res: any) => {
              if (res.type == 'UPDATE_YAML_FILE_SUCCESS') {
                toast.success(
                  <CustomToast
                    message={'Rule copied successfully'}
                    onClose={() => toast.dismiss()} // Dismiss only this toast
                  />,
                  {
                    duration: 4000,
                    position: 'top-center',
                    style: {
                      background: '#fff',
                      color: '#000', // White text color
                      width: '500px',
                    },
                  },
                )
              } else {
                toast.error(
                  <CustomToast
                    message='Failed to copy the rule. Please try again.'
                    onClose={() => toast.dismiss()} // Dismiss only this toast
                  />,
                  {
                    duration: 4000,
                    position: 'top-center',
                    style: {
                      background: '#fff',
                      color: '#000', // White text color
                      width: '500px',
                    },
                  },
                )
              }
            })
            .catch((error: any) => { })
        } else {
          toast.error(
            <CustomToast
              message={`Validation failed with ${res?.payload?.errors?.length}errors`}
              onClose={() => toast.dismiss()} // Dismiss only this toast
            />,
            {
              duration: 1000,
              position: 'top-center',
              style: {
                background: '#fff',
                color: '#000', // White text color
                width: '500px',
              },
            },
          )
          setMessages((prevMessages: any) => [
            ...prevMessages,
            { ...res?.payload, message: null, question: false },
          ])
        }
      }
    })
  }

  const handlecopyToCollection = (params: any, codeContent: any, responce: any) => {
    const validation = {
      sigma_rule: codeContent,
    }
    dispatch(yamlFileValidation(validation) as any).then((res: any) => {
      if (res.type == 'VALIDATION_YAML_FILE_SUCCESS') {
        if (res?.payload.valid) {
          toast.success(
            <CustomToast
              message={`Validated Successfully`}
              onClose={() => toast.dismiss()} // Dismiss only this toast
            />,
            {
              duration: 2000,
              position: 'top-center',
              style: {
                background: '#fff',
                color: '#000', // White text color
                width: '500px',
              },
            },
          )
          let parsedJSON = yaml.load(codeContent)
          const collectionTest: any = [
            {
              id: id,
              title: parsedJSON?.title,
              yamlText: codeContent,
            },
          ]
          setCollectionorcti(params)
          setSelectedRows(collectionTest)
          setDialogOpen(true)
        } else {
          toast.error(
            <CustomToast
              message={`Validation failed with ${res?.payload?.errors?.length}errors`}
              onClose={() => toast.dismiss()} // Dismiss only this toast
            />,
            {
              duration: 1000,
              position: 'top-center',
              style: {
                background: '#fff',
                color: '#000', // White text color
                width: '500px',
              },
            },
          )
          setMessages((prevMessages: any) => [
            ...prevMessages,
            { ...res?.payload, message: null, question: false },
          ])
        }
      }
    })
  }

  const copyToClipboard = (data: any) => {
    navigator.clipboard.writeText(data)
    setShowPopover(true)
    setTimeout(() => {
      setShowPopover(false)
    }, 2000)
  }

  const handleNavigatelanding = () => {
    navigateTo(`/app/chatworkbench`)
    sessionStorage.setItem('active', 'Chats')
  }

  const [rows, setRows] = useState(1)
  const [shift, setShift] = useState(null as any)
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setChatmessage([])
    if (event.key === 'Enter' && !event.shiftKey && !readOnly) {
      event.preventDefault()
      setShift(event)
      handleWebSocket()
    }
  }

  const handleOnChange = (e: any) => {
    const value = e.target.value
    if (value === '') {
      setSendmessage('')
      setRows(1)
    } else {
      setSendmessage(value)
    }
  }
  const handleResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'inherit'
    if (e.target.value === '') {
      e.target.style.height = '36px'
    } else {
      e.target.style.height = `${Math.min(e.target.scrollHeight, 48)}px`
    }
  }
  const stopWebSocket = () => {
    setCancelChat(true);
  }
  useEffect(() => {
    if (cancelChat) {
      handleWebSocket();
    }


  }, [cancelChat]);

  const handleWebSocket = () => {
    if (!sessionid && sessionList.length == 0 && sendmessage.trim() || cancelChat) {
      const selectFiles = {
        vaultId: 0,
        id: 0,
        ruleId: 0,
        mitreLocation: null,
        global: false,
        sessionItem: true
      }
      const sessionName =
        sendmessage.trim().length > 200 ? `${sendmessage.trim().slice(0, 200)}` : sendmessage.trim();
      const chatObj = {
        sessionName: sessionName,
      }

      dispatch(createChat(selectFiles, chatObj) as any).then((newChatResponse: any) => {
        if (newChatResponse.type == 'CREATE_CHAT_SUCCESS') {
          connectWebSocket(newChatResponse.payload.id, newChatResponse?.payload?.sessionName, cancelChat);
          setSessionId(newChatResponse.payload.id);
          navigateTo(`/app/ruleagentchat/${newChatResponse.payload.id}`)

          fetchSessiondetails()
        };
      });
    } else {
      if ((sendmessage.trim() && sessionList?.length > 0) || cancelChat) {
        connectWebSocket(sessionList[0]?.id, sessionList[0]?.sessionName, cancelChat)
      }

    }


  };

  useEffect(() => {
    if (shift && (!sendmessage || sendmessage == '')) {
      shift.target.style.height = '36px'
    }
  }, [shift, sendmessage])

  const connectWebSocket = (id: any, sessionName: any, chatcancel: any) => {
    const localStorage1 = local.getItem('bearerToken')
    const token = JSON.parse(localStorage1 as any)
    const barearTockens = token?.bearerToken.split(' ')
    if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED || chatcancel) {
      const socket = new WebSocket(
        `${environment?.baseWssUrl}/intel-chat/${id}/${sessionName}?Authorization=${barearTockens[1]}`,
      )
      socketRef.current = socket
      setReadOnly(true)
      socket.onopen = () => {
        console.log('Connected to WebSocket server')
        let object: any = {
          message_id: uuidv4(),
          message: sendmessage,
          focus: 'rule_agent',
          report_id: id,
        }
        let cancelObject: any = {
          "cancel": true
        };
        if (chatcancel) {
          socket.send(JSON.stringify(cancelObject));
          setSendmessage('');
          setCancelChat(false);
          setSendwssconnect(false)
        } else {
          setSendmessage('');
          setMessages((prevMessages: any) => [...prevMessages, { message: sendmessage, question: true }]);
          setInputMessage([...messages, { message: sendmessage, question: true }])
          setSendwssconnect(true);
          socket.send(JSON.stringify(object));
        }
      }

      const messageMap: Map<string, any> = new Map()

      socket.onmessage = (event) => {
        const datavalues: any = JSON.parse(event.data)

        if (messageMap.has(datavalues?.message_id)) {
          const existingMessage: any = messageMap.get(datavalues?.message_id)
          existingMessage.message += datavalues?.message || ''
          existingMessage.done = datavalues?.done || false
          existingMessage.focus = datavalues?.focus || ''
          existingMessage.sources = datavalues?.sources || []
          existingMessage.sourcesvalue = datavalues?.sources || []
          existingMessage.timestamp = datavalues?.created || null
          existingMessage.sourcescount = null
        } else {
          messageMap.set(datavalues.message_id, {
            message: datavalues.message,
            question: false,
            error: datavalues.error,
          })
        }

        const mergedMessages = Array.from(messageMap.values())
        setctiChat(mergedMessages)
        if (datavalues?.done) {
          setReadOnly(false)
          setMessages((prev: any) => [...prev, ...mergedMessages])
          setSendwssconnect(false)
          setChatmessage([])
          setctiChat([])
          setInputMessage([])
          disconnectWebSocket()
        }
      }

      socket.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

      socket.onclose = () => {
        console.log('WebSocket connection closed')
      }
    }
  }
  // Function to disconnect WebSocket
  const disconnectWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close()
      socketRef.current = null
    }
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }

    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, ctiChat])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }

    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, responceChatwss])

  const fetchSessiondetails = () => {
    dispatch(chatSideList(token, 0) as any).then((res: any) => {
      if (res.type == 'CHAT_DETAIL_SUCCESS') {
        setSessionList(res?.payload)
      }
    })
  }

  const fetchHistoryAllData = () => {
    let noOfprompts: any = 100
    let selectOption: any
    dispatch(ChatHistoryDetails(userIdchat, id, noOfprompts) as any).then((reponse: any) => {
      if (reponse) {
        let mergedMessages: any = reponse?.payload
        let arr: any = []
        for (let i = 0; i < mergedMessages?.length; i++) {
          if (mergedMessages[i]?.sources?.length > 0) {
            const Cti: any = mergedMessages[i].sources.filter((item: any) => {
              return item?.category == 'rule_agent'
            })
            const Sigma: any = mergedMessages[i].sources.filter((item: any) => {
              return item?.category == 'sigma' || item?.category == 'yara'
            })
            mergedMessages[i].sources = Cti

            mergedMessages[i].sourcescount =
              Sigma.length > 0
                ? Sigma.reduce((counts: any, item: any) => {
                  counts[item.category] = (counts[item.category] || 0) + 1
                  return counts
                }, {})
                : null
            arr.push(mergedMessages[i])
          } else {
            arr.push(mergedMessages[i])
          }
          selectOption = mergedMessages[i]
        }
        setMessages(mergedMessages)
      }
    })
  }

  const cleanMarkdown = (text: string): string => {
    return text.replace(/null|undefined/g, '').trim();
  };

  return (
    <>
      <div className='flex justify-between items-center w-full h-[80px] px-6 bg-[#1D2939]'>
        {/* Back Button */}
        <div className='flex items-center gap-3' onClick={() => handleNavigatelanding()}>
          <svg
            className='cursor-pointer'
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
          >
            <path
              d='M19 12H5M5 12L12 19M5 12L12 5'
              stroke='#EE7103'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
            />
          </svg>
          <span className='text-[#EE7103] text-lg font-semibold leading-7 cursor-pointer'>
            Go to Workbench
          </span>
        </div>

        {/* Center Section */}

        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <span className='text-white text-2xl font-medium leading-8'>Create Detections</span>
          </div>
          <div className='relative w-[120px] h-[31px]'>
            <div className='absolute w-full h-full bg-[#0F121B] border border-[#7690B2] rounded-[12px]'></div>
            <span className='absolute left-4 top-1 text-[#EE7103] text-sm font-normal leading-6'>
              Detection Agent
            </span>
          </div>
        </div>

        {/* Save and Close Button */}
        <div className={`flex items-center justify-center gap-1 `}></div>
      </div>
      <div
        style={{
          height: `${dynamicHeight}px`,
          width: '100%',
          textAlign: 'left',
          overflowY: 'hidden',
          backgroundColor: '#0C111D',
          borderRadius: '8px',
        }}
      >
        <div className='grid grid-rows-[1fr_auto] h-full'>
          {/* Chat messages section */}
          <div className='overflow-y-auto p-4'>
            <div className='grid grid-cols-12 items-center gap-4'>
              {/* Left Section */}
              <div className='col-span-3 flex items-center justify-center'></div>

              {/* Center Section */}
              <div className='col-span-6 relative'>
                {/* Message 1 */}
                {!sendwssconnect ? (
                  <>
                    {(messages?.length > 0 ? messages : Chatmessage).map(
                      (responce: any, index: any) => (
                        <>
                          {responce.question && (
                            <div key={index}>
                              <div className='flex mb-2 mt-[24px]'>
                                <div className='bg-[#054D80] rounded-xl p-1'>
                                  <svg
                                    width='16'
                                    height='16'
                                    viewBox='0 0 16 16'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                  >
                                    <g id='recording-01'>
                                      <path
                                        id='Icon'
                                        d='M6.80001 13.3999L9.20001 13.3999M4.40001 10.6999L11.6 10.6999M2.60001 7.9999L13.4 7.9999M4.40001 5.2999L11.6 5.2999M6.80001 2.5999L9.20001 2.5999'
                                        stroke='white'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                      />
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  <p className='overflow-hidden text-white text-wrap truncate font-inter font-medium ps-2  text-sm md:text-base'>
                                    You
                                  </p>
                                </div>
                              </div>
                              <div className='mb-4 items-center justify-center w-full'>
                                <div className='bg-[#054D80] text-white p-3 rounded-lg w-full break-words'>
                                  <ReactMarkdown
                                    components={{
                                      h1: ({ children }) => (
                                        <h1 className='markdown-heading'>{children}</h1>
                                      ),
                                      h2: ({ children }) => (
                                        <h2 className='markdown-heading'>{children}</h2>
                                      ),
                                      h3: ({ children }) => (
                                        <h3 className='markdown-heading'>{children}</h3>
                                      ),
                                      a: ({ node, ...props }) => (
                                        <a {...props} target='_blank' rel='noopener noreferrer'>
                                          {props.children}
                                        </a>
                                      ),
                                      code({ inline, className, children, ...props }: CodeProps) {
                                        const match = /language-(\w+)/.exec(className || '')
                                        const codeContent = String(children).replace(/\n$/, '')
                                        return !inline && match ? (
                                          <div className='relative markdown-code-block'>
                                            <SyntaxHighlighter
                                              style={darcula as any}
                                              language={match[1]}
                                              PreTag='div'
                                              wrapLines={true}
                                              wrapLongLines={true}
                                              showLineNumbers={true}
                                              className={`markdown-code ${className}`}
                                              {...props}
                                            >
                                              {String(children).replace(/\n$/, '')}
                                            </SyntaxHighlighter>
                                          </div>
                                        ) : (
                                          <code className={className} {...props}>
                                            {children}
                                          </code>
                                        )
                                      },
                                    }}
                                  >
                                    {cleanMarkdown(!responce?.error && responce?.message
                                      ? responce?.message
                                      : responce?.error
                                        ? responce?.error
                                        : "We're facing technical difficulties. Retry later, please.")}
                                  </ReactMarkdown>
                                </div>
                              </div>
                            </div>
                          )}
                          {/* Message 2 */}
                          {!responce.question && (
                            <div key={index}>
                              <div className='flex mb-2 mt-[24px]'>
                                <div className=''>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='24'
                                    height='24'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                  >
                                    <circle cx='12' cy='12' r='12' fill='#1D2939' />
                                    <path
                                      fill-rule='evenodd'
                                      clip-rule='evenodd'
                                      d='M14.8765 10.8779L15.2961 11.2848L17 11.2862V10.7792L15.6267 9.44747H8.72307L8.30347 9.04054V7.77044L8.72307 7.36351H15.2291L15.6487 7.77044H16.9747V7.26486L15.9793 5.93311H7.97287L6.59961 7.26486V9.54611L7.97287 10.8779H14.8765ZM14.8765 13.1221L15.2961 12.7152L17 12.7138V13.2208L15.6267 14.5525H8.72307L8.30347 14.9595V16.2296L8.72307 16.6365H15.2291L15.6487 16.2296H16.9747V16.7351L15.9793 18.0669H7.97287L6.59961 16.7351V14.4539L7.97287 13.1221H14.8765Z'
                                      fill='#EE7103'
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <p className='overflow-hidden text-white text-wrap truncate font-inter font-medium ps-2  text-sm md:text-base'>
                                    S2S AI
                                  </p>
                                </div>
                              </div>
                              <div className='mb-4 text-left items-center justify-center w-full'>
                                <div className='bg-[#1d2939] text-white p-3 rounded-lg w-full break-words'>
                                  {responce?.message ? (
                                    <ReactMarkdown
                                      components={{
                                        h1: ({ children }) => (
                                          <h1 className='markdown-heading'>{children}</h1>
                                        ),
                                        h2: ({ children }) => (
                                          <h2 className='markdown-heading'>{children}</h2>
                                        ),
                                        h3: ({ children }) => (
                                          <h3 className='markdown-heading'>{children}</h3>
                                        ),
                                        a: ({ node, ...props }) => (
                                          <a {...props} target='_blank' rel='noopener noreferrer'>
                                            {props.children}
                                          </a>
                                        ),
                                        code({ inline, className, children, ...props }: CodeProps) {
                                          const match = /language-(\w+)/.exec(className || '')
                                          const codeContent = String(children).replace(/\n$/, '')
                                          if (match && match[1] === 'yaml') {
                                            sessionStorage.setItem(
                                              'ymal',
                                              JSON.stringify(codeContent),
                                            )
                                          }

                                          return !inline && match ? (
                                            <>
                                              <div className='flex items-center justify-between  w-full h-[20px]'>
                                                {/* Rule Text */}
                                                <div className='text-white text-sm font-semibold leading-[20px] font-inter'></div>

                                                {/* Action Buttons */}
                                                <div className='flex items-center gap-6'>
                                                  {/* Copy Button */}
                                                  <div className='flex items-center justify-center gap-1.5'>
                                                    <span className='text-[#EE7103] text-sm font-semibold leading-[20px] font-inter'>
                                                      Copy
                                                    </span>
                                                    <svg
                                                      onClick={() => copyToClipboard(codeContent)}
                                                      className='cursor-pointer'
                                                      xmlns='http://www.w3.org/2000/svg'
                                                      width='20'
                                                      height='20'
                                                      viewBox='0 0 20 20'
                                                      fill='none'
                                                    >
                                                      <g clip-path='url(#clip0_4347_5948)'>
                                                        <path
                                                          d='M6.6665 6.6665V4.33317C6.6665 3.39975 6.6665 2.93304 6.84816 2.57652C7.00795 2.26292 7.26292 2.00795 7.57652 1.84816C7.93304 1.6665 8.39975 1.6665 9.33317 1.6665H15.6665C16.5999 1.6665 17.0666 1.6665 17.4232 1.84816C17.7368 2.00795 17.9917 2.26292 18.1515 2.57652C18.3332 2.93304 18.3332 3.39975 18.3332 4.33317V10.6665C18.3332 11.5999 18.3332 12.0666 18.1515 12.4232C17.9917 12.7368 17.7368 12.9917 17.4232 13.1515C17.0666 13.3332 16.5999 13.3332 15.6665 13.3332H13.3332M4.33317 18.3332H10.6665C11.5999 18.3332 12.0666 18.3332 12.4232 18.1515C12.7368 17.9917 12.9917 17.7368 13.1515 17.4232C13.3332 17.0666 13.3332 16.5999 13.3332 15.6665V9.33317C13.3332 8.39975 13.3332 7.93304 13.1515 7.57652C12.9917 7.26292 12.7368 7.00795 12.4232 6.84816C12.0666 6.6665 11.5999 6.6665 10.6665 6.6665H4.33317C3.39975 6.6665 2.93304 6.6665 2.57652 6.84816C2.26292 7.00795 2.00795 7.26292 1.84816 7.57652C1.6665 7.93304 1.6665 8.39975 1.6665 9.33317V15.6665C1.6665 16.5999 1.6665 17.0666 1.84816 17.4232C2.00795 17.7368 2.26292 17.9917 2.57652 18.1515C2.93304 18.3332 3.39975 18.3332 4.33317 18.3332Z'
                                                          stroke='#EE7103'
                                                          stroke-width='1.66667'
                                                          stroke-linecap='round'
                                                          stroke-linejoin='round'
                                                        />
                                                      </g>
                                                      <defs>
                                                        <clipPath id='clip0_4347_5948'>
                                                          <rect
                                                            width='20'
                                                            height='20'
                                                            fill='white'
                                                          />
                                                        </clipPath>
                                                      </defs>
                                                    </svg>
                                                  </div>
                                                  {showPopover && (
                                                    <div className='absolute  p-1 bg-white text-black rounded shadow z-10 mt-16'>
                                                      Copied!
                                                    </div>
                                                  )}
                                                  {/* Move to Detection Lab Button */}
                                                  <div className='flex items-center justify-center gap-1.5'>
                                                    <span className='text-[#EE7103] text-sm font-semibold leading-[20px] font-inter'>
                                                      Move to Detection Lab
                                                    </span>
                                                    <svg
                                                      onClick={() => handlecopyToinbox(codeContent)}
                                                      className='cursor-pointer'
                                                      xmlns='http://www.w3.org/2000/svg'
                                                      width='20'
                                                      height='20'
                                                      viewBox='0 0 20 20'
                                                      fill='none'
                                                    >
                                                      <g clip-path='url(#clip0_4347_6313)'>
                                                        <path
                                                          d='M8.74984 1.66883C8.1873 1.67646 7.84959 1.70903 7.57652 1.84816C7.26292 2.00795 7.00795 2.26292 6.84816 2.57652C6.70903 2.84959 6.67646 3.1873 6.66883 3.74984M16.2498 1.66883C16.8124 1.67646 17.1501 1.70903 17.4232 1.84816C17.7368 2.00795 17.9917 2.26292 18.1515 2.57652C18.2906 2.84958 18.3232 3.18729 18.3308 3.74983M18.3308 11.2498C18.3232 11.8124 18.2907 12.1501 18.1515 12.4232C17.9917 12.7368 17.7368 12.9917 17.4232 13.1515C17.1501 13.2906 16.8124 13.3232 16.2498 13.3308M18.3332 6.6665V8.33317M11.6665 1.6665H13.3331M4.33317 18.3332H10.6665C11.5999 18.3332 12.0666 18.3332 12.4232 18.1515C12.7368 17.9917 12.9917 17.7368 13.1515 17.4232C13.3332 17.0666 13.3332 16.5999 13.3332 15.6665V9.33317C13.3332 8.39975 13.3332 7.93304 13.1515 7.57652C12.9917 7.26292 12.7368 7.00795 12.4232 6.84816C12.0666 6.6665 11.5999 6.6665 10.6665 6.6665H4.33317C3.39975 6.6665 2.93304 6.6665 2.57652 6.84816C2.26292 7.00795 2.00795 7.26292 1.84816 7.57652C1.6665 7.93304 1.6665 8.39975 1.6665 9.33317V15.6665C1.6665 16.5999 1.6665 17.0666 1.84816 17.4232C2.00795 17.7368 2.26292 17.9917 2.57652 18.1515C2.93304 18.3332 3.39975 18.3332 4.33317 18.3332Z'
                                                          stroke='#EE7103'
                                                          stroke-width='1.66667'
                                                          stroke-linecap='round'
                                                          stroke-linejoin='round'
                                                        />
                                                      </g>
                                                      <defs>
                                                        <clipPath id='clip0_4347_6313'>
                                                          <rect
                                                            width='20'
                                                            height='20'
                                                            fill='white'
                                                          />
                                                        </clipPath>
                                                      </defs>
                                                    </svg>
                                                  </div>

                                                  {/* Move to a Collection Button */}
                                                  <div className='flex items-center justify-center gap-1.5'>
                                                    <span className='text-[#EE7103] text-sm font-semibold leading-[20px] font-inter'>
                                                      Move to a Collection
                                                    </span>
                                                    <svg
                                                      onClick={() =>
                                                        handlecopyToCollection(
                                                          'workbench',
                                                          codeContent,
                                                          responce,
                                                        )
                                                      }
                                                      className='cursor-pointer'
                                                      xmlns='http://www.w3.org/2000/svg'
                                                      width='20'
                                                      height='20'
                                                      viewBox='0 0 20 20'
                                                      fill='none'
                                                    >
                                                      <g clip-path='url(#clip0_4347_5916)'>
                                                        <path
                                                          d='M8.74984 1.66883C8.1873 1.67646 7.84959 1.70903 7.57652 1.84816C7.26292 2.00795 7.00795 2.26292 6.84816 2.57652C6.70903 2.84959 6.67646 3.1873 6.66883 3.74984M16.2498 1.66883C16.8124 1.67646 17.1501 1.70903 17.4232 1.84816C17.7368 2.00795 17.9917 2.26292 18.1515 2.57652C18.2906 2.84958 18.3232 3.18729 18.3308 3.74983M18.3308 11.2498C18.3232 11.8124 18.2907 12.1501 18.1515 12.4232C17.9917 12.7368 17.7368 12.9917 17.4232 13.1515C17.1501 13.2906 16.8124 13.3232 16.2498 13.3308M18.3332 6.6665V8.33317M11.6665 1.6665H13.3331M4.33317 18.3332H10.6665C11.5999 18.3332 12.0666 18.3332 12.4232 18.1515C12.7368 17.9917 12.9917 17.7368 13.1515 17.4232C13.3332 17.0666 13.3332 16.5999 13.3332 15.6665V9.33317C13.3332 8.39975 13.3332 7.93304 13.1515 7.57652C12.9917 7.26292 12.7368 7.00795 12.4232 6.84816C12.0666 6.6665 11.5999 6.6665 10.6665 6.6665H4.33317C3.39975 6.6665 2.93304 6.6665 2.57652 6.84816C2.26292 7.00795 2.00795 7.26292 1.84816 7.57652C1.6665 7.93304 1.6665 8.39975 1.6665 9.33317V15.6665C1.6665 16.5999 1.6665 17.0666 1.84816 17.4232C2.00795 17.7368 2.26292 17.9917 2.57652 18.1515C2.93304 18.3332 3.39975 18.3332 4.33317 18.3332Z'
                                                          stroke='#EE7103'
                                                          stroke-width='1.66667'
                                                          stroke-linecap='round'
                                                          stroke-linejoin='round'
                                                        />
                                                      </g>
                                                      <defs>
                                                        <clipPath id='clip0_4347_5916'>
                                                          <rect
                                                            width='20'
                                                            height='20'
                                                            fill='white'
                                                          />
                                                        </clipPath>
                                                      </defs>
                                                    </svg>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className='relative markdown-code-block'>
                                                <div className='yaml-container'>
                                                  <SyntaxHighlighter
                                                    style={darcula as any}
                                                    language={match[1]}
                                                    PreTag='div'
                                                    wrapLines={true}
                                                    wrapLongLines={true}
                                                    showLineNumbers={true}
                                                    className={`markdown-code ${className}`}
                                                    {...props}
                                                  >
                                                    {String(children).replace(/\n$/, '')}
                                                  </SyntaxHighlighter>
                                                </div>
                                              </div>
                                            </>
                                          ) : (
                                            <code className={className} {...props}>
                                              {children}
                                            </code>
                                          )
                                        },
                                      }}
                                    >
                                      {cleanMarkdown(!responce?.error && responce?.message
                                        ? responce?.message
                                        : responce?.error
                                          ? responce?.error
                                          : "We're facing technical difficulties. Retry later, please.")}
                                    </ReactMarkdown>
                                  ) : (
                                    <div className='p-4'>
                                      <div className='flex flex-row'>
                                        <h2 className='text-white text-md font-normal leading-[150%]'>
                                          Validation Errors{' '}
                                        </h2>
                                        <span className='text-gray-500 text-md font-normal leading-6'>{`(${responce?.errors?.length} Errors found)`}</span>
                                      </div>
                                      <ul className='list-disc list-inside text-red-700'>
                                        {responce?.errors?.map((error: any, index: any) => (
                                          <li key={index}>{error}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ),
                    )}
                  </>
                ) : (
                  <>
                    {(inputMessage.length > 0 ? inputMessage : chatinputwss)?.map(
                      (responce: any, index: any) => {
                        if (divRef.current) {
                          divRef.current.scrollTop =
                            divRef.current.scrollHeight - divRef.current.clientHeight
                        }
                        return (
                          <>
                            <div key={index}>
                              {responce.question && (
                                <>
                                  <div className='flex mb-2 mt-[24px]'>
                                    <div className='bg-[#054D80] rounded-xl p-1'>
                                      <svg
                                        width='16'
                                        height='16'
                                        viewBox='0 0 16 16'
                                        fill='none'
                                        xmlns='http://www.w3.org/2000/svg'
                                      >
                                        <g id='recording-01'>
                                          <path
                                            id='Icon'
                                            d='M6.80001 13.3999L9.20001 13.3999M4.40001 10.6999L11.6 10.6999M2.60001 7.9999L13.4 7.9999M4.40001 5.2999L11.6 5.2999M6.80001 2.5999L9.20001 2.5999'
                                            stroke='white'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                        </g>
                                      </svg>
                                    </div>
                                    <div>
                                      <p className='overflow-hidden text-white text-wrap truncate font-inter font-medium ps-2  text-sm md:text-base'>
                                        You
                                      </p>
                                    </div>
                                  </div>
                                  <div className='mb-4 items-center justify-center w-full'>
                                    <div className='bg-[#054D80] text-white p-3 rounded-lg w-full break-words'>
                                      <ReactMarkdown
                                        components={{
                                          h1: ({ children }) => (
                                            <h1 className='markdown-heading'>{children}</h1>
                                          ),
                                          h2: ({ children }) => (
                                            <h2 className='markdown-heading'>{children}</h2>
                                          ),
                                          h3: ({ children }) => (
                                            <h3 className='markdown-heading'>{children}</h3>
                                          ),
                                          a: ({ node, ...props }) => (
                                            <a {...props} target='_blank' rel='noopener noreferrer'>
                                              {props.children}
                                            </a>
                                          ),
                                          code({
                                            inline,
                                            className,
                                            children,
                                            ...props
                                          }: CodeProps) {
                                            const match = /language-(\w+)/.exec(className || '')
                                            const codeContent = String(children).replace(/\n$/, '')
                                            return !inline && match ? (
                                              <div className='relative markdown-code-block'>
                                                <SyntaxHighlighter
                                                  style={darcula as any}
                                                  language={match[1]}
                                                  PreTag='div'
                                                  wrapLines={true}
                                                  wrapLongLines={true}
                                                  showLineNumbers={true}
                                                  className={`markdown-code ${className}`}
                                                  {...props}
                                                >
                                                  {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                              </div>
                                            ) : (
                                              <code className={className} {...props}>
                                                {children}
                                              </code>
                                            )
                                          },
                                        }}
                                      >
                                        {cleanMarkdown(!responce?.error && responce?.message
                                          ? responce?.message
                                          : responce?.error
                                            ? responce?.error
                                            : "We're facing technical difficulties. Retry later, please.")}
                                      </ReactMarkdown>
                                    </div>
                                  </div>
                                </>
                              )}

                              {!responce.question && !responce?.status && (responce?.message || responce?.error) && (
                                <div key={index}>
                                  <div className='flex mb-2 mt-[24px]'>
                                    <div className=''>
                                      <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='24'
                                        height='24'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                      >
                                        <circle cx='12' cy='12' r='12' fill='#1D2939' />
                                        <path
                                          fill-rule='evenodd'
                                          clip-rule='evenodd'
                                          d='M14.8765 10.8779L15.2961 11.2848L17 11.2862V10.7792L15.6267 9.44747H8.72307L8.30347 9.04054V7.77044L8.72307 7.36351H15.2291L15.6487 7.77044H16.9747V7.26486L15.9793 5.93311H7.97287L6.59961 7.26486V9.54611L7.97287 10.8779H14.8765ZM14.8765 13.1221L15.2961 12.7152L17 12.7138V13.2208L15.6267 14.5525H8.72307L8.30347 14.9595V16.2296L8.72307 16.6365H15.2291L15.6487 16.2296H16.9747V16.7351L15.9793 18.0669H7.97287L6.59961 16.7351V14.4539L7.97287 13.1221H14.8765Z'
                                          fill='#EE7103'
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <p className='overflow-hidden text-white text-wrap truncate font-inter font-medium ps-2  text-sm md:text-base'>
                                        S2S AI
                                      </p>
                                    </div>
                                  </div>
                                  <div className='mb-4 text-left items-center justify-center w-full'>
                                    <div className='bg-[#1d2939] text-white p-3 rounded-lg w-full break-words'>
                                      <ReactMarkdown
                                        components={{
                                          h1: ({ children }) => (
                                            <h1 className='markdown-heading'>{children}</h1>
                                          ),
                                          h2: ({ children }) => (
                                            <h2 className='markdown-heading'>{children}</h2>
                                          ),
                                          h3: ({ children }) => (
                                            <h3 className='markdown-heading'>{children}</h3>
                                          ),
                                          a: ({ node, ...props }) => (
                                            <a {...props} target='_blank' rel='noopener noreferrer'>
                                              {props.children}
                                            </a>
                                          ),
                                          code({
                                            inline,
                                            className,
                                            children,
                                            ...props
                                          }: CodeProps) {
                                            const match = /language-(\w+)/.exec(className || '')
                                            const codeContent = String(children).replace(/\n$/, '')
                                            return !inline && match ? (
                                              <>
                                                <>
                                                  <div className='flex items-center justify-between w-full h-[20px]'>
                                                    {/* Rule Text */}
                                                    <div className='text-white text-sm font-medium leading-5'>
                                                      Rule
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className='flex items-center gap-6'>
                                                      {/* Copy Button */}
                                                      <div className='flex items-center justify-center gap-1.5'>
                                                        <span className='text-[#EE7103] text-sm font-inter  leading-5'>
                                                          Copy
                                                        </span>
                                                        <svg
                                                          xmlns='http://www.w3.org/2000/svg'
                                                          width='20'
                                                          height='20'
                                                          viewBox='0 0 20 20'
                                                          fill='none'
                                                        >
                                                          <g clip-path='url(#clip0_4347_5948)'>
                                                            <path
                                                              d='M6.6665 6.6665V4.33317C6.6665 3.39975 6.6665 2.93304 6.84816 2.57652C7.00795 2.26292 7.26292 2.00795 7.57652 1.84816C7.93304 1.6665 8.39975 1.6665 9.33317 1.6665H15.6665C16.5999 1.6665 17.0666 1.6665 17.4232 1.84816C17.7368 2.00795 17.9917 2.26292 18.1515 2.57652C18.3332 2.93304 18.3332 3.39975 18.3332 4.33317V10.6665C18.3332 11.5999 18.3332 12.0666 18.1515 12.4232C17.9917 12.7368 17.7368 12.9917 17.4232 13.1515C17.0666 13.3332 16.5999 13.3332 15.6665 13.3332H13.3332M4.33317 18.3332H10.6665C11.5999 18.3332 12.0666 18.3332 12.4232 18.1515C12.7368 17.9917 12.9917 17.7368 13.1515 17.4232C13.3332 17.0666 13.3332 16.5999 13.3332 15.6665V9.33317C13.3332 8.39975 13.3332 7.93304 13.1515 7.57652C12.9917 7.26292 12.7368 7.00795 12.4232 6.84816C12.0666 6.6665 11.5999 6.6665 10.6665 6.6665H4.33317C3.39975 6.6665 2.93304 6.6665 2.57652 6.84816C2.26292 7.00795 2.00795 7.26292 1.84816 7.57652C1.6665 7.93304 1.6665 8.39975 1.6665 9.33317V15.6665C1.6665 16.5999 1.6665 17.0666 1.84816 17.4232C2.00795 17.7368 2.26292 17.9917 2.57652 18.1515C2.93304 18.3332 3.39975 18.3332 4.33317 18.3332Z'
                                                              stroke='#EE7103'
                                                              stroke-width='1.66667'
                                                              stroke-linecap='round'
                                                              stroke-linejoin='round'
                                                            />
                                                          </g>
                                                          <defs>
                                                            <clipPath id='clip0_4347_5948'>
                                                              <rect
                                                                width='20'
                                                                height='20'
                                                                fill='white'
                                                              />
                                                            </clipPath>
                                                          </defs>
                                                        </svg>
                                                      </div>

                                                      {/* Move to Detection Lab Button */}
                                                      <div className='flex items-center justify-center gap-1.5'>
                                                        <span className='text-[#EE7103] text-sm font-inter leading-5'>
                                                          Move to Detection Lab
                                                        </span>
                                                        <svg
                                                          xmlns='http://www.w3.org/2000/svg'
                                                          width='20'
                                                          height='20'
                                                          viewBox='0 0 20 20'
                                                          fill='none'
                                                        >
                                                          <g clip-path='url(#clip0_4347_6313)'>
                                                            <path
                                                              d='M8.74984 1.66883C8.1873 1.67646 7.84959 1.70903 7.57652 1.84816C7.26292 2.00795 7.00795 2.26292 6.84816 2.57652C6.70903 2.84959 6.67646 3.1873 6.66883 3.74984M16.2498 1.66883C16.8124 1.67646 17.1501 1.70903 17.4232 1.84816C17.7368 2.00795 17.9917 2.26292 18.1515 2.57652C18.2906 2.84958 18.3232 3.18729 18.3308 3.74983M18.3308 11.2498C18.3232 11.8124 18.2907 12.1501 18.1515 12.4232C17.9917 12.7368 17.7368 12.9917 17.4232 13.1515C17.1501 13.2906 16.8124 13.3232 16.2498 13.3308M18.3332 6.6665V8.33317M11.6665 1.6665H13.3331M4.33317 18.3332H10.6665C11.5999 18.3332 12.0666 18.3332 12.4232 18.1515C12.7368 17.9917 12.9917 17.7368 13.1515 17.4232C13.3332 17.0666 13.3332 16.5999 13.3332 15.6665V9.33317C13.3332 8.39975 13.3332 7.93304 13.1515 7.57652C12.9917 7.26292 12.7368 7.00795 12.4232 6.84816C12.0666 6.6665 11.5999 6.6665 10.6665 6.6665H4.33317C3.39975 6.6665 2.93304 6.6665 2.57652 6.84816C2.26292 7.00795 2.00795 7.26292 1.84816 7.57652C1.6665 7.93304 1.6665 8.39975 1.6665 9.33317V15.6665C1.6665 16.5999 1.6665 17.0666 1.84816 17.4232C2.00795 17.7368 2.26292 17.9917 2.57652 18.1515C2.93304 18.3332 3.39975 18.3332 4.33317 18.3332Z'
                                                              stroke='#EE7103'
                                                              stroke-width='1.66667'
                                                              stroke-linecap='round'
                                                              stroke-linejoin='round'
                                                            />
                                                          </g>
                                                          <defs>
                                                            <clipPath id='clip0_4347_6313'>
                                                              <rect
                                                                width='20'
                                                                height='20'
                                                                fill='white'
                                                              />
                                                            </clipPath>
                                                          </defs>
                                                        </svg>
                                                      </div>

                                                      {/* Move to a Collection Button */}
                                                      <div className='flex items-center justify-center gap-1.5'>
                                                        <span className='text-[#EE7103] text-sm font-inter leading-5'>
                                                          Move to a Collection
                                                        </span>
                                                        <svg
                                                          xmlns='http://www.w3.org/2000/svg'
                                                          width='20'
                                                          height='20'
                                                          viewBox='0 0 20 20'
                                                          fill='none'
                                                        >
                                                          <g clip-path='url(#clip0_4347_5916)'>
                                                            <path
                                                              d='M8.74984 1.66883C8.1873 1.67646 7.84959 1.70903 7.57652 1.84816C7.26292 2.00795 7.00795 2.26292 6.84816 2.57652C6.70903 2.84959 6.67646 3.1873 6.66883 3.74984M16.2498 1.66883C16.8124 1.67646 17.1501 1.70903 17.4232 1.84816C17.7368 2.00795 17.9917 2.26292 18.1515 2.57652C18.2906 2.84958 18.3232 3.18729 18.3308 3.74983M18.3308 11.2498C18.3232 11.8124 18.2907 12.1501 18.1515 12.4232C17.9917 12.7368 17.7368 12.9917 17.4232 13.1515C17.1501 13.2906 16.8124 13.3232 16.2498 13.3308M18.3332 6.6665V8.33317M11.6665 1.6665H13.3331M4.33317 18.3332H10.6665C11.5999 18.3332 12.0666 18.3332 12.4232 18.1515C12.7368 17.9917 12.9917 17.7368 13.1515 17.4232C13.3332 17.0666 13.3332 16.5999 13.3332 15.6665V9.33317C13.3332 8.39975 13.3332 7.93304 13.1515 7.57652C12.9917 7.26292 12.7368 7.00795 12.4232 6.84816C12.0666 6.6665 11.5999 6.6665 10.6665 6.6665H4.33317C3.39975 6.6665 2.93304 6.6665 2.57652 6.84816C2.26292 7.00795 2.00795 7.26292 1.84816 7.57652C1.6665 7.93304 1.6665 8.39975 1.6665 9.33317V15.6665C1.6665 16.5999 1.6665 17.0666 1.84816 17.4232C2.00795 17.7368 2.26292 17.9917 2.57652 18.1515C2.93304 18.3332 3.39975 18.3332 4.33317 18.3332Z'
                                                              stroke='#EE7103'
                                                              stroke-width='1.66667'
                                                              stroke-linecap='round'
                                                              stroke-linejoin='round'
                                                            />
                                                          </g>
                                                          <defs>
                                                            <clipPath id='clip0_4347_5916'>
                                                              <rect
                                                                width='20'
                                                                height='20'
                                                                fill='white'
                                                              />
                                                            </clipPath>
                                                          </defs>
                                                        </svg>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className='relative markdown-code-block'>
                                                    <div className='yaml-container'>
                                                      <SyntaxHighlighter
                                                        style={darcula as any}
                                                        language={match[1]}
                                                        PreTag='div'
                                                        wrapLines={true}
                                                        wrapLongLines={true}
                                                        showLineNumbers={true}
                                                        className={`markdown-code ${className}`}
                                                        {...props}
                                                      >
                                                        {String(children).replace(/\n$/, '')}
                                                      </SyntaxHighlighter>
                                                    </div>
                                                  </div>
                                                </>
                                              </>
                                            ) : (
                                              <code className={className} {...props}>
                                                {children}
                                              </code>
                                            )
                                          },
                                        }}
                                      >
                                        {cleanMarkdown(!responce?.error && responce?.message
                                          ? responce?.message
                                          : responce?.error
                                            ? responce?.error
                                            : "We're facing technical difficulties. Retry later, please.")}
                                      </ReactMarkdown>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {responce?.status && (<div>
                                <div className='bouncing-loader'>
                                  <div></div>
                                  <div></div>
                                  <div></div>

                                  <span
                                    style={{
                                      fontSize: 12,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      marginLeft: 40,
                                    }}
                                  >
                                    {responce?.status}
                                  </span>

                                </div>
                              </div>)}
                            </div>
                          </>
                        )
                      },
                    )}
                    {(ctiChat.length > 0 ? ctiChat : responceChatwss).length > 0 && (
                      <div>
                        <div className='flex mb-2 mt-[24px]'>
                          <div className=''>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='24'
                              height='24'
                              viewBox='0 0 24 24'
                              fill='none'
                            >
                              <circle cx='12' cy='12' r='12' fill='#1D2939' />
                              <path
                                fill-rule='evenodd'
                                clip-rule='evenodd'
                                d='M14.8765 10.8779L15.2961 11.2848L17 11.2862V10.7792L15.6267 9.44747H8.72307L8.30347 9.04054V7.77044L8.72307 7.36351H15.2291L15.6487 7.77044H16.9747V7.26486L15.9793 5.93311H7.97287L6.59961 7.26486V9.54611L7.97287 10.8779H14.8765ZM14.8765 13.1221L15.2961 12.7152L17 12.7138V13.2208L15.6267 14.5525H8.72307L8.30347 14.9595V16.2296L8.72307 16.6365H15.2291L15.6487 16.2296H16.9747V16.7351L15.9793 18.0669H7.97287L6.59961 16.7351V14.4539L7.97287 13.1221H14.8765Z'
                                fill='#EE7103'
                              />
                            </svg>
                          </div>
                          <div>
                            <p className='overflow-hidden text-white text-wrap truncate font-inter font-medium ps-2  text-sm md:text-base'>
                              S2S AI
                            </p>
                          </div>
                        </div>
                        {(ctiChat.length > 0 ? ctiChat : responceChatwss)?.map(
                          (responce: any, index: any) => {
                            if (divRef.current) {
                              divRef.current.scrollTop =
                                divRef.current.scrollHeight - divRef.current.clientHeight
                            }
                            return (
                              <>
                                {/* Message 2 */}
                                {!responce.question && (
                                  <div key={index}>
                                    <div className='mb-4 text-left items-center justify-center w-full'>
                                      <div className='bg-[#1d2939] text-white p-3 rounded-lg w-full break-words'>
                                        <ReactMarkdown
                                          components={{
                                            h1: ({ children }) => (
                                              <h1 className='markdown-heading'>{children}</h1>
                                            ),
                                            h2: ({ children }) => (
                                              <h2 className='markdown-heading'>{children}</h2>
                                            ),
                                            h3: ({ children }) => (
                                              <h3 className='markdown-heading'>{children}</h3>
                                            ),
                                            a: ({ node, ...props }) => (
                                              <a
                                                {...props}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                              >
                                                {props.children}
                                              </a>
                                            ),
                                            code({
                                              inline,
                                              className,
                                              children,
                                              ...props
                                            }: CodeProps) {
                                              const match = /language-(\w+)/.exec(className || '')

                                              return !inline && match ? (
                                                <>
                                                  <div className='flex items-center justify-between w-full h-[20px]'>
                                                    {/* Rule Text */}
                                                    <div className='text-white text-sm font-medium leading-5'>
                                                      Rule
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className='flex items-center gap-6'>
                                                      {/* Copy Button */}
                                                      <div className='flex items-center justify-center gap-1.5'>
                                                        <span className='text-[#EE7103] text-sm font-inter  leading-5'>
                                                          Copy
                                                        </span>
                                                        <svg
                                                          xmlns='http://www.w3.org/2000/svg'
                                                          width='20'
                                                          height='20'
                                                          viewBox='0 0 20 20'
                                                          fill='none'
                                                        >
                                                          <g clip-path='url(#clip0_4347_5948)'>
                                                            <path
                                                              d='M6.6665 6.6665V4.33317C6.6665 3.39975 6.6665 2.93304 6.84816 2.57652C7.00795 2.26292 7.26292 2.00795 7.57652 1.84816C7.93304 1.6665 8.39975 1.6665 9.33317 1.6665H15.6665C16.5999 1.6665 17.0666 1.6665 17.4232 1.84816C17.7368 2.00795 17.9917 2.26292 18.1515 2.57652C18.3332 2.93304 18.3332 3.39975 18.3332 4.33317V10.6665C18.3332 11.5999 18.3332 12.0666 18.1515 12.4232C17.9917 12.7368 17.7368 12.9917 17.4232 13.1515C17.0666 13.3332 16.5999 13.3332 15.6665 13.3332H13.3332M4.33317 18.3332H10.6665C11.5999 18.3332 12.0666 18.3332 12.4232 18.1515C12.7368 17.9917 12.9917 17.7368 13.1515 17.4232C13.3332 17.0666 13.3332 16.5999 13.3332 15.6665V9.33317C13.3332 8.39975 13.3332 7.93304 13.1515 7.57652C12.9917 7.26292 12.7368 7.00795 12.4232 6.84816C12.0666 6.6665 11.5999 6.6665 10.6665 6.6665H4.33317C3.39975 6.6665 2.93304 6.6665 2.57652 6.84816C2.26292 7.00795 2.00795 7.26292 1.84816 7.57652C1.6665 7.93304 1.6665 8.39975 1.6665 9.33317V15.6665C1.6665 16.5999 1.6665 17.0666 1.84816 17.4232C2.00795 17.7368 2.26292 17.9917 2.57652 18.1515C2.93304 18.3332 3.39975 18.3332 4.33317 18.3332Z'
                                                              stroke='#EE7103'
                                                              stroke-width='1.66667'
                                                              stroke-linecap='round'
                                                              stroke-linejoin='round'
                                                            />
                                                          </g>
                                                          <defs>
                                                            <clipPath id='clip0_4347_5948'>
                                                              <rect
                                                                width='20'
                                                                height='20'
                                                                fill='white'
                                                              />
                                                            </clipPath>
                                                          </defs>
                                                        </svg>
                                                      </div>

                                                      {/* Move to Detection Lab Button */}
                                                      <div className='flex items-center justify-center gap-1.5'>
                                                        <span className='text-[#EE7103] text-sm font-inter leading-5'>
                                                          Move to Detection Lab
                                                        </span>
                                                        <svg
                                                          xmlns='http://www.w3.org/2000/svg'
                                                          width='20'
                                                          height='20'
                                                          viewBox='0 0 20 20'
                                                          fill='none'
                                                        >
                                                          <g clip-path='url(#clip0_4347_6313)'>
                                                            <path
                                                              d='M8.74984 1.66883C8.1873 1.67646 7.84959 1.70903 7.57652 1.84816C7.26292 2.00795 7.00795 2.26292 6.84816 2.57652C6.70903 2.84959 6.67646 3.1873 6.66883 3.74984M16.2498 1.66883C16.8124 1.67646 17.1501 1.70903 17.4232 1.84816C17.7368 2.00795 17.9917 2.26292 18.1515 2.57652C18.2906 2.84958 18.3232 3.18729 18.3308 3.74983M18.3308 11.2498C18.3232 11.8124 18.2907 12.1501 18.1515 12.4232C17.9917 12.7368 17.7368 12.9917 17.4232 13.1515C17.1501 13.2906 16.8124 13.3232 16.2498 13.3308M18.3332 6.6665V8.33317M11.6665 1.6665H13.3331M4.33317 18.3332H10.6665C11.5999 18.3332 12.0666 18.3332 12.4232 18.1515C12.7368 17.9917 12.9917 17.7368 13.1515 17.4232C13.3332 17.0666 13.3332 16.5999 13.3332 15.6665V9.33317C13.3332 8.39975 13.3332 7.93304 13.1515 7.57652C12.9917 7.26292 12.7368 7.00795 12.4232 6.84816C12.0666 6.6665 11.5999 6.6665 10.6665 6.6665H4.33317C3.39975 6.6665 2.93304 6.6665 2.57652 6.84816C2.26292 7.00795 2.00795 7.26292 1.84816 7.57652C1.6665 7.93304 1.6665 8.39975 1.6665 9.33317V15.6665C1.6665 16.5999 1.6665 17.0666 1.84816 17.4232C2.00795 17.7368 2.26292 17.9917 2.57652 18.1515C2.93304 18.3332 3.39975 18.3332 4.33317 18.3332Z'
                                                              stroke='#EE7103'
                                                              stroke-width='1.66667'
                                                              stroke-linecap='round'
                                                              stroke-linejoin='round'
                                                            />
                                                          </g>
                                                          <defs>
                                                            <clipPath id='clip0_4347_6313'>
                                                              <rect
                                                                width='20'
                                                                height='20'
                                                                fill='white'
                                                              />
                                                            </clipPath>
                                                          </defs>
                                                        </svg>
                                                      </div>

                                                      {/* Move to a Collection Button */}
                                                      <div className='flex items-center justify-center gap-1.5'>
                                                        <span className='text-[#EE7103] text-sm font-inter leading-5'>
                                                          Move to a Collection
                                                        </span>
                                                        <svg
                                                          xmlns='http://www.w3.org/2000/svg'
                                                          width='20'
                                                          height='20'
                                                          viewBox='0 0 20 20'
                                                          fill='none'
                                                        >
                                                          <g clip-path='url(#clip0_4347_5916)'>
                                                            <path
                                                              d='M8.74984 1.66883C8.1873 1.67646 7.84959 1.70903 7.57652 1.84816C7.26292 2.00795 7.00795 2.26292 6.84816 2.57652C6.70903 2.84959 6.67646 3.1873 6.66883 3.74984M16.2498 1.66883C16.8124 1.67646 17.1501 1.70903 17.4232 1.84816C17.7368 2.00795 17.9917 2.26292 18.1515 2.57652C18.2906 2.84958 18.3232 3.18729 18.3308 3.74983M18.3308 11.2498C18.3232 11.8124 18.2907 12.1501 18.1515 12.4232C17.9917 12.7368 17.7368 12.9917 17.4232 13.1515C17.1501 13.2906 16.8124 13.3232 16.2498 13.3308M18.3332 6.6665V8.33317M11.6665 1.6665H13.3331M4.33317 18.3332H10.6665C11.5999 18.3332 12.0666 18.3332 12.4232 18.1515C12.7368 17.9917 12.9917 17.7368 13.1515 17.4232C13.3332 17.0666 13.3332 16.5999 13.3332 15.6665V9.33317C13.3332 8.39975 13.3332 7.93304 13.1515 7.57652C12.9917 7.26292 12.7368 7.00795 12.4232 6.84816C12.0666 6.6665 11.5999 6.6665 10.6665 6.6665H4.33317C3.39975 6.6665 2.93304 6.6665 2.57652 6.84816C2.26292 7.00795 2.00795 7.26292 1.84816 7.57652C1.6665 7.93304 1.6665 8.39975 1.6665 9.33317V15.6665C1.6665 16.5999 1.6665 17.0666 1.84816 17.4232C2.00795 17.7368 2.26292 17.9917 2.57652 18.1515C2.93304 18.3332 3.39975 18.3332 4.33317 18.3332Z'
                                                              stroke='#EE7103'
                                                              stroke-width='1.66667'
                                                              stroke-linecap='round'
                                                              stroke-linejoin='round'
                                                            />
                                                          </g>
                                                          <defs>
                                                            <clipPath id='clip0_4347_5916'>
                                                              <rect
                                                                width='20'
                                                                height='20'
                                                                fill='white'
                                                              />
                                                            </clipPath>
                                                          </defs>
                                                        </svg>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className='relative markdown-code-block'>
                                                    <div className='yaml-container'>
                                                      <SyntaxHighlighter
                                                        style={darcula as any}
                                                        language={match[1]}
                                                        PreTag='div'
                                                        wrapLines={true}
                                                        wrapLongLines={true}
                                                        showLineNumbers={true}
                                                        className={`markdown-code ${className}`}
                                                        {...props}
                                                      >
                                                        {String(children).replace(/\n$/, '')}
                                                      </SyntaxHighlighter>
                                                    </div>
                                                  </div>
                                                </>
                                              ) : (
                                                <code className={className} {...props}>
                                                  {children}
                                                </code>
                                              )
                                            },
                                          }}
                                        >
                                          {cleanMarkdown(!responce?.error && responce?.message
                                            ? responce?.message
                                            : responce?.error
                                              ? responce?.error
                                              : "We're facing technical difficulties. Retry later, please.")}
                                        </ReactMarkdown>
                                        <span className='mt-2'>
                                          <div
                                            className={`inline-block h-4 w-4 bg-white rounded-full mb-[-0.2rem] ml-2`}
                                          ></div>
                                        </span>
                                      </div>
                                    </div>
                                    <div ref={bottomRef}></div>
                                  </div>
                                )}
                              </>
                            )
                          },
                        )}
                        <div ref={bottomRef}></div>
                      </div>
                    )}
                    {ctiChat?.length == 0 && responceChatwss?.length == 0 && (
                      <div>
                        <div className='bouncing-loader'>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={bottomRef}></div>
              </div>

              {/* Right Section */}
              <div className='col-span-3 flex items-center justify-center'></div>
            </div>
          </div>
          <div className='p-4'>
            <div className='grid grid-cols-12 items-center gap-4'>
              <div className='col-span-3 flex items-center justify-center'></div>

              <div className='col-span-6 relative'>
                <div className='box-border bg-[#1d2939] rounded-[10px] border-2 border-[#1d2939] p-[14px_14px_14px_22px] flex flex-col gap-2 items-center justify-center relative overflow-hidden'>
                  <div className='flex flex-row gap-4 items-center justify-start self-stretch flex-shrink-0 relative'>
                    <textarea
                      placeholder={'Type your message...'}
                      className='text-[#98a2b3] text-left font-medium text-[16px] leading-[24px] bg-transparent border-none outline-none w-full max-h-32 resize-none'
                      value={sendmessage}
                      onChange={handleOnChange}
                      onInput={handleResize}
                      onKeyDown={handleKeyDown}
                      rows={rows}
                    />

                    {!sendwssconnect && (<button disabled={!sendmessage ? true : false} type='button' onClick={() => handleWebSocket()} className={`${!sendmessage ? 'cursor-not-allowed opacity-50 hover bg-orange-600' : 'bg-orange-600 cursor-pointer'} bg-orange-600 rounded-md p-2 flex flex-row gap-1 items-center justify-center flex-shrink-0 relative shadow-[0px_1px_2px_rgba(16,24,40,0.05)] overflow-hidden`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M8.74976 11.2501L17.4998 2.50014M8.85608 11.5235L11.0462 17.1552C11.2391 17.6513 11.3356 17.8994 11.4746 17.9718C11.5951 18.0346 11.7386 18.0347 11.8592 17.972C11.9983 17.8998 12.095 17.6518 12.2886 17.1559L17.7805 3.08281C17.9552 2.63516 18.0426 2.41133 17.9948 2.26831C17.9533 2.1441 17.8558 2.04663 17.7316 2.00514C17.5886 1.95736 17.3647 2.0447 16.9171 2.21939L2.84398 7.71134C2.34808 7.90486 2.10013 8.00163 2.02788 8.14071C1.96524 8.26129 1.96532 8.40483 2.0281 8.52533C2.10052 8.66433 2.34859 8.7608 2.84471 8.95373L8.47638 11.1438C8.57708 11.183 8.62744 11.2026 8.66984 11.2328C8.70742 11.2596 8.74028 11.2925 8.76709 11.3301C8.79734 11.3725 8.81692 11.4228 8.85608 11.5235Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </button>)}
                    {sendwssconnect && (<button type='button' onClick={() => stopWebSocket()} className={`${'bg-orange-600 cursor-pointer'} bg-orange-600 rounded-md p-2 flex flex-row gap-1 items-center justify-center flex-shrink-0 relative shadow-[0px_1px_2px_rgba(16,24,40,0.05)] overflow-hidden`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 20 20" fill="none">
                        <path d="M9.99999 18.3333C14.6024 18.3333 18.3333 14.6023 18.3333 9.99996C18.3333 5.39759 14.6024 1.66663 9.99999 1.66663C5.39762 1.66663 1.66666 5.39759 1.66666 9.99996C1.66666 14.6023 5.39762 18.3333 9.99999 18.3333Z" stroke={`${'orange'}`} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6.66666 7.99996C6.66666 7.53325 6.66666 7.29989 6.75748 7.12163C6.83738 6.96483 6.96486 6.83735 7.12166 6.75745C7.29992 6.66663 7.53328 6.66663 7.99999 6.66663H12C12.4667 6.66663 12.7001 6.66663 12.8783 6.75745C13.0351 6.83735 13.1626 6.96483 13.2425 7.12163C13.3333 7.29989 13.3333 7.53325 13.3333 7.99996V12C13.3333 12.4667 13.3333 12.7 13.2425 12.8783C13.1626 13.0351 13.0351 13.1626 12.8783 13.2425C12.7001 13.3333 12.4667 13.3333 12 13.3333H7.99999C7.53328 13.3333 7.29992 13.3333 7.12166 13.2425C6.96486 13.1626 6.83738 13.0351 6.75748 12.8783C6.66666 12.7 6.66666 12.4667 6.66666 12V7.99996Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>)}
                  </div>
                </div>
              </div>

              <div className='col-span-3 flex items-center justify-center'></div>
            </div>
          </div>
        </div>
        <CopyAndNewCollectionsDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setDialogOpen(false)
          }}
          selectedRows={selectedRows}
          collectiondata={collectiondata}
          pramasdata={collectionorcti}
          setDialogOpen={setDialogOpen}
          importId={null}
        />
      </div>
    </>
  )
}

export default RuleAgentChat
