import React, { useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch } from 'react-redux'
import { CollectiondataPost, CollectiondataPut } from '../../../redux/nodes/Collections/action'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import CustomToast from '../../../layouts/App/CustomToast'

interface CreateCollectionModalProps {
  isOpen: boolean
  onClose: () => void
  setModalOpen: any
  setisPost: any
  editdata: any
  cardList: any
  seteditdata: any
}

const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({
  isOpen,
  onClose,
  setModalOpen,
  setisPost,
  editdata,
  cardList,
  seteditdata,
}) => {
  if (!isOpen) return null
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
    clearErrors,
  } = useForm<any>()
  const dispatch = useDispatch()

  const onSubmit = (data: any) => {
    if (!editdata) {
      if (
        cardList.some(
          (collection: any) =>
            collection.name.toLowerCase() === data?.name?.trimEnd().toLowerCase(),
        )
      ) {
        setError('name', {
          type: 'manual',
          message: 'This collection name already exists',
        })
      } else {
        const postdata: any = {
          name: data.name?.trimEnd(),
          description: data?.description?.trimEnd(),
        }
        dispatch(CollectiondataPost(postdata) as any).then((response: any) => {
          if (response.type === 'COLLECTION_POST_SUCCESS') {
            toast.success(
              <CustomToast
                message='Collection created successfully.'
                onClose={() => toast.dismiss()} // Dismiss only this toast
              />,
              {
                duration: 4000,
                position: 'top-center',
                style: {
                  background: '#fff',
                  color: '#000', // White text color
                  width: '500px',
                },
              },
            )
            setisPost('Add')
            setModalOpen(false)
            reset()
            setValue('name', '')
            setValue('description', '')
            seteditdata(null)
          }
        })
      }
    } else {
      const putdata: any = {
        name: data.name?.trimEnd(),
        description: data?.description?.trimEnd(),
      }
      dispatch(CollectiondataPut(editdata.id, putdata) as any).then((response: any) => {
        if (response.type === 'COLLECTION_PUT_SUCCESS') {
          toast.success(
            <CustomToast
              message='Collection updated successfully.'
              onClose={() => toast.dismiss()} // Dismiss only this toast
            />,
            {
              duration: 4000,
              position: 'top-center',
              style: {
                background: '#fff',
                color: '#000', // White text color
                width: '500px',
              },
            },
          )
          setisPost('Add')
          setModalOpen(false)
          reset()
          setValue('name', '')
          setValue('description', '')
          seteditdata(null)
        }
      })
    }
  }

  useEffect(() => {
    if (editdata) {
      setValue('name', editdata?.name)
      setValue('description', editdata?.description)
    }
  }, [editdata])

  const handleNameChange = (value: any) => {
    const trimmedValue = value?.trimStart()
    setValue('name', trimmedValue)
    if (value?.trimStart()) {
      if (
        cardList.some((collection: any) => collection.name.toLowerCase() === value.toLowerCase()) &&
        !editdata
      ) {
        setError('name', {
          type: 'manual',
          message: 'This collection name already exists',
        })
      } else {
        clearErrors('name')
      }
    }
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='relative bg-gray-800 p-8 rounded-lg w-[500px] h-[450px] shadow-lg text-white'
      >
        {/* Close Icon at Top Right */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition'
        >
          <CloseIcon fontSize='small' />
        </button>

        <h2 className='text-xl font-semibold mb-6'>New Collection</h2>
        <div className='space-y-6'>
          <div>
            <label className='block text-sm font-medium mb-1' htmlFor='name'>
              Name
            </label>
            <input
              type='text'
              id='name'
              maxLength={64}
              placeholder='Give the collection a name'
              {...register('name', {
                required: 'Name is required',
                onChange: (e) => handleNameChange(e.target.value),
              })}
              className='w-[100%] px-3 py-2 bg-gray-700 text-gray-300 rounded-md focus:outline-none'
            />
            {errors.name && <p className='text-red-500 mt-1'>{errors.name.message}</p>}
          </div>
          <div>
            <label className='block text-sm font-medium mb-1' htmlFor='description'>
              Description
            </label>
            <textarea
              id='description'
              placeholder='Describe the collection (Optional)'
              maxLength={128}
              {...register('description', { required: false })}
              className='w-[100%] px-3 py-2 h-24 bg-gray-700 text-gray-300 rounded-md focus:outline-none'
            />
          </div>
        </div>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='100%'
          height='2'
          viewBox='0 0 1392 2'
          fill='none'
          className={errors.name ? 'mt-[50px]' : 'mt-[80px]'}
        >
          <path d='M1392 1H0.5' stroke='#3E4B5D' />
        </svg>
        {/* Save and Close Buttons at Bottom Right */}
        <div className='flex justify-end space-x-2 mt-8 absolute bottom-6 right-6'>
          <button
            disabled={!!errors.name}
            type='submit'
            className={`px-6 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition ${
              !!errors.name ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            Save
          </button>
          <button
            type='button'
            onClick={onClose}
            className='px-6 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition'
          >
            Close
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateCollectionModal
