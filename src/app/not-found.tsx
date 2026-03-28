import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-sm">
        <div className="text-8xl">🃏</div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">404</h1>
          <p className="text-green-400 text-lg">This hand was folded.</p>
          <p className="text-green-500 text-sm">
            The page you are looking for does not exist.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-xl transition-all duration-200 shadow-lg"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
