import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:[2,"Name must contain atleast 2 character!"],
    },
    subject:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required:true,
        minLength:[5,"Message must conatin atleast 50 words!"],
    },
    createdAt:{
        type:Date,
        default: Date.now(),
    },
})

export const Message = mongoose.model("Message" , messageSchema);
