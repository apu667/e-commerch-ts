import multer from "multer"
import { v4 as uuidv4 } from 'uuid';
import path from "path";
import fs from "fs";

const imageDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imageDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueSuffix)
    }
})

export const upload = multer({ storage: storage })