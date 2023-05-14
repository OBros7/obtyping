function checkLanguage(input: string): string {
    // Unicode ranges for Japanese characters
    const ranges = [
        '\u3040-\u309F', // Hiragana
        '\u30A0-\u30FF', // Katakana
        '\u4E00-\u9FFF', // Kanji
        '\uFF66-\uFF9F', // Katakana half-width
    ];
    const japaneseRegex = new RegExp(`[${ranges.join('')}]`);

    // English alphabets, digits, and standard keyboard symbols
    const englishRegex = /^[A-Za-z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

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

export { checkLanguage }