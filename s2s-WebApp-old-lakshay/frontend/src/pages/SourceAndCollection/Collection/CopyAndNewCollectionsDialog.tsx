import React, { useEffect, useState } from 'react'
import Checkbox from '@mui/material/Checkbox'
import SearchIcon from '@mui/icons-material/Search'
import { TextField, InputAdornment } from '@mui/material'
import { Tooltip, TooltipProps, tooltipClasses } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useDispatch } from 'react-redux'
import {
  CollectiondataMultipleCopyPost,
  CollectiondataPost,
  CollectiondtoCollectionMultipleCopyPost,
  CollectiondtoCollectionMultipleMovePost,
  CollectiondtoCollectionThreatbreifPost,
  workbenchMultiyamlFileUpdate,
  workbenchyamlFileUpdate,
} from '../../../redux/nodes/Collections/action'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import CustomToast from '../../../layouts/App/CustomToast'
const yaml = require('js-yaml')

const CustomCheckbox = styled(Checkbox)({
  color: '#D0D5DD',
  '&.Mui-checked': {
    color: '#EE7103',
  },
  '& .MuiSvgIcon-root': {
    borderRadius: '8px !important', // Add desired border radius here
  },
})

const CopyAndNewCollectionsDialog: React.FC<{
  isOpen: boolean
  onClose: () => void
  selectedRows: any
  collectiondata: any
  pramasdata: any
  setDialogOpen: any
  importId: any
}> = ({ isOpen, onClose, selectedRows, collectiondata, pramasdata, setDialogOpen, importId }) => {
  if (!isOpen) return null
  const navigateTo = useNavigate()
  const location = useLocation()
  const { state } = location
  const [changefolder, setChangeFolder] = useState(null as any)
  const [name, setName] = useState(null as any)
  const [describe, setDescribe] = useState(null as any)
  const [checkedItems, setCheckedItems] = useState<boolean[]>(Array(selectedRows.length).fill(true))
  const [selectedItems, setSelectedItems] = useState<any[]>([...selectedRows])
  const [folderItem, setFolderItem] = useState<any[]>([])
  const [search, setSearch] = useState<string>('')
  const { id } = useParams()
  const dispatch = useDispatch()

  const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(() => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: '#fff',
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#fff',
      color: '#000',
    },
  }))


  const handleCheckboxChange = (index: number) => {
    const updatedCheckedItems = [...checkedItems]
    updatedCheckedItems[index] = !updatedCheckedItems[index]
    setCheckedItems(updatedCheckedItems)

    const item = selectedRows[index]

    if (updatedCheckedItems[index]) {
      setSelectedItems([...selectedItems, item])
    } else {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem.title !== item.title))
    }
  }

  const handleFolderChange = (index: number, text: any) => {
    setChangeFolder(text)
    const isSelected = folderItem.some((selected) => selected.id === text.id)

    if (isSelected) {
      setFolderItem(folderItem.filter((selected) => selected.id !== text.id))
    } else {
      setFolderItem([...folderItem, text])
    }
  }

  const [isLoading, setIsLoading] = useState(false)

  const handleClose = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  const handleSave = () => {
    setIsLoading(true)
    let ids: any = []
    let uploaddata: any = []

    for (let i = 0; i < selectedItems.length; i++) {
      if (selectedItems[i]?.content) {
        uploaddata.push(selectedItems[i]?.content)
      } else {
        ids.push(selectedItems[i].id)
      }
    }


    if (pramasdata == 'ctireport') {
      const toastId = toast.loading(
        <CustomToast
          message='Your files are currently being copied.'
          onClose={() => toast.dismiss(toastId)} // Dismiss only this toast
        />,
        {
          duration: 1000000,
          position: 'top-center',
          style: {
            background: '#fff',
            color: '#000', // White text color
            width: '500px',
          },
        },
      )
      if (name) {
        const docId: any = selectedItems.map((row: any) => {
          return row.id
        })
        let data = {
          name: name?.trimEnd(),
          description: describe?.trimEnd(),
        }
        dispatch(CollectiondataPost(data) as any).then((response: any) => {
          if (response.type === 'COLLECTION_POST_SUCCESS') {
            dispatch(
              CollectiondataMultipleCopyPost(
                id ? Number(id) : 0,
                [response?.payload?.id],
                docId,
              ) as any,
            ).then((res: any) => {
              if (res.type == 'MULTIPLE_COLLECTION_COPY_POST_SUCCESS') {
                setIsLoading(false)
                navigateTo(`/app/collectionsigmarule/${response?.payload?.id}`, {
                  state: { title: response?.payload?.name },
                })
                sessionStorage.setItem('active', 'newCtiArcheive')
                toast.dismiss(toastId)
                toast.success(
                  <CustomToast
                    message='Rule copied successfully'
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
                setDialogOpen(false)
                setFolderItem([])
              } else {
                toast.dismiss(toastId)
                setDialogOpen(false)
                setIsLoading(false)
              }
            })
          } else {
            toast.dismiss(toastId)
            setDialogOpen(false)
            setIsLoading(false)
          }
        })
      } else if (!name && changefolder?.name != '+ New') {
        const deleteFilesIds: any = folderItem.map((row: any) => {
          return row.id
        })
        const docId: any = selectedItems.map((row: any) => {
          return row.id
        })
        dispatch(
          CollectiondataMultipleCopyPost(id ? Number(id) : 0, deleteFilesIds, docId) as any,
        ).then((res: any) => {
          if (res.type == 'MULTIPLE_COLLECTION_COPY_POST_SUCCESS') {
            toast.dismiss(toastId)
            sessionStorage.setItem('active', 'newCtiArcheive')
            navigateTo(`/app/collectionsigmarule/${changefolder?.id}`, {
              state: { title: changefolder?.name },
            })
            setDialogOpen(false)
            setIsLoading(false)
            setFolderItem([])
            toast.success(
              <CustomToast
                message={
                  docId.length > 1 ? 'Rule(s) copied successfully' : 'Rule copied successfully'
                }
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
          }
        })
      }
    } else if (pramasdata == 'collecionmove' || pramasdata == 'singlecollecionmove') {
      const toastId = toast.loading(
        <CustomToast
          message='Your files are currently being moved.'
          onClose={() => toast.dismiss(toastId)} // Dismiss only this toast
        />,
        {
          duration: 1000000,
          position: 'top-center',
          style: {
            background: '#fff',
            color: '#000', // White text color
            width: '500px',
          },
        },
      )
      if (name) {
        let data = {
          name: name?.trimEnd(),
          description: describe?.trimEnd(),
        }
        dispatch(CollectiondataPost(data) as any).then((response: any) => {
          if (response.type === 'COLLECTION_POST_SUCCESS') {
            dispatch(
              CollectiondtoCollectionMultipleMovePost(
                id ? Number(id) : 0,
                [response?.payload?.id],
                ids,
              ) as any,
            ).then((res: any) => {
              if (res.type == 'MULTIPLE_COLLECTION_TO_COLLECTION_MOVE_POST_SUCCESS') {
                toast.dismiss(toastId)
                navigateTo(`/app/collectionsigmarule/${response?.payload?.id}`, {
                  state: { title: response?.payload?.name },
                })
                sessionStorage.setItem('active', 'newCtiArcheive')
                setDialogOpen(false)
                setIsLoading(false)
                setFolderItem([])
                toast.success(
                  <CustomToast
                    message='Rule moved successfully'
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
              } else {
                toast.error(
                  <CustomToast
                    message='Failed to copy the rule. Please try again.'
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
                toast.dismiss(toastId)
                setDialogOpen(false)
                setIsLoading(false)
              }
            })
          } else {
            toast.dismiss(toastId)
            setDialogOpen(false)
            setIsLoading(false)
          }
        })
      } else if (!name && changefolder?.name != '+ New') {
        const deleteFilesIds: any = folderItem.map((row: any) => {
          return row.id
        })
        dispatch(
          CollectiondtoCollectionMultipleMovePost(id ? Number(id) : 0, deleteFilesIds, ids) as any,
        ).then((res: any) => {
          if (res.type == 'MULTIPLE_COLLECTION_TO_COLLECTION_MOVE_POST_SUCCESS') {
            toast.dismiss(toastId)
            navigateTo(`/app/collectionsigmarule/${changefolder?.id}`, {
              state: { title: changefolder?.name },
            })
            sessionStorage.setItem('active', 'newCtiArcheive')
            setDialogOpen(false)
            setIsLoading(false)
            toast.success(
              <CustomToast
                message={ids.length > 1 ? 'Rule(s) moved successfully' : 'Rule moved successfully'}
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
          } else {
            toast.error(
              <CustomToast
                message='Failed to copy the rule. Please try again.'
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
            toast.dismiss(toastId)
            setDialogOpen(false)
            setIsLoading(false)
          }
        })
      }
    } else if (pramasdata == 'Threatbreif' || pramasdata == 'ThreatbreifAll') {
      const toastId = toast.loading(
        <CustomToast
          message='Your files are currently being copied.'
          onClose={() => toast.dismiss(toastId)} // Dismiss only this toast
        />,
        {
          duration: 1000000,
          position: 'top-center',
          style: {
            background: '#fff',
            color: '#000', // White text color
            width: '500px',
          },
        },
      )
      if (name) {
        let data = {
          name: name?.trimEnd(),
          description: describe?.trimEnd(),
        }
        dispatch(CollectiondataPost(data) as any).then((response: any) => {
          if (response.type === 'COLLECTION_POST_SUCCESS') {
            dispatch(
              CollectiondtoCollectionThreatbreifPost([response?.payload?.id], ids) as any,
            ).then((res: any) => {
              if (res.type == 'THREAT_BREIF_COLLECTION_TO_COLLECTION_COPY_POST_SUCCESS') {
                toast.dismiss(toastId)
                navigateTo(`/app/collectionsigmarule/${response?.payload?.id}`, {
                  state: { title: response?.payload?.name },
                })
                sessionStorage.setItem('active', 'newCtiArcheive')
                setDialogOpen(false)
                setIsLoading(false)
                setFolderItem([])
                toast.success(
                  <CustomToast
                    message='Rule copied successfully'
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
              } else {
                toast.error(
                  <CustomToast
                    message='Failed to copy the rule. Please try again.'
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
                toast.dismiss(toastId)
                setDialogOpen(false)
                setIsLoading(false)
              }
            })
          } else {
            toast.dismiss(toastId)
            setDialogOpen(false)
            setIsLoading(false)
          }
        })
      } else if (!name && changefolder?.name != '+ New') {
        const selectedId: any = folderItem.map((row: any) => {
          return row?.id
        })
        dispatch(CollectiondtoCollectionThreatbreifPost(selectedId, ids) as any).then(
          (res: any) => {
            if (res.type == 'THREAT_BREIF_COLLECTION_TO_COLLECTION_COPY_POST_SUCCESS') {
              toast.dismiss(toastId)
              navigateTo(`/app/collectionsigmarule/${changefolder?.id}`, {
                state: { title: changefolder?.name },
              })
              sessionStorage.setItem('active', 'newCtiArcheive')
              setDialogOpen(false)
              setIsLoading(false)
              toast.success(
                <CustomToast
                  message={
                    ids.length > 1 ? 'Rule(s) copied successfully' : 'Rule copied successfully'
                  }
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
            } else {
              toast.error(
                <CustomToast
                  message='Failed to copy the rule. Please try again.'
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
              toast.dismiss(toastId)
              setDialogOpen(false)
              setIsLoading(false)
            }
          },
        )
      }
    } else if (pramasdata == 'chatcopy') {
      const toastId = toast.loading(
        <CustomToast
          message='Your files are currently being copied.'
          onClose={() => toast.dismiss(toastId)} // Dismiss only this toast
        />,
        {
          duration: 1000000,
          position: 'top-center',
          style: {
            background: '#fff',
            color: '#000', // White text color
            width: '500px',
          },
        },
      )
      if (name) {
        let data = {
          name: name?.trimEnd(),
          description: describe?.trimEnd(),
        }
        dispatch(CollectiondataPost(data) as any).then((response: any) => {
          if (response.type === 'COLLECTION_POST_SUCCESS') {
            dispatch(
              CollectiondtoCollectionMultipleCopyPost(
                selectedItems[0]?.datavault?.id,
                [response?.payload?.id],
                [selectedItems[0].id],
              ) as any,
            ).then((res: any) => {
              if (res.type == 'MULTIPLE_COLLECTION_TO_COLLECTION_COPY_POST_SUCCESS') {
                toast.dismiss(toastId)
                navigateTo(`/app/collectionsigmarule/${response?.payload?.id}`, {
                  state: { title: response?.payload?.name },
                })
                sessionStorage.setItem('active', 'newCtiArcheive')
                setDialogOpen(false)
                setIsLoading(false)
                setFolderItem([])
                toast.success(
                  <CustomToast
                    message='Rule copied successfully'
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
              } else {
                toast.error(
                  <CustomToast
                    message='Failed to copy the rule. Please try again.'
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
                toast.dismiss(toastId)
                setDialogOpen(false)
                setIsLoading(false)
              }
            })
          } else {
            toast.dismiss(toastId)
            setDialogOpen(false)
            setIsLoading(false)
          }
        })
      } else if (!name && changefolder?.name != '+ New') {
        const deleteFilesIds: any = folderItem.map((row: any) => {
          return row.id
        })
        dispatch(
          CollectiondtoCollectionMultipleCopyPost(selectedItems[0]?.datavault?.id, deleteFilesIds, [
            selectedItems[0].id,
          ]) as any,
        ).then((res: any) => {
          if (res.type == 'MULTIPLE_COLLECTION_TO_COLLECTION_COPY_POST_SUCCESS') {
            toast.dismiss(toastId)
            navigateTo(`/app/collectionsigmarule/${changefolder?.id}`, {
              state: { title: changefolder?.name },
            })
            sessionStorage.setItem('active', 'newCtiArcheive')
            setDialogOpen(false)
            setIsLoading(false)
            setFolderItem([])
            toast.success(
              <CustomToast
                message={
                  ids.length > 1 ? 'Rule(s) copied successfully' : 'Rule copied successfully'
                }
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
          } else {
            toast.error(
              <CustomToast
                message='Failed to copy the rule. Please try again.'
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
            toast.dismiss(toastId)
            setDialogOpen(false)
            setIsLoading(false)
          }
        })
      }
    } else if (pramasdata == 'workbench') {
      const toastId = toast.loading(
        <CustomToast
          message='Your files are currently being copied.'
          onClose={() => toast.dismiss(toastId)} // Dismiss only this toast
        />,
        {
          duration: 1000000,
          position: 'top-center',
          style: {
            background: '#fff',
            color: '#000', // White text color
            width: '500px',
          },
        },
      )
      if (name) {
        let data = {
          name: name?.trimEnd(),
          description: describe?.trimEnd(),
        }
        dispatch(CollectiondataPost(data) as any).then((response: any) => {
          if (response.type === 'COLLECTION_POST_SUCCESS') {
            let parsedJSON = yaml.load(selectedRows[0]?.yamlText)
            const blob = new Blob([selectedRows[0]?.yamlText], { type: 'text/plain' })
            const file = new File([blob], `${parsedJSON?.title}.yml`, { type: 'text/plain' })
            const data = new FormData()
            data.append('file', file)
            const deleteFilesIds: any = folderItem.map((row: any) => {
              return row.id
            })
            dispatch(
              workbenchyamlFileUpdate(
                response?.payload?.id,
                Number(selectedRows[0]?.id),
                data,
              ) as any,
            )
              .then((res: any) => {
                if (res.type == 'UPDATE_YAML_FILE_SUCCESS') {
                  toast.dismiss(toastId)
                  setDialogOpen(false)
                  setIsLoading(false)
                  setFolderItem([])
                  toast.success(
                    <CustomToast
                      message={'Rule copied successfully'}
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
                } else {
                  toast.dismiss(toastId)
                  setDialogOpen(false)
                  setIsLoading(false)
                  toast.error(
                    <CustomToast
                      message='Failed to copy the rule. Please try again.'
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
                }
              })
              .catch((error: any) => { })
          } else {
            toast.dismiss(toastId)
            setDialogOpen(false)
            setIsLoading(false)
          }
        })
      } else {
        let parsedJSON = yaml.load(selectedRows[0]?.yamlText)
        const blob = new Blob([selectedRows[0]?.yamlText], { type: 'text/plain' })
        const file = new File([blob], `${parsedJSON?.title}.yml`, { type: 'text/plain' })
        const data = new FormData()
        data.append('file', file)
        const deleteFilesIds: any = folderItem.map((row: any) => {
          return row.id
        })
        dispatch(workbenchyamlFileUpdate(deleteFilesIds, Number(selectedRows[0]?.id), data) as any)
          .then((res: any) => {
            if (res.type == 'UPDATE_YAML_FILE_SUCCESS') {
              toast.dismiss(toastId)
              setDialogOpen(false)
              setIsLoading(false)
              setFolderItem([])
              toast.success(
                <CustomToast
                  message={'Rule copied successfully'}
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
            } else {
              toast.dismiss(toastId)
              setDialogOpen(false)
              setIsLoading(false)
              toast.error(
                <CustomToast
                  message='Failed to copy the rule. Please try again.'
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
            }
          })
          .catch((error: any) => { })
      }
    } else if (importId) {
      const toastId = toast.loading(
        <CustomToast
          message='Your files are currently being copied.'
          onClose={() => toast.dismiss(toastId)} // Dismiss only this toast
        />,
        {
          duration: 1000000,
          position: 'top-center',
          style: {
            background: '#fff',
            color: '#000', // White text color
            width: '500px',
          },
        },
      )
      if (name) {
        let data = {
          name: name,
          description: describe,
        }
        dispatch(CollectiondataPost(data) as any).then((response: any) => {
          if (response.type === 'COLLECTION_POST_SUCCESS') {
            dispatch(
              CollectiondtoCollectionMultipleCopyPost(
                Number(importId),
                [response?.payload?.id],
                ids,
              ) as any,
            ).then((res: any) => {
              if (res.type == 'MULTIPLE_COLLECTION_TO_COLLECTION_COPY_POST_SUCCESS') {
                toast.dismiss(toastId)
                navigateTo(`/app/collectionsigmarule/${response?.payload?.id}`, {
                  state: { title: response?.payload?.name },
                })
                sessionStorage.setItem('active', 'newCtiArcheive')
                setDialogOpen(false)
                setIsLoading(false)
                setFolderItem([])
                toast.success(
                  <CustomToast
                    message='Rule copied successfully'
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
              } else {
                toast.error(
                  <CustomToast
                    message='Failed to copy the rule. Please try again.'
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
                toast.dismiss(toastId)
                setDialogOpen(false)
                setIsLoading(false)
              }
            })
          } else {
            toast.dismiss(toastId)
            setDialogOpen(false)
            setIsLoading(false)
          }
        })
      } else if (!name && changefolder?.name != '+ New') {
        const deleteFilesIds: any = folderItem.map((row: any) => {
          return row.id
        })
        dispatch(
          CollectiondtoCollectionMultipleCopyPost(Number(importId), deleteFilesIds, ids) as any,
        ).then((res: any) => {
          if (res.type == 'MULTIPLE_COLLECTION_TO_COLLECTION_COPY_POST_SUCCESS') {
            toast.dismiss(toastId)
            navigateTo(`/app/collectionsigmarule/${changefolder?.id}`, {
              state: { title: changefolder?.name },
            })
            sessionStorage.setItem('active', 'newCtiArcheive')
            setDialogOpen(false)
            setIsLoading(false)
            setFolderItem([])
            toast.success(
              <CustomToast
                message={
                  ids.length > 1 ? 'Rule(s) copied successfully' : 'Rule copied successfully'
                }
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
          } else {
            toast.error(
              <CustomToast
                message='Failed to copy the rule. Please try again.'
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
            toast.dismiss(toastId)
            setDialogOpen(false)
            setIsLoading(false)
          }
        })
      }
    } else if (pramasdata == 'ruleChat') {
      const toastId = toast.loading(
        <CustomToast
          message='Your files are currently being copied.'
          onClose={() => toast.dismiss(toastId)} // Dismiss only this toast
        />,
        {
          duration: 1000000,
          position: 'top-center',
          style: {
            background: '#fff',
            color: '#000', // White text color
            width: '500px',
          },
        },
      )

      if (uploaddata?.length > 0) {
        if (name) {
          let data = {
            name: name?.trimEnd(),
            description: describe?.trimEnd(),
          }
          dispatch(CollectiondataPost(data) as any).then((response: any) => {
            if (response.type === 'COLLECTION_POST_SUCCESS') {
              let getUploda: any = [];
              for (let i = 0; i < uploaddata?.length; i++) {
                let parsedJSON = yaml.load(selectedRows[i]?.content)
                const blob = new Blob([selectedRows[i]?.content], { type: 'text/plain' })
                const file = new File([blob], `${parsedJSON?.title}.yml`, { type: 'text/plain' })
                getUploda.push(file)
              }

              const data = new FormData()
              getUploda?.forEach((file: any) => {
                data.append('files', file)
              })
              if (getUploda?.length > 0) {
                dispatch(
                  workbenchMultiyamlFileUpdate(
                    response?.payload?.id,
                    id,
                    data,
                  ) as any,
                )
                  .then((res: any) => {
                    if (res.type == 'UPDATE_YAML_MULTI_FILE_SUCCESS') {
                      toast.dismiss(toastId)
                      setDialogOpen(false)
                      setIsLoading(false)
                      setFolderItem([])
                      toast.success(
                        <CustomToast
                          message={'Rule copied successfully'}
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
                    } else {
                      toast.dismiss(toastId)
                      setDialogOpen(false)
                      setIsLoading(false)
                      toast.error(
                        <CustomToast
                          message='Failed to copy the rule. Please try again.'
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
                    }
                  })
                  .catch((error: any) => { })
              }

            }
          })
        } else {
          let getUploda: any = [];
          for (let i = 0; i < uploaddata?.length; i++) {
            let parsedJSON = yaml.load(selectedRows[i]?.content)
            const blob = new Blob([selectedRows[i]?.content], { type: 'text/plain' })
            const file = new File([blob], `${parsedJSON?.title}.yml`, { type: 'text/plain' })
            getUploda.push(file)
          }

          const formData = new FormData()
          getUploda?.forEach((file: any) => {
            formData.append('files', file)
          })
          if (getUploda?.length > 0) {
            const deleteFilesIds: any = folderItem.map((row: any) => {
              return row.id
            });
            dispatch(workbenchMultiyamlFileUpdate(deleteFilesIds, id, formData) as any)
              .then((res: any) => {
                if (res.type == 'UPDATE_YAML_MULTI_FILE_SUCCESS') {
                  toast.dismiss(toastId)
                  setDialogOpen(false)
                  setIsLoading(false)
                  setFolderItem([])
                  toast.success(
                    <CustomToast
                      message={'Rule copied successfully'}
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
                } else {
                  toast.error(
                    <CustomToast
                      message='Failed to copy the rule. Please try again.'
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
                  toast.dismiss(toastId)
                  setDialogOpen(false)
                  setIsLoading(false)
                  toast.error(
                    <CustomToast
                      message='Failed to copy the rule. Please try again.'
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
                }
              })
              .catch((error: any) => { })
          }
        }
      }
    } else if (pramasdata == 'ctisigma') {
      const toastId = toast.loading(
        <CustomToast
          message='Your files are currently being copied.'
          onClose={() => toast.dismiss(toastId)} // Dismiss only this toast
        />,
        {
          duration: 1000000,
          position: 'top-center',
          style: {
            background: '#fff',
            color: '#000', // White text color
            width: '500px',
          },
        },
      )


      if (name) {
        const docId: any = selectedItems.map((row: any) => {
          return row.id
        })
        let data = {
          name: name?.trimEnd(),
          description: describe?.trimEnd(),
        }
        dispatch(CollectiondataPost(data) as any).then((response: any) => {
          if (response.type === 'COLLECTION_POST_SUCCESS') {
            dispatch(
              CollectiondataMultipleCopyPost(
                selectedRows[0]?.ctiReport?.id ? Number(selectedRows[0]?.ctiReport?.id) : 0,
                [response?.payload?.id],
                docId,
              ) as any,
            ).then((res: any) => {
              if (res.type == 'MULTIPLE_COLLECTION_COPY_POST_SUCCESS') {
                setIsLoading(false)
                navigateTo(`/app/collectionsigmarule/${response?.payload?.id}`, {
                  state: { title: response?.payload?.name },
                })
                sessionStorage.setItem('active', 'newCtiArcheive')
                toast.dismiss(toastId)
                toast.success(
                  <CustomToast
                    message='Rule copied successfully'
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
                setDialogOpen(false)
                setFolderItem([])
              } else {
                toast.dismiss(toastId)
                setDialogOpen(false)
                setIsLoading(false)
              }
            })
          } else {
            toast.dismiss(toastId)
            setDialogOpen(false)
            setIsLoading(false)
          }
        })
      } else if (!name && changefolder?.name != '+ New') {
        const deleteFilesIds: any = folderItem.map((row: any) => {
          return row.id
        })
        const docId: any = selectedItems.map((row: any) => {
          return row.id
        })
        dispatch(
          CollectiondataMultipleCopyPost(selectedRows[0]?.ctiReport?.id ? Number(selectedRows[0]?.ctiReport?.id) : 0, deleteFilesIds, docId) as any,
        ).then((res: any) => {
          if (res.type == 'MULTIPLE_COLLECTION_COPY_POST_SUCCESS') {
            toast.dismiss(toastId)
            sessionStorage.setItem('active', 'newCtiArcheive')
            navigateTo(`/app/collectionsigmarule/${changefolder?.id}`, {
              state: { title: changefolder?.name },
            })
            setDialogOpen(false)
            setIsLoading(false)
            setFolderItem([])
            toast.success(
              <CustomToast
                message={
                  docId.length > 1 ? 'Rule(s) copied successfully' : 'Rule copied successfully'
                }
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
          }
        })
      }
    } else if (pramasdata == 'ctiThreatbreif') {
      const toastId = toast.loading(
        <CustomToast
          message='Your files are currently being copied.'
          onClose={() => toast.dismiss(toastId)} // Dismiss only this toast
        />,
        {
          duration: 1000000,
          position: 'top-center',
          style: {
            background: '#fff',
            color: '#000', // White text color
            width: '500px',
          },
        },
      )
      if (name) {
        let data = {
          name: name?.trimEnd(),
          description: describe?.trimEnd(),
        }
        dispatch(CollectiondataPost(data) as any).then((response: any) => {
          if (response.type === 'COLLECTION_POST_SUCCESS') {
            dispatch(
              CollectiondtoCollectionThreatbreifPost([response?.payload?.id], [selectedRows[0]?.ctiReport?.id ? Number(selectedRows[0]?.ctiReport?.id) : 0]) as any,
            ).then((res: any) => {
              if (res.type == 'THREAT_BREIF_COLLECTION_TO_COLLECTION_COPY_POST_SUCCESS') {
                toast.dismiss(toastId)
                navigateTo(`/app/collectionsigmarule/${response?.payload?.id}`, {
                  state: { title: response?.payload?.name },
                })
                sessionStorage.setItem('active', 'newCtiArcheive')
                setDialogOpen(false)
                setIsLoading(false)
                setFolderItem([])
                toast.success(
                  <CustomToast
                    message='Rule copied successfully'
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
              } else {
                toast.error(
                  <CustomToast
                    message='Failed to copy the rule. Please try again.'
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
                toast.dismiss(toastId)
                setDialogOpen(false)
                setIsLoading(false)
              }
            })
          } else {
            toast.dismiss(toastId)
            setDialogOpen(false)
            setIsLoading(false)
          }
        })
      } else if (!name && changefolder?.name != '+ New') {
        const selectedId: any = folderItem.map((row: any) => {
          return row?.id
        })
        dispatch(CollectiondtoCollectionThreatbreifPost(selectedId, [selectedRows[0]?.ctiReport?.id ? Number(selectedRows[0]?.ctiReport?.id) : 0]) as any).then(
          (res: any) => {
            if (res.type == 'THREAT_BREIF_COLLECTION_TO_COLLECTION_COPY_POST_SUCCESS') {
              toast.dismiss(toastId)
              navigateTo(`/app/collectionsigmarule/${changefolder?.id}`, {
                state: { title: changefolder?.name },
              })
              sessionStorage.setItem('active', 'newCtiArcheive')
              setDialogOpen(false)
              setIsLoading(false)
              toast.success(
                <CustomToast
                  message={
                    ids.length > 1 ? 'Rule(s) copied successfully' : 'Rule copied successfully'
                  }
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
            } else {
              toast.error(
                <CustomToast
                  message='Failed to copy the rule. Please try again.'
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
              toast.dismiss(toastId)
              setDialogOpen(false)
              setIsLoading(false)
            }
          },
        )
      }
    } else {
      const toastId = toast.loading(
        <CustomToast
          message='Your files are currently being copied.'
          onClose={() => toast.dismiss(toastId)} // Dismiss only this toast
        />,
        {
          duration: 1000000,
          position: 'top-center',
          style: {
            background: '#fff',
            color: '#000', // White text color
            width: '500px',
          },
        },
      )
      if (name) {
        let data = {
          name: name?.trimEnd(),
          description: describe?.trimEnd(),
        }
        dispatch(CollectiondataPost(data) as any).then((response: any) => {
          if (response.type === 'COLLECTION_POST_SUCCESS') {
            dispatch(
              CollectiondtoCollectionMultipleCopyPost(
                id ? Number(id) : 0,
                [response?.payload?.id],
                ids,
              ) as any,
            ).then((res: any) => {
              if (res.type == 'MULTIPLE_COLLECTION_TO_COLLECTION_COPY_POST_SUCCESS') {
                toast.dismiss(toastId)
                navigateTo(`/app/collectionsigmarule/${response?.payload?.id}`, {
                  state: { title: response?.payload?.name },
                })
                sessionStorage.setItem('active', 'newCtiArcheive')
                setDialogOpen(false)
                setIsLoading(false)
                setFolderItem([])
                toast.success(
                  <CustomToast
                    message='Rule copied successfully'
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
              } else {
                toast.error(
                  <CustomToast
                    message='Failed to copy the rule. Please try again.'
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
              }
              toast.dismiss(toastId)
              setDialogOpen(false)
              setIsLoading(false)
            })
          } else {
            toast.dismiss(toastId)
            setDialogOpen(false)
            setIsLoading(false)
          }
        })
      } else if (!name && changefolder?.name != '+ New') {
        const deleteFilesIds: any = folderItem.map((row: any) => {
          return row.id
        })
        dispatch(
          CollectiondtoCollectionMultipleCopyPost(id ? Number(id) : 0, deleteFilesIds, ids) as any,
        ).then((res: any) => {
          if (res.type == 'MULTIPLE_COLLECTION_TO_COLLECTION_COPY_POST_SUCCESS') {
            toast.dismiss(toastId)
            navigateTo(`/app/collectionsigmarule/${changefolder?.id}`, {
              state: { title: changefolder?.name },
            })
            sessionStorage.setItem('active', 'newCtiArcheive')
            setDialogOpen(false)
            setIsLoading(false)
            setFolderItem([])
            toast.success(
              <CustomToast
                message={
                  ids.length > 1 ? 'Rule(s) copied successfully' : 'Rule copied successfully'
                }
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
          } else {
            toast.error(
              <CustomToast
                message='Failed to copy the rule. Please try again.'
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
            toast.dismiss(toastId)
            setDialogOpen(false)
            setIsLoading(false)
          }
        })
      }
    }
  }

  const filterdata: any =
    collectiondata?.length > 0
      ? collectiondata?.filter((collection: any) =>
        collection.name.toLowerCase().includes(search.toLowerCase()),
      )
      : []
  const [error, setError] = useState(false as any)
  useEffect(() => {
    const nameerror =
      collectiondata?.length > 0
        ? collectiondata?.find((x: any) => x?.name?.toLowerCase() == name?.toLowerCase())
        : []
    if (nameerror) {
      setError(true)
    } else {
      setError(false)
    }
  }, [name])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && name) {
      handleSave(); // Trigger save logic when Enter is pressed and input is not empty
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && name) {
      handleSave(); // Trigger save logic when Enter is pressed and input is not empty
    }
  };

  return (
    <div className='fixed inset-0 bg-[#0C111D] bg-opacity-50 flex items-center justify-center'>
      {/* Set width and height here */}
      <div className='bg-[#1D2939] rounded-xl p-6 flex flex-col gap-6  justify-start w-[70%] h-[75%] shadow-xl overflow-hidden relative'>
        <div className='flex justify-between items-start mb-4'>
          <h2 className='text-lg font-semibold'>
            Save rules to a collection for testing and deployment
          </h2>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-200'>
            ✕
          </button>
        </div>

        <div className='w-full h-full p-6 bg-[#101828] rounded-lg overflow-scroll hide-scrollbar flex gap-6'>
          {/* Rules Section */}
          <div className='flex flex-col items-start gap-4 overflow-y-auto pr-1 scrollbar-hide w-[40%]'>
            <div className='text-white text-lg font-medium'>Rules</div>

            <div className='flex flex-wrap gap-2  overflow-y-auto max-h-[90%] scrollbar-hide  w-full'>
              {selectedRows.map((item: any, index: any) => (
                <div key={item} className='flex justify-start items-center gap-3 max-md:gap-0'>
                  {pramasdata != 'workbench' && (
                    <CustomCheckbox
                      checked={checkedItems[index]}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  )}
                  <BootstrapTooltip title={item?.title} arrow placement='bottom'>
                    <span className='text-white text-md font-medium w-full break-all line-clamp-1 cursor-pointer max-md:text-sm'>
                      {item.title}
                    </span>
                  </BootstrapTooltip>
                </div>
              ))}
            </div>
          </div>

          {/* vertical Divider */}
          <div className='w-px h-full bg-[#3E4B5D]'></div>

          {/* Collections Section */}
          <div className='flex flex-col items-start gap-4 flex-1 w-full'>
            {/* Header with Search */}
            {(!changefolder?.name || changefolder?.name != '+ New') && (
              <div className='flex justify-between items-center w-full gap-4 flex-wrap'>
                <span className='text-white text-lg font-medium'>Collections</span>
                <TextField
                  placeholder='Search'
                  variant='outlined'
                  size='small'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <SearchIcon style={{ color: '#667085' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#D0D5DD',
                      },
                    },
                  }}
                />
              </div>
            )}

            {/* Collections Cards */}
            {changefolder?.name != '+ New' && (
              <div className='grid grid-cols-2 max-md:grid-cols-1 gap-2  overflow-y-auto max-h-[90%] scrollbar-hide  w-full'>
                {filterdata
                  ?.filter((text: any) => {
                    return text?.name != state?.title
                  })
                  ?.map((text: any, index: any) => (
                    <div
                      key={index}
                      onClick={() => handleFolderChange(index, text)}
                      className={`flex items-center  p-4 max-md:p-2 w-full h-[70px] rounded-lg cursor-pointer ${text.name === '+ New'
                        ? 'border-dotted border border-[#59687C]'
                        : text.name === folderItem.find((x: any) => x.id == text.id)?.name &&
                          changefolder != '+ New'
                          ? 'border border-[#EE7103]'
                          : 'bg-[#1D2939]'
                        }`}
                    >
                      {text.name != folderItem.find((x: any) => x.id == text.id)?.name &&
                        changefolder?.name != '+ New' ? (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='56'
                          height='56'
                          viewBox='0 0 56 56'
                          fill='none'
                          className='max-md:w-[40px] max-md:h-[40px]'
                        >
                          <path
                            d='M30.3332 16.3333L27.7302 11.1275C26.9811 9.62921 26.6065 8.88004 26.0477 8.33272C25.5535 7.8487 24.9579 7.48061 24.304 7.25506C23.5646 7 22.727 7 21.0518 7H12.1332C9.51959 7 8.2128 7 7.21455 7.50864C6.33646 7.95605 5.62255 8.66995 5.17514 9.54804C4.6665 10.5463 4.6665 11.8531 4.6665 14.4667V16.3333M4.6665 16.3333H40.1332C44.0535 16.3333 46.0137 16.3333 47.5111 17.0963C48.8282 17.7674 49.8991 18.8383 50.5702 20.1554C51.3332 21.6528 51.3332 23.613 51.3332 27.5333V37.8C51.3332 41.7204 51.3332 43.6805 50.5702 45.1779C49.8991 46.4951 48.8282 47.5659 47.5111 48.237C46.0137 49 44.0535 49 40.1332 49H15.8665C11.9461 49 9.98595 49 8.48857 48.237C7.17144 47.5659 6.10057 46.4951 5.42946 45.1779C4.6665 43.6805 4.6665 41.7204 4.6665 37.8V16.3333Z'
                            stroke='#657890'
                            stroke-width='2'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='57'
                          height='56'
                          viewBox='0 0 57 56'
                          fill='none'
                          className='max-md:w-[40px] max-md:h-[40px]'
                        >
                          <path
                            d='M30.6667 16.3333L28.0637 11.1275C27.3146 9.62921 26.94 8.88004 26.3812 8.33272C25.887 7.8487 25.2914 7.48061 24.6375 7.25506C23.898 7 23.0605 7 21.3853 7H12.4667C9.85309 7 8.5463 7 7.54804 7.50864C6.66995 7.95605 5.95605 8.66995 5.50864 9.54804C5 10.5463 5 11.8531 5 14.4667V16.3333M5 16.3333H40.4667C44.387 16.3333 46.3472 16.3333 47.8446 17.0963C49.1617 17.7674 50.2326 18.8383 50.9037 20.1554C51.6667 21.6528 51.6667 23.613 51.6667 27.5333V37.8C51.6667 41.7204 51.6667 43.6805 50.9037 45.1779C50.2326 46.4951 49.1617 47.5659 47.8446 48.237C46.3472 49 44.387 49 40.4667 49H16.2C12.2796 49 10.3194 49 8.82207 48.237C7.50493 47.5659 6.43407 46.4951 5.76295 45.1779C5 43.6805 5 41.7204 5 37.8V16.3333ZM21.3333 32.6667L26 37.3333L36.5 26.8333'
                            stroke='#309F00'
                            stroke-width='2'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                        </svg>
                      )}

                      <span
                        className={`${text.name === '+ New' ? 'text-[#59687C]' : 'text-white'
                          } text-lg font-bold w-[80%] truncate ml-2 max-md:text-sm`}
                      >
                        {text.name}
                      </span>
                    </div>
                  ))}
              </div>
            )}
            {changefolder?.name && changefolder?.name == '+ New' && (
              <div className='flex-1 flex flex-col justify-start items-start gap-4 w-full'>
                {/* Back and Title Section */}
                <div className='text-white text-lg font-medium leading-6 space-y-2 w-full max-md:!text-sm'>
                  <span
                    className='text-[#EE7103] cursor-pointer'
                    onClick={() => {
                      setChangeFolder(null), setFolderItem([])
                    }}
                  >
                    {'< Back'}
                  </span>
                  <span> / Create New Collection</span>
                  <br />
                  <span className='text-[#59687C]'>
                    Your rule selections will be copied to this new collection for testing
                  </span>
                </div>

                {/* Name Input */}
                <div className='h-15 flex flex-col justify-center items-start gap-1 w-full'>
                  <label className='w-[88.27px] text-[#BAC7DF] text-base font-normal flex items-center gap-1'>
                    <span className='text-[#EE7103]'>*</span> Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder='Give the collection a name'
                    className='w-full h-10 p-2 bg-[#37485E] text-[#98A2B3] rounded-lg resize-none max-md:h-20'
                  />
                  {error && (
                    <p className='text-red-500 mt-1'>{'The collection name already exists'}</p>
                  )}
                </div>

                {/* Description Textarea */}
                <div className='h-[151px] flex flex-col justify-center items-start gap-1 w-full'>
                  <label className='w-full text-[#BAC7DF] text-base font-normal'>Description</label>
                  <textarea
                    value={describe}
                    onChange={(e) => setDescribe(e.target.value)}
                    // onChange={handleOnChange}
                    onKeyDown={handleKeyDown}
                    placeholder='Describe the collection (Optional)'
                    className='w-full h-[127px] p-2 bg-[#37485E] text-[#98A2B3] rounded-lg resize-none'
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='flex justify-end space-x-2 mt-6'>
          {isLoading && (
            <button
              onClick={handleClose}
              className='px-6 py-1  text-gray-800  transition flex items-center space-x-2'
              disabled={isLoading}
            >
              {isLoading && (
                <span className='loader w-4 h-4 border-2 border-t-transparent border-orange-500 rounded-full animate-spin'></span>
              )}
              <span className='text-orange-500'>{'File copying...'}</span>
            </button>
          )}

          <button
            onClick={onClose}
            className='px-6 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition'
          >
            Close
          </button>

          <button
            onClick={handleSave}
            disabled={
              !isLoading
                ? selectedItems.length > 0
                  ? folderItem?.length === 0 ||
                  !changefolder ||
                  (changefolder?.name === '+ New' && !name) ||
                  error
                  : true
                : isLoading
            }
            className={`px-6 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition ${(
              !isLoading
                ? selectedItems.length == 0 ||
                folderItem?.length === 0 ||
                !changefolder ||
                (changefolder?.name === '+ New' && !name) ||
                error
                : isLoading
            )
              ? 'cursor-not-allowed opacity-50 hover'
              : 'cursor-pointer hover:bg-[#6941c6]'
              }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default CopyAndNewCollectionsDialog
