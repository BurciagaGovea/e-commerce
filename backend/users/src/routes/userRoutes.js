import expresss from "express";
import { getUsers, getUserById, createUser, deleteUser } from "../controllers/userController.js";

const router = expresss.Router();

router.get('/users', getUsers);

router.get('/user/:id', getUserById);

router.post('/create', createUser);

router.put('/delete/:id', deleteUser);

export default router;