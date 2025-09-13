// app/layout.tsx (SINGLE FILE - Remove any duplicate)
import type { Metadata } from 'next'
import './globals.css'
import { Header, Footer } from '@/components'
import { ThemeProvider } from '@/context/ThemeContext'

export const metadata: Metadata = {
  title: 'LERA Communications - Transforming Narratives, Elevating Impact',
  description: 'Empowering Your Brand with Strategic Communication and Innovative Media Solutions',
  icons: {
    icon: {
      url: '/images/lera1.svg',
      sizes: '128x128',
      type: 'image/svg+xml', // Fixed MIME type
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Header isHome />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}