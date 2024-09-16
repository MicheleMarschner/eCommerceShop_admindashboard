import NextAuth, { getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "../../../lib/mongodb"

const adminEmails = ["michele.marschner@gmail.com"]

export const authOptions = {
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


export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions)
  
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401)
    res.end();
    throw 'not an admin'
  }
}