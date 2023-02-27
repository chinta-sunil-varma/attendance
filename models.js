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

module.exports=mongoose.model('studentModel',studentSchema,'it2')