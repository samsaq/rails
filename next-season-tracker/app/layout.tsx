import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'D2 Season Tracker',
  description:
    "A website to track your progress in Destiny 2's current season.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' data-theme='night'>
      <body className={inter.className}>
        {children}
        <footer className='footer footer-center fixed inset-x-0 bottom-0 bg-base-200 p-4 text-base-content'>
          <div>
            <p>
              {' '}
              Made by samsaq#2860 |{' '}
              <a
                className='underline underline-offset-2'
                href='https://github.com/samsaq'
              >
                Github
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
