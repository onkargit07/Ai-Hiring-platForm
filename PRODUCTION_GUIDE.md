# 🚀 AI Hiring Platform - Production Guide

## Professional Features

### ✅ Security
- **Helmet.js** - Security headers protection
- **Rate Limiting** - API abuse prevention (with optional Redis support)
- **Input Sanitization** - XSS and NoSQL injection prevention
- **JWT Authentication** - Secure token-based auth with 7-day expiration
- **CORS Configuration** - Controlled cross-origin requests
- **File Upload Validation** - Type and size restrictions

### ✅ Error Handling & Logging
- **Winston Logger** - Structured logging with file rotation
- **Custom Error Classes** - ApiError, ValidationError, NotFoundError, etc.
- **Global Error Handler** - Consistent error responses
- **Morgan HTTP Logger** - Request/response logging
- **Development vs Production** - Different log levels and stack traces

### ✅ Validation
- **Zod Schemas** - Runtime type checking and validation
- **Custom Validators** - Email, password strength, file types
- **Prisma Validation** - Database-level constraints

### ✅ Email Notifications
- **Nodemailer** - SMTP email sending
- **Welcome Emails** - User registration confirmation
- **Application Received** - Candidate notification
- **Status Updates** - Shortlisted, selected, rejected notifications
- **Recruiter Alerts** - New application notifications

### ✅ Testing
- **Jest** - Unit and integration testing framework
- **Supertest** - API endpoint testing
- **Test Coverage** - Code coverage reports
- **CI/CD Integration** - Automated testing on GitHub Actions

### ✅ API Documentation
- **Swagger/OpenAPI** - Interactive API documentation at `/api-docs`
- **JSON Spec** - Raw OpenAPI spec at `/api-docs.json`

### ✅ Containerization
- **Docker** - Backend and frontend Dockerfiles
- **Docker Compose** - Full stack orchestration (PostgreSQL + Redis + Backend + Frontend)
- **Multi-stage Builds** - Optimized production images
- **Nginx** - Frontend reverse proxy with compression

### ✅ Code Quality
- **ESLint** - TypeScript linting with recommended rules
- **TypeScript** - Full type safety across the codebase
- **Prettier** (recommended) - Code formatting

### ✅ CI/CD
- **GitHub Actions** - Automated testing and deployment
- **Automated Tests** - Run on every push and PR
- **Docker Build & Push** - Automatic image building
- **Deploy to Production** - SSH-based deployment example

---

## 📦 Installation Options

### Option 1: Docker (Recommended for Production)

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-hiring-platform.git
cd ai-hiring-platform

# Create .env file
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials

# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# API Docs: http://localhost:5000/api-docs
```

### Option 2: Manual Setup

```bash
# Backend Setup
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed  # Optional: Add sample data
npm run dev

# Frontend Setup (in another terminal)
cd frontend
npm install
npm run dev
```

---

## 🔧 Configuration

### Environment Variables

#### Required
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secure random string for JWT signing
- `PORT` - Backend server port (default: 5000)

#### Optional but Recommended
- `OPENAI_API_KEY` - For AI-powered candidate scoring
- `REDIS_URL` - For distributed rate limiting
- `SMTP_*` - Email notification configuration
- `FRONTEND_URL` - For CORS configuration

### Email Setup (Gmail Example)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Update `.env`:
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-16-char-app-password"
```

---

## 🧪 Testing

```bash
# Run all tests
cd backend
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Linting
npm run lint
npm run lint:fix
```

---

## 📊 Monitoring & Logs

### Log Files (backend/logs/)
- `error.log` - Error-level logs only
- `combined.log` - All logs (info, warn, error)

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Database Admin
```bash
cd backend
npm run prisma:studio
# Opens at http://localhost:5555
```

---

## 🚀 Deployment

### Prerequisites
1. PostgreSQL 14+ database
2. Node.js 18+ environment
3. Domain with SSL certificate (recommended)
4. Redis (optional, for rate limiting)

### Production Checklist

#### Backend
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (64+ characters)
- [ ] Configure production database URL
- [ ] Set up SMTP for emails
- [ ] Enable Redis for rate limiting
- [ ] Configure SSL/TLS
- [ ] Set up log rotation
- [ ] Configure firewall rules
- [ ] Set up monitoring (e.g., PM2, New Relic)

#### Frontend
- [ ] Update `VITE_API_URL` to production backend
- [ ] Build optimized bundle: `npm run build`
- [ ] Configure CDN (optional)
- [ ] Enable gzip compression
- [ ] Set up SSL certificate

#### Database
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Set up automated backups
- [ ] Configure connection pooling
- [ ] Enable query logging (for optimization)

### Deployment Methods

#### 1. Docker on VPS/Cloud
```bash
# On your server
git pull origin main
docker-compose pull
docker-compose up -d
docker-compose exec backend npx prisma migrate deploy
```

#### 2. PM2 (Process Manager)
```bash
# Install PM2
npm install -g pm2

# Start backend
cd backend
pm2 start npm --name "ai-hiring-backend" -- start

# Start frontend with serve
cd frontend
npm run build
pm2 start serve --name "ai-hiring-frontend" -- -s dist -l 3000
```

#### 3. Cloud Platforms

**Railway**
```bash
railway login
railway init
railway up
```

**Heroku**
```bash
heroku create ai-hiring-backend
heroku addons:create heroku-postgresql
git push heroku main
```

**Vercel (Frontend)**
```bash
cd frontend
vercel --prod
```

---

## 📈 Scaling Considerations

### Database
- Use connection pooling (Prisma default: 10 connections)
- Add read replicas for heavy read workloads
- Index frequently queried columns
- Regular VACUUM and ANALYZE operations

### Backend
- Enable clustering (PM2 cluster mode)
- Use Redis for session storage
- Implement caching (Redis)
- Use CDN for static assets
- Load balancing (Nginx, HAProxy)

### Rate Limiting
- Production: Use Redis store for distributed rate limiting
- Configure different limits per endpoint
- Monitor and adjust based on traffic

---

## 🔒 Security Best Practices

1. **Never commit** `.env` files or secrets
2. **Use HTTPS** in production (Let's Encrypt)
3. **Enable rate limiting** on all routes
4. **Validate all inputs** (Zod schemas)
5. **Sanitize file uploads** (check MIME types)
6. **Keep dependencies updated** (`npm audit`)
7. **Use secure headers** (Helmet.js - already configured)
8. **Implement CSRF protection** (if using sessions)
9. **Regular security audits** (npm audit, Snyk)
10. **Monitor logs** for suspicious activity

---

## 📝 API Documentation

Once the server is running, visit:
- **Interactive Docs**: http://localhost:5000/api-docs
- **OpenAPI JSON**: http://localhost:5000/api-docs.json

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

#### Jobs (Recruiter only)
- `POST /api/jobs` - Create job posting
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get specific job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

#### Applications
- `POST /api/applications` - Submit application (with resume)
- `GET /api/applications` - Get applications (filtered by role)
- `GET /api/applications/:id` - Get specific application
- `PUT /api/applications/:id/status` - Update application status

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
# Windows
Get-Service postgresql*

# Test connection
psql -U postgres -h localhost -d ai_hiring_platform
```

### Port Already in Use
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Prisma Issues
```bash
# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Regenerate client
npx prisma generate

# Open Prisma Studio for debugging
npx prisma studio
```

### Email Not Sending
1. Check SMTP credentials in `.env`
2. For Gmail, use App Password (not regular password)
3. Check firewall/antivirus blocking port 587
4. Review logs: `backend/logs/error.log`

---

## 📞 Support & Contributing

### Getting Help
- Check existing GitHub issues
- Review API documentation at `/api-docs`
- Check application logs in `backend/logs/`

### Contributing
1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Run linter: `npm run lint`
5. Submit pull request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎯 Next Steps

### Recommended Enhancements
- [ ] Add video interview scheduling
- [ ] Implement real-time chat (Socket.io)
- [ ] Add candidate profile pages
- [ ] Bulk application actions
- [ ] Advanced analytics dashboard
- [ ] Calendar integration (Google Calendar)
- [ ] Slack/Teams notifications
- [ ] Multi-language support (i18n)
- [ ] Dark mode UI
- [ ] Mobile app (React Native)

---

**Made with ❤️ for professional recruiting**
