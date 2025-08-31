import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Adventure Terminal',
  description: 'A choose your own adventure game with terminal navigation',
  keywords: ['adventure', 'game', 'terminal', 'choose your own adventure', 'pixel art'],
  authors: [{ name: 'Gavin Trent' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
