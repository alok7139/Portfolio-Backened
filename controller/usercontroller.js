import { User } from "../models/userschema.js";
import ErrorHandler from "../middlewares/error.js";
import { catchasyncerror } from "../middlewares/catchasyncerror.js";
import {v2 as cloudinary} from 'cloudinary'
import { generatetoken } from "../utils/jwttoken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from 'crypto'


export const register = catchasyncerror(async(req,res,next) => {
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Avatar and Resume required!") , 400);
    }

    const {avatar , resume} = req.files;

    const cloudinaryResponseavatar = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {folder : "MY_AVATAR"}
    );

    if(!cloudinaryResponseavatar || cloudinaryResponseavatar.error){
        console.error("cloudinary error" ,  cloudinaryResponseavatar.error || "unknown cloudinary error")
    }

    const cloudinaryResponseresume = await cloudinary.uploader.upload(
        resume.tempFilePath,
        {folder : "MY_RESUME"}
    );

    if(!cloudinaryResponseresume || cloudinaryResponseresume.error){
        console.error("cloudinary error" , cloudinaryResponseresume.error || "unknown cloudinary error")
    }

    const {fullname , email , phone, aboutMe , password , portfolioURL , githubURL , linkdinURL , instagramURL , leetcodeURL,resumeURL} = req.body;

    const user = await User.create({
        fullname , email , phone, aboutMe , password , portfolioURL , githubURL , linkdinURL , instagramURL , leetcodeURL,resumeURL,
        avatar:{
            public_id : cloudinaryResponseavatar.public_id,
            url: cloudinaryResponseavatar.secure_url,
        },
        resume:{
            public_id : cloudinaryResponseresume.public_id,
            url: cloudinaryResponseresume.secure_url,
        }
    });

    // res.status(200).json({
    //     success:true,
    //     message: "user registered successfully",
    //     user,
    // })

    generatetoken(user, "user registered successfully!" , 200 , res);

})

export const login = catchasyncerror(async(req,res,next) => {
    const {fullname , email,password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler("All field's are required!"));
    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("User not registered") , 400);
    }

    const ispasswordmatched = await user.comparepassword(password);
    if(!ispasswordmatched){
        return next(new ErrorHandler("Invalid details!") , 400);
    }

    generatetoken(user , `hello ${user.fullname}` , 200 , res);

})

export const logout = catchasyncerror(async(req,res,next) => {
    res.status(200).cookie("token" , "" , {
        expires: new Date(Date.now()),
        httpOnly:true,
        sameSite: "None",
        secure:true,
    }).json({
        success:true,
        message: "logout successssfully!"
    });

});

export const getuser = catchasyncerror(async(req,res,next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user,
    })
})

export const updateprofile = catchasyncerror(async(req,res,next)=>{
    const newuserdata = {fullname : req.body.fullname , email: req.body.email , phone: req.body.phone , aboutMe : req.body.aboutMe , portfolioURL: req.body.portfolioURL , githubURL : req.body.githubURL, linkdinURL: req.body.linkdinURL , instagramURL: req.body.instagramURL , leetcodeURL: req.body.leetcodeURL,resumeURL : req.body.resumeURL};

    if(req.files && req.files.avatar){
        const avatar = req.files.avatar;
        const user = await User.findById(req.user.id);
        const profileimageid = user.avatar.public_id;
        await cloudinary.uploader.destroy(profileimageid)
        const cloudinaryResponse = await cloudinary.uploader.upload(
            avatar.tempFilePath,
            {folder : "MY_AVATAR"}
        );

        newuserdata.avatar = {
            public_id : cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        }
    }

    if(req.files && req.files.resume){
        const avatar = req.files.resume;
        const user = await User.findById(req.user.id);
        const profileresumeid = user.resume.public_id;
        await cloudinary.uploader.destroy(profileresumeid)
        const cloudinaryResponse = await cloudinary.uploader.upload(
            avatar.tempFilePath,
            {folder : "MY_RESUME"}
        );

        newuserdata.resume = {
            public_id : cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id , newuserdata , {
        new:true,
        runValidators:true,
        useFindAndModify: false,
    })

    res.status(200).json({
        success:true,
        message: `profile updated ${newuserdata.fullname}`,
        user,
    })
})

export const updatepassword = catchasyncerror(async(req,res,next) => {
    const {currentpassword , newpassword , confirmpassword} = req.body;

    if(!confirmpassword || !newpassword || !currentpassword){
        return next(new ErrorHandler("fill all fields!" , 400)
        );
    }

    const user = await User.findById(req.user.id).select("+password");

    const ispasswordmatched =  await user.comparepassword(currentpassword);

    if(!ispasswordmatched){
        return next(new ErrorHandler("Incorrect current password!", 400));
    }

    if(newpassword !== confirmpassword){
        return next(new ErrorHandler("Password not matched" , 400));
    }

    user.password = newpassword;
    await user.save();
    res.status(200).json({
        success:true,
        message: "password updated!",
    })

})

export const getuserforportfolio = catchasyncerror(async(req,res,next) => {
    const id = "6662dfa5f7f5a28b6202e460" ; 
    const user = await User.findById(id);
    res.status(200).json({
        success:true,
        user,
    })
});

export const forgotpassword = catchasyncerror(async(req,res,next) => {
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("user not found!",404));
    }

    const resettoken = user.getresetpasswordtoken();

    await user.save({validateBeforeSave:false});

    const resetpasswordURL = `${process.env.DASHBOARD_URL}/password/reset/${resettoken}`;

    const message = `Your reset password URL is: \n\n ${resetpasswordURL} \n\n Valid for one time use  \n\n valid upto 15 minutes \n\n if you've not request for then ignore it..`

    try{
        await sendEmail({
            email:user.email,
            subject: "portfolio recovery password",
            message,
        });
        res.status(200).json({
            success:true,
            message: `email sent to ${user.email} successfully!`
        })
    }catch(error){
        user.resetpasswordexpire = undefined;
        user.resetpasswordtoken = undefined;

        await user.save();
        return next(new ErrorHandler(error.message , 500))
    }
})

export const resetpassword = catchasyncerror(async(req,res,next) => {
    
    const {token} = req.params;

    const resetpasswordtoken = crypto.createHash("sha512").update(token).digest("hex");

    const user = await User.findOne({
        resetpasswordtoken,
        resetpasswordexpire : {$gt : Date.now()},

    })
    if(!user){
        return next(new ErrorHandler("URL is valid upto 15 minutes or use only once" ,  400));
    }
    if(req.body.password !== req.body.confirmpassword){
        return next(new ErrorHandler("password and confirm password not matched!", 400));
    }

    user.password = req.body.password;

    user.resetpasswordtoken= undefined;
    user.resetpasswordexpire=undefined;

    await user.save();

    generatetoken(user, "password reset successfully!" , 200 , res);
})