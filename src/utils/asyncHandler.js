const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{
        Promise
        .resolve(
             requestHandler(req,res,next)
        )
        .catch((error)=>next(error))
    }
}
export {asyncHandler}



 /* const asyncHandler=(fn)=>async(req,res,next)=>{     try{
        await fn(req,res,next)
    }
    catch(error){
        res.status(error.code || 500).json({
            success:false,
            message:error.message
       })
    }
} */  //asyncHandler is a higher order function i.e a function that can accept function as parameter as wel as return a function i.e treats a funtcion just like a variable
/*this can also be said as a function within a function
can also be written as
const asyncHandler=()=>{()=>{}}*/