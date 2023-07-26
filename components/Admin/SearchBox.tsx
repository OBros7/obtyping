import React, { useState } from 'react'

// SearchBox based on
// category, subcategory, level
// text

const searchTypeOptions = ['category', 'deck', 'text']

export default function SearchBox() {
    const [searchType, setSearchType] = useState('category')

    return (
        <div>
            Search Box
        </div>
    )
}
