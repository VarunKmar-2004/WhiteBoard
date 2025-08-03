import React, { useEffect,useState } from 'react'
import axios from 'axios'
import { Context } from './Context';
const ContextProvider = ({children}) => {
  axios.defaults.withCredentials=true;
  const [isloggedIn,setIsLoggedIn]=useState(()=>localStorage.getItem('isLoggedIn')==='true')
  const [userData,setUserData]=useState(()=>JSON.parse(localStorage.getItem('userData') || '{}'))
  const isAuthenticated=async()=>{
    try{
     const {data}=await axios.get('https://backend-whiteboard-m2fc.onrender.com/api/auth/is-auth')
     if (data.success){
       setIsLoggedIn(true)
       getUser()
     }
    }catch(err){
      alert(err.message)
    }
  }
  const getUser=async()=>{
    try{
      const {data}=await axios.get('https://backend-whiteboard-m2fc.onrender.com/api/auth/userData')
      if(data.success && data.userData){
        console.log(data.userData)
         setIsLoggedIn(true)
         setUserData(data.userData)
      }
    }catch(err){
      alert(err.message)
    }
  }
  useEffect(() => {
    localStorage.setItem('isloggedIn', isloggedIn);
    localStorage.setItem('userData', JSON.stringify(userData || {}));
  }, [isloggedIn, userData]);

  useEffect(()=>{
    isAuthenticated();
  },[])
  return (
    <Context.Provider value={{isloggedIn,userData}}>
        {children}
    </Context.Provider>
  )
}

export default ContextProvider