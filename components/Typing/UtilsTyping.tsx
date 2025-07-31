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

    } else {
        text = 'Error: randomID is not valid';
    }

    return randomDeck;
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////

export {
    creteRandomDeck,
};
