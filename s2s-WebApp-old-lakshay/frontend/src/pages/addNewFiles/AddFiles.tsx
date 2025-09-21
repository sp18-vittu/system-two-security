import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useData } from '../../layouts/shared/DataProvider'

const AddFiles = () => {
  const navigateTo = useNavigate()
  const { id: paramsId }: any = useParams()

  const [feedlyCounterValue, setFeedlyCounterValue] = useState(null as any)

  const { detail }: any = useData()
  useEffect(() => {
    if (
      detail &&
      (detail.from == 'repoCounter' || detail.from == 'addFeedly') &&
      detail.value.status
    ) {
      if (detail.value.status != 'failed') {
        setFeedlyCounterValue(detail.value.status)
      } else setFeedlyCounterValue(null)
    }
  }, [detail])

  const enterToAdd = () => {
    const feedlyCounter = sessionStorage.getItem('feedlyCounter')
    const counterValue = JSON.parse(feedlyCounter as any)
    if (counterValue) setFeedlyCounterValue(counterValue)
  }

  const toAddFeedly = () => {
    if (feedlyCounterValue) {
    } else {
      navigateTo(`/app/addFeedly/${paramsId}`)
    }
  }

  return (
    <div className='p-[24px] h-[77vh]'>
      <div className='flex lg:gap-[32px] w-full flex-col lg:flex-row md:flex-col md:gap-[32px] sm:gap-[32px] sm:flex-col'>
        <div className='bg-[#344054] w-full rounded-lg text-white p-7'>
          <div className='flex justify-between items-center mt-[-10px] gap-4'>
            <div className='flex items-center  gap-4'>
              <div>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='72'
                  height='72'
                  viewBox='0 0 72 72'
                  fill='none'
                >
                  <path
                    d='M36 6C43.5038 14.2151 47.7683 24.8761 48 36C47.7683 47.1239 43.5038 57.7849 36 66M36 6C28.4962 14.2151 24.2317 24.8761 24 36C24.2317 47.1239 28.4962 57.7849 36 66M36 6C19.4315 6 6 19.4315 6 36C6 52.5685 19.4315 66 36 66M36 6C52.5685 6 66 19.4315 66 36C66 52.5685 52.5685 66 36 66M7.50006 27H64.5001M7.5 45H64.5'
                    stroke='#1570EF'
                    stroke-width='3'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
              </div>
              <div className=''>
                <span className='mt-3 text-[#fff]'>URL</span>
              </div>
            </div>
            <div className='flex-row-reverse'>
              <button
                onClick={() => navigateTo(`/app/addUrl/${paramsId}`)}
                className='text-[#fff] cursor-pointer flex  rounded-md border border-white px-5 py-3 items-center'
              >
                Add
                <span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='none'
                  >
                    <path
                      d='M10.0003 4.16797V15.8346M4.16699 10.0013H15.8337'
                      stroke='#fff'
                      stroke-width='1.5'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
          <div className='mt-2'>
            <p className='text-[#98A2B3]'>Point to a public URL</p>
          </div>
        </div>

        {/* FEEDLY */}

        <div className='bg-[#344054] w-full rounded-lg text-white p-7'>
          <div className='flex justify-between items-center mt-[-10px] gap-4'>
            <div className='flex items-center  gap-4'>
              <div>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='72'
                  height='72'
                  viewBox='0 0 20 18'
                  version='1.1'
                >
                  <path
                    d='M11.55.652a2.174 2.174 0 0 0-3.105 0L.64 8.6a2.274 2.274 0 0 0 0 3.163l5.57 5.673c.388.343.894.553 1.45.553h4.677a2.18 2.18 0 0 0 1.56-.659l5.462-5.562a2.272 2.272 0 0 0 0-3.163L11.551.652zm-.216 14.518l-.78.792a.31.31 0 0 1-.223.095h-.667a.313.313 0 0 1-.206-.08l-.795-.808a.325.325 0 0 1 0-.452l1.114-1.134a.309.309 0 0 1 .443 0l1.114 1.135a.324.324 0 0 1 0 .452zm0-4.759l-3.115 3.173a.312.312 0 0 1-.223.093H7.33a.313.313 0 0 1-.208-.078l-.793-.808a.326.326 0 0 1 0-.453l3.449-3.512a.31.31 0 0 1 .443 0l1.114 1.135a.322.322 0 0 1 0 .45zm0-4.756l-5.45 5.55a.31.31 0 0 1-.224.094h-.667a.311.311 0 0 1-.207-.078l-.794-.81a.323.323 0 0 1 0-.45l5.785-5.892a.31.31 0 0 1 .443 0l1.114 1.134a.324.324 0 0 1 0 .452z'
                    fill='#2AB14C'
                  />
                </svg>
              </div>
              <div className=''>
                <span className='mt-3 text-[#fff]'>Feedly</span>
              </div>
            </div>
            <div className=''>
              <button
                onMouseEnter={() => enterToAdd()}
                onClick={() => toAddFeedly()}
                className={`text-[#fff] flex  rounded-md border border-white px-5 py-3 items-center
                ${feedlyCounterValue ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                Add
                <span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='none'
                  >
                    <path
                      d='M10.0003 4.16797V15.8346M4.16699 10.0013H15.8337'
                      stroke='#fff'
                      stroke-width='1.5'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
          <div className='mt-2 flex gap-[8px]'>
            <div>
              <p className='text-[#98A2B3]'>Ingest a Feedly Stream</p>
            </div>
            {feedlyCounterValue && (
              <div className='mt-[-10px]'>
                <p className='text-[#fff] text-xs'>Feedly processing in progress...</p>
              </div>
            )}
          </div>
        </div>

        {/* PDF */}
        <div className='bg-[#344054]  rounded-lg text-white p-5 w-full'>
          <div className='flex justify-between items-center gap-4'>
            <div className='flex items-center  gap-4'>
              <div className=''>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='58'
                  height='72'
                  viewBox='0 0 58 72'
                  fill='none'
                >
                  <path
                    d='M0.200195 4C0.200195 1.79086 1.99106 0 4.2002 0H36.2002L57.8002 21.6V68C57.8002 70.2091 56.0093 72 53.8002 72H4.2002C1.99106 72 0.200195 70.2091 0.200195 68V4Z'
                    fill='#D92D20'
                  />
                  <path
                    opacity='0.3'
                    d='M36.2002 0L57.8002 21.6H40.2002C37.9911 21.6 36.2002 19.8091 36.2002 17.6V0Z'
                    fill='#295582'
                  />

                  <foreignObject x='13' y='22' width='30' height='30'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='30'
                      height='30'
                      viewBox='0 0 30 30'
                      fill='none'
                    >
                      <path
                        d='M24.1338 17.3493C22.3372 17.3493 20.0888 17.6626 19.3533 17.7729C16.309 14.5937 15.4429 12.7867 15.248 12.3049C15.5121 11.6265 16.4307 9.04946 16.5612 5.73969C16.6256 4.08258 16.2755 2.84437 15.5205 2.05943C14.7668 1.27579 13.8545 1.21484 13.5929 1.21484C12.6755 1.21484 11.1367 1.67871 11.1367 4.78502C11.1367 7.48024 12.3933 10.3402 12.7407 11.0791C10.9106 16.4079 8.94576 20.0557 8.52853 20.8059C1.17468 23.5747 0.599609 26.2518 0.599609 27.0105C0.599609 28.374 1.57063 29.188 3.19709 29.188C7.14873 29.188 10.7549 22.5536 11.3511 21.4016C14.1577 20.2833 17.9142 19.5906 18.8691 19.4254C21.6083 22.0346 24.7762 22.7309 26.0917 22.7309C27.0815 22.7309 29.3995 22.7309 29.3995 20.3476C29.3996 18.1345 26.563 17.3493 24.1338 17.3493ZM23.9433 18.9138C26.0778 18.9138 26.6419 19.6197 26.6419 19.9929C26.6419 20.2271 26.553 20.9912 25.4089 20.9912C24.3829 20.9912 22.6116 20.3983 20.8689 19.1118C21.5956 19.0163 22.6711 18.9138 23.9433 18.9138ZM13.4808 2.7314C13.6755 2.7314 13.8036 2.79392 13.9092 2.94043C14.5231 3.79226 14.0281 6.57564 13.4256 8.75375C12.8441 6.88612 12.4076 4.02043 13.0217 3.01224C13.1417 2.81547 13.2789 2.7314 13.4808 2.7314ZM12.4442 19.4032C13.217 17.842 14.0831 15.5668 14.5549 14.28C15.499 15.8602 16.7688 17.3273 17.5032 18.1228C15.2165 18.6048 13.4865 19.0865 12.4442 19.4032ZM2.13465 27.2188C2.08374 27.1584 2.07621 27.0312 2.11458 26.8783C2.19504 26.5581 2.80987 24.9707 7.25687 22.9814C6.62011 23.9844 5.62465 25.4175 4.53109 26.4881C3.76129 27.2087 3.16188 27.5741 2.74948 27.5741C2.60195 27.5741 2.39868 27.5339 2.13465 27.2188Z'
                        fill='white'
                      />
                    </svg>
                  </foreignObject>
                </svg>
              </div>
              <div className=''>
                <span className='mt-7'>PDF</span>
              </div>
            </div>
            <div
              onClick={() => navigateTo(`/app/addPdf/${paramsId}`)}
              className='cursor-pointer flex items-center justify-center px-5 py-3 items-center gap-2 rounded-md border border-white shadow-xs'
            >
              <div>
                <button className='text-[#fff]'>Add</button>
              </div>
              <div>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                >
                  <path
                    d='M10.0003 4.16797V15.8346M4.16699 10.0013H15.8337'
                    stroke='#fff'
                    stroke-width='1.5'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className='mt-2'>
            <p className='text-[#98A2B3]'>Upload a report</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddFiles
