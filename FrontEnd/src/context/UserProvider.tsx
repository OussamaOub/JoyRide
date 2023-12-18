import React, { useState, createContext, useContext, ReactNode } from 'react'

// Define the type for the user context
type UserContextType = {
  user: null | User // Replace 'User' with the actual user data type
  setUser: React.Dispatch<React.SetStateAction<null | User>> // Replace 'User' with the actual user data type
}

// Define the User type
export type User = {
  username: string
  email: string
  id: string
  firstName: string
  lastName: string
}

const userContext = createContext<UserContextType>({
  user: null,
  setUser: () => {}
})

type UserProviderProps = {
  children: ReactNode
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<null | User>(null) // Replace 'User' with the actual user data type
  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  )
}

export function useUser() {
  const context = useContext(userContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export default UserProvider
