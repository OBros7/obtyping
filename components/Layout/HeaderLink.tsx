import Link from 'next/link'
import React from 'react'

interface HeaderLinkProps {
  href: string
  text: string
  addClass?: string
  attrs?: object
}

export default function HeaderLink({ href, text, addClass = '', attrs = {} }: HeaderLinkProps) {
  addClass += ' m-2 p-2 rounded transition-all duration-200 hover:bg-white/20'
  return (
    <div className={addClass} {...attrs}>
      <Link href={href}>
        <a>{text}</a>
      </Link>
    </div>
  )
}
