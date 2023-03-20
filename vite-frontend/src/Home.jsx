import React from 'react'
import Papa from 'papaparse'
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios'
import {useNavigate} from 'react-router-dom';
axios.defaults.withCredentials=true
export const Home = () => {
  const [data, setData] = React.useState([])
  const [sec, setSec] = React.useState([])
  const nav=useNavigate()

  function takeAttendance(e) {
    e.preventDefault()
    console.log(e.target.drop.value)
    return nav('/attendance',{state: { section:e.target.drop.value}})
    
  


  }
  React.useEffect(()=>
  {
        axios.get('http://localhost:5000/sections')
        .then((res)=>
        {
          console.log('success fetching  ',res)
          setSec(res.data.data)
          console.log("🚀 ~ file: Home.jsx:19 ~ Home ~ res.data.data:", res.data.data)
        })
         
        .catch((err) => {
          console.log("🚀 ~ file: Home.jsx:19 ~ handleSubmit ~ err:", err)
        
        })

  },[])

  const handleSubmit = (event) => {
    event.preventDefault()
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.file.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log(results.data)
        setData(results.data)
        // console.log(event.target.text.value)
     
        axios.post('http://localhost:5000/upload',{data:results.data,section:event.target.text.value})
       
        .then((res)=>
        {
          console.log('success ',res)
        })
        .catch((err) => {
          console.log("🚀 ~ file: Home.jsx:31 ~ handleSubmit ~ err:", err)
        
        })
        
        
      },
    });
  };
  return (
    <>
      <Typography>upload new section data</Typography>
      <Typography>note that there must be 2 columns in csv one is ID and other one is NAME attribute or else it wont work</Typography>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        section name: <input type="text" name='text' />
        file here: <input type="file" name='file' accept='.csv' />
        <button type="submit">click me</button>
      </form>
      <h2>select class for attendance</h2>
      <form onSubmit={takeAttendance} >
      <select name="drop" id="">
           {sec.map((item)=>
           {
              return <option value={item}>{item}</option>
           })}
      </select>
      <button type="submit">take attendance</button>
      </form>

      
      {data.length != 0 ?
        <Box height={'100px'}>
          <table style={{overflow: 'auto', height: '100px'}}>
            <tbody>
              <tr>
                <th>ID</th>
                <th>NAME</th>
              </tr>
              {data.map((item) => {
                 
                  
                 return<tr>
                    <th>{item['ID']}</th> 
                 <th>{item['NAME']}</th> </tr>
                    
                  
                
              })}

            </tbody>
          </table>
        </Box>

        : <Typography>submit to view preview</Typography>}


    </>
  )
}
