import { makeStyles } from '@mui/styles'
import React from 'react'

const useStyles = makeStyles((theme: any) => ({
  listContainer: {
    height: '95vh',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '7px',
      height: '7px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#0C111D',
      margin: '40px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#1D2939',
    },
  },
}))

const HuntDrawer = ({ showdrawer, setshowdrawer }: any) => {
  const classes = useStyles({ height: 100 })
  const huntdata = [
    {
      name: 'Processing',
      progress: '90%',
    },
    {
      name: 'Finishing',
      progress: '100%',
    },
    {
      name: 'Results',
      progress: '80%',
    },
    {
      name: 'No Results',
      progress: '20%',
    },
    {
      name: 'No Results',
      progress: '0%',
    },
  ]

  const querydata = [
    {
      name: 'Query Progress',
      progress: '50%',
    },
    {
      name: 'Total Queries Executed',
      progress: '39',
    },
    {
      name: 'Likely Attack Timeframe',
      progress: '100',
    },
    {
      name: 'Follow Attack Sequence',
      progress: '20',
    },
    {
      name: 'Total Results',
      progress: '532',
    },
  ]

  return (
    <div>
      <div
        className={`bg-[#1D2939] fixed right-0 top-[80px] h-screen w-[330px] transition-all duration-300 ease-in z-50 ${
          showdrawer ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='relative'>
          <div
            onClick={(e) => {
              e.stopPropagation()
              setshowdrawer(!showdrawer)
            }}
            className='absolute top-[2rem] left-[-28px] cursor-pointer bg-[#054D80] flex items-center rounded-l-lg w-[28px] h-[58px] text-4xl'
          >
            <button type='button' className='flex justify-center'>
              {showdrawer != false ? (
                <svg
                  className='pl-2'
                  xmlns='http://www.w3.org/2000/svg'
                  width='18'
                  height='14'
                  viewBox='0 0 8 14'
                  fill='none'
                >
                  <path
                    d='M1 13L7 7L1 1'
                    stroke='white'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              ) : (
                <svg
                  className='ml-1 rotate-180'
                  xmlns='http://www.w3.org/2000/svg'
                  width='18'
                  height='14'
                  viewBox='0 0 8 14'
                  fill='none'
                >
                  <path
                    d='M1 13L7 7L1 1'
                    stroke='white'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              )}
            </button>
          </div>
          <div className={`p-[24px] ${classes.listContainer}`} onClick={(e) => e.stopPropagation()}>
            <p className='text-sm text-[#FFF] text-center font-medium leading-4'>Overview</p>
            <h1 className='text-sm text-[#FFF] font-medium leading-4 mt-1'>Total Hunt Time:</h1>
            {huntdata?.length > 0 &&
              huntdata?.map((data: any) => {
                return (
                  <div className='flex self-stretch  mt-2 h-3.5 justify-between'>
                    <div className='flex gap-3'>
                      {data.progress === '90%' ? (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='14'
                          height='14'
                          viewBox='0 0 14 14'
                          fill='none'
                        >
                          <circle cx='7' cy='7' r='7' fill='#475467' />
                        </svg>
                      ) : data.progress === '100%' ? (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='14'
                          height='14'
                          viewBox='0 0 14 14'
                          fill='none'
                        >
                          <circle cx='7' cy='7' r='7' fill='#079455' />
                        </svg>
                      ) : data.progress === '80%' ? (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='14'
                          height='14'
                          viewBox='0 0 14 14'
                          fill='none'
                        >
                          <circle cx='7' cy='7' r='7' fill='#0086C9' />
                        </svg>
                      ) : data.progress === '20%' ? (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='14'
                          height='14'
                          viewBox='0 0 14 14'
                          fill='none'
                        >
                          <circle cx='7' cy='7' r='7' fill='#6938EF' />
                        </svg>
                      ) : data.progress === '0%' ? (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='14'
                          height='14'
                          viewBox='0 0 14 14'
                          fill='none'
                        >
                          <circle cx='7' cy='7' r='7' fill='#D92D20' />
                        </svg>
                      ) : null}
                      <p className='text-[#FFF] text-sm font-medium leading-4'>{data.name}</p>
                    </div>
                    <p className='text-[#FFF] text-sm font-medium leading-4'>{data.progress}</p>
                  </div>
                )
              })}
            <div>
              <br />
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='284'
                height='2'
                viewBox='0 0 274 2'
                fill='none'
              >
                <path d='M1 1H273' stroke='#667085' stroke-linecap='round' />
              </svg>
            </div>
            <br />
            <p className='text-sm text-[#FFF] text-center font-medium leading-4'>Statistics</p>
            {querydata?.map((value: any) => {
              return (
                <div className='flex self-stretch  mt-2 h-3.5 justify-between'>
                  <p className='text-[#FFF] text-sm font-medium leading-4'>{value.name}</p>
                  <p className='text-[#FFF] text-sm font-medium leading-4'>{value.progress}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HuntDrawer
