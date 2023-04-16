import React from 'react'
import { useTranslation } from '@/MyCustomHooks'
import { langDict } from '.'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

import type { ChartData, ChartOptions } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const titleClass = 'text-2xl font-bold text-center my-4'

interface ResultGraphProps {
  data: ChartData<'line'>
  options?: ChartOptions<'line'>
}

export default function ResultGraph({ data, options }: ResultGraphProps) {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]
  return (
    <>
      {data.datasets[0].data.length > 1 ? (
        <>
          <div className={titleClass}>{translater.recentHistory}</div>
          <Line options={options} data={data} />
        </>
      ) : null}
    </>
  )
}
