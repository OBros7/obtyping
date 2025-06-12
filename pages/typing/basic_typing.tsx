import React from 'react'
import BasicTyping from '@/TypingHome/BasicTyping'
import { GetServerSideProps } from 'next'

// export default function basic_typing() {
//     return <BasicTyping />
// }

export default function BasicTypingPage() {
    return <BasicTyping />
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 必要に応じてデータを取得する処理をここに追加します
    return {
        props: {}, // 必要なプロパティをここに追加します
    };
}