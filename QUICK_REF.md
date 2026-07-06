# Math Tools Platform - Quick Reference

## File Structure
```
.
├── public/                   # Frontend (Cloudflare Pages)
│   ├── index.html           # Dashboard
│   ├── tools/               # 4 tool pages
│   └── assets/              # CSS, JS libraries
├── worker/                  # Backend (Cloudflare Workers)
│   └── index.js            # API endpoints
├── wrangler.toml           # Configuration
├── package.json            # NPM scripts
├── README.md               # User guide
├── DEPLOYMENT.md           # Detailed setup guide
└── .gitignore             # Git ignore rules
```

## Quick Commands

```bash
# Setup
npm install -g wrangler
wrangler login
wrangler kv:namespace create STATS
wrangler kv:namespace create STATS --preview

# Development
wrangler pages dev public --local   # Run locally

# Testing
curl http://localhost:8788/api/health
curl -X POST http://localhost:8788/api/track \
  -H "Content-Type: application/json" -d '{"toolId":"quantile"}'

# Deployment
wrangler pages deploy public --project-name math-tools-platform

# Monitoring
wrangler tail                     # View logs
```

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/track` | Track tool click |
| GET | `/api/hot?tool=xxx` | Get tool stats |
| GET | `/api/health` | Health check |

## Tools Included

1. **📊 Quantile Calculator** - Calculate percentiles
2. **📈 Statistics Calculator** - Mean, median, std dev, etc.
3. **⬜ Matrix Calculator** - Determinant, trace, display
4. **↗️ Linear Transform Visualizer** - 2D transform visualization

## Key Features

✅ Zero dependencies (vanilla JS)
✅ Dark/light theme
✅ Mobile responsive
✅ Click tracking & analytics
✅ Production-ready
✅ Cloudflare edge optimized

## Setup Time

- 5 minutes: Local testing
- 10 minutes: Configuration
- 5 minutes: Production deployment
- **20 minutes total**
