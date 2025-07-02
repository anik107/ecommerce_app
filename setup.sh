#!/bin/bash

# Development Setup Script for E-Commerce Node.js App

echo "🚀 Setting up E-Commerce Node.js Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14+ and try again."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL and try again."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating environment file..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your database credentials"
else
    echo "✅ Environment file already exists"
fi

# Create logs directory
mkdir -p logs
echo "✅ Logs directory created"

# Create database (optional - requires PostgreSQL access)
read -p "Do you want to create the database? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗄️  Creating database..."
    createdb express_db 2>/dev/null || echo "Database might already exist"
fi

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your database credentials"
echo "2. Run 'npm run dev' to start development server"
echo "3. Visit http://localhost:3000"
echo ""
echo "Available commands:"
echo "  npm run dev      - Start development server"
echo "  npm start        - Start production server"
echo "  npm test         - Run tests"
echo "  npm run lint     - Check code quality"
echo ""
