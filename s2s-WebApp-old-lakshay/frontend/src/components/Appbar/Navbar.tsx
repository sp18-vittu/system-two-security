import ClearIcon from '@mui/icons-material/Clear'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { Tooltip, TooltipProps, tooltipClasses } from '@mui/material'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/system'
import { Buffer } from 'buffer'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useData } from '../../layouts/shared/DataProvider'
import DataVaultModel from '../../pages/datavault/DataVaultModel'
import { eventBus } from '../../pages/history/Chatpage'
import EditIcon from '@mui/icons-material/Edit'
import { UpdateSessionSourceValue } from '../../redux/nodes/chat/action'
import {
  dataIngestion,
  dataVaultList,
  dataVaultuserIdList,
  dataingestionUrl,
  updateDatavault,
} from '../../redux/nodes/datavault/action'
import { ADD_CTI_FEEDLY_FORM_RESET, feedlCtiPost } from '../../redux/nodes/feedlyform/action'
import { addCtiWhitelist, qualifiedUrls } from '../../redux/nodes/repository/action'
import { RoleList, UserList } from '../../redux/nodes/users/action'
import { vaultPermissionroleList } from '../../redux/nodes/vaultPermission/action'
import local from '../../utils/local'
import { UserModal } from '../Screens/UserModal'
import CrowdStrikeSvg from '../../Svg/CrowdStrikeSvg'

interface props {
  toggleSidebar: any
  isOpen: any
  toggleDropdown: any
  isSubDatavaultMenuOpen: any
  setDataVaultSideMenuClose: any
  openDataVaultSideMenu: any
  notificationmessages: any
  handleClear: any
  toggleDropdownnotifi: any
  isOpenNo: any
  handleClearAll: any
  closeMenuNotification: any
  setDatavaultlist: any
}
const Navbar = ({
  toggleSidebar,
  isOpen,
  toggleDropdown,
  openDataVaultSideMenu,
  toggleDropdownnotifi,
  isOpenNo,
  setDatavaultlist,
}: props) => {
  let documentName: any
  let cardDetailName: any
  let chatlistName: any
  let userName: any

  const [selectedFile, setSelectedFile] = useState('' as any)
  const [searchValue, setsearchValue] = useState([] as any)
  const [showdataModal, setShowdataModal] = useState(false)
  const chatlist: any = []
  const [honourWhitelist, setHonourWhitelist] = useState(null as any)
  const location = useLocation()
  const state = location.state
  const dispatch = useDispatch()
  const localStorages = local.getItem('bearerToken')
  const token = JSON.parse(localStorages as any)
  const auth = useSelector((state: any) => state.auth)
  const navigateTo = useNavigate()
  const locals = JSON.parse(localStorages as any)
  const userId = locals?.user?.user
  const dataVaultlists = useSelector((state: any) => state.dataVaultreducer)
  const { dataVaultlist } = dataVaultlists
  const dataVaultIdlists = useSelector((state: any) => state.dataVaultdomainIdreducer)
  const { dataVaultdomainIdList } = dataVaultIdlists
  const [datavaultlists, setdatavaultlists] = useState([] as any)

  const roleDto = local.getItem('auth')
  const role = JSON.parse(roleDto as any)
  const roleDescription = role?.user?.user
  const getroleName = roleDescription?.roleDTO

  let chatCardId: any = ''

  useEffect(() => {
    // Assuming you have obtained the Bearer token somehow
    const localStor: any = local.getItem('bearerToken')
    const tokens = JSON.parse(localStor as any)
    const bearerToken = tokens?.bearerToken
    if (bearerToken) {
      const [tokenType, token] = bearerToken.split(' ')
      let Whitelist = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString())
      setHonourWhitelist(Whitelist.honourWhitelist)
    }
  }, [])

  const [mouseEntered, setMouseEntered] = useState(false)

  const [sessionDetail, setsessionDetail] = useState('' as any)

  useEffect(() => {
    const handleEvent = (event: any) => {
      setsessionDetail(event.detail)
      sessionStorage.setItem('setCard', JSON.stringify(event.detail.sessionSourceValue))
    }
    eventBus.addEventListener('getSessionId', handleEvent)
  }, [])

  const [feedSubmitted, setFeedSubmitted] = useState(true)
  const feedlysubmit = (e: any) => {
    e.preventDefault()
    setFeedSubmitted(!feedSubmitted)
    let feedSubmit = document.getElementById('feedSubmit')
    feedSubmit?.click()
  }

  const [splunkSubmitted, setSplunkSubmitted] = useState(true)
  const splunksubmit = (e: any) => {
    e.preventDefault()
    setSplunkSubmitted(!splunkSubmitted)
    let splunkSubmit = document.getElementById('splunkSubmit')
    splunkSubmit?.click()
  }

  useEffect(() => {
    if (getroleName?.roleName === 'USER') {
      setdatavaultlists(dataVaultdomainIdList)
    } else if (
      getroleName?.roleName == 'ACCOUNT_ADMIN' ||
      getroleName?.roleName == 'SUPER_ADMIN' ||
      getroleName?.roleName == 'DATAVAULT_ADMIN'
    ) {
      setdatavaultlists(dataVaultlist)
    }
  }, [dataVaultlist, dataVaultdomainIdList])

  useEffect(() => {
    setRepoName('')
    fetchdata()
    if (getroleName?.roleName === 'USER' || getroleName?.roleName == 'DATAVAULT_ADMIN') {
      dispatch(dataVaultuserIdList(token, userId) as any)
        .then((res: any) => {
          if (res.type == 'DATAVAULT_ID_SUCCESS') {
            setsearchValue(res.payload)
            setDatavaultlist(res.payload)
          }
        })
        .catch((err: any) => console.log('err', err))
    } else if (getroleName?.roleName == 'ACCOUNT_ADMIN' || getroleName?.roleName == 'SUPER_ADMIN') {
      dispatch(dataVaultList(token) as any)
        .then((res: any) => {
          if (res.type == 'DATAVAULT_DETAIL_SUCCESS') {
            setsearchValue(res.payload)
            setDatavaultlist(res.payload)
          }
        })
        .catch((err: any) => console.log('err', err))
    }
    dispatch(UserList(token) as any)
    dispatch(RoleList(token) as any)
    dispatch(vaultPermissionroleList(id) as any)
  }, [])

  let [path, pathname, pathid, id, name, nameId] = location.pathname.split('/')
  const [showUrlError, setShowUrlError] = useState(false)

  if (pathid == 'VaultPermission') {
    pathid = 'Sigma Files'
  } else if (pathid == 'Repository') {
    pathid = 'CTI Reports'
  } else if (pathid == 'Dataingestion') {
    pathid = 'Data Ingestion'
  }
  const [selectedCard, setSelectedCard] = useState(0 as any)

  const selectSources = (item: any) => {
    const sessionValueUpdate = {
      sessionName: sessionDetail.sessionName,
      sessionSourceValue: Number(item),
    }

    dispatch(UpdateSessionSourceValue(sessionValueUpdate, sessionDetail.id) as any)

    setSelectedCard(item)
    let datavault: any = []
    if (item == '0') {
      datavaultlists.map((item: any) => {
        if (item.name == 'Built-in-Knowledge') {
          datavault.push(item.id)
        }
      })
      sessionStorage.setItem('datavaultsId', JSON.stringify(datavault))
      sessionStorage.setItem('setCard', JSON.stringify(0))
    }
    if (item == '1') {
      {
        location.pathname === '/app/history' || location.pathname === '/app/history/newchat'
          ? navigateTo(`/app/selectsource`)
          : navigateTo(`/app/selectsource/${sessionDetail.id}`)
      }
      sessionStorage.setItem('setCard', JSON.stringify(1))
    } else if (item == '2') {
      datavaultlists.map((item: any) => {
        if (item.name !== 'Built-in-Knowledge') {
          datavault.push(item.id)
        }
      })
      sessionStorage.setItem('datavaultsId', JSON.stringify(datavault))
      sessionStorage.setItem('setCard', JSON.stringify(2))
    }
    setAnchorE3(null)
  }

  let getName: any
  datavaultlists
    ?.filter((item: any) => {
      return item.id == id
    })
    .map((test: any) => {
      getName = test.name
    })

  let setDetailselect: any
  setDetailselect = JSON.parse(sessionStorage.getItem('breadcrumNames') || '{}')
  if (setDetailselect?.length > 0 && documentName == getName) {
    sessionStorage.setItem('breadcrumNames', JSON.stringify(setDetailselect))

    setDetailselect
      ?.filter((item: any) => {
        return item.id == id
      })
      .map((test: any) => {
        documentName = test.name
      })
    setDetailselect
      ?.filter((item: any) => {
        return item.id == nameId
      })
      .map((test: any) => {
        cardDetailName = test.name
      })
    setDetailselect
      ?.filter((item: any) => {
        return item.id == name
      })
      .map((test: any) => {
        cardDetailName = test.name
      })
  } else {
    sessionStorage.setItem('breadcrumNames', JSON.stringify(datavaultlists))
    datavaultlists
      ?.filter((item: any) => {
        return item.id == id
      })
      .map((test: any) => {
        documentName = test.name
      })
    datavaultlists
      ?.filter((item: any) => {
        return item.id == nameId
      })
      .map((test: any) => {
        cardDetailName = test.name
      })
    datavaultlists
      ?.filter((item: any) => {
        return item.id == name
      })
      .map((test: any) => {
        cardDetailName = test.name
      })
  }
  const userDetails = useSelector((state: any) => state.userDetailreducer)
  const { domainDetail } = userDetails

  domainDetail
    ?.filter((item: any) => {
      return item.email == auth.user?.user?.email
    })
    .map((test: any) => {
      let firstName: any = test.firstName
      let lastName: any = test.lastName === null ? '' : test.lastName
      userName = firstName + ' ' + lastName
    })

  const fetchdata = () => {
    setRepoName('')
    if (getroleName?.roleName === 'USER' || getroleName?.roleName == 'DATAVAULT_ADMIN') {
      dispatch(dataVaultuserIdList(token, userId) as any)
        .then((res: any) => {
          if (res.type == 'DATAVAULT_ID_SUCCESS') {
            let valtName: any = res?.payload?.find((x: any) => x.id == Number(paramsId))
            setRepoName(valtName)
            setsearchValue(res.payload)
          }
        })
        .catch((err: any) => console.log('err', err))
    } else if (getroleName?.roleName == 'ACCOUNT_ADMIN' || getroleName?.roleName == 'SUPER_ADMIN') {
      dispatch(dataVaultList(token) as any)
        .then((res: any) => {
          if (res.type == 'DATAVAULT_DETAIL_SUCCESS') {
            let valtName: any = res?.payload?.find((x: any) => x.id == Number(paramsId))
            setRepoName(valtName)
            setsearchValue(res.payload)
          }
        })
        .catch((err: any) => console.log('err', err))
    }
  }

  chatlist
    ?.filter((row: any) => {
      return row.id == id
    })
    .map((test: any) => {
      chatlistName = test.name
    })

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const { ctiReportFiles } = useSelector((state: any) => state.datactiReportreducer)
  const [anchorE3, setAnchorE3] = React.useState(null)
  const opens = Boolean(anchorE3)
  const handleClicked = (event: any) => {
    setAnchorE3(event.currentTarget)
  }
  const handleClosed = () => {
    setAnchorE3(null)
  }

  const ChatselectSource = () => {
    {
      location.pathname === `/app/selectsource/${id}/Crmmarketing/${nameId}` ||
        location.pathname === `/app/selectsource/${id}`
        ? navigateTo(`/app/history/${id}`)
        : navigateTo(`/app/history`)
    }
  }

  const selectSourceCrm = () => {
    {
      location.pathname === `/app/selectsource/${id}/Crmmarketing/${nameId}` ||
        location.pathname === '/app/history/newchat'
        ? navigateTo(`/app/selectsource/${id}`)
        : navigateTo(`/app/selectsource`)
    }
    navigateTo(`/app/selectsource/${id}`)
  }

  // **************************************ADD URL*************************************

  const [addUrlPopup, setAddUrlPopup] = useState(false)

  const [showModalDomain, setShowModalDomain] = useState(false)

  const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(() => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: '#fff',
    },
    [`& .${tooltipClasses.tooltip}`]: {
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.6)', // Add box shadow here
      backgroundColor: '#fff',
      color: '#000',
    },
  }))

  let dataName: any = JSON.parse(sessionStorage.getItem('RepostoryData') || '{}')
  let fileName: any = []
  if (dataName?.length > 0) {
    dataName.map((item: any) => {
      fileName.push(item.name)
    })
  }

  let {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm()

  const [ctiNameDisabled, setctinameDisabled] = useState(false)
  const [urlDisabled, setUrlDisabled] = useState(false)
  const [feedlyUrlDisabled, setFeedlyUrlDisabled] = useState(false)
  const urlValidation = (e: any) => {
    if ((e.target.name == 'url' || e.target.name == 'ctiName') && e.target.value) {
      setctinameDisabled(false)
      setUrlDisabled(false)
      setFeedlyUrlDisabled(true)
    } else if (e.target.name == 'streamID' && e.target.value) {
      setctinameDisabled(true)
      setUrlDisabled(true)
      setFeedlyUrlDisabled(false)
    } else if (e.target.value == '') {
      setctinameDisabled(false)
      setUrlDisabled(false)
      setFeedlyUrlDisabled(false)
    }
  }

  const [urlDomains, seturlDomines] = useState([] as any)
  useEffect(() => {
    dispatch(qualifiedUrls() as any).then((response: any) => {
      seturlDomines(response.payload)
    })
  }, [])

  const feedly = () => {
    navigateTo(`/app/feedyintegration`)
  }
  const splunk = () => {
    navigateTo(`/app/feedyintegration`)
  }

  const onSubmitURL = async (e: any) => {
    if (e.url) {
      if (!honourWhitelist) {
        let files: any = ctiReportFiles?.filter((item: any) => {
          return e.url == item.url
        })
        if (files?.length > 0) {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'This Website Already Exists!',
            color: '#000',
            width: 400,
            timer: 2000,
            showConfirmButton: false,
          })
          setctinameDisabled(false)
          setUrlDisabled(false)
          setFeedlyUrlDisabled(false)
          setAddUrlPopup(false)
          reset()
        } else {
          dispatch(dataingestionUrl({ e, id }) as any)
            .then((data: any) => {
              if (data.type == 'DATAVAULT_DATAINGESTIONURL_SUCCESS') {
                setAddUrlPopup(false)
                setctinameDisabled(false)
                setUrlDisabled(false)
                setFeedlyUrlDisabled(false)
                reset()
                navigateTo(`/app/Repository/${id}`)
              }
            })
            .catch((err: any) => {
              console.log(err)
            })
        }
      } else {
        const url = new URL(e.url)
        let hostname = new URL(url).hostname.replace(/^www\./, '')
        let baseurls = urlDomains?.find((x: any) => x.baseUrl == hostname)
        if (baseurls) {
          let files: any = ctiReportFiles?.filter((item: any) => {
            return e.url == item.url
          })
          if (files?.length > 0) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'This Website Already Exists!',
              color: '#000',
              width: 400,
              timer: 2000,
              showConfirmButton: false,
            })
            setctinameDisabled(false)
            setUrlDisabled(false)
            setFeedlyUrlDisabled(false)
            setAddUrlPopup(false)
            reset()
          } else {
            dispatch(dataingestionUrl({ e, id }) as any)
              .then((data: any) => {
                if (data.type == 'DATAVAULT_DATAINGESTIONURL_SUCCESS') {
                  setAddUrlPopup(false)
                  reset()
                  setctinameDisabled(false)
                  setUrlDisabled(false)
                  setFeedlyUrlDisabled(false)
                  navigateTo(`/app/Repository/${id}`)
                }
              })
              .catch((err: any) => {
                console.log(err)
              })
          }
        } else {
          let object = {
            baseUrl: hostname,
          }
          dispatch(addCtiWhitelist(object) as any).then((response: any) => {
            setAddUrlPopup(false)
            setShowModalDomain(true)
          })
        }
      }
    } else {
      const feedlypost: any = {
        vaultId: id,
        feedlyStreams: [
          {
            streamId: e.streamID,
          },
        ],
      }

      dispatch(feedlCtiPost(feedlypost) as any)
        .then((response: any) => {
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

          if (response) {
            if (response.payload == 'PROCESSING') {
              const feedlyString = sessionStorage.getItem('feedly')
              if (feedlyString) {
                if (valutArray.length > 0) {
                  const feedlys: any = [
                    ...valutArray,
                    { vaultId: id, response: response.payload, streamID: e.streamID },
                  ]
                  sessionStorage.setItem('feedly', JSON.stringify(feedlys))
                } else {
                  sessionStorage.setItem(
                    'feedly',
                    JSON.stringify([
                      { vaultId: id, response: response.payload, streamID: e.streamID },
                    ]),
                  )
                }
              } else {
                sessionStorage.setItem(
                  'feedly',
                  JSON.stringify([
                    { vaultId: id, response: response.payload, streamID: e.streamID },
                  ]),
                )
              }
            }
            setData(response.payload)
            reset()
            setctinameDisabled(false)
            setUrlDisabled(false)
            setFeedlyUrlDisabled(false)
            setAddUrlPopup(false)
            dispatch({ type: ADD_CTI_FEEDLY_FORM_RESET })
          }
        })
        .catch((error: any) => {
          console.log(error)
        })
    }
  }
  useEffect(() => {
    if (showModalDomain) {
      setTimeout(() => {
        setShowModalDomain(false)
      }, 3000)
    }
  }, [showModalDomain])

  const clearError = () => {
    setctinameDisabled(false)
    setUrlDisabled(false)
    setFeedlyUrlDisabled(false)
    setAddUrlPopup(false)
    errors.weburl = {}
    reset()
  }

  const [repoName, setRepoName] = useState('' as any)

  useEffect(() => {
    const getname: any = sessionStorage.getItem('sessionName')
    const sessionNames: any = JSON.parse(getname)
    if (state) {
      setSelectedFile(state?.ctiName ? state?.ctiName : state?.sessionName)
    } else {
      setSelectedFile(sessionNames?.sessionName)
    }
    setRepoName('')
    if (!state) {
      fetchdata()
    }
  }, [state])
  // **************************************UPLOAD FILE*************************************
  let {
    register: uploadRegister,
    handleSubmit: uploadSubmit,
    reset: uploadReset,
    formState: { errors: uploadErrors },
  } = useForm()
  const [uploadFilePopup, setUploadFilePopup] = useState(false)
  const [files, setFiles] = useState<any>([])
  const file: any = []
  const [fileList, setFileList] = useState(null)
  const [img, setImg] = useState([] as any)
  const inputRef = useRef<any>(null)

  let uploadstatus: any = []
  const Uploadfiles = fileList ? [...fileList] : []
  Uploadfiles.forEach((file: any) => {
    uploadstatus.push(file)
  })
  const { setData, setDetail, SaveValue, dacFolderId,
    setDacFolderId, impFolderId,
    setImpFolderId }: any = useData()

  const repository = (event: any) => {
    if (files.length > 0) {
      let documentdata: any = []
      const data = new FormData()
      data.append('datavaultId', id as any)
      Uploadfiles.forEach((file: any, index: any) => {
        let files: any = fileName.filter((item: any) => {
          return file.name == item
        })
        if (files?.length > 0) {
          Swal.fire({
            position: 'center',
            color: '#000',
            icon: 'warning',
            title: 'This File is Already Exists',
            width: 400,
            timer: 2000,
            showConfirmButton: false,
          })
        } else {
          data.append('files', file)
          documentdata.push({
            id: index + 1,
            name: file.name,
            type: file.name.split('.').pop().toUpperCase(),
            status: true,
            accessType: 'WRITE',
            documentSize: file.size,
          })
        }
      })
      const repotIds = {
        datavaultId: id,
        ctiId: 0,
      }

      dispatch(dataIngestion(data, repotIds) as any)
        .then((datas: any) => {
          if (datas.type == 'CREATE_NEW_DATAINGESTION_SUCCESS') {
            setFiles([])
            setUploadFilePopup(false)
            setData('FILE_UPLOADED')
          }
        })
        .catch((error: any) => {
          console.log('error', error)
        })
      sessionStorage.setItem('uploaddetails', JSON.stringify(documentdata))
    }
    if (files.length == 0 && !uploadErrors.filetitle) {
      document.getElementById('input_focus')?.classList.add('border-slate-950')
    }
  }
  const closeModal = () => {
    setUploadFilePopup(false)
    uploadReset()
    setFiles([])
  }

  function removeFile(fileName: any, idx: any) {
    const newArr = [...files]
    newArr.splice(idx, 1)
    setFiles([])
    setFiles(newArr)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  function handleDrop(e: any) {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileList(e.dataTransfer.files)
      for (let i = 0; i < e.dataTransfer.files['length']; i++) {
        let arr: any = []
        img.map((image: any) => {
          if (e.dataTransfer.files[i].type.includes(image.name)) {
            arr.push({
              fileName: e.dataTransfer.files[i],
              type: e.dataTransfer.files[i].type,
              path: image.path,
            })
          } else if (e.dataTransfer.files[i].name.split('.').includes(image.name)) {
            arr.push({
              fileName: e.dataTransfer.files[i],
              type: e.dataTransfer.files[i].type,
              path: image.path,
            })
          }
        })
        setFiles((prevState: any) => [...prevState, ...arr])
      }
    }
  }

  function handleDragLeave(e: any) {
    e.preventDefault()
    e.stopPropagation()
  }
  function handleDragOver(e: any) {
    e.preventDefault()
    e.stopPropagation()
  }
  function handleDragEnter(e: any) {
    e.preventDefault()
    e.stopPropagation()
  }
  function handleChange(e: any) {
    if (e.target.files && e.target.files.length > 0) {
      setFileList(e.target.files)
      for (let i = 0; i < e.target.files['length']; i++) {
        let arr: any = []
        img.map((image: any) => {
          if (e.target.files[i].type.includes(image.name)) {
            arr.push({
              fileName: e.target.files[i],
              type: e.target.files[i].type,
              path: image.path,
            })
          } else if (e.target.files[i].name.split('.').includes(image.name)) {
            arr.push({
              fileName: e.target.files[i],
              type: e.target.files[i].type,
              path: image.path,
            })
          }
        })
        setFiles((prevState: any) => [...prevState, ...arr])
      }
    }
  }
  const getData = () => {
    setImg([
      {
        name: 'pdf',
        path: "<svg><path d='M7.75 4C7.75 2.20508 9.20508 0.75 11 0.75H27C27.1212 0.75 27.2375 0.798159 27.3232 0.883885L38.1161 11.6768C38.2018 11.7625 38.25 11.8788 38.25 12V36C38.25 37.7949 36.7949 39.25 35 39.25H11C9.20507 39.25 7.75 37.7949 7.75 36V4Z' fill='white' stroke='#D0D5DD' strokeWidth='1.5'/> <rect x='1' y='18' width='26' height='16' rx='2' fill='#D92D20' /> <path d='M27 0.5V8C27 10.2091 28.7909 12 31 12H38.5' stroke='#D0D5DD' strokeWidth='1.5'/> <path d='M4.8323 30V22.7273H7.70162C8.25323 22.7273 8.72316 22.8326 9.11142 23.0433C9.49967 23.2517 9.7956 23.5417 9.9992 23.9134C10.2052 24.2827 10.3082 24.7088 10.3082 25.1918C10.3082 25.6747 10.204 26.1009 9.99565 26.4702C9.78732 26.8395 9.48547 27.1271 9.09011 27.3331C8.69712 27.5391 8.22127 27.642 7.66255 27.642H5.83372V26.4098H7.41397C7.7099 26.4098 7.95375 26.3589 8.14551 26.2571C8.33964 26.1529 8.48405 26.0097 8.57875 25.8274C8.67581 25.6428 8.72434 25.4309 8.72434 25.1918C8.72434 24.9503 8.67581 24.7396 8.57875 24.5597C8.48405 24.3774 8.33964 24.2365 8.14551 24.1371C7.95138 24.0353 7.70517 23.9844 7.40687 23.9844H6.36994V30H4.8323ZM13.885 30H11.3069V22.7273H13.9063C14.6379 22.7273 15.2676 22.8729 15.7955 23.1641C16.3235 23.4529 16.7295 23.8684 17.0136 24.4105C17.3 24.9527 17.4433 25.6013 17.4433 26.3565C17.4433 27.1141 17.3 27.7652 17.0136 28.3097C16.7295 28.8542 16.3211 29.272 15.7884 29.5632C15.2581 29.8544 14.6237 30 13.885 30ZM12.8445 28.6825H13.8211C14.2757 28.6825 14.658 28.602 14.9681 28.4411C15.2806 28.2777 15.515 28.0256 15.6713 27.6847C15.8299 27.3414 15.9092 26.8987 15.9092 26.3565C15.9092 25.8191 15.8299 25.38 15.6713 25.0391C15.515 24.6982 15.2818 24.4472 14.9717 24.2862C14.6615 24.1252 14.2792 24.0447 13.8247 24.0447H12.8445V28.6825ZM18.5823 30V22.7273H23.3976V23.995H20.1199V25.728H23.078V26.9957H20.1199V30H18.5823Z' fill='white'/></svg>",
      },

      {
        name: 'json',
        path: "<svg><path d='M7.75 4C7.75 2.20508 9.20508 0.75 11 0.75H27C27.1212 0.75 27.2375 0.798159 27.3232 0.883885L38.1161 11.6768C38.2018 11.7625 38.25 11.8788 38.25 12V36C38.25 37.7949 36.7949 39.25 35 39.25H11C9.20507 39.25 7.75 37.7949 7.75 36V4Z' fill='white' stroke='#D0D5DD' strokeWidth='1.5'/><path d='M27 0.5V8C27 10.2091 28.7909 12 31 12H38.5' stroke='#D0D5DD' strokeWidth='1.5'/><rect x='1' y='18' width='34' height='16' rx='2' fill='#444CE7'/><path d='M7.82821 22.7273H9.3481V27.7983C9.3481 28.267 9.24275 28.6742 9.03205 29.0199C8.82372 29.3655 8.53371 29.6319 8.16202 29.8189C7.79033 30.0059 7.35828 30.0994 6.86586 30.0994C6.42788 30.0994 6.03016 30.0225 5.67267 29.8686C5.31756 29.7124 5.03584 29.4756 4.8275 29.1584C4.61917 28.8388 4.51619 28.4375 4.51855 27.9545H6.04909C6.05383 28.1463 6.09289 28.3108 6.16628 28.4482C6.24204 28.5831 6.34502 28.6873 6.47523 28.7607C6.60781 28.8317 6.76406 28.8672 6.94398 28.8672C7.13337 28.8672 7.29318 28.8269 7.42338 28.7464C7.55596 28.6636 7.65658 28.5429 7.72523 28.3842C7.79389 28.2256 7.82821 28.0303 7.82821 27.7983V22.7273ZM14.5647 24.8189C14.5363 24.5324 14.4144 24.3099 14.199 24.1513C13.9835 23.9927 13.6911 23.9134 13.3218 23.9134C13.0709 23.9134 12.859 23.9489 12.6862 24.0199C12.5133 24.0885 12.3808 24.1844 12.2884 24.3075C12.1985 24.4306 12.1535 24.5703 12.1535 24.7266C12.1488 24.8568 12.176 24.9704 12.2352 25.0675C12.2967 25.1645 12.3808 25.2486 12.4873 25.3196C12.5938 25.3883 12.7169 25.4486 12.8566 25.5007C12.9963 25.5504 13.1454 25.593 13.3041 25.6286L13.9575 25.7848C14.2747 25.8558 14.5659 25.9505 14.8311 26.0689C15.0962 26.1873 15.3258 26.3329 15.52 26.5057C15.7141 26.6785 15.8644 26.8821 15.971 27.1165C16.0799 27.3509 16.1355 27.6196 16.1379 27.9226C16.1355 28.3677 16.0219 28.7536 15.797 29.0803C15.5744 29.4046 15.2525 29.6567 14.8311 29.8366C14.412 30.0142 13.9066 30.103 13.3147 30.103C12.7276 30.103 12.2162 30.013 11.7806 29.8331C11.3474 29.6532 11.0088 29.3868 10.765 29.0341C10.5235 28.679 10.3969 28.2398 10.385 27.7166H11.873C11.8895 27.9605 11.9594 28.1641 12.0825 28.3274C12.2079 28.4884 12.3749 28.6103 12.5832 28.6932C12.7939 28.7737 13.0318 28.8139 13.297 28.8139C13.5574 28.8139 13.7835 28.776 13.9752 28.7003C14.1694 28.6245 14.3197 28.5192 14.4262 28.3842C14.5328 28.2493 14.586 28.0942 14.586 27.919C14.586 27.7557 14.5375 27.6184 14.4404 27.5071C14.3457 27.3958 14.2061 27.3011 14.0214 27.223C13.8391 27.1449 13.6154 27.0739 13.3502 27.0099L12.5583 26.8111C11.9452 26.6619 11.461 26.4287 11.1059 26.1115C10.7508 25.7943 10.5744 25.367 10.5768 24.8295C10.5744 24.3892 10.6916 24.0045 10.9284 23.6754C11.1675 23.3464 11.4954 23.0895 11.912 22.9048C12.3287 22.7202 12.8022 22.6278 13.3325 22.6278C13.8722 22.6278 14.3434 22.7202 14.7458 22.9048C15.1507 23.0895 15.4655 23.3464 15.6904 23.6754C15.9153 24.0045 16.0313 24.3857 16.0384 24.8189H14.5647ZM23.8554 26.3636C23.8554 27.1567 23.705 27.8314 23.4044 28.3878C23.1061 28.9441 22.6989 29.3691 22.1828 29.6626C21.6691 29.9538 21.0914 30.0994 20.4498 30.0994C19.8035 30.0994 19.2235 29.9527 18.7098 29.6591C18.1961 29.3655 17.79 28.9406 17.4917 28.3842C17.1934 27.8279 17.0443 27.1544 17.0443 26.3636C17.0443 25.5705 17.1934 24.8958 17.4917 24.3395C17.79 23.7831 18.1961 23.3594 18.7098 23.0682C19.2235 22.7746 19.8035 22.6278 20.4498 22.6278C21.0914 22.6278 21.6691 22.7746 22.1828 23.0682C22.6989 23.3594 23.1061 23.7831 23.4044 24.3395C23.705 24.8958 23.8554 25.5705 23.8554 26.3636ZM22.2964 26.3636C22.2964 25.8499 22.2195 25.4167 22.0656 25.0639C21.9141 24.7112 21.6998 24.4437 21.4229 24.2614C21.1459 24.0791 20.8215 23.9879 20.4498 23.9879C20.0782 23.9879 19.7538 24.0791 19.4768 24.2614C19.1998 24.4437 18.9844 24.7112 18.8305 25.0639C18.679 25.4167 18.6032 25.8499 18.6032 26.3636C18.6032 26.8774 18.679 27.3106 18.8305 27.6634C18.9844 28.0161 19.1998 28.2836 19.4768 28.4659C19.7538 28.6482 20.0782 28.7393 20.4498 28.7393C20.8215 28.7393 21.1459 28.6482 21.4229 28.4659C21.6998 28.2836 21.9141 28.0161 22.0656 27.6634C22.2195 27.3106 22.2964 26.8774 22.2964 26.3636ZM31.0775 22.7273V30H29.7494L26.5853 25.4226H26.532V30H24.9944V22.7273H26.3438L29.483 27.3011H29.547V22.7273H31.0775Z' fill='white'/></svg>",
      },

      {
        name: 'doc',
        path: "<svg><path d='M7.75 4C7.75 2.20508 9.20508 0.75 11 0.75H27C27.1212 0.75 27.2375 0.798159 27.3232 0.883885L38.1161 11.6768C38.2018 11.7625 38.25 11.8788 38.25 12V36C38.25 37.7949 36.7949 39.25 35 39.25H11C9.20507 39.25 7.75 37.7949 7.75 36V4Z' fill='white' stroke='#D0D5DD' strokeWidth='1.5'/><path d=M27 0.5V8C27 10.2091 28.7909 12 31 12H38.5' stroke='#D0D5DD' strokeWidth='1.5'/><rect x='1' y='18' width='29' height='16' rx='2' fill='#155EEF'/><path d='M7.40163 30H4.82351V22.7273H7.42294C8.15447 22.7273 8.78421 22.8729 9.31214 23.1641C9.84008 23.4529 10.2461 23.8684 10.5302 24.4105C10.8166 24.9527 10.9599 25.6013 10.9599 26.3565C10.9599 27.1141 10.8166 27.7652 10.5302 28.3097C10.2461 28.8542 9.83771 29.272 9.30504 29.5632C8.77474 29.8544 8.14027 30 7.40163 30ZM6.36115 28.6825H7.33771C7.79226 28.6825 8.1746 28.602 8.48473 28.4411C8.79723 28.2777 9.03161 28.0256 9.18786 27.6847C9.34647 27.3414 9.42578 26.8987 9.42578 26.3565C9.42578 25.8191 9.34647 25.38 9.18786 25.0391C9.03161 24.6982 8.79841 24.4472 8.48828 24.2862C8.17815 24.1252 7.79581 24.0447 7.34126 24.0447H6.36115V28.6825ZM18.7821 26.3636C18.7821 27.1567 18.6318 27.8314 18.3311 28.3878C18.0328 28.9441 17.6257 29.3691 17.1096 29.6626C16.5958 29.9538 16.0182 30.0994 15.3766 30.0994C14.7303 30.0994 14.1503 29.9527 13.6365 29.6591C13.1228 29.3655 12.7168 28.9406 12.4185 28.3842C12.1202 27.8279 11.9711 27.1544 11.9711 26.3636C11.9711 25.5705 12.1202 24.8958 12.4185 24.3395C12.7168 23.7831 13.1228 23.3594 13.6365 23.0682C14.1503 22.7746 14.7303 22.6278 15.3766 22.6278C16.0182 22.6278 16.5958 22.7746 17.1096 23.0682C17.6257 23.3594 18.0328 23.7831 18.3311 24.3395C18.6318 24.8958 18.7821 25.5705 18.7821 26.3636ZM17.2232 26.3636C17.2232 25.8499 17.1462 25.4167 16.9924 25.0639C16.8408 24.7112 16.6266 24.4437 16.3496 24.2614C16.0726 24.0791 15.7483 23.9879 15.3766 23.9879C15.0049 23.9879 14.6806 24.0791 14.4036 24.2614C14.1266 24.4437 13.9112 24.7112 13.7573 25.0639C13.6058 25.4167 13.53 25.8499 13.53 26.3636C13.53 26.8774 13.6058 27.3106 13.7573 27.6634C13.9112 28.0161 14.1266 28.2836 14.4036 28.4659C14.6806 28.6482 15.0049 28.7393 15.3766 28.7393C15.7483 28.7393 16.0726 28.6482 16.3496 28.4659C16.6266 28.2836 16.8408 28.0161 16.9924 27.6634C17.1462 27.3106 17.2232 26.8774 17.2232 26.3636ZM26.3381 25.2734H24.7827C24.7543 25.0722 24.6963 24.8935 24.6087 24.7372C24.5211 24.5786 24.4086 24.4437 24.2713 24.3324C24.134 24.2211 23.9754 24.1359 23.7955 24.0767C23.6179 24.0175 23.425 23.9879 23.2166 23.9879C22.8402 23.9879 22.5123 24.0814 22.233 24.2685C21.9536 24.4531 21.737 24.723 21.5831 25.0781C21.4292 25.4309 21.3523 25.8594 21.3523 26.3636C21.3523 26.8821 21.4292 27.3177 21.5831 27.6705C21.7393 28.0232 21.9571 28.2895 22.2365 28.4695C22.5159 28.6494 22.839 28.7393 23.206 28.7393C23.4119 28.7393 23.6025 28.7121 23.7777 28.6577C23.9553 28.6032 24.1127 28.5239 24.25 28.4197C24.3873 28.3132 24.5009 28.1842 24.5909 28.0327C24.6832 27.8812 24.7472 27.7083 24.7827 27.5142L26.3381 27.5213C26.2978 27.8551 26.1972 28.1771 26.0362 28.4872C25.8776 28.795 25.6634 29.0708 25.3935 29.3146C25.1259 29.5561 24.8063 29.7479 24.4347 29.8899C24.0653 30.0296 23.6475 30.0994 23.1811 30.0994C22.5324 30.0994 21.9524 29.9527 21.4411 29.6591C20.9321 29.3655 20.5296 28.9406 20.2337 28.3842C19.9401 27.8279 19.7933 27.1544 19.7933 26.3636C19.7933 25.5705 19.9425 24.8958 20.2408 24.3395C20.5391 23.7831 20.9439 23.3594 21.4553 23.0682C21.9666 22.7746 22.5419 22.6278 23.1811 22.6278C23.6025 22.6278 23.9931 22.687 24.353 22.8054C24.7152 22.9238 25.036 23.0966 25.3153 23.3239C25.5947 23.5488 25.822 23.8246 25.9972 24.1513C26.1747 24.478 26.2884 24.852 26.3381 25.2734Z' fill='white'/></svg",
      },
      {
        name: 'msword',
        path: "<svg><path d='M7.75 4C7.75 2.20508 9.20508 0.75 11 0.75H27C27.1212 0.75 27.2375 0.798159 27.3232 0.883885L38.1161 11.6768C38.2018 11.7625 38.25 11.8788 38.25 12V36C38.25 37.7949 36.7949 39.25 35 39.25H11C9.20507 39.25 7.75 37.7949 7.75 36V4Z' fill='white' stroke='#D0D5DD' strokeWidth='1.5'/><path d=M27 0.5V8C27 10.2091 28.7909 12 31 12H38.5' stroke='#D0D5DD' strokeWidth='1.5'/><rect x='1' y='18' width='29' height='16' rx='2' fill='#155EEF'/><path d='M7.40163 30H4.82351V22.7273H7.42294C8.15447 22.7273 8.78421 22.8729 9.31214 23.1641C9.84008 23.4529 10.2461 23.8684 10.5302 24.4105C10.8166 24.9527 10.9599 25.6013 10.9599 26.3565C10.9599 27.1141 10.8166 27.7652 10.5302 28.3097C10.2461 28.8542 9.83771 29.272 9.30504 29.5632C8.77474 29.8544 8.14027 30 7.40163 30ZM6.36115 28.6825H7.33771C7.79226 28.6825 8.1746 28.602 8.48473 28.4411C8.79723 28.2777 9.03161 28.0256 9.18786 27.6847C9.34647 27.3414 9.42578 26.8987 9.42578 26.3565C9.42578 25.8191 9.34647 25.38 9.18786 25.0391C9.03161 24.6982 8.79841 24.4472 8.48828 24.2862C8.17815 24.1252 7.79581 24.0447 7.34126 24.0447H6.36115V28.6825ZM18.7821 26.3636C18.7821 27.1567 18.6318 27.8314 18.3311 28.3878C18.0328 28.9441 17.6257 29.3691 17.1096 29.6626C16.5958 29.9538 16.0182 30.0994 15.3766 30.0994C14.7303 30.0994 14.1503 29.9527 13.6365 29.6591C13.1228 29.3655 12.7168 28.9406 12.4185 28.3842C12.1202 27.8279 11.9711 27.1544 11.9711 26.3636C11.9711 25.5705 12.1202 24.8958 12.4185 24.3395C12.7168 23.7831 13.1228 23.3594 13.6365 23.0682C14.1503 22.7746 14.7303 22.6278 15.3766 22.6278C16.0182 22.6278 16.5958 22.7746 17.1096 23.0682C17.6257 23.3594 18.0328 23.7831 18.3311 24.3395C18.6318 24.8958 18.7821 25.5705 18.7821 26.3636ZM17.2232 26.3636C17.2232 25.8499 17.1462 25.4167 16.9924 25.0639C16.8408 24.7112 16.6266 24.4437 16.3496 24.2614C16.0726 24.0791 15.7483 23.9879 15.3766 23.9879C15.0049 23.9879 14.6806 24.0791 14.4036 24.2614C14.1266 24.4437 13.9112 24.7112 13.7573 25.0639C13.6058 25.4167 13.53 25.8499 13.53 26.3636C13.53 26.8774 13.6058 27.3106 13.7573 27.6634C13.9112 28.0161 14.1266 28.2836 14.4036 28.4659C14.6806 28.6482 15.0049 28.7393 15.3766 28.7393C15.7483 28.7393 16.0726 28.6482 16.3496 28.4659C16.6266 28.2836 16.8408 28.0161 16.9924 27.6634C17.1462 27.3106 17.2232 26.8774 17.2232 26.3636ZM26.3381 25.2734H24.7827C24.7543 25.0722 24.6963 24.8935 24.6087 24.7372C24.5211 24.5786 24.4086 24.4437 24.2713 24.3324C24.134 24.2211 23.9754 24.1359 23.7955 24.0767C23.6179 24.0175 23.425 23.9879 23.2166 23.9879C22.8402 23.9879 22.5123 24.0814 22.233 24.2685C21.9536 24.4531 21.737 24.723 21.5831 25.0781C21.4292 25.4309 21.3523 25.8594 21.3523 26.3636C21.3523 26.8821 21.4292 27.3177 21.5831 27.6705C21.7393 28.0232 21.9571 28.2895 22.2365 28.4695C22.5159 28.6494 22.839 28.7393 23.206 28.7393C23.4119 28.7393 23.6025 28.7121 23.7777 28.6577C23.9553 28.6032 24.1127 28.5239 24.25 28.4197C24.3873 28.3132 24.5009 28.1842 24.5909 28.0327C24.6832 27.8812 24.7472 27.7083 24.7827 27.5142L26.3381 27.5213C26.2978 27.8551 26.1972 28.1771 26.0362 28.4872C25.8776 28.795 25.6634 29.0708 25.3935 29.3146C25.1259 29.5561 24.8063 29.7479 24.4347 29.8899C24.0653 30.0296 23.6475 30.0994 23.1811 30.0994C22.5324 30.0994 21.9524 29.9527 21.4411 29.6591C20.9321 29.3655 20.5296 28.9406 20.2337 28.3842C19.9401 27.8279 19.7933 27.1544 19.7933 26.3636C19.7933 25.5705 19.9425 24.8958 20.2408 24.3395C20.5391 23.7831 20.9439 23.3594 21.4553 23.0682C21.9666 22.7746 22.5419 22.6278 23.1811 22.6278C23.6025 22.6278 23.9931 22.687 24.353 22.8054C24.7152 22.9238 25.036 23.0966 25.3153 23.3239C25.5947 23.5488 25.822 23.8246 25.9972 24.1513C26.1747 24.478 26.2884 24.852 26.3381 25.2734Z' fill='white'/></svg",
      },
      {
        name: 'text/plain',
        path: "<svg><path d='M7.75 4C7.75 2.20508 9.20508 0.75 11 0.75H27C27.1212 0.75 27.2375 0.798159 27.3232 0.883885L38.1161 11.6768C38.2018 11.7625 38.25 11.8788 38.25 12V36C38.25 37.7949 36.7949 39.25 35 39.25H11C9.20507 39.25 7.75 37.7949 7.75 36V4Z' fill='white' stroke='#D0D5DD' strokeWidth='1.5'/><path d='M27 0.5V8C27 10.2091 28.7909 12 31 12H38.5' stroke='#D0D5DD' strokeWidth='1.5'/><rect x='1' y='18' width='27' height='16' rx='2' fill='#344054'/><path d='M4.60121 23.995V22.7273H10.5742V23.995H8.34766V30H6.82777V23.995H4.60121ZM12.9996 22.7273L14.4663 25.206H14.5231L15.9968 22.7273H17.7333L15.5138 26.3636L17.783 30H16.0146L14.5231 27.5178H14.4663L12.9748 30H11.2134L13.4897 26.3636L11.256 22.7273H12.9996ZM18.4293 23.995V22.7273H24.4023V23.995H22.1758V30H20.6559V23.995H18.4293Z' fill='white'/></svg>",
      },
      {
        name: 'html',
        path: "<svg><path d='M7.75 4C7.75 2.20508 9.20508 0.75 11 0.75H27C27.1212 0.75 27.2375 0.798159 27.3232 0.883885L38.1161 11.6768C38.2018 11.7625 38.25 11.8788 38.25 12V36C38.25 37.7949 36.7949 39.25 35 39.25H11C9.20507 39.25 7.75 37.7949 7.75 36V4Z' fill='white' stroke='#D0D5DD' strokeWidth='1.5'/><path d='M27 0.5V8C27 10.2091 28.7909 12 31 12H38.5' stroke='#D0D5DD' strokeWidth='1.5'/><rect x='1' y='18' width='35' height='16' rx='2' fill='#444CE7'/><path d='M4.64968 30V22.7273H6.18732V25.728H9.30877V22.7273H10.8429V30H9.30877V26.9957H6.18732V30H4.64968ZM11.8336 23.995V22.7273H17.8066V23.995H15.5801V30H14.0602V23.995H11.8336ZM18.7903 22.7273H20.6866L22.6895 27.6136H22.7747L24.7775 22.7273H26.6738V30H25.1824V25.2663H25.122L23.2399 29.9645H22.2243L20.3422 25.2486H20.2818V30H18.7903V22.7273ZM27.9407 30V22.7273H29.4783V28.7322H32.5962V30H27.9407Z' fill='white'/></svg>",
      },
      {
        name: 'yml',
        path: "  <svg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M7.75 12C7.75 10.2051 9.20508 8.75 11 8.75H27C27.1212 8.75 27.2375 8.79816 27.3232 8.88388L38.1161 19.6768C38.2018 19.7625 38.25 19.8788 38.25 20V44C38.25 45.7949 36.7949 47.25 35 47.25H11C9.20507 47.25 7.75 45.7949 7.75 44V12Z' fill='white' stroke='#D0D5DD' stroke-width='1.5'/><path d='M27 8.5V16C27 18.2091 28.7909 20 31 20H38.5' stroke='#D0D5DD' stroke-width='1.5'/><path d='M34.6668 10.8282C33.8628 10.29 33.3335 9.37347 33.3335 8.33333C33.3335 6.77095 34.5278 5.48753 36.0533 5.34625C36.3654 3.44809 38.0137 2 40.0002 2C41.9867 2 43.635 3.44809 43.947 5.34625C45.4725 5.48753 46.6668 6.77095 46.6668 8.33333C46.6668 9.37347 46.1375 10.29 45.3335 10.8282M37.3335 10.6667L40.0002 8M40.0002 8L42.6668 10.6667M40.0002 8V14' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/><rect x='0.5' y='26' width='35' height='16' rx='2' fill='#444CE7'/><path d='M3.80167 30.7273H5.52397L7.18235 33.8594H7.25337L8.91175 30.7273H10.6341L7.98136 35.429V38H6.45437V35.429L3.80167 30.7273ZM11.9853 38H10.3375L12.8482 30.7273H14.8297L17.3368 38H15.6891L13.8674 32.3892H13.8105L11.9853 38ZM11.8823 35.1413H15.7743V36.3416H11.8823V35.1413ZM18.2122 30.7273H20.1085L22.1113 35.6136H22.1966L24.1994 30.7273H26.0957V38H24.6042V33.2663H24.5439L22.6618 37.9645H21.6461L19.764 33.2486H19.7037V38H18.2122V30.7273ZM27.3626 38V30.7273H28.9002V36.7322H32.0181V38H27.3626Z' fill='white'/></svg>",
      },
      {
        name: 'yaml',
        path: "  <svg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M7.75 12C7.75 10.2051 9.20508 8.75 11 8.75H27C27.1212 8.75 27.2375 8.79816 27.3232 8.88388L38.1161 19.6768C38.2018 19.7625 38.25 19.8788 38.25 20V44C38.25 45.7949 36.7949 47.25 35 47.25H11C9.20507 47.25 7.75 45.7949 7.75 44V12Z' fill='white' stroke='#D0D5DD' stroke-width='1.5'/><path d='M27 8.5V16C27 18.2091 28.7909 20 31 20H38.5' stroke='#D0D5DD' stroke-width='1.5'/><path d='M34.6668 10.8282C33.8628 10.29 33.3335 9.37347 33.3335 8.33333C33.3335 6.77095 34.5278 5.48753 36.0533 5.34625C36.3654 3.44809 38.0137 2 40.0002 2C41.9867 2 43.635 3.44809 43.947 5.34625C45.4725 5.48753 46.6668 6.77095 46.6668 8.33333C46.6668 9.37347 46.1375 10.29 45.3335 10.8282M37.3335 10.6667L40.0002 8M40.0002 8L42.6668 10.6667M40.0002 8V14' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/><rect x='0.5' y='26' width='35' height='16' rx='2' fill='#444CE7'/><path d='M3.80167 30.7273H5.52397L7.18235 33.8594H7.25337L8.91175 30.7273H10.6341L7.98136 35.429V38H6.45437V35.429L3.80167 30.7273ZM11.9853 38H10.3375L12.8482 30.7273H14.8297L17.3368 38H15.6891L13.8674 32.3892H13.8105L11.9853 38ZM11.8823 35.1413H15.7743V36.3416H11.8823V35.1413ZM18.2122 30.7273H20.1085L22.1113 35.6136H22.1966L24.1994 30.7273H26.0957V38H24.6042V33.2663H24.5439L22.6618 37.9645H21.6461L19.764 33.2486H19.7037V38H18.2122V30.7273ZM27.3626 38V30.7273H28.9002V36.7322H32.0181V38H27.3626Z' fill='white'/></svg>",
      },
    ])
    // })
  }

  useEffect(() => {
    getData()
    if (file.length > 0) {
      document.getElementById('input_focus')?.classList.remove('border-slate-950')
    }
  }, [files])

  useEffect(() => {
    if (uploadErrors.filetitle || files.length > 0) {
      document.getElementById('input_focus')?.classList.remove('border-slate-950')
    }
  }, [uploadErrors.filetitle?.message, files])

  const [vault, setVault] = useState('')
  const [selectedVault, setSelectedVault] = useState(null as any)
  const { id: paramsId } = useParams()

  const [editVaultName, setEditVaultName] = useState(false)

  const { detail, sendNewRepositoryDetail, saveData, InsightDetail }: any = useData()

  const datavault = sessionStorage.getItem('vault')
  const vaultdata = JSON.parse(datavault as any)

  const threatcard = sessionStorage.getItem('threat')
  const threatcarddata = JSON.parse(threatcard as any)
  const [repoNames, setRepoNames] = useState('' as any)

  useEffect(() => {
    if (paramsId) {
      const datavault = sessionStorage.getItem('vault')
      const vaultdata = JSON.parse(datavault as any)
      setRepoNames(vaultdata)
      let valtName: any = searchValue.find((x: any) => x.id == Number(paramsId))
      setVault(valtName?.name)
      setSelectedVault(valtName)
    } else if (!paramsId) {
      setVault('')
    }
    setRepoName('')
    if (!state) {
      fetchdata()
    }

    setEditVaultName(false)
  }, [paramsId, location.pathname, searchValue.length])

  useEffect(() => {
    if (detail && detail.from == 'AddRepository') {
      if (detail?.value.trim()) setVault(detail?.value)
      else setVault('')
    }
  }, [detail])

  const updateVaultName = (e: any, vaultName: string) => {
    let obj = {
      name: e?.target?.value ? e?.target?.value : vault,
      description: selectedVault.description,
    }

    if (!containsSpecialCharacters(e?.target?.value || vault) && (e?.target?.value || vault)) {
      dispatch(updateDatavault(obj, paramsId) as any)
        .then((res: any) => {
          if (res.type == 'DATAVAULT_UPDATE_SUCCESS') {
            fetchdata()
            setEditVaultName(false)
            setSelectedVault(res?.payload)
            setVault(res.payload.name)
          }
        })
        .catch((err: any) => console.log('err', err))
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        color: '#000',
        title: `${containsSpecialCharacters(vaultName || vault)
          ? `Special characters are not allowed!!`
          : `Please fill input`
          }`,
        width: 400,
        timer: 1000,
        showConfirmButton: false,
      })
    }
  }
  const containsSpecialCharacters = (str: string) => {
    const regex = /[!@#$%^&*(),.?":{}|<>-]/g
    return regex.test(str)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, vaultName: string) => {
    if (event.key === 'Enter') {
      if (!containsSpecialCharacters(vaultName || vault) && (vaultName || vault)) {
        let obj = {
          name: vaultName ? vaultName : vault,
          description: selectedVault.description,
        }
        dispatch(updateDatavault(obj, paramsId) as any)
          .then((res: any) => {
            if (res.type == 'DATAVAULT_UPDATE_SUCCESS') {
              fetchdata()
              setEditVaultName(false)
              setSelectedVault(res?.payload)
              setVault(res.payload.name)
            }
          })
          .catch((err: any) => console.log('err', err))
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          color: '#000',
          title: `${containsSpecialCharacters(vaultName || vault)
            ? `Special characters are not allowed!!`
            : `Please fill input`
            }`,
          width: 400,
          timer: 1000,
          showConfirmButton: false,
        })
      }
    }
  }

  // ******************************Add Repository Validation*************************************
  const [addRepoBtn, setAddRepoBtn] = useState(false)
  useEffect(() => {
    if (sendNewRepositoryDetail && sendNewRepositoryDetail.from == 'addRepository') {
      if (sendNewRepositoryDetail.value.formValue.name.trim()) {
        setAddRepoBtn(true)
      } else setAddRepoBtn(false)
    }
  }, [sendNewRepositoryDetail])

  // ******************************Add URL Validation*************************************
  const [saveBtn, setSaveBtn] = useState(false)

  useEffect(() => {
    if (saveData && saveData.from == 'addUrl') {
      if (saveData.value.formValue.url.trim()) setSaveBtn(true)
      else setSaveBtn(false)
    } else if (saveData && saveData.from == 'addFeedly') {
      if (saveData.value.formValue.feedly.trim()) setSaveBtn(true)
      else setSaveBtn(false)
    } else if (saveData && saveData.from == 'addPDf') {
      if (saveData?.value?.formValue?.length > 0) setSaveBtn(true)
      else setSaveBtn(false)
    }
  }, [saveData])

  //*************************************CrowdStrike Connection********************************* */
  const [crowdSubmitted, setCrowdSubmitted] = useState(true)
  const crowdsubmit = (e: any) => {
    e.preventDefault()
    setCrowdSubmitted(!crowdSubmitted)
    let crowdSubmit = document.getElementById('crowdSubmit')
    crowdSubmit?.click()
  }
  const crowdStrike = () => {
    navigateTo('/app/fieldmapping')
  }
  const [tabValue, setTabValue] = useState(1 as any)
  const handleTabChange = (val: number) => {
    setTabValue(val)
  }
  useEffect(() => {
    {
      location.pathname === '/app/breiflow'
        ? navigateTo('/app/breiflow', { state: { tabValue: tabValue } })
        : ''
    }
  }, [tabValue])

  const [companyProfile, setcompanyProfile] = useState(true)
  const onCompanyProfile = (e: any) => {
    e.preventDefault()
    setcompanyProfile(!companyProfile)
    let companyProfiles = document.getElementById('companyProfile')
    companyProfiles?.click()
  }

  const getTabs = sessionStorage.getItem('tabs')

  const nodficationclik = () => {
    if (isOpenNo) {
      toggleDropdownnotifi()
    }
  }

  const handleLibarayNavigate = () => {
    if (state?.chatHistory?.params == 'collection' && state?.chatHistory?.workingpage == "source") {
      navigateTo(`/app/sourcerulechats/${Number(state?.chatHistory?.id)}`, { state: { sources: "collection", sourcesheaer: "collection" } })
      sessionStorage.setItem('chatid', state?.chatHistory?.id)
    } else if (state?.chatHistory?.params == 'collection' && state?.chatHistory?.workingpage == "workbench") {
      navigateTo(`/app/sourcerulechats/${Number(state?.chatHistory?.id)}`, { state: { sources: "collection", sourcesheaer: "collection" } })
      let selectedFile = { ctiName: 'sessionName', vaultId: '', id: '' }
      navigateTo(`/app/chatworkbench/${state?.chatHistory?.id}`, { state: selectedFile });
    } else {
      navigateTo(`/app/collections`, { state: { tab: 1 } })
      sessionStorage.setItem('collectionTab', JSON.stringify(1))
    }
  }

  const handlenavigateToCollection = () => {
    if (state?.paramsdata == 'allrules') {
      navigateTo(`/app/collections`, { state: { tab: 2 } })
    } else if (state?.paramsdata == 'ctisigma') {
      navigateTo(`/app/repoinsightspages/${Number(state?.vaultId)}`, {
        state: { title: state?.title, tab: 2, singleparams: state?.singleparams },
      })
    } else if (state?.paramsdata == 'Threatbreif') {
      navigateTo(`/app/insightspages/${Number(state?.vaultId)}`, {
        state: { title: state?.title, tab: 2 },
      })
    } else if (state?.paramsdata == 'insite') {
      navigateTo(`/app/sourcespage`, { state: { tab: 2 } })
    } else if (state?.paramsdata == "Import") {
      navigateTo(`/app/sourcespage`, { state: { tab: 3 } })
      setImpFolderId(impFolderId)
    } else if (state?.paramsdata == "dac") {
      navigateTo(`/app/sourcespage`, { state: { tab: 4 } })
      setDacFolderId(dacFolderId)
    } else {
      if (state?.chatHistory?.params == 'collection' && state?.chatHistory?.workingpage == "source") {
        navigateTo(`/app/sourcerulechats/${Number(state?.chatHistory?.id)}`, { state: { sources: "collection", sourcesheaer: "collection" } })
        sessionStorage.setItem('chatid', state?.chatHistory?.id)
      } else if (state?.chatHistory?.params == 'collection' && state?.chatHistory?.workingpage == "workbench") {
        navigateTo(`/app/sourcerulechats/${Number(state?.chatHistory?.id)}`, { state: { sources: "collection", sourcesheaer: "collection" } })
        let selectedFile = { ctiName: 'sessionName', vaultId: '', id: '' }
        navigateTo(`/app/chatworkbench/${state?.chatHistory?.id}`, { state: selectedFile });
      } else {
        navigateTo(`/app/collectionsigmarule/${Number(state?.vaultId)}`, {
          state: { title: state?.title },
        })
      }

    }
  }

  const handlenavigateDetection = () => {
    if (state?.paramsdata == 'allrules') {
      navigateTo(`/app/collections`, { state: { tab: 2 } })
    } else if (state?.paramsdata == 'ctisigma') {
      navigateTo(`/app/sourcespage`, { state: { tab: 1 } })
    } else if (state?.paramsdata == 'Threatbreif' || state?.paramsdata == 'insite') {
      navigateTo(`/app/sourcespage`, { state: { tab: 2 } })
    } else if (state?.paramsdata == "Import") {
      navigateTo(`/app/sourcespage`, { state: { tab: 3 } })
      setImpFolderId(impFolderId)
    } else if (state?.paramsdata == "dac") {
      navigateTo(`/app/sourcespage`, { state: { tab: 4 } })
      setDacFolderId(dacFolderId)
    } else if (state?.paramsdata == 'commensigmarule') {
      navigateTo(`/app/collections`)
    } else if (state?.chatHistory?.params == 'collection' && state?.chatHistory?.workingpage == "source") {
      navigateTo(`/app/sourcerulechats/${Number(state?.chatHistory?.id)}`, { state: { sources: "collection", sourcesheaer: "collection" } })
      sessionStorage.setItem('chatid', state?.chatHistory?.id)
    } else if (state?.chatHistory?.params == 'collection' && state?.chatHistory?.workingpage == "workbench") {
      navigateTo(`/app/sourcerulechats/${Number(state?.chatHistory?.id)}`, { state: { sources: "collection", sourcesheaer: "collection" } })
      let selectedFile = { ctiName: 'sessionName', vaultId: '', id: '' }
      navigateTo(`/app/chatworkbench/${state?.chatHistory?.id}`, { state: selectedFile });
    }
  }

  const collectionList = JSON.parse(localStorage.getItem('collectiondetails') as any)

  return (
    <nav className='bg-[#0C111D] p-6 sticky top-0 text-[#000]  flex justify-between w-full'>
      <span className='w-full' onClick={nodficationclik}>
        {location.pathname === '/app/sourcespage' && (
          <h1 className='absolute left-6  text-white text-2xl font-bold'>Sources</h1>
        )}

        {location.pathname === '/app/collections' && (
          <h1 className='absolute left-8 top-8 text-white text-2xl font-bold'>Detection Library</h1>
        )}

        {location.pathname === `/app/insightspages/${id}` && (
          <div className='w-full  justify-between flex'>
            <div>
              <div className='text-white font-medium text-sm md:text-base flex flex-wrap gap-1 items-center'>
                <span
                  className='text-[#6AA9ED] cursor-pointer'
                  onClick={() => navigateTo('/app/sourcespage')}
                >
                  Sources
                </span>
                <span>
                  {' '}
                  <svg
                    className='w-3 h-3 text-[#6AA9ED] font-inter text-[14px] font-medium leading-[20px] mx-1'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 6 10'
                  >
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='m1 9 4-4-4-4'
                    />
                  </svg>
                </span>
                <span
                  className='text-[#6AA9ED] cursor-pointer'
                  onClick={() => handlenavigateToCollection()}
                >
                  {' '}
                  {state?.title}
                </span>
                <span>
                  {' '}
                  <svg
                    className='w-3 h-3 text-[#6AA9ED] font-inter text-[14px] font-medium leading-[20px] mx-1'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 6 10'
                  >
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='m1 9 4-4-4-4'
                    />
                  </svg>
                </span>
                <span className='text-[#EE7103]'>Threat Actor Details</span>
              </div>
              <div className='w-full md:w-64 lg:w-96 xl:w-96 2xl:w-full'>
                <h1 className='text-white text-xl md:text-2xl font-bold truncate overflow-hidden whitespace-nowrap max-md:text-base'>
                  {state?.title}
                </h1>
              </div>
            </div>
          </div>
        )}

        {location.pathname === `/app/sigmaruleview/${id}` && (
          <div className='w-full'>
            <div className='text-white font-medium text-sm md:text-base flex flex-wrap gap-1 items-center'>
              <span
                className='text-[#6AA9ED] cursor-pointer'
                onClick={() => handleLibarayNavigate()}
              >
                {!state?.chatHistory ? 'Detection Library' : 'Workbench'}
              </span>
              <span>
                <svg
                  className='w-3 h-3 text-[#6AA9ED] font-inter text-[14px] font-medium leading-[20px] mx-1'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 6 10'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 9 4-4-4-4'
                  />
                </svg>
              </span>
              <span
                className='text-[#6AA9ED] cursor-pointer'
                onClick={() => handlenavigateToCollection()}
              >
                {' '}
                {state?.title}
              </span>
              <span>
                {' '}
                <svg
                  className='w-3 h-3 text-[#6AA9ED] font-inter text-[14px] font-medium leading-[20px] mx-1'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 6 10'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 9 4-4-4-4'
                  />
                </svg>
              </span>
              <span className='text-[#EE7103]'> {'Sigma Rule Details'}</span>
            </div>
            <h1 className='text-white text-xl md:text-2xl font-bold truncate max-w-[1000px] overflow-hidden whitespace-nowrap max-md:text-base'>
              {state?.singmaname}
            </h1>
          </div>
        )}

        {location.pathname === `/app/collectionsigmarule/${id}` && (
          <div className='w-full'>
            <div className='text-white font-medium text-sm md:text-base flex flex-wrap gap-1 items-center'>
              <span
                className='text-[#6AA9ED] cursor-pointer'
                onClick={() => navigateTo(`/app/collections`)}
              >
                Detection Library
              </span>
              <span>
                <svg
                  className='w-3 h-3 text-[#6AA9ED] font-inter text-[14px] font-medium leading-[20px] mx-1'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 6 10'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 9 4-4-4-4'
                  />
                </svg>
              </span>
              <span className='text-[#EE7103] truncate max-w-[1000px] overflow-hidden whitespace-nowrap'>
                {state?.title ? state?.title : collectionList?.name}
              </span>
            </div>
            <h1 className='text-white text-xl md:text-2xl font-bold truncate max-w-[1000px] overflow-hidden whitespace-nowrap max-md:text-base'>
              {state?.title ? state?.title : collectionList?.name}
            </h1>
          </div>
        )}

        {location.pathname === `/app/repoinsightspages/${id}` && (
          <div className=' relative'>
            <div className='text-white font-medium text-sm md:text-base flex flex-wrap gap-1 items-center ml-2'>
              <span
                className='text-[#6AA9ED] cursor-pointer'
                onClick={() => navigateTo(`/app/sourcespage`)}
              >
                Sources
              </span>
              <span>
                {' '}
                <svg
                  className='w-3 h-3 text-[#6AA9ED] font-inter text-[14px] font-medium leading-[20px] mx-1'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 6 10'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 9 4-4-4-4'
                  />
                </svg>
              </span>
              <span className='text-[#EE7103]'>{state?.title}</span>
            </div>
            <h1 className='text-white text-xl md:text-2xl font-bold  ml-2 max-md:text-base'>{state?.title}</h1>
          </div>
        )}

        {location.pathname === `/app/Dataingestion/${id}` ? (
          <>
            <nav className='flex pb-4' aria-label='Breadcrumb'>
              <ol className='inline-flex items-center space-x-1 md:space-x-3'>
                <li className='inline-flex items-center'>
                  <a
                    onClick={(e) => {
                      e.stopPropagation()
                      navigateTo(`/app/repositoryintropage`)
                    }}
                    className=' text-[#98A2B3] text-sm font-medium cursor-pointer'
                  >
                    Repository
                  </a>
                </li>

                <li>
                  <div className='flex items-center'>
                    <svg
                      className='w-3 h-3 text-gray-400 mx-1'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 6 10'
                    >
                      <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='m1 9 4-4-4-4'
                      />
                    </svg>
                    <a className='text-white ml-1 text-sm font-medium md:ml-2 cursor-pointer'>
                      {pathid}
                    </a>
                  </div>
                </li>
              </ol>
            </nav>
          </>
        ) : null}
        {location.pathname === '/app/selectsource' ||
          location.pathname === `/app/selectsource/${id}` ? (
          <>
            <nav className='flex pb-4' aria-label='Breadcrumb'>
              <ol className='inline-flex items-center space-x-1 md:space-x-3'>
                <li className='inline-flex items-center'>
                  <a
                    onClick={ChatselectSource}
                    className='text-white ml-1 text-sm font-medium md:ml-2 cursor-pointer'
                  >
                    Chat
                  </a>
                </li>
                <li>
                  <div className='flex items-center'>
                    <svg
                      className='w-3 h-3 text-gray-400 mx-1'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 6 10'
                    >
                      <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='m1 9 4-4-4-4'
                      />
                    </svg>
                    <a className='text-white ml-1 text-sm font-medium md:ml-2 cursor-pointer'>
                      Select Sources
                    </a>
                  </div>
                </li>
              </ol>
            </nav>
          </>
        ) : (
          ''
        )}
        {location.pathname === `/app/selectsource/Crmmarketing/${name}` ||
          location.pathname === `/app/selectsource/${id}/Crmmarketing/${nameId}` ? (
          <>
            <nav className='flex pb-4' aria-label='Breadcrumb'>
              <ol className='inline-flex items-center space-x-1 md:space-x-3'>
                <li className='inline-flex items-center'>
                  <a
                    onClick={ChatselectSource}
                    className='text-white ml-1 text-sm font-medium md:ml-2 cursor-pointer'
                  >
                    Chat
                  </a>
                </li>
                <li>
                  <div className='flex items-center'>
                    <svg
                      className='w-3 h-3 text-gray-400 mx-1'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 6 10'
                    >
                      <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='m1 9 4-4-4-4'
                      />
                    </svg>
                    <a
                      onClick={selectSourceCrm}
                      className='text-white ml-1 text-sm font-medium md:ml-2 cursor-pointer'
                    >
                      Select Sources
                    </a>
                  </div>
                </li>
                <li>
                  <div className='flex items-center'>
                    <svg
                      className='w-3 h-3 text-gray-400 mx-1'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 6 10'
                    >
                      <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='m1 9 4-4-4-4'
                      />
                    </svg>
                    <a
                      // href='#'
                      className='text-white ml-1 text-sm font-medium md:ml-2 cursor-pointer'
                    >
                      {cardDetailName}
                    </a>
                  </div>
                </li>
              </ol>
            </nav>
          </>
        ) : (
          ''
        )}

        {location.pathname === `/app/sigmafilesview/${id}` ? (
          <>
            <div className='w-full p-2  max-w-full flex flex-wrap  grid grid-cols-12 gap-2'>
              <div className='col-span-7 max-lg:col-span-12'>
                <div className='flex flex-col items-start gap-2 w-full md:w-auto'>
                  <div className='text-white font-medium text-sm md:text-base flex flex-wrap gap-1 items-center'>
                    <span
                      className='text-[#6AA9ED] cursor-pointer'
                      onClick={() => handlenavigateDetection()}
                    >
                      {state?.paramsdata == 'ctisigma' || state?.paramsdata == 'Threatbreif' || state?.paramsdata == "Import" || state?.paramsdata == "dac"
                        ? 'Sources'
                        : !state?.chatHistory ? 'Detection Library' : 'Workbench'}
                    </span>
                    <span>
                      {' '}
                      <svg
                        className='w-3 h-3 text-[#6AA9ED] font-inter text-[14px] font-medium leading-[20px] mx-1'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 6 10'
                      >
                        <path
                          stroke='currentColor'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='m1 9 4-4-4-4'
                        />
                      </svg>
                    </span>
                    <span
                      className='text-[#6AA9ED] cursor-pointer'
                      onClick={() => handlenavigateToCollection()}
                    >
                      {' '}
                      {state?.title}
                    </span>
                    <span>
                      {' '}
                      <svg
                        className='w-3 h-3 text-[#6AA9ED] font-inter text-[14px] font-medium leading-[20px] mx-1'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 6 10'
                      >
                        <path
                          stroke='currentColor'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='m1 9 4-4-4-4'
                        />
                      </svg>
                    </span>
                    <span className='text-[#EE7103]'> {'Sigma Rule Details'}</span>
                  </div>
                  <div className='w-full'>
                    <h6 className='text-white text-xl md:text-2xl font-bold truncate overflow-hidden whitespace-nowrap max-md:text-base'>
                      {state?.singmaname}
                    </h6>
                  </div>
                </div>
              </div>
              <div className='col-span-5'></div>
            </div>
          </>
        ) : (
          ''
        )}

        <div className='flex'>
          {isOpen && (
            <button
              onClick={toggleSidebar}
              className='p-2 hidden text-black-700 rounded-md outline-none focus:border-black-400 focus:border'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-6 h-6 text-black-700 text-black'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            </button>
          )}
          <div className='container flex justify-between items-center'>
            <h1 className='text-black font-semibold'>
              {(location.pathname.split('app/')[1].toLocaleUpperCase() &&
                location.pathname === '/app/datavaults') ||
                location.pathname === '/app/audit' ||
                location.pathname === '/app/users' ||
                location.pathname === '/app/support' ? (
                <div className='text-white text-2xl capitalize'>
                  {location.pathname.split('app/')[1] == 'datavaults'
                    ? 'CTI Archive'
                    : location.pathname.split('app/')[1]}
                </div>
              ) : (
                ''
              )}
              {location.pathname === `/app/history/${id}` ||
                location.pathname === '/app/history' ||
                location.pathname === `/app/history/newchat/${name}` ? (
                <>
                  <div className='text-white text-2xl capitalize'>{userName}</div>
                </>
              ) : (
                ''
              )}
              {location.pathname === '/app/overview' ? (
                <>
                  <div className='text-white text-2xl  flex'>
                    <div className='ps-1'>Dashboard</div>
                  </div>
                </>
              ) : (
                ''
              )}

              {location.pathname === '/app/companyprofile' ? (
                <>
                  <div className='text-white text-2xl  flex '>
                    <div className='ps-1 '>Company Profile</div>
                  </div>
                </>
              ) : (
                ''
              )}
              {location.pathname === '/app/fieldmapping' ? (
                <>
                  <div className='text-white text-2xl  flex'>
                    <div className='ps-1 '>Integrations</div>
                  </div>
                </>
              ) : (
                ''
              )}
              {location.pathname === `/app/companyprofile` && (
                <>
                  <div className='right-8 mt-[-30px] absolute max-md:right-0'>
                    <button
                      onClick={onCompanyProfile}
                      className='text-white mr-4 text-sm font-semibold py-1 px-4  bg-[#EE7103] rounded-lg shadow cursor-pointer disabled:opacity-25'
                    >
                      <div className='flex'>
                        <div>
                          <p className='p-1 text-white font-inter text-sm font-semibold leading-6 '>
                            Save
                          </p>
                        </div>
                        <div className='mt-1'>
                          <svg
                            width='20'
                            height='20'
                            viewBox='0 0 20 20'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <g id='save-01'>
                              <path
                                id='Icon'
                                d='M5.83333 2.5V5.33333C5.83333 5.80004 5.83333 6.0334 5.92416 6.21166C6.00406 6.36846 6.13154 6.49594 6.28834 6.57584C6.4666 6.66667 6.69996 6.66667 7.16667 6.66667H12.8333C13.3 6.66667 13.5334 6.66667 13.7117 6.57584C13.8685 6.49594 13.9959 6.36846 14.0758 6.21166C14.1667 6.0334 14.1667 5.80004 14.1667 5.33333V3.33333M14.1667 17.5V12.1667C14.1667 11.7 14.1667 11.4666 14.0758 11.2883C13.9959 11.1315 13.8685 11.0041 13.7117 10.9242C13.5334 10.8333 13.3 10.8333 12.8333 10.8333H7.16667C6.69996 10.8333 6.4666 10.8333 6.28834 10.9242C6.13154 11.0041 6.00406 11.1315 5.92416 11.2883C5.83333 11.4666 5.83333 11.7 5.83333 12.1667V17.5M17.5 7.77124V13.5C17.5 14.9001 17.5 15.6002 17.2275 16.135C16.9878 16.6054 16.6054 16.9878 16.135 17.2275C15.6002 17.5 14.9001 17.5 13.5 17.5H6.5C5.09987 17.5 4.3998 17.5 3.86502 17.2275C3.39462 16.9878 3.01217 16.6054 2.77248 16.135C2.5 15.6002 2.5 14.9001 2.5 13.5V6.5C2.5 5.09987 2.5 4.3998 2.77248 3.86502C3.01217 3.39462 3.39462 3.01217 3.86502 2.77248C4.3998 2.5 5.09987 2.5 6.5 2.5H12.2288C12.6364 2.5 12.8402 2.5 13.0321 2.54605C13.2021 2.58688 13.3647 2.65422 13.5138 2.7456C13.682 2.84867 13.8261 2.9928 14.1144 3.28105L16.719 5.88562C17.0072 6.17387 17.1513 6.318 17.2544 6.48619C17.3458 6.63531 17.4131 6.79789 17.4539 6.96795C17.5 7.15976 17.5 7.36358 17.5 7.77124Z'
                                stroke='white'
                                strokeWidth='1.67'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                            </g>
                          </svg>
                        </div>
                      </div>
                    </button>
                  </div>
                </>
              )}

              {location.pathname === '/app/fieldconnection' ? (
                <>
                  <nav className='flex pb-4'>
                    <ol className='inline-flex items-center space-x-1 md:space-x-3'>
                      <li className='inline-flex items-center' onClick={crowdStrike}>
                        <a className='text-white ml-1 text-sm font-medium md:ml-2 cursor-pointer'>
                          Integrations
                        </a>
                      </li>
                      <li>
                        <div className='flex items-center'>
                          <svg
                            className='w-3 h-3 text-gray-400 mx-1 mt-[2px]'
                            aria-hidden='true'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 6 10'
                          >
                            <path
                              stroke='currentColor'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='m1 9 4-4-4-4'
                            />
                          </svg>
                          <a className='text-white ml-1 text-sm font-medium md:ml-2 cursor-pointer'>
                            Crowdstrike
                          </a>
                        </div>
                      </li>
                    </ol>
                  </nav>
                  <div className='flex'>
                    <div className='text-white text-2xl float-right'>
                      <div className='flex '>
                        <div className='ml-1'>
                          <CrowdStrikeSvg />
                        </div>
                        <div className='ps-0 pt-5 ml-4'>Crowdstrike</div>
                      </div>
                    </div>
                    <div className='absolute right-9 pt-5'>
                      <button className='text-white mr-4 text-sm font-semibold py-1 px-4  bg-[#EE7103] rounded-lg shadow cursor-pointer disabled:opacity-25'>
                        <div className='flex' onClick={crowdsubmit}>
                          <div>
                            <p className='p-1 text-white font-inter text-sm font-semibold leading-6 '>
                              Save
                            </p>
                          </div>
                          <div className='mt-1'>
                            <svg
                              width='20'
                              height='20'
                              viewBox='0 0 20 20'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <g id='save-01'>
                                <path
                                  id='Icon'
                                  d='M5.83333 2.5V5.33333C5.83333 5.80004 5.83333 6.0334 5.92416 6.21166C6.00406 6.36846 6.13154 6.49594 6.28834 6.57584C6.4666 6.66667 6.69996 6.66667 7.16667 6.66667H12.8333C13.3 6.66667 13.5334 6.66667 13.7117 6.57584C13.8685 6.49594 13.9959 6.36846 14.0758 6.21166C14.1667 6.0334 14.1667 5.80004 14.1667 5.33333V3.33333M14.1667 17.5V12.1667C14.1667 11.7 14.1667 11.4666 14.0758 11.2883C13.9959 11.1315 13.8685 11.0041 13.7117 10.9242C13.5334 10.8333 13.3 10.8333 12.8333 10.8333H7.16667C6.69996 10.8333 6.4666 10.8333 6.28834 10.9242C6.13154 11.0041 6.00406 11.1315 5.92416 11.2883C5.83333 11.4666 5.83333 11.7 5.83333 12.1667V17.5M17.5 7.77124V13.5C17.5 14.9001 17.5 15.6002 17.2275 16.135C16.9878 16.6054 16.6054 16.9878 16.135 17.2275C15.6002 17.5 14.9001 17.5 13.5 17.5H6.5C5.09987 17.5 4.3998 17.5 3.86502 17.2275C3.39462 16.9878 3.01217 16.6054 2.77248 16.135C2.5 15.6002 2.5 14.9001 2.5 13.5V6.5C2.5 5.09987 2.5 4.3998 2.77248 3.86502C3.01217 3.39462 3.39462 3.01217 3.86502 2.77248C4.3998 2.5 5.09987 2.5 6.5 2.5H12.2288C12.6364 2.5 12.8402 2.5 13.0321 2.54605C13.2021 2.58688 13.3647 2.65422 13.5138 2.7456C13.682 2.84867 13.8261 2.9928 14.1144 3.28105L16.719 5.88562C17.0072 6.17387 17.1513 6.318 17.2544 6.48619C17.3458 6.63531 17.4131 6.79789 17.4539 6.96795C17.5 7.15976 17.5 7.36358 17.5 7.77124Z'
                                  stroke='white'
                                  strokeWidth='1.67'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                />
                              </g>
                            </svg>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                ''
              )}
              {location.pathname === '/app/feedymapping' ? (
                <>
                  <div className='text-white text-2xl  flex'>
                    <div className='ps-1 '>Integrations</div>
                  </div>
                </>
              ) : (
                ''
              )}
              {location.pathname === '/app/feedyintegration' ? (
                <>
                  <div className='text-white text-2xl  flex'>
                    <div className='ps-1 '>Integrations</div>
                  </div>
                </>
              ) : (
                ''
              )}
              {location.pathname === '/app/feedlyform' ? (
                <>
                  <nav className='flex pb-4'>
                    <ol className='inline-flex items-center space-x-1 md:space-x-3'>
                      <li className='inline-flex items-center' onClick={feedly}>
                        <a className='text-white ml-1 text-sm font-medium md:ml-2 cursor-pointer'>
                          Integrations
                        </a>
                      </li>
                      <li>
                        <div className='flex items-center'>
                          <svg
                            className='w-3 h-3 text-gray-400 mx-1'
                            aria-hidden='true'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 6 10'
                          >
                            <path
                              stroke='currentColor'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='m1 9 4-4-4-4'
                            />
                          </svg>
                          <a className='text-white ml-1 text-sm font-medium md:ml-2 cursor-pointer'>
                            Feedly
                          </a>
                        </div>
                      </li>
                    </ol>
                  </nav>
                  <div className='flex'>
                    <div className='text-white text-2xl float-right'>
                      <div className='flex '>
                        <div>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='72'
                            height='72'
                            viewBox='0 0 72 72'
                            version='1.1'
                          >
                            <path
                              d='M 24.040 29.459 C 13.751 39.784, 13.640 39.945, 15.463 41.959 C 16.479 43.082, 18.028 44, 18.905 44 C 20.820 44, 41 25.323, 41 23.551 C 41 21.919, 37.731 19, 35.903 19 C 35.112 19, 29.774 23.707, 24.040 29.459 M 28.687 41.812 C 22.177 48.372, 21.996 48.686, 23.792 50.312 C 26.915 53.138, 29.305 52.261, 35.477 46.023 L 41.392 40.046 39.022 37.523 C 37.718 36.135, 36.380 35, 36.049 35 C 35.717 35, 32.404 38.065, 28.687 41.812 M 33.010 54.490 C 30.739 56.907, 30.724 57.038, 32.491 58.990 C 33.491 60.095, 35.070 61, 36 61 C 36.930 61, 38.509 60.095, 39.509 58.990 C 41.276 57.038, 41.261 56.907, 38.990 54.490 C 37.704 53.120, 36.358 52, 36 52 C 35.642 52, 34.296 53.120, 33.010 54.490'
                              stroke='none'
                              fill='#F5F9F6'
                              fillRule='evenodd'
                            />
                            <path
                              d='M 16.319 20.210 C -4.787 41.176, -4.555 39.099, 12.339 55.801 L 24.678 68 35.589 67.985 C 41.590 67.976, 47.088 67.596, 47.807 67.140 C 48.526 66.684, 54.489 60.989, 61.057 54.485 C 72.349 43.303, 73 42.440, 73 38.662 C 73 36.465, 72.690 34.977, 72.311 35.356 C 71.932 35.735, 64.363 28.835, 55.492 20.023 C 41.074 5.700, 39.006 4, 36 4 C 32.992 4, 30.914 5.712, 16.319 20.210 M 24.040 29.459 C 13.751 39.784, 13.640 39.945, 15.463 41.959 C 16.479 43.082, 18.028 44, 18.905 44 C 20.820 44, 41 25.323, 41 23.551 C 41 21.919, 37.731 19, 35.903 19 C 35.112 19, 29.774 23.707, 24.040 29.459 M 28.687 41.812 C 22.177 48.372, 21.996 48.686, 23.792 50.312 C 26.915 53.138, 29.305 52.261, 35.477 46.023 L 41.392 40.046 39.022 37.523 C 37.718 36.135, 36.380 35, 36.049 35 C 35.717 35, 32.404 38.065, 28.687 41.812 M 0.272 40 C 0.272 42.475, 0.467 43.487, 0.706 42.250 C 0.944 41.013, 0.944 38.987, 0.706 37.750 C 0.467 36.513, 0.272 37.525, 0.272 40 M 33.010 54.490 C 30.739 56.907, 30.724 57.038, 32.491 58.990 C 33.491 60.095, 35.070 61, 36 61 C 36.930 61, 38.509 60.095, 39.509 58.990 C 41.276 57.038, 41.261 56.907, 38.990 54.490 C 37.704 53.120, 36.358 52, 36 52 C 35.642 52, 34.296 53.120, 33.010 54.490'
                              stroke='none'
                              fill='#2DB44D'
                              fillRule='evenodd'
                            />
                          </svg>
                        </div>
                        <div className='ps-2 pt-5'>Feedly</div>
                      </div>
                    </div>

                    {(getTabs != '2' || !getTabs) && (
                      <div className='absolute right-9 pt-5'>
                        <button className='text-white mr-4 text-sm font-semibold py-1 px-4  bg-[#EE7103] rounded-lg shadow disabled:opacity-25'>
                          <div className='flex' onClick={feedlysubmit}>
                            <div>
                              <p className='p-1 text-white font-inter text-sm font-semibold leading-6 '>
                                Save
                              </p>
                            </div>
                            <div className='mt-1'>
                              <svg
                                width='20'
                                height='20'
                                viewBox='0 0 20 20'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <g id='save-01'>
                                  <path
                                    id='Icon'
                                    d='M5.83333 2.5V5.33333C5.83333 5.80004 5.83333 6.0334 5.92416 6.21166C6.00406 6.36846 6.13154 6.49594 6.28834 6.57584C6.4666 6.66667 6.69996 6.66667 7.16667 6.66667H12.8333C13.3 6.66667 13.5334 6.66667 13.7117 6.57584C13.8685 6.49594 13.9959 6.36846 14.0758 6.21166C14.1667 6.0334 14.1667 5.80004 14.1667 5.33333V3.33333M14.1667 17.5V12.1667C14.1667 11.7 14.1667 11.4666 14.0758 11.2883C13.9959 11.1315 13.8685 11.0041 13.7117 10.9242C13.5334 10.8333 13.3 10.8333 12.8333 10.8333H7.16667C6.69996 10.8333 6.4666 10.8333 6.28834 10.9242C6.13154 11.0041 6.00406 11.1315 5.92416 11.2883C5.83333 11.4666 5.83333 11.7 5.83333 12.1667V17.5M17.5 7.77124V13.5C17.5 14.9001 17.5 15.6002 17.2275 16.135C16.9878 16.6054 16.6054 16.9878 16.135 17.2275C15.6002 17.5 14.9001 17.5 13.5 17.5H6.5C5.09987 17.5 4.3998 17.5 3.86502 17.2275C3.39462 16.9878 3.01217 16.6054 2.77248 16.135C2.5 15.6002 2.5 14.9001 2.5 13.5V6.5C2.5 5.09987 2.5 4.3998 2.77248 3.86502C3.01217 3.39462 3.39462 3.01217 3.86502 2.77248C4.3998 2.5 5.09987 2.5 6.5 2.5H12.2288C12.6364 2.5 12.8402 2.5 13.0321 2.54605C13.2021 2.58688 13.3647 2.65422 13.5138 2.7456C13.682 2.84867 13.8261 2.9928 14.1144 3.28105L16.719 5.88562C17.0072 6.17387 17.1513 6.318 17.2544 6.48619C17.3458 6.63531 17.4131 6.79789 17.4539 6.96795C17.5 7.15976 17.5 7.36358 17.5 7.77124Z'
                                    stroke='white'
                                    strokeWidth='1.67'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                  />
                                </g>
                              </svg>
                            </div>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                ''
              )}

              {location.pathname === '/app/splunkform' ? (
                <>
                  <nav className='flex pb-4'>
                    <ol className='inline-flex items-center space-x-1 md:space-x-3'>
                      <li className='inline-flex items-center' onClick={splunk}>
                        <a className='text-white ml-1 text-sm font-medium md:ml-2 cursor-pointer'>
                          Integrations
                        </a>
                      </li>
                      <li>
                        <div className='flex items-center'>
                          <svg
                            className='w-3 h-3 text-gray-400 mx-1'
                            aria-hidden='true'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 6 10'
                          >
                            <path
                              stroke='currentColor'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='m1 9 4-4-4-4'
                            />
                          </svg>
                          <a className='text-white ml-1 text-sm font-medium md:ml-2 cursor-pointer'>
                            Splunk
                          </a>
                        </div>
                      </li>
                    </ol>
                  </nav>
                  <div className='flex'>
                    <div className='text-white text-2xl float-right'>
                      <div className='flex '>
                        <div>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            xmlnsXlink='http://www.w3.org/1999/xlink'
                            width='78'
                            height='78'
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
                        </div>
                        <div className='ps-0 pt-5'>Splunk</div>
                      </div>
                    </div>

                    {(getTabs != '2' || !getTabs) && (
                      <div className='absolute right-9 pt-5'>
                        <button className='text-white mr-4 text-sm font-semibold py-1 px-4  bg-[#EE7103] rounded-lg shadow disabled:opacity-25'>
                          <div className='flex' onClick={splunksubmit}>
                            <div>
                              <p className='p-1 text-white font-inter text-sm font-semibold leading-6 '>
                                Save
                              </p>
                            </div>
                            <div className='mt-1'>
                              <svg
                                width='20'
                                height='20'
                                viewBox='0 0 20 20'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <g id='save-01'>
                                  <path
                                    id='Icon'
                                    d='M5.83333 2.5V5.33333C5.83333 5.80004 5.83333 6.0334 5.92416 6.21166C6.00406 6.36846 6.13154 6.49594 6.28834 6.57584C6.4666 6.66667 6.69996 6.66667 7.16667 6.66667H12.8333C13.3 6.66667 13.5334 6.66667 13.7117 6.57584C13.8685 6.49594 13.9959 6.36846 14.0758 6.21166C14.1667 6.0334 14.1667 5.80004 14.1667 5.33333V3.33333M14.1667 17.5V12.1667C14.1667 11.7 14.1667 11.4666 14.0758 11.2883C13.9959 11.1315 13.8685 11.0041 13.7117 10.9242C13.5334 10.8333 13.3 10.8333 12.8333 10.8333H7.16667C6.69996 10.8333 6.4666 10.8333 6.28834 10.9242C6.13154 11.0041 6.00406 11.1315 5.92416 11.2883C5.83333 11.4666 5.83333 11.7 5.83333 12.1667V17.5M17.5 7.77124V13.5C17.5 14.9001 17.5 15.6002 17.2275 16.135C16.9878 16.6054 16.6054 16.9878 16.135 17.2275C15.6002 17.5 14.9001 17.5 13.5 17.5H6.5C5.09987 17.5 4.3998 17.5 3.86502 17.2275C3.39462 16.9878 3.01217 16.6054 2.77248 16.135C2.5 15.6002 2.5 14.9001 2.5 13.5V6.5C2.5 5.09987 2.5 4.3998 2.77248 3.86502C3.01217 3.39462 3.39462 3.01217 3.86502 2.77248C4.3998 2.5 5.09987 2.5 6.5 2.5H12.2288C12.6364 2.5 12.8402 2.5 13.0321 2.54605C13.2021 2.58688 13.3647 2.65422 13.5138 2.7456C13.682 2.84867 13.8261 2.9928 14.1144 3.28105L16.719 5.88562C17.0072 6.17387 17.1513 6.318 17.2544 6.48619C17.3458 6.63531 17.4131 6.79789 17.4539 6.96795C17.5 7.15976 17.5 7.36358 17.5 7.77124Z'
                                    stroke='white'
                                    strokeWidth='1.67'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                  />
                                </g>
                              </svg>
                            </div>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                ''
              )}

              {location.pathname === `/app/selectsource/Crmmarketing/${name}` ||
                location.pathname === `/app/selectsource/${id}/Crmmarketing/${nameId}` ? (
                <>
                  <div className='text-white text-2xl'>{cardDetailName}</div>
                </>
              ) : (
                ''
              )}
              {location.pathname === `/app/Dataingestion/${id}` ? (
                <>
                  <div className='float-right clear-both'>
                    {location.pathname === `/app/Repository/${id}` && (
                      <>
                        <div className='absolute right-9'>
                          <span className='text-white  pe-4'>
                            Please add the URL of your CTI report to generate Sigma files.
                          </span>
                          <button
                            className='-mt-1  hover:bg-[#6941c6] hover:text-white bg-[#fff] ml-auto h-8 w-20  text-sm  border font-bold py-2 px-4 rounded-lg inline-flex items-center'
                            onClick={() => setAddUrlPopup(true)}
                          >
                            <span className='text-sm text-gray'>Add</span>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth='1.5'
                              stroke='currentColor'
                              className='w-7 h-7 pl-2'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M12 6v12m6-6H6'
                              />
                            </svg>
                          </button>
                        </div>
                      </>
                    )}
                    {location.pathname === `/app/VaultPermission/${id}` && !vaultdata?.global && (
                      <>
                        <div className='absolute right-9'>
                          <span className='text-white pe-4'>
                            Upload Sigma files to your vault using the file uploader.
                          </span>
                          <button
                            onMouseOver={() => { }}
                            onMouseOut={() => { }}
                            type='button'
                            className='hover:bg-[#6941c6]  hover:text-white text-gray-900 bg-[#EE7103]  h-8 w-24 text-sm  border  font-bold py-2 px-4 rounded-lg inline-flex items-center'
                            onClick={() => setUploadFilePopup(true)}
                          >
                            <span className='text-sm '>Upload</span>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth='1.5'
                              stroke='white'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'
                              />
                            </svg>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  <div className='text-white clear-both text-2xl'>{documentName}</div>
                </>
              ) : (
                ''
              )}
            </h1>
          </div>

          <div className='float-right'>
            {location.pathname === '/app/datavaults' ||
              location.pathname === `/app/datavaults/${1}` ? (
              <>
                {getroleName?.roleName !== 'USER' && (
                  <span>
                    <button
                      className='bg-[#DC6803] hover:bg-[#6941c6] w-44 text-white font-bold py-2 pl-5 pr-1 rounded inline-flex items-center'
                      onClick={() => setShowdataModal(true)}
                    >
                      <span>New CTI Archive</span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth='1.5'
                        stroke='currentColor'
                        className='w-6 h-6 ml-1'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' d='M12 6v12m6-6H6' />
                      </svg>
                    </button>
                    {!showdataModal && location.pathname === `/app/datavaults/${1}` ? (
                      <>
                        <DataVaultModel action={setShowdataModal}></DataVaultModel>{' '}
                      </>
                    ) : showdataModal ? (
                      <DataVaultModel action={setShowdataModal}></DataVaultModel>
                    ) : null}
                  </span>
                )}
              </>
            ) : (
              ''
            )}
          </div>
          {/* ********************************************* */}
          <div className='float-right'>
            <div className='flex'>
              {location.pathname === '/app/history' ||
                location.pathname === `/app/history/${id}` ||
                location.pathname === `/app/history/newchat/${name}` ? (
                <>
                  <div className='pr-5'>
                    <Button
                      disableRipple
                      style={opens ? { border: '2px solid #000000' } : {}}
                      sx={{
                        height: '36px ',
                        width: '160px',
                        textAlign: 'center',
                        color: '#fff',
                        backgroundColor: '#182230',
                        textTransform: 'capitalize',
                        border: '2px solid #182230',
                        borderRadius: '8px',
                      }}
                      onClick={handleClicked}
                    >
                      Select Sources
                      <div className='pl-2'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='20'
                          height='20'
                          viewBox='0 0 20 20'
                          fill='none'
                          stroke='white'
                        >
                          <path
                            d='M7.5 9.16667L10 11.6667L18.3333 3.33333M13.3333 2.5H6.5C5.09987 2.5 4.3998 2.5 3.86502 2.77248C3.39462 3.01217 3.01217 3.39462 2.77248 3.86502C2.5 4.3998 2.5 5.09987 2.5 6.5V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5H13.5C14.9001 17.5 15.6002 17.5 16.135 17.2275C16.6054 16.9878 16.9878 16.6054 17.2275 16.135C17.5 15.6002 17.5 14.9001 17.5 13.5V10'
                            strokeWidth='1.66667'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </div>
                    </Button>
                    <Menu
                      id='basic-menu'
                      anchorEl={anchorE3}
                      open={opens}
                      onClose={handleClosed}
                      style={{ borderRadius: '20px' }}
                    >
                      <MenuItem disableRipple onClick={() => selectSources('1')}>
                        {chatCardId == 1 ? (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            height='1em'
                            viewBox='0 0 448 512'
                          >
                            <path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z' />
                          </svg>
                        ) : (
                          ''
                        )}
                        <span className='px-2 py-1'> Select or import data to share with AI</span>
                      </MenuItem>
                      <MenuItem disableRipple onClick={() => selectSources('2')}>
                        {chatCardId == 2 ? (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            height='1em'
                            viewBox='0 0 448 512'
                          >
                            <path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z' />
                          </svg>
                        ) : (
                          ''
                        )}
                        <span className='px-2'>Auto-detect relevant data for your question</span>
                      </MenuItem>
                    </Menu>
                  </div>
                </>
              ) : (
                ''
              )}

              {location.pathname === '/app/history' ||
                location.pathname === `/app/history/${id}` ||
                location.pathname === `/app/history/newchat/${name}` ? (
                <div>
                  <Button
                    disableRipple
                    sx={{
                      height: '36px ',
                      width: '144px',
                      textAlign: 'center',
                      color: '#fff',
                      backgroundColor: '#182230',
                      textTransform: 'capitalize',
                      border: '2px solid #182230',
                      borderRadius: '8px',
                    }}
                    style={open ? { border: '2px solid #000000' } : {}}
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                  >
                    Share
                    <div className='pl-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='20'
                        viewBox='0 0 20 20'
                        fill='none'
                        stroke='white'
                      >
                        <path
                          d='M17.5 7.50001L17.5 2.50001M17.5 2.50001H12.5M17.5 2.50001L10 10M8.33333 2.5H6.5C5.09987 2.5 4.3998 2.5 3.86502 2.77248C3.39462 3.01217 3.01217 3.39462 2.77248 3.86502C2.5 4.3998 2.5 5.09987 2.5 6.5V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5H13.5C14.9001 17.5 15.6002 17.5 16.135 17.2275C16.6054 16.9878 16.9878 16.6054 17.2275 16.135C17.5 15.6002 17.5 14.9001 17.5 13.5V11.6667'
                          strokeWidth='1.66667'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </div>
                  </Button>
                  <Menu
                    id='basic-menu'
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    style={{ borderRadius: '20px' }}
                  >
                    <MenuItem disableRipple onClick={handleClose} style={{ width: '150px' }}>
                      GPT 3.5
                    </MenuItem>
                    <MenuItem disableRipple onClick={handleClose} style={{ width: '150px' }}>
                      GPT 3.5 16k
                    </MenuItem>
                    <MenuItem disableRipple onClick={handleClose} style={{ width: '150px' }}>
                      GPT 4
                    </MenuItem>
                  </Menu>
                </div>
              ) : (
                ''
              )}
            </div>

            {addUrlPopup && (
              <>
                <form onSubmit={handleSubmit(onSubmitURL)} noValidate>
                  <div className=' backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
                    <div className='relative my-6 w-[33rem]'>
                      <div className='border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none'>
                        <div className='items-start justify-between  border-solid border-slate-200 rounded-t w-[594px] p-3'>
                          <div className='text-black ml-[14rem]  border rounded-lg pt-4 pb-4 pl-5 w-14 '>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='16'
                              height='16'
                              viewBox='0 0 16 16'
                              fill='none'
                            >
                              <path
                                d='M8 1V15M1 8H15'
                                stroke='#344054'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                style={{ width: '15px' }}
                              />
                            </svg>
                          </div>
                          <h6 className='text-1xl font-semibold ml-[12rem] mt-3'>
                            Add CTI Reports
                          </h6>
                        </div>
                        <div>
                          <div className='ml-6'>
                            <label htmlFor='ctiName' className='text-[14px]'>
                              CTI Report Title
                            </label>
                          </div>
                          <div className='relative pl-5 pr-5 pb-5 flex-auto'>
                            <input
                              type='text'
                              id='ctiName'
                              className='placeholder:text-base  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                              placeholder=' Add CTI Reports Title '
                              disabled={ctiNameDisabled}
                              {...register('ctiName', {
                                onChange: urlValidation,
                                required: !ctiNameDisabled ? 'ctiName is required' : false,
                              })}
                            />
                          </div>
                        </div>
                        <div>
                          <div className='ml-6'>
                            <label htmlFor='ctiName' className='text-[14px]'>
                              CTI URL
                            </label>
                          </div>
                          <div className='relative pl-5 pr-5 pb-5 flex-auto'>
                            <input
                              type='url'
                              id='url'
                              className='placeholder:text-base bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                              placeholder='Add CTI URL'
                              disabled={urlDisabled}
                              {...register('url', {
                                onChange: urlValidation,
                                required: !urlDisabled ? 'url is required' : false,
                                pattern: {
                                  value: /^(https?:\/\/www\.)/i,
                                  message: 'URL must start with https://www',
                                },
                              })}
                            />
                          </div>
                          {errors?.url?.message && showUrlError && (
                            <div className=''>
                              <BootstrapTooltip
                                title={'URL must start with https://www'}
                                arrow
                                placement='right'
                                open={true}
                              >
                                <span></span>
                              </BootstrapTooltip>
                            </div>
                          )}
                        </div>
                        <div className='flex mt-1 w'>
                          <div className='w-[15rem] pl-4'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='253'
                              height='2'
                              viewBox='0 0 253 2'
                              fill='none'
                            >
                              <path d='M1 1H252.5' stroke='#D0D5DD' strokeLinecap='round' />
                            </svg>
                          </div>
                          <div className='mt-[-17px] p-2 bg-white'>
                            <p>Or</p>
                          </div>
                          <div>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='213'
                              height='2'
                              viewBox='0 0 253 2'
                              fill='none'
                            >
                              <path d='M1 1H252.5' stroke='#D0D5DD' strokeLinecap='round' />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <div className='ml-6'>
                            <label htmlFor='streamID' className='text-[14px]'>
                              Feedly Team Board Stream ID
                            </label>
                          </div>
                          <div className='relative pl-5 pr-5 pb-5 flex-auto'>
                            <input
                              type='text'
                              id='streamID'
                              className='placeholder:text-base  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                              placeholder='Add Feedly Stream ID'
                              disabled={feedlyUrlDisabled}
                              {...register('streamID', {
                                required: !feedlyUrlDisabled ? 'streamID is Required' : false,
                                onChange: urlValidation,
                              })}
                            />
                          </div>
                        </div>
                        <div className='grid gap-4 grid-cols-2  p-2 pb-5'>
                          <button
                            className='ml-2 w-full h-10 rounded-lg gap-2 class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'
                            type='button'
                            onClick={clearError}
                          >
                            Cancel
                          </button>
                          <button
                            className='w-[14.6rem] h-10 bg-[#EE7103] text-white active:bg-[#EE7103] font-bold text-sm px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none'
                            type='submit'
                            onClick={() => {
                              if ((!errors.ctiName && errors.url) || !isDirty || isDirty) {
                                setShowUrlError(true)
                                setTimeout(() => {
                                  setShowUrlError(false)
                                }, 3000)
                              } else setShowUrlError(false)
                            }}
                          >
                            Add Resource
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
              </>
            )}
            {uploadFilePopup && (
              <>
                <form onSubmit={uploadSubmit(repository)}>
                  <div className='justify-center backdrop-blur-sm items-center flex  overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
                    <div className='relative w-6/12 my-6  mx-auto max-w-xl'>
                      <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                        <div
                          className=' p-3 border-solid border-slate-200 rounded-t'
                          style={{ textAlign: 'center' }}
                        >
                          <h6 className='text-lg text-gray-900 font-semibold'>Add Sigma Files</h6>
                        </div>

                        <div className='relative flex-auto p-6'>
                          <div className='items-center justify-center w-full'>
                            <form
                              onDragEnter={handleDragEnter}
                              onSubmit={(e) => e.preventDefault()}
                              onDrop={handleDrop}
                              onDragLeave={handleDragLeave}
                              onDragOver={handleDragOver}
                            >
                              <label
                                id='input_focus'
                                className='flex flex-col items-center justify-center w-full h-36 border-2 border-white-300 border-solid rounded-lg cursor-pointer bg-white-50 hover:bg-white-100'
                              >
                                <input
                                  placeholder='fileInput'
                                  className='hidden'
                                  ref={inputRef}
                                  type='file'
                                  multiple={true}
                                  onChange={handleChange}
                                  accept='.yml,.yaml'
                                />
                                <svg
                                  width='44'
                                  height='44'
                                  viewBox='0 0 44 44'
                                  fill='none'
                                  xmlns='http://www.w3.org/2000/svg'
                                >
                                  <g filter='url(#filter0_d_2281_5043)'>
                                    <rect x='2' y='1' width='40' height='40' rx='8' fill='white' />
                                    <path
                                      d='M18.6666 24.3333L22 21M22 21L25.3333 24.3333M22 21V28.5M28.6666 24.9524C29.6845 24.1117 30.3333 22.8399 30.3333 21.4167C30.3333 18.8854 28.2813 16.8333 25.75 16.8333C25.5679 16.8333 25.3975 16.7383 25.3051 16.5814C24.2183 14.7374 22.212 13.5 19.9166 13.5C16.4648 13.5 13.6666 16.2982 13.6666 19.75C13.6666 21.4718 14.3628 23.0309 15.4891 24.1613'
                                      stroke='#475467'
                                      strokeWidth='1.66667'
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                    />
                                    <rect
                                      x='2.5'
                                      y='1.5'
                                      width='39'
                                      height='39'
                                      rx='7.5'
                                      stroke='#EAECF0'
                                    />
                                  </g>
                                  <defs>
                                    <filter
                                      id='filter0_d_2281_5043'
                                      x='0'
                                      y='0'
                                      width='44'
                                      height='44'
                                      filterUnits='userSpaceOnUse'
                                      colorInterpolationFilters='sRGB'
                                    >
                                      <feFlood floodOpacity='0' result='BackgroundImageFix' />
                                      <feColorMatrix
                                        in='SourceAlpha'
                                        type='matrix'
                                        values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                                        result='hardAlpha'
                                      />
                                      <feOffset dy='1' />
                                      <feGaussianBlur stdDeviation='1' />
                                      <feColorMatrix
                                        type='matrix'
                                        values='0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.05 0'
                                      />
                                      <feBlend
                                        mode='normal'
                                        in2='BackgroundImageFix'
                                        result='effect1_dropShadow_2281_5043'
                                      />
                                      <feBlend
                                        mode='normal'
                                        in='SourceGraphic'
                                        in2='effect1_dropShadow_2281_5043'
                                        result='shape'
                                      />
                                    </filter>
                                  </defs>
                                </svg>
                                <p className='mb-2 text-sm text-gray-500'>
                                  <span className='font-semibold text-[#000]'>Click to upload</span>{' '}
                                  or drag and drop
                                </p>
                                <p className='text-xs text-gray-500'>
                                  You can only upload YAML files
                                </p>
                              </label>
                              <div className='flex flex-wrap w-full max-h-64 p-5 overflow-y-auto overflow-x-hidden'>
                                {files.map((file: any, idx: any) => (
                                  <div key={idx} className=''>
                                    <div className='relative'>
                                      <div className='relative py-3 sm:max-w-xl sm:mx-auto'>
                                        <div className='group cursor-pointer relative inline-block  w-28 text-center'>
                                          <ClearIcon onClick={(e) => removeFile(file.name, idx)} />
                                          <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 50 50'
                                            strokeWidth='1.5'
                                            stroke='currentColor'
                                            className='w-12 h-12 mt-3 ml-10'
                                            dangerouslySetInnerHTML={{ __html: file.path }}
                                          ></svg>
                                          <div
                                            className='opacity-0 w-full bg-black text-white text-center text-xs rounded-lg p-2 absolute z-100 group-hover:opacity-100 -left-[25%] -top-[30%] -mt-1.5 ml-10 px-3 pointer-events-none'
                                            data-tooltip-placement='left'
                                          >
                                            {file.fileName.name}
                                            <svg
                                              className='absolute text-black w-full  h-2.5 right-2.5 top-full'
                                              x='0px'
                                              y='0px'
                                              viewBox='0 0 255 255'
                                            >
                                              <polygon
                                                className='fill-current'
                                                points='0,0 127.5,127.5 255,0'
                                              />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </form>
                          </div>
                        </div>
                        <br />
                        <div className='flex items-center p-1 border-solid border-slate-200 rounded-b grid grid-cols-2 gap-6 mb-2'>
                          <button
                            type='button'
                            className='w-64 h-10 rounded-lg  ml-6 class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 mb-1 rounded shadow'
                            onClick={closeModal}
                          >
                            Cancel
                          </button>
                          <button
                            className={`w-64 h-10 text-white bg-[#EE7103] active: font-bold text-sm px-6 py-3 rounded-lg mb-1 shadow hover:shadow-lg outline-none
                          ${files.length == 0 && 'opacity-50'}`}
                            type='submit'
                            disabled={files.length == 0}
                          >
                            Add Resources
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </>
            )}
            {showModalDomain && (
              <>
                <div className='backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
                  <div className='relative my-6 w-96'>
                    <div className='border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none'>
                      <div className='items-start justify-between p-5 border-solid border-slate-200 rounded-t'>
                        <h6 className='text-1xl font-semibold justify-center items-center text-center'>
                          <TaskAltIcon style={{ width: 100, height: 100, color: 'green' }} />
                        </h6>
                        <h4 className='justify-center items-center text-center'>
                          The URL domain isn't supported.We've requested a review for potential
                          inclusion.
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
              </>
            )}
          </div>
        </div>
        {location.pathname === '/app/repositoryintropage' ? (
          <>
            <div className='flex'>
              <div className='text-white text-2xl float-right'>
                <div className='flex pl-[10px]'>
                  <div className='ps-0 pt-5 text-white font-inter text-2xl font-bold leading-6'>
                    Detection Library
                  </div>
                </div>
              </div>
              <div className='absolute right-9 pt-5 mt-[-20px]'>
                <button
                  onClick={() => navigateTo('/app/addRepository')}
                  className='text-white mr-4 text-sm font-semibold py-1 px-4  bg-[#EE7103] rounded-lg shadow disabled:opacity-25'
                >
                  <div className='flex'>
                    <div>
                      <p className='p-1 text-white font-inter text-sm font-semibold leading-6 '>
                        Add Repository
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </>
        ) : (
          ''
        )}

        {(location.pathname === `/app/addRepository/${id}` ||
          location.pathname === `/app/addRepository` ||
          location.pathname === `/app/insightCard/${id}` ||
          location.pathname === `/app/addFiles/${id}` ||
          location.pathname === `/app/Repository/${id}` ||
          location.pathname === `/app/VaultPermission/${id}`) && (
            <>
              <div className=''>
                <nav className='flex pb-4 ml-[-5px]' aria-label='Breadcrumb'>
                  <ol className='items-center'>
                    <li
                      id='openRepoSideBar'
                      className='items-center float-left'
                      onClick={(e) => {
                        e.stopPropagation()
                        if (id) navigateTo(`/app/repositoryintropage`)
                        else navigateTo(`/app/overview`)
                      }}
                    >
                      <a className='text-[#98A2B3] ml-1 text-sm font-medium md:ml-2 cursor-pointer'>
                        Repository
                      </a>
                    </li>
                    <li className='float-left mt-[3px]'>
                      <div className='flex items-center'>
                        <svg
                          className='w-3 h-3 text-gray-400 mx-1 ml-3'
                          aria-hidden='true'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 6 10'
                        >
                          <path
                            stroke='currentColor'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='m1 9 4-4-4-4'
                          />
                        </svg>
                        <a
                          className={` ${location.pathname === '/app/insightCard/' + id
                            ? 'text-[#98A2B3]'
                            : 'text-[#fff]'
                            }
                       ml-2 mt-[.5px] text-sm font-medium cursor-pointer`}
                        >
                          {(location.pathname === `/app/addFiles/${id}` ||
                            location.pathname === `/app/Repository/${id}` ||
                            location.pathname === `/app/insightCard/${id}` ||
                            location.pathname === `/app/VaultPermission/${id}`) && (
                              <>
                                {location.pathname === `/app/VaultPermission/${id}` && (
                                  <div
                                    onClick={() => {
                                      navigateTo(`/app/VaultPermission/${id}`)
                                    }}
                                  >
                                    {'Sigma Files'}
                                  </div>
                                )}
                                {location.pathname === `/app/Repository/${id}` && (
                                  <div
                                    onClick={() => {
                                      navigateTo(`/app/Repository/${id}`)
                                    }}
                                  >
                                    {'CTI Reports'}
                                  </div>
                                )}
                                {(location.pathname === `/app/addFiles/${id}` ||
                                  location.pathname === `/app/insightCard/${id}`) && (
                                    <div
                                      onClick={() => {
                                        navigateTo(`/app/Repository/${id}`)
                                      }}
                                    >
                                      {vault ? vault : selectedVault?.name}
                                    </div>
                                  )}
                              </>
                            )}
                          {location.pathname === `/app/addRepository/${id}` && 'Edit Repository'}
                          {location.pathname === `/app/addRepository` && 'Add New Repository'}
                        </a>
                      </div>
                    </li>
                    {location.pathname === `/app/insightCard/${id}` && (
                      <>
                        <li className='float-left mt-[4px]'>
                          <div className='flex items-center'>
                            <svg
                              className='w-3 h-3 text-gray-400 mx-2 mt-[.9px]'
                              aria-hidden='true'
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 6 10'
                            >
                              <path
                                stroke='currentColor'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='m1 9 4-4-4-4'
                              />
                            </svg>
                            <a className='text-[#fff] ml-1 mt-[.5px] text-sm font-medium cursor-pointer'>
                              Insights
                            </a>
                          </div>
                        </li>
                      </>
                    )}
                  </ol>
                </nav>
                <div className='text-white float-right '>
                  {(location.pathname == `/app/addRepository` ||
                    location.pathname == `/app/addRepository/${id}`) && (
                      <>
                        <div className='flex gap-[12px]'>
                          <div>
                            <button
                              onClick={() => {
                                document.getElementById('dataVaultSubmit')?.click()
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  document.getElementById('dataVaultSubmit')?.click()
                                }
                              }}
                              type='button'
                              disabled={!addRepoBtn}
                              className={`px-[10px] py-[6px] bg-[#EE7103] rounded-xl flex gap-[4px]
                          ${addRepoBtn ? '' : 'opacity-50 cursor-not-allowed'}`}
                            >
                              <span>
                                <p className='text-sm font-semibold text-[#fff]'>Save</p>
                              </span>
                              <span>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  width='18'
                                  height='18'
                                  viewBox='0 0 18 18'
                                  fill='none'
                                >
                                  <path
                                    d='M4.83333 1.5V4.33333C4.83333 4.80004 4.83333 5.0334 4.92416 5.21166C5.00406 5.36846 5.13154 5.49594 5.28834 5.57584C5.4666 5.66667 5.69996 5.66667 6.16667 5.66667H11.8333C12.3 5.66667 12.5334 5.66667 12.7117 5.57584C12.8685 5.49594 12.9959 5.36846 13.0758 5.21166C13.1667 5.0334 13.1667 4.80004 13.1667 4.33333V2.33333M13.1667 16.5V11.1667C13.1667 10.7 13.1667 10.4666 13.0758 10.2883C12.9959 10.1315 12.8685 10.0041 12.7117 9.92416C12.5334 9.83333 12.3 9.83333 11.8333 9.83333H6.16667C5.69996 9.83333 5.4666 9.83333 5.28834 9.92416C5.13154 10.0041 5.00406 10.1315 4.92416 10.2883C4.83333 10.4666 4.83333 10.7 4.83333 11.1667V16.5M16.5 6.77124V12.5C16.5 13.9001 16.5 14.6002 16.2275 15.135C15.9878 15.6054 15.6054 15.9878 15.135 16.2275C14.6002 16.5 13.9001 16.5 12.5 16.5H5.5C4.09987 16.5 3.3998 16.5 2.86502 16.2275C2.39462 15.9878 2.01217 15.6054 1.77248 15.135C1.5 14.6002 1.5 13.9001 1.5 12.5V5.5C1.5 4.09987 1.5 3.3998 1.77248 2.86502C2.01217 2.39462 2.39462 2.01217 2.86502 1.77248C3.3998 1.5 4.09987 1.5 5.5 1.5H11.2288C11.6364 1.5 11.8402 1.5 12.0321 1.54605C12.2021 1.58688 12.3647 1.65422 12.5138 1.7456C12.682 1.84867 12.8261 1.9928 13.1144 2.28105L15.719 4.88562C16.0072 5.17387 16.1513 5.318 16.2544 5.48619C16.3458 5.63531 16.4131 5.79789 16.4539 5.96795C16.5 6.15976 16.5 6.36358 16.5 6.77124Z'
                                    stroke='white'
                                    stroke-width='1.67'
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                  />
                                </svg>
                              </span>
                            </button>
                          </div>

                          <div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                openDataVaultSideMenu()
                                setDetail(null)
                                navigateTo('/app/overview')
                              }}
                              type='button'
                              className='px-[10px] py-[6px] text-[black] bg-[white] rounded-xl flex gap-[4px] justify-center items-center'
                            >
                              <span>
                                <p className='text-sm font-semibold'>Cancel</p>
                              </span>
                              <span>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  width='12'
                                  height='12'
                                  viewBox='0 0 12 12'
                                  fill='none'
                                >
                                  <path
                                    d='M11 1L1 11M1 1L11 11'
                                    stroke={'#344054'}
                                    stroke-width='1.67'
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                  />
                                </svg>
                              </span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                </div>
                <div className='text-white flex justify-start items-center'>
                  {location.pathname !== `/app/insightCard/${id}` && (
                    <>
                      {location.pathname !== `/app/Repository/${id}` &&
                        location.pathname !== `/app/VaultPermission/${id}` && (
                          <>
                            <div className='pr-[16px]'>
                              <span>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  width='54'
                                  height='60'
                                  viewBox='0 0 54 60'
                                  fill='none'
                                >
                                  <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M24.894 0.584872C26.2519 0.0758759 27.7481 0.0758759 29.106 0.584872L50.106 8.45987C51.2499 8.88867 52.2357 9.65644 52.9315 10.6605C53.6274 11.6646 54.0002 12.8572 54 14.0789V30.1679C54.0001 35.1821 52.6039 40.0974 49.9678 44.3628C47.3317 48.6283 43.5599 52.0754 39.075 54.3179L29.013 59.3489C28.388 59.6615 27.6988 59.8242 27 59.8242C26.3012 59.8242 25.612 59.6615 24.987 59.3489L14.925 54.3179C10.4401 52.0754 6.6683 48.6283 4.03221 44.3628C1.39611 40.0974 -0.000108095 35.1821 4.65534e-08 30.1679V14.0789C-0.000152095 12.8572 0.372611 11.6646 1.06846 10.6605C1.76431 9.65644 2.75008 8.88867 3.894 8.45987L24.894 0.584872ZM27 6.20387L6 14.0789V30.1679C6.00069 34.0675 7.08718 37.8899 9.13774 41.2068C11.1883 44.5237 14.122 47.2042 17.61 48.9479L27 53.6489V6.20387Z'
                                    fill='white'
                                  />
                                </svg>
                              </span>
                            </div>
                          </>
                        )}

                      {location.pathname !== `/app/addFiles/${id}` && (
                        <>
                          <div className=''>
                            <p className='text-[#FFF] font-semibold text-2xl'>
                              {location.pathname == `/app/addRepository/${id}`
                                ? state?.valtName
                                  ? state.valtName
                                  : repoName?.name
                                    ? repoName?.name
                                    : vault
                                : ''}
                            </p>
                          </div>
                        </>
                      )}
                      {location.pathname == `/app/addFiles/${id}` && (
                        <>
                          {editVaultName && (
                            <>
                              <div className='pl-4 text-[#000]'>
                                <input
                                  className='h-[34px] rounded-md p-3'
                                  type='text'
                                  name=''
                                  value={vault}
                                  id='vaultName'
                                  onKeyDown={(e) => handleKeyDown(e, vault)}
                                  onBlur={(e) => updateVaultName(e, vault)}
                                  onChange={(e) => setVault(e.target.value)}
                                />
                              </div>
                            </>
                          )}
                          {!editVaultName && (
                            <>
                              <div className='px-[16px]'>
                                <p className='text-[#FFF] font-semibold text-2xl'>
                                  {editVaultName ? vault : selectedVault?.name}
                                </p>
                              </div>
                            </>
                          )}
                          <div className='pl-4'>
                            <button
                              disabled={editVaultName}
                              className={`${editVaultName ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                              type='button'
                              onClick={() => setEditVaultName(true)}
                            >
                              <span>
                                <EditIcon style={{ width: 28, height: 28, marginTop: -10 }} />
                              </span>
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                  {location.pathname === `/app/insightCard/${id}` && (
                    <>
                      {InsightDetail?.ctiName ? (
                        <>
                          <div className='px-[6px]'>
                            <p className='text-[#FFF] font-semibold text-3xl'>
                              {InsightDetail?.ctiName}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className='px-[6px]'>
                            <p className='text-[#FFF] font-semibold  text-3xl'>{'Insights'}</p>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          )}

        {(location.pathname === `/app/addFeedly/${id}` ||
          location.pathname === `/app/addUrl/${id}` ||
          location.pathname === `/app/addPdf/${id}`) && (
            <>
              <div>
                <nav className='flex pb-4' aria-label='Breadcrumb'>
                  <ol className='items-center space-x-1 md:space-x-3'>
                    <li
                      className='items-center float-left'
                      onClick={(e) => {
                        e.stopPropagation()
                        openDataVaultSideMenu()
                        navigateTo(`/app/Repository/${id}`)
                      }}
                    >
                      <a className='text-[#98A2B3] ml-1 text-sm font-medium md:ml-2 cursor-pointer'>
                        Repository
                      </a>
                    </li>
                    <li className='float-left mt-[3px]'>
                      <div className='flex items-center'>
                        <svg
                          className='w-3 h-3 text-gray-400 mx-1'
                          aria-hidden='true'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 6 10'
                        >
                          <path
                            stroke='currentColor'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='m1 9 4-4-4-4'
                          />
                        </svg>
                        <a
                          onClick={() => {
                            navigateTo(`/app/Repository/${id}`)
                          }}
                          className='text-[#98A2B3] ml-1 text-sm font-medium md:ml-2 cursor-pointer'
                        >
                          {selectedVault?.name}
                        </a>
                      </div>
                    </li>
                    <li className='float-left mt-[3px]'>
                      <div className='flex items-center'>
                        <svg
                          className='w-3 h-3 text-gray-400 mx-1'
                          aria-hidden='true'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 6 10'
                        >
                          <path
                            stroke='currentColor'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='m1 9 4-4-4-4'
                          />
                        </svg>
                        <a className='text-[#fff] ml-1 text-sm font-medium md:ml-2 cursor-pointer'>
                          {location.pathname === `/app/addFeedly/${id}` && 'Add Feedly'}
                          {location.pathname === `/app/addUrl/${id}` && 'Add URL'}
                          {location.pathname === `/app/addPdf/${id}` && 'Add PDF'}
                        </a>
                      </div>
                    </li>
                  </ol>
                </nav>
                <div className='flex justify-between items-center'>
                  <div className='flex gap-[16px] justify-start items-center'>
                    {location.pathname === `/app/addFeedly/${id}` && (
                      <>
                        <span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='72'
                            height='72'
                            viewBox='0 0 72 72'
                            version='1.1'
                          >
                            <path
                              d='M 24.040 29.459 C 13.751 39.784, 13.640 39.945, 15.463 41.959 C 16.479 43.082, 18.028 44, 18.905 44 C 20.820 44, 41 25.323, 41 23.551 C 41 21.919, 37.731 19, 35.903 19 C 35.112 19, 29.774 23.707, 24.040 29.459 M 28.687 41.812 C 22.177 48.372, 21.996 48.686, 23.792 50.312 C 26.915 53.138, 29.305 52.261, 35.477 46.023 L 41.392 40.046 39.022 37.523 C 37.718 36.135, 36.380 35, 36.049 35 C 35.717 35, 32.404 38.065, 28.687 41.812 M 33.010 54.490 C 30.739 56.907, 30.724 57.038, 32.491 58.990 C 33.491 60.095, 35.070 61, 36 61 C 36.930 61, 38.509 60.095, 39.509 58.990 C 41.276 57.038, 41.261 56.907, 38.990 54.490 C 37.704 53.120, 36.358 52, 36 52 C 35.642 52, 34.296 53.120, 33.010 54.490'
                              stroke='none'
                              fill='#f5f9f6'
                              fillRule='evenodd'
                            />
                            <path
                              d='M 16.319 20.210 C -4.787 41.176, -4.555 39.099, 12.339 55.801 L 24.678 68 35.589 67.985 C 41.590 67.976, 47.088 67.596, 47.807 67.140 C 48.526 66.684, 54.489 60.989, 61.057 54.485 C 72.349 43.303, 73 42.440, 73 38.662 C 73 36.465, 72.690 34.977, 72.311 35.356 C 71.932 35.735, 64.363 28.835, 55.492 20.023 C 41.074 5.700, 39.006 4, 36 4 C 32.992 4, 30.914 5.712, 16.319 20.210 M 24.040 29.459 C 13.751 39.784, 13.640 39.945, 15.463 41.959 C 16.479 43.082, 18.028 44, 18.905 44 C 20.820 44, 41 25.323, 41 23.551 C 41 21.919, 37.731 19, 35.903 19 C 35.112 19, 29.774 23.707, 24.040 29.459 M 28.687 41.812 C 22.177 48.372, 21.996 48.686, 23.792 50.312 C 26.915 53.138, 29.305 52.261, 35.477 46.023 L 41.392 40.046 39.022 37.523 C 37.718 36.135, 36.380 35, 36.049 35 C 35.717 35, 32.404 38.065, 28.687 41.812 M 0.272 40 C 0.272 42.475, 0.467 43.487, 0.706 42.250 C 0.944 41.013, 0.944 38.987, 0.706 37.750 C 0.467 36.513, 0.272 37.525, 0.272 40 M 33.010 54.490 C 30.739 56.907, 30.724 57.038, 32.491 58.990 C 33.491 60.095, 35.070 61, 36 61 C 36.930 61, 38.509 60.095, 39.509 58.990 C 41.276 57.038, 41.261 56.907, 38.990 54.490 C 37.704 53.120, 36.358 52, 36 52 C 35.642 52, 34.296 53.120, 33.010 54.490'
                              stroke='none'
                              fill='#2db44d'
                              fillRule='evenodd'
                            />
                          </svg>
                        </span>
                        <span className=''>
                          <p className='font-semibold text-3xl text-[#fff]'>Add Feedly</p>
                        </span>
                      </>
                    )}
                    {location.pathname === `/app/addUrl/${id}` && (
                      <>
                        <span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='72'
                            height='72'
                            viewBox='0 0 72 72'
                            fill='none'
                          >
                            <path
                              d='M36 6C43.5038 14.2151 47.7683 24.8761 48 36C47.7683 47.1239 43.5038 57.7849 36 66M36 6C28.4962 14.2151 24.2317 24.8761 24 36C24.2317 47.1239 28.4962 57.7849 36 66M36 6C19.4315 6 6 19.4315 6 36C6 52.5685 19.4315 66 36 66M36 6C52.5685 6 66 19.4315 66 36C66 52.5685 52.5685 66 36 66M7.50006 27H64.5001M7.5 45H64.5'
                              stroke='#1570EF'
                              stroke-width='3'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            />
                          </svg>
                        </span>
                        <span className=''>
                          <p className='font-semibold text-3xl text-[#fff]'>Add URL</p>
                        </span>
                      </>
                    )}
                    {location.pathname === `/app/addPdf/${id}` && (
                      <>
                        <span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='58'
                            height='72'
                            viewBox='0 0 58 72'
                            fill='none'
                          >
                            <path
                              d='M0.200195 4C0.200195 1.79086 1.99106 0 4.2002 0H36.2002L57.8002 21.6V68C57.8002 70.2091 56.0093 72 53.8002 72H4.2002C1.99106 72 0.200195 70.2091 0.200195 68V4Z'
                              fill='#D92D20'
                            />
                            <path
                              opacity='0.3'
                              d='M36.2002 0L57.8002 21.6H40.2002C37.9911 21.6 36.2002 19.8091 36.2002 17.6V0Z'
                              fill='#295582'
                            />

                            <foreignObject x='13' y='22' width='30' height='30'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='30'
                                height='30'
                                viewBox='0 0 30 30'
                                fill='none'
                              >
                                <path
                                  d='M24.1338 17.3493C22.3372 17.3493 20.0888 17.6626 19.3533 17.7729C16.309 14.5937 15.4429 12.7867 15.248 12.3049C15.5121 11.6265 16.4307 9.04946 16.5612 5.73969C16.6256 4.08258 16.2755 2.84437 15.5205 2.05943C14.7668 1.27579 13.8545 1.21484 13.5929 1.21484C12.6755 1.21484 11.1367 1.67871 11.1367 4.78502C11.1367 7.48024 12.3933 10.3402 12.7407 11.0791C10.9106 16.4079 8.94576 20.0557 8.52853 20.8059C1.17468 23.5747 0.599609 26.2518 0.599609 27.0105C0.599609 28.374 1.57063 29.188 3.19709 29.188C7.14873 29.188 10.7549 22.5536 11.3511 21.4016C14.1577 20.2833 17.9142 19.5906 18.8691 19.4254C21.6083 22.0346 24.7762 22.7309 26.0917 22.7309C27.0815 22.7309 29.3995 22.7309 29.3995 20.3476C29.3996 18.1345 26.563 17.3493 24.1338 17.3493ZM23.9433 18.9138C26.0778 18.9138 26.6419 19.6197 26.6419 19.9929C26.6419 20.2271 26.553 20.9912 25.4089 20.9912C24.3829 20.9912 22.6116 20.3983 20.8689 19.1118C21.5956 19.0163 22.6711 18.9138 23.9433 18.9138ZM13.4808 2.7314C13.6755 2.7314 13.8036 2.79392 13.9092 2.94043C14.5231 3.79226 14.0281 6.57564 13.4256 8.75375C12.8441 6.88612 12.4076 4.02043 13.0217 3.01224C13.1417 2.81547 13.2789 2.7314 13.4808 2.7314ZM12.4442 19.4032C13.217 17.842 14.0831 15.5668 14.5549 14.28C15.499 15.8602 16.7688 17.3273 17.5032 18.1228C15.2165 18.6048 13.4865 19.0865 12.4442 19.4032ZM2.13465 27.2188C2.08374 27.1584 2.07621 27.0312 2.11458 26.8783C2.19504 26.5581 2.80987 24.9707 7.25687 22.9814C6.62011 23.9844 5.62465 25.4175 4.53109 26.4881C3.76129 27.2087 3.16188 27.5741 2.74948 27.5741C2.60195 27.5741 2.39868 27.5339 2.13465 27.2188Z'
                                  fill='white'
                                />
                              </svg>
                            </foreignObject>
                          </svg>
                        </span>
                        <span className=''>
                          <p className='font-semibold text-3xl text-[#fff]'>Add PDF</p>
                        </span>
                      </>
                    )}
                  </div>
                  {/* ************************ Cancel and Save Buttons*************** */}
                  <div className='flex gap-[12px] items-center'>
                    <div>
                      <button
                        onClick={() => {
                          if (location.pathname == `/app/addFeedly/${id}`)
                            document.getElementById('feedlySubmit')?.click()
                          else if (location.pathname == `/app/addUrl/${id}`)
                            document.getElementById('urlSubmit')?.click()
                          else if (location.pathname == `/app/addPdf/${id}`)
                            document.getElementById('fileSubmit')?.click()
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            if (location.pathname == `/app/addFeedly/${id}`)
                              document.getElementById('feedlySubmit')?.click()
                            else if (location.pathname == `/app/addUrl/${id}`)
                              document.getElementById('urlSubmit')?.click()
                            else if (location.pathname == `/app/addPdf/${id}`)
                              document.getElementById('fileSubmit')?.click()
                          }
                        }}
                        type='button'
                        disabled={!saveBtn}
                        className={`px-[10px] py-[6px] bg-[#EE7103] rounded-xl flex gap-[4px]
                          ${saveBtn ? '' : 'opacity-50 cursor-not-allowed'}`}
                      >
                        <span>
                          <p className='text-sm font-semibold text-[#fff]'>Save</p>
                        </span>
                        <span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='18'
                            height='18'
                            viewBox='0 0 18 18'
                            fill='none'
                          >
                            <path
                              d='M4.83333 1.5V4.33333C4.83333 4.80004 4.83333 5.0334 4.92416 5.21166C5.00406 5.36846 5.13154 5.49594 5.28834 5.57584C5.4666 5.66667 5.69996 5.66667 6.16667 5.66667H11.8333C12.3 5.66667 12.5334 5.66667 12.7117 5.57584C12.8685 5.49594 12.9959 5.36846 13.0758 5.21166C13.1667 5.0334 13.1667 4.80004 13.1667 4.33333V2.33333M13.1667 16.5V11.1667C13.1667 10.7 13.1667 10.4666 13.0758 10.2883C12.9959 10.1315 12.8685 10.0041 12.7117 9.92416C12.5334 9.83333 12.3 9.83333 11.8333 9.83333H6.16667C5.69996 9.83333 5.4666 9.83333 5.28834 9.92416C5.13154 10.0041 5.00406 10.1315 4.92416 10.2883C4.83333 10.4666 4.83333 10.7 4.83333 11.1667V16.5M16.5 6.77124V12.5C16.5 13.9001 16.5 14.6002 16.2275 15.135C15.9878 15.6054 15.6054 15.9878 15.135 16.2275C14.6002 16.5 13.9001 16.5 12.5 16.5H5.5C4.09987 16.5 3.3998 16.5 2.86502 16.2275C2.39462 15.9878 2.01217 15.6054 1.77248 15.135C1.5 14.6002 1.5 13.9001 1.5 12.5V5.5C1.5 4.09987 1.5 3.3998 1.77248 2.86502C2.01217 2.39462 2.39462 2.01217 2.86502 1.77248C3.3998 1.5 4.09987 1.5 5.5 1.5H11.2288C11.6364 1.5 11.8402 1.5 12.0321 1.54605C12.2021 1.58688 12.3647 1.65422 12.5138 1.7456C12.682 1.84867 12.8261 1.9928 13.1144 2.28105L15.719 4.88562C16.0072 5.17387 16.1513 5.318 16.2544 5.48619C16.3458 5.63531 16.4131 5.79789 16.4539 5.96795C16.5 6.15976 16.5 6.36358 16.5 6.77124Z'
                              stroke='white'
                              stroke-width='1.67'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            />
                          </svg>
                        </span>
                      </button>
                    </div>

                    <div>
                      <button
                        onClick={() => {
                          navigateTo(`/app/addFiles/${id}`)
                          setMouseEntered(false)
                        }}
                        onMouseEnter={() => setMouseEntered(true)}
                        onMouseLeave={() => setMouseEntered(false)}
                        type='button'
                        className='px-[10px] py-[6px] text-[black] bg-[white] rounded-xl flex gap-[4px] justify-center items-center'
                      >
                        <span>
                          <p className='text-sm font-semibold'>Cancel</p>
                        </span>
                        <span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='12'
                            height='12'
                            viewBox='0 0 12 12'
                            fill='none'
                          >
                            <path
                              d='M11 1L1 11M1 1L11 11'
                              stroke={'#344054'}
                              stroke-width='1.67'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            />
                          </svg>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        {location.pathname === `/app/settings` && (
          <div className='flex justify-between items-center'>
            <div className='flex gap-[16px] justify-start items-center'>
              <span className=''>
                <p className='font-semibold text-xl text-[#fff]'>Settings</p>
              </span>
            </div>
            <div className='flex gap-[12px] items-center'>
              <div>
                <button
                  onClick={() => {
                    document.getElementById('settingSubmit')?.click()
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      document.getElementById('settingSubmit')?.click()
                    }
                  }}
                  type='button'
                  disabled={!SaveValue ? false : true}
                  className={`px-[14px] py-[10px] bg-[#EE7103] rounded-lg flex gap-[4px] justify-center items-center
                          ${!SaveValue ? '' : 'opacity-50 cursor-not-allowed'}`}
                >
                  <span>
                    <p className='text-sm font-semibold text-[#fff]'>Save</p>
                  </span>
                  <span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='18'
                      height='18'
                      viewBox='0 0 18 18'
                      fill='none'
                    >
                      <path
                        d='M4.83333 1.5V4.33333C4.83333 4.80004 4.83333 5.0334 4.92416 5.21166C5.00406 5.36846 5.13154 5.49594 5.28834 5.57584C5.4666 5.66667 5.69996 5.66667 6.16667 5.66667H11.8333C12.3 5.66667 12.5334 5.66667 12.7117 5.57584C12.8685 5.49594 12.9959 5.36846 13.0758 5.21166C13.1667 5.0334 13.1667 4.80004 13.1667 4.33333V2.33333M13.1667 16.5V11.1667C13.1667 10.7 13.1667 10.4666 13.0758 10.2883C12.9959 10.1315 12.8685 10.0041 12.7117 9.92416C12.5334 9.83333 12.3 9.83333 11.8333 9.83333H6.16667C5.69996 9.83333 5.4666 9.83333 5.28834 9.92416C5.13154 10.0041 5.00406 10.1315 4.92416 10.2883C4.83333 10.4666 4.83333 10.7 4.83333 11.1667V16.5M16.5 6.77124V12.5C16.5 13.9001 16.5 14.6002 16.2275 15.135C15.9878 15.6054 15.6054 15.9878 15.135 16.2275C14.6002 16.5 13.9001 16.5 12.5 16.5H5.5C4.09987 16.5 3.3998 16.5 2.86502 16.2275C2.39462 15.9878 2.01217 15.6054 1.77248 15.135C1.5 14.6002 1.5 13.9001 1.5 12.5V5.5C1.5 4.09987 1.5 3.3998 1.77248 2.86502C2.01217 2.39462 2.39462 2.01217 2.86502 1.77248C3.3998 1.5 4.09987 1.5 5.5 1.5H11.2288C11.6364 1.5 11.8402 1.5 12.0321 1.54605C12.2021 1.58688 12.3647 1.65422 12.5138 1.7456C12.682 1.84867 12.8261 1.9928 13.1144 2.28105L15.719 4.88562C16.0072 5.17387 16.1513 5.318 16.2544 5.48619C16.3458 5.63531 16.4131 5.79789 16.4539 5.96795C16.5 6.15976 16.5 6.36358 16.5 6.77124Z'
                        stroke='white'
                        stroke-width='1.67'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {location.pathname == `/app/VaultPermission/${id}` && !vaultdata?.global && (
          <div className='flex justify-between items-center'>
            <div className='flex gap-[16px] justify-start items-center'>
              <span className=''>
                <p className='font-semibold text-2xl text-[#fff]'>
                  {location?.pathname == `/app/VaultPermission/${id}`
                    ? state?.valtName
                      ? state.valtName
                      : repoName?.name
                        ? repoName?.name
                        : vault
                          ? vault
                          : repoNames?.name
                    : vault
                      ? vault
                      : '(Untitled)'}
                </p>
              </span>
            </div>
            <div className='flex gap-[12px] items-center'>
              <span className='text-white pe-4'>
                <b>Upload Sigma files to your vault using the file uploader.</b>
              </span>
              <div>
                <button
                  onClick={() => setUploadFilePopup(true)}
                  onMouseEnter={() => setMouseEntered(true)}
                  onMouseLeave={() => setMouseEntered(false)}
                  type='button'
                  className='-mt-1 hover:bg-[#6941c6] hover:border-[#6941c6] text-white text-gray-900 bg-[#EE7103] border-[#EE7103] ml-auto h-8  text-sm  border  font-bold py-2 px-[14px] py-[10px] rounded-lg inline-flex items-center gap-2'
                >
                  <span>
                    <p className='text-sm font-semibold text-[#fff]'>Upload</p>
                  </span>
                  <span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke='white'
                      className='h-7 w-7 pl-2 text-gray-900'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
        {location.pathname == `/app/Repository/${id}` && !vaultdata?.global && (
          <div className='flex justify-between items-center'>
            <div className='flex gap-[16px] justify-start items-center'>
              <span className=''>
                <p className='font-semibold text-2xl text-[#fff]'>
                  {location?.pathname == `/app/Repository/${id}`
                    ? state?.valtName
                      ? state.valtName
                      : repoName?.name
                    : vault
                      ? vault
                      : '(Untitled)'}
                </p>
              </span>
            </div>
            <div className='flex gap-[12px] items-center'>
              <span className='text-white pe-4'>
                <b>Add CTI source for ingestion</b>
              </span>
              <div>
                <button
                  onClick={() => {
                    navigateTo(`/app/addFiles/${id}`)
                    setMouseEntered(false)
                  }}
                  onMouseEnter={() => setMouseEntered(true)}
                  onMouseLeave={() => setMouseEntered(false)}
                  type='button'
                  className='-mt-1 hover:bg-[#6941c6] hover:border-[#6941c6] border-[#EE7103] text-white text-gray-900 bg-[#EE7103] ml-auto h-8  text-sm  border  font-bold py-2 px-[14px] py-[10px] rounded-lg inline-flex items-center gap-2'
                >
                  <span>
                    <p className='text-sm font-semibold text-[#fff]'>Add</p>
                  </span>
                  <span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='14'
                      height='14'
                      viewBox='0 0 14 14'
                      fill='none'
                    >
                      <path
                        d='M7.00033 1.16797V12.8346M1.16699 7.0013H12.8337'
                        stroke={mouseEntered ? '#fff' : '#fff'}
                        stroke-width='1.66667'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
        {location.pathname == `/app/repositorysearch` && (
          <div className='w-full flex justify-between items-center'>
            <div className='text-gray-600 flex items-center space-x-2'>
              <nav className='flex pb-4' aria-label='Breadcrumb'>
                <ol className='items-center space-x-1 md:space-x-3'>
                  <li
                    id='openRepoSideBar'
                    className='items-center float-left'
                    onClick={(e) => {
                      e.stopPropagation()
                      navigateTo(`/app/repositoryintropage`)
                    }}
                  >
                    <a className='text-[#98A2B3] ml-1 text-sm font-medium md:ml-2 cursor-pointer'>
                      Repository
                    </a>
                  </li>
                  <li className='float-left mt-[3px]'>
                    <div className='flex items-center'>
                      <svg
                        className='w-3 h-3 text-gray-400 mx-1'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 6 10'
                      >
                        <path
                          stroke='currentColor'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='m1 9 4-4-4-4'
                        />
                      </svg>
                      <a
                        onClick={() => {
                          navigateTo(`/app/repositoryintropage`)
                        }}
                        className='text-[#fff] ml-1 text-sm font-medium md:ml-2 cursor-pointer'
                      >
                        {'All CTI Reports'}
                      </a>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>
            <div className='flex items-center space-x-1 w-[700px]'>
              <div className='mr-2 '>
                <div className='relative inline-flex lg:top-0 lg:pt-0 '></div>
              </div>
            </div>
          </div>
        )}
        {location.pathname === `/app/chatscreen` && (
          <>
            <nav className='flex pb-4' aria-label='Breadcrumb'>
              <ol className='inline-flex items-center space-x-1 md:space-x-3'>
                <li className='inline-flex items-center' onClick={() => toggleDropdown()}>
                  <a className='text-[#98A2B3] ml-1 text-sm font-medium md:ml-2 dark:text-gray-400 dark:hover:text-white cursor-pointer'>
                    Workbenches
                  </a>
                </li>
                <li>
                  <div className='flex items-center'>
                    <svg
                      className='w-3 h-3 text-gray-400 mx-1'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 6 10'
                    >
                      <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='m1 9 4-4-4-4'
                      />
                    </svg>
                    <a className='text-white ml-1 text-sm font-medium md:ml-2 dark:text-gray-400 dark:hover:text-white cursor-pointer'>
                      Select CTI
                    </a>
                  </div>
                </li>
              </ol>
            </nav>
          </>
        )}

        {location.pathname === `/app/basedonthreatactor` && (
          <div>
            <nav className='flex pb-4' aria-label='Breadcrumb'>
              <ol className='items-center space-x-1 md:space-x-3'>
                <li className='items-center float-left'>
                  <a className='text-[#98A2B3] ml-1 text-sm font-medium md:ml-2 cursor-pointer'>
                    Threat Brief
                  </a>
                </li>
                <li className='float-left mt-[3px]'>
                  <div className='flex items-center'>
                    <svg
                      className='w-3 h-3 text-gray-400 mx-1'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 6 10'
                    >
                      <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='m1 9 4-4-4-4'
                      />
                    </svg>
                    <a className='text-[#fff] ml-1 text-sm font-medium md:ml-2 cursor-pointer'>
                      {state?.taName == 'BasedonMalware'
                        ? 'Based On Malware'
                        : state?.taName == 'uploadedCTIReports'
                          ? 'Based On Uploaded CTI Reports'
                          : 'Based On Threatactor'}
                    </a>
                  </div>
                </li>
              </ol>
            </nav>
            {state?.taName == 'ThreatActor' && (
              <span className='text-[#fff] ml-1 text-xl font-medium md:ml-2'>New Threat Brief</span>
            )}
          </div>
        )}

        {(location.pathname === `/app/selectecti/${id}` ||
          location.pathname === `/app/selectecti`) && (
            <>
              <nav className='flex pb-4' aria-label='Breadcrumb'>
                <ol className='inline-flex items-center space-x-1 md:space-x-3'>
                  <li className='inline-flex items-center' onClick={() => toggleDropdown()}>
                    <a className='text-[#98A2B3] ml-1 text-sm font-medium md:ml-2 cursor-pointer'>
                      Workbenches
                    </a>
                  </li>
                  <li>
                    <div className='flex items-center'>
                      <svg
                        className='w-3 h-3 text-gray-400 mx-1'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 6 10'
                      >
                        <path
                          stroke='currentColor'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='m1 9 4-4-4-4'
                        />
                      </svg>
                      <a className='text-white ml-1 text-sm font-medium md:ml-2 cursor-pointer'>
                        Select Cti
                      </a>
                    </div>
                  </li>
                </ol>
              </nav>
              <div className='text-white flex'>
                <div>
                  <span>
                    <p className='text-white  font-semibold font-inter text-[22px] leading-9'>
                      Please Select a CTI Report to add to the chat
                    </p>
                  </span>
                </div>
              </div>
            </>
          )}
        {location.pathname === `/app/workbench/${id}` ? (
          <>
            <div className='text-white text-2xl  justify-between flex'>
              <div className='ps-1'>
                <p className='font-semibold text-lg font-inter text-white leading-[38px]'>
                  {selectedFile}
                </p>
              </div>
              <div className='ps-1'>
                <div className='bg-[#182230] w-[96px] h-[40px] rounded-lg right-2 pt-[10px] pb-[10px] pl-[14px] pr-[14px] cursor-pointer'>
                  <div className='flex'>
                    <div>
                      <p className='font-semibold text-sm font-inter pl-1 text-white'>Share</p>
                    </div>
                    <div className='pl-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='18'
                        height='18'
                        viewBox='0 0 18 18'
                        fill='none'
                      >
                        <path
                          d='M16.5 6.5L16.5 1.5M16.5 1.5H11.5M16.5 1.5L9.83333 8.16667M7.33333 3.16667H5.5C4.09987 3.16667 3.3998 3.16667 2.86502 3.43915C2.39462 3.67883 2.01217 4.06129 1.77248 4.53169C1.5 5.06647 1.5 5.76654 1.5 7.16667V12.5C1.5 13.9001 1.5 14.6002 1.77248 15.135C2.01217 15.6054 2.39462 15.9878 2.86502 16.2275C3.3998 16.5 4.09987 16.5 5.5 16.5H10.8333C12.2335 16.5 12.9335 16.5 13.4683 16.2275C13.9387 15.9878 14.3212 15.6054 14.5608 15.135C14.8333 14.6002 14.8333 13.9001 14.8333 12.5V10.6667'
                          stroke='white'
                          stroke-width='2'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          ''
        )}
        {location.pathname === `/app/workbench` ? (
          <>
            <div className='text-white text-2xl  justify-between flex'>
              <div className='ps-1'>
                <p className='font-semibold text-lg font-inter text-white leading-[38px]'>
                  {'New Workbench'}
                </p>
              </div>
              <div className='ps-1'>
                <div className='bg-[#182230] w-[96px] h-[40px] rounded-lg right-2 pt-[10px] pb-[10px] pl-[14px] pr-[14px] cursor-pointer'>
                  <div className='flex'>
                    <div>
                      <p className='font-semibold text-sm font-inter pl-1 text-white'>Share</p>
                    </div>
                    <div className='pl-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='18'
                        height='18'
                        viewBox='0 0 18 18'
                        fill='none'
                      >
                        <path
                          d='M16.5 6.5L16.5 1.5M16.5 1.5H11.5M16.5 1.5L9.83333 8.16667M7.33333 3.16667H5.5C4.09987 3.16667 3.3998 3.16667 2.86502 3.43915C2.39462 3.67883 2.01217 4.06129 1.77248 4.53169C1.5 5.06647 1.5 5.76654 1.5 7.16667V12.5C1.5 13.9001 1.5 14.6002 1.77248 15.135C2.01217 15.6054 2.39462 15.9878 2.86502 16.2275C3.3998 16.5 4.09987 16.5 5.5 16.5H10.8333C12.2335 16.5 12.9335 16.5 13.4683 16.2275C13.9387 15.9878 14.3212 15.6054 14.5608 15.135C14.8333 14.6002 14.8333 13.9001 14.8333 12.5V10.6667'
                          stroke='white'
                          stroke-width='2'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          ''
        )}

        {location.pathname === `/app/ChatView/${id}` ? (
          <>
            <div className='text-white text-2xl  justify-between flex'>
              <div className='ps-1'>
                <p className='font-semibold text-lg font-inter text-white leading-[38px]'>
                  {selectedFile}
                </p>
              </div>
            </div>
          </>
        ) : (
          ''
        )}
        {location.pathname === `/app/breiflow` ? (
          <div className='p-[10px]'>
            <div className='text-white text-2xl  justify-between flex'>
              <div className='ps-1'>
                <p className='text-white font-inter text-2xl font-semibold leading-9.5'>
                  S2S Hunter Onboarding
                </p>
              </div>
              <div className='ps-1'>
                <div className='bg-[#182230] w-[96px] h-[40px] rounded-lg right-2 pt-[10px] pb-[10px] pl-[14px] pr-[14px] cursor-pointer'>
                  <div className='flex'>
                    <div>
                      <p className='font-semibold text-sm font-inter pl-1 text-white'>Share</p>
                    </div>
                    <div className='pl-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='18'
                        height='18'
                        viewBox='0 0 18 18'
                        fill='none'
                      >
                        <path
                          d='M16.5 6.5L16.5 1.5M16.5 1.5H11.5M16.5 1.5L9.83333 8.16667M7.33333 3.16667H5.5C4.09987 3.16667 3.3998 3.16667 2.86502 3.43915C2.39462 3.67883 2.01217 4.06129 1.77248 4.53169C1.5 5.06647 1.5 5.76654 1.5 7.16667V12.5C1.5 13.9001 1.5 14.6002 1.77248 15.135C2.01217 15.6054 2.39462 15.9878 2.86502 16.2275C3.3998 16.5 4.09987 16.5 5.5 16.5H10.8333C12.2335 16.5 12.9335 16.5 13.4683 16.2275C13.9387 15.9878 14.3212 15.6054 14.5608 15.135C14.8333 14.6002 14.8333 13.9001 14.8333 12.5V10.6667'
                          stroke='white'
                          stroke-width='2'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className='flex justify-between items-center mt-3'>
                <div className='flex justify-start items-center'>
                  <span onClick={() => handleTabChange(1)} className={`cursor-pointer`}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='250'
                      height='56'
                      viewBox='0 0 250 56'
                      fill='none'
                    >
                      <path
                        d='M0 4.00049C0 1.79136 1.79086 0.000494635 3.99999 0.000489929L231.679 4.94464e-06C233.114 1.88701e-06 234.44 0.769141 235.152 2.01544L248.866 26.0152C249.569 27.2449 249.569 28.7546 248.866 29.9843L235.152 53.9841C234.44 55.2304 233.114 55.9995 231.679 55.9995L4.00001 56C1.79087 56 0 54.2091 0 52V4.00049Z'
                        fill={tabValue === 1 ? '#EE7103' : 'border border-1 border-[054D80]'}
                        stroke={tabValue === 2 || tabValue === 3 || tabValue === 4 ? '#054D80' : ''}
                      />
                      <text
                        x='50%'
                        y='50%'
                        dominant-baseline='middle'
                        text-anchor='middle'
                        fill='white'
                        font-size='14'
                      >
                        Company Profile
                      </text>
                    </svg>
                  </span>
                  <span onClick={() => handleTabChange(2)} className={`cursor-pointer`}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='251'
                      height='58'
                      viewBox='0 0 251 58'
                      fill='none'
                    >
                      <path
                        d='M1.70987 3.99228C0.94798 2.65896 1.91071 1 3.44636 1H231.719C233.154 1 234.48 1.76914 235.192 3.01544L248.906 27.0154C249.609 28.2452 249.609 29.7548 248.906 30.9846L235.192 54.9846C234.48 56.2309 233.154 57 231.719 57H3.44636C1.91072 57 0.94798 55.341 1.70987 54.0077L14.866 30.9846C15.5687 29.7548 15.5687 28.2452 14.866 27.0154L1.70987 3.99228Z'
                        fill={tabValue === 2 ? '#EE7103' : 'border border-1 border-[054D80]'}
                        stroke={tabValue === 1 || tabValue === 3 || tabValue === 4 ? '#054D80' : ''}
                        stroke-width='2'
                      />
                      <text
                        x='50%'
                        y='50%'
                        dominant-baseline='middle'
                        text-anchor='middle'
                        fill='white'
                        font-size='14'
                      >
                        Integrations
                      </text>
                    </svg>
                  </span>
                  <span onClick={() => handleTabChange(3)} className={`cursor-pointer`}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='251'
                      height='58'
                      viewBox='0 0 251 58'
                      fill='none'
                    >
                      <path
                        d='M1.70987 3.99228C0.94798 2.65896 1.91071 1 3.44636 1H231.719C233.154 1 234.48 1.76914 235.192 3.01544L248.906 27.0154C249.609 28.2452 249.609 29.7548 248.906 30.9846L235.192 54.9846C234.48 56.2309 233.154 57 231.719 57H3.44636C1.91072 57 0.94798 55.341 1.70987 54.0077L14.866 30.9846C15.5687 29.7548 15.5687 28.2452 14.866 27.0154L1.70987 3.99228Z'
                        fill={tabValue === 3 ? '#EE7103' : 'border border-1 border-[054D80]'}
                        stroke={tabValue === 1 || tabValue === 2 || tabValue === 4 ? '#054D80' : ''}
                        stroke-width='2'
                      />
                      <text
                        x='50%'
                        y='50%'
                        dominant-baseline='middle'
                        text-anchor='middle'
                        fill='white'
                        font-size='14'
                      >
                        Repository and CTI Upload
                      </text>
                    </svg>
                  </span>
                  <span onClick={() => handleTabChange(4)} className={`cursor-pointer`}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='251'
                      height='58'
                      viewBox='0 0 251 58'
                      fill='none'
                    >
                      <path
                        d='M1.70987 3.99228C0.94798 2.65896 1.91071 1 3.44636 1L246 1C248.209 1 250 2.79086 250 5V29V53C250 55.2091 248.209 57 246 57H3.44637C1.91072 57 0.94798 55.341 1.70987 54.0077L14.866 30.9846C15.5687 29.7548 15.5687 28.2452 14.866 27.0154L1.70987 3.99228Z'
                        fill={tabValue === 4 ? '#EE7103' : 'border border-1 border-[054D80]'}
                        stroke={tabValue === 1 || tabValue === 3 || tabValue === 2 ? '#054D80' : ''}
                        stroke-width='2'
                      />
                      <text
                        x='50%'
                        y='50%'
                        dominant-baseline='middle'
                        text-anchor='middle'
                        fill='white'
                        font-size='14'
                      >
                        Finish
                      </text>
                    </svg>
                  </span>
                </div>
                <div></div>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}

        {location.pathname === `/app/crownjewel` ? (
          <>
            <div className='text-white text-2xl  justify-between flex'>
              <div className='ps-1'>
                <p className='font-semibold text-lg font-inter text-white leading-[38px]'>
                  Crown Jewel Analysis
                </p>
              </div>
            </div>
          </>
        ) : (
          ''
        )}
        {location.pathname === `/app/datasource` ? (
          <>
            <div className='text-white text-2xl  justify-between flex'>
              <div className='ps-1'>
                <p className='font-semibold text-lg font-inter text-white leading-[38px]'>
                  Data Source Management
                </p>
              </div>
            </div>
          </>
        ) : (
          ''
        )}

        {location.pathname === `/app/threatactor/${id}` && (
          <>
            <span className='text-[#fff] text-3xl font-semibold p-[10px]'>
              {threatcarddata?.name}
            </span>
          </>
        )}
      </span>
    </nav>
  )
}

export default Navbar
