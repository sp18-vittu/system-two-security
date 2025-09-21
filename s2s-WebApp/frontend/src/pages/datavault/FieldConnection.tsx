import React, { useState } from 'react'
import FieldMappingTab from './FieldMappingTab'
import Feedlyform from './Feedlyform'
import { useLocation } from 'react-router-dom'
import Splunkform from './Splunkform'
import Swal from 'sweetalert2'
function FieldConnection() {
  const location = useLocation()
  const [tabValue, setTabValue] = useState(1 as any)

  const handleTabChange = (val: number) => {
    if (location?.state?.length > 0) {
      setTabValue(val)
      sessionStorage.setItem('tabs', val.toLocaleString())
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Please Save The Value',
        color: '#000',
        width: 400,
        timer: 2000,
        showConfirmButton: false,
      })
    }
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
          Connection
        </span>
        {location?.state && location?.state?.length > 0 && (
          <>
            {location?.state[1]?.integ?.integrationSourceType == 'SIEM' && (
              <span
                className={`font-medium text-sm cursor-pointer ${
                  tabValue === 2 ? 'text-[#fff] border-b-2 border-white' : 'text-[#98A2B3]'
                }`}
                onClick={() => handleTabChange(2)}
              >
                Field Mapping
              </span>
            )}
          </>
        )}
      </div>

      {tabValue === 1 ? (
        //
        <>
          {location.pathname == '/app/feedlyform' && <Feedlyform />}
          {location.pathname == '/app/splunkform' && <Splunkform />}
        </>
      ) : (
        <>
          <FieldMappingTab integrations={location.state} />
        </>
      )}
    </div>
  )
}

export default FieldConnection
