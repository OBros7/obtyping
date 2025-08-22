/* =====================================================================
   kanaToRomaji/matcher.ts  (方式A: 固定 display・多解受理)
===================================================================== */
import { KanaToken, tokenizeKana } from './tokenizer'
import { ROMA_MAP, RomajiEntry } from './romajiTable'

export interface MatcherOptions {
  allowApostropheAfterN?: boolean
  allowDzu?: boolean // づ → dzu
}

type Candidate = { word: string; pos: number } // pos = どこまで打ったか

// 拗音（ゃ/ゅ/ょ）かどうか
const SMALL_Y_SET = new Set(['ゃ', 'ゅ', 'ょ'])
function isYouonText(text: string): boolean {
  return text.length === 2 && SMALL_Y_SET.has(text[1]!)
}

export class RomajiMatcher {
  private tokens: KanaToken[]
  private tokenIdx = 0
  private candidates: Candidate[] = []
  private options: MatcherOptions
  private typedString = '' // ← feed() の中で確定ぶんを追加
  private currentCandidate: Candidate | null = null // feed() 成功時に更新

  // 追加: 次トークンの受理候補の “先頭文字” 集合
  private getNextTokenFirstChars(): string[] {
    const next = this.tokens[this.tokenIdx + 1]
    if (!next) return []
    const entry = ROMA_MAP[next.text]
    if (!entry) return []
    const firsts = new Set<string>()
    for (const a of entry.accept) {
      if (a.length > 0) firsts.add(a[0])
    }
    return Array.from(firsts)
  }

  // 追加: ん で n を1回入力済みか？
  private hasConsumedSingleNOnHatsuon(): boolean {
    const cur = this.tokens[this.tokenIdx]
    if (!cur || cur.type !== 'hatsuon') return false
    // いま残っている候補の中で “nn” 系の pos===1 がある → n を1回押している状態
    return this.candidates.some((c) => c.word.startsWith('nn') && c.pos === 1)
  }

  constructor(kana: string, opts?: MatcherOptions) {
    this.tokens = tokenizeKana(kana)
    this.options = opts || {}
    this.initCurrentToken()
  }

  /** ユーザが選択中の経路（現在トークン）のフル単語 */
  getCurrentCandidateWord(): string {
    return this.currentCandidate ? this.currentCandidate.word : ''
  }

  getPreferredNextKey(): string | undefined {
    // んで n を1回押した直後 → 次トークンの先頭子音を優先表示
    if (this.hasConsumedSingleNOnHatsuon()) {
      const arr = this.getNextTokenFirstChars()
      if (arr.length) return arr[0]
    }
    if (this.currentCandidate) {
      return this.currentCandidate.word[this.currentCandidate.pos]
    }
    const set = this.getNextAllowedKeys()
    return set.size ? Array.from(set)[0] : undefined
  }

  private getRomajiEntry(token: KanaToken, nextToken?: KanaToken): RomajiEntry {
    // 基本はテーブル参照。無ければローマ字化失敗→そのまま表示
    const base = ROMA_MAP[token.text]
    if (base) return base
    return { display: token.text, accept: [token.text] }
  }

  private initCurrentToken() {
    if (this.tokenIdx >= this.tokens.length) return
    const token = this.tokens[this.tokenIdx]

    // 促音は動的に生成
    if (token.type === 'sokuon') {
      const next = this.tokens[this.tokenIdx + 1]
      const nextEntry = this.getRomajiEntry(next)
      const firstConsonant = nextEntry.display[0]
      const doubled = firstConsonant + nextEntry.display // 例: k + ka → kka
      this.candidates = [{ word: doubled, pos: 0 }]
      this.currentCandidate = this.candidates[0]
    } else if (token.type === 'hatsuon') {
      const entry: RomajiEntry = { display: 'n', accept: ['n', 'nn'] }
      if (this.options.allowApostropheAfterN) entry.accept.push("n'")
      this.candidates = entry.accept.map((w) => ({ word: w, pos: 0 }))
      this.currentCandidate = this.candidates[0]
    } else {
      const entry = this.getRomajiEntry(token)

      // まずは ROMA_MAP にある合字側の候補（例: しゃ → ['sha', 'sya']）
      const accepts: string[] = [...entry.accept]

      // ★ 拗音なら「分割候補」を自動で合成して追加（例: し × ゃ → shi+xya, si+lya など）
      if (isYouonText(token.text)) {
        const base = ROMA_MAP[token.text[0]] // 例: 'し'
        const small = ROMA_MAP[token.text[1]] // 例: 'ゃ'
        if (base && small) {
          for (const a of base.accept) {
            for (const b of small.accept) {
              accepts.push(a + b) // 例: 'shi' + 'xya' = 'shixya'
            }
          }
        }
      }

      // 重複排除して候補に落とし込む
      const uniq = Array.from(new Set(accepts))
      this.candidates = uniq.map((w) => ({ word: w, pos: 0 }))

      // display を優先（無ければ先頭）
      const disp = entry.display
      this.currentCandidate = this.candidates.find((c) => c.word === disp) ?? this.candidates[0]
    }
  }

  /** 現在打てる 1 文字の集合（未完了候補のみ） */
  getNextAllowedKeys(): Set<string> {
    const keys: string[] = []
    for (const c of this.candidates) {
      if (c.pos < c.word.length) keys.push(c.word[c.pos]) // 未完了のみ
    }

    // ★ n を1回押した直後は、次トークンの先頭子音も許可
    if (this.hasConsumedSingleNOnHatsuon()) {
      for (const ch of this.getNextTokenFirstChars()) keys.push(ch)
    }

    return new Set(keys)
  }

  getTypedString(): string {
    return this.typedString
  }

  /** 今トークンの残り（ユーザが実際に打つルート） */
  getCurrentCandidateRemaining(): string {
    if (!this.currentCandidate) return ''
    return this.currentCandidate.word.slice(this.currentCandidate.pos)
  }

  /** 残りトークンを display で連結 */
  getRemainingTokensDisplay(): string {
    if (this.tokenIdx >= this.tokens.length) return ''

    // ★ 現トークンが促音なら 2 個先から、通常なら 1 個先から
    const cur = this.tokens[this.tokenIdx]
    const start = cur?.type === 'sokuon' ? this.tokenIdx + 2 : this.tokenIdx + 1

    const rest = this.tokens.slice(start)
    return rest
      .map((t, idx) => {
        if (t.type === 'sokuon') {
          // 直後トークンの先頭子音を表示用として重ねる
          const next = rest[idx + 1]
          const nextDisp = ROMA_MAP[next?.text]?.display ?? ''
          return nextDisp[0] ?? '' // 例: 'k'
        }
        if (t.type === 'choon') return '-'
        return ROMA_MAP[t.text]?.display ?? t.text
      })
      .join('')
  }

  /** 1 文字入力 */
  feed(ch: string): { accepted: boolean; finishedToken: boolean; finishedAll: boolean } {
    const nextCands: Candidate[] = []
    for (const cand of this.candidates) {
      if (cand.pos < cand.word.length && cand.word[cand.pos] === ch) {
        nextCands.push({ word: cand.word, pos: cand.pos + 1 })
      }
    }
    const accepted = nextCands.length > 0

    // ★ ブリッジ: ん で n を1回押したあと、n 以外(=次の子音など)が来たら
    if (!accepted && this.hasConsumedSingleNOnHatsuon()) {
      // ん を “n” として確定 → 次トークンへ進めて同じキーで再評価
      this.typedString += 'n'
      this.currentCandidate = null
      this.tokenIdx += 1
      const finishedAll = this.tokenIdx >= this.tokens.length
      this.initCurrentToken()
      if (finishedAll) return { accepted: true, finishedToken: true, finishedAll: true }
      return this.feed(ch) // 同じ入力で次のトークンにマッチさせる
    }
    if (!accepted) return { accepted: false, finishedToken: false, finishedAll: false }

    // 2) 完了/未完了に分ける
    const unfinished = nextCands.filter((c) => c.pos < c.word.length)
    const finished = nextCands.filter((c) => c.pos >= c.word.length)

    // 3) 未完了候補が残っていれば、まだトークンは確定しない
    if (unfinished.length > 0) {
      this.candidates = unfinished

      // 表示・ハイライト用に代表候補を選ぶ（存続中 > display 優先 > 最短）
      let chosen = (this.currentCandidate && unfinished.find((c) => c.word === this.currentCandidate!.word)) || null

      if (!chosen) {
        const tok = this.tokens[this.tokenIdx]
        const disp = ROMA_MAP[tok.text]?.display
        chosen = unfinished.find((c) => c.word === disp) || null
      }
      if (!chosen) {
        chosen = unfinished.reduce((a, b) => (a.word.length <= b.word.length ? a : b))
      }
      this.currentCandidate = chosen

      return { accepted: true, finishedToken: false, finishedAll: false }
    }

    // 4) 未完了が無い = すべて打ち切り → トークン確定
    // （通常は finished は 1 件だが、念のため代表を決める）
    let chosen = (this.currentCandidate && finished.find((c) => c.word === this.currentCandidate!.word)) || finished[0]

    this.currentCandidate = chosen

    // 確定ぶんを追加（促音も候補 word 全体を追加: 例 'ppa', 'tte'）
    const cur = this.tokens[this.tokenIdx]
    if (this.currentCandidate) {
      this.typedString += this.currentCandidate.word
    }

    // 促音は次の仮名までまとめて消費、それ以外は 1 つ
    const advance = cur?.type === 'sokuon' ? 2 : 1
    this.currentCandidate = null
    this.tokenIdx += advance

    const finishedAll = this.tokenIdx >= this.tokens.length
    this.initCurrentToken()

    return { accepted: true, finishedToken: true, finishedAll }
  }

  getCurrentDisplayWord(): string {
    const cur = this.tokens[this.tokenIdx]
    if (!cur) return ''

    if (cur.type === 'hatsuon') {
      // ん の表示は常に 'n'（確定までは 1 文字のまま見せる）
      return 'n'
    }
    // それ以外は現在の採用ルートをそのまま見せる（shi/si や促音は現状の挙動でOK）
    return this.currentCandidate ? this.currentCandidate.word : ''
  }

  /** 既定 display 文字列 (方式A) */
  getDisplayString(): string {
    return this.tokens
      .map((tok) => {
        if (tok.type === 'sokuon') return '' // sokuon は表示しない
        const entry = ROMA_MAP[tok.text]
        if (entry) return entry.display
        if (tok.type === 'choon') return '-'
        if (tok.type === 'punct') return ROMA_MAP[tok.text].display
        return tok.text // fallback
      })
      .join('')
  }
}
