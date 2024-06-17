import app from "../app.js";
import { catchasyncerror } from "../middlewares/catchasyncerror.js";
import ErrorHandler from "../middlewares/error.js";
import { SoftwareApplication } from "../models/softwareSchema.js";
import {v2 as cloudinary} from 'cloudinary'


export const addnewapplication = catchasyncerror(async(req,res,next) => {
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("icon is required!") , 400);
    }

    const {svg} = req.files;
    const {name} = req.body;

    if(!name){
        return next(new ErrorHandler("Application name is required!" , 400))
    }

    const cloudinaryResponsesvg = await cloudinary.uploader.upload(
        svg.tempFilePath,
        {folder : "APPLICATION_ICON"}
    );

    if(!cloudinaryResponsesvg || cloudinaryResponsesvg.error){
        console.error("cloudinary error" ,  cloudinaryResponsesvg.error || "unknown cloudinary error")
    }

    const softwareapplication = await SoftwareApplication.create({
        name,
        svg:{
            public_id: cloudinaryResponsesvg.public_id,
            url: cloudinaryResponsesvg.secure_url,
        }
    })
    res.status(201).json({
        success:true,
        message: "Application added",
        softwareapplication,
    })
})

export const deleteapplication = catchasyncerror(async(req,res,next) => {
    const {id} = req.params;
    
    const softwareapplication = await SoftwareApplication.findById(id);
    if(!softwareapplication){
        return next(new ErrorHandler("Application not found!" , 404));
    }

    const applicationsvgid = softwareapplication.svg.public_id;
    await cloudinary.uploader.destroy(applicationsvgid);
    await softwareapplication.deleteOne();
    res.status(200).json({
        success:true,
        message: "Application deleted!"
    })
})

export const getallapplication = catchasyncerror(async(req,res,next) => {
    const softwareapplication = await SoftwareApplication.find();

    res.status(200).json({
        success:true,
        softwareapplication,
    })
})