var express=require('express')
var {recipeAsian,recipeFrench} =require('../model/scheme.js')
var {homepage,recipes,detail,saved,recipeasiaAPI,recipefrenchAPI,getSubmit,postSubmit} =require('../controller/home.controller')
const ROUTER =express.Router()
var multer =require('multer')
var storage =multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,__dirname+'/uploads')
    },
    filename:function(req,file,callback){
        callback(null,file.originalname)
    }
})

const uploads =multer({storage:storage})

//get login
ROUTER.route('/')
.get(homepage)

ROUTER.route('/recipes')
.get(recipes)

ROUTER.route('/detail')
.get(detail)

ROUTER.route('/saved-recipes')
.get(saved)

ROUTER.route('/recipeasianAPI')
.get(recipeasiaAPI)

ROUTER.route('/recipefrenchAPI')
.get(recipefrenchAPI)

ROUTER.route('/submit')
.get(getSubmit)

ROUTER.route('/submit',)
.post(uploads.single('image'),postSubmit)


ROUTER.route('/v/:uri').get(async(req,res)=>{
    try{
        const uri =req.params.uri
        const data = await recipeAsian.findOne({uri:uri})
        res.json(data)
    }catch(err){
        res.status(404)
        console.log(err.message)
    }
   
})

ROUTER.route('/v/exam/y').get(async(req,res)=>{
    try{
        const data =await recipeAsian.find({totalTime:0}).sort({_id:-1}).select('label').limit(4)
        res.status(200).json(data)
    }catch(err){
        res.send(err.message)
    }
    
})
module.exports={ROUTER}