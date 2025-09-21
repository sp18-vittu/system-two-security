import React, { useEffect, useRef, useState } from 'react'
import ThreatBriefsList from './ThreatBriefsList'
import CTIReportsLists from './CTIReportsLists'
import { useDispatch } from 'react-redux'
import { allCtiSourceVault, ctiSourceVault } from '../../../redux/nodes/SourceAndCollections/action'
import { getAllThreatbrief } from '../../../redux/nodes/threatBriefs/action'
import { useData } from '../../../layouts/shared/DataProvider'
import { useLocation, useNavigate } from 'react-router-dom'
import ImportsHompage from '../Imports/ImportsHompage'
import { ImportTreeViewList } from '../../../redux/nodes/Imports/action'
import DacReposHome from '../DACRepos/DacReposHome'
import { Menu } from '@mui/material'
import { environment } from '../../../environment/environment'
import local from '../../../utils/local'
import { v4 as uuidv4 } from 'uuid'
import { createChat } from '../../../redux/nodes/chatPage/action'
import useWindowResolution from '../../../layouts/Dashboard/useWindowResolution'

function SourcesHomepage() {
  const tabitem: any = JSON.parse(sessionStorage.getItem('srcactiveTab') as any)
  const [activeTab, setActiveTab] = useState(tabitem ? Number(tabitem) : (1 as any))
  const dispatch = useDispatch()
  const location = useLocation()
  const { state } = location
  const [ctidefault, setCtidefault] = useState(null as any)
  const [allctireports, setAllCtiReports] = useState(null as any)
  const [threatBriefList, setThreatBriefList] = useState([] as any)
  const [addctireport, setAddctireport] = useState(null as any)
  const [reloading, setReLoading] = useState(false)
  const { wssProvider, setWssProvider, setTBList, CtiReportList, setCtiReportList }: any = useData()
  const [count, setCount] = useState(false as any)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [deleteimport, setDeleteimport] = useState(null as any)
  const [importFolderList, setImportFolderList] = useState([] as any)
  const [dacFolderList, setDacFolderList] = useState([] as any)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedOption, setSelectedOption] = useState('All Categories' as any)
  const { width } = useWindowResolution()

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const statusChange = (option: any) => {
    setAnchorEl(null)
    setSelectedOption(option)
  }

  const tabs = [
    { id: 1, name: 'CTI Reports', isActive: (tabitem ? Number(tabitem) : activeTab) === 1 },
    { id: 2, name: 'Threat Briefs', isActive: (tabitem ? Number(tabitem) : activeTab) === 2 },
    { id: 3, name: 'Imported', isActive: (tabitem ? Number(tabitem) : activeTab) === 3 },
    { id: 4, name: 'DAC Repos', isActive: (tabitem ? Number(tabitem) : activeTab) === 4 },
  ]

  // const tabs = [
  //   { label: "CTI Reports", color: "#ee7103" },
  //   { label: "Threat Briefs", color: "#ee7103" },  // Modify colors as needed
  //   { label: "DAC Repos", color: "#ee7103" },
  //   { label: "Imported", color: "#ee7103" },
  // ];

  useEffect(() => {
    sessionStorage.removeItem('artifacts')
    getThreatBrief()
    dispatch(ctiSourceVault() as any).then((res: any) => {
      if (res?.payload?.id) {
        setCtidefault(res.payload)
      }
    })
    fetDetailsTreeView()
    fetDetailsDACTreeView()
  }, [])

  useEffect(() => {
    if (deleteimport == 'delete') {
      fetDetailsTreeView()
      fetDetailsDACTreeView()
    }
  }, [deleteimport])

  useEffect(() => {
    if (ctidefault) {
      fetDetails()
    } else if (addctireport == 'add') {
      fetDetails()
    }
    if (count) {
      intervalRef.current = setInterval(() => {
        fetDetails()
      }, 3000)
    } else if (!count) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [ctidefault, addctireport, count])

  useEffect(() => {
    if (wssProvider) {
      if (
        wssProvider?.eventType == 'cti processing completed' ||
        wssProvider?.eventType == 'cti analysing completed' ||
        wssProvider?.eventType == 'cti processing failed' ||
        wssProvider?.eventType == 'cti analysing failed'
      ) {
        fetDetails()
        setWssProvider(null)
      }
    }
  }, [wssProvider])

  useEffect(() => {
    if (wssProvider) {
      if (
        wssProvider?.eventType == 'imported DAC' ||
        wssProvider?.eventType == 'deleting DAC' ||
        wssProvider?.eventType == 'deleted DAC'
      ) {
        setWssProvider(null)
        fetDetailsDACTreeView();
      }
    }
  }, [wssProvider])

  const fetDetails = () => {
    setReLoading(true)
    dispatch(allCtiSourceVault() as any).then((res: any) => {
      if (res?.type == 'GET_ALL_CTI_REPORTS_SUCCESS') {
        if (res?.payload && res?.payload?.length > 0) {
          const allCti: any =
            res?.payload?.length > 0 ? res?.payload?.find((x: any) => x.id == ctidefault?.id) : []
          const huntoftheDay: any =
            res?.payload?.length > 0
              ? res?.payload?.find((x: any) => x?.s3Folder == 'HUNT_OF_THE_DAY')
              : []
          const overAllCti: any = [...allCti?.ctiReports, ...huntoftheDay?.ctiReports]
          const updatedReports: any = overAllCti?.map((report: any) =>
            report.reportSource === 'WEB'
              ? {
                ...report,
                viewname: 'Community',
                filename: '',
                viweStatus:
                  report.status == 'COMPLETE' &&
                    report?.intelCount?.data?.SIGMA &&
                    !report?.intelCount?.data?.CVEs &&
                    !report?.intelCount?.data?.IOC &&
                    !report?.intelCount?.data?.TTPs
                    ? 'Intel information unavailable'
                    : '',
              }
              : {
                ...report,
                viewname: 'Private',
                filename: `file://${report?.ctiName}`,
                viweStatus:
                  report.status == 'COMPLETE' &&
                    report?.intelCount?.data?.SIGMA &&
                    !report?.intelCount?.data?.CVEs &&
                    !report?.intelCount?.data?.IOC &&
                    !report?.intelCount?.data?.TTPs
                    ? 'Intel information unavailable'
                    : '',
              },
          )
          const ctireports: any = updatedReports?.find(
            (x: any) =>
              x?.status == 'PROCESSING' && (x?.reportSource === 'PDF' || x?.reportSource === 'WEB'),
          )
          setCount(ctireports ? true : false)
          setCtiReportList(updatedReports)
          sessionStorage.setItem('ctiReports', JSON.stringify(updatedReports))
          setAllCtiReports(updatedReports)
          setAddctireport(null)
          setReLoading(false)
        }
      } else {
        setAddctireport(null)
        setReLoading(false)
      }

    })
  }
 
  const getThreatBrief = () => {
    dispatch(getAllThreatbrief() as any)
      .then((response: any) => {
        if (response.type === 'GET_THREAT_BRIEF_SUCCESS') {
          if (response?.payload?.length > 0) {
            const filterValue = response?.payload.filter((item: any) => {
              const [beforeWith] = item?.description.split(' with')
              return beforeWith == 'processing succeeded'
            })
            setTBList(response?.payload)
            setThreatBriefList(response?.payload)
          }
        }
      })
      .catch((err: any) => console.log('err', err))
  }

  useEffect(() => {
    if (state) {
      setActiveTab(state?.tab)
    }
  }, [state?.tab])

  const handletabchange = (text: any) => {
    setActiveTab(text)
    sessionStorage.setItem('srcactiveTab', JSON.stringify(text))
  }

  const fetDetailsTreeView = () => {
    let isDAC = false
    dispatch(ImportTreeViewList(isDAC) as any).then((res: any) => {
      if (res.type == 'IMPORT_TREEVIEW_GET_SUCCESS') {
        setDeleteimport(null)
        const responseData: any = res?.payload?.sort((a: any, b: any) => b.id - a.id);
        setImportFolderList(responseData)
      }
    })
  }

  const fetDetailsDACTreeView = () => {
    let isDAC = true
    dispatch(ImportTreeViewList(isDAC) as any).then((res: any) => {
      if (res.type == 'IMPORT_TREEVIEW_GET_SUCCESS') {
        setDeleteimport(null)
        setDacFolderList(res?.payload)
      }
    })
  }
  // *******************************Wss for Rule Chat****************************
  const {
    setChatinputWss,
    setResponceChatWss,
    Chatmessage,
    setChatmessage,
    setSendwssconnect,
    artifactList,
    setArtifactList,
    sendwssProcessing,
    setSendwssProcessing,
    sigmaSearchFiles,
    setSigmaSearchFiles
  }: any = useData()
  const [sendmessage, setSendmessage] = useState('' as any)
  const socketRef = useRef<WebSocket | null>(null)
  const [sessionid, setSessionId] = useState(null)
  const [rows, setRows] = useState(1)
  const navigateTo = useNavigate()
  let sessionList: any = []

  const handleKeyDown = (event: any) => {
    setChatmessage([])
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
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
      e.target.style.height = `${Math.min(e.target.scrollHeight, 72)}px`
    }
  }

  const handleWebSocket = () => {
    let sourcesslt: any = selectedOption == "CTI" ? "cti" : selectedOption == "DAC" ? "dac_repo" : selectedOption == "Imported" ? "imported" : selectedOption == "Shared/Community" ? "shared" : null
    let senddata: any = {
      sendmessage: sendmessage,
      focus: sourcesslt
    }
    setSigmaSearchFiles(senddata)
    navigateTo(`/app/sourcerulechats`, { state: { sources: sourcesslt, sourcesheaer: "sources" } })
    sessionStorage.removeItem('chatid')
    // if (!sessionid && sessionList.length == 0 && sendmessage.trim()) {
    //   const selectFiles = {
    //     vaultId: 0,
    //     id: 0,
    //     ruleId: 0,
    //     mitreLocation: null,
    //     global: false,
    //     sessionItem: true,
    //   }
    //   const sessionName =
    //     sendmessage.trim().length > 200 ? `${sendmessage.trim().slice(0, 200)}` : sendmessage.trim()
    //   const chatObj = {
    //     sessionName: sessionName,
    //   }
    //   dispatch(createChat(selectFiles, chatObj) as any).then((newChatResponse: any) => {
    //     if (newChatResponse.type == 'CREATE_CHAT_SUCCESS') {
    //       connectWebSocket(newChatResponse.payload.id, newChatResponse?.payload?.sessionName)
    //       setSessionId(newChatResponse.payload.id)
    //       setSendwssconnect(true)
    //       setSendwssProcessing(true)
    //     }
    //   })
    // } else {
    //   if (sendmessage.trim() && sessionList?.length > 0) {
    //     setSendwssconnect(true)
    //     setSendwssProcessing(true)
    //     connectWebSocket(sessionList[0]?.id, sessionList[0]?.sessionName)
    //   }
    // }
  }

  const connectWebSocket = (id: any, sessionName: any) => {
    const localStorage1 = local.getItem('bearerToken')
    const token = JSON.parse(localStorage1 as any)
    const barearTockens = token?.bearerToken.split(' ')
    if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
      const socket = new WebSocket(
        `${environment?.baseWssUrl}/intel-chat/${id}/${sessionName}?Authorization=${barearTockens[1]}`,
      )
      socketRef.current = socket
      let sourcesslt: any =
        selectedOption == 'CTI'
          ? 'cti'
          : selectedOption == 'DAC'
            ? 'dac_repo'
            : selectedOption == 'Imported'
              ? 'imported'
              : selectedOption == 'Shared/Community'
                ? 'shared'
                : null
      socket.onopen = () => {
        console.log('Connected to WebSocket server')

        let object: any
        if (sourcesslt) {
          object = {
            message_id: uuidv4(),
            message: sendmessage,
            focus: 'sigma_search',
            artifacts: [
              {
                type: 'sigma_search',
                data: {
                  sources: [sourcesslt],
                },
              },
            ],
          }
        } else {
          object = {
            "message_id": uuidv4(),
            "message": sendmessage,
            "focus": "sigma_search",
            "artifacts": [{
              "type": "sigma_search",
              "data": {
                sources: [
                  "cti",
                  "dac_repo",
                  "imported"
                ]
              }
            }]
          }
        }

        setSendmessage('')
        setChatmessage((prevMessages: any) => [
          ...prevMessages,
          { message: sendmessage, question: true },
        ])
        setChatinputWss([...Chatmessage, { message: sendmessage, question: true }])
        // Send the initial message right after connecting
        socket.send(JSON.stringify(object))
      }
      navigateTo(`/app/sourcerulechats/${id}`, { state: { sources: sourcesslt, sourcesheaer: "sources" } })
      const messageMap: Map<string, any> = new Map()

      socket.onmessage = (event) => {
        const datavalues: any = JSON.parse(event.data)

        if (messageMap.has(datavalues?.message_id)) {
          const existingMessage: any = messageMap.get(datavalues?.message_id)
          existingMessage.status = datavalues?.status || ''
          existingMessage.artifacts = datavalues?.artifacts || []
          existingMessage.message += datavalues?.message || ''
          existingMessage.done = datavalues?.done || false
          existingMessage.focus = datavalues?.focus || ''
          existingMessage.sources = datavalues?.sources || []
          existingMessage.sourcesvalue = datavalues?.sources || []
          existingMessage.timestamp = datavalues?.created || null
          existingMessage.sourcescount = null
          if (datavalues?.artifacts?.length > 0) {
            setArtifactList(datavalues?.artifacts);
          }
        } else {
          messageMap.set(datavalues.message_id, {
            message: datavalues.message,
            question: false,
            error: datavalues.error,
          })
        }

        const mergedMessages = Array.from(messageMap.values())
        setResponceChatWss(mergedMessages)
        if (datavalues?.done) {
          setChatmessage((prev: any) => [...prev, ...mergedMessages])
          setResponceChatWss([])
          setChatinputWss([])
          disconnectWebSocket()
          setSendwssconnect(false)
          setSendwssProcessing(false)
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

  return (
    <div className='w-full h-full relative flex flex-col min-h-[100vh] pt-10'>
      <div className='box-border bg-[#0f121b]  relative w-[80%] mx-auto'>
        <div className='sources bg-[#0f121b] relative overflow-hidden'>
          <div className='flex gap-2 items-center justify-center flex-col text-center px-6 mb-8'>
            <div className='text-4xl font-bold text-white max-md:text-2xl'>
              Discover new detections
            </div>
            <div className='text-lg text-[#7d8697] max-md:text-base'>
              Chat with AI to quickly identify, search, and filter detections based on parameters
              that matter to you.
            </div>
          </div>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              // marginTop: -12,
              marginLeft: -2,
              '& .MuiPaper-root': {
                backgroundColor: '#48576c',
                color: '#fff',
                border: '1px solid #6e7580',
                borderRadius: 2,
              },
            }}
            anchorOrigin={{
              vertical: 'bottom', // Menu opens from the bottom of the button
              horizontal: 'center', // Menu is centered horizontally
            }}
            transformOrigin={{
              vertical: 'top', // Menu opens above the button
              horizontal: 'center', // Menu is centered horizontally
            }}
          >
            <div className='box-border bg-[#48576c] flex flex-col items-start justify-start w-full h-full relative  overflow-hidden'>
              <button
                onClick={() => statusChange('All Categories')}
                className='p-[2px_6px] flex flex-row items-center justify-start self-stretch flex-shrink-0 relative bg-transparent border-none'
              >
                <div className='rounded-[6px] p-[9px_10px] flex flex-row gap-[12px] items-center justify-start flex-1 relative'>
                  <div className='flex flex-row gap-[8px] items-center justify-start flex-1 relative'>
                    <div className='text-[#ffffff] text-left font-[Inter-Medium,sans-serif] text-[14px] leading-[20px] font-medium relative flex-1'>
                      All Categories
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => statusChange('CTI')}
                className='p-[2px_6px] flex flex-row items-center justify-start self-stretch flex-shrink-0 relative bg-transparent border-none'
              >
                <div className='rounded-[6px] p-[9px_10px] flex flex-row gap-[12px] items-center justify-start flex-1 relative'>
                  <div className='flex flex-row gap-[8px] items-center justify-start flex-1 relative'>
                    <div className='text-[#ffffff] text-left font-[Inter-Medium,sans-serif] text-[14px] leading-[20px] font-medium relative flex-1'>
                      CTI
                    </div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => statusChange('DAC')}
                className='p-[2px_6px] flex flex-row items-center justify-start self-stretch flex-shrink-0 relative bg-transparent border-none'
              >
                <div className='rounded-[6px] p-[9px_10px] flex flex-row gap-[12px] items-center justify-start flex-1 relative'>
                  <div className='flex flex-row gap-[8px] items-center justify-start flex-1 relative'>
                    <div className='text-[#ffffff] text-left font-[Inter-Medium,sans-serif] text-[14px] leading-[20px] font-medium relative flex-1'>
                      DAC
                    </div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => statusChange('Imported')}
                className='p-[2px_6px] flex flex-row items-center justify-start self-stretch flex-shrink-0 relative bg-transparent border-none'
              >
                <div className='rounded-[6px] p-[9px_10px] flex flex-row gap-[12px] items-center justify-start flex-1 relative'>
                  <div className='flex flex-row gap-[8px] items-center justify-start flex-1 relative'>
                    <div className='text-[#ffffff] text-left font-[Inter-Medium,sans-serif] text-[14px] leading-[20px] font-medium relative flex-1'>
                      Imported
                    </div>
                  </div>
                </div>
              </button>
              {/* <button
                onClick={() => statusChange('Shared/Community')}
                className='p-[2px_6px] flex flex-row items-center justify-start self-stretch flex-shrink-0 relative bg-transparent border-none'
              >
                <div className='rounded-[6px] p-[9px_10px] flex flex-row gap-[12px] items-center justify-start flex-1 relative'>
                  <div className='flex flex-row gap-[8px] items-center justify-start flex-1 relative'>
                    <div className='text-[#ffffff] text-left font-[Inter-Medium,sans-serif] text-[14px] leading-[20px] font-medium relative flex-1'>
                      Shared/Community
                    </div>
                  </div>
                </div>
              </button> */}
            </div>
          </Menu>

          <div className='chat-2-0 bg-[#1c2838] border border-[#344054] rounded-[10px] p-4 mx-auto mt-8'>
            <div className='chat-bar bg-[#0f1824] border border-[#1d2939] rounded-[10px] p-4 flex flex-wrap items-center gap-4 '>
              <div className='badge bg-[#0f121b] border border-[#7690b2] rounded-md px-3 py-1  '>
                <span className='text-[#ee7103] text-sm font-medium'>Discovery Agent</span>
              </div>

              <div
                onClick={handleClick}
                className='buttons-button-destructive2 flex items-center gap-2  px-3 py-1 cursor-pointer  '
              >
                <span className='text-sm font-semibold text-[#EE7103]'>{selectedOption}</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='21'
                  height='20'
                  viewBox='0 0 21 20'
                  fill='none'
                >
                  <path
                    d='M5.5 7.5L10.5 12.5L15.5 7.5'
                    stroke='#EE7103'
                    stroke-width='1.66667'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
              </div>

              <textarea
                className='chat-text flex-1 text-gray-400  bg-transparent border-none resize-none outline-none  max-lg:basis-full'
                rows={width < 768 ? 2 : 1}
                placeholder='Find detections across our processed source library'
                value={sendmessage}
                onChange={handleOnChange}
                // onInput={handleResize}
                onKeyDown={(e) => {
                  handleKeyDown(e)
                }}
              />

              <button
                disabled={sendmessage ? false : true}
                onClick={handleWebSocket}
                className={`chat-button2 ${sendmessage ? 'cursor-pointer' : 'cursor-not-allowed opacity-50 hover'
                  } bg-[#ee7103] rounded-md px-4 py-2 flex items-center gap-2 shadow-sm max-sm:justify-center max-sm:basis-full `}
              >
                <span className='text-sm font-semibold text-white'>Find Detections</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                >
                  <path
                    d='M8.94023 5.20558C9.04556 4.93147 9.46367 4.93147 9.56899 5.20558C10.0144 6.36493 10.8708 8.38109 11.7272 9.22628C12.5857 10.0737 14.5257 10.9211 15.6309 11.3598C15.9008 11.4669 15.9008 11.8665 15.6309 11.9737C14.5256 12.4123 12.5857 13.2597 11.7272 14.107C10.8708 14.9523 10.0144 16.9685 9.56899 18.1278C9.46367 18.4018 9.04556 18.4018 8.94023 18.1278C8.4948 16.9685 7.63843 14.9523 6.78208 14.107C5.92572 13.2618 3.88294 12.4167 2.7083 11.9771C2.43057 11.8731 2.43057 11.4604 2.70829 11.3565C3.88293 10.9167 5.92572 10.0715 6.78208 9.22628C7.63843 8.38109 8.4948 6.36493 8.94023 5.20558Z'
                    fill='white'
                  />
                  <path
                    d='M15.5044 1.05823C15.6303 0.758259 16.1037 0.758259 16.2296 1.05823C16.491 1.6815 16.8619 2.44742 17.2327 2.81456C17.6058 3.18396 18.3487 3.55337 18.9459 3.81248C19.2402 3.94018 19.2402 4.39306 18.9459 4.52074C18.3487 4.77983 17.6058 5.14921 17.2327 5.51862C16.8619 5.88575 16.491 6.65167 16.2296 7.27494C16.1037 7.57491 15.6303 7.57491 15.5044 7.27494C15.243 6.65167 14.8721 5.88575 14.5013 5.51862C14.1304 5.15148 13.3568 4.78436 12.7272 4.52551C12.4243 4.40094 12.4243 3.9323 12.7272 3.8077C13.3568 3.54884 14.1304 3.18169 14.5013 2.81456C14.8721 2.44742 15.243 1.6815 15.5044 1.05823Z'
                    fill='white'
                  />
                  <path
                    d='M2.87395 2.77885C3.04642 2.40705 3.65186 2.40705 3.82433 2.77885C4.02013 3.20095 4.25623 3.62937 4.49232 3.86397C4.73154 4.10172 5.15239 4.33944 5.5609 4.53554C5.9242 4.70994 5.9242 5.29011 5.5609 5.46449C5.15238 5.66057 4.73154 5.8983 4.49232 6.13602C4.25623 6.37063 4.02013 6.79905 3.82433 7.22115C3.65186 7.59295 3.04642 7.59295 2.87395 7.22115C2.67812 6.79905 2.44204 6.37063 2.20595 6.13602C1.96987 5.90142 1.53875 5.66681 1.11399 5.47223C0.739848 5.30084 0.739831 4.69919 1.11397 4.5278C1.53873 4.33321 1.96987 4.09858 2.20595 3.86397C2.44204 3.62937 2.67812 3.20095 2.87395 2.77885Z'
                    fill='white'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='flex border-b border-[#3E4B5D] space-x-3 w-[90%] mx-auto mt-8 mb-6'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handletabchange(tab.id)}
            className={`pb-2 font-inter  ${tab.isActive ? 'border-b-[3px] border-[#EE7103] text-white' : 'text-[#98A2B3]'
              } font-medium text-sm`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className='w-[90%] mx-auto'>
        {(tabitem ? Number(tabitem) : activeTab) === 1 && (
          <CTIReportsLists
            ctireportsList={allctireports}
            defaultId={ctidefault}
            setAddctireport={setAddctireport}
            reloading={reloading}
          />
        )}

        {(tabitem ? Number(tabitem) : activeTab) === 2 && (
          <ThreatBriefsList threatbriefslist={threatBriefList} />
        )}

        {(tabitem ? Number(tabitem) : activeTab) === 5 && (
          <div className='flex items-center justify-center top-[50%] relative w-full'>
            <div className='text-center w-full max-w-lg'>
              <h1 className='text-white text-3xl mb-4'>coming soon...</h1>
            </div>
          </div>
        )}

        {(tabitem ? Number(tabitem) : activeTab) === 4 && (
          <DacReposHome dacFolderList={dacFolderList} setDeleteimport={setDeleteimport} />
        )}

        {(tabitem ? Number(tabitem) : activeTab) === 3 && (
          <ImportsHompage importFolderList={importFolderList} setDeleteimport={setDeleteimport} />
        )}
      </div>

    </div>
  )
}

export default SourcesHomepage
