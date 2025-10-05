# Setup Guide for HappyGotchaDays.com

This guide walks you through deploying HappyGotchaDays to Cloudflare Workers.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Cloudflare account created (free tier works)
- [ ] GitHub account

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Authenticate with Cloudflare

```bash
npx wrangler login
```

This will open your browser to authenticate with Cloudflare.

### 3. Create Cloudflare Resources

#### Create D1 Database

```bash
npx wrangler d1 create gotchadays-db
```

**Important:** Copy the output which looks like:
```
[[d1_databases]]
binding = "DB"
database_name = "gotchadays-db"
database_id = "abc123-def456-ghi789"
```

Update `wrangler.toml` line 21 with your actual `database_id`.

#### Create R2 Bucket

```bash
npx wrangler r2 bucket create gotchadays-photos
```

The bucket name is already configured in `wrangler.toml`.

#### Create KV Namespaces

```bash
# Create SESSIONS namespace
npx wrangler kv:namespace create "SESSIONS"
```

Copy the `id` from the output and update `wrangler.toml` line 29.

```bash
# Create CACHE namespace
npx wrangler kv:namespace create "CACHE"
```

Copy the `id` from the output and update `wrangler.toml` line 33.

### 4. Set Up Database

Run the initial migration:

```bash
# For local testing
npx wrangler d1 execute gotchadays-db --local --file=./migrations/0001_initial_schema.sql

# For production
npx wrangler d1 execute gotchadays-db --remote --file=./migrations/0001_initial_schema.sql
```

### 5. Configure Secrets

Generate and set your JWT secret:

```bash
# Generate a random secret (save this somewhere safe!)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Set it in Cloudflare
npx wrangler secret put JWT_SECRET
# Paste the secret when prompted
```

### 6. Test Locally

```bash
npm run dev
```

Visit `http://localhost:8787` to see your app running locally.

### 7. Deploy to Production

```bash
npm run deploy
```

### 8. Configure Custom Domain

1. Go to Cloudflare Dashboard → Workers & Pages
2. Click on your `happygotchadays-production` worker
3. Go to **Settings** → **Triggers** → **Custom Domains**
4. Add `happygotchadays.com` (your domain must be added to Cloudflare first)

### 9. Set Up GitHub Actions (Optional but Recommended)

1. Get your Cloudflare API Token:
   - Go to Cloudflare Dashboard → My Profile → API Tokens
   - Create Token → Use template "Edit Cloudflare Workers"
   - Copy the token

2. Get your Account ID:
   - Go to Cloudflare Dashboard → Workers & Pages
   - Copy the Account ID from the right sidebar

3. Add secrets to GitHub:
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add `CLOUDFLARE_API_TOKEN` with your API token
   - Add `CLOUDFLARE_ACCOUNT_ID` with your account ID

Now every push to `main` will automatically deploy!

## Verification Checklist

- [ ] Local dev server runs without errors
- [ ] Can register a new user
- [ ] Can login with the user
- [ ] Can create a pet profile
- [ ] Can upload a photo
- [ ] Can create a post
- [ ] Production deployment successful
- [ ] Custom domain is working

## Troubleshooting

### "Module not found" errors

Make sure you've run `npm install` and all dependencies are installed.

### D1 database errors

Verify your database_id in `wrangler.toml` matches the one from `wrangler d1 create` output.

### KV namespace errors

Verify your KV namespace IDs in `wrangler.toml` match those from `wrangler kv:namespace create` output.

### JWT_SECRET not found

Make sure you've set the secret: `npx wrangler secret put JWT_SECRET`

### R2 bucket not found

Verify the bucket was created: `npx wrangler r2 bucket list`

### Workers AI errors

Workers AI is automatically available on paid plans. Free tier may have limitations.

## Next Steps

1. **Add Content**: Create your first pet profile and post
2. **Customize**: Update colors, logo, and content in the frontend files
3. **Monitor**: Check Cloudflare Analytics for usage and performance
4. **Scale**: Upgrade Cloudflare plan as needed for more traffic

## Support Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- [Hono Framework](https://hono.dev/)

## Cost Estimate

With Cloudflare's free tier:
- **Workers**: 100,000 requests/day
- **D1**: 5 GB storage, 5 million reads/day
- **R2**: 10 GB storage, 1 million reads/month
- **KV**: 100,000 reads/day, 1,000 writes/day

This should be sufficient for initial launch. As you grow, Cloudflare has very affordable paid plans.

Good luck with your launch! 🐾
