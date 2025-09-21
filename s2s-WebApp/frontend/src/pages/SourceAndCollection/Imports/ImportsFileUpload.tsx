import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useDispatch } from 'react-redux'
import { importedSourceFiles } from '../../../redux/nodes/Imports/action'
import toast from 'react-hot-toast'
import CustomToast from '../../../layouts/App/CustomToast'
import Axios from "axios";
import { environment } from '../../../environment/environment'
import local from '../../../utils/local'
import CircularProgress from '@mui/material/CircularProgress'

function ImportsFileUpload({ selectFolders, setUploadFile, foldersList, setIsDialogOpen, isLoading, setImporting, setDeleteimport }: any) {
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [uploading, setUploading] = useState<boolean>(false)
  const dispatch = useDispatch()

  const chunkArray = <T,>(array: T[], size: number): T[][] => {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
      array.slice(index * size, index * size + size)
    );
  };


  const onDrop = async (acceptedFiles: File[]) => {
    if (selectFolders && foldersList?.length > 0) {
      setDeleteimport('delete')
      sessionStorage.setItem('importid', selectFolders.id)
      setUploading(true);
      setUploadProgress(0);
      setImporting(true);

      const fileChunks = chunkArray(acceptedFiles, 100);
      let totalFilesUploaded = 0;
      const totalFiles = acceptedFiles.length;

      const localStorage = local.getItem("bearerToken");
      const token = JSON.parse(localStorage as any);

      try {
        for (const chunk of fileChunks) {

          const formData = new FormData();
          chunk.forEach((file) => formData.append("files", file));

          await Axios.post(
            `${environment.baseUrl}/data/imported-source/${selectFolders.id}/rule`,
            formData,
            {
              headers: {
                Authorization: `${token.bearerToken}`,
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent: any) => {
                const chunkProgress = Math.round(
                  (progressEvent.loaded / progressEvent.total) * 100
                );
                // Calculate total progress based on all files
                const overallProgress = Math.round(
                  ((totalFilesUploaded + (chunk.length * chunkProgress) / 100) /
                    totalFiles) *
                  100
                );
                setUploadProgress(overallProgress);
              },
            }
          );

          totalFilesUploaded += chunk.length;
          setUploadProgress(Math.round((totalFilesUploaded / totalFiles) * 100));
        }
        toast.success(
          <CustomToast
            message={'Uploading files successfully'
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
        // Reset everything after completion
        setUploadFile("add");
        setFiles([]);
        setUploadProgress(100); // Ensure it reaches 100%
        setUploading(false);
        setImporting(false);
        sessionStorage.removeItem('importid')
      } catch (error) {
        console.error("Batch upload failed:", error);
        alert("Error uploading files. Please try again.");
      } finally {
        setTimeout(() => setUploadProgress(0), 1000); // Reset progress after a short delay
        setUploading(false);
      }
    }
  };

  const handleFileUpload = (file: File) => {
    setUploading(true)

    // Simulate file upload
    const mockUpload = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(mockUpload)
          setUploading(false)
          return 100
        }
        return prev + 10 // Increment progress
      })
    }, 500)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/yaml': ['.yaml', '.yml'] },
  })

  const label: any = selectFolders?.label && foldersList.length > 0 ? 'All Files/' + selectFolders?.label : 'All Files'
  const parts: any = selectFolders?.label && foldersList.length > 0 ? label.split('/') : label

  return (
    <div className='bg-[#1d2939] rounded-lg p-8 flex flex-col gap-6 items-start justify-start w-full h-full'>
      <div className='text-left font-inter font-semibold text-[20px] leading-[24px] font-semibold relative'>
        {selectFolders?.label && foldersList.length > 0 ? (
          <span>
            {parts.map((part: any, index: any) => (
              <span key={index}>
                <span
                  className={`${index === parts.length - 1 ? 'text-white' : 'text-[#ee7103]'
                    } font-inter font-semibold text-[20px] leading-[24px] px-1 max-md:!text-sm`}
                  style={{ overflowWrap: 'anywhere' }}
                >
                  {part}
                </span>
                {index < parts.length - 1 && (
                  <span className='text-white font-inter font-semibold text-[20px] leading-[24px] px-1 max-md:!text-sm'>
                    /
                  </span>
                )}
              </span>
            ))}
          </span>
        ) : (
          <span
            className='text-[#ee7103] font-inter font-semibold text-[20px] leading-[24px] font-semibold max-md:!text-sm'
            style={{ overflowWrap: 'anywhere' }}
          >
            {parts}
          </span>
        )}
      </div>

      {!isLoading ? (<div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center flex flex-col justify-center items-center h-full w-full ${isDragActive ? 'border-[#fff] bg-[#1d2939]' : 'border-[#fff] bg-[#1d2939]'
          }`}
      >
        <input {...getInputProps()} />
        <div className='flex flex-col items-center justify-center'>
          <svg
            className='cursor-pointer'
            xmlns='http://www.w3.org/2000/svg'
            width='40'
            height='41'
            viewBox='0 0 40 41'
            fill='none'
          >
            <path
              d='M13.3335 27.1667L20.0002 20.5M20.0002 20.5L26.6668 27.1667M20.0002 20.5V35.5M33.3335 28.4047C35.3693 26.7234 36.6668 24.1799 36.6668 21.3333C36.6668 16.2707 32.5628 12.1667 27.5002 12.1667C27.136 12.1667 26.7953 11.9767 26.6104 11.6629C24.4369 7.97473 20.4242 5.5 15.8335 5.5C8.92994 5.5 3.3335 11.0964 3.3335 18C3.3335 21.4435 4.72591 24.5618 6.97841 26.8226'
              stroke='white'
              stroke-width='1.66667'
              stroke-linecap='round'
              stroke-linejoin='round'
            />
          </svg>
          <p
            className={
              isDragActive ? 'text-[#fff] text-[18px] font-inter' : 'text-orange-400 font-inter'
            }
          >
            {isDragActive
              ? 'Drop files or folders here to upload'
              : 'Click to upload or drag and drop'}
          </p>
          {!isDragActive && (
            <div className='flex flex-row items-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='23'
                viewBox='0 0 20 23'
                fill='none'
              >
                <path
                  fill-rule='evenodd'
                  clip-rule='evenodd'
                  d='M14.0366 0.980259H2.94806V10.0092C2.94806 10.2798 2.72855 10.4993 2.45793 10.4993C2.18731 10.4993 1.9678 10.2798 1.9678 10.0092V0.490133C1.9678 0.219512 2.18731 0 2.45793 0H14.3634C14.4945 0 14.6188 0.0523937 14.7113 0.144975L17.8893 3.32297C17.9814 3.41507 18.0329 3.53925 18.0329 3.66951L18.0329 10.0092C18.0329 10.2798 17.8134 10.4993 17.5428 10.4993C17.2722 10.4993 17.0527 10.2798 17.0527 10.0092V3.99625H15.9531C15.4257 3.99625 14.9465 3.78072 14.5993 3.43355C14.2522 3.08637 14.0367 2.60717 14.0367 2.07981L14.0366 0.980259ZM2.94806 21.2405H17.0526V18.6867C17.0526 18.4161 17.2721 18.1966 17.5428 18.1966C17.8134 18.1966 18.0329 18.4161 18.0329 18.6867V21.7307C18.0329 22.0013 17.8134 22.2208 17.5428 22.2208H2.45791C2.18729 22.2208 1.96777 22.0013 1.96777 21.7307V18.6867C1.96777 18.4161 2.18729 18.1966 2.45791 18.1966C2.72853 18.1966 2.94804 18.4161 2.94804 18.6867L2.94806 21.2405Z'
                  fill='white'
                />
                <path
                  fill-rule='evenodd'
                  clip-rule='evenodd'
                  d='M5.25537 5.62964H14.7438V6.44654H5.25537V5.62964Z'
                  fill='white'
                />
                <path
                  fill-rule='evenodd'
                  clip-rule='evenodd'
                  d='M5.25537 7.56836H14.7438V8.38526H5.25537V7.56836Z'
                  fill='white'
                />
                <path
                  fill-rule='evenodd'
                  clip-rule='evenodd'
                  d='M5.25537 3.69116H11.9641V4.5081H5.25537V3.69116Z'
                  fill='white'
                />
                <path
                  fill-rule='evenodd'
                  clip-rule='evenodd'
                  d='M4.10133 13.9151L5.05725 12.2746H6.02187L4.49723 14.6817V16.4217H3.662V14.6759L2.14318 12.2746H3.12517L4.10133 13.9151ZM5.48404 16.4217L7.09945 12.2746H7.98488L9.64566 16.4217H8.73415L8.37208 15.4793H6.71418L6.37237 16.4217H5.48404ZM10.0782 16.4217V12.2746H11.3316L12.0837 15.1037L12.8272 12.2746H14.0834V16.4217H13.3062V13.1571L12.4825 16.4217H11.6763L10.8555 13.1571V16.4217H10.0782ZM14.938 16.4217V12.3084H15.7751V15.7226H17.8569V16.4217L14.938 16.4217ZM2.94772 19.0137H17.0523H18.0326H19.6732C19.8537 19.0137 20 18.8674 20 18.6869V10.0094C20 9.82893 19.8537 9.68262 19.6732 9.68262H18.0326H17.0523H2.94772H1.96745H0.326778C0.14631 9.68262 0 9.82893 0 10.0094V18.6869C0 18.8674 0.14631 19.0137 0.326778 19.0137H1.96745H2.94772Z'
                  fill='#91C6FF'
                />
                <path
                  fill-rule='evenodd'
                  clip-rule='evenodd'
                  d='M7.53174 13.2419L6.97168 14.7811H8.10335L7.53174 13.2419Z'
                  fill='#91C6FF'
                />
              </svg>
              <p className='text-sm text-gray-400 ml-2'>.YML(max. 100Mb)</p>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className='mt-4 w-full flex flex-col items-center'>
            {/* <p className='text-white mb-2'>{files[0].name}</p> */}
            <div className='w-3/4 bg-gray-600 rounded-full h-4'>
              <div
                className='bg-blue-500 h-4 rounded-full'
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            {uploading && <p className='text-sm text-blue-400 mt-2'>{`Uploading... ${uploadProgress}%`}</p>}
          </div>
        )}
      </div>) : (
        <div className='rounded-lg p-8 text-center flex flex-col justify-center items-center h-full w-full'>
          <CircularProgress size='3rem' sx={{ color: '#EE7103' }} />
        </div>
      )}
    </div>
  )
}

export default ImportsFileUpload
