import React, { useState } from 'react'
import YamlEditor from '../../datavault/YamlEditor'
import CopyAndNewCollectionsDialog from './CopyAndNewCollectionsDialog'
const yaml = require('js-yaml')
import toast from 'react-hot-toast'
import CustomToast from '../../../layouts/App/CustomToast'
import { useDispatch } from 'react-redux'
import { CollectiondataCopyPost, workbenchMultiyamlFileUpdate } from '../../../redux/nodes/Collections/action'
import { useParams } from 'react-router-dom'

const DetectionDialog: React.FC<{
    isOpen: boolean
    onClose: () => void
    detectionsList: any
    collectiondata: any
    inboxList: any
    ruleIndex: any,
}> = ({ isOpen, onClose, detectionsList, collectiondata, inboxList, ruleIndex }) => {
    if (!isOpen) return null
    const { id } = useParams();
    const dispatch = useDispatch()
    const [isDialogOpen, setDialogOpen] = useState(false)
    const [ymltext, setYmlText] = useState('' as any);
    const [showPopover, setShowPopover] = useState(false)
    const [currentIndex, setCurrentIndex] = useState<number>(ruleIndex);
    const [selectedRows, setSelectedRows] = useState([] as any)
    const [collectionorcti, setCollectionorcti] = useState("ruleChat" as any);
    const handleNext = () => {
        if (currentIndex < detectionsList.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };
    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    };

    const copyToClipboard = () => {
        let parsedJSON = yaml.load(detectionsList[currentIndex]?.content);
        navigator.clipboard.writeText(detectionsList[currentIndex]?.content)
        setShowPopover(true)
        setTimeout(() => {
            setShowPopover(false)
        }, 2000)
    }

    const handleDownload = () => {
        try {
            let parsedJSON = yaml.load(detectionsList[currentIndex]?.content)
            const blob = new Blob([detectionsList[currentIndex]?.content], { type: 'text/plain' })
            const file = new File([blob], `${parsedJSON?.title}.yml`, { type: 'text/plain' })
            const link = document.createElement('a');
            link.href = URL.createObjectURL(file);
            link.download = file.name;

            // Trigger the download
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error parsing YAML or downloading file:', error);
        }
    }

    const handCollection = () => {
        setDialogOpen(true)
        setSelectedRows([detectionsList[currentIndex]])
    }

    const handleOpenInboxCollection = () => {

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
        if (inboxList) {
            let parsedJSON = yaml.load(detectionsList[currentIndex]?.content)
            const blob = new Blob([detectionsList[currentIndex]?.content], { type: 'text/plain' })
            const file = new File([blob], `${parsedJSON?.title}.yml`, { type: 'text/plain' })
            const formData = new FormData()
            formData.append('files', file)
            dispatch(workbenchMultiyamlFileUpdate(inboxList?.id, id, formData) as any)
                .then((res: any) => {
                    if (res.type == 'UPDATE_YAML_MULTI_FILE_SUCCESS') {
                        toast.dismiss(toastId)
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
                                message='Failed to copy the rule. Please try again'
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
                },
                )
        }

    }

    return (
        <div className='fixed inset-0 bg-[#0C111D] bg-opacity-50 flex items-center justify-center'>
            <div className="bg-[#1D2939] rounded-xl p-6 flex flex-col gap-6 items-center justify-start w-[70%] h-[75%] shadow-xl overflow-hidden relative">
                {/* Content Section */}
                <div className="flex flex-col gap-4 items-center justify-start w-full">
                    {/* Header Section */}
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <svg className={currentIndex == 0 ? 'cursor-not-allowed' : 'cursor-pointer'} onClick={handlePrevious} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M15 18L9 12L15 6" stroke={currentIndex == 0 ? "#CCCCCC" : "white"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <svg className={currentIndex == detectionsList.length - 1 ? 'cursor-not-allowed' : 'cursor-pointer'} onClick={handleNext} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 18L15 12L9 6" stroke={currentIndex == detectionsList.length - 1 ? "#CCCCCC" : "white"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div className="text-white text-lg font-semibold">{detectionsList[currentIndex]?.title}</div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button onClick={() => handCollection()} className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold shadow-sm">
                                Copy to Collection
                            </button>
                            <button onClick={() => handleOpenInboxCollection()} className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold shadow-sm">
                                Copy to Detection Lab
                            </button>
                            <svg xmlns="http://www.w3.org/2000/svg" width="2" height="36" viewBox="0 0 2 36" fill="none">
                                <path d="M1 0V36" stroke="#3E4B5D" />
                            </svg>
                            <svg className='cursor-pointer' onClick={copyToClipboard} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M10.5 2.0028C9.82495 2.01194 9.4197 2.05103 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8.05103 3.4197 8.01194 3.82495 8.0028 4.5M19.5 2.0028C20.1751 2.01194 20.5803 2.05103 20.908 2.21799C21.2843 2.40973 21.5903 2.71569 21.782 3.09202C21.949 3.4197 21.9881 3.82494 21.9972 4.49999M21.9972 13.5C21.9881 14.175 21.949 14.5803 21.782 14.908C21.5903 15.2843 21.2843 15.5903 20.908 15.782C20.5803 15.949 20.1751 15.9881 19.5 15.9972M22 7.99999V9.99999M14.0001 2H16M5.2 22H12.8C13.9201 22 14.4802 22 14.908 21.782C15.2843 21.5903 15.5903 21.2843 15.782 20.908C16 20.4802 16 19.9201 16 18.8V11.2C16 10.0799 16 9.51984 15.782 9.09202C15.5903 8.71569 15.2843 8.40973 14.908 8.21799C14.4802 8 13.9201 8 12.8 8H5.2C4.0799 8 3.51984 8 3.09202 8.21799C2.71569 8.40973 2.40973 8.71569 2.21799 9.09202C2 9.51984 2 10.0799 2 11.2V18.8C2 19.9201 2 20.4802 2.21799 20.908C2.40973 21.2843 2.71569 21.5903 3.09202 21.782C3.51984 22 4.07989 22 5.2 22Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            {showPopover && (
                                <div className='absolute  p-1 bg-white text-black rounded shadow z-10 mt-16 ml-[380px]'>
                                    Copied!
                                </div>
                            )}
                            <svg className='cursor-pointer' onClick={handleDownload} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 10L12 15M12 15L7 10M12 15V3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <svg className='cursor-pointer' onClick={onClose} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Code Snippet Section */}
                <div className="bg-gray-800 rounded-xl flex items-center justify-center w-full flex-1 overflow-hidden">
                    <div
                        style={{
                            height: `100%`,
                            width: '100%',
                            textAlign: 'left',
                            overflowY: 'hidden',
                            backgroundColor: '#0C111D',
                            borderRadius: '8px',
                            // marginTop: '10px'
                        }}
                    >
                        {!isDialogOpen && (<YamlEditor
                            ymltext={detectionsList[currentIndex]?.content}
                            setYmlText={setYmlText}
                            setSeloctror={() => { }}
                            modeOfView={'ruleeditor'}
                        />)}
                    </div>

                </div>
            </div>
            <CopyAndNewCollectionsDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setDialogOpen(false)
                }}
                selectedRows={selectedRows}
                collectiondata={collectiondata}
                pramasdata={collectionorcti}
                setDialogOpen={setDialogOpen}
                importId={null}
            />
        </div>
        // <div className='fixed inset-0 bg-[#0C111D] bg-opacity-50 flex items-center justify-center'>
        //     <div className='bg-[#1D2939] text-white w-[70%] h-[75%] rounded-lg p-6 shadow-lg flex flex-col ml-16'>

        //         <div className="flex items-center justify-between w-full relative mt-[-10px]">
        //             <div className="flex items-center gap-4">
        //                 <div className="flex items-center gap-2">
        //                     <svg className='cursor-pointer' onClick={handlePrevious} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        //                         <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        //                     </svg>
        //                     <svg className='cursor-pointer' onClick={handleNext} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        //                         <path d="M9 18L15 12L9 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        //                     </svg>
        //                 </div>
        //                 <div className="text-lg font-semibold text-white">{detectionsList[currentIndex]?.title}</div>
        //             </div>

        //             <div className="flex items-center gap-4">

        //                 <button
        //                     disabled={false}
        //                     className={`bg-orange-600 text-white py-1 px-4 rounded-lg ${'cursor-pointer'
        //                         }`}
        //                     onClick={() => handCollection()}
        //                 >
        //                     Copy to Collection
        //                 </button>

        //                 <button
        //                     onClick={() => handleOpenInboxCollection()}
        //                     className={`bg-orange-600 text-white py-1 px-4 rounded-lg ${'cursor-pointer'
        //                         }`}
        //                 >
        //                     Copy to detection lab
        //                 </button>

        // <svg xmlns="http://www.w3.org/2000/svg" width="2" height="36" viewBox="0 0 2 36" fill="none">
        //     <path d="M1 0V36" stroke="#3E4B5D" />
        // </svg>
        // <svg className='cursor-pointer' onClick={copyToClipboard} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        //     <path d="M10.5 2.0028C9.82495 2.01194 9.4197 2.05103 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8.05103 3.4197 8.01194 3.82495 8.0028 4.5M19.5 2.0028C20.1751 2.01194 20.5803 2.05103 20.908 2.21799C21.2843 2.40973 21.5903 2.71569 21.782 3.09202C21.949 3.4197 21.9881 3.82494 21.9972 4.49999M21.9972 13.5C21.9881 14.175 21.949 14.5803 21.782 14.908C21.5903 15.2843 21.2843 15.5903 20.908 15.782C20.5803 15.949 20.1751 15.9881 19.5 15.9972M22 7.99999V9.99999M14.0001 2H16M5.2 22H12.8C13.9201 22 14.4802 22 14.908 21.782C15.2843 21.5903 15.5903 21.2843 15.782 20.908C16 20.4802 16 19.9201 16 18.8V11.2C16 10.0799 16 9.51984 15.782 9.09202C15.5903 8.71569 15.2843 8.40973 14.908 8.21799C14.4802 8 13.9201 8 12.8 8H5.2C4.0799 8 3.51984 8 3.09202 8.21799C2.71569 8.40973 2.40973 8.71569 2.21799 9.09202C2 9.51984 2 10.0799 2 11.2V18.8C2 19.9201 2 20.4802 2.21799 20.908C2.40973 21.2843 2.71569 21.5903 3.09202 21.782C3.51984 22 4.07989 22 5.2 22Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        // </svg>
        //                 {showPopover && (
        //                     <div className='absolute  p-1 bg-white text-black rounded shadow z-10 mt-16 ml-[150px]'>
        //                         Copied!
        //                     </div>
        //                 )}
        //                 <svg className='cursor-pointer' onClick={handleDownload} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        //                     <path d="M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 10L12 15M12 15L7 10M12 15V3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        //                 </svg>
        //                 <svg className='cursor-pointer' onClick={onClose} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        //                     <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        //                 </svg>
        //             </div>

        //         </div>
        //         <div
        //             style={{
        //                 height: `100%`,
        //                 width: '100%',
        //                 textAlign: 'left',
        //                 overflowY: 'hidden',
        //                 backgroundColor: '#0C111D',
        //                 borderRadius: '8px',
        //                 marginTop: '10px'
        //             }}
        //         >
        //             {!isDialogOpen && (<YamlEditor
        //                 ymltext={detectionsList[currentIndex]?.content}
        //                 setYmlText={setYmlText}
        //                 setSeloctror={() => { }}
        //                 modeOfView={'ruleeditor'}
        //             />)}
        //         </div>

        //     </div>

        // </div>
    )
}

export default DetectionDialog
