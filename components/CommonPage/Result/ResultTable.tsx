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
            <tr key={record.record_id}>
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
