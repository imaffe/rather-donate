import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Web3ProviderWrapper } from '../lib/web3/provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RatherDonate',
  description: 'A decentralized donation platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Web3ProviderWrapper>
          <body className={inter.className}>{children}</body>
        </Web3ProviderWrapper>
      </body>
    </html>
  );
}
