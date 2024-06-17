import express from "express";
import { sendmessage  , getallmessage , deletemessage} from "../controller/messagecontroller.js";
import { isauthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/send" , sendmessage)
router.get("/getall" , getallmessage)
router.delete('/delete/:id' , isauthenticated , deletemessage)

export default router;