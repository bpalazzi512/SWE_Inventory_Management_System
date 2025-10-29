import Image from "next/image";
import { GradientBackground } from "@/components/ui/gradient-bg";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-8 space-y-12">
        <Image src="/images/restockedlogin.png" alt="ReStocked Logo" width={610} height={310} priority />
        <p className="text-2xl text-text-primary">Inventory simplified.</p>
        <Button size="lg">Login</Button>
      </div>
  );
}
