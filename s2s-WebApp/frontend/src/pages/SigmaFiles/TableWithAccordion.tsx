import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
} from '@mui/material'
import YamlEditor from '../datavault/YamlEditor'
import DownloadIcon from './DownloadIcon'
import FileCopyIcon from './FileCopyIcon'
import TimeAgo from './TimeAgo'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { useParams } from 'react-router-dom'
import moment from 'moment'

interface Data {
  platform: string
  executionDate: string
  recordsFound: number
  infectedSystems: number
  keyIOCs: string
}

const createData = (
  platform: string,
  executionDate: string,
  recordsFound: number,
  infectedSystems: number,
  keyIOCs: string,
): Data => {
  return { platform, executionDate, recordsFound, infectedSystems, keyIOCs }
}

const CollapsibleTableRow: React.FC<{ row: any }> = ({ row }) => {
  const [showPopover, setShowPopover] = useState(false)
  const [open, setOpen] = useState(false)
  const copyToClipboardContent = (params: any) => {
    navigator.clipboard.writeText(params?.singlequery)
    setShowPopover(true)
    setTimeout(() => {
      setShowPopover(false)
    }, 2000)
  }

  const downloadContent = (result: any) => {
    const blob = new Blob([result.singlequery], { type: 'text/plain' })
    const file = new File(
      [blob],
      `${result.target?.toUpperCase()}_${moment(new Date()).format('MM_DD_YYYY')}_${moment(
        new Date(),
      ).format('HH:mm')}.yml`,
      { type: 'text/plain' },
    )

    // Create a URL for the file
    const fileURL = URL.createObjectURL(file)

    // Create an anchor element and trigger a download
    const anchor = document.createElement('a')
    anchor.href = fileURL
    anchor.download = file.name // Set the filename
    anchor.style.display = 'none'

    document.body.appendChild(anchor)
    anchor.click()

    // Clean up the URL and remove the anchor
    URL.revokeObjectURL(fileURL)
    document.body.removeChild(anchor)
  }
  return (
    <>
      <TableRow>
        <TableCell colSpan={1} sx={{ color: '#fff', padding: '16px', width: '5%' }}>
          <IconButton onClick={() => setOpen(!open)}>
            {open ? (
              <RemoveIcon
                sx={{ fontSize: '36px', color: '#EE7103', fontWeight: 400, lineHeight: '24px' }}
              />
            ) : (
              <AddIcon
                sx={{ fontSize: '36px', color: '#EE7103', fontWeight: 400, lineHeight: '24px' }}
              />
            )}
          </IconButton>
        </TableCell>
        <TableCell sx={{ color: '#fff', padding: '16px', width: '5%' }}>
          {row?.target?.toLowerCase() == 'splunk' && (
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
          {row?.target?.toLowerCase() == 'elasticsearch' && (
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
          {row?.target?.toLowerCase() == 'opensearch' && (
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
        </TableCell>
        <TableCell sx={{ color: '#fff', padding: '16px', width: '10%' }}>
          <TimeAgo createdAt={row.createdAt} />
        </TableCell>
        <TableCell sx={{ color: '#fff', padding: '16px', width: '10%' }}>
          {row.status == 'faild'
            ? 'Failed'
            : row.status == 'completed'
            ? 'Completed'
            : 'Inprogress'}
        </TableCell>
        <TableCell sx={{ color: '#fff', padding: '16px', width: '10%' }}>{'-'}</TableCell>
        <TableCell sx={{ color: '#fff', padding: '16px', width: '10%' }}>{'-'}</TableCell>
        <TableCell colSpan={1} sx={{ color: '#fff', padding: '16px', width: '15%' }}>
          {'-'}
        </TableCell>
        <TableCell colSpan={1} sx={{ color: '#fff', padding: '16px', width: '7%' }}>
          <IconButton onClick={() => copyToClipboardContent(row)}>
            <FileCopyIcon />
          </IconButton>
          {showPopover && (
            <div className='absolute  p-1 bg-white text-black rounded shadow z-10 '>Copied!</div>
          )}
          <IconButton onClick={() => downloadContent(row)}>
            <DownloadIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <div className='grid grid-cols-2 gap-4 p-4 w-full '>
              {/* Card 1 */}
              <div className='w-full h-[1261px] flex-shrink-0 rounded-md border border-[#3E4B5D] bg-[#32435A] '>
                <div className='p-6'>
                  <div className={`mt-4 w-[550px] ${'flex flex-row'}`}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='22'
                      height='21'
                      viewBox='0 0 22 21'
                      fill='none'
                    >
                      <path
                        d='M9.27452 3.42349C9.40893 3.06912 9.94242 3.06912 10.0768 3.42349C10.6452 4.9223 11.7379 7.5288 12.8306 8.62147C13.9262 9.71702 16.4015 10.8126 17.8118 11.3797C18.1561 11.5182 18.1561 12.0348 17.8118 12.1733C16.4014 12.7404 13.9262 13.8359 12.8306 14.9313C11.7379 16.024 10.6452 18.6306 10.0768 20.1294C9.94242 20.4837 9.40893 20.4837 9.27452 20.1294C8.70616 18.6306 7.61346 16.024 6.52076 14.9313C5.42805 13.8386 2.8215 12.7461 1.32267 12.1777C0.968292 12.0433 0.968292 11.5098 1.32265 11.3754C2.82148 10.8069 5.42805 9.71418 6.52076 8.62147C7.61346 7.5288 8.70616 4.9223 9.27452 3.42349Z'
                        fill='#EE7103'
                      />
                      <path
                        d='M17.1444 0.262494C17.2899 -0.087498 17.8366 -0.087498 17.982 0.262494C18.284 0.989689 18.7124 1.88332 19.1407 2.31168C19.5717 2.74268 20.4298 3.17369 21.1196 3.47601C21.4596 3.625 21.4596 4.15339 21.1196 4.30236C20.4298 4.60465 19.5717 5.03563 19.1407 5.46664C18.7124 5.89499 18.284 6.78862 17.982 7.51582C17.8366 7.86581 17.2899 7.86581 17.1444 7.51582C16.8425 6.78862 16.414 5.89499 15.9858 5.46664C15.5573 5.03828 14.6637 4.60994 13.9365 4.30793C13.5866 4.16258 13.5866 3.6158 13.9365 3.47043C14.6637 3.1684 15.5573 2.74003 15.9858 2.31168C16.414 1.88332 16.8425 0.989689 17.1444 0.262494Z'
                        fill='#EE7103'
                      />
                      <path
                        d='M1.87721 2.35873C2.03587 2.01454 2.59284 2.01454 2.7515 2.35873C2.93163 2.74948 3.14883 3.14609 3.36602 3.36327C3.58609 3.58336 3.97325 3.80343 4.34905 3.98497C4.68327 4.14642 4.68327 4.6835 4.34905 4.84494C3.97323 5.02645 3.58609 5.24653 3.36602 5.4666C3.14883 5.68378 2.93163 6.08039 2.7515 6.47114C2.59284 6.81533 2.03587 6.81533 1.87721 6.47114C1.69706 6.08039 1.47988 5.68378 1.26269 5.4666C1.04551 5.24941 0.648902 5.03223 0.258148 4.8521C-0.0860388 4.69344 -0.0860546 4.13647 0.258132 3.9778C0.648886 3.79766 1.04551 3.58046 1.26269 3.36327C1.47988 3.14609 1.69706 2.74948 1.87721 2.35873Z'
                        fill='#EE7103'
                      />
                    </svg>
                    <h5 className={`text-white font-inter text-2xl font-semibold leading-5 mr-8`}>
                      {'Scan Results  (Demo Data)'}
                    </h5>
                  </div>
                  <div className='flex justify-between mt-[4px]'>
                    <div>
                      <p className='text-gray-400 text-sm'>SYSTEMS SCANNED</p>
                      <p className='text-white font-bold text-sm'>{7}</p>
                    </div>
                    <div>
                      <p className='text-gray-400 text-sm'>INFECTED SYSTEMS</p>
                      <p className='text-white font-bold text-sm'>{2}</p>
                    </div>
                    <div>
                      <p className='text-gray-400 text-sm'>HIGH RISK SYSTEMS</p>
                      <p className='text-white font-bold text-sm'>{2}</p>
                    </div>
                  </div>
                </div>
                <div className='w-full h-[661px] border border-[#32435A] bg-gray-900 p-8'>
                  <h5 className={`text-white font-inter text-2xl font-semibold leading-5`}>
                    {'Infected Systems'}
                  </h5>
                  <br />
                  <div className='bg-gray-900 text-white  rounded-lg w-full max-w-lg'>
                    <div className='mb-2 text-[#C2C8D3]'>
                      <span className='font-bold '>System Name: </span>Finance-Server-01
                    </div>
                    <div className='mb-2 text-[#C2C8D3]'>
                      <span className='font-bold'>User: </span>Admin_Finance
                    </div>
                    <div className='mb-2 text-[#C2C8D3]'>
                      <span className='font-bold'>IP Address: </span>192.168.3.24
                    </div>
                    <div className='mb-2 text-[#C2C8D3]'>
                      <span className='font-bold'>Detection: </span>Hidden scheduled task linked to
                      Tarrask
                    </div>
                    <div className='mb-2 '>
                      <span className='font-bold text-[#C2C8D3]'>Severity: </span>
                      <span className='text-red-500 font-bold'>Critical</span>
                    </div>
                    <div className='text-[#C2C8D3] '>
                      <span className='font-bold '>Recommendation: </span>Isolate system and perform
                      a full incident response
                    </div>
                  </div>{' '}
                  <br />
                  <br />
                  <div className='bg-gray-900 text-white  rounded-lg w-full max-w-lg'>
                    <div className='mb-2 text-[#C2C8D3]'>
                      <span className='font-bold'>System Name: </span>Finance-Server-01
                    </div>
                    <div className='mb-2 text-[#C2C8D3]'>
                      <span className='font-bold'>User: </span>Admin_Finance
                    </div>
                    <div className='mb-2 text-[#C2C8D3]'>
                      <span className='font-bold'>IP Address: </span>192.168.3.24
                    </div>
                    <div className='mb-2 text-[#C2C8D3]'>
                      <span className='font-bold'>Detection: </span>Hidden scheduled task linked to
                      Tarrask
                    </div>
                    <div className='mb-2'>
                      <span className='font-bold text-[#C2C8D3]'>Severity: </span>
                      <span className='text-[#EE7103] font-bold '>High</span>
                    </div>
                    <div>
                      <span className='font-bold text-[#C2C8D3]'>Recommendation: </span>Isolate
                      system and perform a full incident response
                    </div>
                  </div>{' '}
                  <br />
                  <br />
                  <div className='bg-gray-900 text-white  rounded-lg w-full max-w-lg'>
                    <div className='mb-2 text-[#C2C8D3]'>
                      <span className='font-bold'>System Name: </span>Finance-Server-01
                    </div>
                    <div className='mb-2 text-[#C2C8D3]'>
                      <span className='font-bold'>User: </span>Admin_Finance
                    </div>
                    <div className='mb-2 text-[#C2C8D3]'>
                      <span className='font-bold'>IP Address: </span>192.168.3.24
                    </div>
                    <div className='mb-2 text-[#C2C8D3]'>
                      <span className='font-bold'>Detection: </span>Hidden scheduled task linked to
                      Tarrask
                    </div>
                    <div className='mb-2 text-[#C2C8D3]'>
                      <span className='font-bold text-[#C2C8D3]'>Severity: </span>
                      <span className='text-[#F9E60E] font-bold'>Critical</span>
                    </div>
                    <div>
                      <span className='font-bold'>Recommendation: </span>Isolate system and perform
                      a full incident response
                    </div>
                  </div>
                </div>
                <div className='w-full  p-8'>
                  <h5 className={`text-white font-inter text-2xl font-semibold leading-5`}>
                    {'Key IOCs'}
                  </h5>
                  <br />
                  <div className='text-white  rounded-lg w-full max-w-lg'>
                    <div className='mb-2 text-[#C2C8D3]'>
                      <span className='font-bold'>Hidden scheduled tasks under: </span>
                      ‘Microsoft\Windows\Task Scheduler’
                    </div>
                    <div className='mb-2 text-[#C2C8D3]'>
                      <span className='font-bold'>Modified Registry Keys: </span>
                      ‘HKLM\Software\Microsoft\WindowsNT\CurrentVersion\Schedule\TaskCache\Tree’
                    </div>
                    <div className='mb-2 text-[#C2C8D3]'>
                      <span className='font-bold'>
                        Abnormal network traffic from infected hosts to known command-and-control
                        servers
                      </span>
                    </div>
                  </div>{' '}
                  <br />
                  <h5 className={`text-white font-inter text-2xl font-semibold leading-5`}>
                    {'Next Steps'}
                  </h5>{' '}
                  <br />
                  <div className='text-white  rounded-lg w-full max-w-lg'>
                    <div className='mb-2 text-[#C2C8D3]'>
                      <span className='font-bold'>Quarantine: </span>Quarantine high-risk systems
                      immediately
                    </div>
                    <div className='mb-2 text-[#C2C8D3]'>
                      <span className='font-bold'>Mitigation: </span>Remove malicious tasks, restore
                      registry changes, and apply patches
                    </div>
                    <div className='mb-2 text-[#C2C8D3]'>
                      <span className='font-bold'>Monitoring: </span>Enable continuous monitoring
                      for recurring threats and schedule frequent scans using this detection rule
                    </div>
                  </div>
                </div>
              </div>

              {/* C a rd 2 */}
              <div className='w-full h-[1261px] flex-shrink-0 rounded-md border border-[#3E4B5D] bg-[#32435A]'>
                <div className='p-6'>
                  <div className={`mt-4 w-[350px] ${'flex justify-between relative'}`}>
                    <h5 className={`text-white font-inter text-2xl font-semibold leading-5 mr-8`}>
                      {'Query Results'}
                    </h5>
                  </div>
                </div>

                <div
                  style={{
                    height: '1061px',
                    width: '100%',
                    textAlign: 'left',
                    overflowY: 'scroll',
                    backgroundColor: '#0C111D',
                    borderRadius: '8px',
                    marginTop: 43,
                  }}
                >
                  <YamlEditor ymltext={row?.singlequery} modeOfView={'result'} />
                </div>
              </div>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

const TableWithAccordion = ({ tablelist }: any) => {
  const { id } = useParams()
  return (
    <TableContainer sx={{ borderRadius: '8px' }}>
      <Table sx={{ width: '100%' }}>
        <TableHead sx={{ background: '#32435A' }}>
          <TableRow>
            <TableCell colSpan={1} sx={{ color: '#fff', padding: '16px', width: '5%' }}></TableCell>
            <TableCell sx={{ color: '#fff', padding: '16px', width: '5%' }}>PLATFORM</TableCell>

            <TableCell colSpan={1} sx={{ color: '#fff', padding: '16px', width: '10%' }}>
              Execution Date
            </TableCell>
            <TableCell colSpan={1} sx={{ color: '#fff', padding: '16px', width: '10%' }}>
              STATUS
            </TableCell>
            <TableCell colSpan={1} sx={{ color: '#fff', padding: '16px', width: '10%' }}>
              Records Found
            </TableCell>
            <TableCell colSpan={1} sx={{ color: '#fff', padding: '16px', width: '10%' }}>
              Infected Systems
            </TableCell>
            <TableCell colSpan={1} sx={{ color: '#fff', padding: '16px', width: '15%' }}>
              Key IOCs
            </TableCell>
            <TableCell colSpan={1} sx={{ color: '#fff', padding: '16px', width: '5%' }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tablelist
            .filter((item: any) => {
              return item?.id === id
            })
            .map((row: any) => (
              <CollapsibleTableRow key={row.platform} row={row} />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableWithAccordion
