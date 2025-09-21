import React, { useState } from 'react'
import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useDispatch } from 'react-redux'
import { inspectCtiSectionId } from '../../redux/nodes/Inspects/action'

function InspectSectionView({ setInspectView, ctiSectionId, inspectPage }: any) {
  const dispatch = useDispatch()
  const [selectedCtiSection, setSelectedCtiSection] = useState<string>('')
  const [contentSection, setContentSection] = useState<any>('')
  const [showPopover, setShowPopover] = useState(false)
  const [disable, setDisable] = useState(true)

  const handleChange = (event: SelectChangeEvent) => {
    setDisable(false)
    setSelectedCtiSection(event.target.value)
    dispatch(inspectCtiSectionId(event.target.value) as any)
      .then((res: any) => {
        if (res.type == 'INSPECT_CTI_SECTION_SUCCESS') {
          setContentSection(res?.payload)
        }
      })
      .catch((err: any) => {})
  }
  const MemoizedMarkdown = React.memo(({ content }: any) => (
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
        code({ inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter
              style={darcula}
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
      {content}
    </ReactMarkdown>
  ))

  const handleCopy = () => {
    let text: any = <MemoizedMarkdown content={contentSection?.content} />
    const code = `
        id: ${contentSection?.id}
        cti_id: ${contentSection?.ctiId}
       cti_url: ${contentSection?.ctiUrl}
        section_num: ${contentSection?.sectionNum}

        
        Content:${text?.props?.content}
       
        `

    navigator.clipboard
      .writeText(code)
      .then(() => {
        setShowPopover(true)
        setTimeout(() => {
          setShowPopover(false)
        }, 2000)
      })
      .catch((err) => {
        alert('Failed to copy code.')
        console.error('Error copying text: ', err)
      })
  }

  return (
    <div className='backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
      <div className='relative w-full h-full p-[32px] mx-auto'>
        <div className='p-[20px] border-0 rounded-lg shadow-lg h-full relative flex flex-col bg-[#1D2939] outline-none focus:outline-none'>
          <div className='grid grid-cols-3 max-md:grid-cols-2 gap-4 justify-items-center m-1 p-2 pb-0 mb-0'>
            <div className='max-md:hidden'></div>
            <div className='text-white text-2xl font-bold max-md:text-xl max-md:flex w-full text-center'>Inspect</div>
            <div className='w-full flex justify-end mr-[0.5rem] items-center'>
              <div className='flex justify-between'>
                <>
                  <div className='text-white h-[28px]  px-4 rounded-full inline-block border border-2 border-white mt-0 mr-8'>
                    {`${ctiSectionId?.length} Sections Found`}
                  </div>
                  <div className='relative'>
                    <button
                      type='button'
                      className='mt-0 pr-4'
                      onClick={handleCopy}
                      disabled={disable}
                    >
                      <span className=' mr-3'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='26'
                          height='26'
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
                      <div className='absolute  p-1 bg-white text-black rounded shadow z-10 mt-[-20px]'>
                        Copied!
                      </div>
                    )}
                  </div>
                </>
                <button
                  className='px-1 mb-[23px] ml-auto bg-transparent text-dark border-0 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
                  onClick={() => {
                    setInspectView(false)
                  }}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='26'
                    height='26'
                    viewBox='0 0 24 24'
                    fill='#fff'
                  >
                    <path
                      d='M18 6L6 18M6 6L18 18'
                      stroke={'#fff'}
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className='relative px-6 mt-[-20px]'>
            <label htmlFor='' className='text-lg text-[#fff]'>
              Select the CTI section
            </label>

            {inspectPage == 'VaultPermission' ? (
              <Select
                value={selectedCtiSection}
                onChange={handleChange}
                displayEmpty
                sx={{
                  display: 'flex',
                  height: '36px',
                  width: '100%',
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  background: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  outline: 'none',
                  '& fieldset': {
                    border: 'none',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200, // Set the maximum height for the menu
                      width: 'auto',
                    },
                  },
                }}
              >
                <MenuItem value='' disabled>
                  Select cti section ids
                </MenuItem>
                {ctiSectionId?.map((item: any) => (
                  <MenuItem key={item.ctiSection} value={item.ctiSection}>
                    {item.ctiSection}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <Select
                value={selectedCtiSection}
                onChange={handleChange}
                displayEmpty
                sx={{
                  display: 'flex',
                  height: '36px',
                  width: '100%',
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  background: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  outline: 'none',
                  '& fieldset': {
                    border: 'none',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200, // Set the maximum height for the menu
                      width: 'auto',
                    },
                  },
                }}
              >
                <MenuItem value='' disabled>
                  Select cti section ids
                </MenuItem>
                {ctiSectionId?.map((item: any) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.id}
                  </MenuItem>
                ))}
              </Select>
            )}
          </div>
          <div className='flex pb-6 justify-center gap-4 items-center  max-md:flex-col'>
            <div
              style={{
                height: '100%',
                width: '100%',
                textAlign: 'left',
                overflowY: 'scroll',
                backgroundColor: '#0C111D',
                borderRadius: '1rem',
              }}
            >
              <div className='prose'>
                {contentSection && (
                  <div>
                    <div>id: {contentSection?.id}</div>
                    <div>cti_id: {contentSection?.ctiId}</div>
                    <div>cti_url: {contentSection?.ctiUrl}</div>
                    <div>section_num: {contentSection?.sectionNum}</div>
                    <br />
                    <div style={{ display: 'flex' }}>
                      <div>content:</div>{' '}
                      <div>
                        {' '}
                        <MemoizedMarkdown content={contentSection?.content} />{' '}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InspectSectionView
