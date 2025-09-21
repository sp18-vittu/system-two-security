import { Box, tooltipClasses } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { DataGrid, gridClasses, GridColDef } from '@mui/x-data-grid'
import { makeStyles } from '@mui/styles'
import { useDispatch } from 'react-redux'
import { threatActorsDetails, threatActorspost } from '../../redux/nodes/threatActors/action'
import { Checkbox, IconButton } from '@mui/material'
import ThreatActorPopup from './ThreatActorPopup'
import ClearIcon from '@mui/icons-material/Clear'
import { useLocation } from 'react-router-dom'
import useWindowResolution from '../../layouts/Dashboard/useWindowResolution'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { getAllThreatbrief } from '../../redux/nodes/threatBriefs/action'
import { Tooltip, TooltipProps } from '@mui/material'
import { styled } from '@mui/system'
import { useData } from '../../layouts/shared/DataProvider'

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
  root: {
    '& .MuiTableCell-head': {
      color: 'white',
      backgroundColor: '#32435A',
    },
  },
}))

export default function BasedOnThreatActor() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const location = useLocation()
  const { state } = location
  const { height } = useWindowResolution()
  const { wssProvider, setWssProvider }: any = useData()

  const [threatActorPopup, setThreatactorPopup] = useState(false)
  const [threatActorList, setThreatActorList] = useState<any>([] as any)
  const [threatActorPopupvalue, setThreatactorPopupvalue] = useState('' as any)
  const [query, setQuery] = useState<string>('')
  const [selectedCountry, setSelectedCountry] = useState<any>(null)
  const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(() => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: '#fff',
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#fff',
      color: '#000',
    },
  }))

  const getRowClassName = (params: any) => {
    return params.row.disabled ? 'cursor-not-allowed' : ''
  }

  const getCellClassName = (params: any) => {
    return params.row.disabled ? classes.checkbox : classes.uncheckbox
  }
  const [reloading, setReLoading] = useState(false)

  useEffect(() => {
    ThreatActorreload()
  }, [])

  const ThreatActorreload = () => {
    dispatch(getAllThreatbrief() as any)
      .then((response: any) => {
        if (response.type === 'GET_THREAT_BRIEF_SUCCESS') {
          setThreatActorList([])
          setReLoading(true)
          dispatch(threatActorsDetails() as any).then((res: any) => {
            if (res?.type == 'THREAT_ACTOR_GET_JSON_SUCCESS') {
              if (res?.payload?.length > 0) {
                response?.payload.forEach((item: any) => {
                  const [beforeWith] = item?.description.split(' with')
                  res?.payload.forEach((value: any) => {
                    if (item?.name === value?.entity_name) {
                      value.status =
                        beforeWith == 'processing succeeded'
                          ? 'COMPLETED'
                          : beforeWith == 'generated'
                          ? 'PROCESSING'
                          : beforeWith == 'processing failed'
                          ? 'FAILD'
                          : ''
                    }
                  })
                })
                setThreatActorList(res?.payload)
                setReLoading(false)
              }
            } else if (response.type === 'GET_THREAT_BRIEF_FAILURE') {
              setThreatActorList([])
              setReLoading(false)
            }
          })
        }
      })
      .catch((err: any) => console.log('err', err))
  }

  useEffect(() => {
    if (wssProvider) {
      if (wssProvider?.eventType == 'threatbrief generatesigma completed') {
        threatActorList.forEach((value: any) => {
          if (wssProvider.data?.name === value?.entity_name) {
            value.status = 'PROCESSING'
          } else if (value.status) {
            value.status = value.status
          }
        })
        setThreatActorList(threatActorList)
        setWssProvider(null)
      } else if (wssProvider?.eventType == 'threatbrief processing succeeded') {
        threatActorList.forEach((value: any) => {
          if (wssProvider.data?.name === value?.entity_name) {
            value.status = 'COMPLETED'
          } else if (value.status) {
            value.status = value.status
          }
        })
        setThreatActorList(threatActorList)
        setWssProvider(null)
      } else if (wssProvider?.eventType == 'threatbrief processing failed') {
        threatActorList.forEach((value: any) => {
          if (wssProvider.data?.name === value?.entity_name) {
            value.status = 'FAILD'
          } else if (value.status) {
            value.status = value.status
          }
        })
        setThreatActorList(threatActorList)
        setWssProvider(null)
      }
    }
  }, [wssProvider])

  const handelOpen = (data: any) => {
    setThreatactorPopup(true)
    setThreatactorPopupvalue(data)
  }

  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)

  const handleCheckboxChange = (id: number, object: any) => {
    setSelectedCountry(object.isSelected ? null : object)
    setSelectedRowId(id === selectedRowId ? null : id)
  }

  const checkMatch = (terms: string[], values: string[]) => {
    return terms?.every((term) => values?.includes(term))
  }

  const checkMatchOr = (terms: string[], values: string[]) => {
    return terms?.some((term) => values?.includes(term))
  }

  const handleSearch = (searchQuery: string) => {
    const searchTerms = searchQuery?.toLowerCase().split(' ')
    const andTerms = searchQuery?.split('&').map((term) => term?.trim().toLowerCase())
    const orTerms = searchQuery?.split(/[,|]/).map((term) => term?.trim().toLowerCase())

    return threatActorList?.length > 0
      ? threatActorList?.filter((item: any) => {
          const countries =
            item?.data.countries?.map((country: any) => country?.name.toLowerCase()) || []
          const sectors = item?.data.sectors?.map((sector: any) => sector?.name.toLowerCase()) || []
          const aliases =
            item?.data?.threat_actors?.flatMap((actor: any) =>
              actor?.aliases.map((alias: any) => alias?.toLowerCase()),
            ) || []
          const entityName = item?.entity_name?.toLowerCase()
          const status = item?.status?.toLowerCase()
          if (searchQuery?.includes('|') || searchQuery?.includes(',')) {
            return checkMatchOr(orTerms, [entityName, ...countries, ...sectors, ...aliases])
          } else if (searchQuery.includes('&')) {
            return checkMatch(andTerms, [entityName, ...countries, ...sectors, ...aliases])
          } else {
            return searchTerms.every(
              (term) =>
                entityName.includes(term) ||
                status?.includes(term) ||
                countries.includes(term) ||
                sectors.includes(term) ||
                aliases.includes(term),
            )
          }
        })
      : []
  }

  const filteredData = handleSearch(query)
  const rows = filteredData?.map((item: any, index: any) => ({
    id: index + 1,
    entity_name: item.entity_name,
    status: item.status,
    isSelected: selectedRowId === index + 1,
    data: {
      countries: item?.data?.countries,
      sectors: item?.data?.sectors,
      threat_actors: item?.data?.threat_actors,
    },
  }))

  const handleClearSelection = () => {
    setSelectedCountry(null)
    setSelectedRowId(null)
  }

  const handleSubmit = () => {
    if (selectedCountry) {
      dispatch(threatActorspost(selectedCountry?.entity_name) as any).then((res: any) => {
        if (res.type == 'THREAT_ACTOR_GET_JSON_SUCCESS') {
          setSelectedCountry(null)
          setSelectedRowId(null)
        }
      })
    }
  }

  const columns: GridColDef[] = [
    {
      field: '',
      headerName: 'Select',
      width: 100,
      sortable: false,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      renderHeader: () => (
        <div className='flex items-center'>
          <span className='mr-2'>Select</span>
          {selectedCountry && (
            <IconButton size='small' onClick={handleClearSelection}>
              <ClearIcon fontSize='small' style={{ color: '#fff' }} />
            </IconButton>
          )}
        </div>
      ),
      renderCell: (params) => (
        <Checkbox
          style={{ color: '#fff' }}
          checked={params.row.isSelected}
          onChange={() => handleCheckboxChange(params.row.id, params.row)}
        />
      ),
    },
    {
      field: 'entity_name',
      headerName: 'Threat Actor Name',
      flex: 1,
      sortable: false,
      filterable: false,
      headerClassName: 'hideRightSeparator',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 352,
      sortable: false,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      renderCell: (params: any) => {
        return (
          <>
            <div className='flex justify-between w-full cursor-default'>
              <div>
                {params?.row?.status == 'PROCESSING' ? (
                  <>
                    <BootstrapTooltip title={params.row.errorDesc} arrow placement='bottom'>
                      <div className='flex justify-center border-2 border-[#FFFF00] p-1 px-2 rounded-2xl'>
                        <div className='text-[#FFFF00]'>Processing</div>
                        <div className='mt-1 pl-1'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='12'
                            height='12'
                            viewBox='0 0 12 12'
                            fill='none'
                          >
                            <g clip-path='url(#clip0_339_3090)'>
                              <path
                                d='M6 1V3M6 9V11M3 6H1M11 6H9M9.53921 9.53921L8.125 8.125M9.53921 2.49997L8.125 3.91418M2.46079 9.53921L3.875 8.125M2.46079 2.49997L3.875 3.91418'
                                stroke='#FFFF00'
                                stroke-width='1.5'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                              />
                            </g>
                            <defs>
                              <clipPath id='clip0_339_3090'>
                                <rect width='12' height='12' fill='white' />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                      </div>
                    </BootstrapTooltip>
                  </>
                ) : params?.row?.status == 'COMPLETED' ? (
                  <>
                    <BootstrapTooltip title={params.row.errorDesc} arrow placement='bottom'>
                      <div
                        className={`flex justify-center border-2 p-1 px-2 rounded-2xl ${
                          !params.row.errorDesc ? 'border-[#079455]' : 'border-[yellow]'
                        }`}
                      >
                        <div
                          className={`${
                            !params.row.errorDesc ? 'text-[#079455]' : 'text-[yellow]'
                          }`}
                        >
                          Completed
                        </div>
                        <div className='mt-1 pl-1'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='13'
                            height='12'
                            viewBox='0 0 13 12'
                            fill='none'
                          >
                            <path
                              d='M10.5 3L5 8.5L2.5 6'
                              stroke={!params.row.errorDesc ? '#079455' : 'yellow'}
                              stroke-width='1.5'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            />
                          </svg>
                        </div>
                      </div>
                    </BootstrapTooltip>
                  </>
                ) : (
                  params?.row?.status == 'FAILD' && (
                    <BootstrapTooltip title={params.row.errorDesc} arrow placement='bottom'>
                      <div className='flex justify-center border-2 border-[#FA1B1B] p-1 px-2 rounded-2xl'>
                        <div className='text-[#FA1B1B]'>Failed</div>
                        <div className='mt-1 pl-1'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            stroke='#FA1B1B'
                            viewBox='0 0 16 16'
                            width='13'
                            height='12'
                          >
                            <path d='M 2.75 2.042969 L 2.042969 2.75 L 2.398438 3.101563 L 7.292969 8 L 2.042969 13.25 L 2.75 13.957031 L 8 8.707031 L 12.894531 13.605469 L 13.25 13.957031 L 13.957031 13.25 L 13.605469 12.894531 L 8.707031 8 L 13.957031 2.75 L 13.25 2.042969 L 8 7.292969 L 3.101563 2.398438 Z' />
                          </svg>
                        </div>
                      </div>
                    </BootstrapTooltip>
                  )
                )}
              </div>
            </div>
          </>
        )
      },
    },
    {
      field: 'icon',
      headerName: 'View More',
      width: 150,
      sortable: false,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      renderCell: (params) => (
        <IconButton>
          <VisibilityIcon style={{ color: '#fff' }} onClick={() => handelOpen(params.row)} />
        </IconButton>
      ),
    },
  ]

  return (
    <>
      <div className='p-[32px]'>
        {state?.taName == 'ThreatActor' && (
          <div className='flex justify-between items-center h-12 w-full'>
            <span className={`font-medium text-sm   ${'text-[#fff]'}`}>
              You can create a new threat brief from the list of threat actors
            </span>

            <div className=' flex items-end justify-end w-[800px]'>
              <div className='mr-2 '>
                <div className='relative inline-flex lg:top-0 lg:pt-0 '>
                  <div className='relative flex flex-wrap items-stretch '>
                    <input
                      type='search'
                      className='relative m-0 block w-[500px] h-11 flex-auto rounded-l-lg p-1.5 border-t border-l border-b border-solid border-neutral-300 bg-white text-base font-normal leading-[1.6] text-neutral-700 placeholder:text-[11px]'
                      placeholder='Use & and | symbols to filter Threat Briefs  Eg: Threat Actor & Countries & Industries | Aliases '
                      aria-label='Search'
                      aria-describedby='button-addon2'
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                      className='input-group-text bg-white w-10 flex p-1.5 items-center border-t border-b border-r border-solid border-neutral-300 whitespace-nowrap rounded-r-lg px-3 py-1.5 text-center text-base font-normal text-neutral-700'
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
                          stroke='#475467'
                          strokeWidth='1.66667'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <button
                type='button'
                disabled={selectedCountry ? false : true}
                onClick={handleSubmit}
                className={`w-52 h-11 text-[white] bg-[#EE7103] font-medium  rounded-lg text-sm px-5 py-2.5 text-center items-center ${
                  selectedCountry ? 'cursor-pointer' : `cursor-not-allowed opacity-50 hover`
                }`}
              >
                Generate Threat Brief
              </button>
              <div className='ml-2 cursor-pointer mb-[10px]' onClick={ThreatActorreload}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='1.5em'
                  height='1.5em'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='white'
                    d='M12.793 2.293a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1-1.414-1.414L14.086 7H12.5C8.952 7 6 9.952 6 13.5S8.952 
                    20 12.5 20s6.5-2.952 6.5-6.5a1 1 0 1 1 2 0c0 4.652-3.848 8.5-8.5 8.5S4 18.152 4 13.5S7.848 5 12.5 5h1.586l-1.293-1.293a1 1 0 0 1 0-1.414'
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
        {state?.taName == 'ThreatActor' && <p className='text-sm font-normal text-[#B9B9B9]'></p>}
        {state?.taName !== 'ThreatActor' && (
          <p className='text-xl font-normal text-[#fff]'>Coming Soon...</p>
        )}
        {state?.taName == 'ThreatActor' && (
          <div className='mt-4'>
            <Box
              sx={{
                mt: -0.8,
                height: 340,
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
                '.css-yrdy0g-MuiDataGrid-columnHeaderRow': {
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
                  // display: 'none',
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
                  boxShadow: 10,
                  color: 'white',
                  border: 'none',
                  height: { md: height - 150, lg: height - 200, xl: height - 250 },
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
                }}
                getCellClassName={getCellClassName}
                disableSelectionOnClick={true}
                getRowClassName={getRowClassName}
                rows={rows}
                columns={columns}
                loading={reloading}
                classes={{
                  columnHeadersInner: 'custom-data-grid-columnHeadersInner',
                  sortIcon: 'custom-data-grid-sortIcon',
                  footerContainer: 'custom-data-grid-footerContainer',
                }}
                pagination
                hideFooterSelectedRowCount
                disableColumnMenu
              />
            </Box>
          </div>
        )}
      </div>
      {threatActorPopup && (
        <ThreatActorPopup
          threatActorPopup={threatActorPopup}
          setThreatactorPopup={setThreatactorPopup}
          threatActorPopupvalue={threatActorPopupvalue}
        />
      )}
    </>
  )
}
