import express from "express";
import { isauthenticated } from "../middlewares/auth.js";
import {posttimeline , deletetimeline , getalltimeline}  from '../controller/timelinecontroller.js'

const router = express.Router();

router.post('/add' , isauthenticated , posttimeline);
router.get('/getall' , getalltimeline);
router.delete('/delete/:id' , isauthenticated , deletetimeline);



export default router;