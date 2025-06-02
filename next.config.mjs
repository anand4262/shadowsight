// next.config.js
/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  output: 'export',
  basePath: isGitHubPages ? '/shadowsight' : '',
  assetPrefix: isGitHubPages ? '/shadowsight/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
