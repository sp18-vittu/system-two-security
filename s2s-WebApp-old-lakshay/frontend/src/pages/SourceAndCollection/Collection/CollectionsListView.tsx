import React, { useEffect, useState } from 'react'
import { Button, Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import EditIcon from '@mui/icons-material/Edit'
import { makeStyles } from '@mui/styles'
import { DataGrid, gridClasses, GridColDef, GridSortModel } from '@mui/x-data-grid'
import { Box, Menu } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import useWindowResolution from '../../../layouts/Dashboard/useWindowResolution'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import moment from 'moment'
import { sortByDateTime } from '../../../utils/helper'

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

function CollectionsListView({
  filterdata,
  hanleNavigate,
  dynamicHeight,
  inboxList,
  confirmation,
  selectedIndex,
  handleEdit,
  setConfirmation,
  setSelectedIndex,
  handleDeletes,
  loader,
  deleting,
}: any) {
  const { width, height } = useWindowResolution()
  const classes = useStyles()
  const [anchorE6, setAnchorE6] = React.useState(null)
  const opendot = Boolean(anchorE6)
  const [singleparams, setSingleparams] = useState(null as any)

  const getRowClassName = (params: any) => {
    return params.row.status === 'PROCESSING' ? 'bg-[#1F0F00]' : ''
  }

  const getCellClassName = (params: any) => {
    return params.row.disabled ? classes.checkbox : classes.uncheckbox
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

  const handleClosing = () => {
    setAnchorE6(null)
  }

  function capitalizeFirstLetter(name: string): string {
    if (!name) return ''
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
  }

  const handleClickdot = (event: any, params: any) => {
    setSingleparams(params)
    setAnchorE6(event.currentTarget)
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 557,
      minWidth: 300,
      flex: 1,
      sortable: true,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      renderCell: (params: any) => {
        return (
          <div className='flex items-center justify-start gap-3 px-1 py-4 h-[72px] w-[98%]'>
            <BootstrapTooltip title={capitalizeFirstLetter(params?.row?.name)} placement='bottom'>
              <div
                className={`text-white text-sm font-bold leading-5 truncate overflow-hidden whitespace-nowrap ${'cursor-pointer'}`}
                onClick={() => hanleNavigate(params?.row)}
              >
                {capitalizeFirstLetter(params?.row?.name)}
              </div>
            </BootstrapTooltip>
          </div>
        )
      },
    },
    {
      field: 'docCount',
      headerName: 'Detections',
      width: 150,
      sortable: true,
      headerClassName: 'hideRightSeparator',
      valueGetter:(params)=> params?.row?.docCount ?? 0,
      renderCell: (params) => (
        <>
          {params?.row?.docCount == 0 ? (
            <button
              disabled={true}
              // onClick={() => openSigmaNaviage(params?.row)}
              className={`relative w-[95px] h-[31px] flex-shrink-0 rounded-md overflow-hidden cursor-not-allowed`}
            >
              <div className='absolute w-[56px] h-full left-0 top-0 bg-[#0F121B] border border-[#EE7103] rounded-l-md flex items-center justify-center'>
                <span className='text-white text-sm font-normal font-inter leading-6'>Sigma</span>
              </div>
              <div className='absolute w-[36px] h-full left-[55px] top-0 bg-[#272D41] border border-[#EE7103] rounded-r-md flex items-center justify-center'>
                <span className='text-white text-sm font-bold font-inter leading-6'>{'-'}</span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => hanleNavigate(params?.row)}
              className={`relative w-[95px] h-[31px] flex-shrink-0 rounded-md overflow-hidden ${
                params?.row?.docCount > 0 ? 'cursor-pointer' : 'cursor-not-allowed'
              }`}
            >
              <div className='absolute w-[56px] h-full left-0 top-0 bg-[#0F121B] border border-[#EE7103] rounded-l-md flex items-center justify-center'>
                <span className='text-white text-sm font-normal font-inter leading-6'>Sigma</span>
              </div>
              <div className='absolute w-[36px] h-full left-[55px] top-0 bg-[#272D41] border border-[#EE7103] rounded-r-md flex items-center justify-center'>
                <span className='text-white text-sm font-bold font-inter leading-6'>
                  {params?.row?.docCount ? params?.row?.docCount : '-'}
                </span>
              </div>
            </button>
          )}
        </>
      ),
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
          {params.row.status === 'PROCESSING' ? (
            <div className='badge flex items-center justify-start rounded-[16px] border border-[#EE7103] px-2 py-1'>
              <div className='text text-[#EE7103] text-center font-medium text-xs leading-[18px]'>
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
      align: 'right',
      headerClassName: 'hideRightSeparator',
      sortable: false,
      renderCell: (params) => (
        <>
          <div className='flex flex-row w-full '>
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
                <ul>
                  <>
                    <button className='flex'>
                      <li
                        className='text-sm font-medium m-1'
                        onClick={() => hanleNavigate(singleparams?.row)}
                      >
                        View Rules
                      </li>
                    </button>
                  </>
                  <>
                    <button
                      type='button'
                      className='flex'
                      onClick={(e: any) => handleEdit(singleparams?.row)}
                    >
                      <span className='m-1  text-sm font-medium'>Edit</span>
                    </button>

                    <button
                      type='button'
                      className='flex'
                      onClick={(e: any) => {
                        handleDeletes(singleparams?.row), setAnchorE6(null)
                      }}
                    >
                      <span className='m-1  text-sm font-medium'> Delete</span>
                    </button>
                  </>
                </ul>
              </div>
            </Menu>
          </div>
        </>
      ),
    },
  ]

  return (
    <div>
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
                borderRadius: '12px',
                border: '1px solid #32435A',
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
            rows={filterdata}
            columns={columns}
            loading={loader}
            classes={{
              columnHeadersInner: 'custom-data-grid-columnHeadersInner',
              sortIcon: 'custom-data-grid-sortIcon',
              footerContainer: 'custom-data-grid-footerContainer',
            }}
            pagination
            // selectionModel={getdatacheck}
            onSelectionModelChange={(ids: any, newSelection: any) => {
              let checkboxArray: any = []
              let checkboxArrayvalue: any = []

              const selectedIDs = new Set(ids)
              const selectedRowData: any = filterdata?.filter((ctireportFiles: any) =>
                selectedIDs.has(ctireportFiles?.id),
              )

              selectedRowData
                .filter((x: any) => {
                  return x?.disabled !== true
                })
                .map((value: any) => {
                  checkboxArray.push(value.id), checkboxArrayvalue.push(value)
                })
              // setGetdatacheck(checkboxArray)
            }}
            components={{
              NoRowsOverlay: CustomNoRowsOverlay,
            }}
            hideFooterSelectedRowCount
            disableColumnMenu
            rowHeight={60}
          />
        </Box>
      </ThemeProvider>
    </div>
  )
}

export default CollectionsListView
