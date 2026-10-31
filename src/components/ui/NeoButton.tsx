import React from "react";

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "ghost" | "cyan";
  size?: "sm" | "md" | "lg";
  icon?: string;
  children: React.ReactNode;
}

export const NeoButton: React.FC<NeoButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary: "bg-[#25F4D2] text-[#003D32] hover:bg-[#38EFD0]",
    secondary: "bg-[#FFD600] text-[#1D1E24] hover:bg-[#FFE170]",
    destructive: "bg-[#FF4D6D] text-white hover:bg-[#FF6584]",
    ghost: "bg-[#FFF8EE] text-[#1D1E24] hover:bg-[#FFF2DF]",
    cyan: "bg-[#00C2E8] text-[#1D1E24] hover:bg-[#33D3F2]",
  };

  const sizeStyles = {
    sm: "px-2.5 py-1 text-[11px]",
    md: "px-3.5 py-1.5 text-[12px] sm:text-[13px]",
    lg: "px-5 py-2.5 text-[14px]",
  };

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 font-headline uppercase font-black border-2 border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1D1E24] transition-all select-none disabled:opacity-50 disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && (
        <span className="material-symbols-outlined text-[16px] font-bold">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </button>
  );
};

