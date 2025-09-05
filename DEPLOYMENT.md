# Frontend Deployment Guide

This guide explains how to deploy the Edat frontend application to your EC2 server.

## Prerequisites

1. **SSH Key**: Ensure your SSH key (`~/main-key.pem`) has proper permissions:
   ```bash
   chmod 600 ~/main-key.pem
   ```

2. **Server Access**: Verify you can connect to your EC2 instance:
   ```bash
   ssh -i ~/main-key.pem ubuntu@ec2-13-61-178-46.eu-north-1.compute.amazonaws.com
   ```

3. **Node.js**: Ensure Node.js (>=20.0.0) is installed locally

## Deployment Configuration

The deployment configuration is stored in `.deploy.env`:

```env
DEPLOY_SSH_KEY="~/main-key.pem"
DEPLOY_USER="ubuntu"
DEPLOY_HOST="ec2-13-61-178-46.eu-north-1.compute.amazonaws.com"
DEPLOY_PATH="/var/www/frontend"
DEPLOY_SETUP_CMD="mkdir -p /var/www/frontend"
```

## Deployment Commands

### Quick Deployment
```bash
npm run deploy
```
This runs the deployment script directly (assumes you've already built the project).

### Build and Deploy
```bash
npm run deploy:build
```
This builds the project and then deploys it.

### Check Deployment
```bash
npm run deploy:check
```
This checks the files on the remote server.

### Manual Deployment
```bash
./deploy.sh
```
Run the deployment script directly.

## Deployment Process

The deployment script performs the following steps:

1. **Validation**: Checks for required environment variables and files
2. **Dependencies**: Installs npm dependencies with `npm ci`
3. **Build**: Creates production build with `npm run build`
4. **Archive**: Creates a compressed archive of the build files
5. **SSH Test**: Verifies connection to the server
6. **Upload**: Transfers files to the server
7. **Deploy**: Extracts files and sets proper permissions
8. **Verify**: Confirms successful deployment
9. **Cleanup**: Removes temporary files

## Server Setup

Ensure your EC2 server has:

1. **Web Server**: Nginx or Apache configured to serve static files
2. **Directory**: `/var/www/frontend` directory with proper permissions
3. **User**: `www-data` user for web server permissions

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/frontend;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Handle React Router
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Troubleshooting

### SSH Connection Issues
- Verify SSH key permissions: `chmod 600 ~/main-key.pem`
- Check server status and security groups
- Ensure the EC2 instance is running

### Build Issues
- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript or linting errors: `npm run lint`
- Verify Node.js version: `node --version` (should be >=20.0.0)

### Permission Issues
- Ensure the deployment user has write access to `/var/www/frontend`
- Check that `www-data` user exists on the server

### Deployment Verification
- Check server logs: `sudo tail -f /var/log/nginx/error.log`
- Verify files were uploaded: `ls -la /var/www/frontend`
- Test the application in a browser

## Security Notes

- The SSH key is stored locally and should never be committed to version control
- The deployment script creates backups of previous deployments
- File permissions are set appropriately for web server access
- The script uses secure SSH connections with key-based authentication

## Rollback

If you need to rollback a deployment, the script creates automatic backups:

```bash
ssh -i ~/main-key.pem ubuntu@ec2-13-61-178-46.eu-north-1.compute.amazonaws.com
sudo cp -r /var/www/frontend.backup.YYYYMMDD_HHMMSS/* /var/www/frontend/
```

Replace `YYYYMMDD_HHMMSS` with the appropriate backup timestamp.
