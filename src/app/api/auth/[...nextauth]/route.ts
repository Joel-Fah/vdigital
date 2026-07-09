import { handlers } from '@/lib/auth';

// Auth.js route handler. Runs in the Node runtime (argon2 is a native module).
export const runtime = 'nodejs';
export const { GET, POST } = handlers;
