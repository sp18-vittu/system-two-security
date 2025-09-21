import React, { useEffect, useState } from 'react'
import { DataGrid, gridClasses, GridColDef, GridSortModel } from '@mui/x-data-grid'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Box, Divider, Menu, Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material'
import useWindowResolution from '../../../layouts/Dashboard/useWindowResolution'
import CopyAndNewCollectionsDialog from './CopyAndNewCollectionsDialog'
import {
  CollectioMultipleDelete,
  CollectiondtoCollectionThreatbreifPost,
  CollectionruleDelete,
  getallCollection,
} from '../../../redux/nodes/Collections/action'
import { useDispatch } from 'react-redux'
import DeleteConfirmationDialog from './DeleteConfirmationDialog'
import { environment } from '../../../environment/environment'
import Axios from 'axios'
import local from '../../../utils/local'
import api from '../../../redux/nodes/api'
const yaml = require('js-yaml')
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { BulkTranslateFileList, TargetFileList } from '../../../redux/nodes/py-sigma/action'
import YamlEditor from '../../datavault/YamlEditor'
import YamlTextEditor from '../../datavault/YamlTextEditor'
import toast from 'react-hot-toast'
import CustomToast from '../../../layouts/App/CustomToast'
import { useData } from '../../../layouts/shared/DataProvider'
import {
  CREATE_VIEWFILE_VAULT_FAILED,
  CREATE_VIEWFILE_VAULT_SUCCESS,
} from '../../../redux/nodes/repository/action'

const theme = createTheme({
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          width: 20,
          height: 20,
          borderRadius: 6,
          border: "2px solid #7F94B4",
          backgroundColor: "#0C111D",
          color: "transparent",
          cursor: "default",

          "&.Mui-checked": {
            backgroundColor: "#f97316",
            borderColor: "#7F94B4",
          },

          "&.Mui-focusVisible": {
            outline: "2px solid #f97316",
            outlineOffset: 2,
          },
          '& .MuiSvgIcon-root': {
            display: 'none',
            cursor: 'default',
          },

          "& input": {
            cursor: "pointer",
            backgroundColor: "#f97316",
            border: "none",
            outline: "none",
          },
        },
      },
    },
  },
});


function CommenRuleTable({ tablelist, paramsdata, setdeletvale, reloading, inboxList, setDialogOpen, isDialogOpen }: any) {
  const { id } = useParams()
  const location = useLocation()
  const { state } = location
  const navigateTo = useNavigate()
  const { height } = useWindowResolution()
  const [anchorE6, setAnchorE6] = React.useState(null)
  const [singleparams, setSingleparams] = useState(null as any)
  const [collectionorcti, setCollectionorcti] = useState(null as any)
  const [getCheckedValue, setGetCheckedValue] = useState([])
  const [selectedRows, setSelectedRows] = useState([] as any)
  const [collectiondata, setCollectiondata] = useState([] as any)
  const [isdelDialogOpen, setIsdleDialogOpen] = useState(false)
  const [search, setSearch] = useState<string>('')
  const Token = local.getItem('bearerToken')
  const token = JSON.parse(Token as any)
  const dispatch = useDispatch()
  const opendot = Boolean(anchorE6)

  const [openTranslatePopup, setOpenTranslatePopup] = useState(false)
  const [disable, setDisable] = useState(true)
  const [istranslating, setIsTranslating] = useState(false)
  const [bulkDownload, setBulkDownload] = useState(true)
  const [bluckdocId, setBluckdocId] = useState([] as any)
  const [targetId, setTargetId] = useState(null as any)
  const [closePopupDisable, setclosePopupDisable] = useState(false)
  const [selectTargers, setSelectTargers] = React.useState([])
  const [defaultText, setDefaultText] = useState(
    'Once the processing is complete, the files to your left will be translated into queries.You can then download them.',
  )
  const { tbList }: any = useData()
  const [ymltextbluk, setYmlTextBluk] = useState(null as any)

  const handleClickdot = (event: any, params: any) => {
    setSelectedRows([])
    setSingleparams(params)
    setAnchorE6(event.currentTarget)
  }
  const onTitleViewimage = async (e: any, params: any, type: any) => {
    navigateTo(`/app/sigmaruleview/${params?.id}`, {
      state: {
        vaultId: id,
        singmaname: params.title,
        sigmadetail: params,
        title: state.title,
        platformName: paramsdata == 'ctisigma' ? 'view' : null,
        paramsdata: paramsdata,
        chatHistory: null,
        tab: 1,
      },
    })
  }
  const onViewimage = async (e: any, params: any, type: any) => {
    navigateTo(`/app/sigmaruleview/${params?.id}`, {
      state: {
        vaultId: id,
        singmaname: singleparams?.title,
        sigmadetail: singleparams,
        title: state.title,
        platformName: type,
        paramsdata: paramsdata,
        chatHistory: null,
        tab: 1,
      },
    })
  }

  const handleOpenCollection = (data: any) => {
    if (data == 'ctireport') {
      setAnchorE6(null)
      setCollectionorcti(data)
      setDialogOpen(true)
    } else if (data == 'singlecollecioncopy' || data == 'cticollecionmove') {
      setAnchorE6(null)
      setCollectionorcti(data)
      setDialogOpen(true)
    } else if (data == 'singlecollecionmove' || data == 'cticollecioncopy') {
      setAnchorE6(null)
      setCollectionorcti(data)
      setDialogOpen(true)
    } else if (data == 'collecioncopy' || data == 'collecionmove') {
      if (selectedRows.length > 0 && getCheckedValue.length > 0) {
        setAnchorE6(null)
        setCollectionorcti(data)
        setDialogOpen(true)
      }
    } else {
      if (selectedRows.length > 0 && getCheckedValue.length > 0) {
        setAnchorE6(null)
        setCollectionorcti(data)
        setDialogOpen(true)
      }
    }
  }

  const handleOpenInboxCollection = (datas: any) => {
    if (datas == 'multipleInbox') {
      let getId: any = []
      let CTIName: any
      selectedRows.map((item: any) => {
        getId.push(item.id)
      })
      if (inboxList) {
        dispatch(CollectiondtoCollectionThreatbreifPost([inboxList?.id], getId) as any).then(
          (res: any) => {
            if (res.type == 'THREAT_BREIF_COLLECTION_TO_COLLECTION_COPY_POST_SUCCESS') {
              navigateTo(`/app/collectionsigmarule/${inboxList?.id}`, {
                state: { title: inboxList?.name },
              })
              setDialogOpen(false)
              sessionStorage.setItem('active', 'newCtiArcheive')
              setSingleparams(null)
              toast.success(
                <CustomToast
                  message={
                    getId.length > 1 ? 'Rule(s) copied successfully' : 'Rule copied successfully'
                  }
                  onClose={() => toast.dismiss()} // Dismiss only this toast
                />,
                {
                  duration: 4000,
                  position: 'top-center',
                  style: {
                    background: '#fff',
                    color: '#000', // White text color
                    width: '500px',
                  },
                },
              )
            } else {
              toast.error(
                <CustomToast
                  message='Failed to copy the rule. Please try again'
                  onClose={() => toast.dismiss()} // Dismiss only this toast
                />,
                {
                  duration: 4000,
                  position: 'top-center',
                  style: {
                    background: '#fff',
                    color: '#000', // White text color
                    width: '500px',
                  },
                },
              )
            }
          },
        )
      }
    } else {
      if (inboxList) {
        dispatch(
          CollectiondtoCollectionThreatbreifPost([inboxList?.id], [singleparams.id]) as any,
        ).then((res: any) => {
          if (res.type == 'THREAT_BREIF_COLLECTION_TO_COLLECTION_COPY_POST_SUCCESS') {
            navigateTo(`/app/collectionsigmarule/${inboxList?.id}`, {
              state: { title: inboxList?.name },
            })
            setDialogOpen(false)
            sessionStorage.setItem('active', 'newCtiArcheive')
            setSingleparams(null)
            toast.success(
              <CustomToast
                message={'Rule copied successfully'}
                onClose={() => toast.dismiss()} // Dismiss only this toast
              />,
              {
                duration: 4000,
                position: 'top-center',
                style: {
                  background: '#fff',
                  color: '#000', // White text color
                  width: '500px',
                },
              },
            )
          } else {
            toast.error(
              <CustomToast
                message='Failed to copy the rule. Please try again'
                onClose={() => toast.dismiss()} // Dismiss only this toast
              />,
              {
                duration: 4000,
                position: 'top-center',
                style: {
                  background: '#fff',
                  color: '#000', // White text color
                  width: '500px',
                },
              },
            )
          }
        })
      }
    }
  }

  const onViewimageTargt = async (
    e: any,
    params: any,
    type: any,
    target: any,
    platformName: string,
  ) => {
    navigateTo(`/app/sigmaruleview/${params?.id}`, {
      state: {
        vaultId: id,
        singmaname: params?.title,
        sigmadetail: params,
        title: state.title,
        platformName: type,
        paramsdata: paramsdata,
        chatHistory: null,
        tab: 2,
      },
    })
  }

  const handleClickdelete = (e: any, params: any) => {
    setAnchorE6(null)
    setIsdleDialogOpen(true)
  }

  const handleDelete = () => {
    const deleteFilesIds: any = selectedRows.map((row: any) => {
      return row.id
    })
    const toastId = toast.loading(
      <CustomToast
        message='Your files are currently being deleted'
        onClose={() => toast.dismiss(toastId)} // Dismiss only this toast
      />,
      {
        duration: 1000000,
        position: 'top-center',
        style: {
          background: '#fff',
          color: '#000', // White text color
          width: '500px',
        },
      },
    )
    if (deleteFilesIds.length > 0 && !singleparams) {
      dispatch(CollectioMultipleDelete(id, deleteFilesIds) as any).then((res: any) => {
        if (res.type == 'COLLECTION_RULE_MULTIPLE_DELETE_SUCCESS') {
          toast.dismiss(toastId)
          toast.success(
            <CustomToast
              message={
                deleteFilesIds.length > 1
                  ? 'Rule(s) Deleted successfully'
                  : 'Rule Deleted Successfully'
              }
              onClose={() => toast.dismiss()} // Dismiss only this toast
            />,
            {
              duration: 4000,
              position: 'top-center',
              style: {
                background: '#fff',
                color: '#000', // White text color
                width: '500px',
              },
            },
          )

          setdeletvale('delete')
          setIsdleDialogOpen(false)
          setSingleparams(null)
        } else {
          toast.error(
            <CustomToast
              message='Failed to delete the collection rule. Please try again.'
              onClose={() => toast.dismiss()} // Dismiss only this toast
            />,
            {
              duration: 4000,
              position: 'top-center',
              style: {
                background: '#fff',
                color: '#000', // White text color
                width: '500px',
              },
            },
          )
        }
      })
      setIsdleDialogOpen(false)
    } else {
      dispatch(CollectionruleDelete(id, singleparams?.id) as any).then((res: any) => {
        if (res.type == 'COLLECTION_RULE_DELETE_SUCCESS') {
          toast.success(
            <CustomToast
              message='Rule Deleted Successfully'
              onClose={() => toast.dismiss()} // Dismiss only this toast
            />,
            {
              duration: 4000,
              position: 'top-center',
              style: {
                background: '#fff',
                color: '#000', // White text color
                width: '500px',
              },
            },
          )
          toast.dismiss(toastId)
          setdeletvale('delete')
          setIsdleDialogOpen(false)
          setSingleparams(null)
        } else {
          toast.error(
            <CustomToast
              message='Failed to delete the collection rule. Please try again.'
              onClose={() => toast.dismiss()} // Dismiss only this toast
            />,
            {
              duration: 4000,
              position: 'top-center',
              style: {
                background: '#fff',
                color: '#000', // White text color
                width: '500px',
              },
            },
          )
        }
      })
      setIsdleDialogOpen(false)
    }
  }

  const handleDeleteMultipleFiles = () => {
    if (getCheckedValue?.length > 0) {
      setIsdleDialogOpen(true)
      const deleteFilesIds: any = selectedRows.map((row: any) => {
        return { id: row.id }
      })
      setSingleparams(null)
    }
  }

  const handleTranslate = async () => {
    if (selectedRows.length > 1) {
      let valueget: any = []
      let docId: any = []
      selectedRows.map((item: any) => {
        valueget.push(item.name)
        docId.push(item?.id)
      })
      const yamlText = yaml.dump(valueget, { lineWidth: -1 })
      setYmlTextBluk(yamlText)
      setBluckdocId(docId)
      setOpenTranslatePopup(true)
      dispatch(TargetFileList() as any).then((data: any) => {
        if (data.type == 'TARGETS_FILE_SUCCESS') {
          setSelectTargers(data.payload)
        }
      })
    } else if (selectedRows.length == 1) {
      let valueget: any = []
      let docId: any = []
      selectedRows.map((item: any) => {
        valueget.push(item.name)
        docId.push(item?.id)
      })
      setBluckdocId(docId)

      dispatch(TargetFileList() as any).then((data: any) => {
        if (data.type == 'TARGETS_FILE_SUCCESS') {
          setSelectTargers(data.payload)
        }
      })
      try {
        await api
          .get(`/data/document/${selectedRows[0].id}`, {
            responseType: 'blob',
            headers: {
              Authorization: `${token.bearerToken}`,
            },
            params: { global: selectedRows[0].global },
          })
          .then((respons: any) => {
            setOpenTranslatePopup(true)
            let fileName = selectedRows[0].name
            let file = new File([respons.data], fileName)
            const reader = new FileReader()
            reader.onload = (e: any) => {
              const fileText = e.target.result
              const parsedJSON: any = yaml.load(fileText)
              const final_value: any = JSON.stringify(parsedJSON, null, 2)
              setYmlTextBluk(fileText)
            }
            reader.readAsText(file)
          })
        dispatch({ type: CREATE_VIEWFILE_VAULT_SUCCESS })
      } catch (error: any) {
        dispatch({ type: CREATE_VIEWFILE_VAULT_FAILED, payload: error.message })
      }
    }
  }

  const handleClickTargerbulk = (event: any) => {
    if (event.target.value) {
      setDisable(false)
      setTargetId(event.target.value)
    } else {
      setDisable(true)
      setTargetId(null)
    }
  }

  const bulckTranslateDownload = async () => {
    try {
      let obj = {
        docIds: bluckdocId,
        target: targetId.toLowerCase(),
      }
      const { data } = await Axios.post(`${environment.baseUrl}/data/pysigma/download-query`, obj, {
        responseType: 'blob',
        headers: {
          Authorization: `${token.bearerToken}`,
        },
        params: { global: false },
      })
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
  const handleBulTranslatClick = () => {
    setDisable(true)
    setclosePopupDisable(true)
    setDefaultText('Translation of your sigma file(s) is in progress...')
    setBulkDownload(true)
    setIsTranslating(true)
    let obj = {
      docIds: bluckdocId,
      target: targetId.toLowerCase(),
    }
    let vaultdata = {
      vault: { global: false },
    }
    setTimeout(() => {
      dispatch(BulkTranslateFileList(obj, vaultdata) as any).then((response: any) => {
        setDefaultText(
          'Your translation request is now completed. You can download the queries by clicking on the download icon.',
        )
        setDisable(false)
        setclosePopupDisable(false)
        setBulkDownload(false)
        setIsTranslating(false)
        setdeletvale('delete')
        toast.success(
          <CustomToast
            message='Rule(s) translated successfully'
            onClose={() => toast.dismiss()} // Dismiss only this toast
          />,
          {
            duration: 4000,
            position: 'top-center',
            style: {
              background: '#fff',
              color: '#000', // White text color
              width: '500px',
            },
          },
        )
      })
    }, 5000)
  }

  useEffect(() => {
    fetchDetails()
    dispatch(TargetFileList() as any).then((data: any) => {
      setSelectTargers(data.payload)
    })
  }, [])

  const fetchDetails = () => {
    dispatch(getallCollection() as any).then((res: any) => {
      if (res?.payload?.length > 0) {
        let collection = [{ name: '+ New' }, ...res.payload]
        setCollectiondata(collection)
      } else {
        let collection = [{ name: '+ New' }]
        setCollectiondata(collection)
      }
    })
  }

  const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: '#fff',
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#fff',
      color: '#000',
    },
  }))

  const handleDownload = async () => {
    if (getCheckedValue.length > 0) {
      let getId: any = []
      let CTIName: any
      selectedRows.map((item: any) => {
        getId.push({ id: item.id, global: item.global })
        CTIName = item.ctiName
      })

      try {
        const { data } = await Axios.post(
          `${environment.baseUrl}/data/document/download-multiple`,
          getId,
          {
            responseType: 'blob',
            headers: {
              Authorization: `${token.bearerToken}`,
            },
          },
        )
        var reader = new FileReader()
        reader.onload = function (e) {
          const blob = new Blob([data], { type: 'application/zip' })
          const fileURL = URL.createObjectURL(blob)

          const downloadLink = document.createElement('a')
          downloadLink.href = fileURL
          downloadLink.download = `S2S_${state?.title ? state?.title : 'Curated Intel'}.zip`
          downloadLink.click()
          URL.revokeObjectURL(fileURL)
        }
        reader.readAsDataURL(data)
      } catch (err) {
        console.log('err', err)
      }
    }
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

  function capitalizeFirstLetter(name: string): string {
    if (!name) return ''
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
  }

  const handleClosing = () => {
    setAnchorE6(null)
  }

  const handleNavigateCti = (params: any) => {
    const datas: any = JSON.parse(sessionStorage.getItem('ctiReports') as any)
    const CtiParams: any = datas.find((x: any) => x.id == params.ctiReport.id)
    navigateTo(`/app/repoinsightspages/${CtiParams?.id}`, {
      state: {
        title: capitalizeFirstLetter(CtiParams?.ctiName.replace(/-/g, ' ')),
        tab: 2,
        singleparams: CtiParams,
      },
    })
    sessionStorage.setItem('active', 'sources')
    sessionStorage.setItem('insightdata', JSON.stringify(CtiParams))
    sessionStorage.setItem('vault', JSON.stringify(CtiParams))
  }

  const handleNavigateCollection = (params: any) => {
    if (params.sourceType == 'COLLECTION') {
      sessionStorage.setItem('collectionTab', JSON.stringify(1))
    } else if (params.sourceType == 'CTI') {
      sessionStorage.setItem('active', 'sources')
      navigateTo('/app/sourcespage')
      sessionStorage.setItem('srcactiveTab', JSON.stringify(1))
    } else if (params.sourceType == 'WORKBENCH') {
      sessionStorage.setItem('active', 'Chats')
      navigateTo(`/app/chatworkbench/${params?.sourceId}`)
    } else {
      sessionStorage.setItem('active', 'sources')
      navigateTo(`/app/sourcespage`, { state: { tab: 2 } })
      sessionStorage.setItem('srcactiveTab', JSON.stringify(2))
    }
  }

  const hanleTBNavigate = (params: any) => {
    if (params.sourceType == 'THREAT BRIEF') {
      const lists: any = tbList.find((x: any) => x.id == params?.sourceId)
      sessionStorage.setItem('active', 'sources')
      navigateTo(`/app/insightspages/${params?.sourceId}`, {
        state: {
          title: params?.sourceName,
          paramsdata: 'insite',
          vaultId: params?.sourceId,
          tab: 2,
        },
      })
      sessionStorage.setItem('threat', JSON.stringify(lists))
    } else if (params.sourceType == 'WORKBENCH') {
      sessionStorage.setItem('active', 'Chats')
      navigateTo(`/app/chatworkbench/${params?.sourceId}`)
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'NAME',
      flex: 1,
      minWidth: 300,
      sortable: true,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      valueGetter:(params)=> params?.row?.title,
      renderCell: (params: any) => {
        return (
          <>
            {' '}
            <BootstrapTooltip title={params.row.title} arrow placement='bottom'>
              <div>
                <span
                  onClick={(e) => onTitleViewimage(e, params.row, 'view')}
                  className='font-medium font-extrabold !important cursor-pointer'
                >
                  {' '}
                  {params.row.title ? params.row.title : params.row.name}
                </span>{' '}
              </div>
            </BootstrapTooltip>
          </>
        )
      },
    },
    {
      field: 'source',
      headerName: 'AUTHOR',
      minWidth: 200,
      sortable: true,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      renderCell: (params: any) => {
        return (
          <>
            <>
              {params?.row?.source == 'FACTORY_SIGMAHQ' ? (
                <>
                  <BootstrapTooltip title={'Sigma HQ'} arrow placement='bottom'>
                    <div className='flex flex-row'>
                      <svg
                        width='22'
                        height='22'
                        viewBox='0 0 200 200'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M91.4241 200C146.446 200 194.889 155.228 199.626 100C204.362 44.7715 163.598 0 108.576 0C53.5542 0 5.11065 44.7715 0.374297 100C-4.36206 155.228 36.4023 200 91.4241 200V200Z'
                          fill='#20283A'
                        />
                        <path
                          d='M189.445 35.1064C190.088 40.551 188.328 45.7933 184.165 50.8333C180.002 55.8733 174.397 58.3933 167.351 58.3933L153.951 58.4706C162.333 69.7003 166.713 84.1404 165.357 99.8937C162.276 135.675 130.771 164.681 94.9886 164.681C59.2057 164.681 32.6949 135.675 35.7752 99.8937C38.8554 64.1127 70.3602 35.1064 106.143 35.1064H189.445ZM104.107 58.7589C81.3877 58.7589 61.3846 77.1756 59.4289 99.8937C57.4732 122.612 74.3054 141.028 97.0247 141.028C119.744 141.028 139.747 122.612 141.703 99.8937C143.659 77.1756 126.826 58.7589 104.107 58.7589V58.7589Z'
                          fill='#26D2FF'
                        />
                      </svg>
                      <span className='text-white font-inter text-[14px] font-light leading-[20px] ml-[3px]'>
                        sigma
                      </span>
                    </div>
                  </BootstrapTooltip>
                </>
              ) : params.row.source == 'GENERATED' ? (
                <>
                  <BootstrapTooltip title={'System Two Security'} arrow placement='bottom'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='110'
                      height='26'
                      viewBox='0 0 135 26'
                      fill='none'
                    >
                      <path
                        fill-rule='evenodd'
                        clip-rule='evenodd'
                        d='M15.7048 10.8328L16.484 11.6187L19.6481 11.6215V10.6423L17.0979 8.07028H4.27776L3.49855 7.28439V4.83146L4.27776 4.04557H16.3596L17.1388 4.83146H19.6011V3.85505L17.7527 1.28305H2.88462L0.334473 3.85505V8.2608L2.88462 10.8328H15.7048ZM15.7048 15.1671L16.484 14.3812L19.6481 14.3784V15.3576L17.0979 17.9296H4.27776L3.49855 18.7155V21.1684L4.27776 21.9543H16.3596L17.1388 21.1684H19.6011V22.1449L17.7527 24.7169H2.88462L0.334473 22.1449V17.7391L2.88462 15.1671H15.7048Z'
                        fill='url(#paint0_radial_686_29474)'
                      />
                      <path
                        fill-rule='evenodd'
                        clip-rule='evenodd'
                        d='M16.3447 11.9534L15.5656 11.1676H2.74542L0 8.39868V3.71728L2.74542 0.948334H17.9247L19.9362 3.74729V5.16628H16.9996L16.2203 4.38039H4.41756L3.83361 4.96935V7.14661L4.41756 7.73556H17.2377L19.9831 10.5045V11.9566L16.3447 11.9534ZM4.27806 8.07033L3.49884 7.28444V4.83152L4.27806 4.04562H16.3598L17.1391 4.83152H19.6014V3.85511L17.753 1.2831H2.88492L0.334769 3.85511V8.26085L2.88492 10.8329H15.7051L16.4843 11.6187L19.6484 11.6215V10.6423L17.0982 8.07033H4.27806ZM16.3447 14.0466L19.9831 14.0434V15.4955L17.2377 18.2644H4.41756L3.83361 18.8534V21.0307L4.41756 21.6196H16.2203L16.9996 20.8337H19.9362V22.2527L17.9247 25.0517H2.74542L0 22.2827V17.6013L2.74542 14.8324H15.5656L16.3447 14.0466ZM15.7051 15.1672H2.88492L0.334769 17.7392V22.1449L2.88492 24.7169H17.753L19.6014 22.1449V21.1685H17.1391L16.3598 21.9544H4.27806L3.49884 21.1685V18.7156L4.27806 17.9297H17.0982L19.6484 15.3577V14.3785L16.4843 14.3813L15.7051 15.1672Z'
                        fill='url(#paint1_linear_686_29474)'
                      />
                      <path
                        d='M129.204 18.2861C128.639 18.2861 128.144 18.129 127.72 17.8149C127.296 17.4851 126.919 17.1081 126.589 16.6841C126.275 16.26 126.118 15.7653 126.118 15.1998V10.9592C126.118 10.3938 126.275 9.89904 126.589 9.47497C126.919 9.05091 127.296 8.67396 127.72 8.34414C128.144 8.03002 128.639 7.87296 129.204 7.87296H131.914C132.479 7.87296 132.974 8.03002 133.398 8.34414C133.822 8.67396 134.199 9.05091 134.529 9.47497C134.843 9.89904 135 10.3938 135 10.9592V15.1998C135 15.7653 134.843 16.26 134.529 16.6841C134.199 17.1081 133.822 17.4851 133.398 17.8149C132.974 18.129 132.479 18.2861 131.914 18.2861H129.204ZM128.474 15.1056C128.474 15.2627 128.592 15.459 128.827 15.6946C129.063 15.9302 129.259 16.048 129.416 16.048H131.702C131.859 16.048 132.055 15.9302 132.291 15.6946C132.526 15.459 132.644 15.2627 132.644 15.1056V11.0534C132.644 10.8964 132.526 10.7 132.291 10.4645C132.055 10.2289 131.859 10.1111 131.702 10.1111H129.416C129.259 10.1111 129.063 10.2289 128.827 10.4645C128.592 10.7 128.474 10.8964 128.474 11.0534V15.1056Z'
                        fill='white'
                      />
                      <path
                        d='M122.494 7.99051H124.968L121.905 18.168H119.502L117.499 11.5951L115.45 18.168H113.047L110.031 7.99051H112.529L114.319 14.5399L116.274 7.99051H118.748L120.656 14.5399L122.494 7.99051Z'
                        fill='white'
                      />
                      <path
                        d='M109.35 10.2289H106.429V14.9878C106.429 15.1448 106.547 15.3412 106.782 15.5768C107.018 15.8124 107.214 15.9302 107.371 15.9302H108.973V18.1683H107.159C106.594 18.1683 106.099 18.0112 105.675 17.6971C105.251 17.3673 104.874 16.9903 104.544 16.5662C104.23 16.1422 104.073 15.6474 104.073 15.082V10.2289H102.495V7.99074H104.073V4.07993H106.429V7.99074H109.35V10.2289Z'
                        fill='white'
                      />
                      <path d='M93.292 18.1742V15.9596H102.456V18.1742H93.292Z' fill='#FF8801' />
                      <path
                        d='M90.8573 9.47497C91.1714 9.89904 91.3285 10.3938 91.3285 10.9592V18.1683H88.9725V11.0534C88.9725 10.8964 88.8547 10.7 88.6192 10.4645C88.3836 10.2289 88.1872 10.1111 88.0302 10.1111H86.9465C86.5695 10.1111 86.114 10.4173 85.58 11.0299V18.1683H83.2241V11.0534C83.2241 10.8964 83.1063 10.7 82.8707 10.4645C82.6351 10.2289 82.4388 10.1111 82.2818 10.1111H81.1509C80.7583 10.1111 80.2949 10.4173 79.7609 11.0299V18.1683H77.405V10.0875L77.1694 7.99075H79.4547L79.596 8.60329C80.24 8.1164 80.7347 7.87296 81.0802 7.87296H82.4938C83.0592 7.87296 83.5539 8.03002 83.978 8.34414C84.088 8.42267 84.3235 8.64255 84.6848 9.00379C85.6586 8.2499 86.3889 7.87296 86.8758 7.87296H88.2422C88.8076 7.87296 89.3024 8.03002 89.7264 8.34414C90.1505 8.67396 90.5274 9.05091 90.8573 9.47497Z'
                        fill='white'
                      />
                      <path
                        d='M74.7767 14.1868H68.2744V15.1292C68.2744 15.2862 68.3922 15.4825 68.6278 15.7181C68.8633 15.9537 69.0597 16.0715 69.2167 16.0715H71.6669C71.714 16.0715 71.769 16.0558 71.8318 16.0244C71.8946 15.9773 71.9574 15.9145 72.0203 15.8359C72.0988 15.7574 72.1616 15.6867 72.2087 15.6239C72.2559 15.5611 72.3187 15.4825 72.3972 15.3883C72.4757 15.2784 72.5307 15.1998 72.5621 15.1527L74.7531 15.8124C74.4076 16.4877 73.96 17.0689 73.4103 17.5557C72.8605 18.0426 72.2637 18.2861 71.6198 18.2861H69.0047C68.4393 18.2861 67.9445 18.129 67.5205 17.8149C67.0964 17.4851 66.7195 17.1081 66.3896 16.6841C66.0755 16.26 65.9185 15.7653 65.9185 15.1998V10.9592C65.9185 10.3938 66.0755 9.89904 66.3896 9.47497C66.7195 9.05091 67.0964 8.67396 67.5205 8.34414C67.9445 8.03002 68.4393 7.87296 69.0047 7.87296H71.6904C72.2559 7.87296 72.7506 8.03002 73.1747 8.34414C73.5987 8.67396 73.9757 9.05091 74.3055 9.47497C74.6196 9.89904 74.7767 10.3938 74.7767 10.9592V14.1868ZM69.2167 10.0875C69.0597 10.0875 68.8633 10.2053 68.6278 10.4409C68.3922 10.6765 68.2744 10.8728 68.2744 11.0299V12.1372H72.4208V11.0299C72.4208 10.8728 72.303 10.6765 72.0674 10.4409C71.8318 10.2053 71.6355 10.0875 71.4784 10.0875H69.2167Z'
                        fill='white'
                      />
                      <path
                        d='M64.0364 10.2289H61.115V14.9878C61.115 15.1448 61.2328 15.3412 61.4684 15.5768C61.704 15.8124 61.9003 15.9302 62.0574 15.9302H63.6594V18.1683H61.8454C61.2799 18.1683 60.7852 18.0112 60.3611 17.6971C59.9371 17.3673 59.5601 16.9903 59.2303 16.5662C58.9162 16.1422 58.7591 15.6474 58.7591 15.082V10.2289H57.1807V7.99074H58.7591V4.07993H61.115V7.99074H64.0364V10.2289Z'
                        fill='white'
                      />
                      <path
                        d='M49.691 18.2861C49.047 18.2861 48.4502 18.0426 47.9005 17.5557C47.3508 17.0689 46.9032 16.4877 46.5576 15.8124L48.7486 15.1527C49.2198 15.7495 49.5261 16.048 49.6674 16.048H52.471C52.628 16.048 52.8243 15.9302 53.0599 15.6946C53.2955 15.459 53.4133 15.2627 53.4133 15.1056V14.658C53.4133 14.4538 53.3034 14.3439 53.0835 14.3281L49.1256 13.9512C48.4659 13.8884 47.9319 13.6528 47.5235 13.2444C47.1152 12.8361 46.911 12.2707 46.911 11.5482V10.9592C46.911 10.3938 47.0681 9.89904 47.3822 9.47497C47.712 9.05091 48.089 8.67396 48.513 8.34414C48.9371 8.03002 49.4318 7.87296 49.9972 7.87296H52.5652C53.2091 7.87296 53.806 8.1164 54.3557 8.60329C54.9054 9.09017 55.353 9.6713 55.6985 10.3467L53.5076 11.0063C53.0364 10.4095 52.7301 10.1111 52.5887 10.1111H50.2093C50.0522 10.1111 49.8559 10.2289 49.6203 10.4645C49.3847 10.7 49.2669 10.8964 49.2669 11.0534V11.4539C49.2669 11.6267 49.3847 11.7288 49.6203 11.7602L53.4369 12.1843C54.1279 12.2628 54.6855 12.5062 55.1096 12.9146C55.5493 13.3073 55.7692 13.8727 55.7692 14.6109V15.1998C55.7692 15.7653 55.6122 16.26 55.298 16.6841C54.9682 17.1081 54.5913 17.4851 54.1672 17.8149C53.7431 18.129 53.2484 18.2861 52.683 18.2861H49.691Z'
                        fill='white'
                      />
                      <path
                        d='M43.4243 7.99069H45.9216L40.927 21.9848H38.5476L39.9611 18.1682H39.7491L36.0503 7.99069H38.6418L41.0448 14.9171L43.4243 7.99069Z'
                        fill='white'
                      />
                      <path
                        d='M28.9844 18.2861C28.3405 18.2861 27.7437 18.0426 27.1939 17.5557C26.6442 17.0689 26.1966 16.4877 25.8511 15.8124L28.0421 15.1527C28.5133 15.7495 28.8195 16.048 28.9609 16.048H31.7644C31.9215 16.048 32.1178 15.9302 32.3534 15.6946C32.589 15.459 32.7068 15.2627 32.7068 15.1056V14.658C32.7068 14.4538 32.5968 14.3439 32.3769 14.3281L28.419 13.9512C27.7594 13.8884 27.2254 13.6528 26.817 13.2444C26.4086 12.8361 26.2045 12.2707 26.2045 11.5482V10.9592C26.2045 10.3938 26.3615 9.89904 26.6756 9.47497C27.0055 9.05091 27.3824 8.67396 27.8065 8.34414C28.2305 8.03002 28.7253 7.87296 29.2907 7.87296H31.8586C32.5026 7.87296 33.0994 8.1164 33.6491 8.60329C34.1988 9.09017 34.6465 9.6713 34.992 10.3467L32.801 11.0063C32.3298 10.4095 32.0236 10.1111 31.8822 10.1111H29.5027C29.3457 10.1111 29.1493 10.2289 28.9138 10.4645C28.6782 10.7 28.5604 10.8964 28.5604 11.0534V11.4539C28.5604 11.6267 28.6782 11.7288 28.9138 11.7602L32.7303 12.1843C33.4214 12.2628 33.979 12.5062 34.403 12.9146C34.8428 13.3073 35.0627 13.8727 35.0627 14.6109V15.1998C35.0627 15.7653 34.9056 16.26 34.5915 16.6841C34.2617 17.1081 33.8847 17.4851 33.4607 17.8149C33.0366 18.129 32.5419 18.2861 31.9764 18.2861H28.9844Z'
                        fill='white'
                      />
                      <defs>
                        <radialGradient
                          id='paint0_radial_686_29474'
                          cx='0'
                          cy='0'
                          r='1'
                          gradientUnits='userSpaceOnUse'
                          gradientTransform='translate(15.7086 12.7547) rotate(0.677143) scale(14.6221 13.4003)'
                        >
                          <stop stop-color='#FFC700' />
                          <stop offset='1' stop-color='#FF7B01' />
                        </radialGradient>
                        <linearGradient
                          id='paint1_linear_686_29474'
                          x1='11.4704'
                          y1='1.2831'
                          x2='11.4704'
                          y2='24.7169'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop offset='0.00792456' stop-color='#FFC791' />
                          <stop offset='0.147503' stop-color='#EE8012' />
                          <stop offset='0.296299' stop-color='#F9CD59' />
                          <stop offset='0.476698' stop-color='#F3910C' />
                          <stop offset='0.656382' stop-color='#FFE072' />
                          <stop offset='0.805799' stop-color='#F6880A' />
                        </linearGradient>
                      </defs>
                    </svg>
                  </BootstrapTooltip>
                </>
              ) : (
                <>
                  <svg
                    width='110'
                    height='26'
                    viewBox='0 0 136 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <g clip-path='url(#clip0_1307_33928)'>
                      <path
                        d='M15.69 21.4694C15.5661 21.5998 15.3982 21.9673 15.243 22.1637C11.5275 26.8119 5.3694 21.6824 8.49883 17.3287C10.2303 14.919 14.1253 15.174 15.5429 17.792C15.8325 17.9847 16.839 17.1288 17.11 16.8918C18.1408 15.9892 19.0523 14.67 19.4484 13.3233C19.6313 12.6997 19.6742 12.0652 19.8248 11.4379L23.07 10.3043C23.2507 14.4809 21.1972 18.4204 17.7053 20.4997C17.3184 20.7296 15.8336 21.3185 15.69 21.4694Z'
                        fill='#F99500'
                      />
                      <path
                        d='M6.16046 20.3597C2.16934 18.1799 0.0486951 13.0181 1.16287 8.47168C-1.4917 5.61428 0.72971 1.20548 4.48109 1.44729C9.11384 1.74655 9.89794 8.43337 5.1262 9.65198C4.75789 9.74655 4.27377 9.55742 4.1927 10.0039C4.11626 10.4265 4.15911 11.675 4.20659 12.1443C4.40233 14.0859 5.62074 15.7606 6.92834 17.063L6.16046 20.3586V20.3597Z'
                        fill='#29BB27'
                      />
                      <path
                        d='M7.55151 0.848674C10.806 -0.422611 13.9401 -0.244248 17.073 1.24011C17.3706 1.38137 18.0354 1.89252 18.2729 1.92484C18.6736 1.9799 19.4183 1.65669 20.0044 1.67944C24.3557 1.84822 25.5602 7.91257 21.5633 9.64353C18.2694 11.0704 14.723 8.1029 15.8847 4.48776C15.8731 4.11068 14.401 3.63425 14.0374 3.53848C12.4449 3.1219 10.9705 3.19133 9.39883 3.66298L7.55151 0.847477V0.848674Z'
                        fill='#248EFF'
                      />
                    </g>
                    <path
                      d='M34.5199 8.09091V9.79545H28.5611V8.09091H34.5199ZM30.1591 5.47727H32.2827V15.7969C32.2827 16.2088 32.3442 16.5189 32.4673 16.7273C32.5904 16.9309 32.7491 17.0705 32.9432 17.1463C33.142 17.2173 33.3575 17.2528 33.5895 17.2528C33.7599 17.2528 33.9091 17.241 34.0369 17.2173C34.1648 17.1937 34.2642 17.1747 34.3352 17.1605L34.7188 18.9148C34.5956 18.9621 34.4205 19.0095 34.1932 19.0568C33.9659 19.1089 33.6818 19.1373 33.3409 19.142C32.7822 19.1515 32.2614 19.0521 31.7784 18.8438C31.2955 18.6354 30.9048 18.3134 30.6065 17.8778C30.3082 17.4422 30.1591 16.8954 30.1591 16.2372V5.47727ZM39.2269 12.5227V19H37.1033V4.45455H39.1985V9.86648H39.3335C39.5891 9.27936 39.9798 8.81297 40.5053 8.46733C41.0309 8.12169 41.7174 7.94886 42.565 7.94886C43.3131 7.94886 43.9665 8.10275 44.5252 8.41051C45.0887 8.71828 45.5243 9.17756 45.832 9.78835C46.1445 10.3944 46.3008 11.152 46.3008 12.0611V19H44.1772V12.3168C44.1772 11.5166 43.9712 10.8963 43.5593 10.456C43.1474 10.0109 42.5745 9.78835 41.8406 9.78835C41.3387 9.78835 40.8888 9.89489 40.4911 10.108C40.0981 10.321 39.788 10.6335 39.5607 11.0455C39.3382 11.4527 39.2269 11.9451 39.2269 12.5227ZM49.1346 19V8.09091H51.2582V19H49.1346ZM50.207 6.40767C49.8377 6.40767 49.5205 6.28456 49.2553 6.03835C48.9949 5.7874 48.8647 5.48911 48.8647 5.14347C48.8647 4.79309 48.9949 4.49479 49.2553 4.24858C49.5205 3.99763 49.8377 3.87216 50.207 3.87216C50.5763 3.87216 50.8912 3.99763 51.1516 4.24858C51.4168 4.49479 51.5494 4.79309 51.5494 5.14347C51.5494 5.48911 51.4168 5.7874 51.1516 6.03835C50.8912 6.28456 50.5763 6.40767 50.207 6.40767ZM54.1151 19V8.09091H56.1676V9.82386H56.2812C56.4801 9.23674 56.8305 8.77509 57.3324 8.43892C57.839 8.09801 58.4119 7.92756 59.0511 7.92756C59.1837 7.92756 59.34 7.93229 59.5199 7.94176C59.7045 7.95123 59.849 7.96307 59.9531 7.97727V10.0085C59.8679 9.98485 59.7164 9.95881 59.4986 9.9304C59.2808 9.89725 59.063 9.88068 58.8452 9.88068C58.3433 9.88068 57.8958 9.98722 57.5028 10.2003C57.1146 10.4086 56.8068 10.6998 56.5795 11.0739C56.3523 11.4432 56.2386 11.8646 56.2386 12.3381V19H54.1151ZM65.484 19.2131C64.6033 19.2131 63.8174 18.9882 63.1261 18.5384C62.4395 18.0838 61.8997 17.4375 61.5067 16.5994C61.1185 15.7566 60.9244 14.7457 60.9244 13.5668C60.9244 12.3878 61.1209 11.3793 61.5138 10.5412C61.9116 9.70312 62.4561 9.06155 63.1474 8.61648C63.8387 8.1714 64.6223 7.94886 65.4982 7.94886C66.1753 7.94886 66.7198 8.0625 67.1317 8.28977C67.5484 8.51231 67.8704 8.77273 68.0977 9.07102C68.3297 9.36932 68.5096 9.6321 68.6374 9.85938H68.7653V4.45455H70.8888V19H68.815V17.3026H68.6374C68.5096 17.5346 68.3249 17.7997 68.0835 18.098C67.8467 18.3963 67.52 18.6567 67.1033 18.8793C66.6867 19.1018 66.1469 19.2131 65.484 19.2131ZM65.9528 17.402C66.5636 17.402 67.0797 17.241 67.5011 16.919C67.9272 16.5923 68.2492 16.1402 68.467 15.5625C68.6895 14.9848 68.8008 14.3125 68.8008 13.5455C68.8008 12.7879 68.6919 12.125 68.4741 11.5568C68.2563 10.9886 67.9367 10.5459 67.5153 10.2287C67.0939 9.91146 66.573 9.75284 65.9528 9.75284C65.3136 9.75284 64.7809 9.91856 64.3548 10.25C63.9286 10.5814 63.6067 11.0336 63.3888 11.6065C63.1758 12.1795 63.0692 12.8258 63.0692 13.5455C63.0692 14.2746 63.1781 14.9304 63.396 15.5128C63.6138 16.0952 63.9357 16.5568 64.3619 16.8977C64.7927 17.2339 65.323 17.402 65.9528 17.402ZM82.3945 19V20.804H73.1545V19H82.3945ZM84.7205 23.0909V8.09091H86.7944V9.85938H86.9719C87.0951 9.6321 87.2726 9.36932 87.5046 9.07102C87.7366 8.77273 88.0586 8.51231 88.4705 8.28977C88.8825 8.0625 89.427 7.94886 90.104 7.94886C90.9847 7.94886 91.7707 8.1714 92.462 8.61648C93.1533 9.06155 93.6954 9.70312 94.0884 10.5412C94.4862 11.3793 94.685 12.3878 94.685 13.5668C94.685 14.7457 94.4885 15.7566 94.0955 16.5994C93.7025 17.4375 93.1628 18.0838 92.4762 18.5384C91.7897 18.9882 91.006 19.2131 90.1254 19.2131C89.4625 19.2131 88.9203 19.1018 88.4989 18.8793C88.0823 18.6567 87.7556 18.3963 87.5188 18.098C87.2821 17.7997 87.0998 17.5346 86.9719 17.3026H86.8441V23.0909H84.7205ZM86.8015 13.5455C86.8015 14.3125 86.9128 14.9848 87.1353 15.5625C87.3578 16.1402 87.6798 16.5923 88.1012 16.919C88.5226 17.241 89.0387 17.402 89.6495 17.402C90.284 17.402 90.8143 17.2339 91.2404 16.8977C91.6665 16.5568 91.9885 16.0952 92.2063 15.5128C92.4289 14.9304 92.5401 14.2746 92.5401 13.5455C92.5401 12.8258 92.4312 12.1795 92.2134 11.6065C92.0004 11.0336 91.6784 10.5814 91.2475 10.25C90.8214 9.91856 90.2887 9.75284 89.6495 9.75284C89.034 9.75284 88.5131 9.91146 88.087 10.2287C87.6656 10.5459 87.346 10.9886 87.1282 11.5568C86.9104 12.125 86.8015 12.7879 86.8015 13.5455ZM100.239 19.2415C99.5477 19.2415 98.9227 19.1136 98.364 18.858C97.8053 18.5975 97.3626 18.2211 97.0359 17.7287C96.7139 17.2363 96.5529 16.6326 96.5529 15.9176C96.5529 15.3021 96.6713 14.7955 96.908 14.3977C97.1448 14 97.4644 13.6851 97.8668 13.4531C98.2693 13.2211 98.7191 13.0459 99.2163 12.9276C99.7134 12.8092 100.22 12.7192 100.736 12.6577C101.39 12.5819 101.92 12.5204 102.327 12.473C102.734 12.4209 103.03 12.3381 103.215 12.2244C103.4 12.1108 103.492 11.9261 103.492 11.6705V11.6207C103.492 11.0005 103.317 10.5199 102.966 10.179C102.621 9.83807 102.105 9.66761 101.418 9.66761C100.703 9.66761 100.14 9.82623 99.7276 10.1435C99.3204 10.456 99.0387 10.804 98.8825 11.1875L96.8867 10.733C97.1235 10.0701 97.4691 9.53504 97.9237 9.12784C98.3829 8.71591 98.9109 8.41761 99.5075 8.23295C100.104 8.04356 100.731 7.94886 101.39 7.94886C101.825 7.94886 102.287 8.00095 102.775 8.10511C103.267 8.20455 103.726 8.3892 104.152 8.65909C104.583 8.92898 104.936 9.31487 105.211 9.81676C105.485 10.3139 105.623 10.9602 105.623 11.7557V19H103.549V17.5085H103.463C103.326 17.7831 103.12 18.053 102.846 18.3182C102.571 18.5833 102.218 18.8035 101.787 18.9787C101.356 19.1539 100.84 19.2415 100.239 19.2415ZM100.701 17.5369C101.288 17.5369 101.79 17.4209 102.206 17.1889C102.628 16.9569 102.947 16.6539 103.165 16.2798C103.388 15.901 103.499 15.4962 103.499 15.0653V13.6591C103.423 13.7348 103.276 13.8059 103.059 13.8722C102.846 13.9337 102.602 13.9882 102.327 14.0355C102.052 14.0781 101.785 14.1184 101.525 14.1562C101.264 14.1894 101.046 14.2178 100.871 14.2415C100.459 14.2936 100.083 14.3812 99.7418 14.5043C99.4057 14.6274 99.1358 14.8049 98.9322 15.0369C98.7333 15.2642 98.6339 15.5672 98.6339 15.946C98.6339 16.4716 98.828 16.8693 99.2163 17.1392C99.6045 17.4044 100.099 17.5369 100.701 17.5369ZM108.451 19V8.09091H110.504V9.82386H110.617C110.816 9.23674 111.166 8.77509 111.668 8.43892C112.175 8.09801 112.748 7.92756 113.387 7.92756C113.52 7.92756 113.676 7.93229 113.856 7.94176C114.04 7.95123 114.185 7.96307 114.289 7.97727V10.0085C114.204 9.98485 114.052 9.95881 113.835 9.9304C113.617 9.89725 113.399 9.88068 113.181 9.88068C112.679 9.88068 112.232 9.98722 111.839 10.2003C111.451 10.4086 111.143 10.6998 110.915 11.0739C110.688 11.4432 110.575 11.8646 110.575 12.3381V19H108.451ZM121.864 8.09091V9.79545H115.905V8.09091H121.864ZM117.503 5.47727H119.626V15.7969C119.626 16.2088 119.688 16.5189 119.811 16.7273C119.934 16.9309 120.093 17.0705 120.287 17.1463C120.486 17.2173 120.701 17.2528 120.933 17.2528C121.104 17.2528 121.253 17.241 121.381 17.2173C121.509 17.1937 121.608 17.1747 121.679 17.1605L122.062 18.9148C121.939 18.9621 121.764 19.0095 121.537 19.0568C121.31 19.1089 121.026 19.1373 120.685 19.142C120.126 19.1515 119.605 19.0521 119.122 18.8438C118.639 18.6354 118.249 18.3134 117.95 17.8778C117.652 17.4422 117.503 16.8954 117.503 16.2372V5.47727ZM125.555 23.0909C125.238 23.0909 124.949 23.0649 124.689 23.0128C124.428 22.9654 124.234 22.9134 124.106 22.8565L124.618 21.1165C125.006 21.2206 125.351 21.2656 125.654 21.2514C125.958 21.2372 126.225 21.1236 126.457 20.9105C126.694 20.6974 126.902 20.3494 127.082 19.8665L127.345 19.142L123.353 8.09091H125.626L128.389 16.5568H128.502L131.265 8.09091H133.545L129.049 20.456C128.841 21.0241 128.576 21.5047 128.254 21.8977C127.932 22.2955 127.548 22.5938 127.103 22.7926C126.658 22.9915 126.142 23.0909 125.555 23.0909Z'
                      fill='white'
                    />
                    <defs>
                      <clipPath id='clip0_1307_33928'>
                        <rect width='24' height='24' fill='white' />
                      </clipPath>
                    </defs>
                  </svg>
                </>
              )}
            </>
          </>
        )
      },
    },
    {
      field: 'Platforms',
      headerName: 'TRANSLATIONS',
      width: 200,
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
      field: 'sourceType',
      headerName: 'SOURCE TYPE',
      width: 230,
      sortable: true,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      renderCell: (params: any) => {
        return (
          <>
            <div className='cursor-pointer' onClick={() => handleNavigateCollection(params.row)}>
              <span>{params.row.sourceType == 'CTI' ? 'CTI REPORT' : params.row.sourceType}</span>
            </div>
          </>
        )
      },
    },
    {
      field: 'sourceName',
      headerName: paramsdata == 'commensigmarule' ? 'SOURCE NAME' : 'CTI Name',
      width: 230,
      sortable: true,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      renderCell: (params: any) => {
        return (
          <>
            <div className='flex truncate w-full'>
              <div className='truncate w-[85%]'>
                {params.row.ctiReport ? (
                  <div className='cursor-pointer' onClick={() => handleNavigateCti(params.row)}>
                    <BootstrapTooltip title={params.row.ctiName} arrow placement='bottom'>
                      <span>{params.row.sourceName}</span>
                    </BootstrapTooltip>
                  </div>
                ) : (
                  <BootstrapTooltip title={params.row.sourceName} arrow placement='bottom'>
                    <div className='cursor-pointer' onClick={() => hanleTBNavigate(params.row)}>
                      <span>{params.row.sourceName}</span>
                    </div>
                  </BootstrapTooltip>
                )}
              </div>
            </div>
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
            <Menu
              sx={{
                '& .MuiPaper-root': {
                  backgroundColor: '#2C3A4F',
                  color: '#fff',
                },
              }}
              anchorEl={anchorE6}
              open={opendot}
              onClose={handleClosing}
            >
              <div
                className={`right-0 px-5 text-[#fff] ${paramsdata == 'ctisigma' ? 'w-[240px]' : 'w-[200px]'
                  }`}
              >
                {paramsdata == 'commensigmarule' && (
                  <ul>
                    <>
                      <button
                        className='flex viewer'
                        onClick={(e) =>
                          onViewimage(e, params.row, paramsdata == 'ctisigma' ? 'view' : null)
                        }
                      >
                        <li className='m-1 text-sm font-medium'>View</li>
                      </button>
                    </>

                    <>
                      <button className='flex'>
                        <li
                          className='text-sm font-medium m-1'
                          onClick={() => handleOpenCollection('singlecollecioncopy')}
                        >
                          Copy
                        </li>
                      </button>
                    </>
                    <>
                      <button className='flex'>
                        <li
                          className='text-sm font-medium m-1'
                          onClick={() => handleOpenCollection('singlecollecionmove')}
                        >
                          Move to Collection
                        </li>
                      </button>
                    </>
                    <button
                      type='button'
                      className='flex'
                      onClick={(e: any) => handleClickdelete(e, params?.row)}
                    >
                      <span className='m-1  text-sm font-medium'> Delete</span>
                    </button>
                  </ul>
                )}
                {paramsdata == 'ctisigma' && (
                  <ul>
                    <>
                      <button
                        className='flex viewer'
                        onClick={(e) =>
                          onViewimage(e, params.row, paramsdata == 'ctisigma' ? 'view' : 'fullview')
                        }
                      >
                        <li className='m-1 text-sm font-medium'>View Code</li>
                      </button>
                    </>

                    <>
                      <button className='flex'>
                        <li
                          className='text-sm font-medium m-1'
                          onClick={() => handleOpenInboxCollection('singleInbox')}
                        >
                          Copy to Detection Lab
                        </li>
                      </button>
                    </>

                    <>
                      <button className='flex'>
                        <li
                          className='text-sm font-medium m-1'
                          onClick={() => handleOpenCollection('cticollecioncopy')}
                        >
                          Copy to Collection
                        </li>
                      </button>
                    </>
                  </ul>
                )}
              </div>
            </Menu>
          </>
        )
      },
    },
  ]

  const filterdata: any = tablelist
    ?.filter(
      (collection: any) =>
        collection?.name.toLowerCase().includes(search.toLowerCase()) ||
        collection?.title?.toLowerCase().includes(search.toLowerCase()) ||
        collection?.sourceName?.toLowerCase().includes(search.toLowerCase()) ||
        collection?.sourceType?.toLowerCase().includes(search.toLowerCase()) ||
        collection?.datavault?.name?.toLowerCase().includes(search.toLowerCase()) ||
        collection?.srctype?.toLowerCase().includes(search.toLowerCase()) ||
        collection?.author?.toLowerCase().includes(search.toLowerCase()),
    )

  return (
    <div className='w-full'>
      {paramsdata == 'ctisigma' && (
        <div className='flex items-center justify-between gap-4 p-4 mt-12 w-full max-md:flex-wrap'>
          {/* Search Box */}
          <div className='max-md:w-full'>
            <div className='flex items-center space-x-2 bg-dark max-md:w-full'>
              <div className='flex items-center box-border bg-[#48576c] p-2 rounded-lg border border-[#6e7580] w-[376px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] max-md:w-full'>
                <input
                  type='text'
                  placeholder='Search'
                  className='bg-[#48576c] outline-none rounded-l-lg text-[#fff] w-full  placeholder-[#fff]'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                >
                  <path
                    d='M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z'
                    stroke='white'
                    stroke-width='1.66667'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center gap-4 ml-auto space-x-3'>
            <div className='flex space-x-2'>
              <svg
                onClick={handleDownload}
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                className={
                  selectedRows?.length == 0 && getCheckedValue.length == 0
                    ? 'cursor-not-allowed opacity-50 hover'
                    : 'cursor-pointer'
                }
                fill='none'
              >
                <path
                  d='M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 10L12 15M12 15L7 10M12 15V3'
                  stroke='white'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                />
              </svg>
            </div>
            <button
              disabled={selectedRows?.length == 0 && getCheckedValue.length == 0 ? true : false}
              className={`bg-orange-600 text-white py-1 px-4 rounded-lg ${selectedRows?.length == 0 && getCheckedValue.length == 0
                ? 'cursor-not-allowed opacity-50 hover'
                : 'cursor-pointer hover:bg-[#6941c6]'
                }`}
              onClick={() => handleOpenCollection('ctireport')}
            >
              Copy to Collection
            </button>
            <Divider orientation='vertical' flexItem sx={{ borderColor: '#c2c8d3', mx: 2 }} />
            <button
              onClick={() => handleOpenInboxCollection('multipleInbox')}
              disabled={
                (selectedRows?.length == 0 && getCheckedValue.length == 0) ||
                  selectedRows?.length != filterdata?.length
                  ? true
                  : false
              }
              className={`bg-orange-600 text-white py-1 px-4 rounded-lg ${selectedRows?.length == 0 || selectedRows?.length != filterdata?.length
                ? 'cursor-not-allowed opacity-50 hover'
                : 'cursor-pointer'
                }`}
            >
              Copy all to detection lab
            </button>
          </div>
        </div>
      )}
      {paramsdata == 'commensigmarule' && (
        <div className='flex items-center justify-between gap-4  w-full p-4 mt-6 max-md:flex-wrap'>
          {/* Search Box */}
          <div className='max-md:w-full'>
            <div className='flex items-center space-x-2 bg-dark max-md:w-full'>
              <div className='flex items-center box-border bg-[#48576c] p-2 rounded-lg border border-[#6e7580] w-[376px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] max-md:w-full'>
                <input
                  type='text'
                  placeholder='Search'
                  className='bg-[#48576c] outline-none rounded-l-lg text-[#fff] w-full  placeholder-[#fff]'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                >
                  <path
                    d='M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z'
                    stroke='white'
                    stroke-width='1.66667'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center gap-4 ml-auto space-x-3'>
            <div className='flex space-x-4 items-center'>
              <BootstrapTooltip title={'Copy'} arrow placement='bottom'>
                <svg
                  onClick={() => handleOpenCollection('collecioncopy')}
                  className={
                    selectedRows?.length == 0 && getCheckedValue.length == 0
                      ? 'cursor-not-allowed opacity-50 hover'
                      : 'cursor-pointer'
                  }
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <path
                    d='M8 8V5.2C8 4.0799 8 3.51984 8.21799 3.09202C8.40973 2.71569 8.71569 2.40973 9.09202 2.21799C9.51984 2 10.0799 2 11.2 2H18.8C19.9201 2 20.4802 2 20.908 2.21799C21.2843 2.40973 21.5903 2.71569 21.782 3.09202C22 3.51984 22 4.0799 22 5.2V12.8C22 13.9201 22 14.4802 21.782 14.908C21.5903 15.2843 21.2843 15.5903 20.908 15.782C20.4802 16 19.9201 16 18.8 16H16M5.2 22H12.8C13.9201 22 14.4802 22 14.908 21.782C15.2843 21.5903 15.5903 21.2843 15.782 20.908C16 20.4802 16 19.9201 16 18.8V11.2C16 10.0799 16 9.51984 15.782 9.09202C15.5903 8.71569 15.2843 8.40973 14.908 8.21799C14.4802 8 13.9201 8 12.8 8H5.2C4.0799 8 3.51984 8 3.09202 8.21799C2.71569 8.40973 2.40973 8.71569 2.21799 9.09202C2 9.51984 2 10.0799 2 11.2V18.8C2 19.9201 2 20.4802 2.21799 20.908C2.40973 21.2843 2.71569 21.5903 3.09202 21.782C3.51984 22 4.07989 22 5.2 22Z'
                    stroke='white'
                    stroke-width='2'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
              </BootstrapTooltip>
              <BootstrapTooltip title={'Move'} arrow placement='bottom'>
                <svg
                  onClick={() => handleOpenCollection('collecionmove')}
                  className={
                    selectedRows?.length == 0 && getCheckedValue.length == 0
                      ? 'cursor-not-allowed opacity-50 hover'
                      : 'cursor-pointer'
                  }
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='24'
                  viewBox='0 0 20 24'
                  fill='none'
                >
                  <path
                    d='M11.6178 10.2589C11.3189 9.93347 10.8129 9.91191 10.4874 10.2108C10.162 10.5096 10.1405 11.0157 10.4393 11.3411L11.7791 12.8H6.39997C5.95813 12.8 5.59997 13.1582 5.59997 13.6C5.59997 14.0418 5.95813 14.4 6.39997 14.4H11.7791L10.4393 15.8589C10.1405 16.1843 10.162 16.6904 10.4874 16.9892C10.8129 17.2881 11.3189 17.2666 11.6178 16.9411L14.1892 14.1411C14.4702 13.8351 14.4702 13.3649 14.1892 13.0589L11.6178 10.2589Z'
                    fill='white'
                  />
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M0 6.4C0 2.86538 2.86536 0 6.4 0H12.254C13.0646 0 13.8449 0.30758 14.4374 0.860624L18.9834 5.10356C19.6318 5.70876 20 6.55596 20 7.44292V17.6C20 21.1346 17.1346 24 13.6 24H6.4C2.86536 24 0 21.1346 0 17.6V6.4ZM6.4 1.6C3.74904 1.6 1.6 3.74904 1.6 6.4V17.6C1.6 20.251 3.74904 22.4 6.4 22.4H13.6C16.251 22.4 18.4 20.251 18.4 17.6V7.2H15.2C13.4327 7.2 12 5.76732 12 4V1.6H6.4ZM13.6 2.26764L17.1704 5.6H15.2C14.3164 5.6 13.6 4.88364 13.6 4V2.26764Z'
                    fill='white'
                  />
                </svg>
              </BootstrapTooltip>
              <BootstrapTooltip title={'Download'} arrow placement='bottom'>
                <svg
                  onClick={handleDownload}
                  xmlns='http://www.w3.org/2000/svg'
                  className={
                    selectedRows?.length == 0 && getCheckedValue.length == 0
                      ? 'cursor-not-allowed opacity-50 hover'
                      : 'cursor-pointer'
                  }
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <path
                    d='M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 10L12 15M12 15L7 10M12 15V3'
                    stroke='white'
                    stroke-width='2'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
              </BootstrapTooltip>
              <BootstrapTooltip title={'Delete'} arrow placement='bottom'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  onClick={handleDeleteMultipleFiles}
                  className={
                    selectedRows?.length == 0 && getCheckedValue.length == 0
                      ? 'cursor-not-allowed opacity-50 hover'
                      : 'cursor-pointer'
                  }
                  width='19'
                  height='22'
                  viewBox='0 0 19 22'
                  fill='none'
                >
                  <path
                    d='M7.27908 18.0732C7.52248 18.0732 7.75591 17.9765 7.92802 17.8044C8.10013 17.6323 8.19682 17.3989 8.19682 17.1555V7.2333C8.19682 6.9899 8.10013 6.75647 7.92802 6.58435C7.75591 6.41224 7.52248 6.31555 7.27908 6.31555C7.03567 6.31555 6.80224 6.41224 6.63013 6.58435C6.45802 6.75647 6.36133 6.9899 6.36133 7.2333V17.1686C6.36477 17.4097 6.46298 17.6398 6.63472 17.8091C6.80646 17.9783 7.03793 18.0732 7.27908 18.0732Z'
                    fill='white'
                  />
                  <path
                    d='M11.7209 18.0732C11.9643 18.0732 12.1977 17.9765 12.3699 17.8044C12.542 17.6323 12.6387 17.3989 12.6387 17.1555V7.2333C12.6387 6.9899 12.542 6.75647 12.3699 6.58435C12.1977 6.41224 11.9643 6.31555 11.7209 6.31555C11.4775 6.31555 11.2441 6.41224 11.072 6.58435C10.8999 6.75647 10.8032 6.9899 10.8032 7.2333V17.1686C10.8066 17.4097 10.9048 17.6398 11.0766 17.8091C11.2483 17.9783 11.4798 18.0732 11.7209 18.0732Z'
                    fill='white'
                  />
                  <path
                    d='M0.917748 4.38567H1.65457V17.2341C1.65596 18.4507 2.13986 19.6171 3.00011 20.4773C3.86037 21.3376 5.02672 21.8215 6.24331 21.8229H12.7567C13.9733 21.8215 15.1396 21.3376 15.9999 20.4773C16.8601 19.6171 17.344 18.4507 17.3454 17.2341V4.38567H18.0823C18.3257 4.38567 18.5591 4.28898 18.7312 4.11687C18.9033 3.94475 19 3.71132 19 3.46792C19 3.22452 18.9033 2.99109 18.7312 2.81897C18.5591 2.64686 18.3257 2.55017 18.0823 2.55017H13.4673V2.14374C13.4666 1.62238 13.2592 1.12257 12.8905 0.75391C12.5219 0.385251 12.0221 0.177833 11.5007 0.177139H7.49931C6.97795 0.177833 6.47814 0.385251 6.10948 0.75391C5.74082 1.12257 5.5334 1.62238 5.53271 2.14374V2.55017H0.917748C0.674346 2.55017 0.440913 2.64686 0.268802 2.81897C0.0966908 2.99109 0 3.22452 0 3.46792C0 3.71132 0.0966908 3.94475 0.268802 4.11687C0.440913 4.28898 0.674346 4.38567 0.917748 4.38567ZM7.3682 2.14374C7.3682 2.10897 7.38202 2.07562 7.4066 2.05103C7.43119 2.02645 7.46454 2.01263 7.49931 2.01263H11.5007C11.5355 2.01263 11.5688 2.02645 11.5934 2.05103C11.618 2.07562 11.6318 2.10897 11.6318 2.14374V2.55017H7.3682V2.14374ZM3.49006 4.38567H15.5099V17.2341C15.5092 17.9641 15.2189 18.664 14.7028 19.1802C14.1866 19.6964 13.4867 19.9867 12.7567 19.9874H6.24331C5.51331 19.9867 4.81342 19.6964 4.29724 19.1802C3.78105 18.664 3.49076 17.9641 3.49006 17.2341V4.38567Z'
                    fill='white'
                  />
                </svg>
              </BootstrapTooltip>
            </div>
            <button
              disabled={selectedRows?.length == 0 && getCheckedValue.length == 0 ? true : false}
              className={`bg-orange-600 text-white py-1 px-4 rounded-lg w-[8rem] ${selectedRows?.length == 0 && getCheckedValue.length == 0
                ? 'cursor-not-allowed opacity-50 hover'
                : 'cursor-pointer'
                }`}
              onClick={handleTranslate}
            >
              Translate
            </button>
          </div>
        </div>
      )}
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            mt: -0.8,
            height: 340,
            width: '100%',
            [`& .${gridClasses.overlay}`]: {
              backgroundColor: 'transparent', // Removes the background color
            },
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
            '.css-yrdy0g-MuiDataGrid-columnHeaderRow': {
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
            '.css-rtrcn9-MuiTablePagination-root .MuiTablePagination-selectLabel': {
              // display: 'none',
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
              height: { xs: height - 250, sm: height - 225 },
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
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#1D2939', // Customize hover color
              },
            }}
            // autoHeight
            rows={filterdata}
            columns={columns}
            classes={{
              columnHeadersInner: 'custom-data-grid-columnHeadersInner',
              sortIcon: 'custom-data-grid-sortIcon',
              footerContainer: 'custom-data-grid-footerContainer',
            }}
            loading={reloading}
            selectionModel={getCheckedValue}
            onSelectionModelChange={(ids: any) => {
              setGetCheckedValue(ids)

              const selectedIDs = new Set(ids)
              const selectedRows = filterdata.filter((row: any) => selectedIDs.has(row.id))
              setSelectedRows(selectedRows)
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
      </ThemeProvider>
      <CopyAndNewCollectionsDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setDialogOpen(false), setSingleparams(null)
        }}
        selectedRows={singleparams ? [singleparams] : selectedRows}
        collectiondata={collectiondata}
        pramasdata={collectionorcti}
        setDialogOpen={setDialogOpen}
        importId={null}
      />
      <DeleteConfirmationDialog
        isOpen={isdelDialogOpen}
        onClose={() => {
          setIsdleDialogOpen(false), setSingleparams(null), setdeletvale(null)
        }}
        onConfirm={handleDelete}
        message='Are you sure you want to permanently delete this item?'
      />

      {openTranslatePopup && (
        <>
          <div className='backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
            <div className='relative w-full h-full p-[32px] mx-auto'>
              <div className='p-[20px] border-0 rounded-lg shadow-lg h-full relative flex flex-col bg-[#1D2939] outline-none focus:outline-none'>
                <div className='grid grid-cols-3 gap-4 max-md:grid-cols-2 justify-items-center m-1 p-2 pb-0 mb-0'>
                  <div className='max-md:hidden'></div>
                  <div className='text-white text-2xl font-bold max-md:text-xl max-md:flex w-full text-center'>
                    Bulk Translate
                  </div>
                  <div className='w-full flex justify-end mr-[0.5rem] items-center'>
                    <div className='flex justify-between'>
                      <>
                        <div className='relative'></div>
                        <button
                          type='button'
                          disabled={bulkDownload}
                          className='mt-0 pr-2'
                          onClick={bulckTranslateDownload}
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
                                stroke={bulkDownload ? '#8992A1' : '#fff'}
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
                          setOpenTranslatePopup(false)
                          setDisable(true)
                          setBulkDownload(true)
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
                <div className='grid grid-cols-3 gap-4 max-md:grid-cols-2 justify-items-center px-2 mx-1 pb-4 mb-2'>
                  <div className='max-md:hidden'></div> {/* 1st grid div */}
                  <div className='w-full h-fit text-center flex justify-center max-md:justify-start'>
                    <select
                      onChange={handleClickTargerbulk}
                      id='large'
                      className='block w-full px-[10px] py-[6px] text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500'
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
                  <div className='w-full flex justify-end'>
                    <div className='mr-[0.5rem]'>
                      <button
                        disabled={disable}
                        onClick={handleBulTranslatClick}
                        className={`
                            text-white ml-28 capitalize rounded-lg px-[25px] py-[6px] bg-[#EE7103] text-center flex ${disable ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#6941C6]'
                          }`}
                      >
                        {istranslating ? 'Translating' : 'Translate'}
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
                    <YamlEditor
                      ymltext={ymltextbluk}
                      setYmlText={() => { }}
                      setSeloctror={() => { }}
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
                      borderRadius: '1rem',
                    }}
                  >
                    <YamlTextEditor ymltext={defaultText} setSeloctror={() => { }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CommenRuleTable
