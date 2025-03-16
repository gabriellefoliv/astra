import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { nextAuthOptions } from "../api/auth/[...nextauth]/route";

interface PrivateLayoutProps {
    children: ReactNode
}

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
    const session = await getServerSession(nextAuthOptions)
    if (session) {
        redirect('/dashboard')
    }

    return <>{children}</>
}