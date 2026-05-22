import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../AuthProvider'

const RouteGuard = ({ requireAuth, requireUnauth, children }) => {
  const { isLoggedIn } = useContext(AuthContext)

  if (requireAuth && !isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  if (requireUnauth && isLoggedIn) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default RouteGuard
