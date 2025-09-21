import Button from '@mui/material/Button'
import { makeStyles } from '@mui/styles'
import React, { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { environment } from '../../environment/environment'
import { useData } from '../../layouts/shared/DataProvider'
import {
  ChatHistoryDetails,
  ChatHistoryFindOne,
  ChatHistoryjSONDetails,
} from '../../redux/nodes/chat/action'
import { createChat, sessionChatUpdate } from '../../redux/nodes/chatPage/action'
import { ctiReportFileList } from '../../redux/nodes/cti-report/action'
import { dataVaultList, dataVaultuserIdList } from '../../redux/nodes/datavault/action'
import local from '../../utils/local'
import '../datavault/ChatView.css'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import moment from 'moment'
import { useTheme } from '@mui/material/styles'
import useWindowResolution from '../../layouts/Dashboard/useWindowResolution'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import MoveDownOutlinedIcon from '@mui/icons-material/MoveDownOutlined'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import { allCtiSourceVault, ctiSourceVault } from '../../redux/nodes/SourceAndCollections/action'

interface Message {
  message: string
  question: boolean
}
interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: '#f1f1f1',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f1f1f1',
    color: '#1D2939',
    fontWieght: 40,
    fontSize: 12,
  },
}))

const WorkBench = () => {
  const { width } = useWindowResolution()
  const divRef: RefObject<HTMLDivElement> = useRef(null)
  const dispatch = useDispatch()
  const [isInputStatusOpen, setIsInputStatusOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isHoveredtwo, setIsHoveredTwo] = useState(false)
  const [isHoveredThree, setIsHoveredThree] = useState(false)
  const [newCards, setNewCards] = useState(false)
  const [chatCarts, setChatCarts] = useState([] as any)
  const [selectedOption, setSelectedOption] = useState('intel_db' as any)
  const [showSidebar, setShowSidebar] = useState(false)
  const [focusShowSidebar, setFocusShowSidebar] = useState(false)
  const [Focus, setFocus] = useState('')
  const [ctiReportList, setCtiReportList] = useState([] as any)
  const [CTISelectedFileName, setCTISelectedFileName] = useState('' as any)
  const [messagesque, setQueMessages] = useState(null as any)
  const [sigmaFiles, setSigmaFiles] = useState(' ' as any)
  const [socket, setSocket] = useState<WebSocket | null>(null)

  const [previousFocus, setPreviousFocus] = useState('Threat Graph')
  const [currentFocus, setCurrentFocus] = useState('' as any)

  const { ctiFileName, setWrokbenchHome, sigmafilsearch, setSigmafilsearch }: any = useData()

  const navigateTo = useNavigate()

  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  const localAuth = local.getItem('auth')
  const locals = JSON.parse(localAuth as any)
  const userId = locals?.user?.user?.id
  const roleDto = local.getItem('auth')
  const role = JSON.parse(roleDto as any)
  const roleDescription = role?.user?.user
  const getroleName = roleDescription?.roleDTO
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
      height: currentFocus ? '70vh' : '75vh',
      display: 'flex',
      flexDirection: 'column',
      [theme.breakpoints.between(1000, 1050)]: {
        hheight: currentFocus ? '30vh' : '30vh',
      },
      [theme.breakpoints.between(1050, 1100)]: {
        height: currentFocus ? '58vh' : '60vh',
      },
      [theme.breakpoints.between(1100, 1150)]: {
        height: currentFocus ? '70vh' : '74vh',
      },
      [theme.breakpoints.between(1150, 1200)]: {
        height: currentFocus ? '70vh' : '74vh',
      },
      [theme.breakpoints.between(1200, 1300)]: {
        height: currentFocus ? '70vh' : '74vh',
      },
      [theme.breakpoints.between(1300, 1350)]: {
        height: currentFocus ? '70vh' : '74vh',
      },
      [theme.breakpoints.between(1350, 1400)]: {
        height: currentFocus ? '70vh' : '74vh',
      },
      [theme.breakpoints.between(1400, 1450)]: {
        height: currentFocus ? '70vh' : '74vh',
      },
      [theme.breakpoints.between(1450, 1500)]: {
        height: currentFocus ? '70vh' : '74vh',
      },
      [theme.breakpoints.between(1500, 1550)]: {
        height: currentFocus ? '70vh' : '75vh',
      },
    },
    mainContainer: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      width: '100%',
      height: '90vh',
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
    listContainer: {
      height: '95vh',
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
    lastTwoLines: {
      color: 'red',
    },
    formContainer: {
      marginTop: '16px',
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
    textAreaContainer: {
      scrollBehavior: 'smooth',
      '&::-webkit-scrollbar': {
        width: '4px',
        height: '0px',
      },
      '&::-webkit-scrollbar-track': {
        'background-color': '#FFFFFF',
      },
      '&::-webkit-scrollbar-thumb': {
        'background-color': '#D9D5D5',
      },
    },
  }))

  const classes = useStyles({ height: 100 })

  const InputStatusOpen = (value: any) => {
    setPreviousFocus(
      value == 'cti' ? 'CTI Report' : value == 'coach' ? 'Hunt Advisor' : 'Threat Graph',
    )
    setIsInputStatusOpen(!isInputStatusOpen)
    setTooltipMessage(false)
  }

  const statusChange = (option: any) => {
    setCurrentFocus(option)
    setTimeout(() => {
      setCurrentFocus('')
    }, 20000)
    let ctiId: any =
      option == 'CTI Report'
        ? 'cti'
        : option == 'Threat Graph'
        ? 'intel_db'
        : option == 'Hunt Advisor'
        ? 'coach'
        : 'auto'
    setSelectedOption(ctiId)
    setIsInputStatusOpen(false)
    if (ctiId === 'cti') {
      setShowSidebar(true)
    }
    setIsHovered(false)
    setIsHoveredTwo(false)
    setIsHoveredThree(false)
  }

  const [workBenchDetails, setWorkbenchDetails] = useState([] as any)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }
  const handleMouseLeave = () => {
    setIsHovered(false)
  }
  const handleMouseEnterTwo = () => {
    setIsHoveredTwo(true)
  }
  const handleMouseEnterThree = () => {
    setIsHoveredThree(true)
  }
  const handleMouseLeaveTwo = () => {
    setIsHoveredTwo(false)
  }
  const handleMouseLeaveThree = () => {
    setIsHoveredThree(false)
  }
  const CTIquestions = (value: any, index: number, focus: any) => {
    setFocus(focus)
    if (focus === 'cti') {
      setSelectedOption(focus)
      setShowSidebar(false)
      setSourcesCount(true)
    }
    setSelectedOption(focus)
    setNewCards(true)
    setWrokbenchHome(true)
    setChatCarts(
      workBenchDetails
        ? workBenchDetails?.categories[index]
        : workbench_details_obj?.categories[index],
    )
  }

  const filteredDescriptions = workBenchDetails?.focus?.filter(
    (descrip: any) => descrip.type === selectedOption,
  )
  const [tooltipMessage, setTooltipMessage] = useState(false)
  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && !event.shiftKey && !readOnly) {
      if (selectedOption === 'cti' && !CTISelectedFileName) {
        event.preventDefault()
        setTooltipMessage(true)
        setShowSidebar(true)
      }

      if (
        (selectedOption === 'cti' && CTISelectedFileName && messagesque?.trim()) ||
        ((selectedOption === 'intel_db' || !selectedOption) && messagesque?.trim()) ||
        (selectedOption === 'coach' && messagesque?.trim())
      ) {
        event.preventDefault()
        sendMessage()
        setTimeout(() => {
          setStates({ value: '', rows: 1, minRows: 1, chatposition: 5 })
        }, 0)
      }
    }
  }

  const handleOnChange = (e: any) => {
    const value = e.target.value
    setValueInput(value)
    setdefaultInput(value)
    setTooltipMessage(false)
  }

  const handlefullView = () => {
    if (focusShowSidebar) if (showSidebar) setShowSidebar(false)
    if (isInputStatusOpen) {
      setIsInputStatusOpen(false)
    }
    if (showSidebar) setShowSidebar(false)
  }

  const [parentValt, setParentValt] = useState(null as any)

  const getHistoryCtiReportName = (vaultId: string, reportId: any, totalVaults: any) => {
    const historyVault = totalVaults?.find((vault: any) => vault?.id == vaultId)
    dispatch(ctiReportFileList(token, historyVault) as any)
      .then((res: any) => {
        if (res.type === 'CTI_REPORT_FILE_SUCCESS') {
          if (res.payload.length > 0) {
            if (res?.payload?.length > 1) {
              res.payload?.map((data: any) => {
                if (data.id == reportId) {
                  setSelectedOption('cti')
                  setSigmaFiles(data)
                  setCTISelectedFileName(data.ctiName)
                  if (sigmafilsearch?.vaultId) {
                    const selectFiles = {
                      vaultId: Number(data?.datavault?.id),
                      reportId: data?.id,
                      mitreLocation: data?.mitreLocation,
                      globalVault: data?.global,
                      sessionName: data.ctiName,
                      urlSHA256: data?.urlSHA256,
                    }
                    sessionStorage.setItem('vaultdata', JSON.stringify(selectFiles))
                  }
                }
              })
            } else {
              setCTISelectedFileName(res?.payload[0]?.ctiName)
            }
          }
        }
      })
      .catch((err: any) => console.log('err', err))
  }

  const getDataVault = () => {
    if (getroleName?.roleName === 'USER' || getroleName?.roleName == 'DATAVAULT_ADMIN') {
      dispatch(dataVaultuserIdList(token, userId) as any)
        .then((res: any) => {})
        .catch((err: any) => console.log('err', err))
    } else if (getroleName?.roleName == 'ACCOUNT_ADMIN' || getroleName?.roleName == 'SUPER_ADMIN') {
      dispatch(dataVaultList(token) as any)
        .then((res: any) => {})
        .catch((err: any) => console.log('err', err))
    }
    dispatch(ctiSourceVault() as any).then((ress: any) => {
      if (ress?.payload?.id) {
        dispatch(allCtiSourceVault() as any).then((res: any) => {
          if (res?.type == 'GET_ALL_CTI_REPORTS_SUCCESS')
            if (res?.payload && res?.payload?.length > 0) {
              const datas: any =
                res?.payload?.length > 0
                  ? res?.payload?.find((x: any) => x.id == ress?.payload?.id)
                  : []

              const updatedReports: any = datas?.ctiReports.filter((report: any) => {
                return (
                  report.status == 'COMPLETE' &&
                  report?.intelCount?.data?.SIGMA > 0 &&
                  report.reportSource == 'WEB'
                )
              })
              const huntoftheDay: any =
                res?.payload?.length > 0
                  ? res?.payload?.find((x: any) => x?.s3Folder == 'HUNT_OF_THE_DAY')
                  : []
              const overAllCti: any = [...updatedReports, ...huntoftheDay?.ctiReports]
              setCtiReportList(overAllCti)
            }
        })
      }
    })
  }
  const CTISelectedFile = (valts: any) => {
    if (valts.ctiName !== 'No Data Found') {
      if (valts.ctiName) {
        setShowSidebar(false)
      }
      const selectFiles = {
        vaultId: Number(valts?.datavault?.id),
        reportId: valts?.id,
        mitreLocation: valts?.mitreLocation,
        globalVault: valts?.global,
        sessionName: valts.ctiName,
        urlSHA256: valts?.urlSHA256,
      }
      sessionStorage.setItem('vaultdata', JSON.stringify(selectFiles))
      setCTISelectedFileName(valts.ctiName)
      let ctiId: any = 'cti'
      setSelectedOption(ctiId)
      setIsInputStatusOpen(false)
      setTooltipMessage(false)
    }
  }

  useEffect(() => {
    getDataVault()
    valueJson()
  }, [])

  const textRef = useRef<any>()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(focusShowSidebar)
  }, [focusShowSidebar])

  const ctiReport = (value: any, e: any) => {
    e.stopPropagation()
    setShowSidebar(false)
    setFocusShowSidebar(true)
    let focusValue: any =
      value == 'CTI Report'
        ? 'cti'
        : value == 'Threat Graph'
        ? 'intel_db'
        : value == 'Hunt Advisor'
        ? 'coach'
        : value == 'Threat Brief'
        ? 'threat_brief'
        : 'auto'
    setSelectedOption(focusValue)
  }
  // *************************************************************Chat message section******************************
  const { id } = useParams()
  const location = useLocation()
  const state: any = location.state
  const localStorageauth = local.getItem('auth')
  const localss = JSON.parse(localStorageauth as any)

  const userIdchat: any = localss?.user?.user?.id
  const [ctiChat, setctiChat] = useState([] as any)
  const { dataVaultlist } = useSelector((state: any) => state.dataVaultreducer)

  const navigate = useNavigate()

  React.useEffect(() => {
    if (id) {
      if (isNaN(Number(id))) {
        navigate('/app/landingpage')
        sessionStorage.setItem('active', 'overview')
      }
    }
  }, [id, navigate])

  useEffect(() => {
    textRef.current.focus()
    if (!id) {
      socket?.close()
      setInputMessage([])
      setMessages([])
      setctiChat([])
      setNewCards(false)
    }

    setNewCards(false)
    if (state?.vaultId && state?.id) {
      setSelectedOption('cti')
      getHistoryCtiReportName(state?.vaultId, state?.id, dataVaultlist)
    }
    if (sigmafilsearch?.vaultId) {
      setSelectedOption('cti')
      dispatch(ChatHistoryjSONDetails() as any)
        .then((res: any) => {
          let ctiReports: any = []
          if (res?.payload?.length > 0) {
            res?.payload.map((item: any) => {
              ctiReports = [...ctiReports, ...item?.ctiReports]
            })
            const sortedData: any = ctiReports.sort(
              (a: any, b: any) =>
                new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime(),
            )
            const ctiUrls = sortedData.filter((x: any) => {
              return x?.datavault?.id == Number(sigmafilsearch?.vaultId)
            })
            const historyVault = ctiUrls.find(
              (vault: any) => vault?.ctiName == sigmafilsearch?.sigmadetail?.ctiName,
            )
            getHistoryCtiReportName(sigmafilsearch?.vaultId, historyVault?.id, [
              historyVault?.datavault,
            ])
          }
        })
        .catch((error: any) => {
          console.log(error)
        })
    }
  }, [state, id, sigmafilsearch])

  const [isSend, setisSend] = useState(false)
  const [closesocketbutton, setcloseSocketButton] = useState<any>(false as any)
  const [defaultInput, setdefaultInput] = useState(null as any)
  const [reconnect, setReconnect] = useState<any>(false as any)
  const [readOnly, setReadOnly] = useState(false)
  const [selectedFileHistory, setSelectedHistory] = useState(null as any)
  const [insightCardNavigate, setInsightCardNavigate] = useState(null as any)
  const [valueInput, setValueInput] = useState('' as any)
  const [cancelChat, setCancelChat] = useState(false)
  const [inputMessage, setInputMessage] = useState<Message[]>([])
  const [question, setQuestion] = useState<Message[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [messagesValues, setMessagesValues] = useState('' as any)
  const [dummy, setDummy] = useState([] as any)
  const [chatHistory, setchatHistory] = useState([] as any)

  useLayoutEffect(() => {
    if (messages.length > 0 && dataVaultlist) {
      getHistoryCtiReportName(
        messages.slice(-1)[0].vault_id,
        messages.slice(-1)[0].report_id,
        dataVaultlist,
      )
    }
  }, [dataVaultlist, messages])
  let retryCnt = 0

  const onMessage = (event: any, messageMap: any) => {
    //we are receiving messages means socket is working
    if (retryCnt != 0) {
      retryCnt = 0
    }
    const value = JSON.parse(event.data)
    if (messageMap.has(value.message_id)) {
      const existingMessage: any = messageMap.get(value.message_id)
      existingMessage.message += value.message ? value.message : ''
      existingMessage.done = value.done ? value.done : false
      existingMessage.focus = value.focus ? value.focus : ''
      existingMessage.sources = value.sources ? value.sources : []
      existingMessage.sourcesvalue = value.sources ? value.sources : []
      existingMessage.timestamp = value?.created ? value?.created : null
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

    const chatgetId: any = sessionStorage.getItem('chatid')

    if (value.done) {
      setReadOnly(false)
      const mergedMessages: any = Array.from(messageMap.values())
      const extractedData = mergedMessages?.map((item: any) => item.sources).flat()
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
      setchatHistory(mergedMessages)
      setMessages((pre: any) => [...pre, ...mergedMessages])
      messageMap.clear()
      setStatus('Fetching Associations...')
      setStep(0)
      setctiChat([])
      setisSend(false)
      setdefaultInput(null)
      fetchHistoryAllData()
    }
  }

  const wssConnectionMethod = (chatId: any, selectedFiles: any) => {
    const localStorage1 = local.getItem('bearerToken')
    const token = JSON.parse(localStorage1 as any)
    const barearTockens = token?.bearerToken.split(' ')
    let ws: any = null
    let messageMap: any = null
    ws = new WebSocket(
      `${environment?.baseWssUrl}/intel-chat/${chatId}/${selectedFiles?.ctiName}?Authorization=${barearTockens[1]}`,
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

    ws.addEventListener('open', () => {
      setcloseSocketButton(false)
      setReconnect(false)
      setReadOnly(false)
      console.log('WebSocket connected')
    })
    ws.addEventListener('message', (event: any) => onMessage(event, messageMap))

    ws.addEventListener('close', function (event: any) {
      setisSend(false)
      console.log('WebSocket closed')
    })

    return () => {
      if (ws?.readyState === WebSocket.OPEN || ws?.readyState === WebSocket.CONNECTING) {
        setisSend(false)
        console.log('WebSocket is CONNECTING')
        // ws?.close();
        return ws
      } else {
        return 'WebSocket connection was failed.'
      }
    }
  }

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

  useEffect(() => {
    if (id) {
      setNewCards(false)
      fetchHistoryAllData()
    }
    fetchHistoryData()
    if (location.pathname === '/app/workbench') {
      setCTISelectedFileName('')
    }
  }, [id])

  const fetchHistoryAllData = () => {
    let noOfprompts: any = 100
    let selectOption: any
    setchatHistory([])
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
          selectOption = mergedMessages[i]
        }
        setSelectedHistory(mergedMessages.length > 0 ? mergedMessages[0] : null)
        setMessages(mergedMessages)
        setSelectedOption(selectOption?.focus)
        setSocket(null)
      }
    })
  }

  useEffect(() => {
    getDataVault()
    if (location.pathname === '/app/workbench') {
      setCTISelectedFileName('')
    }
  }, [])

  const fetchHistoryData = () => {
    if (userIdchat && id) {
      dispatch(ChatHistoryFindOne(userIdchat, id) as any).then((reponse: any) => {
        setInsightCardNavigate(reponse?.payload)
      })
    }
  }

  const handleClickRecnect = () => {}
  let ctiValue: any = null

  const CTIElementQuestions = (query: any, index: any) => {
    if (Focus === 'cti' && !CTISelectedFileName) {
      setShowSidebar(true)
      return
    }
    ctiValue = chatCarts?.questions[index]
    sendMessage()
    setValueInput(ctiValue)
  }

  const connectWebSocket = (id: any, files: any) => {
    return new Promise((resolve: any, reject: any) => {
      const connection = wssConnectionMethod(id, files)
      if (connection) {
        let ws = connection()
        ws.addEventListener('open', function (event: any) {
          console.log('WebSocket is open now. addEventListener')
          resolve(ws)
        })
      } else {
        reject('Sorry Connection Failed')
      }
    })
  }

  const sendMessage = () => {
    setchatHistory([])
    const vaultdata: any = sessionStorage.getItem('vaultdata')
    const datavalut = JSON.parse(vaultdata)
    const chatObj = {
      sessionName: ctiValue ? ctiValue : valueInput,
    }
    const getname: any = sessionStorage.getItem('sessionName')
    const getnamejson = JSON.parse(getname)
    if (!getnamejson) {
      sessionStorage.setItem('sessionName', JSON.stringify(chatObj))
    }

    const selectFiles = {
      vaultId: datavalut?.vaultId ? datavalut?.vaultId : 0,
      id: datavalut?.reportId ? datavalut?.reportId : 0,
      ruleId: 0,
      mitreLocation: datavalut?.mitreLocation ? datavalut?.mitreLocation : null,
      global: datavalut?.globalVault ? datavalut?.globalVault : false,
      sessionItem: true,
    }

    if (!id) {
      setSigmafilsearch(null)
      dispatch(createChat(selectFiles, chatObj) as any).then((newChatResponse: any) => {
        if (newChatResponse.type === 'CREATE_CHAT_SUCCESS') {
          sessionStorage.setItem('chatid', newChatResponse?.payload?.id)
          navigateTo(`/app/workbench/${newChatResponse.payload.id}`)
          connectWebSocket(newChatResponse.payload.id, selectFiles).then((wsResponse: any) => {
            if (wsResponse) {
              sendPrompt(datavalut, wsResponse)
            }
          })
        }
      })
    } else {
      setSigmafilsearch(null)
      sessionStorage.setItem('chatid', id)
      if (!socket?.readyState) {
        connectWebSocket(id, state ? state : selectFiles)
          .then((wsResponse: any) => {
            if (wsResponse) {
              sendPrompt(datavalut, wsResponse)
            }
          })
          .catch((err: any) => {
            console.log('connectWebSocket err======>', err)
          })
      } else {
        sendPrompt(datavalut, socket)
      }
    }
    setStates({ ...states, value: '', rows: 1, minRows: 1, chatposition: 5 })
  }

  const disable =
    selectedOption === 'cti'
      ? !CTISelectedFileName || CTISelectedFileName === 'No Data Found' || !messagesque?.trim()
      : !messagesque?.trim()
  const chatPutMethod = async () => {
    const vaultdata: any = sessionStorage.getItem('vaultdata')
    const datavalut = JSON.parse(vaultdata)
    dispatch(sessionChatUpdate(datavalut, id) as any)
      .then((res: any) => {
        if (res.type == 'CREATE_CHAT_PUT_SUCCESS') {
          setParentValt(null)
        }
      })
      .catch((err: any) => {})
  }

  // *****************************************************************
  const sendPrompt = (datavalut: any, webSocket: any) => {
    if (!insightCardNavigate) {
      fetchHistoryData()
    }
    if (valueInput.trim() || ctiValue.trim() || cancelChat) {
      if (parentValt) {
        chatPutMethod()
      }
      if (valueInput || defaultInput || ctiValue || cancelChat) {
        setReadOnly(true)
        setStates({ ...states, value: '' })
        sessionStorage.setItem(
          'ChatMessage',
          JSON.stringify({ message: ctiValue ? ctiValue : valueInput }),
        )

        let object: any = {
          message_id: uuidv4(),
          message: ctiValue ? ctiValue : valueInput,
          cti_id: datavalut?.urlSHA256
            ? datavalut?.urlSHA256
            : state?.urlSHA256
            ? state?.urlSHA256
            : selectedFileHistory?.cti_id,
          focus: selectedOption ? selectedOption : 'intel_db',
          vault_id: datavalut?.vaultId
            ? datavalut?.vaultId
            : sigmaFiles?.vault_id
            ? Number(sigmaFiles?.vault_id)
            : Number(state?.vaultId),
          report_id: datavalut?.reportId
            ? datavalut?.reportId
            : sigmaFiles?.report_id
            ? Number(sigmaFiles?.report_id)
            : Number(state?.id),
        }
        setMessagesValues(object)
        let cancelObject: any = {
          cancel: true,
        }
        if (webSocket && webSocket.readyState === WebSocket.OPEN) {
          if (cancelChat) {
            webSocket.send(JSON.stringify(cancelObject))
            setCancelChat(false)
          } else {
            setisSend(true)
            let objcts = [...messages, { message: object.message, question: true }]
            setInputMessage(objcts)
            setMessages((prevMessages: any) => [
              ...prevMessages,
              { message: object.message, question: true },
            ])
            webSocket.send(JSON.stringify(object))
            setQuestion([...question, { message: valueInput, question: true }])
          }
        }
      }
    }
  }
  // *****************************************************************

  useEffect(() => {
    if (cancelChat) sendMessage()
  }, [cancelChat])
  const [sourcesCount, setSourcesCount] = useState(false)

  const stopWebSocket = () => {
    if (
      socket &&
      (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)
    ) {
      setCancelChat(true)
      setisSend(false)
    }
  }

  function capitalizeFirstLetter(name: string): string {
    if (!name) return ''
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
  }

  const handleSigmaDownload = async (sigma: any, sigmaName: any, index: any) => {
    if (sigma?.report_id) {
      const ruledata: any = ctiReportList?.find((x: any) => x.id == Number(sigma?.report_id))
      navigateTo(`/app/repoinsightspages/${ruledata?.id}`, {
        state: {
          title: capitalizeFirstLetter(ruledata?.ctiName.replace(/-/g, ' ')),
          tab: 2,
          singleparams: ruledata,
        },
      })
      sessionStorage.setItem('insightdata', JSON.stringify(ruledata))
      sessionStorage.setItem('active', 'sources')
    } else {
      const ruledata: any = ctiReportList?.find(
        (x: any) => x.id == Number(messagesValues?.report_id),
      )
      navigateTo(`/app/repoinsightspages/${ruledata?.id}`, {
        state: {
          title: capitalizeFirstLetter(ruledata?.ctiName.replace(/-/g, ' ')),
          tab: 2,
          singleparams: ruledata,
        },
      })
      sessionStorage.setItem('insightdata', JSON.stringify(ruledata))
      sessionStorage.setItem('active', 'sources')
    }
  }

  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let element = document.getElementById('scrollContainer')
    if (element) {
      element.scrollTop = element.scrollHeight
    }
  }, [messages])
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
  async function fetchData() {
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/Shopify/shopify-app-node/master/package.json',
      )
      const parsed = await response.json()
    } catch (error) {
      console.error('Error fetching data:', error)
      return null
    }
  }
  const workbench_details = local.getItem('workbench_details')
  const workbench_details_obj = JSON.parse(workbench_details as any)
  async function valueJson() {
    const workbench_details = local.getItem('workbench_details')
    const workbench_details_obj = JSON.parse(workbench_details as any)
    setWorkbenchDetails(workbench_details_obj)
    getDataVault()
  }
  useEffect(() => {
    valueJson()
    fetchData()
    if (location.pathname == '/app/workbench') {
      setSelectedOption('intel_db')
      setCTISelectedFileName('')
      setCtiReportList([])
    }

    setIsInputStatusOpen(false)
    if (ctiFileName) {
      setSelectedOption('cti')
      setCTISelectedFileName(ctiFileName?.ctiName)
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
      setMessages([])
      let cancelObject: any = {
        cancel: true,
      }
      socket.send(JSON.stringify(cancelObject))
    }
  }, [id, location.pathname])

  useEffect(() => {
    const chatgetId: any = sessionStorage.getItem('chatid')
    if (id && id != chatgetId && chatHistory.length > 0) {
      fetchHistoryAllData()
    }
  }, [chatHistory])

  const [showTooltip, setShowTooltip] = useState(false)
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setShowTooltip(true)
    setTimeout(() => setShowTooltip(false), 2000)
  }

  const handleMove = (text: string, responce: any) => {}

  const MemoizedMarkdown = React.memo(({ content }: { content: string }) => {
    const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text)
      setShowTooltip(true)
      setTimeout(() => setShowTooltip(false), 2000)
    }

    return (
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className='markdown-heading'>{children}</h1>,
          h2: ({ children }) => <h2 className='markdown-heading'>{children}</h2>,
          h3: ({ children }) => <h3 className='markdown-heading'>{children}</h3>,
          a: ({ node, ...props }) => (
            <a {...props} target='_blank' rel='noopener noreferrer'>
              {props.children}
            </a>
          ),
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '')
            const codeContent = String(children).replace(/\n$/, '')

            return !inline && match ? (
              <div className='relative markdown-code-block'>
                <SyntaxHighlighter
                  style={darcula}
                  language={match[1]}
                  PreTag='div'
                  wrapLines={true}
                  wrapLongLines={true}
                  showLineNumbers={true}
                  className={`markdown-code ${className}`}
                  {...props}
                >
                  {codeContent}
                </SyntaxHighlighter>
                {/* Copy button */}
                <button
                  className='absolute top-2 right-2 text-gray-500 hover:text-gray-800 copybutton'
                  onClick={() => handleCopy(codeContent)}
                >
                  <ContentCopyIcon />
                  {showTooltip && (
                    <span className='absolute top-[-30px] right-0 bg-black text-white text-xs rounded py-1 px-2'>
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    )
  })

  const [status, setStatus] = useState('Fetching Associations...') // Initial empty status
  const [step, setStep] = useState(0) // Step to control the status updates

  useEffect(() => {
    if (isSend && ctiChat == 0) {
      const intervalId = setInterval(() => {
        setStep((prevStep) => prevStep + 1)
      }, 3000)

      return () => {
        clearInterval(intervalId)
      }
    }
  }, [isSend])

  useEffect(() => {
    if (step === 1) {
      setStatus('Fetching Associations...')
    } else if (step === 2) {
      setStatus('Retrieving latest data...')
      const timer = setTimeout(() => {
        setStep((prevStep) => prevStep + 1)
      }, 4000)
      return () => clearTimeout(timer)
    } else if (step === 3) {
      setStatus('Generating results...')
      const timer = setTimeout(() => {
        setStep((prevStep) => prevStep + 1)
      }, 3000)
      return () => clearTimeout(timer)
    } else if (step >= 4) {
      setStatus('Generating results...')
    }
  }, [step])

  return (
    <div>
      <div className={` ${classes.mainContainer}`} onClick={handlefullView}>
        <div ref={divRef} id='scrollContainer' className={` ${classes.scrollContainer}`}>
          <div className={classes.container}>
            <div id='scroll' style={{ height: '90%' }}>
              <div className='text-white grid grid-cols-5 gap-4 mb-[32px]'>
                {/* -----------------firstdiv-------------*/}
                <div></div>
                {/* ----------------second-div------------*/}
                <div className='col-span-3 p-[20px] w-full flex flex-col justify-between'>
                  {((!id && !newCards) || (messages?.length == 0 && !newCards)) && (
                    <div>
                      <div className='border border-1 border-dashed border-[#344054] border-spacing-[10px] rounded-lg p-[16px]'>
                        <div className='text-white font-inter text-sm font-semibold leading-[1.42857]"'>
                          <p>Your personal Threat Hunting workbench</p>
                        </div>
                        <div className='text-gray-500 font-inter text-sm font-normal leading-[1.42857] mt-1'>
                          <p>
                            Examples to get you started with analyzing and reasoning with Threat
                            Intel
                          </p>
                        </div>
                        {/* --------------grid 1st row---------------- */}
                        <div className='grid grid-cols-3 gap-[16px] mt-[16px]'>
                          {(workBenchDetails
                            ? workBenchDetails?.categories
                            : workbench_details_obj?.categories
                          )?.map((question: any, index: any) => {
                            const focusName =
                              question.focus == 'cti'
                                ? 'CTI Report'
                                : question.focus == 'coach'
                                ? 'Hunt Advisor'
                                : 'Threat Graph'
                            return (
                              <div
                                key={index}
                                className='bg-[#1D2939] rounded-lg px-[14px] py-[10px] cursor-pointer'
                                onClick={() => CTIquestions(question.name, index, question.focus)}
                              >
                                <div className='flex'>
                                  <div>
                                    <img
                                      src={question.graphic}
                                      alt={question.name}
                                      width='20'
                                      height='20'
                                    />
                                  </div>
                                  <div className='pl-[10px] pt-[.5px]'>
                                    <p className='text-[#FCFCFD] font-inter text-sm font-medium leading-[18px]'>
                                      {focusName}
                                    </p>
                                  </div>
                                </div>
                                <div className='pt-[10px]'>
                                  <p className='text-gray-25 font-inter text-xs font-medium leading-[1.5]'>
                                    {question.name}
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {((!id && newCards) || (messages?.length == 0 && newCards)) && (
                    <>
                      <div className='grid grid-cols-4 gap-4 text-white'>
                        <div></div>

                        <div className='col-span-2 flex justify-center'>
                          <div className='p-[18px]'>
                            <div
                              className={` 'translate-x-[10rem] border  border-dashed border-[#667085] rounded-lg gap-[16px] p-[16px] w-[720px]  ' : ' border border-dashed rounded-lg p-[16px] w-[720px] '}`}
                            >
                              <div>
                                <p className='text-white font-semibold font-inter text-sm leading-5'>
                                  {chatCarts?.name}
                                </p>
                              </div>
                              <div className='mt-1'>
                                <p className='text-gray-500 text-sm font-normal leading-[142.857%]'>
                                  Select a path to get started
                                </p>
                              </div>
                              {chatCarts?.questions?.map((item: any, index: any) => {
                                return (
                                  <>
                                    <div
                                      className={`mt-[16px] w-full flex p-2.5 items-center rounded-lg gap-2 bg-[#1D2939] cursor-pointer`}
                                      onClick={() => {
                                        CTIElementQuestions(item, index)
                                      }}
                                    >
                                      <div>
                                        <svg
                                          xmlns='http://www.w3.org/2000/svg'
                                          width='20'
                                          height='21'
                                          viewBox='0 0 20 21'
                                          fill='none'
                                        >
                                          <path
                                            d='M8 6.00224C8.1762 5.50136 8.52397 5.07901 8.98173 4.80998C9.43949 4.54095 9.9777 4.4426 10.501 4.53237C11.0243 4.62213 11.499 4.89421 11.8409 5.30041C12.1829 5.70661 12.37 6.22072 12.3692 6.75168C12.3692 8.25056 10.1209 9 10.1209 9M10.1499 12H10.1599M5 16V18.3355C5 18.8684 5 19.1348 5.10923 19.2716C5.20422 19.3906 5.34827 19.4599 5.50054 19.4597C5.67563 19.4595 5.88367 19.2931 6.29976 18.9602L8.68521 17.0518C9.17252 16.662 9.41617 16.4671 9.68749 16.3285C9.9282 16.2055 10.1844 16.1156 10.4492 16.0613C10.7477 16 11.0597 16 11.6837 16H14.2C15.8802 16 16.7202 16 17.362 15.673C17.9265 15.3854 18.3854 14.9265 18.673 14.362C19 13.7202 19 12.8802 19 11.2V5.8C19 4.11984 19 3.27976 18.673 2.63803C18.3854 2.07354 17.9265 1.6146 17.362 1.32698C16.7202 1 15.8802 1 14.2 1H5.8C4.11984 1 3.27976 1 2.63803 1.32698C2.07354 1.6146 1.6146 2.07354 1.32698 2.63803C1 3.27976 1 4.11984 1 5.8V12C1 12.93 1 13.395 1.10222 13.7765C1.37962 14.8117 2.18827 15.6204 3.22354 15.8978C3.60504 16 4.07003 16 5 16Z'
                                            stroke='white'
                                            stroke-width='1.5'
                                            stroke-linecap='round'
                                            stroke-linejoin='round'
                                          />
                                        </svg>
                                      </div>
                                      <div>{item}</div>
                                    </div>
                                  </>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                        <div></div>
                      </div>
                    </>
                  )}

                  <div>
                    <div>
                      <div className='flex-1 '>
                        {!isSend ? (
                          <>
                            {messages.length > 0 &&
                              messages?.map((responce: any, index) => {
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
                                              <div>
                                                {dummy?.map((chat: any, key: any) => {
                                                  const status =
                                                    responce.focus == 'cti'
                                                      ? 'CTI Report'
                                                      : responce.focus == 'intel_db'
                                                      ? 'Threat Graph'
                                                      : responce.focus == 'intel'
                                                      ? 'Threat Intel'
                                                      : responce.focus == 'coach'
                                                      ? 'Hunt Advisor'
                                                      : responce.focus == 'rule_agent'
                                                      ? 'Hunt Advisor'
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
                                                              ? svgIcons[status]('')
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
                                          className={` inline-block text-justify rounded-lg px-3 py-2  w-full ${
                                            responce.question
                                              ? 'bg-[#054D80] text-white break-all'
                                              : 'bg-[#1d2939] text-white markdown-content '
                                          }`}
                                        >
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

                                                    <div className='absolute top-2 right-2 flex space-x-2'>
                                                      {/* Copy button */}
                                                      {match && match[1] === 'yaml' && (
                                                        <button
                                                          className='text-[#fff] hover:text-[#fff]'
                                                          onClick={() =>
                                                            handleMove(codeContent, responce)
                                                          }
                                                        >
                                                          <BootstrapTooltip title={'Move to Inbox'}>
                                                            <MoveDownOutlinedIcon />
                                                          </BootstrapTooltip>
                                                        </button>
                                                      )}

                                                      <button
                                                        className='text-[#fff] hover:text-[#fff]'
                                                        onClick={() => handleCopy(codeContent)}
                                                        onMouseLeave={() => setShowTooltip(false)} // Hide tooltip on mouse leave
                                                      >
                                                        <ContentCopyIcon />
                                                      </button>

                                                      {/* Tooltip */}
                                                      {showTooltip && (
                                                        <span className='absolute top-[30px] right-0 bg-[#fff] text-black text-xs rounded py-1 px-2'>
                                                          Copied!
                                                        </span>
                                                      )}

                                                      {/* Share button */}
                                                    </div>
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
                                        </span>
                                        {responce?.timestamp && (
                                          <span
                                            style={{
                                              display: 'flex',
                                              justifyContent: 'flex-end',
                                              fontSize: 12,
                                            }}
                                          >
                                            {' '}
                                            {moment(responce?.timestamp).format('MM-DD-YYYY HH:mm')}
                                          </span>
                                        )}
                                      </div>
                                      {!responce.question && responce.sourcescount && (
                                        <>
                                          <div>
                                            {Object.entries(responce.sourcescount)?.map(
                                              ([category, count]: any) => (
                                                <div key={category}>
                                                  <div className='text-white flex justify-between rounded-lg border-solid border-2 border-[#344054] p-[10px] mb-2'>
                                                    <div>
                                                      <p className=' text-white sm:text-sm lg:text-xl xl:text-base font-light'>
                                                        {count}{' '}
                                                        <span>{category.toUpperCase()}</span>{' '}
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
                            {/* ---------------running message-------------- */}
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
                                            <div>
                                              {dummy?.map((chat: any, key: any) => {
                                                const status =
                                                  responce.focus == 'cti'
                                                    ? 'CTI Report'
                                                    : responce.focus == 'intel_db'
                                                    ? 'Threat Graph'
                                                    : responce.focus == 'intel'
                                                    ? 'Threat Intel'
                                                    : responce.focus == 'coach'
                                                    ? 'Hunt Advisor'
                                                    : responce.focus == 'rule_agent'
                                                    ? 'Hunt Advisor'
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
                                                            ? svgIcons[status]('')
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
                                        className={` inline-block text-justify rounded-lg px-3 py-2 w-full ${
                                          responce.question
                                            ? 'bg-[#054D80] text-white break-all'
                                            : 'bg-[#1d2939] text-white w-full markdown-content'
                                        }`}
                                      >
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
                                      </span>
                                    </div>
                                    {!responce.question && responce.sourcescount && (
                                      <>
                                        <div>
                                          {Object.entries(responce.sourcescount)?.map(
                                            ([category, count]: any) => (
                                              <div key={category}>
                                                <div className='text-white flex justify-between rounded-lg border-solid border-2 border-[#344054] p-[10px] mb-2'>
                                                  <div>
                                                    <p className=' text-white sm:text-sm lg:text-xl xl:text-base font-light'>
                                                      {count} <span>{category.toUpperCase()}</span>{' '}
                                                    </p>
                                                  </div>
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
                                    <div>
                                      {dummy?.map((chat: any, key: any) => {
                                        const status =
                                          selectedOption == 'cti'
                                            ? 'CTI Report'
                                            : selectedOption == 'auto'
                                            ? 'All'
                                            : selectedOption == 'coach'
                                            ? 'Hunt Advisor'
                                            : selectedOption == 'rule_agent'
                                            ? 'Hunt Advisor'
                                            : 'Threat Graph'
                                        return (
                                          <>
                                            <div className='relative inline-block text-right '>
                                              <button
                                                type='button'
                                                className={`inline-flex justify-center px-2 py-[1px]  bg-white text-sm font-small text-gray-700 flex ml-2 relative  bg-white w-[130px] cursor-auto rounded-xl px-2 py-[1px]  justify-between items-center `}
                                              >
                                                {status}
                                                <div className='ml-1 '>{svgIcons[status]('')}</div>
                                              </button>
                                            </div>
                                          </>
                                        )
                                      })}
                                    </div>
                                  </div>
                                </div>
                                {/* typing response------------------------- */}
                                <span
                                  className={` inline-block rounded-lg px-3 py-2 w-full ${'bg-[#1d2939] text-white w-full markdown-content'}`}
                                >
                                  {ctiChat?.map((chatValue: any, key: any) => {
                                    if (divRef.current) {
                                      divRef.current.scrollTop =
                                        divRef.current.scrollHeight - divRef.current.clientHeight
                                    }
                                    return (
                                      <>
                                        <div key={key} className='markdown-content'>
                                          <MemoizedMarkdown
                                            content={
                                              !chatValue?.error && chatValue?.message
                                                ? chatValue?.message
                                                : chatValue?.error
                                                ? chatValue?.error
                                                : "We're facing technical difficulties. Retry later, please."
                                            }
                                          />
                                          <span className='mt-2'>
                                            <div
                                              className={`inline-block h-4 w-4 bg-white rounded-full mb-[-0.2rem] ml-2`}
                                            ></div>
                                          </span>
                                        </div>
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
                                  {selectedOption == 'intel_db' && (
                                    <span
                                      style={{
                                        fontSize: 12,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginLeft: 40,
                                      }}
                                    >
                                      {status}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* <div ref={bottomRef} /> */}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ----------------Third-div------------*/}
                <div></div>
              </div>
              <>
                {selectedOption === 'cti' && (
                  <>
                    <div
                      className={`bg-[#101828] fixed right-0 top-[80px] h-screen w-[500px] transition-all duration-300 ease-in z-50
                                           ${showSidebar ? 'translate-x-0' : 'translate-x-full'}
                                            `}
                    >
                      <div className='relative'>
                        <div
                          onClick={(e) => {
                            e.stopPropagation()

                            setShowSidebar(!showSidebar)
                          }}
                          className='absolute top-[16rem] left-[-32px] cursor-pointer bg-[#054D80] flex items-center rounded-l-lg w-[32px] h-[72px] text-4xl'
                        >
                          <button type='button' className='flex justify-center'>
                            {showSidebar != false ? (
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
                            ) : (
                              <svg
                                className='ml-1 rotate-180'
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
                            )}
                          </button>
                        </div>
                        <div
                          id='list'
                          className={`p-[24px] ${classes.listContainer}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <p>Please attach a CTI report to chat with it</p>

                          <div className='mt-[16px]'>
                            <div
                              className={`transition-all ease-in-out duration-500
                                                                        ${'h-full mb-[18px]'}`}
                            >
                              <ul className=''>
                                {ctiReportList?.length > 0 && (
                                  <>
                                    {[...ctiReportList]?.map((file: any, index: number) => {
                                      return (
                                        <li
                                          className={`mt-[8px] truncate text-[#fff] text-sm font-medium ${
                                            !(file.ctiName === 'No Data Found') && 'cursor-pointer'
                                          }
                                                                                              ${
                                                                                                CTISelectedFileName ===
                                                                                                file.ctiName
                                                                                                  ? 'text-orange-500'
                                                                                                  : 'text-[#fff]'
                                                                                              }`}
                                          onClick={() => CTISelectedFile(file)}
                                          key={index}
                                        >
                                          <div className='flex items-center gap-[4px]'>
                                            <span>
                                              <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                width='16'
                                                height='16'
                                                fill='currentColor'
                                                viewBox='0 0 16 16'
                                              >
                                                <path
                                                  stroke={
                                                    CTISelectedFileName === file.ctiName
                                                      ? '#ee7103'
                                                      : 'white'
                                                  }
                                                  // stroke={"#000"}
                                                  d='M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3'
                                                />
                                              </svg>
                                            </span>
                                            <span className='w-[80%] truncate hover:text-orange-500'>
                                              {file.ctiName}
                                            </span>
                                          </div>
                                        </li>
                                      )
                                    })}
                                  </>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
              <>
                {focusShowSidebar && (
                  <div
                    className={`bg-[#101828] md:w-[140px]  p-[24px] fixed right-0 bottom-[0rem] h-[200px] lg:w-[266px] sm:w-[180px]  z-50 transition-transform duration-300 ease-in-out
                                     ${
                                       isVisible
                                         ? `transform translate-x-0 `
                                         : 'transform translate-x-full '
                                     }
                                  `}
                  >
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsVisible(!isVisible)
                        setFocusShowSidebar(false)
                        if (isInputStatusOpen) {
                          setIsInputStatusOpen(true)
                        }
                      }}
                      className={`absolute top-[4rem] ${
                        isVisible ? 'left-[-22px]' : 'hidden'
                      } cursor-pointer bg-[#054D80] flex items-center rounded-l-lg w-[22px] h-[52px] text-4xl`}
                    >
                      <button type='button' className='flex justify-center'>
                        <svg
                          className='pl-2'
                          xmlns='http://www.w3.org/2000/svg'
                          width='15'
                          height='12'
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
                    {filteredDescriptions?.map((descrip: any) => {
                      const status =
                        descrip.type === 'cti'
                          ? 'CTI Report'
                          : descrip.type === 'threat_brief'
                          ? 'Threat Brief'
                          : descrip.type === 'coach'
                          ? 'Hunt Advisor'
                          : descrip.type === 'intel_db'
                          ? 'Threat Graph'
                          : 'all'

                      return (
                        <>
                          <div className=''>
                            <div className='bg-[#1D2939] rounded-lg px-[14px] py-[10px] cursor-pointer'>
                              <div>
                                <div className='flex'>
                                  <div className='text-white'>{svgIcons[status]('white')}</div>
                                  <div className='pl-[10px] pt-[.5px]' key={descrip.type}>
                                    <p className='text-[#FCFCFD] font-inter text-sm font-medium leading-[18px]'>
                                      {status}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='pt-3 p-1'>
                              <p className='text-gray-25 font-inter text-xs font-medium leading-[1.5]'>
                                {descrip.description}
                              </p>
                            </div>
                          </div>
                        </>
                      )
                    })}
                  </div>
                )}
              </>
            </div>
          </div>
        </div>
        {/* ----------------input field----------- */}
        <div>
          <div
            className='grid grid-cols-5 gap-4'
            style={{ position: 'fixed', bottom: '0px', width: '-webkit-fill-available' }}
          >
            <div></div>
            <div className='col-span-3 px-[28px] mr-2'>
              <div className='relative'>
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
                {currentFocus && (
                  <>
                    {currentFocus === previousFocus ? (
                      <div className=' flex justify-center mb-2'>
                        <div className='flex fade-in justify-center'>
                          <p className='ml-1 text-[#fff] font-inter text-base font-normal leading-6'>{`Your focus already in  ${currentFocus}`}</p>
                        </div>
                      </div>
                    ) : (
                      <div className=' flex justify-center mb-2'>
                        <div className='flex fade-in justify-center'>
                          <p className='ml-1 text-[#fff] font-inter text-base font-normal leading-6'>{`Your focus is now set to ${currentFocus}`}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {tooltipMessage && (
                  <div className='flex justify-center mb-2'>
                    <div className='flex justify-center'>
                      <p className='ml-1 text-[#ee7103] font-inter text-base font-normal leading-6'>
                        {'Please attach the CTI report to proceed.'}
                      </p>
                    </div>
                  </div>
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
                            Connection failed...
                          </p>
                        </div>
                      </div>
                      <div className='ml-4 mb-3'>
                        <button
                          className='bg-[#ee7103] flex justify-center mb-2 rounded-lg px-[12px] py-[8px] p-1  w-[135px] h-[36px] items-center'
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
                <textarea
                  ref={textRef}
                  rows={2}
                  maxLength={4096}
                  value={messagesque}
                  placeholder={
                    selectedOption === 'cti' && !CTISelectedFileName
                      ? 'Please attach a CTI report to chat with it'
                      : 'Ask S2S Threat Specialist...'
                  }
                  id='textarea'
                  onKeyDown={(e) => {
                    handleKeyDown(e)
                  }}
                  style={{ width: '100%' }}
                  className={`w-full wrap bg-[#101828] ${classes.textAreaContainer} cursor-text text-white p-4 pl-5 px-4 text-sm rounded-t-xl max-h-56 resize-none focus:outline-none pr-12 placeholder-gray-500`}
                  onChange={handleOnChange}
                />
                <div
                  className='w-full  bg-[#101828] p-3  rounded-b-xl mt-[-8px] focus:outline-none '
                  onClick={() => textRef.current.focus()}
                >
                  <div className={`flex items-center ${width < 1200 ? 'block' : 'hidden'}`}>
                    {selectedOption === 'cti' && (
                      <div className='flex items-center'>
                        {CTISelectedFileName && (
                          <div>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='17'
                              height='20'
                              viewBox='0 0 17 20'
                              fill='none'
                            >
                              <path
                                d='M14.6666 10.4167V5.66669C14.6666 4.26656 14.6666 3.56649 14.3941 3.03171C14.1544 2.56131 13.772 2.17885 13.3016 1.93917C12.7668 1.66669 12.0667 1.66669 10.6666 1.66669H5.33325C3.93312 1.66669 3.23306 1.66669 2.69828 1.93917C2.22787 2.17885 1.84542 2.56131 1.60574 3.03171C1.33325 3.56649 1.33325 4.26656 1.33325 5.66669V14.3334C1.33325 15.7335 1.33325 16.4336 1.60574 16.9683C1.84542 17.4387 2.22787 17.8212 2.69828 18.0609C3.23306 18.3334 3.93312 18.3334 5.33325 18.3334H7.99992M9.66659 9.16669H4.66659M6.33325 12.5H4.66659M11.3333 5.83335H4.66659M10.0833 15.8334L11.7499 17.5L15.4999 13.75'
                                stroke='white'
                                stroke-width='1.5'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                              />
                            </svg>
                          </div>
                        )}

                        <p
                          className={`text-gray-500 font-inter text-sm font-normal leading-6 ${
                            CTISelectedFileName ? `pl-2 text-white text-xs px-3 truncate` : ''
                          }`}
                        >
                          {CTISelectedFileName
                            ? CTISelectedFileName.length > 60
                              ? `${CTISelectedFileName.slice(0, 45)}...`
                              : `${CTISelectedFileName}`
                            : 'No Report attached'}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className=' flex justify-between px-2'>
                    <div className={`flex items-center  ${width >= 1200 ? 'block' : 'hidden'}`}>
                      {selectedOption === 'cti' && (
                        <div className={`flex items-center textareafilename`}>
                          {CTISelectedFileName && (
                            <div>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='17'
                                height='20'
                                viewBox='0 0 17 20'
                                fill='none'
                              >
                                <path
                                  d='M14.6666 10.4167V5.66669C14.6666 4.26656 14.6666 3.56649 14.3941 3.03171C14.1544 2.56131 13.772 2.17885 13.3016 1.93917C12.7668 1.66669 12.0667 1.66669 10.6666 1.66669H5.33325C3.93312 1.66669 3.23306 1.66669 2.69828 1.93917C2.22787 2.17885 1.84542 2.56131 1.60574 3.03171C1.33325 3.56649 1.33325 4.26656 1.33325 5.66669V14.3334C1.33325 15.7335 1.33325 16.4336 1.60574 16.9683C1.84542 17.4387 2.22787 17.8212 2.69828 18.0609C3.23306 18.3334 3.93312 18.3334 5.33325 18.3334H7.99992M9.66659 9.16669H4.66659M6.33325 12.5H4.66659M11.3333 5.83335H4.66659M10.0833 15.8334L11.7499 17.5L15.4999 13.75'
                                  stroke='white'
                                  stroke-width='1.5'
                                  stroke-linecap='round'
                                  stroke-linejoin='round'
                                />
                              </svg>
                            </div>
                          )}

                          <p
                            className={`text-gray-500 font-inter text-sm font-normal leading-6 ${
                              CTISelectedFileName
                                ? `pl-2 text-white text-xs px-3 truncate w-[80%]`
                                : ''
                            }`}
                          >
                            {CTISelectedFileName ? CTISelectedFileName : 'No Report attached'}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className={`flex items-center ${width > 1200 ? 'hidden' : 'block'}`}></div>
                    <div className='flex justify-between items-center'>
                      <div>
                        {selectedOption === 'cti' && !isSend && (
                          <>
                            {CTISelectedFileName && CTISelectedFileName != 'No Data Found' ? (
                              <>
                                <div
                                  className='border-2 w-[157px] py-[9px] rounded-lg mr-2 cursor-pointer'
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setShowSidebar(!showSidebar)
                                    setSourcesCount(true)
                                  }}
                                >
                                  <div className='flex justify-between px-4'>
                                    <div>
                                      <p className='text-white font-inter font-semibold text-sm leading-5'>
                                        Change Report
                                      </p>
                                    </div>
                                    <div className='flex items-center'>
                                      <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='16'
                                        height='20'
                                        viewBox='0 0 16 20'
                                        fill='none'
                                      >
                                        <path
                                          d='M12.1667 4.27115C13.9345 5.55909 15.0834 7.64536 15.0834 9.99998C15.0834 13.912 11.9121 17.0833 8.00008 17.0833H7.58342M3.83341 15.7288C2.06564 14.4409 0.916748 12.3546 0.916748 9.99998C0.916748 6.08796 4.08806 2.91665 8.00008 2.91665H8.41675M8.83342 18.6666L7.16675 17L8.83342 15.3333M7.16675 4.66665L8.83342 2.99998L7.16675 1.33331'
                                          stroke='white'
                                          stroke-width='1.5'
                                          stroke-linecap='round'
                                          stroke-linejoin='round'
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div
                                  className='border-2 w-[157px] py-[9px] rounded-lg mr-2 cursor-pointer'
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setShowSidebar(true)
                                    setSourcesCount(true)
                                  }}
                                >
                                  <div className='flex justify-between px-4'>
                                    <div>
                                      <p className='text-white font-inter font-semibold text-sm leading-5'>
                                        Attach Report
                                      </p>
                                    </div>
                                    <div className='flex items-center'>
                                      <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='14'
                                        height='14'
                                        viewBox='0 0 14 14'
                                        fill='none'
                                      >
                                        <path
                                          d='M7 1.16669V12.8334M1.16667 7.00002H12.8333'
                                          stroke='white'
                                          stroke-width='1.5'
                                          stroke-linecap='round'
                                          stroke-linejoin='round'
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                      {!isSend && (
                        <>
                          <div
                            className={`flex w-[154px] rounded-lg border border-2 border-[#ee7103] `}
                          >
                            <div className=''>
                              <Button
                                disableRipple
                                sx={{
                                  height: '40px ',
                                  width: '151px',
                                  textAlign: 'center',
                                  borderRadius: '8px',
                                  color: '#fff',
                                  backgroundColor: '#182230',
                                  textTransform: 'capitalize',
                                  padding: '2px',
                                }}
                              >
                                <div className=''>
                                  <button
                                    className=' text-gray-700 w-[153px] [h-35px] rounded-lg  shadow-sm focus:outline-none'
                                    onClick={() => InputStatusOpen(selectedOption)}
                                  >
                                    <div className='flex px-4 justify-between items-center '>
                                      {}
                                      <div>
                                        <div className='text-white pl-2'>
                                          {selectedOption == 'cti'
                                            ? 'CTI Report'
                                            : selectedOption == 'coach'
                                            ? 'Hunt Advisor'
                                            : 'Threat Graph'}
                                        </div>
                                      </div>
                                      <div>
                                        {!isInputStatusOpen && (
                                          <div className='mr-1  rotate-180 '>
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
                                          <div className='p-1'>
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
                                    </div>
                                  </button>
                                  {isInputStatusOpen && (
                                    <div className='absolute mt-[-11rem] ml-[-2rem] w-[256px] bg-white rounded-lg shadow-lg'>
                                      <ul className='py-0.5 px-0.5'>
                                        <li>
                                          <button
                                            onClick={() => statusChange('CTI Report')}
                                            onMouseEnter={handleMouseEnter}
                                            onMouseLeave={handleMouseLeave}
                                            className='block w-full px-4 py-2 rounded-tl-lg rounded-tr-lg text-gray-800 hover:bg-[#1D2939] hover:text-white focus:outline-none'
                                          >
                                            <div
                                              className='flex justify-between'
                                              onClick={(e) => {}}
                                            >
                                              <div className='flex'>
                                                <span className='pt-2 py-1'>
                                                  {' '}
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
                                                </span>
                                                <span className='pl-2  py-1 '>CTI Report</span>
                                              </div>
                                              <div
                                                className='pt-2'
                                                onClick={(e) => ctiReport('CTI Report', e)}
                                              >
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
                                                    d='M6.05992 6.00001C6.21665 5.55446 6.52602 5.17875 6.93322 4.93943C7.34042 4.70012 7.81918 4.61264 8.2847 4.69248C8.75022 4.77233 9.17246 5.01436 9.47664 5.3757C9.78081 5.73703 9.94729 6.19436 9.94659 6.66668C9.94659 8.00001 7.94659 8.66668 7.94659 8.66668M7.99992 11.3333H8.00659M14.6666 8.00001C14.6666 11.6819 11.6818 14.6667 7.99992 14.6667C4.31802 14.6667 1.33325 11.6819 1.33325 8.00001C1.33325 4.31811 4.31802 1.33334 7.99992 1.33334C11.6818 1.33334 14.6666 4.31811 14.6666 8.00001Z'
                                                    stroke-width='1.5'
                                                    stroke-linecap='round'
                                                    stroke-linejoin='round'
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
                                            <div
                                              className='flex justify-between'
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                setSourcesCount(false)
                                                statusChange('Threat Graph')
                                              }}
                                            >
                                              <span className='pt-1'>
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
                                              </span>
                                              <span className='pl-2'>Threat Graph</span>
                                              <button
                                                type='button'
                                                style={{
                                                  background: isHoveredtwo ? '#1D2939' : '#EFF8FF',
                                                }}
                                                className='flex gap-2 pl-1 text-gray-900  rounded-full border border-solid border-[#B2DDFF] focus:outline-none  focus:ring-4 focus:ring-gray-100 font-medium  text-sm px-2.5 py-.5 me-2 ml-2'
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
                                              <div
                                                className='pl-1 pt-1'
                                                onClick={(e) => ctiReport('Threat Graph', e)}
                                              >
                                                <svg
                                                  xmlns='http://www.w3.org/2000/svg'
                                                  width='16'
                                                  height='16'
                                                  viewBox='0 0 16 16'
                                                  fill='none'
                                                  style={{
                                                    stroke: isHoveredtwo ? 'white' : 'black',
                                                  }}
                                                >
                                                  <path
                                                    d='M6.05992 6.00001C6.21665 5.55446 6.52602 5.17875 6.93322 4.93943C7.34042 4.70012 7.81918 4.61264 8.2847 4.69248C8.75022 4.77233 9.17246 5.01436 9.47664 5.3757C9.78081 5.73703 9.94729 6.19436 9.94659 6.66668C9.94659 8.00001 7.94659 8.66668 7.94659 8.66668M7.99992 11.3333H8.00659M14.6666 8.00001C14.6666 11.6819 11.6818 14.6667 7.99992 14.6667C4.31802 14.6667 1.33325 11.6819 1.33325 8.00001C1.33325 4.31811 4.31802 1.33334 7.99992 1.33334C11.6818 1.33334 14.6666 4.31811 14.6666 8.00001Z'
                                                    stroke-width='1.5'
                                                    stroke-linecap='round'
                                                    stroke-linejoin='round'
                                                  />
                                                </svg>
                                              </div>
                                            </div>
                                          </button>
                                        </li>
                                        <li>
                                          <button
                                            onClick={() => statusChange('Hunt Advisor')}
                                            onMouseEnter={handleMouseEnterThree}
                                            onMouseLeave={handleMouseLeaveThree}
                                            className='block w-full px-4 py-2 rounded-tl-lg rounded-tr-lg text-gray-800 hover:bg-[#1D2939] hover:text-white focus:outline-none'
                                          >
                                            <div
                                              className='flex justify-between'
                                              onClick={(e) => {}}
                                            >
                                              <div className='flex'>
                                                <span className='pt-2 py-1'>
                                                  <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    width='14'
                                                    height='16'
                                                    viewBox='0 0 14 16'
                                                    fill='none'
                                                    style={{
                                                      stroke: isHoveredThree ? 'white' : '#344054',
                                                    }}
                                                  >
                                                    <path
                                                      d='M7.66663 5L5.66663 7L8.33329 8.33333L6.33329 10.3333M12.3333 8C12.3333 11.2723 8.76399 13.6523 7.46529 14.4099C7.31769 14.496 7.24389 14.5391 7.13975 14.5614C7.05892 14.5787 6.941 14.5787 6.86017 14.5614C6.75602 14.5391 6.68223 14.496 6.53463 14.4099C5.23593 13.6523 1.66663 11.2723 1.66663 8V4.81173C1.66663 4.27872 1.66663 4.01222 1.7538 3.78313C1.83081 3.58076 1.95595 3.40018 2.1184 3.25702C2.30229 3.09495 2.55182 3.00138 3.0509 2.81423L6.62543 1.47378C6.76402 1.4218 6.83332 1.39582 6.90461 1.38552C6.96785 1.37638 7.03207 1.37638 7.0953 1.38552C7.16659 1.39582 7.23589 1.4218 7.37449 1.47378L10.949 2.81423C11.4481 3.00138 11.6976 3.09495 11.8815 3.25702C12.044 3.40018 12.1691 3.58076 12.2461 3.78313C12.3333 4.01222 12.3333 4.27872 12.3333 4.81173V8Z'
                                                      stroke-width='1.5'
                                                      stroke-linecap='round'
                                                      stroke-linejoin='round'
                                                    />
                                                  </svg>
                                                </span>
                                                <span className='pl-3  py-1 '>Hunt Advisor</span>
                                              </div>
                                              <div
                                                className=''
                                                onClick={(e) => ctiReport('Hunt Advisor', e)}
                                              >
                                                <div className='ml-2 pt-1'>
                                                  <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    width='16'
                                                    height='16'
                                                    viewBox='0 0 16 16'
                                                    fill='none'
                                                    style={{
                                                      stroke: isHoveredThree ? 'white' : 'black',
                                                    }}
                                                  >
                                                    <path
                                                      d='M6.05992 6.00001C6.21665 5.55446 6.52602 5.17875 6.93322 4.93943C7.34042 4.70012 7.81918 4.61264 8.2847 4.69248C8.75022 4.77233 9.17246 5.01436 9.47664 5.3757C9.78081 5.73703 9.94729 6.19436 9.94659 6.66668C9.94659 8.00001 7.94659 8.66668 7.94659 8.66668M7.99992 11.3333H8.00659M14.6666 8.00001C14.6666 11.6819 11.6818 14.6667 7.99992 14.6667C4.31802 14.6667 1.33325 11.6819 1.33325 8.00001C1.33325 4.31811 4.31802 1.33334 7.99992 1.33334C11.6818 1.33334 14.6666 4.31811 14.6666 8.00001Z'
                                                      stroke-width='1.5'
                                                      stroke-linecap='round'
                                                      stroke-linejoin='round'
                                                    />
                                                  </svg>
                                                </div>
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
                          </div>

                          <div className='pl-2' onClick={sendMessage}>
                            <button
                              type='submit'
                              disabled={disable}
                              className={`flex justify-center  items-center  rounded-lg w-[40px] h-[40px] ${
                                disable ? 'bg-[#344054] cursor-no-drop' : 'bg-[#ee7103]'
                              }`}
                            >
                              {disable ? (
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  width='16'
                                  height='18'
                                  viewBox='0 0 16 18'
                                  fill='none'
                                >
                                  <path
                                    d='M8.00038 14.8334V9.00002M8.2433 14.9039L14.0587 16.8507C14.5145 17.0033 14.7423 17.0796 14.8829 17.0248C15.0049 16.9773 15.0975 16.8752 15.1328 16.7491C15.1735 16.6038 15.0752 16.3845 14.8787 15.9459L8.63834 2.01866C8.44616 1.58975 8.35007 1.37529 8.2162 1.30884C8.09991 1.2511 7.96334 1.25089 7.84686 1.30824C7.71279 1.37427 7.61601 1.58841 7.42245 2.01671L1.12703 15.9467C0.928951 16.385 0.829912 16.6042 0.870186 16.7496C0.905161 16.8758 0.997472 16.9783 1.11941 17.0261C1.25981 17.0813 1.48806 17.0055 1.94455 16.854L7.82165 14.9034C7.89991 14.8774 7.93904 14.8644 7.97905 14.8593C8.01456 14.8547 8.05051 14.8548 8.08601 14.8594C8.12601 14.8646 8.16511 14.8777 8.2433 14.9039Z'
                                    stroke='#667085'
                                    stroke-width='1.66667'
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  width='16'
                                  height='18'
                                  viewBox='0 0 16 18'
                                  fill='none'
                                >
                                  <path
                                    d='M8.00038 14.8334V9.00002M8.2433 14.9039L14.0587 16.8507C14.5145 17.0033 14.7423 17.0796 14.8829 17.0248C15.0049 16.9773 15.0975 16.8752 15.1328 16.7491C15.1735 16.6038 15.0752 16.3845 14.8787 15.9459L8.63834 2.01866C8.44616 1.58975 8.35007 1.37529 8.2162 1.30884C8.09991 1.2511 7.96334 1.25089 7.84686 1.30824C7.71279 1.37427 7.61601 1.58841 7.42245 2.01671L1.12703 15.9467C0.928951 16.385 0.829912 16.6042 0.870186 16.7496C0.905161 16.8758 0.997472 16.9783 1.11941 17.0261C1.25981 17.0813 1.48806 17.0055 1.94455 16.854L7.82165 14.9034C7.89991 14.8774 7.93904 14.8644 7.97905 14.8593C8.01456 14.8547 8.05051 14.8548 8.08601 14.8594C8.12601 14.8646 8.16511 14.8777 8.2433 14.9039Z'
                                    stroke='white'
                                    stroke-width='1.66667'
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        </>
                      )}

                      {isSend && (
                        <div
                          onClick={stopWebSocket}
                          className='flex justify-center cursor-pointer items-center bg-[#ee7103] w-[40px] ml-[-3px] h-[40px] rounded-lg'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='19'
                            height='19'
                            viewBox='0 0 20 20'
                            fill='none'
                          >
                            <path
                              d='M9.99999 18.3333C14.6024 18.3333 18.3333 14.6023 18.3333 9.99996C18.3333 5.39759 14.6024 1.66663 9.99999 1.66663C5.39762 1.66663 1.66666 5.39759 1.66666 9.99996C1.66666 14.6023 5.39762 18.3333 9.99999 18.3333Z'
                              stroke={`${disable ? 'orange' : 'red'}`}
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
                </div>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default WorkBench
const svgIcons: any = {
  'CTI Report': (color: string) => (
    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'>
      <path
        d='M8.00001 1.33337C9.66753 3.15894 10.6152 5.52806 10.6667 8.00004C10.6152 10.472 9.66753 12.8411 8.00001 14.6667M8.00001 1.33337C6.33249 3.15894 5.38484 5.52806 5.33334 8.00004C5.38484 10.472 6.33249 12.8411 8.00001 14.6667M8.00001 1.33337C4.31811 1.33337 1.33334 4.31814 1.33334 8.00004C1.33334 11.6819 4.31811 14.6667 8.00001 14.6667M8.00001 1.33337C11.6819 1.33337 14.6667 4.31814 14.6667 8.00004C14.6667 11.6819 11.6819 14.6667 8.00001 14.6667M1.66669 6.00004H14.3334M1.66668 10H14.3333'
        stroke={color ? color : 'black'}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  'Threat Graph': (color: string) => (
    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'>
      <path
        d='M10.0741 4.3457V5.37028L6.66295 6.85022L10.0741 8.39847V9.69627L5.72839 11.6543V10.5842L9.30306 9.10429L5.72839 7.57881V6.34932L10.0741 4.3457Z'
        fill={color ? color : '#344054'}
      />
      <path
        d='M14.7667 11.0333H14.767L14.7664 11.0256C14.732 10.5788 14.4678 10.1315 14.0333 9.90441V5.9622C14.4686 5.73458 14.7333 5.28343 14.7333 4.79998C14.7333 4.07808 14.1552 3.49998 13.4333 3.49998C13.2039 3.49998 12.9391 3.55986 12.7248 3.71357L9.29978 1.77487C9.28656 1.06472 8.71352 0.499976 8.00001 0.499976C7.28618 0.499976 6.71295 1.06523 6.70023 1.77582L3.27081 3.78171C3.03771 3.62957 2.80056 3.56703 2.53583 3.56664C1.81029 3.53177 1.23334 4.11326 1.23334 4.83331C1.23334 5.35347 1.53326 5.80533 2.00001 6.03094V9.92716C1.52953 10.0959 1.23334 10.5494 1.23334 11.0333C1.23334 11.7552 1.81145 12.3333 2.53334 12.3333C2.76305 12.3333 3.0244 12.2734 3.23547 12.1498L6.73462 14.1586C6.76493 14.8529 7.3311 15.4 8.03334 15.4C8.73568 15.4 9.3019 14.8528 9.33208 14.1583L12.7978 12.1502C13.0025 12.2724 13.2348 12.3333 13.4667 12.3333C14.1886 12.3333 14.7667 11.7552 14.7667 11.0333ZM13.1333 6.03786V9.80528C13.0078 9.83794 12.8843 9.8964 12.7692 9.95363L11.9152 9.47923L11.8926 9.46664H11.8697C11.8686 9.46642 11.8664 9.46594 11.8628 9.46496C11.8545 9.4627 11.8448 9.45949 11.8316 9.45511C11.8198 9.45115 11.8045 9.44604 11.7899 9.44204C11.7766 9.43841 11.7556 9.43331 11.7333 9.43331C11.4836 9.43331 11.2333 9.63944 11.2333 9.93331C11.2333 10.1054 11.3215 10.2345 11.4445 10.3165L11.4444 10.3167L11.4496 10.3197L12.1843 10.7483C12.1579 10.8502 12.1333 10.9528 12.1333 11.1C12.1333 11.2298 12.1535 11.3128 12.176 11.4054C12.1795 11.4199 12.1831 11.4346 12.1867 11.4498L8.95573 13.3051C8.83157 13.167 8.67955 13.0511 8.46668 12.9389V12V11.9917L8.46532 11.9835C8.44597 11.8674 8.3967 11.7552 8.31239 11.6709C8.22652 11.5851 8.10923 11.5333 7.96668 11.5333C7.83029 11.5333 7.71226 11.5728 7.62328 11.6562C7.53534 11.7386 7.48652 11.854 7.46768 11.9858L7.46668 11.9929V12V12.8933C7.26944 12.9611 7.07204 13.078 6.93462 13.2659L3.68252 11.3848C3.70856 11.2854 3.73334 11.1867 3.73334 11.0666C3.73334 11.063 3.73335 11.0594 3.73335 11.0558C3.7334 10.995 3.73344 10.9353 3.72026 10.8761L4.45301 10.4181L4.46267 10.4121L4.47072 10.404L4.4974 10.3773C4.61594 10.2951 4.70001 10.1681 4.70001 9.99998C4.70001 9.75021 4.49388 9.49998 4.20001 9.49998C4.10925 9.49998 4.02387 9.5428 3.96335 9.57316C3.96061 9.57453 3.95792 9.57588 3.95529 9.5772L3.95509 9.57679L3.94701 9.58184L3.20379 10.0464C3.0942 9.97153 2.98001 9.91517 2.83334 9.86215V6.03366C2.95686 5.98142 3.06594 5.92563 3.17335 5.85166L3.94167 6.28192C3.97831 6.31211 4.0216 6.32301 4.05024 6.32778C4.08349 6.33332 4.11537 6.33331 4.13192 6.33331H4.13334C4.38311 6.33331 4.63334 6.12718 4.63334 5.83331C4.63334 5.76145 4.60953 5.69541 4.58112 5.63859C4.55332 5.58298 4.51707 5.52862 4.48492 5.4804L4.48321 5.47784L4.47151 5.46028L4.4537 5.44894L3.78565 5.02382C3.79037 5.0016 3.79335 4.97988 3.79535 4.95993C3.80001 4.91327 3.80001 4.86747 3.80001 4.83478V4.83331L3.80001 4.82764C3.80002 4.75353 3.80003 4.66919 3.78263 4.58176L7.04622 2.694C7.18135 2.83231 7.36937 2.94328 7.53334 3.02801V3.96664C7.53334 4.21641 7.73947 4.46664 8.03334 4.46664C8.32191 4.46664 8.53334 4.2552 8.53334 3.96664V3.03631C8.70214 2.96804 8.86733 2.85561 8.99432 2.69784L12.2201 4.55027C12.2 4.65899 12.2 4.74312 12.2 4.79956V4.79998V4.91122L11.447 5.38184L11.447 5.38181L11.4445 5.38344C11.3215 5.46547 11.2333 5.59452 11.2333 5.76664C11.2333 6.01641 11.4395 6.26664 11.7333 6.26664L11.7372 6.26664C11.7674 6.26665 11.7998 6.26666 11.8331 6.26112C11.8703 6.25492 11.9049 6.24267 11.9447 6.22275L11.9449 6.22306L11.952 6.21873L12.6554 5.79056C12.789 5.89834 12.9716 5.97978 13.1333 6.03786Z'
        fill={color ? color : '#344054'}
        stroke={color ? color : '#344054'}
        strokeWidth='0.2'
      />
    </svg>
  ),
  'Threat Intel': (color: string) => (
    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'>
      <path
        d='M10.0741 4.3457V5.37028L6.66295 6.85022L10.0741 8.39847V9.69627L5.72839 11.6543V10.5842L9.30306 9.10429L5.72839 7.57881V6.34932L10.0741 4.3457Z'
        fill='#344054'
      />
      <path
        d='M14.7667 11.0333H14.767L14.7664 11.0256C14.732 10.5788 14.4678 10.1315 14.0333 9.90441V5.9622C14.4686 5.73458 14.7333 5.28343 14.7333 4.79998C14.7333 4.07808 14.1552 3.49998 13.4333 3.49998C13.2039 3.49998 12.9391 3.55986 12.7248 3.71357L9.29978 1.77487C9.28656 1.06472 8.71352 0.499976 8.00001 0.499976C7.28618 0.499976 6.71295 1.06523 6.70023 1.77582L3.27081 3.78171C3.03771 3.62957 2.80056 3.56703 2.53583 3.56664C1.81029 3.53177 1.23334 4.11326 1.23334 4.83331C1.23334 5.35347 1.53326 5.80533 2.00001 6.03094V9.92716C1.52953 10.0959 1.23334 10.5494 1.23334 11.0333C1.23334 11.7552 1.81145 12.3333 2.53334 12.3333C2.76305 12.3333 3.0244 12.2734 3.23547 12.1498L6.73462 14.1586C6.76493 14.8529 7.3311 15.4 8.03334 15.4C8.73568 15.4 9.3019 14.8528 9.33208 14.1583L12.7978 12.1502C13.0025 12.2724 13.2348 12.3333 13.4667 12.3333C14.1886 12.3333 14.7667 11.7552 14.7667 11.0333ZM13.1333 6.03786V9.80528C13.0078 9.83794 12.8843 9.8964 12.7692 9.95363L11.9152 9.47923L11.8926 9.46664H11.8697C11.8686 9.46642 11.8664 9.46594 11.8628 9.46496C11.8545 9.4627 11.8448 9.45949 11.8316 9.45511C11.8198 9.45115 11.8045 9.44604 11.7899 9.44204C11.7766 9.43841 11.7556 9.43331 11.7333 9.43331C11.4836 9.43331 11.2333 9.63944 11.2333 9.93331C11.2333 10.1054 11.3215 10.2345 11.4445 10.3165L11.4444 10.3167L11.4496 10.3197L12.1843 10.7483C12.1579 10.8502 12.1333 10.9528 12.1333 11.1C12.1333 11.2298 12.1535 11.3128 12.176 11.4054C12.1795 11.4199 12.1831 11.4346 12.1867 11.4498L8.95573 13.3051C8.83157 13.167 8.67955 13.0511 8.46668 12.9389V12V11.9917L8.46532 11.9835C8.44597 11.8674 8.3967 11.7552 8.31239 11.6709C8.22652 11.5851 8.10923 11.5333 7.96668 11.5333C7.83029 11.5333 7.71226 11.5728 7.62328 11.6562C7.53534 11.7386 7.48652 11.854 7.46768 11.9858L7.46668 11.9929V12V12.8933C7.26944 12.9611 7.07204 13.078 6.93462 13.2659L3.68252 11.3848C3.70856 11.2854 3.73334 11.1867 3.73334 11.0666C3.73334 11.063 3.73335 11.0594 3.73335 11.0558C3.7334 10.995 3.73344 10.9353 3.72026 10.8761L4.45301 10.4181L4.46267 10.4121L4.47072 10.404L4.4974 10.3773C4.61594 10.2951 4.70001 10.1681 4.70001 9.99998C4.70001 9.75021 4.49388 9.49998 4.20001 9.49998C4.10925 9.49998 4.02387 9.5428 3.96335 9.57316C3.96061 9.57453 3.95792 9.57588 3.95529 9.5772L3.95509 9.57679L3.94701 9.58184L3.20379 10.0464C3.0942 9.97153 2.98001 9.91517 2.83334 9.86215V6.03366C2.95686 5.98142 3.06594 5.92563 3.17335 5.85166L3.94167 6.28192C3.97831 6.31211 4.0216 6.32301 4.05024 6.32778C4.08349 6.33332 4.11537 6.33331 4.13192 6.33331H4.13334C4.38311 6.33331 4.63334 6.12718 4.63334 5.83331C4.63334 5.76145 4.60953 5.69541 4.58112 5.63859C4.55332 5.58298 4.51707 5.52862 4.48492 5.4804L4.48321 5.47784L4.47151 5.46028L4.4537 5.44894L3.78565 5.02382C3.79037 5.0016 3.79335 4.97988 3.79535 4.95993C3.80001 4.91327 3.80001 4.86747 3.80001 4.83478V4.83331L3.80001 4.82764C3.80002 4.75353 3.80003 4.66919 3.78263 4.58176L7.04622 2.694C7.18135 2.83231 7.36937 2.94328 7.53334 3.02801V3.96664C7.53334 4.21641 7.73947 4.46664 8.03334 4.46664C8.32191 4.46664 8.53334 4.2552 8.53334 3.96664V3.03631C8.70214 2.96804 8.86733 2.85561 8.99432 2.69784L12.2201 4.55027C12.2 4.65899 12.2 4.74312 12.2 4.79956V4.79998V4.91122L11.447 5.38184L11.447 5.38181L11.4445 5.38344C11.3215 5.46547 11.2333 5.59452 11.2333 5.76664C11.2333 6.01641 11.4395 6.26664 11.7333 6.26664L11.7372 6.26664C11.7674 6.26665 11.7998 6.26666 11.8331 6.26112C11.8703 6.25492 11.9049 6.24267 11.9447 6.22275L11.9449 6.22306L11.952 6.21873L12.6554 5.79056C12.789 5.89834 12.9716 5.97978 13.1333 6.03786Z'
        fill='#344054'
        stroke={color ? color : '#344054'}
        strokeWidth='0.2'
      />
    </svg>
  ),
  All: (
    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'>
      <path
        d='M8.66666 5L6.66666 7L9.33332 8.33333L7.33332 10.3333M13.3333 8C13.3333 11.2723 9.76402 13.6523 8.46532 14.4099C8.31772 14.496 8.24393 14.5391 8.13978 14.5614C8.05895 14.5787 7.94103 14.5787 7.8602 14.5614C7.75605 14.5391 7.68226 14.496 7.53466 14.4099C6.23596 13.6523 2.66666 11.2723 2.66666 8V4.81173C2.66666 4.27872 2.66666 4.01222 2.75383 3.78313C2.83084 3.58076 2.95598 3.40018 3.11843 3.25702C3.30232 3.09495 3.55186 3.00138 4.05093 2.81423L7.62546 1.47378C7.76405 1.4218 7.83335 1.39582 7.90465 1.38552C7.96788 1.37638 8.0321 1.37638 8.09533 1.38552C8.16663 1.39582 8.23592 1.4218 8.37452 1.47378L11.9491 2.81423C12.4481 3.00138 12.6977 3.09495 12.8816 3.25702C13.044 3.40018 13.1691 3.58076 13.2461 3.78313C13.3333 4.01222 13.3333 4.27872 13.3333 4.81173V8Z'
        stroke='#344054'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  'Hunt Advisor': (color: string) => (
    <svg xmlns='http://www.w3.org/2000/svg' width='14' height='16' viewBox='0 0 14 16' fill='none'>
      <path
        d='M7.66663 5L5.66663 7L8.33329 8.33333L6.33329 10.3333M12.3333 8C12.3333 11.2723 8.76399 13.6523 7.46529 14.4099C7.31769 14.496 7.24389 14.5391 7.13975 14.5614C7.05892 14.5787 6.941 14.5787 6.86017 14.5614C6.75602 14.5391 6.68223 14.496 6.53463 14.4099C5.23593 13.6523 1.66663 11.2723 1.66663 8V4.81173C1.66663 4.27872 1.66663 4.01222 1.7538 3.78313C1.83081 3.58076 1.95595 3.40018 2.1184 3.25702C2.30229 3.09495 2.55182 3.00138 3.0509 2.81423L6.62543 1.47378C6.76402 1.4218 6.83332 1.39582 6.90461 1.38552C6.96785 1.37638 7.03207 1.37638 7.0953 1.38552C7.16659 1.39582 7.23589 1.4218 7.37449 1.47378L10.949 2.81423C11.4481 3.00138 11.6976 3.09495 11.8815 3.25702C12.044 3.40018 12.1691 3.58076 12.2461 3.78313C12.3333 4.01222 12.3333 4.27872 12.3333 4.81173V8Z'
        stroke={color ? color : '#344054'}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  error: (
    <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'>
      <path
        d='M6 4V6M6 8H6.005M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z'
        stroke='#B42318'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
}
