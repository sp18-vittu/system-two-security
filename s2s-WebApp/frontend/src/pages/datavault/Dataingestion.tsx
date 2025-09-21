import ClearIcon from '@mui/icons-material/Clear'
import Axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { dataIngestion, dataingestionUrl } from '../../redux/nodes/datavault/action'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import local from '../../utils/local'

const DataIngestion = () => {
  const navigateTo = useNavigate()
  const { id } = useParams()
  const [showModal, setShowModal] = useState(false)
  const [showsubModal, setShowsubModal] = useState(false)
  const [img, setImg] = useState([] as any)
  const [mouseEnter, setmouseEnter] = useState(false)
  const file: any = []
  const inputRef = useRef<any>(null)
  const [files, setFiles] = useState<any>([])
  const dispatch = useDispatch()
  const [fileList, setFileList] = useState(null)
  const roleDto = local.getItem('auth')
  const role = JSON.parse(roleDto as any)
  const roleDescription = role?.user?.user
  const getroleName = roleDescription?.roleDTO
  const { state } = useLocation()

  let dataName: any = JSON.parse(sessionStorage.getItem('RepostoryData') || '{}')
  let fileName: any = []
  if (dataName?.length > 0) {
    dataName.map((item: any) => {
      fileName.push(item.name)
    })
  }

  const usernavigate = () => {
    navigateTo(`/app/VaultPermission/${id}`, { state: [{ checked: state[0].checked }] })
  }

  const navigate = () => {
    navigateTo(`/app/Repository/${id}`, { state: [{ checked: state[0].checked }] })
  }

  let {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  let {
    register: register1,
    handleSubmit: handleSubmit1,
    reset: reset1,
    formState: { errors: error },
  } = useForm()

  useEffect(() => {
    getData()
    if (file.length > 0) {
      document.getElementById('input_focus')?.classList.remove('border-slate-950')
    }
  }, [file])

  useEffect(() => {
    if (error.filetitle || files.length > 0) {
      document.getElementById('input_focus')?.classList.remove('border-slate-950')
    }
  }, [error.filetitle?.message, files])

  let uploadstatus: any = []
  const Uploadfiles = fileList ? [...fileList] : []
  Uploadfiles.forEach((file: any) => {
    uploadstatus.push(file)
  })

  const repository = (event: any) => {
    if (files.length > 0) {
      let documentdata: any = []
      const data = new FormData()
      data.append('datavaultId', id as any)
      Uploadfiles.forEach((file: any, index: any) => {
        let files: any = fileName.filter((item: any) => {
          return file.name == item
        })
        if (files?.length > 0) {
          Swal.fire({
            position: 'center',
            color: '#000',
            icon: 'warning',
            title: 'This File is Already Exists',
            width: 400,
            timer: 2000,
            showConfirmButton: false,
          })
        } else {
          data.append('files', file)
          documentdata.push({
            id: index + 1,
            name: file.name,
            type: file.name.split('.').pop().toUpperCase(),
            status: true,
            accessType: 'WRITE',
            documentSize: file.size,
          })
        }
      })
      const repotIds = {
        datavaultId: id,
        ctiId: 0,
      }

      dispatch(dataIngestion(data, repotIds) as any)
        .then((datas: any) => {
          if (datas.type == 'CREATE_NEW_DATAINGESTION_SUCCESS') {
            navigateTo(`/app/VaultPermission/${id}`, {
              state: [{ checked: state[0].checked }],
            })
          }
        })
        .catch((error: any) => {
          console.log('error', error)
        })
      sessionStorage.setItem('uploaddetails', JSON.stringify(documentdata))
    }
    if (files.length == 0 && !error.filetitle) {
      document.getElementById('input_focus')?.classList.add('border-slate-950')
    }
  }
  const getData = () => {
    Axios.get('../../../assets/dataIngestionUpload.json').then((response) => {
      setImg(response.data)
    })
  }
  const onSubmit = (e: any) => {
    let files: any = fileName.filter((item: any) => {
      return e.url == item
    })
    if (files?.length > 0) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'This Website Already Exists',
        color: '#000',
        width: 400,
        timer: 2000,
        showConfirmButton: false,
      })
    } else {
      dispatch(dataingestionUrl({ e, id }) as any)
        .then((data: any) => {
          if (data.type == 'DATAVAULT_DATAINGESTIONURL_SUCCESS') {
            setShowsubModal(false)
            reset()
            navigateTo(`/app/Repository/${id}`)
          }
        })
        .catch((err: any) => {
          console.log(err)
        })
    }
  }

  const clearError = () => {
    setShowsubModal(false)
    errors.weburl = {}
    reset()
  }
  const closeModal = () => {
    setShowModal(false)
    reset1()
    setFiles([])
  }
  function handleChange(e: any) {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      setFileList(e.target.files)
      for (let i = 0; i < e.target.files['length']; i++) {
        let arr: any = []
        img.map((image: any) => {
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

  function handleDrop(e: any) {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileList(e.dataTransfer.files)
      for (let i = 0; i < e.dataTransfer.files['length']; i++) {
        let arr: any = []
        img.map((image: any) => {
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
  function removeFile(fileName: any, idx: any) {
    const newArr = [...files]
    newArr.splice(idx, 1)
    setFiles([])
    setFiles(newArr)
  }

  return (
    <div>
      <div className='bg-[#0C111D] focus:bg-white h-72'>
        <nav className=' bg-[#0C111D] focus:bg-white flex-no-wrap relative flex w-full items-center justify-between py-2 shadow-md shadow-black/5 lg:flex-wrap lg:justify-start lg:py-4'>
          <div className='bg-[#0C111D] flex w-full flex-wrap items-center justify-between px-2'>
            <div
              className='!visible hidden flex-grow mt-2 basis-[100%] items-center lg:!flex lg:basis-auto'
              id='navbarSupportedContent1'
              data-te-collapse-item
            >
              <ul
                className='list-style-none mr-auto flex flex-col pl-0 lg:flex-row'
                data-te-navbar-nav-ref
              >
                <li className='mb-4 lg:mb-0 lg:pr-2' data-te-nav-item-ref>
                  <a
                    className='cursor-pointer text-[#667085]  underline-offset-8 transition duration-200 lg:px-2 font-semibold text-sm leading-5 blueGray-500 transition duration-200 lg:px-2'
                    onClick={navigate}
                    data-te-nav-link-ref
                  >
                    CTI Reports
                  </a>
                </li>
                {getroleName?.roleName !== 'USER' && (
                  <li className='mb-4 lg:mb-0 lg:pr-2 ' data-te-nav-item-ref>
                    <a
                      className='cursor-pointer text-[#667085]  underline-offset-8 transition duration-200 lg:px-2 font-semibold text-sm leading-5 blueGray-500 transition duration-200 lg:px-2'
                      onClick={usernavigate}
                      data-te-nav-link-ref
                    >
                      Sigma Files
                    </a>
                  </li>
                )}
                <li className='mb-4 lg:mb-0 lg:pr-2' data-te-nav-item-ref>
                  <a
                    className='cursor-pointer text-white  font-semibold text-sm leading-5 underline underline-offset-8 transition duration-200  disabled:text-black/30 motion-reduce:transition-none lg:px-2 [&.active]: '
                    data-te-nav-link-ref
                  >
                    Data Ingestion
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className='flex bg-[#1D2939] h-auto inline mx-5  mt-6 block rounded-xl text-left shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]'>
          <div className='p-6 flex rounded-xl inline bg-[#1D2939]'>
            <p className='sm:flex-wrap text-base text-neutral-600 text-white  text-sm leading-5'>
              Generate Sigma files utilizing the CTI report. Please add the URL of your CTI report.
            </p>
            <button
              className='-mt-1  hover:bg-[#6941c6] hover:text-white lg:absolute md:absolute right-9 bg-[#fff] ml-auto h-8 w-20  text-sm  border font-bold py-2 px-4 rounded-lg inline-flex items-center'
              onClick={() => setShowsubModal(true)}
            >
              <span className='text-sm text-gray'>Add</span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='w-7 h-7 pl-2'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M12 6v12m6-6H6' />
              </svg>
            </button>
            {showsubModal ? (
              <>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className=' backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
                    <div className='relative my-6 w-2/6'>
                      <div className='border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none'>
                        <div className='items-start justify-between  border-solid border-slate-200 rounded-t'>
                          <h6 className='text-1xl font-semibold justify-center items-center text-center mt-3'>
                            Add CTI Reports
                          </h6>
                        </div>
                        <div className='relative p-5 flex-auto'>
                          <input
                            type='text'
                            id='ctiName'
                            className='placeholder:text-base  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                            placeholder=' Add CTI Reports Title '
                            {...register('ctiName', {
                              required: 'ctiName is required',
                            })}
                          />
                        </div>

                        <div className='relative p-5 flex-auto'>
                          <input
                            type='url'
                            id='url'
                            className='placeholder:text-base bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                            placeholder='Add CTI URL'
                            {...register('url', {
                              required: 'url is required',
                              pattern: {
                                value:
                                  /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g,
                                message: 'Invalid URL',
                              },
                            })}
                          />
                        </div>
                        <div className='grid gap-4 grid-cols-2  p-2'>
                          <button
                            className='ml-2 w-full h-10 rounded-lg gap-2 class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'
                            type='button'
                            onClick={clearError}
                          >
                            Cancel
                          </button>
                          <button
                            className='w-full h-10 bg-[#EE7103] text-white active:bg-[#EE7103] font-bold text-sm px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none'
                            type='submit'
                          >
                            Add Resource
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
              </>
            ) : null}
          </div>
        </div>
        <div className='flex bg-[#1D2939] mx-5 h-auto  mt-7 rounded-xl text-left shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]'>
          <div className='p-6 flex rounded-xl flex-row bg-[#1D2939]'>
            <p className='text-base text-neutral-600 text-sm leading-5 text-white'>
              Upload Sigma files to your vault using the file uploader.
            </p>
            <button
              onMouseOver={() => setmouseEnter(true)}
              onMouseOut={() => setmouseEnter(false)}
              type='button'
              className='-mt-1 hover:bg-[#6941c6]  hover:text-white text-gray-900 lg:absolute md:absolute bg-[#FFFFFF] right-9 ml-auto h-8 w-24 text-sm  border  font-bold py-2 px-4 rounded-lg inline-flex items-center'
              onClick={() => setShowModal(true)}
            >
              <span className='text-sm '>Upload</span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                // stroke='currentColor'
                stroke={mouseEnter ? 'white' : 'currentColor'}
                className='h-5 w-5 pl-2 text-gray-900'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'
                />
              </svg>
            </button>

            {showModal ? (
              <>
                <form onSubmit={handleSubmit1(repository)}>
                  <div className='justify-center backdrop-blur-sm items-center flex  overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
                    <div className='relative w-6/12 my-6  mx-auto max-w-xl'>
                      <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                        <div
                          className=' p-3 border-solid border-slate-200 rounded-t'
                          style={{ textAlign: 'center' }}
                        >
                          <h6 className='text-lg text-gray-900 font-semibold'>Add Sigma Files</h6>
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
                                  accept='.yml,.yaml'
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
                                  <span className='font-semibold text-[#000]'>Click to upload</span>{' '}
                                  or drag and drop
                                </p>
                                <p className='text-xs text-gray-500'>
                                  You can only upload YAML files
                                </p>
                              </label>
                              <div className='flex flex-wrap w-full max-h-64 p-5 overflow-y-auto overflow-x-hidden'>
                                {files.map((file: any, idx: any) => (
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
                            // onClick={repository}
                          >
                            Add Resources
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataIngestion
