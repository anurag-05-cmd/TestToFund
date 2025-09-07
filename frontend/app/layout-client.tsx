"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '../src/components/Header';
import { WalletProvider } from '../src/contexts/WalletContext';

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isWelcomePage = pathname === '/';
  const isHomePage = pathname === '/home';
  const isFaucetPage = pathname === '/faucet';
  const isRewardsPage = pathname === '/rewards';

  // Pages that should have full-width layout (no container)
  const isFullWidthPage = isWelcomePage || isHomePage || isFaucetPage || isRewardsPage;

  return (
    <WalletProvider>
      {!isWelcomePage && <Header />}
      <main className={isFullWidthPage ? "" : "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"}>{children}</main>
    </WalletProvider>
  );
}
