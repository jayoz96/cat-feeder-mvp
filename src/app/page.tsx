import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Cat, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Cat className="h-12 w-12 text-primary" />
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          喵了个护
        </h1>
        <p className="text-muted-foreground text-lg">
          专业上门喂猫服务，让你安心出行
        </p>

        <div className="flex flex-col gap-3 pt-4">
          <Link href="/user">
            <Button className="w-full" size="lg">
              我要找人喂猫
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link href="/feeder">
            <Button variant="outline" className="w-full" size="lg">
              我要接单喂猫
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
