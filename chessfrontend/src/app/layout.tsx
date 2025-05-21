import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MiniChessAI',
  description: 'A 6x5 chess-like game with AI opponent',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className="bg-gray-100 flex justify-center items-center min-h-screen">
        {children}
      </body>
    </html>
  );
}