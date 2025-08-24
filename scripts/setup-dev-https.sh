#!/usr/bin/env bash
set -euo pipefail

CERT_DIR="certs"
CERT="${CERT_DIR}/dev-cert.pem"
KEY="${CERT_DIR}/dev-key.pem"

mkdir -p "${CERT_DIR}"

if ! command -v mkcert >/dev/null 2>&1; then
  echo "mkcert が見つかりません。mac: brew install mkcert nss / Win: choco install mkcert"
  exit 1
fi

if [[ ! -f "${CERT}" || ! -f "${KEY}" ]]; then
  echo "ローカルCAを信頼ストアに登録します（初回だけ）..."
  mkcert -install

  echo "開発用証明書を作成します..."
  # サブドメイン用にワイルドカードも含める（APIなどを想定）
  mkcert -key-file "${KEY}" -cert-file "${CERT}" \
    "typing.localhost" "*.typing.localhost" "localhost" "127.0.0.1" "::1"
else
  echo "既に証明書が存在します。スキップします。"
fi

echo "証明書: ${CERT}"
echo "秘密鍵: ${KEY}"
