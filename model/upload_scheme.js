import mongoose from "mongoose";

const file = new mongoose.Schema({
    path:{
        type:String,
        required:true
    },
    originalName:{
        type:String,
        required:true
    },
    password:{
        type:String
    },
    downLoad:{
        type:Number,
        required:true,
        default:0
    }
    
})

export const File =mongoose.model('files',file)