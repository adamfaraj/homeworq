/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // <-- enables static export required by Amplify
  reactStrictMode: true,
  trailingSlash: true, // optional but can help with routing consistency
};

export default nextConfig;
