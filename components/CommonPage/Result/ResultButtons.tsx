import React, { useContext } from 'react'
import { GlobalContext } from '@contexts/GlobalContext'
import { useUserContext } from '@contexts/UserContext';

interface ResultButtonsProps {
  handleSave: () => void
  handlePlayAgain: () => void
  handleBackToStart: () => void
  saved: boolean
}

const buttonClassCommon = 'w-32 h-10 rounded-md text-white font-bold mx-1 text-lg'
const saveButtonClass = buttonClassCommon + ' bg-green-500 hover:bg-green-700 disabled:opacity-50'
const playAgainButtonClass = buttonClassCommon + ' bg-blue-500 hover:bg-blue-700'
const backToStartButtonClass = buttonClassCommon + ' bg-red-500 hover:bg-red-700'

export default function ResultButtons({ handleSave, handlePlayAgain, handleBackToStart, saved }: ResultButtonsProps) {
  // const { session, userID } = useContext(GlobalContext)
  const { userData, setUserData } = useUserContext();

  return (
    <div className='my-4'>
      {userData.loginStatus === true ? (
        <button className={saveButtonClass} onClick={handleSave} disabled={saved}>
          {saved ? 'Saved!' : 'Save'}
        </button>
      ) : null}

      <button className={playAgainButtonClass} onClick={handlePlayAgain}>
        Play Again
      </button>
      <button className={backToStartButtonClass} onClick={handleBackToStart}>
        Back to Start
      </button>
    </div>
  )
}
