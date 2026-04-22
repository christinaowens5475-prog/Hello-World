"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-3xl bg-white/20 backdrop-blur-sm p-10 flex flex-col items-center gap-6 text-center">
        <p className="text-6xl">🌤️</p>
        <h1 className="text-2xl font-bold text-white drop-shadow">
          Weather Unavailable
        </h1>
        <p className="text-white/80 text-sm">
          Could not load weather data for Long Beach, CA. The weather service
          may be temporarily unavailable.
        </p>
        {process.env.NODE_ENV === "development" && (
          <p className="text-white/60 text-xs font-mono bg-black/20 rounded-lg px-4 py-2 w-full break-words">
            {error.message}
          </p>
        )}
        <button
          onClick={reset}
          className="mt-2 rounded-full bg-white/30 hover:bg-white/50 transition-colors px-6 py-2 text-white font-medium"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
