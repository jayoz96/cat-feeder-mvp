"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Cat, Zap, MapPin } from "lucide-react";
import { AddressPicker } from "@/components/features/address-picker";
import Link from "next/link";
import { submitOrder } from "./actions";

const SAVED_ADDRESSES = [
  "南京市江宁区东山街道万达广场2栋1403",
  "南京市江宁区义乌小商品城旁金轮新都汇8栋1201",
];

export default function CreateOrderPage() {
  return (
    <Suspense>
      <CreateOrderForm />
    </Suspense>
  );
}

function CreateOrderForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    catCount: Number(sp.get("catCount")) || 1,
    startDate: "",
    endDate: "",
    notes: sp.get("notes") || "",
    address: sp.get("address") || "",
    urgent: sp.get("urgent") === "true",
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
  const basePrice = days * 50 * form.catCount;
  const estimatedPrice = form.urgent ? Math.round(basePrice * 1.5) : basePrice;

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
          {SAVED_ADDRESSES.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {SAVED_ADDRESSES.map((addr) => (
                <button
                  key={addr}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, address: addr }))}
                  className={`inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border transition-colors ${
                    form.address === addr
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted hover:bg-muted/80 border-transparent"
                  }`}
                >
                  <MapPin className="h-3 w-3" />
                  {addr.length > 20 ? addr.slice(-20) : addr}
                </button>
              ))}
            </div>
          )}
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

        {/* 紧急订单开关 */}
        <div
          className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors ${
            form.urgent ? "border-orange-400 bg-orange-50" : ""
          }`}
          onClick={() => setForm((f) => ({ ...f, urgent: !f.urgent }))}
        >
          <div className="flex items-center gap-2">
            <Zap className={`h-4 w-4 ${form.urgent ? "text-orange-500" : "text-muted-foreground"}`} />
            <div>
              <p className="text-sm font-medium">紧急订单</p>
              <p className="text-xs text-muted-foreground">加价 50%，优先展示给喂猫员</p>
            </div>
          </div>
          <div className={`h-5 w-9 rounded-full transition-colors ${form.urgent ? "bg-orange-500" : "bg-muted"} relative`}>
            <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.urgent ? "translate-x-4" : "translate-x-0.5"}`} />
          </div>
        </div>

        {days > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">费用预估</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p>服务天数：{days} 天</p>
              <p>猫咪数量：{form.catCount} 只</p>
              <p>单价：¥50 / 天 / 只</p>
              {form.urgent && (
                <p className="text-orange-500">紧急加价：×1.5</p>
              )}
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
