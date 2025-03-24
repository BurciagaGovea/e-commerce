import express from "express";
import bodyParser from "body-parser";
import router from "./routes/userRoutes.js";

const app = express();
app.use(bodyParser.json());

app.use("/api/users", router);

export default app;