# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**HappyGotchaDays.com** - A platform for pet owners to celebrate and share their dogs' and cats' adoption anniversaries ("gotcha days"). This is exclusively focused on companion animals (dogs/cats) - NO human adoption content.

**Current State:** Full-stack application built and ready for deployment. Includes backend API (Cloudflare Worker with Hono), D1 database, R2 storage, KV sessions, Workers AI integration, and responsive PWA frontend.

## Project Architecture (Planned)

### Technology Stack
- **Frontend:** Vanilla JS/HTML/CSS served from Cloudflare Worker
- **Backend:** Cloudflare Worker using Hono framework
- **Database:** Cloudflare D1 (SQLite at edge)
- **Storage:** Cloudflare R2 for images/videos
- **Cache:** Cloudflare KV for sessions and frequently accessed data
- **AI:** Cloudflare Workers AI for image analysis and content moderation
- **Auth:** Custom JWT implementation using Cloudflare Secrets
- **Deploy:** GitHub Actions → Wrangler

### Planned File Structure
```
src/
├── index.js              # Main Worker entry point
├── routes/               # API routes
│   ├── auth.js          # Authentication endpoints
│   ├── pets.js          # Pet profile CRUD
│   ├── photos.js        # Photo upload/retrieval with R2
│   ├── social.js        # Likes, comments, follows
│   └── search.js        # Search and discovery
├── middleware/           # Auth, validation, rate limiting
├── db/                   # D1 query functions
├── ai/                   # Workers AI integrations
├── utils/                # Helper functions
└── frontend/             # HTML/CSS/JS
    ├── index.html
    ├── styles/
    └── scripts/
migrations/               # D1 database migrations
tests/
├── unit/
├── integration/
└── e2e/
```

## Core Features to Implement

1. User registration and authentication (JWT with KV sessions)
2. Pet profile creation (name, adoption date, breed, story)
3. Photo gallery with R2 storage
4. Timeline view of gotcha day celebrations
5. Social features (likes, comments, follows)
6. Annual reminders for upcoming gotcha days
7. Public/private profile settings
8. Search and discovery
9. AI-powered features (photo enhancement suggestions, story prompts)

## Database Schema (D1)

### Core Tables
- `users` - User accounts with email, username, password_hash
- `pets` - Pet profiles linked to users (name, species, breed, gotcha_date, adoption_story)
- `photos` - Photo metadata with R2 object keys
- `posts` - Gotcha day celebration posts
- `likes` - User likes on posts
- `comments` - Comments on posts
- `follows` - User follow relationships

All tables use TEXT PRIMARY KEY for IDs and INTEGER timestamps for dates.

## Key API Endpoints (Planned)

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Login with JWT generation
- `POST /api/auth/refresh` - Token refresh

### Pets
- `POST /api/pets` - Create pet profile
- `GET /api/pets/:id` - Get pet details
- `PUT /api/pets/:id` - Update pet profile
- `DELETE /api/pets/:id` - Delete pet profile
- `GET /api/users/:id/pets` - List user's pets

### Photos
- `POST /api/pets/:id/photos` - Upload photo to R2
- `GET /api/pets/:id/photos` - List pet photos
- `DELETE /api/photos/:id` - Delete photo
- `PUT /api/photos/:id` - Update photo metadata

### Social
- `POST /api/posts` - Create gotcha day post
- `GET /api/feed` - Get personalized feed
- `POST /api/posts/:id/like` - Like a post
- `POST /api/posts/:id/comment` - Comment on post
- `POST /api/users/:id/follow` - Follow user

## AI Integration (Workers AI)

### Models to Use
- `@cf/microsoft/resnet-50` - Breed detection
- `@cf/meta/llama-3.2-11b-vision-instruct` - Image descriptions and alt text
- `@cf/meta/llama-3.1-8b-instruct` - Story suggestions and celebration prompts

### Implementation Pattern
```javascript
const aiResponse = await env.AI.run(
  '@cf/microsoft/resnet-50',
  { image: imageArray }
);
```

## Security Requirements

1. **Authentication:** Password hashing with Web Crypto API, JWT tokens (1 hour access, 7 day refresh)
2. **Data Protection:** Validate all inputs, parameterized SQL queries, rate limiting on all endpoints
3. **Privacy:** Public/private profile options, user data deletion capability
4. **Headers:** Content Security Policy, CORS middleware

## Performance Targets

- Worker response time <100ms (excluding AI)
- D1 queries <50ms
- Images optimized <500KB
- Initial page load <2s
- Lazy loading for galleries

## Development Workflow (When Implemented)

### Local Development
```bash
wrangler dev                    # Run local dev server
wrangler d1 execute DB --local  # Run D1 queries locally
```

### Deployment Environments
- **Development:** Local with `wrangler dev`
- **Preview:** Automatic on PR creation
- **Production:** Manual approval after preview

### Testing
- Vitest for unit tests (targeting >80% coverage)
- Playwright for browser/E2E tests
- All critical paths must have tests
- Tests run in CI/CD pipeline

## Important Context

### Project Values
- Celebrate rescue and adoption as life-changing moments for pets
- Build community around pet adoption stories
- Focus exclusively on companion animals (dogs/cats)
- Create shareable, social-media-friendly experiences
- Leverage Cloudflare's edge compute and AI capabilities

### Market Context
- 4.2 million annual pet adoptions in the US
- 81% of pet parents celebrate gotcha days
- Target audience: Millennials (33% of pet owners), middle to upper-middle income
- Annual pet spending: $1,852 for dogs, $1,311 for cats

### Critical Boundary
This platform is **exclusively for pet (dog/cat) adoption celebrations**. The term "gotcha day" is controversial in child adoption contexts - 95% of adult adoptees oppose it. Any implementation must carefully avoid conflating pet and human adoption.

## Next Steps for Implementation

1. Initialize GitHub repository with proper structure
2. Set up Cloudflare account and resources (D1, R2, KV, Secrets)
3. Configure `wrangler.toml` with bindings
4. Create initial D1 schema and migrations
5. Set up CI/CD pipeline with GitHub Actions
6. Implement Hono framework with basic routing
7. Build authentication system
8. Develop pet profile CRUD operations
9. Integrate R2 for photo storage
10. Add social features and feed
11. Integrate Workers AI capabilities
12. Build frontend UI components

## References

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Cloudflare KV](https://developers.cloudflare.com/kv/)
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Hono Framework](https://hono.dev/)
