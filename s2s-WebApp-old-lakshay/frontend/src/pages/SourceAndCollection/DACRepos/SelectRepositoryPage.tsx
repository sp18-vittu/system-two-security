function SelectRepositoryPage({ handleNextpage, selectRepo, setSelectRepo, onClose }: any) {
    return (
        <div
            className='p-[24px] box-border bg-[#1d2939] rounded-[12px] flex flex-col items-end justify-between relative shadow-xl overflow-scroll w-[80%] max-w-[850px] max-h-[80%] hide-scrollbar'
            style={{
                boxShadow:
                    '0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)',
            }}
        >
            <div className='flex flex-col gap-0 items-center justify-start flex-shrink-0 relative w-full mt-[-24px]'>
                <div className='flex flex-col gap-4 items-start justify-start self-stretch flex-shrink-0 relative'>
                    <div className='bg-[#32435a] rounded-[28px] flex-shrink-0 relative mt-[10px]'>
                        <svg
                            width='48'
                            height='48'
                            viewBox='0 0 48 48'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <rect width='48' height='48' rx='24' fill='#32435A' />
                            <path
                                d='M24 14C26.5013 16.7384 27.9228 20.292 28 24C27.9228 27.708 26.5013 31.2616 24 34M24 14C21.4987 16.7384 20.0772 20.292 20 24C20.0772 27.708 21.4987 31.2616 24 34M24 14C18.4772 14 14 18.4772 14 24C14 29.5228 18.4772 34 24 34M24 14C29.5228 14 34 18.4772 34 24C34 29.5228 29.5228 34 24 34M14.5 21H33.5M14.5 27H33.5'
                                stroke='white'
                                stroke-width='2'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                            />
                        </svg>
                    </div>
                    <div className='flex flex-col gap-1 items-start justify-start self-stretch flex-shrink-0 relative'>
                        <div
                            className='text-[#ffffff] text-left text-[18px] leading-[28px] self-stretch relative'
                            style={{ fontFamily: '"Inter-SemiBold", sans-serif' }}
                        >
                            Add DAC Repo
                        </div>
                        <div
                            className='text-[#98a2b3] text-left text-[16px] leading-[24px] self-stretch relative'
                            style={{ fontFamily: '"Inter-Regular", sans-serif' }}
                        >
                            Step 1 of 2 : Select Source
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className='rounded-[8px] flex flex-row gap-0 items-center justify-center flex-shrink-0 absolute right-[0px] top-[16px] overflow-hidden'
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                    >
                        <path
                            d='M18 6L6 18M6 6L18 18'
                            stroke='#98A2B3'
                            stroke-width='2'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                        />
                    </svg>
                </button>
            </div>

            <div className='grid grid-cols-3 max-md:grid-cols-2 gap-[16px] w-full py-[48px]'>
                <div
                    onClick={() => setSelectRepo('git')}
                    className={`rounded-[6px] border ${selectRepo == 'git' ? 'border-[#ee7103]' : 'border-[#3e4b5d]'
                        } p-[16px] max-md:p-[8px] flex flex-row gap-[12px] items-center justify-start flex-1 relative overflow-hidden cursor-pointer w-full`}
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='56'
                        height='56'
                        viewBox='0 0 56 56'
                        fill='none'
                        className="max-md:h-[40px] max-md:w-[40px]"
                    >
                        <path
                            d='M28 5C24.9796 5 21.9888 5.59643 19.1983 6.75523C16.4078 7.91404 13.8723 9.61252 11.7365 11.7537C7.42321 16.078 5 21.9431 5 28.0586C5 38.2505 11.601 46.8975 20.732 49.9643C21.882 50.1488 22.25 49.4339 22.25 48.8114V44.9144C15.879 46.298 14.522 41.8246 14.522 41.8246C13.464 39.1498 11.969 38.435 11.969 38.435C9.876 37.0053 12.13 37.0515 12.13 37.0515C14.43 37.2129 15.649 39.4265 15.649 39.4265C17.65 42.9314 21.031 41.8938 22.342 41.3404C22.549 39.8416 23.147 38.827 23.791 38.2505C18.685 37.674 13.326 35.691 13.326 26.9057C13.326 24.3462 14.2 22.294 15.695 20.6568C15.465 20.0803 14.66 17.6822 15.925 14.5693C15.925 14.5693 17.857 13.9467 22.25 16.9213C24.067 16.414 26.045 16.1604 28 16.1604C29.955 16.1604 31.933 16.414 33.75 16.9213C38.143 13.9467 40.075 14.5693 40.075 14.5693C41.34 17.6822 40.535 20.0803 40.305 20.6568C41.8 22.294 42.674 24.3462 42.674 26.9057C42.674 35.7141 37.292 37.651 32.163 38.2275C32.991 38.9423 33.75 40.3488 33.75 42.4933V48.8114C33.75 49.4339 34.118 50.1718 35.291 49.9643C44.422 46.8744 51 38.2505 51 28.0586C51 25.0305 50.4051 22.0321 49.2492 19.2345C48.0934 16.4369 46.3992 13.8949 44.2635 11.7537C42.1277 9.61252 39.5922 7.91404 36.8017 6.75523C34.0112 5.59643 31.0204 5 28 5Z'
                            fill='white'
                        />
                    </svg>
                    <div className='text-white text-left font-inter text-[16px] font-bold relative max-sm:!text-sm'>
                        GitHub
                    </div>
                </div>

                {/* *****************************************Don't delete the comment I keep it for my own use********************************************************* */}
                <div
                    // onClick={() => setSelectRepo('gitlab')}
                    className={`rounded-[6px]  p-[16px] max-md:p-[8px] flex flex-row gap-[12px] items-center justify-start flex-1 relative overflow-hidden cursor-pointer w-full`}
                >
                    {/* <div className='flex-shrink-0 relative overflow-hidden'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='56'
                            height='56'
                            viewBox='0 0 56 56'
                            fill='none'
                            className="max-md:h-[40px] max-md:w-[40px]"
                        >
                            <path
                                d='M51.0838 23.2058L51.0165 23.0341L44.5164 6.07014C44.384 5.7376 44.1498 5.45549 43.8473 5.26427C43.5446 5.07626 43.1916 4.98569 42.8358 5.00478C42.48 5.02387 42.1387 5.15172 41.8579 5.37103C41.5806 5.59694 41.3793 5.90249 41.2811 6.24643L36.8923 19.6746H19.1203L14.7311 6.24643C14.6357 5.90061 14.4339 5.59356 14.1543 5.36875C13.8736 5.14944 13.5322 5.02159 13.1764 5.0025C12.8207 4.98341 12.4676 5.07398 12.1649 5.26199C11.8631 5.454 11.6291 5.73585 11.4958 6.06786L4.98354 23.0242L4.91895 23.1959C2.99679 28.2184 4.62905 33.9074 8.92246 37.1461L8.94488 37.1636L9.00453 37.2057L18.9064 44.6208L23.805 48.3283L26.7891 50.5814C27.1381 50.8466 27.5644 50.9901 28.0027 50.9901C28.441 50.9901 28.8672 50.8466 29.2162 50.5814L32.2004 48.3283L37.099 44.6208L47.0605 37.1609L47.0852 37.1411C51.3683 33.9017 52.9979 28.223 51.0838 23.2058Z'
                                fill='#E24329'
                            />
                            <path
                                d='M51.0837 23.2057L51.0165 23.0339C47.8492 23.6842 44.8646 25.0258 42.2758 26.963L28 37.7577C32.8614 41.4356 37.0937 44.6309 37.0937 44.6309L47.0551 37.171L47.0798 37.1513C51.3698 33.9115 53.0017 28.2271 51.0837 23.2057Z'
                                fill='#FC6D26'
                            />
                            <path
                                d='M18.9063 44.6306L23.805 48.3381L26.7891 50.5912C27.1381 50.8563 27.5644 50.9999 28.0027 50.9999C28.441 50.9999 28.8672 50.8563 29.2162 50.5912L32.2003 48.3381L37.099 44.6306C37.099 44.6306 32.8618 41.4253 28.0004 37.7573C24.9672 40.0459 21.9358 42.337 18.9063 44.6306Z'
                                fill='#FCA326'
                            />
                            <path
                                d='M13.7216 26.9631C11.1351 25.0217 8.1511 23.6766 4.98354 23.0242L4.91895 23.1959C2.99679 28.2184 4.62905 33.9074 8.92246 37.1461L8.94488 37.1636L9.00453 37.2057L18.9064 44.6208L28 37.7475L13.7216 26.9631Z'
                                fill='#FC6D26'
                            />
                        </svg>
                    </div>
                    <div className='text-white text-left font-inter text-[16px] font-bold relative max-sm:!text-sm'>
                        GitLab
                    </div> */}
                </div>
                <div
                    // onClick={() => setSelectRepo('sigma')}
                    className={`flex flex-row gap-3 items-center justify-start p-[16px] max-md:p-[8px]  rounded-[6px] relative overflow-hidden flex-1 cursor-pointer w-full`}
                >
                    {/* <div className='flex-shrink-0 relative overflow-hidden'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='56'
                            height='56'
                            viewBox='0 0 56 56'
                            fill='none'
                            className="max-md:h-[40px] max-md:w-[40px]"
                        >
                            <g clip-path='url(#clip0_1165_9214)'>
                                <g filter='url(#filter0_d_1165_9214)'>
                                    <path
                                        d='M25.856 53C39.6115 53 51.7223 41.8071 52.9064 28C54.0905 14.1929 43.8994 3 30.144 3C16.3885 3 4.27766 14.1929 3.09357 28C1.90949 41.8071 12.1006 53 25.856 53Z'
                                        fill='black'
                                    />
                                </g>
                                <path
                                    d='M25.856 53C39.6115 53 51.7223 41.8071 52.9064 28C54.0905 14.1929 43.8994 3 30.144 3C16.3885 3 4.27766 14.1929 3.09357 28C1.90949 41.8071 12.1006 53 25.856 53Z'
                                    fill='#204D7B'
                                />
                                <g filter='url(#filter1_d_1165_9214)'>
                                    <path
                                        d='M50.2115 11.7769C50.3716 13.138 49.9329 14.4486 48.8955 15.7086C47.8581 16.9686 46.4613 17.5986 44.7053 17.5986L41.3661 17.6179C43.4549 20.4253 44.5463 24.0353 44.2083 27.9737C43.4407 36.9189 35.5895 44.1705 26.6722 44.1705C17.7549 44.1705 11.1482 36.9189 11.9158 27.9737C12.6834 19.0284 20.5346 11.7769 29.452 11.7769H50.2115ZM28.9446 17.69C23.2828 17.69 18.2979 22.2941 17.8105 27.9737C17.3231 33.6532 21.5178 38.2574 27.1796 38.2574C32.8414 38.2574 37.8263 33.6532 38.3137 27.9737C38.8011 22.2941 34.6064 17.69 28.9446 17.69Z'
                                        fill='black'
                                    />
                                </g>
                                <path
                                    d='M50.2115 11.7769C50.3716 13.138 49.9329 14.4486 48.8955 15.7086C47.8581 16.9686 46.4613 17.5986 44.7053 17.5986L41.3661 17.6179C43.4549 20.4253 44.5463 24.0353 44.2083 27.9737C43.4407 36.9189 35.5895 44.1705 26.6722 44.1705C17.7549 44.1705 11.1482 36.9189 11.9158 27.9737C12.6834 19.0284 20.5346 11.7769 29.452 11.7769H50.2115ZM28.9446 17.69C23.2828 17.69 18.2979 22.2941 17.8105 27.9737C17.3231 33.6532 21.5178 38.2574 27.1796 38.2574C32.8414 38.2574 37.8263 33.6532 38.3137 27.9737C38.8011 22.2941 34.6064 17.69 28.9446 17.69Z'
                                    fill='#24D2FF'
                                />
                            </g>
                            <defs>
                                <filter
                                    id='filter0_d_1165_9214'
                                    x='-58'
                                    y='-16'
                                    width='172'
                                    height='172'
                                    filterUnits='userSpaceOnUse'
                                    color-interpolation-filters='sRGB'
                                >
                                    <feFlood flood-opacity='0' result='BackgroundImageFix' />
                                    <feColorMatrix
                                        in='SourceAlpha'
                                        type='matrix'
                                        values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                                        result='hardAlpha'
                                    />
                                    <feOffset dy='42' />
                                    <feGaussianBlur stdDeviation='30.5' />
                                    <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0' />
                                    <feBlend
                                        mode='normal'
                                        in2='BackgroundImageFix'
                                        result='effect1_dropShadow_1165_9214'
                                    />
                                    <feBlend
                                        mode='normal'
                                        in='SourceGraphic'
                                        in2='effect1_dropShadow_1165_9214'
                                        result='shape'
                                    />
                                </filter>
                                <filter
                                    id='filter1_d_1165_9214'
                                    x='-27.1448'
                                    y='4.77686'
                                    width='116.388'
                                    height='110.394'
                                    filterUnits='userSpaceOnUse'
                                    color-interpolation-filters='sRGB'
                                >
                                    <feFlood flood-opacity='0' result='BackgroundImageFix' />
                                    <feColorMatrix
                                        in='SourceAlpha'
                                        type='matrix'
                                        values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                                        result='hardAlpha'
                                    />
                                    <feOffset dy='32' />
                                    <feGaussianBlur stdDeviation='19.5' />
                                    <feColorMatrix
                                        type='matrix'
                                        values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.219132 0'
                                    />
                                    <feBlend
                                        mode='normal'
                                        in2='BackgroundImageFix'
                                        result='effect1_dropShadow_1165_9214'
                                    />
                                    <feBlend
                                        mode='normal'
                                        in='SourceGraphic'
                                        in2='effect1_dropShadow_1165_9214'
                                        result='shape'
                                    />
                                </filter>
                                <clipPath id='clip0_1165_9214'>
                                    <rect width='56' height='56' fill='white' />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <div className='text-white text-left font-inter text-[16px] font-bold relative max-sm:!text-sm'>
                        SigmaHQ
                    </div> */}
                </div>
                <div
                    // onClick={() => setSelectRepo('public')}
                    className={`rounded-[6px]   p-[16px] max-md:p-[8px] flex flex-row gap-[12px] items-center justify-start flex-shrink-0 relative overflow-hidden cursor-pointer w-full`}
                >
                    {/* <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='56'
                        height='56'
                        viewBox='0 0 56 56'
                        fill='none'
                        className="max-md:h-[40px] max-md:w-[40px]"
                    >
                        <path
                            d='M30.3333 16.3333L27.7304 11.1275C26.9813 9.62921 26.6067 8.88004 26.0479 8.33272C25.5537 7.8487 24.9581 7.48061 24.3042 7.25506C23.5647 7 22.7271 7 21.052 7H12.1333C9.51976 7 8.21297 7 7.21471 7.50864C6.33662 7.95605 5.62271 8.66995 5.1753 9.54804C4.66667 10.5463 4.66667 11.8531 4.66667 14.4667V16.3333M4.66667 16.3333H40.1333C44.0537 16.3333 46.0139 16.3333 47.5113 17.0963C48.8284 17.7674 49.8993 18.8383 50.5704 20.1554C51.3333 21.6528 51.3333 23.613 51.3333 27.5333V37.8C51.3333 41.7204 51.3333 43.6805 50.5704 45.1779C49.8993 46.4951 48.8284 47.5659 47.5113 48.237C46.0139 49 44.0537 49 40.1333 49H15.8667C11.9463 49 9.98612 49 8.48873 48.237C7.1716 47.5659 6.10074 46.4951 5.42962 45.1779C4.66667 43.6805 4.66667 41.7204 4.66667 37.8V16.3333Z'
                            stroke='#657890'
                            stroke-width='2'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                        />
                    </svg>
                    <div className='text-white text-left font-inter text-[16px] font-bold relative max-sm:!text-sm'>
                        More Public Repos
                    </div> */}
                </div>
                <div
                    // onClick={() => setSelectRepo('private')}
                    className={`rounded-[6px]  p-[16px] max-md:p-[8px] flex flex-row gap-[12px] items-center justify-start flex-shrink-0 relative overflow-hidden cursor-pointer w-full`}
                >
                    {/* <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='56'
                        height='56'
                        viewBox='0 0 56 56'
                        fill='none'
                        className="max-md:h-[40px] max-md:w-[40px]"
                    >
                        <path
                            d='M30.3333 16.3333L27.7304 11.1275C26.9813 9.62921 26.6067 8.88004 26.0479 8.33272C25.5537 7.8487 24.9581 7.48061 24.3042 7.25506C23.5647 7 22.7271 7 21.052 7H12.1333C9.51974 7 8.21296 7 7.2147 7.50864C6.33661 7.95605 5.6227 8.66995 5.17529 9.54804C4.66666 10.5463 4.66666 11.8531 4.66666 14.4667V16.3333M4.66666 16.3333H40.1333C44.0537 16.3333 46.0139 16.3333 47.5113 17.0963C48.8284 17.7674 49.8993 18.8383 50.5704 20.1554C51.3333 21.6528 51.3333 23.613 51.3333 27.5333V37.8C51.3333 41.7204 51.3333 43.6805 50.5704 45.1779C49.8993 46.4951 48.8284 47.5659 47.5113 48.237C46.0139 49 44.0537 49 40.1333 49H15.8667C11.9463 49 9.98611 49 8.48872 48.237C7.17159 47.5659 6.10072 46.4951 5.42961 45.1779C4.66666 43.6805 4.66666 41.7204 4.66666 37.8V16.3333ZM23.5667 40.8333H32.4333C33.7401 40.8333 34.3935 40.8333 34.8926 40.579C35.3317 40.3553 35.6886 39.9984 35.9123 39.5593C36.1667 39.0602 36.1667 38.4068 36.1667 37.1V35.2333C36.1667 33.9265 36.1667 33.2731 35.9123 32.774C35.6886 32.335 35.3317 31.978 34.8926 31.7543C34.3935 31.5 33.7401 31.5 32.4333 31.5H23.5667C22.2599 31.5 21.6065 31.5 21.1073 31.7543C20.6683 31.978 20.3113 32.335 20.0876 32.774C19.8333 33.2731 19.8333 33.9265 19.8333 35.2333V37.1C19.8333 38.4068 19.8333 39.0602 20.0876 39.5593C20.3113 39.9984 20.6683 40.3553 21.1073 40.579C21.6065 40.8333 22.2599 40.8333 23.5667 40.8333ZM32.0833 31.5V27.4167C32.0833 25.1615 30.2552 23.3333 28 23.3333C25.7448 23.3333 23.9167 25.1615 23.9167 27.4167V31.5H32.0833Z'
                            stroke='#657890'
                            stroke-width='2'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                        />
                    </svg>
                    <div className='text-white text-left font-inter text-[16px] font-bold relative max-sm:!text-sm'>
                        Private
                    </div> */}
                </div>
            </div>

            <div className=' flex flex-row gap-[12px] items-start justify-end flex-shrink-0 relative w-full'>
                <button
                    onClick={onClose}
                    className='bg-white rounded-[8px] border border-[#d0d5dd] p-[8px_12px_8px_12px] flex flex-row gap-[8px] items-center justify-center flex-shrink-0 relative shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden w-[120px]'
                >
                    <div className='text-[#182230] text-left font-inter  text-[16px] leading-[20px] font-semibold relative'>
                        Cancel
                    </div>
                </button>
                <button
                    onClick={handleNextpage}
                    disabled={!selectRepo ? true : false}
                    className={`${!selectRepo ? 'cursor-not-allowed opacity-50 hover' : 'cursor-pointer'
                        } bg-[#ee7103] rounded-[8px] p-[8px_12px_8px_12px] flex flex-row gap-[8px] items-center justify-center flex-shrink-0  relative shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden w-[120px]`}
                >
                    <div className='text-white text-left font-inter text-[16px] leading-[20px] font-semibold relative'>
                        Next
                    </div>
                </button>
            </div>
        </div>
    )

}

export default SelectRepositoryPage