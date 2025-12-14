import TypingEnglish from '../TypingEnglish'

// components/Typing/Content/basicIds.ts
// -1**: english
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
  EASY_EN_WORDS: -121,
  EASY_JA_WORDS: -222,

  // ランダム単語（固定セット）※“易しい語だけ”
  RANDOM_EN_EASY: -131,
  RANDOM_JA_EASY: -232,

  // 数字・記号
  NUMBERS_EASY: -141,
  SYMBOLS_EASY: -151,

  // 数字多め／記号多めの文
  NUMBER_HEAVY_SENTENCES: -261,
  SYMBOL_HEAVY_SENTENCES: -262,

  // 有名な文章（PD）
  FAMOUS_EN_PD: -171,
  FAMOUS_JA_PD: -272,
} as const

export type BasicId = (typeof BASIC_ID)[keyof typeof BASIC_ID]
