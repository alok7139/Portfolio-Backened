import mongoose from 'mongoose'

const softwareSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    svg:{ // image format
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        },
    },
  
})

export const SoftwareApplication = mongoose.model("SoftwareApplication" , softwareSchema)

