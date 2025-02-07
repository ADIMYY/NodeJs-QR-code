import express from 'express';
import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import fs from 'fs';
import QRCode from 'qrcode';

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, 'config.env') });

const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
});


async function generateAndUploadQrcode(data, fileName) {
    try {
        const tempDir = join(__dirname, 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }
        // Generate QR code and save it locally
        const filePath = join(tempDir, `${fileName}.png`);
        await QRCode.toFile(filePath, data);

        console.log('QR code generated and saved locally:', filePath);

        // Upload the QR code to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
        folder: 'qr_codes', // Optional: specify a folder in Cloudinary
        public_id: fileName, // Optional: specify a public ID
        });

        console.log('QR code uploaded to Cloudinary:', result.secure_url);

        // Delete the local file after upload
        fs.unlinkSync(filePath);
        console.log('Local file deleted.');

        return result.secure_url;
    } catch (error) {
        console.error('Error generating or uploading QR code:', error);
        throw error;
    }
}

app.get('/', async (req, res) => {
    const data = JSON.stringify(req.body);
    const fileName = `qr-code-${Date.now()}`;

    try {
        const qrcodeUrl = await generateAndUploadQrcode(data, fileName);
        res.status(200).json({qrcodeUrl});
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
})


// Start server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}!`);
});
