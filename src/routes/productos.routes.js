import express from 'express';
import {create, getAll, getById, update, deleteProduct, getUserProducts} from '../controllers/productosController.js';
import upload from '../middlewares/upload.js';
import {verifyToken, isAdmin, isModerator, isAdminOrModerator} from '../middlewares/auth.js';
const router = express.Router();

router.post('/', verifyToken, upload.single('image'), create);
router.get('/', getAll);
router.get('/myproducts', verifyToken, getUserProducts);
router.get('/:id', getById);
router.put('/:id', verifyToken, upload.single('image'), update);
router.delete('/:id', verifyToken, deleteProduct);

export default router;