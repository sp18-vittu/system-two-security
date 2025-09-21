import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch } from 'react-redux'
interface FormData {
  url: string
  name: string
  email: string
  apiToken: string
  repoType: string
}

function CloneRepositoryPage({ handleNextpage, onClose, setProcessModalOpen }: any) {
    const [selectedRepoType, setSelectedRepoType] = useState('public' as any)
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormData>()
    const dispatch = useDispatch()

  const handleSelection = (value: string) => {
    setSelectedRepoType(value)
  }

  const onSubmit = (data: FormData) => {
    setProcessModalOpen(data)
    onClose()
  }

    return (
        <div className=' p-[24px] bg-[#1d2939] rounded-lg flex flex-col gap-6 items-end justify-start relative shadow-xl overflow-scroll w-[80%] max-w-[850px] max-h-[80%] hide-scrollbar max-sm:w-[90%]'>
            {/* Modal Content */}
            <div className='flex flex-col gap-6 items-start justify-start relative flex-shrink-0 w-full'>
                <div className='modal-header flex flex-col items-center justify-start shrink-0 relative w-full mt-[-16px]'>
                    <div className='content flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative'>
                        <div className='featured-icon bg-[#32435a] rounded-full shrink-0 relative'>
                            <svg
                                width='48'
                                height='48'
                                viewBox='0 0 48 48'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <rect width='48' height='48' rx='24' fill='#32435A' />
                                <path
                                    d='M24 14C26.5013 16.7384 27.9228 20.292 28 24C27.9228 27.708 26.5013 31.2616 24 34M24 14C21.4987 16.7384 20.0772 20.292 20 24C20.0772 27.708 21.4987 31.2616 24 34M24 14C18.4772 14 14 18.4772 14 24C14 29.5228 18.4772 34 24 34M24 14C29.5228 14 34 18.4772 34 24C34 29.5228 29.5228 34 24 34M14.5 21H33.5M14.5 27H33.5'
                                    stroke='white'
                                    stroke-width='2'
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                />
                            </svg>
                        </div>
                        <div className='text-and-supporting-text flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative'>
                            <div className='text text-white text-left font-semibold text-lg leading-7'>
                                Add DAC Repo
                            </div>
                            <div className='supporting-text text-[#98a2b3] text-left font-normal text-md leading-6'>
                                Step 2 of 2: Add URL.
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className='rounded-[8px] flex flex-row gap-0 items-center justify-center flex-shrink-0 absolute right-[0px] top-[8px] overflow-hidden'
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                        >
                            <path
                                d='M18 6L6 18M6 6L18 18'
                                stroke='#98A2B3'
                                stroke-width='2'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                            />
                        </svg>
                    </button>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)} className='w-full'>
                    <div className="flex flex-col gap-6 items-start justify-start flex-shrink-0 relative">
                        <div
                            className="flex flex-col gap-4 w-full relative"
                        >
                            {/* URL Field */}
                            <div className="bg-[#48576c] rounded-lg border border-[#6e7580] flex flex-col items-start justify-start w-full relative shadow-xs">
                                <div className="flex flex-col gap-1 items-start justify-start w-full">
                                    <div className="bg-[#48576c] rounded-lg border border-[#6e7580] px-3 py-2 flex items-center gap-2 w-full shadow-xs">
                                        <input
                                            {...register("url", {
                                                required: "URL is required",
                                                validate: (value) =>
                                                    /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_.-]+(\/[A-Za-z0-9_.-]+)?$/.test(value) ||
                                                    "Please enter a valid GitHub URL",
                                            })}
                                            type="text"
                                            placeholder="URL"
                                            className="bg-transparent text-white placeholder:text-[#fff] w-full border-none outline-none"
                                        />
                                    </div>

                                </div>
                            </div>
                            {errors.url && (
                                <p className="text-red-500 text-sm">{errors.url.message}</p>
                            )}

                            {/* API Token Field */}
                            {selectedRepoType == "private" && (<div className="bg-[#48576c] rounded-lg border border-[#6e7580] flex flex-col items-start justify-start w-full relative shadow-xs">
                                <div className="flex flex-col gap-1 items-start justify-start w-full">
                                    <div className="bg-[#48576c] rounded-lg border border-[#6e7580] px-3 py-2 flex items-center gap-2 w-full shadow-xs">
                                        <input
                                            {...register("apiToken", { required: selectedRepoType === "public" ? false : "API Token is required" })}
                                            type="text"
                                            placeholder="API Token"
                                            className="bg-transparent text-white placeholder:text-[#fff] w-full border-none outline-none"
                                        />
                                    </div>

                                </div>
                            </div>)}
                            {errors.apiToken && (
                                <p className="text-red-500 text-sm mt-1">{errors.apiToken.message}</p>
                            )}
                            {/* Repo Type Section */}
                            <div className='flex flex-col gap-2 items-start justify-start relative'>
                                <span className='text-white text-lg font-medium'>Repo Type</span>
                                <div className='flex gap-6 items-start justify-start'>
                                    {/* Public Option */}
                                    <div className='flex items-center gap-2'>
                                        <Controller
                                            name='repoType'
                                            control={control}
                                            rules={{ required: false }}
                                            render={({ field }) => (
                                                <>
                                                    <input
                                                        {...field}
                                                        type='radio'
                                                        id='public'
                                                        value='public'
                                                        checked={selectedRepoType === 'public'}
                                                        onChange={() => {
                                                            field.onChange('public')
                                                            handleSelection('public')
                                                        }}
                                                        className='hidden peer'
                                                    />
                                                    <label
                                                        htmlFor='public'
                                                        className='flex items-center gap-2 cursor-pointer'
                                                    >
                                                        <div
                                                            className={`rounded-full w-5 h-5 relative ${selectedRepoType === 'public'
                                                                ? 'bg-[#ee7103]'
                                                                : 'bg-transparent border border-[#d0d5dd]'
                                                                }`}
                                                        >
                                                            <div
                                                                className={`bg-white rounded-full w-2 h-2 absolute top-1/4 left-1/4 transition-all duration-200 ${selectedRepoType === 'public' ? 'scale-100' : 'scale-0'
                                                                    }`}
                                                            ></div>
                                                        </div>
                                                        <span className='text-white text-lg'>Public</span>
                                                    </label>
                                                </>
                                            )}
                                        />
                                    </div>

                  {/* Private Option */}
                  <div className='flex items-center gap-2'>
                    <Controller
                      name='repoType'
                      control={control}
                      rules={{ required: false }}
                      render={({ field }) => (
                        <>
                          <input
                            {...field}
                            type='radio'
                            id='private'
                            value='private'
                            checked={selectedRepoType === 'private'}
                            onChange={() => {
                              field.onChange('private')
                              handleSelection('private')
                            }}
                            className='hidden peer'
                          />
                          <label
                            htmlFor='private'
                            className='flex items-center gap-2 cursor-pointer'
                          >
                            <div
                              className={`rounded-full w-5 h-5 relative ${
                                selectedRepoType === 'private'
                                  ? 'bg-[#ee7103]'
                                  : 'bg-transparent border border-[#d0d5dd]'
                              }`}
                            >
                              <div
                                className={`bg-white rounded-full w-2 h-2 absolute top-1/4 left-1/4 transition-all duration-200 ${
                                  selectedRepoType === 'private' ? 'scale-100' : 'scale-0'
                                }`}
                              ></div>
                            </div>
                            <span className='text-white text-lg'>Private</span>
                          </label>
                        </>
                      )}
                    />
                  </div>
                </div>
                {errors.repoType && (
                  <p className='text-red-500 text-sm mt-1'>{errors.repoType.message}</p>
                )}
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className='flex justify-between gap-3 py-4 w-full max-sm:flex-col'>
            {/* Back Button */}
            <button
              type='button'
              onClick={handleNextpage}
              className='border border-[#ee7103] rounded-lg px-4 py-2 flex items-center justify-center text-[#ee7103] font-semibold  max-sm:w-full'
            >
              Back
            </button>
            <div className='flex flex-row gap-3'>
              {/* Cancel Button */}
              <button
                onClick={onClose}
                type='button'
                className='border border-[#d0d5dd] bg-white rounded-lg px-4 py-2 flex items-center justify-center text-[#182230] font-semibold max-sm:w-full'
              >
                Cancel
              </button>

              {/* Clone Repository Button */}
              <button
                type='submit'
                className='bg-[#ee7103] rounded-lg px-4 py-2 flex items-center justify-center text-white font-semibold max-sm:w-full'
              >
                Clone Repository
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CloneRepositoryPage
