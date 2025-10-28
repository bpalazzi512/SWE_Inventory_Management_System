import { cn } from "@/lib/utils";

export function GradientBackground({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden h-full w-full isolate bg-white dark:bg-zinc-950",
        className,
      )}
    >
      <div
        className="absolute top-0 transform-gpu overflow-hidden blur-3xl"
        style={{ zIndex: -1 }}
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 aspect-[1155/678] w-[60.125rem] max-w-none -translate-x-1/2 -translate-y-1/2 rotate-[30deg] bg-gradient-to-tr from-[#98D1B5] to-[#A0E0EF] opacity-40 sm:left-[calc(50%-40rem)] sm:w-[150.1875rem] dark:opacity-40"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      {children}
    </div>
  );
}
