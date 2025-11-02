# Hyperapex - Next.js Full-Stack Application

A modern full-stack application built with Next.js 15, featuring modular architecture, ShadCN UI components, API authentication, Swagger documentation, Telegram integration, and Vercel deployment.

## 🚀 Features

- **Frontend**: Next.js 15 with TypeScript and modular component architecture
- **Backend**: Next.js API routes with authentication and security features
- **UI Components**: ShadCN UI with custom CSS styling
- **Responsive Design**: Mobile-first design with hamburger menu for screens < 768px
- **Authentication**: API key authentication, Swagger UI basic auth, Debug secret headers
- **API Documentation**: Interactive Swagger UI with OpenAPI 3.0 specification
- **Monitoring**: Request monitoring, debug logging, global error handling
- **Calculations**: Modular calculation service supporting arithmetic, factorial, fibonacci, primes, statistics, and more
- **Caching**: Modular cache utility with configurable cache presets for optimal performance
- **Telegram Integration**: Send messages and formatted logs via Telegram Bot API
- **Supabase Integration**: Full CRUD operations with PostgreSQL database via Supabase
- **Deployment**: Automated deployment script for Vercel

## 📁 Project Structure

```
hyperapex/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/             # API routes
│   │   │   ├── route.ts    # Root API endpoint
│   │   │   ├── docs/       # Swagger UI
│   │   │   ├── openapi.json/ # OpenAPI spec
│   │   │   └── telegram/   # Telegram endpoints
│   │   ├── globals.css      # Global styles with CSS variables
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Homepage
│   ├── backend/             # Backend utilities (modular)
│   │   ├── config/         # Configuration modules
│   │   ├── guards/         # Authentication guards
│   │   ├── middleware/     # Request middleware
│   │   ├── handlers/       # Error handlers
│   │   ├── services/       # Services (Telegram, Calculation, Supabase)
│   │   └── utils/          # Utility functions
│   ├── components/          # React components organized by feature
│   │   ├── layout/          # Layout components
│   │   │   └── Header/     # Header component (with index.ts)
│   │   ├── sections/       # Page sections
│   │   │   └── HeroSection/# HeroSection component (with index.ts)
│   │   ├── buttons/         # Button components
│   │   │   └── ModernButton/# ModernButton component (with index.ts)
│   │   ├── theme/          # Theme-related components
│   │   │   ├── ThemeToggle/        # ThemeToggle component
│   │   │   ├── ClientThemeToggle/  # ClientThemeToggle component
│   │   │   ├── ClientThemeProvider/# ClientThemeProvider component
│   │   │   └── NoSSRThemeProvider/ # NoSSRThemeProvider component
│   │   └── ui/             # ShadCN UI primitives (Button, Card, Input)
│   ├── lib/                 # Utility functions
│   └── styles/              # Custom CSS files
├── docker-compose.yml       # Docker Compose configuration
├── Dockerfile.frontend      # Frontend Docker configuration
├── Dockerfile.backend       # Backend Docker configuration
├── tsconfig.json           # TypeScript config for frontend
├── tsconfig.backend.json   # TypeScript config for backend
└── package.json            # Dependencies and scripts
```

## 🛠 Development Setup

### Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- Git

### Local Development

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd hyperapex
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3168
   - API: http://localhost:3168/api
   - Swagger UI: http://localhost:3168/api/docs

### Docker Development (with Hot Reload)

1. **Start with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

The Docker setup includes volume mounting for hot reload, so changes to your code will automatically restart the services.

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start Next.js development server

# Building
npm run build            # Build Next.js application

# Production
npm run start            # Start Next.js in production mode

# Linting
npm run lint             # Run ESLint

# Deployment
./deploy.sh              # Deploy to Vercel (production)
./deploy.sh --preview    # Deploy to Vercel (preview)
./deploy.sh --token TOKEN # Deploy with custom token

# Environment Variables
./sync-env-to-vercel.sh  # Sync all .env variables to Vercel
```

## 🎨 Styling System

This project uses a custom CSS system instead of Tailwind classes:

- **CSS Variables**: Defined in `globals.css` for consistent theming
- **Custom Classes**: Available in `src/styles/custom.css`
- **ShadCN Components**: Configured to work with the custom styling system
- **Dark Mode**: Supported through CSS variables
- **Header Design**: Modern gradient-based design with backdrop blur, matching the login/signup pages aesthetic with gradient backgrounds, border effects, and radial overlays

### Example Usage

```tsx
// Using custom CSS classes
<div className="container">
  <div className="card p-6">
    <h1 className="text-2xl font-bold">Title</h1>
    <button className="btn btn-primary">Click me</button>
  </div>
</div>

// Using modular components
import { Header } from '@/components/layout';
import { HeroSection } from '@/components/sections';
import { ModernButton } from '@/components/buttons';
import { ThemeToggle, ClientThemeProvider } from '@/components/theme';

// Using backend utilities (caching example)
import { CacheUtil } from '@/backend/utils/CacheUtil';
// Use preset cache configurations
return CacheUtil.cachedJsonResponse(data, 'API'); // 'API', 'DOCS', 'OPENAPI', 'HEALTH', 'STATIC', 'NO_CACHE'
// Or create custom cache headers
const cacheHeader = CacheUtil.customCache(3600, 86400); // maxAge, staleWhileRevalidate

// Using SupabaseService (database operations)
import { SupabaseService } from '@/backend';
// Fetch all records from a table
const users = await SupabaseService.fetchAll<User>('users');
// Fetch by ID
const user = await SupabaseService.fetchById<User>('users', 'user-id');
// Insert a new record
const newUser = await SupabaseService.insert<User>('users', { name: 'John', email: 'john@example.com' });
// Update a record
const updated = await SupabaseService.update<User>('users', 'user-id', { name: 'Jane' });
// Delete a record
await SupabaseService.delete('users', 'user-id');
// Custom query
const results = await SupabaseService.query<User>('users', (query) => query.eq('status', 'active').limit(10));

// Using ShadCN UI primitives
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Button variant="default">ShadCN Button</Button>
  </CardContent>
</Card>
```

## 🔌 API Integration

### Available Endpoints

- `GET /api` - Root API endpoint (optional authentication)
- `GET /api/docs` - Interactive Swagger UI (Basic Auth required)
- `GET /api/openapi.json` - OpenAPI 3.0 specification
- `GET /api/debug-env` - Environment configuration debug
- `POST /api/calculate` - Perform mathematical calculations (API Key required, uses Node.js runtime for CPU-intensive operations)
- `GET /api/sleep` - Sleep/delay endpoint for testing (API Key required, query param: `duration` in ms, default: 5000ms)
- `POST /api/sleep` - Sleep/delay endpoint for testing (API Key required, body: `{duration: number, message?: string}`, default: 5000ms)
- `POST /api/telegram/send` - Send message to Telegram (API Key required)
- `POST /api/telegram/log` - Send formatted log to Telegram (API Key required)
- `GET /api/telegram/threads` - List available Telegram threads
- `GET /api/supabase/test` - Test Supabase connection and configuration (API Key required)

### Authentication

- **API Key**: Add header `X-API-Key: your-api-key-here` to protected endpoints
- **Swagger UI**: Basic auth with username/password from environment variables
- **Debug Mode**: Add header `X-Debug-Secret: your-debug-secret` for detailed error logs

## 📚 Documentation

- **Environment Setup**: See `.github/ENV_SETUP.md` for detailed environment variable configuration
- **Vercel Deployment**: See `.github/VERCEL_ENV_GUIDE.md` for viewing environment variables in Vercel
- **API Documentation**: Access Swagger UI at `/api/docs` after deployment

## 🚀 Production Deployment

### Quick Deployment to Vercel

Use the deployment script to build and deploy to Vercel:

```bash
# Basic deployment (production)
./deploy.sh

# With Vercel token
./deploy.sh --token YOUR_VERCEL_TOKEN

# Preview deployment (not production)
./deploy.sh --preview

# Skip build step
./deploy.sh --skip-build
```

The script will:
- ✅ Check Vercel CLI installation
- ✅ Link project to `hyperapex` on Vercel
- ✅ Build the project (unless `--skip-build`)
- ✅ Check environment variables
- ✅ Deploy to Vercel (production or preview)

### Manual Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   ```bash
   npx vercel --prod
   ```

### Environment Variables

Make sure all required environment variables are set in Vercel:
- `API_KEY` - API key for authentication
- `SWAGGER_USERNAME` - Swagger UI username
- `SWAGGER_PASSWORD` - Swagger UI password
- `DEBUG_SECRET` - Debug secret for detailed logs
- `TELEGRAM_BOT_TOKEN` - Telegram bot token (optional)
- `TELEGRAM_GROUP_ID` - Telegram group ID (optional)
- `SUPABASE_URL` - Supabase project URL (optional)
- `SUPABASE_SERVICE_KEY` - Supabase service role key (optional, server-side only)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key (optional, for client-side)

See `.env.example` for all available options.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with both local and Docker development
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
