import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState({})
    const [successMessage, setSuccessMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleRegistration = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError({})
        const userData = {
            username,
            email,
            password,
        }
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/register/', userData)
            setSuccessMessage('Registration successful! Redirecting to login...')
            setUsername('')
            setEmail('')
            setPassword('')
            setTimeout(() => navigate('/login'), 1200)
        } catch (err) {
            setError(err.response?.data || { detail: 'Registration failed' })
            console.error('Error occurred while registering user:', err)
        } finally {
            setLoading(false)
        }
    }
  return (
    <>
    <div className='container' >
    <div className='row justify-content-center' >   
        <div>
            <h2 className='text-center'>Create An Account</h2>
        </div>
        <form onSubmit={handleRegistration}>
            <div className=" mb-3"><input type="text" className='form-control ' placeholder='username' value={username} onChange={(e) => setUsername(e.target.value)} />
            <small className='text-danger '>{error.username}</small></div>
            <div className=" mb-3"><input type="email" className='form-control ' placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            <small className='text-danger '>{error.email}</small></div>
            <div className=" mb-2"><input type="password" className='form-control ' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <small className='text-danger'>{error.password}</small></div>
            {successMessage && <p className="alert alert-success">Registration successful! You can now log in.</p>}
            {loading ? (
                <button type="submit" className='btn btn-info d-block mx-auto'>Please Wait</button>
            )
             : (
                <button className="btn btn-info d-block mx-auto" type="submit" > Sign Up </button>
                )}
                
        </form>
        <div>
            
        </div>
    </div>
    </div>    
    </>
  )
}

export default SignUp

