import multer from 'multer';
import __dirname from '../libs/dirname.js';
import path from 'path';

const ruta = path.resolve(__dirname, '../uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, ruta);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName)
    }
});

const upload = multer({ storage });
export default upload;