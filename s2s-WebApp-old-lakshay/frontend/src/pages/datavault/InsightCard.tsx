import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  tooltipClasses,
} from '@mui/material'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary'
import { styled } from '@mui/material/styles'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Axios from 'axios'
import { useDispatch } from 'react-redux'
import local from '../../utils/local'
import { useData } from '../../layouts/shared/DataProvider'
import { insightCardList } from '../../redux/nodes/insight/action'
import { environment } from '../../environment/environment'
import { BulkTranslateFileList, TargetFileList } from '../../redux/nodes/py-sigma/action'
import YamlEditor from './YamlEditor'
import YamlTextEditor from './YamlTextEditor'
import { Tooltip, TooltipProps } from '@mui/material'
import { sigmaCitNameList } from '../../redux/nodes/sigma-files/action'

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}))

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<KeyboardArrowDownIcon sx={{ fontSize: '1.5rem', color: 'white' }} />}
    {...props}
  />
))(() => ({
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(180deg)',
  },
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
}))

const yaml = require('js-yaml')

const InsightCard = () => {
  const { id } = useParams()

  const navigateTo = useNavigate()
  const dispatch = useDispatch()

  const { setDetail }: any = useData()

  const [insightdata, setinsightdata] = useState([] as any)

  const localToken = local.getItem('bearerToken')
  const token = JSON.parse(localToken as any)

  const [reportdata, setreportdata] = useState(null as any)

  const [ctisigmaFiles, setctisigmaFiles] = useState([] as any)

  const vault = sessionStorage.getItem('vault')
  const selectedVault = JSON.parse(vault as any)

  const insight = sessionStorage.getItem('insightdata')
  const insightcard = JSON.parse(insight as any)

  const [error, setError] = useState(null)

  useEffect(() => {
    dispatch(insightCardList(token, insightcard) as any).then((res: any) => {
      if (res?.type === 'INSIGHT_CARD_DETAIL_SUCCESS') {
        setinsightdata(res?.payload)
      } else if (res?.type === 'INSIGHT_CARD_DETAIL_FAILED') {
        setError(res?.payload)
      }
    })
    dispatch(sigmaCitNameList(token, insightcard) as any).then((res: any) => {
      setreportdata(res?.payload?.length)
      setctisigmaFiles(res.payload)
    })
  }, [])

  const haadlebackmethod = () => {
    navigateTo(-1)
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

  /**********************Bulk Download Section*************************/

  const [disable, setDisable] = useState(true)
  const [istranslating, setIsTranslating] = useState(false)
  const [bulkDownload, setBulkDownload] = useState(true)
  const [closePopupDisable, setclosePopupDisable] = useState(false)

  let valutName: any = JSON.parse(sessionStorage.getItem('breadcrumNames') || '{}')
  let downloadname: any = valutName.find((x: any) => x.id == id)

  const hanldleDownloadClick = async () => {
    let getId: any = []
    let CTIName: any
    ctisigmaFiles.map((value: any) => {
      getId.push({ id: value.id, global: value.global })
      CTIName = value.ctiName
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
        downloadLink.download = `S2S_${downloadname.name}_${
          CTIName ? CTIName : 'Curated Intel'
        }.zip`
        downloadLink.click()
        URL.revokeObjectURL(fileURL)
      }
      reader.readAsDataURL(data)
    } catch (err) {
      console.log('err', err)
    }
  }

  /**********************Bulk Translate Section*************************/

  const [ymltextbluk, setYmlTextBluk] = useState(null as any)
  const [bluckdocId, setBluckdocId] = useState([] as any)
  const [openTranslatePopup, setOpenTranslatePopup] = useState(false)
  const [selectTargers, setSelectTargers] = React.useState([])
  const [targetId, setTargetId] = useState(null as any)

  const handleClickTargerbulk = (event: any) => {
    if (event.target.value) {
      setDisable(false)
      setTargetId(event.target.value)
    } else {
      setDisable(true)
      setTargetId(null)
    }
  }

  const [defaultText, setDefaultText] = useState(
    'Once the processing is complete, the files to your left will be translated into queries. You can then download them.',
  )

  const hanldleTranslateClick = () => {
    let valueget: any = []
    let docId: any = []
    ctisigmaFiles.map((item: any) => {
      valueget.push(item.name)
      docId.push(item?.id)
    })
    const yamlText = yaml.dump(valueget)
    setYmlTextBluk(yamlText)
    setBluckdocId(docId)
    setOpenTranslatePopup(true)
    dispatch(TargetFileList() as any).then((data: any) => {
      setSelectTargers(data.payload)
    })
  }

  const [showPopover, setShowPopover] = useState(false)
  const [copyText, setCopyText] = useState(null as any)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(copyText)
    setShowPopover(true)
    setTimeout(() => {
      setShowPopover(false)
    }, 2000)
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
        params: { global: selectedVault.global },
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
      target: targetId?.toLowerCase(),
    }
    setTimeout(() => {
      dispatch(BulkTranslateFileList(obj, selectedVault) as any).then((response: any) => {
        setDefaultText(
          '\n \n ' +
            'You translation request is now completed. You can download the queries by clicking on the download icon',
        )
        setDisable(false)
        setclosePopupDisable(false)
        setBulkDownload(false)
        setIsTranslating(false)
      })
    }, 5000)
  }

  /**********************Inspect Sigma Section *****************/

  const hanldleSigmaClick = () => {
    setDetail({ from: 'InsightInspectSigmas', value: insightcard })
    navigateTo(`/app/VaultPermission/${id}`)
  }

  return (
    <div>
      <div className='p-[32px] overflow-y-auto'>
        <div className='flex justify-between'>
          <div className='text-white text-2xl font-medium'>Overview</div>
          <button
            className='px-1 ml-3 mt-2 bg-transparent text-dark border-0 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
            onClick={() => haadlebackmethod()}
          >
            <span className='flex'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
              >
                <path
                  d='M15 18L9 12L15 6'
                  stroke={'#fff'}
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                />
              </svg>
              <div className='text-white text-base font-medium'>Back</div>
            </span>
          </button>
        </div>
        <div className='text-white text-base font-light mt-2'>{insightdata?.summary}</div>
        {!error && insightdata?.threatActors?.length > 0 && (
          <Accordion
            sx={{
              boxShadow: 'none',
              backgroundColor: '#1D2939',
              borderRadius: '10px',
              '&.MuiAccordionSummary-content .Mui-expanded': {
                margin: '0px',
              },
            }}
          >
            <AccordionSummary
              aria-controls='panel4-content'
              id='panel4-header'
              sx={{
                backgroundColor: '#0C111D',
                height: '50px',
                padding: '0px',
              }}
            >
              <Typography
                variant='body1'
                sx={{ color: 'white', display: 'flex', padding: '2px' }}
                className='header-text'
              >
                Threat Actor Aliases
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                width: '100%',
                backgroundColor: '#1D2939',
                display: 'flex',
              }}
            >
              <Box sx={{ width: '100%' }}>
                {insightdata?.threatActors
                  ?.slice(0, 5)
                  ?.map((value: any, index: number, array: any[]) => (
                    <>
                      <ul className='list-disc text-white text-sm font-light ml-2'>
                        <li>
                          {index === array.length - 1 ? (
                            <span style={{ color: 'white' }}>{value} ...</span>
                          ) : (
                            value
                          )}
                        </li>
                      </ul>
                    </>
                  ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}
        {!error && insightdata?.mitres?.length > 0 && (
          <Accordion
            sx={{
              boxShadow: 'none',
              backgroundColor: '#1D2939',
              borderRadius: '10px',
              '&.MuiAccordionSummary-content .Mui-expanded': {
                margin: '0px',
              },
            }}
          >
            <AccordionSummary
              aria-controls='panel1-content'
              id='panel1-header'
              style={{
                backgroundColor: '#0C111D',
                height: '50px',
                padding: '0px',
                justifyContent: 'space-between !important',
              }}
            >
              <Grid container direction='row' justifyContent='space-between'>
                <Grid>
                  <Typography
                    variant='body1'
                    className='header-text'
                    sx={{ color: 'white', display: 'flex' }}
                  >
                    MITRE ATT&CK Tactics and Techniques
                  </Typography>
                </Grid>
                <Grid>
                  <Typography
                    variant='body1'
                    sx={{ color: 'white', fontSize: '14px', display: 'flex' }}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <a href={insightcard?.mitreLocation} target='_blank' className='flex'>
                      View in MITRE ATT&CK Navigator
                      <span className='ml-1'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='20'
                          height='20'
                          viewBox='0 0 20 20'
                          fill='none'
                        >
                          <path
                            d='M17.5 7.5L17.5 2.5M17.5 2.5H12.5M17.5 2.5L10.8333 9.16667M8.33333 4.16667H6.5C5.09987 4.16667 4.3998 4.16667 3.86502 4.43915C3.39462 4.67883 3.01217 5.06129 2.77248 5.53169C2.5 6.06647 2.5 6.76654 2.5 8.16667V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5H11.8333C13.2335 17.5 13.9335 17.5 14.4683 17.2275C14.9387 16.9878 15.3212 16.6054 15.5608 16.135C15.8333 15.6002 15.8333 14.9001 15.8333 13.5V11.6667'
                            stroke='white'
                            stroke-width='1.66667'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                        </svg>
                      </span>
                    </a>
                  </Typography>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                width: '100%',
                backgroundColor: '#1D2939',
                padding: '1px 1px 1px',
              }}
            >
              <Table size='small'>
                <TableBody>
                  <TableRow>
                    <Accordion
                      sx={{
                        marginTop: '5px',
                        pointerEvents: 'auto',
                      }}
                      defaultExpanded
                    >
                      <AccordionDetails
                        sx={{
                          width: '100%',
                          backgroundColor: '#1D2939',
                        }}
                      >
                        <Table size='small' sx={{ width: '100%', border: '1px solid #32435A' }}>
                          <TableHead sx={{ backgroundColor: '#485E7C' }}>
                            <TableRow>
                              <TableCell sx={{ color: 'white', borderBottom: '1px solid #32435A' }}>
                                Technique{' '}
                              </TableCell>
                              <TableCell sx={{ color: 'white', borderBottom: '1px solid #32435A' }}>
                                MITRE ID{' '}
                              </TableCell>
                              <TableCell sx={{ color: 'white', borderBottom: '1px solid #32435A' }}>
                                Procedure
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {insightdata?.mitres?.length > 0 ? (
                              <>
                                {insightdata?.mitres?.map((value: any) => (
                                  <>
                                    <TableRow>
                                      <TableCell
                                        sx={{
                                          color: 'white',
                                          fontWeight: 400,
                                          borderBottom: '1px solid #32435A',
                                        }}
                                      >
                                        {(value?.technique ? value?.technique : '-') ||
                                          (value?.tactic ? value?.tactic : '-') ||
                                          (value?.subTechnique ? value?.subTechnique : '-')}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          color: 'white',
                                          fontWeight: 400,
                                          borderBottom: '1px solid #32435A',
                                        }}
                                      >
                                        <span className='flex'>
                                          {value.id}
                                          <span className='ml-1'>
                                            <svg
                                              xmlns='http://www.w3.org/2000/svg'
                                              width='17'
                                              height='16'
                                              viewBox='0 0 17 16'
                                              fill='none'
                                            >
                                              <path
                                                d='M14.5 6L14.5 2M14.5 2H10.5M14.5 2L9.16667 7.33333M7.16667 3.33333H5.7C4.5799 3.33333 4.01984 3.33333 3.59202 3.55132C3.21569 3.74307 2.90973 4.04903 2.71799 4.42535C2.5 4.85318 2.5 5.41323 2.5 6.53333V10.8C2.5 11.9201 2.5 12.4802 2.71799 12.908C2.90973 13.2843 3.21569 13.5903 3.59202 13.782C4.01984 14 4.5799 14 5.7 14H9.96667C11.0868 14 11.6468 14 12.0746 13.782C12.451 13.5903 12.7569 13.2843 12.9487 12.908C13.1667 12.4802 13.1667 11.9201 13.1667 10.8V9.33333'
                                                stroke='white'
                                                stroke-width='1.66667'
                                                stroke-linecap='round'
                                                stroke-linejoin='round'
                                              />
                                            </svg>
                                          </span>
                                        </span>
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          color: 'white',
                                          fontWeight: 400,
                                          borderBottom: '1px solid #32435A',
                                        }}
                                      >
                                        {value.description ? value.description : '-'}
                                      </TableCell>
                                    </TableRow>
                                  </>
                                ))}
                              </>
                            ) : (
                              <>
                                <TableRow>
                                  <TableCell
                                    sx={{
                                      color: 'white',
                                      fontWeight: 400,
                                      borderBottom: '1px solid #32435A',
                                    }}
                                  >
                                    {'N/A'}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      color: 'white',
                                      fontWeight: 400,
                                      borderBottom: '1px solid #32435A',
                                    }}
                                  >
                                    <span className='flex'>{'N/A'}</span>
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      color: 'white',
                                      fontWeight: 400,
                                      borderBottom: '1px solid #32435A',
                                    }}
                                  >
                                    {'N/A'}
                                  </TableCell>
                                </TableRow>
                              </>
                            )}
                          </TableBody>
                        </Table>
                      </AccordionDetails>
                    </Accordion>
                  </TableRow>
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        )}
        {!error && insightdata?.cves?.length > 0 && (
          <Accordion
            sx={{
              boxShadow: 'none',
              backgroundColor: '#1D2939',
              borderRadius: '10px',
              '&.MuiAccordionSummary-content .Mui-expanded': {
                margin: '0px',
              },
            }}
          >
            <AccordionSummary
              aria-controls='panel2-content'
              id='panel2-header'
              sx={{
                backgroundColor: '#0C111D',
                height: '50px',
                padding: '0px',
              }}
            >
              <Typography
                variant='body1'
                sx={{ color: 'white', display: 'flex', padding: '2px' }}
                className='header-text'
              >
                Exploited vulnerabilities
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                width: '100%',
                backgroundColor: '#1D2939',
              }}
            >
              <Table size='small' sx={{ border: '1px solid #32435A' }}>
                <TableHead sx={{ backgroundColor: '#485E7C' }}>
                  <TableRow>
                    <TableCell
                      sx={{
                        backgroundColor: '#485E7C',
                        color: 'white',
                        borderBottom: '1px solid #32435A',
                      }}
                    >
                      CVE ID{' '}
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: '#485E7C',
                        color: 'white',
                        borderBottom: '1px solid #32435A',
                      }}
                    >
                      CVSS Score{' '}
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: '#485E7C',
                        color: 'white',
                        borderBottom: '1px solid #32435A',
                      }}
                    >
                      Vendor
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {insightdata?.cves?.length > 0 ? (
                    <>
                      {insightdata?.cves?.map((value: any) => (
                        <>
                          <TableRow>
                            <TableCell
                              sx={{
                                color: 'white',
                                fontWeight: 400,
                                borderBottom: '1px solid #32435A',
                                width: '70%',
                              }}
                            >
                              <span className='flex'>
                                {value?.id}
                                <span className='ml-1'>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='17'
                                    height='16'
                                    viewBox='0 0 17 16'
                                    fill='none'
                                  >
                                    <path
                                      d='M14.5 6L14.5 2M14.5 2H10.5M14.5 2L9.16667 7.33333M7.16667 3.33333H5.7C4.5799 3.33333 4.01984 3.33333 3.59202 3.55132C3.21569 3.74307 2.90973 4.04903 2.71799 4.42535C2.5 4.85318 2.5 5.41323 2.5 6.53333V10.8C2.5 11.9201 2.5 12.4802 2.71799 12.908C2.90973 13.2843 3.21569 13.5903 3.59202 13.782C4.01984 14 4.5799 14 5.7 14H9.96667C11.0868 14 11.6468 14 12.0746 13.782C12.451 13.5903 12.7569 13.2843 12.9487 12.908C13.1667 12.4802 13.1667 11.9201 13.1667 10.8V9.33333'
                                      stroke='white'
                                      stroke-width='1.66667'
                                      stroke-linecap='round'
                                      stroke-linejoin='round'
                                    />
                                  </svg>
                                </span>
                              </span>
                              <span className='text-[#98A2B3] text-sm'>
                                {value?.description ? value?.description : '-'}
                              </span>
                            </TableCell>
                            <TableCell
                              sx={{
                                color: 'white',
                                fontWeight: 400,
                                borderBottom: '1px solid #32435A',
                                width: '10%',
                              }}
                            >
                              <button
                                type='button'
                                className='text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-2 py-0.5 me-2 mb-2'
                              >
                                {value?.score ? value?.score : '-'}
                              </button>
                            </TableCell>
                            <TableCell
                              sx={{
                                color: 'white',
                                fontWeight: 400,
                                borderBottom: '1px solid #32435A',
                                width: '10%',
                              }}
                            >
                              {value?.vulnerableProducts?.vendor
                                ? value?.vulnerableProducts?.vendor
                                : '-'}
                            </TableCell>
                          </TableRow>
                        </>
                      ))}
                    </>
                  ) : (
                    <>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: 'white',
                            fontWeight: 400,
                            borderBottom: '1px solid #32435A',
                            width: '70%',
                          }}
                        >
                          <span className='flex'>{'N/A'}</span>
                        </TableCell>
                        <TableCell
                          sx={{
                            color: 'white',
                            fontWeight: 400,
                            borderBottom: '1px solid #32435A',
                            width: '10%',
                          }}
                        >
                          {'N/A'}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: 'white',
                            fontWeight: 400,
                            borderBottom: '1px solid #32435A',
                            width: '10%',
                          }}
                        >
                          {'N/A'}
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        )}

        {reportdata > 0 && (
          <Accordion
            sx={{
              boxShadow: 'none',
              backgroundColor: '#1D2939',
              borderRadius: '10px',
              '&.MuiAccordionSummary-content .Mui-expanded': {
                margin: '0px',
              },
            }}
          >
            <AccordionSummary
              aria-controls='panel3-content'
              id='panel3-header'
              sx={{
                backgroundColor: '#0C111D',
                height: '50px',
                padding: '0px',
              }}
            >
              <Typography
                variant='body1'
                sx={{ color: 'white', display: 'flex', padding: '2px' }}
                className='header-text'
              >
                Detection Rules
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                width: '100%',
                backgroundColor: '#1D2939',
              }}
            >
              <Table size='small' sx={{ border: '1px solid #32435A' }}>
                <TableHead sx={{ backgroundColor: '#485E7C' }}>
                  <TableRow>
                    <TableCell
                      sx={{
                        backgroundColor: '#485E7C',
                        color: 'white',
                        borderBottom: '1px solid #32435A',
                      }}
                    >
                      Role{' '}
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: '#485E7C',
                        color: 'white',
                        borderBottom: '1px solid #32435A',
                      }}
                    >
                      Count{' '}
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: '#485E7C',
                        color: 'white',
                        borderBottom: '1px solid #32435A',
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell
                      sx={{ color: 'white', fontWeight: 400, borderBottom: '1px solid #32435A' }}
                    >
                      Sigma rules
                    </TableCell>
                    <TableCell
                      sx={{ color: 'white', fontWeight: 400, borderBottom: '1px solid #32435A' }}
                    >
                      {reportdata ? reportdata : 0}
                    </TableCell>
                    <TableCell
                      sx={{ color: 'white', fontWeight: 400, borderBottom: '1px solid #32435A' }}
                    >
                      <span className='flex gap-8 cursor-pointer'>
                        <BootstrapTooltip
                          title={
                            <div>
                              <h2>Bulk Download</h2>
                            </div>
                          }
                          arrow
                          placement='top'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='20'
                            height='20'
                            viewBox='0 0 20 20'
                            fill='none'
                            onClick={() => hanldleDownloadClick()}
                          >
                            <path
                              d='M6.6665 14.1667L9.99984 17.5M9.99984 17.5L13.3332 14.1667M9.99984 17.5V10M16.6665 13.9524C17.6844 13.1117 18.3332 11.8399 18.3332 10.4167C18.3332 7.88536 16.2811 5.83333 13.7498 5.83333C13.5677 5.83333 13.3974 5.73833 13.3049 5.58145C12.2182 3.73736 10.2119 2.5 7.9165 2.5C4.46472 2.5 1.6665 5.29822 1.6665 8.75C1.6665 10.4718 2.36271 12.0309 3.48896 13.1613'
                              stroke='white'
                              stroke-width='1.66667'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            />
                          </svg>
                        </BootstrapTooltip>
                        <BootstrapTooltip
                          title={
                            <div>
                              <h2>Bulk Translate</h2>
                            </div>
                          }
                          arrow
                          placement='top'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='20'
                            height='20'
                            viewBox='0 0 20 20'
                            fill='none'
                            onClick={() => hanldleTranslateClick()}
                          >
                            <path
                              d='M12.3812 13.3346C13.2225 13.3346 13.9052 12.6526 13.9052 11.8106V8.7633L14.6672 8.0013L13.9052 7.2393V4.19197C13.9052 3.34997 13.2232 2.66797 12.3812 2.66797M3.61998 2.66797C2.77798 2.66797 2.09598 3.34997 2.09598 4.19197V7.2393L1.33398 8.0013L2.09598 8.7633V11.8106C2.09598 12.6526 2.77798 13.3346 3.61998 13.3346M6.00065 11.3346L10.0007 4.66797'
                              stroke='white'
                              stroke-width='1.5'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            />
                          </svg>
                        </BootstrapTooltip>
                        <BootstrapTooltip
                          title={
                            <div>
                              <h2>Inspect Sigma</h2>
                            </div>
                          }
                          arrow
                          placement='top'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='17'
                            height='17'
                            viewBox='0 0 24 24'
                            fill='none'
                            onClick={() => hanldleSigmaClick()}
                          >
                            <path
                              d='M4.1437 2.04688C4.22573 2.15234 10.3234 11.9688 10.3234 12C10.3234 12.0312 4.22573 21.8477 4.1437 21.9492C4.11245 21.9883 5.68667 22 11.9992 22H19.8937V18.8945V15.7891H18.6437H17.3937V16.8281C17.3937 17.918 17.3664 18.1562 17.1984 18.4844C16.9796 18.9141 16.5343 19.2812 16.0695 19.4219C15.8195 19.5 15.7179 19.5 12.214 19.4922L8.62027 19.4805L10.9328 15.7695C12.2062 13.7266 13.2492 12.0312 13.2492 12C13.2492 11.9688 12.2062 10.2695 10.9328 8.23047L8.62027 4.51953L12.214 4.50781C15.7179 4.5 15.8195 4.5 16.0695 4.57812C16.5343 4.71875 16.9796 5.08594 17.1984 5.51562C17.3664 5.84375 17.3937 6.08203 17.3937 7.17188V8.21094H18.6437H19.8937V5.10547V2H11.9992C5.68667 2 4.11245 2.01172 4.1437 2.04688Z'
                              fill='white'
                            />
                          </svg>
                        </BootstrapTooltip>
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        )}

        {!error && insightdata?.malwares?.length > 0 && (
          <Accordion
            sx={{
              boxShadow: 'none',
              backgroundColor: '#1D2939',
              borderRadius: '10px',
              '&.MuiAccordionSummary-content .Mui-expanded': {
                margin: '0px',
              },
            }}
          >
            <AccordionSummary
              aria-controls='panel3-content'
              id='panel3-header'
              sx={{
                backgroundColor: '#0C111D',
                height: '50px',
                padding: '0px',
              }}
            >
              <Typography
                variant='body1'
                sx={{ color: 'white', display: 'flex', padding: '2px' }}
                className='header-text'
              >
                Malwares Rules
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                width: '100%',
                backgroundColor: '#1D2939',
              }}
            >
              <Table size='small' sx={{ border: '1px solid #32435A' }}>
                <TableHead sx={{ backgroundColor: '#485E7C' }}>
                  <TableRow>
                    <TableCell
                      sx={{
                        backgroundColor: '#485E7C',
                        color: 'white',
                        borderBottom: '1px solid #32435A',
                      }}
                    >
                      Name{' '}
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: '#485E7C',
                        color: 'white',
                        borderBottom: '1px solid #32435A',
                      }}
                    >
                      Description{' '}
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: '#485E7C',
                        color: 'white',
                        borderBottom: '1px solid #32435A',
                      }}
                    >
                      Create Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {insightdata?.malwares?.length > 0 ? (
                    <>
                      {insightdata?.malwares?.map((value: any) => (
                        <>
                          <TableRow>
                            <TableCell
                              sx={{
                                color: 'white',
                                fontWeight: 400,
                                borderBottom: '1px solid #32435A',
                                width: '15%',
                              }}
                            >
                              {value?.name ? value?.name : '-'}
                            </TableCell>
                            <TableCell
                              sx={{
                                color: 'white',
                                fontWeight: 400,
                                borderBottom: '1px solid #32435A',
                                width: '65%',
                              }}
                            >
                              {value?.description ? value?.description : '-'}
                            </TableCell>
                            <TableCell
                              sx={{
                                color: 'white',
                                fontWeight: 400,
                                borderBottom: '1px solid #32435A',
                                width: '20%',
                              }}
                            >
                              {value?.createDate ? value?.createDate : '-'}
                            </TableCell>
                          </TableRow>
                        </>
                      ))}
                    </>
                  ) : (
                    <>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: 'white',
                            fontWeight: 400,
                            borderBottom: '1px solid #32435A',
                            width: '15%',
                          }}
                        >
                          {'N/A'}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: 'white',
                            fontWeight: 400,
                            borderBottom: '1px solid #32435A',
                            width: '65%',
                          }}
                        >
                          {'N/A'}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: 'white',
                            fontWeight: 400,
                            borderBottom: '1px solid #32435A',
                            width: '20%',
                          }}
                        >
                          {'N/A'}
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        )}
      </div>

      {reportdata === 0 && (
        <div className='text-white text-xl flex justify-center text-center font-medium mt-[12%]'>
          No Insights Available
        </div>
      )}

      {openTranslatePopup && (
        <>
          <div className='backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
            <div className='relative w-full h-full p-[32px] mx-auto'>
              <div className='p-[20px] border-0 rounded-lg shadow-lg h-full relative flex flex-col bg-[#1D2939] outline-none focus:outline-none'>
                <div className='grid grid-cols-3 max-md:grid-cols-2 gap-4 justify-items-center m-1 p-2 pb-0 mb-0'>
                  <div className='max-md:hidden'></div>
                  <div className='text-white text-2xl font-bold max-md:text-xl max-md:flex w-full text-center'>
                    Bulk Translate
                  </div>
                  <div className='w-full flex justify-end mr-[0.5rem] items-center'>
                    <div className='flex justify-between'>
                      <>
                        <div className='relative'>
                          <button
                            type='button'
                            disabled={disable}
                            className='mt-0 pr-2'
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
                                  stroke={disable ? '#8992A1' : '#fff'}
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
                <div className='grid grid-cols-3 max-md:grid-cols-2 gap-4 justify-items-center px-2 mx-1 pb-4 mb-2'>
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
                            text-white ml-28 capitalize rounded-lg px-[25px] py-[6px] bg-[#EE7103] text-center flex ${
                              disable ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#6941C6]'
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
                      setYmlText={setYmlTextBluk}
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
                      borderRadius: '1rem',
                    }}
                  >
                    <YamlTextEditor ymltext={defaultText} setSeloctror={setCopyText} />
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

export default InsightCard
