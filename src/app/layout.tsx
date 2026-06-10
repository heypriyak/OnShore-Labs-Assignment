import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OnShore Reputation Intelligence',
  description: 'AI-powered online reputation management dashboard for restaurants and hotels.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
