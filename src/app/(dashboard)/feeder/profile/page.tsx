export const dynamic = "force-dynamic";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Star, MapPin, ClipboardList } from "lucide-react";
import { MOCK_USERS } from "@/services/mock-data";
import { ReviewService } from "@/services/review-service";
import { OrderService } from "@/services/order-service";

export default function FeederProfilePage() {
  const feeder = MOCK_USERS.find((u) => u.id === "feeder-1")!;
  const { avg, count } = ReviewService.getAverageRating("feeder-1");
  const allOrders = OrderService.getOrders().filter((o) => o.feederId === "feeder-1");
  const completedCount = allOrders.filter(
    (o) => o.status === "paid" || o.status === "pending_review" || o.status === "completed"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/feeder">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">个人主页</h1>
      </div>

      {/* 基本信息 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {feeder.name[0]}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{feeder.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{feeder.bio}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 数据统计 */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={<Star className="h-4 w-4 text-yellow-500" />}
          label="评分"
          value={count > 0 ? `${avg}` : `${feeder.rating}`}
        />
        <StatCard
          icon={<ClipboardList className="h-4 w-4 text-blue-500" />}
          label="完成订单"
          value={`${completedCount + (feeder.totalOrders || 0)}`}
        />
        <StatCard
          icon={<MapPin className="h-4 w-4 text-green-500" />}
          label="服务区域"
          value={feeder.serviceArea || "未设置"}
        />
      </div>

      {/* 评价列表 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">服务评价</CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewList feederId="feeder-1" />
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-4 pb-4 flex flex-col items-center gap-1">
        {icon}
        <p className="text-lg font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

function ReviewList({ feederId }: { feederId: string }) {
  const reviews = ReviewService.getByUser(feederId);
  const users = MOCK_USERS;

  if (reviews.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        暂无评价，完成订单后将在这里展示
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => {
        const from = users.find((u) => u.id === review.fromUserId);
        return (
          <div key={review.id} className="border-b last:border-0 pb-3 last:pb-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{from?.name || "匿名用户"}</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                  />
                ))}
              </div>
            </div>
            {review.comment && (
              <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
            )}
            <p className="text-xs text-muted-foreground/60 mt-1">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}
