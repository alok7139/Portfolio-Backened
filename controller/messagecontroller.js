import { catchasyncerror } from "../middlewares/catchasyncerror.js";
import ErrorHandler from "../middlewares/error.js";
import { Message } from "../models/messageSchema.js";

export const sendmessage = catchasyncerror(async(req,res,next) => {
    const{name , subject,message} = req.body;

    if(!name || !subject  || !message){
        return next(new ErrorHandler("Please provide full details" , 400));
    }

    const data = await Message.create({name,subject,message});

    res.status(200).json({
        success:true,
        message: "message sent",
        data,
    })
});

export const getallmessage = catchasyncerror(async(req,res,next) => {
    const messages = await Message.find();
    res.status(200).json({
        success:true,
        messages,
    })

})

export const deletemessage = catchasyncerror(async(req,res,next) => {
    const {id} = req.params;
    const message = await Message.findById(id);
    if(!message){
        return next(new ErrorHandler("Message already deleted" , 400));
    }
    await message.deleteOne();
    res.status(200).json({
        success:true,
        message: "Message deleted Successfully !"
    });
})
