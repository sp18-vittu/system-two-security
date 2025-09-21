import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import {
  feedlPost,
  feedlyGet,
  feedlyGetId,
  feedlyUpdate,
} from '../../redux/nodes/feedlyform/action'

const Feedlyform = () => {
  type FormValues = {
    sourceName: string
    apiKey: string
    description: string
  }
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>()
  const dispatch = useDispatch()
  const navigateTo = useNavigate()
  const location = useLocation()
  const [EditId, setEditId] = useState()

  useEffect(() => {
    dispatch(feedlyGet() as any)
  }, [])

  const [updateFeedly, setUpdateFeedly] = useState({} as any)

  useEffect(() => {
    if (location?.state && location?.state[0]?.feed.id) {
      setUpdateFeedly(location?.state[0]?.feed)
    }
    if (updateFeedly.id) {
      dispatch(feedlyGetId(updateFeedly?.id) as any).then((response: any) => {
        setEditId(response?.payload?.id)
        setValue('apiKey', response?.payload?.credentials?.apiKey)
        setValue('description', response?.payload?.description)
      })
    }
  }, [location?.state && location?.state[0]?.feed?.id, updateFeedly])

  const onSubmit = (param: any) => {
    if (EditId) {
      let feedvalue = {
        credentials: {
          apiKey: param.apiKey,
        },
        sourceName: param.sourceName,
        description: param.description,
      }
      dispatch(feedlyUpdate(EditId, feedvalue) as any).then((response: any) => {
        if (response.type == 'UPDATE_FEEDLY_FORM_SUCCESS') {
          reset()
          navigateTo(`/app/feedyintegration`)
        }
      })
    } else {
      let feedvalue = {
        feedly: {
          credentials: {
            apiKey: param.apiKey,
          },
          sourceName: param.sourceName,
          integrationSourceType: 'CTI',
          description: param.description,
        },
      }
      dispatch(feedlPost(feedvalue) as any).then((response: any) => {
        if (response.type == 'ADD_FEEDLY_FORM_SUCCESS') {
          reset()
          navigateTo(`/app/feedyintegration`)
        }
      })
    }
  }

  return (
    <div className='grid grid-cols-2 gap-4 max-md:grid-cols-1'>
      <div>
        <form action='' className='text-white mt-[1rem]' onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className='mt-3'>
              <label htmlFor='sourceName'>Name</label>
              <div className='mt-1'>
                <input
                  type='text'
                  value={'Feedly'}
                  readOnly
                  id='sourceName'
                  {...register('sourceName', { required: 'Name is required' })}
                  placeholder='Enter name'
                  className='bg-gray-50 border w-1/2 pt-2 border-2 border-white-300 text-gray-900 text-sm 
                                rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>
            <div className='mt-3'>
              <label htmlFor='apikey'>API Key</label>
              <div className='mt-1'>
                <input
                  type='text'
                  id='apikey'
                  {...register('apiKey', { required: 'Apikey is required' })}
                  placeholder='Add API Key'
                  className='bg-gray-50 border w-1/2 t-2 border-2 border-white-300 text-gray-900 text-sm 
                                rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
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
                  className='bg-gray-50 border w-1/2   border-2 border-white-300 
                                text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
                                block w-full p-2.5 '
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>
            <div>
              <button className='hidden' type='submit' id='feedSubmit'>
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

export default Feedlyform
