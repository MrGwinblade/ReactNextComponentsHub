import { z } from 'zod';

// Existing schemas
export const passwordSchema = z.string().min(4, { message: 'Введите корректный пароль' });

// New schemas for updating data
export const updateEmailSchema = z.object({
  email: z.string().email({ message: 'Введите корректную почту' }),
});

export const updatePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: passwordSchema,
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Новые пароли не совпадают',
  path: ['confirmPassword'],
});

export const updatePhoneSchema = z.object({
  phoneNumber: z.string().min(4,  { message: 'Введите корректный номер телефона' }),
});

export type TUpdateEmailValues = z.infer<typeof updateEmailSchema>;
export type TUpdatePasswordValues = z.infer<typeof updatePasswordSchema>;
export type TUpdatePhoneValues = z.infer<typeof updatePhoneSchema>;
