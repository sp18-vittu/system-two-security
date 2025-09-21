import {
  Accordion,
  AccordionDetails,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tooltipClasses,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import Collapse from '@mui/material/Collapse'
import { useDispatch } from 'react-redux'
import { getThreatBriefSummary } from '../../redux/nodes/threatBriefs/action'
import { useParams } from 'react-router-dom'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary'
import { ReactSVG } from 'react-svg'
import ReactMarkdown from 'react-markdown'
import { Tooltip, TooltipProps } from '@mui/material'

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import moment from 'moment'
import { makeStyles } from '@mui/styles'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'

const useStyles = makeStyles({
  root: {
    '& .MuiTableCell-head': {
      color: 'white',
      backgroundColor: '#32435A',
    },
  },
})

const ThreatBrief = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { id: paramsId } = useParams()
  const [brief, setBrief] = useState(null as any)
  const [selectedIndex, setSelectedIndex] = useState(null as any)

  let addindicators = [
    {
      indicator: '45.132.227.213',
      indicatorType: 'IPV4',
      description: 'description',
    },
    {
      indicator: '45.132.227.213',
      indicatorType: 'IPV4',
      description: 'description',
    },
    {
      indicator: '45.132.227.213',
      indicatorType: 'IPV4',
      description: 'description',
    },
    {
      indicator: '45.132.227.213',
      indicatorType: 'IPV4',
      description: 'description',
    },
    {
      indicator: '45.132.227.213',
      indicatorType: 'IPV4',
      description: 'description',
    },
    {
      indicator: '45.132.227.213',
      indicatorType: 'IPV4',
      description: 'description',
    },
    {
      indicator: '45.132.227.213',
      indicatorType: 'IPV4',
      description: 'description',
    },
    {
      indicator: '45.132.227.213',
      indicatorType: 'IPV4',
      description: 'description',
    },
  ]

  useEffect(() => {
    dispatch(getThreatBriefSummary(paramsId) as any)
      .then((response: any) => {
        if (response && response.type === 'GET_THREAT_BRIEF_SUMMARY_SUCCESS') {
          if (Object.keys(response.payload).length > 0)
            response.payload.mitres.mitreJson =
              'https://mitre-attack.github.io/attack-navigator/#layerURL=' +
              response.payload.mitres.mitreJson
          response.payload.iocTypes[0].indicators =
            response?.payload?.iocTypes[0]?.indicators.concat(addindicators)
          setBrief(response.payload)
        }
      })
      .catch((err: any) => console.log('err', err))
  }, [paramsId])

  const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
      expandIcon={<KeyboardArrowDownIcon sx={{ fontSize: '2.8rem', color: 'white' }} />}
      {...props}
    />
  ))(() => ({
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(180deg)',
    },
  }))

  const renderers = {
    text: ({ children }: any) => <span className='font-medium text-base'>{children}</span>,
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

  const rows: any[] = ['SectorJ04 Group', 'GRACEFUL SPIDER', 'GOLD TAHOE']

  const [openRowIndex, setOpenRowIndex] = useState<number | null>(null)

  const handleRowClick = (index: number) => {
    setOpenRowIndex(openRowIndex === index ? null : index) // Toggle the collapse
  }

  const transformString = (str: string): string => {
    const protocolRegex = /^(ftp|sftp|s3|file|mailto|telnet|ssh|ws|wss|data|urn|http|https):\/\//i
    const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/
    if (ipRegex.test(str) || protocolRegex.test(str)) {
      return str
        .replace(/\./g, '[.]')
        .replace(/:/g, '[:]')
        .replace(/http/g, 'hxxp')
        .replace(/@/g, '[@]')
    }

    return str
  }

  const renderersrplace: any = {
    text: ({ children }: { children: string }) => {
      return transformString(children)
    },
  }

  const hanleClikOpenNewTab = (item: any) => {
    window.open(`https://attack.mitre.org/techniques/${item?.id}/`)
  }

  return (
    <div className='text-[#fff]'>
      <div className='mt-[18px] ml-8'>
        <p className='text-base font-medium'>
          <span className='text-2xl'>Summary</span>
        </p>
      </div>
      {!brief && (
        <div className='flex items-center justify-center min-h-screen mt-[-200px]'>
          <CircularProgress size='3rem' sx={{ color: '#EE7103' }} />
        </div>
      )}
      <div className='mt-[6px]'>
        <ul>
          {brief &&
            brief?.summary?.split('<br>')?.map((item: any, index: number) => {
              if (!item) return <div key={index}></div>
              return (
                <li key={index} className='flex justify-start items-center'>
                  <ReactMarkdown
                    components={{ text: renderers.text }}
                    className='font-medium text-base markDown_ThreadBreif_summar'
                  >
                    {item}
                  </ReactMarkdown>
                </li>
              )
            })}
        </ul>
      </div>
      {brief && brief?.aliases && (
        <div>
          <Accordion
            className=''
            classes={{
              root: 'text-[#fff]',
            }}
            sx={{ backgroundColor: 'transparent', color: '#fff' }}
          >
            <AccordionSummary
              aria-controls='panel1-content'
              id='panel1-header'
              sx={{ cursor: 'default' }}
            >
              <div className='w-full'>
                <div className='flex flex-row justify-between items-center gap-[8px]'>
                  <div className='flex gap-[8px] justify-start items-center cursor-pointer'>
                    <span>
                      <span className='text-2xl font-medium'>{'Associated Group (Aliases)'}</span>
                    </span>
                  </div>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              {brief?.aliases?.length > 0 && (
                <>
                  <>
                    <div className='grid grid-cols-5 gap-4'>
                      {brief?.aliases?.map((alias: any, index: any) => (
                        <div key={index} className='truncate'>
                          • {alias}
                        </div>
                      ))}
                    </div>
                  </>
                </>
              )}
            </AccordionDetails>
          </Accordion>
        </div>
      )}
      {brief && brief?.infrastructure && (
        <div>
          <Accordion
            className=''
            classes={{
              root: 'text-[#fff]',
            }}
            sx={{ backgroundColor: 'transparent', color: '#fff' }}
          >
            <AccordionSummary
              aria-controls='panel1-content'
              id='panel1-header'
              sx={{ cursor: 'default' }}
            >
              <div className='w-full'>
                <div className='flex flex-row justify-between items-center gap-[8px]'>
                  <div className='flex gap-[8px] justify-start items-center cursor-pointer'>
                    <span>
                      <span className='text-2xl font-medium'>{'Infrastructure'}</span>
                    </span>
                  </div>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <li className='flex justify-start items-center'>
                <ReactMarkdown
                  components={{ text: renderers.text }}
                  className='font-medium text-base markDown-ThreadBreif'
                >
                  {brief?.infrastructure}
                </ReactMarkdown>
              </li>
            </AccordionDetails>
          </Accordion>
        </div>
      )}
      {brief && brief?.victims && (
        <div>
          <Accordion
            className=''
            classes={{
              root: 'text-[#fff]',
            }}
            sx={{ backgroundColor: 'transparent', color: '#fff' }}
          >
            <AccordionSummary
              aria-controls='panel1-content'
              id='panel1-header'
              sx={{ cursor: 'default' }}
            >
              <div className='w-full'>
                <div className='flex flex-row justify-between items-center gap-[8px]'>
                  <div className='flex gap-[8px] justify-start items-center cursor-pointer'>
                    <span>
                      <span className='text-2xl font-medium'>{'Victims'}</span>
                    </span>
                  </div>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <li className='flex justify-start items-center'>
                <ReactMarkdown
                  components={{ text: renderers.text }}
                  className='font-medium text-base markDown-ThreadBreif'
                >
                  {brief?.victims}
                </ReactMarkdown>
              </li>
            </AccordionDetails>
          </Accordion>
        </div>
      )}
      <div>
        {brief &&
          Object?.keys(brief)?.map((obj: string) => {
            const arr = [
              'attackFlow',
              'mitres',
              'ctiReports',
              'iocTypes',
              'addresses',
              'cves',
              'malwares',
            ]
            const mitresHeader = ['Technique', 'MITRE ID', 'Procedure']
            const ctiReportHeader = ['CTI Reports', 'Source']
            const malwaresHeader = ['Malwares name', 'Description', 'Revoked', 'Creation Time']
            const iocHeader = ['IOC Type']
            const indicatorsHeader = ['Indicator Type', 'Indicator', 'Description']
            const addressesHeader = ['Addresses']
            if (!arr?.includes(obj) || !brief[obj]) return <></>
            return (
              <>
                <Accordion
                  className=''
                  classes={{
                    root: 'text-[#fff]',
                  }}
                  sx={{ backgroundColor: 'transparent', color: '#fff' }}
                >
                  <AccordionSummary
                    aria-controls='panel1-content'
                    id='panel1-header'
                    sx={{ cursor: 'default' }}
                  >
                    <div className='w-full'>
                      <div className='flex flex-row justify-between items-center gap-[8px]'>
                        <div className='flex gap-[8px] justify-start items-center cursor-pointer'>
                          <span></span>
                          {obj === 'attackFlow' && (
                            <span className='text-2xl font-medium'>{'Attack Flow Graph'}</span>
                          )}

                          {obj === 'mitres' && (
                            <span className='text-2xl font-medium'>
                              {'MITRE ATT&CK Tactics and Techniques'}
                            </span>
                          )}
                          {obj === 'ctiReports' && (
                            <span className='text-2xl font-medium'>{'Associated CTI Reports'}</span>
                          )}
                          {obj === 'iocTypes' && (
                            <span className='text-2xl font-medium'>{'IOCs'}</span>
                          )}
                          {obj === 'addresses' && (
                            <span className='text-2xl font-medium'>{'Addresses Used'}</span>
                          )}
                          {obj === 'cves' && <span className='text-2xl font-medium'>{'CVEs'}</span>}
                          {obj === 'malwares' && (
                            <span className='text-2xl font-medium'>{'Malwares'}</span>
                          )}
                        </div>
                        <div className='flex gap-[8px] justify-center items-center cursor-pointer'>
                          {obj === 'mitres' && (
                            <>
                              <a
                                href={brief[obj]?.mitreJson}
                                className='flex items-center gap-[8px] px-[14px] py-[8px]'
                                onClick={(e) => e.stopPropagation()}
                                target='_blank'
                              >
                                <span className='font-semibold text-sm'>
                                  {'View in MITRE ATT&CK  Navigator'}
                                </span>
                                <span>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='18'
                                    height='18'
                                    viewBox='0 0 18 18'
                                    fill='none'
                                  >
                                    <path
                                      d='M16.5 6.5L16.5 1.5M16.5 1.5H11.5M16.5 1.5L9.83333 8.16667M7.33333 3.16667H5.5C4.09987 3.16667 3.3998 3.16667 2.86502 3.43915C2.39462 3.67883 2.01217 4.06129 1.77248 4.53169C1.5 5.06647 1.5 5.76654 1.5 7.16667V12.5C1.5 13.9001 1.5 14.6002 1.77248 15.135C2.01217 15.6054 2.39462 15.9878 2.86502 16.2275C3.3998 16.5 4.09987 16.5 5.5 16.5H10.8333C12.2335 16.5 12.9335 16.5 13.4683 16.2275C13.9387 15.9878 14.3212 15.6054 14.5608 15.135C14.8333 14.6002 14.8333 13.9001 14.8333 12.5V10.6667'
                                      stroke='white'
                                      strokeWidth='1.66667'
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                    />
                                  </svg>
                                </span>
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    {obj === 'attackFlow' && (
                      <TransformWrapper>
                        {({ zoomIn, zoomOut, resetTransform }: any) => (
                          <div className=''>
                            <div className='gap-5 flex ml-3'>
                              <button onClick={() => zoomIn()}>
                                <BootstrapTooltip
                                  title={
                                    <div>
                                      <h2>zoom in</h2>
                                    </div>
                                  }
                                  arrow
                                  placement='top'
                                >
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='20'
                                    height='20'
                                    viewBox='0 0 22 22'
                                    fill='none'
                                  >
                                    <path
                                      d='M21 21L16.65 16.65M11 8V14M8 11H14M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z'
                                      stroke='white'
                                      stroke-width='2'
                                      stroke-linecap='round'
                                      stroke-linejoin='round'
                                    />
                                  </svg>
                                </BootstrapTooltip>
                              </button>
                              <button onClick={() => zoomOut()}>
                                <BootstrapTooltip
                                  title={
                                    <div>
                                      <h2>zoom out</h2>
                                    </div>
                                  }
                                  arrow
                                  placement='top'
                                >
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='20'
                                    height='20'
                                    viewBox='0 0 22 22'
                                    fill='none'
                                  >
                                    <path
                                      d='M21 21L16.65 16.65M8 11H14M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z'
                                      stroke='white'
                                      stroke-width='2'
                                      stroke-linecap='round'
                                      stroke-linejoin='round'
                                    />
                                  </svg>
                                </BootstrapTooltip>
                              </button>
                              <button onClick={() => resetTransform()}>
                                <BootstrapTooltip
                                  title={
                                    <div>
                                      <h2>reset view</h2>
                                    </div>
                                  }
                                  arrow
                                  placement='top'
                                >
                                  <svg
                                    className='mt-0.5'
                                    width='22'
                                    height='22'
                                    viewBox='0 0 22 22'
                                    xmlns='http://www.w3.org/2000/svg'
                                  >
                                    <g
                                      fill='none'
                                      fill-rule='evenodd'
                                      stroke='#fff'
                                      stroke-linecap='round'
                                      stroke-linejoin='round'
                                      transform='matrix(0 1 1 0 2.5 2.5)'
                                    >
                                      <path d='m3.98652376 1.07807068c-2.38377179 1.38514556-3.98652376 3.96636605-3.98652376 6.92192932 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8' />
                                      <path d='m4 1v4h-4' transform='matrix(1 0 0 -1 0 6)' />
                                    </g>
                                  </svg>
                                </BootstrapTooltip>
                              </button>
                            </div>
                            <TransformComponent>
                              <ReactSVG src={brief?.attackFlow} />
                            </TransformComponent>
                          </div>
                        )}
                      </TransformWrapper>
                    )}
                    {obj === 'mitres' && (
                      <div>
                        <ReactMarkdown
                          components={{ text: renderers.text }}
                          className='font-medium text-base markDown-ThreadBreif'
                        >
                          {brief?.ttps_paragraph}
                        </ReactMarkdown>
                        <TableContainer sx={{ borderRadius: '8px' }}>
                          <Table sx={{ width: '100%' }}>
                            <TableHead sx={{ background: '#32435A' }}>
                              <TableRow>
                                {mitresHeader?.map((head: string, index: number) => (
                                  <TableCell key={index} sx={{ color: '#fff' }}>
                                    {head}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody sx={{ background: '#1D2939' }}>
                              {brief[obj].mitreId?.length > 0 ? (
                                <>
                                  {brief[obj].mitreId.map((item: any, index: number) => (
                                    <TableRow key={index}>
                                      <TableCell
                                        sx={{
                                          color: '#fff',
                                          borderBottom:
                                            index === brief[obj].mitreId.length - 1 ? 0 : 1,
                                        }}
                                        width={'30%'}
                                      >
                                        {item.technique}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          color: '#fff',
                                          borderBottom:
                                            index === brief[obj].mitreId.length - 1 ? 0 : 1,
                                        }}
                                        width={'30%'}
                                      >
                                        <div className='flex gap-[4px] items-center'>
                                          <span>{item.id}</span>
                                          <span
                                            className='cursor-pointer'
                                            onClick={() => hanleClikOpenNewTab(item)}
                                          >
                                            <svg
                                              xmlns='http://www.w3.org/2000/svg'
                                              width='15'
                                              height='14'
                                              viewBox='0 0 15 14'
                                              fill='none'
                                            >
                                              <path
                                                d='M13.5 5L13.5 1M13.5 1H9.5M13.5 1L8.16667 6.33333M6.16667 2.33333H4.7C3.5799 2.33333 3.01984 2.33333 2.59202 2.55132C2.21569 2.74307 1.90973 3.04903 1.71799 3.42535C1.5 3.85318 1.5 4.41323 1.5 5.53333V9.8C1.5 10.9201 1.5 11.4802 1.71799 11.908C1.90973 12.2843 2.21569 12.5903 2.59202 12.782C3.01984 13 3.5799 13 4.7 13H8.96667C10.0868 13 10.6468 13 11.0746 12.782C11.451 12.5903 11.7569 12.2843 11.9487 11.908C12.1667 11.4802 12.1667 10.9201 12.1667 9.8V8.33333'
                                                stroke='white'
                                                strokeWidth='1.66667'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                              />
                                            </svg>
                                          </span>
                                        </div>
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          color: '#fff',
                                          borderBottom:
                                            index === brief[obj].mitreId.length - 1 ? 0 : 1,
                                        }}
                                      >
                                        {item.description}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </>
                              ) : (
                                <>
                                  <TableRow>
                                    <TableCell
                                      sx={{
                                        color: '#fff',
                                        borderBottom: 1,
                                      }}
                                      width={'30%'}
                                    >
                                      {'N/A'}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        color: '#fff',
                                        borderBottom: 1,
                                      }}
                                      width={'30%'}
                                    >
                                      {'N/A'}
                                    </TableCell>

                                    <TableCell
                                      sx={{
                                        color: '#fff',
                                        borderBottom: 1,
                                      }}
                                      width={'30%'}
                                    >
                                      {'N/A'}
                                    </TableCell>
                                  </TableRow>
                                </>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                    )}
                    {obj === 'ctiReports' && (
                      <TableContainer sx={{ borderRadius: '8px' }}>
                        <Table sx={{ width: '100%' }}>
                          <TableHead sx={{ background: '#32435A' }}>
                            <TableRow>
                              {ctiReportHeader?.map((head: string, index: number) => (
                                <TableCell key={index} sx={{ color: '#fff' }}>
                                  {head}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody sx={{ background: '#1D2939' }}>
                            {brief[obj]?.length > 0 ? (
                              <>
                                {brief[obj]?.map((item: any, index: number) => (
                                  <TableRow key={index}>
                                    <TableCell
                                      sx={{
                                        color: '#fff',
                                        borderBottom: index === brief[obj]?.length - 1 ? 0 : 1,
                                      }}
                                    >
                                      <div className='flex items-center gap-[12px]'>
                                        <div>
                                          <span>
                                            <svg
                                              xmlns='http://www.w3.org/2000/svg'
                                              width='36'
                                              height='36'
                                              viewBox='0 0 36 36'
                                              fill='none'
                                            >
                                              <path
                                                d='M18 1.3335C23 4.66683 24.5379 11.8202 24.6666 18.0002C24.5379 24.1801 23 31.3335 18 34.6668M18 1.3335C13 4.66683 11.4621 11.8202 11.3333 18.0002C11.4621 24.1801 13 31.3335 18 34.6668M18 1.3335C8.79523 1.3335 1.33331 8.79542 1.33331 18.0002M18 1.3335C27.2047 1.3335 34.6666 8.79542 34.6666 18.0002M18 34.6668C27.2047 34.6668 34.6666 27.2049 34.6666 18.0002M18 34.6668C8.79524 34.6668 1.33331 27.2049 1.33331 18.0002M34.6666 18.0002C31.3333 23.0002 24.1799 24.5381 18 24.6668C11.82 24.5381 4.66665 23.0002 1.33331 18.0002M34.6666 18.0002C31.3333 13.0002 24.1799 11.4622 18 11.3335C11.82 11.4622 4.66665 13.0002 1.33331 18.0002'
                                                stroke='white'
                                                strokeWidth='1.5'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                              />
                                            </svg>
                                          </span>
                                        </div>
                                        <div className='flex flex-col'>
                                          {/* <span className="text-[#fff] text-xs font-medium">{item.title}</span> */}
                                          <ReactMarkdown
                                            components={{ text: renderers.text }}
                                            className='text-[#fff] text-xs font-medium'
                                          >
                                            {item.title.replace(/"/g, '')}
                                          </ReactMarkdown>
                                          <span className='text-[#B9B9B9] text-xs font-normal'>
                                            {item.url}
                                          </span>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        color: '#fff',
                                        borderBottom: index === brief[obj].length - 1 ? 0 : 1,
                                      }}
                                    >
                                      <div className='flex'>
                                        <div
                                          className={`border rounded-2xl
                                                                        ${
                                                                          item.source === 'Private'
                                                                            ? 'border-[#1570EF]'
                                                                            : 'border-[#7F56D9]'
                                                                        }`}
                                        >
                                          <span
                                            className={`text-xs font-medium ps-[12px] pe-[10px]
                                                                            ${
                                                                              item.source ===
                                                                              'Private'
                                                                                ? 'text-[#1570EF]'
                                                                                : 'text-[#7F56D9]'
                                                                            }
                                                                        `}
                                          >
                                            {item.source}
                                          </span>
                                        </div>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </>
                            ) : (
                              <>
                                <TableRow>
                                  <TableCell
                                    sx={{
                                      color: '#fff',
                                      borderBottom: 1,
                                    }}
                                  >
                                    {'N/A'}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      color: '#fff',
                                      borderBottom: 1,
                                    }}
                                  >
                                    {'N/A'}
                                  </TableCell>
                                </TableRow>
                              </>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                    {obj === 'iocTypes' && (
                      <div>
                        <TableContainer sx={{ borderRadius: '8px' }}>
                          <Table sx={{ width: '100%' }}>
                            <TableHead sx={{ background: '#32435A' }}>
                              <TableRow>
                                {iocHeader?.map((head: any, index: number) => (
                                  <TableCell key={index} colSpan={2} sx={{ color: '#fff' }}>
                                    {head}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody sx={{ background: '#1D2939' }}>
                              {brief[obj]?.length > 0 ? (
                                <>
                                  {brief[obj]?.map((item: any, index: number) => (
                                    <>
                                      <TableRow sx={{ paddingX: 24, paddingY: 16 }}>
                                        <TableCell sx={{ color: '#fff' }}>
                                          <div className='flex items-center gap-[12px]'>
                                            <span
                                              className={`cursor-pointer ${
                                                selectedIndex === index ? 'rotate-0' : 'rotate-180'
                                              }`}
                                              onClick={() => {
                                                if (selectedIndex === index) setSelectedIndex(null)
                                                else setSelectedIndex(index)
                                              }}
                                            >
                                              <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                width='12'
                                                height='8'
                                                viewBox='0 0 12 8'
                                                fill='none'
                                              >
                                                <path
                                                  d='M11 6.5L6 1.5L1 6.5'
                                                  stroke='white'
                                                  strokeWidth='2'
                                                  strokeLinecap='round'
                                                  strokeLinejoin='round'
                                                />
                                              </svg>
                                            </span>
                                            <span>{item.type}</span>
                                          </div>
                                        </TableCell>
                                        <TableCell sx={{ color: '#fff' }}>
                                          <ReactMarkdown
                                            components={{ text: renderers.text }}
                                            className='font-medium text-base markDown-ThreadBreif'
                                          >
                                            {item.description}
                                          </ReactMarkdown>
                                        </TableCell>
                                      </TableRow>
                                      {/* ****************Sub child table********* */}
                                      <TableRow>
                                        <TableCell
                                          colSpan={2}
                                          style={{ padding: 0, paddingLeft: 56 }}
                                        >
                                          <Collapse in={true} timeout={500} unmountOnExit>
                                            <Box
                                              sx={{
                                                width: '100%',
                                                transition: 'height 1s',
                                                transitionTimingFunction: 'ease-in-out',
                                                ...(selectedIndex === index
                                                  ? { height: '100%' }
                                                  : { height: 0, width: 0, overflow: 'hidden' }),
                                              }}
                                            >
                                              {selectedIndex === index && (
                                                <>
                                                  <Table sx={{ paddingLeft: 12 }}>
                                                    <TableHead sx={{ background: '#32435A' }}>
                                                      <TableRow>
                                                        {indicatorsHeader?.map(
                                                          (head: string, index: number) => (
                                                            <TableCell
                                                              key={index}
                                                              sx={{
                                                                textTransform: 'capitalize',
                                                                color: '#fff',
                                                              }}
                                                            >
                                                              {head}
                                                            </TableCell>
                                                          ),
                                                        )}
                                                      </TableRow>
                                                    </TableHead>
                                                    <TableBody sx={{ background: '#1D2939' }}>
                                                      {item?.indicators?.length > 0 ? (
                                                        <>
                                                          {item?.indicators?.map((item: any) => (
                                                            <TableRow>
                                                              <TableCell
                                                                sx={{ color: '#fff', width: '20%' }}
                                                              >
                                                                {transformString(
                                                                  item.indicatorType,
                                                                )}
                                                              </TableCell>
                                                              <TableCell
                                                                sx={{ color: '#fff', width: '20%' }}
                                                              >
                                                                {transformString(item.indicator)}
                                                              </TableCell>
                                                              <TableCell
                                                                sx={{ color: '#fff', width: '60%' }}
                                                              >
                                                                <ReactMarkdown
                                                                  components={{
                                                                    text: renderersrplace.text,
                                                                  }}
                                                                  className='font-medium text-base markDown-ThreadBreif'
                                                                >
                                                                  {item.description}
                                                                </ReactMarkdown>
                                                              </TableCell>
                                                            </TableRow>
                                                          ))}
                                                        </>
                                                      ) : (
                                                        <>
                                                          <TableRow>
                                                            <TableCell
                                                              sx={{ color: '#fff', width: '20%' }}
                                                            >
                                                              {'N/A'}
                                                            </TableCell>
                                                            <TableCell
                                                              sx={{ color: '#fff', width: '20%' }}
                                                            >
                                                              {'N/A'}
                                                            </TableCell>
                                                            <TableCell
                                                              sx={{ color: '#fff', width: '60%' }}
                                                            >
                                                              {'N/A'}
                                                            </TableCell>
                                                          </TableRow>
                                                        </>
                                                      )}
                                                    </TableBody>
                                                  </Table>
                                                </>
                                              )}
                                            </Box>
                                          </Collapse>
                                        </TableCell>
                                      </TableRow>
                                    </>
                                  ))}
                                </>
                              ) : (
                                <>
                                  <TableRow sx={{ paddingX: 24, paddingY: 16 }}>
                                    <TableCell sx={{ color: '#fff' }}>{'N/A'}</TableCell>
                                  </TableRow>
                                </>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                    )}
                    {obj === 'addresses' && (
                      <>
                        <TableContainer sx={{ borderRadius: '8px' }}>
                          <Table sx={{ width: '100%' }}>
                            <TableHead sx={{ background: '#32435A' }}>
                              <TableRow>
                                {addressesHeader?.map((head: string, index: number) => (
                                  <TableCell key={index} sx={{ color: '#fff', width: '100%' }}>
                                    {head}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody sx={{ background: '#1D2939' }}>
                              {brief[obj]?.length > 0 ? (
                                <>
                                  {brief[obj]?.map((item: any, index: number) => (
                                    <TableRow key={index}>
                                      <TableCell
                                        sx={{
                                          color: '#fff',
                                          borderBottom: index === brief[obj]?.length - 1 ? 0 : 1,
                                        }}
                                      >
                                        {transformString(item)}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </>
                              ) : (
                                <>
                                  <TableRow>
                                    <TableCell
                                      sx={{
                                        color: '#fff',
                                        borderBottom: 1,
                                      }}
                                    >
                                      {'N/A'}
                                    </TableCell>
                                  </TableRow>
                                </>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </>
                    )}
                    {obj === 'malwares' && (
                      <TableContainer sx={{ borderRadius: '8px', border: 1, maxHeight: 440 }}>
                        <Table sx={{ width: '100%' }} stickyHeader>
                          <TableHead sx={{ background: '#32435A' }}>
                            <TableRow className={classes.root}>
                              {malwaresHeader?.map((head: string, index: number) => (
                                <TableCell key={index} sx={{ color: '#fff' }}>
                                  {head}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody sx={{ background: '#1D2939' }}>
                            {brief[obj]?.length > 0 ? (
                              <>
                                {brief[obj]?.map((item: any, index: number) => (
                                  <TableRow key={index}>
                                    <TableCell
                                      sx={{
                                        color: '#fff',
                                        borderBottom: index === brief[obj]?.length - 1 ? 0 : 1,
                                      }}
                                    >
                                      <div className='flex items-center gap-[12px]'>
                                        <div className='flex flex-col'>
                                          {/* <span className="text-[#fff] text-xs font-medium">{item.title}</span> */}
                                          {item?.name}
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        color: '#fff',
                                        borderBottom: index === brief[obj]?.length - 1 ? 0 : 1,
                                        width: 800,
                                      }}
                                    >
                                      <div className='flex items-center gap-[12px]'>
                                        <div className='flex flex-col'>{item?.description}</div>
                                      </div>
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        color: '#fff',
                                        borderBottom: index === brief[obj].length - 1 ? 0 : 1,
                                      }}
                                    >
                                      {item?.revoked ? 'True' : 'False'}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        color: '#fff',
                                        borderBottom: index === brief[obj].length - 1 ? 0 : 1,
                                      }}
                                    >
                                      {moment(item?.created).format('DD-MMM HH:mm')}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </>
                            ) : (
                              <>
                                <TableRow>
                                  <TableCell
                                    sx={{
                                      color: '#fff',
                                      borderBottom: 1,
                                    }}
                                  >
                                    {'N/A'}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      color: '#fff',
                                      borderBottom: 1,
                                    }}
                                  >
                                    {'N/A'}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      color: '#fff',
                                      borderBottom: 1,
                                    }}
                                  >
                                    {'N/A'}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      color: '#fff',
                                      borderBottom: 1,
                                    }}
                                  >
                                    {'N/A'}
                                  </TableCell>
                                </TableRow>
                              </>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                    {obj === 'cves' && (
                      <>
                        <TableContainer sx={{ borderRadius: '8px', border: 1, maxHeight: 440 }}>
                          <Table sx={{ width: '100%' }} stickyHeader>
                            <TableHead sx={{ background: '#32435A' }}>
                              <TableRow className={classes.root}>
                                <TableCell />
                                <TableCell sx={{ color: '#fff' }}>CVEs Name</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Description</TableCell>
                                <TableCell sx={{ color: '#fff' }}>CVEs Score</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Creation Time</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody sx={{ background: '#1D2939' }}>
                              {brief[obj]?.length > 0 ? (
                                <>
                                  {brief[obj]?.map((row: any, index: any) => (
                                    <>
                                      <TableRow>
                                        <TableCell sx={{ color: '#fff', width: 100 }}>
                                          <IconButton
                                            onClick={() => handleRowClick(index)}
                                            sx={{ color: '#fff' }}
                                          >
                                            {openRowIndex == index ? (
                                              <KeyboardArrowUp sx={{ color: '#fff' }} />
                                            ) : (
                                              <KeyboardArrowDown sx={{ color: '#fff' }} />
                                            )}
                                          </IconButton>
                                        </TableCell>
                                        <TableCell sx={{ color: '#fff', width: 200 }}>
                                          {row.name}
                                        </TableCell>
                                        <TableCell sx={{ color: '#fff', width: 500 }}>
                                          {row.description}
                                        </TableCell>
                                        <TableCell sx={{ color: '#fff' }}>
                                          {row.cvss_score}
                                        </TableCell>
                                        <TableCell sx={{ color: '#fff' }}>
                                          {moment(row?.created).format('DD-MMM HH:mm')}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell
                                          colSpan={6}
                                          style={{ paddingBottom: 0, paddingTop: 0 }}
                                        >
                                          <Collapse
                                            in={openRowIndex == index}
                                            timeout='auto'
                                            unmountOnExit
                                          >
                                            <Box margin={1} sx={{ color: '#fff' }}>
                                              {row?.affected_softwares?.length > 0 && (
                                                <div className='grid grid-cols-5 gap-4'>
                                                  {row?.affected_softwares?.map(
                                                    (alias: any, index: any) => (
                                                      <div key={index} className='truncate'>
                                                        • {alias}
                                                      </div>
                                                    ),
                                                  )}
                                                </div>
                                              )}
                                            </Box>
                                          </Collapse>
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
                                        color: '#fff',
                                        borderBottom: 1,
                                      }}
                                    >
                                      {'N/A'}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        color: '#fff',
                                        borderBottom: 1,
                                      }}
                                    >
                                      {'N/A'}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        color: '#fff',
                                        borderBottom: 1,
                                      }}
                                    >
                                      {'N/A'}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        color: '#fff',
                                        borderBottom: 1,
                                      }}
                                    >
                                      {'N/A'}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        color: '#fff',
                                        borderBottom: 1,
                                      }}
                                    >
                                      {'N/A'}
                                    </TableCell>
                                  </TableRow>
                                </>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </>
                    )}
                  </AccordionDetails>
                </Accordion>
              </>
            )
          })}
      </div>
    </div>
  )
}

export default ThreatBrief
