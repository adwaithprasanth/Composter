# Self-Hosting Guide

Run your own instance of Composter on your infrastructure.

## Why Self-Host?

- **Full Control:** Own your data and infrastructure
- **Privacy:** Keep components on your private servers
- **Customization:** Modify code to fit your needs
- **No Limits:** No usage restrictions or rate limits
- **Team Deployment:** Internal deployment for your organization

## Prerequisites

- **Node.js** 18 or higher
- **PostgreSQL** 14 or higher (or Neon.tech account)
- **npm** or **yarn**
- **Git**
- **Domain name** (optional, for production)
- **SSL Certificate** (optional, for HTTPS)

## Architecture Overview

```
┌─────────────┐
│   Frontend  │  (React + Vite)
│   :5173     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   API       │  (Express.js + Better Auth)
│   :3000     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  PostgreSQL │  (Database)
│   :5432     │
└─────────────┘
```

## Quick Start (Development)

### 1. Clone Repository

```bash
git clone https://github.com/binit2-1/Composter.git
cd Composter
```

### 2. Setup Database

**Option A: Local PostgreSQL**

```bash
# Install PostgreSQL (macOS)
brew install postgresql@14
brew services start postgresql@14

# Create database
createdb composter

# Get connection string
echo "postgresql://$(whoami)@localhost:5432/composter"
```

**Option B: Neon.tech (Cloud)**

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

### 3. Configure Environment

**API Environment Variables:**

Create `api/.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/composter"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# CORS
CLIENT_URL="http://localhost:5173"

# Server
PORT=3000
NODE_ENV="development"
```

**Generate BETTER_AUTH_SECRET:**
```bash
openssl rand -hex 32
```

**Frontend Environment Variables:**

Create `frontend/.env`:

```env
VITE_API_URL="http://localhost:3000"
```

**CLI Environment Variables:**

Create `cli/.env`:

```env
BASE_URL="http://localhost:3000/api"
```

### 4. Install Dependencies

```bash
# Install API dependencies
cd api
npm install

# Install Frontend dependencies
cd ../frontend
npm install

# Install CLI dependencies
cd ../cli
npm install

# Install MCP dependencies
cd ../mcp
npm install
```

### 5. Run Database Migrations

```bash
cd api

# Run Prisma migrations
npx prisma migrate dev

# Run Better Auth migrations
npx @better-auth/cli migrate

# Generate Prisma Client
npx prisma generate
```

### 6. Start Services

```bash
# Terminal 1: API Server
cd api
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: MCP (optional)
cd mcp
npm start
```

**Access Points:**
- Frontend: http://localhost:5173
- API: http://localhost:3000
- API Health: http://localhost:3000/health

### Developer tips (MCP & CLI)

When self-hosting for development you may also want to run the MCP server and the CLI locally to test integrations.

```bash
# From repo root
cd packages/mcp
npm install
npm start           # run MCP server

cd ../cli
npm install
npx node ./bin/composter.js login   # run CLI against local API

# Run the inspector for debugging MCP interactions
cd ../mcp
npm run server:inspect
```

Use the inspector to trace MCP requests and verify AI assistant connections when testing against a self-hosted instance.

## Production Deployment

### Option 1: Deploy to Render (Backend) + Vercel (Frontend)

This is how the official Composter is deployed.

#### Deploy Backend to Render

1. **Create Render Account:** [render.com](https://render.com)

2. **Create PostgreSQL Database:**
   - New → PostgreSQL
   - Name: `composter-db`
   - Copy internal connection string

3. **Create Web Service:**
   - New → Web Service
   - Connect your GitHub repo
   - Settings:
     - **Root Directory:** `api`
     - **Build Command:** `npm install && npx prisma generate`
     - **Start Command:** `npm start`
     - **Environment Variables:**
       ```
       DATABASE_URL=<your-postgres-url>
       BETTER_AUTH_SECRET=<generate-with-openssl>
       BETTER_AUTH_URL=https://your-app.onrender.com
       CLIENT_URL=https://your-app.vercel.app
       NODE_ENV=production
       ```

4. **Run Migrations:**
   ```bash
   # After first deploy, run in Render shell
   npx prisma migrate deploy
   npx @better-auth/cli migrate
   ```

#### Deploy Frontend to Vercel

1. **Create Vercel Account:** [vercel.com](https://vercel.com)

2. **Import Project:**
   - New Project → Import from GitHub
   - Select your repo
   - Settings:
     - **Root Directory:** `frontend`
     - **Framework Preset:** Vite
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
     - **Environment Variables:**
       ```
       VITE_API_URL=https://your-app.onrender.com
       ```

3. **Deploy**

4. **Update Backend CORS:**
   - Go to Render dashboard
   - Update `CLIENT_URL` to your Vercel URL
   - Redeploy

### Option 2: Deploy to Railway

1. **Create Railway Account:** [railway.app](https://railway.app)

2. **Deploy from Template:**
   ```bash
   # Create railway.json in project root
   {
     "services": {
       "api": {
         "builder": "NIXPACKS",
         "rootDirectory": "./api",
         "startCommand": "npm start"
       },
       "frontend": {
         "builder": "NIXPACKS",
         "rootDirectory": "./frontend",
         "startCommand": "npm run preview"
       }
     }
   }
   ```

3. **Configure Environment Variables** (same as Render)

4. **Deploy:** Railway will auto-deploy

### Option 3: Deploy to VPS (DigitalOcean, AWS, etc.)

#### 1. Provision Server

```bash
# Ubuntu 22.04 LTS recommended
# 1 vCPU, 2GB RAM minimum
```

#### 2. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx (for reverse proxy)
sudo apt install -y nginx

# Install Certbot (for SSL)
sudo apt install -y certbot python3-certbot-nginx
```

#### 3. Setup PostgreSQL

```bash
# Create database and user
sudo -u postgres psql
CREATE DATABASE composter;
CREATE USER composter WITH ENCRYPTED PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE composter TO composter;
\q
```

#### 4. Deploy Application

```bash
# Clone repo
cd /var/www
sudo git clone https://github.com/binit2-1/Composter.git
cd Composter

# Install dependencies
cd api && sudo npm install --production
cd ../frontend && sudo npm install && sudo npm run build
cd ../cli && sudo npm install --production
cd ../mcp && sudo npm install --production

# Setup environment (create .env files as shown above)

# Run migrations
cd /var/www/Composter/api
sudo npx prisma migrate deploy
sudo npx @better-auth/cli migrate
```

#### 5. Setup PM2 (Process Manager)

```bash
# Install PM2
sudo npm install -g pm2

# Start API
cd /var/www/Composter/api
pm2 start npm --name "composter-api" -- start

# Save PM2 config
pm2 save
pm2 startup
```

#### 6. Configure Nginx

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/composter
```

```nginx
# API server
server {
    listen 80;
    server_name api.yourcomposter.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name yourcomposter.com;

    root /var/www/Composter/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/composter /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 7. Setup SSL with Let's Encrypt

```bash
sudo certbot --nginx -d yourcomposter.com -d api.yourcomposter.com
```

#### 8. Update Environment Variables

Update `api/.env` and `frontend/.env` with production URLs:

```bash
# api/.env
BETTER_AUTH_URL="https://api.yourcomposter.com"
CLIENT_URL="https://yourcomposter.com"

# frontend/.env
VITE_API_URL="https://api.yourcomposter.com"
```

#### 9. Restart Services

```bash
pm2 restart composter-api
sudo systemctl restart nginx
```

### Option 4: Docker Deployment

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: composter
      POSTGRES_USER: composter
      POSTGRES_PASSWORD: your-password
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://composter:your-password@postgres:5432/composter
      BETTER_AUTH_SECRET: your-secret
      BETTER_AUTH_URL: http://localhost:3000
      CLIENT_URL: http://localhost:5173
      NODE_ENV: production
    ports:
      - "3000:3000"
    depends_on:
      - postgres

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      VITE_API_URL: http://localhost:3000
    ports:
      - "5173:5173"
    depends_on:
      - api

volumes:
  postgres-data:
```

Create `api/Dockerfile`:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "start"]
```

Create `frontend/Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Deploy:

```bash
docker-compose up -d
```

## Backup & Restore

### Database Backup

```bash
# Backup
pg_dump -U composter composter > backup.sql

# Restore
psql -U composter composter < backup.sql
```

### Automated Backups

```bash
# Create backup script
cat > /usr/local/bin/backup-composter.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/composter"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -U composter composter | gzip > $BACKUP_DIR/composter_$DATE.sql.gz
# Keep last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
EOF

chmod +x /usr/local/bin/backup-composter.sh

# Add to crontab (daily at 2 AM)
0 2 * * * /usr/local/bin/backup-composter.sh
```

## Monitoring

### Health Check Endpoint

API includes `/health` endpoint:

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-12-20T10:30:00Z",
  "database": "connected"
}
```

### Uptime Monitoring

Use services like:
- [UptimeRobot](https://uptimerobot.com)
- [Pingdom](https://www.pingdom.com)
- [StatusCake](https://www.statuscake.com)

Configure to check: `https://your-api.com/health`

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql -U composter -d composter -c "SELECT 1;"

# Check PostgreSQL is running
sudo systemctl status postgresql
```

### API Won't Start

```bash
# Check logs
pm2 logs composter-api

# Check port availability
sudo lsof -i :3000
```

### Frontend Build Fails

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Scaling

### Horizontal Scaling

Use load balancer (Nginx, HAProxy) with multiple API instances:

```nginx
upstream api_backend {
    server api1.example.com:3000;
    server api2.example.com:3000;
    server api3.example.com:3000;
}

server {
    location / {
        proxy_pass http://api_backend;
    }
}
```

### Database Scaling

- Enable PostgreSQL replication
- Use connection pooling (PgBouncer)
- Consider managed database (AWS RDS, Google Cloud SQL)

## Security Checklist

- ✅ Use HTTPS (SSL/TLS certificates)
- ✅ Strong BETTER_AUTH_SECRET (32+ characters)
- ✅ Firewall configured (only ports 80, 443, 22 open)
- ✅ Database not publicly accessible
- ✅ Regular security updates (`sudo apt update && sudo apt upgrade`)
- ✅ Rate limiting enabled
- ✅ CORS properly configured
- ✅ Regular backups
- ✅ Monitor logs for suspicious activity

## See Also

- [Getting Started Guide](getting-started.md)
- [API Reference](api-reference.md)
- [Troubleshooting](troubleshooting.md)
- [Contributing](../CONTRIBUTING.md)
