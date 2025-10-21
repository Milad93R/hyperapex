import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { createNestApp } from './src/backend/main';
import 'reflect-metadata';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3005', 10);

// Initialize Next.js
const nextApp = next({ dev, hostname, port });
const nextHandler = nextApp.getRequestHandler();

async function startServer() {
  try {
    // Prepare Next.js
    await nextApp.prepare();
    
    // Create NestJS app
    const nestApp = await createNestApp();
    await nestApp.init();
    
    // Get the underlying Express instance from NestJS
    const nestHandler = nestApp.getHttpAdapter().getInstance();

    // Create HTTP server
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url!, true);
        const { pathname } = parsedUrl;

        // Route API requests to NestJS
        if (pathname?.startsWith('/api')) {
          nestHandler(req, res);
        } else {
          // Route everything else to Next.js
          await nextHandler(req, res, parsedUrl);
        }
      } catch (err) {
        console.error('Error handling request:', err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });

    server.listen(port, () => {
      console.log(`🚀 Hybrid Next.js + NestJS server ready on http://${hostname}:${port}`);
      console.log(`📱 Next.js frontend: http://${hostname}:${port}`);
      console.log(`🔧 NestJS API: http://${hostname}:${port}/api`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();