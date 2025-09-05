#!/bin/bash

# Frontend Deployment Script for Edat
# This script builds the frontend and deploys it to the EC2 server

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load environment variables from .deploy.env
if [ -f ".deploy.env" ]; then
    set -o allexport
    source .deploy.env
    set +o allexport
    echo -e "${GREEN}✓ Loaded deployment configuration${NC}"
else
    echo -e "${RED}✗ .deploy.env file not found!${NC}"
    exit 1
fi

# Function to print colored output
print_step() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Validate required environment variables
required_vars=("DEPLOY_SSH_KEY" "DEPLOY_USER" "DEPLOY_HOST" "DEPLOY_PATH")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        print_error "Required environment variable $var is not set in .deploy.env"
        exit 1
    fi
done

print_step "Starting deployment process..."

# Step 1: Clean and install dependencies
print_step "Installing dependencies..."
npm ci
print_success "Dependencies installed"

# Step 2: Build the project
print_step "Building the project..."
npm run build
print_success "Build completed"

# Check if dist directory exists
if [ ! -d "dist" ]; then
    print_error "Build directory 'dist' not found!"
    exit 1
fi

# Step 3: Create deployment archive
print_step "Creating deployment archive..."
tar -czf frontend-deploy.tar.gz -C dist .
print_success "Deployment archive created"

# Step 4: Test SSH connection
print_step "Testing SSH connection..."
if ssh -i "$DEPLOY_SSH_KEY" -o ConnectTimeout=10 -o BatchMode=yes "$DEPLOY_USER@$DEPLOY_HOST" exit 2>/dev/null; then
    print_success "SSH connection successful"
else
    print_error "SSH connection failed. Please check your SSH key and server details."
    exit 1
fi

# Step 5: Setup remote directory
print_step "Setting up remote directory..."
ssh -i "$DEPLOY_SSH_KEY" "$DEPLOY_USER@$DEPLOY_HOST" "$DEPLOY_SETUP_CMD"
print_success "Remote directory setup completed"

# Step 6: Upload files
print_step "Uploading files to server..."
scp -i "$DEPLOY_SSH_KEY" frontend-deploy.tar.gz "$DEPLOY_USER@$DEPLOY_HOST:/tmp/"
print_success "Files uploaded"

# Step 7: Deploy on server
print_step "Deploying on server..."
ssh -i "$DEPLOY_SSH_KEY" "$DEPLOY_USER@$DEPLOY_HOST" << EOF
    # Create backup of current deployment
    if [ -d "$DEPLOY_PATH" ] && [ "\$(ls -A $DEPLOY_PATH)" ]; then
        echo "Creating backup..."
        sudo cp -r "$DEPLOY_PATH" "$DEPLOY_PATH.backup.\$(date +%Y%m%d_%H%M%S)"
    fi
    
    # Clear deployment directory
    sudo rm -rf "$DEPLOY_PATH"/*
    
    # Extract new files
    cd "$DEPLOY_PATH"
    sudo tar -xzf /tmp/frontend-deploy.tar.gz
    
    # Set proper permissions
    sudo chown -R www-data:www-data "$DEPLOY_PATH"
    sudo chmod -R 755 "$DEPLOY_PATH"
    
    # Clean up
    rm /tmp/frontend-deploy.tar.gz
    
    echo "Deployment completed on server"
EOF

print_success "Server deployment completed"

# Step 8: Cleanup local files
print_step "Cleaning up local files..."
rm frontend-deploy.tar.gz
print_success "Local cleanup completed"

# Step 9: Verify deployment
print_step "Verifying deployment..."
if ssh -i "$DEPLOY_SSH_KEY" "$DEPLOY_USER@$DEPLOY_HOST" "[ -f '$DEPLOY_PATH/index.html' ]"; then
    print_success "Deployment verification successful"
    print_success "🚀 Frontend deployed successfully to $DEPLOY_HOST"
    echo -e "${GREEN}Your application should be accessible at: http://$DEPLOY_HOST${NC}"
else
    print_error "Deployment verification failed"
    exit 1
fi

print_step "Deployment process completed!"
