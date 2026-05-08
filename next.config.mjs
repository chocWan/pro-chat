/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@ant-design/pro-editor',
    'antd-style',
    'lodash-es',
    'react-layout-kit',
    'zustand-utils',
  ],
};

export default nextConfig;
