import { useState } from 'react'
import FolderTreeView from './FolderTreeView'
import NewFolderModal from './NewFolderModal'

function ImportsFolders({
  importFolderList,
  setSelectFolders,
  selectFolders,
  setDeleteimport,
  setUploadFile,
  isModalOpen,
  setModalOpen,
  setisLoading,
  Importing,
  setImportFolders,
  importFolders
}: any) {
  const [selectId, setSelectId] = useState(null as any)

  return (
    <div className='bg-[#1d2939] rounded-lg p-8 flex flex-col gap-6 w-full h-full overflow-scroll hide-scrollbar'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='text-white font-semibold text-lg'>Rule Folders</div>
        <div
          onClick={() => {
            setModalOpen(true), setSelectFolders(null)
          }}
          className='flex items-center gap-2 cursor-pointer'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
          >
            <path
              d='M10.0001 4.16675V15.8334M4.16675 10.0001H15.8334'
              stroke='#EE7103'
              stroke-width='1.66667'
              stroke-linecap='round'
              stroke-linejoin='round'
            />
          </svg>
          <div className='text-[#ee7103] font-semibold text-md'>New Folder</div>
        </div>
      </div>

      {/* Navigation */}
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-[#334155] max-lg:border-b max-lg:border-b-[#31445a] max-lg:rounded-none max-lg:pb-4'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
          >
            <path
              d='M7.5 3H14.6C16.8402 3 17.9603 3 18.816 3.43597C19.5686 3.81947 20.1805 4.43139 20.564 5.18404C21 6.03969 21 7.15979 21 9.4V16.5M6.2 21H14.3C15.4201 21 15.9802 21 16.408 20.782C16.7843 20.5903 17.0903 20.2843 17.282 19.908C17.5 19.4802 17.5 18.9201 17.5 17.8V9.7C17.5 8.57989 17.5 8.01984 17.282 7.59202C17.0903 7.21569 16.7843 6.90973 16.408 6.71799C15.9802 6.5 15.4201 6.5 14.3 6.5H6.2C5.0799 6.5 4.51984 6.5 4.09202 6.71799C3.71569 6.90973 3.40973 7.21569 3.21799 7.59202C3 8.01984 3 8.57989 3 9.7V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.0799 21 6.2 21Z'
              stroke='#657890'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
            />
          </svg>
          <div className='text-white font-medium text-mdtsx'>All Files</div>
        </div>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='296'
          height='2'
          viewBox='0 0 296 2'
          fill='none'
          className='w-full max-lg:hidden'
        >
          <path d='M0 1H296' stroke='#32435A' />
        </svg>
        <FolderTreeView
          data={importFolderList}
          setSelectFolders={setSelectFolders}
          selectFolders={selectFolders}
          setDeleteimport={setDeleteimport}
          setModalOpen={setModalOpen}
          setSelectId={setSelectId}
          selectId={selectId}
          setisLoading={setisLoading}
          Importing={Importing}
          setImportFolders={setImportFolders}
          importFolders={importFolders}
          setUploadFile={setUploadFile}
        />
      </div>

    </div>
  )
}

export default ImportsFolders
