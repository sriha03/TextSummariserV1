import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home'
import Home2 from './components/Home2'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Summarise from './components/Summarise'

const App = () => {
  return (
    <div>
      <BrowserRouter >
          <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/chat" element={<Home2 />} />
            <Route path="/summarise" element={<Summarise />} />
          </Routes>
      </BrowserRouter>
      
    </div>
  )
}

export default App