const path = require('path');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const { validateProduct } = require('../middleware/validation');

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', isAuth, validateProduct, adminController.postAddProduct);

// /admin/edit-product/:productId => GET
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, validateProduct, adminController.postEditProduct);

router.post('/delete-product/:productId', isAuth, adminController.postDeleteProduct);

module.exports = router;
