import { PricingCard } from "@/components/PricingCard";

export default function PricingPage() {
  return (
    <div className="mx-auto px-4 py-12">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-900">解鎖全部課程</h1>
        <p className="mt-2 text-gray-500">
          一次性付款，終身學習。買斷後隨時隨地睇晒 45 課。
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-sm">
        <PricingCard />
      </div>
    </div>
  );
}
