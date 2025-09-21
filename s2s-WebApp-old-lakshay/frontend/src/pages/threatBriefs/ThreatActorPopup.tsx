import React, { useState } from 'react'
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary'
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
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

const useStyles = makeStyles({
  root: {
    '& .MuiTableCell-head': {
      color: 'white',
      backgroundColor: '#32435A',
    },
  },
})

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

export default function ThreatActorPopup({
  threatActorPopup,
  setThreatactorPopup,
  threatActorPopupvalue,
}: any) {
  const classes = useStyles()
  const [query, setQuery] = useState<string>('')

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

  return (
    <div className='backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
      <div className='relative w-[90vw] my-6 mx-auto'>
        <div className='border-0 rounded-lg relative flex flex-col bg-[#1D2939] outline-none focus:outline-none h-[40rem]'>
          <div className='gap-4 m-1 p-2 mb-0 p-[24px]'>
            <div className='flex justify-between'>
              <div>
                {threatActorPopupvalue?.data?.threat_actors?.length > 0 ? (
                  <>
                    {threatActorPopupvalue?.data?.threat_actors?.map((actor: any, index: any) => (
                      <>
                        <h3 className='text-xl font-semibold text-[#FFF]'>{actor?.name}</h3>
                        <br />
                        <h3 className='text-lg font-semibold text-[#FFF]'>{'Description'}</h3>

                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => <h1 className='markdown-heading'>{children}</h1>,
                            h2: ({ children }) => <h2 className='markdown-heading'>{children}</h2>,
                            h3: ({ children }) => <h3 className='markdown-heading'>{children}</h3>,
                            a: ({ node, ...props }) => (
                              <a {...props} target='_blank' rel='noopener noreferrer'>
                                {props.children}
                              </a>
                            ),
                            code({ inline, className, children, ...props }: CodeProps) {
                              const match = /language-(\w+)/.exec(className || '')
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  style={darcula as any}
                                  language={match[1]}
                                  PreTag='div'
                                  className={`markdown-code ${className}`}
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              )
                            },
                          }}
                        >
                          {actor.description}
                        </ReactMarkdown>
                      </>
                    ))}
                  </>
                ) : (
                  <h3 className='text-lg font-semibold text-[#FFF]'>{'No data'}</h3>
                )}
              </div>
              <div>
                <p className='text-lg font-semibold text-[#FFF]'></p>
              </div>
              <div className='gap-5'>
                <button
                  onClick={() => {
                    setThreatactorPopup(false)
                  }}
                >
                  <svg
                    className='mt-2'
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <path
                      d='M18 6L6 18M6 6L18 18'
                      stroke='#98A2B3'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className='overflow-y-auto h-full p-4'>
            {threatActorPopupvalue?.data?.countries?.length > 0 && (
              <Accordion
                className=''
                classes={{
                  root: 'text-[#fff]',
                }}
                sx={{ backgroundColor: 'transparent', color: '#fff' }}
              >
                <AccordionSummary
                  aria-controls='nested-panel-content'
                  id='nested-panel-header'
                  sx={{ cursor: 'default' }}
                >
                  <div className='w-full'>
                    <div className='flex flex-row justify-between items-center gap-[8px]'>
                      <div className='flex gap-[8px] justify-start items-center cursor-pointer'>
                        <span className='text-xl font-medium'>Countries</span>
                      </div>
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer sx={{ borderRadius: '8px', border: 1, maxHeight: 240 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow className={classes.root}>
                          <TableCell sx={{ color: '#fff' }}>Name</TableCell>
                          <TableCell sx={{ color: '#fff' }}>Description</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody style={{ background: '#1D2939' }}>
                        {threatActorPopupvalue.data.countries.map((country: any, index: any) => (
                          <TableRow
                            hover
                            key={index}
                            sx={{
                              color: '#fff',
                            }}
                          >
                            <TableCell sx={{ color: '#fff' }}>{country.name}</TableCell>
                            <TableCell sx={{ color: '#fff' }}>
                              {country.description || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            )}
            {threatActorPopupvalue?.data?.sectors?.length > 0 && (
              <Accordion
                className=''
                classes={{
                  root: 'text-[#fff]',
                }}
                sx={{ backgroundColor: 'transparent', color: '#fff' }}
              >
                <AccordionSummary
                  aria-controls='nested-panel-content'
                  id='nested-panel-header'
                  sx={{ cursor: 'default' }}
                >
                  <div className='w-full'>
                    <div className='flex flex-row justify-between items-center gap-[8px]'>
                      <div className='flex gap-[8px] justify-start items-center cursor-pointer'>
                        <span className='text-xl font-medium'>Industries</span>
                      </div>
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer sx={{ borderRadius: '8px', border: 1, maxHeight: 240 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow className={classes.root}>
                          <TableCell sx={{ color: '#fff' }}>Name</TableCell>
                          <TableCell sx={{ color: '#fff' }}>Description</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody style={{ background: '#1D2939' }}>
                        {threatActorPopupvalue.data.sectors.map((sector: any, index: any) => (
                          <TableRow
                            hover
                            key={index}
                            sx={{
                              color: '#fff',
                            }}
                          >
                            <TableCell sx={{ color: '#fff' }}>{sector.name}</TableCell>
                            <TableCell sx={{ color: '#fff' }}>
                              {sector.description || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            )}
            {threatActorPopupvalue?.data?.threat_actors?.length > 0 && (
              <Accordion
                className=''
                classes={{
                  root: 'text-[#fff]',
                }}
                sx={{ backgroundColor: 'transparent', color: '#fff' }}
              >
                <AccordionSummary
                  aria-controls='nested-panel-content'
                  id='nested-panel-header'
                  sx={{ cursor: 'default' }}
                >
                  <div className='w-full'>
                    <div className='flex flex-row justify-between items-center gap-[8px]'>
                      <div className='flex gap-[8px] justify-start items-center cursor-pointer'>
                        <span className='text-xl font-medium'>Aliases</span>
                      </div>
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  {threatActorPopupvalue?.data?.threat_actors?.length > 0 && (
                    <>
                      {threatActorPopupvalue?.data?.threat_actors?.map((actor: any, index: any) => (
                        <>
                          <div className='grid grid-cols-5 gap-4'>
                            {actor.aliases.map((alias: any, index: any) => (
                              <div key={index} className='truncate'>
                                • {alias}
                              </div>
                            ))}
                          </div>
                        </>
                      ))}
                    </>
                  )}
                </AccordionDetails>
              </Accordion>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
