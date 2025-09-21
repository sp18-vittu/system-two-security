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
  const { height } = useWindowResolution()
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

  const handleDelete = () => { }
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
  }, [loader]);
  const tabitem: any = JSON.parse(sessionStorage.getItem('colactiveTab') as any)
  const [activeTab, setActiveTab] = useState(tabitem ? Number(tabitem) : ('list' as any))

  const handletabchange = (text: any) => {
    setActiveTab(text)
    sessionStorage.setItem('colactiveTab', JSON.stringify(text))
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
            <div className='flex'>
              <button
                className={`${(tabitem ? tabitem : activeTab) == 'list' ? 'bg-[#48576C]' : 'bg-[#0F121B]'
                  } text-white py-1 px-4 rounded-l-lg border border-[#48576C] font-inter font-semibold`}
                onClick={() => handletabchange('list')}
              >
                LIST
              </button>
              <button
                className={`${(tabitem ? tabitem : activeTab) == 'grid' ? 'bg-[#48576C]' : 'bg-[#0F121B]'
                  } text-white py-1 px-4 rounded-r-lg border border-[#48576C] font-inter font-semibold`}
                onClick={() => handletabchange('grid')}
              >
                GRID
              </button>
            </div>
            <Divider orientation='vertical' flexItem sx={{ borderColor: '#c2c8d3', mx: 2 }} />
            <button
              onClick={() => setModalOpen(true)}
              className='bg-orange-600 text-white py-1 px-4 rounded-lg'
            >
              Create Collection
            </button>
          </div>
        </div>
      </div>
      {(tabitem ? tabitem : activeTab) == 'grid' && (<CollectionsGridView filterdata={filterdata} hanleNavigate={hanleNavigate} dynamicHeight={dynamicHeight} inboxList={inboxList} confirmation={confirmation} selectedIndex={selectedIndex} handleEdit={handleEdit} setConfirmation={setConfirmation} setSelectedIndex={setSelectedIndex} handleDeletes={handleDeletes} loader={loader} deleting={deleting} />)}
      {(tabitem ? tabitem : activeTab) == 'list' && (<CollectionsListView filterdata={filterdata} hanleNavigate={hanleNavigate} dynamicHeight={dynamicHeight} inboxList={inboxList} confirmation={confirmation} selectedIndex={selectedIndex} handleEdit={handleEdit} setConfirmation={setConfirmation} setSelectedIndex={setSelectedIndex} handleDeletes={handleDeletes} loader={loader} deleting={deleting} />)}
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
