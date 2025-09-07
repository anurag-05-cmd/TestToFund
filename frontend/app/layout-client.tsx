"use client";
import { usePathname } from 'next/navigation';
import Header from '../src/components/Header';

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isWelcomePage = pathname === '/';

  return (
    <>
      {!isWelcomePage && <Header />}
      <main className={isWelcomePage ? "" : "max-w-6xl mx-auto"}>{children}</main>
    </>
  );
}
