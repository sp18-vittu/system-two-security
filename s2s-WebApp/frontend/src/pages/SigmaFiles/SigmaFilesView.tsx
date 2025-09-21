import React, { RefObject, useEffect, useRef, useState } from 'react'
import TableWithAccordion from './TableWithAccordion'
import { Accordion, AccordionDetails, Divider, styled } from '@mui/material'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import YamlEditor from '../datavault/YamlEditor'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  ChatHistoryDetails,
  ChatHistoryjSONDetails,
  chatSideList,
} from '../../redux/nodes/chat/action'

import { useDispatch } from 'react-redux'
import moment from 'moment'
import api from '../../redux/nodes/api'
import local from '../../utils/local'
import {
  CREATE_VIEWFILE_VAULT_FAILED,
  CREATE_VIEWFILE_VAULT_SUCCESS,
} from '../../redux/nodes/repository/action'
import YamlTextEditorForQuery from '../datavault/YamlTextEditorForQuery'
import {
  getExecuteQuery,
  SingleTranslateFileList,
  TargetFileList,
} from '../../redux/nodes/py-sigma/action'
import FileCopyIcon from './FileCopyIcon'
import DownloadIcon from './DownloadIcon'
import { environment } from '../../environment/environment'
import Axios from 'axios'
import {
  inspectCtiSectionId,
  inspectFactorySigmaId,
  inspectGeneratedSigmaId,
} from '../../redux/nodes/Inspects/action'
const yaml = require('js-yaml')
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ReactMarkdown from 'react-markdown'
import { sigmaFileList } from '../../redux/nodes/sigma-files/action'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import '../Repositorys/RepositoryLists.css'
import SigmaFilesViewPopup from './SigmaFilesViewPopup'
import { v4 as uuidv4 } from 'uuid'
import { createChat } from '../../redux/nodes/chatPage/action'
import { useData } from '../../layouts/shared/DataProvider'
import useWindowResolution from '../../layouts/Dashboard/useWindowResolution'
import { makeStyles } from '@mui/styles'
import { CollectiondataCopyPost, CollectiondtoCollectionMultipleCopyPost, getallCollection, getinboxCollection, yamlFileUpdate } from '../../redux/nodes/Collections/action'
import toast from 'react-hot-toast'
import CustomToast from '../../layouts/App/CustomToast'
import { Tooltip, TooltipProps, tooltipClasses } from '@mui/material'
import CopyAndNewCollectionsDialog from '../SourceAndCollection/Collection/CopyAndNewCollectionsDialog'

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: '#fff',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#fff',
    color: '#000',
  },
}))

export default function SigmaFilesView() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [singlequery, setSinglequery] = useState(null as any)
  const [queryValue, setQueryValue] = useState(null as any)
  const [ymltext, setYmlText] = useState('Processing...' as any)
  const [authdetails, setAuthdetails] = useState(null as any)
  const [showPopover, setShowPopover] = useState(false)
  const [showPopover2, setShowPopover2] = useState(false)
  const [targetId, setTargetId] = useState(null as any)
  const [selectTargers, setSelectTargers] = React.useState([])
  const [disable, setDisable] = useState(true)
  const [ctiSectionId, setCtiSectionId] = useState([] as any)
  const [contentSection, setContentSection] = useState<any>('')
  const [selectCtiSectionId, setSelectCtiSectionId] = useState<any>(null)
  const [filterState, setFilterState] = React.useState([] as any)
  const [transQuerylist, setTransQuerylist] = useState([] as any)
  const [searchValue, setsearchValue] = useState([] as any)
  const [opendilog, setOpendilog] = useState(false as any)
  const [activeTab, setActiveTab] = useState<any>(1)
  const { authordetails, setAuthordetails, setSigmaViewwss }: any = useData()
  const { height } = useWindowResolution()
  const [ctiChat, setctiChat] = useState([] as any)
  const dynamicHeight = Math.max(400, height * 0.8)
  const divRef: RefObject<HTMLDivElement> = useRef(null)
  const [currentFocus, setCurrentFocus] = useState('' as any)
  const localStorageauth = local.getItem('auth')
  const localss = JSON.parse(localStorageauth as any)
  const userIdchat: any = localss?.user?.user?.id

  const states = {
    chatposition: 5,
    value: '',
    rows: 1,
    minRows: 1,
  }

  const useStyles = makeStyles((theme: any) => ({
    container: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      width: '100%',
      height: currentFocus ? '65vh' : '69vh',
      display: 'flex',
      flexDirection: 'column',
      [theme.breakpoints.between(1000, 1050)]: {
        hheight: currentFocus ? '30vh' : '30vh',
      },
      [theme.breakpoints.between(1050, 1100)]: {
        height: currentFocus ? '58vh' : '60vh',
      },
      [theme.breakpoints.between(1100, 1150)]: {
        height: currentFocus ? '58vh' : '60vh',
      },
      [theme.breakpoints.between(1150, 1200)]: {
        height: currentFocus ? '58vh' : '60vh',
      },
      [theme.breakpoints.between(1200, 1300)]: {
        height: currentFocus ? '57vh' : '64vh',
      },
      [theme.breakpoints.between(1300, 1350)]: {
        height: currentFocus ? '58vh' : '66vh',
      },
      [theme.breakpoints.between(1350, 1400)]: {
        height: currentFocus ? '60vh' : '66vh',
      },
      [theme.breakpoints.between(1400, 1450)]: {
        height: currentFocus ? '58vh' : '66vh',
      },
      [theme.breakpoints.between(1450, 1500)]: {
        height: currentFocus ? '58vh' : '66vh',
      },
      [theme.breakpoints.between(1500, 1550)]: {
        height: currentFocus ? '65vh' : '69vh',
      },
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
  const tabs = [
    { id: 1, label: 'Detection Rule', value: 'Detection Rule', isActive: activeTab === 1 },
    { id: 2, label: 'Translation', value: 'Translation', isActive: activeTab === 2 },
    { id: 3, label: 'Results', value: 'Results', isActive: activeTab === 3 },
    { id: 4, label: 'Inspect', value: 'Inspect', isActive: activeTab === 4 },
  ]

  const location = useLocation()
  const { state } = location
  const { sigmadetail } = state
  const Token = local.getItem('bearerToken')
  const token = JSON.parse(Token as any)
  const [sigmadata, setSigmadata] = useState(sigmadetail as any)
  const [expandedIndex, setExpandedIndex] = useState<number | false>(false)
  const [copyIndex, setCopyIndex] = useState<any>(0)
  const handleChange = (index: number) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? false : index))
  }
  const bottomRef = useRef<HTMLDivElement>(null)

  const AccordionSummary = styled(
    (
      props: {
        expanded: boolean
        onClickIcon: (e: React.MouseEvent) => void
      } & React.ComponentProps<typeof MuiAccordionSummary>,
    ) => (
      <MuiAccordionSummary
        expandIcon={
          props.expanded ? (
            <RemoveIcon
              sx={{ fontSize: '36px', color: '#EE7103', fontWeight: 400, lineHeight: '24px' }}
              onClick={(e) => {
                e.stopPropagation() // Prevent click event from bubbling up to the Accordion
                props.onClickIcon(e) // Handle the icon click
              }}
            />
          ) : (
            <AddIcon
              sx={{ fontSize: '36px', color: '#EE7103', fontWeight: 400, lineHeight: '24px' }}
              onClick={(e) => {
                e.stopPropagation() // Prevent click event from bubbling up to the Accordion
                props.onClickIcon(e) // Handle the icon click
              }}
            />
          )
        }
        {...props}
      />
    ),
  )(() => ({
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(180deg)',
    },
  }))

  const [sessionList, setSessionList] = useState([] as any)

  useEffect(() => {
    dispatch(TargetFileList() as any).then((data: any) => {
      setSelectTargers(data.payload)
    })
    dispatch(ChatHistoryjSONDetails() as any)
      .then((res: any) => {
        let ctiReports: any = []
        if (res?.payload?.length > 0) {
          res?.payload.map((item: any) => {
            ctiReports = [...ctiReports, ...item?.ctiReports]
          })
        }
        const sortedData: any = ctiReports.sort(
          (a: any, b: any) =>
            new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime(),
        )
      })
      .catch((error: any) => {
        console.log(error)
      })
    fetchdetails()
    translateYmlText()
    fetchSessiondetails()
  }, [])
  const fetchSessiondetails = () => {
    dispatch(chatSideList(token, id) as any).then((res: any) => {
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
    let selectOption: any
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

  const extractId = (str: string): string | null => {
    const idMatch = str.match(/id:\s([a-f0-9-]+)/i)
    return idMatch ? idMatch[1] : null
  }

  const handleChangeSectionId = (event: any) => {
    setSelectCtiSectionId(event.target.value)
    dispatch(inspectCtiSectionId(event.target.value) as any)
      .then((res: any) => {
        if (res.type == 'INSPECT_CTI_SECTION_SUCCESS') {
          setContentSection(res?.payload)
        }
      })
      .catch((err: any) => { })
  }

  const fetchdetails = () => {
    dispatch(sigmaFileList(token, Number(state.vaultId)) as any).then((data: any) => {
      if (data.type == 'SIGMA_FILE_SUCCESS') {
        setFilterState(data.payload)
        setsearchValue(data.payload)
      } else {
        setFilterState(filterState)
        setsearchValue(searchValue)
      }
    })
  }
  const translateYmlText = async () => {
    try {
      await api
        .get(`/data/document/${sigmadetail.id}`, {
          responseType: 'blob',
          headers: {
            Authorization: `${token.bearerToken}`,
          },
          params: { global: sigmadetail.global },
        })
        .then((respons: any) => {
          let fileName = sigmadetail.name
          let file = new File([respons.data], fileName)
          const reader = new FileReader()
          reader.onload = (e: any) => {
            const fileText = e.target.result
            const parsedJSON: any = yaml.load(fileText)
            let id = extractId(fileText)
            setAuthdetails(parsedJSON)
            setAuthordetails(parsedJSON)
            setYmlText(fileText)
            if (sigmadetail?.source == 'FACTORY_SIGMAHQ') {
              dispatch(inspectFactorySigmaId(id) as any)
                .then((res: any) => {
                  if (res.type == 'INSPECT_FACTORY_SIGMA_iD_SUCCESS') {
                    if (res?.payload?.length > 0) {
                      setCtiSectionId(res?.payload)
                    }
                  }
                })
                .catch((err: any) => { })
            } else {
              dispatch(inspectGeneratedSigmaId(id) as any)
                .then((res: any) => {
                  if (res.type == 'INSPECT_GENERATED_SIGMA_iD_SUCCESS') {
                    if (res?.payload?.length > 0) {
                      setCtiSectionId(res?.payload)
                    }
                  }
                })
                .catch((err: any) => { })
            }
          }
          reader.readAsText(file)
        })
      dispatch({ type: CREATE_VIEWFILE_VAULT_SUCCESS })
    } catch (error: any) {
      dispatch({ type: CREATE_VIEWFILE_VAULT_FAILED, payload: error.message })
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ymltext)
    setShowPopover(true)
    setTimeout(() => {
      setShowPopover(false)
    }, 2000)
  }

  const copyToClipboardTrans = (index: any) => {
    setCopyIndex(index)
    navigator.clipboard.writeText(transQuerylist[index])
    setShowPopover(true)
    setTimeout(() => {
      setShowPopover(false)
    }, 2000)
  }

  const copyToClipboardContent = () => {
    navigator.clipboard.writeText(contentSection?.content)
    setShowPopover2(true)
    setTimeout(() => {
      setShowPopover2(false)
    }, 2000)
  }

  const handleClickTargersingle = (e: any) => {
    if (e.target.value) {
      setDisable(false)
      setTargetId(e.target.value)
    } else {
      setDisable(true)
      setTargetId(null)
    }
  }

  const singleTranslateDownload = async () => {
    try {
      let obj: any = {
        docIds: [sigmadetail.id],
      }

      const { data } = await Axios.post(
        `${environment.baseUrl}/data/pysigma/download-all-queries`,
        obj,
        {
          responseType: 'blob',
          headers: {
            Authorization: `${token.bearerToken}`,
          },
          params: { global: sigmadetail.global },
        },
      )

      var reader = new FileReader()
      reader.onload = function (e) {
        const blob = new Blob([data], { type: 'application/zip' })
        const fileURL = URL.createObjectURL(blob)

        const downloadLink = document.createElement('a')
        downloadLink.href = fileURL
        downloadLink.download = `s2s-download-superadmin@default.systemtwosecurity.zip`
        downloadLink.click()
        URL.revokeObjectURL(fileURL)
      }
      reader.readAsDataURL(data)
    } catch (err) {
      console.log('err', err)
    }
  }

  const detectionRuleDownload = (text: any) => {
    let parsedJSON = yaml.load(text)
    const data = new Blob([text], { type: 'text/plain' })
    var reader = new FileReader()
    reader.onload = function (e) {
      const blob = new Blob([data], { type: 'text/html' })
      const fileURL = URL.createObjectURL(blob)
      const downloadLink = document.createElement('a')
      downloadLink.href = fileURL
      downloadLink.download = `${parsedJSON?.title}.yml`
      downloadLink.click()
      URL.revokeObjectURL(fileURL)
    }
    reader.readAsDataURL(data)
  }

  const handleSingleTranslatClick = () => {
    const targetdata = sigmadata?.availableTargetQueries?.find(
      (x: any) => x == targetId?.toLowerCase(),
    )
    setSigmadata({
      availableTargetQueries: [targetId],
    })
    if (!targetdata) {
      setActiveTab(2)
      setSinglequery('Translation of your sigma file(s) is in progress...')
      setDisable(true)
      let obj = {
        docId: id,
        target: targetId.toLowerCase(),
      }
      let ruledatas = {
        translatedata: { global: false },
      }
      setTimeout(() => {
        dispatch(SingleTranslateFileList(obj, ruledatas) as any).then((response: any) => {
          if (response.payload.query) {
            setSinglequery(response.payload.query)
            fetchdetails()
            fetchtarget()
            setDisable(false)
            setTargetId(null)
          } else if (response.payload.query == '') {
            setSinglequery('Error: The conversion of your sigma rule to the intended query failed')
          }
        })
      }, 2000)
    } else {
      setOpendilog(true)
    }
  }

  const handleUpdateYamlFile = (text: any) => {
    let parsedJSON = yaml.load(text)
    const blob = new Blob([text], { type: 'text/plain' })
    const file = new File([blob], `${parsedJSON?.title}.yml`, { type: 'text/plain' })
    const data = new FormData()
    data.append('file', file)
    dispatch(yamlFileUpdate(Number(state?.vaultId), id, data) as any).then((res: any) => {
      if (res.type == 'UPDATE_YAML_FILE_SUCCESS') {
        setSigmaViewwss(true)
        toast.success(
          <CustomToast
            message='Detection rule updated successfully'
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
        translateYmlText()
      } else {
        toast.error(
          <CustomToast
            message='Detection rule update failed!'
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
  }

  const handleCancelTraslate = () => {
    setActiveTab(2)
    setOpendilog(false)
    setTargetId('')
  }

  const MemoizedMarkdown = React.memo(({ content }: any) => (
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
          return !inline && match ? (
            <SyntaxHighlighter
              style={darcula}
              language={match[1]}
              PreTag='div'
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
      {content}
    </ReactMarkdown>
  ))
  const [resultsdatalists, setResultsdatalist] = useState([] as any)
  let resultoverall: any = JSON.parse(localStorage.getItem('results') as any)
  let resultsigmaId = resultoverall?.filter((item: any) => {
    return item?.id == id
  })

  const handleQueryExecute = (targetvalue: any) => {
    let inprogressdata: any = JSON.parse(localStorage.getItem('results') as any)
    let obj = {
      id: id,
      target: targetvalue,
      createdAt: new Date(),
      singlequery: 'Inprogress',
      status: 'inprogress',
    }
    if (inprogressdata) {
      localStorage.setItem('results', JSON.stringify([...inprogressdata, obj]))
    } else {
      localStorage.setItem('results', JSON.stringify([obj]))
    }
    let resultsdatalist: any = JSON.parse(localStorage.getItem('results') as any)
    setResultsdatalist(resultsdatalist)
    setActiveTab(3)
    dispatch(getExecuteQuery({ target: targetvalue, query: queryValue }) as any)
      .then((res: any) => {
        if (res.type == 'GET_EXECUTE_QUERY_FAILED') {
          let respons =
            'Query execution failed. Please check your input and SIEM settings, then try again. If the issue persists, please reach out to support for assistance.'
          let obj = {
            id: id,
            target: targetvalue,
            createdAt: new Date(),
            singlequery: respons,
            status: 'faild',
          }
          const getdata: any = JSON.parse(localStorage.getItem('results') as any)
          getdata.pop()
          const finaldata: any = [obj, ...getdata]
          localStorage.setItem('results', JSON.stringify(finaldata))
          let failddatalist: any = JSON.parse(localStorage.getItem('results') as any)
          setResultsdatalist(failddatalist)
          setTargetId(null)
        } else {
          let fileName = sigmadetail?.name
          let file = new File([res.payload], fileName)
          const reader = new FileReader()
          let jsonBlock: any = null

          reader.onload = (e: any) => {
            const fileText = e.target.result
            jsonBlock = JSON.parse(fileText)
            const formattedJson = JSON.stringify(jsonBlock, null, 4)
            let obj = {
              id: id,
              target: targetvalue,
              createdAt: new Date(),
              singlequery: formattedJson,
              status: 'completed',
            }
            const getdata: any = JSON.parse(localStorage.getItem('results') as any)
            getdata.pop()
            const finaldata: any = [obj, ...getdata]
            localStorage.setItem('results', JSON.stringify(finaldata))
            let completedatalist: any = JSON.parse(localStorage.getItem('results') as any)
            setResultsdatalist(completedatalist)
            setTargetId(null)
          }
          reader.readAsText(file)
        }
      })
      .catch((err: any) => console.log('err', err))
  }

  const handleQueryExecuteTrans = (targetvaule: any, queryvalues: any) => {
    let inprogressdata: any = JSON.parse(localStorage.getItem('results') as any)
    let obj = {
      id: id,
      target: targetvaule,
      createdAt: new Date(),
      singlequery: 'Inprogress',
      status: 'inprogress',
    }
    if (inprogressdata) {
      localStorage.setItem('results', JSON.stringify([...inprogressdata, obj]))
    } else {
      localStorage.setItem('results', JSON.stringify([obj]))
    }
    let resultsdatalist: any = JSON.parse(localStorage.getItem('results') as any)
    setResultsdatalist(resultsdatalist)
    setActiveTab(3)
    dispatch(getExecuteQuery({ target: targetvaule, query: queryvalues.toString() }) as any)
      .then((res: any) => {
        if (res.type == 'GET_EXECUTE_QUERY_FAILED') {
          let respons =
            'Query execution failed. Please check your input and SIEM settings, then try again. If the issue persists, please reach out to support for assistance.'
          let obj = {
            id: id,
            target: targetvaule,
            createdAt: new Date(),
            singlequery: respons,
            status: 'faild',
          }
          const getdata: any = JSON.parse(localStorage.getItem('results') as any)
          getdata.pop()
          const finaldata: any = [obj, ...getdata]
          localStorage.setItem('results', JSON.stringify(finaldata))
          let failddatalist: any = JSON.parse(localStorage.getItem('results') as any)
          setResultsdatalist(failddatalist)
        } else {
          let fileName = sigmadetail?.name
          let file = new File([res.payload], fileName)
          const reader = new FileReader()
          let jsonBlock: any = null

          reader.onload = (e: any) => {
            const fileText = e.target.result
            jsonBlock = JSON.parse(fileText)
            const formattedJson = JSON.stringify(jsonBlock, null, 4)
            let obj = {
              id: id,
              target: targetvaule,
              createdAt: new Date(),
              singlequery: formattedJson,
              status: 'completed',
            }
            const getdata: any = JSON.parse(localStorage.getItem('results') as any)
            getdata.pop()
            const finaldata: any = [obj, ...getdata]
            localStorage.setItem('results', JSON.stringify(finaldata))
            let completedatalist: any = JSON.parse(localStorage.getItem('results') as any)
            setResultsdatalist(completedatalist)
          }
          reader.readAsText(file)
        }
      })
      .catch((err: any) => console.log('err', err))
  }
  const [queryvalue, setQueryValues] = useState(null as any)
  useEffect(() => {
    fetchtarget()
  }, [sigmadata?.availableTargetQueries?.length])
  const fetchtarget = () => {
    if (sigmadata?.availableTargetQueries?.length > 0 && !queryvalue) {
      let queryArray: any = []

      let obj = {
        docId: sigmadetail.id,
        target: sigmadata?.availableTargetQueries[0]?.toLowerCase(),
      }

      dispatch(SingleTranslateFileList(obj, sigmadata) as any).then((response: any) => {
        if (response.payload.query) {
          queryArray = [...queryArray, response.payload.query]
          setTransQuerylist([...queryArray]) // Update the queryArray1 state
          setSinglequery(response.payload.query)
          setQueryValues(true)
        } else if (response.payload.query === '') {
          setSinglequery('Error: Failed to retrieve query')
          setQueryValue('Error: Failed to retrieve query')
        }
      })
    }
  }
  // ?******************************************************

  const [messages, setMessages] = useState<any[]>([])
  const [inputMessage, setInputMessage] = useState<any[]>([])
  const [sendmessage, setSendmessage] = useState('' as any)
  const socketRef = useRef<WebSocket | null>(null)

  const [sessionid, setSessionId] = useState(null)
  // Function to handle WebSocket connection, sending a message, and managing responses

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
        ruleId: id,
        mitreLocation: null,
        global: false,
        sessionItem: true,
      }
      const chatObj = {
        sessionName: state?.singmaname,
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
    const localStorage1 = local.getItem('bearerToken')
    const token = JSON.parse(localStorage1 as any)
    const barearTockens = token?.bearerToken.split(' ')
    if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
      const socket = new WebSocket(
        `${environment?.baseWssUrl}/intel-chat/${id}/${undefined}?Authorization=${barearTockens[1]}`,
      )
      socketRef.current = socket

      socket.onopen = () => {
        console.log('Connected to WebSocket server')
        let object: any = {
          message_id: uuidv4(),
          message: messages?.length > 0 ? sendmessage : sendmessage + ' ' + ymltext,
          focus: 'rule_agent',
          report_id: id,
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
    let element = document.getElementById('scrollContainer')
    if (element) {
      element.scrollTop = element.scrollHeight
    }
    const chatYaml = JSON.parse(sessionStorage.getItem('yamltext') as any)
    if (chatYaml) {
      setYmlText(chatYaml)
      sessionStorage.removeItem('yamltext')
    }
  }, [messages])


  // **********************************************************
  const [inboxList, setInboxList] = useState([] as any);
  const [singleparams, setSingleparams] = useState(null as any);
  const [collectionorcti, setCollectionorcti] = useState(null as any)
  const [selectedRows, setSelectedRows] = useState([] as any)
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [collectiondata, setCollectiondata] = useState([] as any)
  const navigateTo = useNavigate();

  useEffect(() => {
    fetchDetails()
    dispatch(getinboxCollection() as any).then((res: any) => {
      if (res?.type == 'INBOX_COLLECTION_GET_SUCCESS') {
        setInboxList(res.payload)
      }
    })
  }, [])

  const fetchDetails = () => {
    dispatch(getallCollection() as any).then((res: any) => {
      if (res.payload.length > 0) {
        let collection = [{ name: '+ New' }, ...res.payload]
        setCollectiondata(collection)
      } else {
        let collection = [{ name: '+ New' }]
        setCollectiondata(collection)
      }
    })
  }

  const handleOpenCollection = (data: any) => {
    setSelectedRows([state.sigmadetail])
    setCollectionorcti(state?.paramsdata == "Threatbreif" ? "Threatbreif" : "ctiThreatbreif")
    setDialogOpen(true)
  }

  const handleOpenInboxCollection = (datas: any) => {

    const toastId = toast.loading(
      <CustomToast
        message='Your files are currently being copied.'
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
    if ((sigmadetail?.datavault?.category == "DAC" || sigmadetail?.datavault?.category == "IMPORTED")) {
      if (inboxList) {
        dispatch(CollectiondtoCollectionMultipleCopyPost(Number(sigmadetail?.datavault?.id), [inboxList?.id], [id]) as any).then(
          (res: any) => {
            if (res.type == 'MULTIPLE_COLLECTION_TO_COLLECTION_COPY_POST_SUCCESS') {
              toast.dismiss(toastId)
              navigateTo(`/app/collectionsigmarule/${inboxList?.id}`, {
                state: { title: inboxList?.name },
              })
              setDialogOpen(false)
              sessionStorage.setItem('active', 'newCtiArcheive')
              setSingleparams(null)
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
                  message='Failed to copy the rule. Please try again'
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
          },
        )
      }
    } else {
      if (inboxList) {
        dispatch(CollectiondataCopyPost(inboxList?.id, state?.sigmadetail?.ctiReport?.id, [id]) as any).then(
          (res: any) => {
            if (res.type == 'COLLECTION_COPY_POST_SUCCESS') {
              toast.dismiss(toastId)
              navigateTo(`/app/collectionsigmarule/${inboxList?.id}`, {
                state: { title: inboxList?.name },
              })
              setDialogOpen(false)
              sessionStorage.setItem('active', 'newCtiArcheive')
              setSingleparams(null)
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
                  message='Failed to copy the rule. Please try again'
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
          },
        )
      }
    }
  }

  const handleDownload = () => {
    try {
      let parsedJSON = yaml.load(ymltext)
      const blob = new Blob([ymltext], { type: 'text/plain' })
      const file = new File([blob], `${parsedJSON?.title}.yml`, { type: 'text/plain' })
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = file.name;

      // Trigger the download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error parsing YAML or downloading file:', error);
    }
  }

  return (
    <div className=' p-6'>
      {/* <div className='w-full h-auto bg-[#0F121B] flex justify-center items-center'>
        <div className='w-full p-4  max-w-full  bg-[#1D2939] rounded-lg flex flex-wrap  grid grid-cols-12 gap-2 max-lg:gap-4'>
          <div className='col-span-5 max-lg:col-span-12'>
            <div className='flex flex-col items-start gap-2 w-full md:w-auto'>
              <div className='text-white text-xl font-semibold leading-8'>Summary</div>
              <div className='flex-1 text-[#98A2B3] text-base font-normal leading-5 w-full md:w-auto break-words line-clamp-2'>
                {authdetails?.description}
              </div>
            </div>
          </div>
          <div className='col-span-7 max-lg:col-span-12'>
            <div className='flex flex-col lg:flex-row lg:items-center justify-end gap-8 max-lg:flex-row max-lg:justify-between max-md:flex-col'>
              <div className='flex flex-col gap-2 items-center justify-center'>
                <div className='text-[#98A2B3] text-[14px] sm:text-[16px] font-normal'>Created</div>
                <div className='text-white text-[16px] sm:text-[18px] font-semibold'>
                  {moment(authordetails?.date).format('YYYY/MM/DD')}
                </div>
              </div>

              <div className='hidden lg:block w-[2px] h-16 bg-[#475467]' />

              <div className='flex flex-col gap-2 items-center justify-center'>
                <div className='text-[#98A2B3] text-[14px] sm:text-[16px] font-normal'>Author</div>
                <div className='text-white text-[16px] sm:text-[18px] font-semibold truncate max-w-[200px]'>
                  {authordetails?.author}
                </div>
              </div>

              <div className='hidden lg:block w-[2px] h-16 bg-[#475467]' />

              <div className='flex flex-col gap-2  w-[150px] items-center justify-center max-md:self-center'>
                <div className='text-[#98A2B3] text-[14px] sm:text-[16px] font-normal'>State</div>
                <select className='bg-white text-black border border-gray-700 rounded-lg px-2 py-1 w-full shadow-sm'>
                  <option>Draft</option>
                  <option>Published</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className='w-full h-auto bg-[#0F121B] flex justify-center items-center mt-[-18px]'>
        <div className='w-full p-4  max-w-full  bg-[#1D2939] rounded-lg flex flex-wrap  grid grid-cols-12 gap-2 max-md:gap-4'>
          <div className='col-span-7 max-md:col-span-12'>
            <div className='flex flex-col items-start gap-2 w-full md:w-auto'>
              <div className='text-white text-xl font-semibold leading-8'>Summary</div>
              <div className='flex-1 text-[#98A2B3] text-base font-normal leading-5 w-full md:w-auto break-words line-clamp-2'>
                {authordetails?.description}
              </div>
            </div>
          </div>
          <div className='col-span-5 max-md:col-span-12'>
            <div className='flex flex-col lg:flex-row lg:items-center justify-end gap-8 max-md:flex-row max-md:justify-between'>
              <div className='flex flex-col gap-2 items-center justify-center'>
                <div className='text-[#98A2B3] text-[14px] sm:text-[16px] font-normal'>Created</div>
                <div className='text-white text-[16px] sm:text-[18px] font-semibold'>
                  {moment(authordetails?.date).format('YYYY/MM/DD')}
                </div>
              </div>

              <div className='hidden lg:block w-[2px] h-16 bg-[#475467]' />

              <div className='flex flex-col gap-2 items-center justify-center'>
                <div className='text-[#98A2B3] text-[14px] sm:text-[16px] font-normal'>Author</div>
                <div className='text-white text-[16px] sm:text-[18px] font-semibold truncate max-w-[400px]'>
                  <BootstrapTooltip title={authordetails?.author} arrow placement='bottom'>
                    {authordetails?.author}
                  </BootstrapTooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!state?.platformName && (
        <div className='mx-auto  shadow-lg  overflow-hidden w-full relative mt-8'>
          <div className='flex justify-between items-center  mb-6'>
            <div className='left-6  flex border-b border-[#3E4B5D] space-x-3 bg-[#0C111D]'>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-2  ${tab.isActive ? 'border-b-[3px] border-white text-white' : 'text-[#98A2B3]'
                    } font-medium text-sm`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {activeTab == 1 && (
              <div className='flex items-center gap-8 ml-auto  space-x-4'>
                <div>
                  <button className='bg-transparent text-white p-2' onClick={copyToClipboard}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                    >
                      <path
                        d='M10.5 2.0028C9.82495 2.01194 9.4197 2.05103 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8.05103 3.4197 8.01194 3.82495 8.0028 4.5M19.5 2.0028C20.1751 2.01194 20.5803 2.05103 20.908 2.21799C21.2843 2.40973 21.5903 2.71569 21.782 3.09202C21.949 3.4197 21.9881 3.82494 21.9972 4.49999M21.9972 13.5C21.9881 14.175 21.949 14.5803 21.782 14.908C21.5903 15.2843 21.2843 15.5903 20.908 15.782C20.5803 15.949 20.1751 15.9881 19.5 15.9972M22 7.99999V9.99999M14.0001 2H16M5.2 22H12.8C13.9201 22 14.4802 22 14.908 21.782C15.2843 21.5903 15.5903 21.2843 15.782 20.908C16 20.4802 16 19.9201 16 18.8V11.2C16 10.0799 16 9.51984 15.782 9.09202C15.5903 8.71569 15.2843 8.40973 14.908 8.21799C14.4802 8 13.9201 8 12.8 8H5.2C4.0799 8 3.51984 8 3.09202 8.21799C2.71569 8.40973 2.40973 8.71569 2.21799 9.09202C2 9.51984 2 10.0799 2 11.2V18.8C2 19.9201 2 20.4802 2.21799 20.908C2.40973 21.2843 2.71569 21.5903 3.09202 21.782C3.51984 22 4.07989 22 5.2 22Z'
                        stroke={'#fff'}
                        stroke-width='2'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </svg>
                  </button>
                  {showPopover && (
                    <div className='absolute  p-1 bg-white text-black rounded shadow z-10'>
                      Copied!
                    </div>
                  )}
                  <button
                    className='bg-transparent text-white p-2 mr-8'
                    onClick={() => detectionRuleDownload(ymltext)}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                    >
                      <path
                        d='M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 10L12 15M12 15L7 10M12 15V3'
                        stroke={'#fff'}
                        stroke-width='2'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </svg>
                  </button>
                </div>
                <Divider orientation='vertical' flexItem sx={{ borderColor: '#c2c8d3', mx: 2 }} />

                <div className='flex space-x-3'>
                  <select
                    className='bg-white text-black px-4 py-2 w-48 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    onChange={(e) => handleClickTargersingle(e)}
                    value={targetId}
                  >
                    <option selected value={''}>
                      Target
                    </option>
                    {selectTargers
                      ?.filter((item: any) => {
                        return item?.target == 'SPLUNK'
                      })
                      .map((item: any) => (
                        <option value={item.target}>{item.targetDescription}</option>
                      ))}
                  </select>
                  <button
                    onClick={handleSingleTranslatClick}
                    disabled={disable}
                    className={`bg-orange-500 text-white px-4 py-2 rounded-lg shadow-sm ${disable ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#6941C6]'
                      } `}
                  >
                    Translate Now
                  </button>
                  <button
                    id='YamlSubmit'
                    type='button'
                    onClick={() => handleUpdateYamlFile(ymltext)}
                    disabled={messages?.length == 0 ? true : false}
                    className={`bg-orange-500 text-white px-4 py-2 rounded-lg shadow-sm hidden ${messages?.length == 0 ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#6941C6]'
                      } `}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>

          {activeTab == 1 && (
            <div>
              <div className='shadow-lg w-full mt-2 '>
                <div className='grid grid-cols-12 gap-2'>
                  <div
                    className={`col-span-6 p-4 rounded-lg border border-[#3E4B5D] bg-[#101828] relative 
                  sm:h-[50vh] md:h-[60vh] lg:h-[70vh]`} // Responsive heights for breakpoints
                    style={{ height: `${dynamicHeight - 150}px` }} // Dynamic height overrides Tailwind when calculated
                  >
                    {/* Chat Options Container with Scroll */}
                    <div
                      ref={divRef}
                      id='scrollContainer'
                      className={` ${classes.scrollContainer}`}
                    >
                      <div
                        className='overflow-y-auto mb-4'
                        style={{ maxHeight: `calc(${dynamicHeight - 200}px - 75px)` }}
                      >
                        <div id='scroll' style={{ height: '90%' }}>
                          {ctiChat?.length == 0 ? (
                            <>
                              {messages.length > 0 &&
                                messages.map((responce: any, index) => {
                                  return (
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
                                        <div className='flex justify-between pt-[40px] mb-2'>
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
                                                S2S Rule Agent
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      <div
                                        key={index}
                                        className={`mb-2 rounded-lg bg-[#054D80] w-full ${responce.question
                                          ? 'text-left pt-[5px] pb-[5px] pl-[7px] pr-[7px]'
                                          : 'bg-[#1d2939] pt-[8px] pl-[8px] pr-[8px] pb-[8px]'
                                          }`}
                                      >
                                        <span
                                          className={`inline-block text-justify rounded-lg px-3 py-2 w-full ${responce.question
                                            ? 'bg-[#054D80] text-white break-all'
                                            : 'bg-[#1d2939] text-white markdown-content'
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
                                              code({ inline, className, children, ...props }: any) {
                                                const match: any = /language-(\w+)/.exec(
                                                  className || '',
                                                )
                                                const codeContent = String(children).replace(
                                                  /\n$/,
                                                  '',
                                                )
                                                if (match && match[1] == 'yaml') {
                                                  sessionStorage.setItem(
                                                    'yamltext',
                                                    JSON.stringify(codeContent),
                                                  )
                                                }
                                                return !inline && match ? (
                                                  <>
                                                    {match && match[1] !== 'yaml' && (
                                                      <SyntaxHighlighter
                                                        style={darcula}
                                                        language={match[1]}
                                                        PreTag='div'
                                                        className={`markdown-code ${className}`}
                                                        {...props}
                                                      >
                                                        {String(children).replace(/\n$/, '')}
                                                      </SyntaxHighlighter>
                                                    )}
                                                  </>
                                                ) : (
                                                  <code className={className} {...props}>
                                                    {children}
                                                  </code>
                                                )
                                              },
                                            }}
                                          >
                                            {responce?.message}
                                          </ReactMarkdown>
                                        </span>
                                      </div>
                                      <div ref={bottomRef} />
                                    </div>
                                  )
                                })}
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
                                        </>
                                      )}
                                      <div
                                        key={index}
                                        className={`mb-2   bg-[#054D80]  rounded-lg  w-full  ${responce.question
                                          ? 'text-left pt-[5px] pb-[5px] pl-[7px] pr-[7px]'
                                          : 'bg-[#1d2939]  pt-[8px] pl-[8px] pr-[8px] pb-[8px]'
                                          }`}
                                      >
                                        <span
                                          className={` inline-block text-justify rounded-lg px-3 py-2 w-full ${responce.question
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
                                              code({ inline, className, children, ...props }: any) {
                                                const match: any = /language-(\w+)/.exec(
                                                  className || '',
                                                )
                                                const codeContent = String(children).replace(
                                                  /\n$/,
                                                  '',
                                                )

                                                return !inline && match ? (
                                                  <>
                                                    {match && match[1] !== 'yaml' && (
                                                      <SyntaxHighlighter
                                                        style={darcula}
                                                        language={match[1]}
                                                        PreTag='div'
                                                        className={`markdown-code ${className}`}
                                                        {...props}
                                                      >
                                                        {String(children).replace(/\n$/, '')}
                                                      </SyntaxHighlighter>
                                                    )}
                                                  </>
                                                ) : (
                                                  <code className={className} {...props}>
                                                    {children}
                                                  </code>
                                                )
                                              },
                                            }}
                                          >
                                            {responce?.message}
                                          </ReactMarkdown>
                                        </span>
                                      </div>
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
                                          S2S Rule Agent
                                        </p>
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
                                                }: any) {
                                                  const match: any = /language-(\w+)/.exec(
                                                    className || '',
                                                  )
                                                  const codeContent = String(children).replace(
                                                    /\n$/,
                                                    '',
                                                  )

                                                  return !inline && match ? (
                                                    <>
                                                      {match && match[1] !== 'yaml' && (
                                                        <SyntaxHighlighter
                                                          style={darcula}
                                                          language={match[1]}
                                                          PreTag='div'
                                                          className={`markdown-code ${className}`}
                                                          {...props}
                                                        >
                                                          {String(children).replace(/\n$/, '')}
                                                        </SyntaxHighlighter>
                                                      )}
                                                    </>
                                                  ) : (
                                                    <code className={className} {...props}>
                                                      {children}
                                                    </code>
                                                  )
                                                },
                                              }}
                                            >
                                              {chatValue?.message}
                                            </ReactMarkdown>
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
                                  {/* <div ref={bottomRef} /> */}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Input Section */}
                    <div className='w-[90%] bottom-[21px] ml-6 p-6 h-[55px] bg-[#0F121B] rounded-lg border border-[#3E4B5D] flex items-center px-6 absolute bottom-0 left-0 border'>
                      <input
                        value={sendmessage}
                        type='text'
                        className='w-full bg-transparent text-[#909DB0] text-[16px] font-normal outline-none placeholder:text-[#909DB0] break-words'
                        placeholder='Start typing for assistance'
                        onChange={(e) => setSendmessage(e?.target?.value)}
                        onKeyDown={(e) => {
                          handleKeyDown(e)
                        }}
                      />
                      <button
                        onClick={handleWebSocket}
                        className='absolute right-2 flex items-center justify-center gap-2 bg-[#EE7103] text-white px-4 py-1 rounded-lg shadow-sm'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='22'
                          height='21'
                          viewBox='0 0 22 21'
                          fill='none'
                        >
                          <path
                            d='M9.27452 3.42349C9.40893 3.06912 9.94242 3.06912 10.0768 3.42349C10.6452 4.9223 11.7379 7.5288 12.8306 8.62147C13.9262 9.71702 16.4015 10.8126 17.8118 11.3797C18.1561 11.5182 18.1561 12.0348 17.8118 12.1733C16.4014 12.7404 13.9262 13.8359 12.8306 14.9313C11.7379 16.024 10.6452 18.6306 10.0768 20.1294C9.94242 20.4837 9.40893 20.4837 9.27452 20.1294C8.70616 18.6306 7.61346 16.024 6.52076 14.9313C5.42805 13.8386 2.8215 12.7461 1.32267 12.1777C0.968292 12.0433 0.968292 11.5098 1.32265 11.3754C2.82148 10.8069 5.42805 9.71418 6.52076 8.62147C7.61346 7.5288 8.70616 4.9223 9.27452 3.42349Z'
                            fill='#FFF'
                          />
                        </svg>
                        <span className='font-semibold text-[16px]'>Chat</span>
                      </button>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div
                      style={{
                        height: `${dynamicHeight - 150}px`,
                        width: '100%',
                        textAlign: 'left',
                        overflowY: 'hidden',
                        backgroundColor: '#0C111D',
                        borderRadius: '8px',
                      }}
                    >
                      <YamlEditor
                        ymltext={ymltext}
                        setYmlText={setYmlText}
                        setSeloctror={() => { }}
                        modeOfView={'ruleeditor'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab == 2 && (
            <div className='mx-auto shadow-lg w-full mt-6 overflow-y-scroll max-h-[520px] scrollbar-hide'>
              {singlequery !== 'Translation of your sigma file(s) is in progress...' && (
                <>
                  {(sigmadata?.availableTargetQueries?.length == 0 ||
                    !sigmadata?.availableTargetQueries) &&
                    transQuerylist?.length == 0 && (
                      <div className='h-[454px] bg-gray-900 flex items-center justify-center p-6 border border-[#3E4B5D] mt-2'>
                        <div className=' text-center w-full max-w-lg'>
                          <h1 className='text-white text-3xl mb-4'>Translate to a native query</h1>
                          <p className='text-gray-400 mb-8'>
                            Create a query from the sigma rule to run and test in your environment.
                          </p>
                          <div className='flex justify-center items-center space-x-4'>
                            <select
                              className='bg-white text-black px-4 py-2 w-64 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                              onChange={(e) => handleClickTargersingle(e)}
                            >
                              <option selected value={''}>
                                Choose your SIEM platform
                              </option>
                              {selectTargers
                                ?.filter((item: any) => {
                                  return item?.target == 'SPLUNK'
                                })
                                .map((item: any) => (
                                  <option value={item.target}>{item.targetDescription}</option>
                                ))}
                            </select>

                            <button
                              disabled={targetId ? false : true}
                              onClick={handleSingleTranslatClick}
                              className={`bg-orange-500 text-white py-2 px-6 rounded-md ${targetId ? `bg-orange-500` : `cursor-not-allowed opacity-50 hover`
                                } hover:bg-orange-600`}
                            >
                              Translate Now
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                </>
              )}
              {sigmadata?.availableTargetQueries?.length > 0 || transQuerylist?.length > 0 ? (
                <>
                  {transQuerylist?.length > 0 ? (
                    <>
                      {sigmadata?.availableTargetQueries?.map((item: any, index: any) => (
                        <>
                          {!targetId ? (
                            <Accordion
                              key={index}
                              expanded={expandedIndex === index}
                              className=''
                              classes={{
                                root: 'text-[#fff]',
                              }}
                              sx={{
                                backgroundColor: 'transparent',
                                color: '#fff',
                                width: '100%',
                                border: '2px solid #3E4B5D',
                                marginTop: 2,
                              }}
                            >
                              <AccordionSummary
                                expanded={expandedIndex === index}
                                onClickIcon={() => handleChange(index)}
                                aria-controls='panel1-content'
                                id='panel1-header'
                                sx={{ cursor: 'default' }}
                              >
                                <div className='bg-dark flex flex-col md:flex-row items-center justify-between p-4 rounded-lg shadow-md space-y-4 md:space-y-0 md:space-x-4 w-full'>
                                  <div className='flex items-center space-x-2'>
                                    {item?.toLowerCase() == 'splunk' && (
                                      <span>
                                        <svg
                                          xmlns='http://www.w3.org/2000/svg'
                                          xmlnsXlink='http://www.w3.org/1999/xlink'
                                          width='32'
                                          height='32'
                                          viewBox='0 0 32 32'
                                          fill='none'
                                        >
                                          <path
                                            d='M24 0H8C3.58172 0 0 3.58172 0 8V24C0 28.4183 3.58172 32 8 32H24C28.4183 32 32 28.4183 32 24V8C32 3.58172 28.4183 0 24 0Z'
                                            fill='url(#pattern0)'
                                          />
                                          <defs>
                                            <pattern
                                              id='pattern0'
                                              patternContentUnits='objectBoundingBox'
                                              width='1'
                                              height='1'
                                            >
                                              <use
                                                xlinkHref='#image0_1342_16057'
                                                transform='matrix(0.00171932 0 0 0.00170386 -0.388889 -0.164506)'
                                              />
                                            </pattern>
                                            <image
                                              id='image0_1342_16057'
                                              width='1034'
                                              height='780'
                                              xlinkHref='data:image/png;base64,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hwQAAAAAgv6/9oYBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVgK6m6LBlH851AAAAABJRU5ErkJggg=='
                                            />
                                          </defs>
                                        </svg>
                                      </span>
                                    )}
                                    {item?.toLowerCase() == 'elasticsearch' && (
                                      <span>
                                        <svg
                                          xmlns='http://www.w3.org/2000/svg'
                                          width='28'
                                          height='28'
                                          preserveAspectRatio='xMinYMin meet'
                                          viewBox='0 0 256 256'
                                          id='elasticsearch'
                                        >
                                          <path
                                            fill='#FFF'
                                            d='M255.96 134.393c0-21.521-13.373-40.117-33.223-47.43a75.239 75.239 0 0 0 1.253-13.791c0-39.909-32.386-72.295-72.295-72.295-23.193 0-44.923 11.074-58.505 30.088-6.686-5.224-14.835-7.94-23.402-7.94-21.104 0-38.446 17.133-38.446 38.446 0 4.597.836 9.194 2.298 13.373C13.582 81.739 0 100.962 0 122.274c0 21.522 13.373 40.327 33.431 47.64-.835 4.388-1.253 8.985-1.253 13.79 0 39.7 32.386 72.087 72.086 72.087 23.402 0 44.924-11.283 58.505-30.088 6.686 5.223 15.044 8.149 23.611 8.149 21.104 0 38.446-17.134 38.446-38.446 0-4.597-.836-9.194-2.298-13.373 19.64-7.104 33.431-26.327 33.431-47.64z'
                                          ></path>
                                          <path
                                            fill='#F4BD19'
                                            d='M100.085 110.364l57.043 26.119 57.669-50.565a64.312 64.312 0 0 0 1.253-12.746c0-35.52-28.834-64.355-64.355-64.355-21.313 0-41.162 10.447-53.072 27.998l-9.612 49.73 11.074 23.82z'
                                          ></path>
                                          <path
                                            fill='#3CBEB1'
                                            d='M40.953 170.75c-.835 4.179-1.253 8.567-1.253 12.955 0 35.52 29.043 64.564 64.564 64.564 21.522 0 41.372-10.656 53.49-28.208l9.403-49.729-12.746-24.238-57.251-26.118-56.207 50.774z'
                                          ></path>
                                          <path
                                            fill='#E9478C'
                                            d='M40.536 71.918l39.073 9.194 8.775-44.506c-5.432-4.179-11.91-6.268-18.805-6.268-16.925 0-30.924 13.79-30.924 30.924 0 3.552.627 7.313 1.88 10.656z'
                                          ></path>
                                          <path
                                            fill='#2C458F'
                                            d='M37.192 81.32c-17.551 5.642-29.67 22.567-29.67 40.954 0 17.97 11.074 34.059 27.79 40.327l54.953-49.73-10.03-21.52-43.043-10.03z'
                                          ></path>
                                          <path
                                            fill='#95C63D'
                                            d='M167.784 219.852c5.432 4.18 11.91 6.478 18.596 6.478 16.925 0 30.924-13.79 30.924-30.924 0-3.761-.627-7.314-1.88-10.657l-39.073-9.193-8.567 44.296z'
                                          ></path>
                                          <path
                                            fill='#176655'
                                            d='M175.724 165.317l43.043 10.03c17.551-5.85 29.67-22.566 29.67-40.954 0-17.97-11.074-33.849-27.79-40.326l-56.415 49.311 11.492 21.94z'
                                          ></path>
                                        </svg>
                                      </span>
                                    )}
                                    {item?.toLowerCase() == 'opensearch' && (
                                      <span>
                                        <svg
                                          fill='none'
                                          viewBox='0 0 64 64'
                                          xmlns='http://www.w3.org/2000/svg'
                                          width='28'
                                          height='28'
                                        >
                                          <path
                                            d='m61.7374 23.5c-1.2496 0-2.2626 1.013-2.2626 2.2626 0 18.6187-15.0935 33.7122-33.7122 33.7122-1.2496 0-2.2626 1.013-2.2626 2.2626s1.013 2.2626 2.2626 2.2626c21.1179 0 38.2374-17.1195 38.2374-38.2374 0-1.2496-1.013-2.2626-2.2626-2.2626z'
                                            fill='#005eb8'
                                          />
                                          <path
                                            d='m48.0814 38c2.1758-3.5495 4.2801-8.2822 3.8661-14.9079-.8576-13.72485-13.2886-24.13673-25.0269-23.0083673-4.5953.4417323-9.3138 4.1874673-8.8946 10.8967673.1822 2.9156 1.6092 4.6364 3.9284 5.9594 2.2074 1.2593 5.0434 2.057 8.2584 2.9612 3.8834 1.0923 8.3881 2.3192 11.8502 4.8706 4.1495 3.0578 6.9861 6.6026 6.0184 13.2283z'
                                            fill='#003b5c'
                                          />
                                          <path
                                            d='m3.91861 14c-2.17585 3.5495-4.280116 8.2822-3.8661169 14.9079.8575789 13.7248 13.2886069 24.1367 25.0269069 23.0084 4.5953-.4418 9.3138-4.1875 8.8946-10.8968-.1822-2.9156-1.6093-4.6364-3.9284-5.9594-2.2074-1.2593-5.0434-2.057-8.2584-2.9612-3.8834-1.0923-8.3881-2.3192-11.85026-4.8706-4.14948-3.0579-6.98602-6.6026-6.01833-13.2283z'
                                            fill='#005eb8'
                                          />
                                        </svg>
                                      </span>
                                    )}
                                    <p className='text-gray-300 text-sm md:text-base truncate w-96'>
                                      {transQuerylist[index]}
                                    </p>
                                  </div>
                                  <div>
                                    <span className='text-green-400 text-sm md:text-base'>
                                      Up to date
                                    </span>
                                  </div>
                                  {/* <div>
                                                                <span className="text-gray-400 text-sm md:text-base">0 Executions</span>
                                                            </div> */}
                                  <div className='flex space-x-3 md:space-x-4 flex-col md:flex-row'>
                                    <div className='flex space-x-2'>
                                      <button
                                        className='text-gray-400 hover:text-white'
                                        onClick={() => copyToClipboardTrans(index)}
                                      >
                                        <FileCopyIcon />
                                      </button>
                                      {showPopover && copyIndex == index && (
                                        <div className='absolute  p-1 bg-white text-black rounded shadow z-10 mt-8 ml-6'>
                                          Copied!
                                        </div>
                                      )}
                                      <button
                                        className='text-gray-400 hover:text-white'
                                        onClick={singleTranslateDownload}
                                      >
                                        <DownloadIcon />
                                      </button>
                                    </div>
                                    <Divider
                                      orientation='vertical'
                                      flexItem
                                      sx={{ borderColor: '#c2c8d3', mx: 2 }}
                                    />
                                    <div className='flex space-x-2'>
                                      <button
                                        onClick={() =>
                                          handleQueryExecuteTrans(item, transQuerylist[index])
                                        }
                                        className='bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600'
                                      >
                                        Execute
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div
                                  style={{
                                    height: '452px',
                                    width: '98%',
                                    textAlign: 'left',
                                    overflowY: 'hidden',
                                    backgroundColor: '#0C111D',
                                    borderRadius: '8px',
                                    marginLeft: '20px',
                                  }}
                                >
                                  <YamlTextEditorForQuery
                                    ymltext={transQuerylist[index]}
                                    setSinglequery={setSinglequery}
                                    setQueryValue={setQueryValue}
                                    setSeloctror={() => { }}
                                  />
                                </div>
                              </AccordionDetails>
                            </Accordion>
                          ) : (
                            <Accordion
                              key={index}
                              expanded={expandedIndex === index}
                              className=''
                              classes={{
                                root: 'text-[#fff]',
                              }}
                              sx={{
                                backgroundColor: 'transparent',
                                color: '#fff',
                                width: '100%',
                                border: '2px solid #3E4B5D',
                                marginTop: 2,
                              }}
                            >
                              <AccordionSummary
                                expanded={expandedIndex === index}
                                onClickIcon={() => handleChange(index)}
                                aria-controls='panel1-content'
                                id='panel1-header'
                                sx={{ cursor: 'default' }}
                              >
                                <div className='bg-dark flex flex-col md:flex-row items-center justify-between p-4 rounded-lg shadow-md space-y-4 md:space-y-0 md:space-x-4 w-full'>
                                  <div className='flex items-center space-x-2'>{singlequery}</div>
                                </div>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div
                                  style={{
                                    height: '452px',
                                    width: '98%',
                                    textAlign: 'left',
                                    overflowY: 'hidden',
                                    backgroundColor: '#0C111D',
                                    borderRadius: '8px',
                                    marginLeft: '20px',
                                  }}
                                >
                                  <YamlTextEditorForQuery
                                    ymltext={singlequery}
                                    setSinglequery={setSinglequery}
                                    setQueryValue={setQueryValue}
                                    setSeloctror={() => { }}
                                  />
                                </div>
                              </AccordionDetails>
                            </Accordion>
                          )}
                        </>
                      ))}
                    </>
                  ) : singlequery == 'Translation of your sigma file(s) is in progress...' ? (
                    <Accordion
                      key={0}
                      expanded={expandedIndex === 0}
                      className=''
                      classes={{
                        root: 'text-[#fff]',
                      }}
                      sx={{
                        backgroundColor: 'transparent',
                        color: '#fff',
                        width: '100%',
                        border: '2px solid #3E4B5D',
                        marginTop: 2,
                      }}
                    >
                      <AccordionSummary
                        expanded={expandedIndex === 0}
                        onClickIcon={() => handleChange(0)}
                        aria-controls='panel1-content'
                        id='panel1-header'
                        sx={{ cursor: 'default' }}
                      >
                        <div className='bg-dark flex flex-col md:flex-row items-center justify-between p-4 rounded-lg shadow-md space-y-4 md:space-y-0 md:space-x-4 w-full'>
                          <div className='flex items-center space-x-2'>{singlequery}</div>
                        </div>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div
                          style={{
                            height: '452px',
                            width: '98%',
                            textAlign: 'left',
                            overflowY: 'hidden',
                            backgroundColor: '#0C111D',
                            borderRadius: '8px',
                            marginLeft: '20px',
                          }}
                        >
                          <YamlTextEditorForQuery
                            ymltext={singlequery}
                            setSinglequery={setSinglequery}
                            setQueryValue={setQueryValue}
                            setSeloctror={() => { }}
                          />
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  ) : (
                    <Accordion
                      key={0}
                      expanded={expandedIndex === 0}
                      className=''
                      classes={{
                        root: 'text-[#fff]',
                      }}
                      sx={{
                        backgroundColor: 'transparent',
                        color: '#fff',
                        width: '100%',
                        border: '2px solid #3E4B5D',
                        marginTop: 2,
                      }}
                    >
                      <AccordionSummary
                        expanded={expandedIndex === 0}
                        onClickIcon={() => handleChange(0)}
                        aria-controls='panel1-content'
                        id='panel1-header'
                        sx={{ cursor: 'default' }}
                      >
                        <div className='bg-dark flex flex-col md:flex-row items-center justify-between p-4 rounded-lg shadow-md space-y-4 md:space-y-0 md:space-x-4 w-full'>
                          <div className='flex items-center space-x-2'>
                            {'Translation of your sigma file(s) is in progress...'}
                          </div>
                        </div>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div
                          style={{
                            height: '452px',
                            width: '98%',
                            textAlign: 'left',
                            overflowY: 'hidden',
                            backgroundColor: '#0C111D',
                            borderRadius: '8px',
                            marginLeft: '20px',
                          }}
                        >
                          <YamlTextEditorForQuery
                            ymltext={singlequery}
                            setSinglequery={setSinglequery}
                            setQueryValue={setQueryValue}
                            setSeloctror={() => { }}
                          />
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  )}
                </>
              ) : (
                singlequery == 'Translation of your sigma file(s) is in progress...' && (
                  <Accordion
                    key={0}
                    expanded={expandedIndex === 0}
                    className=''
                    classes={{
                      root: 'text-[#fff]',
                    }}
                    sx={{
                      backgroundColor: 'transparent',
                      color: '#fff',
                      width: '100%',
                      border: '2px solid #3E4B5D',
                      marginTop: 2,
                    }}
                  >
                    <AccordionSummary
                      expanded={expandedIndex === 0}
                      onClickIcon={() => handleChange(0)}
                      aria-controls='panel1-content'
                      id='panel1-header'
                      sx={{ cursor: 'default' }}
                    >
                      <div className='bg-dark flex flex-col md:flex-row items-center justify-between p-4 rounded-lg shadow-md space-y-4 md:space-y-0 md:space-x-4 w-full'>
                        <div className='flex items-center space-x-2'>{singlequery}</div>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div
                        style={{
                          height: '452px',
                          width: '98%',
                          textAlign: 'left',
                          overflowY: 'hidden',
                          backgroundColor: '#0C111D',
                          borderRadius: '8px',
                          marginLeft: '20px',
                        }}
                      >
                        <YamlTextEditorForQuery
                          ymltext={singlequery}
                          setSinglequery={setSinglequery}
                          setQueryValue={setQueryValue}
                          setSeloctror={() => { }}
                        />
                      </div>
                    </AccordionDetails>
                  </Accordion>
                )
              )}
            </div>
          )}
          {activeTab == 3 && (
            <div className='mx-auto shadow-lg w-full mt-6 overflow-y-scroll max-h-[520px] scrollbar-hide'>
              {resultsdatalists?.length > 0 || resultsigmaId?.length > 0 ? (
                <TableWithAccordion
                  tablelist={resultsdatalists.length > 0 ? resultsdatalists : resultsigmaId}
                />
              ) : (
                <>
                  {sigmadata?.availableTargetQueries?.length > 0 ? (
                    <div className='h-[454px] bg-gray-900 flex items-center justify-center p-6 border border-[#3E4B5D] mt-2'>
                      <div className=' text-center w-full max-w-lg'>
                        <h1 className='text-white text-3xl mb-4'>Execute Query on your SIEM</h1>
                        <p className='text-gray-400 mb-8'>
                          Please execute the available native queries for this sigma rule.
                        </p>
                        <div className='flex justify-center items-center space-x-4'>
                          <select
                            className='bg-white text-black px-4 py-2 w-64 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            onChange={(e) => handleClickTargersingle(e)}
                          >
                            <option selected value={''}>
                              Choose your SIEM platform
                            </option>
                            {sigmadata?.availableTargetQueries.map((item: any) => (
                              <option value={item} className='capitalize'>
                                {'Splunk'}
                              </option>
                            ))}
                          </select>

                          <button
                            disabled={
                              targetId &&
                                singlequery != 'Translation of your sigma file(s) is in progress...'
                                ? false
                                : true
                            }
                            onClick={() => handleQueryExecute(targetId)}
                            className={`bg-orange-500 text-white py-2 px-6 rounded-md ${targetId &&
                              singlequery != 'Translation of your sigma file(s) is in progress...'
                              ? `bg-orange-500 hover:bg-orange-600`
                              : `cursor-not-allowed opacity-50 hover`
                              } `}
                          >
                            Execute
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='h-[454px] bg-gray-900 flex items-center justify-center p-6 border border-[#3E4B5D] mt-2'>
                      <div className=' text-center w-full max-w-lg'>
                        <h1 className='text-white text-3xl mb-4'>
                          Create the query before attempting execution.
                        </h1>

                        <div className='flex justify-center items-center space-x-4'>
                          <button
                            onClick={() => setActiveTab(1)}
                            className='bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600'
                          >
                            View Detection Rule
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          {activeTab == 4 && (
            <div>
              <div className='flex flex-col p-2 mt-[-10px]'>
                <div className='flex justify-between items-center space-x-2 pb-2'>
                  <div>
                    <div className='flex items-center space-x-2 bg-dark'>
                      <p className=''>
                        <span className='text-slate-400 font-inter text-base font-normal leading-5'>
                          Select CTI Section
                        </span>
                        <br />
                        <select
                          value={selectCtiSectionId}
                          onChange={(e: any) => handleChangeSectionId(e)}
                          className='bg-white text-black px-4 py-2 w-64 mt-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        >
                          <option selected value={''}>
                            Select cti section ids
                          </option>
                          {ctiSectionId.map((item: any, index: any) => (
                            <option key={item.ctiSection} value={item.ctiSection}>{`Section id -${index + 1
                              }`}</option>
                          ))}
                        </select>
                      </p>
                    </div>
                  </div>
                  <div className='flex justify-between items-center'>
                    <div className='text-white h-[28px]  px-4 rounded-full inline-block border border-2 border-white mt-0'>
                      {`${ctiSectionId?.length} Sections Found`}
                    </div>
                    <div>
                      <button
                        disabled={contentSection?.content ? false : true}
                        className='bg-transparent text-white p-2'
                        onClick={copyToClipboardContent}
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                        >
                          <path
                            d='M10.5 2.0028C9.82495 2.01194 9.4197 2.05103 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8.05103 3.4197 8.01194 3.82495 8.0028 4.5M19.5 2.0028C20.1751 2.01194 20.5803 2.05103 20.908 2.21799C21.2843 2.40973 21.5903 2.71569 21.782 3.09202C21.949 3.4197 21.9881 3.82494 21.9972 4.49999M21.9972 13.5C21.9881 14.175 21.949 14.5803 21.782 14.908C21.5903 15.2843 21.2843 15.5903 20.908 15.782C20.5803 15.949 20.1751 15.9881 19.5 15.9972M22 7.99999V9.99999M14.0001 2H16M5.2 22H12.8C13.9201 22 14.4802 22 14.908 21.782C15.2843 21.5903 15.5903 21.2843 15.782 20.908C16 20.4802 16 19.9201 16 18.8V11.2C16 10.0799 16 9.51984 15.782 9.09202C15.5903 8.71569 15.2843 8.40973 14.908 8.21799C14.4802 8 13.9201 8 12.8 8H5.2C4.0799 8 3.51984 8 3.09202 8.21799C2.71569 8.40973 2.40973 8.71569 2.21799 9.09202C2 9.51984 2 10.0799 2 11.2V18.8C2 19.9201 2 20.4802 2.21799 20.908C2.40973 21.2843 2.71569 21.5903 3.09202 21.782C3.51984 22 4.07989 22 5.2 22Z'
                            stroke={contentSection?.content ? '#fff' : '#8992A1'}
                            stroke-width='2'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                        </svg>
                      </button>
                    </div>
                    {showPopover2 && (
                      <div className='absolute  p-1 bg-white text-black rounded shadow z-10 top-[100px] ml-[120px]'>
                        Copied!
                      </div>
                    )}
                  </div>
                </div>
                <div className='text-gray-400'>
                  <div
                    className={`${contentSection?.content ? `overflow-y-scroll max-h-[454px]` : `h-[454px]`
                      } bg-gray-900 flex p-6 border border-[#3E4B5D] mt-2 w-full`}
                  >
                    <div>
                      {' '}
                      <MemoizedMarkdown content={contentSection?.content} />{' '}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {state?.platformName && (
        <div className='mx-auto  shadow-lg  overflow-hidden w-full relative'>
          <div className='shadow-lg w-full mt-2 '>
            <div className='grid grid-cols-12 gap-2'>
              {state?.platformName != 'view' && (
                <>
                  <div className='col-span-6'>
                    <div
                      style={{
                        height: `${dynamicHeight - 50}px`,
                        width: '100%',
                        textAlign: 'left',
                        overflowY: 'hidden',
                        backgroundColor: '#0C111D',
                        borderRadius: '8px',
                        // marginLeft: '20px',
                      }}
                    >
                      <YamlEditor
                        ymltext={ymltext}
                        setYmlText={setYmlText}
                        setSeloctror={() => { }}
                        modeOfView={'translate'}
                      />
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div
                      style={{
                        height: `${dynamicHeight - 50}px`,
                        width: '100%',
                        textAlign: 'left',
                        overflowY: 'hidden',
                        backgroundColor: '#0C111D',
                        borderRadius: '8px',
                      }}
                    >
                      <YamlTextEditorForQuery
                        ymltext={singlequery}
                        setSinglequery={setSinglequery}
                        setQueryValue={setQueryValue}
                        setSeloctror={() => { }}
                      />
                    </div>
                  </div>
                </>
              )}
              {state?.platformName == 'view' && (
                <>
                  <div className='col-span-12'>
                    <div className='flex items-center justify-between gap-4 p-4  w-full max-lg:flex-wrap'>
                      {/* Search Box */}
                      <div className=' max-lg:w-full'>
                        <div className='flex items-center space-x-2 bg-dark max-lg:w-full'>

                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className='flex items-center gap-4 ml-auto space-x-3'>
                        <div className='flex space-x-2'>
                          <svg
                            onClick={handleDownload}
                            xmlns='http://www.w3.org/2000/svg'
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            className={
                              'cursor-pointer'
                            }
                            fill='none'
                          >
                            <path
                              d='M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 10L12 15M12 15L7 10M12 15V3'
                              stroke='white'
                              stroke-width='2'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            />
                          </svg>
                        </div>
                        <Divider orientation='vertical' flexItem sx={{ borderColor: '#c2c8d3', mx: 2 }} />
                        <button
                          disabled={false}
                          className={`bg-orange-600 text-white py-1 px-4 rounded-lg ${'cursor-pointer'
                            }`}
                          onClick={() => handleOpenCollection('ctirule')}
                        >
                          Copy to Collection
                        </button>

                        <button
                          onClick={() => handleOpenInboxCollection('multipleInbox')}
                          // disabled={selectedRows?.length == 0 && getCheckedValue.length == 0 ? true : false}
                          className={`bg-orange-600 text-white py-1 px-4 rounded-lg ${'cursor-pointer'
                            }`}
                        >
                          Copy to Detection Lab
                        </button>
                      </div>
                    </div>
                    <div
                      style={{
                        height: `${dynamicHeight - 50}px`,
                        width: '100%',
                        textAlign: 'left',
                        overflowY: 'hidden',
                        backgroundColor: '#0C111D',
                        borderRadius: '8px',
                      }}
                    >
                      <YamlEditor
                        ymltext={ymltext}
                        setYmlText={setYmlText}
                        setSeloctror={() => { }}
                        modeOfView={'translate'}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* {opendilog && (
        <SigmaFilesViewPopup onClose={handleCancelTraslate} translate={handleOpenTraslate} />
      )} */}

      <CopyAndNewCollectionsDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setDialogOpen(false), setSingleparams(null)
        }}
        selectedRows={singleparams ? [singleparams] : selectedRows}
        collectiondata={collectiondata}
        pramasdata={collectionorcti}
        setDialogOpen={setDialogOpen}
        importId={(sigmadetail?.datavault?.category == "DAC" || sigmadetail?.datavault?.category == "IMPORTED") ? sigmadetail?.datavault?.id : null}
      />
    </div>
  )
}
