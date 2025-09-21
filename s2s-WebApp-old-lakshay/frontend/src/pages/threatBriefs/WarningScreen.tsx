import { makeStyles } from '@mui/styles'

const WarningScreen = ({ setwarnPopup }: any) => {
  const useStyles = makeStyles((theme: any) => ({
    '@keyframes pingSlow': {
      '75%, 100%': {
        transform: 'scale(2)',
        opacity: 0,
      },
    },
    animatePingSlow: {
      animation: '$pingSlow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
    },
  }))
  const classes = useStyles({ height: 100 })
  return (
    <div>
      <div className='justify-center backdrop-blur-sm items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none p-35'>
        <div className='md:text-sm 2xl:text-lg relative w-auto my-6 mx-auto w-2/5'>
          <div className='md:text-sm 2xl:text-lg border-0 rounded-lg shadow-lg relative flex flex-col w-[400px] h-[260px] bg-white outline-none focus:outline-none text-[#000]'>
            <div className='p-[24px]'>
              <div className='flex justify-between'>
                <div className={`p-[7px] rounded-[50px] bg-[#FFFAEB]`}>
                  <div className='p-[7px] rounded-[50px] bg-[#FEF0C7] '>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='23'
                      height='22'
                      viewBox='0 0 23 22'
                      fill='none'
                    >
                      <path
                        d='M11.5 7V11M11.5 15H11.51M21.5 11C21.5 16.5228 17.0228 21 11.5 21C5.97715 21 1.5 16.5228 1.5 11C1.5 5.47715 5.97715 1 11.5 1C17.0228 1 21.5 5.47715 21.5 11Z'
                        stroke='#DC6803'
                        stroke-width='2'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </svg>
                  </div>
                </div>
                <div
                  className='cursor-pointer'
                  onClick={() => {
                    setwarnPopup(false)
                  }}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='15'
                    height='14'
                    viewBox='0 0 15 14'
                    fill='none'
                  >
                    <path
                      d='M13.5 1L1.5 13M1.5 1L13.5 13'
                      stroke='#98A2B3'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                </div>
              </div>
              <div className='pt-[16px]'>
                <p className='text-lg font-semibold leading-[28px] text-gray-900 font-inter'>
                  Warning
                </p>
                <p className='text-sm font-normal leading-[20px] text-gray-600 font-inter'>
                  You have not executed a hunt. Would you like to continue by executing a hunt?
                </p>
              </div>

              <div className='grid grid-cols-2 gap-4 pt-[32px]'>
                <div>
                  <button
                    type='button'
                    className='text-base font-medium border py-[8px] leading-6 text-gray-700 font-inter w-full bg-white-900 rounded-lg text-center'
                  >
                    Go Back
                  </button>
                </div>
                <div>
                  <button
                    type='button'
                    className='text-base font-medium  py-[8px] leading-6 text-white font-inter w-full bg-[#EE7103] rounded-lg text-center'
                  >
                    Execute a Hunt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WarningScreen
