import React from 'react'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import LandingPage from './pages/LandingPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import WelcomPage from './pages/WelcomPage'
import UserProvider from './context/UserProvider'
import { ToastContainer } from 'react-custom-alert'
import RidesPage from './pages/RidesPage'
import ProfilePage from './pages/ProfilePage'
import ValidateUser from './hooks/ValidateUser'
import './index.css'
import PostsPage from './pages/PostsPage'
import Loading from './components/Other/Loading'
import LeftSideBar from './components/SideBars/LeftSideBar'
import RightSideBar from './components/SideBars/RightSideBar'
import MessagesPage from './pages/MessagesPage'
import MessagePage from './pages/MessagePage'

const AppLayout = () => {
  const { user, isloaded } = ValidateUser()

  if (!isloaded) return <Loading />

  return (
    <>
      <div className="lg:max-w-[20vw] lg:h-screen left-0 z-50">
        <LeftSideBar user={user} />
      </div>
      <div className="w-full h-full overflow-y-scroll mobile:pb-10 bg-[#f9fafb] relative z-40 no-scrollbar ">
        <Outlet context={[user, isloaded]} />
      </div>
      <div className="lg:max-w-[17vw] lg:h-screen right-0 z-50">
        <RightSideBar user={user} />
      </div>
    </>
  )
}

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route element={<AppLayout />}>
//       <Route path="/Welcome" element={<WelcomPage />} />
//       <Route path="/Rides" element={<RidesPage />} />
//       <Route path="/Profile" element={<ProfilePage />} />
//       <Route path="/" element={<LandingPage />} />
//       <Route path="/SignIn" element={<SignInPage />} />
//       <Route path="/SignUp" element={<SignUpPage />} />
//     </Route>
//   )
// )

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/Welcome', element: <WelcomPage /> },
      { path: '/Rides', element: <RidesPage /> },
      { path: '/Profile', element: <ProfilePage /> },
      { path: '/Posts', element: <PostsPage /> },
      { path: '/Messages', element: <MessagePage /> }
    ]
  },
  { path: '/', element: <LandingPage /> },
  { path: '/SignIn', element: <SignInPage /> },
  { path: '/SignUp', element: <SignUpPage /> }
])

createRoot(document.getElementById('root') as HTMLElement).render(
  <UserProvider>
    <ToastContainer floatingTime={1000} />
    <RouterProvider router={router} />
  </UserProvider>
)
