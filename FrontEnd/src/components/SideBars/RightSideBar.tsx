import React, { useEffect, useState } from 'react'
import { IoPeople, IoChatboxOutline } from 'react-icons/io5'
import { User } from '../../context/UserProvider'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import axios from 'axios'
import { apiurl } from '../../context/apiurl'

interface NavBarProps {
  className?: string
  user?: User | null
}

type ParticipantsProps = {
  id: string
  firstName: string
  lastName: string
  email: string
  username: string
}

type ConversationProps = {
  id: string //
  lastMessageSent: any | null
  dateLastMessage: Date | undefined //
  participants: ParticipantsProps[] //
  isRead: boolean //
}

{
  /* <div className="flex gap-4 items-center justify-between">
<div className="grid grid-rows-3 info">
  <h1 className="font-semibold">Mounir Saghfary</h1>
  <h1 className="text-sm">m.saghafry@aui.ma</h1>
  <h1 className="text-xs">10.11.2023 07:52 PM</h1>
</div>
<IoChatboxOutline size={20} className="text-red-400" />
</div> */
}

const RightSideBar: React.FC<NavBarProps> = ({ className, user }) => {
  const [isVisible, setisVisible] = useState(true)
  const [conversations, setconversations] = useState<ConversationProps[]>([])
  const [loading, setloading] = useState(false)

  const toggleSideBarVisibility = () => {
    setisVisible(!isVisible)
  }

  useEffect(() => {
    const fetchdata = async () => {
      setloading(true)
      setconversations([])
      const res = await axios.get(`${apiurl}/api/conversations/${user?.id}`, {
        withCredentials: true
      })
      setconversations(res.data)
      // console.log('Covos: ', res.data)
      setloading(false)
    }
    if (user) fetchdata()
  }, [user])

  return (
    <div
      className="bg-white h-screen p-2 mr-2 relative customtansition w-[15vw] overflow small-scrollbar"
      data-collapse={!isVisible}
    >
      <button
        onClick={toggleSideBarVisibility}
        className={` left-0  w-6 h-6 top-[4.6rem] bg-white flex border-2 rounded-full items-center justify-center absolute ${
          isVisible ? 'border-[#e5e7eb]' : 'border-red-500'
        }`}
      >
        <div
          style={{
            rotate: isVisible ? 'none' : '180deg',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.01)'
          }}
        >
          <MdOutlineKeyboardArrowRight />
        </div>
      </button>
      <div className="flex items-center justify-between mt-10">
        <div
          className={`flex items-center justify-center gap-2 ${
            !isVisible && 'w-full'
          }`}
        >
          <IoPeople size={16} className="text-red-400" />
          <h1 className="font-semibold text-lg info">Friends</h1>
        </div>
        <h1 className="text-sm text-red-400 info">View all</h1>
      </div>

      <div className="mt-10 flex-1 space-y-5">
        {conversations?.map((item, index) => (
          <div className="flex gap-4 items-center justify-between" key={index}>
            <div className="grid grid-rows-3 info">
              <h1 className="font-semibold">
                {
                  item.participants.filter(
                    (participant) => participant.id !== user?.id
                  )[0].firstName
                }
                &nbsp;
                {
                  item.participants.filter(
                    (participant) => participant.id !== user?.id
                  )[0].lastName
                }
              </h1>
              <h1 className="text-sm">
                {
                  item.participants.filter(
                    (participant) => participant.id !== user?.id
                  )[0].email
                }
              </h1>
              <p>
                {item.lastMessageSent !== null &&
                  (item.lastMessageSent?.message.length > 20
                    ? item.lastMessageSent?.message.slice(0, 20) + '...'
                    : item.lastMessageSent.message)}
              </p>
              <h1 className="text-xs">
                {new Date(item.dateLastMessage ?? '')?.toDateString()}
              </h1>
            </div>
            <IoChatboxOutline size={20} className="text-red-400" />
          </div>
        ))}
      </div>

      <hr className="border-gray-600 my-4 mt-10" />
    </div>
  )
}

export default RightSideBar
