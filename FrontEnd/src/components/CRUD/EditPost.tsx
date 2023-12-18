import axios from 'axios'
import React, { Dispatch, useState } from 'react'
import { BsFilePlus } from 'react-icons/bs'
import { apiurl } from '../../context/apiurl'
import { Form } from 'react-bootstrap'
import { User } from '../../context/UserProvider'
import Select from 'react-select'
import moroccanCitiesData from '../../utils/Cities.json'

type PostProps = {
  id?: string
  authorId?: string
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

interface AddPostProps {
  setisadding: Dispatch<React.SetStateAction<boolean>>
  post?: PostProps
}

function EditPost({ setisadding, post }: AddPostProps) {
  const [newpost, setNewPost] = useState({
    id: post?.id ?? '',
    title: post?.title ?? '',
    published: post?.published,
    description: post?.description ?? '',
    departureLocation: post?.departureLocation ?? '',
    destinationLocation: post?.destinationLocation ?? '',
    departureDateTime: post?.departureDateTime ?? '',
    arrivalDateTime: post?.arrivalDateTime ?? '',
    availableSeats: post?.availableSeats ?? 0,
    price: post?.price ?? 0
  })

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const res = await axios.post(`${apiurl}/api/posts/editpost`, newpost, {
      withCredentials: true
    })

    if (res.status === 201) {
      alert('Post Edited succesfully')
      setisadding(false)
    }
  }

  return (
    <div className="bg-white z-50 w-3/4 h-5/6 absolute shadow-2xl drop-shadow-2xl mobile:w-full mobile:h-screen mobile:top-0 lg:mx-4 overflow-x-hidden [&::-webkit-scrollbar]:hidden rounded-lg flex flex-col items-center py-5 overflow-y-scroll">
      <h2 className="text-2xl font-bold mt-4">Edit Post</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-sm relative">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title:
          </label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight "
            value={newpost.title}
            onChange={(e) => setNewPost({ ...newpost, title: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description:
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={4}
            value={newpost.description}
            onChange={(e) =>
              setNewPost({ ...newpost, description: e.target.value })
            }
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Departure Location:
          </label>
          {/* <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={newpost.departureLocation}
            onChange={(e) =>
              setNewPost({ ...newpost, departureLocation: e.target.value })
            }
          /> */}
          <Select
            id="currentLocation"
            placeholder="Select Location"
            defaultInputValue={newpost.departureLocation}
            options={moroccanCitiesData.moroccanCities.map((city) => ({
              label: city,
              value: city
            }))}
            onChange={(selectedOption) =>
              setNewPost({
                ...newpost,
                departureLocation: selectedOption?.value as string
              })
            }
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Destination Location:
          </label>
          {/* <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={newpost.destinationLocation}
            onChange={(e) =>
              setNewPost({ ...newpost, destinationLocation: e.target.value })
            }
          /> */}
          <Select
            id="destinationLocation"
            placeholder="Select Location"
            defaultInputValue={newpost.destinationLocation}
            options={moroccanCitiesData.moroccanCities.map((city) => ({
              label: city,
              value: city
            }))}
            onChange={(selectedOption) =>
              setNewPost({
                ...newpost,
                destinationLocation: selectedOption?.value as string
              })
            }
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Departure Date and Time:
          </label>
          <input
            type="datetime-local"
            min={new Date().toISOString().slice(0, -8)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={new Date(newpost.departureDateTime)
              .toISOString()
              .slice(0, 16)
              .replace('T', ' ')}
            onChange={(e) =>
              setNewPost({ ...newpost, departureDateTime: e.target.value })
            }
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Arrival Date and Time:
          </label>
          <input
            type="datetime-local"
            min={new Date(newpost.departureDateTime)
              .toISOString()
              .slice(0, 16)
              .replace('T', ' ')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={new Date(newpost.arrivalDateTime)
              .toISOString()
              .slice(0, 16)
              .replace('T', ' ')}
            onChange={(e) =>
              setNewPost({ ...newpost, arrivalDateTime: e.target.value })
            }
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Available Seats:
          </label>
          <input
            type="number"
            min={0}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={newpost.availableSeats}
            onChange={(e) =>
              setNewPost({
                ...newpost,
                availableSeats: parseInt(e.target.value)
              })
            }
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Price:
          </label>
          <input
            min={0}
            type="number"
            step="0.01"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={newpost.price}
            onChange={(e) =>
              setNewPost({ ...newpost, price: parseFloat(e.target.value) })
            }
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Published: {'(make the post public after submitting)'}
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value={newpost.published?.toString()}
              checked={newpost.published}
              className="sr-only peer"
              onChange={(e) => {
                setNewPost({ ...newpost, published: e.target.checked })
              }}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 ">
              {newpost.published ? 'Public' : 'Private'}
            </span>
          </label>
        </div>

        <div className="flex justify-between  ">
          <button
            type="button"
            className=" bg-gray-400 hover:bg-gray-600 transition text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => setisadding(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-700 transition text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditPost
