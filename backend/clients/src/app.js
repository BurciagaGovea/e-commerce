import express from "express";
import bodyParser from "body-parser";
import router from "./routes/clientRoutes.js";
import {sendClient} from "./rabbitmq/consumer.js"

const app = express();
app.use(bodyParser.json());

app.use('/api/clients', router);
sendClient();

export default app;