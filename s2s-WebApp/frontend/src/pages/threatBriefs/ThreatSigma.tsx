import { Box, Menu, Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material'
import { DataGrid, GridColDef, gridClasses } from '@mui/x-data-grid'
import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { environment } from '../../environment/environment'
import { feedlyGet } from '../../redux/nodes/feedlyform/action'
import {
  SingleTranslateFileList,
  TargetFileList,
  getExecuteQuery,
} from '../../redux/nodes/py-sigma/action'
import {
  CREATE_VIEWFILE_VAULT_FAILED,
  CREATE_VIEWFILE_VAULT_SUCCESS,
  repositoryDocList,
} from '../../redux/nodes/repository/action'
import local from '../../utils/local'
import YamlEditor from '../datavault/YamlEditor'
import YamlEditorForView from '../datavault/YamlEditorForView'
import YamlTextEditor from '../datavault/YamlTextEditor'
import YamlTextEditorForQuery from '../datavault/YamlTextEditorForQuery'
import useWindowResolution from '../../layouts/Dashboard/useWindowResolution'
import api from '../../redux/nodes/api'

const yaml = require('js-yaml')

const ThreatSigma = () => {
  const { id } = useParams()
  const { width, height } = useWindowResolution()
  const dispatch = useDispatch()
  const threat = sessionStorage.getItem('threat')
  const threatValue = JSON.parse(threat as any)

  const [filterState, setFilterState] = React.useState([] as any)
  const [openView, setopenView] = useState(false)

  const [mode, setMode] = useState('view')

  const Token = local.getItem('bearerToken')
  const token = JSON.parse(Token as any)

  useEffect(() => {
    fetchdetails()
  }, [id])

  const [anchorE6, setAnchorE6] = React.useState(null)
  const opendot = Boolean(anchorE6)

  const handleClosing = () => {
    setAnchorE6(null)
  }

  const CustomNoRowsOverlay = () => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#FFF',
          backgroundColor: '#0C111D',
          padding: '16px',
          textAlign: 'center',
          height: '340px',
        }}
      >
        <div>No rows</div>
      </div>
    )
  }

  // *********************Translate part*************************

  const [plateFormName, setPlateFormName] = useState('' as any)
  const [splunkValue, setSplunkValue] = useState(null as any)
  const [queryExecute, setqueryExecute] = useState(false)
  const [singlequery, setSinglequery] = useState(null as any)
  const [queryValue, setQueryValue] = useState(null as any)
  const [translateDownload, setTranslateDownload] = useState(true)
  const [singletargetId, setSingletargetId] = useState(null as any)
  const [istranslating, setIsTranslating] = useState(false)
  const [reloading, setReLoading] = useState(false)

  const fetchdetails = () => {
    setReLoading(true)
    dispatch(repositoryDocList(token, threatValue) as any).then((res: any) => {
      if (res.type == 'REPOSITORY_DOC_SUCCESS') {
        setFilterState(res.payload)
        setReLoading(false)
      }
    })
  }

  const handleClickTargersingle = (e: any) => {
    if (e.target.value) {
      setDisable(false)
      setSingletargetId(e.target.value)
    } else {
      setDisable(true)
      setSingletargetId(null)
    }
  }

  const handleSingleTranslatClick = () => {
    setSinglequery('Translation of your sigma file(s) is in progress...')
    setclosePopupDisable(true)
    setDisable(true)
    setTranslateDownload(true)
    setIsTranslating(true)
    let obj = {
      docId: singleparams.id,
      target: singletargetId.toLowerCase(),
    }
    setTimeout(() => {
      dispatch(SingleTranslateFileList(obj, singleparams) as any).then((response: any) => {
        if (response.type === 'SINGLE_TRANSLATE_FILE_SUCCESS') {
          if (response.payload.query) {
            setDisable(false)
            setIsTranslating(false)
            setclosePopupDisable(false)
            setTranslateDownload(false)
            setSinglequery(
              'Your translation request is now completed. You can download the queries by clicking on the download icon.\n \n' +
                'Your Translated Query.\n ' +
                '\n' +
                response.payload.query,
            )
          } else if (response.payload.query == '') {
            setclosePopupDisable(false)
            setSinglequery('Error: The conversion of your sigma rule to the intended query failed')
          }
          fetchdetails()
        }
      })
    }, 5000)
  }

  const singleTranslateDownload = async () => {
    try {
      let obj: any = {
        docIds: [singleparams.id],
      }

      const { data } = await Axios.post(
        `${environment.baseUrl}/data/pysigma/download-all-queries`,
        obj,
        {
          responseType: 'blob',
          headers: {
            Authorization: `${token.bearerToken}`,
          },
          params: { global: singleparams.global },
        },
      )

      var reader = new FileReader()
      reader.onload = function (e) {
        const blob = new Blob([data], { type: 'application/zip' })
        const fileURL = URL.createObjectURL(blob)

        const downloadLink = document.createElement('a')
        downloadLink.href = fileURL
        downloadLink.download = `s2s-download-superadmin@default.systemtwosecurity.zip`
        downloadLink.click()
        URL.revokeObjectURL(fileURL)
      }
      reader.readAsDataURL(data)
    } catch (err) {
      console.log('err', err)
    }
  }

  const handleQueryExecute = (e: any) => {
    setqueryExecute(true)
    setDisable(true)
    setclosePopupDisable(true)

    dispatch(getExecuteQuery({ target: plateFormName, query: queryValue }) as any)
      .then((res: any) => {
        if (res.type == 'GET_EXECUTE_QUERY_FAILED') {
          setSinglequery((prevValue: any) => {
            setqueryExecute(false)
            setDisable(false)
            setclosePopupDisable(false)
            return (
              prevValue +
              '\n' +
              '\n' +
              '\n' +
              '\n' +
              'Response' +
              '\n' +
              '\n' +
              'Query execution failed. Please check your input and SIEM settings, then try again. If the issue persists, please reach out to support for assistance.'
            )
          })
        } else {
          let fileName = singleparams?.name
          let file = new File([res.payload], fileName)
          const reader = new FileReader()
          let jsonBlock: any = null

          reader.onload = (e: any) => {
            const fileText = e.target.result
            jsonBlock = JSON.parse(fileText)
            const formattedJson = JSON.stringify(jsonBlock, null, 4)
            setTimeout(() => {
              setSinglequery((prevValue: any) => {
                setqueryExecute(false)
                setDisable(false)
                setclosePopupDisable(false)
                return (
                  prevValue + '\n' + '\n' + '\n' + '\n' + 'Response' + '\n' + '\n' + formattedJson
                )
              })
            }, 5000)
          }
          reader.readAsText(file)
        }
      })
      .catch((err: any) => console.log('err', err))
  }

  // *********************View Image part*************************

  const [singleparams, setSingleparams] = useState(null as any)

  const [selectTargers, setSelectTargers] = React.useState([])

  const handleClickdot = (event: any, params: any) => {
    setSingleparams(params)
    setAnchorE6(event.currentTarget)
  }

  const onTitleViewimage = async (e: any, params: any, type: any) => {
    setYmlText('')
    setopenView(type == 'view' ? true : false)
    setMode(type !== 'view' ? type : null)
    setAnchorE6(null)
    try {
      await api
        .get(`/data/document/${params.id}`, {
          responseType: 'blob',
          headers: {
            Authorization: `${token.bearerToken}`,
          },
          params: { global: params.global },
        })
        .then((respons: any) => {
          let fileName = params.name
          let file = new File([respons.data], fileName)
          const reader = new FileReader()
          reader.onload = (e: any) => {
            const fileText = e.target.result
            const parsedJSON = yaml.load(fileText)
            const final_value = JSON.stringify(parsedJSON, null, 2)
            setYmlText(fileText)
            setSampleKPMG(true)
          }
          reader.readAsText(file)
        })
      dispatch({ type: CREATE_VIEWFILE_VAULT_SUCCESS })
    } catch (error: any) {
      dispatch({ type: CREATE_VIEWFILE_VAULT_FAILED, payload: error.message })
    }
  }

  const onViewimage = async (e: any, params: any, type: any) => {
    setYmlText('')
    setopenView(type == 'view' ? true : false)
    setMode(type !== 'view' ? type : null)
    setAnchorE6(null)
    try {
      await api
        .get(`/data/document/${singleparams.id}`, {
          responseType: 'blob',
          headers: {
            Authorization: `${token.bearerToken}`,
          },
          params: { global: singleparams.global },
        })
        .then((respons: any) => {
          let fileName = singleparams.name
          let file = new File([respons.data], fileName)
          const reader = new FileReader()

          reader.onload = (e: any) => {
            const fileText = e.target.result
            const parsedJSON = yaml.load(fileText)
            const final_value = JSON.stringify(parsedJSON, null, 2)
            setYmlText(fileText)
            setSampleKPMG(true)
          }

          reader.readAsText(file)
        })
      dispatch({ type: CREATE_VIEWFILE_VAULT_SUCCESS })
    } catch (error: any) {
      dispatch({ type: CREATE_VIEWFILE_VAULT_FAILED, payload: error.message })
    }
    dispatch(TargetFileList() as any).then((data: any) => {
      setSelectTargers(data.payload)
    })
  }

  const [closePopupDisable, setclosePopupDisable] = useState(false)
  const [disable, setDisable] = useState(true)
  const [SampleKPMG, setSampleKPMG] = useState(false)

  const [ymltext, setYmlText] = useState(null as any)

  const [showPopover, setShowPopover] = useState(false)
  const [copyText, setCopyText] = useState(null as any)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(copyText)
    setShowPopover(true)
    setTimeout(() => {
      setShowPopover(false)
    }, 2000)
  }

  const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(() => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: '#fff',
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#fff',
      color: '#000',
    },
  }))

  const onViewimageTargt = async (
    e: any,
    params: any,
    type: any,
    target: any,
    platformName: string,
  ) => {
    setSampleKPMG(true)
    setPlateFormName(platformName)
    setMode(type)
    setAnchorE6(null)
    let obj = {
      docId: params.id,
      target: target.toLowerCase(),
    }
    feedgetmethod()
    dispatch(SingleTranslateFileList(obj, params) as any).then((response: any) => {
      if (response.payload.query) {
        setDisable(false)
        setSinglequery(response.payload.query)
        setQueryValue(response.payload.query)
      } else if (response.payload.query == '') {
        setSinglequery('Error: Failed to retrieve query')
        setQueryValue('Error: Failed to retrieve query')
      }
    })
  }

  const feedgetmethod = () => {
    dispatch(feedlyGet() as any).then((respons: any) => {
      if (respons.type === 'GET_FEEDLY_FORM_SUCCESS') {
        respons.payload.forEach((eachValue: any) => {
          if (eachValue.sourceName === 'Splunk') {
            setSplunkValue(eachValue)
          }
        })
      }
    })
  }

  const singleFileDownload = async () => {
    try {
      const { data } = await api.get(`/data/document/${singleparams.id}`, {
        responseType: 'blob',
        headers: {
          Authorization: `${token.bearerToken}`,
        },
        params: { global: singleparams.global },
      })
      var reader = new FileReader()
      reader.onload = function (e) {
        const blob = new Blob([data], { type: 'text/html' })
        const fileURL = URL.createObjectURL(blob)
        const downloadLink = document.createElement('a')
        downloadLink.href = fileURL
        downloadLink.download = singleparams.name
        downloadLink.click()
        URL.revokeObjectURL(fileURL)
      }
      reader.readAsDataURL(data)
    } catch (err) {
      console.log('err', err)
    }
  }

  const columns: GridColDef | any = [
    {
      field: 'name',
      headerName: 'Sigma Files',
      flex: 1,
      minWidth: 200,
      sortable: false,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      renderCell: (params: any) => {
        return (
          <>
            <span className='relative'>
              {params?.row?.name.split('.')[1]?.toUpperCase() === 'PDF' ? (
                <svg
                  width='25'
                  height='25'
                  viewBox='0 0 40 40'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M7.75 4C7.75 2.20508 9.20508 0.75 11 0.75H27C27.1212 0.75 27.2375 0.798159 27.3232 0.883885L38.1161 11.6768C38.2018 11.7625 38.25 11.8788 38.25 12V36C38.25 37.7949 36.7949 39.25 35 39.25H11C9.20507 39.25 7.75 37.7949 7.75 36V4Z'
                    fill='white'
                    stroke='#D0D5DD'
                    strokeWidth='1.5'
                  />
                  <path
                    d='M27 0.5V8C27 10.2091 28.7909 12 31 12H38.5'
                    stroke='#D0D5DD'
                    strokeWidth='1.5'
                  />
                  <rect x='1' y='18' width='26' height='16' rx='2' fill='#D92D20' />
                  <path
                    d='M4.8323 30V22.7273H7.70162C8.25323 22.7273 8.72316 22.8326 9.11142 23.0433C9.49967 23.2517 9.7956 23.5417 9.9992 23.9134C10.2052 24.2827 10.3082 24.7088 10.3082 25.1918C10.3082 25.6747 10.204 26.1009 9.99565 26.4702C9.78732 26.8395 9.48547 27.1271 9.09011 27.3331C8.69712 27.5391 8.22127 27.642 7.66255 27.642H5.83372V26.4098H7.41397C7.7099 26.4098 7.95375 26.3589 8.14551 26.2571C8.33964 26.1529 8.48405 26.0097 8.57875 25.8274C8.67581 25.6428 8.72434 25.4309 8.72434 25.1918C8.72434 24.9503 8.67581 24.7396 8.57875 24.5597C8.48405 24.3774 8.33964 24.2365 8.14551 24.1371C7.95138 24.0353 7.70517 23.9844 7.40687 23.9844H6.36994V30H4.8323ZM13.885 30H11.3069V22.7273H13.9063C14.6379 22.7273 15.2676 22.8729 15.7955 23.1641C16.3235 23.4529 16.7295 23.8684 17.0136 24.4105C17.3 24.9527 17.4433 25.6013 17.4433 26.3565C17.4433 27.1141 17.3 27.7652 17.0136 28.3097C16.7295 28.8542 16.3211 29.272 15.7884 29.5632C15.2581 29.8544 14.6237 30 13.885 30ZM12.8445 28.6825H13.8211C14.2757 28.6825 14.658 28.602 14.9681 28.4411C15.2806 28.2777 15.515 28.0256 15.6713 27.6847C15.8299 27.3414 15.9092 26.8987 15.9092 26.3565C15.9092 25.8191 15.8299 25.38 15.6713 25.0391C15.515 24.6982 15.2818 24.4472 14.9717 24.2862C14.6615 24.1252 14.2792 24.0447 13.8247 24.0447H12.8445V28.6825ZM18.5823 30V22.7273H23.3976V23.995H20.1199V25.728H23.078V26.9957H20.1199V30H18.5823Z'
                    fill='white'
                  />
                </svg>
              ) : params?.row?.name.split('.')[1]?.toUpperCase() === 'JSON' ? (
                <svg
                  width='25'
                  height='25'
                  viewBox='0 0 40 40'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M7.75 4C7.75 2.20508 9.20508 0.75 11 0.75H27C27.1212 0.75 27.2375 0.798159 27.3232 0.883885L38.1161 11.6768C38.2018 11.7625 38.25 11.8788 38.25 12V36C38.25 37.7949 36.7949 39.25 35 39.25H11C9.20507 39.25 7.75 37.7949 7.75 36V4Z'
                    fill='white'
                    stroke='#D0D5DD'
                    strokeWidth='1.5'
                  />
                  <path
                    d='M27 0.5V8C27 10.2091 28.7909 12 31 12H38.5'
                    stroke='#D0D5DD'
                    strokeWidth='1.5'
                  />
                  <rect x='1' y='18' width='34' height='16' rx='2' fill='#444CE7' />
                  <path
                    d='M7.82821 22.7273H9.3481V27.7983C9.3481 28.267 9.24275 28.6742 9.03205 29.0199C8.82372 29.3655 8.53371 29.6319 8.16202 29.8189C7.79033 30.0059 7.35828 30.0994 6.86586 30.0994C6.42788 30.0994 6.03016 30.0225 5.67267 29.8686C5.31756 29.7124 5.03584 29.4756 4.8275 29.1584C4.61917 28.8388 4.51619 28.4375 4.51855 27.9545H6.04909C6.05383 28.1463 6.09289 28.3108 6.16628 28.4482C6.24204 28.5831 6.34502 28.6873 6.47523 28.7607C6.60781 28.8317 6.76406 28.8672 6.94398 28.8672C7.13337 28.8672 7.29318 28.8269 7.42338 28.7464C7.55596 28.6636 7.65658 28.5429 7.72523 28.3842C7.79389 28.2256 7.82821 28.0303 7.82821 27.7983V22.7273ZM14.5647 24.8189C14.5363 24.5324 14.4144 24.3099 14.199 24.1513C13.9835 23.9927 13.6911 23.9134 13.3218 23.9134C13.0709 23.9134 12.859 23.9489 12.6862 24.0199C12.5133 24.0885 12.3808 24.1844 12.2884 24.3075C12.1985 24.4306 12.1535 24.5703 12.1535 24.7266C12.1488 24.8568 12.176 24.9704 12.2352 25.0675C12.2967 25.1645 12.3808 25.2486 12.4873 25.3196C12.5938 25.3883 12.7169 25.4486 12.8566 25.5007C12.9963 25.5504 13.1454 25.593 13.3041 25.6286L13.9575 25.7848C14.2747 25.8558 14.5659 25.9505 14.8311 26.0689C15.0962 26.1873 15.3258 26.3329 15.52 26.5057C15.7141 26.6785 15.8644 26.8821 15.971 27.1165C16.0799 27.3509 16.1355 27.6196 16.1379 27.9226C16.1355 28.3677 16.0219 28.7536 15.797 29.0803C15.5744 29.4046 15.2525 29.6567 14.8311 29.8366C14.412 30.0142 13.9066 30.103 13.3147 30.103C12.7276 30.103 12.2162 30.013 11.7806 29.8331C11.3474 29.6532 11.0088 29.3868 10.765 29.0341C10.5235 28.679 10.3969 28.2398 10.385 27.7166H11.873C11.8895 27.9605 11.9594 28.1641 12.0825 28.3274C12.2079 28.4884 12.3749 28.6103 12.5832 28.6932C12.7939 28.7737 13.0318 28.8139 13.297 28.8139C13.5574 28.8139 13.7835 28.776 13.9752 28.7003C14.1694 28.6245 14.3197 28.5192 14.4262 28.3842C14.5328 28.2493 14.586 28.0942 14.586 27.919C14.586 27.7557 14.5375 27.6184 14.4404 27.5071C14.3457 27.3958 14.2061 27.3011 14.0214 27.223C13.8391 27.1449 13.6154 27.0739 13.3502 27.0099L12.5583 26.8111C11.9452 26.6619 11.461 26.4287 11.1059 26.1115C10.7508 25.7943 10.5744 25.367 10.5768 24.8295C10.5744 24.3892 10.6916 24.0045 10.9284 23.6754C11.1675 23.3464 11.4954 23.0895 11.912 22.9048C12.3287 22.7202 12.8022 22.6278 13.3325 22.6278C13.8722 22.6278 14.3434 22.7202 14.7458 22.9048C15.1507 23.0895 15.4655 23.3464 15.6904 23.6754C15.9153 24.0045 16.0313 24.3857 16.0384 24.8189H14.5647ZM23.8554 26.3636C23.8554 27.1567 23.705 27.8314 23.4044 28.3878C23.1061 28.9441 22.6989 29.3691 22.1828 29.6626C21.6691 29.9538 21.0914 30.0994 20.4498 30.0994C19.8035 30.0994 19.2235 29.9527 18.7098 29.6591C18.1961 29.3655 17.79 28.9406 17.4917 28.3842C17.1934 27.8279 17.0443 27.1544 17.0443 26.3636C17.0443 25.5705 17.1934 24.8958 17.4917 24.3395C17.79 23.7831 18.1961 23.3594 18.7098 23.0682C19.2235 22.7746 19.8035 22.6278 20.4498 22.6278C21.0914 22.6278 21.6691 22.7746 22.1828 23.0682C22.6989 23.3594 23.1061 23.7831 23.4044 24.3395C23.705 24.8958 23.8554 25.5705 23.8554 26.3636ZM22.2964 26.3636C22.2964 25.8499 22.2195 25.4167 22.0656 25.0639C21.9141 24.7112 21.6998 24.4437 21.4229 24.2614C21.1459 24.0791 20.8215 23.9879 20.4498 23.9879C20.0782 23.9879 19.7538 24.0791 19.4768 24.2614C19.1998 24.4437 18.9844 24.7112 18.8305 25.0639C18.679 25.4167 18.6032 25.8499 18.6032 26.3636C18.6032 26.8774 18.679 27.3106 18.8305 27.6634C18.9844 28.0161 19.1998 28.2836 19.4768 28.4659C19.7538 28.6482 20.0782 28.7393 20.4498 28.7393C20.8215 28.7393 21.1459 28.6482 21.4229 28.4659C21.6998 28.2836 21.9141 28.0161 22.0656 27.6634C22.2195 27.3106 22.2964 26.8774 22.2964 26.3636ZM31.0775 22.7273V30H29.7494L26.5853 25.4226H26.532V30H24.9944V22.7273H26.3438L29.483 27.3011H29.547V22.7273H31.0775Z'
                    fill='white'
                  />
                </svg>
              ) : params?.row?.name.split('.')[1]?.toUpperCase() === 'HTML' ? (
                <svg
                  width='25'
                  height='25'
                  viewBox='0 0 40 40'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M7.75 4C7.75 2.20508 9.20508 0.75 11 0.75H27C27.1212 0.75 27.2375 0.798159 27.3232 0.883885L38.1161 11.6768C38.2018 11.7625 38.25 11.8788 38.25 12V36C38.25 37.7949 36.7949 39.25 35 39.25H11C9.20507 39.25 7.75 37.7949 7.75 36V4Z'
                    fill='white'
                    stroke='#D0D5DD'
                    strokeWidth='1.5'
                  />
                  <path
                    d='M27 0.5V8C27 10.2091 28.7909 12 31 12H38.5'
                    stroke='#D0D5DD'
                    strokeWidth='1.5'
                  />
                  <rect x='1' y='18' width='35' height='16' rx='2' fill='#444CE7' />
                  <path
                    d='M4.64968 30V22.7273H6.18732V25.728H9.30877V22.7273H10.8429V30H9.30877V26.9957H6.18732V30H4.64968ZM11.8336 23.995V22.7273H17.8066V23.995H15.5801V30H14.0602V23.995H11.8336ZM18.7903 22.7273H20.6866L22.6895 27.6136H22.7747L24.7775 22.7273H26.6738V30H25.1824V25.2663H25.122L23.2399 29.9645H22.2243L20.3422 25.2486H20.2818V30H18.7903V22.7273ZM27.9407 30V22.7273H29.4783V28.7322H32.5962V30H27.9407Z'
                    fill='white'
                  />
                </svg>
              ) : params?.row?.name.split('.')[1]?.toUpperCase() === 'DOC' ||
                params?.row?.name.split('.')[1]?.toUpperCase() === 'DOCX' ? (
                <svg
                  width='25'
                  height='25'
                  viewBox='0 0 40 40'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M7.75 4C7.75 2.20508 9.20508 0.75 11 0.75H27C27.1212 0.75 27.2375 0.798159 27.3232 0.883885L38.1161 11.6768C38.2018 11.7625 38.25 11.8788 38.25 12V36C38.25 37.7949 36.7949 39.25 35 39.25H11C9.20507 39.25 7.75 37.7949 7.75 36V4Z'
                    fill='white'
                    stroke='#D0D5DD'
                    strokeWidth='1.5'
                  />
                  <path
                    d='M27 0.5V8C27 10.2091 28.7909 12 31 12H38.5'
                    stroke='#D0D5DD'
                    strokeWidth='1.5'
                  />
                  <rect x='1' y='18' width='29' height='16' rx='2' fill='#155EEF' />
                  <path
                    d='M7.40163 30H4.82351V22.7273H7.42294C8.15447 22.7273 8.78421 22.8729 9.31214 23.1641C9.84008 23.4529 10.2461 23.8684 10.5302 24.4105C10.8166 24.9527 10.9599 25.6013 10.9599 26.3565C10.9599 27.1141 10.8166 27.7652 10.5302 28.3097C10.2461 28.8542 9.83771 29.272 9.30504 29.5632C8.77474 29.8544 8.14027 30 7.40163 30ZM6.36115 28.6825H7.33771C7.79226 28.6825 8.1746 28.602 8.48473 28.4411C8.79723 28.2777 9.03161 28.0256 9.18786 27.6847C9.34647 27.3414 9.42578 26.8987 9.42578 26.3565C9.42578 25.8191 9.34647 25.38 9.18786 25.0391C9.03161 24.6982 8.79841 24.4472 8.48828 24.2862C8.17815 24.1252 7.79581 24.0447 7.34126 24.0447H6.36115V28.6825ZM18.7821 26.3636C18.7821 27.1567 18.6318 27.8314 18.3311 28.3878C18.0328 28.9441 17.6257 29.3691 17.1096 29.6626C16.5958 29.9538 16.0182 30.0994 15.3766 30.0994C14.7303 30.0994 14.1503 29.9527 13.6365 29.6591C13.1228 29.3655 12.7168 28.9406 12.4185 28.3842C12.1202 27.8279 11.9711 27.1544 11.9711 26.3636C11.9711 25.5705 12.1202 24.8958 12.4185 24.3395C12.7168 23.7831 13.1228 23.3594 13.6365 23.0682C14.1503 22.7746 14.7303 22.6278 15.3766 22.6278C16.0182 22.6278 16.5958 22.7746 17.1096 23.0682C17.6257 23.3594 18.0328 23.7831 18.3311 24.3395C18.6318 24.8958 18.7821 25.5705 18.7821 26.3636ZM17.2232 26.3636C17.2232 25.8499 17.1462 25.4167 16.9924 25.0639C16.8408 24.7112 16.6266 24.4437 16.3496 24.2614C16.0726 24.0791 15.7483 23.9879 15.3766 23.9879C15.0049 23.9879 14.6806 24.0791 14.4036 24.2614C14.1266 24.4437 13.9112 24.7112 13.7573 25.0639C13.6058 25.4167 13.53 25.8499 13.53 26.3636C13.53 26.8774 13.6058 27.3106 13.7573 27.6634C13.9112 28.0161 14.1266 28.2836 14.4036 28.4659C14.6806 28.6482 15.0049 28.7393 15.3766 28.7393C15.7483 28.7393 16.0726 28.6482 16.3496 28.4659C16.6266 28.2836 16.8408 28.0161 16.9924 27.6634C17.1462 27.3106 17.2232 26.8774 17.2232 26.3636ZM26.3381 25.2734H24.7827C24.7543 25.0722 24.6963 24.8935 24.6087 24.7372C24.5211 24.5786 24.4086 24.4437 24.2713 24.3324C24.134 24.2211 23.9754 24.1359 23.7955 24.0767C23.6179 24.0175 23.425 23.9879 23.2166 23.9879C22.8402 23.9879 22.5123 24.0814 22.233 24.2685C21.9536 24.4531 21.737 24.723 21.5831 25.0781C21.4292 25.4309 21.3523 25.8594 21.3523 26.3636C21.3523 26.8821 21.4292 27.3177 21.5831 27.6705C21.7393 28.0232 21.9571 28.2895 22.2365 28.4695C22.5159 28.6494 22.839 28.7393 23.206 28.7393C23.4119 28.7393 23.6025 28.7121 23.7777 28.6577C23.9553 28.6032 24.1127 28.5239 24.25 28.4197C24.3873 28.3132 24.5009 28.1842 24.5909 28.0327C24.6832 27.8812 24.7472 27.7083 24.7827 27.5142L26.3381 27.5213C26.2978 27.8551 26.1972 28.1771 26.0362 28.4872C25.8776 28.795 25.6634 29.0708 25.3935 29.3146C25.1259 29.5561 24.8063 29.7479 24.4347 29.8899C24.0653 30.0296 23.6475 30.0994 23.1811 30.0994C22.5324 30.0994 21.9524 29.9527 21.4411 29.6591C20.9321 29.3655 20.5296 28.9406 20.2337 28.3842C19.9401 27.8279 19.7933 27.1544 19.7933 26.3636C19.7933 25.5705 19.9425 24.8958 20.2408 24.3395C20.5391 23.7831 20.9439 23.3594 21.4553 23.0682C21.9666 22.7746 22.5419 22.6278 23.1811 22.6278C23.6025 22.6278 23.9931 22.687 24.353 22.8054C24.7152 22.9238 25.036 23.0966 25.3153 23.3239C25.5947 23.5488 25.822 23.8246 25.9972 24.1513C26.1747 24.478 26.2884 24.852 26.3381 25.2734Z'
                    fill='white'
                  />
                </svg>
              ) : params?.row?.name.split('.')[1]?.toUpperCase() === 'TXT' ? (
                <svg
                  width='25'
                  height='25'
                  viewBox='0 0 40 40'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M7.75 4C7.75 2.20508 9.20508 0.75 11 0.75H27C27.1212 0.75 27.2375 0.798159 27.3232 0.883885L38.1161 11.6768C38.2018 11.7625 38.25 11.8788 38.25 12V36C38.25 37.7949 36.7949 39.25 35 39.25H11C9.20507 39.25 7.75 37.7949 7.75 36V4Z'
                    fill='white'
                    stroke='#D0D5DD'
                    strokeWidth='1.5'
                  />
                  <path
                    d='M27 0.5V8C27 10.2091 28.7909 12 31 12H38.5'
                    stroke='#D0D5DD'
                    strokeWidth='1.5'
                  />
                  <rect x='1' y='18' width='27' height='16' rx='2' fill='#344054' />
                  <path
                    d='M4.60121 23.995V22.7273H10.5742V23.995H8.34766V30H6.82777V23.995H4.60121ZM12.9996 22.7273L14.4663 25.206H14.5231L15.9968 22.7273H17.7333L15.5138 26.3636L17.783 30H16.0146L14.5231 27.5178H14.4663L12.9748 30H11.2134L13.4897 26.3636L11.256 22.7273H12.9996ZM18.4293 23.995V22.7273H24.4023V23.995H22.1758V30H20.6559V23.995H18.4293Z'
                    fill='white'
                  />
                </svg>
              ) : params?.row?.name.split('.')[1]?.toUpperCase() === 'URL' ? (
                <svg
                  width='25'
                  height='25'
                  viewBox='0 0 40 40'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M20 3.33325C25 6.66658 26.5379 13.82 26.6667 19.9999C26.5379 26.1799 25 33.3333 20 36.6666M20 3.33325C15 6.66659 13.4621 13.82 13.3333 19.9999C13.4621 26.1799 15 33.3333 20 36.6666M20 3.33325C10.7952 3.33325 3.33333 10.7952 3.33333 19.9999M20 3.33325C29.2047 3.33325 36.6667 10.7952 36.6667 19.9999M20 36.6666C29.2047 36.6666 36.6667 29.2047 36.6667 19.9999M20 36.6666C10.7953 36.6666 3.33333 29.2047 3.33333 19.9999M36.6667 19.9999C33.3333 24.9999 26.1799 26.5378 20 26.6666C13.8201 26.5378 6.66666 24.9999 3.33333 19.9999M36.6667 19.9999C33.3333 14.9999 26.1799 13.462 20 13.3333C13.8201 13.462 6.66666 14.9999 3.33333 19.9999'
                    stroke='#7F56D9'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              ) : params?.row?.name.split('.')?.includes('yml') ? (
                <svg
                  width='25'
                  height='25'
                  viewBox='0 0 48 48'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M7.75 12C7.75 10.2051 9.20508 8.75 11 8.75H27C27.1212 8.75 27.2375 8.79816 27.3232 8.88388L38.1161 19.6768C38.2018 19.7625 38.25 19.8788 38.25 20V44C38.25 45.7949 36.7949 47.25 35 47.25H11C9.20507 47.25 7.75 45.7949 7.75 44V12Z'
                    fill='white'
                    stroke='#D0D5DD'
                    stroke-width='1.5'
                  />
                  <path
                    d='M27 8.5V16C27 18.2091 28.7909 20 31 20H38.5'
                    stroke='#D0D5DD'
                    stroke-width='1.5'
                  />
                  <rect x='0.5' y='26' width='35' height='16' rx='2' fill='#444CE7' />
                  <path
                    d='M3.80167 30.7273H5.52397L7.18235 33.8594H7.25337L8.91175 30.7273H10.6341L7.98136 35.429V38H6.45437V35.429L3.80167 30.7273ZM11.9853 38H10.3375L12.8482 30.7273H14.8297L17.3368 38H15.6891L13.8674 32.3892H13.8105L11.9853 38ZM11.8823 35.1413H15.7743V36.3416H11.8823V35.1413ZM18.2122 30.7273H20.1085L22.1113 35.6136H22.1966L24.1994 30.7273H26.0957V38H24.6042V33.2663H24.5439L22.6618 37.9645H21.6461L19.764 33.2486H19.7037V38H18.2122V30.7273ZM27.3626 38V30.7273H28.9002V36.7322H32.0181V38H27.3626Z'
                    fill='white'
                  />
                </svg>
              ) : params?.row?.name.split('.')?.includes('yaml') ? (
                <svg
                  width='25'
                  height='25'
                  viewBox='0 0 48 48'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M7.75 12C7.75 10.2051 9.20508 8.75 11 8.75H27C27.1212 8.75 27.2375 8.79816 27.3232 8.88388L38.1161 19.6768C38.2018 19.7625 38.25 19.8788 38.25 20V44C38.25 45.7949 36.7949 47.25 35 47.25H11C9.20507 47.25 7.75 45.7949 7.75 44V12Z'
                    fill='white'
                    stroke='#D0D5DD'
                    stroke-width='1.5'
                  />
                  <path
                    d='M27 8.5V16C27 18.2091 28.7909 20 31 20H38.5'
                    stroke='#D0D5DD'
                    stroke-width='1.5'
                  />
                  <rect x='0.5' y='26' width='35' height='16' rx='2' fill='#444CE7' />
                  <path
                    d='M3.80167 30.7273H5.52397L7.18235 33.8594H7.25337L8.91175 30.7273H10.6341L7.98136 35.429V38H6.45437V35.429L3.80167 30.7273ZM11.9853 38H10.3375L12.8482 30.7273H14.8297L17.3368 38H15.6891L13.8674 32.3892H13.8105L11.9853 38ZM11.8823 35.1413H15.7743V36.3416H11.8823V35.1413ZM18.2122 30.7273H20.1085L22.1113 35.6136H22.1966L24.1994 30.7273H26.0957V38H24.6042V33.2663H24.5439L22.6618 37.9645H21.6461L19.764 33.2486H19.7037V38H18.2122V30.7273ZM27.3626 38V30.7273H28.9002V36.7322H32.0181V38H27.3626Z'
                    fill='white'
                  />
                </svg>
              ) : (
                <></>
              )}
              {params.row.source == 'MANUAL_UPLOAD' && (
                <svg
                  className='absolute top-[-8px] right-[-12px]'
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                >
                  <path
                    d='M2.66683 10.8282C1.86284 10.29 1.3335 9.37347 1.3335 8.33333C1.3335 6.77095 2.52783 5.48753 4.05332 5.34625C4.36537 3.44809 6.01366 2 8.00016 2C9.98667 2 11.635 3.44809 11.947 5.34625C13.4725 5.48753 14.6668 6.77095 14.6668 8.33333C14.6668 9.37347 14.1375 10.29 13.3335 10.8282M5.3335 10.6667L8.00016 8M8.00016 8L10.6668 10.6667M8.00016 8V14'
                    stroke='white'
                    stroke-width='1.5'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
              )}
            </span>
            <div>
              <span
                onClick={(e) => onTitleViewimage(e, params.row, 'view')}
                className='px-5 font-medium font-extrabold !important cursor-pointer'
              >
                {' '}
                {params.row.title ? params.row.title : params.row.name}
              </span>{' '}
              <br />
              {params?.row?.documentSize && (
                <span className='px-5 font-medium'>
                  {params?.row?.documentSize >= 1
                    ? params?.row?.documentSize.toFixed(2) + 'KB'
                    : params?.row?.documentSize.toString().substring(1, 4) + 'KB'}
                </span>
              )}
            </div>
          </>
        )
      },
    },
    {
      field: 'Platforms',
      headerName: 'Platforms',
      width: 250,
      sortable: false,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      renderCell: (params: any) => {
        return (
          <>
            {params?.row?.availableTargetQueries &&
              params?.row?.availableTargetQueries?.length > 0 && (
                <>
                  {params?.row?.availableTargetQueries.map((eachSvg: any, index: any) => (
                    <BootstrapTooltip title={eachSvg} arrow placement='bottom'>
                      <div
                        className='cursor-pointer px-[2px]'
                        onClick={(e) =>
                          onViewimageTargt(
                            e,
                            params.row,
                            'target',
                            params?.row?.availableTargetQueries[index],
                            eachSvg,
                          )
                        }
                      >
                        {eachSvg == 'splunk' && (
                          <span>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              xmlnsXlink='http://www.w3.org/1999/xlink'
                              width='32'
                              height='32'
                              viewBox='0 0 32 32'
                              fill='none'
                            >
                              <path
                                d='M24 0H8C3.58172 0 0 3.58172 0 8V24C0 28.4183 3.58172 32 8 32H24C28.4183 32 32 28.4183 32 24V8C32 3.58172 28.4183 0 24 0Z'
                                fill='url(#pattern0)'
                              />
                              <defs>
                                <pattern
                                  id='pattern0'
                                  patternContentUnits='objectBoundingBox'
                                  width='1'
                                  height='1'
                                >
                                  <use
                                    xlinkHref='#image0_1342_16057'
                                    transform='matrix(0.00171932 0 0 0.00170386 -0.388889 -0.164506)'
                                  />
                                </pattern>
                                <image
                                  id='image0_1342_16057'
                                  width='1034'
                                  height='780'
                                  xlinkHref='data:image/png;base64,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hwQAAAAAgv6/9oYBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVgK6m6LBlH851AAAAABJRU5ErkJggg=='
                                />
                              </defs>
                            </svg>
                          </span>
                        )}
                        {eachSvg == 'elasticsearch' && (
                          <span>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='28'
                              height='28'
                              preserveAspectRatio='xMinYMin meet'
                              viewBox='0 0 256 256'
                              id='elasticsearch'
                            >
                              <path
                                fill='#FFF'
                                d='M255.96 134.393c0-21.521-13.373-40.117-33.223-47.43a75.239 75.239 0 0 0 1.253-13.791c0-39.909-32.386-72.295-72.295-72.295-23.193 0-44.923 11.074-58.505 30.088-6.686-5.224-14.835-7.94-23.402-7.94-21.104 0-38.446 17.133-38.446 38.446 0 4.597.836 9.194 2.298 13.373C13.582 81.739 0 100.962 0 122.274c0 21.522 13.373 40.327 33.431 47.64-.835 4.388-1.253 8.985-1.253 13.79 0 39.7 32.386 72.087 72.086 72.087 23.402 0 44.924-11.283 58.505-30.088 6.686 5.223 15.044 8.149 23.611 8.149 21.104 0 38.446-17.134 38.446-38.446 0-4.597-.836-9.194-2.298-13.373 19.64-7.104 33.431-26.327 33.431-47.64z'
                              ></path>
                              <path
                                fill='#F4BD19'
                                d='M100.085 110.364l57.043 26.119 57.669-50.565a64.312 64.312 0 0 0 1.253-12.746c0-35.52-28.834-64.355-64.355-64.355-21.313 0-41.162 10.447-53.072 27.998l-9.612 49.73 11.074 23.82z'
                              ></path>
                              <path
                                fill='#3CBEB1'
                                d='M40.953 170.75c-.835 4.179-1.253 8.567-1.253 12.955 0 35.52 29.043 64.564 64.564 64.564 21.522 0 41.372-10.656 53.49-28.208l9.403-49.729-12.746-24.238-57.251-26.118-56.207 50.774z'
                              ></path>
                              <path
                                fill='#E9478C'
                                d='M40.536 71.918l39.073 9.194 8.775-44.506c-5.432-4.179-11.91-6.268-18.805-6.268-16.925 0-30.924 13.79-30.924 30.924 0 3.552.627 7.313 1.88 10.656z'
                              ></path>
                              <path
                                fill='#2C458F'
                                d='M37.192 81.32c-17.551 5.642-29.67 22.567-29.67 40.954 0 17.97 11.074 34.059 27.79 40.327l54.953-49.73-10.03-21.52-43.043-10.03z'
                              ></path>
                              <path
                                fill='#95C63D'
                                d='M167.784 219.852c5.432 4.18 11.91 6.478 18.596 6.478 16.925 0 30.924-13.79 30.924-30.924 0-3.761-.627-7.314-1.88-10.657l-39.073-9.193-8.567 44.296z'
                              ></path>
                              <path
                                fill='#176655'
                                d='M175.724 165.317l43.043 10.03c17.551-5.85 29.67-22.566 29.67-40.954 0-17.97-11.074-33.849-27.79-40.326l-56.415 49.311 11.492 21.94z'
                              ></path>
                            </svg>
                          </span>
                        )}
                        {eachSvg == 'opensearch' && (
                          <span>
                            <svg
                              fill='none'
                              viewBox='0 0 64 64'
                              xmlns='http://www.w3.org/2000/svg'
                              width='28'
                              height='28'
                            >
                              <path
                                d='m61.7374 23.5c-1.2496 0-2.2626 1.013-2.2626 2.2626 0 18.6187-15.0935 33.7122-33.7122 33.7122-1.2496 0-2.2626 1.013-2.2626 2.2626s1.013 2.2626 2.2626 2.2626c21.1179 0 38.2374-17.1195 38.2374-38.2374 0-1.2496-1.013-2.2626-2.2626-2.2626z'
                                fill='#005eb8'
                              />
                              <path
                                d='m48.0814 38c2.1758-3.5495 4.2801-8.2822 3.8661-14.9079-.8576-13.72485-13.2886-24.13673-25.0269-23.0083673-4.5953.4417323-9.3138 4.1874673-8.8946 10.8967673.1822 2.9156 1.6092 4.6364 3.9284 5.9594 2.2074 1.2593 5.0434 2.057 8.2584 2.9612 3.8834 1.0923 8.3881 2.3192 11.8502 4.8706 4.1495 3.0578 6.9861 6.6026 6.0184 13.2283z'
                                fill='#003b5c'
                              />
                              <path
                                d='m3.91861 14c-2.17585 3.5495-4.280116 8.2822-3.8661169 14.9079.8575789 13.7248 13.2886069 24.1367 25.0269069 23.0084 4.5953-.4418 9.3138-4.1875 8.8946-10.8968-.1822-2.9156-1.6093-4.6364-3.9284-5.9594-2.2074-1.2593-5.0434-2.057-8.2584-2.9612-3.8834-1.0923-8.3881-2.3192-11.85026-4.8706-4.14948-3.0579-6.98602-6.6026-6.01833-13.2283z'
                                fill='#005eb8'
                              />
                            </svg>
                          </span>
                        )}
                      </div>
                    </BootstrapTooltip>
                  ))}
                </>
              )}
          </>
        )
      },
    },
    {
      field: 'source',
      headerName: 'Source',
      width: 200,
      sortable: false,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      renderCell: (params: any) => {
        return (
          <>
            <div>
              {params.row.source == 'GENERATED' ? (
                <div className='border-[#32435A] border-2 p-1 text-[#7F56D9] rounded-2xl flex justify-center'>
                  <span>Generated</span>
                  <span className='mt-1 ml-1'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='12'
                      height='12'
                      viewBox='0 0 12 12'
                      fill='none'
                    >
                      <g clip-path='url(#clip0_189_2072)'>
                        <path
                          d='M1.67013 8.49987C1.04405 7.41492 1.36237 6.03222 2.39898 5.33003L2.40009 5.32892C3.23282 4.76617 4.32888 4.78506 5.14217 5.37614L6.85819 6.62385C7.67092 7.21493 8.76697 7.23382 9.60026 6.67107L9.60137 6.66996C10.6385 5.96778 10.9574 4.58396 10.3302 3.50013M8.50098 10.3296C7.41603 10.9557 6.03333 10.6374 5.33114 9.60079L5.33003 9.59968C4.76728 8.76695 4.78617 7.67089 5.37725 6.8576L6.62496 5.14158C7.21604 4.32885 7.23493 3.2328 6.67218 2.39951L6.66996 2.3984C5.96778 1.36234 4.58396 1.04291 3.50013 1.6701M9.53524 2.46451C11.4879 4.41718 11.4879 7.58257 9.53524 9.53524C7.58257 11.4879 4.41718 11.4879 2.46451 9.53524C0.511831 7.58257 0.511831 4.41718 2.46451 2.46451C4.41718 0.511831 7.58257 0.511831 9.53524 2.46451Z'
                          stroke='#7F56D9'
                          stroke-width='1.5'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                      </g>
                      <defs>
                        <clipPath id='clip0_189_2072'>
                          <rect width='12' height='12' fill='white' />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                </div>
              ) : (
                <>
                  {params.row.source == 'MANUAL_UPLOAD' ? (
                    <div className='border-[#0086C9] border-2 p-1 text-[#0086C9] rounded-2xl flex justify-center'>
                      <span>Uploaded</span>
                      <span className='mt-1 ml-1'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='12'
                          height='12'
                          viewBox='0 0 12 12'
                          fill='none'
                        >
                          <path
                            d='M6 10V2M6 2L3 5M6 2L9 5'
                            stroke='#0086C9'
                            stroke-width='1.5'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                        </svg>
                      </span>
                    </div>
                  ) : params.row.source == 'FACTORY_SIGMAHQ' ? (
                    <>
                      <div className='border-[#079455] border-2 p-1 text-[#079455] rounded-2xl flex justify-center'>
                        <span>SigmaHQ</span>
                        <span className='mt-1 ml-1'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='12'
                            height='12'
                            viewBox='0 0 12 12'
                            fill='none'
                          >
                            <path
                              d='M6 10V2M6 2L3 5M6 2L9 5'
                              stroke='#079455'
                              stroke-width='1.5'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            />
                          </svg>
                        </span>
                      </div>
                    </>
                  ) : params.row.source == 'FACTORY_MBABINSKI' ? (
                    <>
                      <div className='border-[#FA1492] border-2 p-1 text-[#FA1492] rounded-2xl flex justify-center'>
                        <span>Sigma Archive</span>
                        <span className='mt-1 ml-1'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='12'
                            height='12'
                            viewBox='0 0 12 12'
                            fill='none'
                          >
                            <path
                              d='M6 10V2M6 2L3 5M6 2L9 5'
                              stroke='#FA1492'
                              stroke-width='1.5'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            />
                          </svg>
                        </span>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
          </>
        )
      },
    },
    {
      field: 'accessType',
      headerName: 'CTI Name',
      width: 230,
      sortable: false,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      renderCell: (params: any) => {
        return (
          <>
            {params.row.ctiName ? (
              <div>
                <span>{params.row.ctiName}</span>
              </div>
            ) : (
              <div className=''>
                <span>Curated Intel</span>
              </div>
            )}
          </>
        )
      },
    },
    {
      field: 'iconName',
      headerName: '',
      width: 30,
      sortable: false,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      renderCell: (params: any) => {
        return (
          <>
            <button className='' onClick={(e: any) => handleClickdot(e, params.row)}>
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
            </button>
            <Menu sx={{}} anchorEl={anchorE6} open={opendot} onClose={handleClosing}>
              <div className='right-0 px-5 text-[#344054] w-[140px]'>
                <ul>
                  <>
                    <button
                      className='flex viewer'
                      onClick={(e) => onViewimage(e, params.row, 'view')}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth='2'
                        stroke='currentColor'
                        className='w-5 h-5 m-1'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                        />
                      </svg>
                      <li className='m-1 text-sm font-medium'>View</li>
                    </button>
                  </>
                  <>
                    <button
                      className='flex translate'
                      onClick={(e) => onViewimage(e, params.row, 'translate')}
                    >
                      <svg
                        className='ml-1 mt-1'
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='14'
                        viewBox='0 0 16 14'
                        fill='none'
                      >
                        <path
                          d='M12.3805 12.3334C13.2218 12.3334 13.9045 11.6514 13.9045 10.8094V7.76202L14.6665 7.00002L13.9045 6.23802V3.19069C13.9045 2.34869 13.2225 1.66669 12.3805 1.66669M3.61925 1.66669C2.77725 1.66669 2.09525 2.34869 2.09525 3.19069V6.23802L1.33325 7.00002L2.09525 7.76202V10.8094C2.09525 11.6514 2.77725 12.3334 3.61925 12.3334M5.99992 10.3334L9.99992 3.66669'
                          stroke='#344054'
                          stroke-width='2'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                      </svg>
                      <li className='pl-2 text-sm font-medium'>Translate</li>
                    </button>
                  </>
                  <>
                    <button className='flex' onClick={singleFileDownload}>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='w-5 h-5 m-1'
                        viewBox='0 0 20 20'
                        fill='none'
                      >
                        anchorEl0
                        <path
                          d='M6.6665 14.1667L9.99984 17.5M9.99984 17.5L13.3332 14.1667M9.99984 17.5V10M16.6665 13.9524C17.6844 13.1117 18.3332 11.8399 18.3332 10.4167C18.3332 7.88536 16.2811 5.83333 13.7498 5.83333C13.5677 5.83333 13.3974 5.73833 13.3049 5.58145C12.2182 3.73736 10.2119 2.5 7.9165 2.5C4.46472 2.5 1.6665 5.29822 1.6665 8.75C1.6665 10.4718 2.36271 12.0309 3.48896 13.1613'
                          stroke='currentColor'
                          stroke-width='2'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                      </svg>

                      <li className='m-1 text-sm font-medium'>Download</li>
                    </button>
                  </>
                </ul>
              </div>
            </Menu>
          </>
        )
      },
    },
  ]

  return (
    <div>
      <Box
        sx={{
          mt: 3.2,
          height: 340,
          width: '100%',
          '& .super-app-theme--header': {
            backgroundColor: '#32435A',
            color: '#FFFFFF',
            zIndex: -2,
          },
          '.css-1omg972-MuiDataGrid-root .MuiDataGrid-columnHeader--alignCenter .MuiDataGrid-columnHeaderTitleContainer':
            {
              backgroundColor: '#808080',
            },
          '.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
            outline: 'none !important',
          },
          noFocusOutline: {
            '& .MuiDataGrid-row:focus, & .MuiDataGrid-row.Mui-selected': {
              outline: 'none !important',
            },
          },
          '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus': {
            outline: 'none !important',
          },
          '.MuiDataGrid-root .MuiDataGrid-cell:focus': {
            outline: 'none !important',
          },
          '  .css-yrdy0g-MuiDataGrid-columnHeaderRow': {
            backgroundColor: '#808080',
            color: '#FFFFFF',
            border: 'none',
            paddingRight: '1rem',
          },
          '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
            outline: 'none !important',
          },
          '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus':
            {
              outline: 'none',
            },
          '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
          '.MuiCheckbox-colorPrimary.Mui-checked': {
            color: ' white !important',
          },
          '.MuiCheckbox-colorPrimary': {
            color: ' white !important',
          },
          '.css-rtrcn9-MuiTablePagination-root .MuiTablePagination-selectLabel': {
            color: 'white !important',
          },
          '.css-194a1fa-MuiSelect-select-MuiInputBase-input.css-194a1fa-MuiSelect-select-MuiInputBase-input.css-194a1fa-MuiSelect-select-MuiInputBase-input':
            {
              color: 'white !important',
            },
          '.MuiTablePagination-displayedRows': {
            color: 'white !important',
          },
          '.MuiTablePagination-root .MuiTablePagination-actions button svg': {
            fill: 'white !important',
          },
          '.MuiPagination-root .MuiPaginationSelect-icon': {
            color: 'white !important',
          },
          ' .MuiTablePagination-root .MuiSelect-icon': {
            color: 'white !important',
          },
        }}
      >
        <DataGrid
          sx={{
            boxShadow: 10,
            m: 2,
            color: 'white',
            border: 'none',
            height: { md: height - 150, lg: height - 220, xl: height - 250 },
            [`& .${gridClasses.overlay}`]: {
              backgroundColor: 'transparent', // Removes the background color
            },
            '&>.MuiDataGrid-main': {
              '&>.MuiDataGrid-columnHeaders': {
                borderBottom: 'none !important',
              },
              borderRadius:"12px",
              border: "1px solid #32435A"
            },
            '.MuiDataGrid-footerContainer': {
              border: 'none !important',
            },
            '&>.MuiDataGrid-columnHeaders': {
              borderBottom: 'none',
            },
            '& div div div div >.MuiDataGrid-cell': {
              borderBottom: 'none',
            },
            '& .MuiDataGrid-row': {
              border: '1px solid #32435A',
            },
            '& .MuiDataGrid-checkboxInput': {
              color: 'white ',
            },
            '& .MuiDataGrid-columnHeader:first-child .MuiDataGrid-columnSeparator': {
              display: 'none',
            },
            '& .hideRightSeparator > .MuiDataGrid-columnSeparator': {
              display: 'none',
            },
            '& .super-app-theme--header': {
              backgroundColor: '#485E7C',
              color: '#FFFFFF',
            },
            '.css-1omg972-MuiDataGrid-root .MuiDataGrid-columnHeader--alignCenter .MuiDataGrid-columnHeaderTitleContainer':
              {
                backgroundColor: '#485E7C',
              },
            '.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
              outline: 'none !important',
            },
            noFocusOutline: {
              '& .MuiDataGrid-row:focus, & .MuiDataGrid-row.Mui-selected': {
                outline: 'none !important',
              },
            },
            '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus': {
              outline: 'none !important',
            },
            '.MuiDataGrid-root .MuiDataGrid-cell:focus': {
              outline: 'none !important',
            },
            '  .css-yrdy0g-MuiDataGrid-columnHeaderRow': {
              backgroundColor: '#32435A',
              color: '#FFFFFF',
              border: 'none',
              paddingRight: '1rem',
            },
            '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
              outline: 'none !important',
            },
            '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus':
              {
                outline: 'none',
              },
          }}
          rows={filterState?.length > 0 ? filterState : []}
          columns={columns}
          loading={reloading}
          classes={{
            columnHeadersInner: 'custom-data-grid-columnHeadersInner',
            sortIcon: 'custom-data-grid-sortIcon',
            footerContainer: 'custom-data-grid-footerContainer',
          }}
          onSelectionModelChange={(ids: any) => {
            const selectedIDs = new Set(ids)
            let rowdetails: any = []
            const selectedRows = filterState.filter((row: any) => selectedIDs.has(row.id))
          }}
          components={{
            NoRowsOverlay: CustomNoRowsOverlay,
          }}
          disableSelectionOnClick={true}
          checkboxSelection
          pagination
          hideFooterSelectedRowCount
          disableColumnMenu
        />
      </Box>

      {SampleKPMG ? (
        <>
          <div className='backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
            <div className='relative w-full h-full p-[32px] mx-auto'>
              <div
                className={` ${
                  mode === 'translate' || mode == 'view'
                    ? ' px-[20px] border-0 rounded-lg h-full border border-pink-200 shadow-lg relative flex flex-col bg-[#1D2939] outline-none focus:outline-none'
                    : ' px-[20px] border-0 rounded-lg h-full  border shadow-lg relative flex flex-col bg-[#1D2939] outline-none focus:outline-none'
                }`}
              >
                <div className='grid grid-cols-3 max-md:grid-cols-2 gap-4 justify-items-center '>
                  <div className='max-md:hidden'></div>
                  <div className='text-white mt-5 text-2xl font-bold'>
                    {mode === 'translate' ? 'Translate' : mode == 'target' ? 'Query' : 'View'}
                  </div>
                  <div
                    className={`w-full flex justify-end   ${
                      mode === 'translate' ? 'mr-[1rem]' : ''
                    } ${mode === 'target' && 'mr-[5.5rem]'}`}
                  >
                    <div
                      className={` ${
                        mode === 'view'
                          ? ' flex justify-between mt-3 mr-[0px]'
                          : mode === 'target'
                          ? 'flex justify-end mt-[.8rem]'
                          : mode === 'translate'
                          ? 'mr-[10px] mt-3 flex justify-between'
                          : ''
                      }`}
                    >
                      {plateFormName == 'splunk' && splunkValue?.connected && (
                        <>
                          {mode === 'target' && (
                            <button
                              disabled={queryExecute}
                              className={`' flex rounded px-2 mr-6 mt-1 w-120  h-8 bg-[#EE7103] justify-center items-center gap-2 ' ${
                                queryExecute
                                  ? 'cursor-not-allowed opacity-50'
                                  : 'hover:bg-[#6941C6]'
                              } `}
                              onClick={handleQueryExecute}
                            >
                              <div>
                                <p className='text-white'>
                                  {!queryExecute ? 'Execute' : 'Executing'}
                                </p>
                              </div>
                              <div>
                                {!queryExecute ? (
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='15'
                                    height='18'
                                    viewBox='0 0 15 18'
                                    fill='none'
                                  >
                                    <path
                                      d='M1.66669 3.15797C1.66669 2.34866 1.66669 1.94401 1.83543 1.72095C1.98243 1.52663 2.20712 1.40638 2.45035 1.39186C2.72955 1.37519 3.06624 1.59965 3.73962 2.04857L12.5026 7.89054C13.059 8.26148 13.3372 8.44695 13.4341 8.68072C13.5189 8.8851 13.5189 9.11479 13.4341 9.31917C13.3372 9.55294 13.059 9.73841 12.5026 10.1093L3.73962 15.9513C3.06624 16.4002 2.72955 16.6247 2.45035 16.608C2.20712 16.5935 1.98243 16.4733 1.83543 16.2789C1.66669 16.0559 1.66669 15.6512 1.66669 14.8419V3.15797Z'
                                      stroke='white'
                                      stroke-width='1.66667'
                                      stroke-linecap='round'
                                      stroke-linejoin='round'
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='16'
                                    height='4'
                                    viewBox='0 0 16 4'
                                    fill='none'
                                  >
                                    <path
                                      d='M7.99998 2.83329C8.46022 2.83329 8.83331 2.4602 8.83331 1.99996C8.83331 1.53972 8.46022 1.16663 7.99998 1.16663C7.53974 1.16663 7.16665 1.53972 7.16665 1.99996C7.16665 2.4602 7.53974 2.83329 7.99998 2.83329Z'
                                      stroke='white'
                                      stroke-width='1.66667'
                                      stroke-linecap='round'
                                      stroke-linejoin='round'
                                    />
                                    <path
                                      d='M13.8333 2.83329C14.2935 2.83329 14.6666 2.4602 14.6666 1.99996C14.6666 1.53972 14.2935 1.16663 13.8333 1.16663C13.3731 1.16663 13 1.53972 13 1.99996C13 2.4602 13.3731 2.83329 13.8333 2.83329Z'
                                      stroke='white'
                                      stroke-width='1.66667'
                                      stroke-linecap='round'
                                      stroke-linejoin='round'
                                    />
                                    <path
                                      d='M2.16665 2.83329C2.62688 2.83329 2.99998 2.4602 2.99998 1.99996C2.99998 1.53972 2.62688 1.16663 2.16665 1.16663C1.70641 1.16663 1.33331 1.53972 1.33331 1.99996C1.33331 2.4602 1.70641 2.83329 2.16665 2.83329Z'
                                      stroke='white'
                                      stroke-width='1.66667'
                                      stroke-linecap='round'
                                      stroke-linejoin='round'
                                    />
                                  </svg>
                                )}
                              </div>
                            </button>
                          )}
                        </>
                      )}

                      <div className='relative'>
                        <button
                          type='button'
                          disabled={mode === 'translate' || queryExecute ? disable : false}
                          className='mt-2 pr-2'
                          onClick={copyToClipboard}
                        >
                          <span className=' mr-3'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='22'
                              height='22'
                              viewBox='0 0 22 22'
                              fill='none'
                            >
                              <path
                                d='M9.5 1.0028C8.82495 1.01194 8.4197 1.05103 8.09202 1.21799C7.71569 1.40973 7.40973 1.71569 7.21799 2.09202C7.05103 2.4197 7.01194 2.82495 7.0028 3.5M18.5 1.0028C19.1751 1.01194 19.5803 1.05103 19.908 1.21799C20.2843 1.40973 20.5903 1.71569 20.782 2.09202C20.949 2.4197 20.9881 2.82494 20.9972 3.49999M20.9972 12.5C20.9881 13.175 20.949 13.5803 20.782 13.908C20.5903 14.2843 20.2843 14.5903 19.908 14.782C19.5803 14.949 19.1751 14.9881 18.5 14.9972M21 6.99999V8.99999M13.0001 1H15M4.2 21H11.8C12.9201 21 13.4802 21 13.908 20.782C14.2843 20.5903 14.5903 20.2843 14.782 19.908C15 19.4802 15 18.9201 15 17.8V10.2C15 9.07989 15 8.51984 14.782 8.09202C14.5903 7.71569 14.2843 7.40973 13.908 7.21799C13.4802 7 12.9201 7 11.8 7H4.2C3.0799 7 2.51984 7 2.09202 7.21799C1.71569 7.40973 1.40973 7.71569 1.21799 8.09202C1 8.51984 1 9.07989 1 10.2V17.8C1 18.9201 1 19.4802 1.21799 19.908C1.40973 20.2843 1.71569 20.5903 2.09202 20.782C2.51984 21 3.07989 21 4.2 21Z'
                                stroke={
                                  mode === 'translate' || queryExecute
                                    ? disable
                                      ? '#8992A1'
                                      : '#fff'
                                    : '#fff'
                                }
                                stroke-width='2'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                              />
                            </svg>
                          </span>
                        </button>
                        {showPopover && (
                          <div className='absolute  p-1 bg-white text-black rounded shadow z-10'>
                            Copied!
                          </div>
                        )}
                      </div>
                      {mode === 'view' && (
                        <>
                          <button type='button' className='mt-2 pr-2' onClick={singleFileDownload}>
                            <span className=' mr-4'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='24'
                                height='24'
                                viewBox='0 0 24 24'
                                fill='none'
                              >
                                <path
                                  d='M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 10L12 15M12 15L7 10M12 15V3'
                                  stroke={'#fff'}
                                  stroke-width='2'
                                  stroke-linecap='round'
                                  stroke-linejoin='round'
                                />
                              </svg>
                            </span>
                          </button>
                        </>
                      )}
                      {mode === 'translate' && (
                        <button
                          type='button'
                          disabled={translateDownload}
                          className='mt-2 pr-2'
                          onClick={singleTranslateDownload}
                        >
                          <span className=' mr-4'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='24'
                              height='24'
                              viewBox='0 0 24 24'
                              fill='none'
                            >
                              <path
                                d='M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 10L12 15M12 15L7 10M12 15V3'
                                stroke={translateDownload ? '#8992A1' : '#fff'}
                                stroke-width='2'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                              />
                            </svg>
                          </span>
                        </button>
                      )}
                      {mode === 'target' && <></>}
                      <button
                        disabled={closePopupDisable}
                        className='px-1 mb-[15px] ml-auto bg-transparent text-dark border-0 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
                        onClick={(e) => {
                          setSampleKPMG(false)
                          setDisable(true)
                          setSinglequery(null)
                          setTranslateDownload(true)
                          fetchdetails()
                        }}
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='#fff'
                        >
                          <path
                            d='M18 6L6 18M6 6L18 18'
                            stroke={closePopupDisable ? '#8992A1' : '#fff'}
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                {mode === 'translate' && (
                  <div className='grid grid-cols-3 max-md:grid-cols-2 gap-3 pb-3'>
                    <div className='max-md:hidden'></div>
                    <div className='w-full h-fit text-center flex justify-center'>
                      <select
                        onChange={(e) => handleClickTargersingle(e)}
                        id='large'
                        className='block  w-[60%] py-[6px] text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500'
                      >
                        <option selected value={''}>
                          Choose your SIEM platform
                        </option>
                        {selectTargers
                          ?.filter((item: any) => {
                            return item?.target == 'SPLUNK'
                          })
                          .map((item: any) => (
                            <option value={item.target}>{item.targetDescription}</option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <div className='w-full flex justify-end'>
                        <div className='mr-6'>
                          <button
                            disabled={disable}
                            onClick={handleSingleTranslatClick}
                            className={`
                              text-white ml-18 capitalize rounded-lg px-[25px] py-[6px] bg-[#EE7103] text-center flex ${
                                disable ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#6941C6]'
                              } `}
                          >
                            {istranslating ? 'Translating' : 'Translate'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div
                  style={{ display: 'flex' }}
                  className={`h-full  max-md:flex-col ${
                    mode === 'translate' || mode === 'view'
                      ? 'bg-[#1D2939] ml-[1rem] gap-4 mt-0'
                      : mode === 'target'
                      ? 'bg-[#1D2939] ml-[1rem] gap-4 mt-[-10px]'
                      : ''
                  } ${mode === 'translate' ? 'pt-3' : ''}`}
                >
                  {mode === 'translate' && (
                    <>
                      <div
                        style={{
                          height: '100%',
                          width: '100%',
                          textAlign: 'left',
                          overflowY: 'hidden',
                          backgroundColor: '#0C111D',
                          borderRadius: '8px',
                          marginLeft: '10px',
                        }}
                      >
                        <YamlEditor
                          ymltext={ymltext}
                          setYmlText={setYmlText}
                          setSeloctror={setCopyText}
                          modeOfView={'translate'}
                        />
                      </div>
                      <div
                        style={{
                          height: '100%',
                          width: '100%',
                          textAlign: 'left',
                          overflowY: 'hidden',
                          backgroundColor: '#0C111D',
                          borderRadius: '8px',
                          marginRight: '20px',
                        }}
                      >
                        <YamlTextEditor ymltext={singlequery} setSeloctror={setCopyText} />
                      </div>
                    </>
                  )}
                  {mode === 'target' && (
                    <div
                      style={{
                        marginLeft: '1.7rem',
                        borderRadius: '10px',
                        height: '100%',
                        width: '94.5%',
                        textAlign: 'left',
                        overflowY: 'hidden',
                        backgroundColor: '#0C111D',
                      }}
                    >
                      <YamlTextEditorForQuery
                        ymltext={singlequery}
                        setSinglequery={setSinglequery}
                        setQueryValue={setQueryValue}
                        setSeloctror={setCopyText}
                      />
                    </div>
                  )}
                  {mode === 'view' && (
                    <div
                      style={{
                        marginLeft: '1.7rem',
                        borderRadius: '10px',
                        height: '100%',
                        width: '94.5%',
                        textAlign: 'left',
                        overflowY: 'hidden',
                        backgroundColor: '#0C111D',
                      }}
                    ></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {openView && (
        <div className='backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
          <div className='relative w-full h-full p-[32px] mx-auto'>
            <div className='p-[20px] border-0 rounded-lg shadow-lg h-full relative flex flex-col bg-[#1D2939] outline-none focus:outline-none'>
              <div className='grid grid-cols-3 max-md:grid-cols-2 gap-4 justify-items-center m-1 p-2 pb-0 mb-0'>
                <div className='max-md:hidden'></div>
                <div className='text-white text-2xl font-bold max-md:text-xl max-md:flex w-full text-center'>View</div>
                <div className='w-full flex justify-end mr-[0.5rem] items-center'>
                  <div className='flex justify-between'>
                    <>
                      <div className='relative'>
                        <button type='button' className='mt-0 pr-2' onClick={copyToClipboard}>
                          <span className=' mr-3'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='22'
                              height='22'
                              viewBox='0 0 22 22'
                              fill='none'
                            >
                              <path
                                d='M9.5 1.0028C8.82495 1.01194 8.4197 1.05103 8.09202 1.21799C7.71569 1.40973 7.40973 1.71569 7.21799 2.09202C7.05103 2.4197 7.01194 2.82495 7.0028 3.5M18.5 1.0028C19.1751 1.01194 19.5803 1.05103 19.908 1.21799C20.2843 1.40973 20.5903 1.71569 20.782 2.09202C20.949 2.4197 20.9881 2.82494 20.9972 3.49999M20.9972 12.5C20.9881 13.175 20.949 13.5803 20.782 13.908C20.5903 14.2843 20.2843 14.5903 19.908 14.782C19.5803 14.949 19.1751 14.9881 18.5 14.9972M21 6.99999V8.99999M13.0001 1H15M4.2 21H11.8C12.9201 21 13.4802 21 13.908 20.782C14.2843 20.5903 14.5903 20.2843 14.782 19.908C15 19.4802 15 18.9201 15 17.8V10.2C15 9.07989 15 8.51984 14.782 8.09202C14.5903 7.71569 14.2843 7.40973 13.908 7.21799C13.4802 7 12.9201 7 11.8 7H4.2C3.0799 7 2.51984 7 2.09202 7.21799C1.71569 7.40973 1.40973 7.71569 1.21799 8.09202C1 8.51984 1 9.07989 1 10.2V17.8C1 18.9201 1 19.4802 1.21799 19.908C1.40973 20.2843 1.71569 20.5903 2.09202 20.782C2.51984 21 3.07989 21 4.2 21Z'
                                stroke='#fff'
                                stroke-width='2'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                              />
                            </svg>
                          </span>
                        </button>
                        {showPopover && (
                          <div className='absolute  p-1 bg-white text-black rounded shadow z-10'>
                            Copied!
                          </div>
                        )}
                      </div>
                      <button type='button' className='mt-0 pr-2' onClick={singleFileDownload}>
                        <span className=' mr-4'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                          >
                            <path
                              d='M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 10L12 15M12 15L7 10M12 15V3'
                              stroke='#fff'
                              stroke-width='2'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            />
                          </svg>
                        </span>
                      </button>
                    </>
                    <button
                      disabled={closePopupDisable}
                      className='px-1 mb-[23px] ml-auto bg-transparent text-dark border-0 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
                      onClick={() => {
                        setDisable(true)
                        setopenView(false)
                        setSampleKPMG(false)
                      }}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='#fff'
                      >
                        <path
                          d='M18 6L6 18M6 6L18 18'
                          stroke={closePopupDisable ? '#8992A1' : '#fff'}
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className='flex pb-6 justify-center gap-4 items-center h-full  max-md:flex-col'>
                <div
                  style={{
                    height: '100%',
                    width: '100%',
                    textAlign: 'left',
                    overflowY: 'hidden',
                    backgroundColor: '#0C111D',
                    borderRadius: '1rem',
                  }}
                >
                  <YamlEditorForView
                    ymltext={ymltext}
                    setYmlText={setYmlText}
                    isEdit={() => {}}
                    setValue={() => {}}
                    setSeloctror={setCopyText}
                    modeOfView={'translate'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ThreatSigma
