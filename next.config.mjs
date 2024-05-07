import pwa from 'next-pwa';

const withPWA = pwa({
    dest: 'public',
  });

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "https://projectwe-421109.firebaseapp.com/",
        port: "",
        pathname: "/assets/main/**"
      },
      {
        protocol: "https",
        hostname: "https://projectwe-421109.web.app/",
        port: "",
        pathname: "/assets/main/**"
      }
    ]
  }
};

export default nextConfig;
