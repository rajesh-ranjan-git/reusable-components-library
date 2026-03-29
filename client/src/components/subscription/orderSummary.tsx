import { useState } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

type PlanDetails = {
  name: string;
  planType: "Monthly" | "Yearly";
  price: number;
  tax: number;
  discount: number;
  total: number;
};

export default function OrderSummary({
  planDetails,
  isMobile,
}: {
  planDetails: PlanDetails;
  isMobile: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(!isMobile);

  const { name, planType, price, tax, discount, total } = planDetails;

  return (
    <div className="shadow-lg border border-white/5 md:border-white/10 rounded-2xl h-full overflow-hidden">
      {/* Mobile Toggle */}
      <div
        className="md:hidden flex justify-between items-center bg-white/5 hover:bg-white/10 p-4 transition-colors cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="flex items-center gap-2 font-medium text-white text-sm">
          Show order summary
          {isExpanded ? <LuChevronUp size={16} /> : <LuChevronDown size={16} />}
        </span>
        <span className="font-bold text-white">${total.toFixed(2)}</span>
      </div>

      {(isExpanded || !isMobile) && (
        <div className="space-y-6 p-6 md:p-8">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="mb-1 font-bold text-white text-xl">
                DevMatch {name}
              </h3>
              <p className="text-text-secondary text-sm">{planType} billing</p>
            </div>
            <span className="font-semibold text-white text-lg">
              ${price.toFixed(2)}
            </span>
          </div>

          <div className="bg-white/10 w-full h-px"></div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal</span>
              <span>${price.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Discount applied</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-text-secondary">
              <span>Tax (Estimated)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white/10 w-full h-px"></div>

          <div className="flex justify-between items-end">
            <div>
              <span className="block mb-1 text-text-secondary text-sm">
                Total due today
              </span>
              <span className="font-bold text-primary text-3xl">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-primary/10 mt-6 p-4 border border-primary/20 rounded-lg">
            <p className="text-text-secondary text-xs leading-relaxed">
              Your subscription will renew automatically. You can cancel at any
              time from your account settings.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
