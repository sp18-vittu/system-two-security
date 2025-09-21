import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { FolderDelete } from '../../../redux/nodes/Imports/action'
import DeleteConfirmationDialog from '../Collection/DeleteConfirmationDialog'
import useWindowResolution from '../../../layouts/Dashboard/useWindowResolution'
import { useData } from '../../../layouts/shared/DataProvider'

const FolderTreeView = ({
  data,
  setSelectFolders,
  selectFolders,
  setDeleteimport,
  setModalOpen,
  setSelectId,
  selectId,
  setisLoading,
  Importing,
  setImportFolders,
  importFolders,
  setUploadFile
}: any) => {
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
  const [isdelDialogOpen, setIsdleDialogOpen] = useState(false)
  const dispatch = useDispatch()
  const {
    impFolderId,
    setImpFolderId,
    setImportViewRule,
  }: any = useData();

  const toggleNode = (e: any, id: any, node: any) => {
    e.stopPropagation()
    setSelectFolders(node)
    setSelectId(id)
    setImpFolderId(null);
    setImportViewRule(null);
    setisLoading(true)
    if (importFolders) {
      setUploadFile("add")
    }
    if (expandedNodes?.includes(id)) {
      setExpandedNodes(expandedNodes?.filter((nodeId) => nodeId !== id))
    } else {
      if (expandedNodes) {
        setExpandedNodes([...expandedNodes, id])
      } else {
        setExpandedNodes([id])
      }
    }
  }

  const onDeleteFolder = () => {
    setIsdleDialogOpen(true)
  }

  const handleDelete = () => {
    let isDAC = false
    dispatch(FolderDelete(selectFolders.id, isDAC) as any)
      .then((res: any) => {
        if (res.type == 'IMPORT_TREEVIEW_DELETE_SUCCESS') {
          setDeleteimport('delete')
          setSelectFolders(null)
          setIsdleDialogOpen(false)
          setSelectId(null);
        }
      })
      .catch((err: any) => { })
  }

  const findParentHierarchyWithObjects = (
    data: any[],
    childId: any,
    hierarchy: { id: any; node: any }[] = []
  ): { id: any; node: any }[] | null => {
    for (let node of data) {
      if (node.children) {
        for (let child of node.children) {
          if (child.id === childId) {
            return [...hierarchy, { id: node.id, node }, { id: child.id, node: child }];
          }
        }
        const parentHierarchy = findParentHierarchyWithObjects(node.children, childId, [...hierarchy, { id: node.id, node }]);
        if (parentHierarchy) return parentHierarchy;
      }
    }
    return null;
  };

  useEffect(() => {
    if (data.length > 0 && impFolderId) {
      const parent: any = findParentHierarchyWithObjects(data, impFolderId?.id);
      const exandId: any = parent?.map((x: any) => {
        return x.id
      })
      const findObject: any = parent?.find((x: any) => x.id == impFolderId.id)
      setSelectId(impFolderId?.id)
      setSelectFolders(impFolderId);
      setExpandedNodes(exandId);
      // setImpFolderId(null)
    }
    if (data?.length > 0 && !selectId) {
      setSelectFolders(data[0]);
    }

  }, [data, selectId, impFolderId])

  const renderTree = (nodes: any[]) => {
    let importId: any = sessionStorage.getItem('importid')
    return nodes?.map((node) => (
      <div key={node?.id} className='ml-2'>
        <div
          className={`flex  gap-3 rounded-md  ${selectFolders?.id == node.id ? 'border border-[#ee7103]' : ''
            } p-2 cursor-pointer hover:bg-gray-700 items-center`}
          onClick={(e: any) => toggleNode(e, node.id, node)}
        >
          {node?.children && (
            <>
              {expandedNodes?.includes(node.id) ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <path
                    d='M6 9L12 15L18 9'
                    stroke='#657890'
                    stroke-width='2'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <path
                    d='M9 18L15 12L9 6'
                    stroke='#657890'
                    stroke-width='2'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
              )}
            </>
          )}
          {!node?.children && (<div className="w-6 h-6"></div>)}
          {selectFolders?.id == node?.id ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
            >
              <path
                d='M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803C22 9.27976 22 10.1198 22 11.8V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7ZM9 14L11 16L15.5 11.5'
                stroke='#309F00'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
            >
              <path
                d='M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803C22 9.27976 22 10.1198 22 11.8V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7Z'
                stroke='#657890'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
            </svg>
          )}
          <span className='text-white text-sm w-[80%] truncate'>{node?.name}</span>
          {selectFolders?.id == node.id && (
            <div className='flex items-end justify-between ml-auto'>
              {Importing && importId == node.id ? (<div className="badge border-solid border-2 border-[#1570EF] rounded-xl px-2 py-1 flex items-center justify-start">
                <div className="text text-[#1570EF] text-xs font-medium">{'Importing...'}</div>
              </div>) : (
                <>
                  <svg
                    className='mr-[10px]'
                    onClick={(e: any) => { e.stopPropagation(), setModalOpen(true) }}
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <path
                      d='M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803C22 9.27976 22 10.1198 22 11.8V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7ZM12 17V11M9 14H15'
                      stroke='#657890'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                  <svg
                    onClick={(e: any) => { e.stopPropagation(), onDeleteFolder() }}
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <path
                      d='M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M10 11.5V16.5M14 11.5V16.5M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6'
                      stroke='#657890'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                </>
              )}

            </div>
          )}
        </div>
        {node?.children && expandedNodes?.includes(node?.id) && (
          <div className='ml-2'>{renderTree(node?.children)}</div>
        )}
      </div>
    ))
  }

  return (
    <div className='flex flex-col w-full overflow-y-scroll scrollbar-hide min-h-[100px]'>
      {data?.length > 0 && (<>
        {renderTree(data)}
      </>)}
      <DeleteConfirmationDialog
        isOpen={isdelDialogOpen}
        onClose={() => {
          setIsdleDialogOpen(false), setDeleteimport(null)
        }}
        onConfirm={handleDelete}
        message='Are you sure you want to permanently delete this item?'
      />
    </div>
  )
}

export default FolderTreeView
