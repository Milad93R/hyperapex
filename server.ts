import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { SERVER_CONFIG } from './src/config/server.config';

const { dev, hostname, port } = SERVER_CONFIG;

// Initialize Next.js
const nextApp = next({ dev, hostname, port });
const nextHandler = nextApp.getRequestHandler();

async function startServer() {
  try {
    // Prepare Next.js
    await nextApp.prepare();

    // Create HTTP server
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url!, true);
        await nextHandler(req, res, parsedUrl);
      } catch (err) {
        console.error('Error handling request:', err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });

    server.listen(port, () => {
      console.log(`🚀 Next.js server ready on http://${hostname}:${port}`);
      console.log(`📱 Frontend: http://${hostname}:${port}`);
      console.log(`🔧 API Routes: http://${hostname}:${port}/api`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();