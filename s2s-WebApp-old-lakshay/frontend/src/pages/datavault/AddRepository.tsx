import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useData } from '../../layouts/shared/DataProvider'
import { Newdatavalut, dataVaultid, updateDatavault } from '../../redux/nodes/datavault/action'
import local from '../../utils/local'
import Swal from 'sweetalert2'

const AddRepository = () => {
  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const datavaultReducer = useSelector((state: any) => state.dataVaultreducer)
  const { dataVaultlist } = datavaultReducer

  const [dataVaultLists, setDataVaultLists] = useState([] as any)

  const { setDetail, setSendNewRepositoryDetail }: any = useData()
  const { id: paramsId }: any = useParams()
  const localToken = local.getItem('bearerToken')
  const token = JSON.parse(localToken as any)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
  })

  useEffect(() => {
    if (paramsId) {
      const vault = sessionStorage.getItem('vault')
      const vaultdata = JSON.parse(vault as any)
      dispatch(dataVaultid(paramsId, vaultdata, token) as any)
        .then((res: any) => {
          if (res.type == 'DATAVAULT_INDIVIDUAL_ID_SUCCESS') {
            setValue('name', res.payload.name)
            setFormData((prev: any) => {
              return { name: res.payload.name }
            })
            setValue('description', res.payload.description)
          }
        })
        .catch((err: any) => console.log('err', err))
    } else if (!paramsId) {
      setValue('name', '')
      setValue('description', '')
    }
  }, [paramsId])

  const [characters, setCharacters] = useState(false)
  const containsSpecialCharacters = (str: string) => {
    const regex = /[(),.?"{}|<>]/g
    return regex.test(str)
  }

  const handleDataVaultSubmit = (submitData: any) => {
    if (!submitData.name.trim() || !submitData.description.trim()) return

    if (typeof submitData['name'] === 'string' && containsSpecialCharacters(submitData['name'])) {
      setCharacters(true)
      return
    } else {
      if (paramsId) {
        dispatch(updateDatavault(submitData, paramsId) as any)
          .then((res: any) => {
            if (res.type == 'DATAVAULT_UPDATE_SUCCESS') {
              reset()
              setDetail(null)
              sessionStorage.setItem('vault', JSON.stringify(res.payload))
              navigate(`/app/Repository/${res.payload.id}`)
            }
          })
          .catch((err: any) => console.log('err', err))
      } else {
        setCharacters(false)
        let submitName = submitData.name.replace(/\s+/g, '')
        let duplicateName = false
        dataVaultLists.forEach((vault: any) => {
          let vaultName = vault.name.replace(/\s+/g, '')
          if (vaultName.toLowerCase() == submitName.toLowerCase()) {
            duplicateName = true
          }
        })
        if (!duplicateName) {
          dispatch(Newdatavalut(submitData) as any)
            .then((res: any) => {
              if (res.type == 'CREATE_NEW_DATAVALUT_SUCCESS') {
                reset()
                setDetail(null)
                sessionStorage.setItem('vault', JSON.stringify(res.payload))
                navigate(`/app/addFiles/${res.payload.id}`)
              }
            })
            .catch((err: any) => console.log('err', err))
        } else {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            color: '#000',
            title: 'Vault Name Already Exists',
            width: 400,
            timer: 1000,
            showConfirmButton: false,
          })
        }
      }
    }
  }

  const getVaultName = (name: string) => {
    const splcharater: any = containsSpecialCharacters(name)
    if (!splcharater) {
      setCharacters(false)
      setFormData((prevValue: any) => {
        return { ...prevValue, name: name }
      })
      setCharacters(false)
      setDetail({ from: 'AddRepository', value: name })
    } else {
      setCharacters(true)
    }
  }

  const getDescription = (description: any) => {
    setFormData((prevValue: any) => {
      return { ...prevValue, description: description }
    })
  }

  useEffect(() => {
    setSendNewRepositoryDetail({ from: 'addRepository', value: { formValue: formData } })
    setDataVaultLists(dataVaultlist)
  }, [formData.name, dataVaultlist])

  return (
    <div className='p-[32px]'>
      <form onSubmit={handleSubmit(handleDataVaultSubmit)}>
        <div className='mt-[12px] relative'>
          <label htmlFor='name' className='block mb-2 text-sm font-medium text-white'>
            Name
          </label>
          {characters && (
            <>
              <div className='absolute px-3  text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm  ml-12 -mt-8 tooltip'>
                <p>Special characters are not allowed!!</p>
                <svg
                  className='absolute text-white w-full  h-2.5 right-2.5 top-full'
                  x='0px'
                  y='0px'
                  viewBox='0 0 255 255'
                >
                  <polygon className='fill-current' points='0,0 127.5,127.5 255,0' />
                </svg>
              </div>
            </>
          )}
          <input
            type='text'
            id='name'
            {...register('name', {
              required: true,
            })}
            maxLength={25}
            onChange={(e) => getVaultName(e.target.value)}
            className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '
            placeholder='Add Name'
          />
        </div>
        <div className='mt-[12px]'>
          <label htmlFor='description' className='block mb-2 text-sm font-medium text-white'>
            Description
          </label>
          <input
            type='text'
            id='description'
            {...register('description', {
              required: true,
            })}
            maxLength={150}
            onChange={(e) => getDescription(e.target.value)}
            className={`bg-gray-50 border ${
              errors.description
                ? 'border-red-400 focus:ring-red-400 outline-[red]'
                : 'border-blue-400 focus:ring-blue-400'
            } text-gray-900 text-sm rounded-lg  w-full p-2.5`}
            placeholder='Add Description'
          />
        </div>

        <div>
          <button id='dataVaultSubmit' type='submit' className='hidden'>
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddRepository
