import Link from 'next/link'
import React from 'react'
import { FaQuestion } from 'react-icons/fa'

interface AppCardProps {
  href?: string
  title: string
  description: string
  thumbnail: React.ReactNode
}

export default function AppCard({ href = '/#', title, description, thumbnail }: AppCardProps) {
  const commonClass = ' w-60'
  const classParent =
    'mx-4 transition duration-300 h-64 flex flex-col justify-center rounded-lg mx-2 my-4 shadow-lg overflow-hidden outline outline-blue-500/20 hover:ring-8 hover:ring-blue-500/50' +
    commonClass
  const classImg = 'basis-[50%] rounded-t-lg p-4 border-b border-blue-500/50' + commonClass
  const classTitle =
    'basis-[25%] p-0.5 border-b border-blue-500/50 font-bold text-lg flex text-center items-center justify-center overflow-y-hidden' +
    commonClass
  const classDescription =
    'basis-[25%] rounded-b-lg p-0.5 text-sm flex text-center items-center justify-center overflow-auto' + commonClass

  return (
    <Link href={href}>
      <a>
        <div className={classParent}>
          <FaQuestion className={classImg} />
          <div className={classTitle}>{title}</div>
          <div className={classDescription}>{description}</div>
        </div>
      </a>
    </Link>
  )
}
