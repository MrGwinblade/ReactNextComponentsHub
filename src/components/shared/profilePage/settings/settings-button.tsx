import { Button } from "@/components/ui/button"
import { DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  type TUpdateEmailValues,
  type TUpdatePasswordValues,
  type TUpdatePhoneValues,
  updateEmailSchema,
  updatePasswordSchema,
  updatePhoneSchema,
} from "./schemas"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { updateEmail, updatePassword, updatePhoneNumber } from "../user-actions"
import toast from "react-hot-toast"

interface SettingsButtonProps {
  variant?: "default" | "link" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined
  className?: string
  title: string
  userContent?: string
  email?: boolean
  password?: boolean
  phoneNumber?: boolean
  onSuccess: () => void
}

export function SettingsButton({
  variant = "ghost",
  className = "",
  title,
  userContent,
  email = false,
  password = false,
  phoneNumber = false,
  onSuccess,
}: SettingsButtonProps) {
  const formEmail = useForm<TUpdateEmailValues>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email: userContent || "",
    },
  })

  const formPassword = useForm<TUpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const formPhoneNumber = useForm<TUpdatePhoneValues>({
    resolver: zodResolver(updatePhoneSchema),
    defaultValues: {
      phoneNumber: userContent || "",
    },
  })

  const handleEmailSubmit = async (data: TUpdateEmailValues) => {
    try {
      await updateEmail(data.email)
      toast.success("Email updated successfully")
      onSuccess()
    } catch (error) {
      toast.error("Failed to update email")
    }
  }

  const handlePasswordSubmit = async (data: TUpdatePasswordValues) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        return toast.error("Passwords do not match")
      }
      await updatePassword(data.currentPassword, data.newPassword)
      toast.success("Password updated successfully")
      onSuccess()
    } catch (error) {
      toast.error("Failed to update password")
    }
  }

  const handlePhoneSubmit = async (data: TUpdatePhoneValues) => {
    try {
      await updatePhoneNumber(data.phoneNumber)
      toast.success("Phone number updated successfully")
      onSuccess()
    } catch (error) {
      toast.error("Failed to update phone number")
    }
  }

  return (
    <>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          className={`w-full justify-between px-0 py-4 font-normal hover:bg-gray-100 ${className}`}
        >
          <span className="pl-2">{title}</span>
          <div className="flex items-center gap-2 text-gray-500">
            {!password && <span>{userContent}</span>}
            <ChevronRight className="h-4 w-4" />
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{password ? "Change Password" : `Update ${title}`}</DialogTitle>
        </DialogHeader>

        {email && (
          <Form {...formEmail}>
            <form onSubmit={formEmail.handleSubmit(handleEmailSubmit)} className="space-y-4">
              <FormField
                control={formEmail.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="email" placeholder="New email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Update {title}</Button>
            </form>
          </Form>
        )}

        {password && (
          <Form {...formPassword}>
            <form onSubmit={formPassword.handleSubmit(handlePasswordSubmit)} className="space-y-4">
              <FormField
                control={formPassword.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="password" placeholder="Current password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formPassword.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="password" placeholder="New password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formPassword.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="password" placeholder="Confirm new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Update Password</Button>
            </form>
          </Form>
        )}

        {phoneNumber && (
          <Form {...formPhoneNumber}>
            <form onSubmit={formPhoneNumber.handleSubmit(handlePhoneSubmit)} className="space-y-4">
              <FormField
                control={formPhoneNumber.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="tel" placeholder="New phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Update {title}</Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </>
  )
}

