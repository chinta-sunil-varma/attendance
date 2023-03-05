import React from 'react'
import axios from 'axios'
import { Button, Paper, Typography, Card, CardActions, CardContent, Box, Select, Alert, Accordion, AccordionSummary, AccordionDetails, Stack, ToggleButton } from '@mui/material'
// import {DesktopDatePicker} from '@mui/x-date-pickers/DesktopDatePicker'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
// import Down from './assets/down.svg'
ChartJS.register(ArcElement, Tooltip, Legend);
// import Donot from './Donot';




function reducing(state, action) {
    switch (action.type) {
        case 'add':
            state.map((item) => {
                if (item.heheboi) {
                    switch (action.payload.STATUS) {
                        case 'P':
                            item.pcount += 1;
                            break;
                        case 'PR':
                            item.prcount += 1;
                            break;
                        case 'A':
                            item.acount += 1;
                            break;
                        case 'L':
                            item.lcount += 1;
                            break;


                    }
                    return item;
                }
            })
            return [...state, action.payload]
        case 'update':
            return state.map((item) => {
                console.log('heh outside id ', item.ID);
               

                if (item.ID == action.payload.ID) {
                    console.log('match found!');

                    switch (item.STATUS) {
                        case 'P':
                            state[0].pcount -= 1;
                            break;
                        case 'PR':
                            state[0].prcount -= 1;
                            break;
                        case 'A':
                            state[0].acount -= 1;
                            break;
                        case 'L':
                            state[0].lcount -= 1;
                            break;


                    }

                    switch (action.payload.STATUS) {
                        case 'P':
                            state[0].pcount += 1;
                            break;
                        case 'PR':
                            state[0].prcount += 1;
                            break;
                        case 'A':
                            state[0].acount += 1;
                            break;
                        case 'L':
                            state[0].lcount += 1;
                            break;


                    }
                   



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
    // const [course, setCourse] = React.useState(false)
    const [state, dispatcher] = React.useReducer(reducing, [{ 'heheboi': true, 'acount': 0, 'pcount': 0, 'prcount': 0, 'lcount': 0 }])

    // console.log(course);
    console.log('state herhe', state);
    // React.useEffect(, [])
    const result = state[0]
    const dataChart = {
        labels: ['Absent', 'Present', 'Late', 'Permission'],
        datasets: [
            {
                label: 'no of Students',

                data: [result['acount'], result.pcount, result.lcount, result.prcount],
                backgroundColor: [
                    '#0D0221',
                    '#CBC0AD',
                    '#26408B',
                    '#A6CFD5',

                ],
                borderColor: [
                    '#0D0221',
                    '#CBC0AD',
                    '#26408B',
                    '#A6CFD5',
                ],
                borderWidth: 1,
            },
        ],
    };

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
          // http://localhost:5000/it2
        axios.get('/it2')
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

                    <Paper elevation={3} sx={{ display: 'flex', justifyContent: 'center', fontFamily: ' Gemunu Libre', fontSize: '120%', backgroundColor: '#EEEEEE' }}>
                        <Card  >
                            <CardContent sx={{ fontFamily: ' sans-serif', fontSize: '120%', backgroundColor: '#CBE4DE' }} >
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


                        <Box sx={{ position: 'relative', height: '40vh', width: '40vw' }}>

                            <Doughnut data={dataChart} width={'200px'} height={'200px'} options={{ maintainAspectRatio: false }} />
                        </Box>
                    </Paper>
                    <center> <Button variant='contained' sx={{ backgroundColor: '#827397' }} onClick={download_csv}>Download CSV</Button></center>


                    <Typography fontFamily={'cursive'} variant='h4' display='flex' justifyContent={'center'}> ABSENTEES</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#2E4F4F', color: 'whitesmoke' }}>
                        {state.map((item) => {
                            if (item.STATUS === 'A') {

                                return <>
                                
                                    <Box display={'flex'} justifyContent={'space-evenly'} alignItems={'center'} color={'whitesmoke'} borderColor={'black'} height='25%'
                                    
                                    backgroundColor={"#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase()}
                                    margin='0.4%'
                                    
                                    >
                                        <Typography sx={{ display: 'inline', fontFamily: 'sans-serif' }}>{item.NAME}


                                        </Typography>
                                        <ToggleButton
                                            value="check"
                                            
                                            onChange={() => {
                                                state.map((obj) => {
                                                    if (obj.ID == item.ID) {
                                                        dispatcher({ type: 'update', payload: { ID: obj.ID, 'STATUS': 'p' } })
                                                    }
                                                })
                                            }}
                                            aria-label='remove this entry'
                                            title='remove this entry'

                                            sx={{
                                                width: '5px',
                                                marginLeft:'10px'

                                            }}
                                        >
                                            <DeleteForeverIcon  sx={{ color: 'wheat' , border:'0px' }} />
                                        </ToggleButton>
                                    </Box>




                                </>
                            }
                        })}</Box>
                        <hr />
                    <Typography variant='h4' fontFamily={'cursive'} display={'flex'} justifyContent={'center'}> Edit here</Typography>
                    <br />
                    <Box sx={{
                        overflow: 'scroll',
                        height: '500px',
                        backgroundColor: '#18122B'
                    }}>


                        {state.map((item) => {
                            if (item.heheboi) {

                            } else {


                                return <Box sx={{
                                    display: 'flex', justifyContent: 'center',
                                    overflow: 'scroll',



                                }} > <Accordion sx={{ width: '50%', backgroundColor: '#635985' }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography color={'#C4DDFF'}>{item.ID}-</Typography>
                                            <Typography color={'#FAFFAF'}>{item.NAME}-</Typography>
                                            <Typography>{item.STATUS}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ display: 'flex', justifyContent: 'space-evenly' }}>

                                            <input onClick={handleSubmit} value='P' type={'radio'} name={item.ID} checked={item.STATUS == 'P' ? true : false} />
                                            <Typography variant='body2'
                                                sx={{ fontFamily: 'sans-serif', fontSize: '120%', display: 'inline-block' }}
                                            >PRESENT</Typography>

                                            <input onClick={handleSubmit} value='A' type={'radio'} name={item.ID} checked={item.STATUS == 'A' ? true : false} />
                                            <Typography variant='body2'
                                                sx={{ fontFamily: ' sans-serif', fontSize: '120%', display: 'inline-block' }}
                                            >ABSENT</Typography>

                                            <input onClick={handleSubmit} value='L' type={'radio'} name={item.ID} checked={item.STATUS == 'L' ? true : false} />
                                            <Typography variant='body2'
                                                sx={{ fontFamily: '  sans-serif', fontSize: '120%', display: 'inline-block' }}
                                            >LATE</Typography>
                                            <input onClick={handleSubmit} value='PR' type={'radio'} name={item.ID} checked={item.STATUS == 'PR' ? true : false} />
                                            <Typography variant='body2'
                                                sx={{ fontFamily: ' sans-serif', fontSize: '120%', display: 'inline-block' }}
                                            >PERMISSION</Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </Box>
                            }




                        })}
                    </Box>
                </>
                : null}</>
    )
}
