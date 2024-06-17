import express from 'express';
import { register , login , logout ,getuser , updateprofile , updatepassword , getuserforportfolio , forgotpassword , resetpassword} from '../controller/usercontroller.js';
import { isauthenticated } from '../middlewares/auth.js';


const router = express.Router();

router.post('/register' , register);
router.post('/login' , login);
router.get('/logout' ,isauthenticated, logout);
router.get('/get/user' ,isauthenticated, getuser);
router.put('/update/profile' ,isauthenticated, updateprofile);
router.put('/update/password' ,isauthenticated, updatepassword);
router.get('/portfolio' , getuserforportfolio);
router.post('/forget/password' , forgotpassword);
router.post('/reset/password/:token' , resetpassword);

export default router;