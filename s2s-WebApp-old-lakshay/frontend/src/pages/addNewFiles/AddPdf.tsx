import { useEffect, useState } from 'react'
import ClearIcon from '@mui/icons-material/Clear'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { datavalutPdfUpload } from '../../redux/nodes/datavault/action'
import { repositoryDocList } from '../../redux/nodes/repository/action'
import local from '../../utils/local'
import { useData } from '../../layouts/shared/DataProvider'

const AddPdf = () => {
  const { setSaveData }: any = useData()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id: paramsId }: any = useParams()
  const [files, setFiles] = useState<any>([])
  const [img, setImg] = useState([] as any)
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm()

  const localToken = local.getItem('bearerToken')
  const token = JSON.parse(localToken as any)

  const [finalFiles, setFinalFiles] = useState([] as any)

  function removeDuplicates(array: any[]) {
    setFinalFiles([])
    setFinalFiles(array)
    setSaveData({ from: 'addPDf', value: { formValue: array } })
  }

  const getData = () => {
    const getjson: any = [
      {
        name: 'pdf',
        path: "<svg><path d='M7.75 4C7.75 2.20508 9.20508 0.75 11 0.75H27C27.1212 0.75 27.2375 0.798159 27.3232 0.883885L38.1161 11.6768C38.2018 11.7625 38.25 11.8788 38.25 12V36C38.25 37.7949 36.7949 39.25 35 39.25H11C9.20507 39.25 7.75 37.7949 7.75 36V4Z' fill='white' stroke='#D0D5DD' strokeWidth='1.5'/> <rect x='1' y='18' width='26' height='16' rx='2' fill='#D92D20' /> <path d='M27 0.5V8C27 10.2091 28.7909 12 31 12H38.5' stroke='#D0D5DD' strokeWidth='1.5'/> <path d='M4.8323 30V22.7273H7.70162C8.25323 22.7273 8.72316 22.8326 9.11142 23.0433C9.49967 23.2517 9.7956 23.5417 9.9992 23.9134C10.2052 24.2827 10.3082 24.7088 10.3082 25.1918C10.3082 25.6747 10.204 26.1009 9.99565 26.4702C9.78732 26.8395 9.48547 27.1271 9.09011 27.3331C8.69712 27.5391 8.22127 27.642 7.66255 27.642H5.83372V26.4098H7.41397C7.7099 26.4098 7.95375 26.3589 8.14551 26.2571C8.33964 26.1529 8.48405 26.0097 8.57875 25.8274C8.67581 25.6428 8.72434 25.4309 8.72434 25.1918C8.72434 24.9503 8.67581 24.7396 8.57875 24.5597C8.48405 24.3774 8.33964 24.2365 8.14551 24.1371C7.95138 24.0353 7.70517 23.9844 7.40687 23.9844H6.36994V30H4.8323ZM13.885 30H11.3069V22.7273H13.9063C14.6379 22.7273 15.2676 22.8729 15.7955 23.1641C16.3235 23.4529 16.7295 23.8684 17.0136 24.4105C17.3 24.9527 17.4433 25.6013 17.4433 26.3565C17.4433 27.1141 17.3 27.7652 17.0136 28.3097C16.7295 28.8542 16.3211 29.272 15.7884 29.5632C15.2581 29.8544 14.6237 30 13.885 30ZM12.8445 28.6825H13.8211C14.2757 28.6825 14.658 28.602 14.9681 28.4411C15.2806 28.2777 15.515 28.0256 15.6713 27.6847C15.8299 27.3414 15.9092 26.8987 15.9092 26.3565C15.9092 25.8191 15.8299 25.38 15.6713 25.0391C15.515 24.6982 15.2818 24.4472 14.9717 24.2862C14.6615 24.1252 14.2792 24.0447 13.8247 24.0447H12.8445V28.6825ZM18.5823 30V22.7273H23.3976V23.995H20.1199V25.728H23.078V26.9957H20.1199V30H18.5823Z' fill='white'/></svg>",
      },
    ]
    setImg(getjson)
  }

  const [chooseFile, setChooseFile] = useState(false)

  const vault = sessionStorage.getItem('vault')
  const selectedVault = JSON.parse(vault as any)

  useEffect(() => {
    if (files?.length == 0) {
      getData()
      dispatch(repositoryDocList(token, selectedVault) as any)
        .then((res: any) => {})
        .catch((err: any) => console.log('err', err))
    } else if (files?.length > 0) {
      removeDuplicates(files)
      setChooseFile(false)
    }
  }, [files && files.length])

  function handleChange(e: any) {
    e.preventDefault()
    setFiles([])
    if (e?.target?.files && e?.target?.files[0]) {
      for (let i = 0; i < e?.target?.files['length']; i++) {
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
        setValue('pdfName', arr[0]?.fileName?.name)
        removeDuplicates(arr)
        setFiles(arr)
      }
    }
  }

  function handleDrop(e: any) {
    e.preventDefault()
    e.stopPropagation()
    setFiles([])
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
        setValue('pdfName', arr[0]?.fileName?.name)
        removeDuplicates(arr)
        setFiles(arr)
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
    const newArr = [...finalFiles]
    newArr.splice(idx, 1)
    setFinalFiles([])
    setFinalFiles(newArr)
    setSaveData({ from: 'addPDf', value: { formValue: newArr } })
  }

  let dataName: any = JSON.parse(sessionStorage.getItem('RepostoryData') || '{}')
  let fileName: any = []
  if (dataName?.length > 0) {
    dataName?.map((item: any) => {
      fileName.push(item.name)
    })
  }

  const styles = () => {
    const obj = {
      outline: '3px solid black',
      outlineOffset: '-5px',
    }
    if (chooseFile) return obj
    else return {}
  }

  const onSubmit = (submitData: any) => {
    if (finalFiles.length > 0) {
      let objects = {
        datavaultId: paramsId,
        ctiName: finalFiles[0].fileName.name,
      }
      const data = new FormData()
      data.append('pdf-file', finalFiles[0].fileName as any)
      dispatch(datavalutPdfUpload(objects, data) as any).then((res: any) => {
        if (res.type == 'PDF_UPLOAD_SUCCESS') {
          navigate(`/app/Repository/${paramsId}`)
          setFinalFiles([])
          reset()
        }
      })
    } else setChooseFile(true)
  }

  return (
    <div>
      <div className='p-[32px]'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          onDragEnter={handleDragEnter}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
        >
          <div>
            <p className='text-white font-inter font-medium text-sm leading-5'>PDF</p>
          </div>
          <div>
            <label
              htmlFor='dropzone-file'
              className={`flex flex-col items-center justify-center w-full h-[126px] border-2 box-border mt-2 border-white-300 border-[#000] bg-[#fff] border-solid rounded-lg cursor-pointer bg-[#fff] hover:bg-white-100 `}
              style={styles()}
            >
              <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                <svg
                  className='w-8 h-8 mb-4 text-gray-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 20 16'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                  />
                </svg>
                <p className='mb-2 text-sm text-gray-500'>
                  <span className='font-semibold'>Click to upload</span> or drag and drop
                </p>
                <p className='text-xs text-[#475467]'>PDF (max 5mb)</p>
              </div>
              <input
                id='dropzone-file'
                type='file'
                multiple={false}
                className='hidden'
                accept='.pdf'
                {...register('file')}
                onChange={handleChange}
              />
            </label>
            <div className='flex flex-wrap w-full max-h-64 p-5 overflow-y-auto overflow-x-hidden'>
              {finalFiles?.map((file: any, idx: any) => (
                <>
                  {file && (
                    <div key={idx} className=''>
                      <div className='relative'>
                        <div className='relative py-3 sm:max-w-xl sm:mx-auto'>
                          <div className='group cursor-pointer relative inline-block  w-28 text-center'>
                            <ClearIcon onClick={(e) => removeFile(file?.name, idx)} />
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 50 50'
                              strokeWidth='1.5'
                              stroke='currentColor'
                              className='w-12 h-12 mt-3 ml-10'
                              dangerouslySetInnerHTML={{ __html: file?.path }}
                            ></svg>
                            <div
                              className='opacity-0 w-full bg-black text-white text-center text-xs rounded-lg p-2 absolute z-100 group-hover:opacity-100 -left-[25%] -top-[30%] -mt-1.5 ml-10 px-3 pointer-events-none'
                              data-tooltip-placement='left'
                            >
                              {file?.fileName?.name}
                              <svg
                                className='absolute text-black w-full  h-2.5 right-2.5 top-full'
                                x='0px'
                                y='0px'
                                viewBox='0 0 255 255'
                              >
                                <polygon className='fill-current' points='0,0 127.5,127.5 255,0' />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
          <div>
            <button id='fileSubmit' type='submit' className='hidden'>
              submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddPdf
