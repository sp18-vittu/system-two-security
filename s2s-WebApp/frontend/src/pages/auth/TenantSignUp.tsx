import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { tenantSignUp } from '../../redux/nodes/Signup/action'
import { makeStyles } from '@mui/styles'
import STwoSLogo from '../logo/STwoSLogo'

const TenantSignUp = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    checkbox: '',
  })
  const dispatch = useDispatch()
  const navigateTo = useNavigate()
  const [tearmsPopup, setTearmsPopup] = useState(false)
  const [privacyPopup, setPrivacyPopup] = useState(false)

  const [validate, setValidate] = useState(false)

  const handleCheckboxChange = (e: any) => {
    setFormData((prevValue: any) => {
      return { ...prevValue, checkbox: e }
    })
  }

  useEffect(() => {
    if (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.companyName.trim() &&
      formData.checkbox
    ) {
      setValidate(true)
      setValue('firstName', formData.firstName)
      setValue('lastName', formData.lastName)
      setValue('email', formData.email)
      setValue('companyName', formData.companyName)
    } else {
      setValidate(false)
    }
  }, [
    formData.firstName,
    formData.lastName,
    formData.email,
    formData.companyName,
    formData.checkbox,
  ])

  const onSubmit = (data: any) => {
    delete data.checkbox
    data.email = data.email.toLowerCase()
    dispatch(tenantSignUp(data) as any).then((res: any) => {
      if (res.type == 'POST_TENANTSIGNUP_FORM_SUCCESS') {
        navigateTo('/RegisterSuccess')
      }
    })
  }

  const handleCloseModal = () => {
    setTearmsPopup(false) // Close the modal when Cancel button is clicked
    setPrivacyPopup(false)
  }

  const useStyles = makeStyles((theme) => ({
    formContainer: {
      '&::-webkit-scrollbar': {
        width: '10px', // Width of the scrollbar track
        height: '3px !important',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#32435A',
        width: '3px', // Width of the scrollbar thumb
        height: '3px !important', // Height of the scrollbar thumb
      },
    },
  }))
  const classes = useStyles()
  const getFirsttName = (firstName: string) => {
    setFormData((prevValue: any) => {
      return { ...prevValue, firstName: firstName }
    })
  }
  const getLasttName = (lastName: string) => {
    setFormData((prevValue: any) => {
      return { ...prevValue, lastName: lastName }
    })
  }

  const getEmail = (email: string) => {
    setFormData((prevValue: any) => {
      return { ...prevValue, email: email }
    })
  }
  const getComapny = (companyName: string) => {
    setFormData((prevValue: any) => {
      return { ...prevValue, companyName: companyName }
    })
  }

  return (
    <div className='text-white'>
      <section className='min-h-screen flex items-stretch text-black  '>
        <div
          className='lg:flex w-1/2  items-center justify-center hidden bg-no-repeat bg-cover -mt-14 '
          style={{ backgroundImage: 'url(SigninImage.webp)' }}
        >
          <div
            className={
              `${classes.formContainer} ` +
              'bg-[#0C111D] mt-64 w-[850px] h-[500px] mx-[32px] overflow-y-auto custom_scrollbar  '
            }
          >
            <div className='mx-[32px] '>
              <div>
                <p className='text-[#EE7103] text-lg font-semibold pb-3'>
                  Welcome to Early Access Program{' '}
                </p>
                <p className='text-[#FFF] text-base font-semibold'>
                  Sign-up to your pre-launch early access to
                  <span className='text-[#EE7103] text-base font-semibold pl-1'>
                    System Two Security:
                  </span>
                  <p className='text-[#FFF] text-base font-semibold pb-2'>
                    A pioneer in proactive threat hunting with generative Al
                  </p>
                </p>
                <p className='text-[#FFF] text-base font-semibold pb-2'>
                  <span className='text-[#EE7103]  pr-1'>S2S Threat Hunter pre release</span>
                  generates ready-to-deploy detection rules for novel attack patterns within minutes
                  from external cyber threat intelligence (CTI) reports delivering a technological
                  paradigm shift in terms of speed and value to Threat Hunting
                </p>
              </div>
              <div className='pb-2'>
                <p className='text-[#EE7103] text-base font-semibold pb-2'>
                  By joining you receive:
                </p>
                <ul>
                  <li className='flex items-center text-[#FFF] text-base font-semibold'>
                    <span className='mr-2'>&#8226;</span>
                    Access S2S Threat Hunter in advance of its Black Hat release in August 2024.
                  </li>
                  <li className='flex items-center text-[#FFF] text-base font-semibold'>
                    <span className='mr-2'>&#8226;</span>
                    Explore bleeding-edge generative AI innovation in cybersecurity before it is
                    generally available.
                  </li>
                  <li className='flex items-center text-[#FFF] text-base font-semibold'>
                    <span className='mr-2'>&#8226;</span>
                    Influence priority of features and integrations to align with your systems and
                    processes
                  </li>
                  <li className='flex items-center text-[#FFF] text-base font-semibold'>
                    <span className='mr-2'>&#8226;</span>
                    Interact one-to-one with product and engineering leadership.
                  </li>
                </ul>
              </div>

              <div>
                <p className='text-[#EE7103] text-base font-semibold pb-2'>Features</p>
                <li className='flex  text-[#FFF] text-base font-semibold'>
                  <span className='mr-2'>&#8226;</span>
                  Process an Intel report in minutes to extract critical and actionable intel
                  (threat actor behaviors).
                </li>
                <li className='flex  text-[#FFF] text-base font-semibold ml-14'>
                  <span className='mr-2'>&#9633;</span>
                  Built-in integrations with CTI sources and aggregators
                </li>
                <li className='flex text-[#FFF] text-base font-semibold ml-14'>
                  <span className='mr-2'>&#9633;</span>
                  Plug-in integration with customer’s threat Intel sources and aggregators
                </li>
                <li className='flex text-[#FFF] text-base font-semibold'>
                  <span className='mr-2'>&#8226;</span>
                  Convert extracted intel into S2S Threat detection rules (SIGMA rules)
                </li>
                <li className='flex  text-[#FFF] text-base font-semibold ml-14'>
                  <span className='mr-2'>&#9633;</span>
                  Manage SIGMA files as a collaborative company-specific repository
                </li>
                <li className='flex  text-[#FFF] text-base font-semibold'>
                  <span className='mr-2'>&#8226;</span>
                  Deploy SIGMA rules in your SIEM or XDR systems - no integration necessary
                </li>
                <div className='flex text-[#FFF] text-base font-semibold '>
                  <span className='mr-2'>&#8226;</span>
                  <li style={{ listStyle: 'none' }}>
                    Map the extracted intel into S2S Generative Threat Graph and interact with S2S
                    Threat Specialist (S2S chat interface) to
                  </li>
                </div>

                <li className='flex  text-[#FFF] text-base font-semibold ml-14'>
                  <span className='mr-2'>&#9633;</span>
                  Understand attacker behavior from S2S Generative Threat Graph
                </li>
                <li className='flex  text-[#FFF] text-base font-semibold ml-14'>
                  <span className='mr-2'>&#9633;</span>
                  Access Threat Hunter available in specific CTI reports
                </li>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:w-1/2 flex items-center justify-center text-center md:px-16 px-0 z-0  '>
          <div className='flex flex-col gap-[24px] items-center  mt-24'>
            <div>
              <STwoSLogo />
            </div>
            <div className='flex flex-col items-center'>
              <div>
                <p className=' text-white text-2xl  font-semibold'>Customer SignUp</p>
                <p className='font-normal text-base text-white'>Welcome to EAP Access</p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* *************************form********************************* */}
                <div className='flex flex-col gap-[20px] mt-[32px]'>
                  <div className='flex justify-center items-center gap-[20px]'>
                    <div className='text-left text-white text-sm font-medium flex flex-col gap-[4px]'>
                      <label htmlFor='firstName'>First Name*</label>
                      <input
                        type='text'
                        id='firstName'
                        autoComplete='new-password'
                        placeholder='Enter first name'
                        {...register('firstName', {
                          required: 'First Nameis required .',
                        })}
                        className='bg-[#182230] text-white text-base rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full px-[14px] py-[10px]'
                        style={{ fontSize: '16px' }}
                        onChange={(e) => getFirsttName(e.target.value)}
                      />
                    </div>
                    <div className='text-left text-white text-sm font-medium flex flex-col gap-[4px]'>
                      <label htmlFor='lastName'>Last Name*</label>
                      <input
                        type='text'
                        id='lastName'
                        autoComplete='new-password'
                        placeholder='Enter last name'
                        {...register('lastName', {
                          required: 'Last Nameis required .',
                        })}
                        className='bg-[#182230]  text-white text-base rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full px-[14px] py-[10px]'
                        style={{ fontSize: '16px' }}
                        onChange={(e) => getLasttName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className='text-left text-white text-sm font-medium flex flex-col gap-[2px]'>
                    <label htmlFor='email' className='pb-2'>
                      Work Email*
                    </label>
                    <input
                      type='text'
                      id='email'
                      autoComplete='new-password'
                      placeholder='Enter Work email'
                      {...register('email', {
                        required: 'Email is required.',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          message: 'Invalid email address',
                        },
                        setValueAs: (value) => value.trim(), // Trim the email value
                      })}
                      className='bg-[#182230]  text-white text-base 
                                rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full px-[14px] py-[10px]'
                      style={{ fontSize: '16px' }}
                      onChange={(e) => getEmail(e.target.value)}
                    />
                  </div>
                  {errors.email && (
                    <p className='text-xs mt-1 text-left text-[red]'>
                      {errors.email.message as any}
                    </p>
                  )}
                  <div className='text-left text-white text-sm font-medium flex flex-col gap-[2px]'>
                    <label htmlFor='companyName' className='pb-2'>
                      Company Name*
                    </label>
                    <input
                      type='text'
                      id='companyName'
                      autoComplete='new-password'
                      {...register('companyName', {
                        required: 'Company Name is required .',
                      })}
                      placeholder='Enter company name'
                      className='bg-[#182230]  text-white text-base 
                                rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full px-[14px] py-[10px]'
                      style={{ fontSize: '16px' }}
                      onChange={(e) => getComapny(e.target.value)}
                    />
                  </div>
                </div>

                <div className='flex items-start mt-3'>
                  <div className='flex items-center h-5'>
                    <input
                      id='remember'
                      autoComplete='new-password'
                      aria-describedby='remember'
                      type='checkbox'
                      {...register('checkbox', {
                        required: 'By signing  required .',
                      })}
                      onChange={handleCheckboxChange}
                      className='ml-2 relative -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.200rem] w-[1.200rem] appearance-none rounded-[0.25rem]
                    border-[0.125rem] border-solid border-gray-300 outline-none
                      before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0
                      before:rounded-full checked:border-[#FF6600] checked:bg-[#FF6600] before:bg-[yellow] before:opacity-0
                      
                      checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8110rem]
                      checked:after:w-[0.400rem] checked:after:rotate-45 checked:after:border-[0.100rem]
                      checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid
                      checked:after:border-[white] checked:after:bg-transparent 
                       hover:before:opacity-[0.04]'
                    />
                  </div>
                  <div className='block'>
                    <p className='font-medium text-white  mr-[5rem]'>
                      By signing up you agree to our
                    </p>
                    <p className='font-medium text-white'>
                      <span
                        className='text-[#EE7103] underline cursor-pointer'
                        onClick={() => setTearmsPopup(true)}
                      >
                        Terms and Conditions
                      </span>{' '}
                      and
                      <span
                        className='cursor-pointer text-[#EE7103] underline'
                        onClick={() => setPrivacyPopup(true)}
                      >
                        {' '}
                        Privacy policy
                      </span>
                    </p>
                  </div>
                </div>
                {/* ***********************Submit Btn************************ */}
                <div className='mt-[24px]'>
                  <button
                    disabled={validate ? false : true}
                    type='submit'
                    className={
                      !validate
                        ? `w-full bg-[#EE7103] border border-[#EE7103] text-white rounded-lg px-[16px] py-[10px] cursor-not-allowed opacity-50 `
                        : `w-full bg-[#EE7103] border border-[#EE7103] text-white rounded-lg px-[16px] py-[10px] `
                    }
                  >
                    SignUp
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      {tearmsPopup && (
        <>
          <div className=' backdrop-blur-sm  flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none p-35'>
            <div className='md:text-sm 2xl:text-lg relative w-3/4 my-6 mx-auto '>
              <div className='md:text-sm 2xl:text-lg border-0 rounded-lg shadow-lg relative flex flex-col  w-full h-full bg-white outline-none focus:outline-none'>
                <div className=' flex p-2 border-solid border-slate-200 rounded-t'>
                  <div className=' w-[40%]'></div>
                  <div className='flex justify-between  w-[60%]'>
                    <h6 className='md:text-md text-[18px] 2xl:text-lg text-1xl font-semibold  text-black '>
                      Terms and Conditions
                    </h6>
                    <button onClick={handleCloseModal}>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='black'
                      >
                        <path
                          d='M18 6L6 18M6 6L18 18'
                          stroke={'black'}
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className='h-full '>
                  <iframe
                    title='PDF Viewer'
                    src='https://drive.google.com/file/d/1L3Tvj4CSWzxS4M-s0YjblRGio7T88RE3/preview'
                    width='100%'
                    height='100%'
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
          <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
        </>
      )}
      {privacyPopup && (
        <>
          <div className=' backdrop-blur-sm  flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none p-35'>
            <div className='md:text-sm 2xl:text-lg relative w-3/4 my-6 mx-auto '>
              <div className='md:text-sm 2xl:text-lg border-0 rounded-lg shadow-lg relative flex flex-col  w-full h-full bg-white outline-none focus:outline-none'>
                <div className=' flex p-2 border-solid border-slate-200 rounded-t'>
                  <div className=' w-[40%]'></div>
                  <div className='flex justify-between  w-[60%]'>
                    <h6 className='md:text-md text-[18px] 2xl:text-lg text-1xl font-semibold  text-black '>
                      Privacy policy
                    </h6>
                    <button onClick={handleCloseModal}>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='black'
                      >
                        <path
                          d='M18 6L6 18M6 6L18 18'
                          stroke={'black'}
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className='h-full '>
                  <iframe
                    title='PDF Viewer'
                    src='https://drive.google.com/file/d/1fTC_gQTWy6AZ8YVbIqWNRCG_oEQHUVZG/preview'
                    width='100%'
                    height='100%'
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
          <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
        </>
      )}
    </div>
  )
}

export default TenantSignUp
