import express from "express";
import { getClients, getClientsById, deleteClient, createClient } from "../controllers/clientController.js";

const router = express.Router();

router.get('/clients', getClients);

router.get('/client/:id', getClientsById);

router.put('/delete/:id', deleteClient);

router.post('/create', createClient);

export default router;