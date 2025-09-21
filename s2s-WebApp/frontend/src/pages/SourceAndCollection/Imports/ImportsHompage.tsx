import { useEffect, useState } from 'react'
import ImportsFolders from './ImportsFolders'
import ImportsFileUpload from './ImportsFileUpload'
import { useDispatch } from 'react-redux'
import { ImportRuleViewList } from '../../../redux/nodes/Imports/action'
import ImportsFileTable from './ImportsFileTable'
import NewFolderModal from './NewFolderModal'
import FolderConfirmationDialog from '../Collection/FolderConfirmationDialog'
import { useData } from '../../../layouts/shared/DataProvider'

function ImportsHompage({ importFolderList, setDeleteimport }: any) {

  const { Importing, setImporting }: any = useData()
  const [selectId, setSelectId] = useState(null as any)
  const [selectFolders, setSelectFolders] = useState(null as any)
  const [importFolders, setImportFolders] = useState(true as any)
  const [foldersList, setFoldersList] = useState([] as any)
  const [uploadFile, setUploadFile] = useState(null as any)
  const [isModalOpen, setModalOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const dispatch = useDispatch()
  const [isLoading, setisLoading] = useState(false)

  const [page, setPage] = useState(0); // MUI uses 0-based index
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    setisLoading(true)
    if (selectFolders?.id || uploadFile == 'add') {
      let isDAC: any = {
        isDAC: false,
        offset: page,
        pageSize: pageSize
      }
      dispatch(ImportRuleViewList(selectFolders?.id, isDAC) as any).then((res: any) => {
        if (res.type == 'IMPORT_RULE_GET_SUCCESS') {
          setisLoading(false)
          if (res?.payload?.content?.length > 0) {
            setFoldersList(res.payload.content)
            setImportFolders(false)
            setUploadFile(null)
            setTotalRows(res.payload.totalElements);
          } else {
            setFoldersList([])
            setImportFolders(true)
            setUploadFile(null)
          }
        } else {
          setFoldersList([])
          setImportFolders(true)
          setisLoading(false)
          setUploadFile(null)
        }
      })
    }

    if (!selectFolders) {
      setImportFolders(true)
      setFoldersList([])
      setisLoading(false)
    }
  }, [selectFolders, uploadFile])

  const handleDelete = () => {
    setModalOpen(true)
    setIsDialogOpen(false)
  }

  useEffect(() => {
    if (selectFolders?.id) {
      const fetchData = async () => {
        setisLoading(true);
        let isDAC: any = {
          isDAC: false,
          offset: page * 10,
          pageSize: pageSize
        }

        dispatch(ImportRuleViewList(selectFolders?.id, isDAC) as any).then((res: any) => {
          if (res.type == 'IMPORT_RULE_GET_SUCCESS') {
            setisLoading(false)
            if (res?.payload?.content?.length > 0) {
              setFoldersList(res.payload.content)
              setImportFolders(false)
              setUploadFile(null)
              setTotalRows(res.payload.totalElements);
            } else {
              setFoldersList([])
              setImportFolders(true)
              setUploadFile(null)
            }
          } else {
            setFoldersList([])
            setImportFolders(true)
            setisLoading(false)
            setUploadFile(null)
          }
        })
      }

      fetchData();
    }
  }, [page, pageSize]);

  return (
    <div className='w-full h-full'>
      <div className='box-border flex flex-row gap-6 h-[calc(100vh-350px)] lg:max-h-[calc(100vh-350px)] max-lg:min-h-[300px] overflow-scroll hide-scrollbar items-start justify-start relative  max-lg:flex-col'>
        <div className='w-1/3 h-full max-lg:max-h-[800px] max-lg:min-h-[500px] overflow-scroll hide-scrollbar max-lg:w-full'>
          <ImportsFolders
            importFolderList={importFolderList}
            setSelectFolders={setSelectFolders}
            selectFolders={selectFolders}
            setDeleteimport={setDeleteimport}
            setUploadFile={setUploadFile}
            isModalOpen={isModalOpen}
            setModalOpen={setModalOpen}
            setisLoading={setisLoading}
            Importing={Importing}
            setImportFolders={setImportFolders}
            importFolders={importFolders}
            setSelectId={setSelectId}
            selectId={selectId}
            setPage={setPage}
            setPageSize={setPageSize}
          />
        </div>
        <div className='w-2/3 h-full overflow-scroll hide-scrollbar max-lg:w-full max-lg:min-h-[500px]'>
          {foldersList.length > 0 && !importFolders ? (
            <ImportsFileTable
              selectFolders={selectFolders}
              foldersList={foldersList}
              setImportFolders={setImportFolders}
              setFoldersList={setFoldersList}
              setUploadFile={setUploadFile}
              isLoading={isLoading}
              page={page}
              setPage={setPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalRows={totalRows}
            />
          ) : (
            ((foldersList.length == 0 && importFolders) ||
              (foldersList.length == 0 && importFolders)) && (
              <ImportsFileUpload selectFolders={selectFolders} setUploadFile={setUploadFile} foldersList={importFolderList} setIsDialogOpen={setIsDialogOpen} isLoading={isLoading} setImporting={setImporting} setDeleteimport={setDeleteimport} />
            )
          )}
        </div>
      </div>

      <NewFolderModal
        isOpen={isModalOpen}
        onClose={() => { setModalOpen(false), setSelectFolders(importFolderList[0]) }}
        setModalOpen={setModalOpen}
        setisPost={setDeleteimport}
        cardList={importFolderList}
        selectFolders={selectFolders}
        setUploadFile={setDeleteimport}
        setSelectFolders={setSelectFolders}
        setSelectId={setSelectId}
      />
      <FolderConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
        }}
        onConfirm={handleDelete}
        message='Do you want to create a folder to import rules.'
      />
    </div>
  )
}

export default ImportsHompage
