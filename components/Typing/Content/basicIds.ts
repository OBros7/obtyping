import TypingEnglish from '../TypingEnglish'

// components/Typing/Content/basicIds.ts
// -1**: english mark & number
// -2**: japanese

export const BASIC_ID = {
  // 指別タイピング（左右）
  BOTH_HANDS: -100,
  HAND_LEFT: -101,
  HAND_RIGHT: -102,
  FINGER_LEFT_PINKY: -103,
  FINGER_LEFT_RING: -104,
  FINGER_LEFT_MIDDLE: -105,
  FINGER_LEFT_INDEX: -106,
  FINGER_RIGHT_INDEX: -107,
  FINGER_RIGHT_MIDDLE: -108,
  FINGER_RIGHT_RING: -109,
  FINGER_RIGHT_PINKY: -110,

  // かんたん単語
  SHORT_WORDS_EN: -121,
  SHORT_WORDS_JA: -221,

  // 長めの単語
  LONG_WORDS_EN: -131,
  LONG_WORDS_JA: -231,

  // 数字・記号
  // NUMBERS_EASY: -141,
  // SYMBOLS_EASY: -151,

  // 数字多め／記号多めの文
  NUMBER_HEAVY_SENTENCES_EN: -161,
  SYMBOL_HEAVY_SENTENCES_EN: -162,
  NUMBER_HEAVY_SENTENCES_JP: -261,
  SYMBOL_HEAVY_SENTENCES_JP: -262,

  // 有名な文章（PD）
  FAMOUS_EN_PD: -171,
  FAMOUS_JA_PD: -271,
} as const

export type BasicId = (typeof BASIC_ID)[keyof typeof BASIC_ID]
