import { useEffect, useState } from 'react'
import { useUser } from '../context/UserProvider'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { apiurl } from '../context/apiurl'

export default function ValidateUser() {
  const [isloaded, setloading] = useState(false)
  const { user, setUser } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    setloading(false)

    const asyncfunc = async () => {
      try {
        const res = await axios.get(`${apiurl}/api/user/getuser`, {
          withCredentials: true
        })
        if (res.status === 202) {
          // console.log('Here ??')
          setUser(res.data)
        } else {
          navigate('/')
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log('Axios Error:', error)
        } else {
          console.error('Non-Axios Error:', error)
        }
        navigate('/')
      }
    }

    if (!user) {
      asyncfunc()
    }
    setloading(true)
  }, [user, navigate, setUser])

  return { user, isloaded }
}
