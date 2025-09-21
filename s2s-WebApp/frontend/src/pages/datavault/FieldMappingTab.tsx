import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  AutomaticPost,
  GieldmappingStatus,
  ManualUpload,
  PreviousFieldmappingStatus,
} from '../../redux/nodes/Fieldmapping/action'
import { useForm } from 'react-hook-form'
import ClearIcon from '@mui/icons-material/Clear'
import styled from '@emotion/styled'
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from '@mui/material'

const FieldMappingTab = ({ integrations }: any) => {
  const dispatch = useDispatch()
  // *********************************************************************
  const [uploadPopUp, setUploadPopUp] = useState(false)
  let { reset: reset1, handleSubmit: handleSubmit1 } = useForm()
  const [files, setFiles] = useState<any>([])
  const [fileList, setFileList] = useState(null)
  const file: any = []
  const [automaticStatus, setAutomaticStatus] = useState(null as any)
  const [errorDescription, seterrorDescription] = useState(null as any)
  const [img, setImg] = useState([] as any)
  const inputRef = useRef<any>(null)

  const closeModal = () => {
    setUploadPopUp(false)
    reset1()
    setFiles([])
  }
  function removeFile(fileName: any, idx: any) {
    const newArr = [...files]
    newArr.splice(idx, 1)
    setFiles([])
    setFiles(newArr)
  }
  function handleDragLeave(e: any) {
    e.preventDefault()
    e.stopPropagation()
  }
  function handleDragOver(e: any) {
    e.preventDefault()
    e.stopPropagation()
  }
  function handleDragEnter(e: any) {
    e.preventDefault()
    e.stopPropagation()
  }
  function handleDrop(e: any) {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      for (let i = 0; i < e.dataTransfer.files['length']; i++) {
        let arr: any = []
        img.map((image: any) => {
          if (e.dataTransfer.files[i].type.includes(image.name)) {
            arr.push({
              fileName: e.dataTransfer.files[i],
              type: e.dataTransfer.files[i].type,
              path: image.path,
            })
          } else if (e.dataTransfer.files[i].name.split('.').includes(image.name)) {
            arr.push({
              fileName: e.dataTransfer.files[i],
              type: e.dataTransfer.files[i].type,
              path: image.path,
            })
          }
        })
        setFiles((prevState: any) => [...prevState, ...arr])
      }
    }
  }
  function handleChange(e: any) {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      setFileList(e.target.files)
      for (let i = 0; i < e.target.files['length']; i++) {
        let arr: any = []
        img.map((image: any) => {
          if (e.target.files[i].type.includes(image.name)) {
            arr.push({
              fileName: e.target.files[i],
              type: e.target.files[i].type,
              path: image.path,
            })
          } else if (e.target.files[i].name.split('.').includes(image.name)) {
            arr.push({
              fileName: e.target.files[i],
              type: e.target.files[i].type,
              path: image.path,
            })
          }
        })
        setFiles((prevState: any) => [...prevState, ...arr])
      }
    }
  }

  const [showStatus, setshowStatus] = useState(false)
  const [showStatus2, setshowStatus2] = useState(false)

  const [poststatus, setPoststatus] = useState(null as any)

  const [initialStatus, setinitialStatus] = useState(null as any)

  const [initialerrordesc, setinitialerrordesc] = useState(null as any)

  useEffect(() => {
    let data = integrations[0]?.splunk?.sourceName.toLowerCase()

    dispatch(PreviousFieldmappingStatus(data) as any).then((responce: any) => {
      if (
        responce?.payload?.status == 'in_progress' ||
        responce?.payload?.status == 'pending' ||
        responce?.payload?.status == 'completed'
      ) {
        setinitialStatus(responce?.payload?.status)
      } else if (responce?.payload?.status?.includes('failed:')) {
        const status = responce?.payload?.status?.split(':')[0]
        const description = responce?.payload?.status?.split(':')[1]
        setinitialStatus(status)
        setinitialerrordesc(description)
      }
      if (responce.type == 'PREVIOUS_FIELDMAPPING_STATUS_GET_FAILED') {
        setfailedStatus(true)
      }
    })
  }, [])

  const [failedStatus, setfailedStatus] = useState(false)

  const handleautomaticandupload = (data: any) => {
    seterrorDescription(null)
    if (data == 'Automatic') {
      setinitialStatus(null)
      setshowStatus(true)
      const sourcedata = {
        source: integrations[0]?.splunk?.sourceName
          ? integrations[0]?.splunk?.sourceName.toLowerCase()
          : integrations[0]?.feed?.sourceName.toLowerCase(),
        source_id: integrations[0]?.splunk?.id
          ? integrations[0]?.splunk?.id
          : integrations[0]?.feed?.id, //id from table
      }
      dispatch(AutomaticPost(sourcedata) as any).then((res: any) => {
        if (res.type == 'AUTOMATIC_POST_SUCCESS') {
          setPoststatus(res?.payload)
          fetchdataStatus(res?.payload)
          setAutomaticStatus(res?.payload?.status)
        }

        if (res.type == 'AUTOMATIC_POST_FAILED') {
          setfailedStatus(true)
        }
      })
    } else {
      setshowStatus2(true)
      setUploadPopUp(true)
      setinitialStatus(null)
    }
  }

  let uploadstatus: any = []
  const Uploadfiles = fileList ? [...fileList] : []
  Uploadfiles.forEach((file: any) => {
    uploadstatus.push(file)
  })

  const handleManualUpload = () => {
    if (files.length > 0) {
      const formData = new FormData()
      formData.append('customer_schema', Uploadfiles[0])
      const sourcedata = {
        source: integrations[0]?.splunk?.sourceName
          ? integrations[0]?.splunk?.sourceName.toLowerCase()
          : integrations[0]?.feed?.sourceName.toLowerCase(),
        source_id: integrations[0]?.splunk?.id
          ? integrations[0]?.splunk?.id
          : integrations[0]?.feed?.id, //id from table
      }
      dispatch(ManualUpload(formData, sourcedata) as any)
        .then((res: any) => {
          if (res.type == 'MANUAL_UPLOAD_POST_SUCCESS') {
            setUploadPopUp(false)
            setPoststatus(res?.payload)
            setAutomaticStatus(res?.payload?.status)
            fetchdataStatus(res?.payload)
          }
          if (res.type == 'MANUAL_UPLOAD_POST_FAILED') {
            setfailedStatus(true)
          }
        })
        .catch((error: any) => {
          console.log('error', error)
        })
    }
  }

  let count = 0
  const intervalRef = useRef<number | null>(null)
  useEffect(() => {
    if (failedStatus) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }
    if (poststatus) {
      if (automaticStatus !== 'completed' || automaticStatus !== 'failed') {
        count++
        intervalRef.current = window.setInterval(() => {
          fetchdataStatus(poststatus)
        }, 20000)
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    }
  }, [automaticStatus, failedStatus])

  const fetchdataStatus = (data: any) => {
    dispatch(GieldmappingStatus(data?.source, data?.job_id) as any).then((responce: any) => {
      if (responce?.payload) {
        if (
          responce?.payload?.status == 'in_progress' ||
          responce?.payload?.status == 'pending' ||
          responce?.payload?.status == 'completed'
        ) {
          setAutomaticStatus(responce?.payload?.status)
        } else if (responce?.payload?.status?.includes('failed:')) {
          const status = responce?.payload?.status?.split(':')[0]
          const description = responce?.payload?.status?.split(':')[1]
          setAutomaticStatus(status)
          seterrorDescription(description)
        }
      }
    })
  }

  const getData = () => {
    setImg([
      {
        name: 'csv',
        path: "<svg><path d='M7.75 4C7.75 2.20508 9.20508 0.75 11 0.75H27C27.1212 0.75 27.2375 0.798159 27.3232 0.883885L38.1161 11.6768C38.2018 11.7625 38.25 11.8788 38.25 12V36C38.25 37.7949 36.7949 39.25 35 39.25H11C9.20507 39.25 7.75 37.7949 7.75 36V4Z' fill='white' stroke='#D0D5DD' strokeWidth='1.5'/><path d='M27 0.5V8C27 10.2091 28.7909 12 31 12H38.5' stroke='#D0D5DD' strokeWidth='1.5'/><rect x='1' y='18' width='27' height='16' rx='2' fill='#344054'/><path d='M4.60121 23.995V22.7273H10.5742V23.995H8.34766V30H6.82777V23.995H4.60121ZM12.9996 22.7273L14.4663 25.206H14.5231L15.9968 22.7273H17.7333L15.5138 26.3636L17.783 30H16.0146L14.5231 27.5178H14.4663L12.9748 30H11.2134L13.4897 26.3636L11.256 22.7273H12.9996ZM18.4293 23.995V22.7273H24.4023V23.995H22.1758V30H20.6559V23.995H18.4293Z' fill='white'/></svg>",
      },
    ])
  }
  useEffect(() => {
    getData()
    if (file.length > 0) {
      document.getElementById('input_focus')?.classList.remove('border-slate-950')
    }
  }, [files])

  const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    display: !initialerrordesc ? 'none' : 'inline-block',
    [`& .${tooltipClasses.arrow}`]: {
      color: '#fff',
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#fff',
      color: '#000',
    },
  }))

  const BootstrapTooltip1 = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    display: !errorDescription ? 'none' : 'inline-block',
    [`& .${tooltipClasses.arrow}`]: {
      color: '#fff',
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#fff',
      color: '#000',
    },
  }))

  const [showDiv, setShowDiv] = useState('automatic')
  const handleRadioChange = (option: any) => {
    setShowDiv(option)
  }
  const labelStyle = {
    color: showStatus ? 'white' : 'white',
  }
  return (
    <div className='pt-[24px] h-[77vh]'>
      <FormControl component='fieldset'>
        <RadioGroup value={showDiv} onChange={(e) => handleRadioChange(e.target.value)} row>
          <FormControlLabel
            value='automatic'
            control={
              <Radio
                sx={{
                  'span.css-hyxlzm': {
                    color: '#ffffff !important',
                  },
                }}
              />
            }
            label={<span style={labelStyle}>Automatic</span>}
            disabled={automaticStatus == 'in_progress' || automaticStatus == 'pending'}
          />
          <FormControlLabel
            value='uploadCSV'
            control={
              <Radio
                sx={{
                  'span.css-hyxlzm': {
                    color: '#ffffff !important',
                  },
                }}
                disabled={automaticStatus == 'in_progress' || automaticStatus == 'pending'}
              />
            }
            label={<span style={labelStyle}>Manual</span>}
          />
        </RadioGroup>
      </FormControl>
      <div>
        {showDiv === 'automatic' && (
          <div
            className='flex mb-3 gap-6'
            style={{
              padding: '16px 16px 16px 24px',
              borderRadius: '12px',
              background: '#1D2939',
              fontSize: '14px',
              fontWeight: '500px',
              alignItems: 'center',
            }}
          >
            <div className='flex items-center w-full'>
              <span>
                {'Automatically query to retrieve event fields for mapping to S2S fields'}
              </span>
            </div>
            <div>
              {initialStatus && (
                <BootstrapTooltip
                  title={
                    <div>
                      <h2>{initialerrordesc}</h2>
                    </div>
                  }
                  arrow
                  placement='top'
                >
                  <span
                    style={{
                      fontSize: '14px',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      border:
                        initialStatus == 'in_progress' || initialStatus == 'pending'
                          ? '1.5px solid var(--Warning-600, #FFFF00)'
                          : initialStatus == 'completed'
                          ? '1.5px solid var(--Success-600, #079455)'
                          : initialStatus == 'failed'
                          ? '1.5px solid var(--Error-600, #FA1B1B)'
                          : '',
                      color:
                        initialStatus == 'in_progress' || initialStatus == 'pending'
                          ? 'var(--Warning-600, #FFFF00)'
                          : initialStatus == 'completed'
                          ? 'var(--Success-600, #079455)'
                          : initialStatus == 'failed'
                          ? 'var(--Error-600, #FA1B1B)'
                          : '',
                    }}
                  >
                    {initialStatus
                      ? initialStatus == 'in_progress'
                        ? 'Processing...'
                        : initialStatus == 'pending'
                        ? 'Pending...'
                        : initialStatus == 'completed'
                        ? 'Completed'
                        : initialStatus == 'failed'
                        ? 'Failed'
                        : 'Pending...'
                      : ''}
                  </span>
                </BootstrapTooltip>
              )}
              {showStatus && (
                <BootstrapTooltip1
                  title={
                    <div>
                      <h2>{errorDescription}</h2>
                    </div>
                  }
                  arrow
                  placement='top'
                >
                  <span
                    style={{
                      fontSize: '14px',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      border:
                        automaticStatus == 'in_progress' || automaticStatus == 'pending'
                          ? '1.5px solid var(--Warning-600, #FFFF00)'
                          : automaticStatus == 'completed'
                          ? '1.5px solid var(--Success-600, #079455)'
                          : automaticStatus == 'failed'
                          ? '1.5px solid var(--Error-600, #FA1B1B)'
                          : '',
                      color:
                        automaticStatus == 'in_progress' || automaticStatus == 'pending'
                          ? 'var(--Warning-600, #FFFF00)'
                          : automaticStatus == 'completed'
                          ? 'var(--Success-600, #079455)'
                          : automaticStatus == 'failed'
                          ? 'var(--Error-600, #FA1B1B)'
                          : '',
                    }}
                  >
                    {automaticStatus
                      ? automaticStatus == 'in_progress'
                        ? 'Processing...'
                        : automaticStatus == 'pending'
                        ? 'Pending...'
                        : automaticStatus == 'completed'
                        ? 'Completed'
                        : automaticStatus == 'failed'
                        ? 'Failed'
                        : 'Pending...'
                      : ''}
                  </span>
                </BootstrapTooltip1>
              )}
            </div>
            <button
              disabled={
                automaticStatus == 'in_progress' || automaticStatus == 'pending' ? true : false
              }
              onClick={() => handleautomaticandupload('Automatic')}
              style={{
                opacity:
                  automaticStatus === 'in_progress' || automaticStatus === 'pending' ? 0.5 : 1,
                cursor:
                  automaticStatus === 'in_progress' || automaticStatus === 'pending'
                    ? 'not-allowed'
                    : 'pointer',
              }}
            >
              <span
                style={{
                  padding: '8px 12px',
                  width: '100px',
                  display: 'flex',
                  borderRadius: '8px',
                  background: 'rgb(238, 113, 3)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                {'Automatic'}
              </span>
            </button>
          </div>
        )}
      </div>
      <div>
        {showDiv === 'uploadCSV' && (
          <div
            className='flex mb-3 gap-6'
            style={{
              padding: '16px 16px 16px 24px',
              borderRadius: '12px',
              background: '#1D2939',
              fontSize: '14px',
              fontWeight: '500px',
              alignItems: 'center',
            }}
          >
            <div className='flex items-center w-full'>
              <span>{'Upload CSV list of events for mapping to S2S fields'}</span>
            </div>
            <div>
              {initialStatus && (
                <BootstrapTooltip
                  title={
                    <div>
                      <h2>{initialerrordesc}</h2>
                    </div>
                  }
                  arrow
                  placement='top'
                >
                  <span
                    style={{
                      fontSize: '14px',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      border:
                        initialStatus == 'in_progress' || initialStatus == 'pending'
                          ? '1.5px solid var(--Warning-600, #FFFF00)'
                          : initialStatus == 'completed'
                          ? '1.5px solid var(--Success-600, #079455)'
                          : initialStatus == 'failed'
                          ? '1.5px solid var(--Error-600, #FA1B1B)'
                          : '',
                      color:
                        initialStatus == 'in_progress' || initialStatus == 'pending'
                          ? 'var(--Warning-600, #FFFF00)'
                          : initialStatus == 'completed'
                          ? 'var(--Success-600, #079455)'
                          : initialStatus == 'failed'
                          ? 'var(--Error-600, #FA1B1B)'
                          : '',
                    }}
                  >
                    {initialStatus
                      ? initialStatus == 'in_progress'
                        ? 'Processing...'
                        : initialStatus == 'pending'
                        ? 'Pending'
                        : initialStatus == 'completed'
                        ? 'Completed'
                        : 'Failed'
                      : ''}
                  </span>
                </BootstrapTooltip>
              )}
              {showStatus2 && (
                <BootstrapTooltip1
                  title={
                    <div>
                      <h2>{errorDescription}</h2>
                    </div>
                  }
                  arrow
                  placement='top'
                >
                  <span
                    style={{
                      fontSize: '14px',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      border:
                        automaticStatus == 'in_progress' || automaticStatus == 'pending'
                          ? '1.5px solid var(--Warning-600, #FFFF00)'
                          : automaticStatus == 'completed'
                          ? '1.5px solid var(--Success-600, #079455)'
                          : automaticStatus == 'failed'
                          ? '1.5px solid var(--Error-600, #FA1B1B)'
                          : '',
                      color:
                        automaticStatus == 'in_progress' || automaticStatus == 'pending'
                          ? 'var(--Warning-600, #FFFF00)'
                          : automaticStatus == 'completed'
                          ? 'var(--Success-600, #079455)'
                          : automaticStatus == 'failed'
                          ? 'var(--Error-600, #FA1B1B)'
                          : '',
                    }}
                  >
                    {automaticStatus
                      ? automaticStatus == 'in_progress'
                        ? 'Processing...'
                        : automaticStatus == 'pending'
                        ? 'Pending'
                        : automaticStatus == 'completed'
                        ? 'Completed'
                        : 'Failed'
                      : ''}
                  </span>
                </BootstrapTooltip1>
              )}
            </div>
            <button onClick={() => handleautomaticandupload('Upload')}>
              <span
                style={{
                  padding: '8px 12px',
                  width: '100px',
                  display: 'flex',
                  borderRadius: '8px',
                  background: 'rgb(238, 113, 3)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                {'Upload'}
              </span>
            </button>
          </div>
        )}
      </div>

      {uploadPopUp && (
        <>
          <form onSubmit={handleSubmit1(handleManualUpload)}>
            <div className='justify-center backdrop-blur-sm items-center flex  overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
              <div className='relative w-6/12 my-6  mx-auto max-w-xl'>
                <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                  <div
                    className=' p-3 border-solid border-slate-200 rounded-t'
                    style={{ textAlign: 'center' }}
                  >
                    <h6 className='text-lg text-gray-900 font-semibold'>Upload CSV Files</h6>
                  </div>
                  <div className='relative flex-auto p-6'>
                    <div className='items-center justify-center w-full'>
                      <form
                        onDragEnter={handleDragEnter}
                        onSubmit={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                      >
                        <label
                          id='input_focus'
                          className='flex flex-col items-center justify-center w-full h-36 border-2 border-white-300 border-solid rounded-lg cursor-pointer bg-white-50 hover:bg-white-100'
                        >
                          <input
                            placeholder='fileInput'
                            className='hidden'
                            ref={inputRef}
                            type='file'
                            multiple={true}
                            onChange={handleChange}
                            accept='.csv'
                          />
                          <svg
                            width='44'
                            height='44'
                            viewBox='0 0 44 44'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <g filter='url(#filter0_d_2281_5043)'>
                              <rect x='2' y='1' width='40' height='40' rx='8' fill='white' />
                              <path
                                d='M18.6666 24.3333L22 21M22 21L25.3333 24.3333M22 21V28.5M28.6666 24.9524C29.6845 24.1117 30.3333 22.8399 30.3333 21.4167C30.3333 18.8854 28.2813 16.8333 25.75 16.8333C25.5679 16.8333 25.3975 16.7383 25.3051 16.5814C24.2183 14.7374 22.212 13.5 19.9166 13.5C16.4648 13.5 13.6666 16.2982 13.6666 19.75C13.6666 21.4718 14.3628 23.0309 15.4891 24.1613'
                                stroke='#475467'
                                strokeWidth='1.66667'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                              <rect
                                x='2.5'
                                y='1.5'
                                width='39'
                                height='39'
                                rx='7.5'
                                stroke='#EAECF0'
                              />
                            </g>
                            <defs>
                              <filter
                                id='filter0_d_2281_5043'
                                x='0'
                                y='0'
                                width='44'
                                height='44'
                                filterUnits='userSpaceOnUse'
                                colorInterpolationFilters='sRGB'
                              >
                                <feFlood floodOpacity='0' result='BackgroundImageFix' />
                                <feColorMatrix
                                  in='SourceAlpha'
                                  type='matrix'
                                  values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                                  result='hardAlpha'
                                />
                                <feOffset dy='1' />
                                <feGaussianBlur stdDeviation='1' />
                                <feColorMatrix
                                  type='matrix'
                                  values='0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.05 0'
                                />
                                <feBlend
                                  mode='normal'
                                  in2='BackgroundImageFix'
                                  result='effect1_dropShadow_2281_5043'
                                />
                                <feBlend
                                  mode='normal'
                                  in='SourceGraphic'
                                  in2='effect1_dropShadow_2281_5043'
                                  result='shape'
                                />
                              </filter>
                            </defs>
                          </svg>
                          <p className='mb-2 text-sm text-gray-500'>
                            <span className='font-semibold text-[#000]'>Click to upload</span> or
                            drag and drop
                          </p>
                          <p className='text-xs text-gray-500'>You can only upload CSV files</p>
                        </label>
                        <div className='flex flex-wrap w-full max-h-64 p-5 overflow-y-auto overflow-x-hidden'>
                          {files.map((file: any, idx: any) => (
                            <div key={idx} className=''>
                              <div className='relative'>
                                <div className='relative py-3 sm:max-w-xl sm:mx-auto'>
                                  <div className='group cursor-pointer relative inline-block  w-28 text-center'>
                                    <ClearIcon onClick={(e: any) => removeFile(file.name, idx)} />
                                    <svg
                                      xmlns='http://www.w3.org/2000/svg'
                                      fill='none'
                                      viewBox='0 0 50 50'
                                      strokeWidth='1.5'
                                      stroke='currentColor'
                                      className='w-12 h-12 mt-3 ml-10'
                                      dangerouslySetInnerHTML={{ __html: file.path }}
                                    ></svg>
                                    <div
                                      className='opacity-0 w-full bg-black text-white text-center text-xs rounded-lg p-2 absolute z-100 group-hover:opacity-100 -left-[25%] -top-[30%] -mt-1.5 ml-10 px-3 pointer-events-none'
                                      data-tooltip-placement='left'
                                    >
                                      {file.fileName.name}
                                      <svg
                                        className='absolute text-black w-full  h-2.5 right-2.5 top-full'
                                        x='0px'
                                        y='0px'
                                        viewBox='0 0 255 255'
                                      >
                                        <polygon
                                          className='fill-current'
                                          points='0,0 127.5,127.5 255,0'
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </form>
                    </div>
                  </div>
                  <br />
                  <div className='flex items-center p-1 border-solid border-slate-200 rounded-b grid grid-cols-2 gap-6 mb-2'>
                    <button
                      type='button'
                      className='w-64 h-10 rounded-lg  ml-6 class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 mb-1 rounded shadow'
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      className='w-64 h-10 text-white bg-[#EE7103] active: font-bold text-sm px-6 py-3 rounded-lg mb-1 shadow hover:shadow-lg outline-none'
                      type='submit'
                    >
                      Add Data Source
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  )
}

export default FieldMappingTab
