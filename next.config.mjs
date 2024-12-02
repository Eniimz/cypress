/** @type {import('next').NextConfig} */
const nextConfig = {
    
    // reactStrictMode: false,
    experimental: {
        missingSuspenseWithCSRBailout: false,
      },
    images: {
        domains: ['zasluhkbpogdfiznjijj.supabase.co']
    }
};

export default nextConfig;
