import { ReceivedText } from '@/MyLib/UtilsAPITyping';
import WordsEG from './Content/WordsEG';
import { BASIC_DECKS } from './Content/BasicModeContent';

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Helper function to shuffle an array
function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function shuffleCopy<T>(arr: readonly T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}


const creteRandomDeck = (randomID: number, minutes: number) => {
    // -1: random Characters
    // -2: random Numbers
    // -3: random Characters and Numbers
    // -4: random Words
    // -10: draft in sessionStorage


    let randomDeck: ReceivedText[] = [
        {
            text_id: -1,
            title: "",
            text11: "",
            text12: null,
            text21: null,
            text22: null,
            // lang1_int: 1,
            visibility_int: 1,
        },
    ];
    let text = '';

    const length = 100 * minutes; // Length of the random string/sequence

    // ★ 先頭で：ベーシック用の静的デッキ対応
    if (BASIC_DECKS[randomID]) {
        // deckId <= -100 のときだけ順番をランダム化
        // if (randomID <= -100) {
        //     return shuffleCopy(BASIC_DECKS[randomID]);
        // }
        // それ以外は固定順のまま
        // console.log('BASIC_DECKS hit', randomID, 'len=', BASIC_DECKS[randomID].length);
        return BASIC_DECKS[randomID];
    }

    if (randomID === -1) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        for (let i = 0; i < length; i++) {
            randomDeck[0].text11 += characters.charAt(Math.floor(Math.random() * characters.length));
        }
    } else if (randomID === -2) {
        for (let i = 0; i < length; i++) {
            randomDeck[0].text11 += Math.floor(Math.random() * 10).toString();
        }
    } else if (randomID === -3) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            randomDeck[0].text11 += characters.charAt(Math.floor(Math.random() * characters.length));
        }
    } else if (randomID === -4) {
        randomDeck[0].text11 = shuffleArray([...WordsEG]).slice(0, length).join(' ');
        /* ---------------- 新規: -10 (deck in edit) ---------------- */
    } else if (randomID === -10) {
        randomDeck = [];
        let raw: string | null = null;
        if (typeof window !== 'undefined') raw = sessionStorage.getItem('typingDraft');

        if (raw) {
            try {
                const draft = JSON.parse(raw) as { deckName?: string; texts?: { name: string; content: string }[] };
                const texts = draft.texts ?? [];
                if (texts.length === 0) throw new Error('No texts in draft');

                randomDeck = texts.map((t, idx) => ({
                    text_id: -(idx + 1),
                    title: t.name,
                    text11: t.content,
                    text12: null,
                    text21: null,
                    text22: null,
                    visibility_int: 1,
                }));
            } catch (e) {
                randomDeck.push({
                    text_id: -999,
                    title: 'Draft load error',
                    text11: 'Could not parse typingDraft from sessionStorage.',
                    text12: null,
                    text21: null,
                    text22: null,
                    visibility_int: 1,
                });
            }
        } else {
            randomDeck.push({
                text_id: -998,
                title: 'No draft found',
                text11: 'typingDraft not found in sessionStorage.',
                text12: null,
                text21: null,
                text22: null,
                visibility_int: 1,
            });
        }
    } else if (randomID === -100) {
        const nTexts = Math.floor(Math.random() * (10 - 5 + 1) + 5)
        let nWords = Math.floor(Math.random() * (300 - 5 + 1) + 5)
        randomDeck[0].text11 = shuffleArray(WordsEG).slice(0, nWords).join(' ');
        for (let i = 0; i < nTexts; i++) {
            let nWords = Math.floor(Math.random() * (300 - 5 + 1) + 5)
            let _text = shuffleArray(WordsEG).slice(0, nWords).join(' ');
            let text = {
                text_id: -i - 2,
                title: "",
                text11: _text,
                text12: null,
                text21: null,
                text22: null,
                // lang1_int: 1,
                visibility_int: 1,
            }
            randomDeck.push(text);
        }
    } else if (randomID === -101) {
        // 日本語テスト用デッキ（text11: かな / text12: 原文）
        const JP_SAMPLES: { jp: string; kana: string }[] = [
            { jp: "今日は良い天気ですね。", kana: "きょうはよいてんきですね。" },
            { jp: "明日も頑張りましょう！", kana: "あしたもがんばりましょう！" },
            { jp: "プログラミングは楽しい。", kana: "ぷろぐらみんぐはたのしい。" },
            { jp: "正確にタイプしてください。", kana: "せいかくにたいぷしてください。" },
            { jp: "コーヒーを一杯飲みたい。", kana: "こーひーをいっぱいのみたい。" },
            { jp: "時間を計って練習します。", kana: "じかんをはかってれんしゅうします。" },
            { jp: "ホームポジションを意識する。", kana: "ほーむぽじしょんをいしきする。" },
            { jp: "指を大きく動かさない。", kana: "ゆびをおおきくうごかさない。" },
            { jp: "深呼吸して落ち着こう。", kana: "しんこきゅうしておちつこう。" },
            { jp: "エンターキーで次へ進む。", kana: "えんたーきーでつぎへすすむ。" },
            { jp: "間違えても気にしない。", kana: "まちがえてもきにしない。" },
            { jp: "休憩を取りながら続けよう。", kana: "きゅうけいをとりながらつづけよう。" },
            { jp: "猫はキーボードの上が好き。", kana: "ねこはきーぼーどのうえがすき。" },
            { jp: "日本語のローマ字入力を練習中。", kana: "にほんごのろーまじにゅうりょくをれんしゅうちゅう。" },
            { jp: "今日はカレーを作った。", kana: "きょうはかれーをつくった。" },
            { jp: "短い文から始めよう。", kana: "みじかいぶんからはじめよう。" },
        ];

        // 目標の「かな」総文字数（従来の length を流用）
        const targetKanaLength = length;

        // シャッフルしてから必要量になるまで追加
        const pool = shuffleArray([...JP_SAMPLES]);

        randomDeck = [];
        let acc = 0;
        let i = 0;

        while (acc < targetKanaLength || randomDeck.length === 0) {
            const s = pool[i % pool.length];

            randomDeck.push({
                text_id: -10100 - i,   // 衝突回避のための負の連番
                title: `JP Test ${i + 1}`,
                text11: s.kana,        // ← かな（判定用ベース）
                text12: s.jp,          // ← 原文（表示用）
                text21: null,
                text22: null,
                visibility_int: 1,
            });

            acc += s.kana.length;
            i++;
            if (i > 100) break; // 極端な minutes への保険
        }

    } else {
        text = 'Error: randomID is not valid';
    }

    return randomDeck;
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////

export {
    creteRandomDeck,
};
