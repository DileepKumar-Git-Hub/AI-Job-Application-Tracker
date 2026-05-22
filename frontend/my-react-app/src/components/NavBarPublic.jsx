import { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthProvider'

const NavBarPublic = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setIsLoggedIn(false)
    navigate('/login')
  }

  return (
    <>
      <nav className="navbar container pt-3 pb-3 align-items-start">
        <NavLink className="navbar-brand" to="/">
          AI Job Application Tracker
        </NavLink>
        <div className="nav-actions">
          {isLoggedIn ? (
            <>
              <button className="nav-link btn btn-outline-infobtn btn-info d-block mx-auto" onClick={handleLogout}>
                Log Out
              </button>
              <NavLink className="nav-link btn btn-outline-infobtn btn-info d-block mx-auto" to="/dashboard">
                Dashboard
              </NavLink>
              <NavLink className="nav-link btn btn-outline-infobtn btn-info d-block mx-auto" to="/resume">
                Upload Resume
              </NavLink>
              <NavLink className="nav-link btn btn-outline-infobtn btn-info d-block mx-auto" to="/ai-features">
                Use AI
              </NavLink>
              <NavLink className="nav-link btn btn-outline-infobtn btn-info d-block mx-auto" to="/jobs">
                Jobs
              </NavLink>
            </>
          ) : (
            <>
              <NavLink className="nav-link btn btn-outline-infobtn btn-info d-block mx-auto" to="/login">
                Login
              </NavLink>
              <NavLink className="nav-link btn btn-outline-secondary d-block mx-auto" to="/signup">
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </nav>
      <hr />
    </>
  )
}

export default NavBarPublic

