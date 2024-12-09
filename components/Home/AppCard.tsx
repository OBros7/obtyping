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
  isReady?: boolean
}

export default function AppCard({ href = '/#', title, description, thumbnail, bgcolor, isReady = true }: AppCardProps) {
  const commonClass = ' w-60'
  const classParent =
    'mx-4 transition duration-300 h-64 flex flex-col justify-center  text-l rounded-lg mx-2 my-4 shadow-lg overflow-hidden  hover:ring-8 hover:ring-blue-500/50 border-4 border-blue-500/50' +
    commonClass
  const classImg = 'text-center text-white text-xl basis-[25%]  border-b border-blue-500/50 ' + commonClass + " " + bgcolor
  const classTitle =
    'basis-[25%] p-0.5 border-b border-blue-500/50 font-bold text-lg flex text-left items-center justify-center overflow-y-hidden' +
    commonClass
  const classDescription =
    'basis-[50%] rounded-b-lg p-0.5 text-md text-left font-bold flex overflow-auto p-4' + commonClass

  if (isReady) {
    // リリース済みのコンテンツなら普通にLinkで遷移
    return (
      <Link href={href}>
        <a>
          <div className={classParent}>
            <div className={classImg}>{thumbnail}</div>
            <div className={classTitle}>{title}</div>
            <div className={classDescription}>{description}</div>
          </div>
        </a>
      </Link>
    )
  } else {
    // 準備中の場合はリンクさせず、クリックでアラートを出す
    return (
      <div
        className={classParent}
        onClick={() => alert("現在準備中です。リリースまでもうしばらくお待ちください")}
        style={{ cursor: 'not-allowed' }}
      >
        <div className={classImg}>{thumbnail}</div>
        <div className={classTitle}>{title}</div>
        <div className={classDescription}>{description}</div>
      </div>
    )
  }
}
