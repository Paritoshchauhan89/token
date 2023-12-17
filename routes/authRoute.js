import express from 'express'
import {registercontroller, logincontroller, testcontroller,getAllUsers,getUserByIdController,updateUserController, deleteUserController, isAdmin} from '../controllers/authController.js'
import { requireSignIn } from "../middlewares/authMiddleware.js";

// router object
const router = express.Router()

// routing

router.post('/register',registercontroller);
router.post('/login',logincontroller);
router.get('/all-users',getAllUsers);
router.get('/get-user/:id', getUserByIdController);
router.put('/edit-user/:id',updateUserController)
router.delete('/delete-user/:id', deleteUserController);

// test routes
router.get('/test',requireSignIn,isAdmin, testcontroller);

export default router