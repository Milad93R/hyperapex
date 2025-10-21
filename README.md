# Apex - Next.js + NestJS Full-Stack Application

A modern full-stack application combining Next.js frontend with NestJS backend, featuring ShadCN UI components, custom CSS styling, and Docker Compose for development with hot reload.

## 🚀 Features

- **Frontend**: Next.js 15 with TypeScript
- **Backend**: NestJS with TypeScript (integrated within the same project)
- **UI Components**: ShadCN UI (configured without Tailwind usage)
- **Styling**: Custom CSS system with CSS variables
- **Development**: Docker Compose with hot reload for both frontend and backend
- **API Integration**: Seamless communication between frontend and backend

## 📁 Project Structure

```
apex/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── globals.css      # Global styles with CSS variables
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Homepage with API integration demo
│   ├── backend/             # NestJS backend
│   │   ├── controllers/     # API controllers
│   │   ├── services/        # Business logic services
│   │   ├── modules/         # NestJS modules
│   │   └── main.ts          # Backend entry point
│   ├── components/          # ShadCN UI components
│   │   └── ui/              # Button, Card, Input components
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

### Local Development (without Docker)

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd apex
   npm install
   ```

2. **Run both frontend and backend:**
   ```bash
   npm run dev:all
   ```

   Or run them separately:
   ```bash
   # Terminal 1 - Frontend (Next.js)
   npm run dev

   # Terminal 2 - Backend (NestJS)
   npm run dev:backend
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

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
npm run dev              # Start Next.js frontend only
npm run dev:backend      # Start NestJS backend only
npm run dev:all          # Start both frontend and backend

# Building
npm run build            # Build Next.js frontend
npm run build:backend    # Build NestJS backend

# Production
npm run start            # Start Next.js in production
npm run start:backend    # Start NestJS in production

# Linting
npm run lint             # Run ESLint
```

## 🎨 Styling System

This project uses a custom CSS system instead of Tailwind classes:

- **CSS Variables**: Defined in `globals.css` for consistent theming
- **Custom Classes**: Available in `src/styles/custom.css`
- **ShadCN Components**: Configured to work with the custom styling system
- **Dark Mode**: Supported through CSS variables

### Example Usage

```tsx
// Using custom CSS classes
<div className="container">
  <div className="card p-6">
    <h1 className="text-2xl font-bold">Title</h1>
    <button className="btn btn-primary">Click me</button>
  </div>
</div>

// Using ShadCN components
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

The frontend automatically proxies API requests to the NestJS backend:

- Frontend requests to `/api/*` are forwarded to `http://localhost:3001/api/*`
- CORS is configured for seamless communication
- Example endpoints available:
  - `GET /api` - Hello message
  - `GET /api/health` - Health check
  - `POST /api/echo` - Echo service

## 🐳 Docker Configuration

### Frontend Container
- Based on Node.js 18 Alpine
- Runs Next.js development server
- Hot reload enabled through volume mounting

### Backend Container  
- Based on Node.js 18 Alpine
- Runs NestJS with nodemon for hot reload
- Separate TypeScript configuration

### Networking
- Both containers communicate through a Docker network
- Ports exposed: 3000 (frontend), 3001 (backend)

## 🚀 Production Deployment

1. **Build the applications:**
   ```bash
   npm run build
   npm run build:backend
   ```

2. **Start in production mode:**
   ```bash
   npm run start
   npm run start:backend
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with both local and Docker development
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
