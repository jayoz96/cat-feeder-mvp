import { OrderStatus } from "@/types";

const STATUS_MAP: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: "待接单", className: "bg-yellow-100 text-yellow-800" },
  accepted: { label: "已接单", className: "bg-blue-100 text-blue-800" },
  in_progress: { label: "服务中", className: "bg-purple-100 text-purple-800" },
  completed: { label: "已完成", className: "bg-green-100 text-green-800" },
  pending_review: { label: "待审核", className: "bg-orange-100 text-orange-800" },
  paid: { label: "已支付", className: "bg-emerald-100 text-emerald-800" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = STATUS_MAP[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
