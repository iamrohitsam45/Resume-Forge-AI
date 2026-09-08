import crypto from 'crypto';
import path from 'path';

// Produces a random, extension-preserving filename so user-supplied names never
// touch the filesystem path (prevents path traversal / overwrite attacks).
export function safeFilename(originalName) {
  const ext = path.extname(originalName || '').toLowerCase().slice(0, 10);
  const random = crypto.randomBytes(16).toString('hex');
  return `${Date.now()}-${random}${ext}`;
}

export default safeFilename;
