import React from 'react'
import axios from 'axios'
import { Button, Paper, Typography, Card, CardActions, CardContent, Box, Select, Alert, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
// import {DesktopDatePicker} from '@mui/x-date-pickers/DesktopDatePicker'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function reducing(state, action) {
    switch (action.type) {
        case 'add':
            return [...state, action.payload]
        case 'update':
            return state.map((item) => {
                console.log('heh outside id ', item.ID);

                if (item.ID == action.payload.ID) {
                    console.log('match found!');
                    return { ...item, STATUS: action.payload.STATUS }
                }
                return item
            })

    }
}
export const Attendance_copy = () => {


    const [data, setData] = React.useState(false)
    const [alert, setAlert] = React.useState({ status: false, message: '' })

    const [limit, setLimit] = React.useState(true)
    const [init, setInit] = React.useState(0)
    const [course, setCourse] = React.useState(false)
    const [state, dispatcher] = React.useReducer(reducing, [])

    console.log(course);
    console.log(state);
    // React.useEffect(, [])

    function handleClick(e) {
        const { value } = e.target

        if (init < data.length) {
            console.log('outer init', init);
            dispatcher({ type: 'add', payload: { ID: data[init].ID, NAME: data[init].NAME, STATUS: value } })
            if (init + 1 >= data.length) {
                console.log('inside false stat');
                setLimit(false)

            } else { setInit(init + 1) }

        }
    }
    function handleSubmit(e) {
        console.log(e.target.name);
        console.log(e.target.value);
        const { name, value } = e.target
        dispatcher({ type: 'update', payload: { ID: name, STATUS: value } })

    }
    function download_csv() {

        //     define the heading for each row of the data  
        var csv = 'Roll,Name,Status\n';

        //merge the data with CSV  
        state.map(function (row) {
            console.log('values here', row)
            row = Object.values(row)
            csv += row.join(',');
            csv += "\n";
        });




        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';

        //provide the name for the CSV file to be downloaded  
        console.log('CBIT-' + new Date().toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" }))
        hiddenElement.download = 'CBIT-' + new Date().toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" });
        hiddenElement.click();

    }
    function fetch(sec) {

        axios.get('http://localhost:5000/it2')
            .then((result) => {
                console.log(result.data.length);
                setData(result.data)

            }).catch((err) => {
                console.log(err);
            });

    }
    var dummy;
    React.useEffect(
        function initializer() {

            dummy = "hi"
            // const sec=rend.attendance.split("-")[2]
            setData(false)
            setInit(0)
            console.log()
            fetch()



        }, []
    )
    console.log(dummy)


    // function upload_attend()
    // {
    //     const sec=rend.attendance.split("-")[2]
    //     axios.post('ht tp://localhost:2555/attendance/',{  subject:rend.attendance,section:sec,date:rend.date,values:state})
    //     .then((result) => { 
    //         console.log(result)
    //         setAlert({status:true,message:result.data.message})
    //     }).catch((err) => {
    //         console.log(err)
    //     });
    // }    
    return (
        <>
            {/* <center>
              
                <br />
                <Typography sx={{ display: 'inline-block', marginRight: '5px' }}>Select Class</Typography>
                <select ref={secRef}>
                    
                </select>
                <br></br>
                <Button onClick={initializer}>set-Subject</Button></center> */}
            {data ?
                <>
                    {alert.status ? <Alert onClose={() => { setAlert(false) }}>{alert.message}</Alert> : null}

                    <Paper elevation={3} sx={{ display: 'flex', justifyContent: 'center', fontFamily: ' Gemunu Libre', fontSize: '120%' }}>
                        <Card  >
                            <CardContent sx={{ fontFamily: ' Gemunu Libre', fontSize: '120%' }} >
                                <Box display={'flex'} justifyContent={'space-between'}>
                                    <span>{data[init]['ID']}</span>
                                    <span>{init}/{data.length}</span>
                                </Box>

                                <br></br>
                                {data[init]['NAME']}
                            </CardContent>
                            <CardActions>
                                <Button name='present' value='P' onClick={handleClick} disabled={limit ? false : true}>Present</Button>
                                <Button name='absent' value='A' onClick={handleClick} disabled={limit ? false : true}>Absent</Button>
                                <Button name='late' value='L' onClick={handleClick} disabled={limit ? false : true}>Late</Button>
                                <Button name='Permission' value='PR' onClick={handleClick} disabled={limit ? false : true}>Permission</Button>
                            </CardActions>
                        </Card>
                       
                        {/* <Button onClick={upload_attend}> upload Attendance</Button> */}

                        <Button sx={{display:'block'}} onClick={download_csv}>Download CSV</Button>
                    </Paper>
                    
                    <Typography variant='h4' display='flex' justifyContent={'center'}> Absentees here</Typography>
                    <Box sx={{ display: 'flex',alignItems:'center', flexDirection: 'column', flexWrap: 'wrap', height: '250px' }}>
                        {state.map((item) => {
                            if (item.STATUS === 'A') {
                                return <Typography>{item.NAME}</Typography>
                            }
                        })}</Box>
                    <Typography variant='h4' display={'flex'} justifyContent={'center'}> Edit here</Typography>
                    <br />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column', height: '900px' }}>
                        {state.map((item) => {
                            return <Paper sx={{display:'flex',justifyContent:'center'}} elivation={2} key={item.ID}>
                                {/* <Typography sx={{ display: 'inline-block', color: 'salmon' }}>{item.ID}-</Typography>
                                <Typography sx={{ display: 'inline-block', color: 'blue' }}>{item.NAME}-</Typography>
                                <Typography sx={{ display: 'inline-block', marginRight: '20px', color: 'red' }}>{item.STATUS}</Typography>
                                <input onClick={handleSubmit} value='P' type={'radio'} name={item.ID} checked={item.STATUS == 'P' ? true : false} />
                                <Typography variant='body2'
                                    sx={{ fontFamily: ' Gemunu Libre', fontSize: '120%', display: 'inline-block' }}
                                >present</Typography>

                                <input onClick={handleSubmit} value='A' type={'radio'} name={item.ID} checked={item.STATUS == 'A' ? true : false} />
                                <Typography variant='body2'
                                    sx={{ fontFamily: ' Gemunu Libre', fontSize: '120%', display: 'inline-block' }}
                                >absent</Typography>

                                <input onClick={handleSubmit} value='L' type={'radio'} name={item.ID} checked={item.STATUS == 'L' ? true : false} />
                                <Typography variant='body2'
                                    sx={{ fontFamily: ' Gemunu Libre', fontSize: '120%', display: 'inline-block' }}
                                >late</Typography>
                                <input onClick={handleSubmit} value='PR' type={'radio'} name={item.ID} checked={item.STATUS == 'PR' ? true : false} />
                                <Typography variant='body2'
                                    sx={{ fontFamily: ' Gemunu Libre', fontSize: '120%', display: 'inline-block' }}
                                >Permission</Typography> */}

                                <Accordion sx={{width:'50%'}}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography>{item.ID}-</Typography>
                                        <Typography>{item.NAME}-</Typography>
                                        <Typography>{item.STATUS}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                    <input onClick={handleSubmit} value='P' type={'radio'} name={item.ID} checked={item.STATUS == 'P' ? true : false} />
                                <Typography variant='body2'
                                    sx={{ fontFamily: ' Gemunu Libre', fontSize: '120%', display: 'inline-block' }}
                                >present</Typography>

                                <input onClick={handleSubmit} value='A' type={'radio'} name={item.ID} checked={item.STATUS == 'A' ? true : false} />
                                <Typography variant='body2'
                                    sx={{ fontFamily: ' Gemunu Libre', fontSize: '120%', display: 'inline-block' }}
                                >absent</Typography>

                                <input onClick={handleSubmit} value='L' type={'radio'} name={item.ID} checked={item.STATUS == 'L' ? true : false} />
                                <Typography variant='body2'
                                    sx={{ fontFamily: ' Gemunu Libre', fontSize: '120%', display: 'inline-block' }}
                                >late</Typography>
                                <input onClick={handleSubmit} value='PR' type={'radio'} name={item.ID} checked={item.STATUS == 'PR' ? true : false} />
                                <Typography variant='body2'
                                    sx={{ fontFamily: ' Gemunu Libre', fontSize: '120%', display: 'inline-block' }}
                                >Permission</Typography>
                                    </AccordionDetails>
                                </Accordion>


                            </Paper>

                        })}
                    </Box>
                </>
                : null}</>
    )
}
