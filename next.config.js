/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en', 'ja'],
    defaultLocale: 'en',
  },
  // env: {# Do not define global variables here: define them in .env.local and use process.env.VARIABLE_NAME}
  //   // define global variables here
  //   FASTAPI_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  //   GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  // },
}

module.exports = nextConfig
