# HappyGotchaDays.com 🐾

A joyful, user-friendly Progressive Web App (PWA) for pet owners to celebrate and share their dogs' and cats' adoption anniversaries ("gotcha days"). Built on Cloudflare Workers with edge compute, D1 database, R2 storage, KV caching, and Workers AI.

**Focus:** Exclusively for companion animals (dogs/cats) - NO human adoption content.

## 🎯 Project Overview

HappyGotchaDays enables pet parents to:
- Create profiles for their rescued pets
- Share adoption anniversary celebrations
- Upload and manage pet photos
- Connect with fellow rescue pet adopters
- Discover and celebrate upcoming gotcha days
- Get AI-powered content suggestions and image analysis

## 🏗️ Architecture

### Technology Stack

- **Frontend:** Vanilla JavaScript, HTML, CSS (served from Worker)
- **Backend:** Cloudflare Workers with Hono framework
- **Database:** Cloudflare D1 (SQLite at edge)
- **Storage:** Cloudflare R2 (images/media)
- **Cache:** Cloudflare KV (sessions, frequently accessed data)
- **AI:** Cloudflare Workers AI
  - `@cf/microsoft/resnet-50` - Breed detection
  - `@cf/llava-hf/llava-1.5-7b-hf` - Image descriptions and moderation
  - `@cf/meta/llama-3.1-8b-instruct` - Content generation
- **Auth:** Custom JWT with KV sessions
- **Deployment:** GitHub Actions → Wrangler
- **Domain:** happygotchadays.com

### Key Features

1. **User Management**
   - Registration and authentication with JWT
   - Session management via KV
   - User profiles with avatars and bios

2. **Pet Profiles**
   - CRUD operations for pet information
   - Track gotcha date (adoption anniversary)
   - Public/private profile settings
   - Photo galleries

3. **Social Features**
   - Create gotcha day celebration posts
   - Like and comment on posts
   - Follow other users
   - Personalized feed

4. **Discovery**
   - Search pets and users
   - Discover new pets
   - Upcoming gotcha day calendar

5. **AI Features**
   - Image analysis and breed detection
   - Auto-generated photo descriptions
   - Story prompts for adoption narratives
   - Hashtag suggestions
   - Content moderation

6. **PWA Capabilities**
   - Offline functionality with Service Worker
   - Installable on mobile devices
   - Fast, responsive design

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Cloudflare account ([sign up free](https://dash.cloudflare.com/sign-up))
- Wrangler CLI
- Git

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gotcha_days
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Authenticate Wrangler with Cloudflare**
   ```bash
   npx wrangler login
   ```

### Cloudflare Resources Setup

4. **Create D1 Database**
   ```bash
   npx wrangler d1 create gotchadays-db
   ```

   Copy the `database_id` from the output and update `wrangler.toml`:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "gotchadays-db"
   database_id = "YOUR_DATABASE_ID_HERE"
   ```

5. **Run Database Migrations**
   ```bash
   # For local development
   npm run db:migrate:local

   # For production
   npm run db:migrate
   ```

6. **Create R2 Bucket**
   ```bash
   npx wrangler r2 bucket create gotchadays-photos
   ```

7. **Create KV Namespaces**
   ```bash
   # Create SESSIONS namespace
   npx wrangler kv:namespace create "SESSIONS"

   # Create CACHE namespace
   npx wrangler kv:namespace create "CACHE"
   ```

   Update `wrangler.toml` with the namespace IDs from the output.

8. **Set Secrets**
   ```bash
   # Generate a strong JWT secret (or use your own)
   npx wrangler secret put JWT_SECRET
   # Enter your secret when prompted
   ```

### Local Development

9. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:8787`

### Deployment

10. **Deploy to Production**
    ```bash
    npm run deploy
    ```

## 📁 Project Structure

```
gotcha_days/
├── src/
│   ├── index.js              # Main Worker entry point
│   ├── routes/               # API route handlers
│   │   ├── auth.js          # Authentication endpoints
│   │   ├── pets.js          # Pet profile CRUD
│   │   ├── photos.js        # Photo upload/retrieval
│   │   ├── social.js        # Social features
│   │   └── search.js        # Search and discovery
│   ├── middleware/           # Middleware functions
│   │   ├── auth.js          # JWT authentication
│   │   └── static.js        # Static file serving
│   ├── ai/                   # Workers AI integrations
│   │   ├── image-analysis.js
│   │   └── content-generation.js
│   ├── utils/                # Utility functions
│   │   ├── id.js            # ID generation
│   │   ├── password.js      # Password hashing
│   │   └── jwt.js           # JWT utilities
│   └── frontend/             # Frontend assets (as JS exports)
│       ├── index.html.js
│       ├── styles/
│       │   └── main.css.js
│       ├── scripts/
│       │   └── app.js.js
│       ├── manifest.json.js
│       └── sw.js.js
├── migrations/               # D1 database migrations
│   └── 0001_initial_schema.sql
├── tests/                    # Test files
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions CI/CD
├── wrangler.toml            # Cloudflare Workers configuration
├── package.json
├── CLAUDE.md                # AI assistant guidance
└── README.md
```

## 🔧 Configuration

### Environment Variables (Secrets)

Set via Wrangler:
```bash
npx wrangler secret put JWT_SECRET
```

### wrangler.toml

Key configurations:
- **D1 Database:** `gotchadays-db`
- **R2 Bucket:** `gotchadays-photos`
- **KV Namespaces:** `SESSIONS`, `CACHE`
- **Workers AI:** Automatically bound
- **Custom Domain:** `happygotchadays.com`

## 🎨 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Pets
- `POST /api/pets` - Create pet profile
- `GET /api/pets/:id` - Get pet details
- `PUT /api/pets/:id` - Update pet profile
- `DELETE /api/pets/:id` - Delete pet profile
- `GET /api/pets/user/:userId` - Get user's pets

### Photos
- `POST /api/photos/upload` - Upload photo to R2
- `GET /api/photos/:id` - Get photo metadata
- `GET /api/photos/:id/image` - Get photo file
- `DELETE /api/photos/:id` - Delete photo
- `GET /api/photos/pet/:petId` - Get pet's photos

### Social
- `POST /api/social/posts` - Create post
- `GET /api/social/feed` - Get personalized feed
- `POST /api/social/posts/:id/like` - Like post
- `DELETE /api/social/posts/:id/like` - Unlike post
- `POST /api/social/posts/:id/comment` - Comment on post
- `GET /api/social/posts/:id/comments` - Get comments
- `POST /api/social/follow/:userId` - Follow user
- `DELETE /api/social/follow/:userId` - Unfollow user

### Search
- `GET /api/search?q=query&type=all` - Search pets/users
- `GET /api/search/discover` - Discover pets
- `GET /api/search/upcoming-gotcha-days` - Upcoming anniversaries

## 🤖 AI Features

### Image Analysis
```javascript
import { detectBreed, generateImageDescription, moderateImage } from './ai/image-analysis.js';
```

### Content Generation
```javascript
import { generateStoryPrompts, generateCelebrationMessage, suggestHashtags } from './ai/content-generation.js';
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

## 🚢 GitHub Actions CI/CD

The repository includes automated deployment workflows:

1. **On Pull Request:** Runs tests and deploys to preview environment
2. **On Push to Main:** Runs tests and deploys to production

### Required GitHub Secrets

Set these in your repository settings:
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with Workers permissions
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

## 📊 Database Schema

See `migrations/0001_initial_schema.sql` for the complete schema including:
- `users` - User accounts
- `pets` - Pet profiles
- `photos` - Photo metadata (files stored in R2)
- `posts` - Gotcha day celebration posts
- `likes` - Post likes
- `comments` - Post comments
- `follows` - User follows
- `reminders` - Upcoming gotcha day reminders

## 🎯 Performance Targets

- Worker response time: <100ms (excluding AI)
- D1 queries: <50ms
- Images optimized: <500KB
- Initial page load: <2s
- PWA install ready

## 🔒 Security

- Password hashing with Web Crypto API
- JWT authentication with 1-hour expiration
- KV session management
- Input validation on all endpoints
- SQL injection protection via parameterized queries
- Rate limiting (implement via Cloudflare)
- HTTPS only (automatic with Cloudflare)

## 🌟 Key Differentiators

1. **Edge-First Architecture** - Global performance with Cloudflare's edge network
2. **AI-Powered** - Image analysis, content suggestions, breed detection
3. **Pet-Focused** - Exclusively for companion animals (dogs/cats)
4. **Community-Driven** - Social features connecting rescue pet families
5. **PWA** - Installable, offline-capable mobile experience

## 📝 Development Commands

```bash
# Development
npm run dev                    # Start local dev server
npm run deploy                 # Deploy to production
npm run deploy:preview         # Deploy to preview

# Database
npm run db:migrate             # Run migrations (remote)
npm run db:migrate:local       # Run migrations (local)

# Testing
npm test                       # Run tests
npm run test:coverage          # Run tests with coverage
```

## 🤝 Contributing

This project celebrates rescue pets and their families. Every contribution should reflect that joy while maintaining professional standards.

## 📄 License

MIT

## 🐕 About Gotcha Days

"Gotcha Day" celebrates the anniversary when a rescue pet joins their forever family. With 4.2 million annual pet adoptions in the US and 81% of pet parents celebrating these milestones, HappyGotchaDays provides a dedicated platform for sharing these special moments.

**Note:** This platform is exclusively for pet adoptions. The term has different connotations in child adoption contexts, which we intentionally avoid.

---

Built with ❤️ for rescue pets and their families
