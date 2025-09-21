import moment from 'moment'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit } from '@mui/icons-material'
import CTiEditDilog from './CTiEditDilog'
import { updateFileTitle } from '../../../redux/nodes/cti-report/action'
import { useDispatch } from 'react-redux'
import DeleteConfirmationDialog from '../Collection/DeleteConfirmationDialog'
import {
  CREATE_VIEWFILE_VAULT_FAILED,
  CREATE_VIEWFILE_VAULT_SUCCESS,
  deletedocument,
} from '../../../redux/nodes/repository/action'
import local from '../../../utils/local'
import useWindowResolution from '../../../layouts/Dashboard/useWindowResolution'
import CustomToast from '../../../layouts/App/CustomToast'
import toast from 'react-hot-toast'
import { Tooltip } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import Axios from 'axios'
import { environment } from '../../../environment/environment'

function CTIReportsCards({
  cardList,
  setAddctireport,
  sortedDataList,
  search,
  setSortedDataList,
}: any) {
  const navigateTo = useNavigate()
  const dispatch = useDispatch()
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [editdata, setEditdata] = useState(null as any)
  const [isdelDialogOpen, setIsdleDialogOpen] = useState(false)
  const localToken = local.getItem('bearerToken')
  const token = JSON.parse(localToken as any)
  const { height } = useWindowResolution()
  const dynamicHeight = Math.max(400, height * 0.8)

  const onNaviaget = (item: any) => {
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
    } else if (
      item?.status == 'COMPLETE' &&
      item?.intelCount?.data?.SIGMA >= 0 &&
      !item?.intelCount?.data?.TTPs &&
      !item?.intelCount?.data?.IOC &&
      !item?.intelCount?.data?.CVEs
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
    }
  }

  function capitalizeFirstLetter(name: string): string {
    if (!name) return ''
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
  }

  const handleEditFileSubmit = (event: any) => {
    dispatch(updateFileTitle({ ctiName: event.urltitle }, editdata.id) as any)
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
          setEditdata(null)
        }
      })
      .catch((err: any) => console.log(err))
  }

  const handleEditFil = (data: any) => {
    setEditdata(data)
    setDialogOpen(true)
  }

  const handleDelete = () => {
    dispatch(deletedocument(token, editdata.id) as any).then((res: any) => {
      if (res.type == 'REPOSITORY_DOC_DELETE_SUCCESS') {
        toast.success(
          <CustomToast
            message='CTI report deleted Successfully'
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
        setEditdata(null)
      }
    })
  }

  const handleClickdelete = (params: any) => {
    setEditdata(params)
    setIsdleDialogOpen(true)
  }
  const dynamicMaxHeight = Math.max(300, height - 300)

  const sortedDataLists =
    sortedDataList?.length > 0
      ? sortedDataList?.filter(
          (item: any) =>
            item?.status?.toLowerCase().includes(search?.toLowerCase()) ||
            item?.url
              ?.toLowerCase()
              .includes(
                search?.toLowerCase().endsWith('\\') || search?.toLowerCase().endsWith('/')
                  ? search?.toLowerCase().slice(0, -1)
                  : search?.toLowerCase(),
              ) ||
            item?.ctiName
              ?.replace(/-/g, ' ')
              ?.toLowerCase()
              .includes(search?.replace(/-/g, ' ')?.toLowerCase()) ||
            item?.filename?.toLowerCase().includes(search?.toLowerCase()) ||
            item?.viweStatus?.toLowerCase().includes(search?.toLowerCase()) ||
            item?.intelCount?.data?.SIGMA?.toString().includes(search) ||
            moment(item.creationTime)
              .format('HH:mm')
              .toLowerCase()
              .includes(moment(search).format('HH:mm')?.toLowerCase()) ||
            moment(item.creationTime).format('HH').toLowerCase().includes(search) ||
            moment(item.creationTime).format('MMM').toLowerCase().includes(search.toLowerCase()) ||
            moment(item.creationTime).format('DD').toLowerCase().includes(search) ||
            moment(item?.creationTime)
              .format('DD-MMM HH:mm')
              .toLowerCase()
              .includes(moment(search).format('DD-MMM HH:mm')?.toLowerCase()) ||
            moment(item?.creationTime)
              .format('DD-MMM')
              .toLowerCase()
              .includes(moment(search).format('DD-MMM')?.toLowerCase()),
        )
      : []

  const ThreatActorsDisplay = ({ threatActors }: any) => {
    const actorsArray = threatActors.split(',')
    const firstActor = actorsArray[0]
    const remainingCount = actorsArray.length - 1

    return (
      <Tooltip
        title={threatActors}
        placement='bottom-start'
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: '#fff', // Set your desired color
              color: '#000', // Set text color
              fontSize: '14px', // Optional: customize font size
            },
          },
        }}
      >
        <div className='flex flex-row'>
          {firstActor}
          {remainingCount > 0 && ` +${remainingCount}`}
        </div>
      </Tooltip>
    )
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
  }

  return (
    <div
      className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full overflow-y-scroll scrollbar-hide'
      style={{ maxHeight: `${dynamicMaxHeight - 150}px` }}
    >
      {sortedDataLists?.length > 0 || cardList.length > 0 ? (
        <>
          {(sortedDataLists?.length > 0 ? sortedDataLists : cardList)?.map(
            (item: any, index: any) => (
              <div
                key={index}
                className='flex flex-col items-start justify-between h-full border border-[#3E4B5D] bg-[#1D2939] rounded-[10px] overflow-hidden cursor-pointer'
                onClick={() => onNaviaget(item)} // Attach the navigation to the card
              >
                <div className='flex flex-col items-start justify-start gap-5 p-4 md:p-6 w-full flex-grow'>
                  <div className='relative flex items-center w-full'>
                    <Tooltip
                      title={item.ctiName.replace(/-/g, ' ')}
                      placement='bottom-start'
                      componentsProps={{
                        tooltip: {
                          sx: {
                            backgroundColor: '#fff', // Set your desired color
                            color: '#000', // Set text color
                            fontSize: '14px', // Optional: customize font size
                          },
                        },
                      }}
                    >
                      <div className='text-white text-2xl  truncate overflow-hidden whitespace-nowrap pr-14 w-[85%] font-inter font-semibold'>
                        {capitalizeFirstLetter(item.ctiName.replace(/-/g, ' '))}
                      </div>
                    </Tooltip>
                    {!item.global && (
                      <div className='absolute right-0 flex items-center space-x-2'>
                        <button
                          className='p-1 text-[#fff] hover:text-[#fff] focus:outline-none'
                          onClick={(e) => {
                            e.stopPropagation() // Prevent navigation
                            handleEditFil(item)
                          }}
                        >
                          <Edit fontSize='small' />
                        </button>
                        <button
                          className='p-1 text-gray-400 hover:text-gray-400 focus:outline-none'
                          onClick={(e) => {
                            e.stopPropagation() // Prevent navigation
                            handleClickdelete(item)
                          }}
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='20'
                            height='20'
                            viewBox='0 0 24 24'
                            fill='none'
                          >
                            <path
                              d='M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M10 11.5V16.5M14 11.5V16.5M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6'
                              stroke='#fff'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className='flex flex-col items-start justify-start gap-2'>
                    <div className='text-white text-xl font-inter break-words font-semibold'>
                      {'Link'}
                    </div>
                    <a
                      className='text-[#5FB2FF] text-lg break-all font-inter line-clamp-2'
                      onClick={(e) => {
                        e.stopPropagation(), openUrls1(item)
                      }}
                    >
                      {item.reportSource === 'PDF'
                        ? `file://${item?.ctiName}`
                        : decodeURIComponent(item.url)}
                    </a>
                  </div>
                </div>

                <div className='flex items-center justify-between p-4 md:p-6 gap-6 w-full bg-[#101828] border-t border-[#3E4B5D]'>
                  {item?.status === 'COMPLETE' ? (
                    <>
                      <div className='flex flex-col items-start max-w-fit truncate gap-4'>
                        <div className='text-[#98A2B3] text-base font-inter truncate'>Rules</div>
                        <div className='text-white text-2xl font-inter font-semibold truncate'>
                          {item?.intelCount?.data?.SIGMA ? item?.intelCount?.data?.SIGMA : 0}
                        </div>
                      </div>
                      <div className='flex flex-col items-start max-w-fit truncate gap-4'>
                        <div className='text-[#98A2B3] text-base font-inter truncate'>
                          Threat Actor
                        </div>
                        <div
                          className={`text-white ${
                            (item?.threatActors?.length ?? 0) > 10
                              ? 'text-sm sm:text-lg'
                              : 'text-xl sm:text-2xl'
                          } font-inter font-semibold truncate`}
                        >
                          <>
                            {item?.threatActors ? (
                              <ThreatActorsDisplay threatActors={item?.threatActors} />
                            ) : (
                              '-'
                            )}
                          </>
                        </div>
                      </div>
                      <div className='flex flex-col items-start max-w-fit truncate gap-4'>
                        <div className='text-[#98A2B3] text-base font-inter truncate'>TTPs</div>
                        <div className='text-white text-2xl font-inter font-semibold truncate'>
                          {item?.intelCount?.data?.TTPs ? item?.intelCount?.data?.TTPs : 0}
                        </div>
                      </div>
                    </>
                  ) : item?.status === 'PROCESSING' ? (
                    <>
                      <div className='flex flex-col items-center'>
                        <div className='text-white text-lg font-inter font-semibold'>
                          Processing...
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='flex flex-col items-center'>
                        <div className='text-white text-lg font-inter font-semibold'>Failed</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ),
          )}
        </>
      ) : (
        <>
          {sortedDataLists.length == 0 || cardList.length == 0 ? (
            <div className='flex items-center justify-center'>
              <CircularProgress size='3rem' sx={{ color: '#EE7103' }} />
            </div>
          ) : (
            <div
              className='flex items-center justify-center min-h-screen mt-[-200px] text-white'
              style={{ maxHeight: `calc(${dynamicHeight}px - 75px)` }}
            >
              No results found
            </div>
          )}
        </>
      )}

      <CTiEditDilog
        isOpen={isDialogOpen}
        onClose={() => {
          setDialogOpen(false), setEditdata(null)
        }}
        handleEditFileSubmit={handleEditFileSubmit}
        editdata={editdata}
      />
      <DeleteConfirmationDialog
        isOpen={isdelDialogOpen}
        onClose={() => {
          setIsdleDialogOpen(false), setEditdata(null)
        }}
        onConfirm={handleDelete}
        message={`Are you sure you want to delete this report?`}
      />
    </div>
  )
}

export default CTIReportsCards
