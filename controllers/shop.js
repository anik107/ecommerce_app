const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
        res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
        });
    })
    .catch(err => {
        console.error('Error fetching products:', err);
        res.status(500).send('Internal Server Error');
    });
}
exports.getProductDetails = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findAll({ where: { id: prodId }})
  .then(products => {
      res.render('shop/product-detail', {
        product: products[0],
        pageTitle: products[0].title,
        path: '/products'
      })
    })
  .catch(err => {
      console.error('Error fetching product details:', err);
      res.status(500).send('Internal Server Error');
  });
}
exports.getIndex = (req, res, next) => {
  Product.findAll()
  .then(products => {
      res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
      });
  })
  .catch(err => {
      console.error('Error fetching products:', err);
      res.status(500).send('Internal Server Error');
  });
}
exports.getCart = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }

  req.user.getCart()
    .then(cart =>{
      return cart.getProducts()
        .then(products =>{
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
          });
        })
        .catch(err =>{
          console.log(err);
        })
    })
    .catch(err =>{
      console.log(err);
    });
}
exports.postCart = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }

  const prodId = req.body.productId;
  const quantity = parseInt(req.body.quantity) || 1; // Get quantity from form
  let fetchedCart;
  let newQuantity = quantity;
  req.user.getCart()
    .then(cart =>{
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId }});
    })
    .then(products =>{
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + quantity; // Add the selected quantity to existing
        return product;
      }
      return Product.findByPk(prodId)
    })
    .then(product =>{
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() =>{
      res.redirect('/cart');
    })
    .catch(err =>{
      console.log(err);
    })
}
exports.postCartDeleteProduct = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }

  const prodId = req.body.productId;
  req.user.getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId }});
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      console.log('Product deleted from cart');
      return res.redirect('/cart');
    })
    .catch(err => {
      console.log(err);
    });
}
exports.postCartIncreaseItem = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }

  const prodId = req.body.productId;
  req.user.getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId }});
    })
    .then(products => {
      const product = products[0];
      const currentQuantity = product.cartItem.quantity;
      const newQuantity = currentQuantity + 1;
      return product.cartItem.update({ quantity: newQuantity });
    })
    .then(result => {
      console.log('Cart item quantity increased');
      return res.redirect('/cart');
    })
    .catch(err => {
      console.log(err);
    });
}
exports.postCartDecreaseItem = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }

  const prodId = req.body.productId;
  req.user.getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId }});
    })
    .then(products => {
      const product = products[0];
      const currentQuantity = product.cartItem.quantity;

      if (currentQuantity <= 1) {
        // If quantity is 1 or less, remove the item from cart
        return product.cartItem.destroy()
          .then(result => {
            console.log('Product removed from cart (quantity was 1)');
            return res.redirect('/cart');
          });
      } else {
        // Decrease quantity by 1
        const newQuantity = currentQuantity - 1;
        return product.cartItem.update({ quantity: newQuantity })
          .then(result => {
            console.log('Cart item quantity decreased');
            return res.redirect('/cart');
          });
      }
    })
    .catch(err => {
      console.log(err);
    });
}
exports.postOrder = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }

  let fetchedCart;
  let cartProducts;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      cartProducts = products;
      if (!cartProducts || cartProducts.length === 0) {
        return res.redirect('/cart');
      }
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            cartProducts.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            }));
        })
        .catch(err => {
          console.log(err);
        });
    })
    .then(result => {
      if (cartProducts && cartProducts.length > 0) {
        return fetchedCart.setProducts(null)
          .then(() => {
            console.log('Order created');
            console.log('Cart cleared');
            return res.redirect('/orders');
          })
          .catch(err => {
            console.log(err);
          });
      }
    })
    .catch(err => {
      console.log(err);
    });
}
exports.getOrders = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }

  req.user
    .getOrders({ include: ['products'] })
    .then(orders => {
      res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
      });
    })
    .catch(err => {
      console.error('Error fetching orders:', err);
      res.status(500).send('Internal Server Error');
  });
}
// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout'
//   });
// }
