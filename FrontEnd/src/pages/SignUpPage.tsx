import { useState } from 'react'
import axios from 'axios'
import { LogError } from '../utils/handleErrors'
import { useUser } from '../context/UserProvider'
import { useNavigate } from 'react-router-dom'
import SignUpBackground from '../../assets/images/signupbg.jpg'
import { apiurl } from '../context/apiurl'
import Loading from '../components/Other/Loading'
import { login } from '../utils/UserServices'

export default function SignUpPage() {
  const [loading, setloading] = useState(false)
  const [email, setEmail] = useState('')
  const [firstName, setFirstname] = useState('')
  const [lastName, setlastname] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, seterror] = useState('')
  const navigate = useNavigate()
  const { setUser } = useUser()

  const handleChange = (e: any) => {
    const { id, value } = e.target

    // Use a switch statement to update the correct state variable based on the name
    switch (id) {
      case 'email':
        setEmail(value)
        break
      case 'firstname':
        setFirstname(value)
        break
      case 'lastname':
        setlastname(value)
        break
      case 'username':
        setUsername(value)
        break
      case 'password':
        setPassword(value)
        break
      default:
      // Handle other input fields or cases if needed
      // console.log('This should not be logged')
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${apiurl}/api/user/signup`, {
        email,
        password,
        username,
        firstName,
        lastName
      })

      if (response.status === 201) {
        try {
          const res = await login(email, password)
          setUser(res)
          navigate('/Welcome')
        } catch (error) {
          LogError(error)
        } // User created successfully, you can redirect or perform other actions here.
        return
      } else {
        // Handle registration errors
        LogError('Registration failed')
      }
    } catch (error) {
      seterror(LogError(error))
    }
  }

  const isWideScreen = window.innerWidth >= 768

  if (loading) return <Loading />

  return (
    <div
      className="w-screen h-screen "
      style={{
        backgroundImage: isWideScreen ? `url(${SignUpBackground})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="p-4 text-white mb-8 mobile:m-0 mobile:flex mobile:w-screen mobile:items-center mobile:justify-center">
        <a href="/">
          <h1 className="text-2xl font-nasalization mobile:text-3xl">
            JOYRIDE
          </h1>
        </a>
      </div>
      <div className="flex flex-col items-center justify-center p-4 w-[35vw] mobile:w-4/5 absolute left-1/2  -translate-x-1/2 bg-white py-10 mobile:py-5 rounded-lg ">
        <h2 className="text-3xl font-semibold mb-6">Sign Up</h2>
        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="firstname"
              className="block text-sm font-medium text-gray-600"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="lastname"
              className="block text-sm font-medium text-gray-600"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              required
              name="lastname"
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              required
              name="username"
              // style={{ borderColor: error ? 'red' : 'gray' }}
              className={`mt-1 p-2 border border-gray-300 rounded-md w-full ${
                error === 'username already in use' &&
                'border-red-500 focus:border-red-500 focus:outline-red-500 focus:outline-offset-0'
              }`}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              required
              id="email"
              name="email"
              className={`mt-1 p-2 border border-gray-300 rounded-md w-full ${
                error === 'email already in use' &&
                'border-red-500 focus:border-red-500 focus:outline-red-500 focus:outline-offset-0'
              }`}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              name="password"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            onSubmit={handleSubmit}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full"
          >
            Sign Up
          </button>

          <div className="mt-4 flex flex-row items-center justify-start gap-14 ">
            <p className="text-black flex gap-2">
              Already have an account?{' '}
              <a
                href="/SignIn"
                className="text-red-500 underline cursor-pointer"
              >
                Sign In
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
