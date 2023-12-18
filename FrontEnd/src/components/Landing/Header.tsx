import logo from '../../../assets/images/logo.svg'
import '../../index.css'
import AnimatedText from '../Other/AnimatedText'

export default function Header() {
  return (
    <main className='h-screen w-screen overflow-hidden p-4'>
      <div className="text-white mobile:m-0 mobile:flex mobile:w-screen mobile:items-center mobile:justify-center mobile:mt-4">
        <a href="/">
          <h1 className="text-2xl font-nasalization mobile:text-3xl">
            JOYRIDE
          </h1>
        </a>
      </div>
      <div className="flex flex-row items-center justify-center text-white font-bold gap-10">
        <section className="flex w-screen min-h-screen text-white items-center justify-center">
          <div className="flex  flex-col justify-center items-center gap-8">
            <h1 className="text-4xl lg:text-7xl font-bold flex">
              <AnimatedText text="Drive."/><AnimatedText text="Connect." className="text-red-500"/><AnimatedText text="Travel"/>
            </h1>
            <h1 className="w-[80%] text-center">
              Discover seamless carpooling at JoyRide. Share journeys, forge
              connections, and contribute to a greener, more connected world. Join
              us today!
            </h1>
            <div className="gap-4 flex items-center justify-center flex-col lg:flex-row">
              {' '}
              <a
                href="/SignIn"
                className="bg-red-500 hover:bg-red-600 text-white font-nonserif p-2 px-24 rounded-lg"
              >
                Sign In
              </a>
              <a
                href="/SignUp"
                className="bg-white hover:bg-[#e7e5e4] text-black font-nonserif p-2 px-24 rounded-lg"
              >
                Sign Up
              </a>{' '}
            </div>
          </div>
          <div className="absolute w-screen left-0 bottom-0 flex flex-col lg:flex-row gap-4 lg:gap-0 items-center py-6 px-10">
            <p className="text-xs flex-1 text-center lg:text-start">
              © JoyRide 2023. Join our carpooling community and make every trip an
              adventure. Travel together, and connect with awesome people.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
