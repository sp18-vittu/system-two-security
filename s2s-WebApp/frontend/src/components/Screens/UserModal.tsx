import React from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Inviteuser, UserList } from '../../redux/nodes/users/action'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { Token } from '@mui/icons-material'

export const UserModal = (props: any) => {
  const userDetails = useSelector((state: any) => state.userDetailreducer)
  const { domainDetail } = userDetails

  const dispatch = useDispatch()
  const { action = () => {} } = props
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (data: any) => {
    let Email: any = domainDetail?.filter((item: any) => {
      return item.email == data.email
    })
    if (Email.length > 0) {
      Swal.fire({
        title: 'This Email Already Exists',
        width: 300,
        timer: 1000,
        showConfirmButton: false,
      })
    } else {
      data.email = data.email.toLowerCase()
      dispatch(Inviteuser(data) as any).then((res: any) => {
        if (res.type == 'INVITE_USER_SUCCESS') {
          dispatch(UserList(Token) as any)
          Swal.fire({
            position: 'center',
            icon: 'success',
            color: '#000',
            title: `${`Invite has been successfully sent`}`,
            width: 400,
            timer: 1000,
            showConfirmButton: false,
          })
        }
      })
    }
    action(false)
  }

  return (
    <>
      <div className=' justify-center backdrop-blur-sm items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ml-16'>
        <div className='relative font-inter md:text-sm 2xl:text-lg w-1/2 max-lg:w-3/4 max-sm:w-[90%]'>
          <div className='p-6 border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-[#1D2939] gap-6 outline-none focus:outline-none'>
            <div className='flex flex-col gap-4'>
              <div className='rounded-full p-3 bg-[#32435A] w-[max-content]'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M21.5 18L14.8571 12M9.14286 12L2.50003 18M2 7L10.1649 12.7154C10.8261 13.1783 11.1567 13.4097 11.5163 13.4993C11.8339 13.5785 12.1661 13.5785 12.4837 13.4993C12.8433 13.4097 13.1739 13.1783 13.8351 12.7154L22 7M6.8 20H17.2C18.8802 20 19.7202 20 20.362 19.673C20.9265 19.3854 21.3854 18.9265 21.673 18.362C22 17.7202 22 16.8802 22 15.2V8.8C22 7.11984 22 6.27976 21.673 5.63803C21.3854 5.07354 20.9265 4.6146 20.362 4.32698C19.7202 4 18.8802 4 17.2 4H6.8C5.11984 4 4.27976 4 3.63803 4.32698C3.07354 4.6146 2.6146 5.07354 2.32698 5.63803C2 6.27976 2 7.11984 2 8.8V15.2C2 16.8802 2 17.7202 2.32698 18.362C2.6146 18.9265 3.07354 19.3854 3.63803 19.673C4.27976 20 5.11984 20 6.8 20Z'
                    stroke='white'
                    stroke-width='2'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
              </div>
              <div className='flex flex-col gap-2'>
                <p className='text-md font-semibold text-white sm:text-[18px] md:text-[18px] 2xl:text-[18px]'>
                  Invite User
                </p>
                <p className='text-[#98A2B3] text-sm md:text-sm 2xl:text-lg'>
                  Please fill the credentials below
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 w-full'>
              <div className='relative flex flex-col gap-4'>
                <div className='flex flex-row gap-4 w-full max-sm:flex-col'>
                  <div className='w-full flex flex-col gap-[6px]'>
                    <label
                      className='block text-sm font-medium text-white md:text-sm 2xl:text-lg'
                      htmlFor='firstName'
                    >
                      First Name
                    </label>
                    <input
                      type='text'
                      id='firstName'
                      placeholder='Enter First Name'
                      {...register('firstName', {
                        required: 'First Name is required',
                      })}
                      className='bg-[#48576C] border border-[#6E7580] text-white text-sm rounded-lg focus:outline-none focus:border-white block w-full p-2.5'
                    />
                    {errors.firstName && errors.firstName?.message && (
                      <span className='text-red-500 text-sm'>{`${errors.firstName?.message}`}</span>
                    )}
                  </div>
                  <div className='w-full flex flex-col gap-[6px]'>
                    <label
                      className='block text-sm font-medium text-white md:text-sm 2xl:text-lg'
                      htmlFor='lastName'
                    >
                      Last Name
                    </label>
                    <input
                      type='text'
                      id='lastName'
                      placeholder='Enter Last Name'
                      {...register('lastName', {
                        required: 'Last Name is required',
                      })}
                      className='bg-[#48576C] border border-[#6E7580] text-white text-sm rounded-lg focus:outline-none focus:border-white block w-full p-2.5'
                    />
                    {errors.lastName && errors.lastName?.message && (
                      <span className='text-red-500 text-sm'>{`${errors.lastName?.message}`}</span>
                    )}
                  </div>
                </div>
                <div className='w-full flex flex-col gap-[6px]'>
                  <label
                    className='block text-sm font-medium text-white md:text-sm 2xl:text-lg'
                    htmlFor='email'
                  >
                    Email Address
                  </label>
                  <input
                    type='text'
                    id='email'
                    placeholder='Enter email address'
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    className='bg-[#48576C] border border-[#6E7580] text-white text-sm rounded-lg focus:outline-none focus:border-white block w-full p-2.5'
                  />
                  {errors.email && errors.email?.message && (
                    <span className='text-red-500 text-sm'>{`${errors.email?.message}`}</span>
                  )}
                </div>
              </div>
              <div className='flex gap-3 justify-end'>
                <button
                  className='md:text-sm 2xl:text-lg  w-[120px] bg-white text-sm font-semibold text-[#182230] border-[1px] border-solid border-[#D0D5DD] rounded-lg justify-center font-bold px-3 py-2 text-xs inline-flex'
                  type='button'
                  onClick={() => action(false)}
                >
                  Cancel
                </button>
                <button
                  className='md:text-sm 2xl:text-lg w-[120px] bg-[#EE7103] border-[#EE7103] border-solid border text-white justify-center font-semibold rounded-lg px-3 py-2 text-xs font-medium inline-flex '
                  type='submit'
                >
                  Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
    </>
  )
}
