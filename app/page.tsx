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
          <h1 className="text-2xl sm:text-3xl font-bold">RateItUp<span className="text-red-500">.</span></h1>
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
      </div>
    </main>
  );
}

