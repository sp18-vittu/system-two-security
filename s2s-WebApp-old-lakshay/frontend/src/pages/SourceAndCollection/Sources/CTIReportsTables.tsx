import React, { useEffect, useState } from 'react'
import { DataGrid, gridClasses, GridColDef, GridSortModel } from '@mui/x-data-grid'
import { Box, Menu } from '@mui/material'
import moment from 'moment'
import useWindowResolution from '../../../layouts/Dashboard/useWindowResolution'
import { makeStyles } from '@mui/styles'
import { useNavigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useDispatch } from 'react-redux'
import { updateFileTitle } from '../../../redux/nodes/cti-report/action'
import CTiEditDilog from './CTiEditDilog'
import DeleteConfirmationDialog from '../Collection/DeleteConfirmationDialog'
import {
  CREATE_VIEWFILE_VAULT_FAILED,
  CREATE_VIEWFILE_VAULT_SUCCESS,
  deletedocument,
} from '../../../redux/nodes/repository/action'
import local from '../../../utils/local'
import Axios from 'axios'
import { environment } from '../../../environment/environment'
import { useData } from '../../../layouts/shared/DataProvider'
import { createChat } from '../../../redux/nodes/chatPage/action'
import CustomToast from '../../../layouts/App/CustomToast'
import toast from 'react-hot-toast'
import { styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material'
import { sortByDateTime } from '../../../utils/helper'

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

interface BadgeProps {
  text: string
}

const Badge: React.FC<BadgeProps> = ({ text }) => (
  <div className='px-1.5 py-0.5 bg-white shadow-sm rounded-md border border-gray-300 flex items-center justify-start'>
    <div className='text-center text-gray-700 text-xs font-medium leading-4 break-words'>
      {text}
    </div>
  </div>
)

const theme = createTheme({
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          width: 20,
          height: 20,
          borderRadius: 6,
          border: '2px solid #7F94B4',
          backgroundColor: '#0C111D', // Default background color
          color: 'transparent', // To prevent default color rendering

          '&.Mui-checked': {
            backgroundColor: '#f97316', // Checked background color
            borderColor: '#7F94B4', // Keep border on check
            cursor: 'pointer',
          },

          '&.Mui-focusVisible': {
            outline: '2px solid #f97316', // Focus state
            outlineOffset: 2,
            cursor: 'default',
          },

          // Adjusting the SVG icon to ensure it's hidden
          '& .MuiSvgIcon-root': {
            display: 'none',
            cursor: 'default',
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#EE7103', // Replace with your desired spinner color
        },
      },
    },
  },
})

function CTIReportsTables({
  TablesList,
  setAddctireport,
  sortedDataList,
  setSortedDataList,
  search,
  reloading,
  sortModels,
  setSortModel,
  handleSortIconClick,
  setIsOpen,
}: any) {
  const [anchorE6, setAnchorE6] = React.useState(null)
  const { width, height } = useWindowResolution()
  const navigateTo = useNavigate()
  const dispatch = useDispatch()
  const classes = useStyles()
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [getdatacheck, setGetdatacheck] = useState([])
  const [isdelDialogOpen, setIsdleDialogOpen] = useState(false)
  const [singleparams, setSingleparams] = useState(null as any)
  const opendot = Boolean(anchorE6)
  const localToken = local.getItem('bearerToken')
  const token = JSON.parse(localToken as any)
  const getRowClassName = (params: any) => {
    return params.row.status === "PROCESSING" ? "bg-[#1F0F00]" : ""
  }

  const getCellClassName = (params: any) => {
    return params.row.disabled ? classes.checkbox : classes.uncheckbox
  }

  const handleClickdot = (event: any, params: any) => {
    setSingleparams(params)
    setAnchorE6(event.currentTarget)
  }

  const handleClosing = () => {
    setAnchorE6(null)
  }

  const onNaviaget = (item: any) => {
    if (singleparams?.row?.reportSource != 'PDF' && singleparams?.row?.status == 'COMPLETE') {
      const movetab: any =
        singleparams?.reportSource != 'PDF' &&
          singleparams?.row?.status != 'COMPLETE' &&
          singleparams?.row?.intelCount?.data?.SIGMA &&
          singleparams?.row?.intelCount?.data?.CVEs &&
          singleparams?.row?.intelCount?.data?.IOC &&
          singleparams?.row?.intelCount?.data?.TTPs
          ? 1
          : 2
      navigateTo(`/app/repoinsightspages/${singleparams?.row?.id}`, {
        state: {
          title: capitalizeFirstLetter(
            singleparams?.row?.ctiName.replace(/-/g, ' ').replace(/\.pdf$/i, ''),
          ),
          tab: 1,
          singleparams: singleparams?.row,
        },
      })
      sessionStorage.setItem('insightdata', JSON.stringify(singleparams?.row))
      sessionStorage.setItem('vault', JSON.stringify(singleparams?.row))
      setAnchorE6(null)
    }
  }

  const openInsiteNaviage = (item: any) => {
    if (
      item?.status == 'COMPLETE' &&
      item?.intelCount?.data?.SIGMA >= 0 &&
      item?.intelCount?.data?.TTPs >= 0 &&
      item?.intelCount?.data?.IOC >= 0 &&
      item?.intelCount?.data?.CVEs >= 0
    ) {
      navigateTo(`/app/repoinsightspages/${item?.id}`, {
        state: {
          title: capitalizeFirstLetter(item?.ctiName.replace(/-/g, ' ').replace(/\.pdf$/i, '')),
          tab: 1,
          singleparams: item,
        },
      })
      sessionStorage.setItem('insightdata', JSON.stringify(item))
      sessionStorage.setItem('vault', JSON.stringify(item))
      setAnchorE6(null)
    } else if (
      item?.status == 'COMPLETE' &&
      item?.intelCount?.data?.SIGMA >= 0 &&
      !item?.intelCount?.data?.TTPs &&
      !item?.intelCount?.data?.IOC &&
      !item?.intelCount?.data?.CVEs
    ) {
      navigateTo(`/app/repoinsightspages/${item?.id}`, {
        state: {
          title: capitalizeFirstLetter(item?.ctiName.replace(/-/g, ' ')),
          tab: 2,
          singleparams: item,
        },
      })
      sessionStorage.setItem('insightdata', JSON.stringify(item))
    }
  }

  const openSigmaNaviage = (item: any) => {
    if (
      item?.status == 'COMPLETE' &&
      item?.intelCount?.data?.SIGMA >= 0 &&
      item?.intelCount?.data?.TTPs >= 0 &&
      item?.intelCount?.data?.IOC >= 0 &&
      item?.intelCount?.data?.CVEs >= 0
    ) {
      navigateTo(`/app/repoinsightspages/${item?.id}`, {
        state: {
          title: capitalizeFirstLetter(item?.ctiName.replace(/-/g, ' ').replace(/\.pdf$/i, '')),
          tab: 2,
          singleparams: item,
        },
      })
      sessionStorage.setItem('insightdata', JSON.stringify(item))
      sessionStorage.setItem('vault', JSON.stringify(item))
      setAnchorE6(null)
    } else if (
      item?.status == 'COMPLETE' &&
      item?.intelCount?.data?.SIGMA >= 0 &&
      !item?.intelCount?.data?.TTPs &&
      !item?.intelCount?.data?.IOC &&
      !item?.intelCount?.data?.CVEs
    ) {
      navigateTo(`/app/repoinsightspages/${item?.id}`, {
        state: {
          title: capitalizeFirstLetter(item?.ctiName.replace(/-/g, ' ')),
          tab: 2,
          singleparams: item,
        },
      })
      sessionStorage.setItem('insightdata', JSON.stringify(item))
    }
  }

  const openUrls1 = async (item: any) => {
    if (item?.reportSource == 'PDF') {
      try {
        const { data } = await Axios.get(
          `${environment.baseUrl}/data/view-cti-report-pdf?datavaultId=${item?.datavault?.id}&ctiId=${item?.id}`,
          {
            responseType: 'blob',
            headers: {
              Authorization: `${token.bearerToken}`,
            },
          },
        )
        var reader = new FileReader()
        reader.onload = function (e) {
          const blob = new Blob([data], { type: 'application/pdf' })
          const fileURL = URL.createObjectURL(blob)
          window.open(fileURL, '_blank')
        }
        reader.readAsDataURL(data)

        dispatch({ type: CREATE_VIEWFILE_VAULT_SUCCESS, payload: data })
      } catch (error: any) {
        dispatch({ type: CREATE_VIEWFILE_VAULT_FAILED, payload: error.message })
      }
    } else {
      const linkUrl = item?.url
      window.open(linkUrl, '_blank')
    }
    setAnchorE6(null)
  }
  const openUrls = async (item: any) => {
    if (singleparams?.row?.reportSource == 'PDF') {
      try {
        const { data } = await Axios.get(
          `${environment.baseUrl}/data/view-cti-report-pdf?datavaultId=${singleparams?.row?.datavault?.id}&ctiId=${singleparams?.row?.id}`,
          {
            responseType: 'blob',
            headers: {
              Authorization: `${token.bearerToken}`,
            },
          },
        )
        var reader = new FileReader()
        reader.onload = function (e) {
          const blob = new Blob([data], { type: 'application/pdf' })
          const fileURL = URL.createObjectURL(blob)
          window.open(fileURL, '_blank')
        }
        reader.readAsDataURL(data)

        dispatch({ type: CREATE_VIEWFILE_VAULT_SUCCESS, payload: data })
      } catch (error: any) {
        dispatch({ type: CREATE_VIEWFILE_VAULT_FAILED, payload: error.message })
      }
    } else {
      const linkUrl = singleparams?.row?.url
      window.open(linkUrl, '_blank')
    }
    setAnchorE6(null)
  }
  const { setCtiFileName, CtiReportList }: any = useData()
  const openWorkbench = async (data1: any) => {
    setCtiFileName(singleparams.row)
    sessionStorage.setItem('createNewChat', JSON.stringify({ createNewChat: true }))
    const chatObj = { sessionName: singleparams?.row?.ctiName }
    const selectFiles = {
      vaultId: singleparams?.row?.datavault?.id,
      id: singleparams?.row.id,
      urlSHA256: singleparams?.row?.urlSHA256,
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

  const openrowWorkbench = async (params: any) => {
    setCtiFileName(params)
    sessionStorage.setItem('createNewChat', JSON.stringify({ createNewChat: true }))
    const chatObj = { sessionName: params?.ctiName }
    const selectFiles = {
      vaultId: params?.id,
      id: params.id,
      urlSHA256: params?.urlSHA256,
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

  const onViewRules = (item: any) => {
    navigateTo(`/app/repoinsightspages/${singleparams?.row?.id}`, {
      state: {
        title: capitalizeFirstLetter(singleparams?.row?.ctiName.replace(/-/g, ' ')),
        tab: 2,
        singleparams: singleparams?.row,
      },
    })
    sessionStorage.setItem('insightdata', JSON.stringify(singleparams?.row))
    setAnchorE6(null)
  }

  const handleEditFileSubmit = (event: any) => {
    dispatch(updateFileTitle({ ctiName: event.urltitle }, singleparams?.row?.id) as any)
      .then((res: any) => {
        if (res.type === 'FILETITLE_UPDATE_SUCCESS') {
          toast.success(
            <CustomToast
              message='CTI name updated successfully'
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
          setDialogOpen(false)
          setAddctireport('add')
        }
      })
      .catch((err: any) => console.log(err))
  }

  const handleEditFil = (data: any) => {
    setDialogOpen(true)
    setAnchorE6(null)
  }

  const handleClickdelete = (params: any) => {
    setIsdleDialogOpen(true)
    setAnchorE6(null)
  }

  const handleDelete = () => {
    dispatch(deletedocument(token, singleparams?.row?.id) as any).then((res: any) => {
      if (res.type == 'REPOSITORY_DOC_DELETE_SUCCESS') {
        toast.success(
          <CustomToast
            message='CTI report deleted successfully'
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
        setSortedDataList([])
        setIsdleDialogOpen(false)
        setAddctireport('add')
      }
    })
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
          height: '100%',
        }}
      >
        <div>No rows</div>
      </div>
    )
  }



  function capitalizeFirstLetter(name: string): string {
    if (!name) return ''
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
  }

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
      width: 800,
    },
  }))

  const columns: GridColDef[] = [
    {
      field: 'ctiName',
      headerName: 'Name',
      flex: width > 1500 ? 1 : undefined,
      width: 557,
      sortable: true,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      renderCell: (params: any) => {
        const url = params?.row?.url
        const urlParts = url?.split('/')
        let name = urlParts?.[urlParts?.length - 1]
        const urlNameValue = name?.split('.')[0]

        const textToShow = params?.row?.ctiName
          ? params?.row?.ctiName.replace(/-/g, ' ').replace(/\.pdf$/i, '')
          : urlNameValue.replace(/-/g, ' ').replace(/\.pdf$/i, '')

        return (
          <div className='flex items-center justify-start gap-3 px-1 py-4 h-[72px] w-[98%]'>
            <div className='relative flex-shrink-0 w-10 h-10'>
              {params?.row?.reportSource === 'PDF' ||
                params?.row?.url.split('.').pop() === 'pdf' ? (
                <>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='32'
                    height='40'
                    viewBox='0 0 32 40'
                    fill='none'
                  >
                    <path
                      d='M0.5 4C0.5 2.067 2.067 0.5 4 0.5H19.7929L31.5 12.2071V36C31.5 37.933 29.933 39.5 28 39.5H4C2.067 39.5 0.5 37.933 0.5 36V4Z'
                      stroke='white'
                    />
                    <path
                      d='M20.5 8V1.20711L30.7929 11.5H24C22.067 11.5 20.5 9.933 20.5 8Z'
                      stroke='white'
                    />
                  </svg>
                  <div className='absolute bottom-[15%] top-[45%] left-0 right-[35%] bg-red-600 rounded-sm px-1 py-0.5 flex justify-center items-center'>
                    <div className='text-white text-[10px] font-bold leading-none'>PDF</div>
                  </div>
                </>
              ) : (
                <>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='40'
                    height='40'
                    viewBox='0 0 40 40'
                    fill='none'
                  >
                    <path
                      d='M20 3.33334C10.7953 3.33334 3.33337 10.7953 3.33337 20C3.33337 29.2048 10.7953 36.6667 20 36.6667M20 3.33334C29.2048 3.33334 36.6667 10.7953 36.6667 20C36.6667 29.2048 29.2048 36.6667 20 36.6667M20 3.33334C16.9736 6.64658 14.8957 10.676 13.9349 15M20 3.33334C23.0264 6.64658 25.1044 10.676 26.0652 15M20 36.6667C23.0264 33.3534 25.1044 29.324 26.0652 25M20 36.6667C16.9736 33.3534 14.8957 29.324 13.9349 25M4.16674 15H13.9349M35.8334 15H26.0652M4.16671 25H13.9349M35.8334 25H26.0652M13.9349 15C13.5722 16.6323 13.3687 18.3065 13.3334 20C13.3687 21.6935 13.5722 23.3678 13.9349 25M13.9349 15H26.0652M26.0652 15C26.4279 16.6323 26.6314 18.3065 26.6667 20C26.6314 21.6935 26.4279 23.3678 26.0652 25M26.0652 25H13.9349'
                      stroke='white'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  <div className='absolute top-[12px] left-0 flex items-start justify-start gap-2 bg-blue-600 rounded-[2px] px-[3px] py-[2px]'>
                    <div className='text-white text-xs font-bold font-sans'>URL</div>
                  </div>
                </>
              )}
            </div>
            <BootstrapTooltip title={capitalizeFirstLetter(textToShow)} placement='bottom'>
              <div
                className={`text-white text-sm font-bold leading-5 truncate overflow-hidden whitespace-nowrap ${(params?.row?.status === 'COMPLETE' || params?.row?.status === 'FAILED') &&
                  params?.row?.intelCount?.data?.SIGMA > 0
                  ? 'cursor-pointer'
                  : 'cursor-not-allowed'
                  }`}
                onClick={() => openInsiteNaviage(params.row)}
              >
                {capitalizeFirstLetter(textToShow)}
              </div>
            </BootstrapTooltip>
          </div>
        )
      },
    },
    {
      field: 'intel',
      headerName: 'Detections',
      width: 150,
      sortable: false,
      headerClassName: 'hideRightSeparator',
      renderCell: (params) => (
        <>
          {params?.row?.status == 'PROCESSING' ? (
            <button
              disabled={true}
              onClick={() => openSigmaNaviage(params?.row)}
              className={`relative w-[95px] h-[31px] flex-shrink-0 rounded-md overflow-hidden ${(params?.row?.status === 'COMPLETE' || params?.row?.status === 'FAILED') &&

                'cursor-not-allowed'
                }`}
            >
              <div className='absolute w-[56px] h-full left-0 top-0 bg-[#0F121B] border border-[#EE7103] rounded-l-md flex items-center justify-center'>
                <span className='text-white text-sm font-normal font-inter leading-6'>Sigma</span>
              </div>
              <div className='absolute w-[36px] h-full left-[55px] top-0 bg-[#272D41] border border-[#EE7103] rounded-r-md flex items-center justify-center'>
                <span className='text-white text-sm font-bold font-inter leading-6'>
                  {"-"}
                </span>
              </div>
            </button>
          ) : (
            <button
              disabled={
                (params?.row?.status === 'COMPLETE' || params?.row?.status === 'FAILED') &&
                  params?.row?.intelCount?.data?.SIGMA > 0
                  ? false
                  : true
              }
              onClick={() => openSigmaNaviage(params?.row)}
              className={`relative w-[95px] h-[31px] flex-shrink-0 rounded-md overflow-hidden ${(params?.row?.status === 'COMPLETE' || params?.row?.status === 'FAILED') &&
                params?.row?.intelCount?.data?.SIGMA > 0
                ? 'cursor-pointer'
                : 'cursor-not-allowed'
                }`}
            >
              <div className='absolute w-[56px] h-full left-0 top-0 bg-[#0F121B] border border-[#EE7103] rounded-l-md flex items-center justify-center'>
                <span className='text-white text-sm font-normal font-inter leading-6'>Sigma</span>
              </div>
              <div className='absolute w-[36px] h-full left-[55px] top-0 bg-[#272D41] border border-[#EE7103] rounded-r-md flex items-center justify-center'>
                <span className='text-white text-sm font-bold font-inter leading-6'>
                  {params?.row?.intelCount?.data?.SIGMA ? params?.row?.intelCount?.data?.SIGMA : "-"}
                </span>
              </div>
            </button>
          )}
        </>
      ),
    },
    {
      field: 'url',
      headerName: 'Source',
      width: 557,
      flex: width > 1500 ? 1 : undefined,
      sortable: true,
      headerClassName: 'hideRightSeparator',
      renderCell: (params) => {
        const url = params?.row?.url
        const urlParts = url?.split('/')
        let name = urlParts[urlParts?.length - 1]
        const urlNameValue = name?.split('.')[0]
        return (
          <div className='flex items-start justify-start gap-0 h-18 relative w-[98%]'>
            <BootstrapTooltip
              title={
                params.row.reportSource === 'PDF'
                  ? `file://${params?.row?.ctiName ? params?.row?.ctiName : urlNameValue}`
                  : decodeURIComponent(params.row.url)
              }
              arrow
              placement='bottom'
            >
              <div
                className={`text-blue-400 text-sm font-medium leading-5 flex-1 cursor-pointer truncate overflow-hidden whitespace-nowrap`}
                onClick={() => openUrls1(params.row)}
                title={
                  params.row.reportSource === 'PDF'
                    ? `file://${params?.row?.ctiName ? params?.row?.ctiName : urlNameValue}`
                    : decodeURIComponent(params.row.url)
                }
              >
                {params.row.reportSource === 'PDF'
                  ? `file://${params?.row?.ctiName ? params?.row?.ctiName : urlNameValue}`
                  : decodeURIComponent(params.row.url)}
              </div>
            </BootstrapTooltip>
          </div>
        )
      },
    },

    {
      field: 'creationTime',
      headerName: 'Created',
      width: 130,
      headerClassName: 'hideRightSeparator',
      sortable: true,
      sortComparator: sortByDateTime,
      renderCell: (params) => (
        <>
          {params.row.status === "PROCESSING" ? (

            <div className="badge flex items-center justify-start rounded-[16px] border border-[#EE7103] px-2 py-1">
              <div className="text text-[#EE7103] text-center font-medium text-xs leading-[18px]">
                Processing...
              </div>
            </div>

          ) : (
            <div className='flex justify-between w-full '>
              {params.row.creationTime ? (
                <>
                  <span>{moment(params.row.creationTime).format('DD-MMM HH:mm')}</span>
                </>
              ) : (
                <>{'-'}</>
              )}
            </div>

          )}
        </>
      ),
    },
    {
      field: 'chat',
      headerName: '',
      width: 150,
      headerClassName: 'hideRightSeparator',
      sortable: false,
      renderCell: (params) => (
        <>
          <div className='flex flex-row w-full '>
            <button
              disabled={
                params?.row?.status === 'COMPLETE' && params?.row?.intelCount?.data?.SIGMA > 0
                  ? false
                  : true
              }
              className={`flex items-center justify-end border-b border-[#32435a] px-6 py-4 h-[72px] relative ${params?.row?.status === 'COMPLETE' && params?.row?.intelCount?.data?.SIGMA > 0
                ? `cursor-pointer`
                : `cursor-not-allowed`
                }  `}
              onClick={() => openrowWorkbench(params.row)}
            >
              <div className='flex items-center gap-1.5 relative overflow-hidden'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                >
                  <path
                    d='M8.94023 5.20558C9.04556 4.93147 9.46367 4.93147 9.56899 5.20558C10.0144 6.36493 10.8708 8.38109 11.7272 9.22628C12.5857 10.0737 14.5257 10.9211 15.6309 11.3598C15.9008 11.4669 15.9008 11.8665 15.6309 11.9737C14.5256 12.4123 12.5857 13.2597 11.7272 14.107C10.8708 14.9523 10.0144 16.9685 9.56899 18.1278C9.46367 18.4018 9.04556 18.4018 8.94023 18.1278C8.4948 16.9685 7.63843 14.9523 6.78208 14.107C5.92572 13.2618 3.88294 12.4167 2.7083 11.9771C2.43057 11.8731 2.43057 11.4604 2.70829 11.3565C3.88293 10.9167 5.92572 10.0715 6.78208 9.22628C7.63843 8.38109 8.4948 6.36493 8.94023 5.20558Z'
                    fill='#EE7103'
                  />
                  <path
                    d='M15.5044 1.05832C15.6303 0.75835 16.1037 0.75835 16.2296 1.05832C16.491 1.68159 16.8619 2.44751 17.2327 2.81465C17.6058 3.18405 18.3487 3.55346 18.9459 3.81258C19.2402 3.94027 19.2402 4.39315 18.9459 4.52083C18.3487 4.77992 17.6058 5.1493 17.2327 5.51872C16.8619 5.88584 16.491 6.65176 16.2296 7.27503C16.1037 7.575 15.6303 7.575 15.5044 7.27503C15.243 6.65176 14.8721 5.88584 14.5013 5.51872C14.1304 5.15158 13.3568 4.78445 12.7272 4.5256C12.4243 4.40103 12.4243 3.93239 12.7272 3.80779C13.3568 3.54893 14.1304 3.18178 14.5013 2.81465C14.8721 2.44751 15.243 1.68159 15.5044 1.05832Z'
                    fill='#EE7103'
                  />
                  <path
                    d='M2.8739 2.77885C3.04637 2.40705 3.65181 2.40705 3.82428 2.77885C4.02009 3.20095 4.25619 3.62937 4.49227 3.86397C4.7315 4.10172 5.15235 4.33944 5.56085 4.53554C5.92415 4.70994 5.92415 5.29011 5.56085 5.46449C5.15233 5.66057 4.7315 5.8983 4.49227 6.13602C4.25619 6.37063 4.02009 6.79905 3.82428 7.22115C3.65181 7.59295 3.04637 7.59295 2.8739 7.22115C2.67808 6.79905 2.44199 6.37063 2.20591 6.13602C1.96982 5.90142 1.5387 5.66681 1.11394 5.47223C0.739802 5.30084 0.739785 4.69919 1.11392 4.5278C1.53868 4.33321 1.96982 4.09858 2.20591 3.86397C2.44199 3.62937 2.67808 3.20095 2.8739 2.77885Z'
                    fill='#EE7103'
                  />
                </svg>
                <div className='text-[#ee7103] font-semibold text-sm leading-5'>{'Chat'}</div>
              </div>
            </button>
            <button
              className={`${`cursor-pointer`}`}
              onClick={(e: any) => handleClickdot(e, params)}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke={`${params.row.disabled ? `#808080` : '#fff'}`}
                className='w-6 h-6 cursor-pointer'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z'
                />
              </svg>
            </button>
            <Menu
              sx={{
                '& .MuiPaper-root': {
                  backgroundColor: '#2C3A4F',
                  color: '#fff',
                },
              }}
              anchorEl={anchorE6}
              open={opendot}
              onClose={handleClosing}
            >
              <div className='right-0 px-5 text-[#fff] w-[200px]'>
                {singleparams?.row?.status != 'PROCESSING' &&
                  singleparams?.row?.intelCount?.data?.SIGMA > 0 ? (
                  <ul>
                    {singleparams?.row?.status == 'COMPLETE' &&
                      (!singleparams?.row?.intelCount?.data?.SIGMA ||
                        singleparams?.row?.intelCount?.data?.SIGMA >= 0) &&
                      singleparams?.row?.intelCount?.data?.TTPs >= 0 &&
                      singleparams?.row?.intelCount?.data?.IOC >= 0 &&
                      singleparams?.row?.intelCount?.data?.CVEs >= 0 && (
                        <>
                          <button className='flex viewer' onClick={() => onNaviaget(params.row)}>
                            <li className='m-1 text-sm font-medium'>View Insights</li>
                          </button>
                        </>
                      )}

                    <>
                      <button className='flex' onClick={() => openUrls(params.row)}>
                        <li className='text-sm font-medium m-1'>
                          {singleparams?.row.reportSource == 'PDF' ? 'Go to PDF' : 'Go to URL'}
                        </li>
                      </button>
                    </>
                    <>
                      <button className='flex'>
                        <li
                          className='text-sm font-medium m-1'
                          onClick={() => openWorkbench(params.row)}
                        >
                          Add to Workbench
                        </li>
                      </button>
                    </>
                    <>
                      <button className='flex'>
                        <li
                          className='text-sm font-medium m-1'
                          onClick={() => onViewRules(params.row)}
                        >
                          View Rules
                        </li>
                      </button>
                    </>

                    {!singleparams?.row?.global && (
                      <>
                        <button
                          type='button'
                          className='flex'
                          onClick={(e: any) => handleEditFil(params?.row)}
                        >
                          <span className='m-1  text-sm font-medium'>Edit</span>
                        </button>

                        <button
                          type='button'
                          className='flex'
                          onClick={(e: any) => handleClickdelete(params?.row)}
                        >
                          <span className='m-1  text-sm font-medium'> Delete</span>
                        </button>
                      </>
                    )}
                  </ul>
                ) : (
                  <ul>
                    <>
                      <button className='flex' onClick={() => openUrls(params.row)}>
                        <li className='text-sm font-medium m-1'>Go to URL</li>
                      </button>
                    </>
                    {!singleparams?.row?.global && (
                      <button
                        type='button'
                        className='flex'
                        onClick={(e: any) => handleClickdelete(params?.row)}
                      >
                        <span className='m-1  text-sm font-medium'> Delete</span>
                      </button>
                    )}
                  </ul>
                )}
              </div>
            </Menu>
          </div>
        </>
      ),
    },
  ]


  return (
    <>
      {(CtiReportList?.length > 0 || sortedDataList?.length > 0 || TablesList?.length > 0) || ((sortedDataList?.length == 0 || TablesList?.length == 0) && search) ? (<>
        <ThemeProvider theme={theme}>
          <Box
            sx={{
              width: '100%',
              [`& .${gridClasses.overlay}`]: {
                backgroundColor: 'transparent', // Removes the background color
              },
              '& .MuiDataGrid-cell': {
                padding: '26px 24px', // Apply padding to cells
              },
              '& .super-app-theme--header': {
                backgroundColor: '#32435A',
                color: '#FFFFFF',
                zIndex: -2,
              },
              '.css-1omg972-MuiDataGrid-root .MuiDataGrid-columnHeader--alignCenter .MuiDataGrid-columnHeaderTitleContainer':
              {
                backgroundColor: '#32435A',
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
              '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within': {
                outline: 'none',
              },
              '.MuiCheckbox-colorPrimary.Mui-checked': {
                color: ' white !important',
              },
              '.css-rtrcn9-MuiTablePagination-root .MuiTablePagination-selectLabel': {
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
                color: 'white',
                border: 'none',
                height: { md: height - 150, lg: height - 250, xl: height - 550 },
                minHeight: 500,
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
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: '#1D2939', // Customize hover color
                },
              }}
          getCellClassName={getCellClassName}
          disableSelectionOnClick={true}
          getRowClassName={getRowClassName}
          rows={
            sortedDataList?.length > 0 ? sortedDataList : TablesList?.length > 0 ? TablesList : []
          }
          columns={columns}
          // loading={reloading}
          classes={{
            columnHeadersInner: 'custom-data-grid-columnHeadersInner',
            sortIcon: 'custom-data-grid-sortIcon',
            footerContainer: 'custom-data-grid-footerContainer',
          }}
          pagination
          initialState={{
            sorting: {
              sortModel: [
                {
                  field: 'creationTime',
                  sort: 'desc',
                },
              ],
            },
          }}
          selectionModel={getdatacheck}
          onSelectionModelChange={(ids: any, newSelection: any) => {
            let checkboxArray: any = []
            let checkboxArrayvalue: any = []

                const selectedIDs = new Set(ids)
                const selectedRowData: any = TablesList?.filter((ctireportFiles: any) =>
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
              }}
              components={{
                NoRowsOverlay: CustomNoRowsOverlay,
              }}
              hideFooterSelectedRowCount
              disableColumnMenu
              rowHeight={60}
            />
          </Box>
          <CTiEditDilog
            isOpen={isDialogOpen}
            onClose={() => {
              setDialogOpen(false), () => { }, setSingleparams(null)
            }}
            handleEditFileSubmit={handleEditFileSubmit}
            editdata={singleparams?.row}
          />
          <DeleteConfirmationDialog
            isOpen={isdelDialogOpen}
            onClose={() => {
              setIsdleDialogOpen(false), () => { }, setSingleparams(null)
            }}
            onConfirm={handleDelete}
            message={`Are you sure you want to delete this report?`}
          />
        </ThemeProvider>
      </>) : (
        <>
          {((sortedDataList?.length == 0 || TablesList?.length == 0) && !search) && (<>
            <div className='w-full h-full'>
              <div className='box-border flex flex-row gap-6 h-full lg:max-h-[calc(100vh-350px)] min-h-[300px] overflow-scroll hide-scrollbar items-center justify-center relative  max-lg:flex-col'>
                <div className='w-full h-full overflow-scroll hide-scrollbar max-lg:w-full max-lg:min-h-[500px]'>
                  <div className='bg-[#1d2939] rounded-lg p-8 flex flex-col gap-6 items-center justify-center w-full h-full'>
                    <div className='text-left font-inter font-semibold text-[20px] leading-[24px] font-semibold relative'>

                    </div>

                    <div

                      className={`border-2 border-dashed rounded-lg p-8 text-center flex flex-col justify-center items-center h-full w-full ${'border-[#fff] bg-[#1d2939]'
                        }`}
                    >

                      <div className='flex flex-col items-center justify-center'>
                        <svg
                          className='cursor-pointer'
                          xmlns='http://www.w3.org/2000/svg'
                          width='40'
                          height='41'
                          viewBox='0 0 40 41'
                          fill='none'
                        >
                          <path
                            d='M13.3335 27.1667L20.0002 20.5M20.0002 20.5L26.6668 27.1667M20.0002 20.5V35.5M33.3335 28.4047C35.3693 26.7234 36.6668 24.1799 36.6668 21.3333C36.6668 16.2707 32.5628 12.1667 27.5002 12.1667C27.136 12.1667 26.7953 11.9767 26.6104 11.6629C24.4369 7.97473 20.4242 5.5 15.8335 5.5C8.92994 5.5 3.3335 11.0964 3.3335 18C3.3335 21.4435 4.72591 24.5618 6.97841 26.8226'
                            stroke='white'
                            stroke-width='1.66667'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                        </svg>
                        <p
                          className={
                            'text-orange-400 font-inter'
                          }
                        >
                          {'Convert threat intelligence into actionable detections'}
                        </p>

                        <div className='flex flex-row items-center mt-2'>
                          <button
                            className='bg-orange-600 text-white py-2 px-4 rounded-lg font-inter font-semibold text-[14px]'
                            onClick={() => setIsOpen(true)}
                          >
                            ADD REPORT
                          </button>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>)}
        </>
      )}

    </>
  )
}

export default CTIReportsTables
