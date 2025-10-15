import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-12 space-y-12">

      <div className="w-2/3 flex flex-col sm:flex-row items-center justify-center space-y-12 sm:space-y-0 sm:space-x-12">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
          Hi, I&apos;m Chase.
        </h1>
      </div>
        
    </div>
  );
}
