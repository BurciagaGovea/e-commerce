import bodyParser from 'body-parser';
import express from "express";
import emailRoutes from "./routes/emailRoute.js";
import { consumeUserCreated, consumeForgotPassword } from './services/rabbitServiceListener.js';

const app = express();

app.use(bodyParser.json());
app.use('/api/email', emailRoutes);

consumeUserCreated().catch((err) => {
    console.error('Error_', err );
});

consumeForgotPassword().catch((err) => {
    console.error('Error_', err );
});

export default app;
