// mark as client component
"use client";

import Layout from "./components/Layout";
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  // rendered code if user not logged in
  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>Hello, <b>{session?.user?.name}</b></h2>
        <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
          <img src={session?.user?.image} className="w-6 h-6" alt="profile picture" />
          <span className="px-2">{session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
}
