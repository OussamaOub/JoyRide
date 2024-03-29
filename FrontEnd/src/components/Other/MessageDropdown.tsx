import React, { FC } from 'react'
// import Dropdown, { DropdownItem } from "./Dropdown";
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
// import { useDeleteMessage } from "../hooks/useMessages";
import { useParams } from 'react-router-dom'
import Dropdown, { DropdownItem } from './DropDown'

interface MessageItem {
  id: string
  conversationId: string
  message: string
  authorId: string
}

interface MessageDropdownProps {
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>
  toggleBtnRef: React.RefObject<HTMLButtonElement>
  isCurrentUser: boolean
  message: MessageItem
  //   setMessageToEdit: React.Dispatch<React.SetStateAction<MessageItem | null>>
}

const MessageDropdown: FC<MessageDropdownProps> = ({
  setShowDropdown,
  toggleBtnRef,
  isCurrentUser,
  message
  //   setMessageToEdit
}) => {
  const { conversationId } = useParams()
  //   const { mutate: deleteMessage } = useDeleteMessage(parseInt(conversationId!));
  return (
    <Dropdown
      setShowDropdown={setShowDropdown}
      toggleBtnRef={toggleBtnRef}
      orientation="horizontal"
    >
      {isCurrentUser && (
        <DropdownItem
          icon={<FiTrash2 />}
          onClick={() =>
            // deleteMessage(message.id)
            console.log('Delete message')
          }
          setShowDropdown={setShowDropdown}
          variant="danger"
        />
      )}
      {isCurrentUser && (
        <DropdownItem
          icon={<FiEdit2 />}
          onClick={() =>
            // setMessageToEdit(message)
            console.log('Edit message')
          }
          setShowDropdown={setShowDropdown}
        />
      )}
    </Dropdown>
  )
}

export default MessageDropdown
