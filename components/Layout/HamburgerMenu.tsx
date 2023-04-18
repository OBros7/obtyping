import React, { useState, useContext, useRef, useEffect } from 'react'
import Link from 'next/link'
import { GlobalContext } from 'context/GlobalContext'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useRouter } from 'next/router'
// import { signOut } from 'next-auth/react'
import useAuth from '@/MyCustomHooks/useAuth'; // Import the custom hook

interface HamburgerMenuProp {
    user: any
    signOut: any
}

export default function HamburgerMenu({ user, signOut }: HamburgerMenuProp) {
    const [isOpen, setIsOpen] = useState(false)
    const { session, paymentStatus } = useContext(GlobalContext)
    const menuRef = useRef<HTMLDivElement>(null)
    const { locale } = useRouter()
    // const { user, signOut } = useAuth();
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
    }, [menuRef, setIsOpen]); // Add setIsOpen to the dependency array

    return (
        <div ref={menuRef} className='relative'>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='block pl-4'
            >
                <GiHamburgerMenu size={32} />
            </button>

            {isOpen && (
                <ul className='absolute right-0 mt-2 bg-white text-black p-2 rounded shadow-md'>
                    <li className='mb-1'>
                        <Link href='account/setting'>
                            <a onClick={() => setIsOpen(false)} className='block p-1'>Settings</a>
                        </Link>
                    </li>
                    {session && session.user && paymentStatus !== 'paid' && (
                        <li className='mb-1'>
                            <Link href='/account/payment'>
                                <a onClick={() => setIsOpen(false)} className='block p-1'>Payment</a>
                            </Link>
                        </li>
                    )}
                    <li>
                        <Link href='/record'>
                            <a onClick={() => setIsOpen(false)} className='block p-1'>Record</a>
                        </Link>
                    </li>
                    <li>
                        <Link href='' locale={locale === 'ja' ? 'en' : 'ja'} passHref>
                            <a className='block p-1'>
                                {locale === 'ja' ? 'English' : '日本語'}
                            </a>
                        </Link>
                    </li>
                    {user ? (
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
    )
}
