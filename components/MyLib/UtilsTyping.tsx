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

    let language = 'english';

    for (const char of input) {
        if (!englishRegex.test(char)) {
            if (japaneseRegex.test(char)) {
                language = 'japanese'
            } else {
                return 'others'
            }
        }
    }
    return language
}

//////////////////////////////////////// Categories and levels ////////////////////////////////////////
// interface ISubcategories {
//     [key: string]: string[];
// }
interface ISubcategory {
    id: number;
    name: string;
}

interface ICategory {
    id: number;
    name: string;
    subcategories: ISubcategory[];
}

interface ISubcategories {
    categories: ICategory[];
}


const subcategoryJsonJa: ISubcategories = {
    categories: [
        {
            id: -1, name: 'カテゴリを選ぶ', subcategories: [
                { id: -1, name: 'カテゴリを選ぶ' }
            ]
        },
        {
            id: 0, name: 'カテゴリ1', subcategories: [
                { id: -1, name: 'サブカテゴリを選ぶ' },
                { id: 0, name: 'サブカテゴリ11' },
                { id: 1, name: 'サブカテゴリ12' },
                { id: 2, name: 'サブカテゴリ13' },
            ]
        },
        {
            id: 1, name: 'カテゴリ2', subcategories: [
                { id: -1, name: 'サブカテゴリを選ぶ' },
                { id: 0, name: 'サブカテゴリ21' },
                { id: 1, name: 'サブカテゴリ22' },
            ]
        }
    ]
};

// create category list from subcategoryJson
const categoryListJa = subcategoryJsonJa.categories.map((category: ICategory) => category.name)



const levelListJa = [
    { id: -1, name: 'レベルを選ぶ' },
    { id: 0, name: '小学生' },
    { id: 1, name: '中学生' },
    { id: 2, name: '高校生' },
    { id: 3, name: '大学生' },
]


const subcategoryJsonEn: ISubcategories = {
    categories: [
        {
            id: -1, name: 'Choose a category', subcategories: [
                { id: -1, name: 'Choose a category' }
            ]
        },
        {
            id: 0, name: 'Category1', subcategories: [
                { id: -1, name: 'Choose a subcategory' },
                { id: 0, name: 'Subcategory11' },
                { id: 1, name: 'Subcategory12' },
                { id: 2, name: 'Subcategory13' },
            ]
        },
        {
            id: 1, name: 'Category2', subcategories: [
                { id: -1, name: 'Choose a subcategory' },
                { id: 0, name: 'Subcategory21' },
                { id: 1, name: 'Subcategory22' },
            ]
        }
    ]
};

function findCategoryAndSubcategoryIds(categories: ICategory[], categoryName: string, subcategoryName: string): { categoryID: number | null, subcategoryID: number | null } {
    for (let category of categories) {
        if (category.name === categoryName) {
            for (let subcategory of category.subcategories) {
                if (subcategory.name === subcategoryName) {
                    return { categoryID: category.id, subcategoryID: subcategory.id };
                }
            }
        }
    }
    return { categoryID: null, subcategoryID: null };
}

// const subcategoryJsonEn: ISubcategories = {
//     'Select a category': [
//         'Select a subcategory',
//     ],
//     'Category1': [
//         'Select a category',
//         'Subcategory11',
//         'Subcategory12',
//         'Subcategory13',
//     ],
//     'Category2': [
//         'Select a category',
//         'Subcategory21',
//         'Subcategory22',
//         'Subcategory23',
//     ],
//     'Category3': [
//         'Select a category',
//         'Subcategory31',
//         'Subcategory32',
//         'Subcategory33',
//     ],
// }



const levelListEn = [
    { id: -1, name: 'Select a level' },
    { id: 0, name: 'Elementary School' },
    { id: 1, name: 'Middle School' },
    { id: 2, name: 'High School' },
    { id: 3, name: 'University' },
]

export type { ICategory, ISubcategory, ISubcategories }
export {
    checkLanguage,
    subcategoryJsonJa,
    levelListJa,
    subcategoryJsonEn,
    levelListEn,
    findCategoryAndSubcategoryIds,
}