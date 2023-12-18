import React, { useState } from 'react'
import { logout } from '../../utils/LogoutHandler'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { LogError } from '../../utils/handleErrors'
import { AiOutlineHome, AiOutlineCar } from 'react-icons/ai'
import { CgProfile } from 'react-icons/cg'
import { TbLogout2, TbPointFilled } from 'react-icons/tb'
import { BsPostcard, BsThreeDotsVertical } from 'react-icons/bs'
import Loading from '../Other/Loading'
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md'
import { User } from '../../context/UserProvider'
import { FaRegUser } from 'react-icons/fa'

interface NavBarProps {
  className?: string
  user?: User | null
}

const handleLogout = async (
  e: React.MouseEvent,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  e.preventDefault()
  try {
    setLoading(true)
    await logout()
  } catch (error) {
    LogError(error)
  }
  setLoading(false)
}

const toggleIsOpen = (
  setisOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  window.location.href = '/Profile'
  setisOpen(false)
}

const options = [
  {
    name: 'Profile',
    action: toggleIsOpen
  },
  { name: 'logout', action: handleLogout }
]

const navigationItems = [
  { label: 'Home', path: '/Welcome', icon: <AiOutlineHome size={20} /> },
  { label: 'Rides', path: '/Rides', icon: <AiOutlineCar size={20} /> },
  { label: 'Profile', path: '/Profile', icon: <CgProfile size={20} /> },
  { label: 'Posts', path: '/Posts', icon: <BsPostcard size={20} /> },
  { label: 'Messages', path: '/Messages', icon: <BsPostcard size={20} /> }
]

const NavBarElement = ({ item, currentPath }: any) => {
  const isCurrent = item.path === currentPath

  return (
    <Link
      to={item.path}
      className={`${
        isCurrent
          ? 'text-red-500 font-bold hover:text-black mobile:-translate-y-2'
          : 'text-black bg-transparent'
      } h-14 flex flex-row mobile:flex-col w-[95%] mobile:rounded-full mobile:w-[15%] justify-evenly items-center py-2 rounded-lg`}
    >
      <div
        className={`${
          isCurrent &&
          'bg-red-500 text-white mobile:bg-white mobile:text-red-500 '
        } transition duration-300 rounded-full p-2`}
      >
        {item.icon}
      </div>
      <p
        className={` ${
          isCurrent ? 'mobile:visible mobile:translate-y-2' : 'mobile:hidden'
        } info`}
      >
        {item.label}
      </p>
      <TbPointFilled
        className={`mobile:hidden ${
          isCurrent ? '' : 'text-transparent'
        } transition duration-300 info`}
      />
    </Link>
  )
}

const LeftSideBar: React.FC<NavBarProps> = ({ className, user }) => {
  const [loading, setLoading] = useState(false)
  const [isVisible, setisVisible] = useState(true)
  const [isOpen, setisOpen] = useState<boolean>(false)
  const location = useLocation()

  const toggleSideBarVisibility = () => {
    setisVisible(!isVisible)
  }

  return (
    <div
      data-collapse={!isVisible}
      className={`w-[15vw] relative flex flex-col mobile:flex-row h-screen  mobile:absolute mobile:bottom-0 mobile:w-screen mobile:h-[10vh]  items-center  mobile:order-last  
      mobile:min-w-[335px] shadow-xl shadow-gray-300 customtansition leftnavbarbg ${className}`}
    >
      <div className="p-4 text-black mb-8 mobile:m-0 mobile:flex mobile:w-screen mobile:items-center mobile:justify-center">
        <a href="/">
          <h1 className="text-2xl font-nasalization mobile:text-3xl title_name">
            JOYRIDE
          </h1>
        </a>
      </div>
      <button
        onClick={toggleSideBarVisibility}
        className={` bg-white flex border border-[#e5e7eb] rounded-full items-center justify-center absolute ${
          isVisible
            ? '  translate-x-1/2  right-0 top-[4.6rem] w-6 h-6'
            : 'w-10 h-10 top-11 border-red-400'
        }`}
      >
        <div
          style={{
            rotate: isVisible ? 'none' : '180deg',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.01)'
          }}
        >
          <MdOutlineKeyboardArrowLeft />
        </div>
      </button>
      <h3 className="text-black bg-transparent mobile:hidden opacity-75 cursor-default my-10">
        Menu
      </h3>

      <aside className="h-full flex flex-col gap-10 w-full mobile:flex-row mobile:justify-evenly ">
        {navigationItems.map((item, index) => (
          <NavBarElement
            item={item}
            currentPath={location.pathname}
            key={index}
          />
        ))}
      </aside>
      <div
        // onClick={handleLogout}
        className="relative bottom-0 flex flex-row w-[95%] mobile:rounded-full mobile:w-[15%] justify-evenly items-center  py-2 rounded-lg  transition lg:mb-4 "
      >
        {/* <div>{loading ? <Loading /> : <TbLogout2 size={20} />}</div>
        <p className="mobile:hidden">Logout</p> */}
        <span className="info">
          <FaRegUser size={30} />
        </span>
        <div className="info">
          <p>
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-gray-400">{user?.email}</p>
        </div>
        <div className="flex flex-col gap-10">
          {isOpen && (
            <div className="flex flex-col gap-1 absolute top-0 border-2 bg-white rounded-lg options">
              {options.map((option, index) => (
                <div
                  onClick={(e) => option.action(e, setLoading, setisOpen)}
                  key={index}
                  className="cursor-pointer hover:bg-gray-300 transition w-full px-2 py-1 border-b h-full"
                >
                  {option.name}
                </div>
              ))}{' '}
            </div>
          )}
          <BsThreeDotsVertical
            size={20}
            color={isOpen ? 'red' : 'black'}
            className="cursor-pointer"
            onClick={() => setisOpen(!isOpen)}
          />
        </div>
      </div>
    </div>
  )
}

export default LeftSideBar
