import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { splunkGetId, splunkPost, splunkUpdate } from '../../redux/nodes/splunkform/action'
import { feedlyGet } from '../../redux/nodes/feedlyform/action'

const Splunkform = () => {
  const navigateTo = useNavigate()
  const dispatch = useDispatch()

  const [EditId, setEditId] = useState()
  useEffect(() => {
    dispatch(feedlyGet() as any)
  }, [])

  const location = useLocation()
  const [updateSplunk, setUpdateSplunk] = useState({} as any)

  useEffect(() => {
    if (location?.state && location?.state[0]?.splunk.id) {
      setUpdateSplunk(location?.state[0]?.splunk)
    }
    if (updateSplunk?.id) {
      dispatch(splunkGetId(updateSplunk?.id) as any).then((response: any) => {
        setEditId(response?.payload?.id)
        setValue('sourceName', response?.payload?.sourceName)
        setValue('description', response?.payload?.description)
        setValue('resttoken', response?.payload?.credentials?.restApiToken)
        setValue('restApiUrl', response?.payload?.credentials?.restApiUrl)
        setValue('defaultIndex', response?.payload?.connectionConfig[0]?.defaultIndex)
      })
    }
  }, [location?.state && location?.state[0]?.splunk?.id, updateSplunk])

  const onSubmit = (data: any) => {
    if (EditId) {
      let updateSplunk: any = {
        id: EditId,
        connectionConfig: [
          {
            processStatus: 'PROCESSING',
            defaultIndex: data?.defaultIndex,
          },
        ],
        credentials: {
          restApiUrl: data.restApiUrl,
          restApiToken: data.resttoken,
          hecUrl: data.sendendurl,
          hecToken: data.hecToken,
        },
        sourceName: data.sourceName,
        integrationSourceType: 'SIEM',
        description: data.description,
      }
      dispatch(splunkUpdate(EditId, updateSplunk) as any).then((response: any) => {
        if (response.type == 'UPDATE_SPLUNK_FORM_SUCCESS') {
          reset()
          navigateTo(`/app/feedyintegration`)
        }
      })
    } else {
      let addSplunk = {
        splunk: {
          connectionConfig: [
            {
              processStatus: 'PROCESSING',
              defaultIndex: data?.defaultIndex,
            },
          ],
          credentials: {
            restApiUrl: data.restApiUrl,
            restApiToken: data.resttoken,
            hecUrl: data.sendendurl,
            hecToken: data.hecToken,
          },
          sourceName: data.sourceName,
          integrationSourceType: 'SIEM',
          description: data.description,
        },
      }
      dispatch(splunkPost(addSplunk) as any).then((response: any) => {
        if (response.type == 'ADD_SPLUNK_FORM_SUCCESS') {
          reset()
          navigateTo(`/app/feedyintegration`)
        }
      })
    }
  }

  type FormValues = {
    sourceName: string
    defaultIndex: string
    resttoken: string
    restApiUrl: string
    description: string
  }
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>()

  return (
    <div className='grid grid-cols-2 gap-4 max-md:grid-cols-1'>
      <div>
        <form action='' className='text-white mt-[1rem]' onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className='mt-3'>
              <label htmlFor='name'>Name</label>
              <div className='mt-1'>
                <input
                  type='text'
                  id='name'
                  value={'Splunk'}
                  readOnly
                  {...register('sourceName', { required: 'Name is required' })}
                  placeholder='Enter name'
                  className='bg-gray-50 border w-1/2 pt-2 border-2 border-white-300 text-gray-900 text-sm 
                    rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>
            <div className='mt-3'>
              <label htmlFor='defaultIndex'>Default Index</label>
              <div className='mt-1'>
                <input
                  type='text'
                  id='defaultIndex'
                  {...register('defaultIndex', { required: 'Default Index is required' })}
                  placeholder='Enter default index'
                  className='bg-gray-50 border w-1/2 t-2 border-2 border-white-300 text-gray-900 text-sm 
                    rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>
            <div className='mt-3'>
              <label htmlFor='resttoken'>REST API Token</label>
              <div className='mt-1'>
                <input
                  type='text'
                  id='resttoken'
                  {...register('resttoken', { required: 'REST API Token is required' })}
                  placeholder='Enter REST API token'
                  className='bg-gray-50 border w-1/2 t-2 border-2 border-white-300 text-gray-900 text-sm 
                    rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>
            <div className='mt-3'>
              <label htmlFor='restApiUrl'>REST API URL</label>
              <div className='mt-1'>
                <input
                  type='text'
                  id='restApiUrl'
                  {...register('restApiUrl', { required: 'REST API URL is required' })}
                  placeholder='Enter REST API URL'
                  className='bg-gray-50 border w-1/2 t-2 border-2 border-white-300 text-gray-900 text-sm 
                    rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>

            <div className='mt-3'>
              <label htmlFor='description'>
                <span>Description(Optional)</span>
              </label>
              <div className='mt-1'>
                <textarea
                  id='description'
                  placeholder='Enter a description....'
                  {...register('description')}
                  rows={6}
                  className='bg-gray-50 border w-1/2 border-2 border-white-300 
        text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
        block w-full p-2.5'
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>
            <div>
              <button className='hidden' type='submit' id='splunkSubmit'>
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
      <div></div>
    </div>
  )
}

export default Splunkform
