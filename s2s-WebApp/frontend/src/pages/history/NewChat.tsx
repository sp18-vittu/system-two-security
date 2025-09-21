import { CircularProgress } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React from 'react'
import PromptQuery from '../../components/Prompt/PromptQuery'
import { sanitizeNewChat } from '../../redux/nodes/chats/newchatAction'
import { useDispatch, useSelector } from 'react-redux'
import useInput from '../../components/Utils/hooks/useInput'

const useStyles = makeStyles((theme: any) => ({
  container: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    width: '100%',
    height: '85vh',
    display: 'flex',
    flexDirection: 'column',
  },
  promptContainer: {
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'coloum-revert',
    width: '100%',
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column-reverse',
    flexGrow: '8',
    overflowY: 'auto',
  },
  searchInputContainer: {
    display: 'flex',
    alignSelf: 'end',
    width: '100%',
    marginTop: 'auto',
    border: '1px solid #0c0c0c',
  },
}))
export default function NewChat() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { value: query, bind: queryBind, reset: queryReset } = useInput('')
  const chatValue = useSelector((state: any) => state.newChatReducers)

  const auth = useSelector((state: any) => state.auth)
  const items = chatValue.chatnewResults ? chatValue.chatnewResults : []
  const loadingPromtRes = chatValue.loading ? chatValue.loading : false
  const handleSend = (event: any) => {
    event.preventDefault()
    queryReset()
    dispatch(sanitizeNewChat({ query: query, dateTime: new Date() }, auth.user?.email) as any)
  }

  return (
    <>
      <div className={classes.container}>
        <div className={classes.chatContainer}>
          {items?.length > 0 &&
            items.map((item: any, index: number) => <PromptQuery key={index} message={item} />)}
        </div>
        {loadingPromtRes && (
          <CircularProgress
            color='inherit'
            size={55}
            style={{ marginBottom: 20, marginLeft: 20 }}
          />
        )}
        <div>
          <div>
            <form onSubmit={handleSend} target='_self'>
              <div className='relative'>
                <input
                  type='search'
                  id='search'
                  className='block w-full p-4 pl-5 border-solid outline-none border-2 border-gray-900  text-sm rounded-lg'
                  placeholder='Send a message'
                  maxLength={4096}
                  required
                  {...queryBind}
                />
                <button
                  type='submit'
                  className='text-white w-24 absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2'
                  style={{ background: '#135056' }}
                  disabled={query === ''}
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
