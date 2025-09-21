import jwt_decode from 'jwt-decode'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import local from '../../utils/local'
import './TokenCall.css'
import { overview } from '../../redux/nodes/overview/action'
import { chatSideList } from '../../redux/nodes/chat/action'
import Axios from 'axios'
import { isTokenExpired } from '../../components/Appbar/isTokenExpired'

const TokenCall = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigateTo = useNavigate()

  const setToken = () => {
    const bearerToken = location.state.bearerToken
    if (bearerToken && isTokenExpired(bearerToken)) {
      local.clear()
      navigateTo('/')
    } else {
      const data = 'Bearer ' + bearerToken
      local.setItem('bearerToken', JSON.stringify({ bearerToken: data }))
      const decodedToken: any = jwt_decode(data)
      local.setItem('auth', JSON.stringify({ isAuthenticated: true, user: decodedToken }))
      dispatch(overview(data) as any).then((response: any) => {
        if (response) {
          local.setItem('dashBoard', JSON.stringify(response.payload))
          navigateTo('/app/landingpage')
        }
      })
    }
  }
  async function valueJson() {
    try {
      const response = await Axios.get(
        'https://s3.us-west-2.amazonaws.com/data.us-west-2.systemtwosecurity.com/ChatQuestions.json',
      )
      local.setItem('workbench_details', JSON.stringify(response.data))
      const localToken = local.getItem('bearerToken')
      const token = JSON.parse(localToken as any)
      const localStoraged = local.getItem('auth')
      const locals = JSON.parse(localStoraged as any)
      const userId = locals?.user?.user?.id
      dispatch(chatSideList(token, userId) as any)
    } catch (error) {}
  }
  useEffect(() => {
    setToken()
    valueJson()
  }, [])

  return <div className='loader'></div>
}

export default TokenCall
