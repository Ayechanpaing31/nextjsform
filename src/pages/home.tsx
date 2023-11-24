import { useState } from "react";
import { useRouter } from "next/router";
import Forms from "./formsmap";
import type Form from "~/types/Form";
import { api } from "~/utils/api";
import Link from "next/link";
import Head from "next/head";
import Header from "../components/Header";
import { useSession } from 'next-auth/react';

export default function home() {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const { data: forms } = api.form.formslist.useQuery() as { data: Form[] };
  const handleCreateFormPage = () => {
    router.push('/createform');
  };

  return (
    <>
      {sessionData ? (
        <>
          <Head>
            <title>Home | Create a form</title>
            <meta name="description" content="Generated by create-t3-app" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Header />

          <main className="flex min-h-screen flex-col items-center justify-start">
            <div className="w-full max-w-3xl border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
              <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
                <div className="ml-4 mt-4 flex w-full flex-col">
                  <h3 className="text-base text-l font-semibold leading-6 text-gray-900">
                    Start a new form
                  </h3>
                  <Link href="/createform">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-72 h-52 flex justify-center items-center">
                      <div className="p-4 pt-0 flex justify-center items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-plus"
                        >
                          <path d="M5 12h14"></path>
                          <path d="M12 5v14"></path>
                        </svg>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={handleCreateFormPage}
                    className=" p-4  mb-4 rounded-ee-full  rounded-ss-full bg-blue-500 text-white fixed bottom-4 right-4 shadow-lg">
                    +
                  </button>
                </div>
              </div>
            </div>
            <Forms forms={forms} />
          </main>

        </>
      ) : (
        "href = /index"
      )}
      </>
  );
}