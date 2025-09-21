import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import YamlEditorForView from '../datavault/YamlEditorForView'
import WarningScreen from './WarningScreen'
const HuntResult = ({ summaryValue }: any) => {
  const [viewHuntQuery, setviewHuntQuery] = useState(false)
  const [ymltext, setYmlText] = useState(null as any)
  const [queryValue, setqueryValue] = useState(null)

  const probabilityValue = summaryValue?.threat_actor_probability * 180 - 90
  const number = summaryValue?.threat_actor_probability
  const roundedNumber = Math.round(number * 10) / 10
  const severity =
    roundedNumber < 0.5
      ? 'Low'
      : roundedNumber < 0.7
      ? 'Moderate'
      : roundedNumber <= 1
      ? 'Severe'
      : ''

  const openHuntQuery = (e: any, data: any) => {
    setqueryValue(data?.row.Query)
    setviewHuntQuery(true)
    sethuntPopup(false)
  }

  const sortedAttacks = [...(summaryValue?.attacks || [])]?.sort((a: any, b: any) => {
    return b?.hit - a?.hit
  })

  const rows2 = [
    {
      Query: 'Query1',
      Source: 'Finished',
      Results: 'View',
    },
    {
      Query: 'Query2',
      Source: 'No Results',
      Results: '',
    },
    {
      Query: 'Query3',
      Source: 'Processing',
      Results: 'View',
    },
    {
      Query: 'Query4',
      Source: 'Processing',
      Results: '',
    },
    {
      Query: 'Query5',
      Source: 'Finished',
      Results: 'View',
    },
    {
      Query: 'Query6',
      Source: 'No Results',
      Results: '',
    },
    {
      Query: 'Query7',
      Source: 'Processing',
      Results: '',
    },
    {
      Query: 'Query8',
      Source: 'Processing',
      Results: '',
    },
  ]

  const addIdField1 = (data: any[]) => {
    return data.map((row1) => ({
      ...row1,
      id: uuidv4(),
    }))
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Attack Patterns',
      width: 320,
      sortable: false,
      filterable: false,
    },
    {
      field: 'tactic',
      headerName: 'Tactic',
      width: 220,
      sortable: false,
      filterable: false,
      align: 'left',
    },
    {
      field: 'technique',
      headerName: 'Technique',
      width: 120,
      sortable: false,
      filterable: false,
    },
    {
      field: 'hit',
      headerName: 'Hit',
      width: 100,
      sortable: false,
      filterable: false,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      sortable: false,
      filterable: false,
    },
  ]
  const columns1: GridColDef[] = [
    {
      field: 'Query',
      headerName: 'Query',
      flex: 1,
      sortable: false,
      filterable: false,
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
            {params.row.Source == 'Finished' ? (
              <div className='border-[green] border-2 p-1 text-[green] rounded-2xl flex justify-center'>
                <span style={{ padding: '0px 12px' }}>Finished</span>
              </div>
            ) : params.row.Source == 'No Results' ? (
              <div className='border-[red] border-2 p-1 text-[red] rounded-2xl flex justify-center'>
                <span>No Results</span>
              </div>
            ) : params.row.Source == 'Processing' ? (
              <div className='border-[blue] border-2 p-1 text-[blue] rounded-2xl flex justify-center'>
                <span>Processing</span>
              </div>
            ) : (
              <></>
            )}
          </>
        )
      },
    },
    {
      field: 'Results',
      headerName: 'Results',
      sortable: false,
      filterable: false,
      renderCell: (params: any) => {
        return (
          <>
            {params.row.Results == 'View' ? (
              <button onClick={(e) => openHuntQuery(e, params)}>View</button>
            ) : (
              <></>
            )}
          </>
        )
      },
    },
  ]

  const [huntPopup, sethuntPopup] = useState(false)
  const [warnPopup, setwarnPopup] = useState(false)
  const rowsWithId1 = addIdField1(rows2)

  const hitCount = summaryValue?.attacks?.filter((attack: any) => attack.hit == true).length

  return (
    <div style={{ height: '68vh', width: '100%', position: 'relative', zIndex: 0 }}>
      <div className='text-[#fff]'>
        <div className='grid grid-cols-3 mt-[24px] mb-[8px] w-full gap-[24px]'>
          <div>
            <div className='mb-[8px]'>
              <p className='text-base font-semibold'>
                Probability of this attack in your environment
              </p>
            </div>
            <div
              className='flex bg-[#101828] border border-solid border-gray-800 h-[132px] gap-[24px]'
              style={{ borderRadius: '12px', padding: '24px 24px 24px 12px' }}
            >
              <div className='flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='114'
                  height='92'
                  viewBox='0 0 114 92'
                  fill='none'
                >
                  <path
                    d='M28.291 16.0568C26.5374 13.6444 27.0598 10.2411 29.6352 8.73712C37.8673 3.92955 47.2565 1.37023 56.8537 1.36782C66.4508 1.36542 75.8413 3.92003 84.0758 8.72348C86.6519 10.2262 87.1761 13.6292 85.4237 16.0424C83.6713 18.4556 80.3073 18.9577 77.6945 17.5199C71.3364 14.0211 64.1714 12.166 56.8564 12.1678C49.5413 12.1697 42.3772 14.0283 36.0209 17.5303C33.4088 18.9694 30.0445 18.4691 28.291 16.0568Z'
                    fill='#EAAA08'
                  />
                  <path
                    d='M17.5491 83.934C15.1363 85.687 11.7332 85.1637 10.2298 82.588C5.42429 74.3547 2.86733 64.9648 2.86733 55.3677C2.86734 45.7705 5.4243 36.3806 10.2298 28.1473C11.7332 25.5716 15.1364 25.0483 17.5491 26.8013C19.9619 28.5543 20.4631 31.9184 19.0246 34.5309C15.5242 40.8881 13.6673 48.0526 13.6673 55.3677C13.6673 62.6827 15.5242 69.8472 19.0246 76.2044C20.4631 78.8169 19.9619 82.1811 17.5491 83.934Z'
                    fill='#079455'
                  />
                  <path
                    d='M96.1858 26.8013C98.5985 25.0483 102.002 25.5716 103.505 28.1473C108.311 36.3806 110.868 45.7705 110.868 55.3677C110.868 64.9649 108.311 74.3547 103.505 82.588C102.002 85.1637 98.5985 85.687 96.1858 83.934C93.773 82.1811 93.2718 78.8169 94.7103 76.2044C98.2107 69.8473 100.068 62.6828 100.068 55.3677C100.068 48.0526 98.2106 40.8881 94.7103 34.5309C93.2718 31.9184 93.773 28.5543 96.1858 26.8013Z'
                    fill='#D92D20'
                  />
                  <path
                    style={{
                      transform: `rotate(${
                        probabilityValue >= 0 && probabilityValue <= 100
                          ? probabilityValue * 2.4 - 120
                          : '-120'
                      }deg)`,
                      transformOrigin: '48% 65%',
                    }}
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M63.6184 45.0716C63.2472 44.8391 62.973 44.4745 62.8845 44.0456L58.3373 21.9925C58.0081 20.3964 55.7282 20.3964 55.3991 21.9925L50.8431 44.0876C50.7553 44.5134 50.4843 44.8761 50.1171 45.109C46.5728 47.3567 44.2202 51.3149 44.2202 55.8224C44.2202 62.8238 49.896 68.4996 56.8974 68.4996C63.8987 68.4996 69.5745 62.8238 69.5745 55.8224C69.5745 51.2898 67.1957 47.3127 63.6184 45.0716ZM64.5041 55.8225C64.5041 60.0233 61.0986 63.4288 56.8978 63.4288C52.697 63.4288 49.2915 60.0233 49.2915 55.8225C49.2915 51.6217 52.697 48.2162 56.8978 48.2162C61.0986 48.2162 64.5041 51.6217 64.5041 55.8225Z'
                    fill='white'
                  />
                </svg>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className='text-base font-semibold'>{severity}</div>
              </div>
            </div>
          </div>
          <div>
            <p className='text-base font-semibold mb-[8px]'>Attack Patterns</p>
            <div
              style={{
                background: '#101828',
                borderRadius: '12px',
                border: '1px solid #32435A',
                overflow: 'hidden',
              }}
            >
              <div
                className='bg-[#32435A]'
                style={{ display: 'flex', flexDirection: 'row', height: '60px', border: '0' }}
              >
                <div
                  style={{
                    flex: '1',
                    padding: '12px 24px',
                    color: '#fff',
                    lineHeight: '18px',
                    fontSize: '12px',
                    textAlign: 'center',
                    alignContent: 'center',
                  }}
                >
                  <span>TTPs</span>
                </div>
                <div
                  style={{
                    flex: '1',
                    padding: '12px 24px',
                    color: '#fff',
                    lineHeight: '18px',
                    fontSize: '12px',
                    width: '1',
                    textAlign: 'center',
                    alignContent: 'center',
                  }}
                >
                  <span>Hits</span>
                </div>
              </div>
              <div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    height: '72px',
                    background: '#101828',
                    borderBottom: '1px solid #32435A',
                  }}
                >
                  <div
                    style={{
                      flex: '1',
                      color: '#fff',
                      padding: '16px 24px',
                      textAlign: 'center',
                      alignContent: 'center',
                    }}
                  >
                    {summaryValue?.total_attacks}
                  </div>
                  <div
                    style={{
                      flex: '1',
                      color: '#fff',
                      padding: '16px 24px',
                      textAlign: 'center',
                      alignContent: 'center',
                    }}
                  >
                    {hitCount}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className='text-base font-semibold mb-[8px]'>Hunt Queries</p>
            <div
              style={{
                background: '#101828',
                borderRadius: '12px',
                border: '1px solid #32435A',
                overflow: 'hidden',
              }}
            >
              <div
                className='bg-[#32435A]'
                style={{ display: 'flex', flexDirection: 'row', height: '60px', border: '0' }}
              >
                <div
                  style={{
                    flex: '1',
                    padding: '12px 24px',
                    color: '#fff',
                    lineHeight: '18px',
                    fontSize: '12px',
                    textAlign: 'center',
                    alignContent: 'center',
                  }}
                >
                  <span>Total Queries</span>
                </div>
                <div
                  style={{
                    flex: '1',
                    padding: '12px 24px',
                    color: '#fff',
                    lineHeight: '18px',
                    fontSize: '12px',
                    width: '1',
                    textAlign: 'center',
                    alignContent: 'center',
                  }}
                >
                  <span>{'Time Taken (Mins)'}</span>
                </div>
              </div>
              <div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    height: '72px',
                    background: '#101828',
                    borderBottom: '1px solid #32435A',
                  }}
                >
                  <div
                    style={{
                      flex: '1',
                      color: '#fff',
                      padding: '16px 24px',
                      textAlign: 'center',
                      alignContent: 'center',
                    }}
                  >
                    {summaryValue?.total_queries}
                  </div>
                  <div
                    style={{
                      flex: '1',
                      color: '#fff',
                      padding: '16px 24px',
                      textAlign: 'center',
                      alignContent: 'center',
                    }}
                  >
                    {summaryValue?.total_time}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className='text-base font-semibold mb-[8px]'>Attack Pattern Details</p>
          <div>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                sx={{
                  boxShadow: 10,
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
                }}
                rows={sortedAttacks?.length > 0 ? sortedAttacks : []}
                columns={columns}
                disableSelectionOnClick
                hideFooterSelectedRowCount
                disableColumnMenu
                classes={{
                  columnHeadersInner: 'custom-data-grid-columnHeadersInner',
                  sortIcon: 'custom-data-grid-sortIcon',
                  footerContainer: 'custom-data-grid-footerContainer',
                }}
              />
            </div>
          </div>
        </div>

        {huntPopup && (
          <>
            <div className='backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
              <div className='relative w-[90vw] my-6 mx-auto'>
                <div className='border-0 rounded-lg  h-[40rem] relative flex flex-col bg-[#1D2939] outline-none focus:outline-none'>
                  <div className='grid grid-cols-3 gap-4 justify-items-center m-1 p-2 mb-0 p-[24px] '>
                    <div className=''></div>
                    <div className='text-white text-2xl font-bold max-md:text-xl'>
                      <nav className='flex' aria-label='Breadcrumb'>
                        <ol className='inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse'>
                          <li className='inline-flex items-center'>
                            <a
                              href='#'
                              className='inline-flex items-center text-sm font-medium text-white-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white'
                            >
                              Primary Queries
                            </a>
                          </li>
                          <li>
                            <div className='flex items-center'>
                              <svg
                                className='rtl:rotate-180 w-3 h-3 text-gray-400 mx-1'
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 6 10'
                              >
                                <path
                                  stroke='currentColor'
                                  stroke-linecap='round'
                                  stroke-linejoin='round'
                                  stroke-width='2'
                                  d='m1 9 4-4-4-4'
                                />
                              </svg>
                              <a
                                href='#'
                                className='ms-1 text-sm font-medium text-white-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white'
                              >
                                AWS Queries
                              </a>
                            </div>
                          </li>
                          <li aria-current='page'>
                            <div className='flex items-center'>
                              <svg
                                className='rtl:rotate-180 w-3 h-3 text-gray-400 mx-1'
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 6 10'
                              >
                                <path
                                  stroke='currentColor'
                                  stroke-linecap='round'
                                  stroke-linejoin='round'
                                  stroke-width='2'
                                  d='m1 9 4-4-4-4'
                                />
                              </svg>
                              <span className='ms-1 text-sm font-medium text-orange-500 md:ms-2 dark:text-gray-400'>
                                Query Results
                              </span>
                            </div>
                          </li>
                        </ol>
                      </nav>
                    </div>

                    <div className='w-full flex justify-end mr-[0.5rem] items-center'>
                      <button
                        onClick={() => {
                          sethuntPopup(false)
                        }}
                      >
                        <svg
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
                          'div.MuiDataGrid-columnHeader, .MuiDataGrid-cell.MuiDataGrid-cell--textLeft':
                            {
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
                        }}
                        rows={rowsWithId1}
                        columns={columns1}
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
          </>
        )}
        {viewHuntQuery && (
          <>
            <div className='backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
              <div className='relative w-[90vw] my-6 mx-auto'>
                <div className='border-0 rounded-lg  h-[40rem] relative flex flex-col bg-[#1D2939] outline-none focus:outline-none'>
                  <div className='grid grid-cols-3 gap-4 justify-items-center m-1 p-2 mb-0 p-[24px] whitespace-nowrap'>
                    <div className='w-full flex justify-start'>
                      <span
                        className='cursor-pointer'
                        onClick={() => {
                          sethuntPopup(true)
                          setviewHuntQuery(false)
                        }}
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                        >
                          <path
                            d='M19 12H5M5 12L12 19M5 12L12 5'
                            stroke='white'
                            stroke-width='2'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                        </svg>
                      </span>
                    </div>
                    <div className='text-white text-2xl font-bold max-md:text-xl'>
                      <nav className='flex' aria-label='Breadcrumb'>
                        <ol className='inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse'>
                          <li className='inline-flex items-center'>
                            <a
                              href='#'
                              className='inline-flex items-center text-sm font-medium text-white-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white'
                            >
                              Primary Queries
                            </a>
                          </li>
                          <li>
                            <div className='flex items-center'>
                              <svg
                                className='rtl:rotate-180 w-3 h-3 text-gray-400 mx-1'
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 6 10'
                              >
                                <path
                                  stroke='currentColor'
                                  stroke-linecap='round'
                                  stroke-linejoin='round'
                                  stroke-width='2'
                                  d='m1 9 4-4-4-4'
                                />
                              </svg>
                              <a
                                href='#'
                                className='ms-1 text-sm font-medium text-white-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white'
                              >
                                AWS Queries
                              </a>
                            </div>
                          </li>
                          <li aria-current='page'>
                            <div className='flex items-center'>
                              <svg
                                className='rtl:rotate-180 w-3 h-3 text-gray-400 mx-1'
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 6 10'
                              >
                                <path
                                  stroke='currentColor'
                                  stroke-linecap='round'
                                  stroke-linejoin='round'
                                  stroke-width='2'
                                  d='m1 9 4-4-4-4'
                                />
                              </svg>
                              <span className='ms-1 text-sm font-medium text-orange-500 md:ms-2 dark:text-gray-400'>
                                Query Results
                              </span>
                            </div>
                          </li>
                          <li aria-current='page'>
                            <div className='flex items-center'>
                              <svg
                                className='rtl:rotate-180 w-3 h-3 text-gray-400 mx-1'
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 6 10'
                              >
                                <path
                                  stroke='currentColor'
                                  stroke-linecap='round'
                                  stroke-linejoin='round'
                                  stroke-width='2'
                                  d='m1 9 4-4-4-4'
                                />
                              </svg>
                              <span className='ms-1 text-sm font-medium text-orange-500 md:ms-2 dark:text-gray-400'>
                                {queryValue}
                              </span>
                            </div>
                          </li>
                        </ol>
                      </nav>
                    </div>

                    <div className='w-full flex justify-end mr-[0.5rem] items-center'>
                      <button
                        onClick={() => {
                          setviewHuntQuery(false)
                        }}
                      >
                        <svg
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
                  <div className='flex pb-6 justify-center gap-4 items-center px-6'>
                    <div
                      style={{
                        height: '520px',
                        width: '100%',
                        textAlign: 'left',
                        overflowY: 'hidden',
                        backgroundColor: '#0C111D',
                        borderRadius: '1rem',
                      }}
                    >
                      <YamlEditorForView
                        ymltext={ymltext}
                        setYmlText={setYmlText}
                        isEdit={() => {}}
                        setValue={() => {}}
                        setSeloctror={() => {}}
                        modeOfView={'translate'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {warnPopup && <WarningScreen setwarnPopup={setwarnPopup} />}
      </div>
    </div>
  )
}

export default HuntResult
