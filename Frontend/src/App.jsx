
import { Routes,Route } from 'react-router-dom'
import './App.css'
import Home from "./pages/Home"
import Signup from './pages/Signup'
import Login from './pages/Login'

import FaceRecognition from "./components/FaceRecognition";

function App() {

  return (
<>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
  <FaceRecognition />
  <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/signup" element={<Signup/>}/>
  </Routes>
</>
  )
}

export default App
