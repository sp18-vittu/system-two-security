import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useData } from '../../layouts/shared/DataProvider'
import { Box } from '@mui/material'
import { useDispatch } from 'react-redux'
import { ctiReportFileList } from '../../redux/nodes/cti-report/action'
import local from '../../utils/local'
import { dataVaultid } from '../../redux/nodes/datavault/action'
import { createChat } from '../../redux/nodes/chatPage/action'
import { useLocation } from 'react-router-dom'

const SelectCtiRepo = () => {
  const { data, CTIReport }: any = useData()
  const { id } = useParams()

  const dispatch = useDispatch()
  const navigateTo = useNavigate()
  const location = useLocation()
  const { state } = location

  const localToken = local.getItem('bearerToken')
  const token = JSON.parse(localToken as any)
  const [dataVaultSideBarOpenStatus, setDataVaultSideBarOpenStatus] = useState(null as any)
  const [sideBarOpenStatus, setSideBarOpenStatus] = useState(null as any)
  const [selectedDataVault, setSelectedDataVault] = useState({} as any)
  const [selectedRows, setSelectedRows] = useState({} as any)
  const selectedRowsLength = Object.keys(selectedRows).length
  const [ctiList, setCtiList] = useState([])
  const [filteredCtiList, setFilteredCtiList] = useState([])
  const [searchValue, setSearchValue] = useState('')

  const [selectionModel, setSelectionModel] = useState([CTIReport?.value?.id] as any)

  const prevId = useRef<any>(null)

  useEffect(() => {
    if (data && data.from == 'dashBoard') {
      setDataVaultSideBarOpenStatus(data.value.subDatavaultMenu)
      setSideBarOpenStatus(data.value.sideBar)
    }
    if (id && id !== prevId.current) {
      dispatch(ctiReportFileList(token, state) as any)
        .then((res: any) => {
          if (res.type == 'CTI_REPORT_FILE_SUCCESS') {
            let dataValue: any = []
            res.payload
              .filter((item: any) => {
                return item.status == 'COMPLETE' && item?.intelCount?.data?.SIGMA > 0
              })
              .map((item: any) => {
                dataValue.push(item)
              })
            if (CTIReport?.from == 'Homepage') {
              let data = res.payload.filter((item: any) => {
                return (
                  item.status == 'COMPLETE' &&
                  item?.intelCount?.data?.SIGMA > 0 &&
                  item.id === CTIReport?.value?.id
                )
              })
              setSelectedRows(data)
            }
            setCtiList(dataValue)
            setFilteredCtiList(dataValue)
          }
        })
        .catch((err: any) => console.log('err', err))
      let dataVault = {
        global: false,
      }
      dispatch(dataVaultid(id, dataVault, token) as any)
        .then((res: any) => {
          if (res.type == 'DATAVAULT_INDIVIDUAL_ID_SUCCESS') {
            setSelectedDataVault(res.payload)
          }
        })
        .catch((err: any) => console.log('err', err))
      prevId.current = id
    }
    let filterValue = ctiList.filter((cti: any) => {
      if (cti.ctiName.toLowerCase().includes(searchValue.toLowerCase())) return cti
    })
    setFilteredCtiList(filterValue)
  }, [data, id, searchValue])

  const startChat = () => {
    const ctiFileName = selectedRows[0].ctiName
    const selectedVault = sessionStorage.getItem('vault')
    const vault = JSON.parse(selectedVault as any)
    let chatObj: any = {
      sessionName: ctiFileName,
    }
    if (vault.name == 'Hunt of the day') {
      chatObj.global = vault.global
    }
    let selectFiles = selectedRows.find((x: any) => x)
    selectFiles.vaultId = id
    dispatch(createChat(selectFiles, chatObj) as any).then((response: any) => {
      if (response.type == 'CREATE_CHAT_SUCCESS') {
        navigateTo(`/app/ChatView/${response.payload.id}`, { state: selectFiles })
      }
    })
  }
  const rowValues = filteredCtiList.filter((item: any) => item.status == 'COMPLETE')

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

  const columns: GridColDef[] = [
    {
      field: 'ctiName',
      headerName: 'CTI Reports',
      flex: 1,
      minWidth: 180,
      sortable: false,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      renderCell(params) {
        return (
          <div className='flex truncate w-full'>
            {params.row.status == 'COMPLETE' && (
              <>
                <div className='flex justify-center items-center gap-[12px]'>
                  <span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='36'
                      height='36'
                      viewBox='0 0 36 36'
                      fill='none'
                    >
                      <path
                        d='M17.9999 1.33337C22.9999 4.66671 24.5378 11.8201 24.6666 18C24.5378 24.18 22.9999 31.3334 17.9999 34.6667M17.9999 1.33337C12.9999 4.66671 11.462 11.8201 11.3333 18C11.462 24.18 12.9999 31.3334 17.9999 34.6667M17.9999 1.33337C8.79517 1.33337 1.33325 8.79529 1.33325 18M17.9999 1.33337C27.2047 1.33337 34.6666 8.79529 34.6666 18M17.9999 34.6667C27.2047 34.6667 34.6666 27.2048 34.6666 18M17.9999 34.6667C8.79518 34.6667 1.33325 27.2048 1.33325 18M34.6666 18C31.3333 23 24.1799 24.538 17.9999 24.6667C11.82 24.538 4.66659 23 1.33325 18M34.6666 18C31.3333 13 24.1799 11.4621 17.9999 11.3334C11.82 11.4621 4.66659 13 1.33325 18'
                        stroke='white'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </span>
                  <span>
                    <p>{params.row.ctiName}</p>
                    <p>{params.row.url}</p>
                  </span>
                </div>
              </>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className='P-[32px] overflow-hidden'>
      {!id && (
        <div
          className={`p-[48px]  relative transition-all duration-500 transform 
                    ${
                      !sideBarOpenStatus &&
                      dataVaultSideBarOpenStatus &&
                      dataVaultSideBarOpenStatus != null
                        ? 'translate-x-[20rem] w-6/12'
                        : 'w-full'
                    }
                    ${
                      sideBarOpenStatus &&
                      dataVaultSideBarOpenStatus &&
                      dataVaultSideBarOpenStatus != null
                        ? 'translate-x-[20.5rem] w-6/12'
                        : 'w-full'
                    }`}
        >
          <div className='border border-dashed border-gap-8  rounded-lg p-[16px] w-[560px] h-[116px]'>
            <p className='text-white font-semibold font-inter text-sm leading-5'>
              Select Repository to get a list of CTI Reports
            </p>
            <p className='text-gray-500 font-normal mt-[2px] font-inter text-sm leading-5'>
              Your default focus will set to ‘CTI Report’ you choose. You can change chat focus or
              question focus to ‘Threat Intel’ for broader questions, or ‘Auto’ for AI to make the
              decision for you
            </p>
          </div>
        </div>
      )}
      {id && (
        <>
          <div className='text-white p-[32px]'>
            <div className='flex justify-between'>
              <div>
                <p className='text-white font-semibold font-inter text-[23px] leading-6'>
                  {selectedDataVault?.name}
                </p>
              </div>
              <div>
                <div className='flex'>
                  <div>
                    <form className='max-w-md mx-auto w-[360px] mr-4 '>
                      <label className='mb-2 text-sm font-medium text-gray-900 sr-only'>
                        Search
                      </label>
                      <div className='relative'>
                        <input
                          type='search'
                          id='default-search'
                          onChange={(e) => setSearchValue(e.target.value)}
                          className='block w-full h-[37px] p-4 ps-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500'
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
                  <div>
                    <button
                      disabled={selectedRowsLength == 0 ? true : false}
                      type='button'
                      onClick={startChat}
                      className={`px-[12px] py-[6px] bg-[#EE7103] w-[148px] h-[36px] rounded-[8px] flex ${
                        selectedRowsLength == 0
                          ? 'cursor-not-allowed opacity-50'
                          : 'hover:bg-[#6941C6]'
                      }`}
                    >
                      <span>Start Chating</span>
                      <span className='pl-1 mt-1 inline'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='20'
                          height='20'
                          viewBox='0 0 20 20'
                          fill='none'
                        >
                          <path
                            d='M8.33335 12.5L5.77064 15.0947C5.41317 15.4566 5.23444 15.6376 5.08081 15.6504C4.94753 15.6614 4.81703 15.6079 4.72999 15.5063C4.62965 15.3893 4.62965 15.1349 4.62965 14.6262V13.3263C4.62965 12.8699 4.25592 12.5397 3.80436 12.4736V12.4736C2.71147 12.3135 1.85317 11.4552 1.69308 10.3623C1.66669 10.1821 1.66669 9.96706 1.66669 9.537V5.66663C1.66669 4.26649 1.66669 3.56643 1.93917 3.03165C2.17885 2.56124 2.56131 2.17879 3.03171 1.93911C3.56649 1.66663 4.26656 1.66663 5.66669 1.66663H11.8334C13.2335 1.66663 13.9336 1.66663 14.4683 1.93911C14.9387 2.17879 15.3212 2.56124 15.5609 3.03165C15.8334 3.56643 15.8334 4.26649 15.8334 5.66663V9.16663M15.8334 18.3333L14.0197 17.0724C13.7647 16.8951 13.6373 16.8065 13.4985 16.7437C13.3754 16.6879 13.2459 16.6473 13.113 16.6228C12.9632 16.5952 12.808 16.5952 12.4975 16.5952H11C10.0666 16.5952 9.59989 16.5952 9.24337 16.4135C8.92977 16.2538 8.6748 15.9988 8.51501 15.6852C8.33335 15.3287 8.33335 14.862 8.33335 13.9285V11.8333C8.33335 10.8999 8.33335 10.4332 8.51501 10.0766C8.6748 9.76304 8.92977 9.50807 9.24337 9.34828C9.59989 9.16663 10.0666 9.16663 11 9.16663H15.6667C16.6001 9.16663 17.0668 9.16663 17.4233 9.34828C17.7369 9.50807 17.9919 9.76304 18.1517 10.0766C18.3334 10.4332 18.3334 10.8999 18.3334 11.8333V14.0952C18.3334 14.8718 18.3334 15.2601 18.2065 15.5663C18.0373 15.9747 17.7129 16.2992 17.3045 16.4683C16.9982 16.5952 16.6099 16.5952 15.8334 16.5952V18.3333Z'
                            stroke='white'
                            strokeWidth='1.66667'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='p-[32px]'>
            <Box
              sx={{
                mt: '-28px',
                height: '80%',
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
              <div style={{ height: '65vh', overflow: 'auto' }}>
                <DataGrid
                  sx={{
                    boxShadow: 10,
                    color: 'white',
                    border: 'none',
                    height: '100%',
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
                    '& .MuiDataGrid-row.Mui-selected': {
                      backgroundColor: '#6941C6 !important', // Change background color for selected rows
                    },
                    '& .MuiDataGrid-row:hover': {
                      backgroundColor: '#6941C6 !important',
                      cursor: 'pointer',
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
                  rows={rowValues}
                  columns={columns}
                  getRowHeight={() => 65}
                  checkboxSelection={false}
                  pagination
                  isRowSelectable={(params) =>
                    CTIReport?.from == 'Homepage' ? params.row.id === CTIReport?.value?.id : true
                  }
                  getRowClassName={(params) => {
                    return selectedRows.id == params.row.id ? 'bg-[red]' : ''
                  }}
                  onSelectionModelChange={(ids: any) => {
                    const Ids = ids.length > 0 ? ids : [CTIReport?.value?.id]
                    if (CTIReport?.from !== 'Homepage') {
                      setSelectionModel(ids)
                    }
                    const selectedIDs = new Set(ids)
                    const selectedRowData: any = ctiList?.filter((cti: any) =>
                      selectedIDs.has(cti?.id),
                    )
                    setSelectedRows(selectedRowData)
                  }}
                  selectionModel={selectionModel}
                  components={{
                    NoRowsOverlay: CustomNoRowsOverlay,
                  }}
                  hideFooter={false}
                  hideFooterSelectedRowCount
                  disableColumnMenu
                  classes={{
                    columnHeadersInner: 'custom-data-grid-columnHeadersInner',
                    sortIcon: 'custom-data-grid-sortIcon',
                    footerContainer: 'custom-data-grid-footerContainer',
                  }}
                />
              </div>
            </Box>
          </div>
        </>
      )}
    </div>
  )
}

export default SelectCtiRepo
