import { styled } from '@mui/styles'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { LOGOUT_SUCCESS } from '../../redux/nodes/auth/actions'
import { chatSessionHistoryPost } from '../../redux/nodes/chat/action'
import { USER_UPDATE_RESET, indUserDetail } from '../../redux/nodes/users/action'
import local from '../../utils/local'
import './Sidebar.css'
import { useData } from '../../layouts/shared/DataProvider'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: '#f1f1f1',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f1f1f1',
    color: '#1D2939',
    fontWeight: 400,
    fontSize: 12,
  },
}))

const StyledDiv = styled('div')({
  overflowY: 'auto',
  maxHeight: '70vh',
  paddingBottom: '10px',
  '&::-webkit-scrollbar': {
    width: '7px',
    height: '7px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#FFFFFF',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#D9D5D5',
  },
})

interface props {
  isOpen: any
  setsubMenuList: any
  toggleSidebar: any
  toggleDropdown: any
  subMenuList: any
  openDataVaultSideMenu: any
  subDatavaultMenuStatus: any
  setDataVaultSideMenuClose: any
  closeChatSideBar: any
  setDefaultCloseSideBar: any
  dataVaultSideMenuOpen: any
  toggleDropdownnotifi: any
  isOpenNo: any
  notificationmessages: any
  isLogout: any
  handleopenNotification: any
  setSidebarOpen: any
}

const Sidebar = ({
  isOpen,
  setsubMenuList,
  toggleSidebar,
  toggleDropdown,
  subMenuList,
  setDataVaultSideMenuClose,
  toggleDropdownnotifi,
  isOpenNo,
  notificationmessages,
  isLogout,
  handleopenNotification,
}: props) => {
  const { openThreat, setWrokbenchHome }: any = useData()

  const dispatch = useDispatch()
  const navigateTo = useNavigate()

  const chatUser = local.getItem('auth')
  const sessionUser = JSON.parse(chatUser as any)
  const user = sessionUser?.user?.user

  const locl = useLocation()

  const [pathname] = locl.pathname.split('/')

  const signoutHandler = () => {
    setWrokbenchHome(false)
    const chatHistoryId = sessionStorage.getItem('prevId')
    const prompt_value = localStorage?.getItem('prompthistory')
    const prompt_value1 = JSON.parse(prompt_value as any)
    let prompt_value2 = prompt_value1?.length > 0 ? prompt_value1 : []

    if (prompt_value2?.length > 0) {
      let chatSessionHistory = {
        tenant: user.tenantId,
        userEmail: user.email,
        chatSessionId: JSON.parse(chatHistoryId as any),
        chatSessionName: 'New Chat',
        prompts: prompt_value1,
      }
      dispatch(chatSessionHistoryPost(chatSessionHistory) as any)
      local.clear()
      localStorage.removeItem('prompthistory')
      sessionStorage.clear()
      navigateTo('/')
      dispatch({ type: LOGOUT_SUCCESS })
    } else {
      local.clear()
      localStorage.removeItem('prompthistory')
      sessionStorage.clear()
      navigateTo('/')
      dispatch({ type: LOGOUT_SUCCESS })
    }
  }
  const settingsnavigate = () => {
    sessionStorage.removeItem('active')
    sessionStorage.removeItem('active1')
    if (subMenuList) {
      toggleDropdown1()
    }
    navigateTo('/app/settings')
    setDataVaultSideMenuClose()
  }
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isAdminOpen, setIsAdminOpen] = useState(false)

  const localStorage1 = local.getItem('auth')
  const locals = JSON.parse(localStorage1 as any)
  const userId = locals?.user?.user

  const induserDetails = useSelector((state: any) => state.indUserdetailreducer)
  const { induserDetail } = induserDetails

  const userUpdateDetails = useSelector((state: any) => state.userSettingUpdatereducer)
  const { userUpdateDetail } = userUpdateDetails

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userImage, setUserImage] = useState('')

  const Token = local.getItem('bearerToken')
  const token = JSON.parse(Token as any)
  const img = '/avatar.webp'

  const updateSetting = useSelector((state: any) => state.userSettingUpdatereducer)
  const { success: updateSettingsuccess } = updateSetting

  const roleDto = local.getItem('auth')
  const role = JSON.parse(roleDto as any)
  const roleDescription = role?.user?.user
  const getroleName = roleDescription?.roleDTO
  const authenticate = useSelector((state: any) => state.auth?.isAuthenticated)

  useEffect(() => {
    if (!authenticate) {
      navigateTo('/')
    }
  }, [authenticate])

  useEffect(() => {
    if (notificationmessages?.length > 0) {
      const userdeletedata = notificationmessages?.find((x: any) => x?.data?.id == user?.id)
      if (userdeletedata?.eventType == 'user deleted' && userdeletedata?.data?.id == user?.id) {
        signoutHandler()
      }
    }
  }, [notificationmessages?.length, token])

  useEffect(() => {
    if (isLogout) {
      signoutHandler()
    }
  }, [isLogout])

  const search = useLocation()
  let activePage = search.pathname.split('/')[2]
  let act = sessionStorage.getItem('active')

  const auditOpen = () => {
    let auditControlOpen = sessionStorage.getItem('isAdminOpen')

    if (auditControlOpen) {
      setIsAdminOpen(true)
    }
  }

  const toggleAdminDropdown = () => {
    if (subMenuList) {
      toggleDropdown1()
    }
    setIsAdminOpen(!isAdminOpen)
    sessionStorage.removeItem('active1')
    sessionStorage.removeItem('selectedVault')
    sessionStorage.removeItem('createNewChat')
    if (!isAdminOpen) sessionStorage.setItem('isAdminOpen', 'true')
    else sessionStorage.removeItem('isAdminOpen')
  }

  const overviewnavigate = () => {
    setWrokbenchHome(false)
    if (subMenuList) {
      toggleDropdown1()
    }
    setDataVaultSideMenuClose()
    sessionStorage.removeItem('selectedVault')
    sessionStorage.removeItem('createNewChat')
    navigateTo('/app/landingpage')
  }
  const feedyintergrationNavigate = () => {
    setWrokbenchHome(false)
    sessionStorage.setItem('active1', 'feedyintegration')
    if (subMenuList) {
      toggleDropdown1()
    }
    setDataVaultSideMenuClose()
    navigateTo('/app/feedyintegration')
  }

  const usernavigate = () => {
    setWrokbenchHome(false)
    sessionStorage.setItem('active1', 'users')
    if (subMenuList) {
      toggleDropdown1()
    }
    navigateTo('/app/users')
    setDataVaultSideMenuClose()
  }

  const companyProfilenavigate = () => {
    setWrokbenchHome(false)
    sessionStorage.setItem('active1', 'companyprofile')
    if (subMenuList) {
      toggleDropdown1()
    }
    navigateTo('/app/companyprofile')
    setDataVaultSideMenuClose()
  }

  const toggleDropdown1 = () => {
    setsubMenuList()
    setIsDropdownOpen(!isDropdownOpen)
    toggleDropdown()
    setDataVaultSideMenuClose()
    let [pathid] = location.pathname.split('/')
    if (pathid !== 'ChatView') {
      sessionStorage.removeItem('selectedVault')
      sessionStorage.removeItem('createNewChat')
    }
  }

  const supportavigate = () => {
    setWrokbenchHome(false)
    sessionStorage.setItem('active', 'support')
    if (subMenuList) {
      toggleDropdown1()
    }
    navigateTo('/app/support')
  }

  const activePageOne = (name: any) => {
    sessionStorage.setItem('active', name)
    sessionStorage.removeItem('vaultdata')
  }
  const activePageTwo = (name: any) => {
    sessionStorage.removeItem('sessionName')
    const [path1, path2, path3] = locl.pathname.split('/')
    if (path3 !== 'chatworkbench') {
      navigateTo('/app/chatworkbench')
      sessionStorage.removeItem('workartifacts')
    }

    sessionStorage.setItem('active', name)
    sessionStorage.removeItem('vaultdata')
  }
  const activePageThree = (name: any) => {
    sessionStorage.setItem('active', name)
    if (subMenuList) {
      setsubMenuList(false)
    }
    navigateTo('/app/collections')
    sessionStorage.removeItem('vaultdata')
  }

  const activePagesource = (name: any) => {
    sessionStorage.setItem('active', name)
    if (subMenuList) {
      setsubMenuList(false)
    }
    navigateTo('/app/sourcespage')
    sessionStorage.removeItem('vaultdata')
  }
  const activePageFour = (name: any) => {
    sessionStorage.setItem('active', name)
    sessionStorage.removeItem('vaultdata')
  }
  const activePageFour2 = (name: any) => {
    sessionStorage.setItem('active', name)
    sessionStorage.removeItem('vaultdata')
  }

  const activedPage = (name: any) => {
    sessionStorage.setItem('active', name)
    sessionStorage.removeItem('vaultdata')
  }

  const threatOpen = () => { }

  useEffect(() => {
    threatOpen()
  }, [])

  useEffect(() => {
    if (search.pathname.split('/')[2] == 'datavaults') {
      sessionStorage.setItem('active', 'dataVault')
    }
    if (userUpdateDetail?.firstName || userUpdateDetail?.lastName || userUpdateDetail?.photo) {
      setFirstName(userUpdateDetail?.firstName)
      setLastName(userUpdateDetail?.lastName)
      setUserImage(userUpdateDetail?.photo)
    }
  }, [
    userUpdateDetail?.firstName,
    userUpdateDetail?.lastName,
    userUpdateDetail?.photo,
    search.pathname,
  ])

  useEffect(() => {
    if (pathname == 'overview') {
      sessionStorage.setItem('active', 'overview')
    } else if (pathname == 'workbench') {
      sessionStorage.setItem('active', 'Chats')
    }
  }, [search.pathname])

  useEffect(() => {
    auditOpen()
    if (updateSettingsuccess) {
      dispatch({ type: USER_UPDATE_RESET })
    }
    dispatch(indUserDetail(userId?.id, token) as any)
  }, [])

  useEffect(() => {
    if (openThreat && openThreat?.value === 'openedthreat') {
      sessionStorage.setItem('isThreatOpen', 'true')
      activedPage('threatactor')
    }
  }, [openThreat])

  const nodficationclik = () => {
    if (isOpenNo) {
      toggleDropdownnotifi()
    }
  }

  return (
    <div
      className={`fixed top-0 z-10  left-0 h-full border-r border-[#3e4b5d] w-[268px] bg-[#1D2939] nav-width transition-transform duration-300 ease-in-out transform ${isOpen ? '-translate-x-52 ease-out' : 'translate-x-0 ease-in'
        }
       `}
      onClick={nodficationclik}
    >
      {!isOpen ? (
        <>
          <div className='mt-3  mr-2 mb-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='202'
              height='30'
              viewBox='0 0 232 40'
              fill='none'
            >
              <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M26.2361 16.3008L27.5662 17.6423L32.9671 17.6471V15.9756L28.6141 11.5854H6.73094L5.40087 10.2439V6.05691L6.73094 4.71545H27.3538L28.6838 6.05691H32.8869V4.39025L29.7318 0H4.35294L0 4.39025V11.9106L4.35294 16.3008H26.2361ZM26.2361 23.6992L27.5662 22.3577L32.9671 22.3529V24.0244L28.6141 28.4146H6.73094L5.40087 29.7561V33.9431L6.73094 35.2846H27.3538L28.6838 33.9431H32.8869V35.6098L29.7318 40H4.35294L0 35.6098V28.0894L4.35294 23.6992H26.2361Z'
                fill='#FF7B01'
              />
              <path
                d='M221.047 29.0659C220.058 29.0659 219.193 28.7913 218.451 28.242C217.71 27.6653 217.051 27.0061 216.474 26.2646C215.925 25.5231 215.65 24.658 215.65 23.6693V16.2541C215.65 15.2654 215.925 14.4003 216.474 13.6587C217.051 12.9172 217.71 12.2581 218.451 11.6813C219.193 11.1321 220.058 10.8574 221.047 10.8574H225.784C226.773 10.8574 227.638 11.1321 228.379 11.6813C229.121 12.2581 229.78 12.9172 230.357 13.6587C230.906 14.4003 231.181 15.2654 231.181 16.2541V23.6693C231.181 24.658 230.906 25.5231 230.357 26.2646C229.78 27.0061 229.121 27.6653 228.379 28.242C227.638 28.7913 226.773 29.0659 225.784 29.0659H221.047ZM219.769 23.5045C219.769 23.7792 219.975 24.1224 220.387 24.5344C220.799 24.9464 221.143 25.1523 221.417 25.1523H225.413C225.688 25.1523 226.031 24.9464 226.443 24.5344C226.855 24.1224 227.061 23.7792 227.061 23.5045V16.4188C227.061 16.1442 226.855 15.8009 226.443 15.389C226.031 14.977 225.688 14.771 225.413 14.771H221.417C221.143 14.771 220.799 14.977 220.387 15.389C219.975 15.8009 219.769 16.1442 219.769 16.4188V23.5045Z'
                fill='#F1F1F1'
              />
              <path
                d='M209.313 11.0634H213.638L208.283 28.8599H204.081L200.579 17.3663L196.995 28.8599H192.793L187.52 11.0634H191.887L195.018 22.5158L198.437 11.0634H202.762L206.099 22.5158L209.313 11.0634Z'
                fill='#F1F1F1'
              />
              <path
                d='M186.33 14.9771H181.221V23.2986C181.221 23.5732 181.427 23.9165 181.839 24.3285C182.251 24.7405 182.595 24.9464 182.869 24.9464H185.671V28.86H182.499C181.51 28.86 180.645 28.5854 179.903 28.0361C179.162 27.4594 178.503 26.8002 177.926 26.0587C177.377 25.3172 177.102 24.4521 177.102 23.4634V14.9771H174.342V11.0635H177.102V4.22498H181.221V11.0635H186.33V14.9771Z'
                fill='#F1F1F1'
              />
              <path d='M158.25 28.8703V24.9979H174.275V28.8703H158.25Z' fill='#FF7B01' />
              <path
                d='M153.993 13.6587C154.542 14.4003 154.817 15.2654 154.817 16.2541V28.86H150.697V16.4188C150.697 16.1442 150.491 15.8009 150.079 15.389C149.667 14.977 149.324 14.771 149.05 14.771H147.155C146.495 14.771 145.699 15.3066 144.765 16.3777V28.86H140.646V16.4188C140.646 16.1442 140.44 15.8009 140.028 15.389C139.616 14.977 139.272 14.771 138.998 14.771H137.02C136.334 14.771 135.524 15.3066 134.59 16.3777V28.86H130.47V14.7298L130.058 11.0634H134.054L134.301 12.1345C135.427 11.2831 136.293 10.8574 136.897 10.8574H139.369C140.357 10.8574 141.222 11.1321 141.964 11.6813C142.156 11.8187 142.568 12.2031 143.2 12.8348C144.903 11.5166 146.18 10.8574 147.031 10.8574H149.42C150.409 10.8574 151.274 11.1321 152.016 11.6813C152.757 12.2581 153.416 12.9172 153.993 13.6587Z'
                fill='#F1F1F1'
              />
              <path
                d='M125.873 21.8979H114.503V23.5457C114.503 23.8203 114.709 24.1636 115.121 24.5756C115.533 24.9876 115.877 25.1935 116.151 25.1935H120.436C120.518 25.1935 120.614 25.1661 120.724 25.1111C120.834 25.0288 120.944 24.9189 121.054 24.7816C121.191 24.6443 121.301 24.5207 121.383 24.4108C121.465 24.301 121.575 24.1636 121.713 23.9989C121.85 23.8066 121.946 23.6693 122.001 23.5869L125.832 24.7404C125.228 25.9213 124.445 26.9375 123.484 27.7889C122.523 28.6402 121.479 29.0659 120.353 29.0659H115.78C114.792 29.0659 113.927 28.7913 113.185 28.242C112.444 27.6653 111.784 27.0061 111.208 26.2646C110.658 25.5231 110.384 24.658 110.384 23.6693V16.2541C110.384 15.2654 110.658 14.4003 111.208 13.6587C111.784 12.9172 112.444 12.2581 113.185 11.6813C113.927 11.1321 114.792 10.8574 115.78 10.8574H120.477C121.465 10.8574 122.331 11.1321 123.072 11.6813C123.814 12.2581 124.473 12.9172 125.049 13.6587C125.599 14.4003 125.873 15.2654 125.873 16.2541V21.8979ZM116.151 14.7298C115.877 14.7298 115.533 14.9358 115.121 15.3478C114.709 15.7597 114.503 16.103 114.503 16.3777V18.3138H121.754V16.3777C121.754 16.103 121.548 15.7597 121.136 15.3478C120.724 14.9358 120.381 14.7298 120.106 14.7298H116.151Z'
                fill='#F1F1F1'
              />
              <path
                d='M107.093 14.9771H101.984V23.2986C101.984 23.5732 102.19 23.9165 102.602 24.3285C103.014 24.7405 103.358 24.9464 103.632 24.9464H106.434V28.86H103.261C102.273 28.86 101.408 28.5854 100.666 28.0361C99.9246 27.4594 99.2655 26.8002 98.6887 26.0587C98.1395 25.3172 97.8648 24.4521 97.8648 23.4634V14.9771H95.1047V11.0635H97.8648V4.22498H101.984V11.0635H107.093V14.9771Z'
                fill='#F1F1F1'
              />
              <path
                d='M82.008 29.0659C80.882 29.0659 79.8384 28.6402 78.8771 27.7889C77.9159 26.9375 77.1332 25.9213 76.529 24.7404L80.3602 23.5869C81.1841 24.6305 81.7196 25.1523 81.9668 25.1523H86.8691C87.1437 25.1523 87.487 24.9464 87.899 24.5344C88.3109 24.1224 88.5169 23.7792 88.5169 23.5045V22.7218C88.5169 22.3648 88.3247 22.1725 87.9402 22.1451L81.0193 21.4859C79.8658 21.3761 78.932 20.9641 78.218 20.25C77.5039 19.536 77.1469 18.5473 77.1469 17.284V16.2541C77.1469 15.2654 77.4215 14.4003 77.9708 13.6587C78.5476 12.9172 79.2067 12.2581 79.9482 11.6813C80.6897 11.1321 81.5548 10.8574 82.5435 10.8574H87.0339C88.1599 10.8574 89.2035 11.2831 90.1647 12.1345C91.126 12.9859 91.9087 14.002 92.5129 15.183L88.6817 16.3365C87.8578 15.2928 87.3222 14.771 87.0751 14.771H82.9143C82.6397 14.771 82.2964 14.977 81.8844 15.389C81.4724 15.8009 81.2665 16.1442 81.2665 16.4188V17.1192C81.2665 17.4213 81.4724 17.5998 81.8844 17.6547L88.5581 18.3962C89.7665 18.5336 90.7415 18.9592 91.483 19.6733C92.252 20.3599 92.6365 21.3486 92.6365 22.6394V23.6693C92.6365 24.658 92.3619 25.5231 91.8126 26.2646C91.2358 27.0061 90.5767 27.6653 89.8352 28.242C89.0937 28.7913 88.2285 29.0659 87.2399 29.0659H82.008Z'
                fill='#F1F1F1'
              />
              <path
                d='M71.0503 11.0634H75.417L66.6835 35.5336H62.5228L64.9945 28.8599H64.6238L58.156 11.0634H62.6876L66.8895 23.1749L71.0503 11.0634Z'
                fill='#F1F1F1'
              />
              <path
                d='M45.8008 29.0659C44.6748 29.0659 43.6312 28.6402 42.6699 27.7889C41.7087 26.9375 40.926 25.9213 40.3218 24.7404L44.153 23.5869C44.9769 24.6305 45.5124 25.1523 45.7596 25.1523H50.6619C50.9365 25.1523 51.2798 24.9464 51.6918 24.5344C52.1038 24.1224 52.3097 23.7792 52.3097 23.5045V22.7218C52.3097 22.3648 52.1175 22.1725 51.733 22.1451L44.8121 21.4859C43.6586 21.3761 42.7249 20.9641 42.0108 20.25C41.2967 19.536 40.9397 18.5473 40.9397 17.284V16.2541C40.9397 15.2654 41.2144 14.4003 41.7636 13.6587C42.3404 12.9172 42.9995 12.2581 43.741 11.6813C44.4825 11.1321 45.3477 10.8574 46.3364 10.8574H50.8267C51.9527 10.8574 52.9963 11.2831 53.9576 12.1345C54.9188 12.9859 55.7015 14.002 56.3057 15.183L52.4745 16.3365C51.6506 15.2928 51.1151 14.771 50.8679 14.771H46.7071C46.4325 14.771 46.0892 14.977 45.6772 15.389C45.2653 15.8009 45.0593 16.1442 45.0593 16.4188V17.1192C45.0593 17.4213 45.2653 17.5998 45.6772 17.6547L52.3509 18.3962C53.5593 18.5336 54.5343 18.9592 55.2758 19.6733C56.0448 20.3599 56.4293 21.3486 56.4293 22.6394V23.6693C56.4293 24.658 56.1547 25.5231 55.6054 26.2646C55.0287 27.0061 54.3695 27.6653 53.628 28.242C52.8865 28.7913 52.0214 29.0659 51.0327 29.0659H45.8008Z'
                fill='#F1F1F1'
              />
            </svg>
          </div>
        </>
      ) : (
        <></>
      )}

      <StyledDiv>
        <ul className='space-y-2 font-medium text-white'>
          {isOpen && (
            <li className={`${isOpen ? 'flex justify-end mr-2' : ''}`} onClick={toggleSidebar}>
              <a
                className={`cursor-pointer flex bitems-center  p-2 text-white-900 rounded-lg hover:bg-white-100 group max-sm:hidden sm:hidden md:flex`}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='32'
                  height='38'
                  viewBox='0 0 32 38'
                  fill='none'
                >
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M24.8697 15.4518L26.1305 16.7234L31.25 16.7279V15.1435L27.1238 10.982H6.38037L5.11958 9.71037V5.74145L6.38037 4.46985H25.9291L27.1899 5.74145H31.1741V4.16159L28.1832 0H4.12623L0 4.16159V11.2902L4.12623 15.4518H24.8697ZM24.8697 22.4649L26.1305 21.1933L31.25 21.1887V22.7731L27.1238 26.9347H6.38037L5.11958 28.2063V32.1752L6.38037 33.4468H25.9291L27.1899 32.1752H31.1741V33.7551L28.1832 37.9167H4.12623L0 33.7551V26.6264L4.12623 22.4649H24.8697Z'
                    fill='#EE7103'
                  />
                </svg>
              </a>
            </li>
          )}

          <li
            className={`${isOpen ? 'flex justify-end' : ''}`}
            onClick={() => activePageOne('overview')}
          >
            {isOpen && (
              <div
                className={`${act === 'overview' && `bg-[#ee7103] ]  rounded-lg `
                  } cursor-pointer px-2 py-2 mr-[6px]`}
                onClick={overviewnavigate}
              >
                <BootstrapTooltip title={'Dashboard'} placement='right'>
                  <svg
                    width='24'
                    height='24'
                    className={isOpen ? 'flex justify-start mr-2' : ''}
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8 17H16M11.0177 2.764L4.23539 8.03912C3.78202 8.39175 3.55534 8.56806 3.39203 8.78886C3.24737 8.98444 3.1396 9.20478 3.07403 9.43905C3 9.70352 3 9.9907 3 10.5651V17.8C3 18.9201 3 19.4801 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4801 21 18.9201 21 17.8V10.5651C21 9.9907 21 9.70352 20.926 9.43905C20.8604 9.20478 20.7526 8.98444 20.608 8.78886C20.4447 8.56806 20.218 8.39175 19.7646 8.03913L12.9823 2.764C12.631 2.49075 12.4553 2.35412 12.2613 2.3016C12.0902 2.25526 11.9098 2.25526 11.7387 2.3016C11.5447 2.35412 11.369 2.49075 11.0177 2.764Z'
                      stroke='white'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                </BootstrapTooltip>
              </div>
            )}
            {!isOpen && (
              <a
                onClick={overviewnavigate}
                className={`cursor-pointer flex bitems-center  p-2 text-white-900 rounded-lg hover:bg-white-100 group max-sm:hidden sm:hidden md:flex ${(act === 'overview' && pathname !== 'workbench') ||
                  (act === null && activePage != 'settings' && pathname !== 'workbench')
                  ? 'bg-[#ee7103]'
                  : ''
                  }`}
              >
                <svg
                  width='24'
                  height='24'
                  className={isOpen ? 'flex justify-start mr-2' : ''}
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M8 17H16M11.0177 2.764L4.23539 8.03912C3.78202 8.39175 3.55534 8.56806 3.39203 8.78886C3.24737 8.98444 3.1396 9.20478 3.07403 9.43905C3 9.70352 3 9.9907 3 10.5651V17.8C3 18.9201 3 19.4801 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4801 21 18.9201 21 17.8V10.5651C21 9.9907 21 9.70352 20.926 9.43905C20.8604 9.20478 20.7526 8.98444 20.608 8.78886C20.4447 8.56806 20.218 8.39175 19.7646 8.03913L12.9823 2.764C12.631 2.49075 12.4553 2.35412 12.2613 2.3016C12.0902 2.25526 11.9098 2.25526 11.7387 2.3016C11.5447 2.35412 11.369 2.49075 11.0177 2.764Z'
                    stroke='white'
                    stroke-width='2'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>

                <span className={`flex-1 ml-3 whitespace-nowrap ${isOpen ? 'hidden' : ''}`}>
                  <span>Dashboard</span>
                </span>
              </a>
            )}
          </li>
          <li className={`${isOpen ? 'flex justify-end' : ''}`}>
            <span onClick={() => activePageTwo('Chats')}>
              {isOpen && (
                <div
                  className={`${act === 'Chats' && `bg-[#ee7103] ]  rounded-lg `
                    } cursor-pointer px-2 py-2 mr-[6px]`}
                  onClick={() => toggleDropdown1()}
                >
                  <BootstrapTooltip title={'Workbench'} placement='right'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className={isOpen ? 'flex justify-start mr-2' : ''}
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                    >
                      <path
                        d='M10.7283 6.24669C10.8547 5.91777 11.3564 5.91777 11.4828 6.24669C12.0173 7.63791 13.0449 10.0573 14.0726 11.0715C15.1029 12.0884 17.4308 13.1053 18.7571 13.6317C19.081 13.7603 19.081 14.2398 18.7571 14.3684C17.4307 14.8948 15.1029 15.9117 14.0726 16.9284C13.0449 17.9427 12.0173 20.3622 11.4828 21.7534C11.3564 22.0822 10.8547 22.0822 10.7283 21.7534C10.1938 20.3622 9.16612 17.9427 8.1385 16.9284C7.11086 15.9142 4.65953 14.9 3.24996 14.3725C2.91668 14.2477 2.91668 13.7525 3.24994 13.6278C4.65951 13.1001 7.11086 12.0858 8.1385 11.0715C9.16612 10.0573 10.1938 7.63791 10.7283 6.24669Z'
                        stroke='white'
                        stroke-width='2'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                      <path
                        d='M18.6053 1.26998C18.7564 0.910008 19.3244 0.910008 19.4755 1.26998C19.7892 2.0179 20.2343 2.937 20.6792 3.37757C21.127 3.82085 22.0185 4.26414 22.7351 4.57508C23.0883 4.72832 23.0883 5.27176 22.7351 5.42499C22.0185 5.73589 21.127 6.17915 20.6792 6.62245C20.2343 7.063 19.7892 7.9821 19.4755 8.73002C19.3244 9.08999 18.7564 9.08999 18.6053 8.73002C18.2916 7.9821 17.8465 7.063 17.4016 6.62245C16.9565 6.18188 16.0281 5.74133 15.2726 5.43071C14.9091 5.28122 14.9091 4.71886 15.2726 4.56934C16.0281 4.25871 16.9565 3.81812 17.4016 3.37757C17.8465 2.937 18.2916 2.0179 18.6053 1.26998Z'
                        fill='white'
                      />
                      <path
                        d='M3.44869 3.33462C3.65565 2.88846 4.38218 2.88846 4.58914 3.33462C4.82411 3.84114 5.10743 4.35524 5.39073 4.63677C5.6778 4.92206 6.18282 5.20733 6.67303 5.44265C7.10899 5.65193 7.10899 6.34813 6.67303 6.55739C6.1828 6.79269 5.6778 7.07796 5.39073 7.36323C5.10743 7.64476 4.82411 8.15886 4.58914 8.66538C4.38218 9.11154 3.65565 9.11154 3.44869 8.66538C3.2137 8.15886 2.9304 7.64476 2.64709 7.36323C2.36379 7.0817 1.84645 6.80017 1.33674 6.56668C0.887768 6.36101 0.887748 5.63903 1.33672 5.43336C1.84643 5.19985 2.36379 4.9183 2.64709 4.63677C2.9304 4.35524 3.2137 3.84114 3.44869 3.33462Z'
                        fill='white'
                      />
                    </svg>
                  </BootstrapTooltip>
                </div>
              )}
              {!isOpen && (
                <button
                  onClick={() => toggleDropdown1()}
                  type='button'
                  className={`flex items-center  w-full p-2 text-base text-white-900 transition duration-75 rounded-lg group hover:bg-white-100  ${act === 'Chats' ? 'bg-[#ee7103]' : ''
                    }`}
                  aria-controls='dropdown-example'
                  data-collapse-toggle='dropdown-example'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <path
                      d='M10.7283 6.24669C10.8547 5.91777 11.3564 5.91777 11.4828 6.24669C12.0173 7.63791 13.0449 10.0573 14.0726 11.0715C15.1029 12.0884 17.4308 13.1053 18.7571 13.6317C19.081 13.7603 19.081 14.2398 18.7571 14.3684C17.4307 14.8948 15.1029 15.9117 14.0726 16.9284C13.0449 17.9427 12.0173 20.3622 11.4828 21.7534C11.3564 22.0822 10.8547 22.0822 10.7283 21.7534C10.1938 20.3622 9.16612 17.9427 8.1385 16.9284C7.11086 15.9142 4.65953 14.9 3.24996 14.3725C2.91668 14.2477 2.91668 13.7525 3.24994 13.6278C4.65951 13.1001 7.11086 12.0858 8.1385 11.0715C9.16612 10.0573 10.1938 7.63791 10.7283 6.24669Z'
                      stroke='white'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                    <path
                      d='M18.6053 1.26998C18.7564 0.910008 19.3244 0.910008 19.4755 1.26998C19.7892 2.0179 20.2343 2.937 20.6792 3.37757C21.127 3.82085 22.0185 4.26414 22.7351 4.57508C23.0883 4.72832 23.0883 5.27176 22.7351 5.42499C22.0185 5.73589 21.127 6.17915 20.6792 6.62245C20.2343 7.063 19.7892 7.9821 19.4755 8.73002C19.3244 9.08999 18.7564 9.08999 18.6053 8.73002C18.2916 7.9821 17.8465 7.063 17.4016 6.62245C16.9565 6.18188 16.0281 5.74133 15.2726 5.43071C14.9091 5.28122 14.9091 4.71886 15.2726 4.56934C16.0281 4.25871 16.9565 3.81812 17.4016 3.37757C17.8465 2.937 18.2916 2.0179 18.6053 1.26998Z'
                      fill='white'
                    />
                    <path
                      d='M3.44869 3.33462C3.65565 2.88846 4.38218 2.88846 4.58914 3.33462C4.82411 3.84114 5.10743 4.35524 5.39073 4.63677C5.6778 4.92206 6.18282 5.20733 6.67303 5.44265C7.10899 5.65193 7.10899 6.34813 6.67303 6.55739C6.1828 6.79269 5.6778 7.07796 5.39073 7.36323C5.10743 7.64476 4.82411 8.15886 4.58914 8.66538C4.38218 9.11154 3.65565 9.11154 3.44869 8.66538C3.2137 8.15886 2.9304 7.64476 2.64709 7.36323C2.36379 7.0817 1.84645 6.80017 1.33674 6.56668C0.887768 6.36101 0.887748 5.63903 1.33672 5.43336C1.84643 5.19985 2.36379 4.9183 2.64709 4.63677C2.9304 4.35524 3.2137 3.84114 3.44869 3.33462Z'
                      fill='white'
                    />
                  </svg>

                  <span
                    className={`flex-1 ml-2.5 text-left whitespace-nowrap ${isOpen ? 'hidden' : ''
                      }`}
                  >
                    <span>Workbench</span>
                  </span>
                  {subMenuList ? (
                    <>
                      <svg
                        className={`w-3 h-3 ${isOpen ? 'hidden' : ''} rotate-90`}
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 10 6'
                      >
                        <path
                          stroke='currentColor'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='m1 1 4 4 4-4'
                        />
                      </svg>
                    </>
                  ) : (
                    <>
                      <svg
                        className={`w-3 h-3 ${isOpen ? 'hidden' : ''}`}
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 8 14'
                      >
                        <path
                          stroke='currentColor'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1'
                        />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </span>
          </li>

          <li className={`${isOpen ? 'flex justify-end' : ''}`}>
            <span onClick={() => activePagesource('sources')}>
              {isOpen && (
                <div
                  className={`${act === 'sources' && `bg-[#ee7103] ]  rounded-lg `
                    } cursor-pointer px-2 py-2 mr-[6px]`}
                >
                  <BootstrapTooltip title={'Sources'} placement='right'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className={isOpen ? 'flex justify-center mr-2' : ''}
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                    >
                      <path
                        d='M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803C22 9.27976 22 10.1198 22 11.8V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7Z'
                        stroke='white'
                        stroke-width='2'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </svg>
                  </BootstrapTooltip>
                </div>
              )}
              {!isOpen && (
                <button
                  type='button'
                  className={`flex items-center  w-full p-2 text-base text-white-900 transition duration-75 rounded-lg group hover:bg-white-100  ${act === 'sources' ? 'bg-[#ee7103]' : ''
                    }`}
                  aria-controls='dropdown-example'
                  data-collapse-toggle='dropdown-example'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className={isOpen ? 'flex justify-start mr-2' : ''}
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <path
                      d='M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803C22 9.27976 22 10.1198 22 11.8V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7Z'
                      stroke='white'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>

                  <span
                    className={`flex-1 ml-3 text-left whitespace-nowrap ${isOpen ? 'hidden' : ''}`}
                  >
                    <span>Sources</span>
                  </span>
                </button>
              )}
            </span>
          </li>

          <li className={`${isOpen ? 'flex justify-end ' : ''}`}>
            <span onClick={() => activePageThree('newCtiArcheive')}>
              {isOpen && (
                <div
                  className={`${act === 'newCtiArcheive' && `bg-[#ee7103] ]  rounded-lg `
                    } cursor-pointer px-2 py-2 mr-[6px]`}
                  onClick={overviewnavigate}
                >
                  <BootstrapTooltip title={'Detection Library'} placement='right'>
                    <svg
                      width='24'
                      height='24'
                      className={isOpen ? 'flex justify-start mr-2' : ''}
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M14 2.26953V6.40007C14 6.96012 14 7.24015 14.109 7.45406C14.2049 7.64222 14.3578 7.7952 14.546 7.89108C14.7599 8.00007 15.0399 8.00007 15.6 8.00007H19.7305M14 17.5L16.5 15L14 12.5M10 12.5L7.5 15L10 17.5M20 9.98822V17.2C20 18.8802 20 19.7202 19.673 20.362C19.3854 20.9265 18.9265 21.3854 18.362 21.673C17.7202 22 16.8802 22 15.2 22H8.8C7.11984 22 6.27976 22 5.63803 21.673C5.07354 21.3854 4.6146 20.9265 4.32698 20.362C4 19.7202 4 18.8802 4 17.2V6.8C4 5.11984 4 4.27976 4.32698 3.63803C4.6146 3.07354 5.07354 2.6146 5.63803 2.32698C6.27976 2 7.11984 2 8.8 2H12.0118C12.7455 2 13.1124 2 13.4577 2.08289C13.7638 2.15638 14.0564 2.27759 14.3249 2.44208C14.6276 2.6276 14.887 2.88703 15.4059 3.40589L18.5941 6.59411C19.113 7.11297 19.3724 7.3724 19.5579 7.67515C19.7224 7.94356 19.8436 8.2362 19.9171 8.5423C20 8.88757 20 9.25445 20 9.98822Z'
                        stroke='white'
                        stroke-width='2'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </svg>
                  </BootstrapTooltip>
                </div>
              )}
              {!isOpen && (
                <button
                  type='button'
                  className={`flex items-center w-full  p-2 text-base text-white-900 transition duration-75 rounded-lg group hover:bg-white-100  ${act === 'newCtiArcheive' ? 'bg-[#ee7103] ' : ' w-full'
                    }`}
                  aria-controls='dropdown-example'
                  data-collapse-toggle='dropdown-example'
                >
                  <svg
                    width='24'
                    height='24'
                    className={isOpen ? 'flex justify-start mr-2' : ''}
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M14 2.26953V6.40007C14 6.96012 14 7.24015 14.109 7.45406C14.2049 7.64222 14.3578 7.7952 14.546 7.89108C14.7599 8.00007 15.0399 8.00007 15.6 8.00007H19.7305M14 17.5L16.5 15L14 12.5M10 12.5L7.5 15L10 17.5M20 9.98822V17.2C20 18.8802 20 19.7202 19.673 20.362C19.3854 20.9265 18.9265 21.3854 18.362 21.673C17.7202 22 16.8802 22 15.2 22H8.8C7.11984 22 6.27976 22 5.63803 21.673C5.07354 21.3854 4.6146 20.9265 4.32698 20.362C4 19.7202 4 18.8802 4 17.2V6.8C4 5.11984 4 4.27976 4.32698 3.63803C4.6146 3.07354 5.07354 2.6146 5.63803 2.32698C6.27976 2 7.11984 2 8.8 2H12.0118C12.7455 2 13.1124 2 13.4577 2.08289C13.7638 2.15638 14.0564 2.27759 14.3249 2.44208C14.6276 2.6276 14.887 2.88703 15.4059 3.40589L18.5941 6.59411C19.113 7.11297 19.3724 7.3724 19.5579 7.67515C19.7224 7.94356 19.8436 8.2362 19.9171 8.5423C20 8.88757 20 9.25445 20 9.98822Z'
                      stroke='white'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>

                  <span
                    className={`flex-1 ml-3 text-left whitespace-nowrap ${isOpen ? 'hidden' : ''}`}
                  >
                    <span>Detection Library</span>
                  </span>
                </button>
              )}
            </span>
          </li>

          {/* ****************************************************************** */}
          {(getroleName?.roleName == 'SUPER_ADMIN' || getroleName?.roleName == 'ACCOUNT_ADMIN') && (
            <>
              <li className={` ${isOpen ? 'flex justify-end' : ''}`}>
                <span onClick={() => activePageFour('adminControl')}>
                  {isOpen && (
                    <div
                      className={`${act === 'adminControl' && `bg-[#ee7103] ]  rounded-lg `
                        } cursor-pointer px-2 py-2 mr-[6px]`}
                      onClick={toggleAdminDropdown}
                    >
                      <BootstrapTooltip title={'Admin Control'} placement='right'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='flex-shrink-0  mr-2 text-white-500 transition duration-75 group-hover:text-white-900'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                          onClick={toggleAdminDropdown}
                        >
                          <path
                            d='M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z'
                            stroke='white'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </BootstrapTooltip>
                    </div>
                  )}
                  {!isOpen && (
                    <button
                      onClick={toggleAdminDropdown}
                      type='button'
                      className={`flex items-center w-full p-2 text-base text-white-900 transition duration-75 rounded-lg group hover:bg-white-100  ${act === 'adminControl' ? 'bg-[#ee7103]' : ''
                        }`}
                      aria-controls='dropdown-example'
                      data-collapse-toggle='dropdown-example'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='flex-shrink-0 w-5 h-5 mr-2 text-white-500 transition duration-75 group-hover:text-white-900'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        onClick={toggleAdminDropdown}
                      >
                        <path
                          d='M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z'
                          stroke='white'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>

                      <span
                        className={`flex-1 ml-3 text-left whitespace-nowrap ${isOpen ? 'hidden' : ''
                          }`}
                      >
                        <span>Admin Control</span>
                      </span>
                      <span className={`${isOpen ? 'hidden' : ''}`}>
                        {isAdminOpen ? (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='14'
                            height='2'
                            viewBox='0 0 14 2'
                            fill='none'
                          >
                            <path
                              d='M1.16675 1H12.8334'
                              stroke='white'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='14'
                            height='14'
                            viewBox='0 0 14 14'
                            fill='none'
                          >
                            <path
                              d='M7.00008 1.16663V12.8333M1.16675 6.99996H12.8334'
                              stroke='white'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        )}
                      </span>
                    </button>
                  )}
                </span>
                {isAdminOpen && (
                  <ul id='dropdown-example' className='py-2 space-y-2'>
                    <span onClick={() => activePageFour2('companyprofile')}>
                      <li>
                        <a
                          onClick={companyProfilenavigate}
                          className={`flex items-center w-full p-2 text-white-900 transition duration-75 rounded-lg pl-6 group hover:bg-white-100  cursor-pointer ${act === 'companyprofile' ? 'bg-[#EE7103]' : ''
                            } ${isOpen ? 'hidden' : ''}`}
                        >
                          <div>
                            <svg
                              width='24'
                              height='24'
                              viewBox='0 0 24 24'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                              onClick={isOpen ? companyProfilenavigate : toggleAdminDropdown}
                            >
                              <path
                                d='M7.5 11H4.6C4.03995 11 3.75992 11 3.54601 11.109C3.35785 11.2049 3.20487 11.3578 3.10899 11.546C3 11.7599 3 12.0399 3 12.6V21M16.5 11H19.4C19.9601 11 20.2401 11 20.454 11.109C20.6422 11.2049 20.7951 11.3578 20.891 11.546C21 11.7599 21 12.0399 21 12.6V21M16.5 21V6.2C16.5 5.0799 16.5 4.51984 16.282 4.09202C16.0903 3.71569 15.7843 3.40973 15.408 3.21799C14.9802 3 14.4201 3 13.3 3H10.7C9.57989 3 9.01984 3 8.59202 3.21799C8.21569 3.40973 7.90973 3.71569 7.71799 4.09202C7.5 4.51984 7.5 5.0799 7.5 6.2V21M22 21H2M11 7H13M11 11H13M11 15H13'
                                stroke='white'
                                stroke-width='2'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                              />
                            </svg>
                          </div>
                          <span className={`pl-2  ${isOpen ? 'hidden' : ''}`}>
                            <span>Company Profile</span>
                          </span>
                        </a>
                      </li>
                    </span>
                    <span onClick={() => activePageFour2('users')}>
                      <li>
                        <a
                          onClick={usernavigate}
                          className={`flex items-center w-full p-2 text-white-900 transition duration-75 rounded-lg pl-6 group hover:bg-white-100  cursor-pointer ${act === 'users' ? 'bg-[#ee7103]' : ''
                            } ${isOpen ? 'hidden' : ''}`}
                        >
                          <div>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='24'
                              height='24'
                              viewBox='0 0 24 24'
                              fill='none'
                            >
                              <path
                                d='M22 21V19C22 17.1362 20.7252 15.5701 19 15.126M15.5 3.29076C16.9659 3.88415 18 5.32131 18 7C18 8.67869 16.9659 10.1159 15.5 10.7092M17 21C17 19.1362 17 18.2044 16.6955 17.4693C16.2895 16.4892 15.5108 15.7105 14.5307 15.3045C13.7956 15 12.8638 15 11 15H8C6.13623 15 5.20435 15 4.46927 15.3045C3.48915 15.7105 2.71046 16.4892 2.30448 17.4693C2 18.2044 2 19.1362 2 21M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z'
                                stroke='white'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                onClick={isOpen ? usernavigate : toggleAdminDropdown}
                              />
                            </svg>
                          </div>
                          <span className={`pl-2  ${isOpen ? 'hidden' : ''}`}>
                            <span>Users</span>
                          </span>
                        </a>
                      </li>
                    </span>
                    <span onClick={() => activePageFour('feedyintegration')}>
                      <li>
                        <a
                          onClick={feedyintergrationNavigate}
                          className={`flex items-center w-full p-2 text-white-900 transition duration-75 rounded-lg pl-6 group hover:bg-white-100 cursor-pointer ${act === 'feedyintegration' ? 'bg-[#ee7103]' : ''
                            } ${isOpen ? 'hidden' : ''}`}
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                          >
                            <path
                              d='M21.2 22C21.48 22 21.62 22 21.727 21.9455C21.8211 21.8976 21.8976 21.8211 21.9455 21.727C22 21.62 22 21.48 22 21.2V10.8C22 10.52 22 10.38 21.9455 10.273C21.8976 10.1789 21.8211 10.1024 21.727 10.0545C21.62 10 21.48 10 21.2 10L18.8 10C18.52 10 18.38 10 18.273 10.0545C18.1789 10.1024 18.1024 10.1789 18.0545 10.273C18 10.38 18 10.52 18 10.8V13.2C18 13.48 18 13.62 17.9455 13.727C17.8976 13.8211 17.8211 13.8976 17.727 13.9455C17.62 14 17.48 14 17.2 14H14.8C14.52 14 14.38 14 14.273 14.0545C14.1789 14.1024 14.1024 14.1789 14.0545 14.273C14 14.38 14 14.52 14 14.8V17.2C14 17.48 14 17.62 13.9455 17.727C13.8976 17.8211 13.8211 17.8976 13.727 17.9455C13.62 18 13.48 18 13.2 18H10.8C10.52 18 10.38 18 10.273 18.0545C10.1789 18.1024 10.1024 18.1789 10.0545 18.273C10 18.38 10 18.52 10 18.8V21.2C10 21.48 10 21.62 10.0545 21.727C10.1024 21.8211 10.1789 21.8976 10.273 21.9455C10.38 22 10.52 22 10.8 22L21.2 22Z'
                              stroke='white'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M10 6.8C10 6.51997 10 6.37996 10.0545 6.273C10.1024 6.17892 10.1789 6.10243 10.273 6.0545C10.38 6 10.52 6 10.8 6H13.2C13.48 6 13.62 6 13.727 6.0545C13.8211 6.10243 13.8976 6.17892 13.9455 6.273C14 6.37996 14 6.51997 14 6.8V9.2C14 9.48003 14 9.62004 13.9455 9.727C13.8976 9.82108 13.8211 9.89757 13.727 9.9455C13.62 10 13.48 10 13.2 10H10.8C10.52 10 10.38 10 10.273 9.9455C10.1789 9.89757 10.1024 9.82108 10.0545 9.727C10 9.62004 10 9.48003 10 9.2V6.8Z'
                              stroke='white'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M3 12.8C3 12.52 3 12.38 3.0545 12.273C3.10243 12.1789 3.17892 12.1024 3.273 12.0545C3.37996 12 3.51997 12 3.8 12H6.2C6.48003 12 6.62004 12 6.727 12.0545C6.82108 12.1024 6.89757 12.1789 6.9455 12.273C7 12.38 7 12.52 7 12.8V15.2C7 15.48 7 15.62 6.9455 15.727C6.89757 15.8211 6.82108 15.8976 6.727 15.9455C6.62004 16 6.48003 16 6.2 16H3.8C3.51997 16 3.37996 16 3.273 15.9455C3.17892 15.8976 3.10243 15.8211 3.0545 15.727C3 15.62 3 15.48 3 15.2V12.8Z'
                              stroke='white'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M2 2.8C2 2.51997 2 2.37996 2.0545 2.273C2.10243 2.17892 2.17892 2.10243 2.273 2.0545C2.37996 2 2.51997 2 2.8 2H5.2C5.48003 2 5.62004 2 5.727 2.0545C5.82108 2.10243 5.89757 2.17892 5.9455 2.273C6 2.37996 6 2.51997 6 2.8V5.2C6 5.48003 6 5.62004 5.9455 5.727C5.89757 5.82108 5.82108 5.89757 5.727 5.9455C5.62004 6 5.48003 6 5.2 6H2.8C2.51997 6 2.37996 6 2.273 5.9455C2.17892 5.89757 2.10243 5.82108 2.0545 5.727C2 5.62004 2 5.48003 2 5.2V2.8Z'
                              stroke='white'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>

                          <span className='pl-2'>
                            <span>Integration</span>
                          </span>
                        </a>
                      </li>
                    </span>
                  </ul>
                )}
              </li>
              {isAdminOpen && (
                <>
                  <li
                    className={`${isOpen ? 'flex justify-end ' : 'hidden'}`}
                    onClick={() => activePageFour2('companyprofile')}
                  >
                    <div
                      className={`${act === 'companyprofile' && `bg-[#ee7103] ]  rounded-lg `
                        } cursor-pointer px-2 py-2 mr-[6px]`}
                      onClick={companyProfilenavigate}
                    >
                      <BootstrapTooltip title={'Company Profile'} placement='right'>
                        <svg
                          className={isOpen ? 'flex justify-start mr-2' : ''}
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                          onClick={isOpen ? companyProfilenavigate : toggleAdminDropdown}
                        >
                          <path
                            d='M7.5 11H4.6C4.03995 11 3.75992 11 3.54601 11.109C3.35785 11.2049 3.20487 11.3578 3.10899 11.546C3 11.7599 3 12.0399 3 12.6V21M16.5 11H19.4C19.9601 11 20.2401 11 20.454 11.109C20.6422 11.2049 20.7951 11.3578 20.891 11.546C21 11.7599 21 12.0399 21 12.6V21M16.5 21V6.2C16.5 5.0799 16.5 4.51984 16.282 4.09202C16.0903 3.71569 15.7843 3.40973 15.408 3.21799C14.9802 3 14.4201 3 13.3 3H10.7C9.57989 3 9.01984 3 8.59202 3.21799C8.21569 3.40973 7.90973 3.71569 7.71799 4.09202C7.5 4.51984 7.5 5.0799 7.5 6.2V21M22 21H2M11 7H13M11 11H13M11 15H13'
                            stroke='white'
                            stroke-width='2'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                        </svg>
                      </BootstrapTooltip>
                    </div>
                  </li>
                  <li
                    className={`${isOpen ? 'flex justify-end' : 'hidden'}`}
                    onClick={() => activePageFour2('users')}
                  >
                    <div
                      className={`${act === 'users' && `bg-[#ee7103] ]  rounded-lg `
                        } cursor-pointer px-2 py-2 mr-[6px]`}
                      onClick={usernavigate}
                    >
                      <BootstrapTooltip title={'Users'} placement='right'>
                        <svg
                          className={isOpen ? 'flex justify-start mr-2' : ''}
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                        >
                          <path
                            d='M22 21V19C22 17.1362 20.7252 15.5701 19 15.126M15.5 3.29076C16.9659 3.88415 18 5.32131 18 7C18 8.67869 16.9659 10.1159 15.5 10.7092M17 21C17 19.1362 17 18.2044 16.6955 17.4693C16.2895 16.4892 15.5108 15.7105 14.5307 15.3045C13.7956 15 12.8638 15 11 15H8C6.13623 15 5.20435 15 4.46927 15.3045C3.48915 15.7105 2.71046 16.4892 2.30448 17.4693C2 18.2044 2 19.1362 2 21M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z'
                            stroke='white'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            onClick={() => activePageFour2('users')}
                          />
                        </svg>
                      </BootstrapTooltip>
                    </div>
                  </li>
                  <li
                    className={`${isOpen ? 'flex justify-end ' : 'hidden'}`}
                    onClick={() => activePageFour('feedyintegration')}
                  >
                    <div
                      className={`${act === 'feedyintegration' && `bg-[#ee7103] ]  rounded-lg `
                        } cursor-pointer px-2 py-2 mr-[6px]`}
                      onClick={feedyintergrationNavigate}
                    >
                      <BootstrapTooltip title={'Integrations'} placement='right'>
                        <svg
                          className={isOpen ? 'flex justify-start mr-2' : ''}
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                        >
                          <path
                            d='M21.2 22C21.48 22 21.62 22 21.727 21.9455C21.8211 21.8976 21.8976 21.8211 21.9455 21.727C22 21.62 22 21.48 22 21.2V10.8C22 10.52 22 10.38 21.9455 10.273C21.8976 10.1789 21.8211 10.1024 21.727 10.0545C21.62 10 21.48 10 21.2 10L18.8 10C18.52 10 18.38 10 18.273 10.0545C18.1789 10.1024 18.1024 10.1789 18.0545 10.273C18 10.38 18 10.52 18 10.8V13.2C18 13.48 18 13.62 17.9455 13.727C17.8976 13.8211 17.8211 13.8976 17.727 13.9455C17.62 14 17.48 14 17.2 14H14.8C14.52 14 14.38 14 14.273 14.0545C14.1789 14.1024 14.1024 14.1789 14.0545 14.273C14 14.38 14 14.52 14 14.8V17.2C14 17.48 14 17.62 13.9455 17.727C13.8976 17.8211 13.8211 17.8976 13.727 17.9455C13.62 18 13.48 18 13.2 18H10.8C10.52 18 10.38 18 10.273 18.0545C10.1789 18.1024 10.1024 18.1789 10.0545 18.273C10 18.38 10 18.52 10 18.8V21.2C10 21.48 10 21.62 10.0545 21.727C10.1024 21.8211 10.1789 21.8976 10.273 21.9455C10.38 22 10.52 22 10.8 22L21.2 22Z'
                            stroke='white'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M10 6.8C10 6.51997 10 6.37996 10.0545 6.273C10.1024 6.17892 10.1789 6.10243 10.273 6.0545C10.38 6 10.52 6 10.8 6H13.2C13.48 6 13.62 6 13.727 6.0545C13.8211 6.10243 13.8976 6.17892 13.9455 6.273C14 6.37996 14 6.51997 14 6.8V9.2C14 9.48003 14 9.62004 13.9455 9.727C13.8976 9.82108 13.8211 9.89757 13.727 9.9455C13.62 10 13.48 10 13.2 10H10.8C10.52 10 10.38 10 10.273 9.9455C10.1789 9.89757 10.1024 9.82108 10.0545 9.727C10 9.62004 10 9.48003 10 9.2V6.8Z'
                            stroke='white'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M3 12.8C3 12.52 3 12.38 3.0545 12.273C3.10243 12.1789 3.17892 12.1024 3.273 12.0545C3.37996 12 3.51997 12 3.8 12H6.2C6.48003 12 6.62004 12 6.727 12.0545C6.82108 12.1024 6.89757 12.1789 6.9455 12.273C7 12.38 7 12.52 7 12.8V15.2C7 15.48 7 15.62 6.9455 15.727C6.89757 15.8211 6.82108 15.8976 6.727 15.9455C6.62004 16 6.48003 16 6.2 16H3.8C3.51997 16 3.37996 16 3.273 15.9455C3.17892 15.8976 3.10243 15.8211 3.0545 15.727C3 15.62 3 15.48 3 15.2V12.8Z'
                            stroke='white'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M2 2.8C2 2.51997 2 2.37996 2.0545 2.273C2.10243 2.17892 2.17892 2.10243 2.273 2.0545C2.37996 2 2.51997 2 2.8 2H5.2C5.48003 2 5.62004 2 5.727 2.0545C5.82108 2.10243 5.89757 2.17892 5.9455 2.273C6 2.37996 6 2.51997 6 2.8V5.2C6 5.48003 6 5.62004 5.9455 5.727C5.89757 5.82108 5.82108 5.89757 5.727 5.9455C5.62004 6 5.48003 6 5.2 6H2.8C2.51997 6 2.37996 6 2.273 5.9455C2.17892 5.89757 2.10243 5.82108 2.0545 5.727C2 5.62004 2 5.48003 2 5.2V2.8Z'
                            stroke='white'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </BootstrapTooltip>
                    </div>
                  </li>
                </>
              )}
            </>
          )}
        </ul>
      </StyledDiv>

      <div className=' div-content absolute bottom-0 w-full mr-4 bg-[#1D2939]'>
        <ul className='space-y-2 font-medium text-white'>
          {!isOpen ? (
            <li className={`${isOpen ? 'flex justify-end mr-2' : ''}`}>
              <a
                onClick={handleopenNotification}
                className={`cursor-pointer flex items-center p-2 text-white-900 rounded-lg hover:bg-white-100 group max-sm:hidden sm:hidden md:flex `}
              >
                {isOpen ? (
                  <BootstrapTooltip title={'Notification'} placement='right'>
                    <Badge badgeContent={notificationmessages?.length} color='error'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                      >
                        <path
                          d='M9.35419 21C10.0593 21.6224 10.9856 22 12 22C13.0145 22 13.9407 21.6224 14.6458 21M18 8C18 6.4087 17.3679 4.88258 16.2427 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.8826 2.63214 7.75738 3.75736C6.63216 4.88258 6.00002 6.4087 6.00002 8C6.00002 11.0902 5.22049 13.206 4.34968 14.6054C3.61515 15.7859 3.24788 16.3761 3.26134 16.5408C3.27626 16.7231 3.31488 16.7926 3.46179 16.9016C3.59448 17 4.19261 17 5.38887 17H18.6112C19.8074 17 20.4056 17 20.5382 16.9016C20.6852 16.7926 20.7238 16.7231 20.7387 16.5408C20.7522 16.3761 20.3849 15.7859 19.6504 14.6054C18.7795 13.206 18 11.0902 18 8Z'
                          stroke='white'
                          stroke-width='2'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                      </svg>
                    </Badge>
                  </BootstrapTooltip>
                ) : (
                  <Badge badgeContent={notificationmessages?.length} color='error'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                    >
                      <path
                        d='M9.35419 21C10.0593 21.6224 10.9856 22 12 22C13.0145 22 13.9407 21.6224 14.6458 21M18 8C18 6.4087 17.3679 4.88258 16.2427 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.8826 2.63214 7.75738 3.75736C6.63216 4.88258 6.00002 6.4087 6.00002 8C6.00002 11.0902 5.22049 13.206 4.34968 14.6054C3.61515 15.7859 3.24788 16.3761 3.26134 16.5408C3.27626 16.7231 3.31488 16.7926 3.46179 16.9016C3.59448 17 4.19261 17 5.38887 17H18.6112C19.8074 17 20.4056 17 20.5382 16.9016C20.6852 16.7926 20.7238 16.7231 20.7387 16.5408C20.7522 16.3761 20.3849 15.7859 19.6504 14.6054C18.7795 13.206 18 11.0902 18 8Z'
                        stroke='white'
                        stroke-width='2'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </svg>
                  </Badge>
                )}
                <span className={`flex-1 ml-3 whitespace-nowrap ${isOpen ? 'hidden' : ''}`}>
                  <span>Notification</span>
                </span>
              </a>
            </li>
          ) : (
            <li className={`${isOpen ? 'flex justify-end ' : ''}`}>
              <span onClick={() => handleopenNotification()}>
                {isOpen && (
                  <div className='px-2 py-2 mr-[6px]   cursor-pointer'>
                    <BootstrapTooltip title={'Notification'} placement='right'>
                      <Badge badgeContent={notificationmessages?.length} color='error'>
                        <svg
                          className={isOpen ? 'flex justify-start mr-2' : ''}
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                        >
                          <path
                            d='M9.35419 21C10.0593 21.6224 10.9856 22 12 22C13.0145 22 13.9407 21.6224 14.6458 21M18 8C18 6.4087 17.3679 4.88258 16.2427 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.8826 2.63214 7.75738 3.75736C6.63216 4.88258 6.00002 6.4087 6.00002 8C6.00002 11.0902 5.22049 13.206 4.34968 14.6054C3.61515 15.7859 3.24788 16.3761 3.26134 16.5408C3.27626 16.7231 3.31488 16.7926 3.46179 16.9016C3.59448 17 4.19261 17 5.38887 17H18.6112C19.8074 17 20.4056 17 20.5382 16.9016C20.6852 16.7926 20.7238 16.7231 20.7387 16.5408C20.7522 16.3761 20.3849 15.7859 19.6504 14.6054C18.7795 13.206 18 11.0902 18 8Z'
                            stroke='white'
                            stroke-width='2'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                        </svg>
                      </Badge>
                    </BootstrapTooltip>
                  </div>
                )}
              </span>
            </li>
          )}

          {!isOpen ? (
            <li className={`${isOpen ? 'flex justify-end' : ''}`}>
              <a
                onClick={supportavigate}
                className={`cursor-pointer flex items-center p-2 text-white-900 rounded-lg hover:bg-white-100 group max-sm:hidden sm:hidden md:flex ${act === 'support' ? 'bg-[#ee7103]' : ''
                  }`}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='flex-shrink-0 w-5 h-5  mr-2 text-white-500 transition duration-75 group-hover:text-white-900'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <path
                    d='M9.13626 9.13628L4.92893 4.92896M4.92893 19.0711L9.16797 14.8321M14.8611 14.8638L19.0684 19.0711M19.0684 4.92896L14.8287 9.16862M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z'
                    stroke='white'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>

                <span className={`flex-1 ml-3 whitespace-nowrap ${isOpen ? 'hidden' : ''}`}>
                  <span>Support</span>
                </span>
              </a>
            </li>
          ) : (
            <li className={`${isOpen ? 'flex justify-end ' : ''}`}>
              <span onClick={() => supportavigate()}>
                <div
                  className={`${act === 'support' ? `bg-[#ee7103] rounded-lg ` : ''
                    }  px-2 py-2 mr-[6px]  cursor-pointer`}
                >
                  <BootstrapTooltip title={'Support'} placement='right'>
                    <svg
                      className={'flex justify-start mr-2'}
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                    >
                      <path
                        d='M9.13626 9.13628L4.92893 4.92896M4.92893 19.0711L9.16797 14.8321M14.8611 14.8638L19.0684 19.0711M19.0684 4.92896L14.8287 9.16862M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z'
                        stroke='white'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </BootstrapTooltip>
                </div>
              </span>
            </li>
          )}

          {!isOpen ? (
            <hr className='w-64 h-px my-1 bg-gray-200 border-0 '></hr>
          ) : (
            <hr className='w-10 h-px ml-[215px] my-1 bg-gray-200 border-0 flex justify-end'></hr>
          )}

          {!isOpen ? (
            <li className={`${isOpen ? 'flex justify-end' : ''}`}>
              <a className='flex items-center p-2 text-white-900 rounded-lg hover:bg-white-100 group'>
                <img
                  onClick={settingsnavigate}
                  className='w-9 h-9 rounded-full'
                  src={
                    img !== '/avatar.webp'
                      ? img
                      : userImage
                        ? `data:image/jpeg;base64,${userImage}`
                        : induserDetail?.photo
                          ? `data:image/jpeg;base64,${induserDetail?.photo}`
                          : img
                  }
                  alt='Rounded Avatar'
                />
                <ul className={`${isOpen ? 'hidden' : ''}`} onClick={settingsnavigate}>
                  <li className='w-20 ml-3 text-xs cursor-default cursor-pointer truncate'>
                    {firstName ? firstName : induserDetail?.firstName}{' '}
                    {lastName ? lastName : induserDetail?.lastName}
                  </li>

                  <li className='w-36 ml-3 text-xs cursor-default cursor-pointer truncate'>
                    {induserDetail?.email}
                  </li>
                </ul>
                <div
                  className={`fixed -mt-1 ml-[220px] cursor-pointer ${isOpen ? 'hidden' : ''}`}
                  onClick={signoutHandler}
                >
                  <BootstrapTooltip title={'Log Out'} placement='right'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='flex-shrink-1 text-white-500 transition duration-75 group-hover:text-white-900'
                      width='20'
                      height='20'
                      viewBox='0 0 20 20'
                      fill='none'
                    >
                      <path
                        d='M13.3333 14.1667L17.5 10M17.5 10L13.3333 5.83333M17.5 10H7.5M7.5 2.5H6.5C5.09987 2.5 4.3998 2.5 3.86502 2.77248C3.39462 3.01217 3.01217 3.39462 2.77248 3.86502C2.5 4.3998 2.5 5.09987 2.5 6.5V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5H7.5'
                        stroke='white'
                        strokeWidth='1.66667'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </BootstrapTooltip>
                </div>
              </a>
            </li>
          ) : (
            <li className={`${isOpen ? 'flex justify-end ' : ''}`}>
              <span className=''>
                <img
                  onClick={settingsnavigate}
                  className='w-9 h-9 rounded-full mr-4'
                  src={
                    img !== '/avatar.webp'
                      ? img
                      : userImage
                        ? `data:image/jpeg;base64,${userImage}`
                        : induserDetail?.photo
                          ? `data:image/jpeg;base64,${induserDetail?.photo}`
                          : img
                  }
                  alt='Rounded Avatar'
                />
              </span>
            </li>
          )}
        </ul>
      </div>
      <div
        className='absolute right-[-12px] top-4 flex flex-row gap-2 items-center justify-center flex-shrink-0 w-6 h-8 rounded-xl bg-[#1d2939] border border-[#3e4b5d] overflow-hidden cursor-pointer'
        onClick={() => {
          toggleSidebar(), toggleDropdown(), setsubMenuList(false)
        }}
      >
        {!isOpen ? (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
          >
            <path
              d='M15 18L9 12L15 6'
              stroke='white'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
            />
          </svg>
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
          >
            <path
              d='M9 18L15 12L9 6'
              stroke='white'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
            />
          </svg>
        )}
      </div>
    </div>
  )
}

export default Sidebar
