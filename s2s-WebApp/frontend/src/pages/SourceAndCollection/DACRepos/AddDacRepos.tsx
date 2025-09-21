import DacReposTable from './DacReposTable'

function AddDacRepos({ setModalOpen, selectId, dacfoldersList, setUploadFile,
  isLoading,
  page,
  setPage,
  pageSize,
  setPageSize,
  totalRows, }: any) {
  return (
    <>
      {!selectId ? (
        // <div className='bg-[#1d2939] rounded-lg p-8 flex flex-col gap-6 items-center justify-start w-full h-full'>
        //   <div className='flex items-center h-full'>
        //     <div className='border border-dashed border-[#59687c] rounded-lg px-14 py-8 max-sm:p-6 flex flex-col gap-6 items-center justify-center'>
        //       <div className='text-center'>
        //         <div className='text-white font-semibold text-lg'>No Repo Found</div>
        //         <div className='text-[#98a2b3] font-normal text-md'>
        //           You have not added any repo yet
        //         </div>
        //       </div>

        //       <button
        //         onClick={() => setModalOpen(true)}
        //         className='bg-[#ee7103] text-white font-semibold text-md px-4 py-2 rounded-md flex items-center gap-2 shadow-sm'
        //       >
        //         Add Repo
        //         <svg
        //           xmlns='http://www.w3.org/2000/svg'
        //           width='21'
        //           height='20'
        //           viewBox='0 0 21 20'
        //           fill='none'
        //         >
        //           <path
        //             d='M10.5 6.66667V13.3333M7.16667 10H13.8333M7 17.5H14C15.4001 17.5 16.1002 17.5 16.635 17.2275C17.1054 16.9878 17.4878 16.6054 17.7275 16.135C18 15.6002 18 14.9001 18 13.5V6.5C18 5.09987 18 4.3998 17.7275 3.86502C17.4878 3.39462 17.1054 3.01217 16.635 2.77248C16.1002 2.5 15.4001 2.5 14 2.5H7C5.59987 2.5 4.8998 2.5 4.36502 2.77248C3.89462 3.01217 3.51217 3.39462 3.27248 3.86502C3 4.3998 3 5.09987 3 6.5V13.5C3 14.9001 3 15.6002 3.27248 16.135C3.51217 16.6054 3.89462 16.9878 4.36502 17.2275C4.8998 17.5 5.59987 17.5 7 17.5Z'
        //             stroke='white'
        //             stroke-width='1.66667'
        //             stroke-linecap='round'
        //             stroke-linejoin='round'
        //           />
        //         </svg>
        //       </button>
        //     </div>
        //   </div>
        // </div>
        <div className='bg-[#1d2939] rounded-lg p-8 flex flex-col gap-6 items-start justify-start w-full h-full'>
          <div className='text-left font-inter font-semibold text-[20px] leading-[24px] font-semibold relative'></div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center flex flex-col justify-center items-center h-full w-full ${'border-[#fff] bg-[#1d2939]'}`}
          >

            <div className='flex flex-col items-center justify-center'>
              <div className='text-center'>
                <div className='text-white font-semibold text-lg'>No Repo Found</div>
                <div className='text-[#98a2b3] font-normal text-md'>
                  You have not added any repo yet
                </div>
              </div>

              <button
                onClick={() => setModalOpen(true)}
                className='bg-[#ee7103] text-white font-semibold text-md px-4 py-2 rounded-md flex items-center gap-2 shadow-sm mt-2'
              >
                Add Repo
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='21'
                  height='20'
                  viewBox='0 0 21 20'
                  fill='none'
                >
                  <path
                    d='M10.5 6.66667V13.3333M7.16667 10H13.8333M7 17.5H14C15.4001 17.5 16.1002 17.5 16.635 17.2275C17.1054 16.9878 17.4878 16.6054 17.7275 16.135C18 15.6002 18 14.9001 18 13.5V6.5C18 5.09987 18 4.3998 17.7275 3.86502C17.4878 3.39462 17.1054 3.01217 16.635 2.77248C16.1002 2.5 15.4001 2.5 14 2.5H7C5.59987 2.5 4.8998 2.5 4.36502 2.77248C3.89462 3.01217 3.51217 3.39462 3.27248 3.86502C3 4.3998 3 5.09987 3 6.5V13.5C3 14.9001 3 15.6002 3.27248 16.135C3.51217 16.6054 3.89462 16.9878 4.36502 17.2275C4.8998 17.5 5.59987 17.5 7 17.5Z'
                    stroke='white'
                    stroke-width='1.66667'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
              </button>
            </div>
          </div>

        </div>
      ) : (
        <DacReposTable
          selectId={selectId}
          dacfoldersList={dacfoldersList}
          setUploadFile={setUploadFile}
          isLoading={isLoading}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalRows={totalRows}
        />
      )}
    </>
  )
}

export default AddDacRepos
