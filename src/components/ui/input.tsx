import * as React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-12 w-full rounded-xl border-[1.5px] border-[#e8dcc8] bg-[#faf7f2] px-4 py-2 text-[0.95rem] text-[#1c1810] placeholder:text-[#a0896a] transition-all focus:outline-none focus:ring-[3px] focus:ring-[#c9a96e26] focus:border-[#c9a96e] disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
