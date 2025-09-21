import React, { useEffect, useState } from 'react'
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined'
import { useDispatch } from 'react-redux'
import Tooltip from '@mui/material/Tooltip'
import Radio from '@mui/material/Radio'
import { useData } from '../../layouts/shared/DataProvider'
import { addBulkCtiReport } from '../../redux/nodes/bulk-ctiReport/action'
import {
  CREATE_VIEWFILE_VAULT_FAILED,
  CREATE_VIEWFILE_VAULT_SUCCESS,
  deletemultipledocument,
} from '../../redux/nodes/repository/action'
import local from '../../utils/local'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../redux/nodes/api'
import { dataIngestion } from '../../redux/nodes/datavault/action'

const yaml = require('js-yaml')

const CopyandmoveDrawer = ({ open, vaultList, setCopyFileOpen }: any) => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigateTo = useNavigate()
  const [showTooltip, setShowTooltip] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<any | null>(null)

  const { copyFiles, setCopyFiles, setData }: any = useData()

  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)

  const handleSelect = (folderName: any) => {
    setSelectedFile(folderName)
    setSelectedFolder(folderName.name) // Set the selected folder (only one can be selected)
  }

  const handleClear = () => {
    setCopyFileOpen(false)
    setSelectedFolder(null) // Clear the selected folder
  }

  useEffect(() => {
    if (copyFiles?.from == 'vaultPermission') {
      getYamlFiles()
    }
  }, [copyFiles?.from])
  const [ymlTexts, setYmlTexts] = useState([] as any)
  const getYamlFiles = async () => {
    if (copyFiles?.value?.selectSigma?.length > 0) {
      try {
        let queryArray: any = []
        for (let i = 0; i < copyFiles?.value?.selectSigma?.length; i++) {
          await api
            .get(`/data/document/${copyFiles?.value?.selectSigma[i]?.id}`, {
              responseType: 'blob',
              headers: {
                Authorization: `${token.bearerToken}`,
              },
              params: { global: copyFiles?.value?.selectSigma[i]?.global },
            })
            .then((respons: any) => {
              let fileName = copyFiles?.value?.selectSigma[i]?.name
              let file = new File([respons.data], fileName)
              const reader = new FileReader()
              reader.onload = (e: any) => {
                const fileText = e.target.result
                queryArray = [...queryArray, fileText]
                setYmlTexts([...queryArray])
              }
              reader.readAsText(file)
            })
        }

        dispatch({ type: CREATE_VIEWFILE_VAULT_SUCCESS })
      } catch (error: any) {
        dispatch({ type: CREATE_VIEWFILE_VAULT_FAILED, payload: error.message })
      }
    }
  }

  const handleSave = () => {
    if (copyFiles?.from == 'vaultPermission') {
      let datavalut = vaultList.find((x: any) => x.id === selectedFile.id)
      const repotIds = {
        datavaultId: datavalut?.id,
        ctiId: 0,
      }

      sessionStorage.setItem('vault', JSON.stringify(datavalut))
      const data = new FormData()
      for (let i = 0; i < ymlTexts?.length; i++) {
        let parsedJSON: any = yaml.load(ymlTexts[i])
        const blob = new Blob([ymlTexts[i]], { type: 'text/plain' })
        const file = new File([blob], `${parsedJSON?.title}.yml`, { type: 'text/plain' })

        data.append('files', file)
      }

      dispatch(dataIngestion(data, repotIds) as any)
        .then((datas: any) => {
          if (datas.type == 'CREATE_NEW_DATAINGESTION_SUCCESS') {
            sessionStorage.setItem('active', 'newCtiArcheive')
            sessionStorage.removeItem('vaultdata')
            navigateTo(`/app/VaultPermission/${datavalut?.id}`, {
              state: [{ checked: false }],
            })
            setCopyFileOpen(false)
            setData('FILE_UPLOADED')
            setCopyFiles({ vaultList: 'pastsigmafile' })
          }
        })
        .catch((error: any) => {
          console.log('error', error)
        })
    } else if (copyFiles?.from == 'repository') {
      setShowTooltip(true)
      setTimeout(() => {
        setShowTooltip(false) // Hide after 2 seconds
      }, 2000)
      let temp: any = []
      copyFiles?.value?.totalSelectedCheckboxes?.forEach((ctiValue: any) => {
        temp.push({ TITLE: ctiValue.ctiName, URL: ctiValue.url })
      })
      let obj = {
        'cti-infos': temp,
      }
      const blob = new Blob([JSON.stringify(obj)], {
        type: 'application/json',
      })
      const data = new FormData()
      data.append('report-file', blob)
      dispatch(addBulkCtiReport(data, selectedFile.id) as any)
        .then(() => {
          if (copyFiles?.value.mode == 'moveTo') {
            let ids = copyFiles?.value?.totalSelectedCheckboxes?.map((item: any) => item.id)
            dispatch(deletemultipledocument(token, ids) as any)
          }
          sessionStorage.setItem('vault', JSON.stringify(selectedFile))
          navigateTo(`/app/Repository/${selectedFile.id}`, {
            state: { valtName: selectedFile?.name },
          })
          setCopyFiles(null)
          setCopyFileOpen(false)
          setSelectedFile(null)
        })
        .catch((err: any) => console.log('err', err))
    }
  }

  console.log('ymlTexts===============>>', ymlTexts)

  return (
    <div
      className={`bg-[#101828] fixed right-0 top-[110px] h-screen w-[450px] transition-all duration-300 ease-in z-50
        ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
    >
      <div className='relative'>
        <div id='list' className={`p-[24px]`} onClick={(e) => e.stopPropagation()}>
          <div className='flex justify-between items-center mb-4'>
            <p className='text-white text-md'>Select Repository</p>
            <div className='flex space-x-2'>
              <Tooltip
                title={copyFiles?.value?.mode == 'copyTo' ? 'Copy' : 'Move'}
                open={showTooltip}
                disableHoverListener
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: 'white', // Change background color
                      color: '#000', // Change text color
                      fontSize: '14px', // Optional: adjust font size
                    },
                  },
                }}
              >
                <button
                  className='px-[10px] py-[6px] bg-[#EE7103] rounded-xl flex gap-[4px]'
                  onClick={handleSave}
                >
                  <span>
                    <p className='text-sm font-semibold text-[#fff]'>
                      {copyFiles?.value?.mode == 'copyTo' ? 'Copy' : 'Move'}
                    </p>
                  </span>
                </button>
              </Tooltip>
              <button
                className='px-[10px] py-[6px] text-[black] bg-[white] rounded-xl flex gap-[4px] justify-center items-center'
                onClick={handleClear}
              >
                <span>
                  <p className='text-sm font-semibold'>Cancel</p>
                </span>
              </button>
            </div>
          </div>

          <div className='h-[800px] overflow-y-auto'>
            {vaultList.map((valtName: any, index: any) => (
              <div key={index} className='flex items-center space-x-2 mb-2 text-white'>
                <Radio
                  checked={selectedFolder === valtName?.name && id != selectedFile.id} // Check if this folder is selected
                  onChange={() => handleSelect(valtName)}
                  sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} // Style the radio button
                />
                <FolderCopyOutlinedIcon />
                <span>{valtName?.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CopyandmoveDrawer
