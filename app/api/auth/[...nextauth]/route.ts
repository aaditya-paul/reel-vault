import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }: any) {
      if (session.user) {
        // Expose the google_id via token.sub and raw token for API auth
        session.user.id = token.sub
        session.accessToken = token.accessToken
      }
      return session
    },
    async jwt({ token, user, account }: any) {
      if (account) {
        token.accessToken = account.id_token
      }
      return token
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
