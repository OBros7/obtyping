const fastAPIURL = process.env.FASTAPI_URL + '/api/typing/'

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
    const url = fastAPIURL + 'create_record_time/'
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        mode: 'cors',
    })
    const json = await res.json()
    return json
}


export type {
    PostRecordTime
}

export {
    createRecordTime
}