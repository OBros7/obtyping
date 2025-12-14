// components/Typing/KeyHighlights/resolveNextKey.ts
export type ResolvedKey = { baseCode: string; needsShift: boolean }

/**
 * Shift 同時押しが必要な記号 → 物理キーコード
 * ANSI US-101 を想定
 */
const SHIFT_PAIRS: Record<string, string> = {
  '~': 'Backquote',
  '!': 'Digit1',
  '@': 'Digit2',
  '#': 'Digit3',
  $: 'Digit4',
  '%': 'Digit5',
  '^': 'Digit6',
  '&': 'Digit7',
  '*': 'Digit8',
  '(': 'Digit9',
  ')': 'Digit0',
  _: 'Minus',
  '+': 'Equal',
  '{': 'BracketLeft',
  '}': 'BracketRight',
  '|': 'Backslash',
  ':': 'Semicolon',
  '"': 'Quote',
  '<': 'Comma',
  '>': 'Period',
  '?': 'Slash',
}

/**
 * 非Shiftの文字 → 物理キーコード
 * ANSI US-101 を想定
 */
const NONSHIFT_MAP: Record<string, string> = {
  '`': 'Backquote',
  '1': 'Digit1',
  '2': 'Digit2',
  '3': 'Digit3',
  '4': 'Digit4',
  '5': 'Digit5',
  '6': 'Digit6',
  '7': 'Digit7',
  '8': 'Digit8',
  '9': 'Digit9',
  '0': 'Digit0',
  '-': 'Minus',
  '=': 'Equal',
  '[': 'BracketLeft',
  ']': 'BracketRight',
  '\\': 'Backslash',
  ';': 'Semicolon',
  "'": 'Quote',
  ',': 'Comma',
  '.': 'Period',
  '/': 'Slash',
  ' ': 'Space',
  '\n': 'Enter',
  '\r': 'Enter',
  '\t': 'Tab',
  Enter: 'Enter',
  Tab: 'Tab',
}

/**
 * nextKey を「物理キー（event.code 相当）」＋「Shift要否」に正規化
 * 仕様要件：
 * - 小文字/非Shift記号: 該当キーのみ強調（needsShift=false）
 * - 大文字/Shift記号: 該当キー＋Shiftキー強調（needsShift=true）
 * - CapsLock は考慮しない
 */
export function resolveNextKey(nextKey: string | null): ResolvedKey | null {
  if (!nextKey || nextKey.length === 0) return null

  // 記号（Shift必要）
  if (nextKey in SHIFT_PAIRS) {
    return { baseCode: SHIFT_PAIRS[nextKey], needsShift: true }
  }

  // 記号・制御（Shift不要）
  if (nextKey in NONSHIFT_MAP) {
    return { baseCode: NONSHIFT_MAP[nextKey], needsShift: false }
  }

  // アルファベット
  if (/^[a-z]$/.test(nextKey)) {
    return { baseCode: `Key${nextKey.toUpperCase()}`, needsShift: false }
  }
  if (/^[A-Z]$/.test(nextKey)) {
    return { baseCode: `Key${nextKey}`, needsShift: true }
  }

  // 数字（冗長対策）
  if (/^\d$/.test(nextKey)) {
    return { baseCode: `Digit${nextKey}`, needsShift: false }
  }

  return null // 想定外は無視
}
