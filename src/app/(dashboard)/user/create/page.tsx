"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Cat } from "lucide-react";
import { AddressPicker } from "@/components/features/address-picker";
import Link from "next/link";
import { submitOrder } from "./actions";

export default function CreateOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    catCount: 1,
    startDate: "",
    endDate: "",
    notes: "",
    address: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (form.catCount < 1 || form.catCount > 10) {
      newErrors.catCount = "猫咪数量需在 1-10 只之间";
    }
    if (!form.startDate) {
      newErrors.startDate = "请选择开始日期";
    }
    if (!form.endDate) {
      newErrors.endDate = "请选择结束日期";
    }
    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      newErrors.endDate = "结束日期不能早于开始日期";
    }
    if (!form.address.trim()) {
      newErrors.address = "请填写服务地址";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await submitOrder(form);
      if (result.success) {
        toast.success(result.message);
        router.push("/user");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  // 费用预估
  const days =
    form.startDate && form.endDate
      ? Math.max(1, Math.ceil(
          (new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1)
      : 0;
  const estimatedPrice = days * 50 * form.catCount;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/user">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">发布喂猫需求</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="猫咪数量" error={errors.catCount}>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setForm((f) => ({ ...f, catCount: Math.max(1, f.catCount - 1) }))}
            >
              -
            </Button>
            <div className="flex items-center gap-1 text-lg font-medium">
              <Cat className="h-4 w-4" />
              <span>{form.catCount}</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setForm((f) => ({ ...f, catCount: Math.min(10, f.catCount + 1) }))}
            >
              +
            </Button>
          </div>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="开始日期" error={errors.startDate}>
            <Input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
            />
          </FormField>
          <FormField label="结束日期" error={errors.endDate}>
            <Input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
            />
          </FormField>
        </div>

        <FormField label="服务地址" error={errors.address}>
          <AddressPicker
            placeholder="搜索或输入详细地址"
            value={form.address}
            onChange={(val) => setForm((f) => ({ ...f, address: val }))}
          />
        </FormField>

        <FormField label="特殊备注">
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="如：只喂干粮、需要铲屎、猫咪性格等"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
        </FormField>

        {days > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">费用预估</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p>服务天数：{days} 天</p>
              <p>猫咪数量：{form.catCount} 只</p>
              <p>单价：¥50 / 天 / 只</p>
              <p className="text-lg font-bold text-foreground pt-1">
                合计：¥{estimatedPrice}
              </p>
            </CardContent>
          </Card>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "发布中..." : "确认发布"}
        </Button>
      </form>
    </div>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
