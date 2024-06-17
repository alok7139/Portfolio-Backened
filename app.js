import express from "express";
import { config} from "dotenv";
import cors from 'cors';
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dbconnection from "./database/dbconnection.js";
import { errormiddleware } from "./middlewares/error.js";
import messageroute from './routes/messageroute.js'
import userroute from './routes/userroute.js'
import timelineroute from './routes/timelineroute.js'
import softwareapplicationrouter from './routes/softwareapplicationroute.js'
import skillroute from './routes/skillroute.js'
import projectroute from './routes/projectroute.js'


const app = express();
config({path: './.env'});

app.use(cors({
    origin:[process.env.PORTFOLIO_URL ,process.env.DASHBOARD_URL ],
    methods: ["GET" , "POST" , "PUT" , "DELETE"],
    credentials:true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/",
}));


app.use("/message" , messageroute);
app.use('/user' , userroute);
app.use('/timeline' , timelineroute);
app.use('/application' , softwareapplicationrouter);
app.use('/skill' , skillroute);
app.use('/project' , projectroute);

dbconnection();

app.use(errormiddleware);

export default app;