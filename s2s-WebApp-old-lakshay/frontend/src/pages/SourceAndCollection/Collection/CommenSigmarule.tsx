import React, { useEffect, useState } from 'react'
import CommenRuleTable from './CommenRuleTable'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  getcollectionidRuleFiles,
  getinboxCollection,
} from '../../../redux/nodes/Collections/action'

function CommenSigmarule() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [filterState, setFilterState] = React.useState([] as any)
  const [deletvale, setdeletvale] = React.useState(null as any)
  const [reloading, setReLoading] = useState(false)
  const [inboxList, setInboxList] = useState([] as any)

  useEffect(() => {
    fetchdetails()
    dispatch(getinboxCollection() as any).then((res: any) => {
      if (res?.type == 'INBOX_COLLECTION_GET_SUCCESS') {
        setInboxList(res.payload)
      }
    })
  }, [id])

  useEffect(() => {
    if (deletvale == 'delete') {
      fetchdetails()
    }
  }, [deletvale])

  const fetchdetails = () => {
    setReLoading(true)
    dispatch(getcollectionidRuleFiles(id) as any).then((data: any) => {
      if (data?.type == 'COLLECTION_ID_GET_SUCCESS') {
        setdeletvale(null)
        const updatedReports: any = data.payload
          ?.sort(
            (a: any, b: any) =>
              new Date(b.uploadDatetime).getTime() - new Date(a.uploadDatetime).getTime(),
          )
          ?.map((report: any) =>
            report.sourceType === 'CTI'
              ? {
                  ...report,
                  srctype: 'CTI REPORT',
                  author:
                    report.source == 'FACTORY_SIGMAHQ'
                      ? 'Sigma HQ'
                      : report.source == 'GENERATED'
                      ? 'System Two Security'
                      : '',
                }
              : {
                  ...report,
                  srctype: '',
                  author:
                    report.source == 'FACTORY_SIGMAHQ'
                      ? 'Sigma HQ'
                      : report.source == 'GENERATED'
                      ? 'System Two Security'
                      : '',
                },
          )
        setFilterState(updatedReports)
        setReLoading(false)
      }
    })
  }
  return (
    <div className='mt-[-25px] w-full'>
      <CommenRuleTable
        tablelist={filterState}
        paramsdata={'commensigmarule'}
        setdeletvale={setdeletvale}
        reloading={reloading}
        inboxList={inboxList}
      />
    </div>
  )
}

export default CommenSigmarule
