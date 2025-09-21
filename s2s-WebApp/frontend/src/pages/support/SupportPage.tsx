import React from 'react'

const SupportPage: React.FC = () => {
  return (
    <div className='p-5 h-[89vh]'>
      <div className='grid grid-cols-3 gap-4 max-md:grid-cols-2 max-sm:grid-cols-1'>
        <div className='bg-[#1D2939] flex justify-between rounded-lg p-3 justify-center items-center'>
          <div>
            <p>Get Started</p>
          </div>
          <div>
            <button className='bg-[#EE7103] block px-4  py-2  Text md/Semibold leading-5 text-center text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue'>
              <a target='_blank' href='https://www.systemtwosecurity.com/get-started'>
                Open link
              </a>
            </button>
          </div>
        </div>
        <div className='bg-[#1D2939] flex justify-between rounded-lg p-3 justify-center items-center'>
          <div>
            <p>FAQ</p>
          </div>
          <div>
            <button className='bg-[#EE7103] block px-4  py-2  Text md/Semibold leading-5 text-center text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue'>
              <a target='_blank' href='https://www.systemtwosecurity.com/items'>
                Open link
              </a>
            </button>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  )
}

export default SupportPage
