import { notFound } from "next/navigation";
import UpdateForm from "./_components/UpdateForm";
import { getMovieBySlug } from "@/libs/movies";
import Header from "./_components/Header";

export default async function EditMoviePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  const movie = await getMovieBySlug(slug);
  if (!movie) {
    notFound();
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-grid-max flex-col items-center gap-y-16 px-6 py-default-sm md:px-0 md:py-default">
      <Header />
      <UpdateForm movie={movie} />
    </div>
  );
}
