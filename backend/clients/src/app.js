import express from "express";
import bodyParser from "body-parser";
import router from "./routes/clientRoutes.js";

const app = express();
app.use(bodyParser.json());

app.use('/api/clients', router);

export default app;