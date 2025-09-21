import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import local from '../../utils/local'
import { deleteDataVault } from '../../redux/nodes/datavault/action'
import { useNavigate } from 'react-router-dom'
import { ChatHistoryjSONDetails } from '../../redux/nodes/chat/action'
import { useData } from '../../layouts/shared/DataProvider'
import EditIcon from '@mui/icons-material/Edit'
import DatavalutdeleteDilog from '../../components/Appbar/DatavalutdeleteDilog'
import Swal from 'sweetalert2'
import './RepositoryLists.css'
import CircularProgress from '@mui/material/CircularProgress'

export default function RepositoryLists() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { copyFiles }: any = useData()

  const [vaultList, setVaultList] = useState([] as any)
  const [confirmation, setConfirmation] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0 as any)
  const [isCtiDialogOpen, setCitDialogOpen] = useState(false)
  const [isCtiValue, setCitValue] = useState(null as any)
  const [isCtiIndex, setCitIndex] = useState(0 as any)
  const [isCtidelte, setCitDelete] = useState(null as any)
  const [isCtiloader, setCtiloader] = useState(false as any)
  const [searchValue, setSearch] = useState('' as any)

  const roleDto = local.getItem('auth')
  const role = JSON.parse(roleDto as any)
  const roleDescription = role?.user?.user
  const getroleName = roleDescription?.roleDTO

  const onCardview = (item: any, index: any) => {
    sessionStorage.setItem('vault', JSON.stringify(item))
    navigate(`/app/Repository/${item.id}`, { state: { valtName: item?.name } })
  }

  const handleDataVaultEdit = (item: any) => {
    navigate(`/app/addRepository/${item.id}`, { state: [{ selectedDataVault: item }] })
    sessionStorage.setItem('vault', JSON.stringify(item))
  }

  const handleDataVaultDelete = async (item: any, index: any) => {
    handleCTIOpen(item, index)
  }

  const handleCTIOpen = (data: any, index: any) => {
    setCitDialogOpen(true)
    setCitValue(data)
    setCitIndex(index)
  }

  const handleCTIclose = () => {
    setCitDialogOpen(false)
    setCitValue(null)
  }

  const remove = () => {
    setCtiloader(true)
    setCitDialogOpen(false)
    setCitDelete(isCtiValue)
  }

  useEffect(() => {
    CTIreload()
  }, [])

  const CTIreload = () => {
    dispatch(ChatHistoryjSONDetails() as any)
      .then((res: any) => {
        if (res?.payload?.length > 0) {
          const sortedData: any = res?.payload.sort(
            (a: any, b: any) =>
              new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime(),
          )
          setVaultList(sortedData)
          if (isCtiloader) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              color: '#000',
              title: `${`This Repository deleted successfully`}`,
              width: 600,
              timer: 1000,
              showConfirmButton: false,
            })
            setCtiloader(false)
          }
        }
      })
      .catch((error: any) => {
        console.log(error)
      })
  }

  const sortedData: any = vaultList.filter((item: any) =>
    item?.name?.toLowerCase().includes(searchValue?.toLowerCase()),
  )

  useEffect(() => {
    if (isCtidelte) {
      let remainingVault = vaultList.filter((vault: any) => vault?.id !== isCtidelte?.id)
      dispatch(deleteDataVault(isCtidelte.id) as any).then((res: any) => {
        if (res.type == 'DATAVAULT_DELETE_SUCCESS') {
          CTIreload()
          setConfirmation(false)
          setSelectedIndex(null)
          setCitDelete(null)

          sessionStorage.setItem('vault', JSON.stringify(remainingVault[isCtiIndex]))
        } else if (res.type == 'DATAVAULT_DELETE_FAILED') {
          setConfirmation(false)
          setSelectedIndex(null)
          setCitDelete(null)
          Swal.fire({
            position: 'center',
            icon: 'error',
            color: '#000',
            title: `${`You cannot delete this repository as it contains a CTI report.`}`,
            width: 600,
            timer: 1000,
            showConfirmButton: false,
          })
        }
      })
    }
    if (!isCtiDialogOpen) {
      setConfirmation(false)
      setSelectedIndex(null)
      setCitDelete(null)
    }
  }, [isCtidelte, isCtiDialogOpen])
  const dats: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

  return (
    <div className='mt-8'>
      <div className='flex items-center bg-[#fff] p-2 rounded-md mb-6 w-[376px]'>
        <input
          type='text'
          placeholder='Search'
          className='bg-[#fff] outline-none text-[#344054] w-full'
          value={searchValue}
          onChange={(e) => setSearch(e.target.value)}
        />
        <svg
          className='w-5 h-5 text-[#344054]'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.5 3 7.5 7.5 0 0116.5 16.65z'
          />
        </svg>
      </div>
      {isCtiloader && (
        <div className='flex items-center justify-center'>
          <CircularProgress size='3rem' sx={{ color: '#EE7103' }} />
        </div>
      )}
      {sortedData?.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-scroll max-h-[600px] scrollbar-hide'>
          <>
            {sortedData?.map((item: any, index: number) => {
              const [beforeWith] = item?.description.split(' with')
              return (
                <div className='bg-[#2B3A55] ' style={{ borderRadius: '12px' }}>
                  <div
                    onClick={() => onCardview(item, index)}
                    key={index}
                    className={`${`cursor-pointer bg-[#1D2939]`} relative rounded-lg  p-[16px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:bg-[#29374A]`}
                  >
                    <div className='flex justify-between items-center text-[#fff]'>
                      <span className='w-[300px] truncate'>
                        <p className='truncate text-lg font-semibold font-inter text-gray-400 font-bold'>
                          {item.name}
                        </p>
                      </span>
                      {getroleName?.roleName !== 'USER' && !item.global && (
                        <>
                          {(!confirmation || selectedIndex != index) && (
                            <>
                              <div className='flex gap-[10px]'>
                                <span
                                  className='cursor-pointer'
                                  onClick={(e) => {
                                    handleDataVaultEdit(item)
                                    e.stopPropagation()
                                  }}
                                >
                                  <EditIcon style={{ width: 18, height: 18, marginTop: -10 }} />
                                </span>
                                <span
                                  className=' cursor-pointer'
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setConfirmation(true)
                                    setSelectedIndex(index)
                                  }}
                                >
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='18'
                                    height='16'
                                    viewBox='0 0 20 20'
                                    fill={'none'}
                                  >
                                    <path
                                      d='M13.3333 5.0013V4.33464C13.3333 3.40121 13.3333 2.9345 13.1517 2.57798C12.9919 2.26438 12.7369 2.00941 12.4233 1.84962C12.0668 1.66797 11.6001 1.66797 10.6667 1.66797H9.33333C8.39991 1.66797 7.9332 1.66797 7.57668 1.84962C7.26308 2.00941 7.00811 2.26438 6.84832 2.57798C6.66667 2.9345 6.66667 3.40121 6.66667 4.33464V5.0013M8.33333 9.58464V13.7513M11.6667 9.58464V13.7513M2.5 5.0013H17.5M15.8333 5.0013V14.3346C15.8333 15.7348 15.8333 16.4348 15.5608 16.9696C15.3212 17.44 14.9387 17.8225 14.4683 18.0622C13.9335 18.3346 13.2335 18.3346 11.8333 18.3346H8.16667C6.76654 18.3346 6.06647 18.3346 5.53169 18.0622C5.06129 17.8225 4.67883 17.44 4.43915 16.9696C4.16667 16.4348 4.16667 15.7348 4.16667 14.3346V5.0013'
                                      stroke={'#fff'}
                                      stroke-width='1.66667'
                                      stroke-linecap='round'
                                      stroke-linejoin='round'
                                    />
                                  </svg>
                                </span>
                              </div>
                            </>
                          )}
                          {confirmation && selectedIndex == index && (
                            <>
                              <div className='flex gap-[10px]'>
                                <span
                                  className='cursor-pointer'
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setConfirmation(false)
                                    setSelectedIndex(null)
                                  }}
                                >
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 50 50'
                                    width='19px'
                                    height='19px'
                                  >
                                    <path
                                      fill='#fff'
                                      d='M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z'
                                    />
                                  </svg>
                                </span>
                                <span
                                  className='cursor-pointer'
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDataVaultDelete(item, index)
                                  }}
                                >
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 48 48'
                                    width='20px'
                                    height='20px'
                                  >
                                    <path
                                      fill='#fff'
                                      d='M40.6 12.1L17 35.7 7.4 26.1 4.6 29 17 41.3 43.4 14.9z'
                                    />
                                  </svg>
                                </span>
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>

                    <div
                      className={`mt-4 w-[200px] ${copyFiles && 'flex justify-between relative'}`}
                    >
                      <h5
                        className={`truncate ${
                          copyFiles && !item.global && 'w-[100px]'
                        } text-[#98A2B3] font-inter font-medium text-sm leading-5 text-gray-400 w-64`}
                      >
                        {item.description}
                      </h5>
                    </div>
                    <div className='flex justify-between mt-[4px]'>
                      <div>
                        <p className='text-gray-400 text-sm'>SIGMA FILES</p>
                        <p className='text-white font-bold text-sm'>{item?.docCount}</p>
                      </div>
                      <div>
                        <p className='text-gray-400 text-sm'>CTI REPORTS</p>
                        <p className='text-white font-bold text-sm'>{item?.ctiReports?.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        </div>
      ) : (
        <>
          {!searchValue && sortedData?.length == 0 ? (
            <div className='flex items-center justify-center min-h-screen mt-[-200px]'>
              <CircularProgress size='3rem' sx={{ color: '#EE7103' }} />
            </div>
          ) : (
            <div className='flex items-center justify-center min-h-screen mt-[-200px] text-white'>
              Repository not found
            </div>
          )}
        </>
      )}

      {isCtiDialogOpen && (
        <DatavalutdeleteDilog data={isCtiValue} onClose={handleCTIclose} remove={remove} />
      )}
    </div>
  )
}
