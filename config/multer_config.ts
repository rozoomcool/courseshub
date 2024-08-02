import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const SERVER_URL = process.env.SERVER_URL;
const UPLOADS_DIR = process.env.UPLOADS_DIR;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + `/../${UPLOADS_DIR}`);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png|gif|mp4|avi|mov|mkv/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      return cb(null, true);
    } else {
      cb(Error('Error: Images and Videos only!'));
    }
  }
});

const imageFileFilter = (req: any, file: any, cb: any) => {
  
  if(file.mimetype === "image/png" || 
  file.mimetype === "image/jpg"|| 
  file.mimetype === "image/jpeg"){
      cb(null, true);
  }
  else{
      cb(null, false);
  }
}

export class MulterUtil {

  static async deleteImage(fileUrl: string): Promise<void> {
    try {
      // const filePath = path.join(__dirname, fileUrl.split("/").pop()!);
      const filePath = path.join(...fileUrl.split("/").slice(1));
      if(fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Failed to delete old avatar: ${err.message}`);
          }
        });
      }
    } catch(e) {
      console.log(e);
      // throw Error(":: MulterUtil - Failed to delete file");
    }
  }
}

export default upload;
