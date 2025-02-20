"use client"

import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { X, Eye, EyeOff } from "lucide-react"
import type React from "react" // Added import for React

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  required?: boolean
  className?: string
  passwordField?: boolean
}

export const FormInput: React.FC<Props> = ({ className, name, label, required, passwordField = false, ...props }) => {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext()

  const value = watch(name)
  const errorText = errors[name]?.message as string

  const onClickClear = () => {
    setValue(name, "", { shouldValidate: true })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={className}>
      {label && (
        <p className="font-medium mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </p>
      )}

      <div className="relative">
        <Input
          className="h-10 text-md pr-10 "
          {...register(name)}
          {...props}
          type={passwordField && !showPassword ? "password" : "text"}
        />

        {value && (
          <button
            onClick={onClickClear}
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {passwordField && ( value && (
          <button
            onClick={togglePasswordVisibility}
            type="button"
            className="absolute right-10 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 cursor-pointer"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        ))}
      </div>

      {errorText && <p className="text-red-500 text-sm mt-2">{errorText}</p>}
    </div>
  )
}

