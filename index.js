const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bcrypt = require('bcrypt')
const ejs = require('ejs')
const uuidv4 = require('uuid')
const { studentModel, registerModel, classModel } = require('./models');

const MongoStore = require('connect-mongo');



dotenv.config()

const mongoose = require('mongoose');
const path = require('path');


const app = express()
mongoose.set('strictQuery', false)
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'frontend')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(cookieParser())
app.use(session(
    {
        resave: true,
        saveUninitialized: true,
        secret: process.env.SECRET,
        store: MongoStore.create(
            {
                mongoUrl: process.env.MONGO,
                ttl: 24 * 60 * 60,
                autoRemove: 'native'

            }
        ),
        // cookie:{domain:['127.0.0.1:5173','localhost:5000']}


    }
))

const middleware = (req, res, next) => {
    console.log(req.session)
    if (req.session.active) {
        next();
    }
    else {
        res.send({ message: 'not authorized try again' })
        return;
    }
}





app.get('/api/signin', (req, res) => {
    console.log('touched')
    res.sendFile(path.join(__dirname, 'frontend', 'signin.html'))
})
app.get('/api/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'signup.html'))
})
app.get('/welcome', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'))

})

app.get('/api/it2', middleware, async (req, res) => {

    const result = await studentModel.find({}).sort([['ID', 1]])

    console.log(result)
    res.send(result)




})

app.post('/api/signup', async (req, res) => {
    console.log(req.body)
    bcrypt.hash(req.body.password, 11, function (err, hash) {
        // Store hash in your password DB.
        if (err) {
            console.log('error occured status code 404', err)
            return;
        }
        obj = {}
        obj.firstName = req.body.firstName
        obj.lastName = req.body.lastName
        obj.email = req.body.email
        obj.password = hash
        obj.uid = uuidv4.v4()

        registerModel.insertMany(obj).then((result) => {
            console.log('inserted succesfuly reigst', result)
            res.redirect('api/signin')
        }).catch((err) => {
            console.log('err ', err)
        })




    });
}
)
app.post('/api/signin', async (req, res) => {
    const result = await registerModel.find({ email: req.body.email })
    console.log(result[0]);
    bcrypt.compare(req.body.password, result[0].password, function (err, result1) {
        // result == true
        if (err) {
            console.log('something error ', err)
            return;
        }
        if (result1) {
            req.session.active = true;
            req.session.uid = result[0].uid
            req.session.save((err) => {
                if (err)
                    console.log('error occured in saving', err)
            })
            console.log('session started');
            res.redirect('/welcome')
        }
        else {
            console.log('passwrod failed');
        }
    });
})
app.post('/api/upload', (req, res) => {
    console.log("🚀 ~ file: index.js:143 ~ req:", req.body)
    const data = req.body.data
    var byRoll = data.slice(0);
    byRoll.sort(function (a, b) {
        return a.ID - b.ID;
    });
  
    classModel.insertMany({ class: req.body.section, uid: req.session.uid, data: byRoll }).then
        ((res) => {
            console.log("🚀 ~ file: index.js:152 ~ app.post ~ res: after isertion", res)

        }).catch((err) => {
            console.log("🚀 ~ file: index.js:149 ~ app.post ~ err:", err)



        })


})
//total sections user teaches shall be returned
app.get('/api/sections', async (req, res) => {
    console.log('touched')
    const output = await classModel.find({ uid: req.session.uid })
    console.log("🚀 ~ file: index.js:162 ~ output:", output)

    const send = { data: [] }
    output.map((item) => {
        send.data.push(item.class)
    })
    console.log(send)

    res.json(send)


})
//students info by taking the section and uid of teacher
app.post('/api/total', async (req, res) => {
    console.log(req.body)
    const output = await classModel.findOne({ uid: req.session.uid, class: req.body.section })
    console.log("🚀 ~ file: index.js:181 ~ output:", output)
    res.send(output.data)


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


