import React, { useState } from 'react'
import { DataGrid, gridClasses, GridColDef } from '@mui/x-data-grid'
import { Box, Menu } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import useWindowResolution from '../../../layouts/Dashboard/useWindowResolution'
import { makeStyles } from '@mui/styles'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { sortByDateTime } from '../../../utils/helper'

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
  },
})

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

function ThreatBriefsTable({ threatbriefslist, sortedDataList, setSortedDataList, search }: any) {
  const { height } = useWindowResolution()
  const classes = useStyles()
  const [anchorE6, setAnchorE6] = React.useState(null)
  const [getdatacheck, setGetdatacheck] = useState([] as any)
  const [singleparams, setSingleparams] = useState(null as any)
  const navigateTo = useNavigate()
  const opendot = Boolean(anchorE6)
  const getRowClassName = (params: any) => {
    return params.row.disabled ? 'cursor-not-allowed' : ''
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
          height: '340px',
        }}
      >
        <div>No rows</div>
      </div>
    )
  }

  const handleClickdot = (event: any, params: any) => {
    setSingleparams(params)
    setAnchorE6(event.currentTarget)
  }

  const handleClosing = () => {
    setAnchorE6(null)
  }

  const onNaviaget = (item: any) => {
    navigateTo(`/app/insightspages/${item?.id}`, {
      state: { title: item?.name, paramsdata: 'insite', vaultId: item?.id },
    })
    sessionStorage.setItem('threat', JSON.stringify(item))
  }

  const openInsiteIntel = (item: any, parammeter: any) => {
    navigateTo(`/app/insightspages/${item?.id}`, {
      state: {
        title: item?.name,
        paramsdata: 'insite',
        vaultId: item?.id,
        openindex: parammeter == 'ttps' ? 11 : parammeter == 'ioc' ? 10 : 13,
      },
    })
    sessionStorage.setItem('threat', JSON.stringify(item))
  }

  const onViewNaviaget = (item: any) => {
    navigateTo(`/app/insightspages/${singleparams?.id}`, {
      state: { title: singleparams?.name, paramsdata: 'insite', vaultId: singleparams?.id },
    })
    sessionStorage.setItem('threat', JSON.stringify(singleparams))
  }

  const onViewRuleNaviaget = (item: any) => {
    navigateTo(`/app/insightspages/${singleparams?.id}`, {
      state: { title: singleparams?.name, paramsdata: 'insite', vaultId: singleparams?.id, tab: 2 },
    })
    sessionStorage.setItem('threat', JSON.stringify(singleparams))
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Threat Actor Name',
      flex: 1,
      minWidth: 228,
      sortable: true,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      renderCell: (params: any) => {
        return (
          <>
            <div className='flex truncate w-full'>
              <div
                className='truncate w-[85%] cursor-pointer'
                onClick={() => onNaviaget(params.row)}
              >
                <h1
                  className={`font-medium font-inter truncate text-[var(--Base-White)] !important normal-case`}
                >
                  {params.row.name}
                </h1>
              </div>
            </div>
          </>
        )
      },
    },
    {
      field: 'rules',
      headerName: 'Sigma',
      width: 152,
      sortable: true,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      valueGetter:(params)=> params?.row?.docCount ?? 0,
      renderCell: (params: any) => {
        return (
          <>
            <div className='flex justify-center p-1 px-2 font-inter cursor-default'>
              <div className='text-[#ffffff]'>
                {' '}
                {params?.row?.docCount ? params?.row?.docCount : 0}
              </div>
            </div>
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
                    <button className='flex' onClick={() => onViewNaviaget(params?.row)}>
                      <li className='text-sm font-medium m-1'>View Insights</li>
                    </button>
                  </>
                  <button type='button' className='flex'>
                    <span
                      className='m-1  text-sm font-medium'
                      onClick={() => onViewRuleNaviaget(params?.row)}
                    >
                      View Rules
                    </span>
                  </button>
                </ul>
              </div>
            </Menu>
          </>
        )
      },
    },
    {
      field: 'CTIreports',
      headerName: 'CTI Reports',
      width: 152,
      sortable: true,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      valueGetter:(params)=> params?.row?.intelCount?.data?.CTI ?? 0,
      renderCell: (params: any) => {
        return (
          <>
            <div className='flex justify-center p-1 px-2 font-inter cursor-default'>
              <div className='text-[#ffffff]'>
                {' '}
                {params?.row?.intelCount?.data.CTI ? params?.row?.intelCount?.data.CTI : 0}
              </div>
            </div>
          </>
        )
      },
    },
    {
      field: 'Malware',
      headerName: 'Malware',
      width: 152,
      sortable: true,
      headerClassName: 'hideRightSeparator',
      valueGetter:(params)=> params?.row?.intelCount?.data?.MALWARE ?? 0,
      renderCell: (params) => (
        <>
          <div className='flex justify-start font-inter text-[var(--Base-White)] cursor-default'>
            <div className='text-[#ffffff]'>
              {params?.row?.intelCount?.data?.MALWARE ? params?.row?.intelCount?.data?.MALWARE : 0}
            </div>
          </div>
        </>
      ),
    },
    {
      field: 'intel',
      headerName: 'Intel (TTPs, IOCs, CVEs)',
      width: 370,
      sortable: false,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      renderCell: (params: any) => (
        <div className='inline-flex  justify-start items-center'>
          <div className='flex justify-start items-center gap-1'>
            <>
              {/* TTPs Button */}
              <button
                className='relative w-[95px] h-[31px] flex-shrink-0 rounded-md overflow-hidden'
                onClick={() => openInsiteIntel(params.row, 'ttps')}
              >
                <div className='absolute w-[56px] h-full left-0 top-0 bg-[#0F121B] border border-[#EE7103] rounded-l-md flex items-center justify-center'>
                  <span className='text-white text-sm font-normal font-inter leading-6'>TTPs</span>
                </div>
                <div className='absolute w-[36px] h-full left-[55px] top-0 bg-[#272D41] border border-[#EE7103] rounded-r-md flex items-center justify-center'>
                  <span className='text-white text-sm font-bold font-inter leading-6'>
                    {params?.row?.intelCount?.data?.TTPs ? params?.row?.intelCount?.data?.TTPs : 0}
                  </span>
                </div>
              </button>
              <button
                className='relative w-[95px] h-[31px] flex-shrink-0 rounded-md overflow-hidden'
                onClick={() => openInsiteIntel(params.row, 'ioc')}
              >
                <div className='absolute w-[56px] h-full left-0 top-0 bg-[#0F121B] border border-[#EE7103] rounded-l-md flex items-center justify-center'>
                  <span className='text-white text-sm font-normal font-inter leading-6'>IOCs</span>
                </div>
                <div className='absolute w-[36px] h-full left-[55px] top-0 bg-[#272D41] border border-[#EE7103] rounded-r-md flex items-center justify-center'>
                  <span className='text-white text-sm font-bold font-inter leading-6'>
                    {params?.row?.intelCount?.data?.IOC ? params?.row?.intelCount?.data?.IOC : 0}
                  </span>
                </div>
              </button>
              <button
                className='relative w-[95px] h-[31px] flex-shrink-0 rounded-md overflow-hidden'
                onClick={() => openInsiteIntel(params.row, 'cve')}
              >
                <div className='absolute w-[56px] h-full left-0 top-0 bg-[#0F121B] border border-[#EE7103] rounded-l-md flex items-center justify-center'>
                  <span className='text-white text-sm font-normal font-inter leading-6'>CVEs</span>
                </div>
                <div className='absolute w-[36px] h-full left-[55px] top-0 bg-[#272D41] border border-[#EE7103] rounded-r-md flex items-center justify-center'>
                  <span className='text-white text-sm font-bold font-inter leading-6'>
                    {params?.row?.intelCount?.data?.CVEs ? params?.row?.intelCount?.data?.CVEs : 0}
                  </span>
                </div>
              </button>
            </>
          </div>
        </div>
      ),
    },

    {
      field: 'creationTime',
      headerName: 'Creation Time',
      width: 200,
      headerClassName: 'hideRightSeparator',
      sortable: true,
      sortComparator: sortByDateTime,
      renderCell: (params) => (
        <>
          <div className='flex justify-between w-full '>
            {params.row.creationTime ? (
              <>
                <span>{moment(params.row.creationTime).format('DD-MMM HH:mm')}</span>
              </>
            ) : (
              <>{'-'}</>
            )}
            <button
              className={`${params.row.disabled ? `cursor-not-allowed` : ''}`}
              onClick={
                params.row.disabled ? (e: any) => '' : (e: any) => handleClickdot(e, params.row)
              }
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke={`${params.row.disabled ? `#808080` : '#fff'}`}
                className='w-6 h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z'
                />
              </svg>
            </button>
          </div>
        </>
      ),
    },
  ]

  const filterdata: any =
    threatbriefslist?.length > 0
      ? threatbriefslist
          ?.filter(
            (item: any) =>
              item?.name?.toLowerCase().includes(search?.toLowerCase()) ||
              item?.docCount?.toString().includes(search) ||
              item?.intelCount?.data?.CTI?.toString().includes(search) ||
              item?.intelCount?.data?.MALWARE?.toString().includes(search) ||
              moment(item?.creationTime).format('DD-MMM HH:mm').toLowerCase() ===
                moment(search).format('DD-MMM HH:mm')?.toLowerCase() ||
              moment(item?.creationTime).format('DD MMM').toLowerCase() ===
                moment(search).format('DD MMM')?.toLowerCase() ||
              moment(item?.creationTime).format('HH:mm').toLowerCase() ===
                moment(search).format('HH:mm')?.toLowerCase() ||
              moment(item?.creationTime).format('HH').toLowerCase() ===
                moment(search).format('HH')?.toLowerCase(),
          )
      : []

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          height: 340,
          width: '100%',
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
          rows={filterdata}
          columns={columns}
          classes={{
            columnHeadersInner: 'custom-data-grid-columnHeadersInner',
            sortIcon: 'custom-data-grid-sortIcon',
            footerContainer: 'custom-data-grid-footerContainer',
          }}
          pagination
          selectionModel={getdatacheck}
          onSelectionModelChange={(ids: any, newSelection: any) => {
            let checkboxArray: any = []
            let checkboxArrayvalue: any = []
            const selectedIDs = new Set(ids)
            const selectedRowData: any = threatbriefslist?.filter((ctireportFiles: any) =>
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
        />
      </Box>
    </ThemeProvider>
  )
}

export default ThreatBriefsTable
