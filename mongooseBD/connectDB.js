var mongoose =require('mongoose')

async function connectDB(url){
    try{
        await mongoose.connect(url)
        console.log('Connected was sucessful')
    }catch(err){
        console.log(err.message)
    }
}

module.exports ={connectDB}