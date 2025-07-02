const path = require('path');
const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Import configurations
const appConfig = require('./config/app');
const logger = require('./config/logger');
const sequelize = require('./util/database');

// Import middleware
const setupSecurity = require('./middleware/security');
const { globalErrorHandler } = require('./middleware/error-handler');

// Import models
const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

// Import controllers
const errorController = require('./controllers/error');

// Import routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const app = express();

// Set view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Setup security middleware
setupSecurity(app);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Initialize session store
const sessionStore = new SequelizeStore({
    db: sequelize,
    tableName: 'Sessions'
});

// Session configuration
app.use(session({
    ...appConfig.session,
    store: sessionStore
}));

// Authentication middleware
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findByPk(req.session.user.id)
        .then(user => {
            if (!user) {
                req.session.destroy(err => {
                    logger.error('Session destruction error:', err);
                });
                return res.redirect('/login');
            }
            req.user = user;
            next();
        })
        .catch(err => {
            logger.error('User fetch error:', err);
            next(err);
        });
});

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// 404 handler
app.use(errorController.get404);

// Global error handler
app.use(globalErrorHandler);

// Define associations
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

module.exports = app;
