import React from 'react'
import Papa from 'papaparse'
import { FormControl, Typography, Stack, Button, Select, MenuItem, InputLabel,Dialog } from '@mui/material';
import { toast } from 'react-toastify';
import Input from '@mui/joy/Input';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/system';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
// import {img} from './assets/sit.jpeg'
import { Toaster } from './Toaster';
import { Notfound } from './Notfound';
// import {img1} from './assets/back.jpeg'
axios.defaults.withCredentials = true
export const Home = () => {
  const [data, setData] = React.useState([])
  const [sec, setSec] = React.useState([])
  const [sub, setSub] = React.useState([])
  const [sel, setSel] = React.useState('')
  const [mod, setMod] = React.useState(false)
  const columns = [{ field: "id", headerName: "id" },
  { field: "ID", headerName: "ID", width: 170 },
  { field: "NAME", headerName: "NAME", width: "500" },

  ]
  const nav = useNavigate()

  function takeAttendance(e) {

    console.log(sub);
    if(sel==='')
    return;
    return nav('/attendance', { state: { section: sec[sel],subject:sub[sel] } })




  }
  function logout(e) {

   
    axios.get('/api/logout')
    .then((res)=>
    {
       if(res.data.status)
       {
         setMod(true)
       }
       
    }).catch((err)=>
    {
     console.log(err)
    })




  }


  React.useEffect(() => {
   axios.get('/api/logged')
   .then((res)=>
   {
      if(res.data.status===false)
      {
        setMod(true)
      }
      
   }).catch((err)=>
   {
    console.log(err)
   })



    axios.get('/api/sections')
      .then((res) => {
        console.log('success fetching  ', res)
        setSec(res.data.data)
        setSub(res.data.subject)
        console.log("🚀 ~ file: Home.jsx:19 ~ Home ~ res.data.data:", res.data.data)
      })

      .catch((err) => {
        console.log("🚀 ~ file: Home.jsx:19 ~ handleSubmit ~ err:", err)
        toast('error occured in fetching the details')

      })

  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.file.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log(results.data)

        let count = -1
        results.data = results.data.map((item) => {
          count += 1

          return { "id": count, ...item }
        })



        axios.post('api/upload', { data: results.data, subject: event.target.subject.value, class: event.target.text.value })

          .then((res) => {
            console.log('success ', res.data)
            setData(results.data)
            toast('uploaded succesfully')
            axios.get('/api/sections')
              .then((res) => {
                console.log('success fetching  ', res)
                setSec(res.data.data)
                console.log("🚀 ~ file: Home.jsx:19 ~ Home ~ res.data.data:", res.data.data)
              })

              .catch((err) => {
                console.log("🚀 ~ file: Home.jsx:19 ~ handleSubmit ~ err:", err)
                toast(err)

              })
          })
          .catch((err) => {
            console.log("🚀 ~ file: Home.jsx:31 ~ handleSubmit ~ err:", err)
            toast(err)

          })




      },
    });
  };
  return (
    <>
    { mod? <Dialog
    fullScreen
    open={mod}>
        <Notfound></Notfound>


    </Dialog>:null}
    <Box sx={{backgroundImage:`url(/back.jpeg)`,backgroundSize:'cover'}}>
    
      <Toaster />
      <Box sx={{ display:'flex',justifyContent:'end'}}>
      <Button variant='contained'  onClick={logout}>log-out</Button></Box>
      <Typography variant='h4' textAlign={'center'}>Take attendance</Typography>
      
      <Box display={'flex'} justifyContent={'center'}>
        
        <FormControl sx={{ width: '20%' }}  >
          <InputLabel id='dropdown'>select class</InputLabel>
          <Select name="drop" id="dropdown" label='select class' required value={sel} onChange={(e) => { 
            console.log(e.target.value)
            setSel(e.target.value)
          
          }}>
            {/* <MenuItem value="select class">select class</MenuItem> */}
            {
              
            sec.map((item,index) => {
              console.log(index)
              return <MenuItem value={index}>{item}</MenuItem>
            })}
          </Select>
          <Button type="submit" onClick={takeAttendance}>take attendance</Button>
        </FormControl>
       
      </Box>
      

      <Typography variant='h4' marginBottom={'3%'} fontFamily={'sans-serif'} fontWeight={'200%'}>Upload new section Data</Typography>
      {/* <Button >logout</Button> */}
      <Typography variant='h6' color={'ThreeDDarkShadow'} marginBottom={'3%'} fontFamily={'fantasy'}>Note that there must be 2 columns in csv: one is <span style={{color:'black'}}>ID</span>  and other one is <span style={{color:'black'}}>NAME</span>  attribute or else uploading wont work!</Typography>
      <Box  >
        <form onSubmit={handleSubmit} encType="multipart/form-data" >

          <Typography variant='p' fontFamily={'roboto'} sx={{ margin: '2%', display: 'block', marginRight: 'auto',  width: '50%' }}>Class Name</Typography> <Input type="text" variant='solid' autoComplete='off' placeholder='class name' name='text' sx={{ marginRight: 'auto',  width: '50%' }} />
          <Typography variant='p' fontFamily={'roboto'} sx={{ margin: '2%', display: 'block', marginRight: 'auto',  width: '50%' }}>Subject Code</Typography> <Input type="text" variant='solid' autoComplete='off' placeholder='class name' name='subject' sx={{ marginRight: 'auto',  width: '50%' }} />
          <Typography variant='p' fontFamily={'roboto'} sx={{ margin: '2%', display: 'block', marginRight: 'auto',  width: '50%' }}>File Name</Typography> <Input type="file" variant='solid' autoComplete='off' name='file' sx={{ marginRight: 'auto',  width: '50%' }} accept='.csv' />
          <Button type="submit" variant='filled' sx={{ margin: '2%',display:'block', marginRight: 'auto',  width: '30%',backgroundColor:'AppWorkspace' }} >Submit</Button>
        </form>
      </Box>

      {data.length != 0 ?
      
        <Box height={'100px'}>
 <Typography variant='h4' marginBottom={'3%'} fontFamily={'sans-serif'} fontWeight={'200%'}>PreView of Data Uploaded</Typography>
          <Box sx={{ height: '350%', width: "60%", color: 'red', marginLeft: 'auto', marginRight: 'auto' }}>
            <DataGrid
              rows={data}
              columns={columns}

              pageSize={5}
              rowsPerPageOptions={[5]}





            />
          </Box>


        </Box>

        : <center><img  width='30%'></img></center>}


    </Box>
    </>
  )
}
