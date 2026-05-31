import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        className={`inline-flex items-center justify-center rounded-xl text-sm font-semibold tracking-wide ring-offset-[#faf7f2] transition-all focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#c9a96e40] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#c9a96e] text-white hover:bg-[#b5955a] shadow-[0_4px_14px_0_rgba(201,169,110,0.39)] hover:shadow-[0_6px_20px_rgba(201,169,110,0.23)] hover:-translate-y-0.5 active:translate-y-0 h-12 px-6 py-2 ${className || ''}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
