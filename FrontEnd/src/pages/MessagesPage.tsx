import React from 'react'

export default function MessagesPage() {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <button
        onClick={(e) => {
          e.preventDefault()
          const newIssue = {
            bookingId: 'wasd'
          }
          console.log('egrfijn')
        }}
      >
        Post Issue
      </button>
    </div>
  )
}
