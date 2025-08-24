# Rules

## pages

- pages の中には処理は書かない
- filename は小文字から
- /pages/category/appname という構造(e.g., /pages/tools/randomtimer)

## components

- 処理は全てここに書く
- アプリごとに Directory を作る(e.g., /components/Tools/Randomtimer/RandomTimer.tsx)
- app に必要なコンポーネントであれば同じディレクトリに置く(e.g., /components/Tools/Randomtimer/RandomTimerButton.tsx)
- filename は大文字から始める
- 関数コンポーネントは大文字から初めて filename と一致するように
- Props は関数コンポーネント名 Props (e.g., RandomTimer -> RandomTimerProps)
- app のディレクトリの中に index.tsx とエントリポイントを作る
- 多言語対応は同じディレクトリの langDict.tsx の中に書く(書き方は/components/Home/langDict.tsx を参照)
  - import { useTranslation } from '@/MyCustomHooks'をファイル内に追加
  - import { langDict } from './' これも import
  - const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]を関数コンポーネント内に追加

# Environment variables

- .env.local に環境変数を書き、next.config.js で読み込む
- Production 環境では Vercel の環境変数を使う

# Wording

- singup (new user creation), login (existing user), signin (signup + login)

# User Authentication

- Store sensitive information like authentication cookie in httpOnly cookie

- Store non-sensitive information like user_id and user_preference in localStorage

# Dependencies

## tailwind

yarn add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

## react icons

yarn add react-icons

## react-circular-progressbar

yarn add react-circular-progressbar

# Reference

## SEO

https://saruwakakun.com/html-css/basic/head

## Locale

- https://btj0.com/blog/react/nextjs-i18n/
- https://zenn.dev/steelydylan/articles/nextjs-with-i18n

## google oauth

- https://next-auth.js.org/providers/google
- https://mattermost.com/blog/add-google-and-github-login-to-next-js-app-with-nextauth/

## 環境変数

- https://maku77.github.io/nodejs/env/dotenv.html

## google sheets

- yarn add --dev g-sheets-api
- https://www.npmjs.com/package/g-sheets-api
- https://virment.com/enable-google-spreadsheet-api/

## HTTPS でのアクセスしてください

ローカル開発でも HTTPS を前提とします。理由: Service Worker / WebAuthn / SameSite=None; Secure Cookie / 一部のブラウザ API は セキュアコンテキスト（HTTPS）でのみ有効なため。

### 前提ツール（未導入の場合はインストール）

- mkcert（ローカル CA & 証明書生成）

```
mac: brew install mkcert nss
Win: choco install mkcert
Linux: sudo apt-get install -y libnss3-tools → mkcert を導入
```

※ yarn setup:https 内で mkcert -install を実行します。

Caddy（TLS 終端のリバースプロキシ）

```
mac: brew install caddy
Win: choco install caddy
```

### 最短手順（初回だけ & 毎回）

- 初回のみ（ローカル CA 登録 & 証明書生成を自動化）

```
yarn setup:https
```

- 以降、開発サーバを HTTPS で起動

```
yarn dev:https
```

起動後は https://typing.localhost:8443 でアクセスしてください。
http://localhost:3000 は開発内部向けのプレーン HTTP（鍵マークは出ません）。

### レポジトリの運用ルール（証明書はコミット禁止）

certs/ は ローカル生成専用。リポジトリには .keep のみを含めます。
.gitignore により _.pem / _.key はグローバル無視されます。
