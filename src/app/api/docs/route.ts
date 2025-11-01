import { NextResponse } from 'next/server'
import { withSwaggerAuth } from '@/backend'

/**
 * Swagger UI endpoint
 * Access at: http://localhost:3168/api/docs
 * Requires Basic Auth (username/password from .env)
 */
export const GET = withSwaggerAuth(async () => {
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Documentation - Apex</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css">
    <style>
      body { margin: 0; padding: 0; }
      .swagger-ui .topbar { display: none; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: '/api/openapi.json',
          dom_id: '#swagger-ui',
          persistAuthorization: true,
          deepLinking: true,
          displayRequestDuration: true,
          filter: true,
          tryItOutEnabled: true,
          requestInterceptor: (request) => {
            // Auto-add API key from Swagger UI auth if available
            const apiKey = localStorage.getItem('api_key');
            if (apiKey && !request.headers['X-API-Key']) {
              request.headers['X-API-Key'] = apiKey;
            }
            return request;
          },
        });
      };
    </script>
  </body>
</html>`

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
})

