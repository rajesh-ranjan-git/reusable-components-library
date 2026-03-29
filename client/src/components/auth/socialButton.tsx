import { ElementType } from "react";

type SocialButtonProps = {
  provider: "Google" | "Facebook" | "GitHub" | "LinkedIn";
  onClick: () => void;
  icon: ElementType;
  iconOnly: boolean;
};

export default function SocialButton({
  provider,
  onClick,
  icon: Icon,
  iconOnly = false,
}: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${iconOnly ? "w-12 h-12 shrink-0" : "w-full px-4"} flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-primary/50 focus:outline-none`}
      title={iconOnly ? `Sign in with ${provider}` : undefined}
    >
      <Icon size={20} className={provider === "Google" ? "text-white" : ""} />
      {!iconOnly && <span>Continue with {provider}</span>}
    </button>
  );
}
