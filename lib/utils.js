import fs from 'fs'
import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes';

const saltRounds = 10;


async function genarate_hash(password){
    try{
        const result = await bcrypt.hash(password,saltRounds)
        return result
    }catch(err){
        console(err.message)
    }
    
   
}

async function validPassword(password,storeHash){
    const compare = await bcrypt.compare(password,storeHash)
    return compare
    
       
    
}

const isAuthentication =async(req,res,next)=>{
    console.log(req.session,req.user)
    //cach 1
    // if(req.isAuthenticated()){
    //     next()
    // }else(
    //     res.status(StatusCodes.UNAUTHORIZED).send(StatusCodes[StatusCodes.UNAUTHORIZED])
    // )

    //cach 2 
    if(req.user!=null){
        next()
    }else{
        res.status(StatusCodes.UNAUTHORIZED).send(StatusCodes[StatusCodes.UNAUTHORIZED])
    }
   
   
}
const isAd =(req,res,next)=>{
    console.log(req.session,req.user)
    if(req.isAuthenticated() && req.user.Admin){
        next()
    }else{
        res.send("you are not allowed to this route")
    }
}

export const genPassword =genarate_hash
export const verifyPassword =validPassword
export const isAuthen =isAuthentication
export const isAdmin =isAd
