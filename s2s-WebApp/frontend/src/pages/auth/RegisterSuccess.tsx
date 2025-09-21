import React from 'react'

export default function RegisterSuccess() {
  return (
    <div>
      <section className='min-h-screen flex items-stretch text-black p-[24px]'>
        <div
          className='lg:flex w-1/2 hidden bg-no-repeat bg-cover bg-center relative items-center'
          style={{ backgroundImage: 'url(Section.webp)' }}
        >
          <div className='absolute  inset-0 z-0'></div>
        </div>
        <div className='lg:w-1/2 flex items-center justify-center text-center md:px-12 px-0 z-0'>
          <div className='flex flex-col gap-[24px] items-center w-[110rem] rounded-lg px-3 py-3 bg-[#1D2939]'>
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

            <div className='text-center font-inter pl-1 '>
              <h1 className='text-white text-2xl font-semibold pb-3'>Thank you for registering</h1>
              <p className='text-white font-normal text-base text-left font-semibold pb-2'>
                Thank you for registering for System Two Security's (S2S) Early Access Program.
              </p>
              <p className='text-white font-normal text-base text-left pb-2'>
                Your support and feedback are invaluable to us as we strive to make our product the
                best it can be. We're excited for your interest and look forward to sharing this
                journey with you.
              </p>
              <p className='text-white font-normal text-base text-left  pb-2'>
                As a next step, you will receive a Welcome email with access details to your
                instance of S2S from us in the next 24 hours.
              </p>
              <p className='text-white font-normal text-base text-left'>Thanks,</p>
              <p className='text-white font-normal text-base text-left'>System Two Security</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
