import Button from '@mui/material/Button'
import { makeStyles } from '@mui/styles'
import React, { RefObject, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import local from '../../utils/local'
import { v4 as uuidv4 } from 'uuid'
import { environment } from '../../environment/environment'
import { ChatHistoryDetails, ChatHistoryFindOne } from '../../redux/nodes/chat/action'
import { useData } from '../../layouts/shared/DataProvider'
import '../datavault/ChatView.css'

interface MyComponentProps {
  height?: number // Define the animate property as optional
}

interface Message {
  message: string
  question: boolean
}

const ChatView = () => {
  const { id } = useParams()
  const location = useLocation()
  const state = location.state
  const { setDetail }: any = useData()
  const navigateTo = useNavigate()
  const dispatch = useDispatch()
  const localStorage = local.getItem('auth')
  const locals = JSON.parse(localStorage as any)
  const userIdchat: any = locals?.user?.user?.id

  const [isSend, setisSend] = useState(false)

  const [showSidebar, setShowSidebar] = useState(false)
  const [isInputStatusOpen, setIsInputStatusOpen] = useState(false)
  const [isStatus, setisStatus] = useState(false)

  const [selectedOption, setSelectedOption] = useState('auto' as any)
  const [cancelChat, setCancelChat] = useState(false)
  const [ctiChat, setctiChat] = useState([] as any)
  const [dummy, setDummy] = useState([] as any)
  let retryCnt = 0

  const [states, setStates] = useState({
    chatposition: 5,
    value: '',
    rows: 1,
    minRows: 1,
  })
  const useStyles = makeStyles((theme: any) => ({
    container: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      width: '100%',
      height: '79vh',
      display: 'flex',
      flexDirection: 'column',
    },
    mainContainer: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      width: '100%',
      height: '88vh',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      scrollBehavior: 'smooth',
      '&::-webkit-scrollbar': {
        width: '7px',
        height: '7px',
      },
      '&::-webkit-scrollbar-track': {
        'background-color': '#FFFFFF',
      },
      '&::-webkit-scrollbar-thumb': {
        'background-color': '#d9d5d5',
      },
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
      marginBottom: states.chatposition + 'px',
    },
    searchInputContainer: {
      display: 'flex',
      alignSelf: 'end',
      width: '100%',
      marginTop: 'auto',
      border: '1px solid #0c0c0c',
    },
    scrollContainer: {
      overflowY: 'auto',
      scrollBehavior: 'smooth',
      '&::-webkit-scrollbar': {
        width: '7px',
        height: '7px',
      },
      '&::-webkit-scrollbar-track': {
        'background-color': '',
      },
      '&::-webkit-scrollbar-thumb': {
        'background-color': '#d9d5d5',
      },
    },
    lastTwoLines: {
      color: 'red',
    },
    formContainer: {
      marginTop: '16px',
      height: (props: MyComponentProps) => `${props?.height}vh`,
      overflowY: 'auto',
      '&::-webkit-scrollbar': {
        width: '7px',
        height: '7px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: '#0C111D',
        margin: '40px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#1D2939',
      },
    },
  }))

  const [valueInput, setValueInput] = useState('' as any)
  const [defaultInput, setdefaultInput] = useState(null as any)
  const [readOnly, setReadOnly] = useState(false)
  const handleChange = (event: any) => {
    setValueInput(event.target.value)
    setdefaultInput(event.target.value)
    const textareaLineHeight = 32
    const { minRows } = states
    const previousRows = event.target.rows
    event.target.rows = minRows
    const currentRows = (event.target.scrollHeight - textareaLineHeight) / 20
    if (currentRows === previousRows) {
      event.target.rows = currentRows
    }
    setStates({
      chatposition: currentRows * 5,
      value: event.target.value,
      rows: currentRows,
      minRows: 1,
    })
  }

  const classes = useStyles({ height: 100 })
  const { register } = useForm({
    defaultValues: {
      message: '',
    },
  })
  const InputStatusOpen = () => {
    setIsInputStatusOpen(!isInputStatusOpen)
  }

  const handleDropDown = () => {
    if (isStatus) {
      setisStatus(false)
    } else if (isInputStatusOpen) {
      setIsInputStatusOpen(false)
    }
  }
  const [sidbarcard, setSidebarCard] = useState([] as any)
  const toShowSideView = (data: any) => {
    setSidebarCard(data.slice(3))
    setShowSidebar(true)
  }

  useEffect(() => {
    const handleScroll = () => {
      setisStatus(false)
    }
    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const errorSvg = (
    <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'>
      <path
        d='M6 4V6M6 8H6.005M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z'
        stroke='#B42318'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  )

  useEffect(() => {
    setDummy([
      {
        question: 'What does the Intel report say about Scattered Spider’s initial access vector?',
        status: 'CTI Report',
        CTIReport: {
          answer:
            'Scattered Spider threat actors create new user identities in the targeted organization or may modify MFA tokens to gain access to a victim’s network.',
          card: [
            {
              cardTitle: 'CACTUS: Analyzing a Coordinated Ransom...',
              cardfooter: 'Bit Defender',
            },
            {
              cardTitle: 'TTP: T1136',
              cardfooter: 'MITE ATT&CK',
            },
            {
              cardTitle: 'TTP: T1556.006',
              cardfooter: 'MITE ATT&CK',
            },
          ],
        },
      },
    ])
  }, [])

  const [selectedFileHistory, setSelectedHistory] = useState(null as any)

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && !event.shiftKey && !readOnly) {
      event.preventDefault()
      sendMessage()

      setTimeout(() => {
        setStates({ value: '', rows: 1, minRows: 1, chatposition: 5 })
      }, 0)
    }
  }

  const [messages, setMessages] = useState<any[]>([])
  const [question, setQuestion] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState<Message[]>([])

  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [closesocketbutton, setcloseSocketButton] = useState<any>(false as any)
  const [reconnect, setReconnect] = useState<any>(false as any)

  // Empty dependency array ensures this effect runs only once
  const [insightCardNavigate, setInsightCardNavigate] = useState(null as any)
  const sendMessage = () => {
    if (!insightCardNavigate) {
      fetchHistoryData()
    }
    if (valueInput.trim()) {
      setisHeader(false)
      if (valueInput && defaultInput) {
        setReadOnly(true)
        setStates({ ...states, value: '' })

        let object: any = {
          message_id: uuidv4(),
          message: valueInput
            ? valueInput
            : 'What is the name of the threat actor in the CTI report?',
          cti_id: state?.urlSHA256 ? state?.urlSHA256 : selectedFileHistory?.cti_id,
          focus: selectedOption,
          vault_id: selectedFileHistory?.vault_id
            ? Number(selectedFileHistory?.vault_id)
            : Number(state.vaultId),
          report_id: selectedFileHistory?.report_id
            ? Number(selectedFileHistory?.report_id)
            : Number(state?.id),
        }
        let cancelObject: any = {
          cancel: true,
        }
        if (socket && socket.readyState === WebSocket.OPEN) {
          if (cancelChat) {
            socket.send(JSON.stringify(cancelObject))
            setCancelChat(false)
          } else {
            setisSend(true)
            let objcts = [...messages, { message: object.message, question: true }]
            setInputMessage(objcts)

            setMessages((prevMessages) => [
              ...prevMessages,
              { message: object.message, question: true },
            ])
            socket.send(JSON.stringify(object))
            setQuestion([...question, { message: valueInput, question: true }])
          }
        }
      }
    }
    setStates({ ...states, value: '', rows: 1, minRows: 1, chatposition: 5 })
  }

  useEffect(() => {
    if (cancelChat) sendMessage()
  }, [cancelChat])
  const [sourcesCount, setSourcesCount] = useState(false)
  useEffect(() => {
    messages.map((res: any) => {
      if (res?.sources?.length > 3) setSourcesCount(true)
    })
  }, [messages])
  const stopWebSocket = () => {
    if (
      socket &&
      (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)
    ) {
      setCancelChat(true)
      setisSend(false)
    }
  }

  const statusChange = (option: any) => {
    let ctiId: any =
      option == 'CTI Report'
        ? 'cti'
        : option == 'Threat Graph'
        ? 'intel_db'
        : option == 'Threat Intel'
        ? 'intel'
        : option == 'Coach'
        ? 'coach'
        : 'auto'
    setSelectedOption(ctiId)
    setIsInputStatusOpen(false)
  }

  useEffect(() => {
    wssConnectionMethod()
    let noOfprompts: any = 100
    setMessages([])
    dispatch(ChatHistoryDetails(userIdchat, id, noOfprompts) as any).then((reponse: any) => {
      if (reponse) {
        let mergedMessages: any = reponse?.payload
        let arr: any = []
        for (let i = 0; i < mergedMessages?.length; i++) {
          if (mergedMessages[i]?.sources?.length > 0) {
            const Cti: any = mergedMessages[i].sources.filter((item: any) => {
              return item?.category == 'cti' || item?.category == 'mitre' || item?.category == 'cve'
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
        }
        setSelectedHistory(mergedMessages.length > 0 ? mergedMessages[0] : null)
        setMessages((pre) => [...pre, ...mergedMessages])
        setisHeader(mergedMessages.length > 0 ? false : true)
      }
    })
    fetchHistoryData()
  }, [id])

  const fetchHistoryData = () => {
    dispatch(ChatHistoryFindOne(userIdchat, id) as any).then((reponse: any) => {
      setInsightCardNavigate(reponse.payload)
    })
  }

  const handleClickRecnect = () => {
    wssConnectionMethod()
  }

  const wssConnectionMethod = () => {
    const localStorage1 = local.getItem('bearerToken')
    const token = JSON.parse(localStorage1 as any)
    const barearTockens = token.bearerToken.split(' ')
    let ws: any = null
    let messageMap: any = null

    ws = new WebSocket(
      `${environment?.baseWssUrl}/intel-chat/${id}/${
        state?.ctiName ? state?.ctiName : state?.sessionName
      }?Authorization=${barearTockens[1]}`,
    )
    setSocket(ws)
    if (ws === null) {
      console.log(' WebSocket creation failure')
      return
    }
    setctiChat([])
    setisSend(false)
    setdefaultInput(null)
    messageMap = new Map()
    ws?.onopen = () => {
      setcloseSocketButton(false)
      setReconnect(false)
      setReadOnly(false)
      console.log('WebSocket connected')
    }
    ws?.onmessage = (event) => {
      //we are receiving messages means socket is working
      if (retryCnt != 0) {
        retryCnt = 0
        console.log('reseting retry', retryCnt)
      }
      const value = JSON.parse(event.data)

      if (messageMap.has(value.message_id)) {
        const existingMessage: any = messageMap.get(value.message_id)
        existingMessage.message += value.message ? value.message : ''
        existingMessage.done = value.done ? value.done : false
        existingMessage.focus = value.focus ? value.focus : ''
        existingMessage.sources = value.sources ? value.sources : []
        existingMessage.sourcesvalue = value.sources ? value.sources : []
        existingMessage.sourcescount = null
      } else {
        messageMap.set(value.message_id, {
          message: value.message,
          question: false,
          error: value.error,
        })
      }
      const mergedMessages = Array.from(messageMap.values())
      setctiChat(mergedMessages)

      if (value.done) {
        setReadOnly(false)
        const mergedMessages: any = Array.from(messageMap.values())
        const extractedData = mergedMessages.map((item: any) => item.sources).flat()
        const Cti: any = extractedData.filter((item: any) => {
          return item?.category == 'cti' || item?.category == 'mitre' || item?.category == 'cve'
        })
        const Sigma: any = extractedData.filter((item: any) => {
          return item?.category == 'sigma' || item?.category == 'yara'
        })
        mergedMessages[0].sources = Cti

        mergedMessages[0].sourcescount =
          Sigma.length > 0
            ? Sigma.reduce((counts: any, item: any) => {
                counts[item.category] = (counts[item.category] || 0) + 1
                return counts
              }, {})
            : null

        setMessages((pre) => [...pre, ...mergedMessages])
        messageMap.clear()

        setctiChat([])
        setisSend(false)
        setdefaultInput(null)
      }
    }
    ws?.onclose = () => {
      setisSend(false)
      console.log('WebSocket closed')
      //Socket is closed whenever it hit the load balancer idle time.
      //Show the session expired message and ask the user to connect it back to resume
      setcloseSocketButton(true)
      console.log('Session expired. Reconnect.')
    }
    // Clean up function to close WebSocket when component unmounts
    return () => {
      if (ws?.readyState === WebSocket.OPEN || ws?.readyState === WebSocket.CONNECTING) {
        setisSend(false)
        console.log('WebSocket closed in return')
        ws?.close()
      }
    }
  }

  const divRef: RefObject<HTMLDivElement> = useRef(null)

  const handleClickTab = (item: any) => {
    if (item.category === 'mitre') {
      let url: any = `https://attack.mitre.org/techniques/${item?.id}`
      window.open(url)
    } else if (item.category === 'cve') {
      let url: any = `https://cve.mitre.org/cgi-bin/cvename.cgi?name=${item?.id}`
      window.open(url)
    } else if (item.category === 'cti') {
      let url: any = `${item?.id}`
      window.open(url)
    }
  }
  const handleClickView = (responce: any) => {
    let row = {
      global: insightCardNavigate.globalVault,
      mitreLocation: insightCardNavigate.mitreLocation,
      vaultId: insightCardNavigate.vaultId,
      id: insightCardNavigate.reportId,
      urlSHA256: state?.urlSHA256
        ? state?.urlSHA256
        : insightCardNavigate.ctiId
        ? insightCardNavigate?.ctiId
        : responce?.cti_id,
    }
    sessionStorage.setItem('insightdata', JSON.stringify(row))
    navigateTo(`/app/insightCard/${insightCardNavigate?.vaultId}`)
  }
  const handleSigmaDownload = async (sigma: any, sigmaName: any, index: any) => {
    let valtId = insightCardNavigate?.vaultId ? insightCardNavigate?.vaultId : Number(state.vaultId)
    let report_id = insightCardNavigate?.reportId
      ? Number(insightCardNavigate?.reportId)
      : Number(state?.id)
    state.id = report_id
    state.global = insightCardNavigate?.globalVault
    setDetail({ from: 'RepositoryInspectSigmas', value: state })
    navigateTo(`/app/VaultPermission/${valtId}`)
  }

  const setCardTitle = (id: any, category: any) => {
    let pageTitle = 'CTI Report'
    if (category === 'cti') {
      pageTitle = 'CTI Report'
    }
    if (category === 'mitre') {
      pageTitle = 'MITRE ATT&CK ID : ' + id
    } else if (category === 'cve') {
      pageTitle = 'CVE ID : ' + id
    }
    return pageTitle
  }

  const parseText = (text: any) => {
    const parts: any = text?.split(/(```([^`]+)```)|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/)
    let jsonBlock: any = null

    return parts?.map((part: any, index: any) => {
      if (index % 7 === 0) {
        return <span key={index}>{part}</span>
      } else if (index % 7 === 2) {
        try {
          if (part?.slice(0, 4) === 'json') {
            const cleanedJsonString = part
              .slice(4)
              .replace(/\/\/[^"\n\r]*(?=(?:(?:[^"]*"){2})*[^"]*$)/g, '{"comment_replacecd":true}')
            jsonBlock = JSON.parse(cleanedJsonString)
          }
        } catch (error) {
          jsonBlock = null
        }
        if (jsonBlock) {
          const formattedJson = JSON.stringify(jsonBlock, null, 2) // Format JSON with 2 spaces indentation
          // Wrap lines within 40 characters
          const wrappedJson = formattedJson
            .split('\n')
            .map((line) => {
              if (line.length > 70) {
                let wrappedLine = ''
                let currentLine = line
                while (currentLine.length > 70) {
                  wrappedLine += currentLine.substring(0, 70) + '\n' + '\t  '
                  currentLine = currentLine.substring(70)
                }
                wrappedLine += currentLine
                return wrappedLine
              }
              return line
            })
            .join('\n')
          return (
            <pre className='text-xs' key={index}>
              {wrappedJson}
            </pre>
          )
        } else if (part) {
          const yamlString = part
          const [firstLine, ...remainingLines] = yamlString?.split('\n')
          const formattedFirstLine = `${firstLine}\n\t`
          const finalYaml = `${formattedFirstLine}${remainingLines.join('\n\t')}`
          return (
            <span key={index}>
              <pre>
                <code className='text-wrap text-red w-full break-all whitespace-pre-wrap overflow-wrap break-words'>
                  {finalYaml}
                </code>
              </pre>
            </span>
          )
        } else {
          return <span key={index}>{part}</span>
        }
      } else if (index % 7 === 4) {
        // Bold text
        return (
          <span key={index} className='font-bold'>
            {part}
          </span>
        )
      } else if (index % 7 === 6) {
        // Italic text
        return (
          <span key={index} className='italic'>
            {part}
          </span>
        )
      } else {
        return null
      }
    })
  }
  const bottomRef = useRef<HTMLDivElement>(null)

  const [isHeader, setisHeader] = useState(true)
  useEffect(() => {
    // Scrolls to the bottom when a new message is added
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const [isHovered, setIsHovered] = useState(false)
  const [isHoveredtwo, setIsHoveredTwo] = useState(false)
  const [isHoveredthree, setIsHoveredThree] = useState(false)
  const handleMouseEnter = () => {
    setIsHovered(true)
  }
  const handleMouseLeave = () => {
    setIsHovered(false)
  }
  const handleMouseEnterTwo = () => {
    setIsHoveredTwo(true)
  }
  const handleMouseLeaveTwo = () => {
    setIsHoveredTwo(false)
  }
  const handleMouseEnterThree = () => {
    setIsHoveredThree(true)
  }
  const handleMouseLeaveThree = () => {
    setIsHoveredThree(false)
  }

  return (
    <>
      <div className={` ${classes.mainContainer}`} onClick={handleDropDown}>
        <div ref={divRef} className={` ${classes.scrollContainer}`}>
          <div className={classes.container}>
            <div id='scroll' style={{ height: '90%' }}>
              <div className='text-white grid grid-cols-5 gap-4 mb-[32px] '>
                {/* -----------------firstdiv-------------*/}
                <div></div>
                {/* ----------------second-div------------*/}
                <div className='col-span-3 p-[20px] w-full '>
                  {isHeader && (
                    <div className='border-dashed border-2 border-[#344054] p-[16px] rounded-lg '>
                      <p className='text-white font-inter font-semibold text-sm md:text-base'>
                        Your personal Threat Hunting workbench
                      </p>
                      <p className='text-gray-500 pt-1 font-inter font-normal text-sm md:text-base'>
                        {' '}
                        Examples to get you started with analyzing and reasoning with Threat Intel
                      </p>
                      <div className='pl-6 pt-2'>
                        <p className='text-white font-inter font-semibold text-sm md:text-base'>
                          Ask a question of the CTI Report
                        </p>
                        <p className='text-gray-500 pt-1 font-inter font-normal text-sm md:text-base'>
                          List the TTPs used by the Threat Actor
                        </p>
                      </div>
                      <div className='pl-6 pt-2'>
                        <p className='text-white font-inter font-semibold text-sm md:text-base'>
                          Dive deep into Threat Actor behavior
                        </p>
                        <p className='text-gray-500 pt-1 font-inter font-normal text-sm md:text-base'>
                          What CVEs are exploited?
                        </p>
                      </div>
                      <div className='pl-6 pt-2'>
                        <p className='text-white font-inter font-semibold text-sm md:text-base'>
                          Extract SIGMA files to hunt
                        </p>
                        <p className='text-gray-500 pt-1 font-inter font-normal text-sm md:text-base'>
                          Give me Sigma files for credential access
                        </p>
                      </div>
                      <div className='pl-6 pt-2'>
                        <p className='text-white font-inter font-semibold text-sm md:text-base'>
                          Assess the risk of a vulnerability
                        </p>
                        <p className='text-gray-500 pt-1 font-inter font-normal text-sm md:text-base'>
                          What is CVE-2022-31676?
                        </p>
                      </div>
                    </div>
                  )}

                  {/************************question********************/}

                  <div>
                    <div>
                      <div className='flex-1 '>
                        {!isSend ? (
                          <>
                            {messages.map((responce: any, index) => {
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
                                      </>
                                    )}
                                    {!responce.question && (
                                      <>
                                        <div className='flex justify-between pt-[40px] mb-2 '>
                                          <div className='flex'>
                                            <div className='bg-[#344054] rounded-xl flex w-6 h-6 p-1.2 justify-center items-center'>
                                              <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                width='12'
                                                height='12'
                                                viewBox='0 0 12 12'
                                                fill='none'
                                              >
                                                <path
                                                  d='M0.600006 4.8001L0.600006 7.2001M3.30001 2.4001L3.30001 9.6001M6.00001 0.600098V11.4001M8.70001 2.4001V9.6001M11.4 4.8001V7.2001'
                                                  stroke='white'
                                                  strokeLinecap='round'
                                                  strokeLinejoin='round'
                                                />
                                              </svg>
                                            </div>
                                            <div>
                                              <p className='overflow-hidden text-white truncate font-inter font-medium ps-2 text-sm md:text-base'>
                                                S2S Threat Specialist
                                              </p>
                                            </div>
                                          </div>
                                          <div className='flex justify-between'>
                                            <div
                                              className='flex cursor-pointer'
                                              onClick={() => handleClickView(responce)}
                                            >
                                              <div className='text-gray-500 font-inter font-semibold text-sm md:text-base'>
                                                View Insights{' '}
                                              </div>
                                              <div className='mt-[4px] pl-1'>
                                                <svg
                                                  xmlns='http://www.w3.org/2000/svg'
                                                  width='20'
                                                  height='14'
                                                  viewBox='0 0 20 14'
                                                  fill='none'
                                                >
                                                  <path
                                                    d='M2.01677 7.59427C1.90328 7.41457 1.84654 7.32472 1.81477 7.18614C1.79091 7.08204 1.79091 6.91788 1.81477 6.81378C1.84654 6.67519 1.90328 6.58534 2.01677 6.40564C2.95461 4.92066 5.74617 1.16663 10.0003 1.16663C14.2545 1.16663 17.0461 4.92066 17.9839 6.40564C18.0974 6.58534 18.1541 6.67519 18.1859 6.81378C18.2098 6.91788 18.2098 7.08204 18.1859 7.18614C18.1541 7.32472 18.0974 7.41457 17.9839 7.59427C17.0461 9.07926 14.2545 12.8333 10.0003 12.8333C5.74617 12.8333 2.95461 9.07926 2.01677 7.59427Z'
                                                    stroke='#667085'
                                                    strokeWidth='1.66667'
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                  />
                                                  <path
                                                    d='M10.0003 9.49996C11.381 9.49996 12.5003 8.38067 12.5003 6.99996C12.5003 5.61925 11.381 4.49996 10.0003 4.49996C8.61962 4.49996 7.50034 5.61925 7.50034 6.99996C7.50034 8.38067 8.61962 9.49996 10.0003 9.49996Z'
                                                    stroke='#667085'
                                                    strokeWidth='1.66667'
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                  />
                                                </svg>
                                              </div>
                                            </div>

                                            <div>
                                              {dummy.map((chat: any, key: any) => {
                                                const status =
                                                  responce.focus == 'cti'
                                                    ? 'CTI Report'
                                                    : responce.focus == 'intel_db'
                                                    ? 'Threat Graph'
                                                    : responce.focus == 'intel'
                                                    ? 'Threat Intel'
                                                    : responce.focus == 'coach'
                                                    ? 'Coach'
                                                    : 'All'
                                                return (
                                                  <>
                                                    <div className='relative inline-block text-right '>
                                                      <button
                                                        type='button'
                                                        className={`inline-flex justify-center px-2 py-[1px]  bg-white text-sm font-small text-gray-700 flex ml-2 relative cursor-auto  bg-white w-[130px] rounded-xl px-2 py-[1px]  justify-between items-center ${
                                                          responce.error ? 'text-[red]' : ''
                                                        }`}
                                                      >
                                                        {!responce?.error && responce?.message
                                                          ? status
                                                          : 'Error'}
                                                        <div className='ml-1 '>
                                                          {!responce?.error && responce?.message
                                                            ? svgIcons[status]
                                                            : errorSvg}
                                                        </div>
                                                      </button>
                                                    </div>
                                                  </>
                                                )
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    <div
                                      key={index}
                                      className={`mb-2  rounded-lg bg-[#054D80]  w-full ${
                                        responce.question
                                          ? 'text-left pt-[5px] pb-[5px] pl-[7px] pr-[7px] '
                                          : 'bg-[#1d2939]  pt-[8px] pl-[8px] pr-[8px] pb-[8px]'
                                      }`}
                                    >
                                      <span
                                        style={{ whiteSpace: 'pre-line' }}
                                        className={`inline-block text-justify rounded-lg px-3 py-2 ${
                                          responce.question
                                            ? 'bg-[#054D80] text-white break-all'
                                            : 'bg-[#1d2939] text-white'
                                        }`}
                                      >
                                        {parseText(
                                          !responce?.error && responce?.message
                                            ? responce?.message
                                            : responce?.error
                                            ? responce?.error
                                            : "We're facing technical difficulties. Retry later, please.",
                                        )}
                                      </span>

                                      {!responce.question && responce?.sources?.length > 0 && (
                                        <div>
                                          <div className='grid grid-cols-3 gap-2  inline p-3'>
                                            {responce.sources.slice(0, 3).map((item: any) => (
                                              <div className='bg-[#344054] rounded-lg  p-[10px] flex flex-col justify-between h-[75px] '>
                                                <div>
                                                  <p
                                                    className='text-gray-25 font-inter font-medium text-xs leading-6 cursor-pointer'
                                                    onClick={() => handleClickTab(item)}
                                                  >
                                                    {setCardTitle(item?.id, item?.category)}
                                                  </p>
                                                </div>
                                                <div>
                                                  <p className='text-gray font-inter text-xs truncate'>
                                                    {item?.category == 'cti'
                                                      ? state?.ctiName
                                                        ? state?.ctiName
                                                        : state?.sessionName
                                                      : item?.category.toUpperCase()}
                                                  </p>
                                                </div>
                                              </div>
                                            ))}
                                          </div>

                                          {responce?.sources?.length > 3 && (
                                            <div className='flex justify-end '>
                                              <div
                                                className='text-sm text-[#667085] mb-2 mr-3 cursor-pointer'
                                                onClick={() => toShowSideView(responce.sources)}
                                              >
                                                {'View ' +
                                                  (responce?.sources?.length - 3) +
                                                  ' more'}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    {!responce.question && responce.sourcescount && (
                                      <>
                                        <div>
                                          {Object.entries(responce.sourcescount).map(
                                            ([category, count]) => (
                                              <div key={category}>
                                                <div className='text-white flex justify-between rounded-lg border-solid border-2 border-[#344054] p-[10px] mb-2'>
                                                  <div>
                                                    <p className=' text-white sm:text-sm lg:text-xl xl:text-base font-light'>
                                                      {count} <span>{category.toUpperCase()}</span>{' '}
                                                    </p>
                                                  </div>
                                                  {category == 'sigma' && (
                                                    <div className='flex'>
                                                      <div
                                                        className='flex cursor-pointer pl-4 '
                                                        onClick={() =>
                                                          handleSigmaDownload(
                                                            responce,
                                                            category,
                                                            index,
                                                          )
                                                        }
                                                      >
                                                        <div>
                                                          <p className='text-base text-[#667085] '>
                                                            Inspect sigma files
                                                          </p>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                  <div ref={bottomRef} />
                                </>
                              )
                            })}
                          </>
                        ) : (
                          <>
                            {inputMessage.map((responce: any, index: any) => {
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
                                      </>
                                    )}
                                    {!responce.question && (
                                      <>
                                        <div className='flex justify-between pt-[35px] mb-2'>
                                          <div className='flex'>
                                            <div className='bg-[#344054] rounded-xl flex w-6 h-6 p-1.2 justify-center items-center'>
                                              <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                width='12'
                                                height='12'
                                                viewBox='0 0 12 12'
                                                fill='none'
                                              >
                                                <path
                                                  d='M0.600006 4.8001L0.600006 7.2001M3.30001 2.4001L3.30001 9.6001M6.00001 0.600098V11.4001M8.70001 2.4001V9.6001M11.4 4.8001V7.2001'
                                                  stroke='white'
                                                  strokeLinecap='round'
                                                  strokeLinejoin='round'
                                                />
                                              </svg>
                                            </div>
                                            <div>
                                              <p className='overflow-hidden text-white truncate font-inter font-medium ps-2 text-sm md:text-base'>
                                                S2S Threat Specialist
                                              </p>
                                            </div>
                                          </div>
                                          <div className='flex justify-between'>
                                            <div className='flex cursor-pointer'>
                                              <div className='text-gray-500 font-inter font-semibold text-sm md:text-base'>
                                                View Insights{' '}
                                              </div>
                                              <div className='mt-[4px] pl-1'>
                                                <svg
                                                  xmlns='http://www.w3.org/2000/svg'
                                                  width='20'
                                                  height='14'
                                                  viewBox='0 0 20 14'
                                                  fill='none'
                                                >
                                                  <path
                                                    d='M2.01677 7.59427C1.90328 7.41457 1.84654 7.32472 1.81477 7.18614C1.79091 7.08204 1.79091 6.91788 1.81477 6.81378C1.84654 6.67519 1.90328 6.58534 2.01677 6.40564C2.95461 4.92066 5.74617 1.16663 10.0003 1.16663C14.2545 1.16663 17.0461 4.92066 17.9839 6.40564C18.0974 6.58534 18.1541 6.67519 18.1859 6.81378C18.2098 6.91788 18.2098 7.08204 18.1859 7.18614C18.1541 7.32472 18.0974 7.41457 17.9839 7.59427C17.0461 9.07926 14.2545 12.8333 10.0003 12.8333C5.74617 12.8333 2.95461 9.07926 2.01677 7.59427Z'
                                                    stroke='#667085'
                                                    strokeWidth='1.66667'
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                  />
                                                  <path
                                                    d='M10.0003 9.49996C11.381 9.49996 12.5003 8.38067 12.5003 6.99996C12.5003 5.61925 11.381 4.49996 10.0003 4.49996C8.61962 4.49996 7.50034 5.61925 7.50034 6.99996C7.50034 8.38067 8.61962 9.49996 10.0003 9.49996Z'
                                                    stroke='#667085'
                                                    strokeWidth='1.66667'
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                  />
                                                </svg>
                                              </div>
                                            </div>
                                            <div>
                                              {dummy.map((chat: any, key: any) => {
                                                const status =
                                                  responce.focus == 'cti'
                                                    ? 'CTI Report'
                                                    : responce.focus == 'intel_db'
                                                    ? 'Threat Graph'
                                                    : responce.focus == 'intel'
                                                    ? 'Threat Intel'
                                                    : responce.focus == 'coach'
                                                    ? 'Coach'
                                                    : 'All'
                                                return (
                                                  <>
                                                    <div className='relative inline-block text-right '>
                                                      <button
                                                        type='button'
                                                        className={`inline-flex justify-center px-2 py-[1px]  bg-white text-sm font-small text-gray-700 flex ml-2 relative cursor-auto  bg-white w-[130px] rounded-xl px-2 py-[1px]  justify-between items-center ${
                                                          responce.error ? 'text-[red]' : ''
                                                        }`}
                                                      >
                                                        {!responce?.error && responce?.message
                                                          ? status
                                                          : 'Error'}
                                                        <div className='ml-1 '>
                                                          {!responce?.error && responce?.message
                                                            ? svgIcons[status]
                                                            : errorSvg}
                                                        </div>
                                                      </button>
                                                    </div>
                                                  </>
                                                )
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    <div
                                      key={index}
                                      className={`mb-2   bg-[#054D80]  rounded-lg  w-full  ${
                                        responce.question
                                          ? 'text-left pt-[5px] pb-[5px] pl-[7px] pr-[7px]'
                                          : 'bg-[#1d2939]  pt-[8px] pl-[8px] pr-[8px] pb-[8px]'
                                      }`}
                                    >
                                      <span
                                        style={{ whiteSpace: 'pre-line' }}
                                        className={`inline-block text-justify rounded-lg px-3 py-2 ${
                                          responce.question
                                            ? 'bg-[#054D80] text-white break-all'
                                            : 'bg-[#1d2939] text-white w-full'
                                        }`}
                                      >
                                        {parseText(
                                          !responce?.error && responce?.message
                                            ? responce?.message
                                            : responce?.error
                                            ? responce?.error
                                            : "We're facing technical difficulties. Retry later, please.",
                                        )}
                                      </span>
                                      {!responce.question && responce?.sources?.length > 0 && (
                                        <div>
                                          <div className='grid grid-cols-3 gap-2  inline p-3'>
                                            {responce.sources.slice(0, 3).map((item: any) => (
                                              <div className='bg-[#344054] rounded-lg  p-[10px] flex flex-col justify-between h-[75px]'>
                                                <div>
                                                  <p
                                                    className='text-gray-25 font-inter font-medium text-xs leading-6 cursor-pointer'
                                                    onClick={() => handleClickTab(item)}
                                                  >
                                                    {setCardTitle(item?.id, item?.category)}
                                                  </p>
                                                </div>
                                                <div>
                                                  <p className='text-gray font-inter text-xs '>
                                                    {item?.category.toUpperCase()}
                                                  </p>
                                                </div>
                                              </div>
                                            ))}
                                          </div>

                                          {responce?.sources?.length > 3 && (
                                            <div className='flex justify-end '>
                                              <div
                                                className='text-sm text-[#667085] mb-2 mr-3 cursor-pointer'
                                                onClick={() => toShowSideView(responce.sources)}
                                              >
                                                {'View ' + responce?.sources?.length > 3 + ' more'}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    {!responce.question && responce.sourcescount && (
                                      <>
                                        <div>
                                          {Object.entries(responce.sourcescount).map(
                                            ([category, count]) => (
                                              <div key={category}>
                                                <div className='text-white flex justify-between rounded-lg border-solid border-2 border-[#344054] p-[10px] mb-2'>
                                                  <div>
                                                    <p className=' text-white sm:text-sm lg:text-xl xl:text-base font-light'>
                                                      {count} <span>{category.toUpperCase()}</span>{' '}
                                                    </p>
                                                  </div>
                                                  <div className='flex'>
                                                    <div className='flex cursor-pointer pl-4 '>
                                                      <div>
                                                        <p className='text-base text-[#667085] '>
                                                          Inspect sigma files
                                                        </p>
                                                      </div>
                                                      <div className='pl-2'>
                                                        <svg
                                                          xmlns='http://www.w3.org/2000/svg'
                                                          width='20'
                                                          height='20'
                                                          viewBox='0 0 20 20'
                                                          fill='none'
                                                        >
                                                          <path
                                                            d='M17.5 12.5V13.5C17.5 14.9001 17.5 15.6002 17.2275 16.135C16.9878 16.6054 16.6054 16.9878 16.135 17.2275C15.6002 17.5 14.9001 17.5 13.5 17.5H6.5C5.09987 17.5 4.3998 17.5 3.86502 17.2275C3.39462 16.9878 3.01217 16.6054 2.77248 16.135C2.5 15.6002 2.5 14.9001 2.5 13.5V12.5M14.1667 8.33333L10 12.5M10 12.5L5.83333 8.33333M10 12.5V2.5'
                                                            stroke='#667085'
                                                            stroke-width='1.66667'
                                                            stroke-linecap='round'
                                                            stroke-linejoin='round'
                                                          />
                                                        </svg>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </>
                              )
                            })}

                            {ctiChat.length > 0 && (
                              <div className={`mb-2`}>
                                <div className='flex justify-between pt-[35px] mb-2'>
                                  <div className='flex'>
                                    <div className='bg-[#344054] rounded-xl flex w-6 h-6 p-1.2 justify-center items-center'>
                                      <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='12'
                                        height='12'
                                        viewBox='0 0 12 12'
                                        fill='none'
                                      >
                                        <path
                                          d='M0.600006 4.8001L0.600006 7.2001M3.30001 2.4001L3.30001 9.6001M6.00001 0.600098V11.4001M8.70001 2.4001V9.6001M11.4 4.8001V7.2001'
                                          stroke='white'
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <p className='overflow-hidden text-white truncate font-inter font-medium ps-2 text-sm md:text-base'>
                                        S2S Threat Specialist
                                      </p>
                                    </div>
                                  </div>
                                  <div className='flex justify-between'>
                                    <div className='flex cursor-pointer'>
                                      <div className='text-gray-500 font-inter font-semibold text-sm md:text-base'>
                                        View Insights{' '}
                                      </div>
                                      <div className='mt-[4px] pl-1'>
                                        <svg
                                          xmlns='http://www.w3.org/2000/svg'
                                          width='20'
                                          height='14'
                                          viewBox='0 0 20 14'
                                          fill='none'
                                        >
                                          <path
                                            d='M2.01677 7.59427C1.90328 7.41457 1.84654 7.32472 1.81477 7.18614C1.79091 7.08204 1.79091 6.91788 1.81477 6.81378C1.84654 6.67519 1.90328 6.58534 2.01677 6.40564C2.95461 4.92066 5.74617 1.16663 10.0003 1.16663C14.2545 1.16663 17.0461 4.92066 17.9839 6.40564C18.0974 6.58534 18.1541 6.67519 18.1859 6.81378C18.2098 6.91788 18.2098 7.08204 18.1859 7.18614C18.1541 7.32472 18.0974 7.41457 17.9839 7.59427C17.0461 9.07926 14.2545 12.8333 10.0003 12.8333C5.74617 12.8333 2.95461 9.07926 2.01677 7.59427Z'
                                            stroke='#667085'
                                            strokeWidth='1.66667'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                          <path
                                            d='M10.0003 9.49996C11.381 9.49996 12.5003 8.38067 12.5003 6.99996C12.5003 5.61925 11.381 4.49996 10.0003 4.49996C8.61962 4.49996 7.50034 5.61925 7.50034 6.99996C7.50034 8.38067 8.61962 9.49996 10.0003 9.49996Z'
                                            stroke='#667085'
                                            strokeWidth='1.66667'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                    <div>
                                      {dummy.map((chat: any, key: any) => {
                                        const status =
                                          selectedOption == 'cti'
                                            ? 'CTI Report'
                                            : selectedOption == 'intel_db'
                                            ? 'Threat Graph'
                                            : selectedOption == 'intel'
                                            ? 'Threat Intel'
                                            : selectedOption == 'coach'
                                            ? 'Coach'
                                            : 'All'
                                        return (
                                          <>
                                            <div className='relative inline-block text-right '>
                                              <button
                                                type='button'
                                                className={`inline-flex justify-center px-2 py-[1px]  bg-white text-sm font-small text-gray-700 flex ml-2 relative  bg-white w-[130px] cursor-auto rounded-xl px-2 py-[1px]  justify-between items-center `}
                                              >
                                                {status}
                                                <div className='ml-1 '>{svgIcons[status]}</div>
                                              </button>
                                            </div>
                                          </>
                                        )
                                      })}
                                    </div>
                                  </div>
                                </div>

                                <span
                                  style={{ whiteSpace: 'pre-line' }}
                                  className={`inline-block rounded-lg px-3 py-2 ${'bg-[#1d2939] text-white w-full'}`}
                                >
                                  {ctiChat?.map((chatValue: any, key: any) => {
                                    if (divRef.current) {
                                      divRef.current.scrollTop =
                                        divRef.current.scrollHeight - divRef.current.clientHeight
                                    }
                                    return (
                                      <>
                                        <span key={key}>
                                          {parseText(
                                            !chatValue?.error && chatValue?.message
                                              ? chatValue?.message
                                              : chatValue?.error
                                              ? chatValue?.error
                                              : "We're facing technical difficulties. Retry later, please.",
                                          )}
                                          <span className='mt-2'>
                                            <div
                                              className={`inline-block h-${4} w-${4} ${'bg-white'} rounded-full  animate-pulse mb-[-0.2rem] ml-2`}
                                            ></div>
                                          </span>
                                        </span>
                                      </>
                                    )
                                  })}
                                </span>
                              </div>
                            )}
                            {messages?.length === inputMessage.length && ctiChat.length == 0 && (
                              <div>
                                <div className='bouncing-loader'>
                                  <div></div>
                                  <div></div>
                                  <div></div>
                                </div>
                              </div>
                            )}
                            <div ref={bottomRef} />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* ----------------Third-div -------------*/}
                <div></div>
              </div>
            </div>
          </div>
        </div>
        <>
          {showSidebar && (
            <div
              onClick={() => setShowSidebar(!showSidebar)}
              className='fixed z-30 flex items-center cursor-pointer rounded-l-lg right-0 top-[80px] bg-[#054D80] w-[32px] h-[72px] '
            >
              <svg
                className='pl-[4px] pr-[4px] pt-[24px] pb-[24px] border'
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='14'
                viewBox='0 0 8 14'
                fill='none'
              >
                <path
                  d='M1 13L7 7L1 1'
                  stroke='white'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
          )}
          {sourcesCount && (
            <div
              className={`top-[76px] right-0 w-[400px] h-[864px] bg-[#101828]  p-[24px] text-white fixed h-full z-40  ease-in-out duration-300 ${
                showSidebar ? 'translate-x-0 ' : 'translate-x-full'
              }`}
            >
              <div className='flex'>
                <div>
                  <button
                    className='flex text-4xl text-white items-center cursor-pointer rounded-l-lg fixed right-[27rem] translate-x-full top-[40px] bg-[#054D80] w-[32px] h-[72px] '
                    onClick={() => setShowSidebar(!showSidebar)}
                  >
                    <svg
                      className='pl-2'
                      xmlns='http://www.w3.org/2000/svg'
                      width='18'
                      height='14'
                      viewBox='0 0 8 14'
                      fill='none'
                    >
                      <path
                        d='M1 13L7 7L1 1'
                        stroke='white'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </button>
                </div>
                <div className={`flex flex-col ${classes.formContainer}`}>
                  {sidbarcard.map((card: any, index: number) => {
                    return (
                      <div key={index}>
                        <div className='flex mt-2 mb-2 right-[2rem]'>
                          <div>
                            <div className='bg-[#344054] pl-[8px] pr-[8px] rounded-xl text-white text-center font-inter text-xs md:text-base font-medium'>
                              {index + 1}
                            </div>
                          </div>
                          <div className='pl-2'>
                            <div className='w-[320px] h-[56px]  bg-[#344054] pl-[14px] pr-[14px] pt-[10px] pb-[10px] rounded-lg'>
                              <p className='text-gray-300 font-inter text-[12px] md:text-base font-medium leading-6'>
                                {card.title}
                              </p>
                              <p className=' text-gray-300 font-inter text-xs font-medium leading-none'>
                                {card.category}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </>
        {/* --------------input field------------------ */}
        <div className='grid grid-cols-5 gap-4  text-white pb-[23px] '>
          <div></div>
          <div className='col-span-3 relative w-full mt-1 right-1  '>
            {!closesocketbutton && reconnect && (
              <>
                <div className='flex justify-center mb-2'>
                  <div>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='animate-spin'
                      width='25'
                      height='24'
                      viewBox='0 0 25 24'
                      fill='none'
                    >
                      <path
                        d='M12.5 2V6M12.5 18V22M6.5 12H2.5M22.5 12H18.5M19.5784 19.0784L16.75 16.25M19.5784 4.99994L16.75 7.82837M5.42157 19.0784L8.25 16.25M5.42157 4.99994L8.25 7.82837'
                        stroke='#667085'
                        stroke-width='1.67'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </svg>
                  </div>
                  <div className='flex justify-center'>
                    <p className='ml-1 text-gray-500 font-inter text-base font-normal leading-6'>
                      {'Reconnecting...'}
                    </p>
                  </div>
                </div>
              </>
            )}

            {closesocketbutton && (
              <>
                <div className='flex justify-center mb-2'>
                  <div className='flex mt-2'>
                    <div>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='22'
                        height='20'
                        viewBox='0 0 22 20'
                        fill='none'
                      >
                        <path
                          d='M20.7003 14.1181C20.8939 13.616 21 13.0704 21 12.5C21 10.1564 19.2085 8.23129 16.9203 8.01937C16.4522 5.17213 13.9798 3 11 3C10.5534 3 10.1183 3.04879 9.69953 3.14132M6.28746 5.28585C5.67317 6.06419 5.24759 6.99838 5.07974 8.01937C2.79151 8.23129 1 10.1564 1 12.5C1 14.9853 3.01472 17 5.5 17H16.5C16.9561 17 17.3963 16.9322 17.8112 16.806M2 1L20 19'
                          stroke='#667085'
                          stroke-width='1.67'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                      </svg>
                    </div>
                    <div>
                      <p className='ml-2 text-gray-500 font-inter text-base font-normal leading-6'>
                        Your session has expired.
                      </p>
                    </div>
                  </div>
                  <div className='ml-4 mb-3'>
                    <button
                      className='bg-[#EE7103] flex justify-center mb-2 rounded-lg px-[12px] py-[8px] p-1  w-[135px] h-[36px] items-center'
                      onClick={handleClickRecnect}
                    >
                      <p>Reconnect</p>
                      <div className=' ml-1'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='19'
                          height='17'
                          viewBox='0 0 19 18'
                          fill='none'
                        >
                          <path
                            d='M17.5001 7.33333C17.5001 7.33333 15.8293 5.05685 14.4719 3.69854C13.1145 2.34022 11.2387 1.5 9.16675 1.5C5.02461 1.5 1.66675 4.85786 1.66675 9C1.66675 13.1421 5.02461 16.5 9.16675 16.5C12.586 16.5 15.4708 14.2119 16.3736 11.0833M17.5001 7.33333V2.33333M17.5001 7.33333H12.5001'
                            stroke='white'
                            stroke-width='1.66667'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
            <div className='w-full bg-[#101828] rounded-lg'>
              <textarea
                rows={states.rows}
                value={states.value}
                readOnly={(readOnly ? true : false) || (reconnect ? true : false)}
                placeholder={
                  isSend
                    ? 'Ask a question of CTI Report or Threat Graph'
                    : 'Ask S2S Threat Specialist'
                }
                maxLength={4096}
                id='textarea'
                onKeyDown={(e) => {
                  handleKeyDown(e)
                }}
                style={{ width: '100%' }}
                className={` ${classes.scrollContainer} w-11/12 wrap bg-[#101828] text-white p-4 pl-5 text-sm rounded-xl  max-h-56 resize-none focus:outline-none `}
                {...register('message', {
                  onChange: (e) => {
                    handleChange(e)
                  },
                })}
              />
              {states.value.length > 65 ? (
                <>
                  <div className='flex justify-end'>
                    <div></div>
                    <div className=''>
                      {!isSend && (
                        <>
                          <div className='flex  border-2  border-[#EE7103]  w-[197px] rounded-lg'>
                            <div className=''>
                              <Button
                                disableRipple
                                sx={{
                                  height: '40px ',
                                  width: '133px',
                                  textAlign: 'center',
                                  color: '#fff',
                                  backgroundColor: '#182230',
                                  textTransform: 'capitalize',
                                  borderTopLeftRadius: '8px',
                                  borderBottomLeftRadius: '8px',
                                  padding: '2px',
                                }}
                              >
                                <div className='relative'>
                                  <button
                                    className=' text-gray-700 w-[133px] [h-40px] rounded-lg  shadow-sm focus:outline-none'
                                    onClick={InputStatusOpen}
                                  >
                                    <div className='flex p-2 justify-between items-center'>
                                      <div className='text-white'>
                                        {selectedOption == 'cti'
                                          ? 'CTI Report'
                                          : selectedOption == 'intel_db'
                                          ? 'Threat Graph'
                                          : selectedOption == 'intel'
                                          ? 'Threat Intel'
                                          : selectedOption == 'coach'
                                          ? 'Coach'
                                          : 'All'}
                                      </div>
                                      {!isInputStatusOpen && (
                                        <div className='mr-1'>
                                          <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            width='12'
                                            height='8'
                                            viewBox='0 0 12 8'
                                            fill='none'
                                          >
                                            <path
                                              d='M1 1.5L6 6.5L11 1.5'
                                              stroke='white'
                                              strokeWidth='1.66667'
                                              strokeLinecap='round'
                                              strokeLinejoin='round'
                                            />
                                          </svg>
                                        </div>
                                      )}
                                      {isInputStatusOpen && (
                                        <div className='p-1 rotate-180 '>
                                          <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            width='12'
                                            height='8'
                                            viewBox='0 0 12 8'
                                            fill='none'
                                          >
                                            <path
                                              d='M1 1.5L6 6.5L11 1.5'
                                              stroke='white'
                                              strokeWidth='1.66667'
                                              strokeLinecap='round'
                                              strokeLinejoin='round'
                                            />
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                  </button>
                                  {isInputStatusOpen && (
                                    <div className='absolute mt-[-11rem] ml-[-3.1rem] w-[228px] bg-white rounded-lg shadow-lg'>
                                      <ul className='py-0.5 px-0.5'>
                                        <li>
                                          <button
                                            onClick={() => statusChange('CTI Report')}
                                            onMouseEnter={handleMouseEnter}
                                            onMouseLeave={handleMouseLeave}
                                            className='block w-full px-4 py-2 rounded-tl-lg rounded-tr-lg text-gray-800 hover:bg-[#1D2939] hover:text-white focus:outline-none'
                                          >
                                            <div className='flex justify-between'>
                                              <div>
                                                <span className=' py-1'>CTI Report</span>
                                              </div>
                                              <div className='p-1'>
                                                <svg
                                                  xmlns='http://www.w3.org/2000/svg'
                                                  width='16'
                                                  height='16'
                                                  viewBox='0 0 16 16'
                                                  fill='none'
                                                  style={{
                                                    stroke: isHovered ? 'white' : 'black',
                                                  }}
                                                >
                                                  <path
                                                    d='M8.00001 1.33337C9.66753 3.15894 10.6152 5.52806 10.6667 8.00004C10.6152 10.472 9.66753 12.8411 8.00001 14.6667M8.00001 1.33337C6.33249 3.15894 5.38484 5.52806 5.33334 8.00004C5.38484 10.472 6.33249 12.8411 8.00001 14.6667M8.00001 1.33337C4.31811 1.33337 1.33334 4.31814 1.33334 8.00004C1.33334 11.6819 4.31811 14.6667 8.00001 14.6667M8.00001 1.33337C11.6819 1.33337 14.6667 4.31814 14.6667 8.00004C14.6667 11.6819 11.6819 14.6667 8.00001 14.6667M1.66669 6.00004H14.3334M1.66668 10H14.3333'
                                                    strokeWidth='1.5'
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                  />
                                                </svg>
                                              </div>
                                            </div>
                                          </button>
                                        </li>
                                        <li>
                                          <button
                                            onClick={() => statusChange('Threat Graph')}
                                            onMouseEnter={handleMouseEnterTwo}
                                            onMouseLeave={handleMouseLeaveTwo}
                                            className='block w-full px-4 py-2  text-gray-800 hover:bg-[#1D2939] hover:text-white  focus:outline-none'
                                          >
                                            <div className='flex justify-between'>
                                              <div>
                                                <span className=''>Threat Graph </span>
                                              </div>
                                              <button
                                                type='button'
                                                style={{
                                                  background: isHoveredtwo ? '#1D2939' : '#EFF8FF',
                                                }}
                                                className='flex gap-2 text-gray-900  rounded-full border border-solid border-[#B2DDFF] focus:outline-none  focus:ring-4 focus:ring-gray-100 font-medium  text-sm px-2.5 py-0.5 me-2 ml-2'
                                              >
                                                <svg
                                                  xmlns='http://www.w3.org/2000/svg'
                                                  width='12'
                                                  height='12'
                                                  viewBox='0 0 12 12'
                                                  fill='none'
                                                  className='mt-1'
                                                  style={{
                                                    stroke: isHoveredtwo ? 'white' : '#175CD3',
                                                  }}
                                                >
                                                  <g clip-path='url(#clip0_7018_3755)'>
                                                    <path
                                                      d='M4.85913 1.05799V4.23237C4.85913 4.39652 4.82962 4.55906 4.77228 4.71071C4.71494 4.86237 4.63089 5.00016 4.52493 5.11624L2.45026 7.38896M4.85913 1.05799C4.73184 1.07077 4.60506 1.08577 4.47878 1.10355M4.85913 1.05799C5.61819 0.98067 6.38216 0.98067 7.14122 1.05799M2.45026 7.38896L2.84075 7.28174C3.90218 6.99442 5.02234 7.13091 6.00018 7.66674C6.97802 8.20256 8.09817 8.33905 9.1596 8.05173L9.95579 7.8334M2.45026 7.38896L1.33356 8.61283C0.70827 9.2967 1.00342 10.4556 1.87467 10.6183C3.23753 10.873 4.61763 11.0007 6.00018 11C7.38271 11.0005 8.76281 10.8728 10.1257 10.6183C10.9964 10.4556 11.2916 9.2967 10.6668 8.61227L9.95579 7.8334M7.14122 1.05799V4.23237C7.14122 4.56403 7.26141 4.88235 7.47542 5.11624L9.95579 7.8334M7.14122 1.05799C7.26851 1.07077 7.39529 1.08577 7.52157 1.10355'
                                                      stroke-width='1.5'
                                                      stroke-linecap='round'
                                                      stroke-linejoin='round'
                                                    />
                                                  </g>
                                                  <defs>
                                                    <clipPath id='clip0_7018_3755'>
                                                      <rect width='12' height='12' fill='white' />
                                                    </clipPath>
                                                  </defs>
                                                </svg>
                                                <span
                                                  className='text-sm text-center'
                                                  style={{
                                                    color: isHoveredtwo ? 'white' : '#175CD3',
                                                  }}
                                                >
                                                  Beta{' '}
                                                </span>
                                              </button>
                                              <div className='p-1 '>
                                                <svg
                                                  xmlns='http://www.w3.org/2000/svg'
                                                  width='16'
                                                  height='16'
                                                  viewBox='0 0 16 16'
                                                  fill='none'
                                                  style={{
                                                    stroke: isHoveredtwo ? 'white' : '#344054',
                                                    fill: isHoveredtwo ? 'white' : '#344054',
                                                  }}
                                                >
                                                  <path d='M10.0741 4.3457V5.37028L6.66295 6.85022L10.0741 8.39847V9.69627L5.72839 11.6543V10.5842L9.30306 9.10429L5.72839 7.57881V6.34932L10.0741 4.3457Z' />
                                                  <path
                                                    d='M14.7667 11.0333H14.767L14.7664 11.0256C14.732 10.5788 14.4678 10.1315 14.0333 9.90441V5.9622C14.4686 5.73458 14.7333 5.28343 14.7333 4.79998C14.7333 4.07808 14.1552 3.49998 13.4333 3.49998C13.2039 3.49998 12.9391 3.55986 12.7248 3.71357L9.29978 1.77487C9.28656 1.06472 8.71352 0.499976 8.00001 0.499976C7.28618 0.499976 6.71295 1.06523 6.70023 1.77582L3.27081 3.78171C3.03771 3.62957 2.80056 3.56703 2.53583 3.56664C1.81029 3.53177 1.23334 4.11326 1.23334 4.83331C1.23334 5.35347 1.53326 5.80533 2.00001 6.03094V9.92716C1.52953 10.0959 1.23334 10.5494 1.23334 11.0333C1.23334 11.7552 1.81145 12.3333 2.53334 12.3333C2.76305 12.3333 3.0244 12.2734 3.23547 12.1498L6.73462 14.1586C6.76493 14.8529 7.3311 15.4 8.03334 15.4C8.73568 15.4 9.3019 14.8528 9.33208 14.1583L12.7978 12.1502C13.0025 12.2724 13.2348 12.3333 13.4667 12.3333C14.1886 12.3333 14.7667 11.7552 14.7667 11.0333ZM13.1333 6.03786V9.80528C13.0078 9.83794 12.8843 9.8964 12.7692 9.95363L11.9152 9.47923L11.8926 9.46664H11.8697C11.8686 9.46642 11.8664 9.46594 11.8628 9.46496C11.8545 9.4627 11.8448 9.45949 11.8316 9.45511C11.8198 9.45115 11.8045 9.44604 11.7899 9.44204C11.7766 9.43841 11.7556 9.43331 11.7333 9.43331C11.4836 9.43331 11.2333 9.63944 11.2333 9.93331C11.2333 10.1054 11.3215 10.2345 11.4445 10.3165L11.4444 10.3167L11.4496 10.3197L12.1843 10.7483C12.1579 10.8502 12.1333 10.9528 12.1333 11.1C12.1333 11.2298 12.1535 11.3128 12.176 11.4054C12.1795 11.4199 12.1831 11.4346 12.1867 11.4498L8.95573 13.3051C8.83157 13.167 8.67955 13.0511 8.46668 12.9389V12V11.9917L8.46532 11.9835C8.44597 11.8674 8.3967 11.7552 8.31239 11.6709C8.22652 11.5851 8.10923 11.5333 7.96668 11.5333C7.83029 11.5333 7.71226 11.5728 7.62328 11.6562C7.53534 11.7386 7.48652 11.854 7.46768 11.9858L7.46668 11.9929V12V12.8933C7.26944 12.9611 7.07204 13.078 6.93462 13.2659L3.68252 11.3848C3.70856 11.2854 3.73334 11.1867 3.73334 11.0666C3.73334 11.063 3.73335 11.0594 3.73335 11.0558C3.7334 10.995 3.73344 10.9353 3.72026 10.8761L4.45301 10.4181L4.46267 10.4121L4.47072 10.404L4.4974 10.3773C4.61594 10.2951 4.70001 10.1681 4.70001 9.99998C4.70001 9.75021 4.49388 9.49998 4.20001 9.49998C4.10925 9.49998 4.02387 9.5428 3.96335 9.57316C3.96061 9.57453 3.95792 9.57588 3.95529 9.5772L3.95509 9.57679L3.94701 9.58184L3.20379 10.0464C3.0942 9.97153 2.98001 9.91517 2.83334 9.86215V6.03366C2.95686 5.98142 3.06594 5.92563 3.17335 5.85166L3.94167 6.28192C3.97831 6.31211 4.0216 6.32301 4.05024 6.32778C4.08349 6.33332 4.11537 6.33331 4.13192 6.33331H4.13334C4.38311 6.33331 4.63334 6.12718 4.63334 5.83331C4.63334 5.76145 4.60953 5.69541 4.58112 5.63859C4.55332 5.58298 4.51707 5.52862 4.48492 5.4804L4.48321 5.47784L4.47151 5.46028L4.4537 5.44894L3.78565 5.02382C3.79037 5.0016 3.79335 4.97988 3.79535 4.95993C3.80001 4.91327 3.80001 4.86747 3.80001 4.83478V4.83331L3.80001 4.82764C3.80002 4.75353 3.80003 4.66919 3.78263 4.58176L7.04622 2.694C7.18135 2.83231 7.36937 2.94328 7.53334 3.02801V3.96664C7.53334 4.21641 7.73947 4.46664 8.03334 4.46664C8.32191 4.46664 8.53334 4.2552 8.53334 3.96664V3.03631C8.70214 2.96804 8.86733 2.85561 8.99432 2.69784L12.2201 4.55027C12.2 4.65899 12.2 4.74312 12.2 4.79956V4.79998V4.91122L11.447 5.38184L11.447 5.38181L11.4445 5.38344C11.3215 5.46547 11.2333 5.59452 11.2333 5.76664C11.2333 6.01641 11.4395 6.26664 11.7333 6.26664L11.7372 6.26664C11.7674 6.26665 11.7998 6.26666 11.8331 6.26112C11.8703 6.25492 11.9049 6.24267 11.9447 6.22275L11.9449 6.22306L11.952 6.21873L12.6554 5.79056C12.789 5.89834 12.9716 5.97978 13.1333 6.03786Z'
                                                    strokeWidth='0.2'
                                                  />
                                                </svg>
                                              </div>
                                            </div>
                                          </button>
                                        </li>

                                        <li>
                                          <button
                                            onClick={() => statusChange('All')}
                                            onMouseEnter={handleMouseEnterThree}
                                            onMouseLeave={handleMouseLeaveThree}
                                            className='block w-full px-4 py-2  rounded-br-lg rounded-bl-lg text-gray-800 hover:bg-[#1D2939] hover:text-white focus:outline-none'
                                          >
                                            <div className='flex justify-between'>
                                              <div>
                                                <span className=''>All </span>
                                              </div>
                                              <div className='p-1 '>
                                                <svg
                                                  xmlns='http://www.w3.org/2000/svg'
                                                  width='16'
                                                  height='16'
                                                  viewBox='0 0 16 16'
                                                  fill='none'
                                                  style={{
                                                    stroke: isHoveredthree ? 'white' : '#344054',
                                                  }}
                                                >
                                                  <path
                                                    d='M8.66666 5L6.66666 7L9.33332 8.33333L7.33332 10.3333M13.3333 8C13.3333 11.2723 9.76402 13.6523 8.46532 14.4099C8.31772 14.496 8.24393 14.5391 8.13978 14.5614C8.05895 14.5787 7.94103 14.5787 7.8602 14.5614C7.75605 14.5391 7.68226 14.496 7.53466 14.4099C6.23596 13.6523 2.66666 11.2723 2.66666 8V4.81173C2.66666 4.27872 2.66666 4.01222 2.75383 3.78313C2.83084 3.58076 2.95598 3.40018 3.11843 3.25702C3.30232 3.09495 3.55186 3.00138 4.05093 2.81423L7.62546 1.47378C7.76405 1.4218 7.83335 1.39582 7.90465 1.38552C7.96788 1.37638 8.0321 1.37638 8.09533 1.38552C8.16663 1.39582 8.23592 1.4218 8.37452 1.47378L11.9491 2.81423C12.4481 3.00138 12.6977 3.09495 12.8816 3.25702C13.044 3.40018 13.1691 3.58076 13.2461 3.78313C13.3333 4.01222 13.3333 4.27872 13.3333 4.81173V8Z'
                                                    strokeWidth='1.5'
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                  />
                                                </svg>
                                              </div>
                                            </div>
                                          </button>
                                        </li>
                                        <li>
                                          <button
                                            onClick={() => statusChange('Coach')}
                                            onMouseEnter={handleMouseEnterThree}
                                            onMouseLeave={handleMouseLeaveThree}
                                            className='block w-full px-4 py-2  rounded-br-lg rounded-bl-lg text-gray-800 hover:bg-[#1D2939] hover:text-white focus:outline-none'
                                          >
                                            <div className='flex justify-between'>
                                              <div>
                                                <span className=''>Coach</span>
                                              </div>
                                              <div className='p-1 '>
                                                <svg
                                                  xmlns='http://www.w3.org/2000/svg'
                                                  width='16'
                                                  height='16'
                                                  viewBox='0 0 16 16'
                                                  fill='none'
                                                  style={{
                                                    stroke: isHoveredthree ? 'white' : '#344054',
                                                  }}
                                                >
                                                  <path
                                                    d='M8.66666 5L6.66666 7L9.33332 8.33333L7.33332 10.3333M13.3333 8C13.3333 11.2723 9.76402 13.6523 8.46532 14.4099C8.31772 14.496 8.24393 14.5391 8.13978 14.5614C8.05895 14.5787 7.94103 14.5787 7.8602 14.5614C7.75605 14.5391 7.68226 14.496 7.53466 14.4099C6.23596 13.6523 2.66666 11.2723 2.66666 8V4.81173C2.66666 4.27872 2.66666 4.01222 2.75383 3.78313C2.83084 3.58076 2.95598 3.40018 3.11843 3.25702C3.30232 3.09495 3.55186 3.00138 4.05093 2.81423L7.62546 1.47378C7.76405 1.4218 7.83335 1.39582 7.90465 1.38552C7.96788 1.37638 8.0321 1.37638 8.09533 1.38552C8.16663 1.39582 8.23592 1.4218 8.37452 1.47378L11.9491 2.81423C12.4481 3.00138 12.6977 3.09495 12.8816 3.25702C13.044 3.40018 13.1691 3.58076 13.2461 3.78313C13.3333 4.01222 13.3333 4.27872 13.3333 4.81173V8Z'
                                                    strokeWidth='1.5'
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                  />
                                                </svg>
                                              </div>
                                            </div>
                                          </button>
                                        </li>
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </Button>
                            </div>
                            <div className='' onClick={sendMessage}>
                              <div className='flex justify-center cursor-pointer items-center bg-[#EE7103] rounded-r-lg w-[64px] h-[40px]'>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  width='14'
                                  height='14'
                                  viewBox='0 0 14 14'
                                  fill='none'
                                  transform='rotate(90)'
                                >
                                  <path
                                    d='M6.99999 12.8333V1.16663M6.99999 1.16663L1.16666 6.99996M6.99999 1.16663L12.8333 6.99996'
                                    stroke='white'
                                    strokeWidth='1.66667'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>{' '}
                        </>
                      )}
                      {isSend && (
                        <div
                          onClick={stopWebSocket}
                          className='flex justify-center cursor-pointer items-center bg-[#EE7103] w-[64px] ml-[-3px] h-[40px] rounded-lg'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='20'
                            height='20'
                            viewBox='0 0 20 20'
                            fill='none'
                          >
                            <path
                              d='M9.99999 18.3333C14.6024 18.3333 18.3333 14.6023 18.3333 9.99996C18.3333 5.39759 14.6024 1.66663 9.99999 1.66663C5.39762 1.66663 1.66666 5.39759 1.66666 9.99996C1.66666 14.6023 5.39762 18.3333 9.99999 18.3333Z'
                              stroke='white'
                              strokeWidth='1.66667'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M6.66666 7.99996C6.66666 7.53325 6.66666 7.29989 6.75748 7.12163C6.83738 6.96483 6.96486 6.83735 7.12166 6.75745C7.29992 6.66663 7.53328 6.66663 7.99999 6.66663H12C12.4667 6.66663 12.7001 6.66663 12.8783 6.75745C13.0351 6.83735 13.1626 6.96483 13.2425 7.12163C13.3333 7.29989 13.3333 7.53325 13.3333 7.99996V12C13.3333 12.4667 13.3333 12.7 13.2425 12.8783C13.1626 13.0351 13.0351 13.1626 12.8783 13.2425C12.7001 13.3333 12.4667 13.3333 12 13.3333H7.99999C7.53328 13.3333 7.29992 13.3333 7.12166 13.2425C6.96486 13.1626 6.83738 13.0351 6.75748 12.8783C6.66666 12.7 6.66666 12.4667 6.66666 12V7.99996Z'
                              stroke='white'
                              strokeWidth='1.66667'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className='absolute bottom-2 right-3'>
                    {!isSend && (
                      <>
                        <div className='flex  border-2  border-[#EE7103]  w-[197px] rounded-lg'>
                          <div className=''>
                            <Button
                              disableRipple
                              sx={{
                                height: '40px ',
                                width: '133px',
                                textAlign: 'center',
                                color: '#fff',
                                backgroundColor: '#182230',
                                textTransform: 'capitalize',
                                borderTopLeftRadius: '8px',
                                borderBottomLeftRadius: '8px',
                                padding: '2px',
                              }}
                            >
                              <div className='relative'>
                                <button
                                  className=' text-gray-700 w-[133px] [h-40px] rounded-lg  shadow-sm focus:outline-none'
                                  onClick={InputStatusOpen}
                                >
                                  <div className='flex p-2 justify-between items-center '>
                                    <div className='text-white'>
                                      {selectedOption == 'cti'
                                        ? 'CTI Report'
                                        : selectedOption == 'intel_db'
                                        ? 'Threat Graph'
                                        : selectedOption == 'intel'
                                        ? 'Threat Intel'
                                        : selectedOption == 'coach'
                                        ? 'Coach'
                                        : 'All'}
                                    </div>
                                    {!isInputStatusOpen && (
                                      <div className='mr-1'>
                                        <svg
                                          xmlns='http://www.w3.org/2000/svg'
                                          width='12'
                                          height='8'
                                          viewBox='0 0 12 8'
                                          fill='none'
                                        >
                                          <path
                                            d='M1 1.5L6 6.5L11 1.5'
                                            stroke='white'
                                            strokeWidth='1.66667'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                        </svg>
                                      </div>
                                    )}
                                    {isInputStatusOpen && (
                                      <div className='p-1 rotate-180 '>
                                        <svg
                                          xmlns='http://www.w3.org/2000/svg'
                                          width='12'
                                          height='8'
                                          viewBox='0 0 12 8'
                                          fill='none'
                                        >
                                          <path
                                            d='M1 1.5L6 6.5L11 1.5'
                                            stroke='white'
                                            strokeWidth='1.66667'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                </button>
                                {isInputStatusOpen && (
                                  <div className='absolute mt-[-11rem] ml-[-3.5rem] w-[236px] bg-white rounded-lg shadow-lg'>
                                    <ul className='py-0.5 px-0.5'>
                                      <li>
                                        <button
                                          onClick={() => statusChange('CTI Report')}
                                          onMouseEnter={handleMouseEnter}
                                          onMouseLeave={handleMouseLeave}
                                          className='block w-full px-4 py-2 rounded-tl-lg rounded-tr-lg text-gray-800 hover:bg-[#1D2939] hover:text-white focus:outline-none'
                                        >
                                          <div className='flex justify-between'>
                                            <div>
                                              <span className=' py-1'>CTI Report</span>
                                            </div>
                                            <div className='p-1'>
                                              <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                width='16'
                                                height='16'
                                                viewBox='0 0 16 16'
                                                fill='none'
                                                style={{
                                                  stroke: isHovered ? 'white' : 'black',
                                                }}
                                              >
                                                <path
                                                  d='M8.00001 1.33337C9.66753 3.15894 10.6152 5.52806 10.6667 8.00004C10.6152 10.472 9.66753 12.8411 8.00001 14.6667M8.00001 1.33337C6.33249 3.15894 5.38484 5.52806 5.33334 8.00004C5.38484 10.472 6.33249 12.8411 8.00001 14.6667M8.00001 1.33337C4.31811 1.33337 1.33334 4.31814 1.33334 8.00004C1.33334 11.6819 4.31811 14.6667 8.00001 14.6667M8.00001 1.33337C11.6819 1.33337 14.6667 4.31814 14.6667 8.00004C14.6667 11.6819 11.6819 14.6667 8.00001 14.6667M1.66669 6.00004H14.3334M1.66668 10H14.3333'
                                                  strokeWidth='1.5'
                                                  strokeLinecap='round'
                                                  strokeLinejoin='round'
                                                />
                                              </svg>
                                            </div>
                                          </div>
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          onClick={() => statusChange('Threat Graph')}
                                          onMouseEnter={handleMouseEnterTwo}
                                          onMouseLeave={handleMouseLeaveTwo}
                                          className='block w-full px-4 py-2  text-gray-800 hover:bg-[#1D2939] hover:text-white  focus:outline-none'
                                        >
                                          <div className='flex justify-between'>
                                            {/* <div> */}
                                            <span className=''>Threat Graph </span>
                                            {/* </div> */}
                                            <button
                                              type='button'
                                              style={{
                                                background: isHoveredtwo ? '#1D2939' : '#EFF8FF',
                                              }}
                                              className='flex gap-2 text-gray-900  rounded-full border border-solid border-[#B2DDFF] focus:outline-none  focus:ring-4 focus:ring-gray-100 font-medium  text-sm px-2.5 py-.5 me-2 ml-2'
                                            >
                                              <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                width='12'
                                                height='12'
                                                viewBox='0 0 12 12'
                                                fill='none'
                                                className='mt-1'
                                                style={{
                                                  stroke: isHoveredtwo ? 'white' : '#175CD3',
                                                }}
                                              >
                                                <g clip-path='url(#clip0_7018_3755)'>
                                                  <path
                                                    d='M4.85913 1.05799V4.23237C4.85913 4.39652 4.82962 4.55906 4.77228 4.71071C4.71494 4.86237 4.63089 5.00016 4.52493 5.11624L2.45026 7.38896M4.85913 1.05799C4.73184 1.07077 4.60506 1.08577 4.47878 1.10355M4.85913 1.05799C5.61819 0.98067 6.38216 0.98067 7.14122 1.05799M2.45026 7.38896L2.84075 7.28174C3.90218 6.99442 5.02234 7.13091 6.00018 7.66674C6.97802 8.20256 8.09817 8.33905 9.1596 8.05173L9.95579 7.8334M2.45026 7.38896L1.33356 8.61283C0.70827 9.2967 1.00342 10.4556 1.87467 10.6183C3.23753 10.873 4.61763 11.0007 6.00018 11C7.38271 11.0005 8.76281 10.8728 10.1257 10.6183C10.9964 10.4556 11.2916 9.2967 10.6668 8.61227L9.95579 7.8334M7.14122 1.05799V4.23237C7.14122 4.56403 7.26141 4.88235 7.47542 5.11624L9.95579 7.8334M7.14122 1.05799C7.26851 1.07077 7.39529 1.08577 7.52157 1.10355'
                                                    stroke-width='1.5'
                                                    stroke-linecap='round'
                                                    stroke-linejoin='round'
                                                  />
                                                </g>
                                                <defs>
                                                  <clipPath id='clip0_7018_3755'>
                                                    <rect width='12' height='12' fill='white' />
                                                  </clipPath>
                                                </defs>
                                              </svg>
                                              <span
                                                className='text-sm text-center'
                                                style={{
                                                  color: isHoveredtwo ? 'white' : '#175CD3',
                                                }}
                                              >
                                                Beta{' '}
                                              </span>
                                            </button>
                                            <div className='p-1 '>
                                              <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                width='16'
                                                height='16'
                                                viewBox='0 0 16 16'
                                                fill='none'
                                                style={{
                                                  stroke: isHoveredtwo ? 'white' : '#344054',
                                                  fill: isHoveredtwo ? 'white' : '#344054',
                                                }}
                                              >
                                                <path d='M10.0741 4.3457V5.37028L6.66295 6.85022L10.0741 8.39847V9.69627L5.72839 11.6543V10.5842L9.30306 9.10429L5.72839 7.57881V6.34932L10.0741 4.3457Z' />
                                                <path
                                                  d='M14.7667 11.0333H14.767L14.7664 11.0256C14.732 10.5788 14.4678 10.1315 14.0333 9.90441V5.9622C14.4686 5.73458 14.7333 5.28343 14.7333 4.79998C14.7333 4.07808 14.1552 3.49998 13.4333 3.49998C13.2039 3.49998 12.9391 3.55986 12.7248 3.71357L9.29978 1.77487C9.28656 1.06472 8.71352 0.499976 8.00001 0.499976C7.28618 0.499976 6.71295 1.06523 6.70023 1.77582L3.27081 3.78171C3.03771 3.62957 2.80056 3.56703 2.53583 3.56664C1.81029 3.53177 1.23334 4.11326 1.23334 4.83331C1.23334 5.35347 1.53326 5.80533 2.00001 6.03094V9.92716C1.52953 10.0959 1.23334 10.5494 1.23334 11.0333C1.23334 11.7552 1.81145 12.3333 2.53334 12.3333C2.76305 12.3333 3.0244 12.2734 3.23547 12.1498L6.73462 14.1586C6.76493 14.8529 7.3311 15.4 8.03334 15.4C8.73568 15.4 9.3019 14.8528 9.33208 14.1583L12.7978 12.1502C13.0025 12.2724 13.2348 12.3333 13.4667 12.3333C14.1886 12.3333 14.7667 11.7552 14.7667 11.0333ZM13.1333 6.03786V9.80528C13.0078 9.83794 12.8843 9.8964 12.7692 9.95363L11.9152 9.47923L11.8926 9.46664H11.8697C11.8686 9.46642 11.8664 9.46594 11.8628 9.46496C11.8545 9.4627 11.8448 9.45949 11.8316 9.45511C11.8198 9.45115 11.8045 9.44604 11.7899 9.44204C11.7766 9.43841 11.7556 9.43331 11.7333 9.43331C11.4836 9.43331 11.2333 9.63944 11.2333 9.93331C11.2333 10.1054 11.3215 10.2345 11.4445 10.3165L11.4444 10.3167L11.4496 10.3197L12.1843 10.7483C12.1579 10.8502 12.1333 10.9528 12.1333 11.1C12.1333 11.2298 12.1535 11.3128 12.176 11.4054C12.1795 11.4199 12.1831 11.4346 12.1867 11.4498L8.95573 13.3051C8.83157 13.167 8.67955 13.0511 8.46668 12.9389V12V11.9917L8.46532 11.9835C8.44597 11.8674 8.3967 11.7552 8.31239 11.6709C8.22652 11.5851 8.10923 11.5333 7.96668 11.5333C7.83029 11.5333 7.71226 11.5728 7.62328 11.6562C7.53534 11.7386 7.48652 11.854 7.46768 11.9858L7.46668 11.9929V12V12.8933C7.26944 12.9611 7.07204 13.078 6.93462 13.2659L3.68252 11.3848C3.70856 11.2854 3.73334 11.1867 3.73334 11.0666C3.73334 11.063 3.73335 11.0594 3.73335 11.0558C3.7334 10.995 3.73344 10.9353 3.72026 10.8761L4.45301 10.4181L4.46267 10.4121L4.47072 10.404L4.4974 10.3773C4.61594 10.2951 4.70001 10.1681 4.70001 9.99998C4.70001 9.75021 4.49388 9.49998 4.20001 9.49998C4.10925 9.49998 4.02387 9.5428 3.96335 9.57316C3.96061 9.57453 3.95792 9.57588 3.95529 9.5772L3.95509 9.57679L3.94701 9.58184L3.20379 10.0464C3.0942 9.97153 2.98001 9.91517 2.83334 9.86215V6.03366C2.95686 5.98142 3.06594 5.92563 3.17335 5.85166L3.94167 6.28192C3.97831 6.31211 4.0216 6.32301 4.05024 6.32778C4.08349 6.33332 4.11537 6.33331 4.13192 6.33331H4.13334C4.38311 6.33331 4.63334 6.12718 4.63334 5.83331C4.63334 5.76145 4.60953 5.69541 4.58112 5.63859C4.55332 5.58298 4.51707 5.52862 4.48492 5.4804L4.48321 5.47784L4.47151 5.46028L4.4537 5.44894L3.78565 5.02382C3.79037 5.0016 3.79335 4.97988 3.79535 4.95993C3.80001 4.91327 3.80001 4.86747 3.80001 4.83478V4.83331L3.80001 4.82764C3.80002 4.75353 3.80003 4.66919 3.78263 4.58176L7.04622 2.694C7.18135 2.83231 7.36937 2.94328 7.53334 3.02801V3.96664C7.53334 4.21641 7.73947 4.46664 8.03334 4.46664C8.32191 4.46664 8.53334 4.2552 8.53334 3.96664V3.03631C8.70214 2.96804 8.86733 2.85561 8.99432 2.69784L12.2201 4.55027C12.2 4.65899 12.2 4.74312 12.2 4.79956V4.79998V4.91122L11.447 5.38184L11.447 5.38181L11.4445 5.38344C11.3215 5.46547 11.2333 5.59452 11.2333 5.76664C11.2333 6.01641 11.4395 6.26664 11.7333 6.26664L11.7372 6.26664C11.7674 6.26665 11.7998 6.26666 11.8331 6.26112C11.8703 6.25492 11.9049 6.24267 11.9447 6.22275L11.9449 6.22306L11.952 6.21873L12.6554 5.79056C12.789 5.89834 12.9716 5.97978 13.1333 6.03786Z'
                                                  strokeWidth='0.2'
                                                />
                                              </svg>
                                            </div>
                                          </div>
                                        </button>
                                      </li>

                                      <li>
                                        <button
                                          onClick={() => statusChange('All')}
                                          onMouseEnter={handleMouseEnterThree}
                                          onMouseLeave={handleMouseLeaveThree}
                                          className='block w-full px-4 py-2  rounded-br-lg rounded-bl-lg text-gray-800 hover:bg-[#1D2939] hover:text-white focus:outline-none'
                                        >
                                          <div className='flex justify-between'>
                                            <div>
                                              <span className=''>All </span>
                                            </div>
                                            <div className='p-1 '>
                                              <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                width='16'
                                                height='16'
                                                viewBox='0 0 16 16'
                                                fill='none'
                                                style={{
                                                  stroke: isHoveredthree ? 'white' : '#344054',
                                                }}
                                              >
                                                <path
                                                  d='M8.66666 5L6.66666 7L9.33332 8.33333L7.33332 10.3333M13.3333 8C13.3333 11.2723 9.76402 13.6523 8.46532 14.4099C8.31772 14.496 8.24393 14.5391 8.13978 14.5614C8.05895 14.5787 7.94103 14.5787 7.8602 14.5614C7.75605 14.5391 7.68226 14.496 7.53466 14.4099C6.23596 13.6523 2.66666 11.2723 2.66666 8V4.81173C2.66666 4.27872 2.66666 4.01222 2.75383 3.78313C2.83084 3.58076 2.95598 3.40018 3.11843 3.25702C3.30232 3.09495 3.55186 3.00138 4.05093 2.81423L7.62546 1.47378C7.76405 1.4218 7.83335 1.39582 7.90465 1.38552C7.96788 1.37638 8.0321 1.37638 8.09533 1.38552C8.16663 1.39582 8.23592 1.4218 8.37452 1.47378L11.9491 2.81423C12.4481 3.00138 12.6977 3.09495 12.8816 3.25702C13.044 3.40018 13.1691 3.58076 13.2461 3.78313C13.3333 4.01222 13.3333 4.27872 13.3333 4.81173V8Z'
                                                  strokeWidth='1.5'
                                                  strokeLinecap='round'
                                                  strokeLinejoin='round'
                                                />
                                              </svg>
                                            </div>
                                          </div>
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          onClick={() => statusChange('Coach')}
                                          onMouseEnter={handleMouseEnterThree}
                                          onMouseLeave={handleMouseLeaveThree}
                                          className='block w-full px-4 py-2  rounded-br-lg rounded-bl-lg text-gray-800 hover:bg-[#1D2939] hover:text-white focus:outline-none'
                                        >
                                          <div className='flex justify-between'>
                                            <div>
                                              <span className=''>Coach </span>
                                            </div>
                                            <div className='p-1 '>
                                              <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                width='16'
                                                height='16'
                                                viewBox='0 0 16 16'
                                                fill='none'
                                                style={{
                                                  stroke: isHoveredthree ? 'white' : '#344054',
                                                }}
                                              >
                                                <path
                                                  d='M8.66666 5L6.66666 7L9.33332 8.33333L7.33332 10.3333M13.3333 8C13.3333 11.2723 9.76402 13.6523 8.46532 14.4099C8.31772 14.496 8.24393 14.5391 8.13978 14.5614C8.05895 14.5787 7.94103 14.5787 7.8602 14.5614C7.75605 14.5391 7.68226 14.496 7.53466 14.4099C6.23596 13.6523 2.66666 11.2723 2.66666 8V4.81173C2.66666 4.27872 2.66666 4.01222 2.75383 3.78313C2.83084 3.58076 2.95598 3.40018 3.11843 3.25702C3.30232 3.09495 3.55186 3.00138 4.05093 2.81423L7.62546 1.47378C7.76405 1.4218 7.83335 1.39582 7.90465 1.38552C7.96788 1.37638 8.0321 1.37638 8.09533 1.38552C8.16663 1.39582 8.23592 1.4218 8.37452 1.47378L11.9491 2.81423C12.4481 3.00138 12.6977 3.09495 12.8816 3.25702C13.044 3.40018 13.1691 3.58076 13.2461 3.78313C13.3333 4.01222 13.3333 4.27872 13.3333 4.81173V8Z'
                                                  strokeWidth='1.5'
                                                  strokeLinecap='round'
                                                  strokeLinejoin='round'
                                                />
                                              </svg>
                                            </div>
                                          </div>
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </Button>
                          </div>
                          <div className='' onClick={sendMessage}>
                            <div className='flex justify-center cursor-pointer items-center bg-[#EE7103] rounded-r-lg w-[64px] h-[40px]'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='14'
                                height='14'
                                viewBox='0 0 14 14'
                                fill='none'
                                transform='rotate(90)'
                              >
                                <path
                                  d='M6.99999 12.8333V1.16663M6.99999 1.16663L1.16666 6.99996M6.99999 1.16663L12.8333 6.99996'
                                  stroke='white'
                                  strokeWidth='1.66667'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                />
                              </svg>
                            </div>
                          </div>
                        </div>{' '}
                      </>
                    )}
                    {isSend && (
                      <div
                        onClick={stopWebSocket}
                        className='flex justify-center cursor-pointer items-center bg-[#EE7103] w-[64px] ml-[-3px] h-[40px] rounded-lg'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='20'
                          height='20'
                          viewBox='0 0 20 20'
                          fill='none'
                        >
                          <path
                            d='M9.99999 18.3333C14.6024 18.3333 18.3333 14.6023 18.3333 9.99996C18.3333 5.39759 14.6024 1.66663 9.99999 1.66663C5.39762 1.66663 1.66666 5.39759 1.66666 9.99996C1.66666 14.6023 5.39762 18.3333 9.99999 18.3333Z'
                            stroke='white'
                            strokeWidth='1.66667'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M6.66666 7.99996C6.66666 7.53325 6.66666 7.29989 6.75748 7.12163C6.83738 6.96483 6.96486 6.83735 7.12166 6.75745C7.29992 6.66663 7.53328 6.66663 7.99999 6.66663H12C12.4667 6.66663 12.7001 6.66663 12.8783 6.75745C13.0351 6.83735 13.1626 6.96483 13.2425 7.12163C13.3333 7.29989 13.3333 7.53325 13.3333 7.99996V12C13.3333 12.4667 13.3333 12.7 13.2425 12.8783C13.1626 13.0351 13.0351 13.1626 12.8783 13.2425C12.7001 13.3333 12.4667 13.3333 12 13.3333H7.99999C7.53328 13.3333 7.29992 13.3333 7.12166 13.2425C6.96486 13.1626 6.83738 13.0351 6.75748 12.8783C6.66666 12.7 6.66666 12.4667 6.66666 12V7.99996Z'
                            stroke='white'
                            strokeWidth='1.66667'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </>
  )
}

export default ChatView

const svgIcons: any = {
  'CTI Report': (
    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'>
      <path
        d='M8.00001 1.33337C9.66753 3.15894 10.6152 5.52806 10.6667 8.00004C10.6152 10.472 9.66753 12.8411 8.00001 14.6667M8.00001 1.33337C6.33249 3.15894 5.38484 5.52806 5.33334 8.00004C5.38484 10.472 6.33249 12.8411 8.00001 14.6667M8.00001 1.33337C4.31811 1.33337 1.33334 4.31814 1.33334 8.00004C1.33334 11.6819 4.31811 14.6667 8.00001 14.6667M8.00001 1.33337C11.6819 1.33337 14.6667 4.31814 14.6667 8.00004C14.6667 11.6819 11.6819 14.6667 8.00001 14.6667M1.66669 6.00004H14.3334M1.66668 10H14.3333'
        stroke='black'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  'Threat Graph': (
    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'>
      <path
        d='M10.0741 4.3457V5.37028L6.66295 6.85022L10.0741 8.39847V9.69627L5.72839 11.6543V10.5842L9.30306 9.10429L5.72839 7.57881V6.34932L10.0741 4.3457Z'
        fill='#344054'
      />
      <path
        d='M14.7667 11.0333H14.767L14.7664 11.0256C14.732 10.5788 14.4678 10.1315 14.0333 9.90441V5.9622C14.4686 5.73458 14.7333 5.28343 14.7333 4.79998C14.7333 4.07808 14.1552 3.49998 13.4333 3.49998C13.2039 3.49998 12.9391 3.55986 12.7248 3.71357L9.29978 1.77487C9.28656 1.06472 8.71352 0.499976 8.00001 0.499976C7.28618 0.499976 6.71295 1.06523 6.70023 1.77582L3.27081 3.78171C3.03771 3.62957 2.80056 3.56703 2.53583 3.56664C1.81029 3.53177 1.23334 4.11326 1.23334 4.83331C1.23334 5.35347 1.53326 5.80533 2.00001 6.03094V9.92716C1.52953 10.0959 1.23334 10.5494 1.23334 11.0333C1.23334 11.7552 1.81145 12.3333 2.53334 12.3333C2.76305 12.3333 3.0244 12.2734 3.23547 12.1498L6.73462 14.1586C6.76493 14.8529 7.3311 15.4 8.03334 15.4C8.73568 15.4 9.3019 14.8528 9.33208 14.1583L12.7978 12.1502C13.0025 12.2724 13.2348 12.3333 13.4667 12.3333C14.1886 12.3333 14.7667 11.7552 14.7667 11.0333ZM13.1333 6.03786V9.80528C13.0078 9.83794 12.8843 9.8964 12.7692 9.95363L11.9152 9.47923L11.8926 9.46664H11.8697C11.8686 9.46642 11.8664 9.46594 11.8628 9.46496C11.8545 9.4627 11.8448 9.45949 11.8316 9.45511C11.8198 9.45115 11.8045 9.44604 11.7899 9.44204C11.7766 9.43841 11.7556 9.43331 11.7333 9.43331C11.4836 9.43331 11.2333 9.63944 11.2333 9.93331C11.2333 10.1054 11.3215 10.2345 11.4445 10.3165L11.4444 10.3167L11.4496 10.3197L12.1843 10.7483C12.1579 10.8502 12.1333 10.9528 12.1333 11.1C12.1333 11.2298 12.1535 11.3128 12.176 11.4054C12.1795 11.4199 12.1831 11.4346 12.1867 11.4498L8.95573 13.3051C8.83157 13.167 8.67955 13.0511 8.46668 12.9389V12V11.9917L8.46532 11.9835C8.44597 11.8674 8.3967 11.7552 8.31239 11.6709C8.22652 11.5851 8.10923 11.5333 7.96668 11.5333C7.83029 11.5333 7.71226 11.5728 7.62328 11.6562C7.53534 11.7386 7.48652 11.854 7.46768 11.9858L7.46668 11.9929V12V12.8933C7.26944 12.9611 7.07204 13.078 6.93462 13.2659L3.68252 11.3848C3.70856 11.2854 3.73334 11.1867 3.73334 11.0666C3.73334 11.063 3.73335 11.0594 3.73335 11.0558C3.7334 10.995 3.73344 10.9353 3.72026 10.8761L4.45301 10.4181L4.46267 10.4121L4.47072 10.404L4.4974 10.3773C4.61594 10.2951 4.70001 10.1681 4.70001 9.99998C4.70001 9.75021 4.49388 9.49998 4.20001 9.49998C4.10925 9.49998 4.02387 9.5428 3.96335 9.57316C3.96061 9.57453 3.95792 9.57588 3.95529 9.5772L3.95509 9.57679L3.94701 9.58184L3.20379 10.0464C3.0942 9.97153 2.98001 9.91517 2.83334 9.86215V6.03366C2.95686 5.98142 3.06594 5.92563 3.17335 5.85166L3.94167 6.28192C3.97831 6.31211 4.0216 6.32301 4.05024 6.32778C4.08349 6.33332 4.11537 6.33331 4.13192 6.33331H4.13334C4.38311 6.33331 4.63334 6.12718 4.63334 5.83331C4.63334 5.76145 4.60953 5.69541 4.58112 5.63859C4.55332 5.58298 4.51707 5.52862 4.48492 5.4804L4.48321 5.47784L4.47151 5.46028L4.4537 5.44894L3.78565 5.02382C3.79037 5.0016 3.79335 4.97988 3.79535 4.95993C3.80001 4.91327 3.80001 4.86747 3.80001 4.83478V4.83331L3.80001 4.82764C3.80002 4.75353 3.80003 4.66919 3.78263 4.58176L7.04622 2.694C7.18135 2.83231 7.36937 2.94328 7.53334 3.02801V3.96664C7.53334 4.21641 7.73947 4.46664 8.03334 4.46664C8.32191 4.46664 8.53334 4.2552 8.53334 3.96664V3.03631C8.70214 2.96804 8.86733 2.85561 8.99432 2.69784L12.2201 4.55027C12.2 4.65899 12.2 4.74312 12.2 4.79956V4.79998V4.91122L11.447 5.38184L11.447 5.38181L11.4445 5.38344C11.3215 5.46547 11.2333 5.59452 11.2333 5.76664C11.2333 6.01641 11.4395 6.26664 11.7333 6.26664L11.7372 6.26664C11.7674 6.26665 11.7998 6.26666 11.8331 6.26112C11.8703 6.25492 11.9049 6.24267 11.9447 6.22275L11.9449 6.22306L11.952 6.21873L12.6554 5.79056C12.789 5.89834 12.9716 5.97978 13.1333 6.03786Z'
        fill='#344054'
        stroke='#344054'
        stroke-width='0.2'
      />
    </svg>
  ),
  'Threat Intel': (
    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'>
      <path
        d='M10.0741 4.3457V5.37028L6.66295 6.85022L10.0741 8.39847V9.69627L5.72839 11.6543V10.5842L9.30306 9.10429L5.72839 7.57881V6.34932L10.0741 4.3457Z'
        fill='#344054'
      />
      <path
        d='M14.7667 11.0333H14.767L14.7664 11.0256C14.732 10.5788 14.4678 10.1315 14.0333 9.90441V5.9622C14.4686 5.73458 14.7333 5.28343 14.7333 4.79998C14.7333 4.07808 14.1552 3.49998 13.4333 3.49998C13.2039 3.49998 12.9391 3.55986 12.7248 3.71357L9.29978 1.77487C9.28656 1.06472 8.71352 0.499976 8.00001 0.499976C7.28618 0.499976 6.71295 1.06523 6.70023 1.77582L3.27081 3.78171C3.03771 3.62957 2.80056 3.56703 2.53583 3.56664C1.81029 3.53177 1.23334 4.11326 1.23334 4.83331C1.23334 5.35347 1.53326 5.80533 2.00001 6.03094V9.92716C1.52953 10.0959 1.23334 10.5494 1.23334 11.0333C1.23334 11.7552 1.81145 12.3333 2.53334 12.3333C2.76305 12.3333 3.0244 12.2734 3.23547 12.1498L6.73462 14.1586C6.76493 14.8529 7.3311 15.4 8.03334 15.4C8.73568 15.4 9.3019 14.8528 9.33208 14.1583L12.7978 12.1502C13.0025 12.2724 13.2348 12.3333 13.4667 12.3333C14.1886 12.3333 14.7667 11.7552 14.7667 11.0333ZM13.1333 6.03786V9.80528C13.0078 9.83794 12.8843 9.8964 12.7692 9.95363L11.9152 9.47923L11.8926 9.46664H11.8697C11.8686 9.46642 11.8664 9.46594 11.8628 9.46496C11.8545 9.4627 11.8448 9.45949 11.8316 9.45511C11.8198 9.45115 11.8045 9.44604 11.7899 9.44204C11.7766 9.43841 11.7556 9.43331 11.7333 9.43331C11.4836 9.43331 11.2333 9.63944 11.2333 9.93331C11.2333 10.1054 11.3215 10.2345 11.4445 10.3165L11.4444 10.3167L11.4496 10.3197L12.1843 10.7483C12.1579 10.8502 12.1333 10.9528 12.1333 11.1C12.1333 11.2298 12.1535 11.3128 12.176 11.4054C12.1795 11.4199 12.1831 11.4346 12.1867 11.4498L8.95573 13.3051C8.83157 13.167 8.67955 13.0511 8.46668 12.9389V12V11.9917L8.46532 11.9835C8.44597 11.8674 8.3967 11.7552 8.31239 11.6709C8.22652 11.5851 8.10923 11.5333 7.96668 11.5333C7.83029 11.5333 7.71226 11.5728 7.62328 11.6562C7.53534 11.7386 7.48652 11.854 7.46768 11.9858L7.46668 11.9929V12V12.8933C7.26944 12.9611 7.07204 13.078 6.93462 13.2659L3.68252 11.3848C3.70856 11.2854 3.73334 11.1867 3.73334 11.0666C3.73334 11.063 3.73335 11.0594 3.73335 11.0558C3.7334 10.995 3.73344 10.9353 3.72026 10.8761L4.45301 10.4181L4.46267 10.4121L4.47072 10.404L4.4974 10.3773C4.61594 10.2951 4.70001 10.1681 4.70001 9.99998C4.70001 9.75021 4.49388 9.49998 4.20001 9.49998C4.10925 9.49998 4.02387 9.5428 3.96335 9.57316C3.96061 9.57453 3.95792 9.57588 3.95529 9.5772L3.95509 9.57679L3.94701 9.58184L3.20379 10.0464C3.0942 9.97153 2.98001 9.91517 2.83334 9.86215V6.03366C2.95686 5.98142 3.06594 5.92563 3.17335 5.85166L3.94167 6.28192C3.97831 6.31211 4.0216 6.32301 4.05024 6.32778C4.08349 6.33332 4.11537 6.33331 4.13192 6.33331H4.13334C4.38311 6.33331 4.63334 6.12718 4.63334 5.83331C4.63334 5.76145 4.60953 5.69541 4.58112 5.63859C4.55332 5.58298 4.51707 5.52862 4.48492 5.4804L4.48321 5.47784L4.47151 5.46028L4.4537 5.44894L3.78565 5.02382C3.79037 5.0016 3.79335 4.97988 3.79535 4.95993C3.80001 4.91327 3.80001 4.86747 3.80001 4.83478V4.83331L3.80001 4.82764C3.80002 4.75353 3.80003 4.66919 3.78263 4.58176L7.04622 2.694C7.18135 2.83231 7.36937 2.94328 7.53334 3.02801V3.96664C7.53334 4.21641 7.73947 4.46664 8.03334 4.46664C8.32191 4.46664 8.53334 4.2552 8.53334 3.96664V3.03631C8.70214 2.96804 8.86733 2.85561 8.99432 2.69784L12.2201 4.55027C12.2 4.65899 12.2 4.74312 12.2 4.79956V4.79998V4.91122L11.447 5.38184L11.447 5.38181L11.4445 5.38344C11.3215 5.46547 11.2333 5.59452 11.2333 5.76664C11.2333 6.01641 11.4395 6.26664 11.7333 6.26664L11.7372 6.26664C11.7674 6.26665 11.7998 6.26666 11.8331 6.26112C11.8703 6.25492 11.9049 6.24267 11.9447 6.22275L11.9449 6.22306L11.952 6.21873L12.6554 5.79056C12.789 5.89834 12.9716 5.97978 13.1333 6.03786Z'
        fill='#344054'
        stroke='#344054'
        stroke-width='0.2'
      />
    </svg>
  ),
  All: (
    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'>
      <path
        d='M8.66666 5L6.66666 7L9.33332 8.33333L7.33332 10.3333M13.3333 8C13.3333 11.2723 9.76402 13.6523 8.46532 14.4099C8.31772 14.496 8.24393 14.5391 8.13978 14.5614C8.05895 14.5787 7.94103 14.5787 7.8602 14.5614C7.75605 14.5391 7.68226 14.496 7.53466 14.4099C6.23596 13.6523 2.66666 11.2723 2.66666 8V4.81173C2.66666 4.27872 2.66666 4.01222 2.75383 3.78313C2.83084 3.58076 2.95598 3.40018 3.11843 3.25702C3.30232 3.09495 3.55186 3.00138 4.05093 2.81423L7.62546 1.47378C7.76405 1.4218 7.83335 1.39582 7.90465 1.38552C7.96788 1.37638 8.0321 1.37638 8.09533 1.38552C8.16663 1.39582 8.23592 1.4218 8.37452 1.47378L11.9491 2.81423C12.4481 3.00138 12.6977 3.09495 12.8816 3.25702C13.044 3.40018 13.1691 3.58076 13.2461 3.78313C13.3333 4.01222 13.3333 4.27872 13.3333 4.81173V8Z'
        stroke='#344054'
        stroke-width='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  ),
  Coach: (
    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'>
      <path
        d='M8.66666 5L6.66666 7L9.33332 8.33333L7.33332 10.3333M13.3333 8C13.3333 11.2723 9.76402 13.6523 8.46532 14.4099C8.31772 14.496 8.24393 14.5391 8.13978 14.5614C8.05895 14.5787 7.94103 14.5787 7.8602 14.5614C7.75605 14.5391 7.68226 14.496 7.53466 14.4099C6.23596 13.6523 2.66666 11.2723 2.66666 8V4.81173C2.66666 4.27872 2.66666 4.01222 2.75383 3.78313C2.83084 3.58076 2.95598 3.40018 3.11843 3.25702C3.30232 3.09495 3.55186 3.00138 4.05093 2.81423L7.62546 1.47378C7.76405 1.4218 7.83335 1.39582 7.90465 1.38552C7.96788 1.37638 8.0321 1.37638 8.09533 1.38552C8.16663 1.39582 8.23592 1.4218 8.37452 1.47378L11.9491 2.81423C12.4481 3.00138 12.6977 3.09495 12.8816 3.25702C13.044 3.40018 13.1691 3.58076 13.2461 3.78313C13.3333 4.01222 13.3333 4.27872 13.3333 4.81173V8Z'
        stroke='#344054'
        stroke-width='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  ),
  error: (
    <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'>
      <path
        d='M6 4V6M6 8H6.005M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z'
        stroke='#B42318'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  ),
}
