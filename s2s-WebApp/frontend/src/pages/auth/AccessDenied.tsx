import React from 'react'
import { useNavigate } from 'react-router-dom'

const AccessDenied = () => {
  const navigateTo = useNavigate()

  const backtoHome = () => {
    navigateTo('/')
  }

  const goBack = () => {
    navigateTo('/signInwithGoogle')
  }

  return (
    <div className='relative h-screen flex bg-white w-full items-center justify-center'>
      <h1
        className='text-[19rem] font-black text-gray-100 2xl:text-[25rem]'
        style={{ wordSpacing: '3rem' }}
      >
        403
      </h1>
      <div className='absolute items-center'>
        <span
          className='text-5xl text-black tracking-wide font-medium 2xl:text-7xl '
          style={{ wordSpacing: '1rem' }}
        >
          Access Denied
        </span>
        <p className='text-xl mt-4 text-center'>You are not allowed to access the page</p>
        <br />
        <div className='flex items-center justify-center'>
          <button
            className='m-2 p-3 text-black bg-white focus:outline-none font-medium border-2 border-gray-200 rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center 2xl:w-30 2xl:h-10'
            type='button'
            onClick={goBack}
          >
            <svg xmlns='http://www.w3.org/2000/svg' height='1em' viewBox='0 0 448 512'>
              <path d='M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z' />
            </svg>
            <span className='pl-2 2xl:text-lg'>Go back</span>
          </button>
          <button
            className='bg-[#EE7103] text-white focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center 2xl:w-30 2xl:h-10 2xl:text-lg'
            type='button'
            onClick={backtoHome}
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccessDenied
