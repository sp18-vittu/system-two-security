import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import CustomToast from '../../layouts/App/CustomToast'
import { datavalutPdfUpload } from '../../redux/nodes/datavault/action'
import { useDispatch } from 'react-redux'
import { allCtiSourceVault, ctiSourceVault } from '../../redux/nodes/SourceAndCollections/action'
import AddCTISourceDialog from '../SourceAndCollection/Sources/AddCTISourceDialog'
import { createChat } from '../../redux/nodes/chatPage/action'
import local from '../../utils/local'
import { environment } from '../../environment/environment'
import { v4 as uuidv4 } from 'uuid'
import { useData } from '../../layouts/shared/DataProvider'
import useWindowResolution from '../../layouts/Dashboard/useWindowResolution'

function LandingPage() {
  const navigateTo = useNavigate()
  const dispatch = useDispatch()
  const [uploadepdf, setUploadepdf] = useState(null as any)
  const [pdferror, setPdfError] = useState(null as any)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState(false)
  const [allctireports, setAllCtiReports] = useState(null as any)
  const [ctidefault, setCtidefault] = useState(null as any)
  const [sendmessage, setSendmessage] = useState('' as any)
  const socketRef = useRef<WebSocket | null>(null)
  const [sessionid, setSessionId] = useState(null)
  const [sortModels, setSortModel] = useState(null as any)
  let sessionList: any = []
  const {
    setChatinputWss,
    setResponceChatWss,
    Chatmessage,
    setChatmessage,
    setSendwssconnect,
    setSendwssProcessing,
    artifactList,
    setArtifactList,
    sigmaSearchFiles,
    setSigmaSearchFiles
  }: any = useData()
  const { height } = useWindowResolution()
  const dynamicHeight = Math.max(100, height * 0.9)
  const [navHeight, setNavHeight] = useState(0)

  useEffect(() => {
    fetDetails()
    sessionStorage.removeItem('artifacts')
  }, [])

  useEffect(() => {
    const nav = document.querySelector('#navHeight')
    if (nav) {
      setNavHeight(nav.clientHeight)
    }
  }, [])

  useEffect(() => {
    fetDetails()
  }, [])

  const fetDetails = () => {
    dispatch(ctiSourceVault() as any).then((res: any) => {
      if (res?.payload?.id) {
        setCtidefault(res.payload)
        dispatch(allCtiSourceVault() as any).then((res: any) => {
          if (res?.type == 'GET_ALL_CTI_REPORTS_SUCCESS')
            if (res?.payload && res?.payload?.length > 0) {
              const allCti: any =
                res?.payload?.length > 0
                  ? res?.payload?.find((x: any) => x.id == res?.payload?.id)
                  : []
              const huntoftheDay: any =
                res?.payload?.length > 0
                  ? res?.payload?.find((x: any) => x?.s3Folder == 'HUNT_OF_THE_DAY')
                  : []
              if (allCti?.ctiReports?.length > 0 && huntoftheDay?.ctiReports?.length > 0) {
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
                    x?.status == 'PROCESSING' &&
                    (x?.reportSource === 'PDF' || x?.reportSource === 'WEB'),
                )
                sessionStorage.setItem('ctiReports', JSON.stringify(updatedReports))
                setAllCtiReports(updatedReports)
              }
            }
        })
      }
    })
  }

  const handleCollectionNavigate = () => {
    navigateTo('/app/collections')
  }

  const handleTBNavigate = () => {
    navigateTo('/app/sourcespage')
    sessionStorage.setItem('active', 'sources')
    sessionStorage.setItem('srcactiveTab', JSON.stringify(1))
  }

  const handleOpenCti = () => {
    setIsOpen(true)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files: any = event.target.files
    const filterPdf: any = allctireports?.filter((item: any) => {
      return item?.reportSource == 'PDF'
    })
    const containsSearchString = filterPdf?.some((report: any) =>
      report?.ctiName
        ?.replace(/-/g, ' ')
        ?.replace(/\.pdf$/i, '')
        ?.includes(files[0]?.name?.replace(/-/g, ' ')?.replace(/\.pdf$/i, '')),
    )

    if (files && files.length > 0) {
      if (files[0]?.type == 'application/pdf' && !containsSearchString) {
        setPdfError(null)
        setUploadepdf(files[0])
        setUploadProgress(0) // Reset progress
        simulateUpload(files[0]) // Start simulated upload
      } else {
        setUploadepdf(null)
        setPdfError(containsSearchString ? 'A CTI report already exists' : 'Select PDF only.')
      }
    }
  }

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault() // Allow the drop action
  }

  const handleDragLeave = () => { }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    const files = event.dataTransfer.files
    const filterPdf: any = allctireports.filter((item: any) => {
      return item?.reportSource == 'PDF'
    })
    const containsSearchString = filterPdf.some((report: any) =>
      report?.ctiName
        ?.replace(/-/g, ' ')
        ?.replace(/\.pdf$/i, '')
        ?.includes(files[0]?.name?.replace(/-/g, ' ')?.replace(/\.pdf$/i, '')),
    )
    if (files.length > 0) {
      const file = files[0] // Assuming we only want the first file
      if (file && file.type === 'application/pdf' && !containsSearchString) {
        setPdfError(null)
        setUploadepdf(files[0])
        setUploadProgress(0) // Reset progress
        simulateUpload(files[0]) // Start simulated upload
      } else {
        setUploadepdf(null)
        setPdfError(containsSearchString ? 'A CTI Report already exists' : 'Select pdf only')
      }
    }
  }

  const handleFileUpload = () => {
    setIsOpen(false)
    const toastId = toast.loading(
      <CustomToast
        message='Your file is being uploaded'
        onClose={() => toast.dismiss(toastId)} // Dismiss only this toast
      />,
      {
        duration: 1000000,
        position: 'top-center',
        style: {
          background: '#fff',
          color: '#000', // White text color
          width: '500px',
        },
      },
    )
    const data = new FormData()
    let objects = {
      datavaultId: ctidefault?.id,
      ctiName: uploadepdf.name,
    }
    data.append('pdf-file', uploadepdf as any)
    dispatch(datavalutPdfUpload(objects, data) as any)
      .then((res: any) => {
        if (res.type == 'PDF_UPLOAD_SUCCESS') {
          toast.success(
            <CustomToast
              message='File uploaded successfully!'
              onClose={() => toast.dismiss(toastId)} // Dismiss only this toast
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
          toast.dismiss(toastId)
          setUploadepdf(null)
          sessionStorage.setItem('active', 'sources')
          navigateTo('/app/sourcespage')
          sessionStorage.setItem('srcactiveTab', JSON.stringify(1))
        } else {
          toast.error(
            <CustomToast
              message='Failed to upload CTI report'
              onClose={() => toast.dismiss(toastId)} // Dismiss only this toast
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
          toast.dismiss(toastId)
        }
      })
      .catch((error: any) => {
        toast.error(
          <CustomToast
            message='File upload failed. Please try again.'
            onClose={() => toast.dismiss(toastId)} // Dismiss only this toast
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
        toast.dismiss(toastId)
      })
  }

  const simulateUpload = (file: File) => {
    setIsUploading(true)

    // Simulate upload progress
    const totalUploadTime = 5000 // 5 seconds total time
    const intervalTime = 200 // Update every 200ms
    const progressIncrement = 100 / (totalUploadTime / intervalTime)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          // alert("File uploaded successfully!");
          return prev
        }
        return prev + progressIncrement
      })
    }, intervalTime)
  }

  // ******************************************************
  const [rows, setRows] = useState(1)
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
    //       sessionStorage.setItem('chatid', newChatResponse?.payload?.id)
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
    if (sendmessage) {
      let senddata: any = {
        sendmessage: sendmessage,
      }
      setSigmaSearchFiles(senddata)
      navigateTo(`/app/sourcerulechats`, { state: { sources: null, sourcesheaer: "landing" } });
      sessionStorage.removeItem('chatid');
    }
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

      socket.onopen = () => {
        console.log('Connected to WebSocket server')
        let object: any = {
          "message_id": uuidv4(),
          "message": sendmessage,
          "focus": "rule_agent",
          "artifacts": [{
            "type": "rule_chat",
          }],

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
      navigateTo(`/app/sourcerulechats/${id}`, { state: { sources: null, sourcesheaer: "landing" } })
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
    <div>
      <div
        className='box-border relative flex items-center h-full justify-center py-[40px] overflow-visible'
        style={{
          minHeight: `calc(100vh - ${navHeight}px)`,
          textAlign: 'left',
          backgroundColor: '#0C111D',
          borderRadius: '8px',
        }}
      >
        <div className='flex flex-col gap-[40px] items-center justify-center w-full max-w-[1536px] h-full px-[40px]'>
          <div className='text-white text-center font-sans font-bold text-[40px] max-xl:text-[32px] relative self-stretch'>
            Create. Discover. Transform. Review.
          </div>

          <div className='flex flex-col gap-[24px] items-start justify-start self-stretch flex-shrink-0 relative'>
            {/* <div
              className={`bg-[#0f1824] hover:bg-[#1D2939] hover:border-2 border-[#1D2939] rounded-[10px] border-2 border-solid border-[#1d2939] p-[16px] pr-[24px] flex flex-row gap-[16px] items-center justify-center self-stretch flex-shrink-0 h-[${68}px] relative overflow-hidden`}
            >
              <textarea
                placeholder='Start typing to create detections with assistive GenAI'
                className='text-[#98a2b3] text-left font-medium text-[16px] leading-[24px] bg-transparent border-none outline-none w-full max-h-[50px] resize-none'
                value={sendmessage}
                onChange={handleOnChange}
                onInput={handleResize}
                onKeyDown={(e) => {
                  handleKeyDown(e)
                }}
                rows={rows}
              />
              <button
                disabled={!sendmessage ? true : false}
                onClick={() => handleWebSocket()}
                className={`${
                  !sendmessage
                    ? 'cursor-not-allowed opacity-50 hover bg-[#ee7103]'
                    : 'bg-[#ee7103] cursor-pointer'
                } bg-[#ee7103] rounded-[8px] px-[12px] py-[8px] flex flex-row gap-[4px] items-center justify-center flex-shrink-0 relative shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden `}
              >
                <div className='px-[2px] py-0 flex flex-row gap-0 items-center justify-center flex-shrink-0 relative'>
                  <div className='text-[#ffffff] text-left font-inter font-semibold text-[14px] leading-[20px] relative'>
                    Chat
                  </div>
                </div>
                <div className='flex flex-row gap-[10px] items-center justify-start flex-shrink-0 w-[20px] relative'>
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
                      d='M15.5044 1.05835C15.6303 0.758381 16.1037 0.758381 16.2296 1.05835C16.491 1.68162 16.8619 2.44754 17.2327 2.81468C17.6058 3.18408 18.3487 3.55349 18.9459 3.81261C19.2402 3.9403 19.2402 4.39318 18.9459 4.52086C18.3487 4.77995 17.6058 5.14933 17.2327 5.51875C16.8619 5.88587 16.491 6.65179 16.2296 7.27506C16.1037 7.57503 15.6303 7.57503 15.5044 7.27506C15.243 6.65179 14.8721 5.88587 14.5013 5.51875C14.1304 5.15161 13.3568 4.78448 12.7272 4.52563C12.4243 4.40106 12.4243 3.93242 12.7272 3.80782C13.3568 3.54896 14.1304 3.18181 14.5013 2.81468C14.8721 2.44754 15.243 1.68162 15.5044 1.05835Z'
                      fill='white'
                    />
                    <path
                      d='M2.87358 2.77885C3.04605 2.40705 3.65149 2.40705 3.82396 2.77885C4.01977 3.20095 4.25587 3.62937 4.49195 3.86397C4.73118 4.10172 5.15203 4.33944 5.56053 4.53554C5.92383 4.70994 5.92383 5.29011 5.56053 5.46449C5.15201 5.66057 4.73118 5.8983 4.49195 6.13602C4.25587 6.37063 4.01977 6.79905 3.82396 7.22115C3.65149 7.59295 3.04605 7.59295 2.87358 7.22115C2.67776 6.79905 2.44167 6.37063 2.20559 6.13602C1.9695 5.90142 1.53838 5.66681 1.11362 5.47223C0.739482 5.30084 0.739464 4.69919 1.1136 4.5278C1.53836 4.33321 1.9695 4.09858 2.20559 3.86397C2.44167 3.62937 2.67776 3.20095 2.87358 2.77885Z'
                      fill='white'
                    />
                  </svg>
                </div>
              </button>
            </div> */}

            <div className="chat-2-0 bg-[#1c2838] border border-[#344054] rounded-md p-4 mx-auto mt-10 w-full">
              <div className="chat-bar bg-[#0f1824] border border-[#1d2939] rounded-md p-4 flex flex-wrap items-center gap-4">

                <textarea
                  className="chat-text flex-1 text-gray-400  bg-transparent border-none resize-none outline-none"
                  placeholder="Start typing to create detections with assistive GenAI"
                  value={sendmessage}
                  onChange={handleOnChange}
                  onInput={handleResize}
                  onKeyDown={(e) => {
                    handleKeyDown(e)
                  }}
                  rows={rows}
                />

                <button disabled={sendmessage ? false : true} onClick={handleWebSocket} className={`chat-button2 ${sendmessage ? 'cursor-pointer' : 'cursor-not-allowed opacity-50 hover'} bg-[#ee7103] rounded-md px-4 py-2 flex items-center gap-2 shadow-sm`}>
                  <span className="text-sm font-semibold text-white">
                    Chat
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M8.94023 5.20558C9.04556 4.93147 9.46367 4.93147 9.56899 5.20558C10.0144 6.36493 10.8708 8.38109 11.7272 9.22628C12.5857 10.0737 14.5257 10.9211 15.6309 11.3598C15.9008 11.4669 15.9008 11.8665 15.6309 11.9737C14.5256 12.4123 12.5857 13.2597 11.7272 14.107C10.8708 14.9523 10.0144 16.9685 9.56899 18.1278C9.46367 18.4018 9.04556 18.4018 8.94023 18.1278C8.4948 16.9685 7.63843 14.9523 6.78208 14.107C5.92572 13.2618 3.88294 12.4167 2.7083 11.9771C2.43057 11.8731 2.43057 11.4604 2.70829 11.3565C3.88293 10.9167 5.92572 10.0715 6.78208 9.22628C7.63843 8.38109 8.4948 6.36493 8.94023 5.20558Z" fill="white" />
                    <path d="M15.5044 1.05823C15.6303 0.758259 16.1037 0.758259 16.2296 1.05823C16.491 1.6815 16.8619 2.44742 17.2327 2.81456C17.6058 3.18396 18.3487 3.55337 18.9459 3.81248C19.2402 3.94018 19.2402 4.39306 18.9459 4.52074C18.3487 4.77983 17.6058 5.14921 17.2327 5.51862C16.8619 5.88575 16.491 6.65167 16.2296 7.27494C16.1037 7.57491 15.6303 7.57491 15.5044 7.27494C15.243 6.65167 14.8721 5.88575 14.5013 5.51862C14.1304 5.15148 13.3568 4.78436 12.7272 4.52551C12.4243 4.40094 12.4243 3.9323 12.7272 3.8077C13.3568 3.54884 14.1304 3.18169 14.5013 2.81456C14.8721 2.44742 15.243 1.6815 15.5044 1.05823Z" fill="white" />
                    <path d="M2.87395 2.77885C3.04642 2.40705 3.65186 2.40705 3.82433 2.77885C4.02013 3.20095 4.25623 3.62937 4.49232 3.86397C4.73154 4.10172 5.15239 4.33944 5.5609 4.53554C5.9242 4.70994 5.9242 5.29011 5.5609 5.46449C5.15238 5.66057 4.73154 5.8983 4.49232 6.13602C4.25623 6.37063 4.02013 6.79905 3.82433 7.22115C3.65186 7.59295 3.04642 7.59295 2.87395 7.22115C2.67812 6.79905 2.44204 6.37063 2.20595 6.13602C1.96987 5.90142 1.53875 5.66681 1.11399 5.47223C0.739848 5.30084 0.739831 4.69919 1.11397 4.5278C1.53873 4.33321 1.96987 4.09858 2.20595 3.86397C2.44204 3.62937 2.67812 3.20095 2.87395 2.77885Z" fill="white" />
                  </svg>
                </button>
              </div>
            </div>

            <div className='flex flex-wrap gap-[24px] items-center items-stretch justify-center flex-shrink-0 w-full relative px-[40px]'>
              <div
                className='bg-[#0F1824] hover:bg-[#1D2939] hover:border-2 border-[#1D2939] rounded-[10px] border-2 border-[#1d2939] px-[24px] py-[16px] flex flex-row gap-[16px] items-center justify-center flex-1 cursor-pointer max-lg:basis-1/3 max-md:basis-full'
                onClick={handleTBNavigate}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='32'
                  height='30'
                  viewBox='0 0 32 30'
                  fill='none'
                >
                  <path
                    d='M26.2353 23.6667L30.5 28M1.5 2H28.7941M1.5 12.4H8.32353M1.5 22.8H8.32353M13.4412 17.6C13.4412 19.4388 14.1601 21.2024 15.4397 22.5026C16.7194 23.8029 18.455 24.5333 20.2647 24.5333C22.0744 24.5333 23.81 23.8029 25.0897 22.5026C26.3693 21.2024 27.0882 19.4388 27.0882 17.6C27.0882 15.7612 26.3693 13.9976 25.0897 12.6974C23.81 11.3971 22.0744 10.6667 20.2647 10.6667C18.455 10.6667 16.7194 11.3971 15.4397 12.6974C14.1601 13.9976 13.4412 15.7612 13.4412 17.6Z'
                    stroke='#EE7103'
                    stroke-width='2.5'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
                <div className='text-[#e8eff9] text-left font-inter text-[20px] leading-[1.5] max-xl:text-[16px] font-semibold relative'>
                  Discover existing detections
                </div>
              </div>

              {/* Second Card */}
              <div
                className='bg-[#0f1824] hover:bg-[#1D2939] hover:border-2 border-[#1D2939] rounded-[10px] border-2 border-[#1d2939] px-[24px] py-[16px] flex flex-row gap-[16px] items-center justify-center flex-1 cursor-pointer max-lg:basis-1/3 max-md:basis-full'
                onClick={handleOpenCti}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='36'
                  height='36'
                  viewBox='0 0 36 36'
                  fill='none'
                >
                  <path
                    d='M34 16.2222V10.8889C34 9.9459 33.6254 9.04153 32.9586 8.37473C32.2918 7.70794 31.3874 7.33333 30.4444 7.33333H19.7778M19.7778 7.33333L25.1111 12.6667M19.7778 7.33333L25.1111 2M2 19.7778V25.1111C2 26.0541 2.3746 26.9585 3.0414 27.6253C3.70819 28.2921 4.61256 28.6667 5.55556 28.6667H16.2222M16.2222 28.6667L10.8889 23.3333M16.2222 28.6667L10.8889 34M2 7.33333C2 8.74782 2.5619 10.1044 3.5621 11.1046C4.56229 12.1048 5.91885 12.6667 7.33333 12.6667C8.74782 12.6667 10.1044 12.1048 11.1046 11.1046C12.1048 10.1044 12.6667 8.74782 12.6667 7.33333C12.6667 5.91885 12.1048 4.56229 11.1046 3.5621C10.1044 2.5619 8.74782 2 7.33333 2C5.91885 2 4.56229 2.5619 3.5621 3.5621C2.5619 4.56229 2 5.91885 2 7.33333ZM34 23.3333V34H23.3333V23.3333H34Z'
                    stroke='#EE7103'
                    stroke-width='2.5'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
                <div className='text-[#e8eff9] text-left font-inter font-semibold text-[20px] leading-[1.5] max-xl:text-[16px] font-semibold relative'>
                  Transform threat intelligence
                  <br />
                  into detections
                </div>
              </div>

              {/* Third Card */}
              <div
                className='bg-[#0f1824] hover:bg-[#1D2939] hover:border-2 border-[#1D2939] rounded-[10px] border-2 border-[#1d2939] px-[24px] py-[16px] flex flex-row gap-[16px] items-center justify-center flex-1 cursor-pointer max-lg:basis-1/3 max-md:basis-full'
                onClick={handleCollectionNavigate}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='36'
                  height='36'
                  viewBox='0 0 36 36'
                  fill='none'
                >
                  <path
                    d='M15 18C15 18.7956 15.3161 19.5587 15.8787 20.1213C16.4413 20.6839 17.2044 21 18 21C18.7956 21 19.5587 20.6839 20.1213 20.1213C20.6839 19.5587 21 18.7956 21 18C21 17.2044 20.6839 16.4413 20.1213 15.8787C19.5587 15.3161 18.7956 15 18 15C17.2044 15 16.4413 15.3161 15.8787 15.8787C15.3161 16.4413 15 17.2044 15 18Z'
                    stroke='#EE7103'
                    stroke-width='2.5'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                  <path
                    d='M17.1316 27.25C16.5619 27.25 16.0003 27.2219 15.4468 27.1656C9.93642 26.6054 5.28747 23.2585 1.5 17.125C5.66842 10.375 10.8789 7 17.1316 7C23.1492 7 28.2016 10.1264 32.289 16.3791M31.3737 30.9625L34.5 34M22.3421 27.25C22.3421 28.5927 22.8911 29.8803 23.8682 30.8297C24.8454 31.7791 26.1707 32.3125 27.5526 32.3125C28.9345 32.3125 30.2599 31.7791 31.237 30.8297C32.2142 29.8803 32.7632 28.5927 32.7632 27.25C32.7632 25.9073 32.2142 24.6197 31.237 23.6703C30.2599 22.7209 28.9345 22.1875 27.5526 22.1875C26.1707 22.1875 24.8454 22.7209 23.8682 23.6703C22.8911 24.6197 22.3421 25.9073 22.3421 27.25Z'
                    stroke='#EE7103'
                    stroke-width='2.5'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
                <div className='text-[#e8eff9] text-left font-inter font-semibold text-[20px] leading-[1.5] max-xl:text-[16px] font-semibold relative'>
                  Review my detection library
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <AddCTISourceDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          ctireportsList={allctireports}
          defaultId={ctidefault}
          setAddctireport={() => { }}
          handleFileChange={handleFileChange}
          handleDragEnter={handleDragEnter}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          handleFileUpload={handleFileUpload}
          pdferror={pdferror}
          uploadepdf={uploadepdf}
          setUploadepdf={setUploadepdf}
          uploadProgress={uploadProgress}
          isUploading={isUploading}
          setPdfError={setPdfError}
          setSortModel={setSortModel}
        />
      )}
    </div>
  )
}

export default LandingPage
