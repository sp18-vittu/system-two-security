import { Tooltip, TooltipProps, tooltipClasses } from '@mui/material'
import { makeStyles, styled } from '@mui/styles'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import '../../assets/styles/markdown.css'
import local from '../../utils/local'
import { createChat } from '../../redux/nodes/chatPage/action'
import { getAllThreatbrief } from '../../redux/nodes/threatBriefs/action'
import { allCtiSourceVault, ctiSourceVault } from '../../redux/nodes/SourceAndCollections/action'

function Homepage() {
  const navigateTo = useNavigate()
  const dispatch = useDispatch()
  const dash = local.getItem('dashBoard')
  const dashdata = JSON?.parse(dash ? dash : '{}')

  const [datas, setDatas] = useState([] as any)
  const [articles, setArticles] = useState([] as any)
  const [metrics, setMetrics] = useState([] as any)
  const [trends, setTrends] = useState([] as any)
  const [counter, setCounter] = useState([])
  const [threatBriefList, setThreatBriefList] = useState([] as any)
  const [ctiReportList, setCtiReportList] = useState([] as any)

  useEffect(() => {
    const findOne = dashdata?.metrics?.find((x: any) => x.counter)
    localStorage.setItem('counter', findOne?.counter)
    setCounter(findOne?.counter.split(''))
    setDatas(dashdata?.reports)
    setArticles(dashdata?.articles)
    setMetrics(dashdata?.metrics)
    setTrends(dashdata?.trends)
    getThreatBrief()
    dispatch(ctiSourceVault() as any).then((ress: any) => {
      if (ress?.payload?.id) {
        dispatch(allCtiSourceVault() as any).then((res: any) => {
          if (res?.type == 'GET_ALL_CTI_REPORTS_SUCCESS')
            if (res?.payload && res?.payload?.length > 0) {
              const datas: any =
                res?.payload?.length > 0
                  ? res?.payload?.find((x: any) => x.id == ress?.payload?.id)
                  : []

              const updatedReports: any = datas?.ctiReports.filter((report: any) => {
                return (
                  report.status == 'COMPLETE' &&
                  report?.intelCount?.data?.SIGMA > 0 &&
                  report.reportSource == 'WEB'
                )
              })
              const huntoftheDay: any =
                res?.payload?.length > 0
                  ? res?.payload?.find((x: any) => x?.s3Folder == 'HUNT_OF_THE_DAY')
                  : []
              const overAllCti: any = [...updatedReports, ...huntoftheDay?.ctiReports]
              setCtiReportList(overAllCti)
            }
        })
      }
    })
  }, [])

  const getThreatBrief = () => {
    dispatch(getAllThreatbrief() as any)
      .then((response: any) => {
        if (response.type === 'GET_THREAT_BRIEF_SUCCESS') {
          setThreatBriefList(response.payload)
        }
      })
      .catch((err: any) => console.log('err', err))
  }

  const getCount = (countValue: any) => {
    let getValue: any = localStorage.getItem('counter')
    const totalPrice = countValue?.find((x: any) => x.counter)
    let y = getValue ? getValue : totalPrice.counter
    let x = ((Number(y) + Number(totalPrice.increment)) as any).toString().padStart(5, '0')
    localStorage.setItem('counter', x)
    let countArray: any = x.split('')
    setCounter(countArray)
  }

  useEffect(() => {
    if (metrics?.length > 0) {
      const intervalCall = setInterval(() => {
        getCount(metrics)
      }, 90000)
      return () => {
        clearInterval(intervalCall)
      }
    }
  }, [metrics])

  function capitalizeFirstLetter(name: string): string {
    if (!name) return ''
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
  }
  const goToSigma = (report: any) => {
    const ruledata: any = ctiReportList?.find((x: any) => x.id == Number(report?.ctiReportId))
    if (ruledata) {
      navigateTo(`/app/repoinsightspages/${ruledata?.id}`, {
        state: {
          title: capitalizeFirstLetter(ruledata?.ctiName.replace(/-/g, ' ')),
          tab: 2,
          singleparams: ruledata,
        },
      })
      sessionStorage.setItem('insightdata', JSON.stringify(ruledata))
      sessionStorage.setItem('active', 'sources')
    }
  }

  const goToSelectCtiReport = (value: any) => {
    let selectFiles = ctiReportList.find((x: any) => x.id == value.ctiReportId)
    if (selectFiles) {
      const selectReport = {
        reportId: selectFiles?.id,
        ruleId: 0,
        mitreLocation: selectFiles?.mitreLocation,
        globalVault: selectFiles?.global,
        vaultId: value?.vaultId,
      }
      let chatObj: any = {
        sessionName: selectFiles.ctiName,
      }
      dispatch(createChat(selectReport, chatObj) as any).then((response: any) => {
        if (response.type == 'CREATE_CHAT_SUCCESS') {
          sessionStorage.setItem('active', 'Chats')
          navigateTo(`/app/chatworkbench/${response.payload.id}`, { state: selectFiles })
        }
      })
    }
  }

  const handletextclick = (data: any) => {
    if (data.action === 'threatbrief') {
      const briefList: any = threatBriefList?.find((x: any) => x?.id == data?.id)
      navigateTo(`/app/insightspages/${briefList?.id}`, {
        state: { title: briefList?.name, paramsdata: 'insite', vaultId: briefList?.id },
      })
      sessionStorage.setItem('threat', JSON.stringify(briefList))
      sessionStorage.setItem('active', 'sources')
    } else if (data.action === 'openchat') {
      window.open(
        'https://www.mandiant.com/sites/default/files/2021-09/rpt-apt38-2018-web_v5-1.pdf',
      )
    } else if (data.action === 'newchat') {
      window.open('https://strapi.eurepoc.eu/uploads/Eu_Repo_C_APT_profile_Turla_c9c7d8ed38.pdf')
    }
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundImage: `url(${trends?.bodyImg})`,
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
      width: '100%',
      height: '100%',
    },
  }))
  const classes = useStyles()
  const CustomWidthTooltip1 = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      position: 'relative',
      maxWidth: datas?.length > 6 && datas?.length < 10 ? 140 : datas?.length > 9 ? 100 : 10,
    },
  })

  const CustomWidthTooltip3 = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      position: 'relative',
      maxWidth:
        articles?.length > 6 && articles?.length < 10 ? 140 : articles?.length > 9 ? 100 : 10,
    },
  })

  return (
    <div className='p-4' style={{ overflowX: 'clip' }}>
      {/* *********************************** 1 row **************************************  */}
      <div className={`flex flex-wrap gap-2 `}>
        {datas?.map((report: any, index: number) => (
          <>
            <div key={index} className='flex  grow flex-col relative justify-around  h-[17vh]'>
              <div
                className='relative rounded-xl h-[21vh] '
                style={{
                  backgroundImage: `url(${report?.bodyImg})`,
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  width: '100%',
                  height: '100%',
                }}
              >
                <div className='text-white absolute top-[1rem] left-[1.3rem] '>
                  <div className='text-white'>
                    <CustomWidthTooltip1 title={datas?.length > 6 ? report?.displayText : ''}>
                      <div
                        className={
                          datas.length > 6 && datas.length < 10
                            ? ' text-xs w-[20%] truncate  '
                            : datas.length > 9
                            ? ' text-xs w-[19%] truncate '
                            : '  text-base'
                        }
                      >
                        <a
                          className='underline decoration-1 hover:decoration-[yellow] hover:text-[yellow]'
                          href={report?.url}
                          target='_blank'
                        >
                          {report.displayText}
                        </a>
                      </div>
                    </CustomWidthTooltip1>
                  </div>
                </div>
                <div className='flex text-white cursor-pointer  absolute bottom-[1rem] left-[1.3rem] '>
                  <div className='flex' onClick={() => goToSigma(report)}>
                    <span
                      className={
                        datas.length > 7
                          ? ' text-xs w-[64%] truncate hover:text-[yellow] underline decoration-1 hover:decoration-[yellow]'
                          : ' text-sm hover:text-[yellow] underline decoration-1 hover:decoration-[yellow]'
                      }
                    >
                      View Rules{' '}
                    </span>
                    <span className={datas.length > 9 ? 'px-0' : 'px-2'}>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='18'
                        height='18'
                        viewBox='0 0 18 18'
                        fill='none'
                      >
                        <path
                          d='M17.142 8.97496H13.933M4.308 8.97496H1.09998M9.1205 4.17288V0.971802M9.1205 16.9781V13.777M15.5375 8.97496C15.5375 12.5112 12.6644 15.3781 9.1205 15.3781C5.57657 15.3781 2.70446 12.5112 2.70446 8.97496C2.70446 5.43871 5.57657 2.57187 9.1205 2.57187C12.6644 2.57187 15.5375 5.43871 15.5375 8.97496Z'
                          stroke='white'
                          stroke-width='1.66667'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                      </svg>
                    </span>
                  </div>
                  <div className='flex ml-[3.5rem] ' onClick={() => goToSelectCtiReport(report)}>
                    <span
                      className={
                        datas.length > 7
                          ? ' text-xs w-[64%] truncate hover:text-[yellow] underline decoration-1 hover:decoration-[yellow]'
                          : ' text-sm hover:text-[yellow] underline decoration-1 hover:decoration-[yellow]'
                      }
                    >
                      Chat with Workbench{' '}
                    </span>
                    <span className={datas.length > 9 ? 'px-0' : 'px-2'}>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='flex-shrink-0 w-5 h-5 mr-2 text-white-500 transition duration-75 group-hover:text-white-900 '
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                      >
                        <path
                          d='M10 15L6.92474 18.1137C6.49579 18.548 6.28131 18.7652 6.09695 18.7805C5.93701 18.7938 5.78042 18.7295 5.67596 18.6076C5.55556 18.4672 5.55556 18.162 5.55556 17.5515V15.9916C5.55556 15.444 5.10707 15.0477 4.5652 14.9683V14.9683C3.25374 14.7762 2.22378 13.7463 2.03168 12.4348C2 12.2186 2 11.9605 2 11.4444V6.8C2 5.11984 2 4.27976 2.32698 3.63803C2.6146 3.07354 3.07354 2.6146 3.63803 2.32698C4.27976 2 5.11984 2 6.8 2H14.2C15.8802 2 16.7202 2 17.362 2.32698C17.9265 2.6146 18.3854 3.07354 18.673 3.63803C19 4.27976 19 5.11984 19 6.8V11M19 22L16.8236 20.4869C16.5177 20.2742 16.3647 20.1678 16.1982 20.0924C16.0504 20.0255 15.8951 19.9768 15.7356 19.9474C15.5558 19.9143 15.3695 19.9143 14.9969 19.9143H13.2C12.0799 19.9143 11.5198 19.9143 11.092 19.6963C10.7157 19.5046 10.4097 19.1986 10.218 18.8223C10 18.3944 10 17.8344 10 16.7143V14.2C10 13.0799 10 12.5198 10.218 12.092C10.4097 11.7157 10.7157 11.4097 11.092 11.218C11.5198 11 12.0799 11 13.2 11H18.8C19.9201 11 20.4802 11 20.908 11.218C21.2843 11.4097 21.5903 11.7157 21.782 12.092C22 12.5198 22 13.0799 22 14.2V16.9143C22 17.8462 22 18.3121 21.8478 18.6797C21.6448 19.1697 21.2554 19.5591 20.7654 19.762C20.3978 19.9143 19.9319 19.9143 19 19.9143V22Z'
                          stroke='white'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>

      {/* *********************************** 2 row **************************************  */}
      <div className='grid grid-cols-3 grid-row-3 gap-4 py-2 h-[40vh] '>
        <div className={classes.root + ' rounded-lg col-span-2 relative h-[38vh]'}>
          <div className={'text-white absolute text-xl top-[6%] left-[46.7%]  '}>
            <h1>{trends?.headerText}</h1>
          </div>
          <div>
            {trends &&
              trends?.bodyTexts?.map((text: any, index: any) => (
                <div
                  className={`text-white cursor-pointer text-base absolute  left-[48%] ${
                    index === 0 ? 'top-[27%]' : index === 1 ? 'top-[51%]' : 'top-[75%]'
                  } `}
                  key={index}
                >
                  <button
                    className='underline decoration-1 hover:decoration-[yellow] hover:text-[yellow]'
                    onClick={() => handletextclick(text)}
                  >
                    {text?.displayText}
                  </button>
                </div>
              ))}
          </div>
        </div>

        <div className='text-white  flex flex-wrap gap-2 relative '>
          {metrics?.map((metric: any, index: any) => (
            <div
              className=' rounded-xl px-5 bg-[#1D2939] flex w-1/3 grow flex-col relative justify-around '
              key={index}
              style={{
                backgroundImage: `url(${metric?.bodyImg})`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <>
                <span className='flex justify-between'>
                  <span
                    style={{
                      backgroundImage: `url(${metric.icon})`,
                      backgroundSize: '100% 100%',
                      backgroundRepeat: 'no-repeat',
                      width: metric.counter ? '40px' : '30px',
                      height: metric.counter ? '40px' : '30px',
                    }}
                  ></span>

                  <span className=''>
                    {metric.counter ? (
                      <>
                        {counter.map((item: any, index: any) => (
                          <span key={index} className='bg-[#ee7103] px-2 mx-0.5 text-2xl'>
                            {item}
                          </span>
                        ))}
                        <div className='flex justify-center'>
                          <span className='text-[15px]'>Sigma Rules</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className='text-2xl font-extrabold '>{metric.value}</span>
                      </>
                    )}
                  </span>
                </span>
                <span className='text-xl truncate'>{metric.displayText}</span>
              </>
            </div>
          ))}
        </div>
      </div>

      {/* *********************************** 3 row **************************************  */}
      <div className={`flex flex-wrap gap-2 `}>
        {articles?.map((article: any, index: number) => (
          <>
            <div key={index} className='flex  grow flex-col relative  justify-around  h-[17vh]'>
              <div
                className='relative rounded-xl h-[21vh] '
                style={{
                  backgroundImage: `url(${article?.bodyImg})`,
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  width: '100%',
                  height: '100%',
                }}
              >
                <div className='text-white absolute top-[1rem] left-[1.3rem]'>
                  <div className='text-white'>
                    <CustomWidthTooltip3 title={articles?.length > 6 ? article.articleName : ''}>
                      <div
                        className={
                          articles.length > 6 && articles.length < 10
                            ? ' text-xs w-[20%] truncate '
                            : articles.length > 9
                            ? ' text-xs w-[19%] truncate '
                            : ' text-base'
                        }
                      >
                        <a
                          className='underline decoration-1 hover:decoration-[yellow] hover:text-[yellow]'
                          href={article?.articleUrl}
                          target='_blank'
                        >
                          {article.articleName}
                        </a>
                      </div>
                    </CustomWidthTooltip3>
                  </div>
                </div>
                <div className='flex text-white absolute bottom-[1rem] left-[1.3rem]'>
                  <span className={articles.length > 7 ? ' text-xs w-[64%] truncate ' : ' text-sm'}>
                    {article.articleReporter}
                  </span>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  )
}

export default Homepage
