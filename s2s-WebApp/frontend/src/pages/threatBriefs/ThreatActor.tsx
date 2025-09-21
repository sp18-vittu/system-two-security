import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { downloadThreatAODPackage } from '../../redux/nodes/threatBriefs/action'
import ThreatBrief from './ThreatBrief'
import ThreatSigma from './ThreatSigma'
import HuntPlan from './HuntPlan'
import { useData } from '../../layouts/shared/DataProvider'
import Swal from 'sweetalert2'

const ThreatActor = () => {
  const { id: paramsId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  React.useEffect(() => {
    if (paramsId) {
      if (isNaN(Number(paramsId))) {
        navigate('/app/landingpage')
        sessionStorage.setItem('active', 'overview')
      }
    }
  }, [paramsId, navigate])

  const [tabValue, setTabValue] = useState(1 as any)
  const { HuntToaster, setHuntToaster, ResultToaster, setResultToaster, Faildname }: any = useData()

  const handleTabChange = (val: number) => {
    if (val != 3) {
      setResultToaster(false)
      setHuntToaster(false)
    }
    setTabValue(val)
  }
  const closeTosterHunt = () => {
    setHuntToaster(false)
  }
  const closeTosterResult = () => {
    setResultToaster(false)
  }

  const downloadPackage = () => {
    dispatch(downloadThreatAODPackage(paramsId) as any)
      .then((response: any) => {
        if (response.type === 'GET_THREATBRIEF_AOD_PACKAGE_SUCCESS') {
          var reader = new FileReader()
          reader.onload = function (e) {
            const blob = new Blob([response.payload], { type: 'application/zip' })
            const fileURL = URL.createObjectURL(blob)

            const downloadLink = document.createElement('a')
            downloadLink.href = fileURL
            downloadLink.download = `S2S_${'ThreatBrief'}.zip`
            downloadLink.click()
            URL.revokeObjectURL(fileURL)
          }
          reader.readAsDataURL(response.payload)
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Download Successfully ',
            color: '#000',
            width: 400,
            timer: 2000,
            showConfirmButton: false,
          })
        }
      })
      .catch((err: any) => console.log('err', err))
  }

  useEffect(() => {
    setTabValue(1)
    setResultToaster(false)
    setHuntToaster(false)
  }, [paramsId])

  return (
    <div className='p-[32px]'>
      <div className='flex justify-between items-center h-12 w-full'>
        <div className=' flex  items-center w-full gap-[14px]'>
          <span
            className={`font-medium text-sm cursor-pointer ${
              tabValue === 1 ? 'text-[#fff] border-b-[3px] border-white' : 'text-[#98A2B3]'
            }`}
            onClick={() => handleTabChange(1)}
          >
            Threat Brief
          </span>
          <span
            className={`font-medium text-sm cursor-pointer ${
              tabValue === 2 ? 'text-[#fff] border-b-[3px] border-white' : 'text-[#98A2B3]'
            }`}
            onClick={() => handleTabChange(2)}
          >
            Sigma Files
          </span>
          {
            <span
              className={`font-medium text-sm cursor-pointer ${
                tabValue === 3 ? 'text-[#fff] border-b-[3px] border-white' : 'text-[#98A2B3]'
              }`}
              onClick={() => handleTabChange(3)}
            >
              Hunt
            </span>
          }
        </div>
        {HuntToaster && tabValue == 3 && (
          <div className='flex w-full h-18 border bg-white rounded-lg p-[16px] mb-2 justify-between'>
            <div className='flex'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='mb-1 mt-1'
                width='24'
                height='24'
                viewBox='0 0 20 20'
                fill='none'
              >
                <path
                  d='M9.99984 6.66675V10.0001M9.99984 13.3334H10.0082M18.3332 10.0001C18.3332 14.6025 14.6022 18.3334 9.99984 18.3334C5.39746 18.3334 1.6665 14.6025 1.6665 10.0001C1.6665 5.39771 5.39746 1.66675 9.99984 1.66675C14.6022 1.66675 18.3332 5.39771 18.3332 10.0001Z'
                  stroke='#D92D20'
                  stroke-width='1.66667'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                />
              </svg>
              <div className='pl-2'>
                <p className='font-inter text-base text-[#344054] font-semibold leading-base'>
                  {Faildname}
                </p>
              </div>
            </div>
            <div className=''>
              <svg
                onClick={closeTosterHunt}
                xmlns='http://www.w3.org/2000/svg'
                className='cursor-pointer'
                width='12'
                height='12'
                viewBox='0 0 12 12'
                fill='none'
              >
                <path
                  d='M11 1L1 11M1 1L11 11'
                  stroke='#98A2B3'
                  stroke-width='1.66667'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                />
              </svg>
            </div>
          </div>
        )}

        {ResultToaster && tabValue == 3 && (
          <div className='flex w-full h-12 border bg-white rounded-lg p-[16px] mb-2 justify-between'>
            <div className='flex'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='17'
                height='20'
                viewBox='0 0 17 20'
                fill='none'
              >
                <path
                  d='M14.6667 10.4167V5.66675C14.6667 4.26662 14.6667 3.56655 14.3942 3.03177C14.1545 2.56137 13.7721 2.17892 13.3017 1.93923C12.7669 1.66675 12.0668 1.66675 10.6667 1.66675H5.33337C3.93324 1.66675 3.23318 1.66675 2.6984 1.93923C2.22799 2.17892 1.84554 2.56137 1.60586 3.03177C1.33337 3.56655 1.33337 4.26662 1.33337 5.66675V14.3334C1.33337 15.7335 1.33337 16.4336 1.60586 16.9684C1.84554 17.4388 2.22799 17.8212 2.6984 18.0609C3.23318 18.3334 3.93324 18.3334 5.33337 18.3334H8.00004M9.66671 9.16675H4.66671M6.33337 12.5001H4.66671M11.3334 5.83341H4.66671M10.0834 15.8334L11.75 17.5001L15.5 13.7501'
                  stroke='#7F56D9'
                  stroke-width='1.66667'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                />
              </svg>
              <div className='pl-[16px] mt-[-3px]'>
                <p className='font-inter text-base text-[#344054] font-semibold leading-base'>
                  Showing result of your last execution
                </p>
              </div>
            </div>
            <div className=''>
              <svg
                onClick={closeTosterResult}
                xmlns='http://www.w3.org/2000/svg'
                className='cursor-pointer'
                width='12'
                height='12'
                viewBox='0 0 12 12'
                fill='none'
              >
                <path
                  d='M11 1L1 11M1 1L11 11'
                  stroke='#98A2B3'
                  stroke-width='1.66667'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                />
              </svg>
            </div>
          </div>
        )}
        <div className=' flex items-end justify-end  w-full gap-[16px]'>
          {tabValue === 1 || tabValue === 2 ? (
            <>
              <button
                type='button'
                onClick={downloadPackage}
                className='text-[#344054] bg-[#fff] hover:bg-[#6941c6] hover:text-[#fff] px-[18px] py-[8px] rounded-lg flex justify-center items-center gap-[8px] group' // Add group class here
              >
                <span>Download Hunt Package</span>
                <span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='18'
                    viewBox='0 0 20 18'
                    fill='none'
                  >
                    <path
                      d='M6.66663 13.1667L9.99996 16.5M9.99996 16.5L13.3333 13.1667M9.99996 16.5V9M16.6666 12.9524C17.6845 12.1117 18.3333 10.8399 18.3333 9.41667C18.3333 6.88536 16.2813 4.83333 13.75 4.83333C13.5679 4.83333 13.3975 4.73833 13.3051 4.58145C12.2183 2.73736 10.212 1.5 7.91663 1.5C4.46485 1.5 1.66663 4.29822 1.66663 7.75C1.66663 9.47175 2.36283 11.0309 3.48908 12.1613'
                      className='stroke-[#344054] group-hover:stroke-white transition-colors duration-200' // Changes color on hover
                      strokeWidth='1.66667'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </span>
              </button>
            </>
          ) : null}
        </div>
      </div>
      {tabValue === 1 ? (
        <>
          <ThreatBrief />
        </>
      ) : tabValue === 2 ? (
        <>
          <ThreatSigma />
        </>
      ) : (
        tabValue === 3 && (
          <>
            <HuntPlan />
          </>
        )
      )}
    </div>
  )
}

export default ThreatActor
