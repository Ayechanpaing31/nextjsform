import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthShowcase } from "../components/AuthShowcase";

import { api } from "~/utils/api";

export default function Home() {
  const router = useRouter();
  const handleCreateNotePage = () => {
    router.push('/home');
  }
  return (
    <>
      <Head>
        <title>Create a form</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#feb16d] to-[#e339b1]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Sign in to make a <span className="text-[hsl(280,100%,70%)]">FORM</span>
          </h1>
          <div className="flex items-center justify-center">
            <div
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white"
            >
              <div className="flex flex-col items-center gap-2">
                <p className="text-2xl text-white">
                  Click this
                </p>
                <AuthShowcase />
              </div>
            </div>

          </div>
          
        </div>
      </main>
    </>
  );
}

