import { Box, MenuItem, tooltipClasses } from '@mui/material'
import Menu from '@mui/material/Menu'
import { DataGrid, gridClasses, GridColDef, GridSortModel } from '@mui/x-data-grid'
import Axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { environment } from '../../environment/environment'
import {
  ChatHistoryjSONDetails,
  chatSideList,
  getAddSourceId,
  updateAddSource,
} from '../../redux/nodes/chat/action'
import {
  CREATE_NEW_DATAINGESTION_RESET,
  DATAVAULT_DATAINGESTIONURL_RESET,
} from '../../redux/nodes/datavault/action'
import {
  REPOSITORY_DOC_DELETE_RESET,
  REPOSITORY_MULTI_DOC_DELETE_RESET,
  deletedocument,
  deletemultipledocument,
  repositoryDocList,
} from '../../redux/nodes/repository/action'
import local from '../../utils/local'
import {
  ctiReportFileList,
  getCtiReportVaultStatus,
  updateFileTitle,
} from '../../redux/nodes/cti-report/action'
import { TargetFileList, repBulkTranslateFileList } from '../../redux/nodes/py-sigma/action'
import YamlEditor from './YamlEditor'
import YamlTextEditor from './YamlTextEditor'

import { Tooltip, TooltipProps } from '@mui/material'
import { styled } from '@mui/system'
import { sigmaCitNameList } from '../../redux/nodes/sigma-files/action'
import { useData } from '../../layouts/shared/DataProvider'
import { feedlyGetStremeId } from '../../redux/nodes/feedlyform/action'
const yaml = require('js-yaml')
import { makeStyles } from '@mui/styles'
import Swal from 'sweetalert2'
import { createChat } from '../../redux/nodes/chatPage/action'
import moment from 'moment'
import useWindowResolution from '../../layouts/Dashboard/useWindowResolution'
import EditIcon from '@mui/icons-material/Edit'
import CopyandmoveDrawer from '../../components/Drawer/CopyandmoveDrawer'
import { sortByDateTime } from '../../utils/helper'

const useStyles = makeStyles((theme: any) => ({
  checkbox: {
    '& .MuiDataGrid-checkboxInput': {
      cursor: 'not-allowed !important',
      color: 'grey !important',
    },
  },
  uncheckbox: {
    '& .MuiDataGrid-checkboxInput': {
      color: 'white !important',
    },
  },
}))

const RepositoryGlobalSearch = () => {
  const { id } = useParams()

  const navigate = useNavigate()
  const { height } = useWindowResolution()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const {
    data,
    setData,
    setDetail,
    setInsightDetail,
    setCopyFiles,
    wssProvider,
    setWssProvider,
    globalSearch,
    setGlobalSearch,
    setCtiFileName,
  }: any = useData()
  const navigateTo = useNavigate()
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false)
  const [openoption, setopenoption] = useState(false)
  const [showModalRemove, setShowModalRemove] = useState(false)
  const [newchat, setnewchat] = useState(false)
  const [SampleKPMG, setSampleKPMG] = useState(false)
  const [showRemove, setRemove] = useState('')
  const [totalSelectedCheckboxes, setTotalSelectedCheckboxes] = useState([] as any)
  const [vaultList, setVaultList] = useState([] as any)
  const [vaultListdata, setVaultListdata] = useState([] as any)
  const [istranslating, setIsTranslating] = useState(false)

  const [workBenchName, setWorkBenchName] = useState('' as any)
  const checkbox: any = [false, false, false, false]
  const [NewtestValue, setNewTestValue] = useState([])
  const localToken = local.getItem('bearerToken')
  const token = JSON.parse(localToken as any)

  const [anchorE6, setAnchorE6] = React.useState(null)
  const [docId, setdocid] = useState()
  const [userdelete, Setuserdelete] = useState(null)
  const [getmultichechbox, setGetmultichechbox] = useState([])

  const vaultPermissionDetail = useSelector((state: any) => state.vaultPermissionDetailsreducer)
  const { vaultPermissionDetails } = vaultPermissionDetail
  const [vaultPermissionData, setvaultPermissionData] = useState([] as any)

  const repositoryDoclists = useSelector((state: any) => state.repositoryDocreducer)
  const { RepositoryDocList } = repositoryDoclists

  let [documentlist, setdocumentlist] = useState([] as any)
  if (documentlist) {
    sessionStorage.setItem('RepostoryData', JSON.stringify(documentlist))
  }
  const localStorage = local.getItem('auth')
  const locals = JSON.parse(localStorage as any)
  const roleDto = local.getItem('auth')
  const role = JSON.parse(roleDto as any)
  const roleDescription = role?.user?.user
  const getroleName = roleDescription?.roleDTO
  const userId = locals?.user?.user.id
  const [selectTargers, setSelectTargers] = React.useState([])

  const classes = useStyles()

  useEffect(() => {
    setvaultPermissionData(vaultPermissionDetails)
  }, [vaultPermissionDetails])
  useEffect(() => {
    dispatch(TargetFileList() as any).then((data: any) => {
      setSelectTargers(data.payload)
    })
  }, [])
  let readerpermission: any
  if (vaultPermissionData) {
    readerpermission = vaultPermissionData?.filter((item: any) => {
      return userId === item.synthUser?.id && item?.access !== 'READER'
    })
  }

  const deletedocumemt = useSelector((state: any) => state.docdeletereducer)
  const { success: removesuccess } = deletedocumemt

  const deleteAll = useSelector((state: any) => state.docdeleteAllreducer)
  const { success: removesuccessAll } = deleteAll
  const savedocumemt = useSelector((state: any) => state.dataIngestionereducer)
  const { loading, success: savesuccess } = savedocumemt

  let setuploaddocuments: any = JSON.parse(sessionStorage.getItem('uploaddetails') || '[]')

  useEffect(() => {
    setvaultPermissionData(vaultPermissionDetails)
  }, [])

  if (documentlist) {
    sessionStorage.setItem('RepostoryData', JSON.stringify(documentlist))
  }
  const CustomNoRowsOverlay = () => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#FFF',
          backgroundColor: '#0C111D',
          padding: '16px',
          textAlign: 'center',
          height: '340px',
        }}
      >
        <div>No rows</div>
      </div>
    )
  }

  useEffect(() => {
    if (loading) {
      let empty: any = []
      empty = [...RepositoryDocList, ...setuploaddocuments]
      setdocumentlist(empty)
    } else {
      setdocumentlist(RepositoryDocList)
      sessionStorage.removeItem('uploaddetails')
    }
  }, [loading, RepositoryDocList])
  const saveurl = useSelector((state: any) => state.dataingestionUrlreducer)
  const { success: saveUrlsuccess } = saveurl

  const chatDetailnewlists = useSelector((state: any) => state.chatDetailreducer)
  const { chatDetaillist } = chatDetailnewlists

  const feedlyCTiPos = useSelector((state: any) => state.feedlyCTiPostreducer)
  const { success: feedlyCTiPostsuccess, feedlycti } = feedlyCTiPos
  const link: string = ''

  const [getdatacheck, setGetdatacheck] = useState([])
  const location = useLocation()

  useEffect(() => {
    if (location?.state) {
      setGetdatacheck([])
      setTotalSelectedCheckboxes([])
    }
  }, [location?.state])

  const onModalOpen = () => {
    setShowModal(false)
    setnewchat(true)
  }

  const [viewprams, setveiwprams] = useState(null as any)

  const [openTranslatePopup, setOpenTranslatePopup] = useState(false)

  const [disable, setDisable] = useState(true)
  const [closePopupDisable, setclosePopupDisable] = useState(false)
  const [bulkDownload, setBulkDownload] = useState(true)

  const [bulkprams, setBulkprams] = useState(null as any)

  const [ymltextbluk, setYmlTextBluk] = useState(null as any)
  const bulkTranslate = async (e: any, params: any) => {
    let valueget: any = []
    dispatch(sigmaCitNameList(token, viewprams.row) as any).then((data: any) => {
      data.payload?.map((item: any) => {
        valueget.push(item.name)
      })
      const yamlText = yaml.dump(valueget, { lineWidth: -1 })
      setYmlTextBluk(yamlText)
      setAnchorE6(null)
      setOpenTranslatePopup(true)
      setBulkprams(viewprams.row)
    })
  }

  const inspectSigmas = (e: any, params: any) => {
    setDetail({ from: 'RepositoryInspectSigmas', value: viewprams.row })
    navigateTo(`/app/VaultPermission/${viewprams?.row?.datavault?.id}`)
  }

  const onViewPoppup = (e: any, params: any) => {
    navigateTo(`/app/insightCard/${viewprams?.row?.datavault?.id}`)
    sessionStorage.setItem('insightdata', JSON.stringify(viewprams.row))
    setInsightDetail(viewprams.row)
    setAnchorE6(null)
  }

  const onViewimage = async (e: any, params: any) => {
    setAnchorE6(null)
    const linkUrl = viewprams.row.url
    window.open(linkUrl, '_blank')
  }

  const chatclose = () => {
    setnewchat(false)
    reset()
  }

  const existingclose = () => {
    setShowModal(false)
    reset()
  }

  // Filter Function
  let Initial_value: any = []
  let update_value: any = []
  let uncheck_value: any = []
  let final_value: any = []

  const filterfunction = (e: any, i: any, value: any) => {
    checkbox[i] = e.target.checked
    if (e.target.checked === true) {
      let filter = RepositoryDocList.filter((repo: any) => {
        if (value.type == repo.type) {
          Initial_value.push(repo)
        }
      })
      update_value = [...Initial_value, ...NewtestValue]
      setNewTestValue(update_value)
    } else {
      for (let i = 0; i < checkbox.length; i++) {
        if (checkbox[i]) {
          uncheck_value = []
          setNewTestValue([])
          setNewTestValue(uncheck_value)
        } else {
          final_value.push(checkbox[i])
          if (final_value.length == 4) {
            setNewTestValue([])
          }
        }
      }
    }
  }

  const [openActOnSelect, setOpenActOnSelect] = useState(null)

  const [copyFileOpen, setCopyFileOpen] = useState(false)
  const handleActOnMenuClose = () => {
    setOpenActOnSelect(null)
  }
  const shareFile = (event: any, arr: any, value: string) => {
    event.stopPropagation()
    handleActOnMenuClose()
    setCopyFileOpen(true)
    setCopyFiles({ from: 'repository', value: { totalSelectedCheckboxes: arr, mode: value } })
  }

  const [message, setMessage] = useState([])

  let getDocs: any = []
  let repoPost: any = []
  const addTochat = (message: any) => {
    dispatch(chatSideList(token, userIdchat) as any)
    message.map((item: any) => {
      let x = {
        id: item.id,
      }
      getDocs.push(x)
    })

    let repo_Doc = {
      id: id,
      documents: getDocs,
    }
    repoPost.push(repo_Doc)
    sessionStorage.setItem('sessionVault', JSON.stringify(repoPost))
  }

  const { getAddSourceDetail } = useSelector((state: any) => state.getAddSourcereducer)
  let existDoc = getAddSourceDetail?.sessionVaults?.find((item: any) => item.id == id)

  const refId = useRef()

  const getChatId = (e: any) => {
    let chatId = e.target.value
    refId.current = chatId
    dispatch(getAddSourceId(token, chatId) as any)
  }

  let vaultID: any = []
  const userIdchat = locals?.user?.user?.id

  // Multidelete Section

  const onmultipleDelete = (totalSelectedCheckboxes: any) => {
    setGetmultichechbox(totalSelectedCheckboxes)
    setShowModalRemove(true)
  }

  const remove = () => {
    if (getmultichechbox.length > 0) {
      let multiple_delete: any = []
      getmultichechbox.map((item: any) => {
        multiple_delete.push(item.id)
      })
      dispatch(deletemultipledocument(token, multiple_delete) as any)
      setGetmultichechbox([])
      setShowModalRemove(false)
    } else {
      dispatch(deletedocument(token, userdelete) as any).then((res: any) => {
        if (res.type == 'REPOSITORY_DOC_DELETE_SUCCESS') {
          CTIreload()
          setRemove(userdelete as any)
          Setuserdelete(null)
          setShowModalRemove(false)
        }
      })
    }
  }

  const vault = sessionStorage.getItem('vault')
  const selectedVault = JSON.parse(vault as any)

  useEffect(() => {
    CTIreload()
    if (!removesuccess && !savesuccess && !showRemove && !saveUrlsuccess) {
      dispatch(repositoryDocList(token, selectedVault) as any)
    }
    if (removesuccess) {
      dispatch({ type: REPOSITORY_DOC_DELETE_RESET })
    }
    if (removesuccessAll) {
      dispatch({ type: REPOSITORY_MULTI_DOC_DELETE_RESET })
    }
    if (savesuccess) {
      dispatch({ type: CREATE_NEW_DATAINGESTION_RESET })
    }
    if (saveUrlsuccess) {
      dispatch({ type: DATAVAULT_DATAINGESTIONURL_RESET })
    }
    if (showRemove) {
      setTimeout(() => {
        setRemove('')
      }, 2000)
    }
  }, [showRemove, removesuccessAll, removesuccess, savesuccess, saveUrlsuccess, id])

  const onAddChat = (data: any) => {
    let cureentVaults = getAddSourceDetail?.sessionVaults

    if (existDoc?.documents?.length > 0) {
      const results = message.filter(
        (item1: any) => !existDoc?.documents?.some((item2: any) => item2.id === item1.id),
      )
      const results1 = message.filter((item1: any) =>
        existDoc?.documents?.some((item2: any) => item2.id === item1.id),
      )

      let z: any = []
      results?.map((item: any) => {
        let y = {
          id: item.id,
        }
        z.push(y)
      })

      let arr = [...existDoc?.documents, ...z]

      if (arr.length > 0) {
        let x = {
          id: Number(id),
          documents: arr,
        }

        cureentVaults.map((doc: any) => {
          if (doc.id == x.id) {
            doc.documents = x.documents
          }
        })

        const UpdatedataVaultChat = {
          sessionName: getAddSourceDetail.sessionName,
          sessionVaults: cureentVaults,
          sessionSourceValue: 1,
        }
        dispatch(updateAddSource(UpdatedataVaultChat, getAddSourceDetail.id) as any)
        navigateTo(`/app/history/newchat/${refId.current}`)
        sessionStorage.setItem('active', 'Chats')
        setShowModal(false)
      }
    } else {
      let z: any = []
      message?.map((item: any) => {
        let y = {
          id: item.id,
        }
        z.push(y)
      })

      let currentDocArr: any = []

      let x = {
        id: Number(id),
        documents: z,
      }
      currentDocArr.push(x)

      let DocArr = [...getAddSourceDetail?.sessionVaults, ...currentDocArr]

      const UpdatedataVaultChat = {
        sessionName: getAddSourceDetail.sessionName,
        sessionVaults: DocArr,
        sessionSourceValue: 1,
      }
      dispatch(updateAddSource(UpdatedataVaultChat, getAddSourceDetail.id) as any)
      navigateTo(`/app/history/newchat/${refId.current}`)
      sessionStorage.setItem('active', 'Chats')
      setShowModal(false)
    }
  }

  const onAddnewChat = async (data1: any) => {
    setCtiFileName(totalSelectedCheckboxes[0])
    sessionStorage.setItem('createNewChat', JSON.stringify({ createNewChat: true }))
    const chatObj = { sessionName: workBenchName }
    const selectFiles = {
      vaultId: id,
      id: totalSelectedCheckboxes[0].id,
      urlSHA256: totalSelectedCheckboxes[0].urlSHA256,
      mitreLocation: null,
      global: false,
      sessionItem: true,
    }
    dispatch(createChat(selectFiles, chatObj) as any).then((response: any) => {
      if (response.type == 'CREATE_CHAT_SUCCESS') {
        navigateTo(`/app/chatworkbench/${response.payload.id}`, { state: selectFiles })
        sessionStorage.setItem('active', 'Chats')
      }
    })
  }

  const delpopupDropdown = () => {
    {
      openoption ? setopenoption(false) : null
    }
  }

  const opendot = Boolean(anchorE6)

  const handleClickdot = (event: any, params: any) => {
    setveiwprams(params)
    if (getroleName?.roleName === 'SUPER_ADMIN') {
      setAnchorE6(event.currentTarget)
    } else {
      setAnchorE6(event.currentTarget)
    }
    Setuserdelete(params.row.id)
    setdocid(params.row.id)
    if (params.row.ctiName != 'undefined') {
      setEditTitle(params.row.ctiName)
    } else {
      const url = params?.row?.url
      const urlParts = url?.split('/')
      let name = urlParts[urlParts?.length - 1]
      const urlNameValue = name?.split('.')[0]
      setEditTitle(urlNameValue)
    }
  }

  const handleClosing = () => {
    setAnchorE6(null)
  }

  let {
    register: registerEdit,
    handleSubmit: editFileSubmit,
    reset: editReset,
    setValue,
    formState: { errors: err },
  } = useForm()

  const [openEditFile, setOpenEditFile] = useState(false)
  const [editTitle, setEditTitle] = useState('')

  const handleEditFileSubmit = (event: any) => {
    dispatch(updateFileTitle({ ctiName: event.urltitle }, docId) as any)
      .then((res: any) => {
        if (res.type === 'FILETITLE_UPDATE_SUCCESS') {
          setOpenEditFile(false)
          CTIreload()
        }
      })
      .catch((err: any) => console.log(err))
  }

  const editFile = (event: any, value: any) => {
    setValue('urltitle', editTitle)
    setAnchorE6(null)
    setOpenEditFile(!openEditFile)
  }

  const cancelEdit = () => {
    setOpenEditFile(false)
  }

  const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(() => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: '#fff',
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#fff',
      color: '#000',
    },
  }))

  const handleClickWindowOpen = (params: any) => {
    if (params?.row?.mitreLocation) {
      let url: any = params.row.mitreLocation
      window.open(url)
    } else {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'There Is No URL',
        color: '#000',
        width: 400,
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  const handlenavigateTo = (data: any) => {
    sessionStorage.setItem('vault', JSON.stringify(data))
    navigate(`/app/Repository/${data.id}`, { state: { valtName: data?.name } })
  }

  const columns: GridColDef[] = [
    {
      field: 'ctiName',
      headerName: 'CTI Reports',
      width: 528,
      sortable: true,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      renderCell: (params: any) => {
        const url = params?.row?.url
        const urlParts = url?.split('/')
        let name = urlParts[urlParts?.length - 1]
        const urlNameValue = name?.split('.')[0]
        var totalSizeKB = params?.row?.documentSize / Math.pow(1024, 1)

        return (
          <>
            <div className='flex truncate w-full'>
              {params.row.reportSource == 'WEB' ? (
                <>
                  <span className='mt-1'>
                    <svg
                      width='32'
                      height='32'
                      viewBox='0 0 40 40'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                      className=''
                    >
                      <path
                        d='M20 3.33325C25 6.66658 26.5379 13.82 26.6667 19.9999C26.5379 26.1799 25 33.3333 20 36.6666M20 3.33325C15 6.66659 13.4621 13.82 13.3333 19.9999C13.4621 26.1799 15 33.3333 20 36.6666M20 3.33325C10.7952 3.33325 3.33333 10.7952 3.33333 19.9999M20 3.33325C29.2047 3.33325 36.6667 10.7952 36.6667 19.9999M20 36.6666C29.2047 36.6666 36.6667 29.2047 36.6667 19.9999M20 36.6666C10.7953 36.6666 3.33333 29.2047 3.33333 19.9999M36.6667 19.9999C33.3333 24.9999 26.1799 26.5378 20 26.6666C13.8201 26.5378 6.66666 24.9999 3.33333 19.9999M36.6667 19.9999C33.3333 14.9999 26.1799 13.462 20 13.3333C13.8201 13.462 6.66666 14.9999 3.33333 19.9999'
                        stroke='white'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </span>
                </>
              ) : params.row.reportSource == 'HUNT_OF_THE_DAY' ? (
                <>
                  <span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='30'
                      height='36'
                      viewBox='0 0 30 36'
                      fill='none'
                    >
                      <path
                        d='M18.3337 1.78125V8.66549C18.3337 9.59891 18.3337 10.0656 18.5153 10.4221C18.6751 10.7357 18.9301 10.9907 19.2437 11.1505C19.6002 11.3322 20.0669 11.3322 21.0003 11.3322H27.8846M21.667 19.6654H8.33366M21.667 26.332H8.33366M11.667 12.9987H8.33366M18.3337 1.33203H9.66699C6.86673 1.33203 5.4666 1.33203 4.39704 1.877C3.45623 2.35637 2.69133 3.12127 2.21196 4.06208C1.66699 5.13164 1.66699 6.53177 1.66699 9.33203V26.6654C1.66699 29.4656 1.66699 30.8658 2.21196 31.9353C2.69133 32.8761 3.45623 33.641 4.39704 34.1204C5.4666 34.6654 6.86673 34.6654 9.66699 34.6654H20.3337C23.1339 34.6654 24.5341 34.6654 25.6036 34.1204C26.5444 33.641 27.3093 32.8761 27.7887 31.9353C28.3337 30.8658 28.3337 29.4656 28.3337 26.6654V11.332L18.3337 1.33203Z'
                        stroke='white'
                        stroke-width='1.5'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </svg>
                  </span>
                </>
              ) : params.row.reportSource == 'FEEDLY' ? (
                <>
                  <span className='mt-1'>
                    <span className='mt-1 cursor-pointer'>
                      <BootstrapTooltip
                        title={
                          params.row.feedlyStream && (
                            <div>
                              <h2>Stream ID</h2>
                              <p>{params.row.feedlyStream}</p>
                            </div>
                          )
                        }
                        arrow
                        placement='top-start'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='28'
                          height='28'
                          viewBox='0 0 72 72'
                          version='1.1'
                        >
                          <path
                            d='M 24.040 29.459 C 13.751 39.784, 13.640 39.945, 15.463 41.959 C 16.479 43.082, 18.028 44, 18.905 44 C 20.820 44, 41 25.323, 41 23.551 C 41 21.919, 37.731 19, 35.903 19 C 35.112 19, 29.774 23.707, 24.040 29.459 M 28.687 41.812 C 22.177 48.372, 21.996 48.686, 23.792 50.312 C 26.915 53.138, 29.305 52.261, 35.477 46.023 L 41.392 40.046 39.022 37.523 C 37.718 36.135, 36.380 35, 36.049 35 C 35.717 35, 32.404 38.065, 28.687 41.812 M 33.010 54.490 C 30.739 56.907, 30.724 57.038, 32.491 58.990 C 33.491 60.095, 35.070 61, 36 61 C 36.930 61, 38.509 60.095, 39.509 58.990 C 41.276 57.038, 41.261 56.907, 38.990 54.490 C 37.704 53.120, 36.358 52, 36 52 C 35.642 52, 34.296 53.120, 33.010 54.490'
                            stroke='none'
                            fill='#F5F9F6'
                            fill-rule='evenodd'
                          />
                          <path
                            d='M 16.319 20.210 C -4.787 41.176, -4.555 39.099, 12.339 55.801 L 24.678 68 35.589 67.985 C 41.590 67.976, 47.088 67.596, 47.807 67.140 C 48.526 66.684, 54.489 60.989, 61.057 54.485 C 72.349 43.303, 73 42.440, 73 38.662 C 73 36.465, 72.690 34.977, 72.311 35.356 C 71.932 35.735, 64.363 28.835, 55.492 20.023 C 41.074 5.700, 39.006 4, 36 4 C 32.992 4, 30.914 5.712, 16.319 20.210 M 24.040 29.459 C 13.751 39.784, 13.640 39.945, 15.463 41.959 C 16.479 43.082, 18.028 44, 18.905 44 C 20.820 44, 41 25.323, 41 23.551 C 41 21.919, 37.731 19, 35.903 19 C 35.112 19, 29.774 23.707, 24.040 29.459 M 28.687 41.812 C 22.177 48.372, 21.996 48.686, 23.792 50.312 C 26.915 53.138, 29.305 52.261, 35.477 46.023 L 41.392 40.046 39.022 37.523 C 37.718 36.135, 36.380 35, 36.049 35 C 35.717 35, 32.404 38.065, 28.687 41.812 M 0.272 40 C 0.272 42.475, 0.467 43.487, 0.706 42.250 C 0.944 41.013, 0.944 38.987, 0.706 37.750 C 0.467 36.513, 0.272 37.525, 0.272 40 M 33.010 54.490 C 30.739 56.907, 30.724 57.038, 32.491 58.990 C 33.491 60.095, 35.070 61, 36 61 C 36.930 61, 38.509 60.095, 39.509 58.990 C 41.276 57.038, 41.261 56.907, 38.990 54.490 C 37.704 53.120, 36.358 52, 36 52 C 35.642 52, 34.296 53.120, 33.010 54.490'
                            stroke='none'
                            fill='#2DB44D'
                            fill-rule='evenodd'
                          />
                        </svg>
                      </BootstrapTooltip>
                    </span>
                  </span>
                </>
              ) : params.row.reportSource == 'PDF' ? (
                <>
                  <span className='mt-1'>
                    <svg
                      width='32'
                      height='32'
                      viewBox='0 0 40 40'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                      className=''
                    >
                      <path
                        d='M20 3.33325C25 6.66658 26.5379 13.82 26.6667 19.9999C26.5379 26.1799 25 33.3333 20 36.6666M20 3.33325C15 6.66659 13.4621 13.82 13.3333 19.9999C13.4621 26.1799 15 33.3333 20 36.6666M20 3.33325C10.7952 3.33325 3.33333 10.7952 3.33333 19.9999M20 3.33325C29.2047 3.33325 36.6667 10.7952 36.6667 19.9999M20 36.6666C29.2047 36.6666 36.6667 29.2047 36.6667 19.9999M20 36.6666C10.7953 36.6666 3.33333 29.2047 3.33333 19.9999M36.6667 19.9999C33.3333 24.9999 26.1799 26.5378 20 26.6666C13.8201 26.5378 6.66666 24.9999 3.33333 19.9999M36.6667 19.9999C33.3333 14.9999 26.1799 13.462 20 13.3333C13.8201 13.462 6.66666 14.9999 3.33333 19.9999'
                        stroke='white'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </span>
                </>
              ) : null}
              <div className='truncate w-[85%]'>
                <h1 className='px-4 font-medium font-extrabold truncate !important'>
                  {params?.row?.ctiName ? params?.row?.ctiName : urlNameValue}
                </h1>
                <span className='px-4 font-medium font-extrabold !important truncate w-3/4'>
                  {' '}
                  {decodeURIComponent(params.row.url)}
                </span>{' '}
              </div>
            </div>
          </>
        )
      },
    },
    {
      field: 'datavault.name',
      headerName: 'Repository',
      width: 150,
      headerClassName: 'hideRightSeparator',
      sortable: true,
      valueGetter: (params) => params?.row?.datavault?.name,
      renderCell: (params) => (
        <div className='text-[#fff] flex truncate w-[90%]'>
          <BootstrapTooltip title={params?.row?.datavault?.name}>
            <span
              className='px-4 font-medium font-extrabold !important truncate  cursor-pointer hover:underline'
              onClick={() => handlenavigateTo(params?.row?.datavault)}
            >
              {params?.row?.datavault?.name}{' '}
            </span>
          </BootstrapTooltip>
        </div>
      ),
    },
    {
      field: 'reportSource',
      headerName: 'Source',
      width: 117,
      headerClassName: 'hideRightSeparator',
      sortable: true,
      renderCell: (params) => (
        <>
          {params.row.reportSource === 'WEB' ? (
            <>
              <div className='flex justify-center border-2 border-[#7A5AF8] p-1 px-2 rounded-2xl cursor-pointer'>
                <div className='text-[#7A5AF8]'>Community</div>
              </div>
            </>
          ) : (
            <>
              <div className='flex justify-center border-2 border-[#1570EF] p-1 px-2 rounded-2xl cursor-pointer'>
                <div className='text-[#1570EF]'>Private</div>
              </div>
            </>
          )}
        </>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 352,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      sortable: true,
      renderCell: (params: any) => {
        return (
          <>
            <div className='flex justify-between w-full'>
              <div>
                {params.row.status == 'PROCESSING' ? (
                  <>
                    <BootstrapTooltip title={params.row.errorDesc} arrow placement='bottom'>
                      <div className='flex justify-center border-2 border-[#FF4D02] p-1 px-2 rounded-2xl'>
                        <div className='text-[#FF4D02]'>Processing</div>
                        <div className='mt-1 pl-1'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='12'
                            height='12'
                            viewBox='0 0 12 12'
                            fill='none'
                          >
                            <g clip-path='url(#clip0_339_3090)'>
                              <path
                                d='M6 1V3M6 9V11M3 6H1M11 6H9M9.53921 9.53921L8.125 8.125M9.53921 2.49997L8.125 3.91418M2.46079 9.53921L3.875 8.125M2.46079 2.49997L3.875 3.91418'
                                stroke='#FF4D02'
                                stroke-width='1.5'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                              />
                            </g>
                            <defs>
                              <clipPath id='clip0_339_3090'>
                                <rect width='12' height='12' fill='white' />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                      </div>
                    </BootstrapTooltip>
                  </>
                ) : params.row.status == 'COMPLETE' && !params.row.intelCount ? (
                  <>
                    <BootstrapTooltip title={params.row.errorDesc} arrow placement='bottom'>
                      <div
                        className={`flex justify-center border-2 p-1 px-2 rounded-2xl ${
                          !params.row.errorDesc ? 'border-[#079455]' : 'border-[yellow]'
                        }`}
                      >
                        <div
                          className={`${
                            !params.row.errorDesc ? 'text-[#079455]' : 'text-[yellow]'
                          }`}
                        >
                          Completed
                        </div>
                        <div className='mt-1 pl-1'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='13'
                            height='12'
                            viewBox='0 0 13 12'
                            fill='none'
                          >
                            <path
                              d='M10.5 3L5 8.5L2.5 6'
                              stroke={!params.row.errorDesc ? '#079455' : 'yellow'}
                              stroke-width='1.5'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            />
                          </svg>
                        </div>
                      </div>
                    </BootstrapTooltip>
                  </>
                ) : params.row.status == 'COMPLETE' && params.row.intelCount ? (
                  <>
                    <div className='flex gap-[8px]'>
                      {Object.keys(params.row.intelCount.data).map((key: any) => {
                        return (
                          <>
                            <div className='border-[#079455] border-2 p-1 px-2 rounded-2xl'>
                              <p className='text-[#079455]'>
                                {params.row.intelCount.data[key]}
                                <span className='text-[#079455] px-[4px]'>{key}</span>
                              </p>
                            </div>
                          </>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    {/* *****************FAILED block***************** */}
                    <BootstrapTooltip title={params.row.errorDesc} arrow placement='bottom'>
                      <div className='flex justify-center border-2 border-[#FA1B1B] p-1 px-2 rounded-2xl'>
                        <div className='text-[#FA1B1B]'>Failed</div>
                        <div className='mt-1 pl-1'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            stroke='#FA1B1B'
                            viewBox='0 0 16 16'
                            width='13'
                            height='12'
                          >
                            <path d='M 2.75 2.042969 L 2.042969 2.75 L 2.398438 3.101563 L 7.292969 8 L 2.042969 13.25 L 2.75 13.957031 L 8 8.707031 L 12.894531 13.605469 L 13.25 13.957031 L 13.957031 13.25 L 13.605469 12.894531 L 8.707031 8 L 13.957031 2.75 L 13.25 2.042969 L 8 7.292969 L 3.101563 2.398438 Z' />
                          </svg>
                        </div>
                      </div>
                    </BootstrapTooltip>
                  </>
                )}
              </div>
            </div>
            <Menu
              sx={{
                marginLeft: '-55px',
              }}
              anchorEl={anchorE6}
              open={params?.row?.disabled ? false : opendot}
              onClose={handleClosing}
            >
              <div className='right-0 px-[2px] py-[6px] text-[#344054] w-[200px]'>
                <ul>
                  <li className='py-1'>
                    <button
                      className={`${params.row.disabled ? `flex cursor-not-allowed` : `flex`}`}
                      onClick={(e: any) => onViewimage(e, params)}
                    >
                      <svg
                        className='mx-2 mt-0.5'
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M1.61342 8.47546C1.52262 8.3317 1.47723 8.25982 1.45182 8.14895C1.43273 8.06567 1.43273 7.93434 1.45182 7.85106C1.47723 7.74019 1.52262 7.66831 1.61341 7.52455C2.36369 6.33656 4.59693 3.33334 8.00027 3.33334C11.4036 3.33334 13.6369 6.33656 14.3871 7.52455C14.4779 7.66831 14.5233 7.74019 14.5487 7.85106C14.5678 7.93434 14.5678 8.06567 14.5487 8.14895C14.5233 8.25982 14.4779 8.3317 14.3871 8.47545C13.6369 9.66344 11.4036 12.6667 8.00027 12.6667C4.59693 12.6667 2.36369 9.66344 1.61342 8.47546Z'
                          stroke='#344054'
                          stroke-width='1.5'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                        <path
                          d='M8.00027 10C9.10484 10 10.0003 9.10457 10.0003 8C10.0003 6.89543 9.10484 6 8.00027 6C6.8957 6 6.00027 6.89543 6.00027 8C6.00027 9.10457 6.8957 10 8.00027 10Z'
                          stroke='#344054'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                      <li className='mx-0.5 text-sm font-medium'>View</li>
                    </button>
                  </li>
                  <li className='py-1'>
                    <button type='button' className='flex' onClick={(e) => onViewPoppup(e, params)}>
                      <svg
                        className='mx-2 mt-0.5'
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <g clip-path='url(#clip0_8085_50050)'>
                          <path
                            d='M6.66665 11.7724V13.3333C6.66665 14.0697 7.2636 14.6667 7.99998 14.6667C8.73636 14.6667 9.33331 14.0697 9.33331 13.3333V11.7724M7.99998 1.33333V2M1.99998 8H1.33331M3.66665 3.66667L3.26658 3.2666M12.3333 3.66667L12.7335 3.2666M14.6666 8H14M12 8C12 10.2091 10.2091 12 7.99998 12C5.79084 12 3.99998 10.2091 3.99998 8C3.99998 5.79086 5.79084 4 7.99998 4C10.2091 4 12 5.79086 12 8Z'
                            stroke='#344054'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </g>
                        <defs>
                          <clipPath id='clip0_8085_50050'>
                            <rect width='16' height='16' fill='white' />
                          </clipPath>
                        </defs>
                      </svg>
                      <span className='mx-0.5 text-sm font-medium'> Insights</span>
                    </button>
                  </li>
                  {viewprams?.row?.mitreLocation && (
                    <li className='py-1'>
                      <button
                        type='button'
                        className='flex'
                        onClick={() => handleClickWindowOpen(params)}
                      >
                        <svg
                          className='mx-2 mt-0.5'
                          width='16'
                          height='16'
                          viewBox='0 0 16 16'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M14 6L14 2M14 2H10M14 2L8.66667 7.33333M6.66667 3.33333H5.2C4.0799 3.33333 3.51984 3.33333 3.09202 3.55132C2.71569 3.74307 2.40973 4.04903 2.21799 4.42535C2 4.85318 2 5.41323 2 6.53333V10.8C2 11.9201 2 12.4802 2.21799 12.908C2.40973 13.2843 2.71569 13.5903 3.09202 13.782C3.51984 14 4.0799 14 5.2 14H9.46667C10.5868 14 11.1468 14 11.5746 13.782C11.951 13.5903 12.2569 13.2843 12.4487 12.908C12.6667 12.4802 12.6667 11.9201 12.6667 10.8V9.33333'
                            stroke='#344054'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                        <span className='mx-0.5 text-sm font-medium'> MITRE ATT&CK </span>
                      </button>
                    </li>
                  )}

                  <li className='py-1'>
                    <button type='button' className='flex' onClick={(e) => editFile(e, params)}>
                      <EditIcon style={{ width: 18, height: 18, marginLeft: 6 }} />
                      <span className='mx-0.5 text-sm font-medium ml-2'> Edit</span>
                    </button>
                  </li>

                  {viewprams?.row?.status == 'COMPLETE' && !viewprams?.row.errorDesc && (
                    <>
                      <li className='py-1'>
                        <button
                          type='button'
                          className='flex'
                          disabled={
                            viewprams?.row?.status !== 'COMPLETE' ||
                            (viewprams?.row?.status == 'COMPLETE' && viewprams?.row.errorDesc)
                          }
                          onClick={(e) => inspectSigmas(e, params)}
                        >
                          <svg
                            className='mx-2 mt-0.5'
                            width='16'
                            height='16'
                            viewBox='0 0 16 16'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M12 4.66666V3.33333C12 3.15652 11.9298 2.98695 11.8047 2.86193C11.6797 2.7369 11.5101 2.66666 11.3333 2.66666H4.33333C4.27143 2.66666 4.21075 2.6839 4.15809 2.71645C4.10543 2.74899 4.06288 2.79556 4.03519 2.85093C4.00751 2.9063 3.99579 2.96828 4.00135 3.02993C4.00691 3.09159 4.02952 3.15047 4.06667 3.2L7.06667 7.2C7.23976 7.43079 7.33333 7.7115 7.33333 8C7.33333 8.28849 7.23976 8.5692 7.06667 8.8L4.06667 12.8C4.02952 12.8495 4.00691 12.9084 4.00135 12.9701C3.99579 13.0317 4.00751 13.0937 4.03519 13.1491C4.06288 13.2044 4.10543 13.251 4.15809 13.2835C4.21075 13.3161 4.27143 13.3333 4.33333 13.3333H11.3333C11.5101 13.3333 11.6797 13.2631 11.8047 13.1381C11.9298 13.013 12 12.8435 12 12.6667V11.3333'
                              stroke='#344054'
                              strokeWidth='1.5'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                          <span className='mx-0.5 text-sm font-medium'> Inspect Sigma(s)</span>
                        </button>
                      </li>
                      <li className='py-1'>
                        <button
                          type='button'
                          className='flex'
                          disabled={
                            viewprams?.row?.status !== 'COMPLETE' ||
                            (viewprams?.row?.status == 'COMPLETE' && viewprams?.row.errorDesc)
                          }
                          onClick={(e) => bulkTranslate(e, params)}
                        >
                          <span className=''>
                            <svg
                              className='mx-2 mt-0.5'
                              width='16'
                              height='16'
                              viewBox='0 0 16 16'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                d='M12.3805 13.3333C13.2218 13.3333 13.9045 12.6513 13.9045 11.8093V8.762L14.6665 8L13.9045 7.238V4.19066C13.9045 3.34866 13.2225 2.66666 12.3805 2.66666M3.61931 2.66666C2.77731 2.66666 2.09531 3.34866 2.09531 4.19066V7.238L1.33331 8L2.09531 8.762V11.8093C2.09531 12.6513 2.77731 13.3333 3.61931 13.3333M5.99998 11.3333L9.99998 4.66666'
                                stroke='#344054'
                                strokeWidth='1.5'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                            </svg>
                          </span>
                          <span className='mx-0.5 text-sm font-medium'>Bulk Translate</span>
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </Menu>
          </>
        )
      },
    },
    {
      field: 'creationTime',
      headerName: 'Creation Time',
      width: 200,
      headerClassName: 'hideRightSeparator',
      sortable: true,
      sortComparator: sortByDateTime,
      renderCell: (params) => (
        <>
          <div className='flex justify-between w-full '>
            {params.row.creationTime ? (
              <>
                <span>{moment(params.row.creationTime).format('DD-MMM HH:mm')}</span>
              </>
            ) : (
              <>{'-'}</>
            )}
            <button
              className={`${params.row.disabled ? `cursor-not-allowed` : ''}`}
              onClick={params.row.disabled ? (e: any) => '' : (e: any) => handleClickdot(e, params)}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke={`${params.row.disabled ? `#808080` : '#fff'}`}
                className='w-6 h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z'
                />
              </svg>
            </button>
          </div>
        </>
      ),
    },
  ]

  // ******************** api Integration*************************
  const [ctiReportFilesArr, setctiReportFilesArr] = useState([] as any)
  const [ctiDefaultFiles, setCtiDefaultFiles] = useState([])

  const defaulttxt =
    'Once the processing is complete, the files to your left will be translated into queries.You can then download them.'
  const [defaultText, setDefaultText] = useState(defaulttxt)
  const [platForm, setPlatForm] = useState(null as any)
  const handleClickTargerbulk = (event: any) => {
    if (event.target.value) {
      setDisable(false)
      setPlatForm(event.target.value)
    } else {
      setDisable(true)
      setPlatForm(null)
    }
  }

  const TranslateCTI = () => {
    setDisable(true)
    setclosePopupDisable(true)
    setBulkDownload(true)
    setDefaultText('Translation of your sigma file(s) is in progress...')
    setIsTranslating(true)

    let obj = {
      ctiId: bulkprams.id,
      target: platForm.toLowerCase(),
    }
    dispatch(repBulkTranslateFileList(obj, bulkprams) as any).then((response: any) => {
      setDisable(false)
      setclosePopupDisable(false)
      setDefaultText(
        'Your translation request is now completed. You can download the queries by clicking on the download icon',
      )
      setBulkDownload(false)
      setIsTranslating(false)
    })
  }
  const [showPopover, setShowPopover] = useState(false)
  const [copyText, setCopyText] = useState(null as any)
  const copyToClipboard = () => {
    setShowPopover(true)
    navigator.clipboard.writeText(copyText)
  }

  const bulckTranslateDownload = async () => {
    try {
      const { data } = await Axios.get(`${environment.baseUrl}/data/pysigma/download-query`, {
        params: {
          ctiId: bulkprams.id,
          target: platForm.toLowerCase(),
          global: bulkprams.global,
        },
        responseType: 'blob',
        headers: {
          Authorization: `${token.bearerToken}`,
        },
      })
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

  const getRowClassName = (params: any) => {
    return params.row.disabled ? 'cursor-not-allowed' : ''
  }

  const getCellClassName = (params: any) => {
    return params.row.disabled ? classes.checkbox : classes.uncheckbox
  }

  // *****************************StreamID API Process Starts*******************************

  const feedlyString = sessionStorage.getItem('feedly')
  const feedly: any = JSON.parse(feedlyString as any)
  let counter = 1
  const [feedlyState, setFeedlyState] = useState(null as any)

  const afterFeedlyAdded = () => {
    dispatch(feedlyGetStremeId(feedlyState?.streamID) as any)
      .then((res: any) => {
        if (res.payload == 'COMPLETED') {
          setctiReportFilesArr([])
          setFeedlyState(null)
          clearInterval(myInterval)
          let valutArray: any = []
          const feedlyString = sessionStorage.getItem('feedly')
          const feedly: any = JSON.parse(feedlyString as any)
          for (let i = 0; i < feedly?.length; i++) {
            if (feedly[i].vaultId !== id) {
              valutArray.push(feedly[i])
            } else {
              valutArray = []
            }
          }
          if (valutArray.length > 0) {
            setctiReportFilesArr((prevValue: any) => {
              let arr = [...prevValue]
              arr.pop()
              return arr
            })
            sessionStorage.setItem('feedly', JSON.stringify(valutArray))
          } else {
            setctiReportFilesArr([])
            let CtiValue: any = [...ctiDefaultFiles]
            setctiReportFilesArr(CtiValue)
            setFeedlyState(null)
            sessionStorage.removeItem('feedly')
            sessionStorage.removeItem('feedlyCounter')
            setDetail({ from: 'repoCounter', value: { status: 'failed' } })
          }
          CTIreload()
        } else if (res.payload == 'Failed') {
          setctiReportFilesArr([])
          setFeedlyState(null)
          Swal.fire({
            position: 'center',
            icon: 'error',
            color: '#000',
            title: 'Failed to process Feedly stream',
            width: 400,
            timer: 1000,
            showConfirmButton: false,
          })
          let CtiValue: any = [...ctiDefaultFiles]
          setctiReportFilesArr(CtiValue)
          sessionStorage.removeItem('feedly')
          sessionStorage.removeItem('feedlyCounter')
          setDetail({ from: 'repoCounter', value: { status: 'failed' } })
          CTIreload()
          clearInterval(myInterval)
        } else if (res.payload == 'PROCESSING') {
          counter++
          sessionStorage.setItem('feedlyCounter', JSON.stringify(counter))
          if (counter == 4) {
            setctiReportFilesArr([])
            setFeedlyState(null)
            Swal.fire({
              position: 'center',
              icon: 'error',
              color: '#000',
              title: 'Failed to process Feedly stream',
              width: 400,
              timer: 1000,
              showConfirmButton: false,
            })
            let CtiValue: any = [...ctiDefaultFiles]
            setctiReportFilesArr(CtiValue)
            sessionStorage.removeItem('feedly')
            sessionStorage.removeItem('feedlyCounter')
            setDetail({ from: 'repoCounter', value: { status: 'failed' } })
            CTIreload()
            clearInterval(myInterval)
          }
        } else {
          setctiReportFilesArr([])
          setFeedlyState(null)
          Swal.fire({
            position: 'center',
            icon: 'error',
            color: '#000',
            title: 'Failed to process Feedly stream',
            width: 400,
            timer: 1000,
            showConfirmButton: false,
          })
          let CtiValue: any = [...ctiDefaultFiles]
          setctiReportFilesArr(CtiValue)
          sessionStorage.removeItem('feedly')
          sessionStorage.removeItem('feedlyCounter')
          setDetail({ from: 'repoCounter', value: { status: 'failed' } })
          CTIreload()
          clearInterval(myInterval)
        }
      })
      .catch((err: any) => console.log('err', err))
  }

  let myInterval: any

  useEffect(() => {
    setFeedlyState(null)
    const feedlyReload = sessionStorage.getItem('feedly')
    const feedlyRload: any = JSON.parse(feedlyReload as any)
    let feedlyValue: any =
      feedlyRload?.length > 0 ? feedlyRload?.some((x: any) => x.vaultId == id) : null
    if (feedly?.length > 0 && feedlyValue) {
      let vaultId: any = feedly?.find((x: any) => x.vaultId == id)
      setFeedlyState(vaultId)
    } else {
      setFeedlyState(null)
    }
  }, [feedly?.length, feedlyCTiPostsuccess])

  useEffect(() => {
    const feedlyReload = sessionStorage.getItem('feedly')
    const feedlyRload: any = JSON.parse(feedlyReload as any)
    let feedlyValue: any =
      feedlyRload?.length > 0 ? feedlyRload?.some((x: any) => x.vaultId == id) : null
    if (feedlyState?.response == 'PROCESSING' && feedlyState.vaultId == id && feedlyValue) {
      let objects = {
        ctiName: 'Processing Feedly Stream for Urls',
        errorDesc: null,
        id: 'feedly',
        status: 'PROCESSING',
        url: 'https://www.feedly.com/en-us/',
        type: 'feely',
        disabled: true,
      }
      setctiReportFilesArr((prevValue: any) => {
        let arr = [...prevValue]
        arr.push(objects)
        return arr
      })
      sessionStorage.setItem('feedlyCounter', JSON.stringify(counter))
      myInterval = setInterval(afterFeedlyAdded, 20000)
      CTIreload()
    }
  }, [feedlyState])

  const [reloading, setReLoading] = useState(false)

  const CTIreload = () => {
    const vault = sessionStorage.getItem('vault')
    const selectedVault = JSON.parse(vault as any)

    const feedlyReload = sessionStorage.getItem('feedly')
    const feedlyRload: any = JSON.parse(feedlyReload as any)
    let feedlyValue: any =
      feedlyRload?.length > 0 ? feedlyRload?.some((x: any) => x.vaultId == id) : null
    setReLoading(true)
    setctiReportFilesArr([])
    dispatch(ctiReportFileList(token, selectedVault) as any)
      .then((res: any) => {
        if (res.type == 'CTI_REPORT_FILE_SUCCESS') {
          setReLoading(false)
          if (feedlyState && feedlyValue) {
            let objects = {
              ctiName: 'Processing Feedly Stream for Urls',
              errorDesc: null,
              id: 'feedly',
              status: 'PROCESSING',
              url: 'https://www.feedly.com/en-us/',
              type: 'feely',
              reportSource: 'FEEDLY',
              disabled: true,
            }
            let processArray: any = [...res.payload, objects]
            setctiReportFilesArr(processArray)
            setCtiDefaultFiles(res.payload)
          } else {
            setctiReportFilesArr(res.payload)
            setCtiDefaultFiles(res.payload)
          }
        } else if (res.type == 'CTI_REPORT_FILE__FAILED') {
          setReLoading(false)
          setctiReportFilesArr(ctiReportFilesArr)
          setCtiDefaultFiles(ctiDefaultFiles)
        }
      })
      .catch((err: any) => console.log('err', err))
    setdocumentlist(RepositoryDocList)

    let ctiReports: any = []

    dispatch(ChatHistoryjSONDetails() as any)
      .then((res: any) => {
        if (res?.payload?.length > 0) {
          setVaultListdata(res?.payload)
          res?.payload.map((item: any) => {
            ctiReports = [...ctiReports, ...item?.ctiReports]
          })
        }
        const sortedData: any = ctiReports.sort(
          (a: any, b: any) =>
            new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime(),
        )
        setVaultList(sortedData)
      })
      .catch((error: any) => {
        console.log(error)
      })
  }

  const urlIntervalRef = useRef<number | null>(null)
  const callGetApi = () => {
    dispatch(getCtiReportVaultStatus(token, id) as any)
      .then((res: any) => {
        if (res.type === 'CTI_REPORT_FILE_STATUS_SUCCESS') {
          if (res.payload) {
            if (urlIntervalRef.current !== null) {
              clearInterval(urlIntervalRef.current)
            }
            urlIntervalRef.current = window.setInterval(callGetApi, 10000)
          } else {
            if (urlIntervalRef.current !== null) {
              clearInterval(urlIntervalRef.current)
              document.getElementById('refreshBtn')?.click()
              urlIntervalRef.current = null
            }
          }
        }
      })
      .catch((err: any) => console.log('err', err))
  }

  useEffect(() => {
    if (wssProvider) {
      if (wssProvider?.eventType == 'cti processing completed') {
        CTIreload()
        setWssProvider(null)
      }
    }
  }, [wssProvider])

  const sortedData: any = vaultList.filter(
    (item: any) =>
      item?.status?.toLowerCase().includes(globalSearch?.toLowerCase()) ||
      item?.mitreLocation?.toLowerCase().includes(globalSearch?.toLowerCase()) ||
      item?.url?.toLowerCase().includes(globalSearch?.toLowerCase()) ||
      item?.ctiName?.toLowerCase() === globalSearch?.toLowerCase() ||
      item?.datavault?.name?.toLowerCase() === globalSearch?.toLowerCase() ||
      moment(item?.creationTime).format('DD-MMM HH:mm').toLowerCase() ===
        moment(globalSearch).format('DD-MMM HH:mm')?.toLowerCase() ||
      moment(item?.creationTime).format('DD MMM').toLowerCase() ===
        moment(globalSearch).format('DD MMM')?.toLowerCase() ||
      moment(item?.creationTime).format('HH:mm').toLowerCase() ===
        moment(globalSearch).format('HH:mm')?.toLowerCase() ||
      moment(item?.creationTime).format('HH').toLowerCase() ===
        moment(globalSearch).format('HH')?.toLowerCase(),
  )
  const filteredData: any = sortedData?.sort(
    (a: any, b: any) => new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime(),
  )
  return (
    <>
      <div className='bg-[#0C111D]'>
        {/* Tab Section */}
        <div onClick={delpopupDropdown}>
          <div className='bg-[#0C111D] focus:bg-white .bg-gray-800'>
            <nav className='pe-[15px] bg-[#0C111D] focus:bg-white coolGray-100 flex-no-wrap relative flex w-full items-center justify-between py-2 shadow-md shadow-black/5 lg:flex-wrap lg:justify-start lg:pb-3 lg:pt-0'>
              <div className='flex w-full flex-wrap items-center justify-between bg-[#0C111D] py-2'>
                <div
                  className='sm:block flex-grow basis-[100%] mt-1 items-center lg:!flex lg:basis-auto bg-[#0C111D]'
                  id='navbarSupportedContent1'
                  data-te-collapse-item
                >
                  <ul
                    className='list-style-none mr-auto flex flex-col pl-0 lg:flex-row md:flex-row'
                    data-te-navbar-nav-ref
                  >
                    <li className='mb-4 md:mb-0 lg:mb-0 md:pr-2 lg:pl-2' data-te-nav-item-ref>
                      <a className='sm:text-lgcursor-pointer text-white text-emerald-900 font-semibold lg:text-xl leading-5  transition duration-200 hover:text-white-900 hover:ease-in-out focus:text-emerald-900 disabled:text-black/30 motion-reduce:transition-none lg:px-2 [&.active]:text-emerald-900'>
                        All CTI Reports
                      </a>
                    </li>
                  </ul>
                </div>

                {/* **********************Old Figma Changes Starts******************* */}
                <div
                  className='flex text-#667085 mt-4 items-center'
                  data-te-dropdown-ref
                  data-te-dropdown-alignment='end'
                >
                  {totalSelectedCheckboxes?.length > 0 ? (
                    <p className='text-white font-medium lg:pr-2'>
                      {totalSelectedCheckboxes?.length + '    ' + 'Resource(s) Selected'}
                    </p>
                  ) : getdatacheck?.length > 0 ? (
                    <p className='text-white font-medium lg:pr-2'>
                      {getdatacheck?.length + '    ' + 'Resource(s) Selected'}
                    </p>
                  ) : (
                    ''
                  )}
                  <div>
                    {(totalSelectedCheckboxes?.length == documentlist?.length &&
                      documentlist?.length &&
                      totalSelectedCheckboxes?.length !== 0) ||
                    totalSelectedCheckboxes?.length > 0 ? (
                      <span>
                        {getroleName?.roleName !== 'USER' && (
                          <button
                            className='text-white hover:bg-[#6941C6] mr-3 capitalize rounded-lg px-[11px] py-[6px] bg-[#EE7103] text-center flex'
                            onClick={(event: any) => setOpenActOnSelect(event.currentTarget)}
                          >
                            <span>Act on Selected</span>
                            <span className='pl-2 pr-2 pt-1'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='20'
                                height='20'
                                viewBox='0 0 20 20'
                                fill='none'
                              >
                                <path
                                  d='M5 7.5L10 12.5L15 7.5'
                                  stroke='#fff'
                                  stroke-width='1.66667'
                                  stroke-linecap='round'
                                  stroke-linejoin='round'
                                />
                              </svg>
                            </span>
                          </button>
                        )}
                      </span>
                    ) : (getdatacheck?.length == documentlist?.length &&
                        documentlist?.length &&
                        getdatacheck?.length !== 0) ||
                      getdatacheck?.length > 0 ? (
                      <span>
                        {getroleName?.roleName !== 'USER' && (
                          <button
                            className='text-white hover:bg-[#6941C6] mr-3 capitalize rounded-lg px-[14px] py-[6px] bg-[#EE7103] text-center flex'
                            onClick={(event: any) => setOpenActOnSelect(event.currentTarget)}
                          >
                            <span>Act on Selected</span>
                            <span className='pl-2 pr-2'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='20'
                                height='20'
                                viewBox='0 0 20 20'
                                fill='none'
                              >
                                <path
                                  d='M5 7.5L10 12.5L15 7.5'
                                  stroke='#fff'
                                  stroke-width='1.66667'
                                  stroke-linecap='round'
                                  stroke-linejoin='round'
                                />
                              </svg>
                            </span>
                          </button>
                        )}
                      </span>
                    ) : (
                      ''
                    )}
                    <Menu
                      anchorEl={openActOnSelect}
                      open={Boolean(openActOnSelect)}
                      onClose={handleActOnMenuClose}
                    >
                      {!selectedVault?.global && (
                        <MenuItem
                          onClick={() => {
                            handleActOnMenuClose()
                            onmultipleDelete(totalSelectedCheckboxes)
                          }}
                          sx={{ width: '12vw' }}
                        >
                          <span className='mr-3'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='18'
                              height='20'
                              viewBox='0 0 18 20'
                              fill='none'
                            >
                              <path
                                d='M12.3333 5.0013V4.33464C12.3333 3.40121 12.3333 2.9345 12.1517 2.57798C11.9919 2.26438 11.7369 2.00941 11.4233 1.84962C11.0668 1.66797 10.6001 1.66797 9.66667 1.66797H8.33333C7.39991 1.66797 6.9332 1.66797 6.57668 1.84962C6.26308 2.00941 6.00811 2.26438 5.84832 2.57798C5.66667 2.9345 5.66667 3.40121 5.66667 4.33464V5.0013M7.33333 9.58464V13.7513M10.6667 9.58464V13.7513M1.5 5.0013H16.5M14.8333 5.0013V14.3346C14.8333 15.7348 14.8333 16.4348 14.5608 16.9696C14.3212 17.44 13.9387 17.8225 13.4683 18.0622C12.9335 18.3346 12.2335 18.3346 10.8333 18.3346H7.16667C5.76654 18.3346 5.06647 18.3346 4.53169 18.0622C4.06129 17.8225 3.67883 17.44 3.43915 16.9696C3.16667 16.4348 3.16667 15.7348 3.16667 14.3346V5.0013'
                                stroke='#344054'
                                stroke-width='1.66667'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                              />
                            </svg>
                          </span>
                          <span>Delete Reports</span>
                        </MenuItem>
                      )}
                      <MenuItem
                        onClick={(event: any) => {
                          shareFile(event, totalSelectedCheckboxes, 'copyTo')
                        }}
                        disabled={totalSelectedCheckboxes?.length > 10 ? true : false}
                      >
                        <span className='mr-3'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='18'
                            height='20'
                            viewBox='0 0 18 20'
                            fill='none'
                          >
                            <path
                              d='M5.3335 5.33203V3.46536C5.3335 2.71863 5.3335 2.34526 5.47882 2.06004C5.60665 1.80916 5.81063 1.60519 6.06151 1.47736C6.34672 1.33203 6.72009 1.33203 7.46683 1.33203H12.5335C13.2802 1.33203 13.6536 1.33203 13.9388 1.47736C14.1897 1.60519 14.3937 1.80916 14.5215 2.06004C14.6668 2.34526 14.6668 2.71863 14.6668 3.46536V8.53203C14.6668 9.27877 14.6668 9.65214 14.5215 9.93735C14.3937 10.1882 14.1897 10.3922 13.9388 10.52C13.6536 10.6654 13.2802 10.6654 12.5335 10.6654H10.6668M3.46683 14.6654H8.5335C9.28023 14.6654 9.6536 14.6654 9.93882 14.52C10.1897 14.3922 10.3937 14.1882 10.5215 13.9374C10.6668 13.6521 10.6668 13.2788 10.6668 12.532V7.46536C10.6668 6.71863 10.6668 6.34526 10.5215 6.06004C10.3937 5.80916 10.1897 5.60519 9.93882 5.47736C9.6536 5.33203 9.28023 5.33203 8.5335 5.33203H3.46683C2.72009 5.33203 2.34672 5.33203 2.06151 5.47736C1.81063 5.60519 1.60665 5.80916 1.47882 6.06004C1.3335 6.34526 1.3335 6.71863 1.3335 7.46536V12.532C1.3335 13.2788 1.3335 13.6521 1.47882 13.9374C1.60665 14.1882 1.81063 14.3922 2.06151 14.52C2.34672 14.6654 2.72009 14.6654 3.46683 14.6654Z'
                              stroke='#344054'
                              stroke-width='1.66667'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            />
                          </svg>
                        </span>
                        <span>Copy CTI Report(s)</span>
                      </MenuItem>
                      <MenuItem
                        onClick={(event: any) => {
                          shareFile(event, totalSelectedCheckboxes, 'moveTo')
                        }}
                        disabled={totalSelectedCheckboxes?.length > 10 ? true : false}
                      >
                        <span className='mr-3'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='18'
                            height='20'
                            viewBox='0 0 18 20'
                            fill='none'
                          >
                            <path
                              d='M7.00016 1.3339C6.55013 1.33999 6.27996 1.36605 6.06151 1.47736C5.81063 1.60519 5.60665 1.80916 5.47882 2.06004C5.36751 2.2785 5.34146 2.54866 5.33536 2.9987M13.0002 1.3339C13.4502 1.33999 13.7204 1.36605 13.9388 1.47736C14.1897 1.60519 14.3937 1.80916 14.5215 2.06004C14.6328 2.2785 14.6589 2.54866 14.665 2.99869M14.665 8.99869C14.6589 9.44873 14.6328 9.7189 14.5215 9.93735C14.3937 10.1882 14.1897 10.3922 13.9388 10.52C13.7204 10.6313 13.4502 10.6574 13.0002 10.6635M14.6668 5.33203V6.66536M9.33353 1.33203H10.6668M3.46683 14.6654H8.5335C9.28023 14.6654 9.6536 14.6654 9.93882 14.52C10.1897 14.3922 10.3937 14.1882 10.5215 13.9374C10.6668 13.6521 10.6668 13.2788 10.6668 12.532V7.46536C10.6668 6.71863 10.6668 6.34526 10.5215 6.06004C10.3937 5.80916 10.1897 5.60519 9.93882 5.47736C9.6536 5.33203 9.28023 5.33203 8.5335 5.33203H3.46683C2.72009 5.33203 2.34672 5.33203 2.06151 5.47736C1.81063 5.60519 1.60665 5.80916 1.47882 6.06004C1.3335 6.34526 1.3335 6.71863 1.3335 7.46536V12.532C1.3335 13.2788 1.3335 13.6521 1.47882 13.9374C1.60665 14.1882 1.81063 14.3922 2.06151 14.52C2.34672 14.6654 2.72009 14.6654 3.46683 14.6654Z'
                              stroke='#344054'
                              stroke-width='1.66667'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            />
                          </svg>
                        </span>
                        <span>Move CTI Report(s)</span>
                      </MenuItem>
                    </Menu>
                  </div>
                  <button
                    className={`${
                      totalSelectedCheckboxes?.length == 0 || totalSelectedCheckboxes?.length > 1
                        ? 'cursor-not-allowed opacity-50 hover'
                        : 'cursor-pointer hover:bg-[#6941c6]'
                    }
                      text-white mr-3 capitalize rounded-lg px-[14px] py-[6px] bg-[#EE7103] text-center flex`}
                    onClick={() => {
                      setnewchat(true)
                      addTochat(message)
                      setWorkBenchName(totalSelectedCheckboxes[0]?.ctiName)
                    }}
                    disabled={totalSelectedCheckboxes?.length == 1 ? false : true}
                  >
                    New Workbench
                  </button>

                  <div className='relative flex flex-wrap items-stretch '>
                    <input
                      id='globalsearch'
                      type='search'
                      className='relative m-0 block w-[448px] h-9 flex-auto rounded-l-lg p-1.5 border-t border-l border-b border-solid border-neutral-300 bg-white text-base font-normal leading-[1.6] text-neutral-700'
                      placeholder='Search...'
                      aria-label='Search'
                      aria-describedby='button-addon2'
                      value={globalSearch}
                      onChange={(e) => setGlobalSearch(e.target.value)}
                    />
                    <button
                      className='input-group-text bg-white w-10 flex p-1.5 items-center border-t border-b border-r border-solid border-neutral-300 whitespace-nowrap rounded-r-lg px-3 py-1.5 text-center text-base font-normal text-neutral-700'
                      id='basic-addon2'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='20'
                        viewBox='0 0 20 20'
                        fill='none'
                      >
                        <path
                          d='M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z'
                          stroke='#475467'
                          strokeWidth='1.66667'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </button>
                  </div>

                  <div className='ml-2 cursor-pointer' id='refreshBtn' onClick={CTIreload}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='1.5em'
                      height='1.5em'
                      viewBox='0 0 24 24'
                    >
                      <path
                        fill='white'
                        d='M12.793 2.293a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1-1.414-1.414L14.086 7H12.5C8.952 7 6 9.952 6 13.5S8.952 
                    20 12.5 20s6.5-2.952 6.5-6.5a1 1 0 1 1 2 0c0 4.652-3.848 8.5-8.5 8.5S4 18.152 4 13.5S7.848 5 12.5 5h1.586l-1.293-1.293a1 1 0 0 1 0-1.414'
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Datagrid Section */}
      <Box
        sx={{
          mt: -0.8,
          height: 340,
          width: '100%',
          '& .super-app-theme--header': {
            backgroundColor: '#32435A',
            color: '#FFFFFF',
            zIndex: -2,
          },
          '.css-1omg972-MuiDataGrid-root .MuiDataGrid-columnHeader--alignCenter .MuiDataGrid-columnHeaderTitleContainer':
            {
              backgroundColor: '#808080',
            },
          '.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
            outline: 'none !important',
          },
          noFocusOutline: {
            '& .MuiDataGrid-row:focus, & .MuiDataGrid-row.Mui-selected': {
              outline: 'none !important',
            },
          },
          '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus': {
            outline: 'none !important',
          },
          '.MuiDataGrid-root .MuiDataGrid-cell:focus': {
            outline: 'none !important',
          },
          '.css-yrdy0g-MuiDataGrid-columnHeaderRow': {
            backgroundColor: '#808080',
            color: '#FFFFFF',
            border: 'none',
            paddingRight: '1rem',
          },
          '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
            outline: 'none !important',
          },
          '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus':
            {
              outline: 'none',
            },
          '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
          '.MuiCheckbox-colorPrimary.Mui-checked': {
            color: ' white !important',
          },
          '.css-rtrcn9-MuiTablePagination-root .MuiTablePagination-selectLabel': {
            // display: 'none',
            color: 'white !important',
          },
          '.css-194a1fa-MuiSelect-select-MuiInputBase-input.css-194a1fa-MuiSelect-select-MuiInputBase-input.css-194a1fa-MuiSelect-select-MuiInputBase-input':
            {
              color: 'white !important',
            },
          '.MuiTablePagination-displayedRows': {
            color: 'white !important',
          },
          '.MuiTablePagination-root .MuiTablePagination-actions button svg': {
            fill: 'white !important',
          },
          '.MuiPagination-root .MuiPaginationSelect-icon': {
            color: 'white !important',
          },
          ' .MuiTablePagination-root .MuiSelect-icon': {
            color: 'white !important',
          },
        }}
      >
        <DataGrid
          sx={{
            boxShadow: 10,
            m: 2,
            color: 'white',
            border: 'none',
            height: {
              lg: 400,
              xl: height - 250,
            },
            [`& .${gridClasses.overlay}`]: {
              backgroundColor: 'transparent', // Removes the background color
            },
            '&>.MuiDataGrid-main': {
              '&>.MuiDataGrid-columnHeaders': {
                borderBottom: 'none !important',
              },
              borderRadius:"12px",
              border: "1px solid #32435A"
            },
            '.MuiDataGrid-footerContainer': {
              border: 'none !important',
            },
            '&>.MuiDataGrid-columnHeaders': {
              borderBottom: 'none',
            },
            '& div div div div >.MuiDataGrid-cell': {
              borderBottom: 'none',
            },
            '& .MuiDataGrid-row': {
              border: '1px solid #32435A',
            },
            '& .MuiDataGrid-checkboxInput': {
              color: 'white ',
            },
            '& .MuiDataGrid-columnHeader:first-child .MuiDataGrid-columnSeparator': {
              display: 'none',
            },
            '& .hideRightSeparator > .MuiDataGrid-columnSeparator': {
              display: 'none',
            },
            '& .super-app-theme--header': {
              backgroundColor: '#485E7C',
              color: '#FFFFFF',
            },
            '.css-1omg972-MuiDataGrid-root .MuiDataGrid-columnHeader--alignCenter .MuiDataGrid-columnHeaderTitleContainer':
              {
                backgroundColor: '#485E7C',
              },
            '.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
              outline: 'none !important',
            },
            noFocusOutline: {
              '& .MuiDataGrid-row:focus, & .MuiDataGrid-row.Mui-selected': {
                outline: 'none !important',
              },
            },
            '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus': {
              outline: 'none !important',
            },
            '.MuiDataGrid-root .MuiDataGrid-cell:focus': {
              outline: 'none !important',
            },
            '  .css-yrdy0g-MuiDataGrid-columnHeaderRow': {
              backgroundColor: '#32435A',
              color: '#FFFFFF',
              border: 'none',
              paddingRight: '1rem',
            },
            '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
              outline: 'none !important',
            },
            '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus':
              {
                outline: 'none',
              },
          }}
          getCellClassName={getCellClassName}
          disableSelectionOnClick={true}
          getRowClassName={getRowClassName}
          rows={filteredData}
          columns={columns}
          loading={reloading}
          classes={{
            columnHeadersInner: 'custom-data-grid-columnHeadersInner',
            sortIcon: 'custom-data-grid-sortIcon',
            footerContainer: 'custom-data-grid-footerContainer',
          }}
          checkboxSelection
          pagination
          selectionModel={getdatacheck}
          onSelectionModelChange={(ids: any, newSelection: any) => {
            let checkboxArray: any = []
            let checkboxArrayvalue: any = []
            setTotalSelectedCheckboxes([])
            setMessage([])
            const selectedIDs = new Set(ids)
            const selectedRowData: any = filteredData?.filter((ctireportFiles: any) =>
              selectedIDs.has(ctireportFiles?.id),
            )

            selectedRowData
              .filter((x: any) => {
                return x?.disabled !== true
              })
              .map((value: any) => {
                checkboxArray.push(value.id), checkboxArrayvalue.push(value)
              })
            setGetdatacheck(checkboxArray)
            if (checkboxArrayvalue.length > 0) {
              setTotalSelectedCheckboxes(checkboxArrayvalue)
              setMessage(checkboxArrayvalue)
            }
          }}
          components={{
            NoRowsOverlay: CustomNoRowsOverlay,
          }}
          // hideFooterPagination
          hideFooterSelectedRowCount
          disableColumnMenu
          initialState={{
            sorting: {
              sortModel: [
                {
                  field: 'ctiName',
                  sort: 'asc',
                },
              ],
            },
          }}
        />
      </Box>

      {/* Popup Section*/}
      {/* Add to chat */}
      {showModal && (
        <>
          <div className=' backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
            <div className='relative w-1/4'>
              <div className='border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none'>
                <div className='flex items-center text-[#101828] font-semibold text-lg not-italic  justify-center text-center'>
                  <div className='items-start justify-between  border-solid border-slate-200 rounded-t'>
                    <h6 className='text-1xl font-semibold justify-center items-center text-center mt-3'>
                      Add to chat
                    </h6>
                  </div>
                </div>
                <div>
                  {totalSelectedCheckboxes?.length > 0 && (
                    <p className='justify-center items-center text-center font-medium text-base text-[#475467]'>
                      {'Add' +
                        '  ' +
                        totalSelectedCheckboxes?.length +
                        '    ' +
                        'Resources selected'}
                    </p>
                  )}
                </div>
                <form onSubmit={handleSubmit(onAddChat)} className='flex flex-col gap-2'>
                  <div className='relative p-5 flex-auto'>
                    <label htmlFor='chat' className='block font-medium text-gray-900'>
                      Chat
                    </label>
                    <select
                      id='chat'
                      className='cursor-pointer mt-1 bg-gray-50 border border-gray-300 text-gray-600 font-medium rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                      {...register('chat1', { required: true })}
                      onChange={(e) => getChatId(e)}
                    >
                      <option value=''>select chat from the list</option>
                      {chatDetaillist?.map((item: any, key: any) => (
                        <option key={key} value={item.id}>
                          {item.sessionName}
                        </option>
                      ))}
                    </select>
                    <br />
                    <button
                      onClick={onModalOpen}
                      style={{ color: '#EE7103', display: 'flex' }}
                      className='block font-medium text-gray-900'
                    >
                      Create new chat
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth='1.5'
                        stroke='currentColor'
                        className='w-6 h-6'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' d='M12 6v12m6-6H6' />
                      </svg>
                    </button>
                  </div>
                  <div className='px-5 py-5 flex border-solid border-slate-200 rounded-b gap-4'>
                    <button
                      className='border border-gray-400 rounded-lg md:text-sm 2xl:text-lg  w-full bg-white-900 text-sm font-medium text-gray-900 border rounded-lg justify-center font-bold px-3 py-2 text-xs inline-flex '
                      type='button'
                      onClick={existingclose}
                    >
                      Cancel
                    </button>
                    <button
                      className='md:text-sm 2xl:text-lg w-full bg-[#EE7103] text-white justify-center font-bold rounded-lg px-3 py-2 text-xs font-medium inline-flex '
                      type='submit'
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
        </>
      )}
      {newchat && (
        <>
          <form onSubmit={handleSubmit(onAddnewChat)} className='flex flex-col gap-2'>
            <div className=' backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
              <div className='relative w-1/4'>
                <div className='border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none'>
                  <div className='flex items-center text-[#101828] font-semibold text-lg not-italic  justify-center text-center'>
                    <div className='items-start justify-between  border-solid border-slate-200 rounded-t'>
                      <h6 className='font-semibold justify-center items-center text-center mt-3'>
                        New Workbench
                      </h6>
                    </div>
                  </div>
                  <div></div>
                  <div className='relative p-5 flex-auto'>
                    <label className='block font-medium text-gray-900'>
                      New Workbench
                      <input
                        type='text'
                        id='first_name'
                        autoComplete='off'
                        onChange={(e) => {
                          setWorkBenchName(e.target.value)
                        }}
                        value={workBenchName}
                        placeholder='Enter Chat name'
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit(onAddnewChat)()}
                        className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                      ></input>
                    </label>
                  </div>
                  <div className='px-5 py-5 flex border-solid border-slate-200 rounded-b gap-4'>
                    <button
                      className='border border-gray-400 rounded-lg shadow md:text-sm 2xl:text-lg  w-full bg-white-900 text-sm font-medium text-gray-900 justify-center font-bold px-3 py-2 inline-flex '
                      type='button'
                      onClick={chatclose}
                    >
                      Cancel
                    </button>
                    <button
                      className='md:text-sm 2xl:text-lg w-full bg-[#EE7103] text-white justify-center font-bold rounded-lg px-3 py-2 text-xs font-medium inline-flex '
                      type='submit'
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
          </form>
        </>
      )}
      {/* Delete button */}
      {showModalRemove ? (
        <>
          <div className='backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
            <div className='relative my-6 w-96'>
              <div className='border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none'>
                <div className='items-start justify-between p-5 border-solid border-slate-200 rounded-t'>
                  <h6 className='text-1xl text-black font-semibold justify-center items-center text-center'>
                    Delete CTI Report
                  </h6>
                  <p className='text-black justify-center items-center text-center'>
                    Are you sure you want to remove CTI Report(s)?
                  </p>
                  <p className='text-xs text-black justify-center items-center text-center pt-2'>
                    {getroleName?.roleName == 'USER' && readerpermission?.length == 1 ? (
                      <>
                        <b>Note:</b>
                        <span className='text-black'>
                          {' '}
                          Resource with read only access will not be deleted
                        </span>
                      </>
                    ) : (
                      ''
                    )}
                  </p>
                </div>
                <div className='grid gap-4 grid-cols-2 p-2'>
                  <button
                    className='w-44 h-10 rounded-lg gap-2 class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'
                    type='button'
                    onClick={() => setShowModalRemove(false)}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={remove}
                    className='w-44 h-10 bg-red-600 text-white font-bold text-sm px-6 py-3 rounded-lg outline-none mb-2'
                    type='button'
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
        </>
      ) : null}
      {/* View button */}
      {SampleKPMG ? (
        <>
          <div className='backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
            <div className='relative w-auto my-6 mx-auto'>
              <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                <div className='flex items-center mt-54 p-3 border-b border-solid border-slate-200 rounded-t'>
                  <button
                    className='absolute right-1 p-1 ml-auto bg-transparent text-dark border-0 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
                    onClick={() => setSampleKPMG(false)}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='#000'
                    >
                      <path
                        d='M18 6L6 18M6 6L18 18'
                        stroke='#000'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </button>
                </div>

                <div>
                  <iframe height='500' width='600' title='Iframe Example' src={link}></iframe>
                </div>
                <div className='flex p-3 border-t border-solid border-slate-200 rounded-b'>
                  <nav aria-label='Page  navigation example'></nav>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {openEditFile && (
        <>
          <form onSubmit={editFileSubmit(handleEditFileSubmit)}>
            <div className='backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
              <div className='relative my-6 w-2/6'>
                <div className='border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none'>
                  <div className='items-start justify-between  border-solid border-slate-200 rounded-t'>
                    <h6 className='font-semibold justify-center items-center text-center mt-3 text-[#000]'>
                      Edit CTI Name
                    </h6>
                  </div>
                  <div className='relative p-5 flex-auto'>
                    <input
                      type='text'
                      id='urltitle'
                      className='placeholder:text-base border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                      placeholder=' Add title '
                      {...registerEdit('urltitle', {
                        required: 'urltitle is required',
                      })}
                    />
                  </div>

                  <div className='grid gap-4 grid-cols-2  p-2'>
                    <button
                      className='ml-2 w-full h-10 rounded-lg gap-2 class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'
                      type='button'
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                    <button
                      className='w-full h-10 bg-[#EE7103] text-white active:bg-[#EE7103] font-bold text-sm px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none'
                      type='submit'
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </>
      )}
      {openTranslatePopup && (
        <>
          <div className='backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
            <div className='relative w-full h-full p-[32px] mx-auto'>
              <div className='p-[20px] border-0 rounded-lg shadow-lg h-full relative flex flex-col bg-[#1D2939] outline-none focus:outline-none'>
                <div className='grid grid-cols-3 gap-4 justify-items-center m-1 p-2 mb-0 pb-0 '>
                  <div className=''></div>
                  <div className='text-white text-2xl font-bold max-md:text-xl text-center'>
                    Bulk Translate
                  </div>
                  <div className='w-full flex justify-end mr-[0.5rem] items-center'>
                    <div className='flex justify-between mr-[0.5rem]'>
                      <>
                        <div>
                          <button
                            type='button'
                            disabled={disable}
                            className='mt-2 pr-2'
                            onClick={copyToClipboard}
                          >
                            <span className=' mr-3'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='22'
                                height='22'
                                viewBox='0 0 22 22'
                                fill='none'
                              >
                                <path
                                  d='M9.5 1.0028C8.82495 1.01194 8.4197 1.05103 8.09202 1.21799C7.71569 1.40973 7.40973 1.71569 7.21799 2.09202C7.05103 2.4197 7.01194 2.82495 7.0028 3.5M18.5 1.0028C19.1751 1.01194 19.5803 1.05103 19.908 1.21799C20.2843 1.40973 20.5903 1.71569 20.782 2.09202C20.949 2.4197 20.9881 2.82494 20.9972 3.49999M20.9972 12.5C20.9881 13.175 20.949 13.5803 20.782 13.908C20.5903 14.2843 20.2843 14.5903 19.908 14.782C19.5803 14.949 19.1751 14.9881 18.5 14.9972M21 6.99999V8.99999M13.0001 1H15M4.2 21H11.8C12.9201 21 13.4802 21 13.908 20.782C14.2843 20.5903 14.5903 20.2843 14.782 19.908C15 19.4802 15 18.9201 15 17.8V10.2C15 9.07989 15 8.51984 14.782 8.09202C14.5903 7.71569 14.2843 7.40973 13.908 7.21799C13.4802 7 12.9201 7 11.8 7H4.2C3.0799 7 2.51984 7 2.09202 7.21799C1.71569 7.40973 1.40973 7.71569 1.21799 8.09202C1 8.51984 1 9.07989 1 10.2V17.8C1 18.9201 1 19.4802 1.21799 19.908C1.40973 20.2843 1.71569 20.5903 2.09202 20.782C2.51984 21 3.07989 21 4.2 21Z'
                                  stroke={disable ? '#8992A1' : '#fff'}
                                  stroke-width='2'
                                  stroke-linecap='round'
                                  stroke-linejoin='round'
                                />
                              </svg>
                            </span>
                          </button>
                          {showPopover && (
                            <div className='absolute  p-1 bg-white text-black rounded shadow z-10'>
                              Copied!
                            </div>
                          )}
                        </div>

                        <button
                          type='button'
                          disabled={bulkDownload}
                          className='mt-2 pr-2'
                          onClick={bulckTranslateDownload}
                        >
                          <span className=' mr-4'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='24'
                              height='24'
                              viewBox='0 0 24 24'
                              fill='none'
                            >
                              <path
                                d='M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 10L12 15M12 15L7 10M12 15V3'
                                stroke={bulkDownload ? '#8992A1' : '#fff'}
                                stroke-width='2'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                              />
                            </svg>
                          </span>
                        </button>
                      </>
                      <button
                        disabled={closePopupDisable}
                        className='px-1 mb-[15px] ml-auto bg-transparent text-dark border-0 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
                        onClick={() => {
                          setOpenTranslatePopup(false)
                          setDisable(true)
                          setBulkDownload(true)
                        }}
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='#fff'
                        >
                          <path
                            d='M18 6L6 18M6 6L18 18'
                            stroke={closePopupDisable ? '#8992A1' : '#fff'}
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-3 gap-4 justify-items-center px-2 mx-1 pb-4 mb-2'>
                  <div></div> {/* 1st grid div */}
                  <div className='w-full h-fit text-center flex justify-center'>
                    <select
                      onChange={(e) => handleClickTargerbulk(e)}
                      id='large'
                      className='block w-full px-[10px] py-[6px] text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500'
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
                  </div>
                  <div className='w-full flex justify-end mr-[30px]'>
                    <div className='ml-12'>
                      <button
                        disabled={disable}
                        onClick={TranslateCTI}
                        className={`
                      text-white ml-28 capitalize rounded-lg px-[25px] py-[6px] bg-[#EE7103] text-center flex ${
                        disable ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#6941C6]'
                      }`}
                      >
                        {istranslating ? 'Translating' : 'Translate'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className='flex pb-6 justify-center gap-4 items-center h-full  max-md:flex-col'>
                  <div
                    style={{
                      height: '100%',
                      width: '100%',
                      textAlign: 'left',
                      overflowY: 'hidden',
                      backgroundColor: '#0C111D',
                      borderRadius: '8px',
                      marginLeft: '10px',
                    }}
                  >
                    <YamlEditor
                      ymltext={ymltextbluk}
                      setYmlText={setYmlTextBluk}
                      setSeloctror={setCopyText}
                      modeOfView={'translate'}
                    />
                  </div>
                  <div
                    style={{
                      height: '100%',
                      width: '100%',
                      textAlign: 'left',
                      overflowY: 'hidden',
                      backgroundColor: '#0C111D',
                      borderRadius: '8px',
                      marginRight: '20px',
                    }}
                  >
                    <YamlTextEditor ymltext={defaultText} setSeloctror={setCopyText} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {copyFileOpen && (
        <CopyandmoveDrawer
          open={copyFileOpen}
          vaultList={vaultListdata}
          setCopyFileOpen={setCopyFileOpen}
        />
      )}
    </>
  )
}

export default RepositoryGlobalSearch
