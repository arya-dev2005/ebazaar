import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = "", id, ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label htmlFor={id} className="block text-sm font-medium text-slate-300">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={`
            w-full rounded-lg border bg-slate-800/50 px-4 py-2.5 text-sm text-slate-100
            placeholder:text-slate-500
            focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none
            transition-colors duration-200
            ${error ? "border-red-500" : "border-slate-700"}
            ${className}
          `}
                    {...props}
                />
                {error && <p className="text-xs text-red-400">{error}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";
