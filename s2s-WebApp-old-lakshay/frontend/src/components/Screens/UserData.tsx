import { Box, Button, Menu, MenuItem } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { UserList, deleteUser } from '../../redux/nodes/users/action'
import local from '../../utils/local'
import { UserModal } from './UserModal'
import { useData } from '../../layouts/shared/DataProvider'
import useWindowResolution from '../../layouts/Dashboard/useWindowResolution'
import { getElementSpacing, sortByDateTime } from '../../utils/helper'
import TimeAgo from '../../pages/SigmaFiles/TimeAgo'

enum SortingOrder {
  Ascending = 'ascending',
  Descending = 'descending',
}

const UserData: React.FC = () => {
  const { wssProvider, setWssProvider }: any = useData()
  const { width, height } = useWindowResolution()
  const dispatch = useDispatch()
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  const [showModal, setShowModal] = useState(false)
  const [showModalRemove, setShowModalRemove] = useState(false)
  const [SampleFilter, setSampleFilter] = useState(false)
  const [Samplesort, setSamplesort] = useState(false)
  const [userdata, setuserdata] = useState([] as any)
  const [userdelete, Setuserdelete] = useState()
  const [anchorEls, setAnchorEls] = useState(null)
  const [tableHeight, setTableHeight] = useState(height)
  const userDetails = useSelector((state: any) => state.userDetailreducer)
  const { domainDetail } = userDetails
  const topActionsBarRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const navHeight = document.getElementById('navHeight')?.offsetHeight || 0
    const topActionBarHeight = topActionsBarRef.current?.offsetHeight || 0
    const { pt, pb, mt, mb } = getElementSpacing(wrapperRef.current)
    setTableHeight(height - navHeight - topActionBarHeight - pt - pb - mt - mb)
  }, [wrapperRef.current, topActionsBarRef.current , height, width])

  useEffect(() => {
    setuserdata(domainDetail)
  }, [userDetails, showModal])

  const removeuser = (params: any) => {
    setShowModalRemove(true)
    Setuserdelete(params.row.id)
  }
  const userdeletefinal = () => {
    dispatch(deleteUser(userdelete) as any).then((res: any) => {
      if (res.type == 'USER_DELETE_SUCCESS') {
        dispatch(UserList(token) as any)
      }
    })
    setShowModalRemove(false)
  }

  const getuserfullname = (Users: any) => {
    let user = Users.row.firstName
    let name = Users.row.lastName === null ? '' : Users.row.lastName
    return user + ' ' + name
  }

  const columns: GridColDef[] = [
    {
      field: 'username',
      headerName: 'Name',
      flex: 1,
      width: 200,
      minWidth: 200,
      sortable: false,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      renderCell: (params) => {
        return (
          <div>
            <p className='text-white'>{getuserfullname(params)}</p>
          </div>
        )
      },
    },

    {
      field: 'lastLoginDatetime',
      headerName: 'Last Login',
      width: 250,
      sortable: true,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      sortComparator: sortByDateTime,
      renderCell(params) {
        return (
          <div>
            {params?.row?.lastLoginDatetime ? (<TimeAgo createdAt={params?.row?.lastLoginDatetime} />) : (
              <>
                {'-'}
              </>
            )}
          </div>
        )
      },
    },

    {
      field: 'email',
      headerName: 'Email Address',
      width: 450,
      sortable: false,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      renderCell(params) {
        return (
          <div>
            <p className='text-white'>{params.row.email}</p>
          </div>
        )
      },
    },

    {
      field: 'g',
      headerName: '',
      width: 20,
      sortable: false,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      renderCell: (params: any) => {
        return (
          <>
            <button onClick={() => removeuser(params)}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='none'
              >
                <path
                  d='M13.75 13.3333L17.9167 17.5M17.9167 13.3333L13.75 17.5M9.99999 12.9167H6.24999C5.08702 12.9167 4.50554 12.9167 4.03237 13.0602C2.96704 13.3834 2.13336 14.217 1.81019 15.2824C1.66666 15.7555 1.66666 16.337 1.66666 17.5M12.0833 6.25C12.0833 8.32107 10.4044 10 8.33332 10C6.26226 10 4.58332 8.32107 4.58332 6.25C4.58332 4.17893 6.26226 2.5 8.33332 2.5C10.4044 2.5 12.0833 4.17893 12.0833 6.25Z'
                  stroke='#fff'
                  strokeWidth='1.66667'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
          </>
        )
      },
    },
  ]

  const onSearch = (e: any) => {
    const query = e.target.value
    let data = [...domainDetail]
    data = data?.filter((value: any) =>
      value?.firstName?.toLowerCase().includes(query?.toLowerCase()),
    )
    setuserdata(data)
  }

  const handleSortingOrderChange = (event: any) => {
    const sortedValues = userDetails.domainDetail
      .slice()
      .sort((a: any, b: any) =>
        event === SortingOrder.Ascending
          ? a.firstName?.localeCompare(b.firstName)
          : b.firstName?.localeCompare(a.firstName),
      )
    handleMenuClose()
    setuserdata(sortedValues)
  }

  const handleSortingmailChange = (event: any) => {
    const sortedValues = userDetails.domainDetail
      .slice()
      .sort((a: any, b: any) =>
        event === SortingOrder.Ascending
          ? a.email?.localeCompare(b.email)
          : b.email?.localeCompare(a.email),
      )
    handleMenuClose()
    setuserdata(sortedValues)
  }

  const handleMenuOpen = (event: any) => {
    setAnchorEls(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEls(null)
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

  useEffect(() => {
    if (wssProvider) {
      if (wssProvider?.eventType == 'user created' || wssProvider?.eventType == 'user deleted') {
        dispatch(UserList(token) as any)
        setWssProvider(null)
      }
    }
  }, [wssProvider])

  return (
    <div className='p-6 pt-[10px]' ref={wrapperRef}>
      {domainDetail?.length > 0 ? (
        <>
          <div className='pb-6' ref={topActionsBarRef}>
            <div className='flex items-center gap-4 max-md:flex-wrap'>
              <div className='flex items-center max-md:w-full'>
                <div className='flex items-stretch max-md:w-full'>
                  <input
                    type='search'
                    className='relative m-0 block w-80 flex-auto rounded-l-lg p-1.5 border-t border-l border-b border-solid border-[#6E7580] bg-[#48576C] text-base font-normal leading-[1.6] text-white hover:border-[#6E7580] focus:outline-none focus:border-[#6E7580]'
                    placeholder='Search for a user'
                    aria-label='Search'
                    aria-describedby='button-addon2'
                    onChange={(e) => onSearch(e)}
                  />
                  <button
                    className='input-group-text bg-[#48576C] w-10 flex p-1.5 items-center border-t border-b border-r border-solid border-[#6E7580] whitespace-nowrap rounded-r-lg px-3 py-1.5 text-center text-base font-normal text-white'
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
                        stroke='#fff'
                        strokeWidth='1.66667'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className='flex justify-between items-center gap-4 w-full flex-wrap'>
                <Button
                  disableRipple
                  sx={{
                    textAlign: 'center',
                    color: '#FBFBFB',
                    backgroundColor: '#48576C',
                    textTransform: 'capitalize',
                    border: '1px solid #6E7580',
                    borderRadius: '8px',
                  }}
                  aria-label='menu'
                  onClick={handleMenuOpen}
                  className='hover:!bg-[#32435A]'
                >
                  Sort by
                  <div className='pl-2 pr-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='20'
                      height='20'
                      viewBox='0 0 20 20'
                      fill='none'
                    >
                      <path
                        d='M14.1667 3.3335V12.5002M14.1667 12.5002L10.8333 9.16683M14.1667 12.5002L17.5 9.16683M5.83333 3.3335V16.6668M5.83333 16.6668L2.5 13.3335M5.83333 16.6668L9.16667 13.3335'
                        stroke='#fff'
                        strokeWidth='1.66667'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </div>
                </Button>
                <Menu
                  anchorEl={anchorEls}
                  open={Boolean(anchorEls)}
                  onClose={handleMenuClose}
                  className='mt-[10px]'
                  sx={{
                    '.MuiPaper-root': {
                      backgroundColor: '#48576C',
                      borderRadius: '8px',
                      color: '#FBFBFB',
                      border: '1px solid #6E7580',
                    },
                    '.MuiMenuItem-root:hover': {
                      backgroundColor: '#32435A',
                    },
                  }}
                >
                  <MenuItem onClick={() => handleSortingOrderChange(SortingOrder.Ascending)}>
                    Name (A to Z)
                  </MenuItem>
                  <MenuItem onClick={() => handleSortingOrderChange(SortingOrder.Descending)}>
                    Name (Z to A)
                  </MenuItem>
                  <MenuItem onClick={() => handleSortingmailChange(SortingOrder.Ascending)}>
                    Email Address (A to Z)
                  </MenuItem>
                  <MenuItem onClick={() => handleSortingmailChange(SortingOrder.Descending)}>
                    Email Address (Z to A)
                  </MenuItem>
                </Menu>
                <button
                  className='bg-[#EE7103] hover:bg-[#EE7103] text-white font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2'
                  onClick={() => setShowModal(true)}
                >
                  <span>Invite User</span>

                  <svg
                    width='20'
                    height='16'
                    viewBox='0 0 20 16'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M17.9167 13.0007L12.381 8.00065M7.61913 8.00065L2.08344 13.0007M1.66675 3.83398L8.47085 8.59685C9.02182 8.98254 9.29731 9.17538 9.59697 9.25007C9.86166 9.31605 10.1385 9.31605 10.4032 9.25007C10.7029 9.17538 10.9783 8.98254 11.5293 8.59685L18.3334 3.83398M5.66675 14.6673H14.3334C15.7335 14.6673 16.4336 14.6673 16.9684 14.3948C17.4388 14.1552 17.8212 13.7727 18.0609 13.3023C18.3334 12.7675 18.3334 12.0674 18.3334 10.6673V5.33398C18.3334 3.93385 18.3334 3.23379 18.0609 2.69901C17.8212 2.2286 17.4388 1.84615 16.9684 1.60647C16.4336 1.33398 15.7335 1.33398 14.3334 1.33398H5.66675C4.26662 1.33398 3.56655 1.33398 3.03177 1.60647C2.56137 1.84615 2.17892 2.2286 1.93923 2.69901C1.66675 3.23379 1.66675 3.93385 1.66675 5.33398V10.6673C1.66675 12.0674 1.66675 12.7675 1.93923 13.3023C2.17892 13.7727 2.56137 14.1552 3.03177 14.3948C3.56655 14.6673 4.26662 14.6673 5.66675 14.6673Z'
                      stroke='currentColor'
                      stroke-width='1.66667'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div style={{ height: tableHeight }}>
            <Box
              sx={{
                height: '100%',
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
                '  .css-yrdy0g-MuiDataGrid-columnHeaderRow': {
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
                '.MuiCheckbox-colorPrimary': {
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
              <div style={{ height: '100%', width: '100%' }}>
                <DataGrid
                  sx={{
                    color: 'white',
                    border: 'none',
                    '&>.MuiDataGrid-main': {
                      '&>.MuiDataGrid-columnHeaders': {
                        borderBottom: '1px solid #32435A',
                      },
                      borderRadius: '12px',
                      border: '1px solid #32435A',
                    },
                    '.MuiDataGrid-footerContainer': {
                      border: 0,
                    },
                    '& .MuiDataGrid-row': {
                      border: '1px solid #32435A',
                      backgroundColor: '#0F121B',
                    },
                    '& .MuiDataGrid-columnHeader:first-child .MuiDataGrid-columnSeparator': {
                      display: 'none',
                    },
                    '& .hideRightSeparator > .MuiDataGrid-columnSeparator': {
                      display: 'none',
                    },
                    '& .super-app-theme--header': {
                      backgroundColor: '#808080',
                      color: '#FFFFFF',
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
                    '  .css-yrdy0g-MuiDataGrid-columnHeaderRow': {
                      backgroundColor: '#32435A !important',
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
                  rows={userdata ? userdata : []}
                  columns={columns}
                  pagination
                  hideFooterSelectedRowCount
                  disableColumnMenu
                  classes={{
                    columnHeadersInner: 'user-data-grid-columnHeadersInner',
                    sortIcon: 'user-data-grid-sortIcon',
                    footerContainer: 'user-data-grid-footerContainer',
                  }}
                  components={{
                    NoRowsOverlay: CustomNoRowsOverlay,
                  }}
                />
              </div>
            </Box>
          </div>
          {showModalRemove ? (
            <>
              <div className='justify-center backdrop-blur-sm items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none p-35 font-inter'>
                <div className='md:text-sm 2xl:text-lg relative w-[400px] mx-auto'>
                  <div className='p-6 md:text-sm 2xl:text-lg border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-[#1D2939] outline-none focus:outline-none gap-6'>
                    <div className='flex flex-col gap-4 items-center justify-center'>
                      <div className='rounded-full p-[10px] bg-[#32435A]'>
                        <svg
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M16.5 16L21.5 21M21.5 16L16.5 21M12 15.5H7.5C6.10444 15.5 5.40665 15.5 4.83886 15.6722C3.56045 16.06 2.56004 17.0605 2.17224 18.3389C2 18.9067 2 19.6044 2 21M14.5 7.5C14.5 9.98528 12.4853 12 10 12C7.51472 12 5.5 9.98528 5.5 7.5C5.5 5.01472 7.51472 3 10 3C12.4853 3 14.5 5.01472 14.5 7.5Z'
                            stroke='white'
                            stroke-width='2'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                        </svg>
                      </div>
                      <div className='flex flex-col gap-2 items-center justify-center'>
                        <h6 className='md:text-md text-[18px] text-white 2xl:text-lg  text-1xl  font-semibold justify-center items-center text-center'>
                          Remove User
                        </h6>
                        <p className='md:text-sm 2xl:text-lg justify-center text-[#98A2B3] text-sm items-center text-center mt-2'>
                          Are you sure about deleting the user?
                        </p>
                      </div>
                    </div>
                    <div className='flex border-solid border-slate-200 rounded-b gap-4'>
                      <button
                        type='button'
                        className='md:text-sm 2xl:text-lg  w-full bg-white text-sm font-semibold text-[#182230] border-[1px] border-solid border-[#D0D5DD] rounded-lg justify-center font-bold px-3 py-2 text-xs inline-flex '
                        onClick={() => setShowModalRemove(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className='md:text-sm 2xl:text-lg w-full bg-[#D92D20] text-white justify-center font-semibold rounded-lg px-3 py-2 text-xs font-medium inline-flex '
                        type='button'
                        onClick={() => userdeletefinal()}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
            </>
          ) : null}
          {showModal ? <UserModal action={setShowModal}></UserModal> : null}
        </>
      ) : (
        <>
          {(domainDetail !== undefined || domainDetail?.length == 0) && (
            <main className='grid place-items-center px-6 py-24 sm:py-24 lg:px-8 xl:px-8 2xl:py-64'>
              <span
                className='input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-neutral-700'
                id='basic-addon2'
              >
                <svg
                  className='mt-[5.5rem] 2xl:mt-[2.4rem] h-5 w-5'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  stroke='white'
                >
                  <path
                    fillRule='evenodd'
                    d='M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z'
                    clipRule='evenodd'
                  />
                </svg>
              </span>
              <div className='text-center'>
                <h4 className='text-3xl font-bold text-white'>No User found</h4>
                <br />
                <br />
                <button
                  className='bg-[#EE7103] hover:bg-[#EE7103] text-white  font-bold py-2 px-4 rounded inline-flex items-center'
                  onClick={() => setShowModal(true)}
                >
                  <span>Invite User</span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='w-7 h-6 '
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75'
                    />
                  </svg>
                </button>
              </div>
            </main>
          )}
        </>
      )}
    </div>
  )
}

export default UserData
