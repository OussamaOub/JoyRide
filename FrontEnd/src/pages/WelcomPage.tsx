import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import {
  MdOutlineLocationOn,
  MdCalendarMonth,
  MdOutlineSearch,
  MdOutlineArrowDropDownCircle
} from 'react-icons/md'
import { GoPerson } from 'react-icons/go'
import { Link, useOutletContext } from 'react-router-dom'
import Loading from '../components/Other/Loading'
import { User } from '../context/UserProvider'
import { createContext } from 'react'
import moroccanCitiesData from '../utils/Cities.json'
import axios from 'axios'
import { apiurl } from '../context/apiurl'
import { LogError } from '../utils/handleErrors'
import { PostCard } from '../components/Cards/PostCard'

export default function WelcomePage() {
  const [user, isLoaded] = useOutletContext() as [User | undefined, boolean]
  const [posts, setposts] = useState<any[]>([])
  const FlagStateContext = createContext(1)
  const [loading, setloading] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<any>('')
  const [destination, setDestination] = useState<any>('')
  const [travelers, setTravelers] = useState<any>(0)
  const [departure, setDeparture] = useState<any>(null)

  useEffect(() => {
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
    fetchposts()
  }, [])

  if (!isLoaded) return <Loading />

  return (
    <main className="flex flex-row mobile:flex-col w-full h-screen overflow-hidden">
      <div className="h-screen w-full">
        <div className="bg-gray-100 rounded-xl p-6 patternbg">
          <div className="grid gap-3">
            <div className="flex-1 justify-center items-center shadow-lg border-black h-72 p-6 bg-white rounded-2xl">
              <h1 className="flex items-center justify-center  font-bold text-3xl mb-4 mt-12">
                Travel together. Connect with awesome people.
              </h1>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-1/4">
                  <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                      <MdOutlineLocationOn size={20} />
                      <label
                        htmlFor="currentLocation"
                        className="text-lg font-bold text-black ml-2"
                      >
                        Current Location
                      </label>
                    </div>
                    <Select
                      id="currentLocation"
                      placeholder="Select Location"
                      options={moroccanCitiesData.moroccanCities.map(
                        (city) => ({ label: city, value: city })
                      )}
                      onChange={(selectedOption) =>
                        setCurrentLocation(selectedOption)
                      }
                    />
                  </div>
                </div>
                <div className="w-1/4">
                  <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                      <MdOutlineLocationOn size={20} />
                      <label
                        htmlFor="destination"
                        className="text-lg font-bold text-black ml-2"
                      >
                        Destination
                      </label>
                    </div>
                    <Select
                      id="destination"
                      placeholder="Select Destination"
                      options={moroccanCitiesData.moroccanCities.map(
                        (city) => ({ label: city, value: city })
                      )}
                      onChange={(selectedOption) =>
                        setDestination(selectedOption)
                      }
                    />
                  </div>
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
                      placeholder="Add guests"
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
                <div className="bg-red-300 p-3 mt-8 rounded-xl items-center hover:-translate-y-1 duration-300 cursor-pointer">
                  <Link
                    to={'/Posts'}
                    state={{
                      source: 1,
                      currentLocation: currentLocation.value,
                      destination: destination.value,
                      travelers: travelers,
                      departure: departure
                    }}
                  >
                    <MdOutlineSearch size={20} />
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="text-xl font-semibold">Most Recent Posts</h1>
              <div
                className={`grid gap-4 relative min-h-[10vh] ${
                  posts.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                }`}
              >
                {posts.length > 0 ? (
                  posts
                    ?.slice(0, 2)
                    .map((post, index) => (
                      <PostCard
                        post={post}
                        setloading={setloading}
                        user={user}
                        key={index}
                      />
                    ))
                ) : (
                  <div className="flex justify-center items-center text-lg font-semibold w-full h-full  absolute">
                    No Available Post
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center mt-2">
              <div className="grig grid-rows-2 h-screen">
                <Link
                  to={'/Posts'}
                  className="cursor-pointer hover:scale-110 transition"
                >
                  <h1 className="font-semibold text-gray-500">View More</h1>
                  <MdOutlineArrowDropDownCircle size={20} className="ml-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
