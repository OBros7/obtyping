import React from 'react';
import { useTranslation } from '@/MyCustomHooks';
import { langDict } from '.';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import type { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const titleClass = 'text-2xl font-bold text-center my-4';

interface ResultGraphProps {
  data: ChartData<'line'>;
  options?: ChartOptions<'line'>;
}

export default function ResultGraph({ data, options }: ResultGraphProps) {
  const [translator] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string];

  // Create labels for the x-axis based on the number of data points (e.g., '10回前', '9回前', ..., '前回')
  const labels = Array.from({ length: Math.min(data.datasets[0].data.length, 10) }, (_, i) =>
    i === 0 ? '前回' : `${i + 1}回前`
  ).reverse();

  // Update the data object to include the generated labels
  const updatedData = {
    ...data,
    labels,
  };

  return (
    <>
      {data.datasets[0].data.length > 1 ? (
        <>
          <div className={titleClass}>{translator.recentHistory}</div>
          <Line options={options} data={updatedData} />
        </>
      ) : null}
    </>
  );
}
