import React, { useEffect, useState } from 'react'
import { insightCardList } from '../../../redux/nodes/insight/action'
import local from '../../../utils/local'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { sigmaCitNameList } from '../../../redux/nodes/sigma-files/action'
import RepoInsightsacordion from './RepoInsightsacordion'
import { repoinsightFilter } from '../../../redux/nodes/overviewSigma/action'
import ReactMarkdown from 'react-markdown'
import RepoInsightsPagesRule from './RepoInsightsPagesRule'
import CircularProgress from '@mui/material/CircularProgress'
import useWindowResolution from '../../../layouts/Dashboard/useWindowResolution'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/styles'
import { useData } from '../../../layouts/shared/DataProvider'
import { createChat } from '../../../redux/nodes/chatPage/action'

function RepoInsightsPages() {
  const { id } = useParams()
  const [isExpanded, setIsExpanded] = useState(false)
  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }
  const navigateTo = useNavigate()
  const dispatch = useDispatch()
  const insight = sessionStorage.getItem('insightdata')
  const insightcard = JSON.parse(insight as any)
  const localToken = local.getItem('bearerToken')
  const token = JSON.parse(localToken as any)
  const [insightdata, setinsightdata] = useState(null as any)
  const [error, setError] = useState(null)
  const [reportdata, setreportdata] = useState(null as any)
  const [ctisigmaFiles, setctisigmaFiles] = useState([] as any)
  const [activeTab, setActiveTab] = useState<any>(1)
  const [filterState, setFilterState] = React.useState([] as any)
  const { height } = useWindowResolution()
  const dynamicHeight = Math.max(400, height * 0.8)
  const location = useLocation()
  const { state } = location
  const { singleparams } = state
  const [loader, setLoader] = useState(true as any)
  const [ruleloader, setRuleLoader] = useState(true as any)

  const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: '#f1f1f1',
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f1f1f1',
      color: '#1D2939',
      fontWeight: 400,
      fontSize: 12,
    },
  }))

  const tabs = [
    { id: 1, name: 'Insights', isActive: activeTab === 1 },
    { id: 2, name: `Sigma (${filterState.length})`, isActive: activeTab === 2 },
  ]

  const renderers = {
    text: ({ children }: any) => <span className='font-medium text-base'>{children}</span>,
  }

  useEffect(() => {
    dispatch(insightCardList(token, insightcard) as any).then((res: any) => {
      if (res?.type === 'INSIGHT_CARD_DETAIL_SUCCESS') {
        setLoader(false)
        setinsightdata(res?.payload)
      } else if (res?.type === 'INSIGHT_CARD_DETAIL_FAILED') {
        setLoader(false)
        setError(res?.payload)
      }
    })
    dispatch(sigmaCitNameList(token, insightcard) as any).then((res: any) => {
      setreportdata(res?.payload?.length)
      setctisigmaFiles(res.payload)
    })
    dispatch(repoinsightFilter(id, singleparams) as any)
      .then((res: any) => {
        setRuleLoader(true)
        if (res.type == 'REPO_SIGMA_SUCCESS') {
          setRuleLoader(false)
          setFilterState(res.payload)
        }
      })
      .catch((err: any) => console.log('err', err))
  }, [])

  useEffect(() => {
    setActiveTab(state.tab)
  }, [state.tab])

  const markdown = insightdata?.details?.report_info?.key_takeaways
    .map((item: any) => `- ${item}`)
    .join('\n')

  const threat_actors: any = insightdata?.details?.threat_actors.map((row: any) => {
    return { name: row.name }
  })

  const removeDuplicates = (array: { name: string }[]) => {
    const uniqueNames = new Set<string>()
    return array?.filter((item) => {
      if (!uniqueNames.has(item.name)) {
        uniqueNames.add(item.name)
        return true
      }
      return false
    })
  }

  const threat_actors_alias = removeDuplicates(threat_actors)
  const { setCtiFileName }: any = useData()

  const handleNavigate = async () => {
    setCtiFileName(state?.singleparams)
    sessionStorage.setItem('createNewChat', JSON.stringify({ createNewChat: true }))
    const chatObj = { sessionName: state.singleparams?.ctiName }
    const selectFiles = {
      vaultId: state?.singleparams?.datavault?.id,
      id: state?.singleparams?.id,
      urlSHA256: state?.singleparams?.urlSHA256,
      mitreLocation: null,
      global: false,
      sessionItem: true,
    }
    dispatch(createChat(selectFiles, chatObj) as any).then((response: any) => {
      if (response.type == 'CREATE_CHAT_SUCCESS') {
        navigateTo(`/app/chatworkbench/${response.payload.id}`, { state: selectFiles })
        sessionStorage.setItem('active', 'Chats')
      }
    })
  }

  useEffect(() => {
    if (loader) {
      setTimeout(() => {
        setLoader(false)
      }, 5000)
    }
  }, [loader])

  const threatActorsArray = singleparams?.threatActors?.split(',')

  return (
    <div className='w-full relative flex flex-col items-start p-2 '>
      <div className='flex justify-between items-center px-6 w-full'>
        <div className='left-24  flex border-b border-[#3E4B5D] space-x-3 bg-[#0C111D]'>
          {singleparams?.status == 'COMPLETE' &&
          (!singleparams?.intelCount?.data?.SIGMA || singleparams?.intelCount?.data?.SIGMA >= 0) &&
          singleparams?.intelCount?.data?.TTPs >= 0 &&
          singleparams?.intelCount?.data?.IOC >= 0 &&
          singleparams?.intelCount?.data?.CVEs >= 0 ? (
            <>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-2 ${
                    tab.isActive ? 'border-b-[3px] border-[#EE7103] text-white' : 'text-[#98A2B3]'
                  } font-medium text-sm`}
                >
                  {tab.name}
                </button>
              ))}
            </>
          ) : (
            <button className={`${'border-b-2 border-white text-white'} font-medium text-sm`}>
              {`Rules (${filterState.length})`}
            </button>
          )}
        </div>
        {activeTab == 1 && (
          <button
            onClick={() => handleNavigate()}
            className={`bg-orange-500 text-white px-6 md:px-8 lg:px-12 py-1 rounded-lg shadow-sm hover:bg-[#6941C6] transition`}
          >
            ASK
          </button>
        )}
      </div>

      {activeTab == 1 && (
        <>
          {insightdata ? (
            <>
              <>
                <div className='mx-auto shadow-lg w-full  p-6 '>
                  {insightdata ? (
                    <div className='grid grid-cols-12 gap-2'>
                      {/* Left Side: Threat Summary */}
                      <div
                        className='col-span-4 overflow-y-scroll scrollbar-hide max-lg:col-span-12 max-lg:!max-h-[unset] max-lg:overflow-y-auto'
                        style={{ maxHeight: `calc(${dynamicHeight}px - 20px)` }}
                      >
                        <div className='w-full h-auto p-8 bg-[#1D2939] rounded-md flex flex-col justify-start gap-5'>
                          {/* Summary Section (Always visible) */}
                          <h2 className='text-white text-2xl font-semibold leading-5 break-words ml-1'>
                            Summary
                          </h2>

                          {/* Key Points Section (Expandable) */}
                          <div
                            className={`flex flex-col justify-start items-start gap-2 overflow-hidden transition-all duration-300 ${
                              isExpanded ? 'h-auto' : 'max-h-[500px] max-lg:max-h-[200px]'
                            }`}
                          >
                            <ul>
                              {/* Render Summary */}
                              {insightdata && insightdata.details.report_info.summary && (
                                <li className='flex justify-start items-center'>
                                  <ReactMarkdown
                                    components={{ text: renderers.text }}
                                    className='font-medium font-inter text-base text-[#98A2B3] markDown-ThreadBreif'
                                  >
                                    {insightdata.details.report_info.summary}
                                  </ReactMarkdown>
                                </li>
                              )}

                              {/* Render Key Takeaways */}
                              <div className='mt-2'>
                                <h2 className='text-white text-2xl font-semibold leading-5 break-words mr-4'>
                                  Key Takeaways
                                </h2>
                                <ReactMarkdown
                                  components={{
                                    ul: ({ node, ...props }) => (
                                      <ul
                                        className='font-medium font-inter text-base text-[#98A2B3] list-disc ml-6 mt-4'
                                        {...props}
                                      />
                                    ),
                                    li: ({ node, ...props }) => (
                                      <li
                                        className='font-medium font-inter text-base text-[#98A2B3] mb-2 mt-4'
                                        {...props}
                                      />
                                    ),
                                  }}
                                >
                                  {markdown}
                                </ReactMarkdown>
                              </div>
                            </ul>

                            <div className='flex flex-col justify-start items-start gap-2 mt-4'>
                              <h3 className='text-white text-lg font-semibold leading-[20px] font-inter'>
                                Link
                              </h3>
                              <a
                                href={insightdata?.details?.report_info?.url}
                                target='_blanck'
                                className='w-[570px] text-[#609BFF] text-base font-normal leading-[20px] break-words font-inter'
                              >
                                <BootstrapTooltip
                                  title={insightdata?.details?.report_info?.url}
                                  placement='top'
                                >
                                  {insightdata?.details?.report_info?.url}
                                </BootstrapTooltip>
                              </a>
                            </div>

                            <div className='flex flex-col justify-start items-start gap-2 mt-4'>
                              <div className='flex justify-between items-center w-[452.33px] h-[20px]'>
                                <h3 className='text-white text-lg font-semibold leading-[20px] font-inter'>
                                  Threat Actors
                                </h3>
                              </div>

                              <p className='w-[452.33px] text-[#98A2B3] text-base font-normal leading-[20px] break-words font-inter'>
                                {insightdata && threat_actors_alias?.length && (
                                  <div className='flex flex-col gap-4'>
                                    <div className='text-[#98A2B3] text-base font-normal leading-5'>
                                      {threatActorsArray?.length > 0 && (
                                        <>
                                          <>
                                            <div className='grid grid-cols-3 gap-4'>
                                              {threatActorsArray?.map((alias: any, index: any) => (
                                                <BootstrapTooltip title={alias} placement='top'>
                                                  {alias ? (
                                                    <div
                                                      key={index}
                                                      className='truncate cursor-pointer'
                                                    >
                                                      • {alias}
                                                    </div>
                                                  ) : (
                                                    <div
                                                      key={index}
                                                      className='truncate cursor-pointer'
                                                    >
                                                      N/A
                                                    </div>
                                                  )}
                                                </BootstrapTooltip>
                                              ))}
                                            </div>
                                          </>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </p>
                            </div>

                            <div className='self-stretch border-t border-[#3E4B5D] mt-2'></div>
                            <div className='flex justify-start items-start gap-6 self-stretch h-14 mt-4'>
                              <div className='flex-1 flex flex-col justify-start items-start gap-4'>
                                <span className='text-[#98A2B3] text-base font-normal leading-[20px] font-inter'>
                                  Rules
                                </span>
                                <span className='text-white text-2xl font-semibold leading-[20px] font-inter'>
                                  {filterState?.length}
                                </span>
                              </div>
                              <div className='flex-1 flex flex-col justify-start items-start gap-4'>
                                <span className='text-[#98A2B3] text-base font-normal leading-[20px] font-inter'>
                                  TTPs
                                </span>
                                <span className='text-white text-2xl font-semibold leading-[20px] font-inter'>
                                  {insightdata?.counts?.attack_patterns || 0}
                                </span>
                              </div>
                              <div className='flex-1 flex flex-col justify-start items-start gap-4'>
                                <span className='text-[#98A2B3] text-base font-normal leading-[20px] font-inter'>
                                  IOCs
                                </span>
                                <span className='text-white text-2xl font-semibold leading-[20px] font-inter'>
                                  {insightdata?.counts?.indicators?.total || 0}
                                </span>
                              </div>
                              <div className='flex-1 flex flex-col justify-start items-start gap-4'>
                                <span className='text-[#98A2B3] text-base font-normal leading-[20px] font-inter'>
                                  CVEs
                                </span>
                                <span className='text-white text-2xl font-semibold leading-[20px] font-inter'>
                                  {insightdata?.counts?.vulnerabilities || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                          {!isExpanded && (
                            <>
                              <div className='self-stretch border-t border-[#3E4B5D]'></div>
                              <div className='flex justify-start items-start gap-6 self-stretch h-6'>
                                <div className='flex-1 flex flex-col justify-start items-start gap-4'>
                                  <span className='text-[#98A2B3] text-base font-normal leading-[20px] font-inter'>
                                    Rules
                                  </span>
                                  <span className='text-white text-2xl font-semibold leading-[20px] font-inter'>
                                    {filterState?.length}
                                  </span>
                                </div>
                                <div className='flex-1 flex flex-col justify-start items-start gap-4'>
                                  <span className='text-[#98A2B3] text-base font-normal leading-[20px] font-inter'>
                                    TTPs
                                  </span>
                                  <span className='text-white text-2xl font-semibold leading-[20px] font-inter'>
                                    {insightdata?.counts?.attack_patterns || 0}
                                  </span>
                                </div>
                                <div className='flex-1 flex flex-col justify-start items-start gap-4'>
                                  <span className='text-[#98A2B3] text-base font-normal leading-[20px] font-inter'>
                                    IOCs
                                  </span>
                                  <span className='text-white text-2xl font-semibold leading-[20px] font-inter'>
                                    {insightdata?.counts?.indicators?.total || 0}
                                  </span>
                                </div>
                                <div className='flex-1 flex flex-col justify-start items-start gap-4'>
                                  <span className='text-[#98A2B3] text-base font-normal leading-[20px] font-inter'>
                                    CVEs
                                  </span>
                                  <span className='text-white text-2xl font-semibold leading-[20px] font-inter'>
                                    {insightdata?.counts?.vulnerabilities || 0}
                                  </span>
                                </div>
                              </div>
                            </>
                          )}
                          {/* Learn More Button */}
                          <button
                            onClick={toggleExpand}
                            className='flex justify-end items-end gap-2 text-[#EE7103] text-lg font-semibold leading-6 mt-4'
                          >
                            {isExpanded ? 'Close' : 'Learn More'}
                          </button>
                        </div>
                      </div>

                      <div
                        className='col-span-8 overflow-y-scroll max-lg:col-span-12 max-lg:!max-h-[unset] max-lg:overflow-y-auto'
                        style={{ maxHeight: `calc(${dynamicHeight}px - 20px)` }}
                      >
                        <RepoInsightsacordion
                          error={error}
                          insightdata={insightdata}
                          reportdata={reportdata}
                          insightcard={insightcard}
                          ctisigmaFiles={ctisigmaFiles}
                        />
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </>
            </>
          ) : (
            <>
              {loader ? (
                <div className='flex items-center justify-center min-h-screen mt-[-200px] ml-[900px]'>
                  <CircularProgress size='3rem' sx={{ color: '#EE7103' }} />
                </div>
              ) : (
                <div
                  className='flex items-center justify-center min-h-screen mt-[-200px] ml-[900px] text-white'
                  style={{ maxHeight: `calc(${dynamicHeight}px - 75px)` }}
                >
                  Data Not Available
                </div>
              )}
            </>
          )}
        </>
      )}

      {activeTab == 2 && (
        <>
          <RepoInsightsPagesRule
            tablelist={filterState}
            paramsdata={'ctisigma'}
            setdeletvale={() => {}}
            loader={ruleloader}
          />
        </>
      )}
    </div>
  )
}

export default RepoInsightsPages
