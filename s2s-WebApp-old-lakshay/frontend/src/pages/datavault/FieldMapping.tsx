import React from 'react'
import CrowdStrikeSvg from '../../Svg/CrowdStrikeSvg'
import SplunkSvg from '../../Svg/SplunkSvg'
import { useNavigate } from 'react-router-dom'

function FieldMapping() {
  let fielddata = [
    {
      fieldname: 'SIEM',
      data: [
        {
          sourceName: 'Crowdstrike',
          integrationSourceType: 'EDR',
        },
        {
          sourceName: 'Feedly',
          integrationSourceType: 'IDS',
        },
        {
          sourceName: 'Splunk',
          integrationSourceType: 'SIEM',
        },
      ],
    },
    {
      fieldname: 'SIEM',
      data: [
        {
          sourceName: 'Crowdstrike',
          integrationSourceType: 'EDR',
        },
        {
          sourceName: 'Feedly',
          integrationSourceType: 'IDS',
        },
        {
          sourceName: 'Splunk',
          integrationSourceType: 'SIEM',
        },
      ],
    },
    {
      fieldname: 'IAM',
      data: [
        {
          sourceName: 'Crowdstrike',
          integrationSourceType: 'EDR',
        },
        {
          sourceName: 'Feedly',
          integrationSourceType: 'IDS',
        },
        {
          sourceName: 'Splunk',
          integrationSourceType: 'SIEM',
        },
      ],
    },
  ]

  const navigateTo = useNavigate()

  const handleConfigureClick = () => {
    navigateTo(`/app/fieldconnection`)
  }

  return (
    <div className='p-4 '>
      {fielddata?.map((value: any) => {
        return (
          <>
            <p className='ml-[1rem] mt-3'>{value.fieldname}</p>
            <div className='bg-[#0C111D]   lg:mr-5 lg:grid lg:grid-cols-3 lg:gap-4 lg:mt-3 lg:ml-3.5 lg:mr-3.5 lg:pt-3 grid grid-cols-1 gap-4 mt-3 ml-3.5 mr-3.5 md:pt-0 pt-32 text-white'>
              <div className='bg-[#1D2939]  rounded-lg text-white p-6 '>
                <div className='flex justify-between mt-2'>
                  <div>
                    <p className='bg-[#98A2B3] text-[#344054] rounded-2xl w-10 h-5 ps-[0.6rem] text-[12px]'>
                      {'EDR'}
                    </p>
                  </div>
                  <div>
                    <p className='border border-[#ABEFC6] rounded-xl text-[#067647] text-sm bg-[#ECFDF3] leading-2 font-intel  px-2'>
                      Connected
                    </p>
                  </div>
                </div>
                <div className='pt-2 flex justify-between'>
                  <div>
                    <CrowdStrikeSvg />
                  </div>
                  <div>
                    <p className='text-[#7F56D9] text-base mt-5 cursor-pointer'>Disconnect</p>
                  </div>
                </div>
                <div className='flex justify-between mt-1 '>
                  <div>
                    <p className='text-[#D0D5DD] mt-4 font-inter text-lg font-medium leading-7'>
                      Crowdstrike
                    </p>
                  </div>
                  <div
                    className='border flex p-2 justify-between rounded-lg cursor-pointer'
                    onClick={handleConfigureClick}
                  >
                    <div>
                      <p className='text-[#FFF] font-inter text-base font-medium leading-7'>
                        Configure
                      </p>
                    </div>
                    <div className='mt-1 ml-1'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='21'
                        height='20'
                        viewBox='0 0 21 20'
                        fill='none'
                      >
                        <path
                          d='M2.83337 6.66699L12.8334 6.66699M12.8334 6.66699C12.8334 8.0477 13.9527 9.16699 15.3334 9.16699C16.7141 9.16699 17.8334 8.0477 17.8334 6.66699C17.8334 5.28628 16.7141 4.16699 15.3334 4.16699C13.9527 4.16699 12.8334 5.28628 12.8334 6.66699ZM7.83337 13.3337L17.8334 13.3337M7.83337 13.3337C7.83337 14.7144 6.71409 15.8337 5.33337 15.8337C3.95266 15.8337 2.83337 14.7144 2.83337 13.3337C2.83337 11.9529 3.95266 10.8337 5.33337 10.8337C6.71409 10.8337 7.83337 11.9529 7.83337 13.3337Z'
                          stroke='white'
                          stroke-width='1.5'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className='bg-[#1D2939]  rounded-lg text-white p-5'>
                <div className='flex justify-between mt-2'>
                  <div>
                    <p className='bg-[#98A2B3] text-[#344054] rounded-2xl w-10 h-5 ps-[0.6rem] text-[12px]'>
                      {'IDS'}
                    </p>
                  </div>
                  <div>
                    <p className='border border-[#ABEFC6] rounded-xl text-[#067647] text-sm bg-[#ECFDF3] leading-2 font-intel  px-2'>
                      Connected
                    </p>
                  </div>
                </div>
                <div className='pt-2 flex justify-between'>
                  <div>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='72'
                      height='72'
                      viewBox='0 0 72 72'
                      version='1.1'
                    >
                      <path
                        d='M 24.040 29.459 C 13.751 39.784, 13.640 39.945, 15.463 41.959 C 16.479 43.082, 18.028 44, 18.905 44 C 20.820 44, 41 25.323, 41 23.551 C 41 21.919, 37.731 19, 35.903 19 C 35.112 19, 29.774 23.707, 24.040 29.459 M 28.687 41.812 C 22.177 48.372, 21.996 48.686, 23.792 50.312 C 26.915 53.138, 29.305 52.261, 35.477 46.023 L 41.392 40.046 39.022 37.523 C 37.718 36.135, 36.380 35, 36.049 35 C 35.717 35, 32.404 38.065, 28.687 41.812 M 33.010 54.490 C 30.739 56.907, 30.724 57.038, 32.491 58.990 C 33.491 60.095, 35.070 61, 36 61 C 36.930 61, 38.509 60.095, 39.509 58.990 C 41.276 57.038, 41.261 56.907, 38.990 54.490 C 37.704 53.120, 36.358 52, 36 52 C 35.642 52, 34.296 53.120, 33.010 54.490'
                        stroke='none'
                        fill='#F5F9F6'
                        fill-rule='evenodd'
                      />
                      <path
                        d='M 16.319 20.210 C -4.787 41.176, -4.555 39.099, 12.339 55.801 L 24.678 68 35.589 67.985 C 41.590 67.976, 47.088 67.596, 47.807 67.140 C 48.526 66.684, 54.489 60.989, 61.057 54.485 C 72.349 43.303, 73 42.440, 73 38.662 C 73 36.465, 72.690 34.977, 72.311 35.356 C 71.932 35.735, 64.363 28.835, 55.492 20.023 C 41.074 5.700, 39.006 4, 36 4 C 32.992 4, 30.914 5.712, 16.319 20.210 M 24.040 29.459 C 13.751 39.784, 13.640 39.945, 15.463 41.959 C 16.479 43.082, 18.028 44, 18.905 44 C 20.820 44, 41 25.323, 41 23.551 C 41 21.919, 37.731 19, 35.903 19 C 35.112 19, 29.774 23.707, 24.040 29.459 M 28.687 41.812 C 22.177 48.372, 21.996 48.686, 23.792 50.312 C 26.915 53.138, 29.305 52.261, 35.477 46.023 L 41.392 40.046 39.022 37.523 C 37.718 36.135, 36.380 35, 36.049 35 C 35.717 35, 32.404 38.065, 28.687 41.812 M 0.272 40 C 0.272 42.475, 0.467 43.487, 0.706 42.250 C 0.944 41.013, 0.944 38.987, 0.706 37.750 C 0.467 36.513, 0.272 37.525, 0.272 40 M 33.010 54.490 C 30.739 56.907, 30.724 57.038, 32.491 58.990 C 33.491 60.095, 35.070 61, 36 61 C 36.930 61, 38.509 60.095, 39.509 58.990 C 41.276 57.038, 41.261 56.907, 38.990 54.490 C 37.704 53.120, 36.358 52, 36 52 C 35.642 52, 34.296 53.120, 33.010 54.490'
                        stroke='none'
                        fill='#2DB44D'
                        fill-rule='evenodd'
                      />
                    </svg>
                  </div>
                  <div>
                    <p className='text-[#7F56D9] text-base mt-5 cursor-pointer'>Disconnect</p>
                  </div>
                </div>
                <div className='flex justify-between mt-1 '>
                  <div>
                    <p className='text-gray-300 mt-4 font-inter text-lg font-medium leading-7'>
                      Feedly
                    </p>
                  </div>
                  <div className='border flex p-2 justify-between rounded-lg cursor-pointer'>
                    <div>
                      <p className='text-[#FFF] font-inter text-lg font-medium leading-7'>
                        Configure
                      </p>
                    </div>
                    <div className='mt-1 ml-1'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='21'
                        height='20'
                        viewBox='0 0 21 20'
                        fill='none'
                      >
                        <path
                          d='M2.83337 6.66699L12.8334 6.66699M12.8334 6.66699C12.8334 8.0477 13.9527 9.16699 15.3334 9.16699C16.7141 9.16699 17.8334 8.0477 17.8334 6.66699C17.8334 5.28628 16.7141 4.16699 15.3334 4.16699C13.9527 4.16699 12.8334 5.28628 12.8334 6.66699ZM7.83337 13.3337L17.8334 13.3337M7.83337 13.3337C7.83337 14.7144 6.71409 15.8337 5.33337 15.8337C3.95266 15.8337 2.83337 14.7144 2.83337 13.3337C2.83337 11.9529 3.95266 10.8337 5.33337 10.8337C6.71409 10.8337 7.83337 11.9529 7.83337 13.3337Z'
                          stroke='white'
                          stroke-width='1.5'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className='bg-[#1D2939]  rounded-lg text-white p-5'>
                <div className='flex justify-between mt-2'>
                  <div>
                    <p className='bg-[#98A2B3] text-[#344054] rounded-2xl w-10 h-5 ps-[0.4rem] text-[12px]'>
                      {'SIEM'}
                    </p>
                  </div>
                  <div>
                    <p className='border border-[#FEDF89] rounded-xl text-[#B54708] text-sm bg-[#FFFAEB] leading-2 font-intel  px-2'>
                      Coming soon...
                    </p>
                  </div>
                </div>
                <div className='pt-2 flex justify-between'>
                  <div>
                    <SplunkSvg />
                  </div>
                  <div>
                    <p className='text-[#7F56D9] text-base mt-5 cursor-pointer'>Disconnect</p>
                  </div>
                </div>
                <div className='flex justify-between mt-1 '>
                  <div>
                    <p className='text-gray-300 mt-4 font-inter text-lg font-medium leading-7'>
                      Splunk
                    </p>
                  </div>
                  <div className='border opacity-50 flex p-2 justify-between rounded-lg cursor-pointer'>
                    <div>
                      <p className='text-[#FFF] font-inter text-lg font-medium leading-7'>
                        Configure
                      </p>
                    </div>
                    <div className='mt-1 ml-1'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='21'
                        height='20'
                        viewBox='0 0 21 20'
                        fill='none'
                      >
                        <path
                          d='M2.83337 6.66699L12.8334 6.66699M12.8334 6.66699C12.8334 8.0477 13.9527 9.16699 15.3334 9.16699C16.7141 9.16699 17.8334 8.0477 17.8334 6.66699C17.8334 5.28628 16.7141 4.16699 15.3334 4.16699C13.9527 4.16699 12.8334 5.28628 12.8334 6.66699ZM7.83337 13.3337L17.8334 13.3337M7.83337 13.3337C7.83337 14.7144 6.71409 15.8337 5.33337 15.8337C3.95266 15.8337 2.83337 14.7144 2.83337 13.3337C2.83337 11.9529 3.95266 10.8337 5.33337 10.8337C6.71409 10.8337 7.83337 11.9529 7.83337 13.3337Z'
                          stroke='white'
                          stroke-width='1.5'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      })}
    </div>
  )
}

export default FieldMapping
