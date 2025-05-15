'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        document.addEventListener('scroll', handleScroll);
        return () => {
            document.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/90 backdrop-blur-md shadow-md py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-blue-400 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">AS</span>
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                        AI Stylist
                    </h1>
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                        Home
                    </Link>
                    <Link href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                        How It Works
                    </Link>
                </nav>
            </div>
        </header>
    );
} 