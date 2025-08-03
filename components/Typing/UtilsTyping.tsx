import { ReceivedText } from '@/MyLib/UtilsAPITyping';
import { WordsEG } from './';


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Helper function to shuffle an array
function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


const creteRandomDeck = (randomID: number, minutes: number) => {
    // -1: random Characters
    // -2: random Numbers
    // -3: random Characters and Numbers
    // -4: random Words

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
        randomDeck[0].text11 = shuffleArray(WordsEG).slice(0, length).join(' ');
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
        // 日本語テスト用デッキ（text11: 日本語、text12: ローマ字）
        // ※ ローマ字は ASCII / 小文字のみを使用（判定をシンプルにするため）
        const JP_SAMPLES: { jp: string; roma: string }[] = [
            { jp: "今日は良い天気ですね。", roma: "kyou wa yoi tenki desu ne." },
            { jp: "明日も頑張りましょう！", roma: "ashita mo ganbarimashou!" },
            { jp: "プログラミングは楽しい。", roma: "puroguramingu wa tanoshii." },
            { jp: "正確にタイプしてください。", roma: "seikaku ni taipu shite kudasai." },
            { jp: "コーヒーを一杯飲みたい。", roma: "koohii wo ippai nomitai." },
            { jp: "時間を計って練習します。", roma: "jikan wo hakatte renshuu shimasu." },
            { jp: "ホームポジションを意識する。", roma: "hoomu pojishon wo ishiki suru." },
            { jp: "指を大きく動かさない。", roma: "yubi wo ookiku ugokasanai." },
            { jp: "深呼吸して落ち着こう。", roma: "shinkokyuu shite ochitsukou." },
            { jp: "エンターキーで次へ進む。", roma: "entaa kii de tsugi e susumu." },
            { jp: "間違えても気にしない。", roma: "machigaete mo ki ni shinai." },
            { jp: "休憩を取りながら続けよう。", roma: "kyuukei wo torinagara tsudzukeyou." },
            { jp: "猫はキーボードの上が好き。", roma: "neko wa kiiboodo no ue ga suki." },
            { jp: "日本語のローマ字入力を練習中。", roma: "nihongo no roomaji nyuuryoku wo renshuu chuu." },
            { jp: "今日はカレーを作った。", roma: "kyou wa karee wo tsukutta." },
            { jp: "短い文から始めよう。", roma: "mijikai bun kara hajimeyou." },
        ];

        // 目標のローマ字総文字数（他の分岐と同じ length 変数を利用）
        // 例: minutes=1 => 100 文字分くらいになるまでサンプルを追加
        const targetRomanLength = length;

        // 既定の配列を作り直す
        randomDeck = [];

        let acc = 0;
        let i = 0;
        // 1件もないと困るので最低1件は入れる。targetRomanLength をおおよそ満たすまで繰り返し。
        while (acc < targetRomanLength || randomDeck.length === 0) {
            const s = JP_SAMPLES[i % JP_SAMPLES.length];
            const roma = s.roma.toLowerCase(); // 念のため小文字化を徹底

            randomDeck.push({
                text_id: -10100 - i, // 衝突を避けるために負の連番
                title: `JP Test ${i + 1}`,
                text11: s.jp,
                text12: roma,
                text21: null,
                text22: null,
                visibility_int: 1,
            });

            acc += roma.length;
            i++;
            // 念のためのセーフティ（極端な minutes による無限増加回避）
            if (i > 100) break;
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
