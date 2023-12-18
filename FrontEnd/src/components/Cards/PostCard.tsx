import axios from 'axios'
import { User } from '../../context/UserProvider'
import React, { useEffect, useState } from 'react'
import { apiurl } from '../../context/apiurl'
import { LogError } from '../../utils/handleErrors'
import { Button, Col } from 'react-bootstrap'
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import { FaRegCalendarAlt, FaRegMoneyBillAlt } from 'react-icons/fa'
import { MdOutlineLocationOn, MdOutlineEventSeat } from 'react-icons/md'
import { BsPeople } from 'react-icons/bs'
import { FiPhone, FiInfo, FiUsers } from 'react-icons/fi'
import { BiCheck, BiMessage, BiUserCheck } from 'react-icons/bi'
import AddPost from '../CRUD/AddPost'
import EditPost from '../CRUD/EditPost'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-custom-alert'

interface PostCardProps {
  id: string
  authorId: string
  title?: string
  content?: string
  published?: boolean
  authorName?: string
  createdAt: Date
  departureLocation?: string
  destinationLocation?: string
  departureDateTime: Date | string
  arrivalDateTime: Date | string
  availableSeats: number
  price?: number
  description?: string
  contactInformation?: string
  updatedAt?: Date
  status?: string
  user?: User
  bookedSeats: number
}

export const PostCard = ({
  post,
  user,
  setloading
}: {
  post: PostCardProps
  user: User | undefined
  setloading: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [isBooked, setIsBooked] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedPost, setEditedPost] = useState({ ...post })
  const navigate = useNavigate()

  useEffect(() => {
    const checkBooking = async () => {
      const res = await axios.post(`${apiurl}/api/posts/isBooked`, post, {
        withCredentials: true
      })

      if (res.status === 261) {
        setIsBooked(true)
      }
    }
    if (post.authorId !== user?.id) checkBooking()
  }, [])

  const handleBookRide = async (e: any) => {
    setloading(true)
    e.preventDefault()
    const res = await axios.post(`${apiurl}/api/posts/bookpost`, post, {
      withCredentials: true
    })
    if (res.status === 201) {
      setEditedPost({
        ...editedPost,
        availableSeats: editedPost.availableSeats - 1
      })
      setIsBooked(true)
    } else {
      LogError(res.data)
    }
    setloading(false)
  }

  const handleStartConversation = async (authorId: string) => {
    setloading(true)
    const res = await axios.post(
      `${apiurl}/api/conversations/new`,
      { participants: authorId },
      {
        withCredentials: true
      }
    )
    if (res.status === 200) navigate('/messages')
    else if (res.status !== 201) LogError(res.data)

    setloading(false)
  }

  const handleDelete = async (e: any) => {
    setloading(true)
    e.preventDefault()
    const res = await axios.post(`${apiurl}/api/posts/deletepost`, post, {
      withCredentials: true
    })
    if (res.status === 201) {
      post.published = false
    } else {
      LogError(res.data)
    }
    setloading(false)
  }

  const handleEdit = () => {
    setIsEditing(!isEditing)
  }
  const handleMarkComplete = async (e: any) => {
    setloading(true)
    e.preventDefault()
    const res = await axios.post(`${apiurl}/api/posts/markascomplete`, post, {
      withCredentials: true
    })
    if (res.status === 201) {
      toast.success('Ride marked as complete')
    } else {
      LogError(res.data)
    }
    setloading(false)
  }

  return (
    <Col xs={12} sm={6} md={4} lg={3}>
      <div className="bg-white p-6 rounded-lg shadow-md ">
        {isEditing && <EditPost post={editedPost} setisadding={setIsEditing} />}
        <div className="grid grid-cols-2 mb-4 relative">
          <div>
            <p className="text-gray-500">Date</p>
            <h1 className="text-xl font-bold">
              {new Date(editedPost.departureDateTime).toLocaleString('en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-gray-500">Cost</p>
            <h1 className="text-xl font-bold">{editedPost.price} MAD</h1>
          </div>
          {
            <div className="absolute top-0 right-1/2 transform translate-x-1/2 -translate-y-1/2 text-red-500 p-2 ">
              {user?.id === post.authorId ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleEdit}
                    className="transition-all hover:scale-125"
                  >
                    <AiOutlineEdit size={20} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="transition-all hover:scale-125"
                  >
                    <AiOutlineDelete size={20} />
                  </button>
                  <button
                    onClick={handleMarkComplete}
                    className="transition-all hover:scale-125"
                  >
                    <BiCheck size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartConversation(post.authorId)}
                    className="transition-all hover:scale-125"
                  >
                    <BiMessage size={20} />
                  </button>
                </div>
              )}
            </div>
          }
        </div>
        <div className="flex items-center space-x-8 bg-red-100 p-4 rounded-xl">
          <div className="flex-1">
            <p className="text-gray-500">Departure/Arrival Time</p>
            <div className="flex flex-col gap-2">
              <h1>
                {new Date(editedPost.departureDateTime).toLocaleTimeString(
                  'en-US',
                  {
                    hour: '2-digit',
                    minute: '2-digit'
                  }
                )}
              </h1>
              <h1>
                {new Date(editedPost.arrivalDateTime).toLocaleTimeString(
                  'en-US',
                  {
                    hour: '2-digit',
                    minute: '2-digit'
                  }
                )}
              </h1>
            </div>
          </div>
          <div className="border-l border-gray-300 h-20"></div>
          <div className="flex-1">
            <p className="text-gray-500">Locations</p>
            <div className="flex flex-col gap-2">
              <h1>{editedPost.departureLocation}</h1>
              <h1>{editedPost.destinationLocation}</h1>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <h1 className="text-lg">
            Available seats: {editedPost.availableSeats}
          </h1>
          <div className="flex gap-2 items-center">
            <div className="bg-red-300 rounded-full p-4"></div>
            <h1 className="text-lg">{editedPost.authorName}</h1>
          </div>
        </div>
        <div className="flex items-center justify-center">
          {user?.id !== post.authorId &&
            post.availableSeats > 0 &&
            !isBooked && (
              <button
                className="bg-red-300 px-8 py-2 rounded-lg hover:-translate-y-1 duration-300"
                onClick={handleBookRide}
              >
                Book Ride
              </button>
            )}
          {isBooked && <p className="text-gray-400">Already Booked</p>}
        </div>
      </div>
    </Col>
  )
}
