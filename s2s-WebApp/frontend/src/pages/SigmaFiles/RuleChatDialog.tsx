import React, { RefObject, useEffect, useRef, useState } from 'react'
import local from '../../utils/local'
import { useDispatch } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import { createChat } from '../../redux/nodes/chatPage/action'
import { ChatHistoryDetails, chatSideList } from '../../redux/nodes/chat/action'
import { environment } from '../../environment/environment'
import { v4 as uuidv4 } from 'uuid'
import { useData } from '../../layouts/shared/DataProvider'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  ymltext?: any
  handelValidation: any
  messages: any
  setMessages: any
  yamlOpen: any
  setYamlOpen: any
}

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

const RuleChatDialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  ymltext,
  handelValidation,
  messages,
  setMessages,
  yamlOpen,
  setYamlOpen,
}) => {
  if (!isOpen) return null
  const { authordetails, setAuthordetails, setSigmaViewwss }: any = useData()
  const [isClosing, setIsClosing] = useState(false)
  const dispatch = useDispatch()
  const location = useLocation()
  const { state } = location
  const { id: paramsId } = useParams()
  const Token = local.getItem('bearerToken')
  const token = JSON.parse(Token as any)
  const localStorageauth = local.getItem('auth')
  const localss = JSON.parse(localStorageauth as any)
  const userIdchat: any = localss?.user?.user?.id
  const [sessionList, setSessionList] = useState([] as any)

  const [inputMessage, setInputMessage] = useState<any[]>([])
  const [sendmessage, setSendmessage] = useState('' as any)
  const socketRef = useRef<WebSocket | null>(null)
  const [ctiChat, setctiChat] = useState([] as any)
  const [sessionid, setSessionId] = useState(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const divRef: RefObject<HTMLDivElement> = useRef(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const [getYamlText, setGetYamlText] = useState(null as any)
  const handleClose = () => {
    setYamlOpen(false)
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 500) // Match animation duration
  }

  useEffect(() => {
    fetchSessiondetails()
  }, [])

  const fetchSessiondetails = () => {
    dispatch(chatSideList(token, paramsId) as any).then((res: any) => {
      if (res.type == 'CHAT_DETAIL_SUCCESS') {
        setSessionList(res?.payload)
      }
    })
  }

  useEffect(() => {
    if (sessionList?.length > 0) {
      fetchHistoryAllData()
    }
  }, [sessionList])

  const fetchHistoryAllData = () => {
    let noOfprompts: any = 100
    dispatch(ChatHistoryDetails(userIdchat, sessionList[0]?.id, noOfprompts) as any).then(
      (reponse: any) => {
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
      },
    )
  }

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      handleWebSocket()
    }
  }

  const handleWebSocket = () => {
    if (!sessionid && sessionList.length == 0) {
      const selectFiles = {
        vaultId: 0,
        id: 0,
        ruleId: paramsId,
        mitreLocation: null,
        global: false,
        sessionItem: true,
      }
      const chatObj = {
        sessionName: state?.sigmadetail?.title,
      }
      dispatch(createChat(selectFiles, chatObj) as any).then((newChatResponse: any) => {
        if (newChatResponse.type == 'CREATE_CHAT_SUCCESS') {
          connectWebSocket(newChatResponse.payload.id)
          setSessionId(newChatResponse.payload.id)
          fetchSessiondetails()
        }
      })
    } else {
      if (sendmessage && sessionList?.length > 0) {
        connectWebSocket(sessionList[0]?.id)
      }
    }
  }

  const connectWebSocket = (id: any) => {
    setGetYamlText(null)
    const localStorage1 = local.getItem('bearerToken')
    const token = JSON.parse(localStorage1 as any)
    const barearTockens = token?.bearerToken.split(' ')
    if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
      const socket = new WebSocket(
        `${environment?.baseWssUrl}/intel-chat/${id}/${authordetails?.title}?Authorization=${barearTockens[1]}`,
      )
      socketRef.current = socket

      socket.onopen = () => {
        console.log('Connected to WebSocket server')
        let object: any = {
          message_id: uuidv4(),
          message: !yamlOpen ? sendmessage : sendmessage + ' ' + ymltext,
          focus: 'rule_agent',
          report_id: paramsId,
        }
        setSendmessage('')
        setMessages((prevMessages: any) => [
          ...prevMessages,
          { message: sendmessage, question: true },
        ])
        setInputMessage([...messages, { message: sendmessage, question: true }])
        // Send the initial message right after connecting
        socket.send(JSON.stringify(object))
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
          setYamlOpen(false)
          setSigmaViewwss(false)
          setMessages((prev: any) => [...prev, ...mergedMessages])
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

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      {/* Dialog Content */}
      <div
        className={`bg-[#1D2939] rounded-lg shadow-lg ${
          isClosing ? 'animate-widthCollapse' : 'animate-widthExpand'
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className='p-4 h-full'>
          <div className='flex items-center justify-between w-full h-[40px]'>
            {/* Title Section */}
            <div className='text-white text-[18px] font-inter font-semibold leading-[28px] break-words mt-[-10px]'>
              Chat with: {authordetails?.title}
            </div>
            {/* Buttons Section */}
            <div className='flex items-center gap-[12px] mt-[-10px]'>
              {/* Cancel Button */}
              <button
                onClick={handleClose}
                className='w-[90px] px-4 py-1 bg-white shadow-[0px_1px_2px_rgba(16,24,40,0.05)] rounded-[8px] flex items-center justify-center'
              >
                <span className='text-[#0F121B] text-[16px] font-inter font-semibold leading-[24px]'>
                  Cancel
                </span>
              </button>
              {/* Save Button */}
              <button
                onClick={() => handelValidation(getYamlText, 'chatvalidation')}
                disabled={getYamlText ? false : true}
                className={`w-[74px] px-4 py-1 ${
                  getYamlText
                    ? 'bg-orange-500 text-[#fff] cursor-pointer'
                    : `cursor-not-allowed opacity-50 bg-[rgba(238,113,3,0.50)] text-[rgba(255,255,255,0.50)]`
                } shadow-[0px_1px_2px_rgba(16,24,40,0.05)] rounded-[8px] flex items-center justify-center`}
              >
                <span className=' text-[16px] font-inter font-semibold leading-[24px]'>Save</span>
              </button>
            </div>
          </div>
          <div
            style={{
              height: `95%`,
              width: '100%',
              textAlign: 'left',
              overflowY: 'hidden',
              backgroundColor: '#1D2939',
              borderRadius: '8px',
              // marginLeft: '20px',
            }}
          >
            <div className='grid grid-rows-[1fr_auto] h-full'>
              <div className='overflow-y-auto p-4'>
                <div className='grid grid-cols-12 items-center gap-4'>
                  <div className='col-span-12 relative'>
                    {/* Message 1 */}
                    {ctiChat?.length == 0 ? (
                      <>
                        {messages.map((responce: any, index: any) => (
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
                                      {!responce?.error && responce?.message
                                        ? responce?.message
                                        : responce?.error
                                        ? responce?.error
                                        : "We're facing technical difficulties. Retry later, please."}
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
                                  <div className='bg-[#0C111D] text-white p-3 rounded-lg w-full break-words'>
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
                                          code({
                                            inline,
                                            className,
                                            children,
                                            ...props
                                          }: CodeProps) {
                                            const match = /language-(\w+)/.exec(className || '')
                                            const codeContent = String(children).replace(/\n$/, '')
                                            if (match && match[1] === 'yaml') {
                                              setGetYamlText(codeContent)
                                              sessionStorage.setItem(
                                                'ymal',
                                                JSON.stringify(codeContent),
                                              )
                                            }

                                            return !inline && match ? (
                                              <>
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
                                        {!responce?.error && responce?.message
                                          ? responce?.message
                                          : responce?.error
                                          ? responce?.error
                                          : "We're facing technical difficulties. Please try again later."}
                                      </ReactMarkdown>
                                    ) : (
                                      <div className='p-4'>
                                        <div className='flex flex-row'>
                                          <h2 className='text-white text-md font-normal leading-[150%]'>
                                            Validation Errors{' '}
                                          </h2>
                                          <span className='text-gray-500 text-md font-normal leading-6'>{`(${responce?.errors.length} Errors found)`}</span>
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
                        ))}
                      </>
                    ) : (
                      <>
                        {inputMessage?.map((responce: any, index: any) => {
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
                                              const codeContent = String(children).replace(
                                                /\n$/,
                                                '',
                                              )
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
                                          {!responce?.error && responce?.message
                                            ? responce?.message
                                            : responce?.error
                                            ? responce?.error
                                            : "We're facing technical difficulties. Please try again later."}
                                        </ReactMarkdown>
                                      </div>
                                    </div>
                                  </>
                                )}

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
                                      <div className='bg-[#0C111D] text-white p-3 rounded-lg w-full break-words'>
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
                                              const codeContent = String(children).replace(
                                                /\n$/,
                                                '',
                                              )
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
                                          {!responce?.error && responce?.message
                                            ? responce?.message
                                            : responce?.error
                                            ? responce?.error
                                            : "We're facing technical difficulties. Please try again later."}
                                        </ReactMarkdown>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </>
                          )
                        })}
                        {ctiChat.length > 0 && (
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
                            {ctiChat.map((responce: any, index: any) => {
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
                                        <div className='bg-[#0C111D] text-white p-3 rounded-lg w-full break-words'>
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
                                                const codeContent = String(children).replace(
                                                  /\n$/,
                                                  '',
                                                )
                                                return !inline && match ? (
                                                  <>
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
                                            {!responce?.error && responce?.message
                                              ? responce?.message
                                              : responce?.error
                                              ? responce?.error
                                              : "We're facing technical difficulties. Please try again later."}
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
                            })}
                            <div ref={bottomRef}></div>
                          </div>
                        )}
                      </>
                    )}
                    <div ref={bottomRef}></div>
                  </div>
                </div>
              </div>
              <div className='p-4'>
                <div className='grid grid-cols-12 items-center gap-4'>
                  <div className='col-span-12 relative'>
                    <input
                      value={sendmessage}
                      type='text'
                      placeholder='Type your message...'
                      className='w-full p-3 pr-12 bg-[#0C111D] border border-[#0C111D] rounded-lg  text-[#98A2B3] outline-none'
                      onChange={(e) => setSendmessage(e?.target?.value)}
                      onKeyDown={(e) => {
                        handleKeyDown(e)
                      }}
                    />

                    <button
                      onClick={() => handleWebSocket()}
                      type='submit'
                      className='absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-2 bg-[#EE7103] text-white rounded-lg  transition'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='20'
                        viewBox='0 0 20 20'
                        fill='none'
                      >
                        <path
                          d='M8.74976 11.2501L17.4998 2.50014M8.85608 11.5235L11.0462 17.1552C11.2391 17.6513 11.3356 17.8994 11.4746 17.9718C11.5951 18.0346 11.7386 18.0347 11.8592 17.972C11.9983 17.8998 12.095 17.6518 12.2886 17.1559L17.7805 3.08281C17.9552 2.63516 18.0426 2.41133 17.9948 2.26831C17.9533 2.1441 17.8558 2.04663 17.7316 2.00514C17.5886 1.95736 17.3647 2.0447 16.9171 2.21939L2.84398 7.71134C2.34808 7.90486 2.10013 8.00163 2.02788 8.14071C1.96524 8.26129 1.96532 8.40483 2.0281 8.52533C2.10052 8.66433 2.34859 8.7608 2.84471 8.95373L8.47638 11.1438C8.57708 11.183 8.62744 11.2026 8.66984 11.2328C8.70742 11.2596 8.74028 11.2925 8.76709 11.3301C8.79734 11.3725 8.81692 11.4228 8.85608 11.5235Z'
                          stroke='white'
                          stroke-width='1.66667'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RuleChatDialog
