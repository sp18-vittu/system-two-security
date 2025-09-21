import React from 'react'

function CtiReportSidebar({ openCtiside, ctiReportList, CTIFileName, CTISelectedFile }: any) {
  return (
    <div
      className={`bg-[#101828] fixed right-0 ${'top-[70px]'} h-screen w-[350px] transition-all duration-300 ease-in z-50
        ${openCtiside ? 'translate-x-0' : 'translate-x-full'}
        `}
    >
      <div className='relative'>
        <div id='list' className={`p-[24px]`} onClick={(e) => e.stopPropagation()}>
          <div className='flex flex-col justify-between items-center mb-4'>
            <div className='flex justify-between items-center mb-2 w-full'>
              <div>
                <p>Please attach a CTI report to chat with it</p>
              </div>
            </div>
            <div className='h-[796px] overflow-y-auto scrollbar scrollbar-thumb-gray-700 scrollbar-track-gray-300 scrollbar-thumb-rounded w-full'>
              <ul className=''>
                {ctiReportList?.length > 0 && (
                  <>
                    {[...ctiReportList]?.map((file: any, index: number) => {
                      return (
                        <li
                          className={`mt-[8px] truncate text-[#fff] text-sm font-medium ${
                            !(file.ctiName === 'No Data Found') && 'cursor-pointer'
                          }
                                                                                              ${
                                                                                                CTIFileName ===
                                                                                                file.ctiName
                                                                                                  ? 'text-orange-500'
                                                                                                  : 'text-[#fff]'
                                                                                              }`}
                          onClick={() => CTISelectedFile(file)}
                          key={index}
                        >
                          <div className='flex items-center gap-[4px]'>
                            <span>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='16'
                                height='16'
                                fill='currentColor'
                                viewBox='0 0 16 16'
                              >
                                <path
                                  stroke={CTIFileName === file.ctiName ? '#ee7103' : 'white'}
                                  d='M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3'
                                />
                              </svg>
                            </span>
                            <span className='w-[80%] truncate hover:text-orange-500'>
                              {file.ctiName}
                            </span>
                          </div>
                        </li>
                      )
                    })}
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CtiReportSidebar
