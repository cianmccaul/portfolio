/// <reference types="astro/client" />

/** A photo behind an approval switch (see approvedPhotos in astro.config.mjs). */
declare module 'virtual:approved-photo/*' {
  const photo: import('astro').ImageMetadata | undefined;
  export default photo;
}
