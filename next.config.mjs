/** @type {import("next").NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/shadowsight', // important!
  assetPrefix: '/shadowsight/', // important!
  /* images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: ""
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev",
        port: ""
      }
    ]
  } */
    images: {
      unoptimized: true,
    },
};

export default nextConfig;
