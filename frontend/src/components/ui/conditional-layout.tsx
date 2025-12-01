'use client'

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  return (
    <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start ml-[224px]">
      {children}
    </main>
  );
}
