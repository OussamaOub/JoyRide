import React, { useEffect, useRef, useState } from 'react'
import Message from '../components/Other/Message'
import { useOutletContext } from 'react-router-dom'
import { User } from '../context/UserProvider'
import axios from 'axios'
import { apiurl } from '../context/apiurl'
import { io, Socket } from 'socket.io-client'

type ParticipantsProps = {
  id: string
  firstName: string
  lastName: string
  email: string
  username: string
}

type ConversationProps = {
  id: string
  lastMessageSent: string | null
  dateLastMessage: Date | undefined
  participants: ParticipantsProps[]
  isRead: boolean
  title: string
}

interface MessageItem {
  id: string
  conversationId: string
  message: string
  authorId: string
  created_at: Date
}

function MessagePage() {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null)
  const [user, isLoaded] = useOutletContext() as [User | undefined, boolean]
  const [conversations, setConversations] = useState<ConversationProps[]>([])
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [newMessage, setNewMessage] = useState<string>('')
  const socketRef = useRef<Socket | null>(null)
  const isListenerSet = useRef(false)

  useEffect(() => {
    const fetchconvomessages = async () => {
      if (selectedConversation) {
        const res = await axios.get(
          `${apiurl}/api/messages/?conversationId=${selectedConversation}`,
          {
            withCredentials: true
          }
        )
        setMessages(res.data)
      }
    }

    if (selectedConversation) {
      fetchconvomessages()
    }
  }, [selectedConversation])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setConversations([])
      const res = await axios.get(`${apiurl}/api/conversations/${user?.id}`, {
        withCredentials: true
      })
      setConversations(res.data)
      setLoading(false)
    }

    if (user) {
      fetchData()
    }

    // Initialize Socket.IO connection
    const socket = io('http://localhost:3000') // Replace with your server URL
    socketRef.current = socket

    // Listen for 'new_message' event from the server
    socket.on('new_message', (data: MessageItem) => {
      // console.log('Received new message:', data)
      setMessages((prevMessages) => [...prevMessages, data])
    })

    return () => {
      // Clean up the event listener and disconnect when the component is unmounted
      if (socketRef.current) {
        socketRef.current.off('new_message')
        socketRef.current.disconnect()
      }
    }
  }, [user])

  // useEffect(() => {
  //   // Check if the Socket.IO connection is available
  //   if (socketRef.current && !isListenerSet.current) {
  //     // Listen for 'new_message' event from the server
  //     socketRef.current.on('new_message', (data: MessageItem) => {
  //       console.log('Received new message:', data)
  //       setMessages((prevMessages) => [...prevMessages, data])
  //     })

  //     // Set the flag to prevent registering the listener again
  //     isListenerSet.current = true
  //   }

  //   return () => {
  //     // Clean up the event listener when the component is unmounted
  //     if (socketRef.current) {
  //       socketRef.current.off('new_message')
  //       isListenerSet.current = false // Reset the flag on unmount
  //     }
  //   }
  // }, [socketRef.current, isListenerSet.current])

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversation(conversationId)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
  }

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') {
      alert('Message cannot be empty')
      return
    }

    // Check if the Socket.IO connection is available
    if (socketRef.current) {
      // console.log('Socket.IO connection available')
      // Emit a 'send_message' event to the server
      socketRef.current.emit('send_message', {
        message: newMessage,
        conversationId: selectedConversation
      })
    }

    const res = await axios.post(
      `${apiurl}/api/messages/new`,
      {
        message: newMessage,
        conversationId: selectedConversation
      },
      {
        withCredentials: true
      }
    )

    if (res.status !== 200) {
      alert('Error sending message')
    } else {
      const updatedMessages = [
        ...messages,
        {
          id: res.data.id,
          conversationId: res.data.conversationId,
          message: res.data.message,
          authorId: res.data.authorId,
          created_at: res.data.created_at
        }
      ]
      setMessages(updatedMessages)
    }

    setNewMessage('')
  }

  return (
    <div className="flex bg-gray-100 h-full patternbg">
      <div className="w-1/4 p-8 bg-white to-white overflow-y-auto border-r border-red-500">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          Conversations
        </h2>
        <ul>
          {conversations.map((conversation, index) => (
            <li
              key={index}
              onClick={() => handleConversationClick(conversation.id)}
              className={`cursor-pointer p-4 mb-4 rounded ${
                selectedConversation === conversation.id
                  ? 'bg-red-300 text-gray-800 transform hover:scale-105 transition-all duration-300'
                  : 'bg-white text-gray-800 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300 '
              }`}
            >
              {
                conversation.participants.filter(
                  (participant) => participant.id !== user?.id
                )[0].username
              }
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 p-8  flex flex-col ">
        {selectedConversation ? (
          <div className="h-full flex flex-col justify-between ">
            <div className="messages flex-1 max-h-96 overflow-y-auto mb-4 h-screen ">
              {messages
                .sort(
                  (a, b) =>
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime()
                )
                .map((msg, index) => (
                  <Message
                    key={index}
                    message={msg}
                    isCurrentUser={msg.authorId === user?.id}
                  />
                ))}
            </div>
            <div className="flex items-center ">
              <input
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded mr-2 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage()
                }}
              />
              <button
                onClick={handleSendMessage}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600 focus:outline-none"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 flex-1 flex items-center justify-center">
            Select a conversation to view messages.
          </div>
        )}
      </div>
    </div>
  )
}

export default MessagePage
