import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import Script from 'next/script'
import './globals.css'
import NavHeader from '@/components/nav-header'
import { Providers } from './providers'
import { headers } from 'next/headers'
import { cookieToInitialState } from 'wagmi'
import { config } from './config'
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const initialState = cookieToInitialState(config, headers().get('cookie'))

    return (
        <html lang="en">
            <Providers initialState={initialState}>
                <body className={inter.className}>
                    <NavHeader />
                    <div>{children}</div>
                </body>
            </Providers>
        </html>
    )
}
