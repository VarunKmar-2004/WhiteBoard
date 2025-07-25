import React, { useState } from "react";

const RoomForm = ({onJoin}) => {
    const [roomName, setRoomName] = useState("");
  const [drawerName, setDrawerName] = useState("");
  const [mode, setMode] = useState(null); // create/join
  return (
      <div className='flex flex-col gap-2 bg-black py-16 px-12 mx-auto max-w-[400px] rounded-lg'>
      <label className="text-white font-serif text-lg">Name (for cursor):</label>
      <input className="px-2 py-1 bg-transparent w-full text-white font-serif text-md border-b-2 border-b-white outline-none focus:border-b-emerald-400 transition-colors duration-150"
        required
        value={drawerName}
        onChange={e => setDrawerName(e.target.value)}
        placeholder="Your name"
        style={{ width: "100%", marginBottom: 10 }}
      />
      <div className="flex flex-row justify-center items-center gap-2">
        <button className="px-2 py-1 text-lg font-serif text-white bg-emerald-500 rounded-[5px]" onClick={() => setMode("create")}>Create Room</button>
        <button className="px-2 py-1 text-lg font-serif text-white bg-emerald-500 rounded-[5px]"  onClick={() => setMode("join")}>Join Room</button>
      </div>
      {mode && (
        <>
          <label className="mt-[10px] text-white font-serif text-lg">Room Name:</label>
          <input className="px-2 py-1 bg-transparent w-full text-white font-serif text-md border-b-2 border-b-white outline-none focus:border-b-emerald-400 transition-colors duration-150"
            required
            value={roomName}
            onChange={e => setRoomName(e.target.value)}
            placeholder={mode === "create" ? "Name your room" : "Enter existing room"}
            style={{ width: "100%", marginBottom: 10 }}
          />
          <button className="px-2 py-1 text-lg font-serif text-white bg-emerald-500 rounded-[5px]"
            disabled={!roomName || !drawerName}
            onClick={() => onJoin({ roomName, drawerName })}
            style={{ width: "100%", marginBottom: 10 }}
          >
            {mode === "create" ? "Create and Enter" : "Join Room"}
          </button>
        </>
      )}
    </div>
  )
}

export default RoomForm