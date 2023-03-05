const express = require('express');
const model = require('./models');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config()

const mongoose = require('mongoose');
const path = require('path');
const app = express()
mongoose.set('strictQuery',false)

app.use(express.static(path.join(__dirname, 'frontend')))
app.use(cors(
    {
        origin:'http://127.0.0.1:5173'
    }
))

app.get('/', (req, res) => {
    res.render(path.join(__dirname, 'frontend', 'index.html'))
})

app.get('/it2',async (req, res) => {
  
    const result= await model.find({}).sort([['ID', 1]])

    console.log(result)
    res.send(result)

  


})

mongoose.connect(process.env.MONGO, (err) => {
    if (err) {
        console.log('error has occured connecting to db!')

    }
    else {
        console.log('connected to db')
        app.listen(5000, () => {
            console.log('connected at port 5000')
        })
    }
})


