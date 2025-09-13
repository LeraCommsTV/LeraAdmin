// Updated Layout with ScrollToTop
// app/layout.tsx (UPDATED - Add ScrollToTop component)
import type { Metadata } from 'next'
import './globals.css'
import { Header, Footer } from '@/components'
import { ThemeProvider } from '@/context/ThemeContext'
import ScrollToTop from '@/components/ScrollToTop'

export const metadata: Metadata = {
  title: 'LERA Communications - Transforming Narratives, Elevating Impact',
  description: 'Empowering Your Brand with Strategic Communication and Innovative Media Solutions',
  icons: {
    icon: {
      url: '/images/lera1.svg',
      sizes: '128x128',
      type: 'image/svg+xml',
    },
  },
}

export default function PublicLayout({
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
          {/* Scroll to Top Button */}
          <ScrollToTop showAfter={ 100} scrollBehavior="instant" />
        </ThemeProvider>
      </body>
    </html>
  )
}

