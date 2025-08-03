import React,{useEffect} from 'react'
import { Routes,Route ,useLocation} from 'react-router-dom'
import AOS from 'aos';
import 'aos/dist/aos.css';
import Home from './pages/Home'
// import RoomForm from './pages/RoomForm'
import Whiteboard from './pages/WhiteBoard'
import Login from './pages/Login';
import  Room  from './pages/Room';
const AOSInitializer = () => {
  const location = useLocation();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false, // animate only onceS
      easing: 'ease-in-out',
    });
  }, []);

  useEffect(() => {
    AOS.refresh(); // refresh on route change
  }, [location]);

  return null;
};
function App() {
  return (
    <>
    <AOSInitializer />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/room-form' element={<Room/>}/>
        <Route path='/class' element={<Whiteboard/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </>
  )
}

export default App
