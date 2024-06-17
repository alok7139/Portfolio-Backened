import { catchasyncerror } from "../middlewares/catchasyncerror.js";
import ErrorHandler from "../middlewares/error.js";
import {Timeline} from '../models/timelineSchema.js'

export const posttimeline = catchasyncerror(async(req,res,next) => {
    const {title,description , from , to} = req.body;

    const newtimeline = await Timeline.create({title,description,timeline:{from,to}});

    res.status(200).json({
        success:true,
        message : "Timeline added",
        newtimeline,
    })
})

export const deletetimeline = catchasyncerror(async(req,res,next) => {
    const {id} = req.params;

    const timeline = await Timeline.findById(id);
    if(!timeline){
        return next(new ErrorHandler("Timeline not found!" , 400));
    }
    await timeline.deleteOne();
    res.status(200).json({
        success:true,
        message: "TImeline deleted!",
    })
})

export const getalltimeline = catchasyncerror(async(req,res,next ) => {
    const timeline = await Timeline.find();

    res.status(200).json({
        success:true,
        timeline,
    })
})