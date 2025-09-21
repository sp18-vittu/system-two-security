import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { postChangePassword } from '../../redux/nodes/changePassword/action'
import { domain } from '../../environment/environment'
import STwoSLogo from '../logo/STwoSLogo'

const ChangPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch()
  const navigateTo = useNavigate()

  const [error, setError] = useState(false)

  const [isNewPasswordVisible, setisNewPasswordVisible] = useState(false)
  const [isConformPasswordVisible, setisConformPasswordVisible] = useState(false)

  const toggleNewPasswordVisibility = () => {
    setisNewPasswordVisible((prevState) => !prevState)
  }

  const toggleconformPasswordVisibility = () => {
    setisConformPasswordVisible((prevState) => !prevState)
  }

  const onSubmit = (data: any) => {
    const firstLoginSession = sessionStorage.getItem('firstLoginSession')
    const email = sessionStorage.getItem('userEmail')
    data.firstLoginSession = firstLoginSession
    const passwordDetails = {
      email: email,
      requestDomain: domain,
      newPassword: data.newPassword,
      newPasswordRepeat: data.newPasswordRepeat,
      firstLoginSession: data.firstLoginSession,
    }
    if (data.newPassword === data.newPasswordRepeat) {
      // Passwords match, you can proceed with form submission
      dispatch(postChangePassword(passwordDetails) as any).then((res: any) => {
        if (res.payload == 'LOGIN_SUCCESSFUL') {
          sessionStorage.setItem('firstLoginSession', res.payload.firstLoginSession)
          navigateTo(`/tokencall`, { state: { bearerToken: res.payload.bearerToken } })
          sessionStorage.removeItem('userEmail')
        } else if (
          res.type == 'POST_CHANGEPASSWORD_FORM_SUCCESS' &&
          res.payload.responseMessage == 'LOGIN_SUCCESSFUL'
        ) {
          sessionStorage.removeItem('firstLoginSession')
          navigateTo('/')
          sessionStorage.removeItem('userEmail')
        }
      })
    } else {
      setError(true)
    }
  }

  return (
    <section className='min-h-screen flex items-stretch text-black '>
      <div
        className='lg:flex w-1/2 hidden bg-no-repeat bg-cover bg-center relative items-center'
        style={{ backgroundImage: 'url(Section.webp)' }}
      >
        <div className='absolute  inset-0 z-0'></div>
      </div>
      <div className='lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0'>
        <div className='absolute lg:hidden z-10  bg-no-repeat bg-cover items-center '>
          <div className='absolute bg-black  inset-0 z-0'></div>
        </div>
        <div className='w-full  z-20'>
          <div className='flex items-center justify-center mb-2'>
            <STwoSLogo />
          </div>

          <h1 className='mt-3 text-lg font-bold text-center text-white'>Create new password</h1>

          <form
            className='sm:w-2/3 w-full px-4 lg:px-0 mx-auto'
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {error ? (
              <div className='mb-4'>
                <div
                  className='bg-[#FFFCF5] p-4 rounded-xl'
                  style={{ border: '1px solid #FEC84B' }}
                >
                  <div className='float-left pr-2'>
                    <svg
                      width='20'
                      height='20'
                      viewBox='0 0 20 20'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M10.0001 6.6665V9.99984M10.0001 13.3332H10.0084M18.3334 9.99984C18.3334 14.6022 14.6025 18.3332 10.0001 18.3332C5.39771 18.3332 1.66675 14.6022 1.66675 9.99984C1.66675 5.39746 5.39771 1.6665 10.0001 1.6665C14.6025 1.6665 18.3334 5.39746 18.3334 9.99984Z'
                        stroke='#DC6803'
                        strokeWidth='1.66667'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </div>
                  <div className='text-black font-semibold text-sm text-left'>
                    New passwords do not match.
                  </div>
                </div>
              </div>
            ) : null}

            <div className='pb-2 pt-4'>
              <label className='block text-white text-sm text-left font-semibold'>
                New Password
              </label>
              <div className='relative'>
                <input
                  placeholder='Enter new password'
                  className={`placeholder:text-sm w-full px-4 py-2 text-sm border-[#182230] text-[#667085] bg-[#182230]   rounded-md focus:ring-1 focus:outline-none ${
                    errors.newPassword
                      ? 'border-2 border-red-400 focus:ring-red-100'
                      : 'focus:border-blue-400 focus:ring-blue-600'
                  }`}
                  type={isNewPasswordVisible ? 'text' : 'password'}
                  {...register('newPassword', {
                    required:
                      'Password should contain minimum 8 characters (1 uppercase, 1 lowercase, 1 number, and 1 special character)',
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*()\-_=+\\|[\]{};:/?,.<>'"!~`]).{8,}$/,
                      message:
                        'Password should contain minimum 8 characters (1 uppercase, 1 lowercase, 1 number, and 1 special character)',
                    },
                  })}
                />

                <span
                  onClick={toggleNewPasswordVisibility}
                  className='absolute inset-y-0 end-0 cursor-pointer grid place-content-center px-4'
                >
                  {isNewPasswordVisible ? (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4 text-gray-400'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth='2'
                      stroke='currentColor'
                      className='h-4 w-4 text-gray-400'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
                      />
                    </svg>
                  )}
                </span>
              </div>
              {errors.newPassword && (
                <p className='text-xs mt-1 text-left text-[#FF0000]'>
                  {errors.newPassword.message as any}
                </p>
              )}
            </div>

            <div className='pb-2 pt-4'>
              <label className='block text-white text-sm text-left font-semibold'>
                Confirm Password
              </label>
              <div className='relative'>
                <input
                  placeholder='Enter confirm password'
                  className={`placeholder:text-sm w-full px-4 py-2 text-sm border-[#182230] text-[#667085] bg-[#182230]   rounded-md focus:ring-1 focus:outline-none ${
                    errors.newPasswordRepeat
                      ? 'border-2 border-red-400 focus:ring-red-100'
                      : 'focus:border-blue-400 focus:ring-blue-600'
                  }`}
                  type={isConformPasswordVisible ? 'text' : 'password'}
                  {...register('newPasswordRepeat', {
                    required:
                      'Password should contain minimum 8 characters (1 uppercase, 1 lowercase, 1 number, and 1 special character)',
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*()\-_=+\\|[\]{};:/?,.<>'"!~`]).{8,}$/,
                      message:
                        'Password should contain minimum 8 characters (1 uppercase, 1 lowercase, 1 number, and 1 special character)',
                    },
                  })}
                />

                <span
                  onClick={toggleconformPasswordVisibility}
                  className='absolute inset-y-0 end-0 cursor-pointer grid place-content-center px-4'
                >
                  {isConformPasswordVisible ? (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4 text-gray-400'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth='2'
                      stroke='currentColor'
                      className='h-4 w-4 text-gray-400'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
                      />
                    </svg>
                  )}
                </span>
              </div>
              {errors.newPasswordRepeat && (
                <p className='text-xs mt-1 text-left text-[#FF0000]'>
                  {errors.newPasswordRepeat.message as any}
                </p>
              )}
            </div>

            <div className=' pb-2 pt-2'>
              <button
                className='bg-[#EE7103] block w-full  py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue'
                type='submit'
              >
                Set Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ChangPassword
