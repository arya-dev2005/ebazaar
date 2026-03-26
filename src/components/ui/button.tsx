import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "accent";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
}

const variants = {
    primary:
        "bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20 hover:shadow-[0_0_20px_rgba(99,102,241,0.35)]",
    secondary:
        "bg-slate-700 hover:bg-slate-600 text-white",
    outline:
        "border border-slate-600 hover:border-indigo-400/60 hover:text-indigo-400 text-slate-300 bg-transparent hover:bg-indigo-500/5",
    ghost:
        "hover:bg-slate-800 text-slate-300 bg-transparent",
    danger:
        "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20",
    accent:
        "bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold shadow-lg shadow-amber-500/20 hover:shadow-[0_0_20px_rgba(245,158,11,0.35)]",
};

const sizes = {
    sm: "px-3.5 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = "primary", size = "md", loading, className = "", children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={`
          inline-flex items-center justify-center gap-2 rounded-xl font-medium
          transition-all duration-300 ease-out
          hover:scale-[1.03] active:scale-[0.98]
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          ${variants[variant]} ${sizes[size]} ${className}
        `}
                disabled={disabled || loading}
                {...props}
            >
                {loading && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";
