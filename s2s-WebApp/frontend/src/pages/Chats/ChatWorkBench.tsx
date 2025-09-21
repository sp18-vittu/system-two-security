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
import { Box, Divider } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useWindowResolution from '../../layouts/Dashboard/useWindowResolution'

import { allCtiSourceVault, ctiSourceVault } from '../../redux/nodes/SourceAndCollections/action'
import CtiReportSidebar from './CtiReportSidebar'
import { Menu } from '@mui/material'
import {
  getallCollection,
  getinboxCollection,
  workbenchyamlFileUpdate,
  yamlFileValidation,
} from '../../redux/nodes/Collections/action'
import CustomToast from '../../layouts/App/CustomToast'
import toast from 'react-hot-toast'
import CopyAndNewCollectionsDialog from '../SourceAndCollection/Collection/CopyAndNewCollectionsDialog'
import { documentGetuuid } from '../../redux/nodes/Imports/action'
import DetectionsDetails from '../SourceAndCollection/Sources/DetectionsDetails'
import DetectionDialog from '../SourceAndCollection/Collection/DetectionDialog'
import FiltersDialog from '../SourceAndCollection/Sources/FiltersDialog'
import CreationDetectionsDetails from '../SourceAndCollection/Sources/CreationDetectionsDetails'
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
const yaml = require('js-yaml')

interface Message {
  message: string
  question: boolean
}
interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

function ChatWorkBench() {
  const { height, width } = useWindowResolution()
  const dynamicHeight = Math.max(100, height * 0.9)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const divRef: RefObject<HTMLDivElement> = useRef(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()
  const [isInputStatusOpen, setIsInputStatusOpen] = useState(false)
  const [newCards, setNewCards] = useState(false)
  const [chatCarts, setChatCarts] = useState([] as any)
  const [selectedOption, setSelectedOption] = useState('rule_agent' as any)
  const [showSidebar, setShowSidebar] = useState(false)
  const focusShowSidebar = false
  const [messagesque, setQueMessages] = useState(null as any)
  const [Focus, setFocus] = useState('')
  const [ctiReportList, setCtiReportList] = useState([] as any)
  const [CTISelectedFileName, setCTISelectedFileName] = useState('' as any)
  const [isModalOpen, setModalOpen] = useState(false);
  const [filterdata, setFilterdata] = useState([] as any)
  const [sigmaFiles, setSigmaFiles] = useState(' ' as any)
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [dLoader, setDLoader] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null)
  const [showPopover, setShowPopover] = useState(false)
  const { ctiFileName, setWrokbenchHome, sigmafilsearch, setSigmafilsearch }: any = useData()
  const [selectedRows, setSelectedRows] = useState([] as any)
  const [createselectedRows, setCreateSelectedRows] = useState([] as any)
  const [exselectedRows, setExSelectedRows] = useState([] as any)
  const [collectiondata, setCollectiondata] = useState([] as any)
  const [isdetectionOpen, setDetectionOpen] = useState(false)
  const [rows, setRows] = useState(1)
  const navigateTo = useNavigate()
  const [creactssId, setSreactssId] = useState(null as any)
  const [wssstatus, setwsstatus] = useState(null as any)
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  const localAuth = local.getItem('auth')
  const locals = JSON.parse(localAuth as any)
  const userId = locals?.user?.user?.id
  const roleDto = local.getItem('auth')
  const role = JSON.parse(roleDto as any)
  const roleDescription = role?.user?.user
  const getroleName = roleDescription?.roleDTO
  const [ruleIndex, setRuleIndex] = useState(0 as any)
  const [isAccordionOpen, setIsAccordionOpen] = useState(false as any);
  const [creatingRule, setIscreatingRule] = useState(false as any);
  const [states, setStates] = useState({
    chatposition: 5,
    value: '',
    rows: 1,
    minRows: 1,
  })

  const theme = useTheme()

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  // Function to handle menu closing
  const handleClose = () => {
    setAnchorEl(null)
  }

  const statusChange = (option: any) => {
    setAnchorEl(null)
    let ctiId: any = option == 'CTI Report' ? 'cti' : option == 'Discover Detection' ? 'sigma_search' : 'rule_agent'
    setSelectedOption(ctiId)
    setIsInputStatusOpen(false)
    if (ctiId === 'cti') {
      setShowSidebar(true)
    } else {
      setCTISelectedFileName('')
      setShowSidebar(false)
    }
  }
  const [workBenchDetails, setWorkbenchDetails] = useState([] as any)

  const CTIquestions = (value: any, index: number, focus: any) => {
    setFocus(focus)
    if (focus === 'cti') {
      setSelectedOption(focus)
      setShowSidebar(false)
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

  const [shift, setShift] = useState(null as any)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !readOnly) {
      event.preventDefault()
      setShift(event)
      if (selectedOption === 'cti' && !CTISelectedFileName) {
        event.preventDefault()
        setShowSidebar(true)
        event.currentTarget.style.height = '36px'
      }

      if (
        (selectedOption === 'cti' && CTISelectedFileName && messagesque?.trim()) ||
        ((selectedOption === 'rule_agent' || !selectedOption) && messagesque?.trim()) ||
        ((selectedOption === 'sigma_search' || !selectedOption) && messagesque?.trim())
      ) {
        event.preventDefault()
        sendMessage()
        setTimeout(() => {
          setStates({ value: '', rows: 1, minRows: 1, chatposition: 5 })
        }, 0)
      }
    }
    if (event.key === 'Backspace' && messagesque.length === 0) {
      setQueMessages('') // Reset to an empty string
    }
  }

  const handleOnChange = (e: any) => {
    const value = e.target.value
    if (value === '') {
      setQueMessages('')
      setRows(1)
    } else {
      setQueMessages(value)
      setValueInput(value)
      setdefaultInput(value)
    }
  }

  useEffect(() => {
    if (shift && isSend) {
      shift.target.style.height = '36px'
    }
  }, [shift, messagesque])

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
                  setSigmaFiles(data)
                  setCTISelectedFileName(data.ctiName)
                  if (sigmafilsearch?.vaultId) {
                    setSelectedOption('cti')
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
        .then((res: any) => { })
        .catch((err: any) => console.log('err', err))
    } else if (getroleName?.roleName == 'ACCOUNT_ADMIN' || getroleName?.roleName == 'SUPER_ADMIN') {
      dispatch(dataVaultList(token) as any)
        .then((res: any) => { })
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
    }
  }

  useEffect(() => {
    getDataVault()
    valueJson()
    fetchDetails()
  }, [])


  const fetchDetails = () => {
    dispatch(getallCollection() as any).then((res: any) => {
      if (res?.payload?.length > 0) {
        let collection = [{ name: '+ New' }, ...res.payload]
        setCollectiondata(collection)
      } else {
        let collection = [{ name: '+ New' }]
        setCollectiondata(collection)
      }
    })
  }

  const textRef = useRef<any>()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(focusShowSidebar)
  }, [focusShowSidebar])

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
    setDetectionsList([])
    setCreateDetectionsList([])
    setIscreatingRule(false)
    if (id) {
      if (isNaN(Number(id))) {
        navigate('/app/landingpage')
        sessionStorage.setItem('active', 'overview')
      }
    }
  }, [id, navigate])

  useEffect(() => {
    textRef?.current?.focus()
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
  const [defaultInput, setdefaultInput] = useState(null as any)
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
  const [inboxList, setInboxList] = useState([] as any)
  const [collectionorcti, setCollectionorcti] = useState(null as any)
  const [isDialogOpen, setDialogOpen] = useState(false as any)
  const [detectionsList, setDetectionsList] = useState([] as any)
  const [createdetectionsList, setCreateDetectionsList] = useState([] as any)
  const [sigmasearchList, setSigmasearchList] = useState(null as any)
  const [ShowRule, setShowRule] = useState(true as any);
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
    if (retryCnt != 0) {
      retryCnt = 0
    }
    const value = JSON.parse(event.data)
    setwsstatus(value?.status)
    if (messageMap.has(value.message_id)) {
      const existingMessage: any = messageMap.get(value.message_id)
      existingMessage.status = value?.status || null
      existingMessage.artifacts = value?.artifacts || []
      existingMessage.message += value.message ? value.message : ''
      existingMessage.done = value.done ? value.done : false
      existingMessage.focus = value.focus ? value.focus : ''
      existingMessage.sources = value.sources ? value.sources : []
      existingMessage.sourcesvalue = value.sources ? value.sources : []
      existingMessage.timestamp = value?.created ? value?.created : null
      existingMessage.sourcescount = null
      if ((value?.artifacts?.length > 0 && value?.status == "found_matches") || (value?.artifacts?.length > 0 && !value?.status)) {
        fetchartifactsAllData(value?.artifacts)
        setDetectionsList(value?.artifacts[0]?.data?.sigma_rules);
      }

      if (value?.artifacts?.length > 0 && value?.status == "created_rule") {
        fetchartifactsCreateData(value?.artifacts)
        setCreateDetectionsList(value?.artifacts[0]?.data?.sigma_rules)
        setIscreatingRule(false)
      } else if (value?.status == "creating_rule" || value?.status == "updating_rule") {
        setIscreatingRule(true)
      }
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
      if ((value?.artifacts?.length > 0 && value?.status == "found_matches") || (value?.artifacts?.length > 0 && !value?.status)) {
        fetchartifactsAllData(value?.artifacts)
        setDetectionsList(value?.artifacts[0]?.data?.sigma_rules);
      }

      if (value?.artifacts?.length > 0 && value?.status == "created_rule") {
        fetchartifactsCreateData(value?.artifacts)
        setCreateDetectionsList(value?.artifacts[0]?.data?.sigma_rules)

      }
      fetchHistoryAllData()
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
      setQueMessages('')

    }
  }

  const fetchartifactsCreateData = async (fetchdata: any) => {
    if (fetchdata && fetchdata[0]?.data?.sigmaRules?.length > 0) {
      const docId: any = fetchdata[0]?.data?.sigmaRules.map((row: any) => {
        return row?.id
      });
      const updatedArray2 = fetchdata[0]?.data?.sigmaRules?.map((item: any, index: any) => {
        const match = fetchdata[0]?.data?.sigmaRules.find((el: any) => el?.id === item?.id);
        if (match) {
          let parsedJSON = yaml.load(fetchdata[0]?.data?.sigmaRules[index]?.content)
          return {
            ...fetchdata[0]?.data?.sigmaRules[index],
            title: parsedJSON?.title,
            upload: "yaml"
          };
        }
      });
      setCreateDetectionsList(updatedArray2)
    } else if (fetchdata && fetchdata[0]?.data?.sigma_rules?.length > 0) {
      const docId: any = fetchdata[0]?.data?.sigma_rules.map((row: any) => {
        return row?.id
      });
      const updatedArray2 = fetchdata[0]?.data?.sigma_rules?.map((item: any, index: any) => {
        const match = fetchdata[0]?.data?.sigma_rules.find((el: any) => el?.id === item?.id);
        if (match) {
          let parsedJSON = yaml.load(fetchdata[0]?.data?.sigma_rules[index]?.content)
          return {
            ...fetchdata[0]?.data?.sigma_rules[index],
            title: parsedJSON?.title,
            upload: "yaml"
          };
        }
      });
      toast.success(
        <CustomToast
          message={'Rule updated successfully'}
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
      setCreateDetectionsList(updatedArray2)
    }
  }


  const fetchartifactsAllData = async (fetchdata: any) => {
    if (fetchdata && fetchdata[0]?.data?.sigmaRules?.length > 0) {
      const docId: any = fetchdata[0]?.data?.sigmaRules.map((row: any) => {
        return row?.id
      });
      await dispatch(documentGetuuid(docId) as any).then((res: any) => {
        if (res.type == "DOCUMENT_UUID_GET_SUCCESS") {
          setDLoader(false)
          const updatedArray2 = res?.payload?.map((item: any, index: any) => {

            const match = fetchdata[0]?.data?.sigmaRules.find((el: any) => el?.id === item?.uuid);
            if (match) {
              return {
                ...item,
                source: match.source,
                s3: match.s3,
                content: match.content,
              };
            } else {
              let parsedJSON = yaml.load(fetchdata[0]?.data?.sigmaRules[index]?.content)
              return {
                ...fetchdata[0]?.data?.sigmaRules[index],
                title: parsedJSON?.title,
                upload: "yaml"
              };
            }



          });
          setDetectionsList(updatedArray2);
        }
      });
    } else if (fetchdata && fetchdata[0]?.data?.sigma_rules?.length > 0) {
      const docId: any = fetchdata[0]?.data?.sigma_rules.map((row: any) => {
        return row?.id
      });
      await dispatch(documentGetuuid(docId) as any).then((res: any) => {
        if (res.type == "DOCUMENT_UUID_GET_SUCCESS") {
          setDLoader(false)
          const updatedArray2 = res?.payload?.map((item: any, index: any) => {

            const match = fetchdata[0]?.data?.sigma_rules.find((el: any) => el?.id === item?.uuid);
            if (match) {
              return {
                ...item,
                source: match.source,
                s3: match.s3,
                content: match.content,
              };
            } else {
              let parsedJSON = yaml.load(fetchdata[0]?.data?.sigma_rules[index]?.content)
              return {
                ...fetchdata[0]?.data?.sigma_rules[index],
                title: parsedJSON?.title,
                upload: "yaml"
              };
            }



          });
          setDetectionsList(updatedArray2);
        }
      });
    }
  }

  const wssConnectionMethod = (chatId: any, selectedFiles: any) => {
    const localStorage1 = local.getItem('bearerToken')
    const token = JSON.parse(localStorage1 as any)
    const barearTockens = token?.bearerToken.split(' ')
    let ws: any = null
    let messageMap: any = null
    ws = new WebSocket(
      `${environment?.baseWssUrl}/intel-chat/${chatId}/${"Demo User"}?Authorization=${barearTockens[1]}`,
    )
    setSocket(ws)
    if (ws === null) {
      console.log(' WebSocket creation failure')
      return
    }
    setDLoader(true)
    setctiChat([])
    setisSend(false)
    setdefaultInput(null)
    messageMap = new Map()

    ws.addEventListener('open', () => {
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
        return ws
      } else {
        return 'WebSocket connection was failed.'
      }
    }
  }

  useEffect(() => {
    if (cancelChat) sendMessage()
  }, [cancelChat])

  const stopWebSocket = () => {
    if (
      socket &&
      (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)
    ) {
      setCancelChat(true)
      setisSend(false)
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

  useEffect(() => {
    if (id) {
      setNewCards(false)
      fetchHistoryAllData()
    }
    fetchHistoryData()
    if (location.pathname === '/app/chatworkbench') {
      setCTISelectedFileName('')
    }
  }, [id])

  useEffect(() => {
    fetchDetails()
  }, [isDialogOpen])

  const fetchHistoryAllData = () => {
    let noOfprompts: any = 100
    let selectOption: any
    setchatHistory([])
    const dataid: any = sessionStorage.getItem('chatid')
    dispatch(ChatHistoryDetails(userIdchat, (id ? id : Number(dataid)), noOfprompts) as any).then((reponse: any) => {
      if (reponse) {
        let mergedMessages: any = reponse?.payload
        let arr: any = []
        let artifactsList: any = [];
        let artifactsquList: any = []
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
          if ((id || dataid) && (!mergedMessages[i]?.question && mergedMessages[i]?.artifacts?.length > 0 || !mergedMessages[i]?.question && mergedMessages[i]?.createdRules?.length > 0 || !mergedMessages[i]?.question && mergedMessages[i]?.foundMatches?.length > 0)) {
            artifactsList.push(mergedMessages[i])
          }
          if ((id || dataid) && mergedMessages[i]?.question) {
            artifactsquList.push(mergedMessages[i])
          }
        }
        const lastIndex = artifactsList.length - 1;
        if (((id || dataid) && artifactsList[lastIndex]?.artifacts?.length > 0) || ((id || dataid) && artifactsList[lastIndex]?.foundMatches?.length > 0)) {
          fetchartifactsAllData(artifactsList[lastIndex].artifacts.length > 0 ? artifactsList[lastIndex].artifacts : artifactsList[lastIndex].foundMatches)
        } else if (((id || dataid) && artifactsList[lastIndex]?.artifacts?.length == 0) || ((id || dataid) && artifactsList[lastIndex]?.foundMatches?.length == 0)) {
          setDetectionsList([])
        }
        if ((id || dataid) && artifactsList[lastIndex]?.createdRules?.length > 0) {
          fetchartifactsCreateData(artifactsList[lastIndex].createdRules)
        } else if ((id || dataid) && artifactsList[lastIndex]?.createdRules?.length == 0) {
          setCreateDetectionsList([])
        }
        const lastQa = artifactsquList.length - 1;
        if ((id || dataid) && artifactsquList[lastQa]) {
          setSigmasearchList(artifactsquList[lastQa]);
        }
        setSelectedHistory(mergedMessages.length > 0 ? mergedMessages[0] : null)
        setMessages(mergedMessages)
        if (selectOption?.focus) {
          setSelectedOption(selectOption?.focus)
        }

        // setSocket(null)
      }
    })
  }

  useEffect(() => {
    getDataVault()
    if (location.pathname === '/app/chatworkbench') {
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

  let ctiValue: any = null

  const CTIElementQuestions = (query: any, index: any) => {
    if (Focus === 'cti' && !CTISelectedFileName) {
      setShowSidebar(true)
      return
    }
    ctiValue = chatCarts?.questions[index]
    sendMessage()
    setQueMessages(ctiValue)
    setValueInput(ctiValue)
    setQueMessages('')
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
    setNewCards(false)
    setWrokbenchHome(false)
    const vaultdata: any = sessionStorage.getItem('vaultdata')
    const datavalut = JSON.parse(vaultdata)
    const sessionName =
      (ctiValue ? ctiValue : valueInput).length > 200
        ? `${(ctiValue ? ctiValue : valueInput).slice(0, 200)}`
        : ctiValue
          ? ctiValue
          : valueInput
    const chatObj = {
      sessionName: sessionName,
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
          navigateTo(`/app/chatworkbench/${newChatResponse.payload.id}`)
          setSreactssId(newChatResponse.payload.id);
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
      .catch((err: any) => { })
  }

  // *****************************************************************
  const sendPrompt = (datavalut: any, webSocket: any) => {
    if (!insightCardNavigate) {
      fetchHistoryData()
    }
    if (valueInput?.trim() || ctiValue?.trim() || cancelChat) {
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
        setRows(1)
        let object: any

        if (selectedOption == "sigma_search") {
          object = {
            message_id: uuidv4(),
            message: ctiValue ? ctiValue : valueInput,
            cti_id: datavalut?.urlSHA256
              ? datavalut?.urlSHA256
              : state?.urlSHA256
                ? state?.urlSHA256
                : selectedFileHistory?.cti_id,
            focus: "sigma_search",
            "artifacts": [{
              "type": "sigma_search",
              "data": {
                sources: sigmasearchList?.promptSources?.length > 0 ? sigmasearchList?.promptSources : [
                  "cti",
                  "dac_repo",
                  "imported",
                  "collection"
                ]
              }
            }],
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
        } else {
          object = {
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
        }

        setMessagesValues(object)
        let cancelObject: any = {
          cancel: true,
        }
        if (webSocket && webSocket.readyState === WebSocket.OPEN) {
          if (cancelChat) {
            webSocket.send(JSON.stringify(cancelObject))
            setCancelChat(false)
            setQueMessages(messagesque)
            setValueInput(messagesque)
            setdefaultInput(messagesque)
            setwsstatus(null)
          } else {
            setwsstatus('Thinking')
            setQueMessages('')
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }

    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, ctiChat, detectionsList?.length > 0, createdetectionsList?.length > 0, wssstatus, id, dLoader]);


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
      // return data;
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
    dispatch(getinboxCollection() as any).then((res: any) => {
      if (res?.type == 'INBOX_COLLECTION_GET_SUCCESS') {
        setInboxList(res.payload)
      }
    })
  }
  useEffect(() => {
    valueJson()
    fetchData()
    if (location.pathname == '/app/chatworkbench') {
      setSelectedOption('rule_agent')
      setCTISelectedFileName('')
      setCtiReportList([])
    }

    setIsInputStatusOpen(false)
    if (ctiFileName) {
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

  const handlecopyToinbox = (codeContent: any, responce: any) => {
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

  const handleResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'inherit'
    if (e.target.value === '') {
      e.target.style.height = '36px'
    } else {
      e.target.style.height = `${Math.min(e.target.scrollHeight, 72)}px`
    }
  }

  const cleanMarkdown = (text: string): string => {
    return text.replace(/null|undefined/g, '').trim();
  };

  const handleNavigate = () => {
    sessionStorage.setItem('createNewChat', JSON.stringify({ createNewChat: true }))
    sessionStorage.removeItem('chatid')
    sessionStorage.removeItem('workartifacts')
    navigateTo(`/app/chatworkbench`, { state: { createChat: true } })
    setDetectionsList([])
    setCreateDetectionsList([])

  }

  const formatText = (text: string): string => {
    return text
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div onClick={handlefullView}>
      {id && (<div className="bg-[#1d2939] p-6 flex flex-row items-center justify-between relative overflow-hidden max-md:gap-4 flex-wrap" >
        <button onClick={handleNavigate} className="flex flex-row gap-3 items-center justify-center max-sm:gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className='max-sm:w-4 max-sm:h-4'>
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#EE7103" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <div className="text-[#ee7103] text-lg font-semibold max-sm:text-base">Back</div>
        </button>


        <div className="flex flex-row gap-4 items-center flex-1 justify-center">

          <div className="flex flex-row gap-2 items-center">
            <div className="text-white text-xl font-medium max-sm:text-lg"> {selectedOption == 'sigma_search' ? "Discover Detection" : selectedOption == 'cti' ? 'Insights from CTI' : 'Create Detection'}</div>
          </div>


          <div
            className={`relative flex-shrink-0 ${selectedOption === "cti"
              ? "w-[136px] h-[31px] p-[6px]"
              : selectedOption === "sigma_search"
                ? "w-[136px] h-[31px] p-[6px]"
                : "w-[130px] h-[31px] p-[4px]"
              } flex items-center justify-center`}
          >
            <svg
              className="absolute w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 137 32"
              fill="none"
            >
              <path
                d="M0.5 12.5C0.5 6.14873 5.64873 1 12 1H125C131.351 1 136.5 6.14873 136.5 12.5V19.5C136.5 25.8513 131.351 31 125 31H12C5.64872 31 0.5 25.8513 0.5 19.5V12.5Z"
                fill="#0F121B"
                stroke="#7690B2"
              />
            </svg>
            <div
              className="absolute text-[#ee7103] text-sm leading-6 text-center"
            >
              {selectedOption === "cti"
                ? "Insights Agent"
                : selectedOption === "sigma_search"
                  ? "Discover Agent"
                  : "Create Agent"}
            </div>
          </div>

        </div>

        {/* Show/Hide Detections */}
        {
          detectionsList?.length > 0 && (
            <div className='flex max-md:basis-full justify-center'>
              <button
                onClick={() => setShowRule(!ShowRule)}
                className='border border-[#ee7103] rounded-lg px-3.5 py-2 shadow-sm lg:hidden max-sm:py-1.5'
              >
                <div className='text-sm font-semibold text-white max-sm:text-[12px]'>
                  {!ShowRule ? 'Show Detections' : 'Show Chat'}
                </div>
              </button>
            </div>
          )
        }
      </div>)}
      {!id && (<div className=' p-6 flex flex-row gap-[635px] items-center justify-start relative overflow-hidden'></div>)}
      <div
        style={{
          height: `${dynamicHeight}px`,
          width: '100%',
          textAlign: 'left',
          overflowY: 'hidden',
          backgroundColor: '#0C111D',
          borderRadius: '8px',
          // marginLeft: '20px',
        }}
      >
        <div className='grid grid-cols-12 items-center gap-4'>
          <div
            className={`transition-all duration-500 ease-in-out bg-white shadow-md ${id && (detectionsList?.length > 0 || createdetectionsList?.length > 0) && ShowRule ? 'col-span-6 translate-x-0 max-lg:hidden' : 'col-span-12 translate-x-0'
              }`}
            style={{
              height: `${dynamicHeight}px`,
              width: '100%',
              textAlign: 'left',
              overflowY: 'hidden',
              backgroundColor: '#0C111D',
              borderRadius: '8px',
              // marginLeft: '20px',
            }}
          >
            <div className='grid grid-rows-[1fr_auto] h-full'>
              <div className='overflow-y-auto p-6'>
                <div className='grid grid-cols-12 items-center justify-center gap-4'>
                  {((detectionsList?.length == 0 && createdetectionsList?.length == 0) || !ShowRule) && <div className='col-span-2 max-lg:col-span-1 flex items-center justify-center'></div>}
                  <div className={`${((detectionsList?.length == 0 && createdetectionsList?.length == 0) || !ShowRule) ? 'col-span-8 max-lg:col-span-10' : 'col-span-12'} relative`}>
                    {!id && (
                      <div className='text-white grid grid-cols-8 gap-4 mb-[32px]'>
                        <div className='col-span-8 p-[20px] w-full flex flex-col justify-between max-md:p-0'>
                          {((!id && !newCards) || (messages?.length == 0 && !newCards)) && (
                            <div>
                              <div className='border border-1 border-dashed border-[#344054] border-spacing-[10px] rounded-lg p-[16px]'>
                                <div className='text-white font-inter text-sm font-semibold leading-[1.42857]"'>
                                  <p>{workbench_details_obj?.metaData?.homepageHeader}</p>
                                </div>
                                <div className='text-gray-500 font-inter text-sm font-normal leading-[1.42857] mt-1'>
                                  <p>{workbench_details_obj?.metaData?.homepageDescription}</p>
                                </div>
                                {/* --------------grid 1st row---------------- */}
                                <div className='grid grid-cols-3 gap-[16px] mt-[16px] max-md:grid-cols-1'>
                                  {(workbench_details_obj
                                    ? workbench_details_obj?.categories
                                    : workbench_details_obj?.categories
                                  )?.map((question: any, index: any) => {
                                    const focusName =
                                      question.focus == 'cti' ? 'CTI Report' : 'Detection Agent'
                                    return (
                                      <div
                                        key={index}
                                        className='bg-[#1D2939] rounded-lg px-[14px] py-[10px] cursor-pointer'
                                        onClick={() =>
                                          CTIquestions(question.name, index, question.focus)
                                        }
                                      >
                                        <div className='flex'>
                                          <div>
                                            <img src={question.graphic} width='20' height='20' />
                                          </div>
                                          <div className='pl-[10px] pt-[.5px]'>
                                            <p className='text-[#FCFCFD] font-inter text-sm font-medium leading-[18px]'>
                                              {question.displayname}
                                            </p>
                                          </div>
                                        </div>
                                        <div className='pt-[10px]'>
                                          <p className='text-gray-25 font-inter text-xs font-medium leading-[1.5]'>
                                            {question.description}
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
                              <div className='grid grid-cols-1 gap-4'>
                                <div className='col-span-12 flex justify-center'>
                                  <div className='p-[18px]'>
                                    <div
                                      className={
                                        'border  border-dashed border-[#667085] rounded-lg gap-[16px] p-[16px] '
                                      }
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
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    {!isSend ? (
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
                                  <div className='bg-[#054D80] text-white p-3 rounded-lg w-full break-words max-md:text-sm'>
                                    <div className="markdown-content">
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
                              </div>
                            )}
                            {/* Message 2 */}
                            {!responce.question && (
                              <div key={index}>
                                <div className='flex justify-between  mb-2 '>
                                  <div className='flex'>
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
                                  <div className='flex justify-between'>
                                    <div>
                                      {dummy?.map((chat: any, key: any) => {
                                        const status =
                                          responce.focus == 'cti' ? 'CTI Report' : responce.focus == 'sigma_search' ? 'Discover Detection' : 'Detection Agent'
                                        return (
                                          <>
                                            <div className='relative inline-block text-right '>
                                              <button
                                                type='button'
                                                className={`inline-flex justify-center px-2 py-[1px]  bg-white text-sm font-small text-gray-700 flex ml-2 relative cursor-auto  bg-white ${responce.focus == 'cti' ? `w-[110px]` : (responce.focus == 'sigma_search' || responce?.status) ? `w-[160px]` : `w-[140px]`
                                                  } rounded-xl px-2 py-[1px]  justify-between items-center ${responce.error ? 'text-[red]' : ''
                                                  }`}
                                              >
                                                {!responce?.error && responce?.message
                                                  ? status
                                                  : responce?.status ? status : 'Error'}
                                                <div className='ml-1 '>
                                                  {!responce?.error && responce?.message
                                                    ? svgIcons[status]('')
                                                    : responce?.status ? svgIcons[status] : errorSvg}
                                                </div>
                                              </button>
                                            </div>
                                          </>
                                        )
                                      })}
                                    </div>
                                  </div>
                                </div>
                                <div className='mb-4 text-left items-center justify-center w-full'>
                                  <div className='bg-[#1d2939] text-white p-3 rounded-lg w-full break-words'>
                                    {responce?.message ||
                                      !responce?.errors ||
                                      responce?.errors?.length == 0 ? (
                                      <div className="markdown-content">
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
                                                  'workbenchymal',
                                                  JSON.stringify(codeContent),
                                                )
                                              }

                                              return !inline && match ? (
                                                <>
                                                  <div className='flex items-center justify-between  w-full h-full max-md:mt-[8px]'>
                                                    {/* Rule Text */}
                                                    <div className='text-white text-sm font-semibold leading-[20px] font-inter'></div>
                                                    {/* Action Buttons */}
                                                    <div className=' flex items-center gap-6 max-xl:flex-col max-xl:gap-2 max-xl:items-start'>
                                                      {/* Copy Button */}
                                                      <div className='flex items-center justify-center gap-1.5 cursor-pointer' onClick={() => copyToClipboard(codeContent)}>
                                                        <span className='text-[#EE7103] text-sm font-semibold leading-[20px] font-inter max-md:text-xs'>
                                                          Copy
                                                        </span>

                                                        <svg

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
                                                              <rect width='20' height='20' fill='white' />
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
                                                      <div className='flex items-center justify-center gap-1.5 cursor-pointer' onClick={() =>
                                                        handlecopyToinbox(codeContent, responce)
                                                      }>
                                                        <span className='text-[#EE7103] text-sm font-semibold leading-[20px] font-inter max-md:text-xs max-md:text-xs'>
                                                          Move to Detection Lab
                                                        </span>
                                                        <svg

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
                                                              <rect width='20' height='20' fill='white' />
                                                            </clipPath>
                                                          </defs>
                                                        </svg>
                                                      </div>
                                                      {/* Move to a Collection Button */}
                                                      <div className='flex items-center justify-center gap-1.5 cursor-pointer' onClick={() =>
                                                        handlecopyToCollection(
                                                          'workbench',
                                                          codeContent,
                                                          responce,
                                                        )
                                                      }>
                                                        <span className='text-[#EE7103] text-sm font-semibold leading-[20px] font-inter max-md:text-xs'>
                                                          Move to a Collection
                                                        </span>
                                                        <svg

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
                                                              <rect width='20' height='20' fill='white' />
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
                                      </div>
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
                                  {!responce.question && responce.sourcescount && (
                                    <>
                                      <div className='mt-[6px]'>
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
                                                      handleSigmaDownload(responce, category, index)
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
                                      <div className='bg-[#054D80] text-white p-3 rounded-lg w-full break-words max-sm:text-sm'>
                                        <div className="markdown-content">
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
                                  </>
                                )}

                                {!responce.question && (
                                  <div key={index}>
                                    <div className='flex justify-between  mb-2 '>
                                      <div className='flex'>
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
                                      <div className='flex justify-between'>
                                        <div>
                                          {dummy?.map((chat: any, key: any) => {
                                            const status =
                                              responce.focus == 'cti' ? 'CTI Report' : responce.focus == 'sigma_search' ? 'Discover Detection' : 'Detection Agent'
                                            return (
                                              <>
                                                <div className='relative inline-block text-right '>
                                                  <button
                                                    type='button'
                                                    className={`inline-flex justify-center px-2 py-[1px]  bg-white text-sm font-small text-gray-700 flex ml-2 relative cursor-auto  bg-white ${responce.focus == 'cti'
                                                      ? `w-[110px]`
                                                      : responce.focus == 'sigma_search' ? `w-[160px]` : `w-[140px]`
                                                      } rounded-xl px-2 py-[1px]  justify-between items-center ${responce.error ? 'text-[red]' : ''
                                                      }`}
                                                  >
                                                    {!responce?.error && responce?.message
                                                      ? status
                                                      : responce?.status ? status : 'Error'}
                                                    <div className='ml-1 '>
                                                      {!responce?.error && responce?.message
                                                        ? svgIcons[status]('')
                                                        : responce?.status ? svgIcons[status] : errorSvg}
                                                    </div>
                                                  </button>
                                                </div>
                                              </>
                                            )
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                    <div className='mb-4 text-left items-center justify-center w-full'>
                                      <div className='bg-[#1d2939] text-white p-3 rounded-lg w-full break-words max-md:text-sm'>
                                        {responce?.message ? (
                                          <div className="markdown-content">
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
                                                    sessionStorage.setItem(
                                                      'workbenchymal',
                                                      JSON.stringify(codeContent),
                                                    )
                                                  }

                                                  return !inline && match ? (
                                                    <>
                                                      <div className='flex items-center justify-between  w-full h-full max-md:mt-[8px]'>
                                                        {/* Rule Text */}
                                                        <div className='text-white text-sm font-semibold leading-[20px] font-inter'></div>

                                                        {/* Action Buttons */}
                                                        <div className=' flex items-center gap-6 max-xl:flex-col max-xl:gap-2 max-xl:items-start'>
                                                          {/* Copy Button */}
                                                          <div className='flex items-center justify-center gap-1.5 cursor-pointer' onClick={() => copyToClipboard(codeContent)}>
                                                            <span className='text-[#EE7103] text-sm font-semibold leading-[20px] font-inter max-md:text-xs'>
                                                              Copy
                                                            </span>
                                                            <svg

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
                                                          <div className='flex items-center justify-center gap-1.5 cursor-pointer' onClick={() =>
                                                            handlecopyToinbox(codeContent, responce)
                                                          }>
                                                            <span className='text-[#EE7103] text-sm font-semibold leading-[20px] font-inter max-md:text-xs'>
                                                              Move to Detection Lab
                                                            </span>
                                                            <svg

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
                                                          <div className='flex items-center justify-center gap-1.5 cursor-pointer' onClick={() =>
                                                            handlecopyToCollection(
                                                              'workbench',
                                                              codeContent,
                                                              responce,
                                                            )
                                                          }>
                                                            <span className='text-[#EE7103] text-sm font-semibold leading-[20px] font-inter max-md:text-xs'>
                                                              Move to a Collection
                                                            </span>
                                                            <svg

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
                                          </div>
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
                              </div>
                            </>
                          )
                        })}
                        {!wssstatus && isSend ? (<>
                          {ctiChat.length > 0 && (
                            <div>
                              {ctiChat.map((responce: any, index: any) => {
                                if (divRef.current) {
                                  divRef.current.scrollTop =
                                    divRef.current.scrollHeight - divRef.current.clientHeight
                                }

                                return (
                                  <>
                                    {/* Message 2 */}
                                    {!responce.question && !responce?.status && (responce?.message || responce?.error) && (
                                      <div key={index}>
                                        <div className='flex justify-between pt-[40px] mb-2 '>
                                          <div className='flex'>
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
                                          <div className='flex justify-between'>
                                            <div>
                                              {dummy?.map((chat: any, key: any) => {
                                                const status = selectedOption == 'cti' ? 'CTI Report' : selectedOption == 'sigma_search' ? 'Discover Detection' : 'Detection Agent'
                                                return (
                                                  <>
                                                    <div className='relative inline-block text-right '>
                                                      <button
                                                        type='button'
                                                        className={`inline-flex justify-center px-2 py-[1px]  bg-white text-sm font-small text-gray-700 flex ml-2 relative cursor-auto  bg-white ${selectedOption == 'cti'
                                                          ? `w-[110px]`
                                                          : (selectedOption == 'sigma_search' || responce?.status) ? `w-[160px]` : `w-[140px]`
                                                          } rounded-xl px-2 py-[1px]  justify-between items-center ${responce.error ? 'text-[red]' : ''
                                                          }`}
                                                      >
                                                        {!responce?.error && responce?.message
                                                          ? status
                                                          : responce?.status ? status : 'Error'}
                                                        <div className='ml-1 '>
                                                          {!responce?.error && responce?.message
                                                            ? svgIcons[status]('')
                                                            : responce?.status ? svgIcons[status] : errorSvg}
                                                        </div>
                                                      </button>
                                                    </div>
                                                  </>
                                                )
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                        <div className='mb-4 text-left items-center justify-center w-full'>
                                          <div className='bg-[#1d2939] text-white p-3 rounded-lg w-full break-words max-md:text-sm'>
                                            {responce?.message ? (
                                              <div className="markdown-content">
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
                                                      if (match && match[1] === 'yaml') {
                                                        sessionStorage.setItem(
                                                          'workbenchymal',
                                                          JSON.stringify(codeContent),
                                                        )
                                                      }

                                                      return !inline && match ? (
                                                        <>
                                                          <div className='flex items-center justify-between  w-full h-full max-md:mt-[8px]'>
                                                            {/* Rule Text */}
                                                            <div className='text-white text-sm font-semibold leading-[20px] font-inter'></div>
                                                            {/* Action Buttons */}
                                                            <div className=' flex items-center gap-6 max-xl:flex-col max-xl:gap-2 max-xl:items-start'>
                                                              {/* Copy Button */}
                                                              <div className='flex items-center justify-center gap-1.5 cursor-pointer' onClick={() =>
                                                                copyToClipboard(codeContent)
                                                              }>
                                                                <span className='text-[#EE7103] text-sm font-semibold leading-[20px] font-inter max-md:text-xs'>
                                                                  Copy
                                                                </span>
                                                                <svg

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
                                                              <div className='flex items-center justify-center gap-1.5 cursor-pointer' onClick={() =>
                                                                handlecopyToinbox(codeContent, responce)
                                                              }>
                                                                <span className='text-[#EE7103] text-sm font-semibold leading-[20px] font-inter max-md:text-xs'>
                                                                  Move to Detection Lab
                                                                </span>
                                                                <svg

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
                                                              <div className='flex items-center justify-center gap-1.5 cursor-pointer' onClick={() =>
                                                                handlecopyToCollection(
                                                                  'workbench',
                                                                  codeContent,
                                                                  responce,
                                                                )
                                                              }>
                                                                <span className='text-[#EE7103] text-sm font-semibold leading-[20px] font-inter max-md:text-xs'>
                                                                  Move to a Collection
                                                                </span>
                                                                <svg
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
                                              </div>
                                            ) : (
                                              <>
                                                {responce?.errors?.length > 0 && (<div className='p-4'>
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
                                                </div>)}

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
                                              </>
                                            )}
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
                                          {formatText(responce?.status)}
                                        </span>

                                      </div>
                                    </div>)}
                                  </>
                                )
                              })}
                              {ctiChat.length == 0 && isSend && (
                                <div>
                                  <div className='flex justify-between pt-[40px] mb-2 '>
                                    <div className='flex'>
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
                                  </div>
                                  <div className='bouncing-loader'>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    {(selectedOption == 'rule_agent' || selectedOption == 'sigma_search') && (
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
                              <div ref={bottomRef}></div>
                            </div>
                          )}
                        </>) : (
                          <>
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
                            <div>
                              <div className='bouncing-loader'>
                                <div></div>
                                <div></div>
                                <div></div>

                                <span
                                  style={{
                                    fontSize: 16,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: 40,
                                  }}
                                >
                                  {formatText(wssstatus ? wssstatus : "Thinking")}
                                </span>

                              </div>
                            </div>
                            <div ref={bottomRef}></div>
                          </>
                        )}
                      </>
                    )}
                    <div ref={bottomRef}></div>
                  </div>
                  {((detectionsList?.length == 0 && createdetectionsList?.length == 0) || !ShowRule) && <div className='col-span-2 max-lg:col-span-1 flex items-center justify-center'></div>}
                </div>
              </div>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                  marginTop: selectedOption == 'cti' ? -16 : -12,
                  marginLeft: selectedOption == 'cti' ? 1 : -2,
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
                    className='p-[2px_6px] flex flex-row items-center justify-start self-stretch flex-shrink-0 relative bg-transparent border-none'
                    onClick={() => statusChange('Create Detections')}
                  >
                    <div className='rounded-[6px] p-[9px_10px] flex flex-row gap-[12px] items-center justify-start flex-1 relative'>
                      <div className='flex flex-row gap-[8px] items-center justify-start flex-1 relative'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='16'
                          height='16'
                          viewBox='0 0 16 16'
                          fill='none'
                        >
                          <path
                            d='M13.3334 6.99998V4.53331C13.3334 3.41321 13.3334 2.85316 13.1154 2.42533C12.9237 2.04901 12.6177 1.74305 12.2414 1.5513C11.8136 1.33331 11.2535 1.33331 10.1334 1.33331H5.86675C4.74664 1.33331 4.18659 1.33331 3.75877 1.5513C3.38244 1.74305 3.07648 2.04901 2.88473 2.42533C2.66675 2.85316 2.66675 3.41321 2.66675 4.53331V11.4666C2.66675 12.5868 2.66675 13.1468 2.88473 13.5746C3.07648 13.951 3.38244 14.2569 3.75877 14.4487C4.18659 14.6666 4.74664 14.6666 5.86675 14.6666H8.00008M9.33341 7.33331H5.33341M6.66675 9.99998H5.33341M10.6667 4.66665H5.33341M12.0001 14V9.99998M10.0001 12H14.0001'
                            stroke='white'
                            stroke-width='1.5'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                        </svg>
                        <div className='text-[#ffffff] text-left font-[Inter-Medium,sans-serif] text-[14px] leading-[20px] font-medium relative flex-1'>
                          Create Detections
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    className='p-[2px_6px] flex flex-row items-center justify-start self-stretch flex-shrink-0 relative bg-transparent border-none'
                    onClick={() => statusChange('Discover Detection')}
                  >
                    <div className='rounded-[6px] p-[9px_10px] flex flex-row gap-[12px] items-center justify-start flex-1 relative'>
                      <div className='flex flex-row gap-[8px] items-center justify-start flex-1 relative'>
                        <svg xmlns="http://www.w3.org/2000/svg" width='16'
                          height='16' viewBox="0 0 20 20" fill="none">
                          <path d="M11.6667 9.16675H6.66668M8.33334 12.5001H6.66668M13.3333 5.83341H6.66668M16.6667 8.75008V5.66675C16.6667 4.26662 16.6667 3.56655 16.3942 3.03177C16.1545 2.56137 15.7721 2.17892 15.3017 1.93923C14.7669 1.66675 14.0668 1.66675 12.6667 1.66675H7.33334C5.93321 1.66675 5.23315 1.66675 4.69837 1.93923C4.22796 2.17892 3.84551 2.56137 3.60583 3.03177C3.33334 3.56655 3.33334 4.26662 3.33334 5.66675V14.3334C3.33334 15.7335 3.33334 16.4336 3.60583 16.9684C3.84551 17.4388 4.22796 17.8212 4.69837 18.0609C5.23315 18.3334 5.93321 18.3334 7.33334 18.3334H9.58334M18.3333 18.3334L17.0833 17.0834M17.9167 15.0001C17.9167 16.6109 16.6108 17.9167 15 17.9167C13.3892 17.9167 12.0833 16.6109 12.0833 15.0001C12.0833 13.3893 13.3892 12.0834 15 12.0834C16.6108 12.0834 17.9167 13.3893 17.9167 15.0001Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <div className='text-[#ffffff] text-left font-[Inter-Medium,sans-serif] text-[14px] leading-[20px] font-medium relative flex-1'>
                          Discover Detection
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    className='p-[2px_6px] flex flex-row items-center justify-start self-stretch flex-shrink-0 relative bg-transparent border-none'
                    onClick={() => statusChange('CTI Report')}
                  >
                    <div className='rounded-[6px] p-[9px_10px] flex flex-row gap-[12px] items-center justify-start flex-1 relative'>
                      <div className='flex flex-row gap-[8px] items-center justify-start flex-1 relative'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='16'
                          height='16'
                          viewBox='0 0 16 16'
                          fill='none'
                        >
                          <g clip-path='url(#clip0_778_1959)'>
                            <path
                              d='M7.99992 1.33331C9.66744 3.15888 10.6151 5.528 10.6666 7.99998C10.6151 10.472 9.66744 12.8411 7.99992 14.6666M7.99992 1.33331C6.3324 3.15888 5.38475 5.528 5.33325 7.99998C5.38475 10.472 6.3324 12.8411 7.99992 14.6666M7.99992 1.33331C4.31802 1.33331 1.33325 4.31808 1.33325 7.99998C1.33325 11.6819 4.31802 14.6666 7.99992 14.6666M7.99992 1.33331C11.6818 1.33331 14.6666 4.31808 14.6666 7.99998C14.6666 11.6819 11.6818 14.6666 7.99992 14.6666M1.6666 5.99998H14.3333M1.66659 9.99998H14.3333'
                              stroke='white'
                              stroke-width='1.5'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            />
                          </g>
                          <defs>
                            <clipPath id='clip0_778_1959'>
                              <rect width='16' height='16' fill='white' />
                            </clipPath>
                          </defs>
                        </svg>
                        <div className='text-[#ffffff] text-left font-[Inter-Medium,sans-serif] text-[14px] leading-[20px] font-medium relative flex-1'>
                          CTI Report
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </Menu>
              <div className='p-4'>
                <div className='grid grid-cols-12 items-center gap-4 justify-center'>
                  {(!ShowRule || (detectionsList?.length == 0 && createdetectionsList?.length == 0)) && <div className='col-span-2 flex items-center justify-center max-lg:col-span-1'></div>}
                  <div className={`${(!ShowRule || (detectionsList?.length == 0 && createdetectionsList?.length == 0)) ? 'col-span-8 max-lg:col-span-10' : 'col-span-12'} relative`}>
                    <div className='box-border bg-[#1d2939] rounded-[10px] border-2 border-[#1d2939] p-[16px_16px_16px_24px] flex flex-col gap-4 items-center justify-center relative overflow-hidden max:md-p-[16px]'>
                      <div className='flex flex-row gap-4 items-center justify-start self-stretch flex-shrink-0 relative max-md:gap-2 max-md:flex-wrap max-md:justify-between'>
                        {!id && (
                          <>
                            <div
                              className='flex flex-row gap-4 items-center justify-start self-stretch flex-shrink-0 relative cursor-pointer max-md:gap-2 max-md:w-full'
                              onClick={handleClick}
                            >
                              <div className='px-[2px] py-0 flex flex-row gap-0 items-center justify-center flex-shrink-0 relative'>
                                <div className='text-[#ee7103] text-left font-semibold text-sm leading-5 relative'>
                                  {selectedOption == 'cti' ? 'CTI Report' : selectedOption == 'sigma_search' ? 'Discover Detection' : 'Create Detections'}
                                </div>
                              </div>

                              <svg
                                className='flex ml-[-10px]'
                                width='21'
                                height='20'
                                viewBox='0 0 21 20'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <g id='chevron-down'>
                                  <path
                                    id='Icon'
                                    d='M5.5 7.5L10.5 12.5L15.5 7.5'
                                    stroke='#EE7103'
                                    stroke-width='1.66667'
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                  />
                                </g>
                              </svg>
                            </div>
                            <Divider
                              orientation='vertical'
                              flexItem
                              sx={{ borderColor: '#3E4B5D', mx: width < 1024 ? 1 : 2 }}
                              className='max-md:hidden'
                            />
                          </>
                        )}
                        <textarea
                          placeholder={
                            selectedOption == 'cti'
                              ? 'Start typing to dive deep into a CTI report'
                              : 'Start typing to create detections with assistive GenAI'
                          }
                          className='text-[#98a2b3] text-left font-medium text-[16px] leading-[24px] bg-transparent border-none outline-none w-full max-h-32 resize-none max-md:!h-[50px] max-md:w-[80%] max-md:flex-grow max-md:mb-2 max-md:text-sm'
                          value={messagesque}
                          onChange={handleOnChange}
                          onInput={handleResize}
                          onKeyDown={handleKeyDown}
                          rows={rows}
                        />

                        {selectedOption == 'cti' && (
                          <button
                            disabled={isSend}
                            className={`rounded-md border border-orange-600 px-3 py-2 flex flex-row gap-1 items-center justify-center flex-shrink-0 relative shadow-[0px_1px_2px_rgba(16,24,40,0.05)] overflow-hidden ${isSend ? 'cursor-not-allowed opacity-50 hover' : ' cursor-pointer'
                              }`}
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowSidebar(!showSidebar)
                            }}
                          >
                            <div className='px-[2px] py-0 flex flex-row gap-0 items-center justify-center flex-shrink-0 relative'>
                              <div className='text-[#ee7103] text-left font-semibold text-sm leading-5 relative'>
                                Attach file
                              </div>
                            </div>

                            <svg
                              width='20'
                              height='20'
                              viewBox='0 0 20 20'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <g id='refresh-cw-04'>
                                <path
                                  id='Icon'
                                  d='M14.1666 4.27121C15.9344 5.55915 17.0833 7.64543 17.0833 10C17.0833 13.9121 13.912 17.0834 9.99996 17.0834H9.58329M5.83329 15.7289C4.06551 14.4409 2.91663 12.3547 2.91663 10C2.91663 6.08802 6.08794 2.91671 9.99996 2.91671H10.4166M10.8333 18.6667L9.16663 17L10.8333 15.3334M9.16663 4.66671L10.8333 3.00004L9.16663 1.33337'
                                  stroke='#EE7103'
                                  stroke-width='1.66667'
                                  stroke-linecap='round'
                                  stroke-linejoin='round'
                                />
                              </g>
                            </svg>
                          </button>
                        )}
                        {!isSend && (
                          <button
                            disabled={!messagesque ? true : false}
                            type='button'
                            onClick={() => sendMessage()}
                            className={`${!messagesque
                              ? 'cursor-not-allowed opacity-50 hover bg-orange-600'
                              : 'bg-orange-600 cursor-pointer'
                              } bg-orange-600 rounded-md p-2 flex flex-row gap-1 items-center justify-center flex-shrink-0 relative shadow-[0px_1px_2px_rgba(16,24,40,0.05)] overflow-hidden`}
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
                        )}
                        {isSend && (
                          <button
                            type='button'
                            onClick={stopWebSocket}
                            className={`${'bg-orange-600 cursor-pointer'} bg-orange-600 rounded-md p-2 flex flex-row gap-1 items-center justify-center flex-shrink-0 relative shadow-[0px_1px_2px_rgba(16,24,40,0.05)] overflow-hidden`}
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
                          </button>
                        )}
                      </div>

                      {selectedOption == 'cti' && (
                        <div className={`${id ? '' : 'pl-[136px]'} max-md:pl-0 flex flex-row gap-2 items-center justify-start self-stretch flex-shrink-0 relative`}>
                          <svg
                            width='20'
                            height='20'
                            viewBox='0 0 20 20'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <g id='file-check-02'>
                              <path
                                id='Icon'
                                d='M16.6666 10.4166V5.66663C16.6666 4.26649 16.6666 3.56643 16.3941 3.03165C16.1544 2.56124 15.772 2.17879 15.3016 1.93911C14.7668 1.66663 14.0667 1.66663 12.6666 1.66663H7.33325C5.93312 1.66663 5.23306 1.66663 4.69828 1.93911C4.22787 2.17879 3.84542 2.56124 3.60574 3.03165C3.33325 3.56643 3.33325 4.26649 3.33325 5.66663V14.3333C3.33325 15.7334 3.33325 16.4335 3.60574 16.9683C3.84542 17.4387 4.22787 17.8211 4.69828 18.0608C5.23306 18.3333 5.93312 18.3333 7.33325 18.3333H9.99992M11.6666 9.16663H6.66659M8.33325 12.5H6.66659M13.3333 5.83329H6.66659M12.0833 15.8333L13.7499 17.5L17.4999 13.75'
                                stroke='white'
                                stroke-width='1.66667'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                              />
                            </g>
                          </svg>

                          <div className='text-white text-left font-[Inter-Medium] text-sm leading-[20px] font-medium relative w-[1256px]'>
                            {CTISelectedFileName ? CTISelectedFileName : 'No Report attached'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {(!ShowRule || (detectionsList?.length == 0 && createdetectionsList?.length == 0)) && <div className='col-span-2 flex items-center justify-center max-lg:col-span-1'></div>}
                </div>
              </div>
            </div>
          </div>


          {id && (detectionsList?.length > 0 || createdetectionsList?.length > 0) && ShowRule && (<div
            className={`transition-all duration-500 ease-in-out   ${id
              ? 'col-span-6  translate-x-0 opacity-100 max-lg:col-span-12'
              : 'col-span-0 translate-x-full opacity-0'
              }`}
            style={{
              height: `${dynamicHeight}px`,
              width: '100%',
              textAlign: 'left',
              overflowY: 'hidden',
              backgroundColor: '#0C111D',
              borderRadius: '8px',
              // marginLeft: '20px',
            }}
          >
            <div className="flex flex-col h-full p-4">
              {/* Scrollable Section */}
              {creatingRule && (<> <Box
                sx={{
                  background: "#1d2939",
                  borderRadius: "10px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  flexShrink: 0,
                  height: "41px",
                  position: "relative",
                }}
              >
                <Skeleton
                  variant="rectangular"
                  height={'100%'}
                  width="100%"
                  sx={{
                    background: `linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.09) 50%,
      rgba(255, 255, 255, 0) 100%
    )`,
                  }}
                />
              </Box>
                <Box
                  sx={{
                    background: "#1d2939",
                    padding: "16px",
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    height: "220px",
                    width: "100%",
                    marginTop: 2
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    height={'100%'}
                    width="100%"
                    sx={{
                      background: `linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.09) 50%,
      rgba(255, 255, 255, 0) 100%
    )`,
                    }}
                  />


                  {/* <Skeleton variant="rectangular" height={24} width="50%" />
                  <Skeleton variant="rectangular" height={16} width="100%" /> */}
                </Box>
              </>
              )}
              {createdetectionsList?.length > 0 && !creatingRule && (<>
                <CreationDetectionsDetails
                  setModalOpen={setModalOpen}
                  setDialogOpen={setDialogOpen}
                  detectionsList={createdetectionsList}
                  setSelectedRows={setSelectedRows}
                  filterdata={filterdata}
                  setFilterdata={setFilterdata}
                  dLoader={dLoader}
                  setDetectionOpen={setDetectionOpen}
                  promptSources={sigmasearchList?.promptSources}
                  setCollectionorcti={setCollectionorcti}
                  workingpage="workbench"
                  setRuleIndex={setRuleIndex}
                  isAccordionOpen={isAccordionOpen}
                  setIsAccordionOpen={setIsAccordionOpen}
                  setCreateSelectedRows={setCreateSelectedRows}
                  setExSelectedRows={setExSelectedRows}
                />

                {/* Fixed Divider */}
                {detectionsList?.length > 0 && createdetectionsList?.length > 0 && (<Divider sx={{ borderColor: "#c2c8d3", my: 2 }} />)}

              </>)}
              {creatingRule && (<Divider sx={{ borderColor: "#c2c8d3", my: 2 }} />)}
              {/* Section that moves with Accordion */}
              {detectionsList?.length > 0 && (<div className="flex-1 overflow-y-auto">
                <DetectionsDetails
                  setModalOpen={setModalOpen}
                  setDialogOpen={setDialogOpen}
                  detectionsList={detectionsList}
                  setSelectedRows={setSelectedRows}
                  filterdata={filterdata}
                  setFilterdata={setFilterdata}
                  dLoader={dLoader}
                  setDetectionOpen={setDetectionOpen}
                  promptSources={sigmasearchList?.promptSources}
                  setCollectionorcti={setCollectionorcti}
                  workingpage="workbench"
                  setRuleIndex={setRuleIndex}
                  setCreateSelectedRows={setCreateSelectedRows}
                  setExSelectedRows={setExSelectedRows}
                />
              </div>)}
            </div>

            {/* <div className='overflow-y-auto p-4 flex flex-row h-full'>
              <DetectionsDetails setModalOpen={setModalOpen} setDialogOpen={setDialogOpen} detectionsList={detectionsList} setSelectedRows={setSelectedRows} filterdata={filterdata} setFilterdata={setFilterdata} dLoader={dLoader} setDetectionOpen={setDetectionOpen} promptSources={sigmasearchList?.promptSources} setCollectionorcti={setCollectionorcti} workingpage={"workbench"} setRuleIndex={setRuleIndex} />
            </div> */}
          </div>)}
        </div>
        {showSidebar && (
          <>
            <CtiReportSidebar
              openCtiside={showSidebar}
              ctiReportList={ctiReportList}
              CTIFileName={CTISelectedFileName}
              CTISelectedFile={CTISelectedFile}
            />
          </>
        )}

        <FiltersDialog isOpen={isModalOpen}
          onClose={() => (setModalOpen(false))} detectionsList={detectionsList} setFilterdata={setFilterdata} filterdata={filterdata} />
        <CopyAndNewCollectionsDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setDialogOpen(false), setCollectionorcti(null)
          }}
          selectedRows={exselectedRows.length > 0 ? exselectedRows : createselectedRows}
          collectiondata={collectiondata}
          pramasdata={collectionorcti ? collectionorcti : "ruleChat"}
          setDialogOpen={setDialogOpen}
          importId={null}
        />
        <DetectionDialog
          isOpen={isdetectionOpen}
          onClose={() => {
            setDetectionOpen(false)
          }}
          detectionsList={detectionsList}
          collectiondata={collectiondata}
          inboxList={inboxList}
          ruleIndex={ruleIndex}
        />
      </div>
    </div>
  )
}

export default ChatWorkBench

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
  'Detection Agent': (color: string) => (
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
  'Discover Detection': (color: string) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16' height='16'
      viewBox='0 0 20 20'
      fill='none'
    >
      <path
        d='M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z'
        stroke='#344054'
        stroke-width='1.66667'
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
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
}
