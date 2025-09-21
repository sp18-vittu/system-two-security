import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { feedlCtiPost } from '../../redux/nodes/feedlyform/action'
import { useData } from '../../layouts/shared/DataProvider'
import { useEffect, useState } from 'react'

const AddFeedly = () => {
  type FormValues = {
    feedly: string
  }

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id: paramsId } = useParams()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>()

  const { setDetail, setSaveData }: any = useData()

  const [formData, setFormData] = useState({
    feedly: '',
  })

  useEffect(() => {
    setSaveData({ from: 'addFeedly', value: { formValue: formData } })
  }, [formData.feedly])

  const onSubmit = (data: any) => {
    const feedlypost: any = {
      vaultId: paramsId,
      feedlyStreams: [
        {
          streamId: data.feedly,
        },
      ],
    }

    dispatch(feedlCtiPost(feedlypost) as any)
      .then((response: any) => {
        if (response.type == 'ADD_CTI_FEEDLY_FORM_SUCCESS') {
          let valutArray: any = []
          const feedlyString = sessionStorage.getItem('feedly')
          const feedly: any = JSON.parse(feedlyString as any)
          for (let i = 0; i < feedly?.length; i++) {
            if (feedly[i].vaultId !== paramsId) {
              valutArray.push(feedly[i])
            } else {
              valutArray = []
            }
          }
          if (response) {
            if (response.payload == 'PROCESSING') {
              const feedlyString = sessionStorage.getItem('feedly')
              if (feedlyString) {
                if (valutArray.length > 0) {
                  const feedlys: any = [
                    ...valutArray,
                    { vaultId: paramsId, response: response.payload, streamID: data.feedly },
                  ]
                  sessionStorage.setItem('feedly', JSON.stringify(feedlys))
                } else {
                  sessionStorage.setItem(
                    'feedly',
                    JSON.stringify([
                      { vaultId: paramsId, response: response.payload, streamID: data.feedly },
                    ]),
                  )
                }
              } else {
                sessionStorage.setItem(
                  'feedly',
                  JSON.stringify([
                    { vaultId: paramsId, response: response.payload, streamID: data.feedly },
                  ]),
                )
              }
              sessionStorage.setItem('feedlyCounter', JSON.stringify(1))
              setDetail({ from: 'addFeedly', value: { status: 'feedlyPosted' } })
            }
          }
          navigate(`/app/Repository/${paramsId}`)
          reset()
        }
      })
      .catch((error: any) => {
        console.log(error)
      })
    reset()
  }

  return (
    <div className='p-[32px] h-[75vh]'>
      {/* <-------------FEEDY--------------> */}
      <div onClick={handleSubmit(onSubmit)}>
        <p className='text-white font-inter font-medium text-sm leading-5'>
          Feedly Team Board Stream ID
        </p>
        <div className='mt-2'>
          <input
            type='text'
            id='feedly'
            placeholder='Add Feedly stream ID'
            {...register('feedly', {
              required: 'feedly is required',
              onChange: (e: any) => {
                setFormData((prevValue: any) => {
                  return { feedly: e.target.value }
                })
              },
            })}
            className='bg-gray-50 border  pt-2 border-2 border-white-300 text-gray-900 text-sm 
                        rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '
            style={{ fontSize: '16px' }}
          />
        </div>
        <div>
          <button className='hidden' type='submit' id='feedlySubmits'>
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddFeedly
