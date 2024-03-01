// import mongoose from "mongoose";
var mongoose =require('mongoose')


// const user = new mongoose.Schema({
//     username:{
//         type:String,
//         required:true
//     },
//     hash:{
//         type:String
//     },
//     Admin:{
//         type:Boolean,
//         default:true
//     }
    
// })


// export const User=mongoose.model('Board',user)

const Recipes =new mongoose.Schema({
    image:{
        type:String,
        required:'this field is required'
    },
    label:{
        type:String,
        required:'this field is required'
    },
    totalTime:{
        type:Number,
        required:'this field is required'
    },
    uri:{
        type:String,
        required:'this field is required'
    }
})

const recipeAsian =mongoose.model('recipeAsian',Recipes)
const recipeFrench =mongoose.model('recipeFrench',Recipes)

module.exports ={recipeAsian,recipeFrench}