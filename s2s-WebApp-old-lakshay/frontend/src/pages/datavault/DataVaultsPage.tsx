import { Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  CREATE_NEW_DATAVALUT_RESET,
  DATAVAULT_DELETE_RESET,
  DATAVAULT_UPDATE_RESET,
  dataVaultList,
  dataVaultuserIdList,
  deletDataeVault,
} from '../../redux/nodes/datavault/action'
import local from '../../utils/local'
import DataVaultModel from './DataVaultModel'
import Swal from 'sweetalert2'
import { REPOSITORY_DOC_RESET } from '../../redux/nodes/repository/action'

export default function DataVaultsPage() {
  const dispatch = useDispatch()
  const navigateTo = useNavigate()

  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  const localAuth = local.getItem('auth')
  const locals = JSON.parse(localAuth as any)
  const userId = locals?.user?.user?.id
  const roleDto = local.getItem('auth')
  const role = JSON.parse(roleDto as any)
  const roleDescription = role?.user?.user
  const getroleName = roleDescription?.roleDTO

  const [showdataModal, setShowdataModal] = useState(false)
  const [dataVaultId, setdataVaultId] = useState('')
  const [anchorE6, setAnchorE6] = useState(null)

  const induserDetails = useSelector((state: any) => state.indUserdetailreducer)
  const dataVaultlists = useSelector((state: any) => state.dataVaultreducer)
  const { dataVaultlist } = dataVaultlists
  const dataVaultIdlists = useSelector((state: any) => state.dataVaultdomainIdreducer)
  const { dataVaultdomainIdList } = dataVaultIdlists
  const [datavaultlist, setdatavaultlist] = useState([] as any)
  const deleteduser = useSelector((state: any) => state.datavalutsavereducer)
  const { success: savesuccess } = deleteduser
  const deletedDatavalut = useSelector((state: any) => state.dataVaultdeletereducer)
  const { success: removesuccess } = deletedDatavalut
  const updateDatavalut = useSelector((state: any) => state.datavalutUpdatereducer)
  const { success: updatesuccess } = updateDatavalut
  const [showModalRemove, setShowModalRemove] = useState(false)

  const opendot = Boolean(anchorE6)
  const handleClickdot = (event: any, item: any) => {
    setdataVaultId(item)
    setAnchorE6(event.currentTarget)
  }
  const handleClosing = () => {
    setAnchorE6(null)
  }

  const onview = (item: any) => {
    setAnchorE6(null)
    setShowdataModal(true)
  }

  /**********Important ********************/
  const onCardview = (item: any) => {
    navigateTo(`/app/Repository/${item.id}`)
    sessionStorage.removeItem('Repository')
  }

  const onDelete = (item: any) => {
    setAnchorE6(null)
    setShowModalRemove(true)
  }

  const userdeletefinal = () => {
    dispatch(deletDataeVault(dataVaultId) as any)
    setShowModalRemove(false)
  }

  useEffect(() => {
    dispatch({ type: REPOSITORY_DOC_RESET })
  }, [])

  useEffect(() => {
    if (induserDetails.isAuthenticted) {
      if (getroleName?.roleName === 'USER' || getroleName?.roleName == 'DATAVAULT_ADMIN') {
        dispatch(dataVaultuserIdList(token, userId) as any)
      } else if (
        getroleName?.roleName == 'ACCOUNT_ADMIN' ||
        getroleName?.roleName == 'SUPER_ADMIN'
      ) {
        dispatch(dataVaultList(token) as any)
      }
    }
    if (savesuccess) {
      dispatch({ type: CREATE_NEW_DATAVALUT_RESET })
      if (getroleName?.roleName === 'USER' || getroleName?.roleName == 'DATAVAULT_ADMIN') {
        dispatch(dataVaultuserIdList(token, userId) as any)
      } else if (
        getroleName?.roleName == 'ACCOUNT_ADMIN' ||
        getroleName?.roleName == 'SUPER_ADMIN'
      ) {
        dispatch(dataVaultList(token) as any)
      }
    }
    if (removesuccess) {
      dispatch({ type: DATAVAULT_DELETE_RESET })
      if (getroleName?.roleName === 'USER' || getroleName?.roleName == 'DATAVAULT_ADMIN') {
        dispatch(dataVaultuserIdList(token, userId) as any)
      } else if (
        getroleName?.roleName == 'ACCOUNT_ADMIN' ||
        getroleName?.roleName == 'SUPER_ADMIN'
      ) {
        dispatch(dataVaultList(token) as any)
      }
      Swal.fire({
        position: 'center',
        icon: 'success',
        color: '#000',
        title: 'Deleted Successfully',
        width: 400,
        timer: 1000,
        showConfirmButton: false,
      })
    }
    if (updatesuccess) {
      dispatch({ type: DATAVAULT_UPDATE_RESET })
      if (getroleName?.roleName === 'USER' || getroleName?.roleName == 'DATAVAULT_ADMIN') {
        dispatch(dataVaultuserIdList(token, userId) as any)
      } else if (
        getroleName?.roleName == 'ACCOUNT_ADMIN' ||
        getroleName?.roleName == 'SUPER_ADMIN'
      ) {
        dispatch(dataVaultList(token) as any)
      }
      Swal.fire({
        position: 'center',
        icon: 'success',
        color: '#000',
        title: 'Updated Successfully',
        width: 400,
        timer: 1000,
        showConfirmButton: false,
      })
    }
  }, [induserDetails.isAuthenticted, savesuccess, removesuccess, updatesuccess])
  useEffect(() => {
    if (induserDetails.induserDetail) {
      if (getroleName?.roleName === 'USER' || getroleName?.roleName == 'DATAVAULT_ADMIN') {
        setdatavaultlist(dataVaultdomainIdList)
      } else if (
        getroleName?.roleName == 'ACCOUNT_ADMIN' ||
        getroleName?.roleName == 'SUPER_ADMIN'
      ) {
        setdatavaultlist(dataVaultlist)
      }
    }
  }, [dataVaultlist, dataVaultdomainIdList])

  return (
    <>
      <div style={{ backgroundColor: '#0D121E', padding: '24' }}>
        {opencard ? <></> : null}

        <div className='bg-[#0C111D] lg:mr-5 lg:grid lg:grid-cols-3 lg:gap-4 lg:mt-3 lg:ml-3.5 lg:mr-3.5 lg:pt-3 grid grid-cols-1 gap-4 mt-3 ml-3.5 mr-3.5 md:pt-0 pt-32'>
          <></>
          {datavaultlist?.map((item: any, key: any) => (
            <>
              {item.name == 'Built-in-Knowledge' ? (
                <div
                  key={key}
                  className=' bg-[#1D2939] relative rounded-lg  p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] h-32'
                >
                  <>
                    <div className='mx-auto mb-2 flex justify-between'>
                      <span>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='68'
                          height='68'
                          viewBox='0 0 68 68'
                          fill='none'
                        >
                          <path
                            d='M44.2594 28.1024C43.4244 28.1024 42.5893 28.8337 42.5893 29.8087V32.0024C42.47 32.9774 41.7542 33.7087 40.7998 33.7087C39.8454 33.7087 38.891 32.9774 38.891 31.8805V25.2993C38.891 24.4462 38.1752 23.5931 37.2208 23.5931C36.3858 23.5931 35.5507 24.3243 35.5507 25.2993V29.4431C35.5507 30.4181 34.7156 31.3931 33.6419 31.3931C32.6875 31.3931 31.8524 30.6618 31.7331 29.5649V24.2025C31.7331 23.3493 31.0173 22.4962 30.063 22.4962C29.2279 22.4962 28.3928 23.2275 28.3928 24.2025V31.7587C28.3928 32.7337 27.5577 33.7087 26.484 33.7087C25.5296 33.7087 24.6945 32.9774 24.6945 31.7587V29.8087C24.6945 28.9556 23.9787 28.1024 23.0244 28.1024C22.07 28.1024 21.3542 28.8337 21.3542 29.8087V38.218C21.3542 39.0711 22.07 39.9243 23.0244 39.9243C23.9787 39.9243 24.6945 39.193 24.6945 38.218V37.3649C24.6945 36.3899 25.5296 35.4149 26.6033 35.4149C27.5577 35.4149 28.5121 36.268 28.5121 37.3649V40.5336C28.5121 41.3868 29.2279 42.2399 30.1823 42.2399C31.1366 42.2399 31.8524 41.5086 31.8524 40.5336V35.0493C31.8524 34.0743 32.6875 33.2212 33.7612 33.2212C34.7156 33.2212 35.67 34.0743 35.67 35.1712V41.7524C35.67 42.6055 36.3858 43.4586 37.3401 43.4586C38.1752 43.4586 39.0103 42.7274 39.0103 41.7524V37.4868C39.0103 36.5118 39.7261 35.6587 40.9191 35.6587C41.8735 35.6587 42.7086 36.3899 42.7086 37.3649V38.218C42.7086 39.0711 43.4244 39.9243 44.3787 39.9243C45.2138 39.9243 46.0489 39.193 46.0489 38.218V29.8087C45.8103 28.8337 45.0945 28.1024 44.2594 28.1024ZM19.5647 31.5149C18.7296 31.5149 17.8945 32.2462 17.8945 33.2212V34.9274C17.8945 35.7805 18.6103 36.6337 19.5647 36.6337C20.3998 36.6337 21.2349 35.9024 21.2349 34.9274V33.2212C20.9963 32.2462 20.2805 31.5149 19.5647 31.5149ZM48.4349 31.5149C47.5998 31.5149 46.7647 32.2462 46.7647 33.2212V34.9274C46.7647 35.7805 47.4805 36.6337 48.4349 36.6337C49.3893 36.6337 50.1051 35.9024 50.1051 34.9274V33.2212C50.1051 32.2462 49.3893 31.5149 48.4349 31.5149Z'
                            fill='#475467'
                          />
                          <path
                            d='M59.2165 42.3584V25.0751C61.0582 24.2251 62.1915 22.3834 62.1915 20.4001C62.1915 17.5667 59.9248 15.3 57.0915 15.3C56.0998 15.3 54.9665 15.5834 54.1165 16.2917L39.0998 7.79172V7.65005C39.0998 4.81672 36.8332 2.55005 33.9998 2.55005C31.1665 2.55005 28.8998 4.81672 28.8998 7.65005V7.79172L13.8832 16.5751C12.8915 15.8667 11.8998 15.5834 10.7665 15.5834C7.93317 15.4417 5.6665 17.7084 5.6665 20.5417C5.6665 22.6667 6.9415 24.5084 8.92484 25.3584V42.5C6.9415 43.0667 5.6665 44.9084 5.6665 46.8917C5.6665 49.725 7.93317 51.9917 10.7665 51.9917C11.7582 51.9917 12.8915 51.7084 13.7415 51.1417L29.0415 59.925C29.0415 62.7584 31.3082 65.0251 34.1415 65.0251C36.9748 65.0251 39.2415 62.7584 39.2415 59.925L54.3998 51.1417C55.2498 51.7084 56.2415 51.9917 57.2332 51.9917C60.0665 51.9917 62.3332 49.725 62.3332 46.8917C62.1915 45.05 61.0582 43.2084 59.2165 42.3584ZM55.9582 42.075C55.3915 42.2167 54.8248 42.5 54.2582 42.7834L50.4332 40.6584C50.2915 40.6584 50.0082 40.5167 49.8665 40.5167C49.0165 40.5167 48.1665 41.225 48.1665 42.2167C48.1665 42.7834 48.4498 43.2084 48.8748 43.4917L52.2748 45.475C52.1332 46.0417 51.9915 46.4667 51.9915 47.175C51.9915 47.8834 52.1332 48.1667 52.2748 48.875L37.9665 57.0917C37.3998 56.3834 36.6915 55.8167 35.5582 55.25V51C35.4165 50.15 34.8498 49.4417 33.8582 49.4417C32.8665 49.4417 32.2998 50.0084 32.1582 51V55.1084C31.1665 55.3917 30.1748 55.9584 29.6082 56.95L15.1582 48.5917C15.2998 48.0251 15.4415 47.6 15.4415 47.0334C15.4415 46.6084 15.4415 46.325 15.2998 46.0417L18.6998 43.9167L18.8415 43.7751C19.2665 43.4917 19.5498 43.0667 19.5498 42.5C19.5498 41.65 18.8415 40.8 17.8498 40.8C17.5665 40.8 17.2832 40.9417 16.9998 41.0834L13.5998 43.2084C13.0332 42.7834 12.4665 42.5 11.6165 42.2167V25.3584C12.3248 25.075 12.8915 24.7917 13.4582 24.3667L16.9998 26.35C17.1415 26.4917 17.4248 26.4917 17.5665 26.4917C18.4165 26.4917 19.2665 25.7834 19.2665 24.7917C19.2665 24.3667 18.9832 23.9417 18.6998 23.5167L15.5832 21.5334C15.7248 21.2501 15.7248 20.8251 15.7248 20.5417C15.7248 20.1167 15.7248 19.6917 15.5832 19.2667L30.0332 10.9084C30.5998 11.6167 31.5915 12.1834 32.4415 12.6084V16.8584C32.4415 17.7084 33.1498 18.5584 34.1415 18.5584C35.1332 18.5584 35.8415 17.85 35.8415 16.8584V12.6084C36.6915 12.3251 37.5415 11.7584 38.1082 10.9084L52.4165 19.125C52.2748 19.6917 52.2748 20.1167 52.2748 20.4001V21.1084L48.8748 23.2334C48.4498 23.5167 48.1665 23.9417 48.1665 24.5084C48.1665 25.3584 48.8748 26.2084 49.8665 26.2084C50.1498 26.2084 50.2915 26.2084 50.5748 26.0667L53.8332 24.0834C54.3998 24.65 55.3915 25.075 56.2415 25.3584V42.075H55.9582Z'
                            fill='#475467'
                          />
                        </svg>
                      </span>
                    </div>
                    <div>
                      <h5 className='mb-6 font-small  text-bold text-[#475467] md:text-lg lg:text-lg 2xl:text-2xl'>
                        {item.name}
                      </h5>
                    </div>
                  </>
                </div>
              ) : (
                ''
              )}
            </>
          ))}
          {datavaultlist?.map((item: any, index: any) => (
            <>
              {item.name !== 'Built-in-Knowledge' ? (
                <div
                  key={index}
                  className='bg-[#1D2939] relative rounded-lg text-white p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] h-32'
                >
                  <div className='relative'>
                    <div style={{ display: 'inline-flex', padding: '8px' }}>
                      <span style={{ marginLeft: '7px' }}>
                        <svg
                          className=''
                          xmlns='http://www.w3.org/2000/svg'
                          width='56'
                          height='68'
                          viewBox='0 0 56 68'
                          fill='none'
                        >
                          <path
                            d='M0.800049 4C0.800049 1.79086 2.59091 0 4.80005 0H34.8L55.2001 20.4V64C55.2001 66.2091 53.4092 68 51.2001 68H4.80005C2.59091 68 0.800049 66.2091 0.800049 64V4Z'
                            fill='white'
                          />
                          <path
                            opacity='0.3'
                            d='M34.8 0L55.2001 20.4H38.8C36.5909 20.4 34.8 18.6091 34.8 16.4V0Z'
                            fill='#295582'
                          />
                          <svg
                            x='15'
                            y='25'
                            xmlns='http://www.w3.org/2000/svg'
                            width='28'
                            height='28'
                            viewBox='0 0 28 28'
                            fill='none'
                          >
                            <path
                              d='M15.1332 8.13331L13.8689 5.60475C13.505 4.87702 13.3231 4.51314 13.0517 4.24729C12.8116 4.0122 12.5223 3.83341 12.2047 3.72386C11.8456 3.59998 11.4387 3.59998 10.6251 3.59998H6.29317C5.02372 3.59998 4.38899 3.59998 3.90413 3.84703C3.47762 4.06434 3.13087 4.4111 2.91356 4.8376C2.6665 5.32246 2.6665 5.95719 2.6665 7.22664V8.13331M2.6665 8.13331H19.8932C21.7974 8.13331 22.7494 8.13331 23.4767 8.50389C24.1165 8.82986 24.6366 9.34999 24.9626 9.98974C25.3332 10.717 25.3332 11.6691 25.3332 13.5733V18.56C25.3332 20.4642 25.3332 21.4162 24.9626 22.1435C24.6366 22.7833 24.1165 23.3034 23.4767 23.6294C22.7494 24 21.7974 24 19.8932 24H8.1065C6.20233 24 5.25024 24 4.52294 23.6294C3.88319 23.3034 3.36305 22.7833 3.03708 22.1435C2.6665 21.4162 2.6665 20.4642 2.6665 18.56V8.13331Z'
                              stroke='#295582'
                              strokeWidth='2'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            />
                          </svg>
                        </svg>
                      </span>
                      <div className='absolute right-0 sm:top-0 sm:right-0 flex justify-center'>
                        {getroleName?.roleName !== 'USER' && (
                          <>
                            <Button disableRipple onClick={(e) => handleClickdot(e, item.id)}>
                              <span className='-mr-10'>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  strokeWidth='1.5'
                                  stroke='#fff'
                                  className='w-6 h-6'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z'
                                  />
                                </svg>
                              </span>
                            </Button>
                            <Menu
                              anchorEl={anchorE6}
                              open={opendot}
                              onClose={handleClosing}
                              elevation={1}
                            >
                              <MenuItem disableRipple onClick={() => onview(item)}>
                                <svg
                                  className='w-5 h-5'
                                  viewBox='0 0 16 16'
                                  fill='none'
                                  xmlns='http://www.w3.org/2000/svg'
                                >
                                  <path
                                    d='M14 12.0001L13.3332 12.7294C12.9796 13.1162 12.5001 13.3334 12.0001 13.3334C11.5001 13.3334 11.0205 13.1162 10.6669 12.7294C10.3128 12.3435 9.83332 12.1268 9.33345 12.1268C8.83359 12.1268 8.35409 12.3435 7.99998 12.7294M2 13.3334H3.11636C3.44248 13.3334 3.60554 13.3334 3.75899 13.2966C3.89504 13.2639 4.0251 13.21 4.1444 13.1369C4.27895 13.0545 4.39425 12.9392 4.62486 12.7086L13 4.3334C13.5523 3.78112 13.5523 2.88569 13 2.3334C12.4477 1.78112 11.5523 1.78112 11 2.3334L2.62484 10.7086C2.39424 10.9392 2.27894 11.0545 2.19648 11.189C2.12338 11.3083 2.0695 11.4384 2.03684 11.5744C2 11.7279 2 11.8909 2 12.2171V13.3334Z'
                                    stroke='#344054'
                                    stroke-width='1.5'
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                  />
                                </svg>
                                <span className='m-1'> Edit</span>
                              </MenuItem>
                              <MenuItem disableRipple onClick={() => onDelete(item)}>
                                <svg
                                  className='w-5 h-5'
                                  viewBox='0 0 16 16'
                                  fill='none'
                                  xmlns='http://www.w3.org/2000/svg'
                                >
                                  <path
                                    d='M10.6667 3.99992V3.46659C10.6667 2.71985 10.6667 2.34648 10.5213 2.06126C10.3935 1.81038 10.1895 1.60641 9.93865 1.47858C9.65344 1.33325 9.28007 1.33325 8.53333 1.33325H7.46667C6.71993 1.33325 6.34656 1.33325 6.06135 1.47858C5.81046 1.60641 5.60649 1.81038 5.47866 2.06126C5.33333 2.34648 5.33333 2.71985 5.33333 3.46659V3.99992M6.66667 7.66659V10.9999M9.33333 7.66659V10.9999M2 3.99992H14M12.6667 3.99992V11.4666C12.6667 12.5867 12.6667 13.1467 12.4487 13.5746C12.2569 13.9509 11.951 14.2569 11.5746 14.4486C11.1468 14.6666 10.5868 14.6666 9.46667 14.6666H6.53333C5.41323 14.6666 4.85318 14.6666 4.42535 14.4486C4.04903 14.2569 3.74307 13.9509 3.55132 13.5746C3.33333 13.1467 3.33333 12.5867 3.33333 11.4666V3.99992'
                                    stroke='#344054'
                                    stroke-width='1.5'
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                  />
                                </svg>

                                <span className='m-1'>Delete</span>
                              </MenuItem>
                            </Menu>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <h5
                        className='cursor-pointer text-white w-fit mb-4 font-medium text-white md:text-lg lg:text-lg 2xl:text-2xl font-medium hover:bg-[#6941C6] px-3 rounded-[10px]'
                        onClick={() => onCardview(item)}
                      >
                        {getroleName?.roleName === 'USER' ? (
                          <Tooltip
                            style={{ textTransform: 'none', color: 'black' }}
                            title={item.description}
                            placement='bottom'
                          >
                            <h5 className='mb-6 font-medium text-black md:text-lg lg:text-lg 2xl:text-2xl font-medium'>
                              {item.name}
                            </h5>
                          </Tooltip>
                        ) : (
                          <span className='mb-6 font-small mt-2 text-[#fff] md:text-lg lg:text-lg 2xl:text-2xl'>
                            {item.name}
                          </span>
                        )}
                      </h5>
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )}
            </>
          ))}
        </div>
        <div className='bg-[#0D121E] lg:h-[26px] 2xl:h-[190px] '></div>
      </div>
      {showModalRemove ? (
        <>
          <div className='justify-center backdrop-blur-sm items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none p-35'>
            <div className='md:text-sm 2xl:text-lg relative w-auto my-6 mx-auto w-2/5'>
              <div className='md:text-sm 2xl:text-lg border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                <div className='items-start justify-between p-5 border-solid border-slate-200 rounded-t'>
                  <h6 className='md:text-md text-[18px] 2xl:text-lg text-1xl font-semibold justify-center items-center text-center'>
                    Remove CTI Archive
                  </h6>
                  <p className='md:text-sm 2xl:text-lg justify-center text-sm items-center text-center mt-2'>
                    Are you sure you want to remove CTI Archive?
                  </p>
                </div>
                <div className='flex p-2 border-solid border-slate-200 rounded-b gap-4'>
                  <button
                    type='button'
                    className='md:text-sm 2xl:text-lg  w-full bg-white-900 text-sm font-medium text-gray-900 border-2 rounded-lg justify-center font-bold px-3 py-2 text-xs inline-flex '
                    onClick={() => setShowModalRemove(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className='md:text-sm 2xl:text-lg w-full bg-red-600 text-white justify-center font-bold rounded-lg px-3 py-2 text-xs font-medium inline-flex '
                    type='button'
                    onClick={() => userdeletefinal()}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
        </>
      ) : null}
      {showdataModal ? (
        <>
          <DataVaultModel action={setShowdataModal} dataVaultId={dataVaultId}></DataVaultModel>
        </>
      ) : null}
    </>
  )
}
