'use client';

import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { registerUser } from './auth-actions';
import { TFormRegisterValues, formRegisterSchema } from './schemas';
import { FormInput } from './form-input';
import { Button } from '@/components/ui';
import { Container } from '../../container';

interface Props {
  onClose?: VoidFunction;
  onClickLogin?: VoidFunction;
}

export const RegisterForm: React.FC<Props> = ({ onClose, onClickLogin }) => {
  const form = useForm<TFormRegisterValues>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: TFormRegisterValues) => {
    try {
      await registerUser({
        email: data.email,
        fullName: data.fullName,
        password: data.password,
      });

      toast.error('Регистрация успешна 📝. Подтвердите свою почту', {
        icon: '✅',
      });

      onClose?.();
    } catch (error) {
      console.log(error)
      return toast.error('Неверный E-Mail или пароль', {
        icon: '❌',
      });
    }
  };

  return (
    <Container className="w-full max-w-[800px] bg-gradient-to-r from-zinc-700 via-blue-950 to-zinc-700 p-8 rounded-lg shadow-lg">
        <FormProvider {...form}>
            <form
            className="flex flex-col gap-6 p-6 bg-zinc-300 rounded-lg shadow-md"
            onSubmit={form.handleSubmit(onSubmit)}
            >
            <h2 className="text-2xl font-semibold text-center text-slate-800 mb-6">Регистрация</h2>

            <FormInput
                name="email"
                label="E-Mail"
                required
                className="bg-slate-200 border-2 border-slate-400 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
            <FormInput
                name="fullName"
                label="Login Name"
                required
                className="bg-slate-200 border-2 border-slate-400 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
            <FormInput
                name="password"
                label="Пароль"
                type="password"
                passwordField={true}
                required
                className="bg-slate-200 border-2 border-slate-400 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
            <FormInput
                name="confirmPassword"
                label="Подтвердите пароль"
                type="password"
                passwordField={true}
                required
                className="bg-slate-200 border-2 border-slate-400 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
            />

            <Button
                loading={form.formState.isSubmitting}
                className="h-12 text-base font-semibold text-white bg-gradient-to-r from-zinc-700 via-blue-950 to-zinc-700 rounded-md shadow-lg
                            transition-transform duration-300 transform 
                            hover:scale-105
                            transition-background-color
                            hover:bg-gradient-to-r hover:from-zinc-700 hover:via-indigo-900 hover:to-zinc-700"
                type="submit"
            >
                Зарегистрироваться
            </Button>
            </form>
        </FormProvider>
    </Container>


    
  );
};
