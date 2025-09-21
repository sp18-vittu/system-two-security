import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import local from '../../utils/local'

const Overview = () => {
  const {
    formState: { errors },
  } = useForm()
  const dispatch = useDispatch()
  const navigateTo = useNavigate()

  const [datadetail, setDatadetail] = useState([])
  const [mouseEnter, setmouseEnter] = useState(false)
  const roleDto = local.getItem('auth')
  const role = JSON.parse(roleDto as any)
  const roleDescription = role?.user?.user
  const getroleName = roleDescription?.roleDTO

  useEffect(() => {
    Axios.get('../assets/overview.json').then((response) => {
      setDatadetail(response.data)
    })
  }, [dispatch])

  const selectSources = () => {
    navigateTo(`/app/datavaults/${1}`)
  }

  return (
    <div className='bg-[#0C111D] h-[550px]'>
      <div
        className='flex flex-row inline h-20 rounded-lg mt-[36px] block rounded-xl text-left mx-4'
        style={{ backgroundColor: '#054D80' }}
      >
        <div className='inline-flex float-right'>
          <div className='p-6 flex items-center'>
            <p className='text-Base-White font-inter text-xl font-semibold leading-7.5" text-[#FFFFFF] -mt-1'>
              Let’s kick things off by setting up your Cyber Threat Intel Archive
              <br />
            </p>
          </div>
          {getroleName?.roleName !== 'USER' && (
            <div
              className='absolute right-12'
              onMouseOver={() => setmouseEnter(true)}
              onMouseOut={() => setmouseEnter(false)}
            >
              <button
                className=' right-9 bg-slate-50 h-9  right-12 mt-5 pl-2 text-[#344054] inline-flex items-center rounded-lg border font-bold rounded hover:bg-[#6941c6] hover:text-white  hover:border-none '
                onClick={selectSources}
              >
                Create CTI Archive
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='#101828'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke={mouseEnter ? '#fff' : '#101828'}
                  className='w-6 h-6 mr-2 ml-2'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M12 6v12m6-6H6' />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className='mx-4 overflow overflow-x-hidden overflow-y-hidden mt-[0px] '>
        <div className='grid grid-cols-1 gap-3 mt-3'>
          {datadetail.map((item: any, key: any) => (
            <div
              key={key}
              className='rounded-lg p-[24px] pb-[20px] bg-[#1D2939] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]'
            >
              <div style={{ marginBottom: '0' }}>
                <svg
                  width='32'
                  height='32'
                  viewBox='0 0 30 30'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  dangerouslySetInnerHTML={{ __html: item.path }}
                ></svg>
              </div>
              <h4 className='text-Base-White font-inter mt-2 text-white text-xl font-semibold leading-7.5"'>
                {' '}
                {item.name}
              </h4>
              <p
                className='mt-1  text-base text-Base-White font-inter text-md font-normal leading-6'
                style={{ color: '#fff' }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Overview
