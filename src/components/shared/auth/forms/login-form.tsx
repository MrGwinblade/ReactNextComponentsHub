'use client';

import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { TFormLoginValues, formLoginSchema } from './schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui';
import { FormInput } from './form-input';
import { Title } from '../../title';
import { Container } from '../../container';
import { X } from 'lucide-react';

interface Props {
  onClose?: VoidFunction;
}

export const LoginForm: React.FC<Props> = ({ onClose }) => {
  const form = useForm<TFormLoginValues>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: TFormLoginValues) => {
    try {
      const resp = await signIn('credentials', {
        ...data,
        redirect: false,
      });
      if (!resp?.ok) {
        throw Error();
      }

      toast.success('Вы успешно вошли в аккаунт', {
        icon: '✅',
      });

      onClose?.();
    } catch (error) {
      console.error('Error [LOGIN]', error);
      toast.error('Не удалось войти в аккаунт', {
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
          <h2 className="text-2xl font-semibold text-center text-slate-800 mb-6">Вход в аккаунт</h2>
          <p className="text-center text-slate-900 mb-6">Введите свою почту, чтобы войти в свой аккаунт</p>

          <FormInput
            name="email"
            label="E-Mail"
            required
            className="bg-slate-200 border-2 border-slate-400 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <FormInput
            name="password"
            label="Пароль"
            type="password"
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
            Войти
          </Button>
          <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() =>
              signIn('github', {
                callbackUrl: '/',
                redirect: true,
              })
            }
            type="button"
            className="gap-2 h-12 p-2 flex-1">
            <img className="w-6 h-6" src="https://github.githubassets.com/favicons/favicon.svg" />
            GitHub
          </Button>

          <Button
            variant="secondary"
            // onClick={() =>
            //   signIn('google', {
            //     callbackUrl: '/',
            //     redirect: true,
            //   })
            // }
            type="button"
            className="gap-2 h-12 p-2 flex-1">
            <img
              className="w-6 h-6"
              src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
            />
            Google(<X className="w-2 h-2 text-red-500"/>, долго настраивать аккаунт)
          </Button>
          </div>
        </form>
      </FormProvider>
    </Container>
  );
};
