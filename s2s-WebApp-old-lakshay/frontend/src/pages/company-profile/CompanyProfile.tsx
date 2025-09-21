import { MenuItem, Select } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import {
  companyProfilePost,
  getCompanyAllProfile,
  getCompanyProfile,
} from '../../redux/nodes/companyProfile/action'
import Swal from 'sweetalert2'

const CompanyProfile = () => {
  const {
    handleSubmit,
    formState: { errors },
  } = useForm()
  const dispatch = useDispatch()

  const [companydomain, setcompanydomain] = useState(null as any)
  const [companyindustries, setcompanyindustries] = useState(null as any)
  const [companycontients, setcompanycontients] = useState(null as any)
  const [companycountry, setcompanycountry] = useState(null as any)
  const [companyAll, setCompanyAll] = useState(null as any)

  const companyNames = [
    'Company Domains',
    'Company Industries',
    'Company Continents',
    'Company Countries',
  ]
  const onSubmit = (data: any) => {
    let postValue: any = {
      companyDomain: companydomain,
      companyIndustry: companyindustries,
      companyContinent: companycontients,
      companyCountry: companycountry,
      companyMeta: null,
    }
    dispatch(companyProfilePost(postValue) as any).then((response: any) => {
      if (response.type === 'COMPANY_PROFILE_SUCCESS') {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Company Profile Add Successfully',
          color: '#000',
          width: 400,
          timer: 2000,
          showConfirmButton: false,
        })
        fetchdata()
      }
    })
  }
  useEffect(() => {
    fetchdata()
  }, [])

  const fetchdata = () => {
    dispatch(getCompanyProfile() as any).then((get_response: any) => {
      setcompanydomain(get_response?.payload?.companyDomain)
      setcompanyindustries(get_response?.payload?.companyIndustry)
      setcompanycountry(get_response?.payload?.companyCountry)
      setcompanycontients(get_response?.payload?.companyContinent)
    })
    dispatch(getCompanyAllProfile() as any).then((get_response: any) => {
      if (get_response?.type == 'COMPANY_PROFILE_ALL_GET_SUCCESS') {
        setCompanyAll(get_response?.payload)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='p-[32px] h-[88vh]'>
        {companyNames.map((companyName, index) => (
          <div
            key={index}
            className='flex justify-between mb-3 items-center max-sm:flex-col gap-3'
            style={{
              padding: '16px 16px 16px 24px',
              borderRadius: '12px',
              background: '#1D2939',
            }}
          >
            <div className='flex items-center text-center'>
              <span>{companyName}</span>
            </div>
            <div className='relative w-[320px] max-md:w-[50%] max-sm:w-full'>
              {index === 0 ? (
                <Select
                  value={companydomain}
                  onChange={(e) => setcompanydomain(e.target.value)}
                  fullWidth
                  displayEmpty
                  sx={{
                    display: 'flex',
                    height: '36px',
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    background: 'white',
                    borderRadius: '8px 8px 8px 8px',
                    width: '100%',
                  }}
                >
                  {companyAll?.companyDomains && companyAll.companyDomains.length > 0 ? (
                    companyAll.companyDomains
                      .sort((a: string, b: string) => a.localeCompare(b))
                      .map((item: string, index: number) => (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      ))
                  ) : <MenuItem key={index} value={''}>
                    {'No Data'}
                  </MenuItem>}
                </Select>
              ) : index === 1 ? (
                <Select
                  value={companyindustries}
                  onChange={(e) => setcompanyindustries(e.target.value)}
                  fullWidth
                  displayEmpty
                  sx={{
                    display: 'flex',
                    height: '36px',
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    background: 'white',
                    borderRadius: '8px 8px 8px 8px',
                    width: '100%',
                  }}
                >
                  {companyAll?.companyIndustries && companyAll.companyIndustries.length > 0 ? (
                    companyAll.companyIndustries
                      .sort((a: string, b: string) => a.localeCompare(b))
                      .map((item: string, index: number) => (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      ))
                  ) : <MenuItem key={index} value={''}>
                    {'No Data'}
                  </MenuItem>}
                </Select>
              ) : index === 2 ? (
                <Select
                  value={companycontients}
                  onChange={(e) => setcompanycontients(e.target.value)}
                  fullWidth
                  sx={{
                    display: 'flex',
                    height: '36px',
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    background: 'white',
                    borderRadius: '8px 8px 8px 8px',
                    width: '100%',
                  }}
                >
                  {companyAll?.companyContinents && companyAll.companyContinents.length > 0 ? (
                    companyAll.companyContinents
                      .sort((a: string, b: string) => a.localeCompare(b))
                      .map((item: string, index: number) => (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      ))
                  ) : <MenuItem key={index} value={''}>
                    {'No Data'}
                  </MenuItem>}
                </Select>
              ) : index === 3 ? (
                <Select
                  value={companycountry}
                  onChange={(e) => setcompanycountry(e.target.value)}
                  fullWidth
                  sx={{
                    display: 'flex',
                    height: '36px',
                    width: '100%',
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    background: 'white',
                    borderRadius: '8px 8px 8px 8px',
                  }}
                >
                  {companyAll?.companyCountries && companyAll.companyCountries.length > 0 ? (
                    companyAll.companyCountries
                      .sort((a: string, b: string) => a.localeCompare(b))
                      .map((item: string, index: number) => (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      ))
                  ) : <MenuItem key={index} value={''}>
                    {'No Data'}
                  </MenuItem>}
                </Select>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <div>
        <button className='hidden' type='submit' id='companyProfile'>
          Submit
        </button>
      </div>
    </form>
  )
}

export default CompanyProfile
