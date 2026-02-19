# 🤖 AI Hiring Platform

> Smart recruitment platform powered by **Google Gemini AI** with advanced candidate ranking and intelligent filtering.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.8-blue)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)]()

---

## ✨ Features

### 🎯 For Recruiters
- Create job postings with custom screening questions
- **AI-powered candidate ranking** using Gemini AI (0-100 score)
- **Project complexity analysis** - Technical depth, innovation, scalability, impact
- **Overqualification detection** - Prevents mismatched candidates
- Delete job posts, manage applications
- Dashboard with analytics

### 💼 For Candidates
- **Advanced job search** with live filtering
- **Drag-and-drop resume upload** (PDF/DOC)
- Filter by location (11 Indian cities + Remote)
- Track application status
- View AI suitability scores
- Portfolio and cover letter integration

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS, React Router, Zustand |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM |
| **Database** | PostgreSQL (Neon Cloud) |
| **AI** | Google Gemini 1.5 Pro |
| **Auth** | JWT, Bcrypt |
| **Security** | Helmet, CORS, Rate Limiting, XSS Protection |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database ([Neon.tech](https://neon.tech) - free)
- Google Gemini API key ([Get here](https://makersuite.google.com/app/apikey))

### Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/ai-hiring-platform.git
cd ai-hiring-platform

# Backend setup
cd backend
npm install
cp .env.example .env  # Edit with your credentials
npx prisma generate
npx prisma migrate dev
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

**Access:** http://localhost:3000

---

## 🔐 Environment Variables

**Backend (.env):**
```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
JWT_SECRET="your-32-character-secret-key"
GEMINI_API_KEY="AIzaSy..."
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

See [.env.example](backend/.env.example) for full configuration.

---

## 🎯 AI Scoring System

Gemini AI analyzes candidates across **5 dimensions**:

| Dimension | Weight | Details |
|-----------|--------|---------|
| **Skills Match** | 30% | Technical skills alignment |
| **Experience Match** | 25% | Years and level compatibility |
| **Project Complexity** | 20% | Technical depth, innovation, scalability, impact |
| **Education Match** | 15% | Academic background |
| **Overall Fit** | 10% | Culture and communication |

**Advanced Features:**
- Overqualification detection (-20 points)
- 4-level tie-breaking (Score → Complexity → Experience → Time)
- Experience-relative complexity scoring
- Detailed project analysis

📖 [Learn more about AI scoring →](AI_SCORING_GUIDE.md)

---

## 📦 Project Structure

```
ai-hiring-platform/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # Gemini AI service
│   │   ├── middleware/      # Auth, security
│   │   └── routes/          # API endpoints
│   ├── prisma/              # Database schema
│   └── uploads/             # Resume storage
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # React components
│   │   ├── services/        # API integration
│   │   └── store/           # State management
│   └── dist/                # Production build
│
└── docs/                    # Documentation
```

---

## 🚀 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

📖 **[Complete Deployment Guide →](DEPLOYMENT_GUIDE_2026.md)**

### Deploy to Railway (Alternative)

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

---

## 📚 Documentation

| Guide | Description |
|-------|-------------|
| [Deployment Guide](DEPLOYMENT_GUIDE_2026.md) | Step-by-step Vercel/Railway deployment |
| [Environment Setup](ENVIRONMENT_SETUP.md) | Local development configuration |
| [Project Analysis](PROJECT_ANALYSIS_FINAL.md) | Complete system audit |
| [AI Scoring Guide](AI_SCORING_GUIDE.md) | How Gemini AI ranking works |
| [Architecture](ARCHITECTURE.md) | System design and structure |

---

## 🔒 Security Features

- ✅ Helmet.js security headers
- ✅ CORS protection
- ✅ Rate limiting
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Input sanitization
- ✅ XSS protection
- ✅ SQL injection prevention
- ✅ File upload validation

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Test AI ranking
ts-node scripts/test-ranking.ts

# Frontend build test
cd frontend
npm run build
```

---

## 📸 Screenshots

<details>
<summary>Click to expand</summary>

### Landing Page
![Landing Page](screenshots/landing.png)

### Recruiter Dashboard
![Recruiter Dashboard](screenshots/recruiter-dashboard.png)

### Job Listings with Filtering
![Job Listings](screenshots/job-listings.png)

### AI Ranking Results
![AI Ranking](screenshots/ai-ranking.png)

</details>

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 👥 Authors

Created with ❤️ by [Your Name](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- **Google Gemini AI** - Advanced candidate analysis
- **Neon** - Cloud PostgreSQL database
- **Vercel** - Deployment platform
- **Prisma** - Database ORM

---

## 📞 Support

- 📧 Email: your-email@domain.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/ai-hiring-platform/issues)
- 📖 Docs: [Full Documentation](DEPLOYMENT_GUIDE_2026.md)
- 💬 Discord: [Join our community](https://discord.gg/your-invite)

---

## 🎯 Roadmap

- [ ] Email notifications
- [ ] Real-time updates (WebSockets)
- [ ] Advanced analytics dashboard
- [ ] Resume parsing (AI extraction)
- [ ] Interview scheduling
- [ ] Skill assessments
- [ ] Multi-language support
- [ ] Mobile apps (React Native)

---

<div align="center">

**⭐ Star this repo if you find it helpful! ⭐**

![GitHub stars](https://img.shields.io/github/stars/yourusername/ai-hiring-platform?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/ai-hiring-platform?style=social)

---

**Status:** ✅ Production Ready | **Version:** 1.0.0 | **Updated:** February 2026

Made with ❤️ using Gemini AI

</div>
