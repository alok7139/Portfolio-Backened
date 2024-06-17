import mongoose from 'mongoose'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import crypto from 'crypto'


const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:[true, "Name required"],
    },
    email:{
        type:String,
        required:[true,"Email required"],
    },
    phone:{
        type:String,
        required:[true,"Phone number required"],
    },
    aboutMe:{
        type:String,
        required:[true, "This is required"],
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minLength: [ 5,"Password must contain at least 6 characters"],
        select:false,
    },
    avatar:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        },
    },
    resume:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        },
    },
    portfolioURL:{
        type:String,
        required:[true, "Portfolio URL is required!"],
    },

    githubURL:{
        type:String,
    },
    resumeURL:{
        type:String,
    },
    instagramURL:{
        type:String,
    },
    linkdinURL:{
        type:String,
    },
    leetcodeURL:{
        type:String,
    },

    resetpasswordtoken: {
        type:String,
    },
    resetpasswordexpire:{
        type:Date,
    },


    
});

userSchema.pre("save" , async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password , 10);
});

userSchema.methods.comparepassword = async function(enterpassword){
    return await bcrypt.compare(enterpassword,this.password);
}

userSchema.methods.generatejsonwebtoken = function() {
    return jwt.sign({id: this._id} , process.env.JWT_SECRET_KEY , {
        expiresIn: process.env.JWT_EXPIRES,
    });
}

userSchema.methods.getresetpasswordtoken =  function(){
    const resettoken = crypto.randomBytes(20).toString("hex");

    this.resetpasswordtoken = crypto.createHash("sha512").update(resettoken).digest("hex");

    this.resetpasswordexpire = Date.now() + 15*60*1000;

    return resettoken;
}

 

export const User = mongoose.model("User" , userSchema);