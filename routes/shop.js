const path = require('path');
const express = require('express');
const shopController = require('../controllers/shop');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProductDetails);
router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);
router.post('/cart-increase-item', isAuth, shopController.postCartIncreaseItem);
router.post('/cart-decrease-item', isAuth, shopController.postCartDecreaseItem);
router.post('/create-order', isAuth, shopController.postOrder);
router.get('/orders', isAuth, shopController.getOrders);
// router.get('/checkout', shopController.getCheckout);

module.exports = router;
