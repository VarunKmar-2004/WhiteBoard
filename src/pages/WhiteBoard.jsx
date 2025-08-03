import React, { useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";
import { socket } from "../socket"; // Make sure your socket exports a `socket` as io() client

export default function Whiteboard({ roomName, drawerName }) {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState("pen"); // "pen" or "eraser"
  const [drawing, setDrawing] = useState(false);
  const [prevPoint, setPrevPoint] = useState(null);
  const [otherCursors, setOtherCursors] = useState({});
  const [users, setUsers] = useState([]);
  const [socketId, setSocketId] = useState(null);
  // Voice
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [peers, setPeers] = useState({}); // { socketId: SimplePeer }
  const audioRefs = useRef({});
  useEffect(() => {
    setSocketId(socket.id);
    socket.emit("join_room", { roomName, drawerName });
  }, [roomName, drawerName]);
  useEffect(() => {
    function onDraw({ from, to, drawerName, socketId, type }) {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (type === "eraser") {
        eraseLine(ctx, from, to);
      } else {
        drawLine(ctx, from, to);
      }
    }
    function onClearBoard() {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    function onUserJoined({ socketId, drawerName }) {
      setUsers((prev) => {
        if (prev.find((u) => u.socketId === socketId)) return prev;
        return [...prev, { socketId, drawerName }];
      });
    }
    function onActiveUsers(active) {
      setUsers(active);
    }
    function onUserLeft({ socketId }) {
      setOtherCursors((prev) => {
        const copy = { ...prev };
        delete copy[socketId];
        return copy;
      });
      setUsers((prev) => prev.filter((u) => u.socketId !== socketId));
      cleanupVoicePeer(socketId);
    }
    function onCursorMove({ position, drawerName, socketId }) {
      setOtherCursors((prev) => ({
        ...prev,
        [socketId]: { position, drawerName },
      }));
    }

    socket.on("draw", onDraw);
    socket.on("clear_board", onClearBoard);
    socket.on("user_joined", onUserJoined);
    socket.on("active_users", onActiveUsers);
    socket.on("user_left", onUserLeft);
    socket.on("cursor_move", onCursorMove);

    return () => {
      socket.off("draw", onDraw);
      socket.off("clear_board", onClearBoard);
      socket.off("user_joined", onUserJoined);
      socket.off("active_users", onActiveUsers);
      socket.off("user_left", onUserLeft);
      socket.off("cursor_move", onCursorMove);
    };
  }, []);

  // --- WebRTC SimplePeer logic ---

  // Allow peer creation for signaling even if not voiceEnabled (listener can always receive)
  function makePeerConnection(otherId, initiator) {
    const opts = {
      initiator,
      trickle: false,
    };
    if (localStream) {
      opts.stream = localStream;
    }
    const peer = new SimplePeer(opts);

    peer.on("signal", (data) => {
      // SimplePeer emits signal for offer/answer/ice
      if (initiator) {
        socket.emit("webrtc_offer", {
          targetSocketId: otherId,
          offer: data,
          drawerName
        });
      } else {
        if (data.type === "answer") {
          socket.emit("webrtc_answer", {
            targetSocketId: otherId,
            answer: data,
            drawerName
          });
        } else if (!data.type || data.candidate) {
          socket.emit("webrtc_ice_candidate", {
            targetSocketId: otherId,
            candidate: data
          });
        }
      }
    });

    peer.on("stream", (remoteStream) => {
      // Create or reuse audio element for this peer
      if (audioRefs.current[otherId]) return;
      const audio = document.createElement("audio");
      audio.autoplay = true;
      audio.srcObject = remoteStream;
      audioRefs.current[otherId] = audio;
      document.body.appendChild(audio);
    });

    peer.on("close", () => {
      cleanupVoicePeer(otherId);
    });

    peer.on("error", () => {
      cleanupVoicePeer(otherId);
    });

    setPeers((prev) => ({ ...prev, [otherId]: peer }));

    return peer;
  }

  function cleanupVoicePeer(sid) {
    if (audioRefs.current[sid]) {
      audioRefs.current[sid].remove();
      delete audioRefs.current[sid];
    }
    setPeers((prev) => {
      const copy = { ...prev };
      if (copy[sid]) {
        copy[sid].destroy?.();
        delete copy[sid];
      }
      return copy;
    });
  }

  useEffect(() => {
    // Only block self-connection
    function onWebrtcOffer({ fromSocketId, offer }) {
      if (fromSocketId === socketId) return;
      let peer = peers[fromSocketId];
      if (!peer) {
        peer = makePeerConnection(fromSocketId, false);
      }
      peer.signal(offer);
    }
    function onWebrtcAnswer({ fromSocketId, answer }) {
      if (fromSocketId === socketId) return;
      const peer = peers[fromSocketId];
      if (peer) peer.signal(answer);
    }
    function onWebrtcIce({ fromSocketId, candidate }) {
      if (fromSocketId === socketId) return;
      const peer = peers[fromSocketId];
      if (peer) peer.signal(candidate);
    }
    socket.on("webrtc_offer", onWebrtcOffer);
    socket.on("webrtc_answer", onWebrtcAnswer);
    socket.on("webrtc_ice_candidate", onWebrtcIce);

    return () => {
      socket.off("webrtc_offer", onWebrtcOffer);
      socket.off("webrtc_answer", onWebrtcAnswer);
      socket.off("webrtc_ice_candidate", onWebrtcIce);
    };
    // eslint-disable-next-line
  }, [peers, socketId]);

  // On users list change, connect if voiceEnabled
  useEffect(() => {
    if (!voiceEnabled || !localStream) return;
    // Remove peers not in the room anymore
    Object.keys(peers).forEach((p) => {
      if (!users.find((u) => u.socketId === p)) {
        cleanupVoicePeer(p);
      }
    });
    // Add peers for new users
    users.forEach((u) => {
      if (u.socketId === socketId) return;
      if (!peers[u.socketId]) {
        makePeerConnection(u.socketId, true); // initiator
      }
    });
    // eslint-disable-next-line
  }, [users, voiceEnabled, localStream]);

  // Start/stop voice chat
  async function startVoiceChat() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);
      setVoiceEnabled(true);
    } catch (err) {
      alert("Microphone access denied or unavailable.", err);
    }
  }
  function stopVoiceChat() {
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      setLocalStream(null);
    }
    setVoiceEnabled(false);
    // Destroy peers and remove audio
    Object.keys(peers).forEach(cleanupVoicePeer);
  }

  const getPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleDown = (e) => {
    setDrawing(true);
    setPrevPoint(getPoint(e));
  };

  const handleMove = (e) => {
    const currentPoint = getPoint(e);
    if (drawing) {
      if (prevPoint) {
        const ctx = canvasRef.current.getContext("2d");
        if (tool === "pen") {
          drawLine(ctx, prevPoint, currentPoint);
          socket.emit("draw", { from: prevPoint, to: currentPoint, type: "pen" });
        } else if (tool === "eraser") {
          eraseLine(ctx, prevPoint, currentPoint);
          socket.emit("draw", { from: prevPoint, to: currentPoint, type: "eraser" });
        }
      }
      setPrevPoint(currentPoint);
    }
    socket.emit("cursor_move", { position: currentPoint });
  };

  const handleUp = () => {
    setDrawing(false);
    setPrevPoint(null);
  };

  const handleClear = () => {
    // Clear locally and notify others
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit("clear_board", { roomName });
  };

  // Drawing and erasing
  const drawLine = (ctx, from, to) => {
    ctx.save();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.globalCompositeOperation = "source-over";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
  };

  const eraseLine = (ctx, from, to) => {
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.lineWidth = 24; // Eraser size
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
  };

  return (
    <div className="flex flex-row justify-center gap-8 p-6 min-h-[600px] bg-gray-100">
      {/* Drawing Area */}
      <div className="flex flex-col items-center">
        <div className="mb-4 flex flex-row items-center gap-4">
          {/* Drawing tool buttons */}
          <button
            className={`px-4 py-2 rounded-sm text-white transition ${
              tool === "pen"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-gray-500 hover:bg-gray-600"
            }`}
            onClick={() => setTool("pen")}
          >
            Pen
          </button>
          <button
            className={`px-4 py-2 rounded-sm text-white transition ${
              tool === "eraser"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-500 hover:bg-gray-600"
            }`}
            onClick={() => setTool("eraser")}
          >
            Manual Erase
          </button>
          <button
            className="px-4 py-2 rounded-sm text-white bg-pink-600 hover:bg-pink-700 transition"
            onClick={handleClear}
          >
            Clear All
          </button>
          {/* --- Voice Chat Buttons --- */}
          {!voiceEnabled ? (
            <button
              className="px-4 py-2 rounded-sm text-white bg-blue-700 hover:bg-blue-800 transition"
              onClick={startVoiceChat}
            >
              Start Voice Chat
            </button>
          ) : (
            <button
              className="px-4 py-2 rounded-sm text-white bg-gray-700 hover:bg-gray-800 transition"
              onClick={stopVoiceChat}
            >
              Stop Voice Chat
            </button>
          )}
          {/* Tool mode indicator */}
          <span className="text-gray-600 font-medium select-none">
            {tool === "pen"
              ? "Drawing: Pen tool"
              : "Drawing: Eraser tool"}
          </span>
        </div>

        {/* Canvas drawing area */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={700}
            height={500}
            className="border-2 border-gray-700 rounded-sm shadow-sm bg-white cursor-crosshair"
            onMouseDown={handleDown}
            onMouseMove={handleMove}
            onMouseUp={handleUp}
            onMouseLeave={handleUp}
          />
          {/* Other users' cursors */}
          <div
            style={{
              position: "absolute",
              pointerEvents: "none",
              left: 0,
              top: 0,
              width: 700,
              height: 500,
            }}
          >
            {Object.entries(otherCursors).map(
              ([id, { position, drawerName }]) =>
                position ? (
                  <div
                    key={id}
                    className="absolute z-10 pointer-events-none bg-gray-300 text-black text-xs rounded px-2 py-0.5 flex items-center select-none"
                    style={{
                      left: position.x,
                      top: position.y,
                      transform: "translate(-50%, -110%)",
                    }}
                  >
                    {drawerName}
                    <span className="ml-1 w-2.5 h-2.5 bg-blue-600 rounded-full inline-block" />
                  </div>
                ) : null
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="flex-1 max-w-xs p-6 bg-gray-800 rounded-md text-white shadow-md h-max min-h-[500px] mt-13">
        <h2 className="text-xl font-semibold mb-4">Active users in room:</h2>
        <ul className="list-disc list-inside space-y-2">
          {users.map((u) => (
            <li key={u.socketId} className="whitespace-nowrap">
              {u.drawerName}
              {u.socketId === socketId ? " (You)" : ""}
            </li>
          ))}
        </ul>
        <div className="mt-6 text-sm text-emerald-300">
          Voice Chat: {voiceEnabled ? "Enabled – you can talk/listen" : "Disabled"}
        </div>
      </aside>
    </div>
  );
}
