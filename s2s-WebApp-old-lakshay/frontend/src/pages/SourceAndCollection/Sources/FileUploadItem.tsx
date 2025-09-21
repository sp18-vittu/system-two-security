import React from 'react'

type FileUploadItemProps = {
  fileName: string
  fileSize: any
  fileType: string
  setUploadepdf: any
  uploadProgress: any
  isUploading: any
}

const FileUploadItem: React.FC<FileUploadItemProps> = ({
  fileName,
  fileSize,
  setUploadepdf,
  uploadProgress,
  isUploading,
}) => {
  const convertFileSize = (sizeInBytes: number): string => {
    const kb = sizeInBytes / 1024
    const mb = sizeInBytes / (1024 * 1024)

    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`
    } else {
      return `${kb.toFixed(2)} KB`
    }
  }
  return (
    <>
      {uploadProgress == 100 && !isUploading ? (
        <div className='box-border bg-[#32435a] rounded-2xl p-4 flex flex-col gap-2 items-start justify-start self-stretch flex-shrink-0 relative overflow-hidden'>
          <div className='flex flex-row gap-3 items-start justify-between self-stretch flex-shrink-0 relative'>
            <div className='flex gap-3 items-start'>
              <div className='relative w-10 h-10'>
                <svg>
                  <path
                    d='M0.75 4C0.75 2.20508 2.20508 0.75 4 0.75H20C20.1212 0.75 20.2375 0.798159 20.3232 0.883885L31.1161 11.6768C31.2018 11.7625 31.25 11.8788 31.25 12V36C31.25 37.7949 29.7949 39.25 28 39.25H4C2.20507 39.25 0.75 37.7949 0.75 36V4Z'
                    fill='white'
                    stroke='#D0D5DD'
                    stroke-width='1.5'
                  />
                  <rect x='1' y='18' width='26' height='16' rx='2' fill='#D92D20' />
                  <path
                    d='M4.8323 30V22.7273H7.70162C8.25323 22.7273 8.72316 22.8326 9.11142 23.0433C9.49967 23.2517 9.7956 23.5417 9.9992 23.9134C10.2052 24.2827 10.3082 24.7088 10.3082 25.1918C10.3082 25.6747 10.204 26.1009 9.99565 26.4702C9.78732 26.8395 9.48547 27.1271 9.09011 27.3331C8.69712 27.5391 8.22127 27.642 7.66255 27.642H5.83372V26.4098H7.41397C7.7099 26.4098 7.95375 26.3589 8.14551 26.2571C8.33964 26.1529 8.48405 26.0097 8.57875 25.8274C8.67581 25.6428 8.72434 25.4309 8.72434 25.1918C8.72434 24.9503 8.67581 24.7396 8.57875 24.5597C8.48405 24.3774 8.33964 24.2365 8.14551 24.1371C7.95138 24.0353 7.70517 23.9844 7.40687 23.9844H6.36994V30H4.8323ZM13.885 30H11.3069V22.7273H13.9063C14.6379 22.7273 15.2676 22.8729 15.7955 23.1641C16.3235 23.4529 16.7295 23.8684 17.0136 24.4105C17.3 24.9527 17.4433 25.6013 17.4433 26.3565C17.4433 27.1141 17.3 27.7652 17.0136 28.3097C16.7295 28.8542 16.3211 29.272 15.7884 29.5632C15.2581 29.8544 14.6237 30 13.885 30ZM12.8445 28.6825H13.8211C14.2757 28.6825 14.658 28.602 14.9681 28.4411C15.2806 28.2777 15.515 28.0256 15.6713 27.6847C15.8299 27.3414 15.9092 26.8987 15.9092 26.3565C15.9092 25.8191 15.8299 25.38 15.6713 25.0391C15.515 24.6982 15.2818 24.4472 14.9717 24.2862C14.6615 24.1252 14.2792 24.0447 13.8247 24.0447H12.8445V28.6825ZM18.5823 30V22.7273H23.3976V23.995H20.1199V25.728H23.078V26.9957H20.1199V30H18.5823Z'
                    fill='white'
                  />
                  <path
                    d='M20 0.5V8C20 10.2091 21.7909 12 24 12H31.5'
                    stroke='#f1f1f1'
                    fill='#fff'
                    stroke-width='1.5'
                  />
                </svg>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='text-[#fff] text-sm font-medium leading-5 w-full truncate'>
                  {fileName}
                </span>
                <span className='text-[#fff] text-sm font-normal leading-5'>
                  {convertFileSize(Number(fileSize))}
                </span>
              </div>
            </div>
            <div className='relative w-10 h-10   items-center flex justify-end'>
              <svg
                onClick={() => setUploadepdf(null)}
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                className='cursor-pointer'
              >
                <path
                  d='M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M10 11.5V16.5M14 11.5V16.5M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6'
                  stroke='#D92D20'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <div className='box-border bg-[#32435a] rounded-2xl p-4 flex flex-col gap-2 items-start justify-start self-stretch flex-shrink-0 relative overflow-hidden'>
          <div className='flex flex-row gap-3 items-start justify-start self-stretch flex-shrink-0 relative'>
            <div className='flex-shrink-0 w-10 h-10 relative'>
              <svg>
                <path
                  d='M0.75 4C0.75 2.20508 2.20508 0.75 4 0.75H20C20.1212 0.75 20.2375 0.798159 20.3232 0.883885L31.1161 11.6768C31.2018 11.7625 31.25 11.8788 31.25 12V36C31.25 37.7949 29.7949 39.25 28 39.25H4C2.20507 39.25 0.75 37.7949 0.75 36V4Z'
                  fill='white'
                  stroke='#D0D5DD'
                  stroke-width='1.5'
                />
                <rect x='1' y='18' width='26' height='16' rx='2' fill='#D92D20' />
                <path
                  d='M4.8323 30V22.7273H7.70162C8.25323 22.7273 8.72316 22.8326 9.11142 23.0433C9.49967 23.2517 9.7956 23.5417 9.9992 23.9134C10.2052 24.2827 10.3082 24.7088 10.3082 25.1918C10.3082 25.6747 10.204 26.1009 9.99565 26.4702C9.78732 26.8395 9.48547 27.1271 9.09011 27.3331C8.69712 27.5391 8.22127 27.642 7.66255 27.642H5.83372V26.4098H7.41397C7.7099 26.4098 7.95375 26.3589 8.14551 26.2571C8.33964 26.1529 8.48405 26.0097 8.57875 25.8274C8.67581 25.6428 8.72434 25.4309 8.72434 25.1918C8.72434 24.9503 8.67581 24.7396 8.57875 24.5597C8.48405 24.3774 8.33964 24.2365 8.14551 24.1371C7.95138 24.0353 7.70517 23.9844 7.40687 23.9844H6.36994V30H4.8323ZM13.885 30H11.3069V22.7273H13.9063C14.6379 22.7273 15.2676 22.8729 15.7955 23.1641C16.3235 23.4529 16.7295 23.8684 17.0136 24.4105C17.3 24.9527 17.4433 25.6013 17.4433 26.3565C17.4433 27.1141 17.3 27.7652 17.0136 28.3097C16.7295 28.8542 16.3211 29.272 15.7884 29.5632C15.2581 29.8544 14.6237 30 13.885 30ZM12.8445 28.6825H13.8211C14.2757 28.6825 14.658 28.602 14.9681 28.4411C15.2806 28.2777 15.515 28.0256 15.6713 27.6847C15.8299 27.3414 15.9092 26.8987 15.9092 26.3565C15.9092 25.8191 15.8299 25.38 15.6713 25.0391C15.515 24.6982 15.2818 24.4472 14.9717 24.2862C14.6615 24.1252 14.2792 24.0447 13.8247 24.0447H12.8445V28.6825ZM18.5823 30V22.7273H23.3976V23.995H20.1199V25.728H23.078V26.9957H20.1199V30H18.5823Z'
                  fill='white'
                />
                <path
                  d='M20 0.5V8C20 10.2091 21.7909 12 24 12H31.5'
                  stroke='#f1f1f1'
                  fill='#fff'
                  stroke-width='1.5'
                />
              </svg>
            </div>
            <div className='flex flex-col gap-1 items-start justify-start flex-1 relative'>
              <div className='flex flex-col gap-0 items-start justify-start self-stretch flex-shrink-0 relative'>
                <div className='flex flex-col flex-1 justify-start items-start'>
                  <span className='text-[#fff] text-sm font-medium'>{fileName}</span>

                  <div className='flex justify-between items-center gap-3 w-full'>
                    <div className='relative w-[626px] h-2 rounded bg-[#EAECF0]'>
                      <div
                        className='absolute h-2 rounded bg-[#EE7103]'
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span className='text-[#fff] text-sm font-medium'>{uploadProgress}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FileUploadItem
