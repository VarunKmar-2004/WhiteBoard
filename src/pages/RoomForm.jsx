import React, { useState } from "react";
import Image from '../assets/room.png'
import { HouseIcon, User2Icon } from "lucide-react";
const RoomForm = ({onJoin}) => {
  const [roomName, setRoomName] = useState("");
  const [drawerName, setDrawerName] = useState("");
  const [mode, setMode] = useState('create'); // create/join
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5 w-full px-4 sm:px-6 py-8">
      <div data-aos="fade-right" data-aos-duration='1200' className="w-full sm:max-w-xl flex justify-center sm:justify-start mb-4 sm:mb-0">
        <img src={Image} className="bg-cover" alt='logo'/>
      </div>
      <div className="flex flex-col items-center px-4 py-6 rounded-md shadow-md shadow-[#3e3e3e] max-w-md sm:max-w-4xl" data-aos="fade-left" data-aos-duration='1200'>
        <div className="flex flex-row justify-center items-center gap-4 px-2 py-2">
          <h1 className="text-[20px] sm:text-[24px] font-hai font-bold text-center">{mode==='create'?'Create Room':"Join Room"}</h1>
        </div>
        {mode==='create'?(
          <form onSubmit={()=>onJoin({roomName,drawerName})} className="w-full flex flex-col gap-4 px-2 sm:px-4 pt-6 sm:pt-8 pb-3 transition-all duration-150">
          <div className="relative w-full mb-2">
            <input name="fullName" value={drawerName} onChange={(e)=>setDrawerName(e.target.value)} className="input-field peer w-full outline-none border-b-2 border-gray-500 pl-10 pr-3 py-3 text-[16px] sm:text-[18px] focus:border-blue-600" type="text" placeholder="Enter your name" required/>
            <User2Icon className="icon-left absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-blue-600" />
          </div>
          <div className="relative w-full mb-2">
            <input name="RoomName"  value={roomName} onChange={(e)=>setRoomName(e.target.value)} className="input-field peer w-full outline-none border-b-2 border-gray-500 pl-10 pr-3 py-3 text-[16px] sm:text-[18px] focus:border-blue-600" type="text" placeholder="Enter Room Name(Create)" required/>
            <HouseIcon className="icon-left absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-blue-600" />
          </div>
          <button disabled={!roomName || !drawerName} className={`w-full ${!roomName || !drawerName?'bg-gray-500 cursor-not-allowed':'bg-blue-600 cursor-pointer'} text-white py-3 rounded-lg font-medium transition-colors`}>Create Room</button>
          <p className="text-center text-[14px] sm:text-[16px] font-hai">if you want to join?<span onClick={()=>setMode('join')} className="text-blue-500 font-kittu hover:cursor-pointer hover:underline hover:text-blue-600 transition-colors">Click Here!</span></p>
        </form>
        ):(
          <form onSubmit={()=>onJoin({roomName,drawerName})} className="w-full flex flex-col gap-4 px-2 sm:px-4 pt-6 sm:pt-8 pb-3 transition-all duration-150">
          <div className="relative w-full mb-2">
            <input name="fullName"  value={drawerName} onChange={(e)=>setDrawerName(e.target.value)} className="input-field peer w-full outline-none border-b-2 border-gray-500 pl-10 pr-3 py-3 text-[16px] sm:text-[18px] focus:border-blue-600" type="text" placeholder="Enter your name" required/>
            <User2Icon className="icon-left absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-blue-600" />
          </div>
          <div className="relative w-full mb-2">
            <input name="RoomName"  value={roomName} onChange={(e)=>setRoomName(e.target.value)} className="input-field peer w-full outline-none border-b-2 border-gray-500 pl-10 pr-3 py-3 text-[16px] sm:text-[18px] focus:border-blue-600" type="text" placeholder="Room Name(Join)" required/>
            <HouseIcon className="icon-left absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-blue-600" />
          </div>
          <button disabled={!roomName || !drawerName} className={`w-full ${!roomName || !drawerName?'bg-gray-500 cursor-not-allowed':'bg-blue-600 cursor-pointer'} text-white py-3 rounded-lg font-medium transition-colors`}>Create Room</button>
           <p className="text-center text-[14px] sm:text-[16px] font-hai">if you want to create?<span onClick={()=>setMode('create')} className="text-blue-500 font-kittu hover:cursor-pointer hover:underline hover:text-blue-600 transition-colors">Click Here!</span></p>
        </form>
        )}
      </div>
    </div>

  )
}

export default RoomForm