import express from "express";
import { isauthenticated } from "../middlewares/auth.js";
import {deleteapplication , getallapplication, addnewapplication} from '../controller/softwarecontroller.js'


const router = express.Router();

router.post('/add' , isauthenticated , addnewapplication)
router.delete('/delete/:id' , isauthenticated , deleteapplication)
router.get('/getall' , getallapplication)


export default router;