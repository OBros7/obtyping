// components/Typing/Content/BasicModeContent.ts
import type { ReceivedText } from '@/MyLib/UtilsAPITyping'
import { BASIC_ID } from './basicIds'
import { FAMOUS_EN_PD, FAMOUS_JA_PD } from './FamousSentencesPD'
import { makeKeyDrill, makeWordDrill, makeWordPairDrill } from './drills'
import {
  LEFT_HAND_LETTERS,
  RIGHT_HAND_LETTERS,
  LEFT_INDEX_LETTERS,
  RIGHT_INDEX_LETTERS,
  LEFT_MIDDLE_LETTERS,
  RIGHT_MIDDLE_LETTERS,
  LEFT_RING_LETTERS,
  RIGHT_RING_LETTERS,
  LEFT_PINKY_LETTERS,
  RIGHT_PINKY_LETTERS,
  DIGITS,
  SYMBOLS,
  ALPHA_LOWER,
} from './KeySets'
import { EN_EASY_WORDS, EN_BASIC_WORDS, JA_EASY_PAIRS } from './WordsSets'

// 英数や記号など「text11 だけで良い」ケース用
const t = (id: number, content: string, title = ''): ReceivedText => ({
  text_id: id,
  title,
  text11: content,
  text12: null,
  text21: null,
  text22: null,
  visibility_int: 1,
})

// ★ 日本語用（kana → text11, jp → text12）
const jt = (id: number, kana: string, jp: string, title = ''): ReceivedText => ({
  text_id: id,
  title,
  text11: kana,
  text12: jp,
  text21: null,
  text22: null,
  visibility_int: 1,
})

/** 1テキストをキー配列から生成して t() に包むショートカット */
const keyDrill = (id: number, keys: string[], title: string, total = 120, chunk = 1, seed?: number) =>
  t(id, makeKeyDrill(keys, { total, chunk, sep: '', seed, noRepeat: true }), title)

const wordDrill = (id: number, words: string[], title: string, total = 80, chunk = 1, seed?: number) =>
  t(id, makeWordDrill(words, total, chunk, ' ', seed), title)

const wordPairDrill = (
  id: number,
  pairs: { jp: string; kana: string }[],
  title: string,
  total = 60,
  chunk = 1,
  seed?: number
) => {
  const { kana, jp } = makeWordPairDrill(pairs, total, chunk, ' ', seed)
  return jt(id, kana, jp, title)
}

export const BASIC_DECKS: Record<number, ReceivedText[]> = {
  // 1) 左右分離（英字のみなので t() のまま）
  [BASIC_ID.HAND_LEFT]: [
    keyDrill(-20101, LEFT_HAND_LETTERS, '左手-基本1', 120, 1),
    // keyDrill(-20102, LEFT_HAND_LETTERS, '左手-基本2', 160, 3),
  ],
  [BASIC_ID.HAND_RIGHT]: [
    keyDrill(-20201, RIGHT_HAND_LETTERS, '右手-基本1', 120, 1),
    // keyDrill(-20202, RIGHT_HAND_LETTERS, '右手-基本2', 160, 3),
  ],

  // 各指（親指以外）
  [BASIC_ID.FINGER_LEFT_PINKY]: [keyDrill(-103, LEFT_PINKY_LETTERS, '左小指', 120, 1)],
  [BASIC_ID.FINGER_LEFT_INDEX]: [keyDrill(-21101, LEFT_INDEX_LETTERS, '左人差し指', 180, 1)],
  [BASIC_ID.FINGER_LEFT_MIDDLE]: [keyDrill(-21111, LEFT_MIDDLE_LETTERS, '左中指', 170, 1)],
  [BASIC_ID.FINGER_LEFT_RING]: [keyDrill(-21121, LEFT_RING_LETTERS, '左薬指', 160, 1)],

  [BASIC_ID.FINGER_RIGHT_INDEX]: [keyDrill(-21201, RIGHT_INDEX_LETTERS, '右人差し指', 180, 1)],
  [BASIC_ID.FINGER_RIGHT_MIDDLE]: [keyDrill(-21211, RIGHT_MIDDLE_LETTERS, '右中指', 170, 1)],
  [BASIC_ID.FINGER_RIGHT_RING]: [keyDrill(-21221, RIGHT_RING_LETTERS, '右薬指', 160, 1)],
  [BASIC_ID.FINGER_RIGHT_PINKY]: [keyDrill(-21231, RIGHT_PINKY_LETTERS, '右小指', 150, 1)],

  // 3) かんたん単語（日本語は jt に変更）
  [BASIC_ID.EASY_EN_WORDS]: [
    wordDrill(-22101, EN_EASY_WORDS, '英語2-3文字ドリル', 90, 1), // 短語・1回打ち
    wordDrill(-22102, EN_EASY_WORDS, '英語2-3文字ドリル(連打)', 80, 2), // 同語を2連打
  ],
  [BASIC_ID.EASY_JA_WORDS]: [
    wordPairDrill(-22201, JA_EASY_PAIRS, '日本語かんたん語ドリル', 60, 1),
    wordPairDrill(-22202, JA_EASY_PAIRS, '日本語かんたん語ドリル(連打)', 50, 2),
  ],

  // 4) ランダム“易しい語”（固定セット→ドリル化）
  //   英語：WordsEG 全体から
  [BASIC_ID.RANDOM_EN_EASY]: [
    wordDrill(-23101, EN_BASIC_WORDS, '英語ランダム基礎', 120, 1),
    wordDrill(-23102, EN_BASIC_WORDS, '英語ランダム基礎(連打)', 100, 2),
  ],
  //   日本語：必要なら JA_EASY_PAIRS を増やす or 別のペア配列を用意して差し替え
  [BASIC_ID.RANDOM_JA_EASY]: [
    wordPairDrill(-23201, JA_EASY_PAIRS, '日本語ランダム基礎', 70, 1),
    wordPairDrill(-23202, JA_EASY_PAIRS, '日本語ランダム基礎(連打)', 60, 2),
  ],

  // 5) 数字（日本語文があるものは jt、英記号だけの行は t）
  [BASIC_ID.NUMBERS_EASY]: [
    t(-24101, '123 456 789 2468 1357 2025 0314 1000', '数字（易）'),
    // 日付・時刻は表示だけなら t でも良いですが、読み上げ用に jt でかなを付けるならこちら
    jt(
      -24102,
      'にせんにじゅうごねん/じゅうがつ/さんじゅういちにち ぜろなな:さんじゅう せんきゅうひゃくきゅうじゅうきゅう-じゅうに-さんじゅういち にじゅうさん:ごじゅうきゅう ぜろいち:ぜろご',
      '2025/10/31 07:30 1999-12-31 23:59 01:05',
      '日付・時刻'
    ),
    jt(-24103, 'えん1200 どる19.99 3680えん 15000 0.025', '¥1,200 $19.99 3,680円 15,000 0.025', '金額・小数'),
  ],

  // 6) 記号（英語系は t のまま）
  [BASIC_ID.SYMBOLS_EASY]: [
    t(-25101, '!!! ??? --- ___ *** ###', '記号連打'),
    t(-25102, '() [] {} <> "" \'\' `` // \\\\ ||', '対記号'),
    t(-25103, 'email@example.com path\\to\\file C:\\Users\\', '実用スニペット'),
  ],

  // 7) 数字多め／記号多め（日本語文は jt、英URLは t）
  [BASIC_ID.NUMBER_HEAVY_SENTENCES]: [
    jt(
      -26101,
      'にせんにじゅうよねんのはんばいすうは 1 2 , 5 4 0 だい 、ぜんねんひは プラス 8.4 パーセントでした。',
      '2024年の販売数は12,540台、前年比は+8.4%でした。',
      '統計っぽい文'
    ),
    jt(
      -26102,
      'てじゅん 1 : 10ふん よねつ。てじゅん 2 : 180どで 25ふん やく。',
      '手順1: 10分予熱。手順2: 180℃で25分焼く。',
      '手順書'
    ),
  ],
  [BASIC_ID.SYMBOL_HEAVY_SENTENCES]: [
    t(-26201, 'Open https://example.com?lang=ja&ref=home#top', 'URL'),
    t(-26202, 'PATH=/usr/local/bin:$PATH NODE_ENV=production', '環境変数'),
  ],

  // 8) 有名文（PD）— EN は t、JA は jt（変更点）
  [BASIC_ID.FAMOUS_EN_PD]: FAMOUS_EN_PD.map((s, i) => t(-27100 - i, s, `Famous EN ${i + 1}`)),
  [BASIC_ID.FAMOUS_JA_PD]: FAMOUS_JA_PD.map((o, i) => jt(-27200 - i, o.kana, o.jp, `有名文 JP ${i + 1}`)),
}
