// components/Typing/KeyHighlights/resolveNextKeyJIS.ts
import { JIS_LEGENDS_BY_LABEL } from './jisLegends'

export type ResolvedJisKey = { baseLabel: string; needsShift: boolean }

/**
 * nextKey を「JISラベル（基準）＋Shift要否」に正規化します。
 * - 小文字/非Shift記号 → 該当ラベルのみ強調（needsShift=false）
 * - 大文字/Shift記号   → 該当ラベル + Shiftキー強調（needsShift=true）
 * - CapsLock は考慮しない
 *
 * 既存JISコンポーネントがラベル配列ベースのため、event.code ではなく「キー表示ラベル」を基準に判定します。
 */
export function resolveNextKeyJIS(nextKey: string | null): ResolvedJisKey | null {
  if (!nextKey || nextKey.length === 0) return null

  // 1) 制御的な名前（Enter, Tab）はここでは扱わず、KeyboardJISDual 側で labelCenter のキーとして対応します。
  if (nextKey === ' ') return { baseLabel: ' ', needsShift: false }

  // 2) レジェンド定義から「シフト記号 → ベースラベル」を逆引き
  for (const [label, legend] of Object.entries(JIS_LEGENDS_BY_LABEL)) {
    if (legend.shift && nextKey === legend.shift) {
      return { baseLabel: label, needsShift: true }
    }
    if (legend.base === nextKey) {
      // ベース側に一致（小文字英字・非shift記号）
      // ただし英字の "A" など大文字はここでは一致しない想定
      return { baseLabel: label, needsShift: false }
    }
  }

  // 3) アルファベット（小文字/大文字）→ ラベルはキー自体が大文字表示のため、基準ラベルは大文字で持つ
  if (/^[a-z]$/.test(nextKey)) {
    // 例えば nextKey='a' の場合、キーラベルは 'A' として持っているので baseLabel='A', needsShift=false
    return { baseLabel: nextKey.toUpperCase(), needsShift: false }
  }
  if (/^[A-Z]$/.test(nextKey)) {
    return { baseLabel: nextKey, needsShift: true }
  }

  // 4) 数字（非Shift）
  if (/^\d$/.test(nextKey)) {
    return { baseLabel: nextKey, needsShift: false }
  }

  // 5) よく使う制御名（ここではEnter/Tabを想定名称として受ける）
  if (nextKey === 'Enter' || nextKey === '\n' || nextKey === '\r') {
    return { baseLabel: 'Enter', needsShift: false }
  }
  if (nextKey === 'Tab' || nextKey === '\t') {
    return { baseLabel: 'Tab', needsShift: false }
  }

  return null
}
