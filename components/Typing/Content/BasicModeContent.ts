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
import { EN_EASY_WORDS, EN_BASIC_WORDS, EN_LONG_WORDS, JA_EASY_WORDS, JA_LONG_WORDS } from './WordsSets'

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

const wordPairDeck = (
  idBase: number, // text_id 用のベース（衝突しない値にする）
  pairs: { jp: string; kana: string }[],
  title: string,
  total = 60,
  wordsPerText = 30,
  chunk = 1,
  seed?: number
): ReceivedText[] => {
  const { kana, jp } = makeWordPairDrill(pairs, total, chunk, ' ', seed)

  const kanaTokens = kana.split(' ').filter(Boolean)
  const jpTokens = jp.split(' ').filter(Boolean)

  const out: ReceivedText[] = []
  let part = 0

  for (let start = 0; start < kanaTokens.length; start += wordsPerText) {
    const k = kanaTokens.slice(start, start + wordsPerText).join(' ')
    const j = jpTokens.slice(start, start + wordsPerText).join(' ')

    out.push(
      jt(
        idBase - part, // text_id（ユニークなら何でもOK）
        k,
        j,
        `${title} ${part + 1}` // タイトルは任意
      )
    )
    part++
  }

  return out
}

export const BASIC_DECKS: Record<number, ReceivedText[]> = {
  // 1) 左右分離（英字のみなので t() のまま）
  [BASIC_ID.HAND_LEFT]: [keyDrill(-101, LEFT_HAND_LETTERS, '指別タイピング（左手）', 120, 1)],
  [BASIC_ID.HAND_RIGHT]: [keyDrill(-102, RIGHT_HAND_LETTERS, '指別タイピング（右手）', 120, 1)],

  // 各指（親指以外）
  [BASIC_ID.FINGER_LEFT_PINKY]: [keyDrill(-103, LEFT_PINKY_LETTERS, '指別タイピング（左小指）', 120, 1)],
  [BASIC_ID.FINGER_LEFT_INDEX]: [keyDrill(-104, LEFT_INDEX_LETTERS, '指別タイピング（左人差し指）', 180, 1)],
  [BASIC_ID.FINGER_LEFT_MIDDLE]: [keyDrill(-105, LEFT_MIDDLE_LETTERS, '指別タイピング（左中指）', 170, 1)],
  [BASIC_ID.FINGER_LEFT_RING]: [keyDrill(-106, LEFT_RING_LETTERS, '指別タイピング（左薬指）', 160, 1)],

  [BASIC_ID.FINGER_RIGHT_INDEX]: [keyDrill(-107, RIGHT_INDEX_LETTERS, '指別タイピング（右人差し指）', 180, 1)],
  [BASIC_ID.FINGER_RIGHT_MIDDLE]: [keyDrill(-108, RIGHT_MIDDLE_LETTERS, '指別タイピング（右中指）', 170, 1)],
  [BASIC_ID.FINGER_RIGHT_RING]: [keyDrill(-109, RIGHT_RING_LETTERS, '指別タイピング（右薬指）', 160, 1)],
  [BASIC_ID.FINGER_RIGHT_PINKY]: [keyDrill(-110, RIGHT_PINKY_LETTERS, '指別タイピング（右小指）', 150, 1)],

  // 3) かんたん単語（日本語は jt に変更）
  [BASIC_ID.SHORT_WORDS_EN]: [
    wordDrill(-121, EN_EASY_WORDS, 'かんたん英単語', 90, 1), // 短語・1回打ち
  ],
  [BASIC_ID.SHORT_WORDS_JA]: [
    // 60語を「30語×2テキスト」に分割
    ...wordPairDeck(-221, JA_EASY_WORDS, '日本語かんたん語ドリル', 60, 20, 1, Date.now()),
  ],

  // 4) 長めの単語
  [BASIC_ID.LONG_WORDS_EN]: [wordDrill(-131, EN_LONG_WORDS, '長めの英単語', 120, 1)],
  //   日本語：必要なら JA_EASY_WORDS を増やす or 別のペア配列を用意して差し替え
  [BASIC_ID.LONG_WORDS_JA]: [
    // 70語を「20語ごと」に分割（20/20/20/10）
    ...wordPairDeck(-23100, JA_LONG_WORDS, '日本語ランダム基礎', 70, 10, 1, Date.now()),
  ],

  // 7) 数字多め／記号多め（日本語文は jt、英URLは t）
  [BASIC_ID.NUMBER_HEAVY_SENTENCES_JP]: [
    jt(
      -2611,
      '2024ねんのはんばいすうは12,540だい、ぜんねんひはプラス8.4パーセントでした。',
      '2024年の販売数は12,540台、前年比はプラス8.4%でした。',
      'text1'
    ),
    jt(
      -2612,
      'てじゅん1:10ふんよねつ。てじゅん2:180どで25ふんやく。',
      '手順1:10分予熱。手順2: 180℃で25分焼く。',
      'text2'
    ),
    jt(
      -2613,
      'しゅくだいは6ぺーじあるので30ぷんでおわらせます。',
      '宿題は6ページあるので、30分で終わらせます。',
      'text3'
    ),
    jt(
      -2614,
      'のーとを5さつかったので1さつはいえにおきました。',
      'ノートを5冊買ったので、1冊は家に置きました。',
      'text4'
    ),
    jt(-2615, 'きょうは3かい10ぷんずつさんぽしました。', '今日は3回、10分ずつ散歩しました。', 'text5'),
  ],
  [BASIC_ID.NUMBER_HEAVY_SENTENCES_EN]: [
    t(-1611, 'I wake up at 7:10 and drink 1 glass of water.', 'text1'),
    t(-1612, 'We have 2 cats, and they sleep for about 14 hours a day.', 'text2'),
    t(-1613, 'Please read pages 3 to 5 and write 2 short notes.', 'text3'),
    t(-1614, 'The bus comes at 8:30, so I leave home at 8:20.', 'text4'),
    t(-1615, 'I practiced typing for 15 minutes and made 3 fewer mistakes today.', 'text5'),
  ],
  [BASIC_ID.SYMBOL_HEAVY_SENTENCES_EN]: [
    t(-1621, 'Open https://example.com?lang=ja&ref=home#top', 'text1'),
    t(-1622, 'PATH=/usr/local/bin:$PATH NODE_ENV=production', 'text2'),
    t(-1623, 'We have 2 cats (Luna & Leo), and they sleep ~14 hours a day.', 'text3'),
    t(-1624, 'Meet me at 7:30 at the station (North Gate), OK?', 'text4'),
    t(-1625, 'My password is "Study-2025!"--please keep it secret.', 'text5'),
  ],
  [BASIC_ID.SYMBOL_HEAVY_SENTENCES_JP]: [
    jt(
      -2621,
      'きょうのよていは(1)そうじ、(2)べんきょう、(3)かいもの。',
      '今日の予定は(1)掃除、(2)勉強、(3)買い物。',
      'text1'
    ),
    jt(-2622, 'しゅうごうは7:30、ばしょはえきまえ(きたぐち)です。', '集合は7:30、場所は駅前(北口)です。', 'text2'),
    jt(-2623, 'めも: ぎゅうにゅう2ほん/たまご10こ/ぱん1ふくろ。', 'メモ: 牛乳2本/卵10個/パン1袋。', 'text3'),
    jt(-2624, 'このもんだい、とける? たぶん3ぷんでできる!', 'この問題、解ける? たぶん3分でできる!', 'text4'),
    jt(-2625, 'https://example.com?page=1&ref=home#top', 'https://example.com?page=1&ref=home#top', 'text5'),
  ],

  // 8) 有名文（PD）— EN は t、JA は jt（変更点）
  [BASIC_ID.FAMOUS_EN_PD]: FAMOUS_EN_PD.map((s, i) => t(-27100 - i, s, `Famous EN ${i + 1}`)),
  [BASIC_ID.FAMOUS_JA_PD]: FAMOUS_JA_PD.map((o, i) => jt(-27200 - i, o.kana, o.jp, `有名文 JP ${i + 1}`)),
}
