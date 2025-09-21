import React from 'react'
import { useData } from '../../layouts/shared/DataProvider'

const ChatScreen = () => {
  const { chatScreen, setChatScreen }: any = useData()
  console.log('chatScreen', chatScreen)
  const toChatScreen = () => {
    setChatScreen(false)
  }
  return (
    <>
      <div className='grid grid-cols-4 gap-4 text-white  ' onClick={() => toChatScreen()}>
        <div></div>
        <div className='col-span-2 flex justify-center'>
          <div className='p-[128px] '>
            <div
              className={`${
                chatScreen?.value
                  ? 'translate-x-[10rem] border border-dashed rounded-lg p-[16px] w-[520px] h-[54px] '
                  : ' border border-dashed rounded-lg p-[16px] w-[520px] h-[54px]'
              }`}
            >
              <p className='text-white font-semibold font-inter text-sm leading-5'>
                Start a new workbench by picking a CTI report from the list of repositories.
              </p>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </>
  )
}

export default ChatScreen
