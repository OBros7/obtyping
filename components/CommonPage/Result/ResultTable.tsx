import React from 'react'
import { useTranslation } from '@/MyCustomHooks'
import { langDict } from '.'

const titleClass = 'text-2xl font-bold text-center my-4'
const thTdClass = 'text-center border border-gray-400 p-2'
const thClass = thTdClass + ' bg-blue-400 text-white'
const tdClass = thTdClass + ' bg-blue-100'

interface ResultTableProps {
  recordTopK: any
  topK: number
  record: number
}

const makeRowKey = (r: any, i: number) => {
  // 1) record_id が数値/文字列で存在するなら最優先
  if (r?.record_id !== undefined && r?.record_id !== null) return String(r.record_id)
  // 2) それが無い場合は複合キー（多くのケースで安定）
  if (r?.user_id && r?.timestamp) return `${r.user_id}-${r.timestamp}`
  // 3) 最後の保険（スコア+日時+index）
  return `${r?.score ?? 'na'}-${r?.timestamp ?? 'na'}-${i}`
}

export default function ResultTable({ recordTopK, topK }: ResultTableProps) {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]
  return (
    <>
      <div className={titleClass}>
        {translater.yourTopRecords}: Top {topK}
      </div>
      <table className='w-full'>
        <thead>
          <tr>
            <th className={thClass}>Rank</th>
            <th className={thClass}>Record</th>
            <th className={thClass}>Date: Y-M-D</th>
          </tr>
        </thead>
        <tbody>
          {recordTopK.map((record: any, i: number) => (
            <tr key={makeRowKey(record, i)}>
              <td className={tdClass}>{i + 1}</td>
              <td className={tdClass}>{record.score}</td>
              <td className={tdClass}>
                {record.timestamp.slice(0, 10)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
