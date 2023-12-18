import React, { useState, useEffect } from 'react'
import { LogError } from '../utils/handleErrors'
import { useUser } from '../context/UserProvider'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/images/logo.svg'
import signInBg from '../../assets/images/SignInbg.jpg'
import { VscSignIn } from 'react-icons/vsc'
import 'react-custom-alert/dist/index.css' // import css file from root.
import Loading from '../components/Other/Loading'
import { login } from '../utils/UserServices'
import ValidateUser from '../hooks/ValidateUser'
import LOG from '../hooks/GetUserInLogin'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setloading] = useState(false)
  const { signedin, loaded, user } = LOG()
  const { setUser } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (loaded && signedin) {
      setUser(user)
      navigate('/Welcome')
    }
  }, [loaded, user])

  const handleSubmit = async (e: React.FormEvent) => {
    setloading(true)
    e.preventDefault()

    try {
      const res = await login(email, password)
      setUser(res)
      navigate('/Welcome')
      setloading(false)
    } catch (error) {
      LogError(error)
    }
    setloading(false)
  }

  if (loading) return <Loading />

  return (
    <div className=" flex  items-start w-screen mobile:flex-col mobile:bg-white ">
      {/* Left Panel */}
      <div className="w-[50vw] h-screen text-white flex flex-col gap-4 p-8 justify-between mobile:hidden relative ">
        <img
          src={signInBg}
          className="absolute object-cover h-screen w-full  top-0 left-0"
        />
        <div className="p-4 text-white mb-8 mobile:m-0 mobile:flex mobile:w-screen mobile:items-center mobile:justify-center">
          <a href="/">
            <h1 className="text-2xl font-nasalization mobile:text-3xl">
              JOYRIDE
            </h1>
          </a>
        </div>
        <div className="absolute bottom-10 text-center left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center justify-end bottom-0 ">
            <h2 className="text-3xl font-semibold">Not a member yet?</h2>
            <h1 className="">Sign up & enjoy our services</h1>
          </div>
          <div className=" flex flex-col gap-8 mb-8">
            <div className="flex items-center justify-center">
              <a
                href="/SignUp"
                className="text-xl underline font-bold cursor-pointer"
              >
                Sign Up
              </a>
              <span className="ml-2 text-xl">&rarr;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col items-center justify-center bg-gray-100 p-8 w-[50vw] h-screen mobile:w-screen mobile:bg-white">
        <div className="p-4 text-red-500 mb-8 lg:hidden absolute top-1 left-1">
          <h1 className="text-2xl font-nasalization">JOYRIDE</h1>
        </div>
        <div className="flex flex-row gap-8 justify-center items-center">
          <p className="text-3xl font-semibold ">Sign In</p>
          <VscSignIn size={30} className="rotate-180" />
        </div>
        <form className="w-full max-w-sm">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              id="email"
              name="email"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
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
              onChange={(e) => setPassword(e.target.value)}
              required
              id="password"
              name="password"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          <button
            onClick={handleSubmit}
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full"
          >
            Sign In
          </button>

          <div className="mt-4 flex items-center justify-start gap-14 mobile:flex-col mobile:gap-4">
            <p className="text-black cursor-pointer hover:underline">
              Forgot Password?
            </p>
            <a href="/SignUp">
              Not a member yet?{' '}
              <span className="text-red-500 cursor-pointer hover:underline">
                Sign Up
              </span>
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
