import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { NextRequest, NextResponse } from 'next/server';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    async signIn({ user: { email } }) {
      console.log('email', email);
      return email === process.env.ALLOWED_EMAIL;
      // console.log(props);
      // return false;
    }
  }
});

export { handler as GET, handler as POST };
