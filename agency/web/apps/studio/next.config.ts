import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@sc/ui'],
  typedRoutes: true,
  async headers() {
    // Concepts and case studies name real businesses that are not clients: keep them out of search.
    const noindex = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }];
    return [
      { source: '/concepts/:path*', headers: noindex },
      { source: '/work/:path*', headers: noindex },
    ];
  },
};

export default nextConfig;
