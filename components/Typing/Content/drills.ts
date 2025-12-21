// components/Typing/Content/drills.ts

// シード固定（毎回同じ並びにしたい場合）
const DEFAULT_SEED = 12345

export type RNG = () => number

export function makeSeededRng(seed = DEFAULT_SEED): RNG {
  let s = seed >>> 0
  return () => {
    s = (1664525 * s + 1013904223) >>> 0 // LCG
    return s / 0xffffffff
  }
}

export function shuffleInPlace<T>(arr: T[], rng: RNG) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

type KeyDrillOpts = {
  total?: number // 生成トークン数
  chunk?: number // 同一キー連打数
  sep?: string // 区切り（'' なら連結）
  seed?: number
  noRepeat?: boolean // ★追加: 隣接の同一キーを禁止
}

/**
 * キードリルの文字列を生成
 * @param keys  練習したいキー（例: ['q','w','e']）
 * @param total 生成トークン数（スペース区切りの要素数）
 * @param chunk 同一キーの連打数（2→ "q q" 単位）
 * @param sep   区切り文字（通常は半角スペース）
 * @param seed  乱数シード（未指定なら固定）
 */
export function makeKeyDrill(keys: string[], opts: KeyDrillOpts = {}) {
  const { total = 120, chunk = 1, sep = ' ', seed, noRepeat = false } = opts

  const rng = makeSeededRng(seed ?? 12345)
  if (keys.length === 0) return ''

  // --- 追加: 区切りなし＆連続禁止＆chunk=1 の最適化（ストリーム生成）---
  if (noRepeat && sep === '' && chunk === 1) {
    if (keys.length === 1) return keys[0].repeat(total)
    const out: string[] = []
    let last = ''
    for (let i = 0; i < total; i++) {
      // last と違うキーを必ず選ぶ
      let k = keys[Math.floor(rng() * keys.length)]
      if (k === last) {
        // 別キーを強制選択（O(1)）
        let idx = Math.floor(rng() * (keys.length - 1))
        if (keys[idx] === last) idx = keys.length - 1
        k = keys[idx]
      }
      out.push(k)
      last = k
    }
    return out.join('') // ← 区切りなし
  }
  // --- ここまで追加 ---

  // （従来のグループ方式は“単語ドリル”など sep がある用途向け）
  if (noRepeat && keys.length === 1) {
    return Array.from({ length: total }, () => keys[0]).join(sep)
  }

  // まず out を埋める（chunk単位）
  const out: string[] = []
  let lastKey = ''
  while (out.length < total) {
    let k = keys[Math.floor(rng() * keys.length)]
    if (noRepeat && k === lastKey) {
      const alt = keys[Math.floor(rng() * keys.length)]
      if (alt !== lastKey) k = alt
    }
    for (let i = 0; i < chunk && out.length < total; i++) out.push(k)
    lastKey = k
  }

  // グループ化してシャッフル
  const groups: string[][] = []
  for (let i = 0; i < out.length; i += chunk) groups.push(out.slice(i, i + chunk))
  shuffleInPlace(groups, rng)

  if (noRepeat) {
    const headKey = (g: string[]) => g[0]
    for (let i = 1; i < groups.length; i++) {
      if (headKey(groups[i]) === headKey(groups[i - 1])) {
        for (let j = i + 1; j < groups.length; j++) {
          if (headKey(groups[j]) !== headKey(groups[i - 1])) {
            ;[groups[i], groups[j]] = [groups[j], groups[i]]
            break
          }
        }
      }
    }
  }
  return groups.flat().join(sep)
}

// ****以下不要かも****

/** 英単語ドリル（text11 用） */
export function makeWordDrill(
  words: string[],
  total = 80, // 出力する語数
  chunk = 1, // 同じ語を連続させる回数（例：2 → "cat cat"）
  sep = ' ',
  seed?: number
) {
  const rng = makeSeededRng(seed ?? 12345)
  const out: string[] = []
  while (out.length < total) {
    const w = words[Math.floor(rng() * words.length)]
    for (let i = 0; i < chunk && out.length < total; i++) out.push(w)
  }
  // かたまり単位で順序を崩す
  const groups: string[][] = []
  for (let i = 0; i < out.length; i += chunk) groups.push(out.slice(i, i + chunk))
  shuffleInPlace(groups, rng)
  return groups.flat().join(sep)
}

/** 日本語単語ドリル（text11=かな / text12=原文） */
export function makeWordPairDrill(
  pairs: { jp: string; kana: string }[],
  total = 60,
  chunk = 1,
  sep = ' ',
  seed?: number
) {
  const rng = makeSeededRng(seed ?? 12345)
  const kanaOut: string[] = []
  const jpOut: string[] = []
  while (kanaOut.length < total) {
    const p = pairs[Math.floor(rng() * pairs.length)]
    for (let i = 0; i < chunk && kanaOut.length < total; i++) {
      kanaOut.push(p.kana)
      jpOut.push(p.jp)
    }
  }
  // かたまり単位で順序を崩す（kana/jp を同じ順で）
  const kanaGroups: string[][] = []
  const jpGroups: string[][] = []
  for (let i = 0; i < kanaOut.length; i += chunk) {
    kanaGroups.push(kanaOut.slice(i, i + chunk))
    jpGroups.push(jpOut.slice(i, i + chunk))
  }
  // 同じシャッフル順を使う
  const order = [...kanaGroups.keys()]
  shuffleInPlace(order, rng)
  const kana = order.flatMap((i) => kanaGroups[i]).join(sep)
  const jp = order.flatMap((i) => jpGroups[i]).join(sep)
  return { kana, jp }
}
