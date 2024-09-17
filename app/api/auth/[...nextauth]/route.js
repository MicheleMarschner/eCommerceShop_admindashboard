import NextAuth, { getServerSession, NextResponse, NextRequest } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "../../../lib/mongodb"

const adminEmails = ["michele.marschner@gmail.com"]

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
        if (adminEmails.includes(session?.user?.email)) return session;
        return false;
    }
  }
}


const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }


export async function isAdminRequest() {
  const session = await getServerSession(authOptions)
  
  if (!adminEmails.includes(session?.user?.email)) {
    return NextResponse.json("Unauthorized", { status: 401 });
    //throw 'not an admin'
  }

  return NextResponse.next();
}