/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/**",
      },
      // Add any other image domains you might use
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
    ],
    // Alternative older format (if you prefer)
    // domains: [
    //   'images.unsplash.com',
    //   'res.cloudinary.com',
    //   'firebasestorage.googleapis.com',
    //   'lh3.googleusercontent.com',
    //   'avatars.githubusercontent.com',
    //   'ui-avatars.com',
    //   'picsum.photos',
    //   'via.placeholder.com'
    // ],
  },
  // Other Next.js config options
  experimental: {
    // Enable if you're using App Router features
    appDir: true,
  },
  // Enable if you want to use standalone output for deployment
  // output: 'standalone',
};

export default nextConfig;
