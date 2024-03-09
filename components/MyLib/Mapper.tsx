// Typing //////////////////////////////////////

const visibility2int: { [key: string]: number } = {
    private: 0,
    organization: 1,
    public_basic: 2,
    public_selective: 3,
    paid_full: 4,
    paid_partial: 5
};



const _lang2int: { [key: string]: number | null } = {
    english: 1,
    eg: 1,
    en: 1,
    eng: 1,
    japanese: 2,
    jp: 2,
    jpn: 2,
    others: 0,
    none: null
}

const lang2int = (lang: string | null): number | null => {
    if (lang === null) return 0
    return _lang2int[lang.toLowerCase()]
}

export { visibility2int, lang2int }