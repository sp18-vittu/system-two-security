import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { postForgotPassword } from '../../redux/nodes/ForgotPassword/action'
import { domain } from '../../environment/environment'
import Swal from 'sweetalert2'
import STwoSLogo from '../logo/STwoSLogo'

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch()
  const navigateTo = useNavigate()

  const [error, setError] = useState(false)

  const onSubmit = (data: any) => {
    const email = data.email.toLowerCase()
    const forgotPass = {
      email: email,
      requestDomain: domain,
    }
    dispatch(postForgotPassword(forgotPass) as any).then((res: any) => {
      if (res.type == 'POST_FORGOTPASSWORD_FORM_SUCCESS') {
        Swal.fire({
          position: 'center',
          icon: 'success',
          color: '#000',
          title: 'Email Sent Successfully',
          width: 400,
          timer: 1000,
          showConfirmButton: false,
        })
        navigateTo('/signin')
      } else setError(true)
    })
  }

  return (
    <section className='min-h-screen flex items-stretch text-black '>
      <div
        className='lg:flex w-1/2 hidden bg-no-repeat bg-cover bg-center relative items-center'
        style={{ backgroundImage: 'url(Section.webp' }}
      >
        <div className='absolute  inset-0 z-0'></div>
      </div>
      <div className='lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0'>
        <div className='absolute lg:hidden z-10  bg-no-repeat bg-cover items-center '>
          <div className='absolute bg-black  inset-0 z-0'></div>
        </div>
        <div className='w-full  z-20'>
          <h1 className='flex items-center justify-center mb-4'>
            <STwoSLogo />
          </h1>
          <h1 className='mb-4 text-lg font-bold text-center text-white'>Forgot password?</h1>
          <form
            action=''
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
                  <div className='text-[#B54708] font-semibold text-sm text-left'>
                    Failed to reset password.
                  </div>
                </div>
              </div>
            ) : null}
            <div className='pb-2 pt-4'>
              <label className='block text-white text-sm text-left font-semibold'>Email</label>
              <div className='relative'>
                <input
                  type='email'
                  placeholder='Please enter your registered email ID'
                  className={`placeholder:text-sm w-full px-4 py-2 bg-[#182230] text-[#fff] border-[#667085)] text-sm  rounded-md focus:ring-1 focus:outline-none ${
                    errors.email
                      ? 'border-2 border-red-400 focus:ring-red-100'
                      : 'focus:border-blue-400 focus:ring-blue-600'
                  }`}
                  {...register('email', {
                    required: 'Email is required .',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && (
                  <p className='text-xs mt-1 text-left text-[#FF0000]'>
                    {errors.email.message as any}
                  </p>
                )}
              </div>
            </div>

            <div className=' pb-2 pt-2'>
              <button
                className='bg-[#EE7103] block w-full  py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue'
                type='submit'
              >
                Send reset link
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ForgotPassword
