import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { environment } from '../../environment/environment'
import { useData } from '../../layouts/shared/DataProvider'
import { feedlyGet } from '../../redux/nodes/feedlyform/action'
import {
  ExecuteHuntPost,
  ExecuteHuntStop,
  GetCurrentState,
  HuntPlaneNodeView,
  ThreatbriefStatus,
} from '../../redux/nodes/HuntPlan/action'
import { HuntReportSummaryView } from '../../redux/nodes/HuntSummary/action'
import local from '../../utils/local'
import HuntExecuteFlow from './HuntExecuteFlow'
import HuntPlanExecute from './HuntPlanExecute'
import HuntResult from './HuntResult'

function HuntPlan() {
  const { id } = useParams()
  const { setHuntToaster, setResultToaster, setHuntFaild }: any = useData()
  const dispatch = useDispatch()
  const localToken = local.getItem('bearerToken')
  const token = JSON.parse(localToken as any)

  const [messages, setMessages] = useState(null as any)

  const [tabValue, setTabValue] = useState(1 as any)
  const [planDetails, setPlanDetails] = useState(null as any)
  const [splunkDatas, setsplunkData] = useState(null as any)
  const [summaryValue, setSummaryValue] = useState(null as any)
  const [planeNodeView, setPlaneNodeView] = useState(null as any)
  const [loader, setLoader] = useState(false as any)

  useEffect(() => {
    dispatch(ThreatbriefStatus(token, id) as any).then((res: any) => {
      if (res.type == 'THREATBRIEFS_GET_DETAIL_SUCCESS') {
        setPlanDetails(res?.payload)
        fetchWssData(res?.payload)
        if (!res?.payload?.status || res?.payload?.status === 'ABORTED') {
          setTabValue(1)
          if (res?.payload?.status === 'ABORTED') {
            setHuntToaster(true)
            setHuntFaild('our previous execution was interrupted.please initiate a new hunt')
          } else if (res?.payload?.status == 'FAILED') {
            setHuntToaster(true)
            setHuntFaild('Your last execution Failed')
          }
        } else {
          if (res?.payload?.status == 'COMPLETE') {
            setHuntToaster(false)
            setTabValue(3)
          } else if (res?.payload?.status == 'FAILED') {
            setHuntToaster(true)
            setResultToaster(false)
            setTabValue(1)
          } else {
            setHuntToaster(false)
            setResultToaster(false)
            setTabValue(2)
          }
        }
      } else {
        setPlanDetails(null)
        setTabValue(1)
        setHuntToaster(false)
        setResultToaster(false)
      }
    })
    feedgetmethod()
  }, [id])

  const feedgetmethod = () => {
    dispatch(feedlyGet() as any).then((respons: any) => {
      if (respons?.payload) {
        respons.payload.map((value: any) => {
          if (value.sourceName === 'Splunk') {
            setsplunkData(value)
          }
        })
      }
    })
  }

  useEffect(() => {
    fetchNodeView()
  }, [dispatch, id])

  const fetchNodeView = () => {
    setPlaneNodeView(null)
    dispatch(HuntPlaneNodeView(token, id) as any).then((res: any) => {
      if (res.type == 'HUNT_PLAN_GET_DETAIL_SUCCESS') {
        setPlaneNodeView(res?.payload.root)
      }
    })
  }

  const fetchWssData = (res: any) => {
    if (res?.status != 'COMPLETE') {
      const localStorage1 = local.getItem('bearerToken')
      const token = JSON.parse(localStorage1 as any)
      const barearTockens = token?.bearerToken.split(' ')
      const socket = new WebSocket(
        `${environment?.baseWssUrl}/threatbrief/${res?.threatbriefId}/${res?.uuid}?Authorization=${barearTockens[1]}`,
      )

      socket.onopen = () => {
        setLoader(true)
        console.log('WebSocket connection established')
      }

      socket.onmessage = (event) => {
        const value: any = JSON.parse(event.data)
        setLoader(false)
        setMessages(value)
      }

      socket.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

      socket.onclose = () => {
        console.log('WebSocket connection closed')
      }

      // Cleanup on component unmount
      return () => {
        socket.close()
      }
    } else {
      dispatch(GetCurrentState(res?.threatbriefId, res?.uuid) as any).then((res: any) => {
        if (res.type == 'GET_CURRENT_STATE_SUCCESS') {
          setMessages(res.payload)
        }
      })
    }
  }

  const handleExcute = () => {
    dispatch(ExecuteHuntPost(id, splunkDatas?.id) as any).then((res: any) => {
      if (res.type == 'EXECUTE_HUNT_POST_SUCCESS') {
        setPlanDetails(res?.payload)
        if (res?.payload?.status == 'FAILED' || !res?.payload?.status) {
          setTabValue(1)
          setHuntToaster(true)
        } else {
          setLoader(true)
          setHuntToaster(false)
          fetchWssData(res?.payload)
          setMessages(null)
          setTabValue(2)
        }
      } else if (res.type == 'EXECUTE_HUNT_POST_FAILED') {
        dispatch(ThreatbriefStatus(token, id) as any).then((res: any) => {
          setPlanDetails(res?.payload)
          if (
            res?.payload?.status === 'ABORTED' ||
            res?.payload?.status == 'FAILED' ||
            !res?.payload?.status
          ) {
            setTabValue(1)

            if (res?.payload?.status === 'ABORTED') {
              setHuntToaster(true)
              setHuntFaild('our previous execution was interrupted.please initiate a new hunt')
            } else if (res?.payload?.status == 'FAILED') {
              setHuntToaster(true)
              setHuntFaild('Your last execution Failed')
            }
          } else {
            setHuntToaster(false)
            setLoader(true)
            setMessages(null)
            fetchWssData(res?.payload)
            setTabValue(2)
          }
        })
      }
    })
  }

  const handleTabChange = (val: number) => {
    if (
      (planDetails?.status == 'COMPLETE' || messages?.request_status == 'completed') &&
      planDetails &&
      val == 3
    ) {
      setTabValue(val)
    } else if (
      (planDetails?.status == 'FAILED' ||
        !planDetails?.status ||
        planDetails?.status == 'COMPLETE' ||
        messages?.request_status == 'completed' ||
        planDetails?.status == 'ABORTED') &&
      val == 1
    ) {
      if (planDetails?.status == 'FAILED') {
        setHuntToaster(true)
      } else {
        setHuntToaster(false)
        setResultToaster(false)
      }
      setTabValue(val)
    } else if (
      (planDetails?.status != 'ABORTED' ||
        planDetails?.status == 'COMPLETE' ||
        messages?.request_status == 'completed') &&
      planDetails &&
      val == 2
    ) {
      fetchWssData(planDetails)
      setResultToaster(false)
      setHuntToaster(false)
      setTabValue(2)
      if (planDetails?.status != 'COMPLETE') {
        dispatch(ThreatbriefStatus(token, id) as any).then((res: any) => {
          if (res.type == 'THREATBRIEFS_GET_DETAIL_SUCCESS') {
            setPlanDetails(res?.payload)
          }
        })
      }
    }
  }

  useEffect(() => {
    if (messages?.request_status == 'completed') {
      setTabValue(3)
      setSummaryValue(messages?.data?.result)
      if (planDetails?.status != 'COMPLETE') {
        dispatch(ThreatbriefStatus(token, id) as any).then((res: any) => {
          if (res.type == 'THREATBRIEFS_GET_DETAIL_SUCCESS') {
            setPlanDetails(res?.payload)
          }
        })
      }
    } else {
    }
  }, [messages])

  const huntSummary = () => {
    dispatch(HuntReportSummaryView(planDetails?.threatbriefId, planDetails?.uuid) as any).then(
      async (respons: any) => {
        if (respons.type == 'REPORT_SUMMARY_GET_DETAIL_SUCCESS') {
          var reader = new FileReader()
          reader.onload = function (e) {
            const blob = new Blob([respons?.payload], { type: 'application/pdf' })
            const fileURL = URL.createObjectURL(blob)
            const downloadLink = document.createElement('a')
            downloadLink.href = fileURL
            downloadLink.download = 'threat_Hunt_Report-Vidar.pdf '
            downloadLink.click()
            window.open(fileURL)
            URL.revokeObjectURL(fileURL)
          }
          reader.readAsDataURL(respons.payload)
        }
      },
    )
  }

  const StopExecution = () => {
    dispatch(ExecuteHuntStop(planDetails?.threatbriefId, planDetails?.uuid) as any).then(
      (res: any) => {
        if (res.type == 'EXECUTE_HUNT_STOP_SUCCESS') {
          setTabValue(1)
          fetchNodeView()
          setHuntFaild('our previous execution was interrupted.please initiate a new hunt')
          setPlanDetails(res?.payload)
          setHuntToaster(true)
        } else {
        }
      },
    )
  }

  return (
    <>
      <div style={{ height: '68vh', width: '100%' }}>
        <div className='flex justify-center items-center mt-3'>
          <div className='w-[50%] flex justify-start items-center'>
            <span onClick={() => handleTabChange(1)} className={`cursor-pointer`}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='129'
                height='36'
                viewBox='0 0 129 36'
                fill='none'
              >
                <path
                  d='M0 4C0 1.79086 1.79086 0 4 0H112.241C113.385 0 114.475 0.490082 115.234 1.3463L127.647 15.3463C128.99 16.8607 128.99 19.1393 127.647 20.6537L115.234 34.6537C114.475 35.5099 113.385 36 112.241 36H4C1.79086 36 0 34.2091 0 32V4Z'
                  fill={tabValue === 1 ? '#054D80' : ''}
                  stroke={tabValue === 2 || tabValue === 3 ? '#054D80' : ''}
                  stroke-width={tabValue === 2 || tabValue === 3 ? '2' : ''}
                />
                <text
                  x='50%'
                  y='50%'
                  dominant-baseline='middle'
                  text-anchor='middle'
                  fill='white'
                  font-size='14'
                >
                  Plan
                </text>
              </svg>
            </span>
            <span onClick={() => handleTabChange(2)} className={`cursor-pointer`}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='129'
                height='38'
                viewBox='0 0 129 38'
                fill='none'
              >
                <path
                  d='M1.95887 4.32873C0.812378 3.03893 1.72799 1 3.45369 1H111.244C112.387 1 113.475 1.48859 114.234 2.34254L126.678 16.3425C128.025 17.8581 128.025 20.1419 126.678 21.6575L114.234 35.6575C113.475 36.5114 112.387 37 111.244 37H3.4537C1.728 37 0.812378 34.9611 1.95887 33.6713L12.6378 21.6575C13.985 20.1419 13.985 17.8581 12.6378 16.3425L1.95887 4.32873Z'
                  fill={tabValue === 2 ? '#054D80' : ''}
                  stroke={tabValue === 1 || tabValue === 3 ? '#054D80' : ''}
                  stroke-width={tabValue === 1 || tabValue === 3 ? '2' : ''}
                />
                <text
                  x='50%'
                  y='50%'
                  dominant-baseline='middle'
                  text-anchor='middle'
                  fill='white'
                  font-size='14'
                >
                  Execute
                </text>
              </svg>
            </span>
            <span onClick={() => handleTabChange(3)} className={`cursor-pointer`}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='131'
                height='38'
                viewBox='0 0 131 38'
                fill='none'
              >
                <path
                  d='M1.95887 4.32873C0.812378 3.03893 1.72799 1 3.45369 1L125.04 1C127.249 1 129.04 2.79086 129.04 5V19V33C129.04 35.2091 127.249 37 125.04 37H3.45369C1.72799 37 0.812378 34.9611 1.95887 33.6713L12.6378 21.6575C13.985 20.1419 13.985 17.8581 12.6378 16.3425L1.95887 4.32873Z'
                  fill={tabValue === 3 ? '#054D80' : ''}
                  stroke={tabValue === 1 || tabValue === 2 ? '#054D80' : ''}
                  stroke-width={tabValue === 1 || tabValue === 2 ? '2' : ''}
                />
                <text
                  x='50%'
                  y='50%'
                  dominant-baseline='middle'
                  text-anchor='middle'
                  fill='white'
                  font-size='14'
                >
                  Result
                </text>
              </svg>
            </span>
          </div>
          <div className='w-[50%] flex justify-end items-center gap-[16px]'>
            {tabValue === 1 && planeNodeView ? (
              <button
                type='button'
                className='text-[#fff] bg-[#EE7103] px-[18px] py-[8px] rounded-lg flex justify-center items-center gap-[8px]'
                onClick={handleExcute}
              >
                <span className='text-[#fff]'>Execute</span>
                <span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 16 16'
                    fill='none'
                  >
                    <path
                      d='M3.3335 3.32642C3.3335 2.67898 3.3335 2.35526 3.46849 2.17681C3.58609 2.02135 3.76584 1.92515 3.96043 1.91353C4.18379 1.9002 4.45314 2.07977 4.99184 2.4389L12.0022 7.11248C12.4473 7.40923 12.6699 7.55761 12.7475 7.74462C12.8153 7.90813 12.8153 8.09188 12.7475 8.25538C12.6699 8.4424 12.4473 8.59077 12.0022 8.88752L4.99184 13.5611C4.45314 13.9202 4.18379 14.0998 3.96043 14.0865C3.76584 14.0749 3.58609 13.9787 3.46849 13.8232C3.3335 13.6447 3.3335 13.321 3.3335 12.6736V3.32642Z'
                      stroke='white'
                      stroke-width='1.5'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                </span>
              </button>
            ) : tabValue === 2 && planDetails?.status != 'COMPLETE' ? (
              <button
                type='button'
                className='text-[#fff] bg-[#D92D20] px-[18px] py-[8px] rounded-lg flex justify-center items-center gap-[8px]'
                onClick={StopExecution}
              >
                <span className='text-[#fff]'>Stop Execution</span>
                <span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 16 16'
                    fill='none'
                  >
                    <path
                      d='M3.28659 3.28671L12.7133 12.7134M14.6666 8.00004C14.6666 11.6819 11.6818 14.6667 7.99992 14.6667C4.31802 14.6667 1.33325 11.6819 1.33325 8.00004C1.33325 4.31814 4.31802 1.33337 7.99992 1.33337C11.6818 1.33337 14.6666 4.31814 14.6666 8.00004Z'
                      stroke='white'
                      stroke-width='1.5'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                </span>
              </button>
            ) : tabValue === 3 && summaryValue ? (
              <button
                type='button'
                className='text-[#fff] bg-[#EE7103] px-[18px] py-[8px] rounded-lg flex justify-center items-center gap-[8px]'
                onClick={huntSummary}
              >
                <span className='text-[#fff]'>View Hunt Summary</span>
                <span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='14'
                    height='16'
                    viewBox='0 0 14 16'
                    fill='none'
                  >
                    <path
                      d='M8.33335 1.51306V4.26676C8.33335 4.64012 8.33335 4.82681 8.40602 4.96942C8.46993 5.09486 8.57192 5.19684 8.69736 5.26076C8.83997 5.33342 9.02665 5.33342 9.40002 5.33342H12.1537M8.33335 11.3334H4.33335M9.66669 8.66671H4.33335M12.3334 6.65886V11.4667C12.3334 12.5868 12.3334 13.1469 12.1154 13.5747C11.9236 13.951 11.6177 14.257 11.2413 14.4487C10.8135 14.6667 10.2535 14.6667 9.13335 14.6667H4.86669C3.74658 14.6667 3.18653 14.6667 2.75871 14.4487C2.38238 14.257 2.07642 13.951 1.88467 13.5747C1.66669 13.1469 1.66669 12.5868 1.66669 11.4667V4.53337C1.66669 3.41327 1.66669 2.85322 1.88467 2.42539C2.07642 2.04907 2.38238 1.74311 2.75871 1.55136C3.18653 1.33337 3.74658 1.33337 4.86669 1.33337H7.00787C7.49705 1.33337 7.74164 1.33337 7.97182 1.38863C8.17589 1.43763 8.37098 1.51844 8.54992 1.62809C8.75176 1.75178 8.92471 1.92473 9.27061 2.27063L11.3961 4.39612C11.742 4.74202 11.9149 4.91497 12.0386 5.1168C12.1483 5.29575 12.2291 5.49084 12.2781 5.69491C12.3334 5.92509 12.3334 6.16968 12.3334 6.65886Z'
                      stroke='white'
                      stroke-width='1.5'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                </span>
              </button>
            ) : null}
          </div>
        </div>

        {tabValue === 1 ? (
          <>
            {planeNodeView && <HuntPlanExecute planeNodeView={planeNodeView} />}
            {!planeNodeView && (
              <div
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  justifyItems: 'center',
                  marginTop: 80,
                }}
              >
                <div>
                  <div>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='animate-spin'
                      width='200'
                      height='200'
                      viewBox='0 0 25 24'
                      fill='none'
                    >
                      <path
                        d='M12.5 2V6M12.5 18V22M6.5 12H2.5M22.5 12H18.5M19.5784 19.0784L16.75 16.25M19.5784 4.99994L16.75 7.82837M5.42157 19.0784L8.25 16.25M5.42157 4.99994L8.25 7.82837'
                        stroke='#EE7103'
                        stroke-width='1.67'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : tabValue === 2 &&
          planDetails &&
          (planDetails?.status != 'FAILED' || planDetails?.status != 'ABORTED') ? (
          <>
            {messages && !loader && (
              <HuntExecuteFlow messages={messages} planDetails={planDetails} />
            )}
            {!messages && loader && (
              <div
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  justifyItems: 'center',
                  marginTop: 80,
                }}
              >
                <div>
                  <div>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='animate-spin'
                      width='200'
                      height='200'
                      viewBox='0 0 25 24'
                      fill='none'
                    >
                      <path
                        d='M12.5 2V6M12.5 18V22M6.5 12H2.5M22.5 12H18.5M19.5784 19.0784L16.75 16.25M19.5784 4.99994L16.75 7.82837M5.42157 19.0784L8.25 16.25M5.42157 4.99994L8.25 7.82837'
                        stroke='#EE7103'
                        stroke-width='1.67'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          tabValue === 3 &&
          (planDetails?.status == 'COMPLETE' || messages?.request_status == 'completed') && (
            <>
              {summaryValue && <HuntResult planDetails={planDetails} summaryValue={summaryValue} />}
              {!summaryValue && (
                <div
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    justifyItems: 'center',
                    marginTop: 80,
                  }}
                >
                  <div>
                    <div>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='animate-spin'
                        width='200'
                        height='200'
                        viewBox='0 0 25 24'
                        fill='none'
                      >
                        <path
                          d='M12.5 2V6M12.5 18V22M6.5 12H2.5M22.5 12H18.5M19.5784 19.0784L16.75 16.25M19.5784 4.99994L16.75 7.82837M5.42157 19.0784L8.25 16.25M5.42157 4.99994L8.25 7.82837'
                          stroke='#EE7103'
                          stroke-width='1.67'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </>
          )
        )}
      </div>
    </>
  )
}

export default HuntPlan
