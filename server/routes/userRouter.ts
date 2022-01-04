import express from 'express';
import authCtrl from '../controllers/authCtrl';
import userCtrl from '../controllers/userCtrl';
import auth from '../middleware/auth'
import { validateRegister } from '../middleware/valid';

const router = express.Router()

router.patch('/user', auth, userCtrl.updateUser)
router.patch('/reset_password', auth, userCtrl.resetPassword)

export default router