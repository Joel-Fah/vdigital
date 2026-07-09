import 'server-only';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from '@/lib/env';

/**
 * Cloudflare R2 (S3-compatible) client for media storage (Section 7).
 * Zero egress fees; public files are served from R2_PUBLIC_URL.
 */
let client: S3Client | null = null;

function getClient(): S3Client {
  if (!env.r2.isConfigured) {
    throw new Error('R2 is not configured — set R2_* env vars (see .env.example).');
  }
  if (!client) {
    client = new S3Client({
      region: 'auto',
      endpoint: `https://${env.r2.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.r2.accessKeyId!,
        secretAccessKey: env.r2.secretAccessKey!,
      },
    });
  }
  return client;
}

/** Upload a buffer to R2 and return its public URL. */
export async function uploadToR2(key: string, body: Buffer, contentType: string): Promise<string> {
  await getClient().send(
    new PutObjectCommand({
      Bucket: env.r2.bucket!,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );
  return `${env.r2.publicUrl!.replace(/\/$/, '')}/${key}`;
}

export async function deleteFromR2(key: string): Promise<void> {
  await getClient().send(new DeleteObjectCommand({ Bucket: env.r2.bucket!, Key: key }));
}

/** Derive the R2 object key from a stored public URL (for deletes). */
export function keyFromPublicUrl(url: string): string | null {
  if (!env.r2.publicUrl) return null;
  const base = env.r2.publicUrl.replace(/\/$/, '');
  return url.startsWith(base) ? url.slice(base.length + 1) : null;
}
