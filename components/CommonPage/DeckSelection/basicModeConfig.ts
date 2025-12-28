import { langDict } from './'

export type LangKey = keyof typeof langDict
export type AppLocale = 'ja' | 'en'
export type LocalizedHref = Partial<Record<AppLocale, string>>

export type BasicItem = {
  id: string
  titleKey: LangKey
  descriptionKey: LangKey
  href: string | LocalizedHref
}

export type BasicGroup = {
  id: string
  titleKey: LangKey
  descriptionKey?: LangKey
  items: BasicItem[]
}

export type BasicSection = {
  id: string
  titleKey: LangKey
  descriptionKey?: LangKey
  groups: BasicGroup[]
}

export const basicSections: BasicSection[] = [
  {
    id: 'foundation',
    titleKey: 'foundationTitle',
    descriptionKey: 'foundationDescription',
    groups: [
      {
        id: 'by-finger',
        titleKey: 'byFingerTitle',
        descriptionKey: 'byFingerDescription',
        items: [
          {
            id: 'left-pinky',
            titleKey: 'leftPinky',
            descriptionKey: 'leftPinkyDiscription',
            href: '/typing/typing?deckid=-103&minutes=1&lang=en',
          },
          {
            id: 'right-pinky',
            titleKey: 'rightPinky',
            descriptionKey: 'rightPinkyDiscription',
            href: '/typing/typing?deckid=-110&minutes=1&lang=en',
          },
          {
            id: 'left-ring',
            titleKey: 'leftRing',
            descriptionKey: 'leftRingDiscription',
            href: '/typing/typing?deckid=-104&minutes=1&lang=en',
          },
          {
            id: 'right-ring',
            titleKey: 'rightRing',
            descriptionKey: 'rightRingDiscription',
            href: '/typing/typing?deckid=-109&minutes=1&lang=en',
          },
          {
            id: 'left-middle',
            titleKey: 'leftMiddle',
            descriptionKey: 'leftMiddleDiscription',
            href: '/typing/typing?deckid=-105&minutes=1&lang=en',
          },
          {
            id: 'right-middle',
            titleKey: 'rightMiddle',
            descriptionKey: 'rightMiddleDiscription',
            href: '/typing/typing?deckid=-108&minutes=1&lang=en',
          },
          {
            id: 'left-index',
            titleKey: 'leftIndex',
            descriptionKey: 'leftIndexDiscription',
            href: '/typing/typing?deckid=-106&minutes=1&lang=en',
          },
          {
            id: 'right-index',
            titleKey: 'rightIndex',
            descriptionKey: 'rightIndexDiscription',
            href: '/typing/typing?deckid=-107&minutes=1&lang=en',
          },
        ],
      },
      {
        id: 'by-hand',
        titleKey: 'byHandTitle',
        descriptionKey: 'byHandDescription',
        items: [
          {
            id: 'left-hand',
            titleKey: 'leftHand',
            descriptionKey: 'leftHandDiscription',
            href: '/typing/typing?deckid=-101&minutes=1&lang=en',
          },
          {
            id: 'right-hand',
            titleKey: 'rightHand',
            descriptionKey: 'rightHandDiscription',
            href: '/typing/typing?deckid=-102&minutes=1&lang=en',
          },
          {
            id: 'both-hands',
            titleKey: 'bothHands',
            descriptionKey: 'bothHandsDiscription',
            href: '/typing/typing?deckid=-100&minutes=1&lang=en',
          },
        ],
      },
    ],
  },
  {
    id: 'basic',
    titleKey: 'basicTitle',
    descriptionKey: 'basicDescription',
    groups: [
      {
        id: 'basic-main',
        titleKey: 'basicMainTitle',
        descriptionKey: 'basicMainDescription',
        items: [
          {
            id: 'words',
            titleKey: 'wordsTitle_short',
            descriptionKey: 'wordsDescription_short',
            href: {
              en: '/typing/typing?deckid=-121&minutes=1&lang=en',
              ja: '/typing/typing?deckid=-221&minutes=1&lang=ja',
            },
          },
          {
            id: 'words',
            titleKey: 'wordsTitle_long',
            descriptionKey: 'wordsDescription_long',
            href: {
              en: '/typing/typing?deckid=-131&minutes=1&lang=en',
              ja: '/typing/typing?deckid=-231&minutes=1&lang=ja',
            },
          },
          {
            id: 'sentence-with-number',
            titleKey: 'sentenceWithNumberTitle',
            descriptionKey: 'sentenceWithNumberDescription',
            href: {
              en: '/typing/typing?deckid=-161&minutes=1&lang=en',
              ja: '/typing/typing?deckid=-261&minutes=1&lang=ja',
            },
          },
          {
            id: 'sentence-with-symbol',
            titleKey: 'sentenceWithSymbolTitle',
            descriptionKey: 'sentenceWithSymbolDescription',
            href: {
              en: '/typing/typing?deckid=-162&minutes=1&lang=en',
              ja: '/typing/typing?deckid=-262&minutes=1&lang=ja',
            },
          },
          {
            id: 'easy-sentence',
            titleKey: 'easySentenceTitle',
            descriptionKey: 'easySentenceDescription',
            href: {
              en: '/typing/typing?deckid=-171&minutes=1&lang=en',
              ja: '/typing/typing?deckid=-271&minutes=1&lang=ja',
            },
          },
        ],
      },
    ],
  },
]
