import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Sidebar.css'

const SidebarlistItem = () => {
  const navigateTo = useNavigate()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isAdminOpen, setIsAdminOpen] = useState(false)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
    navigateTo('/app/history')
  }

  const toggleAdminDropdown = () => {
    setIsAdminOpen(!isAdminOpen)
  }

  const dataVaultnavigate = () => {
    navigateTo('/app/datavault')
  }
  const auditnavigate = () => {
    navigateTo('/app/audit')
  }

  const overviewnavigate = () => {
    navigateTo('/app/landingpage')
  }

  const usernavigate = () => {
    navigateTo('/app/users')
  }
  const NewChat = () => {
    navigateTo('/app/newChat')
  }
  const chatone = () => {
    navigateTo('/app/chatone')
  }

  return (
    <nav className='p-4 max-h-80 overflow-auto scroll-smooth custom-scrollbar-container navitem'>
      <ul className='space-y-2 font-medium text-white'>
        <li>
          <a
            onClick={overviewnavigate}
            className='cursor-pointer flex items-center p-2 text-white-900 rounded-lg hover:bg-white-100 group max-sm:hidden sm:hidden md:flex'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='flex-shrink-0 w-5 h-5  mr-2 text-white-500 transition duration-75 group-hover:text-white-900'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
            >
              <path
                d='M8 17.0002H16M11.0177 2.76424L4.23539 8.03937C3.78202 8.39199 3.55534 8.5683 3.39203 8.7891C3.24737 8.98469 3.1396 9.20503 3.07403 9.4393C3 9.70376 3 9.99094 3 10.5653V17.8002C3 18.9203 3 19.4804 3.21799 19.9082C3.40973 20.2845 3.71569 20.5905 4.09202 20.7822C4.51984 21.0002 5.07989 21.0002 6.2 21.0002H17.8C18.9201 21.0002 19.4802 21.0002 19.908 20.7822C20.2843 20.5905 20.5903 20.2845 20.782 19.9082C21 19.4804 21 18.9203 21 17.8002V10.5653C21 9.99094 21 9.70376 20.926 9.4393C20.8604 9.20503 20.7526 8.98469 20.608 8.7891C20.4447 8.5683 20.218 8.39199 19.7646 8.03937L12.9823 2.76424C12.631 2.49099 12.4553 2.35436 12.2613 2.30184C12.0902 2.2555 11.9098 2.2555 11.7387 2.30184C11.5447 2.35436 11.369 2.49099 11.0177 2.76424Z'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>

            <span className='flex-1 ml-3 whitespace-nowrap'> Overview</span>
          </a>
        </li>
        <li>
          <button
            onClick={toggleDropdown}
            type='button'
            className='flex items-center  w-full p-2 text-base text-white-900 transition duration-75 rounded-lg group hover:bg-white-100'
            aria-controls='dropdown-example'
            data-collapse-toggle='dropdown-example'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='flex-shrink-0 w-5 h-5 mr-2 text-white-500 transition duration-75 group-hover:text-white-900'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
            >
              <path
                d='M10 15L6.92474 18.1137C6.49579 18.548 6.28131 18.7652 6.09695 18.7805C5.93701 18.7938 5.78042 18.7295 5.67596 18.6076C5.55556 18.4672 5.55556 18.162 5.55556 17.5515V15.9916C5.55556 15.444 5.10707 15.0477 4.5652 14.9683V14.9683C3.25374 14.7762 2.22378 13.7463 2.03168 12.4348C2 12.2186 2 11.9605 2 11.4444V6.8C2 5.11984 2 4.27976 2.32698 3.63803C2.6146 3.07354 3.07354 2.6146 3.63803 2.32698C4.27976 2 5.11984 2 6.8 2H14.2C15.8802 2 16.7202 2 17.362 2.32698C17.9265 2.6146 18.3854 3.07354 18.673 3.63803C19 4.27976 19 5.11984 19 6.8V11M19 22L16.8236 20.4869C16.5177 20.2742 16.3647 20.1678 16.1982 20.0924C16.0504 20.0255 15.8951 19.9768 15.7356 19.9474C15.5558 19.9143 15.3695 19.9143 14.9969 19.9143H13.2C12.0799 19.9143 11.5198 19.9143 11.092 19.6963C10.7157 19.5046 10.4097 19.1986 10.218 18.8223C10 18.3944 10 17.8344 10 16.7143V14.2C10 13.0799 10 12.5198 10.218 12.092C10.4097 11.7157 10.7157 11.4097 11.092 11.218C11.5198 11 12.0799 11 13.2 11H18.8C19.9201 11 20.4802 11 20.908 11.218C21.2843 11.4097 21.5903 11.7157 21.782 12.092C22 12.5198 22 13.0799 22 14.2V16.9143C22 17.8462 22 18.3121 21.8478 18.6797C21.6448 19.1697 21.2554 19.5591 20.7654 19.762C20.3978 19.9143 19.9319 19.9143 19 19.9143V22Z'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span className='flex-1 ml-3 text-left whitespace-nowrap'>Chats</span>
            <svg
              className='w-3 h-3'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 10 6'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='m1 1 4 4 4-4'
              />
            </svg>
          </button>
          {isDropdownOpen && (
            <ul id='dropdown-example' className='py-2 space-y-2'>
              <li className='text-xs'>
                <button
                  onClick={NewChat}
                  className='flex items-center w-full p-2 text-white-900 transition duration-75 rounded-lg pl-11 group hover:bg-white-100 '
                >
                  <svg
                    width='18'
                    height='18'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M12 13.5V7.5M9 10.5H15M7 18V20.3355C7 20.8684 7 21.1348 7.10923 21.2716C7.20422 21.3906 7.34827 21.4599 7.50054 21.4597C7.67563 21.4595 7.88367 21.2931 8.29976 20.9602L10.6852 19.0518C11.1725 18.662 11.4162 18.4671 11.6875 18.3285C11.9282 18.2055 12.1844 18.1156 12.4492 18.0613C12.7477 18 13.0597 18 13.6837 18H16.2C17.8802 18 18.7202 18 19.362 17.673C19.9265 17.3854 20.3854 16.9265 20.673 16.362C21 15.7202 21 14.8802 21 13.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V14C3 14.93 3 15.395 3.10222 15.7765C3.37962 16.8117 4.18827 17.6204 5.22354 17.8978C5.60504 18 6.07003 18 7 18Z'
                      stroke='#D0D5DD'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  <span className='mx-3'>New chat</span>
                  <span className='mx-4'>
                    <svg
                      width='20'
                      height='20'
                      viewBox='0 0 20 20'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M10.0001 4.1665V15.8332M4.16675 9.99984H15.8334'
                        stroke='#475467'
                        strokeWidth='1.66667'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </span>
                </button>
              </li>
              <li className='text-xs'>
                <span className='text-slate-300' style={{ fontSize: '8px', marginLeft: '40px' }}>
                  Today
                </span>
                <button
                  onClick={chatone}
                  className='flex items-center w-full p-2 text-white-900 transition duration-75 rounded-lg pl-11 group hover:bg-white-100 '
                >
                  <svg
                    width='18'
                    height='18'
                    viewBox='0 0 20 21'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M1 5.8C1 4.11984 1 3.27976 1.32698 2.63803C1.6146 2.07354 2.07354 1.6146 2.63803 1.32698C3.27976 1 4.11984 1 5.8 1H14.2C15.8802 1 16.7202 1 17.362 1.32698C17.9265 1.6146 18.3854 2.07354 18.673 2.63803C19 3.27976 19 4.11984 19 5.8V11.2C19 12.8802 19 13.7202 18.673 14.362C18.3854 14.9265 17.9265 15.3854 17.362 15.673C16.7202 16 15.8802 16 14.2 16H11.6837C11.0597 16 10.7477 16 10.4492 16.0613C10.1844 16.1156 9.9282 16.2055 9.68749 16.3285C9.41617 16.4671 9.17252 16.662 8.68521 17.0518L6.29976 18.9602C5.88367 19.2931 5.67563 19.4595 5.50054 19.4597C5.34827 19.4599 5.20422 19.3906 5.10923 19.2716C5 19.1348 5 18.8684 5 18.3355V16C4.07003 16 3.60504 16 3.22354 15.8978C2.18827 15.6204 1.37962 14.8117 1.10222 13.7765C1 13.395 1 12.93 1 12V5.8Z'
                      stroke='#D0D5DD'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  <span className='mx-3'> Chat 1</span>
                  <span className='mx-4'>
                    <button>
                      <svg
                        width='18'
                        height='17'
                        viewBox='0 0 18 17'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M16.5 14L15.6666 14.9117C15.2245 15.3951 14.6251 15.6667 14.0001 15.6667C13.3751 15.6667 12.7757 15.3951 12.3337 14.9117C11.891 14.4293 11.2916 14.1584 10.6668 14.1584C10.042 14.1584 9.44261 14.4293 8.99998 14.9117M1.5 15.6667H2.89545C3.3031 15.6667 3.50693 15.6667 3.69874 15.6206C3.8688 15.5798 4.03138 15.5125 4.1805 15.4211C4.34869 15.318 4.49282 15.1739 4.78107 14.8856L15.25 4.41669C15.9404 3.72634 15.9404 2.60705 15.25 1.91669C14.5597 1.22634 13.4404 1.22634 12.75 1.91669L2.28105 12.3856C1.9928 12.6739 1.84867 12.818 1.7456 12.9862C1.65422 13.1353 1.58688 13.2979 1.54605 13.468C1.5 13.6598 1.5 13.8636 1.5 14.2713V15.6667Z'
                          stroke='#98A2B3'
                          strokeWidth='1.66667'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </button>
                    <button className='mx-1'>
                      <svg
                        width='18'
                        height='20'
                        viewBox='0 0 18 20'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M12.3333 4.99984V4.33317C12.3333 3.39975 12.3333 2.93304 12.1517 2.57652C11.9919 2.26292 11.7369 2.00795 11.4233 1.84816C11.0668 1.6665 10.6001 1.6665 9.66667 1.6665H8.33333C7.39991 1.6665 6.9332 1.6665 6.57668 1.84816C6.26308 2.00795 6.00811 2.26292 5.84832 2.57652C5.66667 2.93304 5.66667 3.39975 5.66667 4.33317V4.99984M7.33333 9.58317V13.7498M10.6667 9.58317V13.7498M1.5 4.99984H16.5M14.8333 4.99984V14.3332C14.8333 15.7333 14.8333 16.4334 14.5608 16.9681C14.3212 17.4386 13.9387 17.821 13.4683 18.0607C12.9335 18.3332 12.2335 18.3332 10.8333 18.3332H7.16667C5.76654 18.3332 5.06647 18.3332 4.53169 18.0607C4.06129 17.821 3.67883 17.4386 3.43915 16.9681C3.16667 16.4334 3.16667 15.7333 3.16667 14.3332V4.99984'
                          stroke='#98A2B3'
                          strokeWidth='1.66667'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </button>
                  </span>
                </button>
              </li>
            </ul>
          )}
        </li>
        <li>
          <a
            onClick={dataVaultnavigate}
            className='flex items-center p-2 text-white-900 rounded-lg hover:bg-white-100 group cursor-pointer  max-sm:hidden sm:hidden md:flex '
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='flex-shrink-0 w-5 h-5  mr-2 text-white-500 transition duration-75  group-hover:text-white-900 '
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
            >
              <path
                d='M21 5C21 6.65685 16.9706 8 12 8C7.02944 8 3 6.65685 3 5M21 5C21 3.34315 16.9706 2 12 2C7.02944 2 3 3.34315 3 5M21 5V19C21 20.66 17 22 12 22C7 22 3 20.66 3 19V5M21 12C21 13.66 17 15 12 15C7 15 3 13.66 3 12'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span className='flex-1 ml-3 whitespace-nowrap'>Data Vault</span>
          </a>
        </li>
        <li className='max-sm:hidden sm:hidden md:block'>
          <button
            onClick={toggleAdminDropdown}
            type='button'
            className='flex items-center w-full p-2 text-base text-white-900 transition duration-75 rounded-lg group hover:bg-white-100 '
            aria-controls='dropdown-example'
            data-collapse-toggle='dropdown-example'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='flex-shrink-0 w-5 h-5 mr-2 text-white-500 transition duration-75 group-hover:text-white-900'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
            >
              <path
                d='M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span className='flex-1 ml-3 text-left whitespace-nowrap'>Admin Control</span>
            <svg
              className='w-3 h-3'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 10 6'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='m1 1 4 4 4-4'
              />
            </svg>
          </button>
          {isAdminOpen && (
            <ul id='dropdown-example' className='py-2 space-y-2'>
              <li>
                <a
                  onClick={auditnavigate}
                  className='cursor-pointer flex items-center w-full p-2 text-white-900 transition duration-75 rounded-lg pl-11 group hover:bg-white-100 '
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <path
                      d='M14 11H8M10 15H8M16 7H8M20 10.5V6.8C20 5.11984 20 4.27976 19.673 3.63803C19.3854 3.07354 18.9265 2.6146 18.362 2.32698C17.7202 2 16.8802 2 15.2 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.11984 22 8.8 22H11.5M22 22L20.5 20.5M21.5 18C21.5 19.933 19.933 21.5 18 21.5C16.067 21.5 14.5 19.933 14.5 18C14.5 16.067 16.067 14.5 18 14.5C19.933 14.5 21.5 16.067 21.5 18Z'
                      stroke='#D0D5DD'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  <span className='pl-2'> Audit</span>
                </a>
              </li>
              <li>
                <a
                  onClick={usernavigate}
                  className='flex items-center w-full p-2 text-white-900 transition duration-75 rounded-lg pl-11 group hover:bg-white-100 cursor-pointer'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <path
                      d='M22 21V19C22 17.1362 20.7252 15.5701 19 15.126M15.5 3.29076C16.9659 3.88415 18 5.32131 18 7C18 8.67869 16.9659 10.1159 15.5 10.7092M17 21C17 19.1362 17 18.2044 16.6955 17.4693C16.2895 16.4892 15.5108 15.7105 14.5307 15.3045C13.7956 15 12.8638 15 11 15H8C6.13623 15 5.20435 15 4.46927 15.3045C3.48915 15.7105 2.71046 16.4892 2.30448 17.4693C2 18.2044 2 19.1362 2 21M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z'
                      stroke='#D0D5DD'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  <span className='pl-2'> Users</span>
                </a>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  )
}

export default SidebarlistItem
