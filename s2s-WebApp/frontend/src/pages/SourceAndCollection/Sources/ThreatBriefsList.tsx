import React, { useState } from 'react'
import ThreatBriefsCards from './ThreatBriefsCards'
import useWindowResolution from '../../../layouts/Dashboard/useWindowResolution'
import ThreatBriefsTable from './ThreatBriefsTable'
import moment from 'moment'

function ThreatBriefsList({ threatbriefslist }: any) {
  const { height } = useWindowResolution()
  const dynamicHeight = Math.max(300, height - 300)
  const [activeList, setActiveList] = useState('list' as any)
  const [search, setSearch] = useState<string>('')

  const handletabchange = (text: any) => {
    setActiveList(text)
    sessionStorage.setItem('tbactiveTab', JSON.stringify(text))
  }

  const tabitem: any = JSON.parse(sessionStorage.getItem('tbactiveTab') as any)
  const sortedData: any =
    threatbriefslist?.length > 0
      ? threatbriefslist
          ?.sort(
            (a: any, b: any) =>
              new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime(),
          )
          ?.filter(
            (item: any) =>
              item?.name?.toLowerCase().includes(search?.toLowerCase()) ||
              item?.intelCount?.data?.SIGMA?.toString().includes(search) ||
              item?.intelCount?.data?.CTI?.toString().includes(search) ||
              item?.intelCount?.data?.MALWARE?.toString().includes(search) ||
              moment(item?.creationTime).format('DD-MMM HH:mm').toLowerCase() ===
                moment(search).format('DD-MMM HH:mm')?.toLowerCase() ||
              moment(item?.creationTime).format('DD MMM').toLowerCase() ===
                moment(search).format('DD MMM')?.toLowerCase() ||
              moment(item?.creationTime).format('HH:mm').toLowerCase() ===
                moment(search).format('HH:mm')?.toLowerCase() ||
              moment(item?.creationTime).format('HH').toLowerCase() ===
                moment(search).format('HH')?.toLowerCase(),
          )
      : []
  const [sortedDataList, setSortedDataList] = useState([] as any)
  return (
    <div className='w-full'>
      <div className='mb-6 flex items-center justify-between gap-4 w-full max-md:flex-wrap'>
        <div className='max-md:w-full'>
          <div className='flex items-center space-x-2 bg-dark max-md:w-full'>
            <div className='flex items-center box-border bg-[#48576c] p-2 rounded-lg border border-[#6e7580] w-[376px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] max-md:w-full'>
              <input
                type='text'
                placeholder='Search'
                className='bg-[#48576c] outline-none rounded-l-lg text-[#fff] w-full  placeholder-[#fff]'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='none'
              >
                <path
                  d='M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z'
                  stroke='white'
                  stroke-width='1.66667'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                />
              </svg>
            </div>
          </div>
        </div>

        <div className='flex gap-4 ml-auto'>
          <div className='flex'>
            <button
              className={`${
                (tabitem ? tabitem : activeList) == 'list' ? 'bg-[#48576C]' : 'bg-[#0F121B]'
              } text-white py-1 px-4 rounded-l-lg border border-[#48576C] font-inter font-semibold`}
              onClick={() => handletabchange('list')}
            >
              LIST
            </button>
            <button
              className={`${
                (tabitem ? tabitem : activeList) == 'grid' ? 'bg-[#48576C]' : 'bg-[#0F121B]'
              } text-white py-1 px-4 rounded-r-lg border border-[#48576C] font-inter font-semibold`}
              onClick={() => handletabchange('grid')}
            >
              GRID
            </button>
          </div>
        </div>
      </div>

      {(tabitem ? tabitem : activeList) == 'grid' ? (
        <div
          className='w-full text-white overflow-y-scroll scrollbar-hide'
          style={{ maxHeight: `calc(${dynamicHeight - 150}px)` }}
        >
          <div className='flex flex-col items-start justify-start gap-6'>
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'>
              {sortedData.map((card: any, index: number) => (
                <>
                  <ThreatBriefsCards key={index} cardlist={card} />
                </>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <ThreatBriefsTable
            threatbriefslist={sortedData}
            sortedDataList={sortedDataList}
            setSortedDataList={setSortedDataList}
            search={search}
          />
        </>
      )}
    </div>
  )
}

export default ThreatBriefsList
