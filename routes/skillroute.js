import express from "express";
import { deleteskill , getallskill , updateskill , addnewskill } from "../controller/skillcontroller.js";
import { isauthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post('/add' , isauthenticated ,  addnewskill)
router.delete('/delete/:id' , isauthenticated , deleteskill)
router.put('/update/:id' , isauthenticated, updateskill)
router.get('/get' ,  getallskill)

export default router;