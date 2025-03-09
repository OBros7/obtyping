import React, { useContext, useState, useEffect } from 'react'
import { useUserContext } from '@contexts/UserContext';
import { useTranslation } from '@/MyCustomHooks'
import {
  ResultBox,
  ResultTable,
  ResultButtons,
  ResultGraph,
  langDict,
  createChartData,
  createXY4Graph,
  getTopRecords,
  MistakenKeyTable,
} from './'
import {
  PostRecordTime,
  createRecordTime,
  getRecordTime,
} from '@/MyLib/UtilsAPIRecord'
import { GlobalContext } from '@contexts/GlobalContext'
import { signIn } from 'next-auth/react'
import type { ChartData, ChartOptions } from 'chart.js'

const fastAPIURL = process.env.FASTAPI_URL + '/api/typing/'
const BACKEND_API_KEY = process.env.BACKEND_API_KEY || ''
const options: ChartOptions<'line'> = {
  scales: {
    y: {
      beginAtZero: false,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
}

interface ResultDefaultProps {
  // urlPost: string
  // urlGet: string
  deckId: number
  minutes: number
  record: number
  unit?: string
  resultBoxText?: string
  topK?: number
  recentK?: number
  supplementaryItem1?: string
  supplementaryRecord1: number
  supplementaryUnit1?: string
  supplementaryItem2?: string
  supplementaryRecord2: number
  supplementaryUnit2?: string
  handlePlayAgain: () => void
  handleBackToHome: () => void
  higherBetter: boolean
  mostMistakenKeys: { key: string; count: number }[]
  setMostMistakenKeys: React.Dispatch<React.SetStateAction<{ key: string; count: number }[]>>
  mistake: number
}

export default function ResultDefault({
  deckId,
  minutes,
  record,
  unit,
  resultBoxText,
  topK = 5,
  recentK = 10,
  supplementaryItem1,
  supplementaryRecord1,
  supplementaryUnit1,
  supplementaryItem2,
  supplementaryRecord2,
  supplementaryUnit2,
  handlePlayAgain,
  handleBackToHome,
  higherBetter,
  mostMistakenKeys,
  setMostMistakenKeys,
  mistake
}: ResultDefaultProps) {
  /* 
  urlPost: url for posting data. userID & setting information should be included in the url as parameters
  urlGet: url for getting data. userID & setting information should be included in the url as parameters
  record: the record of the current game
  unit: unit of the record, default is 's'
  resultBoxText: text in the result box. Setting information can be included in the text
  topK: number of records to be displayed in the table
  recentK: number of records to be displayed in the graph
  handlePlayAgain: function to be called when the play again button is clicked
  handleBackToHome: function to be called when the back to start button is clicked
  */
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]
  const { userData, setUserData } = useUserContext();
  const [saved, setSaved] = useState<boolean>(false)
  const [rank, setRank] = useState<'best' | 'topK' | 'none'>('none')
  const [chartData, setChartData] = useState<any>(createChartData([], []))
  const [recordTopK, setRecordTopK] = useState<any>([])

  const mistypeTableHeader = [translater.key, translater.count]

  // 以下三つはサインイン一時停止で追加。以下三つはサインインの処理を戻したら消す
  const buttonClassCommon = 'w-32 h-10 rounded-md text-white font-bold mx-1 text-lg'
  const playAgainButtonClass = buttonClassCommon + ' bg-blue-500 hover:bg-blue-700'
  const backToStartButtonClass = buttonClassCommon + ' bg-red-500 hover:bg-red-700'

  // get user records
  useEffect(() => {
    if (userData.loginStatus === true) {
      const nSelect = recentK;
      const orderBy = 'score';

      getRecordTime(userData.userID, deckId, nSelect, orderBy)
        .then((data) => {
          if (data && data.detail) {
            console.error('Error fetching data:', data.detail);
            setRecordTopK([]);
          } else {
            // Sort data in ascending order by timestamp
            const sortedData = data.sort((a: { timestamp: number }, b: { timestamp: number }) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            setRecordTopK(sortedData);

            if (sortedData.length > 0) {
              const add = saved ? 1 : 0;

              // Set data for graph
              const { x, y } = createXY4Graph(data, recentK + add);
              setChartData(createChartData(x, y));

              // Set data for table
              const dataTopK = getTopRecords(data, topK, higherBetter);
              setRecordTopK(dataTopK);

              // Determine rank
              if (!saved) {
                if (higherBetter) {
                  if (dataTopK[0].record < record) {
                    setRank('best');
                  } else if (dataTopK[dataTopK.length - 1].record < record) {
                    setRank('topK');
                  } else {
                    setRank('none');
                  }
                } else {
                  if (dataTopK[0].record > record) {
                    setRank('best');
                  } else if (dataTopK[dataTopK.length - 1].record > record) {
                    setRank('topK');
                  } else {
                    setRank('none');
                  }
                }
              }
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [userData.userID, saved]);

  // post record in the database
  const handleSave = () => {
    // Note: only record will be sent as a json object to the server. userID & setting info must be included in the url
    const data: PostRecordTime = {
      user_id: Number(userData.userID),
      deck_id: deckId,
      // needs to be fixed based on the results from typing game!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      score: record,
      wpm: 1,
      cpm: supplementaryRecord2,
      accuracy: supplementaryRecord1,
      seconds: minutes * 60,
    }


    const resJson = createRecordTime(data)
      .then((res) => {
        console.log(res)
        setSaved(true)
        // Update chart data to include '今回'
        setChartData((prevChartData: any) => {
          const updatedLabels = [...prevChartData.labels.slice(1), '今回'];
          const updatedDatasets = prevChartData.datasets.map((dataset: any) => {
            return {
              ...dataset,
              data: [...dataset.data.slice(1), record],
            };
          });

          return {
            ...prevChartData,
            labels: updatedLabels,
            datasets: updatedDatasets,
          };
        });

      })
      .catch((error) => {
        console.error('Error sending data:', error)
      })
    console.log(resJson)
  }

  return (
    <div className='flex flex-col items-center justify-center h-full'>
      {/* <ResultButtons
        handleSave={handleSave}
        handlePlayAgain={handlePlayAgain}
        handleBackToHome={handleBackToHome}
        saved={saved}
      /> サインイン一時停止 */}

      <div className='flex flex-row items-center justify-center'>
        <button className={playAgainButtonClass} onClick={handlePlayAgain}>
          Play Again
        </button>
        <button className={backToStartButtonClass} onClick={handleBackToHome}>
          Back to Home
        </button>
      </div>

      <ResultBox
        record={record}
        unit={unit}
        additionalText={resultBoxText}
        supplementaryItem1={supplementaryItem1}
        supplementaryRecord1={supplementaryRecord1}
        supplementaryUnit1={supplementaryUnit1}
        supplementaryItem2={supplementaryItem2}
        supplementaryRecord2={supplementaryRecord2}
        supplementaryUnit2={supplementaryUnit2}
        mistakenKeys={mostMistakenKeys}
      />

      {/* {mistake > 0 ? (
        <MistakenKeyTable
          headers={mistypeTableHeader}
          data={mostMistakenKeys.map(({ key, count }) => [key, count])}
          title={translater.mistakeKeyInfoMessage}
        />
      ) : (
        <p className='text-xl font-bold mb-1'>{translater.noMissMassage}</p>
      )
      } */}

      {/* {userData.loginStatus === true ? (
        <>
          {rank === 'best' ? (
            <div className='my-2 outline outline-red-500 p-4 rounded bg-red-100 text-center'>
              <p className='text-xl font-bold mb-1'>New Record!!</p>
              <p className='text-xl font-bold'>{translater.saveRecord}!</p>
            </div>
          ) : rank === 'topK' ? (
            <div className='my-2 outline outline-red-500 p-4 rounded bg-red-100 text-center'>
              <p className='text-xl font-bold mb-1'>You record is in your top {topK}!!</p>
              <p className='text-xl font-bold'>{translater.saveRecord}!</p>
            </div>
          ) : null}
          <div className='flex flex-col items-center justify-center md:w-4/6 w-full'>
            <ResultGraph data={chartData} options={options} />
            <ResultTable recordTopK={recordTopK} topK={topK} record={record} />
          </div>
          <ResultButtons
            handleSave={handleSave}
            handlePlayAgain={handlePlayAgain}
            handleBackToHome={handleBackToHome}
            saved={saved}
          />
        </>
      ) : (
        <button className='text-white text-3xl font-bold bg-green-500 hover:bg-green-700 p-4 rounded m-4' onClick={() => signIn()}> {translater.signinToRecord}</button>
      )} サインイン一時停止 */}
    </div>
  )
}