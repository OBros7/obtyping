import { ReceivedText } from '@/MyLib/UtilsAPITyping';
import { WordsEG } from './';


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
const creteRandomDeck = (randomID: number, minutes: number) => {
    // -1: random Characters
    // -2: random Numbers
    // -3: random Characters and Numbers
    // -4: random Words

    const randomDeck: ReceivedText[] = [
        {
            text_id: -1,
            title: "",
            text11: "",
            text12: null,
            text21: null,
            text22: null,
            lang1_int: 1,
            visibility_int: 1,
            shuffle: true,
        },
    ];
    let text = '';

    const length = 100 * minutes; // Length of the random string/sequence

    if (randomID === -1) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        for (let i = 0; i < length; i++) {
            text += characters.charAt(Math.floor(Math.random() * characters.length));
        }
    } else if (randomID === -2) {
        for (let i = 0; i < length; i++) {
            text += Math.floor(Math.random() * 10).toString();
        }
    } else if (randomID === -3) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            text += characters.charAt(Math.floor(Math.random() * characters.length));
        }
    } else if (randomID === -4) {
        text = shuffleArray(WordsEG).slice(0, length).join(' ');
    }
    else if (randomID === -5) {

    } else {
        text = 'Error: randomID is not valid';
    }

    randomDeck[0].text11 = text;
    return randomDeck;
}

// Helper function to shuffle an array
function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////

export {
    creteRandomDeck,
};
