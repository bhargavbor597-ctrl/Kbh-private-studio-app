import type { IncomingMessage, ServerResponse } from 'http';
import { createServer } from '../server/server.js';

let appPromise: ReturnType<typeof createServer> | null = null;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!appPromise) {
    appPromise = createServer();
  }
  const app = await appPromise;
  return app(req as any, res as any);
}
