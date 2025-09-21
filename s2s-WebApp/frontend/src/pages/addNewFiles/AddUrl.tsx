import styled from '@emotion/styled'
import { Tooltip, TooltipProps, tooltipClasses } from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { dataingestionUrl } from '../../redux/nodes/datavault/action'
import { addCtiWhitelist, qualifiedUrls } from '../../redux/nodes/repository/action'
import local from '../../utils/local'
import { Buffer } from 'buffer'
import { useData } from '../../layouts/shared/DataProvider'

const AddUrl = () => {
  let {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm()
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showUrlError, setShowUrlError] = useState(false)

  const [formData, setFormData] = useState({
    ctiName: '',
    url: '',
  })

  const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(() => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: '#fff',
    },
    [`& .${tooltipClasses.tooltip}`]: {
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.6)',
      backgroundColor: '#fff',
      color: '#000',
    },
  }))

  const [honourWhitelist, setHonourWhitelist] = useState(null as any)
  const [urlDomains, seturlDomines] = useState([] as any)
  const { ctiReportFiles } = useSelector((state: any) => state.datactiReportreducer)

  useEffect(() => {
    const localStor: any = local.getItem('bearerToken')
    const tokens = JSON.parse(localStor as any)
    const bearerToken = tokens.bearerToken
    const [tokenType, token] = bearerToken.split(' ')
    let Whitelist = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString())
    setHonourWhitelist(Whitelist.honourWhitelist)
    dispatch(qualifiedUrls() as any).then((response: any) => {
      seturlDomines(response.payload)
    })
  }, [])

  const onSubmitURL = (e: any) => {
    const url = e?.url
    const urlParts = url?.split('/')
    let name = urlParts[urlParts?.length - 1]
      ? urlParts[urlParts?.length - 1]
      : urlParts[urlParts?.length - 2]
      ? urlParts[urlParts?.length - 2]
      : urlParts[urlParts?.length - 3]
    let urlNameValue: any = name?.split('.')[0]
    e.ctiName = urlNameValue
    if (e.url) {
      if (!honourWhitelist) {
        let files: any = ctiReportFiles?.filter((item: any) => {
          return e.url == item.url
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
          const demourl: any = encodeURIComponent(e.url)
          e.url = demourl
          dispatch(dataingestionUrl({ e, id }) as any)
            .then((data: any) => {
              if (data.type == 'DATAVAULT_DATAINGESTIONURL_SUCCESS') {
                reset()
                navigate(`/app/Repository/${id}`)
              }
            })
            .catch((err: any) => {
              console.log(err)
            })
        }
      } else {
        const url = new URL(e.url)
        let hostname = new URL(url).hostname.replace(/^www\./, '')
        let baseurls = urlDomains?.find((x: any) => x.baseUrl == hostname)
        if (baseurls) {
          let files: any = ctiReportFiles?.filter((item: any) => {
            return e.url == item.url
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
                  reset()
                  navigate(`/app/Repository/${id}`)
                }
              })
              .catch((err: any) => {
                console.log(err)
              })
          }
        } else {
          let object = {
            baseUrl: hostname,
          }
          dispatch(addCtiWhitelist(object) as any).then((response: any) => {})
        }
      }
    }
  }

  const { setSaveData }: any = useData()

  useEffect(() => {
    setSaveData({ from: 'addUrl', value: { formValue: formData } })
  }, [formData.url, formData.ctiName])

  return (
    <div className='p-[32px] h-[75vh]'>
      <form onSubmit={handleSubmit(onSubmitURL)} noValidate>
        <div className='mt-1 p-[20px]'>
          <div className='mt-2 relative'>
            <p className='text-white font-inter font-medium text-sm leading-5'>URL</p>
            <div className='mt-1'>
              <input
                type='text'
                id='url'
                placeholder='Add URL'
                className='bg-gray-50 border  pt-2 border-2 border-white-300 text-gray-900 text-sm
                              rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '
                style={{ fontSize: '16px' }}
                {...register('url', {
                  required: 'url is required',
                  pattern: {
                    value: /^(https:\/\/)/i,
                    message: 'URL must start with https://',
                  },
                  onChange: (e: any) => {
                    setFormData((prevValue: any) => {
                      return { ...prevValue, url: e.target.value }
                    })
                  },
                })}
              />
            </div>
            {errors?.url?.message && showUrlError && (
              <div className='absolute top-[3.5rem] left-[95px]'>
                <BootstrapTooltip
                  title={'URL must start with https://'}
                  arrow
                  placement='bottom'
                  open={true}
                >
                  <span></span>
                </BootstrapTooltip>
              </div>
            )}
          </div>
        </div>
        <div>
          <button
            id='urlSubmit'
            className='text-white bg-[#green] hidden'
            type='submit'
            onClick={() => {
              if ((!errors.ctiName && errors.url) || !isDirty || isDirty) {
                setShowUrlError(true)
                setTimeout(() => {
                  setShowUrlError(false)
                }, 3000)
              } else setShowUrlError(false)
            }}
          >
            save
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddUrl
