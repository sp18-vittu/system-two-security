import React, { Fragment } from 'react'
import { Button, Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import EditIcon from '@mui/icons-material/Edit'

function CollectionsGridView({
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
  return (
    <div>
      {filterdata.length > 0 ? (
        <>
          <div
            className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 overflow-y-scroll scrollbar-hide'
            style={{ maxHeight: `calc(${dynamicHeight - 50}px)` }}
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
  )
}

export default CollectionsGridView
