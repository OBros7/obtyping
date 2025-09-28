import React, { useId, useState } from 'react'
import { useRouter } from 'next/router'
import { ReceivedDeck } from '@/MyLib/UtilsAPITyping'
import { MySelect } from '@/Basics'

type ModeTime = 1 | 2 | 3 | 5

interface DeckCardButtonProps {
    deck: ReceivedDeck
    setLanguage?: React.Dispatch<React.SetStateAction<'not selected' | 'japanese' | 'english' | 'free'>> | undefined
    showMeta?: boolean
    showPremiumBadge?: boolean
    premiumLabel?: string
}

type DeckMeta = ReceivedDeck & {
    level?: string | null
    category?: string | null
    subcategory?: string | null
    visibility?: string | null // "premium" であれば有料限定
}

const cardClass =
    'w-5/6 mx-auto my-4 rounded-2xl border-2 border-blue-200 bg-white shadow-sm ' +
    'hover:shadow-md focus-within:ring-2 focus-within:ring-blue-300 transition'

const gridClass =
    'grid gap-4 items-start p-6 md:p-8 sm:grid-cols-[1fr_auto_auto] sm:grid-rows-[auto_auto]'

const titleClass = 'text-2xl font-bold'
const metaClass = 'text-sm text-gray-600 font-medium ml-4'
const descriptionClass = 'text-sm text-gray-600 mt-2 leading-relaxed'
const buttonClass =
    'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold ' +
    'py-2 px-5 rounded-lg h-fit w-fit focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-400'

export default function DeckCardButton({
    deck,
    setLanguage,
    showMeta = false,
    showPremiumBadge = true,
    premiumLabel = '有料限定',
}: DeckCardButtonProps) {
    const d = deck as DeckMeta
    const [modeTime, setModeTime] = useState<ModeTime>(1)
    const router = useRouter()
    const selectId = useId()

    const handleStart = () => {
        const href = { pathname: '/typing/typing', query: { deckid: deck.deck_id, minutes: modeTime, lang: (deck as any).lang } }
        router.push(href)
    }

    // ---- メタ情報（null は非表示）----
    const hasLevel = !!d.level
    const hasCategory = !!d.category
    const hasSubcategory = !!d.subcategory

    const catText =
        hasCategory && hasSubcategory ? `${d.category} - ${d.subcategory}`
            : hasCategory ? d.category!
                : hasSubcategory ? d.subcategory!
                    : ''

    const metaPieces: string[] = []
    if (hasLevel) metaPieces.push(String(d.level))
    if (catText) metaPieces.push(catText)

    // ---- プレミアム判定（visibility === 'premium'）----
    const isPremium = (d.visibility ?? '').trim().toLowerCase() === 'premium'

    return (
        <section className={cardClass} aria-label={`Deck: ${deck.title}`}>
            <div className={gridClass}>
                {/* 左: タイトル & メタ + 説明 */}
                <div className="sm:col-start-1 sm:row-span-2 min-w-0">
                    <div className="flex items-baseline flex-wrap">
                        <h2 className={titleClass}>{deck.title}</h2>
                        {showMeta && metaPieces.length > 0 && (
                            <span className={metaClass}>{metaPieces.join('　·　')}</span>
                        )}
                    </div>
                    {deck.description && <p className={descriptionClass}>{deck.description}</p>}
                </div>

                {/* 右上: プレミアムバッジ */}
                {showPremiumBadge && isPremium && (
                    <div className="sm:col-start-3 sm:row-start-1 justify-self-end">
                        <span className="inline-block rounded-md px-3 py-1 text-sm font-semibold bg-yellow-300 text-gray-800 shadow">
                            {premiumLabel}
                        </span>
                    </div>
                )}

                {/* 中段: 時間セレクト */}
                <div className="justify-self-start sm:justify-self-end sm:col-start-2 sm:row-start-2">
                    <label htmlFor={selectId} className="sr-only">Select practice duration</label>
                    <MySelect
                        // id={selectId as unknown as string}
                        state={modeTime}
                        setState={setModeTime}
                        optionValues={[1, 2, 3, 5]}
                        optionTexts={['1m', '2m', '3m', '5m']}
                    />
                </div>

                {/* 右下: START */}
                <div className="justify-self-start sm:justify-self-end sm:col-start-3 sm:row-start-2">
                    <button type="button" className={buttonClass} onClick={handleStart}>
                        START
                    </button>
                </div>
            </div>
        </section>
    )
}
