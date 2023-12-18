import car from '../../assets/videos/car_for_landing.mp4'
import '../App.css'
import Header from '../components/Landing/Header'

function LandingPage() {
  return (
    <div className="w-screen h-screen">
      <video src={car} autoPlay muted loop className="CarBg" />
      <Header />
    </div>
  )
}

export default LandingPage
