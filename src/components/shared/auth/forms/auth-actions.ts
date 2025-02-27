'use server';

import { prisma } from '@@/prisma/prisma-client';
import { Prisma, UserRole } from '@prisma/client';
import { hashSync } from 'bcryptjs';

{/*
  export async function registerUser(body: Prisma.UserCreateInput) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email: body.email,
        },
      });
  
      if (user) {
        if (!user.verified) {
          throw new Error('Пользователь уже существует и Почта не подтверждена');
        }
  
        throw new Error('Пользователь уже существует');
      }
  
      const createdUser = await prisma.user.create({
        data: {
          fullName: body.fullName,
          email: body.email,
          password: hashSync(body.password, 10),
        },
      });
  
      //const code = Math.floor(100000 + Math.random() * 900000).toString();
  
    //   await prisma.verificationCode.create({
    //     data: {
    //       code,
    //       userId: createdUser.id,
    //     },
    //   });
  
    //   await sendEmail(
    //     createdUser.email,
    //     'Next Pizza / 📝 Подтверждение регистрации',
    //     VerificationUserTemplate({
    //       code,
    //     }) as React.ReactNode,
    //   );
    } catch (err) {
      console.log('Error [CREATE_USER]', err);
      throw err;
    }
  }
*/}

  export async function registerUser(email: string, password: string, fullName: string) {
    try{
      const existingUser = await prisma.user.findFirst({ where: { email } });
      if (existingUser) {
        throw new Error("User with this email already exists");
      }
    
      const hashedPassword = await hashSync(password, 10);
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          fullName,
          role: "USER" as UserRole,
          verified: new Date(),
        },
      });
  
      return true;
    }
    catch (err) {
      console.log('Error [CREATE_USER]', err);
      throw err;
    }
  }