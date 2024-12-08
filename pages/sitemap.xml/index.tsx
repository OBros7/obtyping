// 説明: サイトマップを生成するためのページ
// 動的ルーティングが今回はないため、サーバーサイドでサイトマップを生成する

// import React from 'react';
// import { GetServerSideProps } from 'next';

// const Sitemap = () => {
//   // サイトマップは XML ファイルとして直接提供されるため、
//   // この React コンポーネント自体は必要ありません。
//   return null;
// };

// type SitemapInfo = {
//   path: string;
//   lastmod?: string;
//   changefreq: | 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
//   priority: string;
// };

// // 静的に決まっているパスを定義
// const StaticPagesInfo: SitemapInfo[] = [
//   {
//     path: '/',
//     changefreq: 'monthly',
//     priority: '1.0',
//   },
//   {
//     path: '/typing/basic_typing',
//     changefreq: 'monthly',
//     priority: '0.8',
//   },
//   {
//     path: '/typing/custom_typing',
//     changefreq: 'monthly',
//     priority: '0.8',
//   },
//   {
//     path: '/typing/category_typing',
//     changefreq: 'monthly',
//     priority: '0.8',
//   },
// ]

// // 動的に決まるパスを定義


// // サイトマップの XML ファイルを生成
// const generateSitemapXML = (baseURL: string, sitemapInfo: SitemapInfo[]) => {
//   const urls = sitemapInfo.map((info) => {
//     const children = Object.entries(info).map(([key, value]) => {
//       if (!value) return null;
//       switch (key) {
//         case 'path':
//           return `<loc>${baseURL}${value}</loc>`;
//         case 'lastmod': {
//           const year = value.getFullYear()
//           const month = value.getMonth() + 1
//           const date = value.getDate()

//           return `<lastmod>${year}-${month}-${date}</lastmod>`;
//         }
//         default:
//           return `<${key}>${value}</${key}>`;
//       }
//     }).filter((child) => child !== null)

//     return `<url>${children.join('¥n')}</url>`;
//   });

//   // 共通のXML部分で包む
//   return `<?xml version="1.0" encoding="UTF-8"?>¥n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">¥n${urls.join('¥n')}¥n</urlset>`;
// }

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   // ベースURLをreqから取得
//   const host = req?.headers?.host ?? 'localhost';
//   const prptocol = req.headers['x-forwarded-proto'] || req.connection.encrypted ? 'https' : 'http';
//   const base = `${prptocol}://${host}`;

//   // sitemap.xmlに必要なURLを列挙
//   const sitemapInfo = StaticPagesInfo;

//   const sitemapXML = generateSitemapXML(base, sitemapInfo);

//   // キャッシュを設定し、48時間に1回程度の頻度でXMLを生成するようにする
//   res.setHeader('Cache-Control', 's-maxage=172800, stale-while-revalidate');
//   res.setHeader('Content-Type', 'text/xml');
//   res.write(sitemapXML);
//   res.end();

//   return {
//     props: {},
//   };
// };

// export default Sitemap;
