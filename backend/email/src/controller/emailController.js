// import transporter from "../config/emailConfig.js";
// import dotenv from 'dotenv';

// import fs from 'fs';
// import path from 'path';

// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const htmlFilePath = path.join(__dirname,'..', 'templates', 'hola.html');

// dotenv.config();

// export const sendEmail = async (req, res) => {
//     const { to, subject, text } = req.body;
//     try {
//         await transporter.sendMail({
//             from: process.env.EMAIL_USER,
//             to,
//             subject,
//             text
//         });
//         return res.json({ message: 'Correo enviado con éxito'});
//     } catch (error) {
//         return res.status(500).json({ error: error.message});
//     }
// };

// export const sendFeo = async (req, res) => {
//     const { to, subject, nombre } = req.body;
//     try {
//         // Leer el archivo HTML
//         let htmlTemplate = fs.readFileSync(path.join(__dirname,'..', 'templates', 'hola.html'), 'utf8');

//         // Reemplazar variables en la plantilla
//         htmlTemplate = htmlTemplate.replace('{{nombre}}', nombre);

//         await transporter.sendMail({
//             from: process.env.EMAIL_USER,
//             to,
//             subject,
//             html: htmlTemplate
//         });

//         return res.json({ message: 'Correo enviado con éxito' });

//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };

// export const sendEmailPers = async (req, res) => {
//     const { to, subject, title, message } = req.body;
//     try {
//         await transporter.sendMail({
//             from: process.env.EMAIL_USER,
//             to,
//             subject,
//             template: 'email',
//             context: {
//                 subject,
//                 title,
//                 message
//             }
//         });
//         return res.json({ message: 'Correo enviado con éxito' });
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };
