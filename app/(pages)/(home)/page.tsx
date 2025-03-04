"use client";

import { useMovies } from "@/api";
import { Loader } from "@/components";
import Header from "./_components/Header";
import MovieList from "./_components/MovieList";
import NoMovieDisplay from "./_components/NoMovieDisplay";
import { useSearchParams, useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;

  const { data, isLoading } = useMovies({ page: currentPage });

  const handleChangePage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  const renderContents = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (!data?.total) {
      return <NoMovieDisplay />;
    }

    return (
      <MovieList
        movies={data.movies}
        total={data.total}
        currentPage={currentPage}
        onChangePage={handleChangePage}
      />
    );
  };

  return (
    <div className="relative mx-auto flex min-h-screen max-w-grid-max items-center justify-center py-default-sm md:py-default">
      <Header hasMovies={!!data?.total} />
      {renderContents()}
    </div>
  );
}
