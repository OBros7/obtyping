/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en', 'ja'],
    defaultLocale: 'en',
  },
  env: {
    // define global variables here
    FASTAPI_URL: process.env.FASTAPI_URL,
  },
}

module.exports = nextConfig
