import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        {/* 全ページ共通のメタタグ */}
        <meta charSet="UTF-8" />
        {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}
        <meta name="description" content="タイピングしながら効率よく学べる！覚えたい内容を繰り返し練習して、タイピング速度上昇と記憶力を同時に向上させる一石二鳥な学習支援サービスです。" />

        {/* 外部フォントのリンク */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" />

        {/* favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
