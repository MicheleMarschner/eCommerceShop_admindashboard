import NextAuth, { getServerSession, NextResponse, NextRequest } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "../../../lib/mongodb"

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(client),
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
  ],
  callbacks: {
    session: ({session, token, user}) => {
        if (process.env.ADMIN_EMAIL === session?.user?.email) return session;
        return false;
    }
  }
}


const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }


export async function isAdminRequest() {
  const session = await getServerSession(authOptions)

  const adminEmail = process.env.ADMIN_EMAIL
  
  if (!adminEmail === session?.user?.email) {
    NextResponse.json({message: 'Unauthorized'}, { status: 401 });
    throw 'not an admin'
  }

  return NextResponse.json(session, null, 2);
}