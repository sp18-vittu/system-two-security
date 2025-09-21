import React, { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { indUserDetail, indUserUpdate } from '../../redux/nodes/users/action'
import local from '../../utils/local'
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { useData } from '../../layouts/shared/DataProvider'

const SettingPage: React.FC = () => {
  const {
    handleSubmit,
    control,
    register,
    setValue,
    formState: { errors },
  } = useForm()
  const dispatch = useDispatch()

  const { SaveValue, setSaveValue }: any = useData()

  const localStorage = local.getItem('auth')
  const locals = JSON.parse(localStorage as any)
  const userId = locals?.user?.user?.id

  const localToken = local.getItem('bearerToken')
  const token = JSON.parse(localToken as any)

  const induserDetails = useSelector((state: any) => state.indUserdetailreducer)
  const { induserDetail } = induserDetails

  const updateSetting = useSelector((state: any) => state.userSettingUpdatereducer)
  const { success: updateSettingsuccess } = updateSetting

  const [showModalRemove, setShowModalRemove] = useState(false)
  const inputRef1 = useRef<any>(null)
  const [img, setimg] = useState('/avatar.webp')
  const [base64img, setbase64img] = useState('')

  useEffect(() => {
    if (updateSettingsuccess != undefined) dispatch(indUserDetail(userId, token) as any)
  }, [updateSettingsuccess == true])

  useEffect(() => {
    setValue('first_name', induserDetail?.firstName)
    setValue('last_name', induserDetail?.lastName)
    setValue('phoneNumber', induserDetail?.phone)
    setValue('email', induserDetail?.email)
  }, [induserDetail])

  const onSubmit = (e: any) => {
    if (!SaveValue) {
      if (e?.phoneNumber) {
        if (isValidPhoneNumber(e?.phoneNumber)) {
          setSaveValue(true)
          document.getElementById('input_focus')?.classList.add('border-neutral-950')
          let base64: any = base64img.split(',')
          let photobyte: any = base64[1]
          const IndUser = {
            firstName: e?.first_name,
            lastName: e?.last_name,
            phone: e?.phoneNumber,
            email: e?.email ? e?.email : induserDetail?.email,
            photo: photobyte ? photobyte : null,
          }

          dispatch(indUserUpdate(userId, IndUser) as any)
          document.getElementById('input_focus')?.classList.remove('border-neutral-950')
          Swal.fire({
            position: 'center',
            icon: 'success',
            color: '#000',
            title: 'Updated Successfully',
            width: 400,
            timer: 1000,
            showConfirmButton: false,
          })
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            color: '#000',
            title: `Please enter a valid phone number.`,
            width: 400,
            timer: 1000,
            showConfirmButton: false,
          })
        }
      } else {
        setSaveValue(true)
        document.getElementById('input_focus')?.classList.add('border-neutral-950')
        let base64: any = base64img.split(',')
        let photobyte: any = base64[1]
        const IndUser = {
          firstName: e?.first_name,
          lastName: e?.last_name,
          phone: e?.phoneNumber ? e?.phoneNumber : '',
          email: e?.email ? e?.email : induserDetail?.email,
          photo: photobyte ? photobyte : null,
        }

        dispatch(indUserUpdate(userId, IndUser) as any)
        document.getElementById('input_focus')?.classList.remove('border-neutral-950')
        Swal.fire({
          position: 'center',
          icon: 'success',
          color: '#000',
          title: 'Updated Successfully',
          width: 400,
          timer: 1000,
          showConfirmButton: false,
        })
      }
    }
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
    setSaveValue(false)
    if (e.dataTransfer.files[0] == undefined) {
      setimg(img)
    } else {
      if (e.dataTransfer.files[0].type.includes('image')) {
        e.preventDefault()
        e.stopPropagation()
        var binaryData: any = []
        binaryData.push(e.dataTransfer.files[0])
        getBase64(e.target.files[0])
        setimg(window.URL.createObjectURL(new Blob(binaryData, { type: 'image/png, image/jpeg' })))
      } else {
        e.preventDefault()
        setimg('/avatar.webp')
      }
    }
  }

  const onLoad = (fileString: any) => {
    setbase64img(fileString)
  }

  const getBase64 = (file: any) => {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      onLoad(reader.result)
    }
  }

  function handleChange(e: any) {
    setSaveValue(false)
    e.preventDefault()
    if (e.target.files[0]?.name == undefined) {
      setimg(img)
    } else {
      if (e.target.files[0].type.includes('image')) {
        var binaryData: any = []
        binaryData.push(e.target.files[0])
        getBase64(e.target.files[0])
        setimg(window.URL.createObjectURL(new Blob(binaryData, { type: 'image/png, image/jpeg' })))
      } else {
        e.preventDefault()
        setimg('/avatar.webp')
      }
    }
  }
  const [validate, setValidate] = useState(false)
  const handleChangePhone = (e: any) => {
    setSaveValue(false)
    if (e && isValidPhoneNumber(e)) {
      setSaveValue(false)
      setValidate(false)
    }
  }

  const handleChangeLast = (e: any) => {
    setSaveValue(false)
  }

  const handleChangeFirst = (e: any) => {
    setSaveValue(false)
  }
  function handleDragLeave(e: any) {
    e.preventDefault()
    e.stopPropagation()
  }

  const onDelete = async () => {
    try {
      induserDetail.photo = null
      setimg('/avatar.webp')
      setSaveValue(false)
      const response = await fetch('/avatar.webp')
      const blob = await response.blob()
      const reader = new FileReader()
      reader.onloadend = () => {
        setbase64img(reader.result as string)
      }
      reader.readAsDataURL(blob)
    } catch (error) {
      console.error('Error fetching the image:', error)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
        <div className=''>
          <div className='flex justify-between mt-1'>
            <div className='end mr-6'></div>
          </div>

          <div className='grid grid-cols-2 gap-2   p-4 mt-2 max-md:grid-cols-1'>
            <div>
              <div className='flex gap-10'>
                <p className='border-b-2 border-teal-900 inline-block text-white'>
                  Personal Information
                </p>
              </div>
              <div className='mt-6'>
                <p className='text-white '>Update or review your personal preferences</p>
              </div>

              <div className='flex mt-6 gap-1 max-sm:flex-wrap'>
                <div className='w-1/2 max-sm:w-full'>
                  <label className='block mb-2 text-sm font-medium text-white'>
                    First Name <span style={{ color: 'red', fontSize: 14, marginLeft: 4 }}>*</span>
                  </label>
                  <input
                    type='text'
                    id='first_name'
                    {...register('first_name', {
                      required: 'first Name is required',
                      minLength: { value: 2, message: 'first Name must be at least 2 characters' },
                      onChange: (e) => {
                        handleChangeFirst(e)
                      },
                    })}
                    className='bg-gray-50 border w-full  border-2 border-white-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  />
                </div>
                <div className='w-1/2 max-sm:w-full'>
                  <label className='block mb-2 text-sm font-medium text-white '>
                    Last Name<span style={{ color: 'red', fontSize: 14, marginLeft: 4 }}>*</span>
                  </label>
                  <input
                    type='text'
                    id='last_name'
                    {...register('last_name', {
                      required: 'Last name is required',
                      minLength: { value: 2, message: 'Last name must be at least 2 characters' },
                      onChange: (e) => {
                        handleChangeLast(e)
                      },
                    })}
                    className='bg-gray-50 border w-full  border-2 border-white-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  />
                </div>
              </div>
              <div className='mt-3'>
                <label className='block mb-2 text-sm font-medium text-white'>Email</label>
                <input
                  type='text'
                  id='email'
                  {...register('email', {
                    required: 'email is required',
                    minLength: { value: 2, message: 'Last name must be at least 2 characters' },
                  })}
                  className='bg-gray-50 w-full border-2 border-white-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 cursor-not-allowed max-md:w-full'
                  readOnly
                />
              </div>
              <div className='mt-3'>
                <label className=' mb-2 text-sm font-medium text-white'>Phone Number</label>
                <Controller
                  name='phoneNumber'
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      countrySelectProps={{
                        style: {
                          width: '200px',
                        },
                      }}
                      defaultCountry='US'
                      international
                      className={`bg-gray-50 w-full border-2 border-white-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 custom-spacing max-md:w-full max-sm:flex-wrap`}
                      onChange={(value) => {
                        field.onChange(value)
                        handleChangePhone(value)
                      }}
                    />
                  )}
                />
              </div>

              <div className='flex mt-5'>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <img
                    className='w-14 h-14 mt-2 rounded-full'
                    src={
                      img !== '/avatar.webp'
                        ? img
                        : induserDetail?.photo
                        ? `data:image/jpeg;base64,${induserDetail?.photo}`
                        : img
                    }
                    alt='Rounded Avatar'
                  />
                  {(img !== '/avatar.webp' || induserDetail?.photo) && (
                    <button
                      type='button'
                      onClick={onDelete}
                      className='top-0 right-0 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 h-6 w-6 text-center'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        className='w-4 h-4 '
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M19 7l-1 14H6L5 7M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h8'
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <div className='relative px-7 py-2 flex-auto pr-0'>
                  <div className='flex items-center justify-center w-full'>
                    <div className='w-full'>
                      <form
                        onDragEnter={handleDragEnter}
                        onSubmit={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                      >
                        <label
                          id='input_focus'
                          className='flex flex-col items-center justify-center w-full h-36 border-2 border-white-300 border-solid rounded-lg cursor-pointer bg-white '
                        >
                          <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                            <input
                              placeholder='fileInput'
                              className='hidden'
                              ref={inputRef1}
                              type='file'
                              onChange={handleChange}
                              accept='.png, .jpeg'
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

                            <p className='mb-2 text-sm text-gray-500 max-sm:text-center'>
                              <span className='font-semibold'> upload image coming soon</span>
                            </p>
                          </div>
                        </label>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className='w-10/12 mt-3'>
                <button
                  id='settingSubmit'
                  className={`float-right hidden  ${
                    SaveValue
                      ? 'cursor-not-allowed opacity-50 hover'
                      : 'cursor-pointer hover:bg-[#6941c6]'
                  }
                      text-white mr-3 capitalize rounded-lg px-[14px] py-[6px] bg-[#EE7103] text-center flex`}
                  type='submit'
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        {showModalRemove ? (
          <>
            <div className='justify-center backdrop-blur-sm items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none p-35'>
              <div className='relative w-auto my-6 mx-auto w-3xl'>
                <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                  <div className='items-start justify-between p-5 border-solid border-slate-200 rounded-t'>
                    <h6 className='text-1xl font-semibold justify-center items-center text-center text-[#000]'>
                      Delete My Account
                    </h6>
                    <p className='justify-center items-center text-center text-sm text-[#000]'>
                      Are you sure you want to delete your account?
                    </p>
                    <p className='justify-center items-center text-center text-sm text-[#000]'>
                      This process is permanent.
                    </p>
                  </div>
                  <div className='p-2 border-solid border-slate-200 rounded-b'>
                    <button
                      type='button'
                      className=' mx-6 w-28 bg-white-900 border rounded-lg text-black justify-center font-bold px-3 py-2 text-xs font-medium inline-flex '
                      onClick={(e) => setShowModalRemove(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className='mx-6 w-28 bg-red-600 text-white justify-center font-bold rounded-lg px-3 py-2 text-xs font-medium inline-flex '
                      type='button'
                      onClick={(e) => setShowModalRemove(false)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='opacity-25 fixed inset-0 z-40 bg-black '></div>
          </>
        ) : null}
      </form>
    </>
  )
}

export default SettingPage
