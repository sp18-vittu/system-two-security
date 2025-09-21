function DatavalutdeleteDilog({ onClose, remove }: any) {
  return (
    <>
      <div className='backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
        <div className='relative my-6 w-96'>
          <div className='border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none'>
            <div className='items-start justify-between p-5 border-solid border-slate-200 rounded-t'>
              <h6 className='text-1xl text-black font-semibold justify-center items-center text-center'>
                Delete All CTI Report
              </h6>
              <p className='text-black justify-center items-center text-center'>
                This action will delete all CTI reports in this repository. Are you sure you want to
                proceed?
              </p>
            </div>
            <div className='grid gap-4 grid-cols-2 p-2'>
              <button
                className='w-44 h-10 rounded-lg gap-2 class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'
                type='button'
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                onClick={remove}
                className='w-44 h-10 bg-red-600 text-white font-bold text-sm px-6 py-3 rounded-lg outline-none mb-2'
                type='button'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
    </>
  )
}

export default DatavalutdeleteDilog
