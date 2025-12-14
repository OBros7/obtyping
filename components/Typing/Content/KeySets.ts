// components/Typing/Content/KeySets.ts

/** a–z（小文字） */
export const ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz'.split('')

/** A–Z（必要なら） */
// export const ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const LEFT_PINKY_LETTERS = ['q', 'a', 'z']
export const LEFT_RING_LETTERS = ['w', 's', 'x']
export const LEFT_MIDDLE_LETTERS = ['e', 'd', 'c']
export const LEFT_INDEX_LETTERS = ['r', 't', 'f', 'g', 'v', 'b']

export const RIGHT_INDEX_LETTERS = ['y', 'u', 'h', 'j', 'n', 'm']
export const RIGHT_MIDDLE_LETTERS = ['i', 'k', ',']
export const RIGHT_RING_LETTERS = ['o', 'l', '.']
export const RIGHT_PINKY_LETTERS = ['p', ';', '/']

/** 手ごとの統合（Letters版） */
export const LEFT_HAND_LETTERS = [
  ...LEFT_PINKY_LETTERS,
  ...LEFT_RING_LETTERS,
  ...LEFT_MIDDLE_LETTERS,
  ...LEFT_INDEX_LETTERS,
]

export const RIGHT_HAND_LETTERS = [
  ...RIGHT_INDEX_LETTERS,
  ...RIGHT_MIDDLE_LETTERS,
  ...RIGHT_RING_LETTERS,
  ...RIGHT_PINKY_LETTERS,
]

/** 数字・記号（必要に応じて） */
export const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
export const SYMBOLS = [
  '!',
  '?',
  '-',
  '_',
  '*',
  '#',
  '(',
  ')',
  '[',
  ']',
  '{',
  '}',
  '<',
  '>',
  '"',
  "'",
  '`',
  '/',
  '\\',
  '|',
  '@',
  '&',
  '^',
  ':',
  ';',
  ',',
  '.',
]

/**
 * （オプション）指配列の拡張版：句読点・ bracket なども指に割り当てたい場合
 * JIS/USで位置は違うので「文字の練習」と割り切る前提。必要になったら使ってください。
 */
// export const LEFT_PINKY_EXT = ['q'];
// export const LEFT_RING_EXT  = ['w'];
// export const LEFT_MIDDLE_EXT= ['e'];
// export const LEFT_INDEX_EXT = ['r','t','f','g','v','b'];
// export const RIGHT_INDEX_EXT= ['y','u','h','j','n','m'];
// export const RIGHT_MIDDLE_EXT=['i','k',','];
// export const RIGHT_RING_EXT = ['o','l','.'];
// export const RIGHT_PINKY_EXT= ['p',';','/','[',']','-','=','\'']; // 右小指に句読点群を寄せる例
