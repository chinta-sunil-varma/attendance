const mongoose = require('mongoose');

const studentSchema=new mongoose.Schema(
    {
        ID:
        {
            type:Number,
            required:true
        },
        NAME:
        {
            type:String,
            required:true
        }
    }
)
const registerSchema=new mongoose.Schema(
    {
        firstName:
        {
            type:String,
            required:true,
            unique:true
            
        },
        lastName:
        {
            type:String,
            required:true,
            unique:true
        },
        uid:
        {
            type:String,
            required:true,
            unique:true
        },
        email:
        {
            type:String,
            required:true,
            unique:true
        },
        password:
        {
            type:String,
            required:true,
            unique:true
        }
    }
)
const classSchema=new mongoose.Schema(
    {
        class:
        {
            required:true,
            type:String,
            unique:true
        },
        uid:
        {
            required:true,
            type:String,
            
        },
        data:
        {
            required:true,
            type:Array,
            
        },
    }
)
const registerModel=mongoose.model('registerModel',registerSchema)
const classModel=mongoose.model('classModel',classSchema)
const studentModel=mongoose.model('studentModel',studentSchema,'bz')

module.exports={studentModel:studentModel,registerModel:registerModel,classModel:classModel}