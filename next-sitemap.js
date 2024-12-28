module.exports = {
  siteUrl: 'https://obtyping.vercel.app', // サイトのURLを指定
  generateRobotsTxt: true, // robots.txtを生成するかどうか
  exclude: ['/admin'], // クロール対象から除外するURL
  changefreq: 'daily', // ページの更新頻度
  priority: 0.7, // ページの優先度
}
