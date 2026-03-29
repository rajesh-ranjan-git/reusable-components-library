import { ChangeEvent, ElementType, useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

type InputFieldProps = {
  label: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: ElementType;
  required?: boolean;
};

export default function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required,
  icon: Icon,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5 mb-4">
      {label && (
        <label className="font-medium text-text-secondary text-sm">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-black/20 border ${error ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/30" : "border-white/10 focus:border-primary focus:ring-primary/30"} 
            rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-secondary focus:outline-none focus:ring-2 transition-all pr-16`}
        />
        <div className="top-1/2 right-3 absolute flex items-center gap-2 -translate-y-1/2">
          {Icon && <Icon size={18} className="text-text-secondary" />}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex justify-center items-center p-1 text-text-secondary hover:text-white transition-colors"
            >
              {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-0.5 text-red-400 text-xs">{error}</p>}
    </div>
  );
}
