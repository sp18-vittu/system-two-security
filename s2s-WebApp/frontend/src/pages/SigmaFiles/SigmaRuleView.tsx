import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material'
import {
  getExecuteQuery,
  SingleTranslateFileList,
  TargetFileList,
} from '../../redux/nodes/py-sigma/action'
import { useData } from '../../layouts/shared/DataProvider'
import {
  inspectCtiSectionId,
  inspectFactorySigmaId,
  inspectGeneratedSigmaId,
} from '../../redux/nodes/Inspects/action'
import api from '../../redux/nodes/api'
import local from '../../utils/local'
import Axios from 'axios'
import {
  CREATE_VIEWFILE_VAULT_FAILED,
  CREATE_VIEWFILE_VAULT_SUCCESS,
} from '../../redux/nodes/repository/action'
import YamlEditor from '../datavault/YamlEditor'
import useWindowResolution from '../../layouts/Dashboard/useWindowResolution'
import { Accordion, AccordionDetails } from '@mui/material'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import FileCopyIcon from './FileCopyIcon'
import DownloadIcon from './DownloadIcon'
import { environment } from '../../environment/environment'
import YamlTextEditorForQuery from '../datavault/YamlTextEditorForQuery'
import { sigmaFileList } from '../../redux/nodes/sigma-files/action'
import RuleChatDialog from './RuleChatDialog'
import { yamlFileUpdate, yamlFileValidation } from '../../redux/nodes/Collections/action'
import CustomToast from '../../layouts/App/CustomToast'
import toast from 'react-hot-toast'
import ConfirmationDialog from './ConfirmationDialog'
const yaml = require('js-yaml')
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ReactMarkdown from 'react-markdown'

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

function SigmaRuleView() {
  const { id } = useParams()
  const {
    authordetails,
    setAuthordetails,
    setSigmaViewwss,
    yamlEditorOpen,
    setYamlEditorOpen,
    yamlEditorFiles,
    setYamlEditorFiles,
    setYamlChatOpen,
  }: any = useData()
  const dispatch = useDispatch()
  const location = useLocation()
  const navigateTo = useNavigate()
  const { state } = location
  const { sigmadetail } = state
  const Token = local.getItem('bearerToken')
  const token = JSON.parse(Token as any)
  const [sigmadata, setSigmadata] = useState(sigmadetail as any)
  const [activeTab, setActiveTab] = useState<any>(1)
  const [selectTargers, setSelectTargers] = React.useState([])
  const [disable, setDisable] = useState(true)
  const [targetId, setTargetId] = useState(null as any)
  const [ctiSectionId, setCtiSectionId] = useState([] as any)
  const [ymltext, setYmlText] = useState('Processing...' as any)
  const [showPopover, setShowPopover] = useState(false)
  const { height } = useWindowResolution()
  const dynamicHeight = Math.max(400, height * 0.8)
  const [singlequery, setSinglequery] = useState(null as any)
  const [transQuerylist, setTransQuerylist] = useState([] as any)
  const [queryvalue, setQueryValues] = useState(null as any)
  const [searchValue, setsearchValue] = useState([] as any)
  const [filterState, setFilterState] = React.useState([] as any)
  const [messages, setMessages] = useState<any[]>([])
  const [validbutton, setValidbutton] = useState(null as any)
  const [yamlOpen, setYamlOpen] = useState(false as any)
  const [isOpen, setIsOpen] = useState(false)
  const [contentSection, setContentSection] = useState<any>('')
  const [isOpengrid, setIsOpenGrid] = useState(false)
  const [selectCtiSectionId, setSelectCtiSectionId] = useState<any>(null)
  const [showPopover2, setShowPopover2] = useState(false)

  const toggleSidebar = () => {
    setIsOpenGrid(!isOpengrid)
  }

  const tabs = [
    { id: 1, label: 'Detection Rule', value: 'Detection Rule', isActive: activeTab === 1 },
    { id: 2, label: 'Translation', value: 'Translation', isActive: activeTab === 2 },
    // { id: 4, label: 'Inspect', value: 'Inspect', isActive: activeTab === 4 },
  ]
  const [expandedIndex, setExpandedIndex] = useState<number | false>(false)
  const [copyIndex, setCopyIndex] = useState<any>(0)
  const handleChange = (index: number) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? false : index))
  }

  const handlechatNavigate = () => {
    setYamlChatOpen(true)
    navigateTo(`/app/sigmarulechats/${id}`, {
      state: {
        yamlText: ymltext,
        vaultId: Number(sigmadetail?.datavault?.id),
        singmaname: state?.singmaname,
        sigmadetail: state?.sigmadetail,
        title: state?.title,
        platformName: state?.platformName,
        paramsdata: state?.paramsdata,
        chatHistory: state?.chatHistory

      },
    });
    sessionStorage.removeItem('schatid')
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const closeDialog = () => setIsDialogOpen(false)

  const extractId = (str: string): string | null => {
    const idMatch = str.match(/id:\s([a-f0-9-]+)/i)
    return idMatch ? idMatch[1] : null
  }

  useEffect(() => {
    dispatch(TargetFileList() as any).then((data: any) => {
      setSelectTargers(data.payload)
    })
    translateYmlText()
    fetchdetails()
  }, [])

  useEffect(() => {
    if (state?.tab) {
      setActiveTab(state?.tab)
      if (state?.tab == 2) {
        setExpandedIndex(0)
      }
    } else {
      setActiveTab(1)
    }
  }, [state?.tab])
  const fetchdetails = () => {
    dispatch(sigmaFileList(token, Number(sigmadetail?.datavault?.id)) as any).then((data: any) => {
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
            setAuthordetails(parsedJSON)
            setYamlEditorFiles(fileText)
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

  const handleClickTargersingle = (e: any) => {
    if (e.target.value) {
      setDisable(false)
      setTargetId(e.target.value)
    } else {
      setDisable(true)
      setTargetId(null)
    }
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
    }
  }
  const copyToClipboard = () => {
    navigator.clipboard.writeText(ymltext)
    setShowPopover(true)
    setTimeout(() => {
      setShowPopover(false)
    }, 2000)
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
        }
      })
    }
  }

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

  const copyToClipboardTrans = (index: any) => {
    setCopyIndex(index)
    navigator.clipboard.writeText(transQuerylist[index])
    setShowPopover(true)
    setTimeout(() => {
      setShowPopover(false)
    }, 2000)
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

  // *****************************************Rule Chat******************************************
  const handelValidation = (yamlTexts: any, params: any) => {
    if (params != 'viewvalidation') {
      const jsonString = JSON.parse(sessionStorage.getItem('ymal') as any)
      const validation = {
        sigma_rule: jsonString,
      }
      dispatch(yamlFileValidation(validation) as any).then((res: any) => {
        if (res.type == 'VALIDATION_YAML_FILE_SUCCESS') {
          if (res?.payload.valid) {
            setIsDialogOpen(false)
            toast.success(
              <CustomToast
                message={`Validated Successfully `}
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
            let parsedJSON = yaml.load(yamlTexts)
            const blob = new Blob([yamlTexts], { type: 'text/plain' })
            const file = new File([blob], `${parsedJSON?.title}.yml`, { type: 'text/plain' })
            const data = new FormData()
            data.append('file', file)
            dispatch(yamlFileUpdate(Number(sigmadetail?.datavault?.id), id, data) as any).then((res: any) => {
              if (res.type == 'UPDATE_YAML_FILE_SUCCESS') {
                setYamlEditorOpen(false)
                setSigmaViewwss(true)
                setIsOpenGrid(false)
                setValidbutton(null)
                toast.success(
                  <CustomToast
                    message='Rule Updated SuccessFully!'
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
            setValidbutton(null)
            setMessages((prevMessages: any) => [
              ...prevMessages,
              { ...res?.payload, message: null, question: false },
            ])
          }
        }
      })
    } else {
      const validation = {
        sigma_rule: ymltext,
      }
      dispatch(yamlFileValidation(validation) as any).then((res: any) => {
        if (res.type == 'VALIDATION_YAML_FILE_SUCCESS') {
          if (res?.payload.valid) {
            setValidbutton(res?.payload.valid)
            setIsOpenGrid(false)
            toast.success(
              <CustomToast
                message={`Validated Successfully`}
                onClose={() => toast.dismiss()} // Dismiss only this toast
              />,
              {
                duration: 6000,
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
                message={`Validation failed with ${res?.payload?.errors?.length} errors`}
                onClose={() => toast.dismiss()} // Dismiss only this toast
              />,
              {
                duration: 6000,
                position: 'top-center',
                style: {
                  background: '#fff',
                  color: '#000', // White text color
                  width: '500px',
                },
              },
            )
            setIsOpenGrid(true)
            setValidbutton(res?.payload)
          }
        }
      })
    }
  }

  const hanleYmalSave = () => {
    let parsedJSON = yaml.load(ymltext)
    const blob = new Blob([ymltext], { type: 'text/plain' })
    const file = new File([blob], `${parsedJSON?.title}.yml`, { type: 'text/plain' })
    const data = new FormData()
    data.append('file', file)
    dispatch(yamlFileUpdate(Number(sigmadetail?.datavault?.id), id, data) as any)
      .then((res: any) => {
        if (res.type == 'UPDATE_YAML_FILE_SUCCESS') {
          setSigmaViewwss(true)
          setYamlEditorOpen(false)
          setValidbutton(null)
          translateYmlText()
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
          navigateTo(`/app/sigmaruleview/${id}`, {
            state: {
              yamlText: ymltext,
              vaultId: Number(sigmadetail?.datavault?.id),
              singmaname: state.singmaname,
              sigmadetail: state.sigmadetail,
              title: state.title,
              platformName: state.platformName,
              paramsdata: state.paramsdata,
              chatHistory: null,
            },
          })
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
      .catch((error: any) => { })
  }

  const hanleYmalDiscardEdits = () => {
    setYmlText(yamlEditorFiles)
    setIsOpen(false)
    setYamlEditorOpen(false)
    setIsOpenGrid(false)
    setValidbutton(null)
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

  const copyToClipboardContent = () => {
    navigator.clipboard.writeText(contentSection?.content)
    setShowPopover2(true)
    setTimeout(() => {
      setShowPopover2(false)
    }, 2000)
  }

  return (
    <div className=' p-6'>
      <div className='w-full h-auto bg-[#0F121B] flex justify-center items-center mt-[-18px]'>
        <div className='w-full p-4  max-w-full  bg-[#1D2939] rounded-lg flex flex-wrap  grid grid-cols-12 gap-2 max-lg:gap-4'>
          <div className='col-span-7 max-lg:col-span-12'>
            <div className='flex flex-col items-start gap-2 w-full md:w-auto'>
              <div className='text-white text-xl font-semibold leading-8'>Summary</div>
              <div className='flex-1 text-[#98A2B3] text-base font-normal leading-5 w-full md:w-auto break-words line-clamp-2'>
                {authordetails?.description}
              </div>
            </div>
          </div>
          <div className='col-span-5 max-lg:col-span-12 h-full'>
            <div className='flex flex-row justify-end gap-8 max-md:flex-row max-lg:justify-between h-full'>
            <div className='hidden lg:block w-[2px] h-full bg-[#475467]' />

              <div className='flex flex-col gap-2 items-center justify-center'>
                <div className='text-[#98A2B3] text-[14px] sm:text-[16px] font-normal'>Created</div>
                <div className='text-white text-[16px] sm:text-[18px] font-semibold'>
                  {moment(authordetails?.date).format('YYYY/MM/DD')}
                </div>
              </div>

              <div className='hidden lg:block w-[2px] h-full bg-[#475467]' />

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
      <div className='mx-auto  shadow-lg  overflow-hidden w-full relative mt-[18px]'>
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
      </div>
      {activeTab == 1 && (
        <>
          <div className='flex items-center justify-between gap-4  w-full  mt-4 max-md:flex-col'>
            {/* Search Box */}
            <div className='max-md:self-start'>
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
                  className={`bg-orange-500 text-white px-4 py-2 rounded-lg shadow-sm max-sm:text-[14px] max-sm:px-[8px] ${disable ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#6941C6]'
                    } `}
                >
                  Translate Now
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex items-center gap-4 ml-auto space-x-3'>
              <div className='flex space-x-4 items-center'>
                <BootstrapTooltip title={'Copy'} arrow placement='bottom'>
                  <svg
                    onClick={() => copyToClipboard()}
                    className={'cursor-pointer'}
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <path
                      d='M8 8V5.2C8 4.0799 8 3.51984 8.21799 3.09202C8.40973 2.71569 8.71569 2.40973 9.09202 2.21799C9.51984 2 10.0799 2 11.2 2H18.8C19.9201 2 20.4802 2 20.908 2.21799C21.2843 2.40973 21.5903 2.71569 21.782 3.09202C22 3.51984 22 4.0799 22 5.2V12.8C22 13.9201 22 14.4802 21.782 14.908C21.5903 15.2843 21.2843 15.5903 20.908 15.782C20.4802 16 19.9201 16 18.8 16H16M5.2 22H12.8C13.9201 22 14.4802 22 14.908 21.782C15.2843 21.5903 15.5903 21.2843 15.782 20.908C16 20.4802 16 19.9201 16 18.8V11.2C16 10.0799 16 9.51984 15.782 9.09202C15.5903 8.71569 15.2843 8.40973 14.908 8.21799C14.4802 8 13.9201 8 12.8 8H5.2C4.0799 8 3.51984 8 3.09202 8.21799C2.71569 8.40973 2.40973 8.71569 2.21799 9.09202C2 9.51984 2 10.0799 2 11.2V18.8C2 19.9201 2 20.4802 2.21799 20.908C2.40973 21.2843 2.71569 21.5903 3.09202 21.782C3.51984 22 4.07989 22 5.2 22Z'
                      stroke='white'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                </BootstrapTooltip>
                {showPopover && (
                  <div className='absolute  p-1 bg-white text-black rounded shadow z-10 mt-16'>
                    Copied!
                  </div>
                )}
                <BootstrapTooltip title={'Download'} arrow placement='bottom'>
                  <svg
                    onClick={() => detectionRuleDownload(ymltext)}
                    xmlns='http://www.w3.org/2000/svg'
                    className={'cursor-pointer'}
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
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
                </BootstrapTooltip>
              </div>
              <button
                onClick={handlechatNavigate}
                className={`bg-orange-600 text-white py-1 px-4 rounded-lg  flex flex-row  cursor-pointer items-start justify-center`}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='mt-1 mr-2'
                  width='19'
                  height='18'
                  viewBox='0 0 19 18'
                  fill='none'
                >
                  <path
                    d='M8.00543 3.15275C8.12144 2.84687 8.58195 2.84687 8.69796 3.15275C9.18856 4.4465 10.1318 6.69639 11.075 7.63955C12.0206 8.58521 14.1573 9.53087 15.3746 10.0204C15.6719 10.1399 15.6719 10.5859 15.3746 10.7054C14.1572 11.1949 12.0206 12.1406 11.075 13.0861C10.1318 14.0293 9.18856 16.2793 8.69796 17.573C8.58195 17.8788 8.12144 17.8788 8.00543 17.573C7.51483 16.2793 6.57163 14.0293 5.62843 13.0861C4.68522 12.1429 2.43529 11.1998 1.14153 10.7092C0.835638 10.5932 0.835638 10.1327 1.14152 10.0167C2.43528 9.52597 4.68522 8.58276 5.62843 7.63955C6.57163 6.69639 7.51483 4.4465 8.00543 3.15275Z'
                    fill='white'
                  />
                  <path
                    d='M14.7983 0.424334C14.9238 0.122227 15.3958 0.122227 15.5213 0.424334C15.7819 1.05204 16.1517 1.8234 16.5214 2.19316C16.8934 2.56519 17.6342 2.93723 18.2296 3.19818C18.523 3.32679 18.523 3.78289 18.2296 3.91148C17.6342 4.17241 16.8934 4.54442 16.5214 4.91646C16.1517 5.2862 15.7819 6.05757 15.5213 6.68527C15.3958 6.98738 14.9238 6.98738 14.7983 6.68527C14.5377 6.05757 14.1678 5.2862 13.7981 4.91646C13.4283 4.54671 12.657 4.17697 12.0292 3.91629C11.7272 3.79082 11.7272 3.31885 12.0292 3.19336C12.657 2.93266 13.4283 2.5629 13.7981 2.19316C14.1678 1.8234 14.5377 1.05204 14.7983 0.424334Z'
                    fill='white'
                  />
                  <path
                    d='M1.62037 2.23405C1.75733 1.93696 2.2381 1.93696 2.37505 2.23405C2.53053 2.57134 2.71802 2.91369 2.90549 3.10116C3.09545 3.29113 3.42964 3.4811 3.75402 3.63779C4.04251 3.77716 4.04251 4.24075 3.75402 4.38011C3.42963 4.53679 3.09545 4.72675 2.90549 4.91671C2.71802 5.10418 2.53053 5.44653 2.37505 5.78382C2.2381 6.08091 1.75733 6.08091 1.62037 5.78382C1.46488 5.44653 1.2774 5.10418 1.08993 4.91671C0.902464 4.72924 0.560121 4.54177 0.222829 4.38629C-0.0742672 4.24933 -0.0742808 3.76857 0.222815 3.63161C0.560107 3.47611 0.902464 3.28863 1.08993 3.10116C1.2774 2.91369 1.46488 2.57134 1.62037 2.23405Z'
                    fill='white'
                  />
                </svg>
                <span>Chat</span>
              </button>
            </div>
          </div>

          <div className='mx-auto  shadow-lg  overflow-hidden w-full relative'>
            <div className='shadow-lg w-full mt-4 '>
              <div className='grid grid-cols-12 gap-3 transition-all duration-500'>
                {validbutton?.errors?.length > 0 && yamlEditorOpen && (
                  <div
                    className={`${isOpengrid ? 'col-span-4' : 'col-span-1'
                      } transition-all duration-500 flex flex-row`}
                  >
                    <div
                      style={{
                        height: `${dynamicHeight - (yamlEditorOpen ? 250 : 180)}px`,
                        width: '100%',
                        textAlign: 'left',
                        overflowY: 'hidden',
                        backgroundColor: '#0C111D',
                        borderRadius: '8px',
                      }}
                    >
                      <div className='w-full h-full p-6 bg-[#1D2939] rounded-lg flex flex-col justify-start items-start gap-2'>
                        {isOpengrid && (
                          <>
                            <div className='text-white text-sm font-medium leading-5'>
                              Validation Errors{' '}
                              <span className='text-[#667085]'>{`(${validbutton?.errors?.length} Errors found)`}</span>
                            </div>
                            <ul className='list-disc list-inside text-red-700 self-stretch text-[#F04438] text-base font-medium leading-6'>
                              {validbutton?.errors?.map((error: any, index: any) => (
                                <li key={index}>{error}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    </div>
                    <div
                      onClick={toggleSidebar}
                      className='flex justify-center items-center ml-2 cursor-pointer'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='4'
                        height='61'
                        viewBox='0 0 4 61'
                        fill='none'
                      >
                        <path
                          d='M2 2.5V58.5'
                          stroke='#475467'
                          strokeWidth='4'
                          strokeLinecap='round'
                        />
                      </svg>
                    </div>
                  </div>
                )}
                <div
                  className={`${isOpengrid
                    ? 'col-span-8'
                    : validbutton?.errors?.length > 0 && !isOpengrid && yamlEditorOpen
                      ? 'col-span-11'
                      : 'col-span-12'
                    } transition-all duration-500`}
                >
                  <div
                    style={{
                      height: `${dynamicHeight - (yamlEditorOpen ? 250 : 180)}px`,
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
        </>
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
                          className={`bg-orange-500 text-white py-2 px-6 rounded-md max-sm:text-[14px] max-sm:px-[8px] ${targetId ? `bg-orange-500` : `cursor-not-allowed opacity-50 hover`
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
                              <div className='flex items-center space-x-2 w-[50%]'>
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

                              {/* <div>
                                                                <span className="text-gray-400 text-sm md:text-base">0 Executions</span>
                                                            </div> */}
                              <div className='flex space-x-3 md:space-x-4 flex-col md:flex-row'>
                                <div>
                                  <span className='text-green-400 text-sm md:text-base w-full'>
                                    Up to date
                                  </span>
                                </div>
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
                                setQueryValue={() => { }}
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
                                setQueryValue={() => { }}
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
                        setQueryValue={() => { }}
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
                        ymltext={
                          singlequery
                            ? singlequery
                            : 'Translation of your sigma file(s) is in progress...'
                        }
                        setSinglequery={setSinglequery}
                        setQueryValue={() => { }}
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
                      setQueryValue={() => { }}
                      setSeloctror={() => { }}
                    />
                  </div>
                </AccordionDetails>
              </Accordion>
            )
          )}
        </div>
      )}

      {activeTab == 4 && (
        <div>
          <div className='flex flex-col p-2 mt-[-5px]'>
            <div className='flex justify-between items-center space-x-2 pb-2 max-sm:flex-wrap gap-2'>
              <div className='max-sm:w-full'>
                <div className='flex items-center space-x-2 bg-dark max-sm:w-full'>
                  <p className=' max-sm:w-full'>
                    <span className='text-slate-400 font-inter text-base font-normal leading-5'>
                      Select CTI Section
                    </span>
                    <br />
                    <select
                      value={selectCtiSectionId}
                      onChange={(e: any) => handleChangeSectionId(e)}
                      className='bg-white text-black px-4 py-2 w-64 mt-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 max-sm:w-full'
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
              <div className='flex justify-between items-center max-sm:!ml-auto'>
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
                  <div className='absolute  p-1 bg-white text-black rounded shadow z-10 top-[320px] ml-[120px]'>
                    Copied!
                  </div>
                )}
              </div>
            </div>
            <div className='text-gray-400'>
              <div
                className={` bg-gray-900 flex p-6 border border-[#3E4B5D] mt-2 w-full overflow-y-scroll`}
                style={{
                  height: `${dynamicHeight - 250}px`,
                  width: '100%',
                  textAlign: 'left',
                  overflowY: 'scroll',
                  backgroundColor: '#0C111D',
                  borderRadius: '8px',
                }}
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

      <ConfirmationDialog
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
        }}
        onConfirm={hanleYmalDiscardEdits}
        message='Are you sure you want to discard?'
      />

      <RuleChatDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        ymltext={ymltext}
        handelValidation={handelValidation}
        messages={messages}
        setMessages={setMessages}
        yamlOpen={yamlOpen}
        setYamlOpen={setYamlOpen}
      />

      {yamlEditorOpen && activeTab===1 && (
        <div
          className={`transition-all mt-2 duration-500 ease-in-out ${yamlEditorOpen
            ? 'transform translate-y-0 opacity-100'
            : 'transform translate-y-full opacity-0'
            } flex justify-between items-center bg-[#2C3A4F] rounded-lg px-6 py-4`}
          style={{
            width: '100%',
            height: '68px',
            zIndex: 50, // Add z-index to control the stacking order
          }}
        >
          {/* Left Section */}
          <div className='flex items-center gap-3'>
            <div className='text-white text-base font-semibold leading-6'>
              You are currently editing this rule and must validate changes before saving.
            </div>
            <button
              onClick={() => handelValidation(ymltext, 'viewvalidation')}
              className='flex justify-center items-center gap-2 w-24 px-4 py-2 border border-[#EE7103] rounded-lg shadow-sm text-[#EE7103] text-base font-semibold'
            >
              Validate
            </button>
          </div>

          {/* Right Section */}
          <div className='flex items-center gap-3'>
            <button
              onClick={() => setIsOpen(true)}
              className='flex justify-center items-center gap-2 w-34 px-4 py-2 bg-white rounded-lg shadow-sm text-[#0F121B] text-base font-semibold'
            >
              Discard Edits
            </button>
            <button
              onClick={() => hanleYmalSave()}
              disabled={
                (validbutton?.errors?.length > 0 ? !validbutton?.valid : !validbutton)
                  ? true
                  : false
              }
              className={`flex justify-center items-center gap-2 w-18 px-4 py-2 bg-orange-500 rounded-lg shadow-sm text-white text-base font-semibold ${(validbutton?.errors?.length > 0 ? !validbutton?.valid : !validbutton)
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer hover:bg-[#6941C6]'
                }`}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SigmaRuleView
