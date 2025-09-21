import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { login } from '../../redux/nodes/signIn/action'
import { domain } from '../../environment/environment'
import STwoSLogo from '../logo/STwoSLogo'
import useWindowResolution from '../../layouts/Dashboard/useWindowResolution'

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [error, setError] = useState(false)

  const dispatch = useDispatch()

  const navigateTo = useNavigate()

  const onSubmit = (data: any) => {
    const email = data.email.toLowerCase()
    const signinDetails = {
      email: email,
      password: data.password,
      requestDomain: domain,
    }
    dispatch(login(signinDetails) as any).then((res: any) => {
      if (
        res.type == 'NEW_LOGIN_SUCCESS' &&
        res.payload.responseMessage == 'NEW_PASSWORD_REQUIRED'
      ) {
        sessionStorage.setItem('firstLoginSession', res.payload.firstLoginSession)
        sessionStorage.setItem('userEmail', data.email)
        navigateTo('/changePassword')
      } else if (res.type == 'NEW_LOGIN_SUCCESS') {
        navigateTo(`/tokencall`, { state: { bearerToken: res.payload.bearerToken } })
        sessionStorage.setItem('active', 'overview')
      } else if (res.type == 'NEW_LOGIN_FAIL') {
        setError(true)
      }
    })
  }

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState)
  }

  const forgetPassword = () => {
    navigateTo('/forgetPassword')
  }

  const { width, height } = useWindowResolution()
  const svgHeight = height

  return (
    <div className="box-border bg-gradient-to-r from-[#281301] via-[#060505] to-[#101b20] min-h-screen relative overflow-hidden">
      <svg className="h-auto absolute  left-0 fixed overflow-visible" xmlns="http://www.w3.org/2000/svg" width="371" height={svgHeight} viewBox="0 0 371 842" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M254.237 373.648L226.354 345.548H-232.413L-324.859 252.382V93.166L-232.413 0H301.532L368.672 93.3489V130.958H277.669L249.785 102.857H-180.861L-207.556 129.759V215.789L-180.861 242.691H277.906L370.352 335.857V373.751L254.237 373.648ZM-181.71 244.73L-209.594 216.629V128.919L-181.71 100.818H250.634L278.518 128.919H366.633V94.0059L300.487 2.03874H-231.564L-322.82 94.0059V251.542L-231.564 343.509H227.203L255.087 371.61L368.313 371.71V336.697L277.056 244.73H-181.71ZM254.237 468.352L370.352 468.249V506.143L277.906 599.309H-180.861L-207.556 626.211V712.241L-180.861 739.143H249.785L277.669 711.042H368.672V748.651L301.532 842H-232.413L-324.859 748.834V589.618L-232.413 496.452H226.354L254.237 468.352ZM227.203 498.491H-231.564L-322.82 590.458V747.994L-231.564 839.961H300.487L366.633 747.994V713.081H278.518L250.634 741.182H-181.71L-209.594 713.081V625.371L-181.71 597.27H277.056L368.313 505.303V470.29L255.087 470.39L227.203 498.491Z"
          fill="#FEEFDF" fill-opacity="0.15" />
      </svg>
      <svg className="h-auto absolute  right-0 fixed  overflow-visible" xmlns="http://www.w3.org/2000/svg" width="370" height={svgHeight} viewBox="0 0 370 842"
        fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M116.114 373.648L143.998 345.548H602.764L695.211 252.382V93.166L602.764 0H68.8196L1.68011 93.3489V130.958H92.6829L120.567 102.857H551.213L577.907 129.759V215.789L551.213 242.691H92.4462L0 335.857V373.751L116.114 373.648ZM552.062 244.73L579.946 216.629V128.919L552.062 100.818H119.718L91.8338 128.919H3.71881V94.0059L69.8646 2.03874H601.915L693.172 94.0059V251.542L601.915 343.509H143.148L115.265 371.61L2.0387 371.71V336.697L93.2953 244.73H552.062ZM116.114 468.352L0 468.249V506.143L92.4462 599.309H551.213L577.907 626.211V712.241L551.213 739.143H120.567L92.6829 711.042H1.68011V748.651L68.8196 842H602.764L695.211 748.834V589.618L602.764 496.452H143.998L116.114 468.352ZM143.148 498.491H601.915L693.172 590.458V747.994L601.915 839.961H69.8646L3.71881 747.994V713.081H91.8338L119.718 741.182H552.062L579.946 713.081V625.371L552.062 597.27H93.2953L2.0387 505.303V470.29L115.265 470.39L143.148 498.491Z"
          fill="#FEEFDF" fill-opacity="0.15" />
      </svg>

      <div className="rounded-[8px] flex flex-col gap-0  w-[680px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
        <svg className="absolute  left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-visible" xmlns="http://www.w3.org/2000/svg" width="230" height="40" viewBox="0 0 230 40" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M25.4665 16.3008L26.7576 17.6423L32 17.6471V15.9756L27.7747 11.5854H6.53349L5.24244 10.2439V6.05691L6.53349 4.71545H26.5514L27.8424 6.05691H31.9222V4.39025L28.8596 0H4.22525L0 4.39025V11.9106L4.22525 16.3008H25.4665ZM25.4665 23.6992L26.7576 22.3577L32 22.3529V24.0244L27.7747 28.4146H6.53349L5.24244 29.7561V33.9431L6.53349 35.2846H26.5514L27.8424 33.9431H31.9222V35.6098L28.8596 40H4.22525L0 35.6098V28.0894L4.22525 23.6992H25.4665Z" fill="#FF7B01" />
          <path d="M219.911 29.3899C218.927 29.3899 218.066 29.1092 217.328 28.5478C216.59 27.9583 215.933 27.2846 215.359 26.5267C214.812 25.7688 214.539 24.8846 214.539 23.8741V16.2951C214.539 15.2846 214.812 14.4004 215.359 13.6425C215.933 12.8846 216.59 12.2109 217.328 11.6214C218.066 11.06 218.927 10.7793 219.911 10.7793H224.628C225.612 10.7793 226.473 11.06 227.211 11.6214C227.949 12.2109 228.606 12.8846 229.18 13.6425C229.727 14.4004 230 15.2846 230 16.2951V23.8741C230 24.8846 229.727 25.7688 229.18 26.5267C228.606 27.2846 227.949 27.9583 227.211 28.5478C226.473 29.1092 225.612 29.3899 224.628 29.3899H219.911ZM218.64 23.7056C218.64 23.9863 218.845 24.3372 219.255 24.7583C219.665 25.1793 220.007 25.3899 220.281 25.3899H224.259C224.532 25.3899 224.874 25.1793 225.284 24.7583C225.694 24.3372 225.899 23.9863 225.899 23.7056V16.4635C225.899 16.1828 225.694 15.8319 225.284 15.4109C224.874 14.9898 224.532 14.7793 224.259 14.7793H220.281C220.007 14.7793 219.665 14.9898 219.255 15.4109C218.845 15.8319 218.64 16.1828 218.64 16.4635V23.7056Z" fill="#F1F1F1" />
          <path d="M208.23 10.9893H212.536L207.205 29.1788H203.022L199.536 17.4314L195.968 29.1788H191.785L186.536 10.9893H190.883L194 22.6945L197.404 10.9893H201.71L205.032 22.6945L208.23 10.9893Z" fill="#F1F1F1" />
          <path d="M185.351 14.9895H180.266V23.4948C180.266 23.7755 180.471 24.1264 180.881 24.5474C181.291 24.9685 181.633 25.179 181.906 25.179H184.695V29.179H181.537C180.553 29.179 179.692 28.8983 178.953 28.3369C178.215 27.7474 177.559 27.0737 176.985 26.3158C176.438 25.5579 176.165 24.6737 176.165 23.6632V14.9895H173.417V10.9895H176.165V4H180.266V10.9895H185.351V14.9895Z" fill="#F1F1F1" />
          <path d="M157.397 29.1893V25.2314H173.35V29.1893H157.397Z" fill="#FF7B01" />
          <path d="M153.16 13.6425C153.707 14.4004 153.98 15.2846 153.98 16.2951V29.1793H149.879V16.4635C149.879 16.1828 149.674 15.8319 149.264 15.4109C148.854 14.9898 148.512 14.7793 148.239 14.7793H146.352C145.696 14.7793 144.903 15.3267 143.973 16.4214V29.1793H139.872V16.4635C139.872 16.1828 139.667 15.8319 139.257 15.4109C138.847 14.9898 138.505 14.7793 138.232 14.7793H136.264C135.58 14.7793 134.773 15.3267 133.844 16.4214V29.1793H129.743V14.7372L129.333 10.9898H133.311L133.557 12.0846C134.678 11.2144 135.539 10.7793 136.14 10.7793H138.601C139.585 10.7793 140.447 11.06 141.185 11.6214C141.376 11.7618 141.786 12.1547 142.415 12.8004C144.11 11.453 145.381 10.7793 146.229 10.7793H148.608C149.592 10.7793 150.453 11.06 151.191 11.6214C151.929 12.2109 152.586 12.8846 153.16 13.6425Z" fill="#F1F1F1" />
          <path d="M125.166 22.0635H113.848V23.7477C113.848 24.0284 114.053 24.3793 114.463 24.8004C114.873 25.2214 115.215 25.432 115.488 25.432H119.753C119.835 25.432 119.931 25.4039 120.04 25.3477C120.15 25.2635 120.259 25.1513 120.368 25.0109C120.505 24.8706 120.614 24.7442 120.696 24.632C120.778 24.5197 120.888 24.3793 121.024 24.2109C121.161 24.0144 121.257 23.8741 121.311 23.7898L125.125 24.9688C124.524 26.1758 123.745 27.2144 122.788 28.0846C121.831 28.9548 120.792 29.3899 119.671 29.3899H115.119C114.135 29.3899 113.273 29.1092 112.535 28.5478C111.797 27.9583 111.141 27.2846 110.567 26.5267C110.02 25.7688 109.747 24.8846 109.747 23.8741V16.2951C109.747 15.2846 110.02 14.4004 110.567 13.6425C111.141 12.8846 111.797 12.2109 112.535 11.6214C113.273 11.06 114.135 10.7793 115.119 10.7793H119.794C120.778 10.7793 121.64 11.06 122.378 11.6214C123.116 12.2109 123.772 12.8846 124.346 13.6425C124.893 14.4004 125.166 15.2846 125.166 16.2951V22.0635ZM115.488 14.7372C115.215 14.7372 114.873 14.9477 114.463 15.3688C114.053 15.7898 113.848 16.1407 113.848 16.4214V18.4004H121.065V16.4214C121.065 16.1407 120.86 15.7898 120.45 15.3688C120.04 14.9477 119.698 14.7372 119.425 14.7372H115.488Z" fill="#F1F1F1" />
          <path d="M106.47 14.9895H101.385V23.4948C101.385 23.7755 101.59 24.1264 102 24.5474C102.41 24.9685 102.752 25.179 103.026 25.179H105.814V29.179H102.656C101.672 29.179 100.811 28.8983 100.073 28.3369C99.3346 27.7474 98.6784 27.0737 98.1043 26.3158C97.5575 25.5579 97.2841 24.6737 97.2841 23.6632V14.9895H94.5364V10.9895H97.2841V4H101.385V10.9895H106.47V14.9895Z" fill="#F1F1F1" />
          <path d="M81.4988 29.3899C80.3779 29.3899 79.3389 28.9548 78.382 28.0846C77.4251 27.2144 76.6459 26.1758 76.0444 24.9688L79.8584 23.7898C80.6786 24.8565 81.2117 25.3899 81.4578 25.3899H86.338C86.6114 25.3899 86.9532 25.1793 87.3633 24.7583C87.7734 24.3372 87.9784 23.9863 87.9784 23.7056V22.9056C87.9784 22.5407 87.7871 22.3442 87.4043 22.3162L80.5146 21.6425C79.3663 21.5302 78.4367 21.1091 77.7259 20.3793C77.015 19.6495 76.6596 18.639 76.6596 17.3477V16.2951C76.6596 15.2846 76.933 14.4004 77.4798 13.6425C78.0539 12.8846 78.7101 12.2109 79.4483 11.6214C80.1865 11.06 81.0477 10.7793 82.0319 10.7793H86.5021C87.623 10.7793 88.6619 11.2144 89.6189 12.0846C90.5758 12.9547 91.355 13.9933 91.9564 15.2004L88.1425 16.3793C87.3223 15.3126 86.7891 14.7793 86.5431 14.7793H82.401C82.1276 14.7793 81.7859 14.9898 81.3758 15.4109C80.9657 15.8319 80.7606 16.1828 80.7606 16.4635V17.1793C80.7606 17.4881 80.9657 17.6705 81.3758 17.7267L88.0195 18.4846C89.2224 18.6249 90.193 19.06 90.9312 19.7898C91.6967 20.4916 92.0795 21.5021 92.0795 22.8214V23.8741C92.0795 24.8846 91.8061 25.7688 91.2593 26.5267C90.6851 27.2846 90.029 27.9583 89.2908 28.5478C88.5526 29.1092 87.6914 29.3899 86.7071 29.3899H81.4988Z" fill="#F1F1F1" />
          <path d="M70.5901 10.9893H74.9372L66.243 35.9998H62.101L64.5616 29.1788H64.1925L57.7539 10.9893H62.265L66.4481 23.3682L70.5901 10.9893Z" fill="#F1F1F1" />
          <path d="M45.4544 29.3899C44.3334 29.3899 43.2945 28.9548 42.3376 28.0846C41.3807 27.2144 40.6015 26.1758 40 24.9688L43.814 23.7898C44.6342 24.8565 45.1673 25.3899 45.4134 25.3899H50.2936C50.567 25.3899 50.9088 25.1793 51.3189 24.7583C51.729 24.3372 51.934 23.9863 51.934 23.7056V22.9056C51.934 22.5407 51.7426 22.3442 51.3599 22.3162L44.4701 21.6425C43.3218 21.5302 42.3923 21.1091 41.6814 20.3793C40.9706 19.6495 40.6152 18.639 40.6152 17.3477V16.2951C40.6152 15.2846 40.8886 14.4004 41.4354 13.6425C42.0095 12.8846 42.6657 12.2109 43.4039 11.6214C44.142 11.06 45.0033 10.7793 45.9875 10.7793H50.4576C51.5786 10.7793 52.6175 11.2144 53.5744 12.0846C54.5313 12.9547 55.3105 13.9933 55.912 15.2004L52.0981 16.3793C51.2778 15.3126 50.7447 14.7793 50.4986 14.7793H46.3566C46.0832 14.7793 45.7414 14.9898 45.3313 15.4109C44.9212 15.8319 44.7162 16.1828 44.7162 16.4635V17.1793C44.7162 17.4881 44.9212 17.6705 45.3313 17.7267L51.975 18.4846C53.178 18.6249 54.1486 19.06 54.8868 19.7898C55.6523 20.4916 56.035 21.5021 56.035 22.8214V23.8741C56.035 24.8846 55.7616 25.7688 55.2148 26.5267C54.6407 27.2846 53.9845 27.9583 53.2463 28.5478C52.5082 29.1092 51.6469 29.3899 50.6627 29.3899H45.4544Z" fill="#F1F1F1" />
        </svg>
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
                  Incorrect email or password.
                </div>
              </div>
            </div>
          ) : null}

          <div className='pb-2 pt-4 w-full'>
            <label className='block text-sm text-left text-white font-semibold'>Email</label>
            <input
              id="email"
              placeholder="Enter your email"
              type="email"
              autoComplete="new-email"
              inputMode="email" // Add inputMode to specify email input
              className={`placeholder:text-sm w-full px-4 py-2 solid bg-[#182230] border-[#182230] text-[#fff] text-sm border rounded-md  focus:outline-none ${errors.email
                ? 'border-2 border-red-400 focus:ring-red-100'
                : ''
                }`}
              {...register('email', {
                required: 'Email is required.',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <p role='alert' className='text-xs mt-1 text-left text-[#FF0000]'>
                {errors.email.message as any}
              </p>
            )}
          </div>

          <div className='pb-2 pt-4'>
            <label className='block text-left text-sm text-white font-semibold'>Password</label>
            <div className='relative'>
              <input
                id='password'
                placeholder='Enter your password '
                autoComplete="new-password"
                className={`placeholder:text-sm w-full bg-[#182230]  px-4 py-2 text-sm  border-[#182230] text-[#fff]  rounded-md focus:ring-1 focus:outline-none ${errors.password
                  ? 'border-2 border-red-400 focus:ring-red-100'
                  : ''
                  }`}
                type={isPasswordVisible ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required .',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
              />

              <span
                onClick={togglePasswordVisibility}
                className='absolute inset-y-0 end-0 grid cursor-pointer place-content-center px-4'
              >
                {isPasswordVisible ? (
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
            {errors.password && (
              <p className='text-xs text-left text-[#FF0000]'>{errors.password.message as any}</p>
            )}
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-start'>
            </div>
            <a
              onClick={forgetPassword}
              className='text-sm font-medium cursor-pointer text-white hover:underline cursor-pointer'
            >
              Forgot password?
            </a>
          </div>

          <div className=' pb-2 pt-2'>
            <button
              className='bg-[#EE7103] block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue'
              type='submit'
            >
              Sign In
            </button>
          </div>

          <div className='relative'>
            <div className='flex items-center justify-center gap-8'></div>
          </div>
        </form>
      </div>
    </div>
  )
}
