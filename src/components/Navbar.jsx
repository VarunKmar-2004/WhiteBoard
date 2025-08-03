import React, { useContext } from 'react'
import logo from '../assets/Logo.png'
import { useNavigate } from 'react-router-dom'
import { Context } from '../ContextAPI/Context'

const Navbar = () => {
  const {userData,isloggedIn}=useContext(Context)
  const navigate=useNavigate()
  const handleNavigate=(path)=>{
    navigate(path)
  }
  return (
    <div className='fixed z-10 w-full h-[60px] px-4 py-4 border-b-2 border-b-[#d5d4d4] flex flex-row justify-between items-center gap-2'>
      <div onClick={()=>handleNavigate('/')} data-aos="fade-down" data-aos-duration='1000' className='px-2 py-2  flex flex-row justify-center items-center gap-2 sm:ml-8'>
        <div className='h-[50px] sm:h-[60px] sm:w-[60px] w-[50px]'>
          <img src={logo} alt='logo' className='rounded-full bg-cover '/>
        </div>
        <h1 className='text-[22px] sm:text-[25px] font-kittu text-black'>SyncSketch</h1>
      </div>
      <div className='hidden sm:flex flex-row justify-center items-center gap-10 sm:mr-8'>
        <p onClick={()=>handleNavigate('/')}  data-aos="fade-down" data-aos-duration='1400' className=' font-hai sm:text-[17px] hover:cursor-pointer hover:text-blue-500 transition-colors duration-150'>Home</p>
        <p onClick={()=>handleNavigate('/about')} data-aos="fade-down" data-aos-duration='1600' className=' font-hai sm:text-[17px] hover:cursor-pointer hover:text-blue-500 transition-colors duration-150'>About</p>
        <p onClick={()=>handleNavigate('/features')} data-aos="fade-down" data-aos-duration='1800' className=' font-hai sm:text-[17px] hover:cursor-pointer hover:text-blue-500 transition-colors duration-150'>Features</p>
        {isloggedIn && userData?.fullName?(
          <button  onClick={()=>handleNavigate('/profile')}  className='px-1 py-1 w-[40px] h-[40px] text-[18px] bg-blue-500 rounded-full hover:cursor-pointer hover:bg-blue-600 transition-colors duration-150 text-white font-hai'>{userData.fullName.charAt(0).toUpperCase()}</button>)
          :(
          <button  onClick={()=>handleNavigate('/login')}  className='px-4 py-1 text-[17px] bg-blue-500 rounded-[5px] hover:cursor-pointer hover:bg-blue-600 transition-colors duration-150 text-white font-hai'>Login</button>
        )}
      </div>
    </div>
  )
}

export default Navbar