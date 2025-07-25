import React,{useState} from 'react'
import RoomForm from "./RoomForm";
import Whiteboard from "./WhiteBoard.jsx";

function App() {
  const [roomData, setRoomData] = useState(null);
  return (
    <>
      <div className='min-h-screen w-full bg-[#0a0a0a] py-8 px-8 flex flex-col justify-center items-center '>
      <h1 className='text-center text-[#45cf33] text-2xl font-serif'>Collaborative Whiteboard</h1>
      {!roomData ? (
        <RoomForm onJoin={setRoomData} />
      ) : (
        <Whiteboard roomName={roomData.roomName} drawerName={roomData.drawerName} />
      )}
    </div>
    </>
  )
}

export default App
