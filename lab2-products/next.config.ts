import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // включает директиву 'use cache' (Cache Components)
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
