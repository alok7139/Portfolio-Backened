class ErrorHandler extends Error{
    constructor(message,statuscode){
        super(message);
        this.statuscode = statuscode;
    }
}

export const errormiddleware = (err,req,res,next) => {
    err.message = err.message || "internal server error",
    err.statuscode = err.statuscode || 500;

    if(err.name === "CastError"){
       const message  = `Invalid ${err.path}`
       err = new ErrorHandler(message,400);
    }
    
    // database error
    if(err.code === 11000){ 
        const message  = `Duplicate ${Object.keys(err.keyValue)} enter`
        err = new ErrorHandler(message,400);
    }

     if(err.name === "JsonWebTokenError"){
        const message = "Json web Token is Invalid, Try again!";
        err = new ErrorHandler(message,400);
        
    }
    if(err.name === "JsonWebExpiredError"){
        const message = "Json web Token is Expired, Try again!";
        err = new ErrorHandler(message,400);
    }

    const errormessage = err.errors ? Object.values(err.errors)
    .map(error => error.message).join(" ") : err.message;

    return res.status(err.statuscode).json({
        success:false,
        message:errormessage,
    })
}


export default ErrorHandler;