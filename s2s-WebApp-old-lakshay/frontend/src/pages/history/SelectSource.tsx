import { Button, Menu, MenuItem } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getAddSourceId, updateAddSource } from '../../redux/nodes/chat/action'
import { dataVaultList, dataVaultuserIdList } from '../../redux/nodes/datavault/action'
import local from '../../utils/local'

function SelectSource() {
  const { id } = useParams()

  const dispatch = useDispatch()
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  const localAuth = local.getItem('auth')
  const locals = JSON.parse(localAuth as any)
  const userId = locals?.user?.user?.id
  const CrmMarketing: any = []

  const dataVaultIdlists = useSelector((state: any) => state.dataVaultdomainIdreducer)
  const { dataVaultdomainIdList } = dataVaultIdlists
  const [selectSourceList, setSelectSourceList] = useState([] as any)
  const dataVaultlists = useSelector((state: any) => state.dataVaultreducer)
  const { dataVaultlist } = dataVaultlists
  const roleDto = local.getItem('auth')
  const role = JSON.parse(roleDto as any)
  const roleDescription = role?.user?.user
  const getroleName = roleDescription?.roleDTO
  const induserDetails = useSelector((state: any) => state.indUserdetailreducer)
  const { induserDetail } = induserDetails
  const { getAddSourceDetail } = useSelector((state: any) => state.getAddSourcereducer)

  useEffect(() => {
    if (getroleName?.roleName === 'USER' || getroleName?.roleName == 'DATAVAULT_ADMIN') {
      dispatch(dataVaultuserIdList(token, userId) as any)
    } else if (getroleName?.roleName == 'ACCOUNT_ADMIN' || getroleName?.roleName == 'SUPER_ADMIN') {
      dispatch(dataVaultList(token) as any)
    }
    dispatch(getAddSourceId(token, id) as any)
  }, [induserDetail])

  useEffect(() => {
    if (getroleName?.roleName === 'USER' || getroleName?.roleName == 'DATAVAULT_ADMIN') {
      setSelectSourceList(dataVaultdomainIdList)
    } else if (getroleName?.roleName == 'ACCOUNT_ADMIN' || getroleName?.roleName == 'SUPER_ADMIN') {
      setSelectSourceList(dataVaultlist)
    }
  }, [dataVaultlist, dataVaultdomainIdList, induserDetail])

  // Check during the checkbox select
  const [selectsources, setSelectsources] = useState([false])
  const Buildinintelligence = false
  const valueId = ''

  // User default check

  let addchat: any = []

  // Navigate to crmpage
  const navigateTo = useNavigate()
  let getelect: any = JSON.parse(sessionStorage.getItem('sessionVault') || '[]')

  let vals: any = []
  selectSourceList?.map((item: any) => {
    if (getelect?.length == 0) {
      getAddSourceDetail?.sessionVaults?.map((val: any) => {
        if (item.id == val.id) {
          val.id = Number(val.id)
          vals.push(val)
          addchat.push(val)
        }
      })

      let get_item = {
        id: item.id,
        documents: [],
      }

      vals.push(get_item)
    } else {
      getelect?.map((val: any) => {
        if (item.id == val.id) {
          val.id = Number(val.id)
          vals.push(val)
          addchat.push(val)
        }
      })

      let get_item = {
        id: item.id,
        documents: [],
      }

      vals.push(get_item)
    }
  })

  let createArrayById = removeDuplicates(vals, 'id')
  function removeDuplicates(myArray: any, Prop: any) {
    return myArray.filter((obj: any, pos: any, arr: any) => {
      return arr.map((mapObj: any) => mapObj[Prop]).indexOf(obj[Prop]) === pos
    })
  }

  const crmNavigation = (row: any, index: any) => {
    if (getAddSourceDetail?.sessionVaults?.length > 0 && getelect?.length == 0) {
      sessionStorage.setItem('sessionVault', JSON.stringify(getAddSourceDetail?.sessionVaults))
    } else {
      sessionStorage.setItem('sessionVault', JSON.stringify(getelect))
    }
    if (!Buildinintelligence && row.chatDocument != 'Built-in knowledge') {
      navigateTo(`Crmmarketing/${row.id}`, { state: selectsources })
    }
  }

  //  add to chat button navigator
  const selectSourceNewChat = () => {
    if (id) {
      let addSource: any
      addSource = JSON.parse(sessionStorage.getItem('sessionVault') || '{}')
      sessionStorage.setItem('promptSource', JSON.stringify(addSource))
      const UpdatedataVaultChat = {
        sessionName: getAddSourceDetail.sessionName,
        sessionVaults: addSource,
        sessionSourceValue: 1,
      }

      dispatch(updateAddSource(UpdatedataVaultChat, id) as any)
      navigateTo(`/app/history/${id}`)
    }
  }

  enum SortingOrder {
    Ascending = 'ascending',
    Descending = 'descending',
  }

  const handleSortingOrderChange = (event: any) => {
    const sortedValues = selectSourceList
      ?.slice()
      .sort((a: any, b: any) =>
        event === SortingOrder.Ascending
          ? a.name?.localeCompare(b.name)
          : b.name?.localeCompare(a.name),
      )
    setSelectSourceList(sortedValues)
    handleClosed()
  }

  // Search Function
  const [searchValue, setSearchValue] = useState('')
  const [searchvaluelength, setSearchvaluelength] = useState([] as any)
  const onSearch = (e: any) => {
    setSearchvaluelength([])
    const seachInput = e.target.value
    if (seachInput.length > 2) {
      setSearchValue(seachInput)
    }
  }

  useEffect(() => {
    let getelect: any = JSON.parse(sessionStorage.getItem('checboxcard') || '{}')
    if (getelect?.length > 0) {
      setSelectsources(getelect)
    } else {
      setSelectsources(selectsources)
    }

    const newsearchlength = selectSourceList.filter((value: any) =>
      value.name.toLowerCase().includes(searchValue.toLowerCase()),
    )
    setSearchvaluelength(newsearchlength)
  }, [searchValue])

  // Sort Dropdown[]
  const [anchorE2, setAnchorE2] = React.useState(null)
  const opened = Boolean(anchorE2)
  const handleClicked = (event: any) => {
    setAnchorE2(event.currentTarget)
  }
  const handleClosed = () => {
    setAnchorE2(null)
  }

  return (
    <>
      <div className='bg-[#0C111D] w-full h-fit 2xl:h-fit lg:h-fit pb-3'>
        <div className='lg:relative'>
          <div className='lg:inline-flex block md:block'>
            <div className='ml-3.5 pt-10'></div>
            <div className='absolute top-35 bottom-3 pt-3 right-2 md:top-20 md:pt-3 lg:pt-0 lg:top-0 lg:pb-10 lg:right-2'>
              <div className='p-3 relative inline-flex'>
                <div className='relative pb-4 flex flex-wrap items-stretch'>
                  <Button
                    disableRipple
                    sx={{
                      textAlign: 'center',
                      color: '#606060',
                      backgroundColor: '#fff',
                      textTransform: 'capitalize',
                      border: '2px solid #dedede',
                      borderRadius: '8px',
                      ':hover': {
                        bgcolor: '#fff',
                        color: '#606060',
                      },
                    }}
                    aria-controls={opened ? 'basic-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={opened ? 'true' : undefined}
                    onClick={handleClicked}
                  >
                    Sort by
                    <div className='pl-2 pr-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='20'
                        viewBox='0 0 20 20'
                        fill='none'
                      >
                        <path
                          d='M14.1667 3.3335V12.5002M14.1667 12.5002L10.8333 9.16683M14.1667 12.5002L17.5 9.16683M5.83333 3.3335V16.6668M5.83333 16.6668L2.5 13.3335M5.83333 16.6668L9.16667 13.3335'
                          stroke='#475467'
                          strokeWidth='1.66667'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </div>
                  </Button>
                  <Menu
                    id='basic-menu'
                    anchorEl={anchorE2}
                    open={opened}
                    onClose={handleClosed}
                    style={{ marginRight: '20px' }}
                  >
                    <MenuItem
                      disableRipple
                      onClick={() => handleSortingOrderChange(SortingOrder.Ascending)}
                    >
                      Name (A to Z)
                    </MenuItem>
                    <MenuItem
                      disableRipple
                      onClick={() => handleSortingOrderChange(SortingOrder.Descending)}
                    >
                      Name (Z to A)
                    </MenuItem>
                  </Menu>
                </div>
              </div>
              <button
                className='bg-white w-37 h-9 mr-4 text-sm font-semibold py-1 px-4 border border-emerald-500 text-emerald-900 rounded-lg shadow disabled:opacity-25'
                onClick={selectSourceNewChat}
                disabled={addchat.length > 0 ? false : true}
              >
                Add to Chat
              </button>
            </div>
            <div className='mt-2 left-0 relative inline-flex lg:top-0 lg:pt-0 pt-7'>
              <div className='relative flex flex-wrap items-stretch'>
                <input
                  onChange={(e) => onSearch(e)}
                  type='search'
                  className='relative  m-0 block lg:w-80 flex-auto rounded-l-lg p-1.5 border-t border-l border-b border-solid
                    bg-white text-base font-normal leading-[1.6]'
                  placeholder='Search for a datavault'
                  aria-label='Search'
                  aria-describedby='button-addon2'
                />
                <button
                  className='input-group-text bg-white w-10 flex p-1.5 items-center border-t border-b border-r border-solid border-neutral-300 whitespace-nowrap rounded-r-lg px-3 py-1.5 text-center text-base font-normal text-neutral-700 '
                  id='basic-addon2'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='none'
                  >
                    <path
                      d='M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z'
                      stroke='#475467'
                      strokeWidth='1.66667'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='bg-[#0C111D] lg:mr-5 lg:grid lg:grid-cols-4 lg:gap-4 lg:mt-3 lg:ml-3.5 lg:mr-3.5 lg:pt-3 grid grid-cols-1 gap-4 mt-3 ml-3.5 mr-3.5 md:pt-0 pt-32'>
          <>
            {searchvaluelength.length > 0 ? (
              <>
                {searchvaluelength?.map((row: any, index: any) => (
                  <>
                    {row.name == 'Built-in-Knowledge' ? (
                      <div className='relative rounded-lg bg-[#1D2939] p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] h-40'>
                        <div className='relative'>
                          <div style={{ display: 'inline-flex' }}>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='68'
                              height='68'
                              viewBox='0 0 68 68'
                              fill='none'
                            >
                              <path
                                d='M44.2597 28.1026C43.4246 28.1026 42.5895 28.8338 42.5895 29.8088V32.0025C42.4702 32.9775 41.7544 33.7088 40.8 33.7088C39.8457 33.7088 38.8913 32.9775 38.8913 31.8807V25.2994C38.8913 24.4463 38.1755 23.5932 37.2211 23.5932C36.386 23.5932 35.5509 24.3245 35.5509 25.2994V29.4432C35.5509 30.4182 34.7158 31.3932 33.6421 31.3932C32.6878 31.3932 31.8527 30.6619 31.7334 29.5651V24.2026C31.7334 23.3495 31.0176 22.4963 30.0632 22.4963C29.2281 22.4963 28.393 23.2276 28.393 24.2026V31.7588C28.393 32.7338 27.5579 33.7088 26.4843 33.7088C25.5299 33.7088 24.6948 32.9775 24.6948 31.7588V29.8088C24.6948 28.9557 23.979 28.1026 23.0246 28.1026C22.0702 28.1026 21.3544 28.8338 21.3544 29.8088V38.2181C21.3544 39.0713 22.0702 39.9244 23.0246 39.9244C23.979 39.9244 24.6948 39.1931 24.6948 38.2181V37.365C24.6948 36.39 25.5299 35.415 26.6035 35.415C27.5579 35.415 28.5123 36.2681 28.5123 37.365V40.5338C28.5123 41.3869 29.2281 42.24 30.1825 42.24C31.1369 42.24 31.8527 41.5088 31.8527 40.5338V35.0494C31.8527 34.0744 32.6878 33.2213 33.7614 33.2213C34.7158 33.2213 35.6702 34.0744 35.6702 35.1713V41.7525C35.6702 42.6056 36.386 43.4587 37.3404 43.4587C38.1755 43.4587 39.0106 42.7275 39.0106 41.7525V37.4869C39.0106 36.5119 39.7264 35.6588 40.9193 35.6588C41.8737 35.6588 42.7088 36.39 42.7088 37.365V38.2181C42.7088 39.0713 43.4246 39.9244 44.379 39.9244C45.2141 39.9244 46.0492 39.1931 46.0492 38.2181V29.8088C45.8106 28.8338 45.0948 28.1026 44.2597 28.1026ZM19.565 31.515C18.7299 31.515 17.8948 32.2463 17.8948 33.2213V34.9275C17.8948 35.7807 18.6106 36.6338 19.565 36.6338C20.4 36.6338 21.2351 35.9025 21.2351 34.9275V33.2213C20.9965 32.2463 20.2807 31.515 19.565 31.515ZM48.4351 31.515C47.6 31.515 46.765 32.2463 46.765 33.2213V34.9275C46.765 35.7807 47.4807 36.6338 48.4351 36.6338C49.3895 36.6338 50.1053 35.9025 50.1053 34.9275V33.2213C50.1053 32.2463 49.3895 31.515 48.4351 31.515Z'
                                fill='#7F56D9'
                              />
                              <path
                                d='M59.2167 42.3584V25.0751C61.0584 24.2251 62.1917 22.3834 62.1917 20.4001C62.1917 17.5667 59.9251 15.3 57.0917 15.3C56.1001 15.3 54.9668 15.5834 54.1168 16.2917L39.1001 7.79172V7.65005C39.1001 4.81672 36.8334 2.55005 34.0001 2.55005C31.1667 2.55005 28.9001 4.81672 28.9001 7.65005V7.79172L13.8834 16.5751C12.8917 15.8667 11.9001 15.5834 10.7667 15.5834C7.93341 15.4417 5.66675 17.7084 5.66675 20.5417C5.66675 22.6667 6.94175 24.5084 8.92508 25.3584V42.5C6.94175 43.0667 5.66675 44.9084 5.66675 46.8917C5.66675 49.725 7.93341 51.9917 10.7667 51.9917C11.7584 51.9917 12.8917 51.7084 13.7417 51.1417L29.0417 59.925C29.0417 62.7584 31.3084 65.0251 34.1417 65.0251C36.9751 65.0251 39.2417 62.7584 39.2417 59.925L54.4001 51.1417C55.2501 51.7084 56.2417 51.9917 57.2334 51.9917C60.0667 51.9917 62.3334 49.725 62.3334 46.8917C62.1917 45.05 61.0584 43.2084 59.2167 42.3584ZM55.9584 42.075C55.3918 42.2167 54.8251 42.5 54.2584 42.7834L50.4334 40.6584C50.2917 40.6584 50.0084 40.5167 49.8668 40.5167C49.0168 40.5167 48.1667 41.225 48.1667 42.2167C48.1667 42.7834 48.4501 43.2084 48.8751 43.4917L52.2751 45.475C52.1334 46.0417 51.9918 46.4667 51.9918 47.175C51.9918 47.8834 52.1334 48.1667 52.2751 48.875L37.9667 57.0917C37.4001 56.3834 36.6917 55.8167 35.5584 55.25V51C35.4167 50.15 34.8501 49.4417 33.8584 49.4417C32.8667 49.4417 32.3001 50.0084 32.1584 51V55.1084C31.1667 55.3917 30.1751 55.9584 29.6084 56.95L15.1584 48.5917C15.3001 48.0251 15.4417 47.6 15.4417 47.0334C15.4417 46.6084 15.4417 46.325 15.3001 46.0417L18.7001 43.9167L18.8417 43.7751C19.2667 43.4917 19.5501 43.0667 19.5501 42.5C19.5501 41.65 18.8417 40.8 17.8501 40.8C17.5667 40.8 17.2834 40.9417 17.0001 41.0834L13.6001 43.2084C13.0334 42.7834 12.4667 42.5 11.6167 42.2167V25.3584C12.3251 25.075 12.8917 24.7917 13.4584 24.3667L17.0001 26.35C17.1417 26.4917 17.4251 26.4917 17.5667 26.4917C18.4167 26.4917 19.2667 25.7834 19.2667 24.7917C19.2667 24.3667 18.9834 23.9417 18.7001 23.5167L15.5834 21.5334C15.7251 21.2501 15.7251 20.8251 15.7251 20.5417C15.7251 20.1167 15.7251 19.6917 15.5834 19.2667L30.0334 10.9084C30.6001 11.6167 31.5917 12.1834 32.4417 12.6084V16.8584C32.4417 17.7084 33.1501 18.5584 34.1417 18.5584C35.1334 18.5584 35.8417 17.85 35.8417 16.8584V12.6084C36.6917 12.3251 37.5417 11.7584 38.1084 10.9084L52.4167 19.125C52.2751 19.6917 52.2751 20.1167 52.2751 20.4001V21.1084L48.8751 23.2334C48.4501 23.5167 48.1667 23.9417 48.1667 24.5084C48.1667 25.3584 48.8751 26.2084 49.8668 26.2084C50.1501 26.2084 50.2917 26.2084 50.5751 26.0667L53.8334 24.0834C54.4001 24.65 55.3918 25.075 56.2418 25.3584V42.075H55.9584Z'
                                fill='#7F56D9'
                              />
                            </svg>
                            <div
                              className='text-gray-900 absolute right-0 sm:top-0 sm:right-0'
                              style={{ fontSize: 14, fontWeight: 600, display: 'inline-flex' }}
                            >
                              {valueId == '1' || valueId == '2' ? (
                                <div className='mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]'>
                                  <input
                                    className={` ${
                                      !Buildinintelligence
                                        ? "cursor-pointer relative -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.200rem] w-[1.200rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-gray-600 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full checked:border-[#135056] checked:bg-transparent before:bg-transparent before:opacity-0 before:content-[''] checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8110rem] checked:after:w-[0.400rem] checked:after:rotate-45 checked:after:border-[0.100rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-[#135056] checked:after:bg-transparent checked:after:content-[''] hover:before:opacity-[0.04]"
                                        : "cursor-default relative -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.200rem] w-[1.200rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-gray-600 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full checked:border-[#135056] checked:bg-transparent before:bg-transparent before:opacity-0 before:content-[''] checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8110rem] checked:after:w-[0.400rem] checked:after:rotate-45 checked:after:border-[0.100rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-[#135056] checked:after:bg-transparent checked:after:content-[''] hover:before:opacity-[0.04]"
                                    }`}
                                    type='checkbox'
                                    checked
                                    id='checkboxDefault'
                                  />
                                </div>
                              ) : (
                                <div className='mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]'>
                                  <input
                                    className={` ${
                                      !Buildinintelligence
                                        ? "cursor-pointer relative -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.200rem] w-[1.200rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-gray-600 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full checked:border-[#135056] checked:bg-transparent before:bg-transparent before:opacity-0 before:content-[''] checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8110rem] checked:after:w-[0.400rem] checked:after:rotate-45 checked:after:border-[0.100rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-[#135056] checked:after:bg-transparent checked:after:content-[''] hover:before:opacity-[0.04]"
                                        : "cursor-default relative -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.200rem] w-[1.200rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-gray-600 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full checked:border-[#135056] checked:bg-transparent before:bg-transparent before:opacity-0 before:content-[''] checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8110rem] checked:after:w-[0.400rem] checked:after:rotate-45 checked:after:border-[0.100rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-[#135056] checked:after:bg-transparent checked:after:content-[''] hover:before:opacity-[0.04]"
                                    }`}
                                    type='checkbox'
                                    id='checkboxDefault'
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className='text-gray-900 block pt-5'>
                            <span className='cursor-default text-xl font-semibold '>
                              {row.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                  </>
                ))}
                {searchvaluelength?.map((row: any, index: any) => (
                  <>
                    {row.name !== 'Built-in-Knowledge' ? (
                      <div
                        key={index}
                        className='relative bg-[#1D2939] rounded-lg bg-white p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] h-40'
                      >
                        <div className='relative'>
                          <div style={{ display: 'inline-flex' }}>
                            <svg
                              onClick={() => crmNavigation(row, index)}
                              xmlns='http://www.w3.org/2000/svg'
                              width='48'
                              height='48'
                              viewBox='0 0 68 68'
                              fill='none'
                              // dangerouslySetInnerHTML={{ __html: row.chatDocumentsvgpath }}
                            >
                              <path
                                d='M6.80005 4C6.80005 1.79086 8.59091 0 10.8 0H40.8L61.2001 20.4V64C61.2001 66.2091 59.4092 68 57.2001 68H10.8C8.59091 68 6.80005 66.2091 6.80005 64V4Z'
                                fill='#7F56D9'
                              />
                              <path
                                opacity='0.3'
                                d='M40.8 0L61.2001 20.4H44.8C42.5909 20.4 40.8 18.6091 40.8 16.4V0Z'
                                fill='white'
                              />
                              <path
                                d='M35.1334 35.1334L33.8691 32.6049C33.5053 31.8771 33.3233 31.5133 33.0519 31.2474C32.8119 31.0123 32.5226 30.8335 32.205 30.724C31.8458 30.6001 31.439 30.6001 30.6253 30.6001H26.2934C25.024 30.6001 24.3892 30.6001 23.9044 30.8471C23.4779 31.0645 23.1311 31.4112 22.9138 31.8377C22.6667 32.3226 22.6667 32.9573 22.6667 34.2268V35.1334M22.6667 35.1334H39.8934C41.7976 35.1334 42.7497 35.1334 43.477 35.504C44.1167 35.83 44.6369 36.3501 44.9628 36.9899C45.3334 37.7172 45.3334 38.6693 45.3334 40.5734V45.5601C45.3334 47.4643 45.3334 48.4164 44.9628 49.1437C44.6369 49.7834 44.1167 50.3036 43.477 50.6295C42.7497 51.0001 41.7976 51.0001 39.8934 51.0001H28.1067C26.2026 51.0001 25.2505 51.0001 24.5232 50.6295C23.8834 50.3036 23.3633 49.7834 23.0373 49.1437C22.6667 48.4164 22.6667 47.4643 22.6667 45.5601V35.1334Z'
                                stroke='white'
                                strokeWidth='1.5'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                            </svg>
                            <div
                              className='text-gray-900 bg-[#1D2939] absolute right-0 sm:top-0 sm:right-0'
                              style={{ fontSize: 14, fontWeight: 600, display: 'inline-flex' }}
                            ></div>
                          </div>
                          <div className='text-white block'>
                            <span
                              className={` ${
                                !Buildinintelligence
                                  ? 'cursor-pointer w-fit hover:bg-slate-300 text-xl font-semibold'
                                  : 'cursor-default text-xl font-semibold'
                              }`}
                              onClick={() => crmNavigation(row, index)}
                            >
                              {row.name}
                            </span>
                            <div className='block'>
                              <p className='lg:ml-0 lg:pt-3 ml-0 lg:top-0 text-white text-sm'>
                                {CrmMarketing?.length +
                                  '  Resource(s) found ' +
                                  ' , ' +
                                  createArrayById[index].documents.length +
                                  '    ' +
                                  'selected'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                  </>
                ))}
              </>
            ) : (
              <>
                {selectSourceList?.map((row: any, index: any) => (
                  <>
                    {row.name !== 'Built-in-Knowledge' ? (
                      <div
                        key={index}
                        className='relative bg-[#1D2939] rounded-lg  p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] h-40'
                      >
                        <div className='relative'>
                          <div style={{ display: 'inline-flex' }}>
                            <span>
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
                                    stroke-width='2'
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                  />
                                </svg>
                              </svg>
                            </span>
                            <div
                              className='text-gray-900 absolute right-0 sm:top-0 sm:right-0'
                              style={{ fontSize: 14, fontWeight: 600, display: 'inline-flex' }}
                            ></div>
                          </div>
                          <div className='text-white block'>
                            <span
                              className={` ${
                                !Buildinintelligence
                                  ? 'cursor-pointer w-fit hover:bg-slate-300 text-xl font-semibold'
                                  : 'cursor-default text-xl font-semibold'
                              }`}
                              onClick={() => crmNavigation(row, index)}
                            >
                              {row.name}
                            </span>
                            <div className='block'>
                              <p className='lg:ml-0 lg:pt-3 ml-0 lg:top-0 text-white text-sm'>
                                {row.docCount +
                                  '  Resource(s) found ' +
                                  ' , ' +
                                  (createArrayById[index]?.documents?.length + '    ' + 'selected')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                  </>
                ))}
              </>
            )}
          </>
        </div>
      </div>
    </>
  )
}
export default SelectSource
