import express from "express";
import { addproject , updateproject , deleteproject , getallproject,getsingleproject } from "../controller/projectcontroller.js";
import { isauthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post('/add' , isauthenticated , addproject)
router.delete('/delete/:id' , isauthenticated , deleteproject)
router.put('/update/:id' , isauthenticated, updateproject)
router.get('/getall' , getallproject)
router.get('/get/:id' , getsingleproject)

export default router;