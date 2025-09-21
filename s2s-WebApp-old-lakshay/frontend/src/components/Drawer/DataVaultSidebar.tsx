import { makeStyles } from '@mui/styles'
import { RefObject, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  dataVaultList,
  dataVaultuserIdList,
  deleteDataVault,
} from '../../redux/nodes/datavault/action'
import local from '../../utils/local'
import './Sidebar.css'
import { useData } from '../../layouts/shared/DataProvider'
import { addBulkCtiReport } from '../../redux/nodes/bulk-ctiReport/action'
import { deletemultipledocument } from '../../redux/nodes/repository/action'
import { getAllThreatbrief } from '../../redux/nodes/threatBriefs/action'
import EditIcon from '@mui/icons-material/Edit'
import Swal from 'sweetalert2'
import { Theme } from '@mui/material/styles'

interface props {
  toggleDropdown: any
  setsubMenuList: any
  isOpen: any
  subMenuList: any
  openDataVaultSideMenu: any
  subDatavaultMenu: any
  setreportpopup: any
  setthreatPopup: any
  setThreatactorPopup: any
  setThreatactorPopupvalue: any
  handleCTIOpen: any
  isCtidelte: any
  setCitDelete: any
  isCtiDialogOpen: any
  isCtiIndex: any
}
interface MyComponentProps {
  height?: number // Define the animate property as optional
}

const useStyles = makeStyles<Theme, MyComponentProps>((theme) => ({
  formContainer: {
    marginTop: '16px',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '0px',
      height: '0px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#0C111D',
      margin: '40px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#1D2939',
    },
    // Responsive height adjustments
    height: (props) => `${props.height}vh`, // Default height
    [theme.breakpoints.up('xs')]: {
      height: '60vh', // Example for xs screens
    },
    [theme.breakpoints.up('sm')]: {
      height: '70vh', // Example for sm screens
    },
    [theme.breakpoints.up('md')]: {
      height: '75vh', // Example for md screens
    },
    [theme.breakpoints.up('lg')]: {
      height: '80vh', // Example for lg screens
    },
    [theme.breakpoints.up('xl')]: {
      height: '85vh', // Example for xl screens
    },
    [theme.breakpoints.up('2xl')]: {
      height: '100vh', // Example for 2xl screens (custom breakpoint if needed)
    },
  },
}))
const DataVaultSidebar = ({
  isOpen,
  openDataVaultSideMenu,
  subDatavaultMenu,
  handleCTIOpen,
  isCtidelte,
  setCitDelete,
  isCtiDialogOpen,
  isCtiIndex,
}: props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const { id: paramsId } = useParams()
  const { pathname } = location

  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  const localAuth = local.getItem('auth')
  const locals = JSON.parse(localAuth as any)
  const userId = locals?.user?.user?.id
  const roleDto = local.getItem('auth')
  const role = JSON.parse(roleDto as any)
  const roleDescription = role?.user?.user
  const getroleName = roleDescription?.roleDTO

  const updateDataVault = useSelector((state: any) => state.datavalutUpdatereducer)
  const { success: dataVaultUpdateSuccess } = updateDataVault
  const savedDataVault = useSelector((state: any) => state.datavalutsavereducer)
  const { success: dataVaultSaveSuccess } = savedDataVault

  const [datavaultlist, setdatavaultlist] = useState([] as any)
  const [threatBriefList, setThreatBriefList] = useState([] as any)
  const [searchValue, setsearchValue] = useState([] as any)

  const [searchFilter, setSearchFilter] = useState('')

  const createChat = sessionStorage.getItem('createNewChat')
  const newChat = JSON.parse(createChat as any)
  const { createNewChat } = newChat || {}

  const {
    data,
    copyFiles,
    setCopyFiles,
    setCTIReport,
    openThreat,
    setHuntToaster,
    setResultToaster,
    wssProvider,
    setWssProvider,
  }: any = useData()

  const classes = useStyles({ height: openThreat && openThreat.value === 'openedthreat' ? 84 : 70 })

  const divRef: RefObject<HTMLDivElement> = useRef(null)

  const [confirmation, setConfirmation] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0 as any)
  const menuRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeMenu, setActiveMenu] = useState(0)

  const getDataVault = () => {
    if (getroleName?.roleName === 'USER' || getroleName?.roleName == 'DATAVAULT_ADMIN') {
      dispatch(dataVaultuserIdList(token, userId) as any)
        .then((res: any) => {
          if (res.type == 'DATAVAULT_ID_SUCCESS') {
            const vault = sessionStorage.getItem('vault')
            const selectedVault = JSON.parse(vault as any)
            if (selectedVault) {
              const index: any = res?.payload?.findIndex(
                (item: any) => item.id === Number(selectedVault.id),
              )
              setActiveMenu(index)
              setdatavaultlist(res.payload)
              setsearchValue(res.payload)
            } else {
              const index: any = res.payload?.findIndex((item: any) => item.id === Number(paramsId))
              setActiveMenu(index)
              setdatavaultlist(res.payload)
              setsearchValue(res.payload)
            }
          }
        })
        .catch((err: any) => console.log('err', err))
    } else if (getroleName?.roleName == 'ACCOUNT_ADMIN' || getroleName?.roleName == 'SUPER_ADMIN') {
      dispatch(dataVaultList(token) as any)
        .then((res: any) => {
          if (res.type == 'DATAVAULT_DETAIL_SUCCESS') {
            const vault = sessionStorage.getItem('vault')
            let selectedVault = JSON.parse(vault as any)
            if (selectedVault) {
              const index: any = res?.payload?.findIndex(
                (item: any) => item.id === Number(selectedVault.id),
              )
              setActiveMenu(index)
              setdatavaultlist(res.payload)
              setsearchValue(res.payload)
            } else {
              const index: any = res.payload?.findIndex((item: any) => item.id === Number(paramsId))
              setActiveMenu(index)
              setdatavaultlist(res.payload)
              setsearchValue(res.payload)
            }
          }
        })
        .catch((err: any) => console.log('err', err))
    }
  }

  const checkParamsIdIsVault = (id: any) => {
    let isChatId = datavaultlist.find((each: any) => each.id == id)
    return isChatId
  }

  useEffect(() => {
    if (
      checkParamsIdIsVault(paramsId) &&
      paramsId &&
      data &&
      data.from == 'dashBoard' &&
      data.value.subDatavaultMenu
    ) {
      navigate(`/app/Repository/${paramsId}`)
    }
  }, [data])

  // *****************************common get UseEffect*************************
  useEffect(() => {
    // ************************Datavault Search******************
    if (searchFilter) {
      const arr = openThreat?.value === 'openedthreat' ? threatBriefList : datavaultlist
      const filterValue = arr.filter((item: any) => {
        if (item.name.toLowerCase().includes(searchFilter.toLowerCase())) {
          return item
        }
      })
      setsearchValue(filterValue)
    } else {
      if (openThreat?.value === 'openedRepository') getDataVault()
      else getThreatBrief()
    }
  }, [searchFilter, dataVaultUpdateSuccess, dataVaultSaveSuccess, openThreat])

  useEffect(() => {
    if (
      pathname.split('/')[2] != 'Repository' &&
      pathname.split('/')[2] != 'addRepository' &&
      pathname.split('/')[2] != 'VaultPermission' &&
      pathname.split('/')[2] != 'addFeedly' &&
      pathname.split('/')[2] != 'addUrl' &&
      pathname.split('/')[2] != 'addFiles' &&
      pathname.split('/')[2] != 'insightCard' &&
      pathname.split('/')[2] != 'addPdf' &&
      !createNewChat &&
      openThreat?.value === 'openedRepository' &&
      pathname.split('/')[2] != 'repositorysearch' &&
      pathname.split('/')[2] != 'sigmafilesearch'
    ) {
      if (datavaultlist && datavaultlist.length > 0) {
        setActiveMenu(0)
        sessionStorage.setItem('vault', JSON.stringify(datavaultlist[0]))
        navigate(`/app/Repository/${datavaultlist[0].id}`)
      }
    } else if (!subDatavaultMenu) {
      setConfirmation(false)
      setSelectedIndex(null)
    }
    if (
      openThreat?.value === 'openedthreat' &&
      threatBriefList.length > 0 &&
      pathname.split('/')[2] != 'threatactor'
    ) {
      sessionStorage.setItem('threat', JSON.stringify(threatBriefList[0]))
    }
  }, [datavaultlist, pathname, createNewChat, subDatavaultMenu, threatBriefList])

  useEffect(() => {
    if (subDatavaultMenu) {
      if (menuRefs.current[activeMenu]) {
        menuRefs.current[activeMenu]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    }
  }, [activeMenu, subDatavaultMenu])

  const onCardview = (item: any, index: any) => {
    if (openThreat.value === 'openedRepository') {
      setActiveMenu(index)
      setCTIReport(null)
      setCopyFiles(null)
      sessionStorage.setItem('vault', JSON.stringify(item))
      let value: any = sessionStorage.getItem('createNewChat')
      let chatNavigate: any = JSON.parse(value)
      if (chatNavigate?.createNewChat) {
        navigate(`/app/selectecti/${item.id}`, { state: item })
        openDataVaultSideMenu()
        sessionStorage.setItem('createNewChat', JSON.stringify({ createNewChat: false }))
      } else {
        navigate(`/app/Repository/${item.id}`, { state: { valtName: item?.name } })
        openDataVaultSideMenu()
      }
    } else {
      setHuntToaster(false)
      setResultToaster(false)
      if (item && item.id) {
        setActiveMenu(index)
        sessionStorage.setItem('threat', JSON.stringify(item))
        navigate(`/app/threatactor/${item.id}`, { state: [{ threatBrief: item }] })
        openDataVaultSideMenu()
      } else {
        console.error('Item or item.id is not defined', item)
      }
    }
  }

  const pasteFiles = (item: any) => {
    let temp: any = []
    copyFiles.value.totalSelectedCheckboxes.forEach((ctiValue: any) => {
      temp.push({ TITLE: ctiValue.ctiName, URL: ctiValue.url })
    })
    let obj = {
      'cti-infos': temp,
    }
    const blob = new Blob([JSON.stringify(obj)], {
      type: 'application/json',
    })
    const data = new FormData()
    data.append('report-file', blob)
    dispatch(addBulkCtiReport(data, item.id) as any)
      .then((res: any) => {
        if (copyFiles.value.mode == 'moveTo') {
          let ids = copyFiles.value.totalSelectedCheckboxes.map((item: any) => item.id)
          dispatch(deletemultipledocument(token, ids) as any)
        }
        navigate(`/app/Repository/${item.id}`, { state: { valtName: item?.name } })
        openDataVaultSideMenu()
        setCopyFiles(null)
      })
      .catch((err: any) => console.log('err', err))
  }

  const handleDataVaultEdit = (item: any) => {
    navigate(`/app/addRepository/${item.id}`, { state: [{ selectedDataVault: item }] })
    sessionStorage.setItem('vault', JSON.stringify(item))
    openDataVaultSideMenu()
  }

  const handleDataVaultDelete = async (item: any, index: any) => {
    handleCTIOpen(item, index)
  }
  useEffect(() => {
    if (isCtidelte) {
      let remainingVault = datavaultlist.filter((vault: any) => vault?.id !== isCtidelte?.id)
      dispatch(deleteDataVault(isCtidelte.id) as any).then((res: any) => {
        if (res.type == 'DATAVAULT_DELETE_SUCCESS') {
          getDataVault()
          setConfirmation(false)
          setSelectedIndex(null)
          setCitDelete(null)
          sessionStorage.setItem('vault', JSON.stringify(remainingVault[isCtiIndex]))
          navigate(`/app/Repository/${remainingVault[isCtiIndex].id}`)
        } else if (res.type == 'DATAVAULT_DELETE_FAILED') {
          setConfirmation(false)
          setSelectedIndex(null)
          setCitDelete(null)
          Swal.fire({
            position: 'center',
            icon: 'error',
            color: '#000',
            title: `${`You can not delete this repository as it contains a CTI report`}`,
            width: 600,
            timer: 1000,
            showConfirmButton: false,
          })
        }
      })
    }
    if (!isCtiDialogOpen) {
      setConfirmation(false)
      setSelectedIndex(null)
      setCitDelete(null)
    }
  }, [isCtidelte, isCtiDialogOpen])

  const createNewRepository = () => {
    if (divRef.current) {
      divRef.current.scrollTop = 0
    }
    navigate(`/app/addRepository`)
    openDataVaultSideMenu()
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setSearchFilter(value)
  }
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {}

  // ****************************** Threat Brief ****************************

  const getThreatBrief = () => {
    dispatch(getAllThreatbrief() as any)
      .then((response: any) => {
        if (response.type === 'GET_THREAT_BRIEF_SUCCESS') {
          if (response?.payload?.length > 0) {
            const filterValue = response?.payload.filter((item: any) => {
              const [beforeWith] = item?.description.split(' with')
              return beforeWith == 'processing succeeded'
            })
            const index: any = filterValue?.findIndex((item: any) => item.id === Number(paramsId))
            setActiveMenu(index)
            setThreatBriefList(filterValue)
            setsearchValue(filterValue)
          }
        }
      })
      .catch((err: any) => console.log('err', err))
  }

  useEffect(() => {
    if (wssProvider) {
      if (wssProvider?.eventType == 'datavault created') {
        getDataVault()
        setWssProvider(null)
      }
    }
  }, [wssProvider])

  const handleChangeCtiReports = () => {
    openDataVaultSideMenu()
    navigate(`/app/repositorysearch`)
  }

  return (
    <>
      <div
        className={`w-70 py-[36px] z-[999] px-[16px] bg-[#101828] relative p-[5px] h-full right-54 ${
          isOpen ? 'left-12' : ''
        } ${createNewChat ? '' : ''}`}
        style={{ borderRight: '1px solid white' }}
      >
        {!createNewChat && (
          <div className='px-4 pb-[16px] text-[#fff] text-base'>
            {openThreat?.value === 'openedthreat' ? (
              <>
                <p>Threat Actors</p>
              </>
            ) : (
              <>
                <p>Repositories</p>
              </>
            )}
          </div>
        )}

        {/* ***********************Search Input********************* */}

        <div className='pl-4 relative mt-[16px]'>
          <form
            className='max-w-md mx-auto w-[249px] mt-3'
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <label className='mb-2 text-sm font-medium text-gray-900 sr-only'>Search</label>
            <div className='relative'>
              <input
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                type='search'
                id='default-search'
                className='block w-full h-[27px] p-4 ps-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500'
                placeholder='Search'
                required
              />
              <div className='absolute inset-y-0 end-2 flex items-center ps-3 pointer-events-none'>
                <svg
                  className='w-4 h-4  text-gray-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 20 20'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
                  />
                </svg>
              </div>
            </div>
          </form>
        </div>

        {/* ***********************Create New Repository********************* */}
        {!createNewChat && openThreat?.value === 'openedRepository' && (
          <>
            <div className='pl-4 cursor-pointer' onClick={createNewRepository}>
              <div className='px-[12px] py-[8px] flex justify-start items-center gap-[12px] bg-[#101828] border-2 border-[#D0D5DD] rounded-md mt-[16px]'>
                <div>
                  <span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      viewBox='0 0 16 16'
                      fill='none'
                    >
                      <path
                        d='M8 1V15M1 8H15'
                        stroke='#D0D5DD'
                        stroke-width='2'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </svg>
                  </span>
                </div>
                <div>
                  <p className='text-base font-semibold text-[#D0D5DD]'>New Repository</p>
                </div>
              </div>
            </div>
            <div className='pl-4 cursor-pointer' onClick={handleChangeCtiReports}>
              <div className='px-[12px] py-[8px] flex justify-start items-center gap-[12px] bg-[#101828] border-2 border-[#D0D5DD] rounded-md mt-[16px]'>
                <div>
                  <span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='20'
                      height='20'
                      viewBox='0 0 20 20'
                      fill='none'
                    >
                      <path
                        d='M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z'
                        stroke='#D0D5DD'
                        strokeWidth='1.66667'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </span>
                </div>
                <div>
                  <p className='text-base font-semibold text-[#D0D5DD]'>View All CTI Reports</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ****************************DataVault List************************** */}
        <div ref={divRef} className={`${classes.formContainer} `}>
          <div className=' pl-4' style={{ direction: 'ltr' }}>
            {/* *******************DataVaults*********************** */}
            {openThreat?.value === 'openedRepository' && (
              <>
                {searchValue?.map((item: any, index: number) => {
                  const [beforeWith] = item?.description.split(' with')
                  return (
                    <div className='bg-[#2B3A55]' style={{ borderRadius: '12px' }}>
                      <div
                        onClick={() =>
                          openThreat?.value === 'openedthreat'
                            ? beforeWith == 'processing succeeded' && onCardview(item, index)
                            : onCardview(item, index)
                        }
                        key={index}
                        ref={(el) => (menuRefs.current[index] = el)}
                        className={`${
                          openThreat?.value === 'openedthreat'
                            ? beforeWith == 'processing succeeded'
                              ? `cursor-pointer bg-[#1D2939]`
                              : `cursor-default bg-[#1D2939]`
                            : `cursor-pointer bg-[#1D2939]`
                        } relative rounded-lg  p-[16px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ${
                          Number(paramsId) == item.id &&
                          activeMenu === index &&
                          !createNewChat &&
                          'bg-[#EE7103]'
                        }
                 ${paramsId != item.id && 'hover:bg-[#29374A]'}`}
                      >
                        <div className='flex justify-between items-center text-[#fff]'>
                          <div className='flex justify-between items-center'>
                            <div className='flex gap-[8px]'>
                              <span>
                                <div className='bg-[#fff] border rounded-[50px] p-2 mt-[0.5px'>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='20'
                                    height='20'
                                    viewBox='0 0 20 20'
                                    fill='white'
                                  >
                                    <g clipPath='url(#clip0_5571_1797)'>
                                      <path
                                        d='M10.31 11.333L5.935 8.83302C5.84063 8.77897 5.73376 8.75053 5.625 8.75053C5.51624 8.75053 5.40937 8.77897 5.315 8.83302L0.94 11.333C0.844341 11.3877 0.764825 11.4666 0.709507 11.5619C0.654189 11.6572 0.625036 11.7654 0.625 11.8755V16.8755C0.625036 16.9857 0.654189 17.0939 0.709507 17.1892C0.764825 17.2844 0.844341 17.3634 0.94 17.418L5.315 19.918C5.40939 19.972 5.51625 20.0004 5.625 20.0004C5.73375 20.0004 5.84061 19.972 5.935 19.918L10.31 17.418C10.4057 17.3634 10.4852 17.2844 10.5405 17.1892C10.5958 17.0939 10.625 16.9857 10.625 16.8755V11.8755C10.625 11.7654 10.5958 11.6572 10.5405 11.5619C10.4852 11.4666 10.4057 11.3877 10.31 11.333ZM5.625 10.0955L8.74 11.8755L5.625 13.6555L2.51 11.8755L5.625 10.0955ZM1.875 12.9524L5 14.738V18.2986L1.875 16.513V12.9524ZM6.25 18.2986V14.738L9.375 12.9524V16.513L6.25 18.2986ZM17.5 11.8755V15.0005C17.5 15.6899 16.9394 16.2505 16.25 16.2505H14.2675L15.2587 15.2593L14.375 14.3755L11.875 16.8755L14.375 19.3755L15.2587 18.4918L14.2675 17.5005H16.25C17.6287 17.5005 18.75 16.3793 18.75 15.0005V11.8755H17.5ZM10.94 9.38239L9.69 8.66802C9.59434 8.61338 9.51482 8.53442 9.45951 8.43915C9.40419 8.34388 9.37504 8.23568 9.375 8.12552V6.87552H10.625V7.76302L11.56 8.29739L10.94 9.38239ZM15.94 9.01177L15 9.54864V8.12552H13.75V9.54864L12.81 9.01114L12.19 10.0968L14.065 11.168C14.1594 11.222 14.2663 11.2504 14.375 11.2504C14.4837 11.2504 14.5906 11.222 14.685 11.168L16.56 10.0968L15.94 9.01177ZM17.81 9.38239L17.19 8.29739L18.125 7.76302V6.87552H19.375V8.12552C19.375 8.23568 19.3458 8.34388 19.2905 8.43915C19.2352 8.53442 19.1557 8.61338 19.06 8.66802L17.81 9.38239ZM15.935 5.45427L15.315 4.36864L14.375 4.90614L13.435 4.36864L12.815 5.45427L13.75 5.98802V6.87552H15V5.98802L15.935 5.45427ZM19.06 2.58302L17.185 1.51114L16.565 2.59677L17.49 3.12552L16.565 3.65427L17.185 4.73927L18.125 4.20239V5.62552H19.375V3.12552C19.375 3.01535 19.3458 2.90715 19.2905 2.81189C19.2352 2.71662 19.1557 2.63766 19.06 2.58302ZM15.315 1.88302L14.375 1.34489L13.435 1.88239L12.815 0.796768L14.065 0.0823933C14.1594 0.0284017 14.2663 0 14.375 0C14.4837 0 14.5906 0.0284017 14.685 0.0823933L15.935 0.796768L15.315 1.88302ZM12.185 2.59677L11.565 1.51177L9.69 2.58302C9.59434 2.63766 9.51482 2.71662 9.45951 2.81189C9.40419 2.90715 9.37504 3.01535 9.375 3.12552V5.62552H10.625V4.20239L11.565 4.73989L12.185 3.65427L11.26 3.12552L12.185 2.59677ZM5.625 0.625518L4.74125 1.50927L5.7325 2.50052H3.75C2.37125 2.50052 1.25 3.62177 1.25 5.00052V8.12552H2.5V5.00052C2.5 4.31177 3.06063 3.75052 3.75 3.75052H5.7325L4.74125 4.74177L5.625 5.62552L8.125 3.12552L5.625 0.625518Z'
                                        fill='#1D2939'
                                      />
                                    </g>
                                    <defs>
                                      <clipPath id='clip0_5571_1797'>
                                        <rect width='20' height='20' fill='white' />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </div>
                              </span>
                              <span className='mt-[10px] w-[100px]'>
                                <p className='truncate text-sm font-semibold font-inter'>
                                  {item.name}
                                </p>
                              </span>
                            </div>
                          </div>
                          {getroleName?.roleName !== 'USER' && !item.global && !copyFiles && (
                            <>
                              {(!confirmation || selectedIndex != index) && (
                                <>
                                  <div className='flex gap-[10px]'>
                                    <span
                                      className='cursor-pointer'
                                      onClick={(e) => {
                                        handleDataVaultEdit(item)
                                        e.stopPropagation()
                                      }}
                                    >
                                      <EditIcon style={{ width: 18, height: 18, marginTop: -10 }} />
                                    </span>
                                    <span
                                      className=' cursor-pointer'
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setConfirmation(true)
                                        setSelectedIndex(index)
                                      }}
                                    >
                                      <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='18'
                                        height='16'
                                        viewBox='0 0 20 20'
                                        fill={paramsId == item.id ? '#EE7103' : 'none'}
                                      >
                                        <path
                                          d='M13.3333 5.0013V4.33464C13.3333 3.40121 13.3333 2.9345 13.1517 2.57798C12.9919 2.26438 12.7369 2.00941 12.4233 1.84962C12.0668 1.66797 11.6001 1.66797 10.6667 1.66797H9.33333C8.39991 1.66797 7.9332 1.66797 7.57668 1.84962C7.26308 2.00941 7.00811 2.26438 6.84832 2.57798C6.66667 2.9345 6.66667 3.40121 6.66667 4.33464V5.0013M8.33333 9.58464V13.7513M11.6667 9.58464V13.7513M2.5 5.0013H17.5M15.8333 5.0013V14.3346C15.8333 15.7348 15.8333 16.4348 15.5608 16.9696C15.3212 17.44 14.9387 17.8225 14.4683 18.0622C13.9335 18.3346 13.2335 18.3346 11.8333 18.3346H8.16667C6.76654 18.3346 6.06647 18.3346 5.53169 18.0622C5.06129 17.8225 4.67883 17.44 4.43915 16.9696C4.16667 16.4348 4.16667 15.7348 4.16667 14.3346V5.0013'
                                          stroke={paramsId == item.id ? '#fff' : '#98A2B3'}
                                          stroke-width='1.66667'
                                          stroke-linecap='round'
                                          stroke-linejoin='round'
                                        />
                                      </svg>
                                    </span>
                                  </div>
                                </>
                              )}
                              {confirmation && selectedIndex == index && (
                                <>
                                  <div className='flex gap-[10px]'>
                                    <span
                                      className='cursor-pointer'
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setConfirmation(false)
                                        setSelectedIndex(null)
                                      }}
                                    >
                                      <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        viewBox='0 0 50 50'
                                        width='19px'
                                        height='19px'
                                      >
                                        <path
                                          fill='#fff'
                                          d='M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z'
                                        />
                                      </svg>
                                    </span>
                                    <span
                                      className='cursor-pointer'
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDataVaultDelete(item, index)
                                      }}
                                    >
                                      <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        viewBox='0 0 48 48'
                                        width='20px'
                                        height='20px'
                                      >
                                        <path
                                          fill='#fff'
                                          d='M40.6 12.1L17 35.7 7.4 26.1 4.6 29 17 41.3 43.4 14.9z'
                                        />
                                      </svg>
                                    </span>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </div>

                        <div
                          className={`mt-4 w-[200px] ${
                            copyFiles && 'flex justify-between relative'
                          }`}
                        >
                          <h5
                            className={`truncate ${
                              copyFiles && !item.global && 'w-[100px]'
                            } text-[#98A2B3] font-inter font-medium text-xs leading-5 ${
                              paramsId == item.id && 'text-[#fff]'
                            }`}
                          >
                            {item.description}
                          </h5>
                          {copyFiles && !item.global && item.id != paramsId && (
                            <div
                              onClick={() => pasteFiles(item)}
                              className='absolute right-[-20px] top-[-10px] px-[4px] py-[6px] flex items-center justify-between gap-[4px] text-[#344054] bg-[#fff] rounded-lg cursor-pointer'
                            >
                              <span className='text-xs font-semibold'>
                                {copyFiles.value.mode == 'moveTo' ? 'Move here' : 'Copy here'}
                              </span>
                              <span>
                                {copyFiles.value.mode == 'moveTo' ? (
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='16'
                                    height='16'
                                    viewBox='0 0 16 16'
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
                                ) : (
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='16'
                                    height='16'
                                    viewBox='0 0 16 16'
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
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className='mb-3'></div>
                    </div>
                  )
                })}
              </>
            )}
            {openThreat?.value === 'openedthreat' && (
              <>
                {searchValue
                  ?.filter((item: any) => {
                    const [beforeWith] = item?.description.split(' with')
                    return beforeWith == 'processing succeeded'
                  })
                  .map((item: any, index: number) => {
                    const [beforeWith] = item?.description.split(' with')
                    return (
                      <div className='bg-[#2B3A55]' style={{ borderRadius: '12px' }}>
                        <div
                          onClick={() =>
                            openThreat?.value === 'openedthreat'
                              ? beforeWith == 'processing succeeded' && onCardview(item, index)
                              : onCardview(item, index)
                          }
                          key={index}
                          ref={(el) => (menuRefs.current[index] = el)}
                          className={`${
                            openThreat?.value === 'openedthreat'
                              ? beforeWith == 'processing succeeded'
                                ? `cursor-pointer bg-[#1D2939]`
                                : `cursor-default bg-[#1D2939]`
                              : `cursor-pointer bg-[#1D2939]`
                          } relative rounded-lg  p-[16px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ${
                            paramsId == item.id &&
                            activeMenu === index &&
                            !createNewChat &&
                            'bg-[#EE7103]'
                          }
                 ${paramsId != item.id && 'hover:bg-[#29374A]'}`}
                        >
                          <div className='flex justify-between items-center text-[#fff]'>
                            <div className='flex justify-between items-center'>
                              <div className='flex gap-[8px]'>
                                <span>
                                  <div className='bg-[#fff] border rounded-[50px] p-2 mt-[0.5px'>
                                    <svg
                                      xmlns='http://www.w3.org/2000/svg'
                                      width='20'
                                      height='20'
                                      viewBox='0 0 20 20'
                                      fill='white'
                                    >
                                      <g clipPath='url(#clip0_5571_1797)'>
                                        <path
                                          d='M10.31 11.333L5.935 8.83302C5.84063 8.77897 5.73376 8.75053 5.625 8.75053C5.51624 8.75053 5.40937 8.77897 5.315 8.83302L0.94 11.333C0.844341 11.3877 0.764825 11.4666 0.709507 11.5619C0.654189 11.6572 0.625036 11.7654 0.625 11.8755V16.8755C0.625036 16.9857 0.654189 17.0939 0.709507 17.1892C0.764825 17.2844 0.844341 17.3634 0.94 17.418L5.315 19.918C5.40939 19.972 5.51625 20.0004 5.625 20.0004C5.73375 20.0004 5.84061 19.972 5.935 19.918L10.31 17.418C10.4057 17.3634 10.4852 17.2844 10.5405 17.1892C10.5958 17.0939 10.625 16.9857 10.625 16.8755V11.8755C10.625 11.7654 10.5958 11.6572 10.5405 11.5619C10.4852 11.4666 10.4057 11.3877 10.31 11.333ZM5.625 10.0955L8.74 11.8755L5.625 13.6555L2.51 11.8755L5.625 10.0955ZM1.875 12.9524L5 14.738V18.2986L1.875 16.513V12.9524ZM6.25 18.2986V14.738L9.375 12.9524V16.513L6.25 18.2986ZM17.5 11.8755V15.0005C17.5 15.6899 16.9394 16.2505 16.25 16.2505H14.2675L15.2587 15.2593L14.375 14.3755L11.875 16.8755L14.375 19.3755L15.2587 18.4918L14.2675 17.5005H16.25C17.6287 17.5005 18.75 16.3793 18.75 15.0005V11.8755H17.5ZM10.94 9.38239L9.69 8.66802C9.59434 8.61338 9.51482 8.53442 9.45951 8.43915C9.40419 8.34388 9.37504 8.23568 9.375 8.12552V6.87552H10.625V7.76302L11.56 8.29739L10.94 9.38239ZM15.94 9.01177L15 9.54864V8.12552H13.75V9.54864L12.81 9.01114L12.19 10.0968L14.065 11.168C14.1594 11.222 14.2663 11.2504 14.375 11.2504C14.4837 11.2504 14.5906 11.222 14.685 11.168L16.56 10.0968L15.94 9.01177ZM17.81 9.38239L17.19 8.29739L18.125 7.76302V6.87552H19.375V8.12552C19.375 8.23568 19.3458 8.34388 19.2905 8.43915C19.2352 8.53442 19.1557 8.61338 19.06 8.66802L17.81 9.38239ZM15.935 5.45427L15.315 4.36864L14.375 4.90614L13.435 4.36864L12.815 5.45427L13.75 5.98802V6.87552H15V5.98802L15.935 5.45427ZM19.06 2.58302L17.185 1.51114L16.565 2.59677L17.49 3.12552L16.565 3.65427L17.185 4.73927L18.125 4.20239V5.62552H19.375V3.12552C19.375 3.01535 19.3458 2.90715 19.2905 2.81189C19.2352 2.71662 19.1557 2.63766 19.06 2.58302ZM15.315 1.88302L14.375 1.34489L13.435 1.88239L12.815 0.796768L14.065 0.0823933C14.1594 0.0284017 14.2663 0 14.375 0C14.4837 0 14.5906 0.0284017 14.685 0.0823933L15.935 0.796768L15.315 1.88302ZM12.185 2.59677L11.565 1.51177L9.69 2.58302C9.59434 2.63766 9.51482 2.71662 9.45951 2.81189C9.40419 2.90715 9.37504 3.01535 9.375 3.12552V5.62552H10.625V4.20239L11.565 4.73989L12.185 3.65427L11.26 3.12552L12.185 2.59677ZM5.625 0.625518L4.74125 1.50927L5.7325 2.50052H3.75C2.37125 2.50052 1.25 3.62177 1.25 5.00052V8.12552H2.5V5.00052C2.5 4.31177 3.06063 3.75052 3.75 3.75052H5.7325L4.74125 4.74177L5.625 5.62552L8.125 3.12552L5.625 0.625518Z'
                                          fill='#1D2939'
                                        />
                                      </g>
                                      <defs>
                                        <clipPath id='clip0_5571_1797'>
                                          <rect width='20' height='20' fill='white' />
                                        </clipPath>
                                      </defs>
                                    </svg>
                                  </div>
                                </span>
                                <span className='mt-[10px] w-[100px]'>
                                  <p className='truncate text-sm font-semibold font-inter'>
                                    {item.name}
                                  </p>
                                </span>
                              </div>
                            </div>
                            {getroleName?.roleName !== 'USER' && !item.global && !copyFiles && (
                              <>
                                {(!confirmation || selectedIndex != index) && (
                                  <>
                                    <div className='flex gap-[10px]'>
                                      <span
                                        className='cursor-pointer'
                                        onClick={(e) => {
                                          handleDataVaultEdit(item)
                                          e.stopPropagation()
                                        }}
                                      >
                                        <EditIcon
                                          style={{ width: 18, height: 18, marginTop: -10 }}
                                        />
                                      </span>
                                      <span
                                        className=' cursor-pointer'
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setConfirmation(true)
                                          setSelectedIndex(index)
                                        }}
                                      >
                                        <svg
                                          xmlns='http://www.w3.org/2000/svg'
                                          width='18'
                                          height='16'
                                          viewBox='0 0 20 20'
                                          fill={paramsId == item.id ? '#EE7103' : 'none'}
                                        >
                                          <path
                                            d='M13.3333 5.0013V4.33464C13.3333 3.40121 13.3333 2.9345 13.1517 2.57798C12.9919 2.26438 12.7369 2.00941 12.4233 1.84962C12.0668 1.66797 11.6001 1.66797 10.6667 1.66797H9.33333C8.39991 1.66797 7.9332 1.66797 7.57668 1.84962C7.26308 2.00941 7.00811 2.26438 6.84832 2.57798C6.66667 2.9345 6.66667 3.40121 6.66667 4.33464V5.0013M8.33333 9.58464V13.7513M11.6667 9.58464V13.7513M2.5 5.0013H17.5M15.8333 5.0013V14.3346C15.8333 15.7348 15.8333 16.4348 15.5608 16.9696C15.3212 17.44 14.9387 17.8225 14.4683 18.0622C13.9335 18.3346 13.2335 18.3346 11.8333 18.3346H8.16667C6.76654 18.3346 6.06647 18.3346 5.53169 18.0622C5.06129 17.8225 4.67883 17.44 4.43915 16.9696C4.16667 16.4348 4.16667 15.7348 4.16667 14.3346V5.0013'
                                            stroke={paramsId == item.id ? '#fff' : '#98A2B3'}
                                            stroke-width='1.66667'
                                            stroke-linecap='round'
                                            stroke-linejoin='round'
                                          />
                                        </svg>
                                      </span>
                                    </div>
                                  </>
                                )}
                                {confirmation && selectedIndex == index && (
                                  <>
                                    <div className='flex gap-[10px]'>
                                      <span
                                        className='cursor-pointer'
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setConfirmation(false)
                                          setSelectedIndex(null)
                                        }}
                                      >
                                        <svg
                                          xmlns='http://www.w3.org/2000/svg'
                                          viewBox='0 0 50 50'
                                          width='19px'
                                          height='19px'
                                        >
                                          <path
                                            fill='#fff'
                                            d='M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z'
                                          />
                                        </svg>
                                      </span>
                                      <span
                                        className='cursor-pointer'
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleDataVaultDelete(item, index)
                                        }}
                                      >
                                        <svg
                                          xmlns='http://www.w3.org/2000/svg'
                                          viewBox='0 0 48 48'
                                          width='20px'
                                          height='20px'
                                        >
                                          <path
                                            fill='#fff'
                                            d='M40.6 12.1L17 35.7 7.4 26.1 4.6 29 17 41.3 43.4 14.9z'
                                          />
                                        </svg>
                                      </span>
                                    </div>
                                  </>
                                )}
                              </>
                            )}
                          </div>

                          <div
                            className={`mt-4 w-[200px] ${
                              copyFiles && 'flex justify-between relative'
                            }`}
                          >
                            <h5
                              className={`truncate ${
                                copyFiles && !item.global && 'w-[100px]'
                              } text-[#98A2B3] font-inter font-medium text-xs leading-5 ${
                                paramsId == item.id && 'text-[#fff]'
                              }`}
                            >
                              {item.description}
                            </h5>
                            {copyFiles && !item.global && item.id != paramsId && (
                              <div
                                onClick={() => pasteFiles(item)}
                                className='absolute right-[-20px] top-[-10px] px-[4px] py-[6px] flex items-center justify-between gap-[4px] text-[#344054] bg-[#fff] rounded-lg cursor-pointer'
                              >
                                <span className='text-xs font-semibold'>
                                  {copyFiles.value.mode == 'moveTo' ? 'Move here' : 'Copy here'}
                                </span>
                                <span>
                                  {copyFiles.value.mode == 'moveTo' ? (
                                    <svg
                                      xmlns='http://www.w3.org/2000/svg'
                                      width='16'
                                      height='16'
                                      viewBox='0 0 16 16'
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
                                  ) : (
                                    <svg
                                      xmlns='http://www.w3.org/2000/svg'
                                      width='16'
                                      height='16'
                                      viewBox='0 0 16 16'
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
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className='mb-3'></div>
                      </div>
                    )
                  })}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default DataVaultSidebar
