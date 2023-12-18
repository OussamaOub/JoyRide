import { useEffect, useRef, useState } from 'react'
import { useOutletContext, useLocation } from 'react-router-dom'
import { User } from '../context/UserProvider'
import Loading from '../components/Other/Loading'
import { BsPlusCircle } from 'react-icons/bs'
import axios from 'axios'
import { apiurl } from '../context/apiurl'
import { LogError } from '../utils/handleErrors'
import Row from 'react-bootstrap/Row'
import { PostCard } from '../components/Cards/PostCard'
import {
  MdCalendarMonth,
  MdOutlineLocationOn,
  MdOutlineSearch
} from 'react-icons/md'
import { GoPerson } from 'react-icons/go'
import moroccanCitiesData from '../utils/Cities.json'
import Select from 'react-select'
import { BiFilter } from 'react-icons/bi'
import EditPost from '../components/CRUD/EditPost'
import AddPost from '../components/CRUD/AddPost'

type Filter = {
  departureLocation: string
  destinationLocation: string
  availableSeats: number
  departureDateTime: Date
}

var filters = {
  departureLocation: 'none',
  destinationLocation: 'Dowar T9lya',
  availableSeats: 69,
  departureDateTime: new Date()
}

export default function PostsPage() {
  const [user, isloaded] = useOutletContext() as [User | undefined, boolean]
  const [isadding, setisadding] = useState(false)
  const [posts, setposts] = useState<any[]>([])
  const [loading, setloading] = useState(false)
  const location = useLocation()
  const [flag, setFlag] = useState(0)
  const [currentLocation, setCurrentLocation] = useState<any>('')
  const [destination, setDestination] = useState<any>('')
  const [travelers, setTravelers] = useState<any>(0)
  const [departure, setDeparture] = useState<any>(null)

  var source: number

  const filterposts = async (filters: Filter) => {
    setloading(true)
    const res = await axios.post(
      `${apiurl}/api/posts/fetchfilteredposts`,
      filters,
      {
        withCredentials: true
      }
    )
    if (res.status === 200) {
      setposts(res.data)
    } else {
      LogError(res)
    }
    setloading(false)
  }
  const fetchposts = async () => {
    setloading(true)
    const res = await axios.get(`${apiurl}/api/posts/fetchpublishedposts`, {
      withCredentials: true
    })
    if (res.status === 200) {
      setposts(res.data)
    } else {
      LogError(res)
    }
    setloading(false)
  }

  const handleFilter = () => {
    filters = {
      departureLocation: currentLocation,
      destinationLocation: destination,
      availableSeats: travelers,
      departureDateTime: departure
    }
    // console.log(filters)
    if (flag > 1) {
      setFlag(flag - 1)
      // console.log(flag)
    } else {
      setFlag(flag + 1)
      // console.log(flag)
    }
  }

  useEffect(() => {
    if (location.state != null) {
      source = location.state.source
      filters = {
        departureLocation: location.state.currentLocation,
        destinationLocation: location.state.destination,
        availableSeats: location.state.travelers,
        departureDateTime: location.state.departure
      }
    }
    if (source === 1) {
      filterposts(filters)
    } else {
      fetchposts()
    }
  }, [isadding])

  useEffect(() => {
    if (flag != 0) {
      // console.log(filters)
      filterposts(filters)
    }
  }, [flag])

  // console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", posts);

  if (!isloaded || loading) return <Loading />
  return (
    <div className="p-3 ml-2 patternbg h-screen">
      <h1 className="text-2xl font-bold mt-4">Current Open Posts</h1>
      {posts.length == 1 && (
        <p className="mt-4">There is {posts.length} Post</p>
      )}
      {posts.length != 1 && (
        <p className="mt-4">There are {posts.length} Posts</p>
      )}
      <div className="flex items-center justify-between mt-4 space-x-4">
        <div className="flex items-center space-x-4">
          <div className="">
            <Select
              id="currentLocation"
              placeholder="Select Location"
              options={moroccanCitiesData.moroccanCities.map((city) => ({
                label: city,
                value: city
              }))}
              onChange={(selectedOption) =>
                setCurrentLocation(selectedOption?.value)
              }
            />
          </div>
          <div className="">
            <Select
              id="destination"
              placeholder="Select Destination"
              options={moroccanCitiesData.moroccanCities.map((city) => ({
                label: city,
                value: city
              }))}
              onChange={(selectedOption) =>
                setDestination(selectedOption?.value)
              }
            />
          </div>
          <div className="w-1/4">
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <GoPerson size={20} />
                <label
                  htmlFor="travelers"
                  className="text-lg font-bold text-black ml-2"
                >
                  Travelers
                </label>
              </div>
              <input
                type="number"
                id="travelers"
                placeholder="Add Travelers"
                className="text-sm text-black border-b-2 border-black outline-none w-full"
                onChange={(trav) => setTravelers(trav.target.value)}
              />
            </div>
          </div>
          <div className="w-1/4">
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <MdCalendarMonth size={20} />
                <label
                  htmlFor="departure"
                  className="text-lg font-bold text-black ml-2"
                >
                  Departure
                </label>
              </div>
              <input
                type="date"
                id="departure"
                placeholder="Choose Date"
                className="text-sm text-black border-b-2 border-black outline-none w-full"
                onChange={(date) => setDeparture(date.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-red-300 p-3 rounded-xl items-center hover:-translate-y-1 duration-300 cursor-pointer flex gap-1">
              <BiFilter size={20} />
            </div>
          </div>
        </div>
        <BsPlusCircle
          size={40}
          className="z-50 p-2 bg-red-500 text-white rounded-full cursor-pointer hover:scale-105"
          onClick={() => setisadding(!isadding)}
        />
      </div>

      <div
        className="transition"
        style={{
          visibility: isadding ? 'visible' : 'hidden'
        }}
      >
        {isadding && <AddPost setisadding={setisadding} />}
      </div>
      <Row
        xs={1}
        sm={2}
        md={3}
        lg={4}
        className={`mt-4 grid gap-4 ${
          posts.length >= 2 ? 'grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {posts.map((post, index) => {
          if (post?.published === true || post?.authorId === user?.id) {
            return (
              <PostCard
                key={index}
                post={post}
                user={user}
                setloading={setloading}
              />
            )
          }
        })}
      </Row>
    </div>
  )
}
