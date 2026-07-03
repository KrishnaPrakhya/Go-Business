import Cookies from 'js-cookie'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  if (!Cookies.get('jwt_token')) {
    return <Navigate to="/login" replace />
  }
  return children
}
