# ✏️ Collaborative Whiteboard & Voice Chat

A collaborative whiteboard for groups with real-time drawing, erasing, cursor sharing, and direct peer-to-peer voice chat.  
Built with **React**, **Express**, **Socket.IO**, and **SimplePeer (WebRTC)**.

---

## 🚀 Features

- Multi-user, simultaneous drawing
- Pen & eraser tools, clear-all option
- Live cursor positions and user names
- Peer-to-peer (P2P) voice chat using WebRTC
- Room-based: multiple groups, no crosstalk
- New users instantly see current canvas

---

## 🏗️ Architecture

### Overview

- **Frontend:** React, SimplePeer, socket.io-client
- **Backend:** Express + Socket.IO
- **Voice:** WebRTC, peer-to-peer (via SimplePeer), signaled with Socket.IO

---

### Component Diagram (Mermaid)

graph TD
Canvas[Canvas
(draw/erase)]
Sidebar[Sidebar
(users, status)]
Voice[SimplePeer
Voice (WebRTC)]
Socket[Socket.IO Client]
Canvas --> Socket
Sidebar --> Socket
Voice --> Socket

text

---

### Signal & Media Flow (Mermaid)

flowchart LR
Client1 -- draw/voice/cursor --> Server
Client2 -- draw/voice/cursor --> Server
Client3 -- draw/voice/cursor --> Server
Server -- draw/state/signal --> Clients
Client1 --- P2P WebRTC audio --- Client2
Client1 --- P2P WebRTC audio --- Client3

text

---

### WebRTC Signaling Sequence (Mermaid)

sequenceDiagram
participant Alice as User A
participant Server
participant Bob as User B

Alice->>Server: webrtc_offer (SDP)
Server->>Bob: webrtc_offer (SDP)
Bob->>Server: webrtc_answer (SDP)
Server->>Alice: webrtc_answer (SDP)
Alice->>Server: webrtc_ice_candidate
Bob->>Server: webrtc_ice_candidate
Server->>Bob: webrtc_ice_candidate
Server->>Alice: webrtc_ice_candidate
Note over Alice,Bob: After this, audio flows P2P (not via server)

text

---

## 💡 Concepts

- **Socket.IO:** Real-time events for drawing, cursor movement, and WebRTC signaling.
- **SimplePeer (WebRTC):** Direct audio streams between browsers. The server relays only signaling, never audio.
- **In-memory state:** User lists and drawing history stored in server memory (non-persistent).

---

## ⚙️ How It Works

- **Draw/Erase:** Drawing actions are broadcast to all others. "Clear All" wipes history and screen for all.
- **Cursors:** Every pointer move emits its position, so users see each other's names & cursors as they draw.
- **Voice:** Click "Start Voice Chat" to enable audio. WebRTC (SimplePeer) creates direct peer connections to all other room participants.
- **Room isolation:** Only users in the same room interact.

---

## 🚧 Limitations

- State is **in-memory** (no database), so restart erases rooms/drawings
- No TURN server: WebRTC may not connect behind strict NAT/firewall
- No auth or file persistence
- For demo, hackathon, classroom use; not for production as is

---

## 🏷️ License

MIT

---

## 🧑‍💻 Credits

- [feross/simple-peer](https://github.com/feross/simple-peer)
- [Socket.IO](https://socket.io/)
- Architectural ideas from open-source whiteboard/collaborative apps

---

**Happy Collaborating! 🎨🎤**
