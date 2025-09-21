import React from 'react'
import { useNavigate } from 'react-router-dom'

const ThakYoupage = () => {
  const navigateTo = useNavigate()
  return (
    <div>
      <section className='min-h-screen flex items-stretch text-black '>
        <div
          className='lg:flex w-1/2 hidden bg-no-repeat bg-cover bg-center relative items-center'
          style={{ backgroundImage: 'url(Section.webp)' }}
        >
          <div className='absolute  inset-0 z-0'></div>
        </div>
        <div className='lg:w-1/2 flex items-center justify-center text-center md:px-16 px-0 z-0'>
          <div className='flex flex-col gap-[24px] items-center w-[25rem] rounded-lg p-[24px] bg-[#1D2939]'>
            <div className='bg-[#DCFAE6] mt-3 w-[48px] h-[48px] flex items-center justify-center  rounded-[50px]'>
              <div>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <path
                    d='M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z'
                    stroke='#079455'
                    stroke-width='2'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
              </div>
            </div>
            <div className='flex flex-col items-center'>
              <h1 className='text-white text-lg font-semibold'>Password set successfully</h1>
              <p className='text-white text-sm font-normal'>
                Your password have been changed successfully.
              </p>
              <p className='text-white text-sm font-normal'>
                {' '}
                Please Sign In with your new password.
              </p>
            </div>
            <div
              className=' flex items-center justify-center text-center pb-5'
              onClick={() => navigateTo('/signin')}
            >
              <button
                className='bg-[#EE7103] block w-[20rem]  py-2 mt-2 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue'
                type='submit'
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ThakYoupage
