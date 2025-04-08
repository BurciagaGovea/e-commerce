import expresss from "express";
import { getUsers, getUserById, createUser, deleteUser, login, forgotPassword } from "../controllers/userController.js";


const router = expresss.Router();

router.get('/users', getUsers);

router.get('/user/:id', getUserById);

router.post('/create', createUser);

router.post('/login', login);

router.post('/forgot_password', forgotPassword);

router.put('/delete/:id', deleteUser);

export default router;