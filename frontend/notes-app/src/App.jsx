import React from 'react'
import Home from './pages/Home/Home'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'


function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
          <Route index element={<Home />} />
          <Route path="login" element={<Login/>} />
          <Route path="signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App

