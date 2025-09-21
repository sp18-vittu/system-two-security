import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DataVaultsPage() {
  const [openoption, setopenoption] = useState(false)
  const [opencard, setopencard] = useState(true)
  const [onShowindex, setonShowindex] = useState()
  const [datadetail] = useState([])
  console.log('datadetail--------->>', datadetail)

  const navigateTo = useNavigate()
  const onview = (item: any) => {
    navigateTo(`/app/Repository/${item.id}`)
  }
  /**********Important ********************/
  const onCardview = (item: any) => {
    navigateTo(`/app/Repository/${item.id}`)
  }

  const onpopupview = (index: any) => {
    setonShowindex(index)
    setopenoption((prev) => !prev)
  }

  const RepositoryDropdown = () => {
    {
      openoption ? setopenoption(false) : null
    }
  }

  return (
    <>
      {opencard ? (
        <>
          <div
            className='rounded-lg bg-white mx-8 mt-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] md:h-28 lg:h-28 xs:h-44 xs:w-5+ 2xl:h-36 cursor-pointer'
            onClick={RepositoryDropdown}
          >
            <div
              style={{ justifyContent: 'end', display: 'flex' }}
              onClick={() => setopencard(false)}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
              >
                <path
                  d='M18 6L6 18M6 6L18 18'
                  stroke='#475467'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
            <div className='relative flex'>
              <img
                className='w-20 h-20 ml-3 2xl:h-28 2xl:w-28'
                src='pngwing 1.webp'
                alt='image datavault'
              />
              <p className='mx-4 mt-4 text-base 2xl:text-2xl'>
                Assistance is establishing data vaults that enable users to efficiently arrange and
                categorize their data, while also restricting search capablities to specific data
                orgins.
              </p>
            </div>
          </div>
        </>
      ) : null}
      <div className='container-fluid' onClick={RepositoryDropdown}>
        <div className='grid mt-5 ml-4 2xl:grid-cols-4 xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
          <>
            <div
              className='mb-9 ml-4 rounded-md py-3 px-3 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] transition-all  h-28 w-72 2xl:w-[31rem] xs:w-[40rem]'
              style={{ background: '#FFFFFF' }}
            >
              <>
                <div className='mx-auto mb-2 inline-flex'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='48'
                    height='48'
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
                </div>
                <div>
                  <h5 className='mb-6 font-medium text-black md:text-lg lg:text-lg 2xl:text-2xl font-medium'>
                    Built-in knowledge
                  </h5>
                </div>
              </>
            </div>
            {datadetail.map((item: any, index: any) => (
              <div
                key={index}
                className='w-full px-4 md:w-1/2 lg:w-9/12 2xl:w-9/12 xs:w-2/3'
                onClick={RepositoryDropdown}
              >
                <div
                  className='mb-9 rounded-md py-3 px-3 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]  transition-all  h-28 md:w-72 lg:w-72 2xl:w-[31rem] xs:w-[40rem]'
                  style={{ background: '#FFFFFF' }}
                >
                  <>
                    <div className='mx-auto mb-2 inline-flex'>
                      <div className='cursor-pointer' onClick={() => onCardview(item)}>
                        <svg
                          width='48'
                          className='ml-1'
                          height='48'
                          viewBox='0 0 68 68'
                          fill='none'
                          dangerouslySetInnerHTML={{ __html: item.upload }}
                        ></svg>
                      </div>
                      <div className='pl-48 2xl:pl-96 xs:pl-72'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth='1.5'
                          stroke='currentColor'
                          className='w-6 h-6 justify-items-end'
                          onClick={() => onpopupview(index)}
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z'
                          />
                        </svg>
                        {openoption && index == onShowindex && (
                          <>
                            <div className='absolute'>
                              <div className='bg-white -mx-10 rounded-lg p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]'>
                                <ul>
                                  <button style={{ display: 'flex' }} onClick={() => onview(item)}>
                                    <svg
                                      xmlns='http://www.w3.org/2000/svg'
                                      fill='none'
                                      viewBox='0 0 24 24'
                                      strokeWidth='1.5'
                                      stroke='currentColor'
                                      className='w-5 h-5'
                                    >
                                      <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125'
                                      />
                                    </svg>

                                    <li className='mb-5 cursor-pointer'>Edit</li>
                                  </button>
                                  <button style={{ display: 'flex' }}>
                                    <svg
                                      xmlns='http://www.w3.org/2000/svg'
                                      fill='none'
                                      viewBox='0 0 24 24'
                                      strokeWidth='1.5'
                                      stroke='currentColor'
                                      className='w-5 h-5'
                                    >
                                      <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
                                      />
                                    </svg>
                                    <li className='mb-2 cursor-pointer'>Delete</li>
                                  </button>
                                </ul>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div onClick={RepositoryDropdown}>
                      <h5
                        className='cursor-pointer w-fit mb-4 font-medium text-black md:text-lg lg:text-lg 2xl:text-2xl font-medium hover:bg-slate-300'
                        onClick={() => onCardview(item)}
                      >
                        {item.name}
                      </h5>
                    </div>
                  </>
                </div>
              </div>
            ))}
          </>
        </div>
      </div>
    </>
  )
}
