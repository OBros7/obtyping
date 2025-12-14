// components/Typing/KeyHighlights/jisLegends.ts
export type JisLegend = { base: string; shift?: string }

/**
 * ラベル → 2段ラベル（通常/Shift）
 * - 既存の日本語キーボードの並び（例に合わせたラベル群）に対応
 * - 実機JISでは配置差がある記号もありますが、まず一般的な対を用意
 * - この表に無いラベルは「単独ラベル（shiftなし）」扱いになります
 */
export const JIS_LEGENDS_BY_LABEL: Record<string, JisLegend> = {
  // 数字段（一般的なJISの対）
  '1': { base: '1', shift: '!' },
  '2': { base: '2', shift: '"' },
  '3': { base: '3', shift: '#' },
  '4': { base: '4', shift: '$' },
  '5': { base: '5', shift: '%' },
  '6': { base: '6', shift: '&' },
  '7': { base: '7', shift: "'" },
  '8': { base: '8', shift: '(' },
  '9': { base: '9', shift: ')' },
  '0': { base: '0' }, // JISでは 0 の Shift は定義なし（機種依存）。必要に応じ拡張
  '-': { base: '-', shift: '=' },
  '^': { base: '^', shift: '~' },
  '¥': { base: '¥', shift: '|' }, // IntlYen 相当

  // 2段目（英字）
  Q: { base: 'q', shift: 'Q' },
  W: { base: 'w', shift: 'W' },
  E: { base: 'e', shift: 'E' },
  R: { base: 'r', shift: 'R' },
  T: { base: 't', shift: 'T' },
  Y: { base: 'y', shift: 'Y' },
  U: { base: 'u', shift: 'U' },
  I: { base: 'i', shift: 'I' },
  O: { base: 'o', shift: 'O' },
  P: { base: 'p', shift: 'P' },

  // JIS特有の右側キー（機種で差異あり。既存コンポーネント準拠）
  '@': { base: '@', shift: '`' }, // 慣例的な対
  '[': { base: '[', shift: '{' },

  // 3段目（英字）
  A: { base: 'a', shift: 'A' },
  S: { base: 's', shift: 'S' },
  D: { base: 'd', shift: 'D' },
  F: { base: 'f', shift: 'F' },
  G: { base: 'g', shift: 'G' },
  H: { base: 'h', shift: 'H' },
  J: { base: 'j', shift: 'J' },
  K: { base: 'k', shift: 'K' },
  L: { base: 'l', shift: 'L' },
  ';': { base: ';', shift: '+' }, // JISでは ; と + の組み合わせが一般的
  ':': { base: ':', shift: '*' }, // JISでは : と * の組み合わせが一般的
  ']': { base: ']', shift: '}' },

  // 4段目（英字）
  Z: { base: 'z', shift: 'Z' },
  X: { base: 'x', shift: 'X' },
  C: { base: 'c', shift: 'C' },
  V: { base: 'v', shift: 'V' },
  B: { base: 'b', shift: 'B' },
  N: { base: 'n', shift: 'N' },
  M: { base: 'm', shift: 'M' },
  ',': { base: ',', shift: '<' },
  '.': { base: '.', shift: '>' },
  '/': { base: '/', shift: '?' },

  // スペース
  ' ': { base: '␣' }, // 表示用
}

/**
 * キーが英字の場合、レジェンド表に無くても 2段（小/大）を自動で補完できます。
 * KeyboardJISDual 側で 'KeyA' 相当のラベルを見て自動生成します。
 */
