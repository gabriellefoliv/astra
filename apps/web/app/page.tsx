import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Bem-vindo à Astra!</h1>
      <p className="text-lg mb-8">Conheça mais sobre nossa aplicação.</p>

      <div>
        <Link href="/auth/login">
          <button type="button" className="px-8 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Login
          </button>
        </Link>

        <Link href="/auth/signup">
          <button type="button" className="px-8 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  )
}
