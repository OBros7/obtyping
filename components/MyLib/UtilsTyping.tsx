function checkLanguage(input: string): string {
    // Unicode ranges for Japanese characters
    const ranges = [
        '\u3040-\u309F', // Hiragana
        '\u30A0-\u30FF', // Katakana
        '\u4E00-\u9FFF', // Kanji
        '\uFF66-\uFF9F', // Katakana half-width
        '\uFF01-\uFF5E', // Full-width Alphabets
        '\u3000',        // Full-width Space
    ];
    const japaneseRegex = new RegExp(`[${ranges.join('')}]`);

    // English alphabets, digits, standard keyboard symbols, empty space, and new line
    const englishRegex = /^[A-Za-z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\n]*$/;

    let language = 'English';

    for (const char of input) {
        if (!englishRegex.test(char)) {
            if (japaneseRegex.test(char)) {
                language = 'Japanese'
            } else {
                return 'Others'
            }
        }
    }
    return language
}

//////////////////////////////////////// Categories and levels ////////////////////////////////////////
interface ISubcategories {
    [key: string]: string[];
}

const categoryListJa = [
    'カテゴリを選ぶ',
    'カテゴリ1',
    'カテゴリ2',
    'カテゴリ3',
]

const subcategoryJsonJa: ISubcategories = {
    'カテゴリを選ぶ': [
        'サブカテゴリを選ぶ',
    ],
    'カテゴリ1': [
        'サブカテゴリを選ぶ',
        'サブカテゴリ11',
        'サブカテゴリ12',
        'サブカテゴリ13',
    ],
    'カテゴリ2': [
        'サブカテゴリを選ぶ',
        'サブカテゴリ21',
        'サブカテゴリ22',
        'サブカテゴリ23',
    ],
    'カテゴリ3': [
        'サブカテゴリを選ぶ',
        'サブカテゴリ31',
        'サブカテゴリ32',
        'サブカテゴリ33',
    ],
}

const levelListJa = [
    'レベルを選ぶ',
    '小学生',
    '中学生',
    '高校生',
    '大学生',
]


const categoryListEn = [
    'Select a category',
    'Category1',
    'Category2',
    'Category3',
]

const subcategoryJsonEn: ISubcategories = {
    'Select a category': [
        'Select a subcategory',
    ],
    'Category1': [
        'Select a category',
        'Subcategory11',
        'Subcategory12',
        'Subcategory13',
    ],
    'Category2': [
        'Select a category',
        'Subcategory21',
        'Subcategory22',
        'Subcategory23',
    ],
    'Category3': [
        'Select a category',
        'Subcategory31',
        'Subcategory32',
        'Subcategory33',
    ],
}


const levelListEn = [
    'Select a level',
    'Kids',
    'Middle/High School',
    'University',
]

export { checkLanguage, categoryListJa, subcategoryJsonJa, levelListJa, categoryListEn, subcategoryJsonEn, levelListEn }