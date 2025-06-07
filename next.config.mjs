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

module.exports = nextConfig;
