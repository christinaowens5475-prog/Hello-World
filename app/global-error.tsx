"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <main className="min-h-screen bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-3xl bg-white/20 p-10 flex flex-col items-center gap-6 text-center">
            <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
            <button
              onClick={reset}
              className="rounded-full bg-white/30 hover:bg-white/50 transition-colors px-6 py-2 text-white font-medium"
            >
              Try Again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
