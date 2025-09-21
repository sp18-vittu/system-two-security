import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { FolderDelete } from '../../../redux/nodes/Imports/action'
import DeleteConfirmationDialog from '../Collection/DeleteConfirmationDialog'
import useWindowResolution from '../../../layouts/Dashboard/useWindowResolution'
import { useData } from '../../../layouts/shared/DataProvider'
import toast from 'react-hot-toast'
import CustomToast from '../../../layouts/App/CustomToast'

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
  setUploadFile,
  setPage,
  setPageSize
}: any) => {
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
  const [isdelDialogOpen, setIsdleDialogOpen] = useState(false)
  const dispatch = useDispatch()
  const {
    impFolderId,
    setImpFolderId,
    importDeleteRule,
    setImportDeleteRule,
    setImportViewRule,
  }: any = useData();

  const toggleNode = (e: any, id: any, node: any) => {
    e.stopPropagation()
    setSelectFolders(node)
    setSelectId(id)
    setPage(0)
    setPageSize(10)
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
    setImportDeleteRule(selectFolders?.id)
    setIsdleDialogOpen(false);
    const toastId = toast.loading(
      <CustomToast
        message='Your folder are currently being deleted'
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
    dispatch(FolderDelete(selectFolders.id, isDAC) as any)
      .then((res: any) => {
        if (res.type == 'IMPORT_TREEVIEW_DELETE_SUCCESS') {
          toast.success(
            <CustomToast
              message={'Folder Deleted Successfully'
              }
              onClose={() => toast.dismiss()} // Dismiss only this toast
            />,
            {
              duration: 3000,
              position: 'top-center',
              style: {
                background: '#fff',
                color: '#000', // White text color
                width: '500px',
              },
            },
          )
          toast.dismiss(toastId)
          setDeleteimport('delete')
          setSelectFolders(null)
          setSelectId(null);
          setImportViewRule(null);

        } else {
          toast.dismiss(toastId)
          setDeleteimport('delete')
          setSelectFolders(null)
          setSelectId(null);
          setImportViewRule(null);
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
      <div key={node?.id} style={{ marginLeft: '8px' }}>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            borderRadius: '4px',
            border: selectFolders?.id === node.id ? '1px solid #ee7103' : 'none',
            padding: '8px',
            cursor: 'pointer',
            alignItems: 'center'
          }}
          className="hover:bg-gray-700"
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
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
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
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              )}
            </>
          )}
          {!node?.children && (<div style={{ width: '24px', height: '24px' }}></div>)}
          {selectFolders?.id == node?.id ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='28'
              height='28'
              viewBox='0 0 24 24'
              fill='none'
            >
              <path
                d='M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803C22 9.27976 22 10.1198 22 11.8V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7ZM9 14L11 16L15.5 11.5'
                stroke='#309F00'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
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
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          )}
          <span style={{ color: 'white', fontSize: '14px', width: '80%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node?.name}</span>
          {selectFolders?.id != node.id && Importing && importId == node.id && (
            <div style={{ border: '2px solid #1570EF', borderRadius: '12px', padding: '4px 8px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <div style={{ color: '#1570EF', fontSize: '12px', fontWeight: 500 }}>{'Importing...'}</div>
            </div>
          )}
          {selectFolders?.id != node.id && importDeleteRule && importDeleteRule == node.id && (
            <div style={{ border: '2px solid #1570EF', borderRadius: '12px', padding: '4px 8px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <div style={{ color: '#1570EF', fontSize: '12px', fontWeight: 500 }}>{'Deleting...'}</div>
            </div>
          )}
          {selectFolders?.id == node.id && node?.name != "default" ? (
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginLeft: 'auto' }}>
              {Importing && importId == node.id ? (
                <div style={{ border: '2px solid #1570EF', borderRadius: '12px', padding: '4px 8px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <div style={{ color: '#1570EF', fontSize: '12px', fontWeight: 500 }}>{'Importing...'}</div>
                </div>
              ) : importDeleteRule && importDeleteRule == node.id ? (
                <div style={{ border: '2px solid #1570EF', borderRadius: '12px', padding: '4px 8px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <div style={{ color: '#1570EF', fontSize: '12px', fontWeight: 500 }}>{'Deleting...'}</div>
                </div>
              ) : (
                <>
                  <svg
                    style={{ marginRight: '10px' }}
                    onClick={(e: any) => { e.stopPropagation(); setModalOpen(true); }}
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <path
                      d='M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803C22 9.27976 22 10.1198 22 11.8V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7ZM12 17V11M9 14H15'
                      stroke='#657890'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  <svg
                    onClick={(e: any) => { e.stopPropagation(); onDeleteFolder(); }}
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <path
                      d='M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M10 11.5V16.5M14 11.5V16.5M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6'
                      stroke='#657890'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </>
              )}
            </div>
          ) : selectFolders?.id == node.id && node?.name == "default" && (
            <>
              {selectFolders?.id == node.id && Importing && importId == node.id && (
                <div style={{ border: '2px solid #1570EF', borderRadius: '12px', padding: '4px 8px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <div style={{ color: '#1570EF', fontSize: '12px', fontWeight: 500 }}>{'Importing...'}</div>
                </div>
              )}
            </>
          )}
        </div>
        {node?.children && expandedNodes?.includes(node?.id) && (
          <div style={{ marginLeft: '8px' }}>{renderTree(node?.children)}</div>
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
