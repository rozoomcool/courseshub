import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { UPLOAD_PATH } from './config';

dotenv.config();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PATH);
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

export class MulterUtil {

  static async deleteImage(fileUrl: string): Promise<void> {
    try {
      // const filePath = path.join(__dirname, fileUrl.split("/").pop()!);
      const tmp = fileUrl.split("/");
      console.log(tmp);
      const fileName = tmp[tmp.length - 1];
      console.log(`:file:: ${fileName}`)
      const filePath = path.join(UPLOAD_PATH, fileName);
      console.log(`::path:: ${filePath}`)
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
