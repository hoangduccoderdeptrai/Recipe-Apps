const { default: axios } = require("axios")

var {recipeAsian,recipeFrench} =require('../model/scheme.js')

const homepage =async(req,res)=>{


    res.render('index',{
        title:'Cook.io|Cooking made easy.',
        description:'page description',
        css:'/css/style.css',
        js:'/home.js'
    })
}
const recipes= async(req,res)=>{
    
    // const url ='https://api.edamam.com/search?q=chicken&app_id=e01c42d8&app_key=19a34826099c7e0c9666127afe12981b'
    // const response = await axios.get(url)
    // console.log(response.data)

    const query =req.query
    console.log(query)
    res.render('recipes',{
        title:'Recipes|Cooking made easy.',
        description:'page recipes',
        css:'/css/style.css',
        js:'/recipes.js'
    })
}
const detail =(req,res)=>{
    res.render('detail',{
        title:'Cook.io|Detail',
        description:'detail page',
        css:'/css/style.css',
        js:'/detail.js'
    })
}
const saved =(req,res)=>{
    res.render('saved',{
        title:'Saved-Recipes|Cooking made easy',
        description:'page saved-recipe',
        css:'/css/style.css',
        js:'/saved.js'
    })
}

const recipeasiaAPI =async(req,res)=>{
    const data = await recipeAsian.find({})
    res.status(200).json(data)
}
const recipefrenchAPI = async(req,res)=>{
    const data =await recipeFrench.find({})
    res.status(200).json(data)
}

const getSubmit =async(req,res)=>{
    // const infoErrorObj =req.flash('infoErrors')
    // const infoSubmitObj =req.flash('infoSubmit')
    res.render('submitPage',{
        title:'submit Page|Cooking make easy',
        css:'/css/style.css',
        js:'/submitPage.js'
        // infoErrorObj,
        // infoSubmitObj

    })
}
const postSubmit =async(req,res)=>{
    try{

        const data = new recipeAsian({
            image:`http://localhost:3000/images/${req.file.filename}`,
            label:"toi la con cho nha ho tran",
            totalTime:4,
            uri:'odaydeocouri'


        })
        await data.save()
        console.log(req.body,req.file)
        res.status(200).send(req.body)
        
       
        // // req.flash('infoSubmit',"Your data has been created")
        // res.redirect('submit')
    }catch(err){
      
        // req.flash('infoErrors',err.message)
        // res.redirect('submit')
        res.send(err.message)
    }
   
}
//--------------INSERT DUMMY DATA INTO recipeASIAN TABLE AND recipeFRENCH table
// always get recipe api into mongoose because img url has been set to expire
async function inSertRecipesASIAN(){
    await recipeAsian.deleteMany({})
    await recipeFrench.deleteMany({})
    try{
        
        for(let i=0;i<2;i++){
            let uri=''
            if(i==0){
                uri ='https://api.edamam.com/api/recipes/v2?app_id=e01c42d8&app_key=19a34826099c7e0c9666127afe12981b&type=public&q=asian'
            }else{
                uri ='https://api.edamam.com/api/recipes/v2?app_id=e01c42d8&app_key=19a34826099c7e0c9666127afe12981b&type=public&q=french'
            }
            const array =[]
            const getRecipesASIAN =await axios.get(uri)
            // console.log(getRecipesASIAN.data.hits)
            const data =getRecipesASIAN.data.hits
           
            for(let j=0;j<data.length;j++ ){
                const {recipe:{
                    uri,label,image,totalTime
                }} =data[j]
               
               
                array.push({image,label,totalTime,uri})
                
            }
            if(i==0){
                
                await recipeAsian.insertMany(array)
            }
            else await recipeFrench.insertMany(array)
        }
        

    }catch(err){
        console.log(err.message)
    }
}
//inSertRecipesASIAN()



module.exports ={homepage,recipes,detail,saved,recipeasiaAPI,recipefrenchAPI,getSubmit,postSubmit}