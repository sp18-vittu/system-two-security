import { useState } from 'react'
import RepositoryGlobalSearch from '../datavault/RepositoryGlobalSearch'
import RepositoryLists from './RepositoryLists'

export default function Repositoryintropage() {
  const [tabValue, setTabValue] = useState(1 as any)

  const handleTabChange = (val: number) => {
    setTabValue(val)
  }

  return (
    <div className='p-[32px]'>
      <div className='w-[50%] flex justify-start items-center gap-[12px]'>
        <span
          className={`font-medium text-sm cursor-pointer ${
            tabValue === 1 ? 'text-[#fff] border-b-2 border-white' : 'text-[#98A2B3]'
          }`}
          onClick={() => handleTabChange(1)}
        >
          Repositories
        </span>

        <span
          className={`font-medium text-sm cursor-pointer ${
            tabValue === 3 ? 'text-[#fff] border-b-2 border-white' : 'text-[#98A2B3]'
          }`}
          onClick={() => handleTabChange(3)}
        >
          All CTI Reports
        </span>
      </div>

      {tabValue === 1 && (
        <>
          <RepositoryLists />
        </>
      )}
      {tabValue === 2 && <></>}
      {tabValue === 3 && (
        <>
          <RepositoryGlobalSearch />
        </>
      )}
    </div>
  )
}
