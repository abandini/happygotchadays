# HappyGotchaDays.com - Claude Code Orchestration Prompt

## Project Thesis

Build a joyful, user-friendly platform for pet owners to celebrate and share their dogs' and cats' adoption anniversaries ("gotcha days"). The site will enable pet parents to create profiles, upload photos, share stories, and connect with a community of fellow rescue pet adopters. The platform celebrates the 4.2 million annual pet adoptions in the US, serving the 81% of pet parents who actively celebrate these milestones.

**Core Values:**
- Celebrate rescue and adoption as life-changing moments for pets
- Build community around pet adoption stories
- Focus exclusively on companion animals (dogs/cats) - NO human adoption content
- Create shareable, social-media-friendly experiences
- Leverage Cloudflare's edge compute and AI capabilities for performance and features

**Technical Foundation:**
- Cloudflare Workers (NOT Pages) for edge compute
- D1 for relational data
- R2 for image/media storage
- KV for caching and session management
- Secrets for API keys and sensitive data
- Worker AI for image analysis, content moderation, story enhancement
- GitHub as single source of truth with automated deployments

---

## Architecture Overview

### Technology Stack
```
Frontend: Vanilla JS/HTML/CSS (served from Worker)
Backend: Cloudflare Worker (Hono framework recommended)
Database: D1 (SQLite at edge)
Storage: R2 (images, videos)
Cache: KV (sessions, frequently accessed data)
AI: Workers AI (image tagging, content suggestions)
Auth: Custom JWT implementation using Secrets
Deploy: GitHub Actions → Wrangler
```

### Key Features to Build
1. User registration and authentication
2. Pet profile creation (name, adoption date, breed, story)
3. Photo gallery with R2 storage
4. Timeline view of gotcha day celebrations
5. Social features (likes, comments, follows)
6. Annual reminders for upcoming gotcha days
7. Public/private profile settings
8. Search and discovery
9. AI-powered features (photo enhancement suggestions, story prompts)

---

## Agent Architecture

### Primary Orchestrator Agent
**Role:** Project manager coordinating all sub-agents, managing dependencies, ensuring cohesive architecture

**Responsibilities:**
- Maintain project roadmap and task dependencies
- Coordinate between specialized agents
- Resolve architectural conflicts
- Ensure consistent coding standards
- Manage GitHub repository structure
- Oversee deployment pipeline

---

### Sub-Agent 1: Infrastructure & DevOps Agent
**MCP Servers:** Cloudflare Developer Platform, Git

**Responsibilities:**
1. **Initial Setup**
   - Initialize GitHub repository structure
   - Configure Cloudflare account and resources
   - Set up wrangler.toml configuration
   - Create D1 database schema
   - Configure R2 buckets
   - Set up KV namespaces
   - Initialize Secrets management

2. **Database Schema Design**
   ```sql
   -- Users table
   -- Pets table with foreign key to users
   -- Photos table with R2 object keys
   -- Celebrations table (annual gotcha day posts)
   -- Likes, Comments, Follows tables
   -- Sessions table
   ```

3. **CI/CD Pipeline**
   - Create GitHub Actions workflow
   - Configure Wrangler deployments
   - Set up preview environments
   - Implement rollback procedures

4. **Monitoring & Logging**
   - Configure Worker analytics
   - Set up error tracking
   - Implement health checks

**Testing Requirements:**
- Verify all Cloudflare resources are properly created
- Test database migrations
- Validate GitHub Actions workflow
- Confirm environment variables and secrets work
- Test deployment to production and preview environments

---

### Sub-Agent 2: Backend API Agent
**MCP Servers:** Cloudflare Developer Platform, Git

**Responsibilities:**
1. **Core Worker Implementation**
   - Set up Hono framework routing
   - Implement middleware (auth, CORS, rate limiting)
   - Error handling and validation
   - Request/response formatting

2. **Authentication System**
   - User registration endpoint
   - Login with JWT generation
   - Session management with KV
   - Password hashing (use Web Crypto API)
   - Token refresh logic

3. **Pet Profile APIs**
   ```
   POST   /api/pets                - Create pet profile
   GET    /api/pets/:id           - Get pet details
   PUT    /api/pets/:id           - Update pet profile
   DELETE /api/pets/:id           - Delete pet profile
   GET    /api/users/:id/pets     - List user's pets
   ```

4. **Photo & Media APIs**
   ```
   POST   /api/pets/:id/photos    - Upload photo to R2
   GET    /api/pets/:id/photos    - List pet photos
   DELETE /api/photos/:id         - Delete photo
   PUT    /api/photos/:id         - Update photo metadata
   ```

5. **Social Features APIs**
   ```
   POST   /api/posts              - Create gotcha day post
   GET    /api/feed               - Get personalized feed
   POST   /api/posts/:id/like     - Like a post
   POST   /api/posts/:id/comment  - Comment on post
   POST   /api/users/:id/follow   - Follow user
   ```

6. **Search & Discovery**
   ```
   GET    /api/search             - Search pets/users
   GET    /api/discover           - Discover new pets
   GET    /api/trending           - Trending gotcha days
   ```

**Testing Requirements:**
- Unit tests for each endpoint
- Integration tests for full user flows
- Test authentication/authorization
- Validate D1 queries and transactions
- Test R2 upload/download with various file sizes
- Test rate limiting and error handling
- Load testing for concurrent requests

---

### Sub-Agent 3: AI Integration Agent
**MCP Servers:** Cloudflare Developer Platform

**Responsibilities:**
1. **Image Analysis Features**
   - Use @cf/microsoft/resnet-50 for breed detection
   - Use @cf/meta/llama-3.2-11b-vision-instruct for image descriptions
   - Implement content moderation for uploaded photos
   - Generate alt text for accessibility

2. **Content Enhancement**
   - Use @cf/meta/llama-3.1-8b-instruct for story suggestions
   - Generate celebration message templates
   - Provide prompts for users writing their gotcha day stories

3. **Smart Features**
   - Suggest similar pets for discovery
   - Recommend hashtags for posts
   - Auto-tag photos with pet activities

**Implementation Pattern:**
```javascript
// Example using Workers AI
const aiResponse = await env.AI.run(
  '@cf/microsoft/resnet-50',
  { image: imageArray }
);
```

**Testing Requirements:**
- Test each AI model with sample inputs
- Validate response parsing
- Test error handling when AI fails
- Verify content moderation accuracy
- Test performance/latency of AI calls

---

### Sub-Agent 4: Frontend Development Agent
**MCP Servers:** Git, Playwright (for browser testing)

**Responsibilities:**
1. **Core UI Components**
   - Responsive navigation
   - Pet profile cards
   - Photo gallery with lightbox
   - Timeline view for celebrations
   - Forms (registration, profile creation)
   - Feed/discovery interface

2. **Authentication UI**
   - Login/signup modals
   - Password reset flow
   - Profile settings

3. **Photo Upload Interface**
   - Drag-and-drop upload
   - Image preview before upload
   - Progress indicators
   - Multi-photo batch upload

4. **Social Interactions**
   - Like/unlike buttons
   - Comment threads
   - Follow buttons
   - Share functionality

5. **Progressive Enhancement**
   - Client-side routing for SPA feel
   - Optimistic UI updates
   - Image lazy loading
   - Service worker for offline capability (optional)

**Design Principles:**
- Mobile-first responsive design
- Accessibility (WCAG 2.1 AA)
- Fast initial page load (<2s)
- Joyful, pet-friendly aesthetic
- Clear calls-to-action

**Testing Requirements:**
- Playwright browser tests for all user flows
- Test responsive design at multiple breakpoints
- Validate accessibility with axe-core
- Test form validations
- Test image upload flow
- Cross-browser testing (Chrome, Firefox, Safari)

---

### Sub-Agent 5: Data & Migration Agent
**MCP Servers:** Cloudflare Developer Platform, Git

**Responsibilities:**
1. **Database Migrations**
   - Create versioned migration scripts
   - Implement rollback procedures
   - Seed initial data (breeds, example profiles)

2. **Schema Design**
   ```sql
   CREATE TABLE users (
     id TEXT PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     username TEXT UNIQUE NOT NULL,
     password_hash TEXT NOT NULL,
     created_at INTEGER NOT NULL,
     bio TEXT,
     avatar_url TEXT
   );

   CREATE TABLE pets (
     id TEXT PRIMARY KEY,
     user_id TEXT NOT NULL,
     name TEXT NOT NULL,
     species TEXT NOT NULL, -- 'dog' or 'cat'
     breed TEXT,
     gotcha_date TEXT NOT NULL, -- ISO date
     adoption_story TEXT,
     created_at INTEGER NOT NULL,
     FOREIGN KEY (user_id) REFERENCES users(id)
   );

   CREATE TABLE photos (
     id TEXT PRIMARY KEY,
     pet_id TEXT NOT NULL,
     r2_object_key TEXT NOT NULL,
     caption TEXT,
     uploaded_at INTEGER NOT NULL,
     FOREIGN KEY (pet_id) REFERENCES pets(id)
   );

   CREATE TABLE posts (
     id TEXT PRIMARY KEY,
     pet_id TEXT NOT NULL,
     user_id TEXT NOT NULL,
     content TEXT NOT NULL,
     created_at INTEGER NOT NULL,
     FOREIGN KEY (pet_id) REFERENCES pets(id),
     FOREIGN KEY (user_id) REFERENCES users(id)
   );

   CREATE TABLE likes (
     user_id TEXT NOT NULL,
     post_id TEXT NOT NULL,
     created_at INTEGER NOT NULL,
     PRIMARY KEY (user_id, post_id),
     FOREIGN KEY (user_id) REFERENCES users(id),
     FOREIGN KEY (post_id) REFERENCES posts(id)
   );

   CREATE TABLE comments (
     id TEXT PRIMARY KEY,
     post_id TEXT NOT NULL,
     user_id TEXT NOT NULL,
     content TEXT NOT NULL,
     created_at INTEGER NOT NULL,
     FOREIGN KEY (post_id) REFERENCES posts(id),
     FOREIGN KEY (user_id) REFERENCES users(id)
   );

   CREATE TABLE follows (
     follower_id TEXT NOT NULL,
     following_id TEXT NOT NULL,
     created_at INTEGER NOT NULL,
     PRIMARY KEY (follower_id, following_id),
     FOREIGN KEY (follower_id) REFERENCES users(id),
     FOREIGN KEY (following_id) REFERENCES users(id)
   );
   ```

3. **Data Validation**
   - Input sanitization
   - SQL injection prevention
   - Data integrity checks

**Testing Requirements:**
- Test all migrations up and down
- Verify foreign key constraints
- Test indexes for performance
- Validate data types and constraints
- Test edge cases (long strings, special characters)

---

### Sub-Agent 6: QA & Testing Agent
**MCP Servers:** Git, Playwright

**Responsibilities:**
1. **Unit Testing Strategy**
   - Test all API endpoints
   - Test database operations
   - Test authentication logic
   - Test AI integrations
   - Test utility functions

2. **Integration Testing**
   - End-to-end user flows
   - Multi-step processes (registration → profile → upload)
   - Social interaction flows
   - Search and discovery

3. **Performance Testing**
   - Load testing with simulated users
   - R2 upload/download performance
   - D1 query performance
   - Worker cold start times
   - Time to first byte (TTFB)

4. **Security Testing**
   - Authentication bypass attempts
   - SQL injection attempts
   - XSS prevention
   - CSRF protection
   - Rate limiting effectiveness

5. **Regression Testing**
   - Automated test suite runs on every commit
   - Visual regression testing
   - API contract testing

**Testing Framework:**
```javascript
// Use Vitest for unit tests
// Use Playwright for browser tests
// Use custom scripts for load testing
```

**Testing Requirements:**
- Achieve >80% code coverage
- All critical paths must have tests
- Tests must run in CI/CD pipeline
- Failed tests block deployment
- Performance benchmarks documented

---

## Development Phases

### Phase 1: Foundation (Week 1)
**Owner:** Infrastructure & DevOps Agent + Data & Migration Agent

**Tasks:**
- [ ] Create GitHub repository
- [ ] Set up Cloudflare account and resources
- [ ] Initialize D1 database with schema
- [ ] Create R2 buckets
- [ ] Set up KV namespaces
- [ ] Configure wrangler.toml
- [ ] Set up CI/CD pipeline
- [ ] Create initial project structure

**QA Checkpoints:**
- All Cloudflare resources accessible
- Database schema applied successfully
- GitHub Actions workflow runs
- Local development environment works

---

### Phase 2: Core Backend (Week 2)
**Owner:** Backend API Agent

**Tasks:**
- [ ] Implement Hono routing framework
- [ ] Build authentication system
- [ ] Create user registration/login endpoints
- [ ] Implement pet profile CRUD operations
- [ ] Build photo upload/retrieval with R2
- [ ] Implement session management with KV

**QA Checkpoints:**
- All endpoints return correct status codes
- Authentication prevents unauthorized access
- Photos upload and retrieve correctly
- Database transactions work properly
- Rate limiting functions correctly

---

### Phase 3: Frontend Core (Week 3)
**Owner:** Frontend Development Agent

**Tasks:**
- [ ] Create responsive layout
- [ ] Build registration/login UI
- [ ] Create pet profile form
- [ ] Implement photo upload interface
- [ ] Build pet profile view
- [ ] Create basic navigation

**QA Checkpoints:**
- UI responsive on mobile/tablet/desktop
- Forms validate input
- Photo upload shows progress
- Authentication flows work end-to-end
- Accessibility scan passes

---

### Phase 4: Social Features (Week 4)
**Owner:** Backend API Agent + Frontend Development Agent

**Tasks:**
- [ ] Implement posts/feed API
- [ ] Build likes/comments functionality
- [ ] Create follow system
- [ ] Build feed UI
- [ ] Implement social interaction components
- [ ] Create discovery/search features

**QA Checkpoints:**
- Social interactions persist correctly
- Feed loads efficiently
- Search returns relevant results
- Real-time updates work (or polling if no websockets)

---

### Phase 5: AI Enhancement (Week 5)
**Owner:** AI Integration Agent

**Tasks:**
- [ ] Integrate image analysis
- [ ] Implement content moderation
- [ ] Add story suggestion feature
- [ ] Build breed detection
- [ ] Create auto-generated alt text

**QA Checkpoints:**
- AI responses are accurate
- Content moderation catches inappropriate images
- Breed detection works reasonably well
- AI features enhance UX without blocking critical flows

---

### Phase 6: Polish & Launch (Week 6)
**Owner:** All Agents

**Tasks:**
- [ ] Performance optimization
- [ ] Security audit
- [ ] Final bug fixes
- [ ] Documentation
- [ ] Launch preparation
- [ ] Monitoring setup

**QA Checkpoints:**
- All tests passing
- Performance benchmarks met
- Security scan clean
- Documentation complete
- Launch checklist complete

---

## Critical Requirements

### Security
1. **Authentication:**
   - Use bcrypt or argon2 for password hashing
   - JWT tokens with reasonable expiry (1 hour access, 7 day refresh)
   - Secure session management
   - HTTPS only (Cloudflare provides this)

2. **Data Protection:**
   - Validate all inputs
   - Parameterized SQL queries (D1 supports this)
   - Rate limiting on all endpoints
   - Content Security Policy headers

3. **Privacy:**
   - Public/private profile options
   - User data deletion capability
   - No tracking without consent

### Performance
- Worker response time <100ms (excluding AI)
- D1 queries <50ms
- R2 upload/download efficient
- Images optimized (<500KB)
- Lazy loading for galleries

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader friendly
- Alt text for all images
- Color contrast ratios

---

## File Structure

```
happygotchadays/
├── src/
│   ├── index.js              # Main Worker entry
│   ├── routes/               # API routes
│   │   ├── auth.js
│   │   ├── pets.js
│   │   ├── photos.js
│   │   ├── social.js
│   │   └── search.js
│   ├── middleware/           # Auth, validation, etc.
│   ├── db/                   # D1 queries
│   ├── ai/                   # Workers AI integrations
│   ├── utils/                # Helper functions
│   └── frontend/             # HTML/CSS/JS
│       ├── index.html
│       ├── styles/
│       └── scripts/
├── migrations/               # D1 migrations
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── wrangler.toml
├── package.json
└── README.md
```

---

## Deployment Strategy

### Environments
1. **Development:** Local with `wrangler dev`
2. **Preview:** Automatic on PR creation
3. **Production:** Manual approval after preview

### GitHub Actions Workflow
```yaml
name: Deploy
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm test
  
  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npx wrangler deploy --env preview
  
  deploy-production:
    if: github.event_name == 'push'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npx wrangler deploy
```

---

## Success Metrics

### Technical
- 99.9% uptime
- <100ms p95 response time
- <2s initial page load
- >80% test coverage
- Zero critical security issues

### User Experience
- <3 clicks to create pet profile
- Photo upload success rate >95%
- Mobile-responsive on all devices
- Accessible to screen readers

### Business
- Track registered users
- Track pet profiles created
- Track daily active users
- Track photo uploads
- Track social interactions

---

## Documentation Requirements

Each agent must document:
1. API endpoints with request/response examples
2. Database schema with relationships
3. Environment variables needed
4. Deployment procedures
5. Troubleshooting guides
6. Code comments for complex logic

---

## Agent Communication Protocol

1. **Daily Standup (in comments):**
   - What did you complete?
   - What are you working on?
   - Any blockers?

2. **Dependency Management:**
   - Agents declare dependencies on other agents' work
   - Orchestrator ensures dependencies met before proceeding

3. **Code Review:**
   - All code reviewed by QA agent
   - Critical paths reviewed by Orchestrator

4. **Issue Tracking:**
   - Use GitHub issues for bugs/features
   - Label by agent responsible
   - Link commits to issues

---

## Getting Started

**Orchestrator Agent - Start Here:**

1. Review this entire document
2. Validate Cloudflare account access using `Cloudflare Developer Platform:accounts_list`
3. Create initial GitHub repository structure using Git MCP
4. Assign Phase 1 tasks to Infrastructure & DevOps Agent
5. Set up project tracking system
6. Initialize all Cloudflare resources (D1, R2, KV)
7. Coordinate with all agents to confirm understanding
8. Begin Phase 1 execution

**Success Criteria:**
- All agents understand their roles
- GitHub repository initialized
- Cloudflare resources created
- CI/CD pipeline working
- First test passing

---

## References

- Cloudflare Workers: https://developers.cloudflare.com/workers/
- Cloudflare D1: https://developers.cloudflare.com/d1/
- Cloudflare R2: https://developers.cloudflare.com/r2/
- Cloudflare KV: https://developers.cloudflare.com/kv/
- Cloudflare AI: https://developers.cloudflare.com/workers-ai/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/

---

## Final Note

This project celebrates the joy pets bring to our lives through adoption. Every line of code should reflect that joy while maintaining professional standards. Build something that makes pet parents smile when they visit, that loads fast, works on any device, and creates a warm community around rescue pets.

Focus exclusively on companion animals (dogs and cats). This is about celebrating happy pets in loving homes.