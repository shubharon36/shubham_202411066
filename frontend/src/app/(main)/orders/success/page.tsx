// NO "use client" here
export const dynamic = "force-dynamic";

import OrderSuccessClient from "./OrderSuccessClient";

export default async function OrderSuccessPage({
  searchParams,
}: {
  // Next 15: searchParams is a Promise
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const orderId = sp?.orderId;

  return <OrderSuccessClient orderId={orderId} />;
}
