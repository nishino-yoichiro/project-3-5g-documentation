import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// List of allowed employees:
const allowedEmails = ['davgnu@gmail.com','davxgnu@tamu.edu', 'djw9699@tamu.edu','sson5747@tamu.edu','yxn5165@tamu.edu', 'oscartsai26@tamu.edu']

/**
 * @type {Object} NextAuth options
 */
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (allowedEmails.includes(user.email)) {
        return true;
      } else {
        console.log('Unauthorized user:', user.email);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.email = token.email;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };