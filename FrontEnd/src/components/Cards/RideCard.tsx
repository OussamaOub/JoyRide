import React, { useEffect, useState } from 'react'
import Loading from '../Other/Loading'
import { apiurl } from '../../context/apiurl'
import axios from 'axios'
import { PostCard } from './PostCard'
import { User } from '../../context/UserProvider'

interface RideCardProp {
  id: string
  userId: string
  postId: string
}

export default function RideCard({
  ride,
  user
}: {
  ride: RideCardProp
  user: User | undefined
}) {
  const [post, setpost] = useState<any>(null) // Update the type of post to 'any'
  const [people, setpeople] = useState([])
  const [loading, setloading] = useState(true)

  useEffect(() => {
    const fetchrideData = async () => {
      const res = await axios.get(
        `${apiurl}/api/posts/getpost/${ride.postId}`,
        { withCredentials: true }
      )
      if (res.status === 201) setpost(res.data)
      else {
        // console.log('Unexpected error')
      }
      setloading(false)
    }
    fetchrideData()
  }, [])

  if (loading) return <Loading />

  return <PostCard post={post} setloading={setloading} user={user} />
}
