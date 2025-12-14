// components/Typing/Content/WordSets.ts
import WordsEG from './WordsEG' // 既存の英語頻出語

/** 英語・易しめ（短語中心）— 必要に応じて WordsEG から抽出 */
export const EN_EASY_WORDS = [
  'cat',
  'dog',
  'sun',
  'map',
  'run',
  'pen',
  'box',
  'red',
  'cup',
  'bed',
  'car',
  'bus',
  'egg',
  'pie',
  'cap',
]

/** 英語・基礎（既存の WordsEG 全体を使う場合はこちら） */
export const EN_BASIC_WORDS = WordsEG

/** 日本語・易しめ（原文とかなのペア） */
export const JA_EASY_PAIRS: { jp: string; kana: string }[] = [
  { jp: '家', kana: 'いえ' },
  { jp: '犬', kana: 'いぬ' },
  { jp: '森', kana: 'もり' },
  { jp: '山', kana: 'やま' },
  { jp: '川', kana: 'かわ' },
  { jp: '空', kana: 'そら' },
  { jp: '花', kana: 'はな' },
  { jp: '雪', kana: 'ゆき' },
  { jp: '音', kana: 'おと' },
  { jp: '道', kana: 'みち' },
  { jp: '海', kana: 'うみ' },
  { jp: '星', kana: 'ほし' },
]
