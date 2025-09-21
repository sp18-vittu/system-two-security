import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'

const AddThreatBrief = ({ threatPopup, setthreatPopup }: any) => {
  const rows3 = [
    {
      ctiName: 'Blackcat',
    },
    {
      ctiName: 'Microsoft Dev-0270',
      url: 'https://www.microsoft.com/en-us/security/blog/2022/09/07/profiling-dev-0270-phosphorus-ransomware-operations/',
      Source: 'Private',
      reportSource: 'WEB',
    },
    {
      ctiName: 'Hacker News',
      url: 'https://thehackernews.com/2022/09/microsoft-warns-of-ransomware-attacks.html',
      Source: 'Crowdsense',
      reportSource: 'PDF',
    },
    {
      ctiName: 'Blackcat 2',
    },
    {
      ctiName: 'Microsoft Dev-0270',
      url: 'https://www.microsoft.com/en-us/security/blog/2022/09/07/profiling-dev-0270-phosphorus-ransomware-operations/',
      Source: 'Private',
      reportSource: 'WEB',
    },
    {
      ctiName: 'Hacker News',
      url: 'https://thehackernews.com/2022/09/microsoft-warns-of-ransomware-attacks.html',
      Source: 'Crowdsense',
      reportSource: 'PDF',
    },
  ]

  const addIdField2 = (data: any[]) => {
    return data.map((row2) => ({
      ...row2,
      id: uuidv4(),
    }))
  }

  const rowsWithId2 = addIdField2(rows3)

  const columns2: GridColDef[] = [
    {
      field: 'CTIReport',
      headerName: 'CTI Report',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => {
        return (
          <>
            <div className='flex truncate w-full'>
              {params.row.reportSource == 'WEB' ? (
                <>
                  <span className='mt-1'>
                    <svg
                      width='32'
                      height='32'
                      viewBox='0 0 40 40'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                      className=''
                    >
                      <path
                        d='M20 3.33325C25 6.66658 26.5379 13.82 26.6667 19.9999C26.5379 26.1799 25 33.3333 20 36.6666M20 3.33325C15 6.66659 13.4621 13.82 13.3333 19.9999C13.4621 26.1799 15 33.3333 20 36.6666M20 3.33325C10.7952 3.33325 3.33333 10.7952 3.33333 19.9999M20 3.33325C29.2047 3.33325 36.6667 10.7952 36.6667 19.9999M20 36.6666C29.2047 36.6666 36.6667 29.2047 36.6667 19.9999M20 36.6666C10.7953 36.6666 3.33333 29.2047 3.33333 19.9999M36.6667 19.9999C33.3333 24.9999 26.1799 26.5378 20 26.6666C13.8201 26.5378 6.66666 24.9999 3.33333 19.9999M36.6667 19.9999C33.3333 14.9999 26.1799 13.462 20 13.3333C13.8201 13.462 6.66666 14.9999 3.33333 19.9999'
                        stroke='white'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </span>
                </>
              ) : params.row.reportSource == 'PDF' ? (
                <>
                  <span className='mt-1'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='32'
                      height='32'
                      viewBox='0 0 40 40'
                      fill='none'
                    >
                      <path
                        d='M23.3333 3.78247V10.6667C23.3333 11.6001 23.3333 12.0668 23.515 12.4234C23.6748 12.737 23.9297 12.9919 24.2433 13.1517C24.5999 13.3334 25.0666 13.3334 26 13.3334H32.8842M26.6667 21.6666H13.3333M26.6667 28.3333H13.3333M16.6667 14.9999H13.3333M23.3333 3.33325H14.6667C11.8664 3.33325 10.4663 3.33325 9.3967 3.87822C8.45589 4.35759 7.69099 5.12249 7.21162 6.0633C6.66666 7.13286 6.66666 8.53299 6.66666 11.3333V28.6666C6.66666 31.4668 6.66666 32.867 7.21162 33.9365C7.69099 34.8773 8.45589 35.6423 9.3967 36.1216C10.4663 36.6666 11.8664 36.6666 14.6667 36.6666H25.3333C28.1336 36.6666 29.5337 36.6666 30.6033 36.1216C31.5441 35.6423 32.309 34.8773 32.7884 33.9365C33.3333 32.867 33.3333 31.4668 33.3333 28.6666V13.3333L23.3333 3.33325Z'
                        stroke='white'
                        stroke-width='1.5'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </svg>
                  </span>
                </>
              ) : null}
              <div className='truncate w-[85%]'>
                {params.row.ctiName === 'Blackcat' || params.row.ctiName === 'Blackcat 2' ? (
                  <h1 className='mt-[1.3rem] ml-[4px] font-medium text-sm font-medium truncate !important'>
                    {params.row.ctiName}
                  </h1>
                ) : (
                  <h1 className='px-3 font-medium text-sm font-medium truncate !important'>
                    {params.row.ctiName}
                  </h1>
                )}
                <span className='px-3 font-medium text-sm text-[#B9B9B9] font-normal !important truncate w-3/4'>
                  {' '}
                  {params.row.url}
                </span>{' '}
              </div>
            </div>
          </>
        )
      },
    },
    {
      field: 'Source',
      headerName: 'Source',
      width: 191,
      sortable: false,
      filterable: false,
      align: 'left',
      renderCell: (params: any) => {
        return (
          <>
            {params.row.Source == 'Private' ? (
              <div className='border-[#1570EF] border-2 p-1 text-[#1570EF] rounded-2xl flex justify-center'>
                <span style={{ padding: '0px 12px' }}>Private</span>
              </div>
            ) : params.row.Source == 'Crowdsense' ? (
              <div className='border-[#7F56D9] border-2 p-1 text-[#7F56D9] rounded-2xl flex justify-center'>
                <span>Crowdsense</span>
              </div>
            ) : (
              <></>
            )}
          </>
        )
      },
    },
  ]

  return (
    <div className='backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
      <div className='relative w-[90vw] my-6 mx-auto'>
        <div className='border-0 rounded-lg  h-[40rem] relative flex flex-col bg-[#1D2939] outline-none focus:outline-none'>
          <div className=' gap-4 m-1 p-2 mb-0 p-[24px] '>
            <div className='flex justify-between'>
              <div>
                <p className='text-lg font-semibold text-[#FFF]'>Create from reports</p>
                <p className='text-sm font-normal text-[#B9B9B9]'>
                  You can craete a new Threat Brief from reports you uploaded
                </p>
              </div>
              <div className='gap-5'>
                <button
                  type='button'
                  className='mr-4 w-32 h-11 text-gray-900 bg-white border border-gray-300 font-medium  rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center'
                >
                  Filter By
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='ml-3'
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='none'
                  >
                    <path
                      d='M2.82159 4.72239C2.1913 4.01796 1.87616 3.66574 1.86427 3.3664C1.85395 3.10636 1.96569 2.85643 2.16637 2.69074C2.39738 2.5 2.87 2.5 3.81524 2.5H16.1844C17.1296 2.5 17.6022 2.5 17.8332 2.69074C18.0339 2.85643 18.1456 3.10636 18.1353 3.3664C18.1234 3.66574 17.8083 4.01796 17.178 4.72239L12.4228 10.037C12.2972 10.1774 12.2343 10.2477 12.1896 10.3276C12.1498 10.3984 12.1207 10.4747 12.103 10.554C12.0831 10.6435 12.0831 10.7377 12.0831 10.9261V15.382C12.0831 15.5449 12.0831 15.6264 12.0568 15.6969C12.0336 15.7591 11.9958 15.8149 11.9467 15.8596C11.891 15.9102 11.8154 15.9404 11.6641 16.001L8.83073 17.1343C8.52444 17.2568 8.3713 17.3181 8.24836 17.2925C8.14085 17.2702 8.04651 17.2063 7.98584 17.1148C7.91646 17.0101 7.91646 16.8452 7.91646 16.5153V10.9261C7.91646 10.7377 7.91646 10.6435 7.89657 10.554C7.87892 10.4747 7.84977 10.3984 7.81004 10.3276C7.76525 10.2477 7.70243 10.1774 7.57679 10.037L2.82159 4.72239Z'
                      stroke='#344054'
                      stroke-width='1.66667'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                </button>
                <button
                  type='button'
                  className='mr-4 w-52 h-11 text-[white] bg-[#EE7103] font-medium  rounded-lg text-sm px-5 py-2.5 text-center items-center'
                >
                  Generate Threat Brief
                </button>
                <button
                  onClick={() => {
                    setthreatPopup(false)
                  }}
                >
                  <svg
                    className='mt-2'
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <path
                      d='M18 6L6 18M6 6L18 18'
                      stroke='#98A2B3'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div>
            <div style={{ height: 478, width: '100%', padding: '0px 24px' }}>
              <DataGrid
                sx={{
                  m: 0,
                  color: 'white',
                  border: 'none',

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
                  'svg.MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.MuiDataGrid-iconSeparator.css-i4bv87-MuiSvgIcon-root':
                    {
                      display: 'none',
                    },
                  '&.css-4bvkx2-MuiDataGrid-root': {
                    margin: '0px',
                  },
                  'div.MuiDataGrid-columnHeader, .MuiDataGrid-cell.MuiDataGrid-cell--textLeft': {
                    padding: 'initial',
                  },
                  'div.MuiDataGrid-columnHeaderTitleContainer, .MuiDataGrid-cell.MuiDataGrid-cell--textLeft':
                    {
                      padding: '12px 22px',
                    },
                  '.MuiDataGrid-footerContainer.css-17jjc08-MuiDataGrid-footerContainer': {
                    display: 'none',
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: 'inherit',
                  },
                  '& .MuiDataGrid-columnHeaderTitleContainerContent': {
                    overflow: 'visible !important',
                  },
                  '.MuiCheckbox-colorPrimary.Mui-checked': {
                    color: ' white !important',
                  },
                }}
                rows={rowsWithId2}
                columns={columns2}
                disableSelectionOnClick
                disableColumnMenu
                hideFooterPagination
                hideFooterSelectedRowCount
                checkboxSelection
                classes={{
                  columnHeadersInner: 'custom-data-grid-columnHeadersInner',
                  sortIcon: 'custom-data-grid-sortIcon',
                  footerContainer: 'custom-data-grid-footerContainer',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddThreatBrief
