const fastAPIURL = process.env.FASTAPI_URL + '/api/typing/'

interface PostRecord {
    user_id: number,
    deck_id: number,
    score: number,
    wpm: number,
    cpm: number,
    accuracy: number,
    centiseconds?: number | null,// only for SR
    seconds?: number | null,// only for Time
}

const createRecord = async (data: PostRecord) => {
    const url = fastAPIURL + 'create_record'
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