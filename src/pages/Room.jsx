import React, { useState } from 'react'
import RoomForm from './RoomForm'
import Whiteboard from './WhiteBoard'

const Room = () => {
    const [roomData,setRoomData]=useState(null)
  return (
    <div className='min-h-screen py-8 px-6 flex justify-center items-center'>
        {!roomData?<RoomForm onJoin={setRoomData}/>:<Whiteboard  roomName={roomData.roomName} drawerName={roomData.drawerName} />}
    </div>
  )
}
export default Room;
