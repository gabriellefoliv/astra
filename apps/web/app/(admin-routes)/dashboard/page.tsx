import { getServerSession } from "next-auth"
import ButtonLogout from "../../../components/ButtonLogout"
import { nextAuthOptions } from "../../api/auth/[...nextauth]/route"

export default async function Dashboard() {
    const session = await getServerSession(nextAuthOptions) 

    
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Hello {session?.user.name}</p>
            <ButtonLogout/>
        </div>
    )
}