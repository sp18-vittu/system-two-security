import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'
import React from 'react'

const AddReport = ({ reportpopup, setreportpopup }: any) => {
  const rows2 = [
    {
      Query: 'Query1',
      url: 'https://www.microsoft.com/en-us/security/blog/2022/09/07/profiling-dev-0270-phosphorus-ransomware-operations/',
      Source: 'Private',
    },
    {
      Query: 'Query2',
      url: 'https://thehackernews.com/2022/09/microsoft-warns-of-ransomware-attacks.html',
      Source: 'Crowdsense',
    },
    {
      Query: 'Query3',
      url: 'https://thehackernews.com/2022/09/microsoft-warns-of-ransomware-attacks.html',
      Source: 'Crowdsense',
    },
    {
      Query: 'Query4',
      url: 'https://thehackernews.com/2022/09/microsoft-warns-of-ransomware-attacks.html',
      Source: 'Processing',
    },
    {
      Query: 'Query5',
      url: 'https://thehackernews.com/2022/09/microsoft-warns-of-ransomware-attacks.html',
      Source: 'Crowdsense',
    },
    {
      Query: 'Query6',
      url: 'https://thehackernews.com/2022/09/microsoft-warns-of-ransomware-attacks.html',
      Source: 'Crowdsense',
    },
  ]
  const columns1: GridColDef[] = [
    {
      field: 'Query',
      headerName: 'CTI Reports',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => {
        return (
          <>
            <div className='flex truncate w-full'>
              {params.row.Source === 'Private' ? (
                <>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='36'
                    height='36'
                    viewBox='0 0 36 36'
                    fill='none'
                  >
                    <path
                      d='M18 1.33325C23 4.66658 24.5379 11.82 24.6667 17.9999C24.5379 24.1799 23 31.3333 18 34.6666M18 1.33325C13 4.66659 11.4621 11.82 11.3333 17.9999C11.4621 24.1799 13 31.3333 18 34.6666M18 1.33325C8.79526 1.33325 1.33334 8.79517 1.33334 17.9999M18 1.33325C27.2048 1.33325 34.6667 8.79517 34.6667 17.9999M18 34.6666C27.2048 34.6666 34.6667 27.2047 34.6667 17.9999M18 34.6666C8.79527 34.6666 1.33334 27.2047 1.33334 17.9999M34.6667 17.9999C31.3333 22.9999 24.18 24.5378 18 24.6666C11.8201 24.5378 4.66668 22.9999 1.33334 17.9999M34.6667 17.9999C31.3333 12.9999 24.18 11.462 18 11.3333C11.8201 11.462 4.66668 12.9999 1.33334 17.9999'
                      stroke='white'
                      stroke-width='1.5'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                </>
              ) : (
                <>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='30'
                    height='36'
                    viewBox='0 0 30 36'
                    fill='none'
                  >
                    <path
                      d='M18.3333 1.78247V8.66671C18.3333 9.60013 18.3333 10.0668 18.515 10.4234C18.6748 10.737 18.9297 10.9919 19.2433 11.1517C19.5999 11.3334 20.0666 11.3334 21 11.3334H27.8842M21.6667 19.6666H8.33332M21.6667 26.3333H8.33332M11.6667 12.9999H8.33332M18.3333 1.33325H9.66666C6.86639 1.33325 5.46626 1.33325 4.3967 1.87822C3.45589 2.35759 2.69099 3.12249 2.21162 4.0633C1.66666 5.13286 1.66666 6.53299 1.66666 9.33325V26.6666C1.66666 29.4668 1.66666 30.867 2.21162 31.9365C2.69099 32.8773 3.45589 33.6423 4.3967 34.1216C5.46626 34.6666 6.86639 34.6666 9.66666 34.6666H20.3333C23.1336 34.6666 24.5337 34.6666 25.6033 34.1216C26.5441 33.6423 27.309 32.8773 27.7884 31.9365C28.3333 30.867 28.3333 29.4668 28.3333 26.6666V11.3333L18.3333 1.33325Z'
                      stroke='white'
                      stroke-width='1.5'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                </>
              )}
              <div className='truncate w-[85%]'>
                <h1 className='px-4 text-white font-inter text-sm font-medium leading-5 truncate !important'>
                  {params.row.Query}
                </h1>
                <span className='px-4 text-gray-400 font-inter text-sm font-normal leading-5 truncate w-3/4'>
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
              <div className='border border-[#1570EF] border-2 p-1 text-[#1570EF] rounded-2xl flex justify-center '>
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
  const addIdField1 = (data: any[]) => {
    return data.map((row1) => ({
      ...row1,
      id: uuidv4(),
    }))
  }
  const rowsWithId1 = addIdField1(rows2)

  return (
    <div className='backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
      <div className='relative w-[90vw] my-6 mx-auto'>
        <div className='border-0 rounded-lg  h-[40rem] relative flex flex-col bg-[#1D2939] outline-none focus:outline-none'>
          <div className='grid grid-cols-2 gap-4  m-1 p-2 mb-0 py-[22px]'>
            <div className='pl-2'>
              <p className='text-white  font-inter text-lg font-semibold leading-7 pl-2'>
                Review New Reports for Scattered Spider
              </p>
              <p className='text-gray-400 font-inter text-sm font-normal leading-5 pl-2'>
                You can add the selected reports to the Scattered Spider Threat Brief{' '}
              </p>
            </div>

            <div className='w-full flex justify-end mr-[1rem] px-3'>
              <div className='mr-[20px] mt-2'>
                <button
                  className={`
                      text-white mr-3 capitalize rounded-lg px-[14px] py-[6px] bg-[#EE7103] text-center flex`}
                >
                  Add Reports
                </button>
              </div>
              <button
                onClick={() => {
                  setreportpopup(false)
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='14'
                  height='14'
                  viewBox='0 0 14 14'
                  fill='none'
                >
                  <path
                    d='M13 1L1 13M1 1L13 13'
                    stroke='#98A2B3'
                    stroke-width='2'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
              </button>
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
                }}
                rows={rowsWithId1}
                columns={columns1}
                checkboxSelection
                disableSelectionOnClick
                disableColumnMenu
                hideFooterPagination
                hideFooterSelectedRowCount
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

export default AddReport
