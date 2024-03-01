
import { StatusCodes } from "http-status-codes"

function errorHandler(err,req,res,next){
    // const responError={
    //     StatusCode :err.StatusCodes || StatusCodes.INTERNAL_SERVER_ERROR,
    //     message:err.message || StatusCodes[StatusCodes.INTERNAL_SERVER_ERROR],
    //     stack:err.stack
    // }
    if(err)
        res.json({msg:"troi oi la troi"})

}
export const middleware =errorHandler