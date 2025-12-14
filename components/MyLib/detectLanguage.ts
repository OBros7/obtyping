export type LangCode = 'en' | 'others'

/**
 * detectLanguage
 * - Python の unicodedata.normalize('NFKC', text) と同等の正規化を JS 標準で実施
 * - 正規化後、ASCII 可視文字 + 空白/改行のみなら 'en'、それ以外が1文字でもあれば 'others'
 */
export function detectLanguage(input: string): LangCode {
  // normalize が未実装の環境はほぼ無いが、念のためガード
  let normalized = input
  try {
    normalized = input.normalize('NFKC')
  } catch {
    // normalize 非対応の環境では、生文字で判定（実害は軽微）
    normalized = input
  }

  // \x09(HT)、\x0A(LF)、\x0D(CR)、\x20-\x7E(スペース〜~ の可視ASCII)
  const asciiVisibleWithWhitespace = /^[\x09\x0A\x0D\x20-\x7E]*$/
  return asciiVisibleWithWhitespace.test(normalized) ? 'en' : 'others'
}

/**
 * タイトルと本文をまとめて判定するヘルパー。
 * どちらかに非ASCIIがあれば others。
 */
export function detectLanguageFromTitleAndContent(title: string, content: string): LangCode {
  const joined = `${title}\n${content}`
  return detectLanguage(joined)
}
