import fs from 'node:fs';
import path from 'node:path';

export const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

/** Site-relative link that respects the GitHub Pages base path. */
export const href = (p = '') => `${base}${p}`;

function urlIfExists(folder: string, file: string): string | null {
  const onDisk = path.join(process.cwd(), 'public', folder, file);
  return fs.existsSync(onDisk) ? `${base}${folder}/${file}` : null;
}

/** Returns the URL of a screenshot in public/screenshots, or null if the file isn't there (Roofr shots are local-only). */
export const shotUrl = (file?: string) => (file ? urlIfExists('screenshots', file) : null);

export const photoUrl = (file: string) => urlIfExists('photos', file);

export const brandUrl = (file: string) => urlIfExists('brand', file);
