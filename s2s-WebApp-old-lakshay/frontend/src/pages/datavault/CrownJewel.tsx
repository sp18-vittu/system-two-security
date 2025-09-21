import styled from '@emotion/styled'
import {
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { useEffect, useRef, useState } from 'react'
import { crown_jewel_Column } from './datasource-header'
import { useDispatch } from 'react-redux'
import {
  crouwndownloadtemplate,
  CrownJewelAddsource,
  CrownJewelDelete,
  CrownJewelPost,
  CrownJewelUpdate,
  currentCrownConfig,
} from '../../redux/nodes/CrownJewel/action'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import { makeStyles } from '@mui/styles'
import useWindowResolution from '../../layouts/Dashboard/useWindowResolution'

const useStyles = makeStyles({
  sortLabel: {
    color: 'white',
    '&.MuiTableSortLabel-active': {
      color: 'white',
      '& .MuiTableSortLabel-icon': {
        color: 'white',
      },
    },
    '& .MuiTableSortLabel-icon': {
      opacity: 1,
      color: 'white !important',
    },
  },
  iconButton: {
    color: 'white',
  },
  autocomplete: {
    display: 'flex',
    height: '36px',
    alignItems: 'center',
    alignSelf: 'stretch',
    background: 'white',
  },
})

function CrownJewel() {
  const dispatch = useDispatch()
  const [assetId, setassetId] = useState(null as any)
  const [asset, setasset] = useState(null as any)
  const [sourcename, setsourcename] = useState(null as any)
  const [integration, setintegration] = useState(null as any)
  const [assetcriticality, setassetcriticality] = useState(null as any)
  const [publicFace, setpublicFace] = useState(null as any)
  const [operational, setoperational] = useState(null as any)
  const [financial, setfinancial] = useState(null as any)
  const [reputation, setreputation] = useState(null as any)
  const [strategic, setstrategic] = useState(null as any)
  const [regulatory, setregulatory] = useState(null as any)
  const [fileList, setFileList] = useState(null)

  const [editabledata, setEditabledata] = useState(null)

  const [newData, setnewData] = useState(null as any)

  const [triggerReload, setTriggerReload] = useState(false)

  const { height } = useWindowResolution()

  const StyledDiv = styled('div')({
    position: 'relative',
    overflowY: 'auto',
    height: height - 250,
    border: '1px solid #344054',
    '&::-webkit-scrollbar': {
      width: '13px',
      height: '13px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#FFFFFF',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#485E7C',
    },
  })

  const reset = () => {
    setassetId('')
    setasset('')
    setsourcename('')
    setassetcriticality('')
    setpublicFace('')
    setoperational('')
    setfinancial('')
    setreputation('')
    setstrategic('')
    setregulatory('')
    setintegration('')
  }

  let data = {
    assetId: assetId,
    asset: asset,
    source: sourcename,
    assetcriticality: assetcriticality,
    publicFace: publicFace,
    operational: operational,
    financial: financial,
    reputation: reputation,
    strategic: strategic,
    regulatory: regulatory,
  }

  const [status, setstatus] = useState(false)

  useEffect(() => {
    const crown = sessionStorage.getItem('crowndata')
  }, [triggerReload])

  const onCancel = () => {
    setEditabledata(null)
    setstatus(true)
    reset()
  }

  const [uploadPopUp, setUploadPopUp] = useState(false)
  let { reset: reset1, handleSubmit: handleSubmit1 } = useForm()
  const [files, setFiles] = useState<any>([])
  const file = []
  const [img, setImg] = useState([] as any)
  const inputRef = useRef<any>(null)
  const closeModal = () => {
    setUploadPopUp(false)
    reset1()
    setFiles([])
  }
  function removeFile(fileName: any, idx: any) {
    const newArr = [...files]
    newArr.splice(idx, 1)
    setFiles([])
    setFiles(newArr)
  }
  function handleDragLeave(e: any) {
    e.preventDefault()
    e.stopPropagation()
  }
  function handleDragOver(e: any) {
    e.preventDefault()
    e.stopPropagation()
  }
  function handleDragEnter(e: any) {
    e.preventDefault()
    e.stopPropagation()
  }
  function handleDrop(e: any) {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      for (let i = 0; i < e.dataTransfer.files['length']; i++) {
        let arr: any = []
        img?.map((image: any) => {
          if (e.dataTransfer.files[i].type.includes(image.name)) {
            arr.push({
              fileName: e.dataTransfer.files[i],
              type: e.dataTransfer.files[i].type,
              path: image.path,
            })
          } else if (e.dataTransfer.files[i].name.split('.').includes(image.name)) {
            arr.push({
              fileName: e.dataTransfer.files[i],
              type: e.dataTransfer.files[i].type,
              path: image.path,
            })
          }
        })
        setFiles((prevState: any) => [...prevState, ...arr])
      }
    }
  }
  function handleChange(e: any) {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      setFileList(e.target.files)
      for (let i = 0; i < e.target.files['length']; i++) {
        let arr: any = []
        img?.map((image: any) => {
          if (e.target.files[i].type.includes(image.name)) {
            arr.push({
              fileName: e.target.files[i],
              type: e.target.files[i].type,
              path: image.path,
            })
          } else if (e.target.files[i].name.split('.').includes(image.name)) {
            arr.push({
              fileName: e.target.files[i],
              type: e.target.files[i].type,
              path: image.path,
            })
          }
        })
        setFiles((prevState: any) => [...prevState, ...arr])
      }
    }
  }
  const getData = () => {
    setImg([
      {
        name: 'csv',
        path: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <path d="M7.75 4C7.75 2.205 9.205 0.75 11 0.75H27c.121 0 .237.048.323.134L38.116 11.677c.086.085.134.201.134.323V36c0 1.795-1.455 3.25-3.25 3.25H11c-1.795 0-3.25-1.455-3.25-3.25V4z" fill="white" stroke="#D0D5DD" stroke-width="1.5"/>
    <rect x="1" y="18" width="26" height="16" rx="2" fill="#344054"/>
    <path d="M27 0.5V8c0 2.209 1.791 4 4 4h7.5" stroke="#D0D5DD" stroke-width="1.5"/>
    <text x="4" y="28" font-family="Arial, sans-serif" font-size="9" fill="white">CSV</text>
  </svg>`,
      },
    ])
  }
  useEffect(() => {
    getData()
    if (file.length > 0) {
      document.getElementById('input_focus')?.classList.remove('border-slate-950')
    }
  }, [files])

  const editData = (data: any, index: any) => {
    setnewData(data)
    setassetId(data.asset_id)
    setasset(data.asset_name)
    setintegration(data.integration_name)
    setsourcename(data.data_source_name)
    setassetcriticality(data.asset_criticality)
    setpublicFace(data.public_facing_yes_or_no)
    setoperational(data.operational_impact)
    setfinancial(data.financial_impact)
    setreputation(data.reputation_impact)
    setstrategic(data.strategic_importance)
    setregulatory(data.regulatory_compliance)
    setEditabledata(index)
    setstatus(false)
  }

  const savedData = () => {
    const assetCriticality = Number(assetcriticality) || 0
    const operationalImpact = Number(operational) || 0
    const financialImpact = Number(financial) || 0
    const reputationImpact = Number(reputation) || 0
    const strategicImportance = Number(strategic) || 0
    const regulatoryCompliance = Number(regulatory) || 0

    const normalizedPublicFace = (publicFace || '').toLowerCase()
    const publicFacing = normalizedPublicFace == 'yes' ? 1 : 0

    const totalScore =
      (assetCriticality || 0) +
      (operationalImpact || 0) +
      (financialImpact || 0) +
      (reputationImpact || 0) +
      (strategicImportance || 0) +
      (regulatoryCompliance || 0) +
      (publicFacing || 0)

    const postdata = {
      asset_id: assetId,
      asset_name: asset,
      data_source_name: sourcename,
      integration_name: integration,
      asset_criticality: assetcriticality,
      public_facing_yes_or_no: publicFace,
      operational_impact: operational,
      financial_impact: financial,
      reputation_impact: reputation,
      strategic_importance: strategic,
      regulatory_compliance: regulatory,
      total_score: totalScore,
    }

    dispatch(CrownJewelAddsource(postdata) as any).then((res: any) => {
      if (res.type == 'CROWNJEWEL_ADD_SOURCE_SUCCESS') {
        reset()
        setTriggerReload(!triggerReload)
        fetchDataCrownConfig()
      }
    })
  }

  const updatedData = () => {
    const assetCriticality = Number(assetcriticality) || 0
    const operationalImpact = Number(operational) || 0
    const financialImpact = Number(financial) || 0
    const reputationImpact = Number(reputation) || 0
    const strategicImportance = Number(strategic) || 0
    const regulatoryCompliance = Number(regulatory) || 0

    const normalizedPublicFace = (publicFace || '').toLowerCase()
    const publicFacing = normalizedPublicFace == 'yes' ? 1 : 0

    const totalScore =
      (assetCriticality || 0) +
      (operationalImpact || 0) +
      (financialImpact || 0) +
      (reputationImpact || 0) +
      (strategicImportance || 0) +
      (regulatoryCompliance || 0) +
      (publicFacing || 0)

    const postdata = {
      asset_id: assetId,
      asset_name: asset,
      data_source_name: sourcename,
      integration_name: integration,
      asset_criticality: assetcriticality,
      public_facing_yes_or_no: publicFace,
      operational_impact: operational,
      financial_impact: financial,
      reputation_impact: reputation,
      strategic_importance: strategic,
      regulatory_compliance: regulatory,
      total_score: totalScore,
    }
    dispatch(CrownJewelUpdate(postdata, newData?.crown_jewel_id) as any).then((res: any) => {
      if (res.type == 'CROWNJEWEL_PUT_SUCCESS') {
        setTriggerReload(!triggerReload)
        setEditabledata(null)
        setstatus(true)
        reset()
        fetchDataCrownConfig()
      }
    })
  }

  const deleteData = (data: any, index: any) => {
    dispatch(CrownJewelDelete(data?.crown_jewel_id) as any).then((res: any) => {
      if (res.type == 'CROWNJEWEL_DELETE_SUCCESS') {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'CrownJewel Delete Successfully',
          color: '#000',
          width: 400,
          timer: 2000,
          showConfirmButton: false,
        })
        fetchDataCrownConfig()
      }
    })
  }

  const handledownloadtemplate = () => {
    dispatch(crouwndownloadtemplate() as any).then((res: any) => {
      if (res.payload) {
        const blob = new Blob([res.payload], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Crown_jewel.csv`
        a.click()
        URL.revokeObjectURL(url)
      }
    })
  }

  const handleUploadSourcefile = () => {
    setUploadPopUp(true)
  }

  let uploadstatus: any = []
  const Uploadfiles = fileList ? [...fileList] : []
  Uploadfiles.forEach((file: any) => {
    uploadstatus.push(file)
  })
  const repository = (event: any) => {
    if (files.length > 0) {
      const formData = new FormData()
      formData.append('csv-file', Uploadfiles[0])
      dispatch(CrownJewelPost(formData) as any)
        .then((datas: any) => {
          if (datas.type == 'CROWNJEWEL_POST_SUCCESS') {
            setUploadPopUp(false)
            fetchDataCrownConfig()
          }
        })
        .catch((error: any) => {
          console.log('error', error)
        })
    }
  }
  const [crownDetails, setCrownDetails] = useState([] as any)

  useEffect(() => {
    fetchDataCrownConfig()
  }, [])

  const fetchDataCrownConfig = () => {
    dispatch(currentCrownConfig() as any).then((res: any) => {
      setCrownDetails(res.payload.crown_jewel_analysis)
    })
  }

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredData, setFilteredData] = useState<any[]>(crownDetails)

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase()
    setSearchQuery(query)

    const filtered = crownDetails?.filter((item: any) =>
      Object.values(item)?.some((value: any) => value?.toString().toLowerCase()?.includes(query)),
    )
    setFilteredData(filtered)
  }

  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [orderBy, setOrderBy] = useState<string>('asset_name')

  const handleSort = (property: string) => (event: React.MouseEvent<unknown>) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const crownFilter: any = filteredData.length > 0 ? filteredData : crownDetails

  const sortedRows = [...crownFilter]?.sort((a: any, b: any) => {
    if (a[orderBy] < b[orderBy]) {
      return order === 'asc' ? -1 : 1
    }
    if (a[orderBy] > b[orderBy]) {
      return order === 'asc' ? 1 : -1
    }
    return 0
  })

  const classes = useStyles()

  // Sample options for autocomplete
  const options = ['Option 1', 'Option 2', 'Option 3']

  const [openCol, setColOpen] = useState(false)
  const [openCol1, setColOpen1] = useState(false)
  const [openCol2, setColOpen2] = useState(false)
  const [openCol3, setColOpen3] = useState(false)
  const [openCol4, setColOpen4] = useState(false)
  const [openCol5, setColOpen5] = useState(false)
  const [openCol6, setColOpen6] = useState(false)
  const [openCol7, setColOpen7] = useState(false)
  const [openCol8, setColOpen8] = useState(false)
  const [openCol9, setColOpen9] = useState(false)
  const [openCol10, setColOpen10] = useState(false)

  const handleAllcloseMeu = () => {
    setColOpen(false)
    setColOpen1(false)
    setColOpen2(false)
    setColOpen3(false)
    setColOpen4(false)
    setColOpen5(false)
    setColOpen6(false)
    setColOpen7(false)
    setColOpen8(false)
    setColOpen9(false)
    setColOpen10(false)
  }

  const divRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleScroll = () => {
      handleAllcloseMeu()
    }
    const divElement = divRef.current
    if (divElement) {
      divElement.addEventListener('scroll', handleScroll)
    }
    return () => {
      if (divElement) {
        divElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  return (
    <div className='p-[32px]'>
      <div className='lg:relative'>
        <div className='lg:inline-flex'>
          <div>
            <div className='relative inline-flex lg:top-0 lg:pt-0 pt-7'>
              <div className='relative flex flex-wrap items-stretch '>
                <input
                  type='search'
                  className='relative m-0 block w-[276px] flex-auto rounded-l-lg border-t border-l border-b border-solid border-neutral-300 bg-white text-base font-normal leading-[1.6] text-neutral-700'
                  style={{ padding: '6px' }}
                  placeholder='Search...'
                  aria-label='Search'
                  aria-describedby='button-addon2'
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <button
                  className='input-group-text bg-white w-10 flex p-1.5 items-center border-t border-b border-r border-solid border-neutral-300 whitespace-nowrap rounded-r-lg px-3 py-1.5 text-center text-base font-normal text-neutral-700'
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
          <div className='absolute top-32 bottom-3 pt-3  md:top-20 md:pt-3 lg:pt-0 lg:top-0 lg:pb-10 lg:right-2'>
            <div className=' relative inline-flex'>
              <div className='relative flex flex-wrap items-stretch gap-[16px]'>
                <button
                  className='px-[18px] py-[10px]  bg-[#EE7103] rounded-lg'
                  type='button'
                  onClick={handledownloadtemplate}
                >
                  <span>Download Template</span>
                </button>
                <button
                  className='px-[18px] py-[10px]  bg-[#EE7103] rounded-lg'
                  type='button'
                  onClick={handleUploadSourcefile}
                >
                  <span>Upload</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <StyledDiv ref={divRef} className='overflow-x-auto overflow-y-hidden rounded-md'>
        <Table size='small' stickyHeader>
          <TableHead style={{ backgroundColor: '#32435A', textAlign: 'center' }}>
            <TableRow>
              {crown_jewel_Column &&
                crown_jewel_Column?.map((column, index) => {
                  const isLastColumn = index === crown_jewel_Column.length - 1
                  return (
                    <TableCell
                      key={column.id}
                      className={`flex  h-[44px] justify-center text-center !important items-center gap-3 self-stretch p-[12px 24px] bg-[#485E7C]`}
                      style={{
                        borderBottom: '1px solid #485E7C',
                        minWidth: column.minWidth,
                        background: '#485E7C',
                      }}
                      align='center'
                    >
                      <TableCell
                        key={column.id}
                        className='flex h-[44px]  justify-center text-center !important items-center gap-3 self-stretch p-[12px 24px] bg-[#485E7C]'
                        style={{
                          borderBottom: '1px solid #485E7C',
                          minWidth: column.minWidth,
                          width: 100,
                          background: '#485E7C',
                          ...(isLastColumn && {
                            position: 'sticky',
                            zIndex: 10,
                            right: 0,
                            background: '#485E7C',
                          }),
                        }}
                      >
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : 'asc'}
                          onClick={handleSort(column.id)}
                          classes={{
                            root: isLastColumn ? '' : classes.sortLabel,
                            icon: isLastColumn ? '' : classes.sortLabel,
                          }}
                        >
                          <Typography className='flex  text-center items-center gap-1 text-white'>
                            {column.label}
                          </Typography>
                        </TableSortLabel>
                      </TableCell>
                    </TableCell>
                  )
                })}
            </TableRow>
          </TableHead>
          <TableBody style={{ background: '#0c111d' }}>
            {crownDetails &&
              sortedRows?.map((item: any, index: any) => (
                <>
                  <TableRow key={item.id}>
                    <TableCell
                      className='flex h-[14px] items-center gap-3 self-stretch p-[12px 24px] '
                      style={{ borderBottom: '1px solid #485E7C', width: 200 }}
                    >
                      {editabledata === index ? (
                        <Autocomplete
                          value={assetId}
                          onChange={(event, newValue) => setassetId(newValue)}
                          onInputChange={(event, newInputValue) => setassetId(newInputValue)}
                          open={openCol1}
                          onOpen={() => setColOpen1(true)}
                          onClose={() => setColOpen1(false)}
                          className={classes.autocomplete}
                          getOptionLabel={(option) => option?.toString()}
                          options={crownDetails?.map((x: any) => (x.asset_id ? x.asset_id : ''))}
                          renderInput={(params: any) => (
                            <TextField
                              {...params}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    border: 'none',
                                  },
                                },
                              }}
                            />
                          )}
                          sx={{
                            borderRadius: '5px !important',
                          }}
                        />
                      ) : (
                        <Typography className='text-white flex-grow text-center flex-shrink-0 basis-0 text-sm font-medium leading-5 text-left'>
                          {item?.asset_id}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell style={{ borderBottom: '1px solid #485E7C' }}>
                      {editabledata === index ? (
                        <Autocomplete
                          value={asset}
                          onChange={(event, newValue) => setasset(newValue)}
                          onInputChange={(event, newInputValue) => setasset(newInputValue)}
                          open={openCol2}
                          onOpen={() => setColOpen2(true)}
                          onClose={() => setColOpen2(false)}
                          className={classes.autocomplete}
                          getOptionLabel={(option) => option?.toString()}
                          options={crownDetails?.map((x: any) =>
                            x.asset_name ? x.asset_name : '',
                          )}
                          renderInput={(params: any) => (
                            <TextField
                              {...params}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    border: 'none',
                                  },
                                },
                              }}
                            />
                          )}
                          sx={{
                            borderRadius: '5px !important',
                          }}
                        />
                      ) : (
                        <Typography className='text-white text-center flex-grow flex-shrink-0 basis-0 text-sm font-medium leading-5'>
                          {item?.asset_name}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell style={{ borderBottom: '1px solid #485E7C' }}>
                      {editabledata === index ? (
                        <Autocomplete
                          value={sourcename}
                          onChange={(event, newValue) => setsourcename(newValue)}
                          onInputChange={(event, newInputValue) => setsourcename(newInputValue)}
                          open={openCol3}
                          onOpen={() => setColOpen3(true)}
                          onClose={() => setColOpen3(false)}
                          className={classes.autocomplete}
                          getOptionLabel={(option) => option?.toString()}
                          options={crownDetails?.map((x: any) =>
                            x.data_source_name ? x.data_source_name : '',
                          )}
                          renderInput={(params: any) => (
                            <TextField
                              {...params}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    border: 'none',
                                  },
                                },
                              }}
                            />
                          )}
                          sx={{
                            borderRadius: '5px !important',
                          }}
                        />
                      ) : (
                        <Typography className='text-white text-center flex-grow flex-shrink-0 basis-0 text-sm font-medium leading-5'>
                          {item?.data_source_name}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell style={{ borderBottom: '1px solid #485E7C' }}>
                      {editabledata === index ? (
                        <Autocomplete
                          value={integration}
                          onChange={(event, newValue) => setintegration(newValue)}
                          onInputChange={(event, newInputValue) => setintegration(newInputValue)}
                          open={openCol4}
                          onOpen={() => setColOpen4(true)}
                          onClose={() => setColOpen4(false)}
                          className={classes.autocomplete}
                          getOptionLabel={(option) => option?.toString()}
                          options={crownDetails?.map((x: any) =>
                            x.integration_name ? x.integration_name : '',
                          )}
                          renderInput={(params: any) => (
                            <TextField
                              {...params}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    border: 'none',
                                  },
                                },
                              }}
                            />
                          )}
                          sx={{
                            borderRadius: '5px !important',
                          }}
                        />
                      ) : (
                        <Typography className='text-white text-center flex-grow flex-shrink-0 basis-0 text-sm font-medium leading-5'>
                          {item?.integration_name}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell style={{ borderBottom: '1px solid #485E7C' }}>
                      {editabledata === index ? (
                        <Autocomplete
                          value={assetcriticality}
                          onChange={(event, newValue) => setassetcriticality(newValue)}
                          onInputChange={(event, newInputValue) =>
                            setassetcriticality(newInputValue)
                          }
                          open={openCol}
                          onOpen={() => setColOpen(true)}
                          onClose={() => setColOpen(false)}
                          className={classes.autocomplete}
                          getOptionLabel={(option) => option?.toString()}
                          options={crownDetails?.map((x: any) =>
                            x.asset_criticality ? x.asset_criticality : '',
                          )}
                          renderInput={(params: any) => (
                            <TextField
                              {...params}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    border: 'none',
                                  },
                                },
                              }}
                            />
                          )}
                          sx={{
                            borderRadius: '5px !important',
                          }}
                        />
                      ) : (
                        <Typography className='text-white text-center flex-grow flex-shrink-0 basis-0 text-sm font-medium leading-5'>
                          {item?.asset_criticality}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell style={{ borderBottom: '1px solid #485E7C' }}>
                      {editabledata === index ? (
                        <Autocomplete
                          value={publicFace}
                          onChange={(event, newValue) => setpublicFace(newValue)}
                          onInputChange={(event, newInputValue) => setpublicFace(newInputValue)}
                          open={openCol5}
                          onOpen={() => setColOpen5(true)}
                          onClose={() => setColOpen5(false)}
                          className={classes.autocomplete}
                          getOptionLabel={(option) => option?.toString()}
                          options={crownDetails?.map((x: any) =>
                            x.public_facing_yes_or_no ? x.public_facing_yes_or_no : '',
                          )}
                          renderInput={(params: any) => (
                            <TextField
                              {...params}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    border: 'none',
                                  },
                                },
                              }}
                            />
                          )}
                          sx={{
                            borderRadius: '5px !important',
                          }}
                        />
                      ) : (
                        <Typography className='text-white text-center flex-grow flex-shrink-0 basis-0 text-sm font-medium leading-5'>
                          {item?.public_facing_yes_or_no}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell style={{ borderBottom: '1px solid #485E7C' }}>
                      {editabledata === index ? (
                        <Autocomplete
                          value={operational}
                          onChange={(event, newValue) => setoperational(newValue)}
                          onInputChange={(event, newInputValue) => setoperational(newInputValue)}
                          open={openCol6}
                          onOpen={() => setColOpen6(true)}
                          onClose={() => setColOpen6(false)}
                          className={classes.autocomplete}
                          getOptionLabel={(option) => option?.toString()}
                          options={crownDetails?.map((x: any) =>
                            x.operational_impact ? x.operational_impact : '',
                          )}
                          renderInput={(params: any) => (
                            <TextField
                              {...params}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    border: 'none',
                                  },
                                },
                              }}
                            />
                          )}
                          sx={{
                            borderRadius: '5px !important',
                          }}
                        />
                      ) : (
                        <Typography className='text-white text-center flex-grow flex-shrink-0 basis-0 text-sm font-medium leading-5'>
                          {item?.operational_impact}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell style={{ borderBottom: '1px solid #485E7C' }}>
                      {editabledata === index ? (
                        <Autocomplete
                          value={financial}
                          onChange={(event, newValue) => setfinancial(newValue)}
                          onInputChange={(event, newInputValue) => setfinancial(newInputValue)}
                          open={openCol7}
                          onOpen={() => setColOpen7(true)}
                          onClose={() => setColOpen7(false)}
                          className={classes.autocomplete}
                          getOptionLabel={(option) => option?.toString()}
                          options={crownDetails?.map((x: any) =>
                            x.financial_impact ? x.financial_impact : '',
                          )}
                          renderInput={(params: any) => (
                            <TextField
                              {...params}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    border: 'none',
                                  },
                                },
                              }}
                            />
                          )}
                          sx={{
                            borderRadius: '5px !important',
                          }}
                        />
                      ) : (
                        <Typography className='text-white text-center flex-grow flex-shrink-0 basis-0 text-sm font-medium leading-5'>
                          {item?.financial_impact}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell style={{ borderBottom: '1px solid #485E7C' }}>
                      {editabledata === index ? (
                        <Autocomplete
                          value={reputation}
                          onChange={(event, newValue) => setreputation(newValue)}
                          onInputChange={(event, newInputValue) => setreputation(newInputValue)}
                          open={openCol8}
                          onOpen={() => setColOpen8(true)}
                          onClose={() => setColOpen8(false)}
                          className={classes.autocomplete}
                          getOptionLabel={(option) => option?.toString()}
                          options={crownDetails?.map((x: any) =>
                            x.reputation_impact ? x.reputation_impact : '',
                          )}
                          renderInput={(params: any) => (
                            <TextField
                              {...params}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    border: 'none',
                                  },
                                },
                              }}
                            />
                          )}
                          sx={{
                            borderRadius: '5px !important',
                          }}
                        />
                      ) : (
                        <Typography className='text-white text-center flex-grow flex-shrink-0 basis-0 text-sm font-medium leading-5'>
                          {item?.reputation_impact}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell style={{ borderBottom: '1px solid #485E7C' }}>
                      {editabledata === index ? (
                        <Autocomplete
                          value={strategic}
                          onChange={(event, newValue) => setstrategic(newValue)}
                          onInputChange={(event, newInputValue) => setstrategic(newInputValue)}
                          open={openCol9}
                          onOpen={() => setColOpen9(true)}
                          onClose={() => setColOpen9(false)}
                          className={classes.autocomplete}
                          getOptionLabel={(option) => option?.toString()}
                          options={crownDetails?.map((x: any) =>
                            x.strategic_importance ? x.strategic_importance : '',
                          )}
                          renderInput={(params: any) => (
                            <TextField
                              {...params}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    border: 'none',
                                  },
                                },
                              }}
                            />
                          )}
                          sx={{
                            borderRadius: '5px !important',
                          }}
                        />
                      ) : (
                        <Typography className='text-white text-center flex-grow flex-shrink-0 basis-0 text-sm font-medium leading-5'>
                          {item?.strategic_importance}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell style={{ borderBottom: '1px solid #485E7C' }}>
                      {editabledata === index ? (
                        <Autocomplete
                          value={regulatory}
                          onChange={(event, newValue) => setregulatory(newValue)}
                          onInputChange={(event, newInputValue) => setregulatory(newInputValue)}
                          open={openCol10}
                          onOpen={() => setColOpen10(true)}
                          onClose={() => setColOpen10(false)}
                          className={classes.autocomplete}
                          getOptionLabel={(option) => option?.toString()}
                          options={crownDetails?.map((x: any) =>
                            x.regulatory_compliance ? x.regulatory_compliance : '',
                          )}
                          renderInput={(params: any) => (
                            <TextField
                              {...params}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    border: 'none',
                                  },
                                },
                              }}
                            />
                          )}
                          sx={{
                            borderRadius: '5px !important',
                          }}
                        />
                      ) : (
                        <Typography className='text-white text-center flex-grow flex-shrink-0 basis-0 text-sm font-medium leading-5'>
                          {item?.regulatory_compliance}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell style={{ borderBottom: '1px solid #485E7C' }}>
                      <Typography className='text-white text-center flex-grow flex-shrink-0 basis-0 text-sm font-medium leading-5'>
                        {item?.total_score}
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{
                        borderBottom: '1px solid #485E7C',
                        position: 'sticky',
                        zIndex: 1,
                        right: 0,
                        background: '#0c111d',
                      }}
                    >
                      {editabledata === index ? (
                        <span className=' '>
                          <div className='flex gap-3 cursor-pointer'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='20'
                              height='20'
                              viewBox='0 0 20 20'
                              fill='none'
                              onClick={updatedData}
                            >
                              <path
                                d='M5.83333 2.5V5.33333C5.83333 5.80004 5.83333 6.0334 5.92416 6.21166C6.00406 6.36846 6.13154 6.49594 6.28834 6.57584C6.4666 6.66667 6.69996 6.66667 7.16667 6.66667H12.8333C13.3 6.66667 13.5334 6.66667 13.7117 6.57584C13.8685 6.49594 13.9959 6.36846 14.0758 6.21166C14.1667 6.0334 14.1667 5.80004 14.1667 5.33333V3.33333M14.1667 17.5V12.1667C14.1667 11.7 14.1667 11.4666 14.0758 11.2883C13.9959 11.1315 13.8685 11.0041 13.7117 10.9242C13.5334 10.8333 13.3 10.8333 12.8333 10.8333H7.16667C6.69996 10.8333 6.4666 10.8333 6.28834 10.9242C6.13154 11.0041 6.00406 11.1315 5.92416 11.2883C5.83333 11.4666 5.83333 11.7 5.83333 12.1667V17.5M17.5 7.77124V13.5C17.5 14.9001 17.5 15.6002 17.2275 16.135C16.9878 16.6054 16.6054 16.9878 16.135 17.2275C15.6002 17.5 14.9001 17.5 13.5 17.5H6.5C5.09987 17.5 4.3998 17.5 3.86502 17.2275C3.39462 16.9878 3.01217 16.6054 2.77248 16.135C2.5 15.6002 2.5 14.9001 2.5 13.5V6.5C2.5 5.09987 2.5 4.3998 2.77248 3.86502C3.01217 3.39462 3.39462 3.01217 3.86502 2.77248C4.3998 2.5 5.09987 2.5 6.5 2.5H12.2288C12.6364 2.5 12.8402 2.5 13.0321 2.54605C13.2021 2.58688 13.3647 2.65422 13.5138 2.7456C13.682 2.84867 13.8261 2.9928 14.1144 3.28105L16.719 5.88562C17.0072 6.17387 17.1513 6.318 17.2544 6.48619C17.3458 6.63531 17.4131 6.79789 17.4539 6.96795C17.5 7.15976 17.5 7.36358 17.5 7.77124Z'
                                stroke='white'
                                stroke-width='1.66667'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                              />
                            </svg>
                            <svg
                              className='w-6 h-4'
                              xmlns='http://www.w3.org/2000/svg'
                              width='24'
                              height='24'
                              viewBox='0 0 24 24'
                              fill='none'
                              onClick={onCancel}
                            >
                              <path
                                d='M18 6L6 18M6 6L18 18'
                                stroke='white'
                                stroke-width='2'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                              />
                            </svg>
                          </div>
                        </span>
                      ) : (
                        <div className='flex gap-3 cursor-pointer'>
                          <svg
                            width='20'
                            height='20'
                            viewBox='0 0 20 20'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                            onClick={() => editData(item, index)}
                          >
                            <path
                              d='M2.36532 13.9588H13.632C13.7204 13.9588 13.8052 13.9237 13.8677 13.8612C13.9302 13.7987 13.9653 13.7139 13.9653 13.6255C13.9653 13.5371 13.9302 13.4523 13.8677 13.3898C13.8052 13.3273 13.7204 13.2922 13.632 13.2922H2.36532C2.27691 13.2922 2.19213 13.3273 2.12961 13.3898C2.0671 13.4523 2.03198 13.5371 2.03198 13.6255C2.03198 13.7139 2.0671 13.7987 2.12961 13.8612C2.19213 13.9237 2.27691 13.9588 2.36532 13.9588ZM6.47332 11.4535C6.75492 11.3747 7.01185 11.2256 7.21998 11.0202L13.58 4.66018C13.7978 4.44152 13.9201 4.14547 13.9201 3.83684C13.9201 3.52822 13.7978 3.23217 13.58 3.01351L12.9533 2.39351C12.7315 2.18168 12.4367 2.06348 12.13 2.06348C11.8233 2.06348 11.5284 2.18168 11.3066 2.39351L4.94665 8.74684C4.74088 8.9536 4.59364 9.21126 4.51998 9.49351L4.02665 11.3335C4.00324 11.4176 4.00264 11.5063 4.0249 11.5907C4.04716 11.675 4.09149 11.752 4.15332 11.8135C4.24768 11.9063 4.37433 11.9588 4.50665 11.9602L6.47332 11.4535ZM6.74665 10.5468C6.62375 10.672 6.46948 10.7618 6.29998 10.8068L5.65332 10.9802L4.98665 10.3135L5.15998 9.66684C5.20661 9.498 5.29619 9.34411 5.41998 9.22018L5.67332 8.97351L6.99998 10.3002L6.74665 10.5468ZM7.47332 9.82684L6.14665 8.50018L10.6333 4.01351L11.96 5.34018L7.47332 9.82684ZM13.1066 4.19351L12.4333 4.86684L11.1066 3.54018L11.78 2.86018C11.8263 2.81365 11.8814 2.77674 11.942 2.75155C12.0026 2.72636 12.0677 2.7134 12.1333 2.7134C12.199 2.7134 12.264 2.72636 12.3246 2.75155C12.3853 2.77674 12.4403 2.81365 12.4866 2.86018L13.1066 3.48684C13.1996 3.58094 13.2518 3.70789 13.2518 3.84018C13.2518 3.97246 13.1996 4.09942 13.1066 4.19351Z'
                              fill='white'
                            />
                          </svg>
                          <svg
                            width='20'
                            height='20'
                            viewBox='0 0 20 20'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                            onClick={() => deleteData(item, index)}
                          >
                            <path
                              d='M12.9666 2.70638H10.18V2.37305C10.18 2.10783 10.0746 1.85348 9.88706 1.66594C9.69952 1.4784 9.44517 1.37305 9.17995 1.37305H6.81995C6.55473 1.37305 6.30038 1.4784 6.11284 1.66594C5.92531 1.85348 5.81995 2.10783 5.81995 2.37305V2.70638H3.03328C2.94488 2.70638 2.86009 2.7415 2.79758 2.80401C2.73507 2.86652 2.69995 2.95131 2.69995 3.03971C2.69995 3.12812 2.73507 3.2129 2.79758 3.27542C2.86009 3.33793 2.94488 3.37305 3.03328 3.37305H3.51328L3.79328 13.0064C3.80426 13.4407 3.98484 13.8534 4.29635 14.1562C4.60786 14.459 5.02554 14.6277 5.45995 14.6264H10.54C10.9744 14.6277 11.392 14.459 11.7036 14.1562C12.0151 13.8534 12.1956 13.4407 12.2066 13.0064L12.4866 3.37305H12.9666C13.055 3.37305 13.1398 3.33793 13.2023 3.27542C13.2648 3.2129 13.3 3.12812 13.3 3.03971C13.3 2.95131 13.2648 2.86652 13.2023 2.80401C13.1398 2.7415 13.055 2.70638 12.9666 2.70638ZM6.48662 2.37305C6.48662 2.28464 6.52174 2.19986 6.58425 2.13734C6.64676 2.07483 6.73155 2.03971 6.81995 2.03971H9.17995C9.26836 2.03971 9.35314 2.07483 9.41565 2.13734C9.47817 2.19986 9.51328 2.28464 9.51328 2.37305V2.70638H6.48662V2.37305ZM11.54 12.9864C11.533 13.2469 11.4246 13.4945 11.2378 13.6763C11.051 13.8581 10.8006 13.9598 10.54 13.9597H5.45995C5.19929 13.9598 4.9489 13.8581 4.76211 13.6763C4.57532 13.4945 4.4669 13.2469 4.45995 12.9864L4.17328 3.37305H11.8266L11.54 12.9864Z'
                              fill='white'
                            />
                            <path
                              d='M5.58325 5.33333C5.58325 5.24493 5.61837 5.16014 5.68088 5.09763C5.74339 5.03512 5.82818 5 5.91659 5C6.00499 5 6.08978 5.03512 6.15229 5.09763C6.2148 5.16014 6.24992 5.24493 6.24992 5.33333L6.41659 12C6.41659 12.0884 6.38147 12.1732 6.31895 12.2357C6.25644 12.2982 6.17166 12.3333 6.08325 12.3333C5.99485 12.3333 5.91006 12.2982 5.84755 12.2357C5.78504 12.1732 5.74992 12.0884 5.74992 12L5.58325 5.33333ZM10.4166 5.338C10.4166 5.24959 10.3815 5.16481 10.319 5.1023C10.2564 5.03979 10.1717 5.00467 10.0833 5.00467C9.99485 5.00467 9.91006 5.03979 9.84755 5.1023C9.78504 5.16481 9.74992 5.24959 9.74992 5.338L9.58325 12.0047C9.58325 12.0931 9.61837 12.1779 9.68088 12.2404C9.74339 12.3029 9.82818 12.338 9.91659 12.338C10.005 12.338 10.0898 12.3029 10.1523 12.2404C10.2148 12.1779 10.2499 12.0931 10.2499 12.0047L10.4166 5.338Z'
                              fill='white'
                            />
                          </svg>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                </>
              ))}
            {(!newData || status) && (
              <TableRow>
                <TableCell style={{ borderBottom: '1px solid #485E7C' }}>
                  <Autocomplete
                    value={assetId}
                    onChange={(event, newValue) => setassetId(newValue)}
                    onInputChange={(event, newInputValue) => setassetId(newInputValue)}
                    open={openCol1}
                    onOpen={() => setColOpen1(true)}
                    onClose={() => setColOpen1(false)}
                    className={classes.autocomplete}
                    getOptionLabel={(option) => option?.toString()}
                    options={crownDetails?.map((x: any) => (x.asset_id ? x.asset_id : ''))}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              border: 'none',
                            },
                          },
                        }}
                      />
                    )}
                    sx={{
                      borderRadius: '5px !important',
                    }}
                  />
                </TableCell>
                <TableCell style={{ borderBottom: '1px solid #485E7C' }}>
                  <Autocomplete
                    value={asset}
                    onChange={(event, newValue) => setasset(newValue)}
                    onInputChange={(event, newInputValue) => setasset(newInputValue)}
                    open={openCol2}
                    onOpen={() => setColOpen2(true)}
                    onClose={() => setColOpen2(false)}
                    className={classes.autocomplete}
                    getOptionLabel={(option) => option?.toString()}
                    options={crownDetails?.map((x: any) => (x.asset_name ? x.asset_name : ''))}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              border: 'none',
                            },
                          },
                        }}
                      />
                    )}
                    sx={{
                      borderRadius: '5px !important',
                    }}
                  />
                </TableCell>
                <TableCell style={{ borderBottom: '1px solid #485E7C' }}>
                  <Autocomplete
                    value={sourcename}
                    onChange={(event, newValue) => setsourcename(newValue)}
                    onInputChange={(event, newInputValue) => setsourcename(newInputValue)}
                    open={openCol3}
                    onOpen={() => setColOpen3(true)}
                    onClose={() => setColOpen3(false)}
                    className={classes.autocomplete}
                    getOptionLabel={(option) => option?.toString()}
                    options={crownDetails?.map((x: any) =>
                      x.data_source_name ? x.data_source_name : '',
                    )}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              border: 'none',
                            },
                          },
                        }}
                      />
                    )}
                    sx={{
                      borderRadius: '5px !important',
                    }}
                  />
                </TableCell>
                <TableCell style={{ borderBottom: '1px solid #485E7C' }}>
                  <Autocomplete
                    value={integration}
                    onChange={(event, newValue) => setintegration(newValue)}
                    onInputChange={(event, newInputValue) => setintegration(newInputValue)}
                    open={openCol4}
                    onOpen={() => setColOpen4(true)}
                    onClose={() => setColOpen4(false)}
                    className={classes.autocomplete}
                    getOptionLabel={(option) => option?.toString()}
                    options={crownDetails?.map((x: any) =>
                      x.integration_name ? x.integration_name : '',
                    )}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              border: 'none',
                            },
                          },
                        }}
                      />
                    )}
                    sx={{
                      borderRadius: '5px !important',
                    }}
                  />
                </TableCell>
                <TableCell style={{ borderBottom: '1px solid #485E7C' }}>
                  <Autocomplete
                    value={assetcriticality}
                    onChange={(event, newValue) => setassetcriticality(newValue)}
                    onInputChange={(event, newInputValue) => setassetcriticality(newInputValue)}
                    open={openCol}
                    onOpen={() => setColOpen(true)}
                    onClose={() => setColOpen(false)}
                    className={classes.autocomplete}
                    getOptionLabel={(option) => option?.toString()}
                    options={crownDetails?.map((x: any) =>
                      x.asset_criticality ? x.asset_criticality : '',
                    )}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              border: 'none',
                            },
                          },
                        }}
                      />
                    )}
                    sx={{
                      borderRadius: '5px !important',
                    }}
                  />
                </TableCell>
                <TableCell style={{ borderBottom: '1px solid #485E7C' }}>
                  <Autocomplete
                    value={publicFace}
                    onChange={(event, newValue) => setpublicFace(newValue)}
                    onInputChange={(event, newInputValue) => setpublicFace(newInputValue)}
                    open={openCol5}
                    onOpen={() => setColOpen5(true)}
                    onClose={() => setColOpen5(false)}
                    className={classes.autocomplete}
                    getOptionLabel={(option) => option?.toString()}
                    options={crownDetails?.map((x: any) =>
                      x.public_facing_yes_or_no ? x.public_facing_yes_or_no : '',
                    )}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              border: 'none',
                            },
                          },
                        }}
                      />
                    )}
                    sx={{
                      borderRadius: '5px !important',
                    }}
                  />
                </TableCell>
                <TableCell style={{ borderBottom: '1px solid #485E7C' }}>
                  <Autocomplete
                    value={operational}
                    onChange={(event, newValue) => setoperational(newValue)}
                    onInputChange={(event, newInputValue) => setoperational(newInputValue)}
                    open={openCol6}
                    onOpen={() => setColOpen6(true)}
                    onClose={() => setColOpen6(false)}
                    className={classes.autocomplete}
                    getOptionLabel={(option) => option?.toString()}
                    options={crownDetails?.map((x: any) =>
                      x.operational_impact ? x.operational_impact : '',
                    )}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              border: 'none',
                            },
                          },
                        }}
                      />
                    )}
                    sx={{
                      borderRadius: '5px !important',
                    }}
                  />
                </TableCell>
                <TableCell style={{ borderBottom: '1px solid #485E7C' }}>
                  <Autocomplete
                    value={financial}
                    onChange={(event, newValue) => setfinancial(newValue)}
                    onInputChange={(event, newInputValue) => setfinancial(newInputValue)}
                    open={openCol7}
                    onOpen={() => setColOpen7(true)}
                    onClose={() => setColOpen7(false)}
                    className={classes.autocomplete}
                    getOptionLabel={(option) => option?.toString()}
                    options={crownDetails?.map((x: any) =>
                      x.financial_impact ? x.financial_impact : '',
                    )}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              border: 'none',
                            },
                          },
                        }}
                      />
                    )}
                    sx={{
                      borderRadius: '5px !important',
                    }}
                  />
                </TableCell>
                <TableCell style={{ borderBottom: '1px solid #485E7C' }}>
                  <Autocomplete
                    value={reputation}
                    onChange={(event, newValue) => setreputation(newValue)}
                    onInputChange={(event, newInputValue) => setreputation(newInputValue)}
                    open={openCol8}
                    onOpen={() => setColOpen8(true)}
                    onClose={() => setColOpen8(false)}
                    className={classes.autocomplete}
                    getOptionLabel={(option) => option?.toString()}
                    options={crownDetails?.map((x: any) =>
                      x.reputation_impact ? x.reputation_impact : '',
                    )}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              border: 'none',
                            },
                          },
                        }}
                      />
                    )}
                    sx={{
                      borderRadius: '5px !important',
                    }}
                  />
                </TableCell>
                <TableCell style={{ borderBottom: '1px solid #485E7C' }}>
                  <Autocomplete
                    value={strategic}
                    onChange={(event, newValue) => setstrategic(newValue)}
                    onInputChange={(event, newInputValue) => setstrategic(newInputValue)}
                    open={openCol9}
                    onOpen={() => setColOpen9(true)}
                    onClose={() => setColOpen9(false)}
                    className={classes.autocomplete}
                    getOptionLabel={(option) => option?.toString()}
                    options={crownDetails?.map((x: any) =>
                      x.strategic_importance ? x.strategic_importance : '',
                    )}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              border: 'none',
                            },
                          },
                        }}
                      />
                    )}
                    sx={{
                      borderRadius: '5px !important',
                    }}
                  />
                </TableCell>
                <TableCell style={{ borderBottom: '1px solid #485E7C' }}>
                  <Autocomplete
                    value={regulatory}
                    onChange={(event, newValue) => setregulatory(newValue)}
                    onInputChange={(event, newInputValue) => setregulatory(newInputValue)}
                    open={openCol10}
                    onOpen={() => setColOpen10(true)}
                    onClose={() => setColOpen10(false)}
                    className={classes.autocomplete}
                    getOptionLabel={(option) => option?.toString()}
                    options={crownDetails?.map((x: any) =>
                      x.regulatory_compliance ? x.regulatory_compliance : '',
                    )}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              border: 'none',
                            },
                          },
                        }}
                      />
                    )}
                    sx={{
                      borderRadius: '5px !important',
                    }}
                  />
                </TableCell>
                <TableCell style={{ borderBottom: '1px solid #485E7C' }}></TableCell>
                <TableCell
                  style={{
                    position: 'sticky',
                    zIndex: 10,
                    right: 0,
                    background: '#0c111d',
                    borderBottom: '1px solid #485E7C',
                  }}
                >
                  <div className='flex gap-3 cursor-pointer'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='20'
                      height='20'
                      viewBox='0 0 20 20'
                      fill='none'
                      onClick={savedData}
                    >
                      <path
                        d='M5.83333 2.5V5.33333C5.83333 5.80004 5.83333 6.0334 5.92416 6.21166C6.00406 6.36846 6.13154 6.49594 6.28834 6.57584C6.4666 6.66667 6.69996 6.66667 7.16667 6.66667H12.8333C13.3 6.66667 13.5334 6.66667 13.7117 6.57584C13.8685 6.49594 13.9959 6.36846 14.0758 6.21166C14.1667 6.0334 14.1667 5.80004 14.1667 5.33333V3.33333M14.1667 17.5V12.1667C14.1667 11.7 14.1667 11.4666 14.0758 11.2883C13.9959 11.1315 13.8685 11.0041 13.7117 10.9242C13.5334 10.8333 13.3 10.8333 12.8333 10.8333H7.16667C6.69996 10.8333 6.4666 10.8333 6.28834 10.9242C6.13154 11.0041 6.00406 11.1315 5.92416 11.2883C5.83333 11.4666 5.83333 11.7 5.83333 12.1667V17.5M17.5 7.77124V13.5C17.5 14.9001 17.5 15.6002 17.2275 16.135C16.9878 16.6054 16.6054 16.9878 16.135 17.2275C15.6002 17.5 14.9001 17.5 13.5 17.5H6.5C5.09987 17.5 4.3998 17.5 3.86502 17.2275C3.39462 16.9878 3.01217 16.6054 2.77248 16.135C2.5 15.6002 2.5 14.9001 2.5 13.5V6.5C2.5 5.09987 2.5 4.3998 2.77248 3.86502C3.01217 3.39462 3.39462 3.01217 3.86502 2.77248C4.3998 2.5 5.09987 2.5 6.5 2.5H12.2288C12.6364 2.5 12.8402 2.5 13.0321 2.54605C13.2021 2.58688 13.3647 2.65422 13.5138 2.7456C13.682 2.84867 13.8261 2.9928 14.1144 3.28105L16.719 5.88562C17.0072 6.17387 17.1513 6.318 17.2544 6.48619C17.3458 6.63531 17.4131 6.79789 17.4539 6.96795C17.5 7.15976 17.5 7.36358 17.5 7.77124Z'
                        stroke='white'
                        stroke-width='1.66667'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </svg>
                    <svg
                      className='h-5 w-5'
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      onClick={onCancel}
                    >
                      <path
                        d='M18 6L6 18M6 6L18 18'
                        stroke='white'
                        stroke-width='2'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </svg>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledDiv>
      {uploadPopUp && (
        <>
          <form onSubmit={handleSubmit1(repository)}>
            <div className='justify-center backdrop-blur-sm items-center flex  overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
              <div className='relative w-6/12 my-6  mx-auto max-w-xl'>
                <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                  <div
                    className=' p-3 border-solid border-slate-200 rounded-t'
                    style={{ textAlign: 'center' }}
                  >
                    <h6 className='text-lg text-gray-900 font-semibold'>Add Crown Jewels Files</h6>
                  </div>
                  <div className='relative flex-auto p-6'>
                    <div className='items-center justify-center w-full'>
                      <form
                        onDragEnter={handleDragEnter}
                        onSubmit={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                      >
                        <label
                          id='input_focus'
                          className='flex flex-col items-center justify-center w-full h-36 border-2 border-white-300 border-solid rounded-lg cursor-pointer bg-white-50 hover:bg-white-100'
                        >
                          <input
                            placeholder='fileInput'
                            className='hidden'
                            ref={inputRef}
                            type='file'
                            multiple={true}
                            onChange={handleChange}
                            accept='.csv'
                          />
                          <svg
                            width='44'
                            height='44'
                            viewBox='0 0 44 44'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <g filter='url(#filter0_d_2281_5043)'>
                              <rect x='2' y='1' width='40' height='40' rx='8' fill='white' />
                              <path
                                d='M18.6666 24.3333L22 21M22 21L25.3333 24.3333M22 21V28.5M28.6666 24.9524C29.6845 24.1117 30.3333 22.8399 30.3333 21.4167C30.3333 18.8854 28.2813 16.8333 25.75 16.8333C25.5679 16.8333 25.3975 16.7383 25.3051 16.5814C24.2183 14.7374 22.212 13.5 19.9166 13.5C16.4648 13.5 13.6666 16.2982 13.6666 19.75C13.6666 21.4718 14.3628 23.0309 15.4891 24.1613'
                                stroke='#475467'
                                strokeWidth='1.66667'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                              <rect
                                x='2.5'
                                y='1.5'
                                width='39'
                                height='39'
                                rx='7.5'
                                stroke='#EAECF0'
                              />
                            </g>
                            <defs>
                              <filter
                                id='filter0_d_2281_5043'
                                x='0'
                                y='0'
                                width='44'
                                height='44'
                                filterUnits='userSpaceOnUse'
                                colorInterpolationFilters='sRGB'
                              >
                                <feFlood floodOpacity='0' result='BackgroundImageFix' />
                                <feColorMatrix
                                  in='SourceAlpha'
                                  type='matrix'
                                  values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                                  result='hardAlpha'
                                />
                                <feOffset dy='1' />
                                <feGaussianBlur stdDeviation='1' />
                                <feColorMatrix
                                  type='matrix'
                                  values='0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.05 0'
                                />
                                <feBlend
                                  mode='normal'
                                  in2='BackgroundImageFix'
                                  result='effect1_dropShadow_2281_5043'
                                />
                                <feBlend
                                  mode='normal'
                                  in='SourceGraphic'
                                  in2='effect1_dropShadow_2281_5043'
                                  result='shape'
                                />
                              </filter>
                            </defs>
                          </svg>
                          <p className='mb-2 text-sm text-gray-500'>
                            <span className='font-semibold text-[#000]'>Click to upload</span> or
                            drag and drop
                          </p>
                          <p className='text-xs text-gray-500'>You can only upload CSV files</p>
                        </label>
                        <div className='flex flex-wrap w-full max-h-64 p-5 overflow-y-auto overflow-x-hidden'>
                          {files?.map((file: any, idx: any) => (
                            <div key={idx} className=''>
                              <div className='relative'>
                                <div className='relative py-3 sm:max-w-xl sm:mx-auto'>
                                  <div className='group cursor-pointer relative inline-block  w-28 text-center'>
                                    <ClearIcon onClick={(e) => removeFile(file.name, idx)} />
                                    <svg
                                      xmlns='http://www.w3.org/2000/svg'
                                      fill='none'
                                      viewBox='0 0 50 50'
                                      strokeWidth='1.5'
                                      stroke='currentColor'
                                      className='w-12 h-12 mt-3 ml-10'
                                      dangerouslySetInnerHTML={{ __html: file.path }}
                                    ></svg>
                                    <div
                                      className='opacity-0 w-full bg-black text-white text-center text-xs rounded-lg p-2 absolute z-100 group-hover:opacity-100 -left-[25%] -top-[30%] -mt-1.5 ml-10 px-3 pointer-events-none'
                                      data-tooltip-placement='left'
                                    >
                                      {file.fileName.name}
                                      <svg
                                        className='absolute text-black w-full  h-2.5 right-2.5 top-full'
                                        x='0px'
                                        y='0px'
                                        viewBox='0 0 255 255'
                                      >
                                        <polygon
                                          className='fill-current'
                                          points='0,0 127.5,127.5 255,0'
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </form>
                    </div>
                  </div>
                  <br />
                  <div className='flex items-center p-1 border-solid border-slate-200 rounded-b grid grid-cols-2 gap-6 mb-2'>
                    <button
                      type='button'
                      className='w-64 h-10 rounded-lg  ml-6 class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 mb-1 rounded shadow'
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      className='w-64 h-10 text-white bg-[#EE7103] active: font-bold text-sm px-6 py-3 rounded-lg mb-1 shadow hover:shadow-lg outline-none'
                      type='submit'
                    >
                      Add Crown Jewels
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  )
}

export default CrownJewel
