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
            
        },
        subject:
        {
            required:true,
            type:String,
            
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
const attendanceSchema=new mongoose.Schema(
    {
        uid:
        {
            required:true,
            type:String
        },
        subject:
        {
            required:true,
            type:String
        },
        section:
        {
            required:true,
            type:String
        },
        values:
        {
            required:true,
            type:Array
        },
        date:
        {
            type:Date,
            required:true
        }
    }
)
const registerModel=mongoose.model('registerModel',registerSchema)
const attendanceModel=mongoose.model('attendanceModel',attendanceSchema)
const classModel=mongoose.model('classModel',classSchema)
const studentModel=mongoose.model('studentModel',studentSchema,'bz')

module.exports={studentModel:studentModel,registerModel:registerModel,classModel:classModel,attendanceModel:attendanceModel}