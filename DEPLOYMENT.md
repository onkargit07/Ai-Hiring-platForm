# Production Deployment Guide

This guide covers deploying the AI Hiring Platform to production.

## Pre-Deployment Checklist

### Security
- [ ] Change JWT_SECRET to a strong random value
- [ ] Use strong database passwords
- [ ] Enable HTTPS/SSL certificates
- [ ] Set NODE_ENV=production
- [ ] Review and update CORS settings
- [ ] Enable rate limiting (recommended)
- [ ] Set up firewall rules

### Configuration
- [ ] Production database setup (PostgreSQL)
- [ ] OpenAI API key with sufficient quota
- [ ] Domain name configured
- [ ] Email service for notifications (optional)
- [ ] File storage solution (S3/Azure Blob/Local)

### Testing
- [ ] All features tested in staging
- [ ] Database migrations run successfully
- [ ] Resume uploads working
- [ ] AI scoring functional
- [ ] Authentication working
- [ ] All user flows tested

## Deployment Options

### Option 1: Traditional VPS (DigitalOcean, Linode, AWS EC2)

#### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install PM2 for process management
sudo npm install -g pm2
```

#### 2. Database Setup
```bash
# Create database
sudo -u postgres psql
CREATE DATABASE ai_hiring_platform;
CREATE USER hiring_user WITH PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE ai_hiring_platform TO hiring_user;
\q
```

#### 3. Deploy Backend
```bash
# Clone or upload your code
cd /var/www/ai-hiring-platform/backend

# Install dependencies
npm install --production

# Setup environment
nano .env
# Add production values:
# DATABASE_URL="postgresql://hiring_user:strong_password@localhost:5432/ai_hiring_platform"
# JWT_SECRET="your-production-secret"
# OPENAI_API_KEY="your-key"
# NODE_ENV="production"

# Run migrations
npx prisma generate
npx prisma migrate deploy

# Build
npm run build

# Start with PM2
pm2 start dist/server.js --name ai-hiring-backend
pm2 save
pm2 startup
```

#### 4. Deploy Frontend
```bash
cd /var/www/ai-hiring-platform/frontend

# Update API URL in vite.config.ts for production
# Change proxy target to your backend URL

# Install dependencies
npm install --production

# Build
npm run build

# Serve with nginx (see nginx config below)
```

#### 5. Nginx Configuration
```nginx
# /etc/nginx/sites-available/ai-hiring-platform

# Frontend
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/ai-hiring-platform/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Resume uploads
    location /uploads {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
    }
}

# Backend (optional direct access)
server {
    listen 5000;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ai-hiring-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. SSL Certificate (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Option 2: Docker Deployment

#### 1. Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

#### 2. Frontend Dockerfile
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 3. Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  database:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: ai_hiring_platform
      POSTGRES_USER: hiring_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://hiring_user:${DB_PASSWORD}@database:5432/ai_hiring_platform
      JWT_SECRET: ${JWT_SECRET}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      NODE_ENV: production
    ports:
      - "5000:5000"
    depends_on:
      - database
    volumes:
      - ./backend/uploads:/app/uploads

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

```bash
# Deploy
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Option 3: Cloud Platform (Heroku, Railway, Render)

#### Heroku Deployment

1. **Install Heroku CLI**
```bash
npm install -g heroku
heroku login
```

2. **Backend Deployment**
```bash
cd backend

# Create Heroku app
heroku create your-app-name-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set OPENAI_API_KEY=your-key
heroku config:set NODE_ENV=production

# Add Procfile
echo "web: npm start" > Procfile

# Deploy
git init
git add .
git commit -m "Initial commit"
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy
```

3. **Frontend Deployment** (Vercel/Netlify)
```bash
cd frontend

# Update API URL in vite.config.ts
# Change to your Heroku backend URL

# Deploy to Vercel
npm install -g vercel
vercel --prod

# Or deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod
```

### Option 4: Kubernetes (Advanced)

For large-scale deployments, use Kubernetes with:
- Separate pods for backend replicas
- PostgreSQL StatefulSet or managed service (AWS RDS, Google Cloud SQL)
- Load balancer for frontend
- Persistent volumes for uploads
- Horizontal pod autoscaling

## Environment Variables (Production)

```env
# Backend .env (Production)
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="very-long-random-secure-string-change-this"
JWT_EXPIRES_IN="7d"
OPENAI_API_KEY="sk-your-production-key"
PORT=5000
NODE_ENV="production"
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5242880

# Optional
CORS_ORIGIN="https://yourdomain.com"
RATE_LIMIT_WINDOW="15m"
RATE_LIMIT_MAX="100"
```

## Database Migration

```bash
# Production migration
cd backend
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Rollback (if needed)
npx prisma migrate resolve --rolled-back "migration-name"
```

## Backup Strategy

### Database Backups
```bash
# Automated daily backup script
#!/bin/bash
BACKUP_DIR="/var/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="ai_hiring_platform"

# Create backup
pg_dump $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete
```

Add to crontab:
```bash
0 2 * * * /path/to/backup-script.sh
```

### Resume Files Backup
```bash
# Backup uploads directory
rsync -avz /var/www/ai-hiring-platform/backend/uploads/ /backup/uploads/
```

## Monitoring & Logging

### PM2 Monitoring
```bash
# View logs
pm2 logs ai-hiring-backend

# Monitor resources
pm2 monit

# Setup log rotation
pm2 install pm2-logrotate
```

### Application Monitoring
Consider integrating:
- **Sentry** for error tracking
- **Datadog** for application performance
- **New Relic** for full-stack monitoring
- **LogRocket** for session replay

### Health Checks
Add to backend server.ts:
```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## Performance Optimization

### Backend
- Enable gzip compression
- Implement caching (Redis)
- Database connection pooling
- Rate limiting
- CDN for static assets

### Frontend
- Enable production build optimization
- Lazy load routes
- Image optimization
- Bundle analysis and code splitting

### Database
```sql
-- Add indexes for better performance
CREATE INDEX idx_applications_job_id ON applications(job_post_id);
CREATE INDEX idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX idx_applications_score ON applications(suitability_score DESC);
CREATE INDEX idx_jobs_active ON job_posts(is_active);
```

## Security Hardening

### Backend Security
```typescript
// Add to server.ts
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Database Security
```sql
-- Revoke unnecessary permissions
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO hiring_user;
```

### File Upload Security
- Validate file types
- Scan for viruses (ClamAV)
- Limit file sizes
- Use signed URLs for downloads

## Cost Optimization

### OpenAI API
- Use GPT-3.5-turbo instead of GPT-4 (10x cheaper)
- Implement caching for repeated queries
- Batch processing for multiple candidates
- Monitor API usage

### Infrastructure
- Use auto-scaling
- Implement CDN for static assets
- Optimize database queries
- Use connection pooling

## Troubleshooting Production Issues

### Common Issues

**High Memory Usage**
```bash
# Restart backend
pm2 restart ai-hiring-backend

# Check memory
pm2 monit
```

**Database Connection Errors**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connections
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"
```

**File Upload Failures**
```bash
# Check disk space
df -h

# Check uploads directory permissions
chmod 755 /var/www/ai-hiring-platform/backend/uploads
```

## Rollback Plan

If deployment fails:

1. **Database Rollback**
```bash
npx prisma migrate resolve --rolled-back "last-migration"
```

2. **Application Rollback**
```bash
pm2 stop ai-hiring-backend
git checkout previous-working-commit
npm install
npm run build
pm2 start dist/server.js
```

3. **Frontend Rollback**
```bash
# Deploy previous version
vercel rollback
# or for nginx
cp -r /backup/frontend/dist /var/www/ai-hiring-platform/frontend/
```

## Post-Deployment Verification

- [ ] Landing page loads correctly
- [ ] Registration works for both roles
- [ ] Login functionality works
- [ ] Job creation works (recruiter)
- [ ] Job browsing works (candidate)
- [ ] Application submission works
- [ ] Resume upload works
- [ ] AI scoring returns results
- [ ] Application status updates work
- [ ] All API endpoints respond correctly
- [ ] SSL certificate is valid
- [ ] Database migrations applied
- [ ] Backups are running
- [ ] Monitoring is active

## Support & Maintenance

### Regular Maintenance Tasks
- Weekly: Review error logs
- Monthly: Update dependencies
- Quarterly: Security audit
- Yearly: SSL certificate renewal (automated with Let's Encrypt)

### Update Process
```bash
# 1. Backup first
pg_dump ai_hiring_platform > backup_before_update.sql

# 2. Update code
git pull origin main

# 3. Update dependencies
cd backend && npm install
cd frontend && npm install

# 4. Run migrations
cd backend && npx prisma migrate deploy

# 5. Rebuild and restart
npm run build
pm2 restart ai-hiring-backend
```

---

**For production support, monitor logs regularly and set up alerts for critical errors.**
