import React from 'react'
import CustomTyping from '@/TypingHome/CustomTyping'
import { GetServerSideProps } from 'next'

// export default function custom_typing() {
//   return (
//     <CustomTyping />
//   )
// }

export default function CustomTypingPage() {
  return <CustomTyping />
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // 必要に応じてデータを取得する処理をここに追加します
  return {
    props: {}, // 必要なプロパティをここに追加します
  };
}