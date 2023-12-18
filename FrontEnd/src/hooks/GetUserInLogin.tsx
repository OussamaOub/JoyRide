import React, { useEffect, useState } from 'react'
import { useUser } from '../context/UserProvider'
import ValidateUser from './ValidateUser'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { apiurl } from '../context/apiurl'

function LOG() {
  const { user, setUser } = useUser()
  // const { user, isloaded } = ValidateUser()
  const [loaded, setloaded] = useState(false)
  const [signedin, setsignedin] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    async function authuser() {
      try {
        const res = await axios.get(`${apiurl}/api/user/getuser`, {
          withCredentials: true
        })
        if (res.status === 202) {
          setloaded(true)
          setsignedin(true)
          setUser(res.data)
        } else {
          setloaded(true)
          setsignedin(false)
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setloaded(true)
          setsignedin(false)
          console.log('Axios Error:', error)
        } else {
          setloaded(true)
          setsignedin(false)
          console.error('Non-Axios Error:', error)
        }
      }
    }
    if (user) {
      setUser(user)
      setsignedin(true)
      setloaded(true)
      navigate('/Welcome')
    } else {
      authuser()
    }
    return () => {}
  }, [loaded, user])
  return { loaded, signedin, user }
}

export default LOG
