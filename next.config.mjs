/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "images.pexels.com",
      },
      {
        hostname: "res.cloudinary.com", // Cloudinary hostname ko allow karna hoga
      },
    ],
  },
};

export default nextConfig;
