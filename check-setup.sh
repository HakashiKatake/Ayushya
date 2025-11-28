#!/bin/bash

# AYUSHYA Quick Start Script
# This script helps verify your setup

echo "🏥 AYUSHYA - Setup Verification"
echo "================================"
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "  Node.js $NODE_VERSION installed"
else
    echo "  ❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check npm
echo "✓ Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "  npm $NPM_VERSION installed"
else
    echo "  ❌ npm not found"
    exit 1
fi

# Check if dependencies are installed
echo "✓ Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "  Dependencies installed"
else
    echo "  ⚠️  Dependencies not installed. Running npm install..."
    npm install
fi

# Check .env.local
echo "✓ Checking environment variables..."
if [ -f ".env.local" ]; then
    echo "  .env.local found"
    
    # Check for placeholder values
    if grep -q "pk_test_placeholder" .env.local; then
        echo "  ⚠️  WARNING: Clerk keys are still placeholders"
        echo "     You need to:"
        echo "     1. Sign up at https://clerk.com"
        echo "     2. Create a new application"
        echo "     3. Copy API keys to .env.local"
        echo "     See SETUP_GUIDE.md for details"
        echo ""
    else
        echo "  Clerk keys configured ✓"
    fi
    
    # Check MongoDB
    if grep -q "mongodb://localhost:27017" .env.local; then
        echo "  Using local MongoDB"
        echo "  ⚠️  Make sure MongoDB is running:"
        echo "     brew services start mongodb-community"
        echo ""
    elif grep -q "mongodb+srv://" .env.local; then
        echo "  Using MongoDB Atlas ✓"
    else
        echo "  ⚠️  MongoDB URI not configured"
    fi
else
    echo "  ❌ .env.local not found"
    echo "  Creating from .env.example..."
    cp .env.example .env.local
    echo "  ⚠️  Please edit .env.local with your credentials"
    exit 1
fi

echo ""
echo "================================"
echo "Setup Status:"
echo "================================"
echo ""

# Final checklist
echo "Please verify:"
echo "[ ] MongoDB is running (local) or configured (Atlas)"
echo "[ ] Clerk API keys are added to .env.local"
echo "[ ] Dependencies are installed (node_modules exists)"
echo ""

echo "If everything is ready, start the dev server:"
echo ""
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000"
echo ""
echo "Need help? Check:"
echo "  - README.md - Full documentation"
echo "  - SETUP_GUIDE.md - Step-by-step setup"
echo "  - PROJECT_SUMMARY.md - What's built & what's next"
echo ""
