// components/Typing/KeyHighlights/us101Legends.ts
export type Legend = { base: string; shift?: string }

/**
 * 各物理キーコードに対する表示ラベル（通常/Shift）
 * ANSI US-101 前提。
 * アルファベットは Keyboard 側で自動生成するため、ここでは主に数字/記号列を定義。
 */
export const LEGENDS_BY_CODE: Record<string, Legend> = {
  Backquote: { base: '`', shift: '~' },
  Digit1: { base: '1', shift: '!' },
  Digit2: { base: '2', shift: '@' },
  Digit3: { base: '3', shift: '#' },
  Digit4: { base: '4', shift: '$' },
  Digit5: { base: '5', shift: '%' },
  Digit6: { base: '6', shift: '^' },
  Digit7: { base: '7', shift: '&' },
  Digit8: { base: '8', shift: '*' },
  Digit9: { base: '9', shift: '(' },
  Digit0: { base: '0', shift: ')' },
  Minus: { base: '-', shift: '_' },
  Equal: { base: '=', shift: '+' },

  BracketLeft: { base: '[', shift: '{' },
  BracketRight: { base: ']', shift: '}' },
  Backslash: { base: '\\', shift: '|' },

  Semicolon: { base: ';', shift: ':' },
  Quote: { base: "'", shift: '"' },

  Comma: { base: ',', shift: '<' },
  Period: { base: '.', shift: '>' },
  Slash: { base: '/', shift: '?' },

  Space: { base: '␣' }, // 表示専用
}
