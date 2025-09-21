import React from 'react'
import './../../layouts/App/App.css'
import { useNavigate } from 'react-router-dom'
import STwoSLogo from '../logo/STwoSLogo'

function Landing() {
  const navigate = useNavigate()
  const SignInClick = () => {
    navigate('/signin')
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <div>
          {' '}
          <STwoSLogo />
        </div>
        <p className='App-title'>Welcome to System Two Security</p>
        <p className='App-sub-title'>Login with your System Two Security account to continue.</p>
        <div className='p-2 border-solid border-slate-200 rounded-b'>
          <button
            className='w-36 text-white justify-center font-bold rounded-lg px-3 py-2 text-base inline-flex bg-[#EE7103]'
            type='button'
            onClick={SignInClick}
          >
            Sign In
          </button>
        </div>
      </header>
    </div>
  )
}

export default Landing
