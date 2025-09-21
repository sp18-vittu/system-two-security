import React from 'react'

const DataRestrictPage: React.FC = () => {
  return (
    <div>
      <nav className='flex mb-4 mt-10 ml-2.5' aria-label='Breadcrumb'>
        <ol className='inline-flex items-center space-x-1 md:space-x-3 mt-10 ml-2.5'>
          <li className='inline-flex items-center'>
            <a
              href='#'
              className='inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600'
            >
              Data Vault
            </a>
          </li>
          <li>
            <div className='flex items-center'>
              <svg
                className='w-3 h-3 text-gray-400 mx-1'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 6 10'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='m1 9 4-4-4-4'
                />
              </svg>
              <a
                href='#'
                className='ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2'
              >
                Marketing Document
              </a>
            </div>
          </li>
          <li>
            <div className='flex items-center'>
              <svg
                className='w-3 h-3 text-gray-400 mx-1'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 6 10'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='m1 9 4-4-4-4'
                />
              </svg>

              <a
                href='#'
                className='ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 '
              >
                AddData
              </a>
            </div>
          </li>
        </ol>
      </nav>
      <h3 className='text-3xl font-bold  ml-3.5'>Add Data</h3>
      <p className='text-1xl font-bold ml-3.5'>
        Add data to your vault using the integrated data source
      </p>

      <br></br>
      <div className='bg-gray-200'>
        <div className='container mx-auto text-1xl font-bold'>
          <div className='grid grid-cols-4 gap-2 grid-flow-row p-4'>
            <div className='col-span-3'>
              <form>
                <label className='mb-2 text-sm font-medium text-gray-900 sr-only'>Search</label>
                <div className='relative'>
                  <div className='absolute inset-y-0 right-3 flex items-center pl-3 pointer-events-none'>
                    <svg
                      className='w-4 h-4 text-gray-500'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 20 20'
                    >
                      <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
                      />
                    </svg>
                  </div>
                  <input
                    type='search'
                    id='default-search'
                    className='block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500'
                    placeholder='search for an app...'
                  />
                </div>
              </form>
            </div>
            <div>
              <select
                id='countries'
                className='bg-gray-50  p-5  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              >
                <option selected>File Storage</option>
                <option value='US'>Write</option>
                <option value='CA'>Inherited</option>
              </select>
            </div>
          </div>
        </div>
        <div className='container mx-auto text-1xl font-bold'>
          <div className='grid grid-cols-3 gap-3 grid-flow-row p-4'>
            <div className='bg-white p-3 rounded-md'>
              <div className='grid grid-cols-2 gap-1 grid-flow-row'>
                <div>
                  <img src='oneDrive.webp' height={'100px'} width={'100px'} alt='' />
                  <button className='bg-gray-200 text-black font-bold py-2 px-4 rounded-3xl'>
                    3 File Storage
                  </button>
                  <p className='ml-2 mt-2'>OneDrive</p>
                </div>
                <div>
                  <div className='flex items-center mt-6'>
                    <label className='ml-2 text-sm font-medium text-gray-900'>
                      3 file selected
                    </label>
                    <input
                      checked
                      id='default-checkbox'
                      type='checkbox'
                      value=''
                      className='w-4 h-4 mx-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2'
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-white p-3 rounded-md'>
              <div className='grid grid-cols-2 gap-1 grid-flow-row'>
                <div>
                  <img src='g-drive.webp' height={'100px'} width={'100px'} alt='' />
                  <button className='bg-gray-200 text-black font-bold py-2 px-4 rounded-3xl'>
                    File Storage
                  </button>
                  <p className='ml-2 mt-2'>Google Drive</p>
                </div>
                <div>
                  <div className='flex items-center mt-6'>
                    <label className='ml-2 text-sm font-medium text-gray-900'> file selected</label>
                    <input
                      id='default-checkbox'
                      type='checkbox'
                      value=''
                      className='w-4 h-4 mx-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2'
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-white p-3 rounded-md'>
              <div className='grid grid-cols-2 gap-1 grid-flow-row'>
                <div>
                  <img src='box.webp' alt='' height={'100px'} width={'100px'} className='mt-6' />
                  <button className='bg-gray-200 mt-5 text-black font-bold py-2 px-4 rounded-3xl'>
                    File Storage
                  </button>
                  <p className='ml-2 mt-2'>Box</p>
                </div>
                <div>
                  <div className='flex items-center mt-6'>
                    <label className='ml-2 text-sm font-medium text-gray-900'> file selected</label>
                    <input
                      id='default-checkbox'
                      type='checkbox'
                      value=''
                      className='w-4 h-4 mx-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2'
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-white p-3 rounded-md'>
              <div className='grid grid-cols-2 gap-1 grid-flow-row'>
                <div>
                  <img src='dropbox.webp' alt='' height={'90px '} width={'90px'} className='mx-2' />
                  <button className='bg-gray-200 mt-3 text-black font-bold py-2 px-4 rounded-3xl'>
                    File Storage
                  </button>
                  <p className='ml-2 mt-2'>DropBox</p>
                </div>
                <div>
                  <div className='flex items-center mt-6'>
                    <label className='ml-2 text-sm font-medium text-gray-900'>
                      12 file selected
                    </label>
                    <input
                      checked
                      id='default-checkbox'
                      type='checkbox'
                      value=''
                      className='w-4 h-4 mx-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataRestrictPage
