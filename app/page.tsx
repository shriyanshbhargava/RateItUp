import MoviesPage from "@/components/Movies/Movies";
import { ClockCircleOutlined } from "@ant-design/icons";
import { BiSolidCameraMovie } from "react-icons/bi";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#111111] relative">
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/10 via-transparent to-teal-500/10" />
      <div className="absolute inset-0 bg-gradient-to-bl from-purple-900/5 via-transparent to-teal-500/5" />

      <div className="relative text-white container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <header className="mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-2xl sm:text-3xl font-bold">
            RateItUp<span className="text-red-500">.</span>
          </h1>
        </header>

        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-[#222222]/80 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 text-sm sm:text-base text-white">
            <span className="flex items-center gap-2">
              <BiSolidCameraMovie /> Rate. Review. Binge.
            </span>
          </div>
        </div>

        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2">
            Discover and Review the Latest Movies
            <span className="text-red-500">.</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
            Join our community of movie enthusiasts. Rate, review, and explore
            the world of cinema with like-minded people.
          </p>
        </div>

        <div className="px-2">
          <MoviesPage />
        </div>

        {/* Footer */}
        <footer className="text-center pt-8 mt-16 border-t border-purple-900/20">
          <div className="space-y-2">
            <p className="text-zinc-500 text-sm tracking-wide font-light">
              © {new Date().getFullYear()} RateItUp. All rights reserved.
            </p>
            <p className="text-zinc-400 font-light">
              Created by:{" "}
              <a
                href="https://shriyansh.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 hover:text-teal-300 transition-colors font-normal group inline-flex items-center gap-1"
              >
                Shriyansh Bhargava
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 mb-0.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
