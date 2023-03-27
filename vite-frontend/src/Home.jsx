import React from 'react'
import Papa from 'papaparse'
import { FormControl, Input, Typography, Stack, Button, Select, MenuItem, InputLabel } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/system';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
axios.defaults.withCredentials = true
export const Home = () => {
  const [data, setData] = React.useState([])
  const [sec, setSec] = React.useState([])
  const [sel, setSel] = React.useState('')
  const columns = [{ field: "id", headerName: "id" },
  { field: "ID", headerName: "ID", width: 170 },
  { field: "NAME", headerName: "NAME", width: "500" },
  ]
  const nav = useNavigate()

  function takeAttendance(e) {

    console.log(sel);
    return nav('/attendance', { state: { section: sel } })




  }
  React.useEffect(() => {
    axios.get('/api/sections')
      .then((res) => {
        console.log('success fetching  ', res)
        setSec(res.data.data)
        console.log("🚀 ~ file: Home.jsx:19 ~ Home ~ res.data.data:", res.data.data)
      })

      .catch((err) => {
        console.log("🚀 ~ file: Home.jsx:19 ~ handleSubmit ~ err:", err)

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
        // console.log('rsult data',arr)
        setData(results.data)
        // console.log(event.target.text.value)

        axios.post('api/upload', { data: results.data, section: event.target.text.value })

          .then((res) => {
            console.log('success ', res)
          })
          .catch((err) => {
            console.log("🚀 ~ file: Home.jsx:31 ~ handleSubmit ~ err:", err)

          })

        axios.get('/api/sections')
          .then((res) => {
            console.log('success fetching  ', res)
            setSec(res.data.data)
            console.log("🚀 ~ file: Home.jsx:19 ~ Home ~ res.data.data:", res.data.data)
          })

          .catch((err) => {
            console.log("🚀 ~ file: Home.jsx:19 ~ handleSubmit ~ err:", err)

          })


      },
    });
  };
  return (
    <>
      <Typography variant='h4' textAlign={'center'}>Take attendance</Typography>
      <Box display={'flex'} justifyContent={'center'}>
        <FormControl sx={{ width: '20%' }} >
          <InputLabel id='dropdown'>select class</InputLabel>
          <Select name="drop" id="dropdown" label='select class' value={sel} onChange={(e) => { setSel(e.target.value) }}>
            <MenuItem value="select class">select class</MenuItem>
            {sec.map((item) => {
              return <MenuItem value={item}>{item}</MenuItem>
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

          <Typography variant='p' fontFamily={'roboto'}>Class Name</Typography> <Input type="text" name='text' sx={{ marginRight: '4%' }} />
          <Typography variant='p' fontFamily={'roboto'}>File Name</Typography> <Input type="file" name='file' sx={{ marginRight: '4%' }} accept='.csv' />
          <Button type="submit" variant='contained'>upload</Button>
        </form>
      </Box>

      {data.length != 0 ?
        <Box height={'100px'}>
     
          <Box sx={{ height: '350%', width: "60%",color:'red',marginLeft:'auto',marginRight:'auto' }}>
            <DataGrid
              rows={data}
              columns={columns}
              
              pageSize={5}
              rowsPerPageOptions={[5]}
              
              
             
            

            />
          </Box>

          {/* {data.map((item) => {
                 
                  
                 return<tr>
                    <th>{item['ID']}</th> 
                 <th>{item['NAME']}</th> </tr>
                    
                  
                
              })} */}


        </Box>

        : <Typography variant='p' fontFamily={'roboto'}>submit to view preview</Typography>}


    </>
  )
}
