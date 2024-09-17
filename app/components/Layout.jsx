// mark as client component
"use client";

// importing necessary functions
import { useSession, signIn, signOut } from "next-auth/react"
import Nav from "./Nav"
import Logo from './Logo'
import { useState } from "react";

export default function Layout({ children }) {

  const [ showNav, setShowNav ] = useState(false);

  // extracting data from usesession as session
  const { data: session } = useSession()

  // checking if sessions exists
  {/*if (!session) {
    return (
      <div className="bg-bgGray w-screen h-screen flex items-center">
        <Nav />
        <div className="text-center w-full">
          <button onClick={() => signIn('google')} className="bg-white p-2 px-4 rounded-lg">Login with Google</button>
        </div>
      </div>
    )
  }
  */}

  // rendered code if user not logged in
  return (
    <div className="bg-bgGray min-h-screen">
      <div className="block md:hidden flex items-center">
        <button onClick={() => setShowNav(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
      </div>
      <div className="flex">
      <Nav show={showNav} />
        <div className="flex-grow p-4 min-h-screen">{ children }</div>
      </div>
    </div>
    
  );
}
