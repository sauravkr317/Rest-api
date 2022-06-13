import express from 'express';
import {registerController, loginController, userController, refreshController, ProductController} from '../controllers';
import auth from '../middlewares/auth';
import admin from '../middlewares/admin';

const router = express.Router();

router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/me', auth, userController.me);
router.post('/refresh', refreshController.resfresh);
router.post('/logout', auth , loginController.logout);
router.post('/products', [auth, admin], ProductController.store);
router.put('/products/:id', [auth, admin], ProductController.update);
router.delete('/products/:id', [auth, admin], ProductController.delete);
router.get('/products', ProductController.getAll);
router.get('/products/:id', ProductController.getSingleproduct);

export default router;