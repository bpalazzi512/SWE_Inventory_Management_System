import Image from "next/image";
import { GradientBackground } from "@/components/ui/gradient-bg";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <GradientBackground>
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-8 space-y-12">
        <Image src="/images/restockedlogin.png" alt="ReStocked Logo" width={310} height={310} priority />
        <p className="text-lg text-gray-700">Inventory simplified.</p>
        <Button>Login</Button>
      </div>
    </GradientBackground>
  );
}
