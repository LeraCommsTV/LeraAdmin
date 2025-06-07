// app/layout.tsx
import { Metadata } from 'next';
import './globals.css';
import { Header, Footer } from '../components';

export const metadata: Metadata = {
  title: 'LERA Communications - Transforming Narratives, Elevating Impact',
  description: 'Empowering Your Brand with Strategic Communication and Innovative Media Solutions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header isHome />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}