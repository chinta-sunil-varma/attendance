import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Attendance_copy } from './Attendance_copy'
import { Home } from './Home'
import SignInSide from './SignInSide'
import SignUp from './SignUp'


ReactDOM.createRoot(document.getElementById('root')).render(
//    <Attendance_copy/>
<BrowserRouter>
    <Routes>
        <Route path='/home' element={<Home></Home>}></Route>
        {/* <Route path='/attendance' element={Attendance_copy}></Route> */}
        <Route path="/attendance" element={<Attendance_copy/>} />
    </Routes>
</BrowserRouter>



)
