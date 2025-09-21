import React from 'react'
import { useForm } from 'react-hook-form'
import STwoSLogo from '../logo/STwoSLogo'

const SignInSSO = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (data: any) => {
    window.location.replace(`https://${data.email}.systemtwosecurity.com/signin`)
  }
  const signIn = () => {
    window.location.replace(`https://mvp.systemtwosecurity.com/signup`)
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
          <div className='flex items-center justify-center mb-2'>
            <STwoSLogo />
          </div>
          <h2 className='mt-4 text-xl font-semibold flex items-center justify-center text-center text-white'>
            Early Access Program
          </h2>
          <p className='mb-3 text-lg  flex items-center justify-center text-center text-[#D0D5DD]'>
            Proactive Threat Hunting with Generative AI
          </p>
          <form
            action=''
            className='sm:w-2/3 w-full px-4 lg:px-0 mx-auto'
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className='pb-2 pt-4'>
              <label className='block text-sm text-left text-[#D0D5DD] mb-1'>Got an account?</label>

              <div className='relative mb-4 flex flex-wrap items-stretch'>
                <input
                  type='text'
                  className={`relative bg-[#182230] m-0 block w-[1px] min-w-0 flex-auto rounded-l border border-[black]  bg-clip-padding px-3 py-[0.25rem] text-sm font-normal  text-white  ${
                    errors.email
                      ? 'border-2 border-[red] focus:ring-red-100'
                      : 'focus:border-[#fff] focus:ring-blue-600'
                  }`}
                  placeholder='Enter account'
                  style={{ borderRight: 'none' }}
                  {...register('email', {
                    required: 'Enter account is required .',
                  })}
                />
                <span
                  className={`flex items-center whitespace-nowrap rounded-r border border-solid border-[black] px-3 py-[0.25rem] text-center text-sm font-normal leading-[1.6] text-[#667085]  ${
                    errors.email
                      ? 'border-2 border-red-400 focus:ring-red-100'
                      : 'focus:border-blue-400 focus:ring-blue-600'
                  }`}
                  id='basic-addon2'
                  style={{ borderLeft: 'none' }}
                >
                  .systemtwosecurity.com
                </span>
              </div>

              <p className='block text-[#667085] text-sm mt-[-15px] text-left'>
                Your account was shared in the Welcome email.
              </p>
            </div>

            <div className=' pb-2'>
              <button
                className='bg-[#EE7103] block w-full  py-2 mt-4 Text md/Semibold leading-5 text-center text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue'
                type='submit'
              >
                Go to Account
              </button>
            </div>
            <p className='flex items-center text-sm justify-center mt-5  text-[#D0D5DD]'>
              <b>
                {' '}
                Don't have an account &nbsp;
                <span className='text-[#EE7103] underline cursor-pointer ' onClick={signIn}>
                  Sign up
                </span>
              </b>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

export default SignInSSO
