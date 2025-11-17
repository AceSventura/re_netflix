import Image from "next/image";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";

const movies = [
    { id: "1", title: "Film 1", poster: "/images/movie1.jpg" },
    { id: "2", title: "Film 2", poster: "/images/movie2.jpg" },
    { id: "3", title: "Film 3", poster: "/images/movie3.jpg" },
    { id: "4", title: "Film 4", poster: "/images/movie4.jpg" },
    { id: "5", title: "Film 5", poster: "/images/movie5.jpg" },
    { id: "6", title: "Film 6", poster: "/images/movie6.jpg" },
    { id: "7", title: "Film 7", poster: "/images/movie8.jpg" },
    { id: "8", title: "Film 8", poster: "/images/movie9.jpg" },
    { id: "9", title: "Film 9", poster: "/images/movie10.jpg" },
    { id: "10", title: "Film 10", poster: "/images/movie11.jpg" },
    { id: "11", title: "Film 11", poster: "/images/movie12.jpg" },
    { id: "12", title: "Film 12", poster: "/images/movie13.jpg" },
    { id: "13", title: "Film 13", poster: "/images/movie14.jpg" },
    { id: "14", title: "Film 14", poster: "/images/movie15.jpg" }
];

export default function Home() {
  return (
      <>
        <Navbar/>
          <Hero/>
          <main className="p-6">
              <MovieRow title="Popolari" movies={movies} />
              <MovieRow title="Consigliati" movies={movies} />
          </main>
      </>
  );
}
