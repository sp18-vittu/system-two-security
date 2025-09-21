import React, { useEffect, useState } from 'react'
import InsightsPages from './InsightsPages'
import AttackGraph from './AttackGraph'
import { useDispatch } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import local from '../../../utils/local'
import { repositoryDocList } from '../../../redux/nodes/repository/action'
import { getThreatBriefSummary } from '../../../redux/nodes/threatBriefs/action'
import InsightsPagesRule from './InsightsPagesRule'

function InsightsPagesHomePages() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState<any>(1)
  const [filterState, setFilterState] = React.useState([] as any)
  const dispatch = useDispatch()
  const [brief, setBrief] = useState(null as any)
  const [loader, setLoader] = useState(true as any)
  const [deletvale, setdeletvale] = React.useState(null as any)
  const location = useLocation()
  const { state } = location
  const tabs = [
    { id: 1, label: 'Insights', value: 'Insights', isActive: activeTab === 1 },
    { id: 2, label: `Sigma (${filterState?.length})`, value: 'Sigma', isActive: activeTab === 2 },
    { id: 3, label: 'Attack Graph', value: 'AttackGraph', isActive: activeTab === 3 },
  ]

  const threat = sessionStorage.getItem('threat')
  const threatValue = JSON.parse(threat as any)
  const Token = local.getItem('bearerToken')
  const token = JSON.parse(Token as any)

  useEffect(() => {
    dispatch(getThreatBriefSummary(id) as any)
      .then((response: any) => {
        if (response && response.type === 'GET_THREAT_BRIEF_SUMMARY_SUCCESS') {
          if (Object.keys(response.payload).length > 0)
            response.payload.mitres.mitreJson =
              'https://mitre-attack.github.io/attack-navigator/#layerURL=' +
              response.payload.mitres.mitreJson
          setBrief(response.payload)
          setLoader(false)
        }
      })
      .catch((err: any) => console.log('err', err))
    fetchdetails()
  }, [id])

  const fetchdetails = () => {
    dispatch(repositoryDocList(token, threatValue) as any).then((res: any) => {
      if (res.type == 'REPOSITORY_DOC_SUCCESS') {
        setFilterState(res.payload)
      }
    })
  }

  useEffect(() => {
    if (deletvale == 'delete') {
      fetchdetails()
    }
  }, [deletvale])

  useEffect(() => {
    if (loader) {
      setTimeout(() => {
        setLoader(false)
      }, 5000)
    }
  }, [loader])

  useEffect(() => {
    if (state?.tab) {
      setActiveTab(state.tab)
    } else {
      setActiveTab(1)
    }
  }, [state?.tab])

  return (
    <div className='relative w-full'>
      <div className='flex justify-between items-center px-6'>
        <div className='left-24  flex border-b border-[#3E4B5D] space-x-3 bg-[#0C111D]'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 ${
                tab.isActive ? 'border-b-[3px] border-[#EE7103] text-white' : 'text-[#98A2B3]'
              } font-medium text-sm`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab == 1 && <InsightsPages brief={brief} loader={loader} />}
      {activeTab == 2 && (
        <InsightsPagesRule
          tablelist={filterState}
          paramsdata={'ctisigma'}
          setdeletvale={setdeletvale}
          loader={loader}
        />
      )}

      {activeTab == 3 && <AttackGraph brief={brief} />}
    </div>
  )
}

export default InsightsPagesHomePages
