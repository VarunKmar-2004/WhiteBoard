import React, { useContext } from 'react'
import Navbar from '../components/Navbar'
import home from '../assets/home.png'
import { useNavigate } from 'react-router-dom'
import { Context } from '../ContextAPI/Context'
const Home = () => {
  const navigate=useNavigate()
  const {isloggedIn}=useContext(Context)
  const handleClick=()=>{
    if(isloggedIn){
      navigate('/room-form')
    }
    else{
      navigate('/login')
    }
  }
  return (
    <>
    <Navbar/>
    <div className='min-h-screen sm:py-16 sm:px-8 px-4 py-8 mx-auto flex flex-row justify-center items-center gap-3'>
       <div className='px-4 flex flex-col gap-3'>
        <h1 data-aos="fade-right" data-aos-duration='1200' className='font-bold lg:text-[27px] md:text-[23px] sm:text-[21px] text-[20px] text-black font-hai'>Collaborate Remotely From Anywhere...</h1>
        <p data-aos="fade-right" data-aos-duration='1400' className='font-medium sm:text-[17px] text-[15px] text-gray-600 font-varun'>A real-time collaborative white board application with voice chat availability..</p>
        <button onClick={handleClick} data-aos="fade-right" data-aos-duration='1500' className='px-4 py-1 rounded-[5px] bg-blue-600 text-white text-[16px] sm:text-[18px] font-semibold font-varun w-max hover:cursor-pointer hover:bg-blue-500 transition-colors duration-150'>Start Collaborating</button>
       </div>
       <div className='px-2 py-1 max-w-2xl'>
        <img data-aos="fade-left" data-aos-duration='1400' src={home} alt='image' className='bg-cover w-full'/>
       </div>
    </div>
    </>
  )
}

export default Home