import type { Metadata } from 'next'
import "./globals.css";
export const metadata: Metadata = {
  title: 'LERA',
  description: 'Content Management System',
  icons: {
    icon: {
      url: '/images/lera1.svg', // Path relative to public
      sizes: '128x128',         // Specify size (e.g., 32x32 pixels)
      type: 'image/svg',      // MIME type
    },
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    
      <body>   
          {children}
      </body>
      
    </html>
  )
}