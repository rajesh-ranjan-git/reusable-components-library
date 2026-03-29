import { ChangeEvent, SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LuCreditCard, LuLock, LuShieldCheck } from "react-icons/lu";
import { TbLoader3 } from "react-icons/tb";

export default function PaymentForm() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);

    value = value.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(value);
  };

  const handleExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    if (value.length > 5) value = value.slice(0, 5);
    setExpiry(value);
  };

  const handleCvvChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3) value = value.slice(0, 3);
    setCvv(value);
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/chat");
    }, 2000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface/50 shadow-xl p-6 md:p-8 border border-white/5 md:border-white/10 rounded-2xl"
    >
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="mb-1 font-bold text-white text-xl">Payment Method</h2>
          <p className="text-text-secondary text-sm">
            Enter your credit or debit card details below.
          </p>
        </div>

        {/* Existing / Saved Card UI Dummy */}
        <div className="flex items-center gap-3 bg-white/5 hover:bg-white/10 p-4 border border-primary/40 rounded-xl transition-colors cursor-pointer">
          <div className="bg-bg border-4 border-primary rounded-full w-5 h-5 shrink-0"></div>
          <div className="flex justify-center items-center bg-white/10 rounded w-10 h-6 font-bold text-[10px] text-white">
            VISA
          </div>
          <span className="flex-1 -mt-0.5 font-medium text-white text-sm">
            •••• 4242
          </span>
          <span className="text-text-secondary text-xs">12/26</span>
        </div>

        <div className="relative flex items-center py-2">
          <div className="border-white/10 border-t grow"></div>
          <span className="mx-4 font-semibold text-text-secondary text-xs uppercase tracking-widest shrink-0">
            Or New Card
          </span>
          <div className="border-white/10 border-t grow"></div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-1.5 ml-1 font-medium text-text-secondary text-xs">
              Cardholder Name
            </label>
            <input
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black/20 px-4 py-3 border border-white/10 focus:border-primary rounded-xl focus:outline-none focus:ring-1 focus:ring-primary w-full placeholder-text-secondary/50 text-white text-sm transition-colors"
              required
            />
          </div>

          <div>
            <label className="block mb-1.5 ml-1 font-medium text-text-secondary text-xs">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className="bg-black/20 px-4 py-3 pl-11 border border-white/10 focus:border-primary rounded-xl focus:outline-none focus:ring-1 focus:ring-primary w-full font-mono text-white text-sm tracking-widest transition-colors"
                required
              />
              <LuCreditCard
                className="top-1/2 left-4 absolute text-text-secondary -translate-y-1/2"
                size={18}
              />
            </div>
          </div>

          <div className="gap-4 grid grid-cols-2">
            <div>
              <label className="block mb-1.5 ml-1 font-medium text-text-secondary text-xs">
                Expiry Date
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={handleExpiryChange}
                className="bg-black/20 px-4 py-3 border border-white/10 focus:border-primary rounded-xl focus:outline-none focus:ring-1 focus:ring-primary w-full font-mono text-white text-sm text-center transition-colors"
                required
              />
            </div>
            <div>
              <label className="block mb-1.5 ml-1 font-medium text-text-secondary text-xs">
                CVC
              </label>
              <input
                type="text"
                placeholder="123"
                value={cvv}
                onChange={handleCvvChange}
                className="bg-black/20 px-4 py-3 border border-white/10 focus:border-primary rounded-xl focus:outline-none focus:ring-1 focus:ring-primary w-full font-mono text-white text-sm text-center transition-colors"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex justify-center items-center gap-2 bg-primary hover:bg-indigo-600 active:bg-indigo-700 disabled:opacity-70 shadow-lg shadow-primary/20 mt-4 py-3.5 rounded-xl w-full font-medium text-white text-sm uppercase tracking-wider transition-all disabled:cursor-not-allowed"
        >
          {loading ? (
            <TbLoader3 size={20} className="animate-spin" />
          ) : (
            <>
              <LuLock size={16} /> Pay Now
            </>
          )}
        </button>

        <div className="flex justify-center items-center gap-2 mt-2 text-text-secondary">
          <LuShieldCheck size={16} className="text-green-500" />
          <span className="font-medium text-green-500/80 text-xs uppercase tracking-wider">
            Secured Payments
          </span>
        </div>
      </div>
    </form>
  );
}
