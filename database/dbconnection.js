import mongoose from "mongoose";

const dbconnection = () => {
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"Portfolio"
    }).then(() => {
        console.log(`connected to database`);
    }).catch((error) => {
        console.log(`some error occured ${error}`)
    })
}

export default dbconnection;