import type { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },

      async authorize(credentials, req) {
        const response = await fetch('http://localhost:3333/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        })

        const user = await response.json()

        if (user && response.ok) {
          return user
        }

        return null
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      user && (token.user = user)
      return token
    },
    async session({ session, token }) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      session = token.user as any
      return session
    },
  },
}

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST, nextAuthOptions }
