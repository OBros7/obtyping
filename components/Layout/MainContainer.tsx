import React from 'react'

export default function MainContainer({ children, addClass = '' }: { children: React.ReactNode; addClass?: string }) {
  addClass += ' h-full bg-white rounded-lg m-auto w-12/12 md:w-10/12'
  return <div className={`${addClass}`}>{children}</div>
}
