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
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import Collapse from '@mui/material/Collapse'
import { useLocation } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import AddIcon from '@mui/icons-material/Add'

import MuiAccordionSummary from '@mui/material/AccordionSummary'

import moment from 'moment'
import { makeStyles } from '@mui/styles'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import RemoveIcon from '@mui/icons-material/Remove'

const useStyles = makeStyles({
  root: {
    '& .MuiTableCell-head': {
      color: 'white',
      backgroundColor: '#32435A',
    },
  },
})

function ThreatebriefAccordian({ brief }: any) {
  const classes = useStyles()
  const [expandedIndex, setExpandedIndex] = useState<number | false>(false)
  const [activeTab, setActiveTab] = useState(1 as any)
  const location = useLocation()
  const { state } = location

  const handleChange = (index: number) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? false : index))
  }
  const [openRowIndex, setOpenRowIndex] = useState<number | null>(null)

  const handleRowClick = (index: number) => {
    setOpenRowIndex(openRowIndex === index ? null : index) // Toggle the collapse
  }

  const renderers = {
    text: ({ children }: any) => <span className='font-medium text-base'>{children}</span>,
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

  const AccordionSummary = styled(
    (
      props: {
        expanded: boolean
        onClickIcon: (e: React.MouseEvent) => void
      } & React.ComponentProps<typeof MuiAccordionSummary>,
    ) => (
      <MuiAccordionSummary
        expandIcon={
          props.expanded ? (
            <RemoveIcon
              sx={{ fontSize: '36px', color: '#EE7103', fontWeight: 400, lineHeight: '24px' }}
              onClick={(e) => {
                e.stopPropagation() // Prevent click event from bubbling up to the Accordion
                props.onClickIcon(e) // Handle the icon click
              }}
            />
          ) : (
            <AddIcon
              sx={{ fontSize: '36px', color: '#EE7103', fontWeight: 400, lineHeight: '24px' }}
              onClick={(e) => {
                e.stopPropagation() // Prevent click event from bubbling up to the Accordion
                props.onClickIcon(e) // Handle the icon click
              }}
            />
          )
        }
        {...props}
      />
    ),
  )(() => ({
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(180deg)',
    },
  }))

  const hanleClikOpenNewTab = (item: any) => {
    const [mid, mnum] = item?.id?.split('.')
    if (mid && mnum) {
      window.open(`https://attack.mitre.org/techniques/${mid}/${mnum}`)
    } else {
      window.open(`https://attack.mitre.org/techniques/${mid}`)
    }
  }

  const networkcount =
    brief && brief['iocTypes']?.length > 0
      ? brief['iocTypes']?.find((x: any) => x.type == 'Network')
      : []
  const hostkcount =
    brief && brief['iocTypes']?.length > 0
      ? brief['iocTypes']?.find((x: any) => x.type == 'Host')
      : []
  const filecount =
    brief && brief['iocTypes']?.length > 0
      ? brief['iocTypes']?.find((x: any) => x.type == 'File')
      : []
  const behaviouralcount =
    brief && brief['iocTypes']?.length > 0
      ? brief['iocTypes']?.find((x: any) => x.type == 'Behavioral')
      : []

  const tabs = [
    { id: 1, name: `Network (${networkcount?.indicators?.length})`, isActive: activeTab === 1 },
    { id: 2, name: `Host (${hostkcount?.indicators?.length})`, isActive: activeTab === 2 },
    { id: 3, name: `File (${filecount?.indicators?.length})`, isActive: activeTab === 3 },
    {
      id: 4,
      name: `Behavioural (${behaviouralcount?.indicators?.length})`,
      isActive: activeTab === 4,
    },
  ]

  useEffect(() => {
    if (state?.openindex) {
      setExpandedIndex(state?.openindex)
    }
  }, [state])

  const arr = [
    'iocTypes',
    'mitres',
    'ctiReports',
    'cves',
    'malwares',
    'attackFlow',
    'addresses',
    'infrastructure',
  ]
  return (
    <div className='mt-[-15px]'>
      {brief &&
        Object?.keys(brief)
          ?.filter((obj: any) => {
            return obj !== 'attackFlow'
          })
          ?.sort((a, b) => arr?.indexOf(a) - arr?.indexOf(b))
          ?.map((obj: any, index: any) => {
            const mitresHeader = ['Technique', 'MITRE ID', 'Procedure']
            const ctiReportHeader = ['CTI Reports', '', '', 'Source']
            const malwaresHeader = ['Malware name', 'Description', 'Revoked', 'Creation Time']
            const indicatorsHeader = ['Indicator Type', 'Indicator', 'Description']
            const addressesHeader = ['Addresses']
            if (!arr?.includes(obj) || !brief[obj]) return <></>
            return (
              <Accordion
                key={index}
                expanded={expandedIndex === index}
                className=''
                classes={{
                  root: 'text-[#fff]',
                }}
                sx={{
                  backgroundColor: '#1D2939',
                  color: '#fff',
                  width: '98%',
                  border: '2px solid #3E4B5D',
                  marginTop: 2,
                }}
              >
                <AccordionSummary
                  expanded={expandedIndex === index}
                  onClickIcon={() => handleChange(index)}
                  aria-controls='panel1-content'
                  id='panel1-header'
                  sx={{ cursor: 'default' }}
                >
                  <div className='bg-dark flex flex-col md:flex-row items-center justify-between p-4 rounded-lg shadow-md space-y-4 md:space-y-0 md:space-x-4 w-full max-sm:p-0'>
                    <div className='flex items-center space-x-2'>
                      {obj === 'iocTypes' && (
                        <span className='text-2xl max-lg:text-lg text-center font-inter font-semibold text-[var(--Base-White)]'>{`IOCs (${
                          parseInt(brief['iocTypes'][0]?.indicators?.length) +
                          parseInt(brief['iocTypes'][1]?.indicators?.length) +
                          parseInt(brief['iocTypes'][2]?.indicators?.length) +
                          parseInt(brief['iocTypes'][3]?.indicators?.length)
                        })`}</span>
                      )}
                      {obj === 'mitres' && (
                        <span className='text-2xl max-lg:text-lg text-center font-medium'>
                          {`MITRE ATT&CK Tactics and Techniques (${brief['mitres']?.mitreId?.length})`}
                        </span>
                      )}
                      {obj === 'ctiReports' && (
                        <span className='text-2xl max-lg:text-lg text-center font-inter font-semibold text-[var(--Base-White)]'>{`Associated CTI Reports (${brief['ctiReports']?.length})`}</span>
                      )}

                      {obj === 'addresses' && (
                        <span className='text-2xl max-lg:text-lg text-center font-inter font-semibold text-[var(--Base-White)]'>
                          {'Addresses Used'}
                        </span>
                      )}
                      {obj === 'cves' && (
                        <span className='text-2xl max-lg:text-lg text-center font-inter font-semibold text-[var(--Base-White)]'>{`CVEs (${brief['cves']?.length})`}</span>
                      )}
                      {obj === 'malwares' && (
                        <span className='text-2xl max-lg:text-lg text-center font-inter font-semibold text-[var(--Base-White)]'>{`Malware (${brief['malwares']?.length})`}</span>
                      )}
                      {obj === 'infrastructure' && (
                        <span className='text-2xl max-lg:text-lg text-center font-inter font-semibold text-[var(--Base-White)]'>
                          {'Further Reading'}
                        </span>
                      )}
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  {obj === 'iocTypes' && (
                    <>
                      <div className='w-full h-full relative flex flex-col items-start '>
                        <div className='absolute left-6 flex border-b border-[#3E4B5D] space-x-3'>
                          {tabs.map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={`pb-2 font-inter   ${
                                tab.isActive
                                  ? 'border-b-[3px] border-white text-white'
                                  : 'text-[#98A2B3]'
                              } font-medium text-sm`}
                            >
                              {tab.name}
                            </button>
                          ))}
                        </div>
                        {activeTab === 1 && (
                          <div className='mt-4 p-6 w-full max-sm:mt-8'>
                            {brief['iocTypes']
                              ?.filter((item: any, index: any) => {
                                return item.type == 'Network'
                              })
                              ?.map((item: any) => (
                                <>
                                  <span>{item?.description}</span>
                                  <div className='overflow-y-scroll max-h-[300px] scrollbar-hide mt-4'>
                                    <TableContainer
                                      sx={{ borderRadius: '8px', border: 1, maxHeight: 440 }}
                                    >
                                      <Table sx={{ width: '100%' }}>
                                        <TableHead
                                          sx={{ borderRadius: '8px', border: 1, maxHeight: 440 }}
                                        >
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
                                                  <TableCell sx={{ color: '#fff', width: '20%' }}>
                                                    {transformString(item.indicatorType)}
                                                  </TableCell>
                                                  <TableCell sx={{ color: '#fff', width: '20%' }}>
                                                    {transformString(item.indicator)}
                                                  </TableCell>
                                                  <TableCell sx={{ color: '#fff', width: '60%' }}>
                                                    <ReactMarkdown
                                                      components={{ text: renderersrplace.text }}
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
                                                <TableCell sx={{ color: '#fff', width: '20%' }}>
                                                  {'N/A'}
                                                </TableCell>
                                                <TableCell sx={{ color: '#fff', width: '20%' }}>
                                                  {'N/A'}
                                                </TableCell>
                                                <TableCell sx={{ color: '#fff', width: '60%' }}>
                                                  {'N/A'}
                                                </TableCell>
                                              </TableRow>
                                            </>
                                          )}
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                  </div>
                                </>
                              ))}
                          </div>
                        )}
                        {activeTab === 2 && (
                          <div className='mt-4 p-6 w-full max-sm:mt-8'>
                            {brief['iocTypes']
                              ?.filter((item: any, index: any) => {
                                return item.type == 'Host'
                              })
                              ?.map((item: any) => (
                                <>
                                  <span>{item?.description}</span>
                                  <div className='overflow-y-scroll max-h-[300px] scrollbar-hide mt-4'>
                                    <TableContainer
                                      sx={{ borderRadius: '8px', border: 1, maxHeight: 440 }}
                                    >
                                      <Table sx={{ width: '100%' }}>
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
                                                  <TableCell sx={{ color: '#fff', width: '20%' }}>
                                                    {transformString(item.indicatorType)}
                                                  </TableCell>
                                                  <TableCell sx={{ color: '#fff', width: '20%' }}>
                                                    {transformString(item.indicator)}
                                                  </TableCell>
                                                  <TableCell sx={{ color: '#fff', width: '60%' }}>
                                                    <ReactMarkdown
                                                      components={{ text: renderersrplace.text }}
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
                                                <TableCell sx={{ color: '#fff', width: '20%' }}>
                                                  {'N/A'}
                                                </TableCell>
                                                <TableCell sx={{ color: '#fff', width: '20%' }}>
                                                  {'N/A'}
                                                </TableCell>
                                                <TableCell sx={{ color: '#fff', width: '60%' }}>
                                                  {'N/A'}
                                                </TableCell>
                                              </TableRow>
                                            </>
                                          )}
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                  </div>
                                </>
                              ))}
                          </div>
                        )}
                        {activeTab === 3 && (
                          <div className='mt-4 p-6 w-full max-sm:mt-8'>
                            {brief['iocTypes']
                              ?.filter((item: any, index: any) => {
                                return item.type == 'File'
                              })
                              ?.map((item: any) => (
                                <>
                                  <span>{item?.description}</span>
                                  <div className='overflow-y-scroll max-h-[300px] scrollbar-hide mt-4'>
                                    <TableContainer
                                      sx={{ borderRadius: '8px', border: 1, maxHeight: 440 }}
                                    >
                                      <Table sx={{ width: '100%' }}>
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
                                                  <TableCell sx={{ color: '#fff', width: '20%' }}>
                                                    {transformString(item.indicatorType)}
                                                  </TableCell>
                                                  <TableCell sx={{ color: '#fff', width: '20%' }}>
                                                    {transformString(item.indicator)}
                                                  </TableCell>
                                                  <TableCell sx={{ color: '#fff', width: '60%' }}>
                                                    <ReactMarkdown
                                                      components={{ text: renderersrplace.text }}
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
                                                <TableCell sx={{ color: '#fff', width: '20%' }}>
                                                  {'N/A'}
                                                </TableCell>
                                                <TableCell sx={{ color: '#fff', width: '20%' }}>
                                                  {'N/A'}
                                                </TableCell>
                                                <TableCell sx={{ color: '#fff', width: '60%' }}>
                                                  {'N/A'}
                                                </TableCell>
                                              </TableRow>
                                            </>
                                          )}
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                  </div>
                                </>
                              ))}
                          </div>
                        )}
                        {activeTab === 4 && (
                          <div className='mt-4 p-6 w-full max-sm:mt-8'>
                            {brief['iocTypes']
                              ?.filter((item: any, index: any) => {
                                return item.type == 'Behavioral'
                              })
                              ?.map((item: any) => (
                                <>
                                  <span>{item?.description}</span>
                                  <div className='overflow-y-scroll max-h-[300px] scrollbar-hide mt-4'>
                                    <TableContainer
                                      sx={{ borderRadius: '8px', border: 1, maxHeight: 440 }}
                                    >
                                      <Table sx={{ width: '100%' }}>
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
                                                  <TableCell sx={{ color: '#fff', width: '20%' }}>
                                                    {transformString(item.indicatorType)}
                                                  </TableCell>
                                                  <TableCell sx={{ color: '#fff', width: '20%' }}>
                                                    {transformString(item.indicator)}
                                                  </TableCell>
                                                  <TableCell sx={{ color: '#fff', width: '60%' }}>
                                                    <ReactMarkdown
                                                      components={{ text: renderersrplace.text }}
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
                                                <TableCell sx={{ color: '#fff', width: '20%' }}>
                                                  {'N/A'}
                                                </TableCell>
                                                <TableCell sx={{ color: '#fff', width: '20%' }}>
                                                  {'N/A'}
                                                </TableCell>
                                                <TableCell sx={{ color: '#fff', width: '60%' }}>
                                                  {'N/A'}
                                                </TableCell>
                                              </TableRow>
                                            </>
                                          )}
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                  </div>
                                </>
                              ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  {obj === 'mitres' && (
                    <div>
                      <ReactMarkdown
                        components={{ text: renderers.text }}
                        className='font-medium text-[#98A2B3] font-inter markDown-ThreadBreif'
                      >
                        {brief?.ttps_paragraph}
                      </ReactMarkdown>
                      <TableContainer
                        sx={{ borderRadius: '8px', border: 1, maxHeight: 440, marginTop: 4 }}
                      >
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
                    <TableContainer sx={{ borderRadius: '8px', border: 1, maxHeight: 440 }}>
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
                                      width: '70%',
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
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                  <TableCell
                                    sx={{
                                      color: '#fff',
                                      borderBottom: index === brief[obj].length - 1 ? 0 : 1,
                                      width: '30%',
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

                  {obj === 'addresses' && (
                    <>
                      <TableContainer sx={{ borderRadius: '8px', border: 1, maxHeight: 440 }}>
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
                                      <div className='flex flex-col'>{item?.name}</div>
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
                                      <TableCell sx={{ color: '#fff' }}>{row.cvss_score}</TableCell>
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
                  {obj === 'infrastructure' && (
                    <>
                      <div className='flex flex-col gap-4'>
                        {/* Infrastructure Section */}
                        {brief && brief?.infrastructure && (
                          <div className='flex flex-col gap-4'>
                            <div className='text-white text-lg font-medium leading-6'>
                              INFRASTRUCTURE
                            </div>
                            <div className='text-[#98A2B3] text-base font-normal leading-5'>
                              <ReactMarkdown
                                components={{ text: renderers.text }}
                                className='font-medium text-base markDown-ThreadBreif'
                              >
                                {brief?.infrastructure}
                              </ReactMarkdown>
                            </div>
                          </div>
                        )}

                        {/* Victims Section */}
                        {brief && brief?.victims && (
                          <div className='flex flex-col gap-4'>
                            <div className='text-white text-lg font-medium leading-6'>VICTIMS</div>
                            <div className='text-[#98A2B3] text-base font-normal leading-5'>
                              <ReactMarkdown
                                components={{ text: renderers.text }}
                                className='font-medium text-base markDown-ThreadBreif'
                              >
                                {brief?.victims}
                              </ReactMarkdown>
                            </div>
                          </div>
                        )}

                        {brief && brief?.aliases && (
                          <div className='flex flex-col gap-4'>
                            <div className='text-white text-lg font-medium leading-6'>
                              Associated Group (Aliases)
                            </div>
                            <div className='text-[#98A2B3] text-base font-normal leading-5'>
                              {brief?.aliases?.length > 0 && (
                                <>
                                  <>
                                    <div className='grid grid-cols-5 gap-4 max-sm:grid-cols-1'>
                                      {brief?.aliases?.map((alias: any, index: any) => (
                                        <div key={index} className='truncate'>
                                          • {alias}
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </AccordionDetails>
              </Accordion>
            )
          })}
    </div>
  )
}

export default ThreatebriefAccordian
