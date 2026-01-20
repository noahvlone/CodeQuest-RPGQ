# 🎮 CodeQuest RPG

<div align="center">

![CodeQuest RPG](https://img.shields.io/badge/CodeQuest-RPG-00ff88?style=for-the-badge&logo=gamepad&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Express](https://img.shields.io/badge/Express-4.18-black?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green?style=for-the-badge&logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)

**The only RPG where your code is your sword.**

*Conquer bugs, build systems, and become a legend in Neo-Jakarta 2077.*

</div>

---

## 🚀 Features

### 🎯 Core Gameplay
- **Real Coding Challenges** - Solve actual JavaScript/Python problems
- **Character Classes** - Frontend Warrior, Backend Mage, or Fullstack Ranger
- **Progression System** - Level up, earn XP & Gold, unlock new challenges
- **AI Mentor** - Get real-time code reviews and hints from "The Architect"

### 🛠️ Technical Features
- **Full-Stack Architecture** - Next.js 14 + Express.js + MongoDB
- **Secure Code Execution** - Sandboxed via Piston API
- **AI Integration** - OpenRouter API with Qwen model
- **GitHub OAuth** - Login with your GitHub account
- **Responsive Design** - Works on desktop and mobile

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **State** | Zustand |
| **Code Editor** | Monaco Editor |
| **Animations** | Framer Motion |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB with Mongoose |
| **Auth** | JWT + GitHub OAuth |
| **AI** | OpenRouter API (Qwen model) |
| **Code Execution** | Piston API |

---

## 📦 Project Structure

```
CodeQuest-RPG/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── config/          # Database & env config
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth, validation, rate limiting
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── app.ts           # Entry point
│   │   └── seed.ts          # Database seeding
│   └── package.json
│
├── frontend/                # Next.js 14 App
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # Reusable components
│   │   ├── lib/             # API client, utilities
│   │   └── store/           # Zustand store
│   └── package.json
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/noahvlone/codequest-rpg.git
cd codequest-rpg
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file (copy from `.env.example`):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/codequest
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_MODEL=qwen/qwen-2.5-vl-7b-instruct:free
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback
FRONTEND_URL=http://localhost:3000
PISTON_API_URL=https://emkc.org/api/v2/piston
```

Seed the database:

```bash
npm run db:seed
```

Start the server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

### 4. Open the App

Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔐 GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: CodeQuest RPG
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:5000/api/auth/github/callback`
4. Copy the **Client ID** and **Client Secret** to your `.env`

---

## 🌐 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL` = Your backend URL

### Backend (Railway)

1. Create a new project on [Railway](https://railway.app)
2. Add MongoDB (or use MongoDB Atlas)
3. Deploy from GitHub
4. Set environment variables in Railway dashboard

---

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with email/password |
| GET | `/api/auth/github` | Initiate GitHub OAuth |
| GET | `/api/auth/me` | Get current user |

### Characters
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/characters` | Create character |
| GET | `/api/characters/active` | Get active character |
| GET | `/api/characters/progress` | Get challenge progress |

### Challenges
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/challenges` | Get all challenges |
| GET | `/api/challenges/:id` | Get challenge details |
| POST | `/api/challenges/:id/execute` | Execute code |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | Chat with AI mentor |
| POST | `/api/ai/review` | Get code review |
| POST | `/api/ai/hint` | Get hint |

### Shop & Leaderboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shop/items` | Get shop items |
| POST | `/api/shop/purchase/:itemId` | Purchase item |
| GET | `/api/leaderboard` | Get leaderboard |

---

## 🎮 Game Classes

| Class | Specialty | Starting Stats |
|-------|-----------|----------------|
| **Frontend Warrior** | DOM manipulation, CSS, UI | CSS: 20, JS: 15, Python: 5 |
| **Backend Mage** | Server-side, APIs, Databases | Python: 15, DB: 15, JS: 10 |
| **Fullstack Ranger** | Jack of all trades | Balanced stats |

---

## 📝 Challenge Categories

1. **Syntax Valley** (Easy) - Basic syntax and variables
2. **Logic Labyrinth** (Medium) - Loops, conditions, functions
3. **Algorithm Abyss** (Hard) - Sorting, searching, optimization
4. **Data Structure Dungeon** (Expert) - Stacks, queues, trees

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built for developers who want to level up their skills**

*© 2077 Neotech Industries*

</div>
