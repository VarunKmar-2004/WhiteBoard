import React,{useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import logo from '../assets/Logo.png'
import AOS from 'aos';
import "aos/dist/aos.css";
import {EyeOff, LockIcon, MailIcon, User2,Eye} from 'lucide-react'
import axios from 'axios'
const Login = () => {
  const navigate=useNavigate()
  const [login,setIsLogin]=useState('signup')
  const [passview,setPassView]=useState(false)
  const [formData,setFormData]=useState({
    fullName:"",
    email:"",
    password:"",
    profile_pic:null
  })
   useEffect(() => {
  const timer = setTimeout(() => {
    AOS.refresh();
  }, 500);

  return () => clearTimeout(timer);
}, [login]);
const handlePasswordToggle=()=>{
  setPassView((prev)=>!prev);
}
const handleChange=(e)=>{
  const {name,value}=e.target
  setFormData({...formData,[name]:value})
}
const handleSubmit=async(e)=>{
  e.preventDefault()
  axios.defaults.withCredentials==true
  let url=login==='signup'?'https://backend-whiteboard-m2fc.onrender.com/api/auth/sign-up':'https://backend-whiteboard-m2fc.onrender.com/api/auth/login';
  try{
    let response;
    if (login==='signup'){
      response=await axios.post(url,{email:formData.email,password:formData.password,fullName:formData.fullName},{ withCredentials: true, headers: { "Content-Type": "application/json" } });
    }
    else{
      response=await axios.post(url,{email:formData.email,password:formData.password},{ withCredentials: true, headers: { "Content-Type": "application/json" } })
    }
    const {data}=response
    if(data.success){
      navigate('/')
      console.log(data.userData)
    }
  }catch(err){
    alert(`Error:${err.response?.data?.message || err.message}`);
  }
}
  return (
    <div className='min-h-screen py-8 px-6 flex flex-row justify-center items-center gap-4'>
      {login=='signup'?(
        <div className='flex flex-row justify-center items-center gap-2 rounded-[10px] bg-[#14e289] max-w-3xl'>
        <div className='hidden sm:flex flex-col items-center gap-2 text-white w-full'  data-aos="fade-right" data-aos-duration='1200'>
          <div className='w-[100px] h-[100px]'>
            <img src={logo} alt='logo' className='bg-cover'/>
          </div>
          <div className='px-4 py-1 flex flex-col gap-2 items-center'>
            <h1 className='text-[20px] sm:text-[23px] font-hai font-bold'>Welcome Back!!</h1>
            <p className='text-[14px] sm:text-[16px] font-varun text-gray-800'>To keep connected with us please login...</p>
            <button onClick={()=>setIsLogin('login')} className='px-2 py-1 font-hai rounded-[5px] text-[15px] sm:text-[17px] w-max bg-blue-600 hover:cursor-pointer hover:bg-blue-700 transition-colors duration-150'>SIGN IN</button>
          </div>
        </div>
        <div className='flex flex-col gap-2 items-center bg-[#efeded] px-4 py-2 w-full' data-aos="fade-left" data-aos-duration='1400'>
          <h1 className='text-black font-hai font-bold text-[20px] sm:text-[24px]'>Sign Up</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-md mx-auto px-4 py-8 transition-all duration-150">
            <div className="relative w-full mb-2">
              <input name="email" onChange={handleChange} className="input-field peer w-full outline-none border-b-2 border-gray-500 pl-10 pr-3 py-2 text-[16px] sm:text-[18px] focus:border-blue-600" type="email" placeholder="Enter Email" required/>
              <MailIcon className="icon-left absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-blue-600" />
            </div>
            <div className="relative w-full mb-2">
              <input name="fullName" onChange={handleChange} className="input-field peer w-full outline-none border-b-2 border-gray-500 pl-10 pr-3 py-2 text-[16px] sm:text-[18px] focus:border-blue-600" type="text" placeholder="Enter Full Name" required/>
              <User2 className="icon-left absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-blue-600" />
            </div>
            <div className="relative w-full mb-2">
              <input name="password" onChange={handleChange} className="input-field peer w-full outline-none border-b-2 border-gray-500 pl-10 pr-10 py-2 text-[16px] sm:text-[18px] focus:border-blue-600" type={passview?"text":"password"} placeholder="Enter Password" required/>
              <LockIcon className="icon-left absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-blue-600" />
              {passview?(
                <Eye onClick={handlePasswordToggle} className="icon-right absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 peer-focus:text-blue-600" />
              ):(
                <EyeOff onClick={handlePasswordToggle} className="icon-right absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 peer-focus:text-blue-600" />
              )}
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors hover:cursor-pointer">SIGN UP</button>
          </form>
        </div>
      </div>
      ):(
        <div className='flex flex-row justify-center items-center gap-2 rounded-[10px] bg-[#14e289] max-w-3xl'>
        <div className='hidden sm:flex flex-col items-center gap-3 text-white w-full'  data-aos="fade-right" data-aos-duration='1200'>
          <div className='w-[100px] h-[100px]'>
            <img src={logo} alt='logo' className='bg-cover'/>
          </div>
          <div className='px-4 py-1 flex flex-col gap-2 items-center'>
            <h1 className='text-[20px] sm:text-[23px] font-hai font-bold'>Create Account</h1>
            <p className='text-[14px] sm:text-[16px] font-varun text-gray-800'>Get started with us and share knowledge..</p>
            <button onClick={()=>{setIsLogin('signup')}} className='px-2 py-1 font-hai rounded-[5px] text-[15px] sm:text-[17px] w-max bg-blue-600 hover:cursor-pointer hover:bg-blue-700 transition-colors duration-150'>SIGN UP</button>
          </div>
        </div>
        <div className='flex flex-col gap-2 items-center bg-[#efeded] px-4 py-2 w-full' data-aos="fade-left" data-aos-duration='1400'>
          <h1 className='text-black font-hai font-bold text-[20px] sm:text-[24px]'>Sign In</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-md mx-auto px-4 py-8 transition-all duration-150">
            <div className="relative w-full mb-2">
              <input name="email" onChange={handleChange} className="input-field peer w-full outline-none border-b-2 border-gray-500 pl-10 pr-3 py-2 text-[16px] sm:text-[18px] focus:border-blue-600" type="email" placeholder="Enter Email" required/>
              <MailIcon className="icon-left absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-blue-600" />
            </div>
            <div className="relative w-full mb-2">
              <input name='password' onChange={handleChange} className="input-field peer w-full outline-none border-b-2 border-gray-500 pl-10 pr-10 py-2 text-[16px] sm:text-[18px] focus:border-blue-600" type={passview?"text":"password"} placeholder="Enter Password" required/>
              <LockIcon className="icon-left absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-blue-600" />
              {passview?(
                <Eye onClick={handlePasswordToggle} className="icon-right absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 peer-focus:text-blue-600" />
              ):(
                <EyeOff onClick={handlePasswordToggle} className="icon-right absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 peer-focus:text-blue-600" />
              )}
            </div>
            <p className="text-left text-blue-600 text-sm hover:underline cursor-pointer mb-4">Forgot Password?</p>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors hover:cursor-pointer">SIGN IN</button>
          </form>
        </div>
      </div>
      )}
    </div>
  )
}

export default Login