// const fastAPIURL = process.env.FASTAPI_URL + 'typing/'
const BACKEND_API_KEY = process.env.BACKEND_API_KEY || ''

interface PostRecordTime {
    user_id: number,
    deck_id: number,
    score: number,
    wpm: number,
    cpm: number,
    accuracy: number,
    seconds: number | null,// only for Time
}

const createRecordTime = async (data: PostRecordTime) => {
    const response = await fetch('/api/record/recordPost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint: 'create_record_time', data: data }),
    });
    const result = await response.json();
    return result;
}

// これはクライアント→fastAPIへのリクエストを送る関数
// const createRecordTime = async (data: PostRecordTime) => {
//     const url = fastAPIURL + 'create_record_time/'
//     const res = await fetch(url, {
//         method: 'POST',
//         headers: {
//             'X-API-Key': BACKEND_API_KEY,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//         mode: 'cors',
//     })
//     const json = await res.json()
//     return json
// }


export type {
    PostRecordTime
}

export {
    createRecordTime
}