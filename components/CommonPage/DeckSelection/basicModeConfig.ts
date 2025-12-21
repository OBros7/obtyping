import { useTranslation } from '@/MyCustomHooks'
import { langDict } from './'

export type LangKey = keyof typeof langDict

export type BasicItem = {
  id: string
  titleKey: LangKey
  descriptionKey: LangKey
  href: string
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
            titleKey: 'wordsTitle',
            descriptionKey: 'wordsDescription',
            href: '/typing/typing?deckid=-121&minutes=1&lang=en',
          },
          {
            id: 'sentence-with-number',
            titleKey: 'sentenceWithNumberTitle',
            descriptionKey: 'sentenceWithNumberDescription',
            href: '/typing/typing?deckid=-263&minutes=1&lang=en',
          },
          {
            id: 'sentence-with-symbol',
            titleKey: 'sentenceWithSymbolTitle',
            descriptionKey: 'sentenceWithSymbolDescription',
            href: '/typing/typing?deckid=-262&minutes=1&lang=en',
          },
          {
            id: 'easy-sentence',
            titleKey: 'easySentenceTitle',
            descriptionKey: 'easySentenceDescription',
            href: '/typing/typing?deckid=-171&minutes=1&lang=en',
          },
        ],
      },
    ],
  },
]
