import { type AuthOptions, type DefaultUser, getServerSession } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@@/prisma/prisma-client"
import { compare, hashSync } from "bcryptjs"
import type { UserRole } from "@prisma/client"
import type { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: number
      role?: UserRole
      email: string
      image?: string
      phoneNumber?: string
      fullName?: string
      githubId?: string | null
      githubLogin?: string | null
    }
  }
  
  interface User extends DefaultUser {
    id: number
    email: string
    role?: UserRole
    phoneNumber?: string
    fullName?: string
    githubId?: string | null
    githubLogin?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: number
    role?: UserRole
    email: string
    fullName?: string
    phoneNumber?: string
    githubId?: string | null
    githubLogin?: string | null
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      profile(profile) {
        return {
          id: profile.id,
          login: profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: "USER" as UserRole,
          githubId: profile.id.toString(),
          githubLogin: profile.login,
        }
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null
        }

        const user = await prisma.user.findFirst({
          where: { email: credentials.email },
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "credentials") {
          return true
        }

        if (!user.email) {
          return false
        }

        const session = await getServerSession(authOptions)
        if (session?.user?.email) {
          const currentUser = await prisma.user.findFirst({
            where: { email: session.user.email },
          })

          if (currentUser) {
            if (account?.provider === "github") {
              const existingGitHubUser = await prisma.user.findFirst({
                where: {
                  OR: [{ githubId: user.githubId }, { githubLogin: user.githubLogin }],
                  NOT: { id: currentUser.id },
                },
              })

              if (existingGitHubUser) {
                return false
              }
            }

            await prisma.user.update({
              where: { id: currentUser.id },
              data: {
                githubId: account?.provider === "github" ? user.githubId : currentUser.githubId,
                githubLogin: account?.provider === "github" ? user.githubLogin : currentUser.githubLogin,
              },
            })
            return true
          }
        }

        const findUser = await prisma.user.findFirst({
          where: {
            OR: [
              { provider: account?.provider, providerId: account?.providerAccountId },
              { email: user.email },
              account?.provider === "github"
                ? { OR: [{ githubId: user.githubId }, { githubLogin: user.githubLogin }] }
                : {},
            ],
          },
        })

        if (findUser) {
          await prisma.user.update({
            where: { id: findUser.id },
            data: {
              provider: account?.provider,
              providerId: account?.providerAccountId,
              githubId: account?.provider === "github" ? user.githubId : findUser.githubId,
              githubLogin: account?.provider === "github" ? user.githubLogin : findUser.githubLogin,
            },
          })
          return true
        }

        await prisma.user.create({
          data: {
            email: user.email,
            password: hashSync(user.id.toString() + "NotaPassword", 10),
            fullName: user.name || "User #" + user.id,
            provider: account?.provider,
            providerId: account?.providerAccountId,
            githubId: account?.provider === "github" ? user.githubId : null,
            githubLogin: account?.provider === "github" ? user.githubLogin : null,
            role: "USER" as UserRole,
            verified: new Date(),
          },
        })

        return true
      } catch (error) {
        console.error("Error [SIGNIN]", error)
        return false
      }
    },
    async jwt({ token, user }) {
      // Если есть user (первый вход), устанавливаем начальные данные
      if (user) {
        token.id = Number(user.id);
        token.role = user.role;
        token.githubId = user.githubId;
        token.githubLogin = user.githubLogin;
        token.email = user.email;
        token.fullName = user.name ?? "";
      }

      // Всегда обновляем данные из базы, если есть email
      if (token.email) {
        const findUser = await prisma.user.findFirst({
          where: { email: token.email },
        });
        if (findUser) {
          token.id = findUser.id;
          token.email = findUser.email;
          token.fullName = findUser.fullName;
          token.role = findUser.role;
          token.phoneNumber = findUser.phoneNumber ?? undefined;
          token.githubId = findUser.githubId ?? undefined;
          token.githubLogin = findUser.githubLogin ?? undefined;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user && token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.phoneNumber = token.phoneNumber;
        session.user.fullName = token.fullName;
        session.user.githubId = token.githubId;
        session.user.githubLogin = token.githubLogin;
        session.user.email = token.email;
        session.user.image = token.picture ?? ""; // Добавляем image из токена, если есть
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Custom logic if needed
    },
  },
  debug: process.env.NODE_ENV === "development",
};