export const dynamic = "force-dynamic";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { CatService } from "@/services/cat-service";
import { CatProfileCard } from "./cat-profile-card";

export default function CatsPage() {
  const cats = CatService.getByOwner("user-1");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/user">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold flex-1">我的猫咪</h1>
        <Link href="/user/cats/add">
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-1" />
            添加猫咪
          </Button>
        </Link>
      </div>

      {cats.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>还没有添加猫咪档案，快去添加吧</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cats.map((cat) => (
            <CatProfileCard key={cat.id} cat={cat} />
          ))}
        </div>
      )}
    </div>
  );
}
