import fs from 'fs';
import { google } from 'googleapis';

//Las cosas de drive __________________________________
const drive_apikeys = JSON.parse(fs.readFileSync('./drive_storage.json', 'utf-8'));
const SCOPE = ["https://www.googleapis.com/auth/drive"];

async function authorize(){
    const jwtClient = new google.auth.JWT(
        drive_apikeys.client_email,
        null,
        drive_apikeys.private_key,
        SCOPE
    );

    await jwtClient.authorize();
    return jwtClient;
}

//______________________________Upload Image________________________________

export async function uploadImage(file) {  
    return new Promise((resolve, reject) => {
        authorize().then(authClient => {
            const drive = google.drive({version:'v3', auth: authClient});

            var fileMetaData = {
                name: file.originalname,
                parents: ["1XrfFySjnQgaqE7hfGP_Jh89infQiYuqS"]
            };

            const media = {
                body: fs.createReadStream(file.path),
                mimeType: file.mimetype
            };

            drive.files.create({
                resource: fileMetaData,
                media: media,
                fields: 'id'
            }, (err, file) => {
                if (err) return reject(err);
                const fileUrl = `https://drive.google.com/uc?id=${file.data.id}`;
                resolve(fileUrl);
            });
        }).catch(error => reject(error));
    });
}
