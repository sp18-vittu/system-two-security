import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { UserList } from '../../redux/nodes/users/action'
import { useDispatch, useSelector } from 'react-redux'
import local from '../../utils/local'
import { vaultUserCreate } from '../../redux/nodes/datavault/action'

const UserRole = (props: any) => {
  const { id } = props
  const localToken = local.getItem('bearerToken')
  const token = JSON.parse(localToken as any)
  const { action = () => {} } = props

  const userDetails = useSelector((state: any) => state.userDetailreducer)
  const { domainDetail } = userDetails

  let vaultPermissionDetails = JSON.parse(sessionStorage.getItem('vaultPermissionDetails') || '{}')
  let vaultPermissionroleDetails = JSON.parse(
    sessionStorage.getItem('vaultPermissionRoleData') || '{}',
  )

  const [vaultPermissionData, setvaultPermissionData] = useState(domainDetail)
  const localStorage = local.getItem('auth')
  const loginUser = JSON.parse(localStorage ? localStorage : '')
  function addUserFilter(params: any) {
    let filterArr = params.filter((item: any) => {
      return item.id != loginUser.user.user.id
    })
    setvaultPermissionData(filterArr)
  }
  useEffect(() => {
    addUserFilter(vaultPermissionData)
  }, [domainDetail])

  const [vaultPermissionRoleData, setvaultPermissionRoleData] = useState([] as any)

  let permission = vaultPermissionroleDetails?.filter((item: any) => {
    return item?.permissionName !== 'READER'
  })

  const roleDto = local.getItem('auth')
  const role = JSON.parse(roleDto as any)
  const roleDescription = role?.user?.user
  const getroleName = roleDescription?.roleDTO

  useEffect(() => {
    if (vaultPermissionDetails) {
      unique()
    }
    if (getroleName?.roleName == '') {
      setvaultPermissionRoleData(permission)
    } else {
      setvaultPermissionRoleData(vaultPermissionroleDetails)
    }
  }, [])

  const unique = () => {
    let data = [...domainDetail]
    let leave_Array = [] as any
    data.filter((obj1) => {
      const obj2 = vaultPermissionDetails.find(
        (x: any) => x.synthUser?.firstName === obj1.firstName,
      )
      if (obj2?.synthUser?.firstName !== obj1.firstName) {
        leave_Array.push(obj1)
      }
    })
    setvaultPermissionData(leave_Array)
  }
  const dispatch = useDispatch()
  const [autoComplete, setautoComplete] = useState([] as any)

  useEffect(() => {
    dispatch(UserList(token) as any)
  }, [])

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm()

  const onSubmit = (data: any) => {
    data.daysOfWeek.map((item: any) => {
      const data1 = {
        access: data.chat,
        datavaultId: id,
        userId: item.id,
      }
      autoComplete.push(data1)
    })
    dispatch(vaultUserCreate(autoComplete) as any)
    action(false)
  }

  return (
    <div>
      <div className='justify-center backdrop-blur-sm items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
        <div className='relative'>
          <div className='border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-auto min-w-full max-w-4xl'>
            <div className=''>
              <div className='flex items-center text-[#101828] font-semibold text-lg justify-center text-center mt-4'>
                <p>Add User</p>
              </div>
              <button className='p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className='relative p-5 flex-auto'>
                <label
                  htmlFor='countries'
                  className='block mb-2 text-sm not-italic font-medium leading-5 text-[#344054]'
                >
                  Name/group (Required)
                </label>
                <Controller
                  {...register('daysOfWeek', { required: true })}
                  name='daysOfWeek'
                  control={control}
                  defaultValue={[]}
                  render={({ field: { ref, ...field }, fieldState: { error } }) => (
                    <Autocomplete
                      {...field}
                      disableClearable
                      limitTags={1}
                      disablePortal
                      filterSelectedOptions
                      multiple
                      getOptionLabel={(item: any) => item.firstName}
                      renderOption={(props, item, { selected }) => (
                        <li {...props}>
                          <span className='pr-1'>{item.firstName}</span>
                          <span>{item.lastName === null ? '' : item.lastName}</span>
                        </li>
                      )}
                      id='days-autocomplete'
                      onChange={(event, value) => field.onChange(value)}
                      options={vaultPermissionData ? vaultPermissionData : []}
                      renderInput={(params) => (
                        <TextField
                          required
                          error={!!error}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                            },
                            '& .MuiInputBase-root': {
                              '& fieldset': {
                                borderColor: 'black',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: 'black',
                              },
                              '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                                border: '2px solid black',
                              },
                            },
                            '& .MuiFormHelperText-root.Mui-error': {
                              color: '#ff0000',
                            },
                          }}
                          helperText={error?.message}
                          name='daysOfWeek'
                          type='search'
                          inputRef={ref}
                          {...params}
                        />
                      )}
                    />
                  )}
                />
                <label
                  htmlFor='chat'
                  className='block mb-2 text-sm not-italic font-medium leading-5 text-gray-900 mt-4'
                >
                  Role (Required)
                </label>
                <select
                  id='chat'
                  className='mt-1 bg-gray-50 border border-gray-300 text-gray-600 font-medium rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  {...register('chat', { required: true })}
                >
                  <option value=''>Select Role</option>
                  {vaultPermissionRoleData?.map((item: any, key: any) =>
                    getroleName.roleName == 'DATAVAULT_ADMIN' && item.permissionName == 'WRITER' ? (
                      <option key={key} value={item.permissionName}>
                        {item?.permissionDescription.charAt(0).toUpperCase() +
                          item?.permissionDescription.slice(1).toLowerCase()}
                      </option>
                    ) : getroleName.roleName == 'SUPER_ADMIN' ||
                      getroleName.roleName == 'ACCOUNT_ADMIN' ||
                      getroleName.roleName == 'USER' ? (
                      <option key={key} value={item.permissionName}>
                        {item?.permissionDescription.charAt(0).toUpperCase() +
                          item?.permissionDescription.slice(1).toLowerCase()}
                      </option>
                    ) : null,
                  )}
                </select>
                <label
                  htmlFor='message'
                  className='block mb-2 text-sm not-italic font-medium leading-5 text-gray-900 mt-4'
                >
                  Description
                </label>
                <textarea
                  id='message'
                  className='w-auto min-w-full overflow-hidden max-w-3xl min-h-[4rem] max-h-44 h-auto resize rounded-md block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Enter description'
                  {...register('message', {
                    required: 'message is required',
                  })}
                ></textarea>
                {errors.email && (
                  <p className='text-xs mt-1 text-left text-[#FF0000]'>
                    {errors.email.message as any}
                  </p>
                )}
              </div>
              <div className='flex items-center justify-end gap-2 p-1 border-solid border-slate-200 rounded-b'>
                <button
                  type='button'
                  className='w-[16.2rem] 2xl:w-[16.2rem] h-10  rounded-lg gap-2 class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 ml-5 px-4 border border-gray-400 mb-1  rounded shadow'
                  onClick={() => action(false)}
                >
                  Cancel
                </button>
                <button
                  className='w-[16.2rem] 2xl:w-[16.2rem] h-10  bg-teal-900 text-white active:bg-emerald-600 font-bold text-sm px-6 py-3 rounded-lg mb-1 mr-5 shadow hover:shadow-lg outline-none'
                  type='submit'
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
    </div>
  )
}

export default UserRole
