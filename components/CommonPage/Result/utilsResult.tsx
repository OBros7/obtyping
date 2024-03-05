import type { ChartData, ChartOptions } from 'chart.js'

// process data from server
const getTopRecords = (records: any, k: number, higherBetter: boolean) => {
  if (higherBetter) {
    records.sort((a: any, b: any) => b.score - a.score)
  } else {
    records.sort((a: any, b: any) => a.score - b.score)
  }
  const topRecords = records.slice(0, k)
  return topRecords
}

const createXY4Graph = (records: any, recentK: number) => {
  const recentRecords = records.slice(-recentK)
  // const x = recentRecords.map((d: any) => d.timestamp.slice(0, 10))
  const x = recentRecords.map((d: any) => '')
  const y = recentRecords.map((d: any) => d.score)
  return { x, y }
}

const createChartData = (x: any, y: any) => {
  // create x for x-axis labels

  const chartData: ChartData<'line'> = {
    labels: x,
    datasets: [
      {
        data: y,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  }
  return chartData
}

// export all functions
export { createChartData, createXY4Graph, getTopRecords }
