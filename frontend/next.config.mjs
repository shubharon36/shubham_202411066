// frontend/next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // If you ever use loremflickr again:
      // { protocol: 'https', hostname: 'loremflickr.com' },
    ],
  },
};

export default nextConfig;
