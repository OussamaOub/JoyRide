import { useOutletContext } from 'react-router-dom'
import Loading from '../components/Other/Loading'
import { User } from '../context/UserProvider'
import { IoLocation, IoEye, IoEyeOff } from 'react-icons/io5'
import { useState } from 'react'
import axios from 'axios'
import { apiurl } from '../context/apiurl'
import { toast } from 'react-custom-alert'

function ProfilePage() {
  const [user, isLoaded] = useOutletContext() as [User | undefined, boolean]

  const [showPassword, setShowPassword] = useState(false)
  const [oldpass, setOldPass] = useState('')
  const [newpass, setNewPass] = useState('')
  const [firstName, setFirstName] = useState(user?.firstName)
  const [lastName, setLastName] = useState(user?.lastName)
  const [username, setUsername] = useState(user?.username)
  const [email, setEmail] = useState(user?.email)
  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  if (!isLoaded) return <Loading />

  const handleChangePass = async (e: any) => {
    e.preventDefault()
    const res = await axios.post(
      `${apiurl}/api/user/changepassword/${newpass}&${oldpass}`,
      {},
      { withCredentials: true }
    )
    if (res.status === 201) {
      toast.success('Password changed successfully')
    } else {
      toast.error('Error')
      console.log(res.data)
    }
  }

  const handleSave = async (e: any) => {
    if (
      firstName?.trim() === '' ||
      lastName?.trim() === '' ||
      username?.trim() === '' ||
      email?.trim() === ''
    ) {
      toast.error('Please fill all the fields')
      return
    }

    e.preventDefault()
    const res = await axios.post(
      `${apiurl}/api/user/changeuserdata`,
      { firstName, lastName, username, email },
      { withCredentials: true }
    )
    if (res.status === 201) {
      toast.success('Saved successfully')
    } else {
      toast.error('Error')
      console.log(res.data)
    }
  }

  return (
    <div className="flex flex-row mobile:flex-col w-full h-screen patternbg ">
      <main className=" w-full p-20 flex flex-col gap-4">
        <div className="flex gap-2">
          <h1 className="text-3xl font-semibold">
            {firstName} {lastName}
          </h1>
          {/* <div className="flex gap-1 items-center mt-6">
            <IoLocation />
            <h1 className="text-sm">Ifrane, Morocco</h1>
          </div> */}
        </div>

        <hr className="border-gray-600 my-4" />

        <div className=" flex flex-col bg-white p-4 border border-black-500 shadow-sm rounded-lg">
          <h1 className="text-black text-2xl font-semibold">
            Account Settings
          </h1>

          <div className="flex flex-col w-full gap-4 mt-4">
            <div className="flex items-center  gap-4 w-full">
              <div className="flex flex-col gap-2 w-1/2">
                <label className="text-sm font-medium">First Name:</label>
                <input
                  className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                  type="text"
                  defaultValue={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2 w-1/2">
                <label className="text-sm font-medium">Last Name:</label>
                <input
                  className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                  type="text"
                  defaultValue={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Username:</label>
              <input
                className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 w-full"
                type="text"
                defaultValue={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Email:</label>
              <input
                className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 w-full"
                type="email"
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Change Password:</label>
              <div className="flex items-center gap-4">
                <input
                  className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 w-full"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Old Password"
                  onChange={(e) => setOldPass(e.target.value)}
                />
                <input
                  className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 w-full"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  onChange={(e) => setNewPass(e.target.value)}
                />
                <button
                  className="text-red-500 focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <IoEyeOff /> : <IoEye />}
                </button>
              </div>
              <button
                className="text-sm text-white bg-red-500 hover:bg-red-600 rounded-full py-2 w-44 self-center"
                onClick={handleChangePass}
              >
                Change Password
              </button>
            </div>

            {/* <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Phone Number:</label>
              <input
                className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 w-full"
                type="tel"
                defaultValue="phoneNumber"
              />
            </div> */}
          </div>

          <button
            className="mb-4 mt-8 bg-red-500 hover:bg-red-600 rounded-full py-2 w-44 text-white"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage
