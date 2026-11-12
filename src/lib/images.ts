/**
 * The screenshots in src/assets/work/, by file name.
 *
 * A file named NAME-mobile.png beside NAME.png is a crop of the same
 * screenshot (made by scripts/crop-work.mjs) that replaces it on screens
 * under 640 px wide, where the whole picture would be too small to read.
 */
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/work/*.png', { eager: true });

export const workImage = (file?: string): ImageMetadata | undefined =>
  file ? files[`../assets/work/${file}`]?.default : undefined;

export const workImageMobile = (file?: string): ImageMetadata | undefined =>
  file ? workImage(file.replace(/\.png$/, '-mobile.png')) : undefined;
