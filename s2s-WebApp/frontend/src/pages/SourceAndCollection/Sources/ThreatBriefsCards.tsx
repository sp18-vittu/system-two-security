import React from 'react'
import { useNavigate } from 'react-router-dom'
import TimeAgo from '../../SigmaFiles/TimeAgo'
import { styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material'

const ThreatBriefsCards = ({ cardlist }: any) => {
  const navigateTo = useNavigate()
  const onNaviaget = (item: any) => {
    navigateTo(`/app/insightspages/${item?.id}`, {
      state: { title: item?.name, paramsdata: 'insite', vaultId: item?.id },
    })
    sessionStorage.setItem('threat', JSON.stringify(item))
  }

  const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(() => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: '#fff',
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#fff',
      color: '#000',
      width: '600px', // Set the width of the tooltip
      maxWidth: 'none', // Ensure the tooltip doesn't auto-shrink
      textAlign: 'center',
      marginLeft: '100px',
    },
  }))

  return (
    <div
      className='flex-1 bg-gray-900 border border-[#3E4B5D]  rounded-[10px] overflow-hidden flex flex-col cursor-pointer w-full'
      onClick={() => onNaviaget(cardlist)}
    >
      <div className='flex flex-col items-start justify-start gap-2 p-4 md:p-6 w-full flex- bg-[#1D2939]'>
        <h2 className='text-white text-2xl font-semibold'>{cardlist?.name}</h2>
        <BootstrapTooltip title={cardlist?.summary}>
          <p className='text-gray-400 line-clamp-2'>
            {cardlist?.summary ? cardlist?.summary : 'No Summary'}
          </p>
        </BootstrapTooltip>
      </div>
      <div className='p-4 md:p-6 bg-[#101828] border-t border-[#3E4B5D] grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-3 gap-5'>
        <div className='flex flex-col gap-2 max-w-fit'>
          <p className='text-[#98A2B3]  text-base font-normal leading-5'>{'Rules'}</p>
          <p className='text-white  text-lg font-semibold leading-5'>
            {cardlist?.intelCount?.data?.SIGMA ? cardlist?.intelCount?.data?.SIGMA : 0}
          </p>
        </div>
        <div className='flex flex-col gap-2 max-w-fit'>
          <p className='text-[#98A2B3]  text-base font-normal leading-5'>{'CTI Reports'}</p>
          <p className='text-white  text-lg  font-semibold leading-5'>
            {cardlist?.intelCount?.data?.CTI ? cardlist?.intelCount?.data?.CTI : 0}
          </p>
        </div>
        <div className='flex flex-col gap-2 max-w-fit'>
          <p className='text-[#98A2B3]  text-base font-normal leading-5'>{'TTPs'}</p>
          <p className='text-white  text-lg  font-semibold leading-5'>
            {cardlist?.intelCount?.data?.TTPs ? cardlist?.intelCount?.data?.TTPs : 0}
          </p>
        </div>
        <div className='flex flex-col gap-2 max-w-fit'>
          <p className='text-[#98A2B3]  text-base font-normal leading-5'>{'IOCs'}</p>
          <p className='text-white  text-lg  font-semibold leading-5'>
            {cardlist?.intelCount?.data?.IOC ? cardlist?.intelCount?.data?.IOC : 0}
          </p>
        </div>
        <div className='flex flex-col gap-2 max-w-fit'>
          <p className='text-[#98A2B3]  text-base font-normal leading-5'>{'Malware'}</p>
          <p className='text-white  text-lg  font-semibold leading-5'>
            {cardlist?.intelCount?.data?.MALWARE ? cardlist?.intelCount?.data?.MALWARE : 0}
          </p>
        </div>
        <div className='flex flex-col gap-2 max-w-fit'>
          <p className='text-[#98A2B3]  text-base font-normal leading-5'>{'Last Seen'}</p>
          <p className='text-white  text-lg  font-semibold leading-5'>
            <TimeAgo createdAt={cardlist.creationTime} />
          </p>
        </div>
      </div>
    </div>
  )
}

export default ThreatBriefsCards
