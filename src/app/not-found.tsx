import Header from "@/components/client/layout/Header";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-[1536px] mx-auto flex flex-col h-screen pt-[65px]">
      <Header />
      <div className="flex flex-col items-center justify-center flex-grow text-center px-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-lg md:text-2xl font-bold mt-2">
          Ups! Siden du leder efter findes ikke.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Link href="/" className=" btn btn-primary md:text-lg">
            Gå til forsiden
          </Link>
          <Link
            href="/service"
            className=" btn btn-primary btn-outline md:text-lg"
          >
            Se vores services
          </Link>
        </div>
      </div>
    </div>
  );
}
