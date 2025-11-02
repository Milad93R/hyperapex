import { CacheUtil } from '@/backend/utils/CacheUtil';

export async function GET() {
  return CacheUtil.cachedJsonResponse(
    {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Next.js API Routes',
    },
    'HEALTH'
  );
}
