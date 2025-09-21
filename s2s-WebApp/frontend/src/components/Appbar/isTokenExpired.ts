import jwt_decode from 'jwt-decode'

interface JwtPayload {
  exp: number
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken = jwt_decode<JwtPayload>(token)
    const currentTime = Math.floor(Date.now() / 1000)

    if (decodedToken.exp < currentTime) {
      return true
    }
    return false
  } catch (error) {
    return true
  }
}
