import { Navigate } from 'react-router-dom'
import local from '../../utils/local'

interface props {
  children: any
}
const UnauthenticatedRoutes = ({ children }: props) => {
  const bearerToken: any = local.getItem('bearerToken')
  return !bearerToken ? children : <Navigate to='/app/landingpage' />
}

export default UnauthenticatedRoutes
