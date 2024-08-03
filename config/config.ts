import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const SERVER_URL = process.env.SERVER_URL!;
export const UPLOADS_DIR = process.env.UPLOADS_DIR!;
export const UPLOAD_PATH = path.join(__dirname, "../", UPLOADS_DIR);