import { Divider } from '@mui/material'
import React, { useState } from 'react'
import AddCTISourceDialog from './AddCTISourceDialog'
import CTIReportsTables from './CTIReportsTables'
import CTIReportsCards from './CTIReportsCards'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import CustomToast from '../../../layouts/App/CustomToast'
import toast from 'react-hot-toast'
import { datavalutPdfUpload } from '../../../redux/nodes/datavault/action'

function CTIReportsLists({ ctireportsList, defaultId, setAddctireport, reloading }: any) {
  const [activeList, setActiveList] = useState('list' as any)
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState<string>('')
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadepdf, setUploadepdf] = useState(null as any)
  const [pdferror, setPdfError] = useState(null as any)
  const dispatch = useDispatch()
  const handletabchange = (text: any) => {
    setActiveList(text)
    sessionStorage.setItem('activeTab', JSON.stringify(text))
  }

  const tabitem: any = JSON.parse(sessionStorage.getItem('activeTab') as any)

  const sortedData: any =
    ctireportsList?.length > 0
      ? ctireportsList
        ?.filter(
          (item: any) =>
            item?.status?.toLowerCase().includes(search?.toLowerCase()) ||
            item?.url
              ?.toLowerCase()
              .includes(
                search?.toLowerCase().endsWith('\\') || search?.toLowerCase().endsWith('/')
                  ? search?.toLowerCase().slice(0, -1)
                  : search?.toLowerCase(),
              ) ||
            item?.ctiName
              ?.replace(/-/g, ' ')
              ?.toLowerCase()
              .includes(search?.replace(/-/g, ' ')?.toLowerCase()) ||
            item?.filename?.toLowerCase().includes(search?.toLowerCase()) ||
            item?.viweStatus?.toLowerCase().includes(search?.toLowerCase()) ||
            item?.intelCount?.data?.SIGMA?.toString().includes(search) ||
            moment(item.creationTime)
              .format('HH:mm')
              .toLowerCase()
              .includes(moment(search).format('HH:mm')?.toLowerCase()) ||
            moment(item.creationTime).format('HH').toLowerCase().includes(search) ||
            moment(item.creationTime)
              .format('MMM')
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            moment(item.creationTime).format('DD').toLowerCase().includes(search) ||
            moment(item?.creationTime)
              .format('DD-MMM HH:mm')
              .toLowerCase()
              .includes(moment(search).format('DD-MMM HH:mm')?.toLowerCase()) ||
            moment(item?.creationTime)
              .format('DD-MMM')
              .toLowerCase()
              .includes(moment(search).format('DD-MMM')?.toLowerCase()),
        )
      : []

  const [sortedDataList, setSortedDataList] = useState([] as any)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files: any = event.target.files
    const filterPdf: any = ctireportsList.filter((item: any) => {
      return item?.reportSource == 'PDF'
    })
    const containsSearchString = filterPdf.some((report: any) =>
      report?.ctiName
        ?.replace(/-/g, ' ')
        ?.replace(/\.pdf$/i, '')
        ?.includes(files[0]?.name?.replace(/-/g, ' ')?.replace(/\.pdf$/i, '')),
    )

    if (files && files.length > 0) {
      if (files[0]?.type == 'application/pdf' && !containsSearchString) {
        setPdfError(null)
        setUploadepdf(files[0])
        setUploadProgress(0) // Reset progress
        simulateUpload(files[0]) // Start simulated upload
      } else {
        setUploadepdf(null)
        setPdfError(containsSearchString ? 'A CTI Report already exists' : 'Select pdf only')
      }
    }
  }

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault() // Allow the drop action
  }

  const handleDragLeave = () => { }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    const files = event.dataTransfer.files
    const filterPdf: any = ctireportsList.filter((item: any) => {
      return item?.reportSource == 'PDF'
    })
    const containsSearchString = filterPdf.some((report: any) =>
      report?.ctiName
        ?.replace(/-/g, ' ')
        ?.replace(/\.pdf$/i, '')
        ?.includes(files[0]?.name?.replace(/-/g, ' ')?.replace(/\.pdf$/i, '')),
    )
    if (files.length > 0) {
      const file = files[0] // Assuming we only want the first file
      if (file && file.type === 'application/pdf' && !containsSearchString) {
        setPdfError(null)
        setUploadepdf(files[0])
        setUploadProgress(0) // Reset progress
        simulateUpload(files[0]) // Start simulated upload
      } else {
        setUploadepdf(null)
        setPdfError(containsSearchString ? 'A CTI Report already exists' : 'Select pdf only')
      }
    }
  }

  const handleFileUpload = () => {
    setIsOpen(false)
    const toastId = toast.loading(
      <CustomToast
        message='Your file is being uploaded'
        onClose={() => toast.dismiss(toastId)} // Dismiss only this toast
      />,
      {
        duration: 1000000,
        position: 'top-center',
        style: {
          background: '#fff',
          color: '#000', // White text color
          width: '500px',
        },
      },
    )
    const data = new FormData()
    let objects = {
      datavaultId: defaultId?.id,
      ctiName: uploadepdf.name,
    }
    data.append('pdf-file', uploadepdf as any)
    dispatch(datavalutPdfUpload(objects, data) as any)
      .then((res: any) => {
        if (res.type == 'PDF_UPLOAD_SUCCESS') {
          toast.success(
            <CustomToast
              message='File uploaded successfully!'
              onClose={() => toast.dismiss(toastId)} // Dismiss only this toast
            />,
            {
              duration: 4000,
              position: 'top-center',
              style: {
                background: '#fff',
                color: '#000', // White text color
                width: '500px',
              },
            },
          )
          toast.dismiss(toastId)
          setUploadepdf(null)
        } else {
          toast.error(
            <CustomToast
              message='Failed to upload CTI report'
              onClose={() => toast.dismiss(toastId)} // Dismiss only this toast
            />,
            {
              duration: 4000,
              position: 'top-center',
              style: {
                background: '#fff',
                color: '#000', // White text color
                width: '500px',
              },
            },
          )
          toast.dismiss(toastId)
        }
      })
      .catch((error: any) => {
        toast.error(
          <CustomToast
            message='File upload failed. Please try again.'
            onClose={() => toast.dismiss(toastId)} // Dismiss only this toast
          />,
          {
            duration: 4000,
            position: 'top-center',
            style: {
              background: '#fff',
              color: '#000', // White text color
              width: '500px',
            },
          },
        )
        toast.dismiss(toastId)
      })
  }

  const simulateUpload = (file: File) => {
    setIsUploading(true)

    // Simulate upload progress
    const totalUploadTime = 5000 // 5 seconds total time
    const intervalTime = 200 // Update every 200ms
    const progressIncrement = 100 / (totalUploadTime / intervalTime)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          // alert("File uploaded successfully!");
          return prev
        }
        return prev + progressIncrement
      })
    }, intervalTime)
  }


  // **********************************************************
  // const handleSortModelChange = (sortModel: GridSortModel) => {
  //   const { field, sort } = sortModel[0]
  //   let datas: any = sortedDataList?.length > 0 ? [...sortedDataList] : [...TablesList]

  //   if (field === 'ctiName') {
  //     const sortedValues = datas
  //       ?.slice()
  //       .sort((a: any, b: any) =>
  //         sort === SortingOrder.Ascending
  //           ? a.ctiName?.localeCompare(b.ctiName)
  //           : b.ctiName?.localeCompare(a.ctiName),
  //       )
  //     setSortedDataList(sortedValues)
  //   } else if (field === 'reportSource') {
  //     const sortedValues = datas
  //       ?.slice()
  //       .sort((a: any, b: any) =>
  //         sort === SortingOrder.Ascending
  //           ? a.reportSource?.localeCompare(b.reportSource)
  //           : b.reportSource?.localeCompare(a.reportSource),
  //       )
  //     setSortedDataList(sortedValues)
  //   } else if (field === 'intel') {
  //     const sortedValues = datas
  //       ?.slice()
  //       .sort((a: any, b: any) =>
  //         sort === SortingOrder.Ascending
  //           ? (a?.intelCount?.data?.SIGMA ?? 0) - (b?.intelCount?.data?.SIGMA ?? 0)
  //           : (b?.intelCount?.data?.SIGMA ?? 0) - (a?.intelCount?.data?.SIGMA ?? 0),
  //       )
  //     setSortedDataList(sortedValues)
  //   } else if (field === 'creationTime') {
  //     const sortedValues = datas?.slice().sort(
  //       (a: any, b: any) =>
  //         sort === SortingOrder.Ascending
  //           ? new Date(a.creationTime).getTime() - new Date(b.creationTime).getTime() // Ascending order
  //           : new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime(), // Descending order
  //     )
  //     setSortedDataList(sortedValues)
  //   }
  // }


  return (
    <div className='w-full'>
      <div className='mb-6 flex items-center justify-between gap-4 w-full max-md:flex-wrap'>
        <div className='max-md:w-full'>
          <div className='flex items-center space-x-2 bg-dark max-md:w-full'>
            <div className='flex items-center box-border bg-[#48576c] p-2 rounded-lg border border-[#6e7580] w-[376px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] max-md:w-full'>
              <input
                type='text'
                placeholder='Search'
                className='bg-[#48576c] outline-none rounded-l-lg text-[#fff] w-full  placeholder-[#fff]'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='none'
              >
                <path
                  d='M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z'
                  stroke='white'
                  stroke-width='1.66667'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                />
              </svg>
            </div>
          </div>
        </div>

        <div className='flex gap-4 ml-auto'>
          <div className='flex'>
            <button
              className={`${(tabitem ? tabitem : activeList) == 'list' ? 'bg-[#48576C]' : 'bg-[#0F121B]'
                } text-white py-1 px-4 rounded-l-lg border border-[#48576C] font-inter font-semibold`}
              onClick={() => handletabchange('list')}
            >
              LIST
            </button>
            <button
              className={`${(tabitem ? tabitem : activeList) == 'grid' ? 'bg-[#48576C]' : 'bg-[#0F121B]'
                } text-white py-1 px-4 rounded-r-lg border border-[#48576C] font-inter font-semibold`}
              onClick={() => handletabchange('grid')}
            >
              GRID
            </button>
          </div>
          <Divider orientation='vertical' flexItem sx={{ borderColor: '#c2c8d3' }} />
          <button
            className='bg-orange-600 text-white py-1 px-4 rounded-lg font-inter font-semibold text-[14px]'
            onClick={() => setIsOpen(true)}
          >
            ADD REPORT
          </button>
        </div>
      </div>
      {(tabitem ? tabitem : activeList) == 'grid' ? (
        <>
          {sortedData?.length > 0 ? (
            <CTIReportsCards
              cardList={sortedData}
              setAddctireport={setAddctireport}
              sortedDataList={sortedDataList}
              search={search}
              setSortedDataList={setSortedDataList}
              reloading={reloading}
            />
          ) : (
            <>
              {sortedData?.length == 0 && search && (
                <div className='flex items-center justify-center min-h-screen mt-[-200px] text-white'>
                  No results found
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <CTIReportsTables
            TablesList={sortedData}
            setAddctireport={setAddctireport}
            sortedDataList={sortedDataList}
            setSortedDataList={setSortedDataList}
            search={search}
            reloading={reloading}
            setIsOpen={setIsOpen}
          />
        </>
      )}
      {isOpen && (
        <AddCTISourceDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          ctireportsList={ctireportsList}
          defaultId={defaultId}
          setAddctireport={setAddctireport}
          handleFileChange={handleFileChange}
          handleDragEnter={handleDragEnter}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          handleFileUpload={handleFileUpload}
          pdferror={pdferror}
          uploadepdf={uploadepdf}
          setUploadepdf={setUploadepdf}
          uploadProgress={uploadProgress}
          isUploading={isUploading}
          setPdfError={setPdfError}
        />
      )}
    </div>
  )
}

export default CTIReportsLists
