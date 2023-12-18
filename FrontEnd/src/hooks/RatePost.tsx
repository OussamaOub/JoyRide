import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { apiurl } from '../context/apiurl'

export default function RatePost() {
  const [israted, setisrated] = useState('none')
  const [shouldrate, setshouldrate] = useState(false)
  const [rating, setrating] = useState(0)
  useEffect(() => {
    const fetchlastride = async () => {
      const res = await axios.get(`${apiurl}/api/posts/getLastUserRide`, {
        withCredentials: true
      })
      if (res.status === 201 && res.data) {
        setisrated(res.data.post.ratedstatus)
        console.log(res.data.post.ratedstatus)
        if (
          res.data.post.ratedstatus === 'pending'
          //   res.data.post.arrivalDateTime <= new Date()
        ) {
          console.log('Blud should rate')
          setshouldrate(true)
        }
      }
    }
    fetchlastride()
  }, [])

  if (israted === 'none' || israted === 'completed') return null
  else if (israted === 'pending' && shouldrate)
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Rate your last ride</h1>
        <div className="flex flex-row space-x-4">
          <button
            onClick={() => setrating(1)}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white font-bold text-2xl"
          >
            1
          </button>
          <button
            onClick={() => setrating(2)}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white font-bold text-2xl"
          >
            2
          </button>
          <button
            onClick={() => setrating(3)}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white font-bold text-2xl"
          >
            3
          </button>
          <button
            onClick={() => setrating(4)}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white font-bold text-2xl"
          >
            4
          </button>
          <button
            onClick={() => setrating(5)}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white font-bold text-2xl"
          >
            5
          </button>
        </div>
        <button
          onClick={() => {
            axios.post(
              `${apiurl}/api/posts/ratepost`,
              {
                postid: israted,
                rating: rating
              },
              {
                withCredentials: true
              }
            )
            setshouldrate(false)
          }}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white font-bold text-2xl"
        >
          Rate
        </button>
      </div>
    )
  else
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">You have already rated this ride</h1>
      </div>
    )
}
