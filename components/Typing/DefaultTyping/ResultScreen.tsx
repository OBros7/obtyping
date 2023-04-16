import React, { useRef, useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import { langDict } from '.'

interface ResultScreenProps {
  title: string // Explanation of this screen
  item1: string // First item
  score1: number // First score
  unit1?: string // Unit of first item
  item2?: string // Second item
  score2?: number // Second score
  unit2?: string // Unit of second item
  item3?: string // Third item
  score3?: number // Third score
  unit3?: string // Unit of third item
}

export default function ResultScreen({
  title,
  item1,
  score1,
  unit1,
  item2,
  score2,
  unit2,
  item3,
  score3,
  unit3,
}: ResultScreenProps) {
  return (
    <div className='flex flex-col items-center'>
      {title}
      <div className='flex flex-col'>
        <div className='flex items-center m-5'>
          <div className='flex m-3'>{item1}</div>
          <div className='flex m-3'>{score1}</div>
          <div className='flex m-3'>{unit1}</div>
        </div>
        {item2 !== undefined ? (
          <div className='flex items-center m-5'>
            <div className='flex m-3'>{item2}</div>
            <div className='flex m-3'>{score2}</div>
            <div className='flex m-3'>{unit1}</div>
          </div>
        ) : null}
        {item3 !== undefined ? (
          <div className='flex items-center m-5'>
            <div className='flex m-3'>{item3}</div>
            <div className='flex m-3'>{score3}</div>
            <div className='flex m-3'>{unit1}</div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
