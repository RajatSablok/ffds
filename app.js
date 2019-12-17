const express=require('express')
const bodyParser=require('body-parser')
const bcryptjs=require('bcryptjs')

var app=express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

require('dotenv').config()
var db = require('./config/keys')
var mongoose = require('mongoose')
mongoose.connect(db.mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const userModel=require('./models/user')

app.post('/register',(req,res,next)=>{
    var post_data=req.body
    var plainPass=post_data.password
    var username=post_data.name
    var email=post_data.email
    var gender=post_data.gender
    var phone=post_data.phone
    bcryptjs.hash(plainPass, 10, function (err, hash){
        var newobj={
            name:username,
            email,
            phone,
            gender,
            password:hash
        }
        userModel.findOne({email:email}).then((user)=>{
            if(user)
            {
                res.json('User already exists')
            }
            else{
                new userModel(newobj).save((err,user)=>{
                    if(err)
                    {
                        res.json(err)
                    }
                    if(user)
                    {
                        res.json('Registered Successfully')
                    }
                })
            }
        })
        

    })
})

app.post('/login',(req,res)=>{
    var post_data=req.body
    var email=post_data.email
    var password=post_data.password

    userModel.findOne({email:email}).then((user)=>{
        if(!user){
            res.json('Email not found')
        }
        else {
            bcryptjs.compare(password, user.password, function (err, result) {
                if (result == false) {
                    res.json('Invalid Password')
            
                } else {
                    res.json({
                        response:'Login successful',
                        name:user.name,
                        email
                    })
                }
            })
        }
    })
})

app.listen(3000,()=>{
    console.log('server running')
})
