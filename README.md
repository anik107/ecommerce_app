# E-Commerce Node.js Application

A professional, scalable e-commerce application built with Node.js, Express, PostgreSQL, and Sequelize ORM.

## 🚀 Features

- **User Authentication & Authorization**
- **Product Management** (CRUD operations)
- **Shopping Cart Functionality**
- **Order Management**
- **Session-based Authentication**
- **Input Validation & Sanitization**
- **Security Middleware** (Helmet, Rate Limiting, XSS Protection)
- **Error Handling & Logging**
- **Professional Code Structure**
- **Unit Testing with Jest**
- **Code Quality Tools** (ESLint, Prettier)

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd node_js
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your database credentials and other settings.

4. **Set up PostgreSQL database**
   ```bash
   createdb express_db
   ```

5. **Start the application**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## 📁 Project Structure

```
├── config/                 # Configuration files
│   ├── app.js              # Application configuration
│   ├── database.js         # Database configuration
│   └── logger.js           # Winston logger configuration
├── controllers/            # Route controllers
│   ├── admin.js            # Admin functionality
│   ├── auth.js             # Authentication
│   ├── error.js            # Error handling
│   └── shop.js             # Shop functionality
├── middleware/             # Custom middleware
│   ├── error-handler.js    # Global error handling
│   ├── is-auth.js          # Authentication middleware
│   ├── security.js         # Security middleware setup
│   └── validation.js       # Input validation
├── models/                 # Sequelize models
│   ├── cart.js
│   ├── cart-item.js
│   ├── order.js
│   ├── order-item.js
│   ├── product.js
│   └── user.js
├── public/                 # Static assets
│   └── css/                # Stylesheets
├── routes/                 # Route definitions
│   ├── admin.js
│   ├── auth.js
│   └── shop.js
├── services/               # Business logic layer
│   ├── productService.js
│   └── userService.js
├── tests/                  # Test files
│   ├── routes/
│   ├── services/
│   └── setup.js
├── util/                   # Utility functions
│   ├── database.js         # Database connection
│   └── path.js             # Path utilities
├── views/                  # EJS templates
├── logs/                   # Log files (created automatically)
├── app.js                  # Express app configuration
├── server.js               # Server entry point
└── package.json
```

## 🔧 Available Scripts

```bash
# Development
npm run dev                 # Start with nodemon
npm start                   # Start production server

# Testing
npm test                    # Run tests
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run tests with coverage

# Code Quality
npm run lint                # Run ESLint
npm run lint:fix            # Fix ESLint errors
npm run format              # Format code with Prettier

# Setup
npm run setup               # Install dependencies and copy .env
```

## 🛡️ Security Features

- **Helmet**: Sets various HTTP headers for security
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **Input Validation**: Validates and sanitizes user input
- **XSS Protection**: Prevents cross-site scripting attacks
- **CORS**: Configurable cross-origin resource sharing
- **Session Security**: Secure session configuration
- **SQL Injection Prevention**: Through Sequelize ORM parameterization

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: Store user information
- **Products**: Product catalog
- **Carts**: Shopping cart for each user
- **CartItems**: Items in shopping carts
- **Orders**: Completed orders
- **OrderItems**: Items in orders
- **Sessions**: Session storage

## 🧪 Testing

The project includes comprehensive testing setup:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📝 API Documentation

### Admin Routes (Protected)
- `GET /admin/add-product` - Show add product form
- `POST /admin/add-product` - Create new product
- `GET /admin/products` - List admin's products
- `GET /admin/edit-product/:id` - Show edit product form
- `POST /admin/edit-product` - Update product
- `POST /admin/delete-product/:id` - Delete product

### Shop Routes
- `GET /` - Home page
- `GET /products` - Product listing
- `GET /products/:id` - Product details
- `GET /cart` - Shopping cart (protected)
- `POST /cart` - Add to cart (protected)
- `POST /cart-delete-item` - Remove from cart (protected)
- `GET /orders` - Order history (protected)
- `POST /create-order` - Create order (protected)

### Auth Routes
- `GET /login` - Login form
- `POST /login` - Process login
- `POST /logout` - Logout

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database
DB_NAME=express_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# Server
PORT=3000
NODE_ENV=development

# Security
SESSION_SECRET=your-super-secret-key
BCRYPT_ROUNDS=12

# Logging
LOG_LEVEL=info
```

### Database Configuration

The application supports multiple environments (development, test, production) with different database configurations in `config/database.js`.

## 🚀 Deployment

### Production Setup

1. Set environment variables for production
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "ecommerce-app"
   ```

3. Set up reverse proxy with Nginx
4. Configure SSL certificates
5. Set up database backup strategy

### Docker Support (Optional)

You can containerize the application:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Author

**Anik Mahmud**

## 🔄 Version History

- **1.0.0** - Initial professional restructure
  - Added proper configuration management
  - Implemented security middleware
  - Added service layer architecture
  - Included comprehensive error handling
  - Added testing framework
  - Implemented logging system
  - Added code quality tools

## 🐛 Known Issues

- Authentication system needs enhancement with password hashing
- Email verification not implemented
- Payment processing not included
- Admin panel needs UI improvements

## 🗺️ Roadmap

- [ ] Implement JWT authentication
- [ ] Add password hashing with bcrypt
- [ ] Implement email verification
- [ ] Add payment processing (Stripe/PayPal)
- [ ] Create REST API endpoints
- [ ] Add Redis for session storage
- [ ] Implement file upload for product images
- [ ] Add product categories and search
- [ ] Implement inventory management
- [ ] Add order tracking system
