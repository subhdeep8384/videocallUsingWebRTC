import {useState} from 'react'
import {BrowserRouter , Route , Routes} from 'react-router-dom'
import './App.css'
import Sender from './components/Sender'
import Receiver from './components/Receiver'

function App() {
 

  return (
    <BrowserRouter>
        <Routes>
            <Route path='/sender' element={<Sender />} ></Route>
            <Route path='/receiver' element={<Receiver />} ></Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
