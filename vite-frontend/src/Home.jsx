import React from 'react'
import Papa from 'papaparse'
import { FormControl, Typography, Stack, Button, Select, MenuItem, InputLabel } from '@mui/material';
import { toast } from 'react-toastify';
import Input from '@mui/joy/Input';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/system';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import img from './assets/sit.jpeg'
import { Toaster } from './Toaster';
axios.defaults.withCredentials = true
export const Home = () => {
  const [data, setData] = React.useState([])
  const [sec, setSec] = React.useState([])
  const [sub, setSub] = React.useState([])
  const [sel, setSel] = React.useState('')
  const columns = [{ field: "id", headerName: "id" },
  { field: "ID", headerName: "ID", width: 170 },
  { field: "NAME", headerName: "NAME", width: "500" },

  ]
  const nav = useNavigate()

  function takeAttendance(e) {

    console.log(sub);
    return nav('/attendance', { state: { section: sec[sel],subject:sub[sel] } })




  }
  React.useEffect(() => {
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
      <Toaster />
      <Typography variant='h4' textAlign={'center'}>Take attendance</Typography>
      <Box display={'flex'} justifyContent={'center'}>
        <FormControl sx={{ width: '20%' }} >
          <InputLabel id='dropdown'>select class</InputLabel>
          <Select name="drop" id="dropdown" label='select class' value={sel} onChange={(e) => { 
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

      <Typography variant='h4' textAlign={'center'} marginBottom={'3%'}>Upload new section Data</Typography>
      {/* <Button >logout</Button> */}
      <Typography variant='h6' color={'red'} marginBottom={'3%'}>Note that there must be 2 columns in csv: one is ID and other one is NAME attribute or else uploading wont work!</Typography>
      <Box  >
        <form onSubmit={handleSubmit} encType="multipart/form-data" >

          <Typography variant='p' fontFamily={'roboto'} sx={{ margin: '2%', display: 'block', marginRight: 'auto', marginLeft: 'auto', width: '50%' }}>Class Name</Typography> <Input type="text" variant='solid' placeholder='class name' name='text' sx={{ marginRight: 'auto', marginLeft: 'auto', width: '50%' }} />
          <Typography variant='p' fontFamily={'roboto'} sx={{ margin: '2%', display: 'block', marginRight: 'auto', marginLeft: 'auto', width: '50%' }}>Subject Code</Typography> <Input type="text" variant='solid' placeholder='class name' name='subject' sx={{ marginRight: 'auto', marginLeft: 'auto', width: '50%' }} />
          <Typography variant='p' fontFamily={'roboto'} sx={{ margin: '2%', display: 'block', marginRight: 'auto', marginLeft: 'auto', width: '50%' }}>File Name</Typography> <Input type="file" variant='solid' name='file' sx={{ marginRight: 'auto', marginLeft: 'auto', width: '50%' }} accept='.csv' />
          <Button type="submit" variant='filled' sx={{ margin: '2%',display:'block', marginRight: 'auto', marginLeft: 'auto', width: '30%' }} >Submit</Button>
        </form>
      </Box>

      {data.length != 0 ?
        <Box height={'100px'}>

          <Box sx={{ height: '350%', width: "60%", color: 'red', marginLeft: 'auto', marginRight: 'auto' }}>
            <DataGrid
              rows={data}
              columns={columns}

              pageSize={5}
              rowsPerPageOptions={[5]}





            />
          </Box>


        </Box>

        : <center><img src={img} width='30%'></img></center>}


    </>
  )
}
