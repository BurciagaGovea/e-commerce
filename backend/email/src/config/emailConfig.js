import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

import path from 'path';
import hbs from 'nodemailer-express-handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const templatePath = path.resolve(__dirname, '../templates');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

const handlebarOptions = {
    viewEngine: {
        extName: ".hbs",
        partialsDir: templatePath,
        defaultLayout: false,
    },
    viewPath: templatePath,
    extName: ".hbs",
};

transporter.use('compile', hbs(handlebarOptions));

export default transporter;
