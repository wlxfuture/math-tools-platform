# Math Tools Platform - Complete Deployment Guide

## 📦 Project Structure

```
math-tool/
│
├── public/                              # Cloudflare Pages (frontend)
│   ├── index.html                       # Dashboard homepage
│   ├── tools/
│   │   ├── quantile.html               # Quantile Calculator tool page
│   │   ├── statistics.html             # Statistics Calculator tool page
│   │   ├── matrix.html                 # Matrix Calculator tool page
│   │   └── linear-transform.html       # Linear Transform Visualizer tool page
│   │
│   └── assets/
│       ├── styles.css                  # Shared responsive styling (600+ lines)
│       ├── theme.js                    # Dark/light theme manager
│       └── tracker.js                  # Analytics tracking client library
│
├── worker/
│   └── index.js                         # Cloudflare Workers API (200+ lines)
│
├── wrangler.toml                        # Cloudflare configuration
├── package.json                         # NPM scripts and dependencies
├── README.md                            # User documentation
└── DEPLOYMENT.md                        # This file

```

## 🚀 Quick Start (5 minutes)

### 1. Prerequisites
```bash
# Install Node.js 18+ from https://nodejs.org
# Install Wrangler globally
npm install -g wrangler

# Verify installation
wrangler --version
node --version
```

### 2. Login to Cloudflare
```bash
wrangler login
# Opens browser to authorize Cloudflare account
```

### 3. Create KV Namespace
```bash
cd "e:\我的坚果云\html\math tool"

# Create production KV namespace
wrangler kv:namespace create STATS

# Create preview namespace for local testing
wrangler kv:namespace create STATS --preview
```

**Output will look like:**
```
✓ Successfully created namespace with id: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
✓ Add the following to your wrangler.toml:

[[kv_namespaces]]
binding = "STATS"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
preview_id = "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
```

### 4. Update wrangler.toml
Add the KV namespace IDs from step 3 to `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "STATS"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"          # Paste production ID here
preview_id = "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"  # Paste preview ID here

[env.production]
kv_namespaces = [
  { binding = "STATS", id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", preview_id = "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy" }
]
```

### 5. Test Locally
```bash
# Start development server (http://localhost:8788)
wrangler pages dev public --local

# In another terminal, test API
curl http://localhost:8788/api/health
curl -X POST http://localhost:8788/api/track -H "Content-Type: application/json" -d '{"toolId":"quantile"}'
```

### 6. Deploy
```bash
wrangler pages deploy public --project-name math-tools-platform
```

Done! Your site is now live 🎉

---

## 📋 Complete Setup Checklist

- [ ] Install Node.js 18+
- [ ] Install Wrangler CLI: `npm install -g wrangler`
- [ ] Run: `wrangler login`
- [ ] Create KV namespaces: `wrangler kv:namespace create STATS` (twice)
- [ ] Update `wrangler.toml` with KV IDs
- [ ] Test locally: `wrangler dev`
- [ ] Deploy: `wrangler deploy`
- [ ] Deploy Pages: `wrangler pages deploy public`
- [ ] Verify dashboard loads
- [ ] Test each tool (quantile, statistics, matrix, linear-transform)
- [ ] Check click tracking works
- [ ] Test dark mode toggle

---

## 🔧 Configuration Details

### wrangler.toml Explained

```toml
# Worker name (change if deploying multiple instances)
name = "math-tools-api"

# Worker type
type = "service"

# Main worker file
main = "worker/index.js"

# Cloudflare API version
compatibility_date = "2024-12-16"

# Routes for the Worker (update with your domain)
routes = [
  { pattern = "api.math-tools.local/*", zone_id = "" },
  { pattern = "localhost:8787/api/*", custom_domain = false }
]

# KV binding configuration
[[kv_namespaces]]
binding = "STATS"                    # Name used in worker code
id = "YOUR_KV_NAMESPACE_ID"         # Production namespace
preview_id = "YOUR_PREVIEW_KV_ID"   # Preview/local namespace

# Production environment overrides
[env.production]
kv_namespaces = [
  { binding = "STATS", id = "PROD_ID", preview_id = "PREV_ID" }
]
```

### Environment Variables

Create `.env` file (optional, for local development):
```env
STATS_KV_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STATS_PREVIEW_KV_ID=yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

---

## 📚 File-by-File Explanation

### Frontend (public/)

#### index.html (Dashboard)
- Displays 4 tool cards with icons and click counts
- Fetches statistics from API on load
- Auto-tracks clicks via data-track-id attributes
- Responsive grid layout (1 column on mobile, 4 on desktop)

#### tools/*.html (Tool Pages)
- **quantile.html**: Calculates percentiles using linear interpolation
- **statistics.html**: Computes mean, median, std dev, variance, min, max, range
- **matrix.html**: 3x3 matrix operations (determinant, trace)
- **linear-transform.html**: 2D transform visualization with canvas

#### assets/styles.css
- **~600 lines** of responsive CSS
- CSS Variables for theming (--bg-primary, --text-primary, etc.)
- Mobile-first responsive design
- Smooth transitions and animations
- Dark mode support with [data-theme="dark"]

#### assets/theme.js
- Detects system color scheme preference
- Persists theme choice to localStorage
- Updates HTML attribute for CSS theming
- Exports `themeManager` global object

#### assets/tracker.js
- `AnalyticsTracker` class for API communication
- `trackClick(toolId)` - POST to /api/track
- `getStats(toolId)` - GET from /api/hot?tool=xxx
- `getMultipleStats(toolIds)` - Batch stats fetching
- Auto-tracks links with `data-track-id` attribute
- Exports `tracker` global object

### Backend (worker/)

#### index.js (Cloudflare Worker)
- **~230 lines** of API code
- Handles CORS preflight requests
- **POST /api/track** - Increments tool usage counter
- **GET /api/hot?tool=xxx** - Returns stats for specific tool
- **GET /api/health** - Health check endpoint
- Error handling and input validation
- KV storage integration

### Configuration Files

#### wrangler.toml
- Cloudflare Pages & Workers configuration
- KV namespace binding
- Route configuration
- Environment-specific settings

#### package.json
- NPM scripts for common tasks:
  - `npm run dev` - Start local development
  - `npm run deploy` - Deploy everything
  - `npm run kv:create` - Create KV namespaces
  - `npm run logs` - View real-time Worker logs

---

## 🌐 Deployment Strategies

### Strategy 1: Cloudflare Dashboard (Easiest)

1. **Upload Pages:**
   - Go to CloudflarePages.com
   - Click "Create a project"
   - Select `public/` folder
   - Deploy

2. **Deploy Worker:**
   - Go to Workers & Pages
   - Click "Create Worker"
   - Paste code from `worker/index.js`
   - Deploy

3. **Configure KV:**
   - Create KV namespace named "STATS"
   - Bind it to Worker
   - Update wrangler.toml IDs

### Strategy 2: CLI (Recommended for DevOps)

```bash
# Clone/pull repo
cd "e:\我的坚果云\html\math tool"

# Install dependencies
npm install

# Setup KV
npm run kv:create

# Update wrangler.toml with KV IDs
# (manually edit file)

# Deploy everything
npm run deploy
```

### Strategy 3: Git Integration (Best for CI/CD)

1. Push code to GitHub
2. In Cloudflare Dashboard → Pages
3. Select repository → configure build settings
4. Set build command: `npm run build` (leave empty for static)
5. Set publish directory: `public`
6. Auto-deploys on push

---

## 🧪 Testing

### Local Testing

```bash
# Start dev server
wrangler dev

# In new terminal, test API endpoints
# Test tracking
curl -X POST http://localhost:8787/api/track \
  -H "Content-Type: application/json" \
  -d '{"toolId":"quantile"}'

# Test stats retrieval
curl http://localhost:8787/api/hot?tool=quantile

# Test health
curl http://localhost:8787/api/health

# Access Pages
# Open http://localhost:8788 in browser
```

### Production Testing

```bash
# Replace with your domain
curl https://api.yourdomain.com/api/health

# Test with data
curl -X POST https://api.yourdomain.com/api/track \
  -H "Content-Type: application/json" \
  -d '{"toolId":"statistics"}'

# Retrieve stats
curl https://api.yourdomain.com/api/hot?tool=statistics
```

### Manual QA Checklist

- [ ] Dashboard loads in <500ms
- [ ] All 4 tool cards visible
- [ ] Click counts show "0" or actual number
- [ ] Dark mode toggle works
- [ ] Quantile calculator works with Enter key
- [ ] Statistics calculator shows all results
- [ ] Matrix operations display correctly
- [ ] Linear transform visualizer renders canvas
- [ ] Navigation back to dashboard works
- [ ] Responsive design works on mobile (375px)
- [ ] Responsive design works on tablet (768px)
- [ ] Responsive design works on desktop (1200px+)

---

## 📊 API Documentation

### Authentication
Currently no authentication required. For production, add:
```javascript
// In worker/index.js
const apiKey = request.headers.get('Authorization');
if (!apiKey || apiKey !== `Bearer ${env.API_KEY}`) {
  return new Response('Unauthorized', { status: 401 });
}
```

### POST /api/track

Track a tool click and increment counter.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "toolId": "quantile"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "clicks": 42
}
```

**Error Response (400):**
```json
{
  "error": "Invalid toolId"
}
```

### GET /api/hot?tool={toolId}

Get usage statistics for a tool.

**Query Parameters:**
- `tool` (required): Tool identifier (quantile, statistics, matrix, linear-transform)

**Success Response (200):**
```json
{
  "toolId": "quantile",
  "clicks": 42,
  "lastUpdated": "2024-12-16T10:30:00.000Z"
}
```

**Response when tool has no stats (200):**
```json
{
  "toolId": "unknown-tool",
  "clicks": 0
}
```

**Error Response (400):**
```json
{
  "error": "Missing tool parameter"
}
```

### GET /api/health

Health check endpoint.

**Success Response (200):**
```json
{
  "status": "ok"
}
```

---

## 🔐 Security Configuration

### CORS Headers
Currently allows all origins (`*`). For production, restrict:

```javascript
// In worker/index.js
const allowedOrigins = [
  'https://yourdomain.com',
  'https://www.yourdomain.com'
];

const origin = request.headers.get('Origin');
const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

const corsHeaders = {
  'Access-Control-Allow-Origin': corsOrigin,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};
```

### Input Validation
All endpoints validate input. Example in worker:
```javascript
if (!toolId || typeof toolId !== 'string') {
  return new Response(JSON.stringify({ error: 'Invalid toolId' }), { status: 400 });
}
```

### KV Security
- Data encrypted at rest by Cloudflare
- No sensitive data stored (only click counts)
- Consider adding rate limiting in production

---

## 🚨 Troubleshooting

### Problem: "KV Namespace not found"
```
Error: KV Namespace not found
```
**Solution:**
- Verify namespace IDs in `wrangler.toml`
- Run `wrangler kv:namespace list` to check namespaces
- Ensure IDs are inside `[[kv_namespaces]]` section

### Problem: "404 Not Found" on API calls
```
Status: 404
{"error": "Not Found"}
```
**Solution:**
- Check API URL matches your domain
- Verify `wrangler deploy` completed successfully
- Check Worker routes in `wrangler.toml`
- View logs: `wrangler tail`

### Problem: "Pages not loading"
```
Error: /index.html not found
```
**Solution:**
- Verify `wrangler pages deploy public` was run
- Check that `public/index.html` exists
- Clear browser cache (Ctrl+Shift+Delete)
- Check Pages build logs in Cloudflare Dashboard

### Problem: "Dark mode not working"
**Solution:**
- Clear browser LocalStorage: F12 → Application → Clear
- Verify `theme.js` is loaded (check DevTools Network tab)
- Manually toggle: Click moon/sun button
- Check console for errors: F12 → Console

### Problem: "API calls timing out"
**Solution:**
- Check network connectivity
- Verify Worker is deployed: `wrangler deployments list`
- Check rate limiting isn't triggered
- View Worker logs: `wrangler tail --format json`

---

## 📈 Performance Tuning

### Caching Strategy

```javascript
// In worker/index.js
const cacheKey = new Request(request.url, { method: 'GET' });
const cache = caches.default;
const cached = await cache.match(cacheKey);

if (cached && pathname === '/api/hot') {
  return cached;
}
```

### Edge Caching Configuration

Add to `wrangler.toml`:
```toml
[routes]
pattern = "*.math-tools.com/api/hot*"
cache = { default_ttl = 300 }  # 5 min cache
```

### Image Optimization

Already optimized:
- No images (only emoji/SVG)
- No external CDN needed
- Icons served inline

---

## 📞 Support & Resources

### Official Documentation
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare KV](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### Common Commands

```bash
# Development
wrangler dev                          # Start local server
wrangler dev --remote                 # Dev against production

# Deployment
wrangler deploy                       # Deploy Worker
wrangler pages deploy public          # Deploy Pages
npm run deploy                        # Deploy both

# KV Management
wrangler kv:namespace create STATS    # Create namespace
wrangler kv:namespace list            # List namespaces
wrangler kv:key list --namespace-id=ID  # List keys
wrangler kv:key get --namespace-id=ID toolId  # Get value

# Monitoring
wrangler tail                         # Stream live logs
wrangler tail --status=error          # Filter errors only
wrangler deployments list             # See deployment history
```

---

## 🎯 Next Steps

1. **Local Setup** (5 min)
   - Follow Quick Start above
   - Verify everything works locally

2. **Configuration** (10 min)
   - Create KV namespaces
   - Update wrangler.toml
   - Test API endpoints

3. **Deployment** (5 min)
   - Deploy Worker: `wrangler deploy`
   - Deploy Pages: `wrangler pages deploy public`
   - Verify production working

4. **Optimization** (Optional)
   - Add custom domain
   - Configure caching rules
   - Set up monitoring
   - Add authentication

5. **Customization** (Optional)
   - Add more tools
   - Modify styling
   - Integrate with other services

---

## 📝 Version History

- **v1.0.0** (2024-12-16)
  - Initial release
  - 4 math tools (quantile, statistics, matrix, linear-transform)
  - Dark/light theme support
  - Analytics tracking with KV storage
  - Production-ready deployment

---

**Questions?** Check the README.md or Cloudflare documentation.
