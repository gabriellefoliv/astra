'use client'

import { type SignInResponse, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type SyntheticEvent, useState } from "react";

export default function Login() {
    const { data: session } = useSession();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState("");

    const router = useRouter()    
    
      async function handleSubmit(event: SyntheticEvent) {
        event.preventDefault();

        const result = await signIn('credentials', {
          email,
          password,
          redirect: false
        })

        if(result?.error) {
          console.log(result)
          return
        }

        router.replace('/dashboard')
      }

    return (
        <section className="w-full flex flex-row justify-center items-center h-screen">
      <div className="m-4 p-4 bg-white w-11/12 max-w-[700px] flex flex-col items-center justify-center rounded-2xl">
        <form
          id="login-form"
          onSubmit={handleSubmit}
          className="w-11/12 max-w-[500px] flex-col flex items-center justify-center"
        >
          <h2 className="inter-normal text-[28px] text-black font-black mb-4">
            Login
          </h2>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="email-login-input">Username</label>
            <input
              id="email-login-input"
              name="phone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border h-11"
            />
            <label htmlFor="password-login-input">Password</label>
            <input
              id="password-login-input"
              name="phone"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="border h-11"
            />
          </div>
          <button type="submit" className="bg-black w-full m-3 text-white p-3">
            Sign In
          </button>
          <p>{session?.user && "Logado"}</p>
        </form>
      </div>
    </section>
    )
}
