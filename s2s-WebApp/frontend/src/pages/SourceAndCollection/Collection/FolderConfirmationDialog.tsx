import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';

interface FolderConfirmationDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    message?: string
}

const FolderConfirmationDialog: React.FC<FolderConfirmationDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    message = 'Are you sure you want to delete this item?',
}) => {
    if (!isOpen) return null

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white rounded-lg shadow-lg w-96 h-auto p-6 relative'>

                <div className='absolute top-2 left-4'>
                    <div
                        className='Content'
                        style={{
                            alignSelf: 'stretch',
                            height: '160px',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            gap: '16px',
                            display: 'flex',
                        }}
                    >
                        <div
                            className='FeaturedIcon'
                            style={{
                                width: '48px',
                                height: '48px',
                                padding: '12px',
                                background: '#FEE4E2',
                                borderRadius: '28px',
                                border: '8px solid #FEF3F2',
                                justifyContent: 'center',
                                alignItems: 'center',
                                display: 'inline-flex',
                            }}
                        >
                            <FolderCopyOutlinedIcon style={{ color: '#D92D20', fontSize: '24px' }} />
                        </div>
                    </div>
                </div>

                <div className='absolute top-4 right-4 cursor-pointer' onClick={onClose}>
                    <CloseIcon className='text-gray-800 hover:text-gray-600' />
                </div>

                <h2 className=' text-lg font-semibold text-gray-800 mt-8'>Folder Creation</h2>
                <p className='mt-1 text-gray-600 '>{message}</p>

                <div className='mt-6 flex justify-center space-x-2 w-full'>
                    <button
                        onClick={onClose}
                        className='px-4 py-2 border border-gray-300 bg-[#fff] rounded-lg hover:bg-[#6941C6] text-[#344054] hover:text-white transition w-full '
                    >
                        No
                    </button>
                    <button
                        onClick={onConfirm}
                        className='px-4 py-2 bg-[#EE7103] text-white rounded-lg hover:bg-[#6941C6] transition w-full'
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FolderConfirmationDialog

