import { MoreVert } from '@mui/icons-material'
import EditIcon from '@mui/icons-material/Edit'
import { Button, Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React, { Fragment, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CustomToast from '../../../layouts/App/CustomToast'
import useWindowResolution from '../../../layouts/Dashboard/useWindowResolution'
import { CollectiondataDelete, getallCollection } from '../../../redux/nodes/Collections/action'
import CreateCollectionModal from './CreateCollectionModal'
import DeleteConfirmationDialog from './DeleteConfirmationDialog'
import CollectionsListView from './CollectionsListView'
import CollectionsGridView from './CollectionsGridView'
import { Divider } from '@mui/material'
import { maxHeight } from '@mui/system'

function CollectionsList({ setCollectionList, inboxList, setdeletvale }: any) {
  const [isdelDialogOpen, setIsdleDialogOpen] = useState(false)
  const navigateTo = useNavigate()
  const [search, setSearch] = useState<string>('')
  const [isModalOpen, setModalOpen] = useState(false)
  const [ispost, setisPost] = useState(null as any)
  const [collectiondata, setCollectiondata] = useState([] as any)
  const [editdata, seteditdata] = useState(null as any)
  const [anchorEls, setAnchorEls] = useState(null)
  const [confirmation, setConfirmation] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null as any)
  const dispatch = useDispatch()
  const { width, height } = useWindowResolution()
  const dynamicHeight = Math.max(400, height * 0.8)
  const [loader, setLoader] = useState(true as any)
  const [deleting, setDeleting] = useState(false as any)
  useEffect(() => {
    fetchDetails()
  }, [])
  useEffect(() => {
    if (ispost == 'Add') {
      fetchDetails()
    }
  }, [ispost])

  const fetchDetails = () => {
    dispatch(getallCollection() as any).then((res: any) => {
      setLoader(true)
      if (res?.type == 'COLLECTION_GET_SUCCESS') {
        if (Array.isArray(res.payload)) {
          const allData: any = [...res.payload]
          sessionStorage.setItem('collectionList', JSON.stringify(allData))
          setCollectionList(allData)
          setCollectiondata(allData)
          setisPost(null)
        } else {
          setCollectiondata([])
        }
      } else {
        setCollectiondata([])
      }
      setLoader(false)
    })
  }

  const hanleNavigate = (data: any) => {
    localStorage.setItem('collectiondetails', JSON.stringify(data))
    navigateTo(`/app/collectionsigmarule/${data?.id}`, { state: { title: data?.name } })
  }

  const handleMenuClose = () => {
    setAnchorEls(null)
  }
  const handleMenuOpen = (event: any) => {
    setAnchorEls(event.currentTarget)
  }

  const handleEdit = (data: any) => {
    setModalOpen(true)
    seteditdata(data)
  }

  enum SortingOrder {
    Ascending = 'ascending',
    Descending = 'descending',
  }
  const handleSortingOrderChange = (event: any) => {
    const sortedValues = collectiondata
      ?.slice()
      .sort((a: any, b: any) =>
        event === SortingOrder.Ascending
          ? a.name?.localeCompare(b.name)
          : b.name?.localeCompare(a.name),
      )
    if (collectiondata?.length > 0) setCollectiondata(sortedValues)
    else setCollectiondata(sortedValues)

    handleMenuClose()
  }

  const handleDelete = () => {}
  const handleDeletes = (data: any) => {
    setDeleting(true)
    dispatch(CollectiondataDelete(data?.id) as any).then((res: any) => {
      if (res.type == 'COLLECTION_DELETE_SUCCESS') {
        setDeleting(false)
        setdeletvale('alldelete')
        toast.success(
          <CustomToast
            message='Collection deleted successfully.'
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
        fetchDetails()
        setIsdleDialogOpen(false)
        setConfirmation(false)
        seteditdata(null)
        setisPost(null)
      } else {
        setDeleting(false)
        setdeletvale('alldelete')
        fetchDetails()
        setIsdleDialogOpen(false)
        setConfirmation(false)
        seteditdata(null)
        setisPost(null)
      }
    })
    setIsdleDialogOpen(false)
  }

  const filterdata: any =
    collectiondata?.length > 0
      ? collectiondata?.filter((collection: any) =>
          collection?.name?.toLowerCase().includes(search.toLowerCase()),
        )
      : []

  useEffect(() => {
    if (loader) {
      setTimeout(() => {
        setLoader(false)
      }, 2000)
    }
  }, [loader])
  const tabitem: any = JSON.parse(sessionStorage.getItem('colactiveTab') as any)
  const [activeTab, setActiveTab] = useState(tabitem ? Number(tabitem) : ('list' as any))

  const handletabchange = (text: any) => {
    setActiveTab(text)
    sessionStorage.setItem('colactiveTab', JSON.stringify(text))
  }

  const mainContentStyles = {
    maxHeight: 'calc(100vh - 40px - 212px - 36px - 32px - 24px - 42px - 24px)',
    overflow: 'scroll',
  }

  const normalStyles = {
    height: '500px',
    overflow: 'scroll',
  }

  return (
    <div className='w-full'>
      <div className='mb-6 flex items-center justify-between gap-4 w-full max-lg:flex-wrap'>
        {/* Search Box */}
        <div className='max-lg:w-full'>
          <div className='flex items-center space-x-2 bg-dark max-lg:w-full'>
            <div className='flex items-center box-border bg-[#48576c] p-2 rounded-lg border border-[#6e7580] w-[376px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] max-lg:w-full'>
              <input
                type='text'
                placeholder='Search'
                className='bg-[#48576c] outline-none rounded-l-lg text-[#fff] w-full  placeholder-[#fff]'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='none'
              >
                <path
                  d='M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z'
                  stroke='white'
                  stroke-width='1.66667'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                />
              </svg>
            </div>
          </div>
        </div>

        <div className='relative  flex flex-wrap items-stretch max-lg:ml-auto'>
          <Button
            disableRipple
            sx={{
              textAlign: 'center',
              color: '#fff',
              backgroundColor: '#48576c',
              textTransform: 'capitalize',
              border: '2px solid #6e7580',
              height: '2.5rem',
              borderRadius: '8px',
              ':hover': {
                bgcolor: '#48576c',
                color: '#fff',
              },
            }}
            aria-label='menu'
            onClick={handleMenuOpen}
          >
            Sort by
            <div className='pl-2 pr-2 pt-1'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='none'
              >
                <path
                  d='M14.1667 3.33337V12.5M14.1667 12.5L10.8333 9.16671M14.1667 12.5L17.5 9.16671M5.83333 3.33337V16.6667M5.83333 16.6667L2.5 13.3334M5.83333 16.6667L9.16667 13.3334'
                  stroke='#FBFBFB'
                  stroke-width='1.66667'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                />
              </svg>
            </div>
          </Button>
          <Menu
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: '#48576c',
                color: '#fff',
                border: '1px solid #6e7580',
                borderRadius: 2,
              },
            }}
            anchorEl={anchorEls}
            open={Boolean(anchorEls)}
            onClose={handleMenuClose}
          >
            <MenuItem
              sx={{ backgroundColor: '#48576c', color: '#fff' }}
              onClick={() => handleSortingOrderChange(SortingOrder.Ascending)}
            >
              Collection Name (A to Z)
            </MenuItem>
            <MenuItem
              sx={{ backgroundColor: '#48576c', color: '#fff' }}
              onClick={() => handleSortingOrderChange(SortingOrder.Descending)}
            >
              Collection Name (Z to A)
            </MenuItem>
          </Menu>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-4 ml-auto max-lg:ml-0'>
          <div className='flex gap-1 ml-auto'>
            <button
              onClick={() => setModalOpen(true)}
              className='bg-orange-600 text-white py-1 px-4 rounded-lg'
            >
              Create Collection
            </button>
          </div>
        </div>
      </div>
      <div style={ width > 768 ? mainContentStyles : normalStyles} className='scrollbar-hide'>
        {filterdata.length > 0 ? (
          <>
            <div
              className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 overflow-y-scroll scrollbar-hide'
            >
              {filterdata.map((card: any, index: any) => (
                <Fragment key={card?.id ?? index}>
                  <div className='bg-[#2B3A55] rounded-[10px]'>
                    <div
                      onClick={() =>
                        selectedIndex == index || deleting ? undefined : hanleNavigate(card)
                      }
                      key={index}
                      className={`cursor-pointer relative flex flex-col items-start justify-between h-full border border-[#3E4B5D] bg-[#1D2939] rounded-[10px] overflow-hidden`}
                    >
                      <div className='flex flex-col items-start justify-start gap-2 p-4 md:p-6 w-full flex-grow'>
                        <div className='flex justify-between items-center w-full text-[#fff]'>
                          <p className='text-white text-2xl truncate overflow-hidden whitespace-nowrap pr-8 w-[85%] font-inter font-semibold'>
                            <Tooltip
                              title={card.name}
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
                              {card.name}
                            </Tooltip>
                          </p>
                          {card?.id != inboxList?.id && (
                            <>
                              {(!confirmation || selectedIndex != index) && (
                                <>
                                  <div className='flex gap-[10px]'>
                                    <span
                                      className='cursor-pointer'
                                      onClick={(e) => {
                                        handleEdit(card)
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
                                        fill={'none'}
                                      >
                                        <path
                                          d='M13.3333 5.0013V4.33464C13.3333 3.40121 13.3333 2.9345 13.1517 2.57798C12.9919 2.26438 12.7369 2.00941 12.4233 1.84962C12.0668 1.66797 11.6001 1.66797 10.6667 1.66797H9.33333C8.39991 1.66797 7.9332 1.66797 7.57668 1.84962C7.26308 2.00941 7.00811 2.26438 6.84832 2.57798C6.66667 2.9345 6.66667 3.40121 6.66667 4.33464V5.0013M8.33333 9.58464V13.7513M11.6667 9.58464V13.7513M2.5 5.0013H17.5M15.8333 5.0013V14.3346C15.8333 15.7348 15.8333 16.4348 15.5608 16.9696C15.3212 17.44 14.9387 17.8225 14.4683 18.0622C13.9335 18.3346 13.2335 18.3346 11.8333 18.3346H8.16667C6.76654 18.3346 6.06647 18.3346 5.53169 18.0622C5.06129 17.8225 4.67883 17.44 4.43915 16.9696C4.16667 16.4348 4.16667 15.7348 4.16667 14.3346V5.0013'
                                          stroke={'#fff'}
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
                                        handleDeletes(card)
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
                        {card.description && (
                          <h5
                            className={`text-[#98A2B3] font-inter font-medium text-sm leading-5 text-gray-400 break-all line-clamp-2`}
                          >
                            <Tooltip
                              title={card?.description}
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
                              {card.description}
                            </Tooltip>
                          </h5>
                        )}
                      </div>

                      <div className='flex items-center justify-between p-4 md:p-6 gap-6 w-full bg-[#101828] border-t border-[#3E4B5D]'>
                        <div className='flex flex-col items-start max-w-fit truncate gap-4'>
                          <p className='text-[#98A2B3] text-lg font-inter truncate'>SIGMA FILES</p>
                          <p className='text-white text-2xl font-inter font-semibold truncate'>
                            {card?.docCount}
                          </p>
                        </div>
                      </div>

                      {confirmation && selectedIndex == index && deleting && (
                        <div className='absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center rounded-lg'>
                          <p className='text-white font-medium text-lg'>Deleting...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </>
        ) : (
          <>
            {filterdata.length == 0 && loader ? (
              <div className='flex items-center justify-center'>
                <CircularProgress size='3rem' sx={{ color: '#EE7103' }} />
              </div>
            ) : (
              <div className='flex items-center justify-center text-white'>No results found</div>
            )}
          </>
        )}
      </div>
      <CreateCollectionModal
        isOpen={isModalOpen}
        onClose={() => (setModalOpen(false), seteditdata(null))}
        setModalOpen={setModalOpen}
        setisPost={setisPost}
        editdata={editdata}
        cardList={filterdata}
        seteditdata={seteditdata}
      />

      <DeleteConfirmationDialog
        isOpen={isdelDialogOpen}
        onClose={() => {
          setIsdleDialogOpen(false), seteditdata(null)
        }}
        onConfirm={handleDelete}
        message='Are you sure you want to permanently delete this item?'
      />
    </div>
  )
}

export default CollectionsList
