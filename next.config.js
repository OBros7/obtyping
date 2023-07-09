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
    GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  },
}

module.exports = nextConfig
