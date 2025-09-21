import React, { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/Appbar/Navbar'
import DataVaultSidebar from '../../components/Drawer/DataVaultSidebar'
import MenuList from '../../components/Drawer/MenuList'
import Sidebar from '../../components/Drawer/Sidebar'
import { useData } from '../shared/DataProvider'
import AddReport from '../../pages/threatBriefs/AddReport'
import AddThreatBrief from '../../pages/threatBriefs/AddThreatBrief'
import { environment } from '../../environment/environment'
import local from '../../utils/local'
import SessionExpiredDialog from '../../components/Appbar/SessionExpiredDialog'
import { isTokenExpired } from '../../components/Appbar/isTokenExpired'
import AddThreatActor from '../../pages/threatBriefs/AddThreatActor'
import { setNavigate } from '../../redux/nodes/navigationHelper'
import { useDispatch } from 'react-redux'
import localforage from 'localforage'
import DatavalutdeleteDilog from '../../components/Appbar/DatavalutdeleteDilog'
import NotificationSidebar from '../../components/Drawer/NotificationSidebar'
import { chatSideList } from '../../redux/nodes/chat/action'

export default function Dashboard(props: any) {
  const { setData, setCopyFiles, setChatScreen, setWssProvider }: any = useData()
  const { children } = props

  const location: any = useLocation()
  const navigateTo = useNavigate()
  const dispatch = useDispatch()
  const { id: paramsId } = useParams()

  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [subMenuList, setsubMenuList] = useState(false)
  const [chatLists, setChatLists] = useState([] as any)
  const [subDatavaultMenu, setSubDatavaultMenu] = useState(false)
  const toggleSidebar = () => {
    setData({
      from: 'dashBoard',
      value: { subDatavaultMenu: subDatavaultMenu, sideBar: !isSidebarOpen },
    })
    setSidebarOpen(!isSidebarOpen)
  }

  const setDefaultCloseSideBar = () => {
    setSidebarOpen(true)
  }

  const toggleDropdown = () => {
    setChatScreen({ from: 'Dashboard', value: !subMenuList })
    setsubMenuList(!subMenuList)
  }
  const closeChatSideBar = () => {
    setsubMenuList(false)
  }
  const closeMenu = () => {
    if (subMenuList) {
      setsubMenuList(!subMenuList)
    }
    if (!isSidebarOpen) {
      setSidebarOpen(true)
    }
  }

  useEffect(() => {
    if (subMenuList) {
      setDataVaultSideMenuClose()
    }
  }, [subMenuList])

  useEffect(() => {
    setNavigate(navigateTo) // Set the navigation function globally
  }, [navigateTo])

  const openDataVaultSideMenu = () => {
    setData({
      from: 'dashBoard',
      value: { subDatavaultMenu: !subDatavaultMenu, sideBar: isSidebarOpen },
    })
    setCopyFiles(null)
    setSubDatavaultMenu(!subDatavaultMenu)
  }

  const dataVaultSideMenuOpen = () => {
    setSubDatavaultMenu(true)
  }

  const setDataVaultSideMenuClose = () => {
    setData({ from: 'dashBoard', value: subDatavaultMenu })
    setSubDatavaultMenu(false)
  }

  useEffect(() => {
    if (location.pathname != '/app/splunkform' || location.pathname != '/app/feedlyform') {
      sessionStorage.removeItem('tabs')
    }
  }, [location.pathname])

  const [reportpopup, setreportpopup] = useState(false)
  const [threatPopup, setthreatPopup] = useState(false)
  const [threatActorPopup, setThreatactorPopup] = useState(false)
  const [threatActorPopupvalue, setThreatactorPopupvalue] = useState('' as any)
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [isCtiDialogOpen, setCitDialogOpen] = useState(false)
  const [isCtiValue, setCitValue] = useState(null as any)
  const [isCtiIndex, setCitIndex] = useState(0 as any)
  const [isCtidelte, setCitDelete] = useState(null as any)
  const [isLogout, setIsLogout] = useState(false)

  const [messages, setMessages] = useState<any[]>([])
  const [chatmessage, setChatMessages] = useState<any>(null as any)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine)
  const websocket = useRef<WebSocket | null>(null)
  const reconnectAttempts = useRef<number>(0)
  const maxReconnectAttempts = 15
  const reconnectDelay = 5000

  const connectWebSocket = () => {
    if (!isOnline) {
      console.log('Cannot connect to WebSocket. No internet connection.')
      return
    }

    const localStorage1 = local.getItem('bearerToken')
    const token = JSON.parse(localStorage1 as any)
    const barearTockens = token?.bearerToken.split(' ')
    if (barearTockens?.length > 0) {
      const url = `${environment.baseWssUrl}/notification?Authorization=${barearTockens[1]}`

      websocket.current = new WebSocket(url)

      websocket.current.onopen = () => {
        console.log('Connected to WebSocket')
        setIsConnected(true)
        reconnectAttempts.current = 0
      }

      websocket.current.onmessage = (event) => {
        console.log('Message from server ', JSON.parse(event.data))
        setWssProvider(JSON.parse(event.data))
        let sessiondata: any = JSON.parse(event.data)
        if (sessiondata.eventType != 'session expired') {
          let responcedata: any = JSON.parse(event.data)
          responcedata.create_at = new Date()
          let notificationlist: any = []

          localforage.getItem<any>('notification').then((res: any) => {
            if (res?.length > 0) {
              notificationlist = [...res]
              notificationlist = [responcedata, ...notificationlist]
              setMessages(notificationlist)
              localforage.setItem<any>('notification', notificationlist)
            } else {
              notificationlist = []
              notificationlist = [responcedata, ...notificationlist]
              setMessages(notificationlist)
              localforage.setItem<any>('notification', notificationlist)
            }
          })
        }
        const datas = JSON.parse(event.data)
        if (datas.eventType == 'session expired') {
          setDialogOpen(true)
        }
      }

      websocket.current.onclose = (event) => {
        console.log('WebSocket closed', event)
        setIsConnected(false)

        if (!event.wasClean) {
          attemptReconnect()
        }
      }

      websocket.current.onerror = (error) => {
        console.error('WebSocket error', error)
        websocket.current?.close()
      }
    }
  }

  const attemptReconnect = () => {
    if (reconnectAttempts.current < maxReconnectAttempts && isOnline) {
      reconnectAttempts.current++
      console.log(`Attempting to reconnect... (${reconnectAttempts.current})`)
      setTimeout(() => {
        connectWebSocket()
      }, reconnectDelay)
    } else if (!isOnline) {
      console.log('Internet is offline. Waiting to reconnect...')
    } else {
      console.log('Max reconnection attempts reached. Could not reconnect to WebSocket.')
    }
  }

  const handleOnline = () => {
    console.log('Internet is back online.')
    setIsOnline(true)
    if (!isConnected) {
      attemptReconnect()
    }
  }

  const handleOffline = () => {
    console.log('Internet is offline.')
    setIsOnline(false)
    if (websocket.current) {
      websocket.current.close()
    }
  }

  useEffect(() => {
    connectWebSocket()

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      websocket.current?.close()
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [isOnline])

  useEffect(() => {
    const localStorage1 = local.getItem('bearerToken')
    const token = JSON.parse(localStorage1 as any)
    const barearTockens = token?.bearerToken.split(' ')
    if (barearTockens?.length > 0) {
      if (barearTockens && isTokenExpired(barearTockens[1])) {
        local.clear()
        navigateTo('/')
      }
    }
    if (messages?.length == 0) {
      localforage.getItem<any>('notification').then((res: any) => {
        setMessages(res)
      })
    }

    fetchDetails()
  }, [])

  const fetchDetails = () => {
    const localStorage1 = local.getItem('bearerToken')
    const token = JSON.parse(localStorage1 as any)
    dispatch(chatSideList(token, 0) as any).then((res: any) => {
      if (res.type == 'CHAT_DETAIL_SUCCESS') {
        setChatLists(res?.payload)
        if (chatmessage == 'edit') {
          setChatMessages(null)
        }
      }
    })
  }

  useEffect(() => {
    if (chatmessage == 'edit') {
      fetchDetails()
    } else {
      fetchDetails()
    }
  }, [chatmessage, paramsId])

  const handleClear = (data: any, index: any) => {
    setIsOpenNo(true)
    setMessages((prevItems: any) => prevItems.filter((_: any, i: any) => i !== index))
    let notificationlist: any = []
    localforage.getItem<any>('notification').then((res: any) => {
      notificationlist = [...res]
      const deletdetails: any = notificationlist.filter((x: any, i: any) => {
        return i !== index
      })
      localforage.setItem('notification', deletdetails)
    })
  }

  const [isOpenNo, setIsOpenNo] = useState(false)

  const toggleDropdownnotifi = (data: any) => {
    if (messages?.length > 0) {
      setIsOpenNo(!isOpenNo)
    } else {
      setIsOpenNo(false)
    }
  }

  const handleClearAll = () => {
    localforage.removeItem('notification')
    setIsOpenNo(false)
    setMessages([])
  }
  const closeMenuNotification = (data: any) => {
    if (isOpenNo && data == 'overall') {
      setIsOpenNo(false)
    }
  }

  const handleClose = () => {
    setIsLogout(true)
    setDialogOpen(false)
  }

  const handleCTIOpen = (data: any, index: any) => {
    setCitDialogOpen(true)
    setCitValue(data)
    setCitIndex(index)
  }

  const handleCTIclose = () => {
    setCitDialogOpen(false)
    setCitValue(null)
  }

  const remove = () => {
    setCitDialogOpen(false)
    setCitDelete(isCtiValue)
  }
  const [openNotification, setopenNotification] = useState(false)
  const [dataVaultList, setDatavaultlist] = useState([] as any)
  const handleopenNotification = () => {
    setopenNotification(!openNotification)
  }

  const closeNotification = () => {
    if (openNotification) {
      setopenNotification(false)
    }
  }
  return (
    <>
      <div className='flex text-white' onClick={closeNotification}>
        {reportpopup && <AddReport reportpopup={reportpopup} setreportpopup={setreportpopup} />}
        {threatPopup && (
          <AddThreatBrief threatPopup={threatPopup} setthreatPopup={setthreatPopup} />
        )}
        {threatActorPopup && (
          <AddThreatActor
            threatActorPopup={threatActorPopup}
            setThreatactorPopup={setThreatactorPopup}
            threatActorPopupvalue={threatActorPopupvalue}
          />
        )}
        <Sidebar
          isOpen={isSidebarOpen}
          dataVaultSideMenuOpen={dataVaultSideMenuOpen}
          setsubMenuList={setsubMenuList}
          subMenuList={subMenuList}
          toggleDropdown={toggleDropdown}
          toggleSidebar={toggleSidebar}
          openDataVaultSideMenu={openDataVaultSideMenu}
          subDatavaultMenuStatus={subDatavaultMenu}
          setDataVaultSideMenuClose={setDataVaultSideMenuClose}
          closeChatSideBar={closeChatSideBar}
          setDefaultCloseSideBar={setDefaultCloseSideBar}
          toggleDropdownnotifi={toggleDropdownnotifi}
          isOpenNo={isOpenNo}
          notificationmessages={messages}
          isLogout={isLogout}
          handleopenNotification={handleopenNotification}
          setSidebarOpen={setSidebarOpen}
        />
        <div
          className={`flex-1   ${
            isSidebarOpen
              ? location.pathname.split('/')[2] != 'ruleagentchat' &&
                location.pathname.split('/')[2] != 'sigmarulechats' &&
location.pathname.split('/')[2] != 'sourcerulechats' &&
                location.pathname.split('/')[2] != 'chatworkbench'
                ? 'ml-16'
                : 'ml-14'
              : 'ml-16'
          } ${
            location.pathname === '/app/datasource' ||
            location.pathname === '/app/breiflow' ||
            location.pathname === '/app/crownjewel'
              ? 'w-[80%]'
              : ''
          }`}
          style={{ width: 'calc(100% - 4.5rem)' }}
        >
          {location.pathname.split('/')[2] != 'ruleagentchat' &&
 location.pathname.split('/')[2] != 'collections' &&
            location.pathname.split('/')[2] != 'sigmarulechats' &&
           location.pathname.split('/')[2] != 'chatworkbench' && location.pathname.split('/')[2] != 'sourcespage' && location.pathname.split('/')[2] != 'newpage' && location.pathname.split('/')[2] != 'sourcerulechats' &&(
              <div
                onClick={() => {
                  closeMenu()
                  setDataVaultSideMenuClose()
                }}
                style={{ zIndex: 1 }}
                id='navHeight'
                className='sticky top-0'
              >
                <Navbar
                  toggleSidebar={toggleSidebar}
                  isOpen={isSidebarOpen}
                  openDataVaultSideMenu={openDataVaultSideMenu}
                  setDataVaultSideMenuClose={setDataVaultSideMenuClose}
                  isSubDatavaultMenuOpen={subDatavaultMenu}
                  toggleDropdown={toggleDropdown}
                  notificationmessages={messages}
                  handleClear={handleClear}
                  toggleDropdownnotifi={toggleDropdownnotifi}
                  isOpenNo={isOpenNo}
                  handleClearAll={handleClearAll}
                  closeMenuNotification={closeMenuNotification}
                  setDatavaultlist={setDatavaultlist}
                />
              </div>
            )}
          <span
            onClick={() => {
              closeMenu()
              setDataVaultSideMenuClose()
              closeMenuNotification('overall')
            }}
          >
            {children}
          </span>
          {subMenuList && (
            <div
              className={`flex-1   ${isSidebarOpen ? 'ml-24' : 'md:ml-64 lg:ml-52'} ${
                location.pathname === '/app/datasource' ||
                location.pathname === '/app/breiflow' ||
                location.pathname === '/app/crownjewel'
                  ? 'w-[80%]'
                  : ''
              }`}
            >
              <MenuList
                toggleDropdown={toggleDropdown}
                isOpen={isSidebarOpen}
                setsubMenuList={setsubMenuList}
                subMenuList={undefined}
                openDataVaultSideMenu={openDataVaultSideMenu}
                closeChatMenu={closeMenu}
                chatLists={chatLists}
                setChatMessages={setChatMessages}
                chatmessage={chatmessage}
              />
            </div>
          )}
        </div>
      </div>
      {(subDatavaultMenu ||
        location.pathname.split('/')[2] == 'Repository' ||
        location.pathname.split('/')[2] == 'addRepository' ||
        location.pathname.split('/')[2] == 'addFiles' ||
        location.pathname.split('/')[2] == 'VaultPermission' ||
        location.pathname.split('/')[2] == 'threatactor' ||
        location.pathname.split('/')[2] == 'repositorysearch' ||
        location.pathname.split('/')[2] == 'sigmafilesearch') && (
        <>
          <div
            style={{ zIndex: 2 }}
            className={`transition-all duration-100  ease-in-out transform fixed top-0
            ${!subDatavaultMenu && !isSidebarOpen && 'translate-x-[-4.6rem]'}
            ${subDatavaultMenu && !isSidebarOpen && 'translate-x-[15rem]'}
            ${!subDatavaultMenu && isSidebarOpen && 'translate-x-[-20.6rem]'}
            ${subDatavaultMenu && isSidebarOpen && 'translate-x-[0rem]'}
          `}
          >
            <DataVaultSidebar
              openDataVaultSideMenu={openDataVaultSideMenu}
              toggleDropdown={toggleDropdown}
              isOpen={isSidebarOpen}
              setsubMenuList={setsubMenuList}
              subMenuList={undefined}
              subDatavaultMenu={subDatavaultMenu}
              setreportpopup={setreportpopup}
              setthreatPopup={setthreatPopup}
              setThreatactorPopup={setThreatactorPopup}
              setThreatactorPopupvalue={setThreatactorPopupvalue}
              handleCTIOpen={handleCTIOpen}
              isCtidelte={isCtidelte}
              setCitDelete={setCitDelete}
              isCtiDialogOpen={isCtiDialogOpen}
              isCtiIndex={isCtiIndex}
            />
          </div>
        </>
      )}
      <SessionExpiredDialog isOpen={isDialogOpen} onClose={handleClose} />
      {isCtiDialogOpen && (
        <DatavalutdeleteDilog data={isCtiValue} onClose={handleCTIclose} remove={remove} />
      )}
      {openNotification && (
        <NotificationSidebar
          openNotification={openNotification}
          notificationmessages={messages}
          handleClear={handleClear}
          handleClearAll={handleClearAll}
          closeMenuNotification={closeMenuNotification}
          datavalut={dataVaultList}
        />
      )}
    </>
  )
}
