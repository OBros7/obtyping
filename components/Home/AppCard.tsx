import Link from 'next/link'
import React from 'react'
import { FaQuestion } from 'react-icons/fa'
import { langDict } from './'


interface AppCardProps {
  href?: string
  title: string
  description: string
  recomendedFor?: string
  thumbnail: React.ReactNode
  bgcolor?: string
}

export default function AppCard({ href = '/#', title, description, recomendedFor, thumbnail, bgcolor }: AppCardProps) {
  const commonClass = ' w-60'
  const classParent =
    'mx-4 transition duration-300 h-64 flex flex-col justify-center  text-l rounded-lg mx-2 my-4 shadow-lg overflow-hidden outline outline-blue-500/20 hover:ring-8 hover:ring-blue-500/50' +
    commonClass
  const classImg = 'text-center text-white text-xl basis-[25%] rounded-t-lg p-4 border-b border-blue-500/50 ' + commonClass + " " + bgcolor
  const classTitle =
    'basis-[45%] p-0.5 border-b border-blue-500/50 font-bold text-lg flex text-left items-center justify-center overflow-y-hidden' +
    commonClass
  const classDescription =
    'basis-[30%] rounded-b-lg p-0.5 text-sm text-red-500 text-left font-bold flex overflow-auto' + commonClass

  return (
    <Link href={href}>
      <a>
        <div className={classParent}>
          {/* <FaQuestion className={classImg} /> */}
          <div className={classImg}>{title}</div>
          <div className={classTitle}>{description}</div>
          <div className={classDescription}>{recomendedFor}</div>
        </div>
      </a>
    </Link>
  )
}
