// Typing //////////////////////////////////////

const visibility2int: { [key: string]: number } = {
    private: 0,
    organization: 1,
    public_basic: 2,
    public_selective: 3,
    paid_full: 4,
    paid_partial: 5
};

const lang2int: { [key: string]: number | null } = {
    English: 1,
    Japanese: 2,
    Others: 0,
    None: null
}

export { visibility2int, lang2int }