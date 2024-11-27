import MoviesPage from "@/components/Movies/Movies";
import { ClockCircleOutlined } from "@ant-design/icons";
import { BiSolidCameraMovie } from "react-icons/bi";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#111111] text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-16">
          <h1 className="text-3xl font-bold">RateItUp</h1>
        </header>
        
        {/* Counter Banner */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#222222] rounded-full px-6 py-2 text-white">
            <span className="flex items-center gap-2">
            <BiSolidCameraMovie /> Rate. Review. Binge.
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
          Discover and Review the Latest Movies
            <span className="text-red-500">.</span>
          </h2>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto mb-8">
          Join our community of movie enthusiasts. Rate, review, and explore
          the world of cinema with like-minded people.
          </p>
        </div>

        {/* Movies Component */}
        <MoviesPage />
      </div>
    </main>
  );
}

