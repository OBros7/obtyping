import React from 'react'
import CategoryTyping from '@/TypingHome/CategoryTyping'
import { GetServerSideProps } from 'next'


// export default function category_typing() {
//     return <CategoryTyping />
// }

export default function CategoryTypingPage() {
    return <CategoryTyping />
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 必要に応じてデータを取得する処理をここに追加します
    return {
        props: {}, // 必要なプロパティをここに追加します
    };
}