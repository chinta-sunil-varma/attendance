const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bcrypt = require('bcrypt')
const ejs = require('ejs')
const uuidv4 = require('uuid')
const { studentModel, registerModel, classModel, attendanceModel } = require('./models');

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

        res.redirect('/api/signin')
        return;
    }
}
mongoose.connect(process.env.MONGO, (err) => {
    if (err) {
        console.log('error has occured connecting to db!')

    }
    else {
        console.log('connected to db')

    }
})

app.get('/', (req, res) => {
    res.redirect('/api/signin')
})


app.get('/api/signin', (req, res) => {
    console.log('touched')
    // res.sendFile(path.join(__dirname, 'frontend', 'signin.html'))
    res.render('signin.ejs', { status: { error: false } })
})
app.get('/api/signup', (req, res) => {
    // res.sendFile(path.join(__dirname, 'frontend', 'signup.html'))
    res.render('signup.ejs', { status: { error: false } })
})
app.get('/welcome', middleware, (req, res) => {
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
        if(obj.email.match("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")==null)
        {
            res.render('signup.ejs',{status:{error:true,message:'not a valid email!'}})
        }
        else{
        try {
            registerModel.insertMany(obj).then((result) => {
                console.log('inserted succesfuly reigst', result)
                res.redirect('/api/signin')
            }).catch((err) => {
                // console.log('err ', err)
                res.render('signup',{status:{error:true,message:'account already exists!'}})
            })

        } catch (error) {
             
              res.render('signup.ejs',{status:{error:true,message:'problem in connecting the database!'}})
        }}




    });
}
)
app.post('/api/signin', async (req, res) => {
    const result = await registerModel.find({ email: req.body.email })
    console.log(result[0]);
    if(result[0]==null)
    return res.render('signin',{status:{error:true,message:'no user exists please signup!'}})
    bcrypt.compare(req.body.password, result[0].password, function (err, result1) {
        // result == true
        if (err) {
            console.log('something error ', err)
            return res.render('signin',{status:{error:true,message:'no user exists please signup!(1)'}})
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
           res.render('signin',{status:{error:true,message:'invalid credentials!'}})
            console.log('passwrod failed');
        }
    });
})
app.post('/api/upload', middleware, (req, res) => {
    // console.log("🚀 ~ file: index.js:143 ~ req:", req.body)
    const data = req.body.data
    var byRoll = data.slice(0);
    byRoll.sort(function (a, b) {
        return a.ID - b.ID;
    });
   try{
    classModel.insertMany({ class: req.body.class, subject: req.body.subject, uid: req.session.uid, data: byRoll }).then
        ((result) => {
            // console.log("🚀 ~ file: index.js:152 ~ app.post ~ res: after isertion", res)
            console.log('inserted into db')
            res.send({ status: true, message: "inserted in db" })

        }).catch((err) => {
            console.log("🚀 ~ file: index.js:149 ~ app.post ~ err:", err)



        })
    }catch(err)
    {
        res.send({status:false,message:'error in db try again later !'})
    }


})
//total sections user teaches shall be returned
app.get('/api/sections', middleware, async (req, res) => {
    console.log('touched')
    try{
    const output = await classModel.find({ uid: req.session.uid })
    console.log("🚀 ~ file: index.js:162 ~ output:", output)

    const send = { subject: [], data: [] }
    output.map((item) => {
        send.data.push(item.class)
        send.subject.push(item.subject)
    })
    console.log(send)

    res.json(send)
}catch(err)
{
    res.send({status:false,message:'error in db try again later !'})
}


})
//students info by taking the section and uid of teacher
app.post('/api/total', middleware, async (req, res) => {
    console.log(req.body)
    try{
    const output = await classModel.findOne({ uid: req.session.uid, class: req.body.section })
    console.log("🚀 ~ file: index.js:181 ~ output:", output)
    res.send(output.data)
    }
    catch(err)
    {
        res.send({status:false,message:'error in database checkout later'})
    }



})

app.get('/api/logged',(req,res)=>
{
    if (req.session.active) {
        res.send({status:true, message: ' authorized' })
    }
    else {
        res.send({status:false, message: 'not authorized try again' })
        
        return;
    }

})
app.get('/api/logout',(req,res)=>
{
    req.session.destroy((err)=>
    {
        res.send({status:true})
        return;
    })

})

app.post('/api/attendance/upload', middleware, async (req, res) => {
    console.log(req.body)
    try {
        const result = await attendanceModel.insertMany({
            uid: req.session.uid, subject: req.body.subject,
            section: req.body.section, values: req.body.data,
            date: req.body.date

        })
        if (result) {
            res.send({ status: true, message: 'uploaded successfully' })
        }
        else {
            res.send({ status: false, message: 'unable to upload' })
        }
    } catch (error) {
        console.log(error)
        res.send({ status: false, message: 'Date not selected!' })
    }

})

app.get('*',(req,res)=>
{
    res.render('notfound.ejs')
})


app.listen(5000, () => {
    console.log('connected at port 5000')

})



