import express from "express";
import userController from "../controllers/userControllers.js";

const router=await express.Router()

router.post('/register',userController.register_user)
router.post('/login',userController.login_user)
router.post('/account/verify-email',userController.verify_email)

export default router