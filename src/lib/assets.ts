import fs from 'node:fs';
import path from 'node:path';

const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

function urlIfExists(folder: string, file: string): string | null {
  const onDisk = path.join(process.cwd(), 'public', folder, file);
  return fs.existsSync(onDisk) ? `${base}${folder}/${file}` : null;
}

/** Returns the URL of a screenshot in public/screenshots, or null if the file isn't there. */
export const shotUrl = (file: string) => urlIfExists('screenshots', file);

/** Returns the URL of a logo in public/logos, or null so the caller can fall back to text. */
export const logoUrl = (file: string) => urlIfExists('logos', file);
