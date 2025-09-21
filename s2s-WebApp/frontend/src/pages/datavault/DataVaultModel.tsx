import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  DATAVAULT_INDIVIDUAL_ID_RESET,
  Newdatavalut,
  dataVaultid,
  updateDatavault,
} from '../../redux/nodes/datavault/action'
import local from '../../utils/local'

export default function DataVaultModel(props: any) {
  const { action = () => {} } = props
  const { dataVaultId } = props

  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)

  const dataVaultIdlists = useSelector((state: any) => state?.dataVaultIdreducer)
  const { dataVaultIdList } = dataVaultIdlists

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
  })

  useEffect(() => {
    if (dataVaultId) {
      dispatch(dataVaultid(dataVaultId, '1', token) as any)
    }
  }, [dataVaultId])

  useEffect(() => {
    if (dataVaultIdList) {
      let value = {
        name: dataVaultIdList?.name,
        description: dataVaultIdList?.description,
      }
      reset({
        ...value,
      })
    }
  }, [dataVaultIdList])

  const dispatch = useDispatch()

  const navigateTo = useNavigate()

  const onSubmit = (data: any) => {
    dispatch({ type: DATAVAULT_INDIVIDUAL_ID_RESET })
    if (dataVaultId) {
      dispatch(updateDatavault(data, dataVaultIdList?.id) as any)
      action(false)
      navigateTo('/app/datavaults')
    } else {
      dispatch(Newdatavalut(data) as any)
      action(false)
      navigateTo('/app/datavaults')
    }
  }
  const close = (e: any) => {
    action(false)
    navigateTo('/app/datavaults')
    dispatch({ type: DATAVAULT_INDIVIDUAL_ID_RESET })
  }
  return (
    <>
      <div className='justify-center backdrop-blur-sm items-center flex  overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
        <div className='relative my-6  mx-auto '>
          <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
            <div
              className=' p-3 border-solid border-slate-200 rounded-t'
              style={{ textAlign: 'center' }}
            >
              <h6 className='text-xl text-black font-semibold mt-3'>
                {dataVaultId ? 'Update CTI Archive' : 'New CTI Archive'}
              </h6>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='relative p-6 -mt-4 flex-auto'>
                <div>
                  <label className='block mb-2 text-sm cursor font-medium text-gray-600 text-left'>
                    Name
                  </label>
                  <input
                    type='text'
                    id='name'
                    className='bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder:text-base'
                    placeholder='Enter Archive name'
                    {...register('name', {
                      required: 'name is required',
                    })}
                  ></input>
                </div>
                <div className='mt-3'>
                  <label className='block mb-2 cursor text-sm font-medium text-gray-600 text-left'>
                    Description
                  </label>
                  <textarea
                    id='desc'
                    className='w-auto min-w-full overflow-hidden max-w-3xl min-h-[4rem] max-h-44 h-auto resize rounded-md block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='Enter Archive description'
                    {...register('description', {
                      required: 'desc is required',
                    })}
                  ></textarea>
                </div>
              </div>
              <div className='flex items-center justify-end gap-2 p-1 border-solid border-slate-200 rounded-b'>
                <button
                  type='button'
                  className='w-[14.2rem] 2xl:w-[16.2rem] h-10  rounded-lg gap-2 class="bg-white hover:bg-gray-100 text-black font-semibold py-2 ml-5 px-4 border border-gray-400 mb-1  rounded shadow'
                  onClick={close}
                >
                  Cancel
                </button>
                <button
                  className='w-[14.2rem] 2xl:w-[16.2rem] h-10  bg-[#EE7103] text-white active:bg-emerald-600 font-bold text-sm px-6 py-3 rounded-lg mb-1 mr-5 shadow hover:shadow-lg outline-none'
                  type='submit'
                >
                  {dataVaultId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
    </>
  )
}
