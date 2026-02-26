"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { addCat } from "./actions";

export default function AddCatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    breed: "",
    age: 1,
    personality: "",
    dietNotes: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.breed.trim()) {
      toast.error("请填写猫咪名字和品种");
      return;
    }
    setLoading(true);
    try {
      const result = await addCat(form);
      if (result.success) {
        toast.success("猫咪档案已添加");
        router.push("/user/cats");
      }
    } catch {
      toast.error("添加失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/user/cats">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">添加猫咪</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="猫咪名字">
          <Input
            placeholder="如：大橘"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </Field>

        <Field label="品种">
          <Input
            placeholder="如：英短、布偶、橘猫"
            value={form.breed}
            onChange={(e) => setForm((f) => ({ ...f, breed: e.target.value }))}
          />
        </Field>

        <Field label="年龄">
          <Input
            type="number"
            min={0}
            max={30}
            value={form.age}
            onChange={(e) => setForm((f) => ({ ...f, age: Number(e.target.value) }))}
          />
        </Field>

        <Field label="性格特点">
          <textarea
            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="如：温顺亲人、胆小怕生"
            value={form.personality}
            onChange={(e) => setForm((f) => ({ ...f, personality: e.target.value }))}
          />
        </Field>

        <Field label="饮食备注">
          <textarea
            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="如：只吃干粮、每天50g"
            value={form.dietNotes}
            onChange={(e) => setForm((f) => ({ ...f, dietNotes: e.target.value }))}
          />
        </Field>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "添加中..." : "确认添加"}
        </Button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
