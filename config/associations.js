const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item');
const Order = require('../models/order');
const OrderItem = require('../models/order-item');

/**
 * Define all database model associations
 */
const defineAssociations = () => {
    // Product-User associations
    Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
    User.hasMany(Product);

    // Cart-User associations
    User.hasOne(Cart);
    Cart.belongsTo(User);

    // Cart-Product associations (Many-to-Many)
    Cart.belongsToMany(Product, { through: CartItem });
    Product.belongsToMany(Cart, { through: CartItem });

    // Order-User associations
    Order.belongsTo(User);
    User.hasMany(Order);

    // Order-Product associations (Many-to-Many)
    Order.belongsToMany(Product, { through: OrderItem });
};

module.exports = defineAssociations;
