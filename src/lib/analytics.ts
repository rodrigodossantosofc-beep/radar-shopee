export type SnapshotPoint = {
  collectedAt: Date;
  sales: number | null;
  price: number | null;
  reviewCount: number | null;
};

export function calculateMetrics(points: SnapshotPoint[]) {
  if (points.length < 2) {
    return {
      salesDelta: null,
      salesVelocity: null,
      acceleration: null,
      priceDeltaPct: null,
      reviewDelta: null,
      opportunity: null,
    };
  }

  const sorted = [...points].sort(
    (a, b) => a.collectedAt.getTime() - b.collectedAt.getTime()
  );

  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const hours = Math.max(
    (last.collectedAt.getTime() - first.collectedAt.getTime()) / 3_600_000,
    0.01
  );

  const salesDelta =
    first.sales != null && last.sales != null ? last.sales - first.sales : null;
  const salesVelocity = salesDelta != null ? salesDelta / hours : null;

  let acceleration: number | null = null;
  if (sorted.length >= 3) {
    const mid = sorted[Math.floor(sorted.length / 2)];
    if (first.sales != null && mid.sales != null && last.sales != null) {
      const h1 = Math.max(
        (mid.collectedAt.getTime() - first.collectedAt.getTime()) / 3_600_000,
        0.01
      );
      const h2 = Math.max(
        (last.collectedAt.getTime() - mid.collectedAt.getTime()) / 3_600_000,
        0.01
      );
      const v1 = (mid.sales - first.sales) / h1;
      const v2 = (last.sales - mid.sales) / h2;
      acceleration =
        v1 === 0 ? (v2 > 0 ? 100 : 0) : ((v2 - v1) / Math.abs(v1)) * 100;
    }
  }

  const priceDeltaPct =
    first.price && last.price
      ? ((last.price - first.price) / first.price) * 100
      : null;

  const reviewDelta =
    first.reviewCount != null && last.reviewCount != null
      ? last.reviewCount - first.reviewCount
      : null;

  const velocityScore =
    salesVelocity == null ? 0 : Math.min(Math.max(salesVelocity * 5, 0), 45);
  const accelScore =
    acceleration == null ? 0 : Math.min(Math.max(acceleration / 3, 0), 35);
  const reviewScore =
    reviewDelta == null ? 0 : Math.min(Math.max(reviewDelta * 2, 0), 20);

  return {
    salesDelta,
    salesVelocity,
    acceleration,
    priceDeltaPct,
    reviewDelta,
    opportunity: Math.round(Math.min(velocityScore + accelScore + reviewScore, 100)),
  };
}
