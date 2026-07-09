import 'server-only';
import sharp from 'sharp';

/**
 * Image validation + processing for uploads (Section 7.6 / 8.4).
 * - Real content-type sniffing via magic bytes (not the filename extension).
 * - Resize down to a sensible max width and re-encode to WebP for size.
 */
const MAX_BYTES = 8 * 1024 * 1024; // 8MB hard cap before processing
const MAX_WIDTH = 1920;

/** Sniff image type from magic bytes; returns null for anything not an allowed image. */
export function sniffImageType(buf: Buffer): 'jpeg' | 'png' | 'webp' | 'gif' | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpeg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'png';
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return 'gif';
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  )
    return 'webp';
  return null;
}

export type ProcessedImage = {
  buffer: Buffer;
  contentType: string;
  ext: string;
  width: number;
  height: number;
  bytes: number;
};

export async function processUpload(buf: Buffer): Promise<ProcessedImage> {
  if (buf.length > MAX_BYTES) throw new Error('Fichier trop volumineux (max 8 Mo).');
  const kind = sniffImageType(buf);
  if (!kind) throw new Error("Le fichier n'est pas une image valide (JPEG, PNG, WebP, GIF).");

  // Animated GIFs: keep as-is (sharp would flatten). Everything else → WebP.
  if (kind === 'gif') {
    const meta = await sharp(buf, { animated: true }).metadata();
    return {
      buffer: buf,
      contentType: 'image/gif',
      ext: 'gif',
      width: meta.width ?? 0,
      height: meta.height ?? 0,
      bytes: buf.length,
    };
  }

  const pipeline = sharp(buf).rotate().resize({
    width: MAX_WIDTH,
    withoutEnlargement: true,
  });
  const output = await pipeline.webp({ quality: 82 }).toBuffer({ resolveWithObject: true });

  return {
    buffer: output.data,
    contentType: 'image/webp',
    ext: 'webp',
    width: output.info.width,
    height: output.info.height,
    bytes: output.data.length,
  };
}
