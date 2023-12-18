import Loading from '../components/Other/Loading'
import { useOutletContext } from 'react-router-dom'
import { User } from '../context/UserProvider'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { apiurl } from '../context/apiurl'
import { PostCard } from '../components/Cards/PostCard'
import { Button, Row } from 'react-bootstrap'
import RideCard from '../components/Cards/RideCard'
import {
  MdAirlineSeatReclineExtra,
  MdCalendarMonth,
  MdMoneyOff
} from 'react-icons/md'
import Pie from '../components/Charts/Pie'
import {
  FaCar,
  FaDollarSign,
  FaExclamationTriangle,
  FaStar
} from 'react-icons/fa'
import { IoPerson } from 'react-icons/io5'
import Line from '../components/Charts/Line'
import { MdCancel } from 'react-icons/md'
import { RiWaterPercentFill } from 'react-icons/ri'
import { TbSteeringWheel } from 'react-icons/tb'
import Toggle from '../components/Toggle/Toggle'

type PassengerProps = {
  firstname: string
  lastname: string
  email: string
}

export default function RidesPage() {
  const [user, isloaded] = useOutletContext() as [User | undefined, boolean]
  const [loading, setloading] = useState(true)
  const [userposts, setuserposts] = useState([])
  const [userrides, setuserrides] = useState([])
  const [userissues, setuserissues] = useState([])
  const [userearnings, setuserearnings] = useState(0)
  const [userpassengerscount, setuserpassengerscount] = useState(0)
  const [usercanceledrides, setusercanceledrides] = useState(0)
  const [userspendings, setuserspendings] = useState(0)
  const [lastuserpassengers, setlastuserpassengers] = useState<
    PassengerProps[]
  >([])

  const data = [
    {
      firstName: 'Mohammed',
      lastName: 'Ali',
      phoneNumber: '0666-111-222',
      email: 'mohammed.ali@example.ma',
      destination: 'Casablanca',
      dateOfRide: '2023-02-15'
    },
    {
      firstName: 'Fatima',
      lastName: 'Zahra',
      phoneNumber: '0666-333-444',
      email: 'fatima.zahra@example.ma',
      destination: 'Casablanca',
      dateOfRide: '2023-02-15'
    },
    {
      firstName: 'Ahmed',
      lastName: 'Omar',
      phoneNumber: '0666-555-666',
      email: 'ahmed.omar@example.ma',
      destination: 'Casablanca',
      dateOfRide: '2023-02-15'
    },
    {
      firstName: 'Amina',
      lastName: 'Hassan',
      phoneNumber: '0666-777-888',
      email: 'amina.hassan@example.ma',
      destination: 'Casablanca',
      dateOfRide: '2023-02-15'
    },
    {
      firstName: 'Youssef',
      lastName: 'Karim',
      phoneNumber: '0666-999-000',
      email: 'youssef.karim@example.ma',
      destination: 'Casablanca',
      dateOfRide: '2023-02-15'
    }
  ]

  useEffect(() => {
    const fetchData = async () => {
      setloading(true)
      setuserposts([])
      setuserrides([])
      setuserissues([])
      setuserearnings(0)
      setuserpassengerscount(0)
      setusercanceledrides(0)
      setuserspendings(0)
      setlastuserpassengers([])

      try {
        const [
          postsResponse,
          ridesResponse,
          issuesResponse,
          earningsResponse,
          userpassengerscount,
          canceledridescount,
          userspendings,
          lastuserpassengers
        ] = await Promise.all([
          axios.get(`${apiurl}/api/posts/getAllUserPosts`, {
            withCredentials: true
          }),
          axios.get(`${apiurl}/api/rides/getUserRides`, {
            withCredentials: true
          }),
          axios.get(`${apiurl}/api/issues/getUserIssues`, {
            withCredentials: true
          }),
          axios.get(`${apiurl}/api/rides/getUserEarnings`, {
            withCredentials: true
          }),
          axios.get(`${apiurl}/api/rides/getUserPassengers`, {
            withCredentials: true
          }),
          axios.get(`${apiurl}/api/rides/getUserCancelledRides`, {
            withCredentials: true
          }),
          axios.get(`${apiurl}/api/rides/getUserSpendings`, {
            withCredentials: true
          }),
          axios.get(`${apiurl}/api/rides/getLastRideUsers`, {
            withCredentials: true
          })
        ])

        if (
          postsResponse.status === 201 &&
          Object.keys(postsResponse.data).length > 0
        ) {
          setuserposts(postsResponse.data)
        }

        if (
          ridesResponse.status === 201 &&
          Object.keys(ridesResponse.data).length > 0
        ) {
          setuserrides(ridesResponse.data)
        }

        if (
          issuesResponse.status === 201 &&
          Object.keys(issuesResponse.data).length > 0
        ) {
          setuserissues(issuesResponse.data)
        }

        if (earningsResponse.status === 201) {
          setuserearnings(earningsResponse.data)
        }

        if (userpassengerscount.status === 201) {
          setuserpassengerscount(userpassengerscount.data)
        }

        if (canceledridescount.status === 201) {
          setusercanceledrides(canceledridescount.data)
        }

        if (userspendings.status === 201) {
          setuserspendings(userspendings.data)
        }

        if (lastuserpassengers.status === 201) {
          setlastuserpassengers(lastuserpassengers.data)
          // console.log(lastuserpassengers.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }

      setloading(false)
    }

    fetchData()
  }, [])

  if (!isloaded || loading) return <Loading />
  return (
    // <div className="flex flex-row mobile:flex-col w-full h-screen">
    //   <main className="h-screen w-full">
    //     <p>You have posted {userposts.length} posts: </p>
    //     <Row xs={1} sm={2} md={3} lg={4} className="lg:ml-32 lg:mt-10">
    //       {userposts.map((post, index) => {
    //         return (
    //           <PostCard
    //             key={index}
    //             post={post}
    //             user={user}
    //             setloading={setloading}
    //           />
    //         )
    //       })}
    //     </Row>
    //     <p>You have Booked {userrides.length} rides</p>
    //     <Row xs={1} sm={2} md={3} lg={4} className="lg:ml-32 lg:mt-10">
    //       {userrides.map((ride, index) => {
    //         return <RideCard ride={ride} key={index} user={user} />
    //       })}
    //     </Row>
    //   </main>
    // </div>
    <main className="p-3 patternbg">
      {/* <Button
        variant="primary"
        className="mb-4"
        onClick={async (e) => {
          e.preventDefault()
          const res = await axios.get(`${apiurl}/api/rides/getLastRideUsers`, {
            withCredentials: true
          })
          console.log(res.data)
        }}
      >
        Randomg button
      </Button> */}
      {/* <div className="border-4 border-red-500 scale-150  w-[3.5vw] right-48 overflow-x-hidden">
        <Toggle />
      </div> */}
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">Analytics</h1>
        {/* <button
          className="border border-black p-2 rounded-lg hover:bg-gray-200 flex flex-row items-center justify-between"
          onClick={() =>
            setusermode((prev) => (prev === 'rider' ? 'passenger' : 'rider'))
          }
        >
          {usermode === 'rider' ? (
            <MdAirlineSeatReclineExtra />
          ) : (
            <TbSteeringWheel />
          )}
          Switch to {usermode === 'rider' ? 'passenger' : 'ride-hailer'}
        </button> */}
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="grid grid-rows-2 gap-x-20 gap-y-4 col-span-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="grid grid-rows-3 p-4 bg-white shadow-lg text-black rounded-lg gap-1">
              <div className="flex items-center justify-between">
                <h1 className="font-semibold">Total Rides Offered</h1>
                <FaCar size={24} />
              </div>
              <h1 className="text-3xl font-semibold text-center">
                {userposts.length}
              </h1>
              <h1 className="text-sm text-gray-700">Overall count </h1>
            </div>
            <div className="grid grid-rows-3 p-4 bg-white shadow-lg text-black rounded-lg">
              <div className="flex items-center justify-between">
                <h1 className="font-semibold">Total Earnings</h1>
                <p className="text-green-500 font-bold" aria-setsize={24}>
                  MAD
                </p>
              </div>
              <h1 className="text-3xl font-semibold text-green-500">
                {userearnings}
              </h1>
              <h1 className="text-sm text-gray-700">Overall earning </h1>
            </div>
            <div className="grid grid-rows-3 p-4 bg-white shadow-lg text-black rounded-lg gap-1">
              <div className="flex items-center justify-between">
                <h1 className="font-semibold">Total Passengers Offered</h1>
                <IoPerson size={24} />
              </div>
              <h1 className="text-3xl font-semibold">{userpassengerscount}</h1>
              <h1 className="text-sm text-gray-700">Overall count </h1>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid grid-rows-3 p-4 bg-white shadow-lg text-black rounded-lg">
              <div className="flex items-center justify-between">
                <h1 className="font-semibold">Total Issues Reported</h1>
                <FaExclamationTriangle size={24} className="text-red-500" />
              </div>
              <h1 className="text-3xl font-semibold text-red-500">
                {userissues.length}
              </h1>
              <h1 className="text-sm text-gray-700">Overall count </h1>
            </div>
            <div className="grid grid-rows-3 p-4 bg-white shadow-lg text-black rounded-lg">
              <div className="flex items-center justify-between">
                <h1 className="font-semibold">Your total spendings</h1>
                <MdMoneyOff size={24} className="text-red-500" />
              </div>
              <h1 className="text-3xl font-semibold">{userspendings}</h1>
              <h1 className="text-sm text-gray-700">Overall count </h1>
            </div>
            <div className="grid grid-rows-3 p-4 bg-white shadow-lg text-black rounded-lg">
              <div className="flex items-center justify-between">
                <h1 className="font-semibold">Cancelled Rides</h1>
                <MdCancel size={24} className="text-red-500" />
              </div>
              <h1 className="text-3xl font-semibold">{usercanceledrides}</h1>
              <h1 className="text-sm text-gray-700">Overall count </h1>
            </div>
          </div>
        </div>

        {/* <div className="grid gap-4">
          <div className="bg-white shadow-lg text-black rounded-lg p-6">
            <div className="grid grid-rows-3 ">
              <div className="flex items-center justify-between">
                <h1 className="font-semibold">Ride Success Chart</h1>
                <RiWaterPercentFill size={24} />
              </div>
              <h1 className="text-sm text-gray-700">Overall ratio </h1>
            </div>
            <Pie />
          </div>
        </div> */}
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <h1 className="font-bold mt-2 mb-2">Overall User Activity</h1>
          <Line />
        </div>
        <div className="p-4 shadow-lg rounded-lg bg-white">
          <h1 className="font-bold mt-2">Last Ride's Passengers</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-sm text-gray-600">First Name</th>
                  <th className="text-sm text-gray-600">Last Name</th>
                  <th className="text-sm text-gray-600">Email</th>
                </tr>
              </thead>
              <tbody>
                {lastuserpassengers &&
                  lastuserpassengers.map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-200'}
                    >
                      <td className="py-3 px-2">{row?.firstname}</td>
                      <td className="py-2 px-2">{row?.lastname}</td>
                      <td className="py-2 px-2">{row?.email}</td>
                      {/* <td className="py-2 px-2">{row?.destination}</td> */}
                      {/* <td className="py-2 px-2">{row?.dateOfRide}</td> */}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
