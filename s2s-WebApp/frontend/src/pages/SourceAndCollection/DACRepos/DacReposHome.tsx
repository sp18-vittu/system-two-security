import { useEffect, useState } from 'react'
import DacReposFolder from './DacReposFolder'
import AddDacRepos from './AddDacRepos'
import AddDacReposModal from './AddDacReposModal'
import RepoProcessDialog from './RepoProcessDialog'
import { useDispatch } from 'react-redux'
import { CloanRepodataPost, ImportRuleViewList } from '../../../redux/nodes/Imports/action'
import CustomToast from '../../../layouts/App/CustomToast'
import toast from 'react-hot-toast'

function DacReposHome({ dacFolderList, setDeleteimport }: any) {
  const dispatch = useDispatch()
  const [isModalOpen, setModalOpen] = useState(false)
  const [processModalOpen, setProcessModalOpen] = useState(false)
  const [selectId, setSelectId] = useState(null as any)
  const [uploadFile, setUploadFile] = useState(null as any)
  const [dacfoldersList, setDacFoldersList] = useState([] as any)
  const [repoandinput, setReposandInput] = useState(true)
  const [page, setPage] = useState(0); // MUI uses 0-based index
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [isLoading, setisLoading] = useState(false)

  const splitGithubUrl = (url: string) => {
    const path = url.replace('https://github.com/', '')
    const [organization, repository] = path.split('/')
    return { organization, repository }
  }

  const handleProcessModal = (data: any) => {
    const { organization, repository } = splitGithubUrl(data?.url);
    const listdac: any = dacFolderList?.find((item: any) => item.name?.toLowerCase() === organization?.toLowerCase())
    const repos: any = listdac?.children?.some((item: any) => item?.name?.toLowerCase() === repository?.toLowerCase())
    if (!repos) {
      setProcessModalOpen(true)

      let gitCloneRepo: any = {
        organization: organization,
        repository: repository,
        gittoken: data?.apiToken ? data?.apiToken : null,
      }
      setTimeout(() => {
        setProcessModalOpen(false),
          setDeleteimport('delete')
      }, 5000)
      dispatch(CloanRepodataPost(gitCloneRepo) as any).then((response: any) => {
        if (response.type === 'CLOAN_REPO_POST_SUCCESS') {
          setProcessModalOpen(false),
            setDeleteimport('delete')
          toast.success(
            <CustomToast
              message='Folder created successfully.'
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
        } else if (response.type === 'CLOAN_REPO_POST_FAILED') {
          setProcessModalOpen(false)
          setReposandInput(false)
          setModalOpen(true)
          toast.error(
            <CustomToast
              message={response.msg}
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
    } else {
      toast.error(
        <CustomToast
          message={'This Repository already exists'}
          onClose={() => toast.dismiss()} // Dismiss only this toast
        />,
        {
          duration: 2000,
          position: 'top-center',
          style: {
            background: '#fff',
            color: '#000', // White text color
            width: '500px',
          },
        },
      )
    }
  }

  useEffect(() => {
    if (selectId?.id || uploadFile == 'add') {
      setisLoading(true);
      let isDAC: any = {
        isDAC: true,
        offset: page,
        pageSize: pageSize
      }
      dispatch(ImportRuleViewList(selectId?.id, isDAC) as any).then((res: any) => {
        if (res.type == 'IMPORT_RULE_GET_SUCCESS') {
          if (res.payload.content.length > 0) {
            setDacFoldersList(res.payload.content)
            setUploadFile(null)
            setTotalRows(res.payload.totalElements);
            setisLoading(false);
          } else {
            setisLoading(false);
            setDacFoldersList([])
          }
        } else {
          setisLoading(false);
          setDacFoldersList([])
        }
      })
    }
  }, [selectId, uploadFile])

  useEffect(() => {
    if (selectId?.id) {
      const fetchData = async () => {
        setisLoading(true);
        let isDAC: any = {
          isDAC: true,
          offset: page * 10,
          pageSize: pageSize
        }
        dispatch(ImportRuleViewList(selectId?.id, isDAC) as any).then((res: any) => {
          if (res.type == 'IMPORT_RULE_GET_SUCCESS') {
            if (res.payload.content.length > 0) {
              setDacFoldersList(res.payload.content)
              setUploadFile(null)
              setTotalRows(res.payload.totalElements);
              setisLoading(false);
            } else {
              setDacFoldersList([])
              setisLoading(false);
            }
          } else {
            setDacFoldersList([])
            setisLoading(false);
          }
        })
      }

      fetchData();
    }
  }, [page, pageSize]);

  return (
    <>
      <div className='w-full h-full'>
        <div className='box-border flex flex-row gap-6 h-[calc(100vh-350px)] lg:max-h-[calc(100vh-350px)] max-lg:min-h-[300px] overflow-scroll hide-scrollbar items-start justify-start relative  max-lg:flex-col'>
          <div className='w-1/3 h-full max-lg:max-h-[800px] max-lg:min-h-[500px] overflow-scroll hide-scrollbar max-lg:w-full'>
            <DacReposFolder
              setModalOpen={setModalOpen}
              selectId={selectId}
              setSelectId={setSelectId}
              dacFolderList={dacFolderList}
              setDeleteimport={setDeleteimport}
              setUploadFile={setUploadFile}
              setPage={setPage}
              setPageSize={setPageSize}
            />
          </div>
          <div className='w-2/3 h-full overflow-scroll hide-scrollbar max-lg:w-full max-lg:min-h-[500px]'>
            <AddDacRepos
              setModalOpen={setModalOpen}
              selectId={selectId}
              dacfoldersList={dacfoldersList}
              setUploadFile={setUploadFile}
              isLoading={isLoading}
              page={page}
              setPage={setPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalRows={totalRows}
            />
          </div>
        </div>
      </div>
      <AddDacReposModal
        isOpen={isModalOpen}
        onClose={() => { setModalOpen(false), setReposandInput(true) }}
        setProcessModalOpen={handleProcessModal}
        repoandinput={repoandinput}
        setReposandInput={setReposandInput}
      />
      <RepoProcessDialog isOpen={processModalOpen} />
    </>
  )
}

export default DacReposHome
