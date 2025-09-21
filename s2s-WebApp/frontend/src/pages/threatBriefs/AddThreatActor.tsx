import React, { useEffect, useState } from 'react'
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
import ReactMarkdown from 'react-markdown'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary'
import { makeStyles } from '@mui/styles'
import { useDispatch } from 'react-redux'
import { threatActorsDetails } from '../../redux/nodes/threatActors/action'

const useStyles = makeStyles({
  root: {
    '& .MuiTableCell-head': {
      color: 'white',
      backgroundColor: '#32435A',
    },
  },
})

function AddThreatActor({ setThreatactorPopup, threatActorPopupvalue }: any) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [query, setQuery] = useState<string>('')
  const [threatActorList, setThreatActorList] = useState<any>([] as any)

  const filteredRows =
    threatActorList?.length > 0
      ? threatActorList?.filter((row: any) => {
          const lowerCaseQuery = query.toLowerCase()
          const matchesEntityName = row?.entity_name?.toLowerCase().includes(lowerCaseQuery)
          const matchesCountry = row?.data?.countries?.some((country: any) =>
            country.name.toLowerCase().includes(lowerCaseQuery),
          )
          const matchesSector = row?.data?.sectors?.some((sector: any) =>
            sector?.name?.toLowerCase().includes(lowerCaseQuery),
          )
          const matchesAlias = row?.data?.threat_actors?.some((actor: any) =>
            actor?.aliases.some((alias: any) => alias?.toLowerCase().includes(lowerCaseQuery)),
          )
          return matchesEntityName || matchesCountry || matchesSector || matchesAlias
        })
      : []

  useEffect(() => {
    dispatch(threatActorsDetails() as any).then((res: any) => {
      if (res?.payload?.length > 0) {
        setThreatActorList(res?.payload)
      }
    })
  }, [])

  const renderers = {
    text: ({ children }: any) => <span className='font-medium text-base'>{children}</span>,
  }

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
              {threatActorPopupvalue == 'ThreatActor' && (
                <div>
                  <p className='text-lg font-semibold text-[#FFF]'>New Threat Brief</p>
                  <p className='text-sm font-normal text-[#B9B9B9]'>
                    You can create a new threat brief from the list of threat actors
                  </p>
                </div>
              )}
              {threatActorPopupvalue != 'ThreatActor' && (
                <div>
                  <p className='text-lg font-semibold text-[#FFF]'></p>
                </div>
              )}
              <div className='gap-5'>
                {threatActorPopupvalue == 'ThreatActor' && (
                  <button
                    type='button'
                    className='mr-4 w-52 h-11 text-[white] bg-[#EE7103] font-medium  rounded-lg text-sm px-5 py-2.5 text-center items-center'
                  >
                    Generate Threat Brief
                  </button>
                )}
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
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search...'
            className='p-2 border border-gray-300 rounded w-64 text-[#000]'
          />
          <div className='overflow-y-auto h-full p-4'>
            {threatActorPopupvalue == 'ThreatActor' && (
              <>
                {filteredRows.length > 0 ? (
                  <>
                    {filteredRows?.map((item: any) => (
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
                                <span className='text-2xl font-medium'>{item?.entity_name}</span>
                              </div>
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          {item?.data?.countries?.length > 0 && (
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
                                <TableContainer
                                  sx={{ borderRadius: '8px', border: 1, maxHeight: 240 }}
                                >
                                  <Table stickyHeader>
                                    <TableHead>
                                      <TableRow className={classes.root}>
                                        <TableCell sx={{ color: '#fff' }}>Name</TableCell>
                                        <TableCell sx={{ color: '#fff' }}>Description</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody style={{ background: '#1D2939' }}>
                                      {item.data.countries.map((country: any, index: any) => (
                                        <TableRow
                                          hover
                                          key={index}
                                          sx={{
                                            color: '#fff',
                                          }}
                                        >
                                          <TableCell sx={{ color: '#fff' }}>
                                            {country.name}
                                          </TableCell>
                                          <TableCell sx={{ color: '#fff' }}>
                                            {country.description || 'No Description'}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </AccordionDetails>
                            </Accordion>
                          )}
                          {item?.data?.sectors?.length > 0 && (
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
                                <TableContainer
                                  sx={{ borderRadius: '8px', border: 1, maxHeight: 240 }}
                                >
                                  <Table stickyHeader>
                                    <TableHead>
                                      <TableRow className={classes.root}>
                                        <TableCell sx={{ color: '#fff' }}>Name</TableCell>
                                        <TableCell sx={{ color: '#fff' }}>Description</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody style={{ background: '#1D2939' }}>
                                      {item.data.sectors.map((sector: any, index: any) => (
                                        <TableRow
                                          hover
                                          key={index}
                                          sx={{
                                            color: '#fff',
                                          }}
                                        >
                                          <TableCell sx={{ color: '#fff' }}>
                                            {sector.name}
                                          </TableCell>
                                          <TableCell sx={{ color: '#fff' }}>
                                            {sector.description || 'No Description'}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </AccordionDetails>
                            </Accordion>
                          )}
                          {item?.data?.threat_actors?.length > 0 && (
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
                                {item.data.threat_actors.map((actor: any, index: any) => (
                                  <>
                                    <ReactMarkdown
                                      components={{ text: renderers.text }}
                                      className='text-[#fff] text-xs font-medium'
                                    >
                                      {actor.description.replace(/"/g, '')}
                                    </ReactMarkdown>
                                    <div className='flex flex-wrap space-x-1 mt-2'>
                                      {actor.aliases.map((alias: any, index: any) => (
                                        <React.Fragment key={index}>
                                          <span>{alias}</span>
                                          {index < actor.aliases.length - 1 && <span>,</span>}
                                        </React.Fragment>
                                      ))}
                                    </div>
                                  </>
                                ))}
                              </AccordionDetails>
                            </Accordion>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </>
                ) : (
                  <>
                    <h1>No data</h1>
                  </>
                )}
              </>
            )}
            {threatActorPopupvalue !== 'ThreatActor' && (
              <div className='justify-center items-center flex'>
                <h1>Coming Soon...</h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddThreatActor
