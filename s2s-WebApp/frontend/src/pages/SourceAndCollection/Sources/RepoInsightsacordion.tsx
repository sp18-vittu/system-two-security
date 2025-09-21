import {
  Accordion,
  AccordionDetails,
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
import { useLocation } from 'react-router-dom'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import ReactMarkdown from 'react-markdown'
import { Tooltip, TooltipProps } from '@mui/material'

import moment from 'moment'
import { makeStyles } from '@mui/styles'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

const useStyles = makeStyles({
  root: {
    '& .MuiTableCell-head': {
      color: 'white',
      backgroundColor: '#32435A',
    },
  },
})

function RepoInsightsacordion({ error, insightdata, reportdata, insightcard, ctisigmaFiles }: any) {
  const classes = useStyles()
  const location = useLocation()
  const { state } = location
  const [expandedIndex, setExpandedIndex] = useState<number | false>(false)
  const [activeTab, setActiveTab] = useState(1 as any)

  const handleChange = (index: number) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? false : index))
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
    const [mid, mnum] = item?.mitre_id?.split('.')
    if (mid && mnum) {
      window.open(`https://attack.mitre.org/techniques/${mid}/${mnum}`)
    } else {
      window.open(`https://attack.mitre.org/techniques/${mid}`)
    }
  }

  const arr = [
    'indicators',
    'attack_patterns',
    'ctiReports',
    'vulnerabilities',
    'malware',
    'infrastructure',
  ]

  useEffect(() => {
    if (state?.openindex) {
      setExpandedIndex(state?.openindex)
    }
  }, [state])

  const createNamedArray = (name: string, values: string[]) =>
    values.map((value) => ({ name, value }))

  // Merge all arrays with names and deduplicate
  const domaincombinedArray = [
    ...createNamedArray('domains', insightdata?.details?.indicators?.domains),
    ...createNamedArray('ipv6_addresses', insightdata?.details?.indicators?.ipv6_addresses),
    ...createNamedArray('ipv4_addresses', insightdata?.details?.indicators?.ipv4_addresses),
  ]

  const domainArray = Array.from(
    new Map(domaincombinedArray.map((item) => [`${item.name}-${item.value}`, item])).values(),
  )
  const urlcombinedArray = [...createNamedArray('URL', insightdata?.details?.indicators.urls)]

  const urlArray = Array.from(
    new Map(urlcombinedArray.map((item) => [`${item.name}-${item.value}`, item])).values(),
  )
  const emailcombinedArray = [
    ...createNamedArray('email', insightdata?.details?.indicators?.emails),
  ]

  const emailArray = Array.from(
    new Map(emailcombinedArray.map((item) => [`${item.name}-${item.value}`, item])).values(),
  )
  const tabs = [
    { id: 1, name: `Network (${domainArray.length})`, isActive: activeTab === 1 },
    { id: 2, name: `Emails (${emailArray.length})`, isActive: activeTab === 2 },
    { id: 3, name: `URLs (${urlArray.length})`, isActive: activeTab === 3 },
    {
      id: 4,
      name: `File Hashes (${
        insightdata?.details?.indicators?.file_hashes?.length
          ? insightdata?.details?.indicators?.file_hashes?.length
          : insightdata?.details?.indicators?.file_hashes?.length
      })`,
      isActive: activeTab === 4,
    },
  ]

  return (
    <div className='mt-[-15px]'>
      {insightdata.details &&
        Object?.keys(insightdata.details)
          ?.filter((obj: any) => {
            return obj !== 'attackFlow'
          })
          ?.sort((a, b) => arr?.indexOf(a) - arr?.indexOf(b))
          ?.map((obj: any, index: any) => {
            const mitresHeader = ['MITRE ID', 'Description']
            const cveHeader = ['Name', 'Description']
            const domainHeader = ['Indicator Type', 'Indicator']
            const infrastructure = ['Infrastructure Name', 'Description']
            const ctiReportHeader = ['CTI Reports', '', '', 'Source']
            const malwaresHeader = ['Malware name', 'Description', 'Aliases', 'Creation Time']
            const iocHeader = ['IOC Type']
            const addressesHeader = ['Addresses']
            if (!arr?.includes(obj) || !insightdata.details[obj]) return <></>
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
                      {obj === 'indicators' && (
                        <span className='text-2xl max-lg:text-lg font-inter font-semibold text-[var(--Base-White)]'>{`IOCs (${insightdata?.counts?.indicators?.total})`}</span>
                      )}
                      {obj === 'attack_patterns' && (
                        <span className='text-2xl max-lg:text-lg font-medium'>
                          {`MITRE ATT&CK Tactics and Techniques (${insightdata?.counts?.attack_patterns})`}
                        </span>
                      )}
                      {obj === 'ctiReports' && (
                        <span className='text-2xl max-lg:text-lg font-inter font-semibold text-[var(--Base-White)]'>{`Associated CTI Reports (${insightdata?.counts?.attack_patterns})`}</span>
                      )}

                      {obj === 'addresses' && (
                        <span className='text-2xl max-lg:text-lg font-inter font-semibold text-[var(--Base-White)]'>
                          {'Addresses Used'}
                        </span>
                      )}
                      {obj === 'vulnerabilities' && (
                        <span className='text-2xl max-lg:text-lg font-inter font-semibold text-[var(--Base-White)]'>{`CVEs (${insightdata?.counts?.vulnerabilities})`}</span>
                      )}
                      {obj === 'malware' && (
                        <span className='text-2xl max-lg:text-lg font-inter font-semibold text-[var(--Base-White)]'>{`Malware (${insightdata?.counts?.malware})`}</span>
                      )}
                      {obj === 'infrastructure' && (
                        <span className='text-2xl max-lg:text-lg font-inter font-semibold text-[var(--Base-White)]'>{`Further Reading`}</span>
                      )}
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  {obj === 'indicators' && (
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
                          <div className='mt-8 p-6 w-full max-sm:mt-8'>
                            <>
                              <div className='overflow-y-scroll max-h-[300px] scrollbar-hide mt-1'>
                                <TableContainer
                                  sx={{ borderRadius: '8px', border: 1, maxHeight: 440 }}
                                >
                                  <Table sx={{ width: '100%' }}>
                                    <TableHead
                                      sx={{ borderRadius: '8px', border: 1, maxHeight: 440 }}
                                    >
                                      <TableRow>
                                        {domainHeader?.map((head: string, index: number) => (
                                          <TableCell
                                            key={index}
                                            sx={{
                                              textTransform: 'capitalize',
                                              color: '#fff',
                                            }}
                                          >
                                            {head}
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                    </TableHead>
                                    <TableBody sx={{ background: '#1D2939' }}>
                                      {domainArray?.length > 0 ? (
                                        <>
                                          {domainArray?.map((item: any) => (
                                            <TableRow>
                                              <TableCell sx={{ color: '#fff', width: '20%' }}>
                                                {transformString(item.name)}
                                              </TableCell>
                                              <TableCell sx={{ color: '#fff', width: '20%' }}>
                                                {transformString(item.value)}
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
                                          </TableRow>
                                        </>
                                      )}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </div>
                            </>
                          </div>
                        )}
                        {activeTab === 2 && (
                          <div className='mt-8 p-6 w-full max-sm:mt-8'>
                            <>
                              <div className='overflow-y-scroll max-h-[300px] scrollbar-hide mt-1'>
                                <TableContainer
                                  sx={{ borderRadius: '8px', border: 1, maxHeight: 440 }}
                                >
                                  <Table sx={{ width: '100%' }}>
                                    <TableHead sx={{ background: '#32435A' }}>
                                      <TableRow>
                                        {domainHeader?.map((head: string, index: number) => (
                                          <TableCell
                                            key={index}
                                            sx={{
                                              textTransform: 'capitalize',
                                              color: '#fff',
                                            }}
                                          >
                                            {head}
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                    </TableHead>
                                    <TableBody sx={{ background: '#1D2939' }}>
                                      {emailArray?.length > 0 ? (
                                        <>
                                          {emailArray?.map((item: any) => (
                                            <TableRow>
                                              <TableCell sx={{ color: '#fff', width: '20%' }}>
                                                {transformString(item.name)}
                                              </TableCell>
                                              <TableCell sx={{ color: '#fff', width: '20%' }}>
                                                {transformString(item.value)}
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
                                          </TableRow>
                                        </>
                                      )}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </div>
                            </>
                          </div>
                        )}
                        {activeTab === 3 && (
                          <div className='mt-8 p-6 w-full max-sm:mt-8'>
                            <>
                              <div className='overflow-y-scroll max-h-[300px] scrollbar-hide mt-1'>
                                <TableContainer
                                  sx={{ borderRadius: '8px', border: 1, maxHeight: 440 }}
                                >
                                  <Table sx={{ width: '100%' }}>
                                    <TableHead sx={{ background: '#32435A' }}>
                                      <TableRow>
                                        {domainHeader?.map((head: string, index: number) => (
                                          <TableCell
                                            key={index}
                                            sx={{
                                              textTransform: 'capitalize',
                                              color: '#fff',
                                            }}
                                          >
                                            {head}
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                    </TableHead>
                                    <TableBody sx={{ background: '#1D2939' }}>
                                      {urlArray?.length > 0 ? (
                                        <>
                                          {urlArray?.map((item: any) => (
                                            <TableRow>
                                              <TableCell sx={{ color: '#fff', width: '20%' }}>
                                                {transformString(item.name)}
                                              </TableCell>
                                              <TableCell sx={{ color: '#fff', width: '20%' }}>
                                                {transformString(item.value)}
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
                                          </TableRow>
                                        </>
                                      )}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </div>
                            </>
                          </div>
                        )}
                        {activeTab === 4 && (
                          <div className='mt-8 p-6 w-full max-sm:mt-8'>
                            <>
                              <div className='overflow-y-scroll max-h-[300px] scrollbar-hide mt-1'>
                                <TableContainer
                                  sx={{ borderRadius: '8px', border: 1, maxHeight: 440 }}
                                >
                                  <Table sx={{ width: '100%' }}>
                                    <TableHead sx={{ background: '#32435A' }}>
                                      <TableRow>
                                        {domainHeader?.map((head: string, index: number) => (
                                          <TableCell
                                            key={index}
                                            sx={{
                                              textTransform: 'capitalize',
                                              color: '#fff',
                                            }}
                                          >
                                            {head}
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                    </TableHead>
                                    <TableBody sx={{ background: '#1D2939' }}>
                                      {insightdata?.details?.indicators?.file_hashes.length > 0 ? (
                                        <>
                                          {insightdata?.details?.indicators?.file_hashes?.map(
                                            (item: any) => (
                                              <TableRow>
                                                <TableCell sx={{ color: '#fff', width: '20%' }}>
                                                  {transformString(item.type)}
                                                </TableCell>
                                                <TableCell sx={{ color: '#fff', width: '20%' }}>
                                                  {transformString(item.value)}
                                                </TableCell>
                                              </TableRow>
                                            ),
                                          )}
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
                                          </TableRow>
                                        </>
                                      )}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </div>
                            </>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  {obj === 'attack_patterns' && (
                    <div>
                      <ReactMarkdown
                        components={{ text: renderers.text }}
                        className='font-medium text-[#98A2B3] font-inter markDown-ThreadBreif'
                      >
                        {insightdata?.ttps_paragraph}
                      </ReactMarkdown>
                      <TableContainer sx={{ borderRadius: '8px', border: 1, maxHeight: 440 }}>
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
                            {insightdata.details['attack_patterns'].length > 0 ? (
                              <>
                                {insightdata.details['attack_patterns'].map(
                                  (item: any, index: number) => (
                                    <TableRow key={index}>
                                      <TableCell
                                        sx={{
                                          color: '#fff',
                                          borderBottom:
                                            index ===
                                            insightdata.details['attack_patterns'].length - 1
                                              ? 0
                                              : 1,
                                        }}
                                        width={'30%'}
                                      >
                                        <div className='flex gap-[4px] items-center'>
                                          <span>{item.mitre_id}</span>
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
                                            index ===
                                            insightdata.details['attack_patterns'].length - 1
                                              ? 0
                                              : 1,
                                        }}
                                      >
                                        {item.description}
                                      </TableCell>
                                    </TableRow>
                                  ),
                                )}
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
                          {insightdata[obj]?.length > 0 ? (
                            <>
                              {insightdata[obj]?.map((item: any, index: number) => (
                                <TableRow key={index}>
                                  <TableCell
                                    sx={{
                                      color: '#fff',
                                      borderBottom: index === insightdata[obj]?.length - 1 ? 0 : 1,
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
                                      borderBottom: index === insightdata[obj].length - 1 ? 0 : 1,
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
                            {insightdata[obj]?.length > 0 ? (
                              <>
                                {insightdata[obj]?.map((item: any, index: number) => (
                                  <TableRow key={index}>
                                    <TableCell
                                      sx={{
                                        color: '#fff',
                                        borderBottom:
                                          index === insightdata[obj]?.length - 1 ? 0 : 1,
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
                  {obj === 'malware' && (
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
                          {insightdata.details['malware']?.length > 0 ? (
                            <>
                              {insightdata.details['malware']?.map((item: any, index: number) => (
                                <TableRow key={index}>
                                  <TableCell
                                    sx={{
                                      color: '#fff',
                                      borderBottom:
                                        index === insightdata.details['malware']?.length - 1
                                          ? 0
                                          : 1,
                                    }}
                                  >
                                    <div className='flex items-center gap-[12px]'>
                                      <div className='flex flex-col'>{item?.name}</div>
                                    </div>
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      color: '#fff',
                                      borderBottom:
                                        index === insightdata.details['malware']?.length - 1
                                          ? 0
                                          : 1,
                                      width: item?.description ? 400 : 100,
                                    }}
                                  >
                                    <div className='flex items-center gap-[12px]'>
                                      <div className='flex flex-col'>
                                        {item?.description ? item?.description : 'N/A'}
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      color: '#fff',
                                      borderBottom:
                                        index === insightdata.details['malware']?.length - 1
                                          ? 0
                                          : 1,
                                      width: 400,
                                    }}
                                  >
                                    {item.aliases?.length > 0 ? (
                                      <>
                                        <>
                                          <div className='grid grid-cols-3 gap-4'>
                                            {item?.aliases?.map((alias: any, index: any) => (
                                              <BootstrapTooltip title={alias} placement='top'>
                                                <div
                                                  key={index}
                                                  className='truncate cursor-pointer'
                                                >
                                                  • {alias}
                                                </div>
                                              </BootstrapTooltip>
                                            ))}
                                          </div>
                                        </>
                                      </>
                                    ) : (
                                      <>{'N/A'}</>
                                    )}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      color: '#fff',
                                      borderBottom:
                                        index === insightdata.details['malware']?.length - 1
                                          ? 0
                                          : 1,
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
                  {obj === 'vulnerabilities' && (
                    <>
                      <TableContainer sx={{ borderRadius: '8px', border: 1, maxHeight: 440 }}>
                        <Table sx={{ width: '100%' }}>
                          <TableHead sx={{ background: '#32435A' }}>
                            <TableRow>
                              {cveHeader?.map((head: string, index: number) => (
                                <TableCell key={index} sx={{ color: '#fff' }}>
                                  {head}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody sx={{ background: '#1D2939' }}>
                            {insightdata.details['vulnerabilities'].length > 0 ? (
                              <>
                                {insightdata.details['vulnerabilities']
                                  .filter((item: any) => {
                                    return item?.name != 'N/A' && item?.name != ''
                                  })
                                  .map((item: any, index: number) => (
                                    <TableRow key={index}>
                                      <TableCell
                                        sx={{
                                          color: '#fff',
                                          borderBottom:
                                            index ===
                                            insightdata.details['vulnerabilities'].length - 1
                                              ? 0
                                              : 1,
                                        }}
                                        width={'30%'}
                                      >
                                        <div className='flex gap-[4px] items-center'>
                                          <span>{item.name}</span>
                                        </div>
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          color: '#fff',
                                          borderBottom:
                                            index ===
                                            insightdata.details['vulnerabilities'].length - 1
                                              ? 0
                                              : 1,
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
                        <div className='text-white text-lg font-medium leading-6'>{`INFRASTRUCTURE (${insightdata?.counts?.infrastructure})`}</div>
                        <TableContainer sx={{ borderRadius: '8px', border: 1, maxHeight: 440 }}>
                          <Table sx={{ width: '100%' }}>
                            <TableHead sx={{ background: '#32435A' }}>
                              <TableRow>
                                {infrastructure?.map((head: string, index: number) => (
                                  <TableCell key={index} sx={{ color: '#fff' }}>
                                    {head}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody sx={{ background: '#1D2939' }}>
                              {insightdata.details['infrastructure'].length > 0 ? (
                                <>
                                  {insightdata.details['infrastructure'].map(
                                    (item: any, index: number) => (
                                      <TableRow key={index}>
                                        <TableCell
                                          sx={{
                                            color: '#fff',
                                            borderBottom:
                                              index ===
                                              insightdata.details['infrastructure'].length - 1
                                                ? 0
                                                : 1,
                                          }}
                                          width={'30%'}
                                        >
                                          <div className='flex gap-[4px] items-center'>
                                            <span>{item.name}</span>
                                          </div>
                                        </TableCell>
                                        <TableCell
                                          sx={{
                                            color: '#fff',
                                            borderBottom:
                                              index ===
                                              insightdata.details['infrastructure'].length - 1
                                                ? 0
                                                : 1,
                                          }}
                                        >
                                          {item.description}
                                        </TableCell>
                                      </TableRow>
                                    ),
                                  )}
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
                                  </TableRow>
                                </>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
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

export default RepoInsightsacordion
