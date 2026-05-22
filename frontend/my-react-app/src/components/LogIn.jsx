import React from 'react'
import axios from 'axios'
import { useState, useContext } from "react"
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthProvider'

const LogIn = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const[error, setError] = useState('')
    const[successMessage, setSuccessMessage] = useState('')
    const[loading, setLoading] = useState(false)
    const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        const Userdata ={
            username: username,
            password: password
        }
        try{
            const respose= await axios.post('http://127.0.0.1:8000/api/v1/token/', Userdata)
            console.log('User logged in successfully:', respose.data)
            localStorage.setItem('access_token', respose.data.access)
            localStorage.setItem('refresh_token', respose.data.refresh)
            setSuccessMessage('Login successful!')
            setError('')
            setIsLoggedIn(true)
            navigate('/dashboard')
        } catch (error) {
                console.error('invalid credentials:')
                setError('Invalid credentials. Please try again')
            
            
        } finally {
            setLoading(false)
        }
    }

  return (
    <>
    <div className='container' >
    <div className='row justify-content-center' >   
        <div>
            <h2 className='text-center'>Login</h2>
        </div>
        <form onSubmit={handleLogin}>
            <div className=" mb-3"><input type="text" className='form-control ' placeholder='username' value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className=" mb-2"><input type="password" className='form-control ' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="alert alert-danger">{error}</p>}
            {successMessage && <p className="alert alert-success">Login successful!</p>}
            {loading ? (
                <button type="submit" className='btn btn-info d-block mx-auto'>Please Wait</button>
            )
             : (
                <button className="btn btn-info d-block mx-auto" type="submit" > Login </button>
                )}
                
        </form>
        <div>
            
        </div>
    </div>
    </div>    
    </>
  )
}

export default LogIn
