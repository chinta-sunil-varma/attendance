import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'

import { Attendance_copy } from './Attendance_copy'
import { DataTable } from './DataTable'
import { Dummy } from './Dummy'
import { Home } from './Home'
import SignInSide from './SignInSide'
import SignUp from './SignUp'
import { Notfound } from './Notfound'


ReactDOM.createRoot(document.getElementById('root')).render(
//    <Attendance_copy/>
<>


<BrowserRouter>
    <Routes>
        <Route  path='/welcome' element={<Home></Home>} ></Route>
        {/* <Route  path='/signin' element={<SignInSide></SignInSide>} ></Route>
        <Route  path='/signup' element={<SignUp></SignUp>} ></Route> */}
        <Route path="/attendance" element={<Attendance_copy/>} />
        {/* <Route path="/d" element={<DataTable/>} /> */}
        <Route path="*" element={<Notfound/>} />
    </Routes>
</BrowserRouter>




</>



)
