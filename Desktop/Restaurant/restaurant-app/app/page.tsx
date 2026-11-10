import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-6 text-center">
      <h1 className="mb-4 text-4xl font-bold text-green-700">
        Welcome to Our Restaurant
      </h1>

      <p className="mb-8 text-gray-600">
        Enjoy delicious meals prepared just for you.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/menu"
          className="rounded-lg bg-green-700 px-6 py-3 text-white hover:bg-green-800"
        >
          View Menu
        </Link>

        <Link
          href="/login"
          className="rounded-lg border border-green-700 px-6 py-3 text-green-700"
        >
          Login
        </Link>

        <Link
          href="/signup"
          className="rounded-lg bg-gray-800 px-6 py-3 text-white"
        >
          Sign Up
        </Link>
      </div>
    </main>
  );
}