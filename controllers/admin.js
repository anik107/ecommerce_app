const ProductService = require('../services/productService');
const { AppError } = require('../middleware/error-handler');
const logger = require('../config/logger');

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = catchAsync(async (req, res, next) => {
    const { title, imageUrl, description, price } = req.body;

    await ProductService.createProduct(req.user.id, {
        title,
        imageUrl,
        description,
        price
    });

    logger.info('Product created successfully');
    res.redirect('/admin/products');
});

exports.getEditProduct = catchAsync(async (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }

    const prodId = req.params.productId;
    const product = await ProductService.getProductById(prodId, req.user.id);

    res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
    });
});

exports.postEditProduct = catchAsync(async (req, res, next) => {
    const { productId, title, imageUrl, description, price } = req.body;

    await ProductService.updateProduct(productId, req.user.id, {
        title,
        imageUrl,
        description,
        price
    });

    logger.info('Product updated successfully');
    res.redirect('/admin/products');
});

exports.postDeleteProduct = catchAsync(async (req, res, next) => {
    const prodId = req.params.productId;

    await ProductService.deleteProduct(prodId, req.user.id);

    logger.info('Product deleted successfully');
    res.redirect('/admin/products');
});

exports.getProducts = catchAsync(async (req, res, next) => {
    const products = await ProductService.getProductsByUser(req.user.id);

    res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
    });
});
