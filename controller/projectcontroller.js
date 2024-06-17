import { Project } from "../models/projectSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { catchasyncerror } from "../middlewares/catchasyncerror.js";
import {v2 as cloudinary} from 'cloudinary'


export const addproject = catchasyncerror(async(req,res,next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("All Fields Required!", 404));
    }

    const {projectBanner} = req.files;
    const { title,
        description,
        gitrepolink,
        projectLink,
        stack,
        technologies,
        deployed,} = req.body;

    if(!title ||
        !description ||
        !gitrepolink ||
        !stack ||
        !technologies ||
        !deployed){
            return next(new ErrorHandler("provide full details!", 404));
        }

        const cloudinaryresponse = await await cloudinary.uploader.upload(
             projectBanner.tempFilePath,
             {folder: "project_image"},
        )

        if (!cloudinaryresponse || cloudinaryresponse.error) {
            console.error(
              "Cloudinary Error:",
              cloudinaryresponse.error || "Unknown Cloudinary error"
            );
            return next(new ErrorHandler("Failed to upload image to Cloudinary", 500));
        }

        const project = await Project.create({
            title,
            description,
            gitrepolink,
            projectLink,
            stack,
            technologies ,
            deployed,
            projectBanner:{
                public_id : cloudinaryresponse.public_id,
                url: cloudinaryresponse.secure_url,
            }
             
        })
        res.status(201).json({
            success:true,
            message: "project added!",
            project,
        })
       
})

export const updateproject = catchasyncerror(async(req,res,next) => {
      const newprojects = {
        title: req.body.title,
        description: req.body.description,
        stack: req.body.stack,
        technologies: req.body.technologies,
        deployed: req.body.deployed,
        projectLink: req.body.projectLink,
        gitrepolink: req.body.gitrepolink,
      }

      if(req.files && req.files.projectBanner){
        const projectBanner = req.files.projectBanner;
        const project = await Project.findById(req.params.id);
        const profilebannerid = project.projectBanner.public_id;
        await cloudinary.uploader.destroy(profilebannerid)
        const cloudinaryResponse = await cloudinary.uploader.upload(
            projectBanner.tempFilePath,
            {folder : "project_image"}
        );

        newprojects.projectBanner = {
            public_id : cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        }
    }

    const project = await Project.findByIdAndUpdate(req.params.id , newprojects , {
        new :true,
        runValidators:true,
        useFindAndModify: false,
    })
    res.status(200).json({
        success:true,
        message:"project updated",
        project,
    })


})

export const deleteproject = catchasyncerror(async(req,res,next) => {
    const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    return next(new ErrorHandler("Already Deleted!", 404));
  }
  const projectImageId = project.projectBanner.public_id;
  await cloudinary.uploader.destroy(projectImageId);
  await project.deleteOne();
  res.status(200).json({
    success: true,
    message: "Project Deleted!",
  });
})

export const getallproject = catchasyncerror(async(req,res,next) => {
    const projects = await Project.find();
    res.status(200).json({
        success:true,
        projects,
    })
})

export const getsingleproject = catchasyncerror(async(req,res,next) => {
    const {id} = req.params;
    try {
        const project = await Project.findById(id);
        res.status(200).json({
            successs:true,
            project,
        })
    } catch (error) {
        res.status(400).json({
            error,
        })
    }
})
