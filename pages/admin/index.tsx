import React from 'react'
import Link from 'next/link'

export default function index() {
    return (
        <>
            <Link href="./admin/typingdata">

                <h1>API</h1>

            </Link>
            <Link href="./admin/test/basicdeckselection">

                <h1>Basic Deck Selection</h1>

            </Link>
            <Link href="./admin/test/customdeckselection">

                <h1>Custom Deck Selection</h1>

            </Link>
            <Link href="./admin/test/categorydeckselection">

                <h1>Category Deck Selection</h1>

            </Link>
        </>
    );
}
