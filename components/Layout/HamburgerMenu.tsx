import React, { useState, useContext, useRef, useEffect } from 'react'
import Link from 'next/link'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useRouter } from 'next/router'

interface HamburgerMenuProp {
    userData: any
    signOut: any
}

export default function HamburgerMenu({ userData, signOut }: HamburgerMenuProp) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const { locale } = useRouter()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef, setIsOpen]);

    return (
        <div ref={menuRef} className='relative'>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='block pl-4'
            >
                <GiHamburgerMenu size={32} />
            </button>
            {isOpen && (
                <ul className='absolute right-0 mt-2 bg-white text-black p-2 rounded shadow-md z-50'>
                    <li className='mb-1'>
                        <Link
                            href='/account/setting'
                            onClick={() => setIsOpen(false)}
                            className='block p-1'>
                            Settings
                        </Link>
                    </li>
                    {/* {session && session.user && paymentStatus !== 'paid' && (
                        <li className='mb-1'>
                            <Link href='/account/payment'>
                                <a onClick={() => setIsOpen(false)} className='block p-1'>Payment</a>
                            </Link>
                        </li>
                    )} */}
                    <li>
                        <Link href='/record' onClick={() => setIsOpen(false)} className='block p-1'>
                            Record
                        </Link>
                    </li>
                    <li>
                        <Link
                            href=''
                            locale={locale === 'ja' ? 'en' : 'ja'}
                            passHref
                            className='block p-1'>

                            {locale === 'ja' ? 'English' : '日本語'}

                        </Link>
                    </li>
                    {userData.loginStatus === true ? (
                        <li>
                            <button onClick={signOut}>Sign Out</button>
                        </li>

                    ) : (
                        null
                    )}

                </ul>
            )
            }
        </div >
    );
}
