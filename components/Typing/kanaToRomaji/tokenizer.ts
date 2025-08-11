/* =====================================================================
   kanaToRomaji/tokenizer.ts
===================================================================== */
export type KanaTokenType = 'kana' | 'youon' | 'sokuon' | 'hatsuon' | 'choon' | 'punct'
export interface KanaToken {
  type: KanaTokenType
  text: string
}

const SMALL_Y = new Set(['ゃ', 'ゅ', 'ょ'])

export function tokenizeKana(src: string): KanaToken[] {
  const result: KanaToken[] = []
  for (let i = 0; i < src.length; i++) {
    const ch = src[i]
    // 促音
    if (ch === 'っ') {
      result.push({ type: 'sokuon', text: ch })
      continue
    }
    // 撥音
    if (ch === 'ん') {
      result.push({ type: 'hatsuon', text: ch })
      continue
    }
    // 長音
    if (ch === 'ー') {
      result.push({ type: 'choon', text: ch })
      continue
    }
    // 句読点
    if ('、。！？'.includes(ch)) {
      result.push({ type: 'punct', text: ch })
      continue
    }
    // 拗音 (きゃ etc.)
    if (i + 1 < src.length && SMALL_Y.has(src[i + 1])) {
      result.push({ type: 'youon', text: ch + src[i + 1] })
      i++ // consume extra char
      continue
    }
    // 単音
    result.push({ type: 'kana', text: ch })
  }
  return result
}
