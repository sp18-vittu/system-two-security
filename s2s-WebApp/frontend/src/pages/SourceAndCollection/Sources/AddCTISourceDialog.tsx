import React, { useEffect, useRef, useState } from 'react'
import FileUploadItem from './FileUploadItem'
import local from '../../../utils/local'
import { useDispatch } from 'react-redux'
import { addCtiWhitelist, qualifiedUrls } from '../../../redux/nodes/repository/action'
import { dataingestionUrl } from '../../../redux/nodes/datavault/action'
import { Buffer } from 'buffer'
import toast from 'react-hot-toast'
import CustomToast from '../../../layouts/App/CustomToast'
import { isAllowedUrl } from '../../../config/urlValidator'
import { useNavigate } from 'react-router-dom'

const AddCTISourceDialog = ({
  isOpen,
  setIsOpen,
  ctireportsList,
  defaultId,
  setAddctireport,
  handleFileChange,
  handleDragEnter,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileUpload,
  pdferror,
  uploadepdf,
  setUploadepdf,
  uploadProgress,
  isUploading,
  setPdfError,
}: any) => {
  const [activeTab, setActiveTab] = useState('url' as any)
  const [urlss, setUrl] = useState('')
  const dispatch = useDispatch()
  const [honourWhitelist, setHonourWhitelist] = useState(null as any)
  const [urlDomains, seturlDomines] = useState([] as any)
  const [error, setError] = useState(null as any)
  const navigateTo = useNavigate()

  useEffect(() => {
    const localStor: any = local.getItem('bearerToken')
    const tokens = JSON.parse(localStor as any)
    const bearerToken = tokens.bearerToken
    const [tokenType, token] = bearerToken.split(' ')
    let Whitelist = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString())
    setHonourWhitelist(Whitelist.honourWhitelist)
    dispatch(qualifiedUrls() as any).then((response: any) => {
      seturlDomines(response.payload)
    })
  }, [])

  const handleAdd = () => {
    const urls = urlss
    const urlParts = urls?.split('/')
    let name = urlParts[urlParts?.length - 1]
      ? urlParts[urlParts?.length - 1]
      : urlParts[urlParts?.length - 2]
        ? urlParts[urlParts?.length - 2]
        : urlParts[urlParts?.length - 3]
    let urlNameValue: any = name?.split('.')[0]
    let postdata: any = {
      url: urlss,
      ctiName: urlNameValue,
    }
    if (urls) {
      if (!honourWhitelist) {
        const trimmedUrl = urls.endsWith('\\') || urls.endsWith('/') ? urls.slice(0, -1) : urls
        let files: any = ctireportsList?.filter((item: any) => {
          return trimmedUrl == item.url
        })
        if (files?.length > 0) {
          toast.error(
            <CustomToast
              message='A CTI report already exists'
              onClose={() => toast.dismiss()} // Dismiss only this toast
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
          setError('A CTI report already exists. Please try again.')
        } else {
          const demourl: any = encodeURIComponent(postdata.url)
          postdata.url = demourl
          let id: any = defaultId?.id
          let e: any = postdata
          dispatch(dataingestionUrl({ e, id }) as any)
            .then((data: any) => {
              if (data.type == 'DATAVAULT_DATAINGESTIONURL_SUCCESS') {
                setAddctireport('add')
                toast.success(
                  <CustomToast
                    message='CTI report submitted successfully.'
                    onClose={() => toast.dismiss()} // Dismiss only this toast
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
                sessionStorage.setItem('active', 'sources')
                navigateTo('/app/sourcespage')
                sessionStorage.setItem('srcactiveTab', JSON.stringify(1))
                setUrl('')
                setIsOpen(false)
                setUploadepdf(null)
              }
            })
            .catch((err: any) => {
              console.log(err)
            })
        }
      } else {
        const url = new URL(postdata.url)
        let hostname = new URL(url).hostname.replace(/^www\./, '')
        let baseurls = urlDomains?.find((x: any) => x.baseUrl == hostname)
        const trimmedUrl =
          postdata.url.endsWith('\\') || postdata.url.endsWith('/')
            ? postdata.url.slice(0, -1)
            : postdata.url
        if (baseurls) {
          let files: any = ctireportsList?.filter((item: any) => {
            return trimmedUrl == item.url
          })
          if (files?.length > 0) {
            toast.error(
              <CustomToast
                message='A CTI report already exists'
                onClose={() => toast.dismiss()} // Dismiss only this toast
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
            setError('A CTI Report already exists and try again')
          } else {
            let id: any = defaultId?.id
            let e: any = postdata
            dispatch(dataingestionUrl({ e, id }) as any)
              .then((data: any) => {
                if (data.type == 'DATAVAULT_DATAINGESTIONURL_SUCCESS') {
                  toast.success(
                    <CustomToast
                      message='CTI report submitted successfully.'
                      onClose={() => toast.dismiss()} // Dismiss only this toast
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
                  setAddctireport('add')
                  setUrl('')
                  setIsOpen(false)
                  setUploadepdf(null)
                  sessionStorage.setItem('active', 'sources')
                  navigateTo('/app/sourcespage')
                  sessionStorage.setItem('srcactiveTab', JSON.stringify(1))
                } else {
                  setError('Failed to add CTI report. Please verify the URL and try again.')
                }
              })
              .catch((err: any) => {
                console.log(err)
              })
          }
        } else {
          let object = {
            baseUrl: hostname,
          }
          dispatch(addCtiWhitelist(object) as any).then((response: any) => { })
        }
      }
    }
  }

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleIconClick = () => {
    fileInputRef.current?.click() // Trigger the file input on icon click
  }

  const validateUrl = (value: string) => {
    // Remove leading spaces before validating
    const trimmedValue = value.replace(/^\s+/, '') // Removes spaces at the start of the string
    setUrl(trimmedValue)

    const urlRegex = /^(https:\/\/)([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i

    if (trimmedValue === '' || urlRegex.test(trimmedValue)) {
      if (!isAllowedUrl(trimmedValue)) {
        setError(null)
      } else {
        setError(
          'Unsupported URL. Please print the content as a PDF and submit the PDF for processing.',
        )
      }
    } else {
      setError('Please verify the URL and try again')
    }
  }

  return (
    <>
      {isOpen && (
        <div className='fixed inset-0 z-10 flex items-center justify-center p-4 bg-black bg-opacity-50'>
          <div className='box-border bg-[#1d2939] rounded-xl flex flex-col gap-4 items-end justify-start relative shadow-xl overflow-hidden w-[800px]  h-[428px]'>
            <div className='flex flex-col gap-0 items-center justify-start self-stretch flex-shrink-0 relative'>
              <div className='p-6 pt-6 pb-0 flex flex-col gap-4 items-start justify-start self-stretch flex-shrink-0 relative'>
                <div className='bg-[#32435a] rounded-[28px] flex-shrink-0 w-12 h-12 relative'>
                  <svg
                    className='w-6 h-6 absolute left-3 top-3 overflow-visible'
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <path
                      d='M12 5V19M5 12H19'
                      stroke='white'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                </div>
                <div className='flex flex-col gap-1 items-start justify-start self-stretch flex-shrink-0 relative'>
                  <div className='text-white text-left font-Inter text-lg leading-7 font-semibold self-stretch relative'>
                    Add CTI source for ingestion
                  </div>
                </div>
              </div>
              <div
                onClick={() => {
                  setIsOpen(false), setUploadepdf(null), setUrl(''), setPdfError('')
                }}
                className='cursor-pointer rounded-md p-2 flex flex-row gap-0 items-center justify-center flex-shrink-0 w-11 h-11 absolute right-4 top-4 overflow-hidden'
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
              </div>
            </div>
            <div className='px-6 flex flex-col gap-4 items-start justify-start self-stretch flex-shrink-0 h-[220px] relative'>
              {/* Tab Navigation */}
              <div className='flex flex-row gap-4 items-center justify-start self-stretch flex-shrink-0 relative border-b border-[#3E4B5D]'>
                <div
                  className={`px-2 py-1 cursor-pointer ${activeTab === 'url'
                      ? 'text-white border-b-[3px] border-[#EE7103]'
                      : 'text-gray-400'
                    }`}
                  onClick={() => {
                    setActiveTab('url'),
                      setError(null),
                      setUploadepdf(null),
                      setUrl(''),
                      setPdfError('')
                  }}
                >
                  URL
                </div>

                <div
                  className={`px-2 py-1 cursor-pointer ${activeTab === 'pdf'
                      ? 'text-white border-b-[3px] border-[#EE7103]'
                      : 'text-gray-400'
                    }`}
                  onClick={() => {
                    setActiveTab('pdf'), setError(null), setUploadepdf(null), setUrl('')
                  }}
                >
                  Upload PDF
                </div>
              </div>

              {/* Tab Content */}
              <div className='flex flex-col gap-4 items-start justify-start self-stretch flex-shrink-0 relative'>
                {/* URL Tab Content */}
                {activeTab === 'url' && (
                  <div className='flex flex-col gap-1.5 items-start justify-start self-stretch flex-shrink-0 relative'>
                    <div className='flex flex-col gap-1.5 items-start justify-start self-stretch flex-shrink-0 relative'>
                      <div className='bg-[#48576c] rounded-lg border border-[#6e7580] p-[10px_14px] flex flex-row gap-2 items-center justify-start self-stretch flex-shrink-0 relative shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]'>
                        <div className='flex flex-row gap-2 items-center justify-start flex-1 relative'>
                          <input
                            type='text'
                            className='text-white bg-transparent text-left font-sans text-base leading-6 font-normal flex-1 overflow-hidden truncate border-none focus:outline-none'
                            placeholder='Enter URL'
                            value={urlss}
                            onChange={(e) => validateUrl(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
                  </div>
                )}

                {/* Upload PDF Tab Content */}
                {activeTab === 'pdf' && (
                  <>
                    {!uploadepdf && (
                      <div className='w-full  flex flex-col justify-start items-start gap-4 inline-flex mt-4'>
                        <div className='flex flex-1 w-full px-6 py-4 rounded-lg border border-dotted  border-gray-600 flex-col justify-center items-center gap-1 flex'>
                          <div
                            onDragEnter={handleDragEnter}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className='w-full  flex flex-col justify-start items-center gap-3'
                          >
                            {/* Hidden file input */}
                            <input
                              type='file'
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              className='hidden'
                              accept='.pdf' // Restrict to PDF files
                            />

                            {/* Icon with click handler */}
                            <div
                              onClick={handleIconClick}
                              className='w-10 h-10 p-2 bg-[#1d2939] shadow-lg rounded-lg border border-[#1d2939] flex justify-center items-center cursor-pointer'
                            >
                              <div className='w-5 h-5 relative flex flex-col justify-start items-start'>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  width='20'
                                  height='20'
                                  viewBox='0 0 20 20'
                                  fill='none'
                                >
                                  <path
                                    d='M6.66663 13.3333L9.99996 10M9.99996 10L13.3333 13.3333M9.99996 10V17.5M16.6666 13.9524C17.6845 13.1117 18.3333 11.8399 18.3333 10.4167C18.3333 7.88536 16.2813 5.83333 13.75 5.83333C13.5679 5.83333 13.3975 5.73833 13.3051 5.58145C12.2183 3.73736 10.212 2.5 7.91663 2.5C4.46485 2.5 1.66663 5.29822 1.66663 8.75C1.66663 10.4718 2.36283 12.0309 3.48908 13.1613'
                                    stroke='white'
                                    stroke-width='1.66667'
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                  />
                                </svg>
                              </div>
                            </div>

                            <div className='w-full  flex flex-col justify-start items-center gap-1'>
                              {/* Click to upload text with click handler */}
                              <div
                                onClick={handleIconClick}
                                className='w-full flex justify-center items-start gap-1 cursor-pointer'
                              >
                                <div className='flex justify-center items-center gap-1.5'>
                                  <span className='text-orange-600 text-sm font-semibold leading-5'>
                                    Click to upload
                                  </span>
                                </div>
                                <span className='text-gray-500 text-sm font-normal leading-5'>
                                  or drag and drop
                                </span>
                              </div>
                              <div className='w-full text-center text-gray-500 text-xs font-normal leading-4'>
                                PDF (max. 100Mb)
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {pdferror && <p className='text-red-500 text-sm mt-1'>{pdferror}</p>}
                    {uploadepdf && uploadepdf.type == 'application/pdf' && (
                      <div className='w-full  flex flex-col justify-start items-start gap-4 inline-flex mt-4'>
                        <FileUploadItem
                          fileName={uploadepdf?.name}
                          fileSize={uploadepdf?.size}
                          fileType={uploadepdf.type}
                          setUploadepdf={setUploadepdf}
                          uploadProgress={uploadProgress}
                          isUploading={isUploading}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className='flex flex-col gap-0 items-start justify-start flex-shrink-0 w-[320px] relative'>
              <div className='flex flex-row gap-3 items-start justify-start self-stretch flex-shrink-0 relative px-6 pt-0 pb-6'>
                <button
                  onClick={() => {
                    setIsOpen(false), setUploadepdf(null), setUrl(''), setPdfError('')
                  }}
                  className='flex flex-row gap-1.5 items-center justify-center flex-1 relative bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-xs overflow-hidden'
                >
                  <div className='flex flex-row gap-0 items-center justify-center flex-shrink-0 relative px-0.5 py-0'>
                    <div className='text-gray-700 text-left font-semibold text-base leading-6 font-sans relative'>
                      Cancel
                    </div>
                  </div>
                </button>
                {activeTab === 'url' ? (
                  <button
                    onClick={handleAdd}
                    disabled={!urlss || error ? true : false}
                    className={`${!urlss || error
                        ? 'cursor-not-allowed opacity-50 hover'
                        : 'cursor-pointer hover:bg-[#EE7103]'
                      } bg-[#EE7103] rounded-lg border border-[#ee7103]  px-4 py-2 flex flex-row gap-1.5 items-center justify-center flex-1 relative shadow-xs overflow-hidden`}
                  >
                    <div className='flex flex-row gap-0 items-center justify-center flex-shrink-0 relative px-0.5 py-0'>
                      <div className='text-white text-left font-semibold text-base leading-6 font-sans relative'>
                        Add
                      </div>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={handleFileUpload}
                    disabled={
                      !uploadepdf || pdferror || (uploadProgress != 100 && isUploading)
                        ? true
                        : false
                    }
                    className={`${!uploadepdf || pdferror || (uploadProgress != 100 && isUploading)
                        ? 'cursor-not-allowed opacity-50 hover'
                        : 'cursor-pointer hover:bg-[#EE7103]'
                      } bg-[#EE7103] rounded-lg border border-[#ee7103]  px-4 py-2 flex flex-row gap-1.5 items-center justify-center flex-1 relative shadow-xs overflow-hidden`}
                  >
                    <div className='flex flex-row gap-0 items-center justify-center flex-shrink-0 relative px-0.5 py-0'>
                      <div className='text-white text-left font-semibold text-base leading-6 font-sans relative'>
                        Add
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AddCTISourceDialog
