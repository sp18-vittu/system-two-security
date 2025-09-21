import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

const CTiEditDilog: React.FC<{
  isOpen: boolean
  onClose: () => void
  handleEditFileSubmit: any
  editdata: any
}> = ({ isOpen, onClose, handleEditFileSubmit, editdata }) => {
  if (!isOpen) return null
  let {
    register: registerEdit,
    handleSubmit: editFileSubmit,
    reset: editReset,
    setValue,
    formState: { errors: err },
  } = useForm<any>()

  const cancelEdit = () => {
    onClose()
  }

  useEffect(() => {
    if (editdata) {
      setValue('urltitle', editdata?.ctiName.replace(/-/g, ' '))
    }
  }, [editdata])

  return (
    <form onSubmit={editFileSubmit(handleEditFileSubmit)}>
      <div className='backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
        <div className='relative my-6 w-2/6 max-md:w-[70%]'>
          <div className='border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none'>
            <div className='items-start justify-between  border-solid border-slate-200 rounded-t'>
              <h6 className='font-semibold justify-center items-center text-center mt-3 text-[#000]'>
                Edit CTI Name
              </h6>
            </div>
            <div className='relative p-5 flex-auto'>
              <input
                type='text'
                id='urltitle'
                className='placeholder:text-base border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                placeholder='Add title'
                {...registerEdit('urltitle', {
                  required: 'CTI report name is required',
                  validate: (value) =>
                    value.trim() !== '' || 'Please enter a valid CTI report name',
                })}
              />
              {err && err.urltitle && (
                <>
                  <span className='text-red-500 text-[12px] px-1'>{err?.urltitle?.message}</span>
                </>
              )}
            </div>

            <div className='grid gap-4 grid-cols-2  p-2'>
              <button
                className='ml-2 w-full h-10 rounded-lg gap-2 class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'
                type='button'
                onClick={cancelEdit}
              >
                Cancel
              </button>
              <button
                className='w-full h-10 bg-[#EE7103] text-white active:bg-[#EE7103] font-bold text-sm px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none'
                type='submit'
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default CTiEditDilog
