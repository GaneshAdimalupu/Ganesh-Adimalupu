#!/bin/bash

# deploy-to-vercel.sh - Complete Deployment Script for Vercel

echo "🚀 Starting Vercel Deployment Process"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Check if we're in the right directory
echo -e "${BLUE}📁 Checking project structure...${NC}"
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Are you in the project root?${NC}"
    exit 1
fi

if [ ! -d "api" ]; then
    echo -e "${RED}❌ Error: api directory not found${NC}"
    exit 1
fi

if [ ! -d "src" ]; then
    echo -e "${RED}❌ Error: src directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Project structure looks good${NC}"

# Step 2: Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

# Step 3: Build the React app
echo -e "${BLUE}🔨 Building React application...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to build React app${NC}"
    exit 1
fi

echo -e "${GREEN}✅ React app built successfully${NC}"

# Step 4: Check if Vercel CLI is installed
echo -e "${BLUE}🔧 Checking Vercel CLI...${NC}"
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install Vercel CLI${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Vercel CLI is ready${NC}"

# Step 5: Check environment variables
echo -e "${BLUE}🔒 Checking environment variables...${NC}"
echo "Important: Make sure these environment variables are set in Vercel:"
echo "  - MONGO_URI"
echo "  - GOOGLE_CLIENT_ID (optional)"
echo "  - GOOGLE_CLIENT_SECRET (optional)"
echo "  - GOOGLE_REDIRECT_URI (optional)"
echo "  - GOOGLE_REFRESH_TOKEN (optional)"
echo "  - CALENDAR_ID (optional)"
echo "  - EMAIL_USER (optional)"
echo "  - EMAIL_PASS (optional)"
echo ""

# Step 6: Verify vercel.json exists and is correct
echo -e "${BLUE}📋 Checking vercel.json configuration...${NC}"
if [ ! -f "vercel.json" ]; then
    echo -e "${YELLOW}⚠️  Creating vercel.json configuration...${NC}"
    cat > vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    },
    {
      "src": "build/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/build/$1"
    }
  ],
  "functions": {
    "api/**/*.js": {
      "maxDuration": 10
    }
  },
  "env": {
    "NODE_ENV": "production"
  }
}
EOF
    echo -e "${GREEN}✅ Created vercel.json${NC}"
else
    echo -e "${GREEN}✅ vercel.json already exists${NC}"
fi

# Step 7: Check API structure
echo -e "${BLUE}🔍 Verifying API structure...${NC}"
required_files=(
    "api/schedule/availability.js"
    "api/schedule/book.js"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    echo -e "${RED}❌ Missing required API files:${NC}"
    for file in "${missing_files[@]}"; do
        echo "  - $file"
    done
    echo -e "${YELLOW}💡 Please create these files or check the file paths${NC}"
    exit 1
fi

echo -e "${GREEN}✅ API structure is correct${NC}"

# Step 8: Test build directory
echo -e "${BLUE}🧪 Testing build directory...${NC}"
if [ ! -d "build" ]; then
    echo -e "${RED}❌ Build directory not found. Running build again...${NC}"
    npm run build
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Build failed${NC}"
        exit 1
    fi
fi

if [ ! -f "build/index.html" ]; then
    echo -e "${RED}❌ Build seems incomplete - index.html not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build directory is ready${NC}"

# Step 9: Deploy to Vercel
echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
echo "This will deploy your application to Vercel."
echo "Make sure you have:"
echo "1. Logged into Vercel CLI (run 'vercel login' if needed)"
echo "2. Set up your environment variables in Vercel dashboard"
echo ""

read -p "Continue with deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⏸️  Deployment cancelled${NC}"
    exit 0
fi

# Deploy
vercel --prod
deployment_exit_code=$?

if [ $deployment_exit_code -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 DEPLOYMENT SUCCESSFUL!${NC}"
    echo -e "${GREEN}✅ Your app should now be live on Vercel${NC}"
    echo ""
    echo -e "${BLUE}📋 Next steps:${NC}"
    echo "1. Test your deployed application"
    echo "2. Check the Vercel dashboard for logs if there are issues"
    echo "3. Verify environment variables are set correctly"
    echo "4. Test the booking functionality"
    echo ""
    echo -e "${BLUE}🔧 If you encounter issues:${NC}"
    echo "1. Check Vercel function logs in the dashboard"
    echo "2. Verify MongoDB connection string"
    echo "3. Make sure all environment variables are set"
    echo "4. Check API endpoints are responding"
else
    echo ""
    echo -e "${RED}❌ DEPLOYMENT FAILED${NC}"
    echo "Please check the error messages above and:"
    echo "1. Ensure you're logged into Vercel CLI"
    echo "2. Check your project configuration"
    echo "3. Verify all files are in place"
    echo "4. Try running 'vercel login' and deploy again"
fi

echo ""
echo "🏁 Deployment script completed"
