import { NextRequest } from 'next/server'
import { withSwaggerAuth } from '@/backend'
import { CacheUtil } from '@/backend/utils/CacheUtil'

/**
 * Swagger UI endpoint with enhanced features
 * Access at: http://localhost:3168/api/docs
 * Requires Basic Auth (username/password from .env)
 * 
 * Features:
 * - Interactive Swagger UI
 * - Persistent authorization (API key saved)
 * - Deep linking to specific endpoints
 * - Request duration display
 * - Endpoint filtering and search
 * - Multiple server URLs support
 */
export const GET = withSwaggerAuth(async (_request: NextRequest) => {
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Documentation - Hyperapex</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css">
    <style>
      body { margin: 0; padding: 0; }
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info { margin: 20px 0; }
      .swagger-ui .scheme-container { margin: 20px 0; padding: 10px; background: #fafafa; border-radius: 4px; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: '/api/openapi.json',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
          ],
          plugins: [
            SwaggerUIBundle.plugins.DownloadUrl
          ],
          layout: 'StandaloneLayout',
          persistAuthorization: true,
          displayRequestDuration: true,
          filter: true,
          tryItOutEnabled: true,
          requestInterceptor: (request) => {
            // Auto-add API key from localStorage if available
            try {
              if (window.ui && window.ui.getSystem && window.ui.getSystem().authSelectors) {
                const auth = window.ui.getSystem().authSelectors.authorized();
                if (auth && auth.ApiKeyAuth && !request.headers['X-API-Key']) {
                  request.headers['X-API-Key'] = auth.ApiKeyAuth.value;
                }
              }
            } catch (e) {
              // Swagger UI not fully initialized yet, skip auth injection
              console.debug('Swagger UI auth not ready yet');
            }
            return request;
          },
          responseInterceptor: (response) => {
            // Log request duration if available
            if (response.duration) {
              console.log('Request duration:', response.duration, 'ms');
            }
            return response;
          },
          onComplete: () => {
            // Enable search functionality
            console.log('Swagger UI loaded successfully');
          }
        });
      };
    </script>
  </body>
</html>`

  return CacheUtil.cachedHtmlResponse(html, 'DOCS')
})
