import React from 'react'

interface ResultBoxPrep {
  record: number
  unit?: string
  additionalText?: string
  supplementaryItem1?: string
  supplementaryRecord1?: number
  supplementaryUnit1?: string
  supplementaryItem2?: string
  supplementaryRecord2?: number
  supplementaryUnit2?: string
  mistakenKeys?: { key: string; count: number }[]
}

export default function ResultBox({ record, unit, additionalText, supplementaryItem1, supplementaryRecord1, supplementaryUnit1, supplementaryItem2, supplementaryRecord2, supplementaryUnit2, mistakenKeys }: ResultBoxPrep) {
  // mistakenKeysをソートして上位3つを取得
  const topMistakenKeys = mistakenKeys
    ? [...mistakenKeys].sort((a, b) => b.count - a.count).slice(0, 3)
    : []

  return (
    <div className='outline outline-8 outline-yellow-400 bg-yellow-100 rounded-lg py-4 px-12 my-4'>
      <div className='flex flex-col items-center justify-center text-3xl font-bold mb-4'> - RESULT - </div>
      {additionalText && <div className='text-xl font-bold my-2 text-center'>{additionalText}</div>}
      <div className='flex flex-row items-end justify-center text-3xl font-bold mb-4'>
        <span className='text-5xl font-bold'>{record}</span> <span className='text-3xl font-bold'>&nbsp;{unit}</span>
      </div>
      <div className="flex items-center justify-center space-x-2">{supplementaryItem1}&nbsp;{supplementaryRecord1}&nbsp;{supplementaryUnit1}</div>
      <div className="flex items-center justify-center space-x-2">{supplementaryItem2}&nbsp;{supplementaryRecord2}&nbsp;{supplementaryUnit2}</div>

      {/* 間違えたキーの上位3つを表示 */}
      {topMistakenKeys.length > 0 ? (
        <div className='mt-4'>
          <div className='text-xl font-bold mb-2'>Frequently mistyped keys:</div>
          <ul className='list-disc list-inside'>
            {topMistakenKeys.map((item, index) => (
              <div key={index} className='text-lg text-center'>
                {item.key}: {item.count} times
              </div>
            ))}
          </ul>
        </div>
      ) : (
        <div className='mt-4 text-xl font-bold'>ノーミスですごい！</div>
      )}
    </div>
  )
}