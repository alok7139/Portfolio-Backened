import { Skill } from "../models/skillSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { catchasyncerror } from "../middlewares/catchasyncerror.js";
import {v2 as cloudinary} from 'cloudinary'

export const addnewskill = catchasyncerror(async(req,res,next) => {
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("All field required!") , 400);
    }

    const {svg} = req.files;
    const {title,proficiency} = req.body;

    if(!title || !proficiency){
        return next(new ErrorHandler("All field required!" , 400))
    }

    const cloudinaryResponsesvg = await cloudinary.uploader.upload(
        svg.tempFilePath,
        {folder : "SKILL_ICON"}
    );

    if(!cloudinaryResponsesvg || cloudinaryResponsesvg.error){
        console.error("cloudinary error" ,  cloudinaryResponsesvg.error || "unknown cloudinary error")
    }

    const skill = await Skill.create({title , proficiency ,
        svg:{
            public_id: cloudinaryResponsesvg.public_id,
            url: cloudinaryResponsesvg.secure_url,
        }
    })
    res.status(200).json({
        success:true,
        message: "Skill Added successfully",
        skill,
    })
})

export const deleteskill = catchasyncerror(async(req,res,next) => {
    const {id} = req.params;
    
    const skill = await Skill.findById(id);
    if(!skill){
        return next(new ErrorHandler("skill not found!" , 404));
    }

    const skillsvgid = skill.svg.public_id;
    await cloudinary.uploader.destroy(skillsvgid);
    await skill.deleteOne();
    res.status(200).json({
        success:true,
        message: "skill deleted!"
    })
})

export const updateskill = catchasyncerror(async(req,res,next) => {
    const {id} = req.params;
    
    let skill = await Skill.findById(id);
    if(!skill){
        return next(new ErrorHandler("skill not found!" , 404));
    }
    const {proficiency} = req.body;
    skill = await Skill.findByIdAndUpdate(id , {proficiency} , {
        new:true,
        runValidators:true,
        useFindAndModify : false,
    })
    res.status(200).json({
        success:true,
        message: "skill updated",
        skill
    })
})

export const getallskill = catchasyncerror(async(req,res,next) => {
    const skills = await Skill.find();
    res.status(200).json({
        success:true,
        skills,
    })
})
