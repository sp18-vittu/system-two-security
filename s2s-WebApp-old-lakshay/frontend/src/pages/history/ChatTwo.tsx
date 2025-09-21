import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { sanitizePrompt } from '../../redux/nodes/app/actions'
import { makeStyles } from '@mui/styles'
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
    background: '#F2F4F7',
  },
  textbot: {
    marginTop: '37%',
  },
}))
export default function ChatTwoPage() {
  const classes = useStyles()
  const { value: query, bind: queryBind, reset: queryReset } = useInput('')
  const app = useSelector((state: any) => state.app)
  const auth = useSelector((state: any) => state.auth)
  const dispatch = useDispatch()
  useEffect(() => {
    if (app.errors) {
    }
    if (app) {
    }
  }, [app])
  const handleSend = (event: any) => {
    event.preventDefault()
    queryReset()
    dispatch(sanitizePrompt({ query: query, dateTime: new Date() }, auth.user?.email) as any)
  }
  return (
    <div>
      <div className={classes.container}>
        <div className={classes.textbot}>
          <form onSubmit={handleSend} target='_self'>
            <div className='relative '>
              <input
                type='search'
                id='search'
                className='block  w-full p-4 pl-5 text-sm rounded-lg'
                placeholder='send a message'
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
  )
}
