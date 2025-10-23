import React from "react"
import styles from "@/styles/input.module.css"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className = "", type = "text", ...props }, ref) => {
  return <input ref={ref} type={type} className={`${styles.input} ${className}`} {...props} />
})
Input.displayName = "Input"
export { Input }
