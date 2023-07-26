import React from 'react'
import Link from 'next/link'

export default function index() {
    return (
        <>
            <Link href="./admin/typingdata">
                <a>
                    <h1>API</h1>
                </a>
            </Link>
            <Link href="./admin/test/basicdeckselection">
                <a>
                    <h1>Basic Deck Selection</h1>
                </a>
            </Link>
            <Link href="./admin/test/customdeckselection">
                <a>
                    <h1>Custom Deck Selection</h1>
                </a>
            </Link>
            <Link href="./admin/test/categorydeckselection">
                <a>
                    <h1>Category Deck Selection</h1>
                </a>
            </Link>
        </>
    )
}
