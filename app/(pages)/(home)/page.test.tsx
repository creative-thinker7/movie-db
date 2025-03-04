import { render, screen, fireEvent } from "@testing-library/react";
import Home from "./page";
import { useMovies } from "@/api";
import { useSearchParams, useRouter } from "next/navigation";

jest.mock("@/api", () => ({
  useMovies: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      LOADING: "Loading",
    };
    return translations[key];
  },
}));

jest.mock("./_components/Header", () => () => <div>Header</div>);
jest.mock("./_components/NoMovieDisplay", () => () => (
  <div>NoMovieDisplay</div>
));
jest.mock("./_components/MovieList", () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ({ movies, total, currentPage, onChangePage }: any) => (
    <div>
      MovieList
      <div>Movies: {movies.length}</div>
      <div>Total: {total}</div>
      <div>Current Page: {currentPage}</div>
      <button onClick={() => onChangePage(2)}>Change Page</button>
    </div>
  ),
);

describe("Home page", () => {
  const mockUseMovies = useMovies as jest.Mock;
  const mockUseSearchParams = useSearchParams as jest.Mock;
  const mockUseRouter = useRouter as jest.Mock;

  const mockPush = jest.fn();

  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
    });

    const mockSearchParams = new URLSearchParams("page=1");
    mockUseSearchParams.mockReturnValue(mockSearchParams);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the Loader when isLoading is true", () => {
    mockUseMovies.mockReturnValue({ isLoading: true, data: undefined });

    render(<Home />);

    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("should render NoMovieDisplay when there are no movies", () => {
    mockUseMovies.mockReturnValue({
      isLoading: false,
      data: { total: 0, movies: [] },
    });

    render(<Home />);

    expect(screen.getByText("NoMovieDisplay")).toBeInTheDocument();
  });

  it("should render MovieList when movies are available", () => {
    const mockMovies = [
      {
        id: "1",
        title: "Movie 1",
        year: 2020,
        image: "image1",
        slug: "movie-1",
      },
      {
        id: "2",
        title: "Movie 2",
        year: 2021,
        image: "image2",
        slug: "movie-2",
      },
    ];

    mockUseMovies.mockReturnValue({
      isLoading: false,
      data: { total: 2, movies: mockMovies },
    });

    render(<Home />);

    expect(screen.getByText("MovieList")).toBeInTheDocument();
    expect(screen.getByText("Movies: 2")).toBeInTheDocument();
    expect(screen.getByText("Total: 2")).toBeInTheDocument();
    expect(screen.getByText("Current Page: 1")).toBeInTheDocument();
  });

  it("should update the URL when changing pages", () => {
    const mockMovies = [
      {
        id: "1",
        title: "Movie 1",
        year: 2020,
        image: "image1",
        slug: "movie-1",
      },
      {
        id: "2",
        title: "Movie 2",
        year: 2021,
        image: "image2",
        slug: "movie-2",
      },
    ];
    mockUseMovies.mockReturnValue({
      isLoading: false,
      data: { total: 2, movies: mockMovies },
    });

    render(<Home />);

    const changePageButton = screen.getByText("Change Page");
    fireEvent.click(changePageButton);

    expect(mockPush).toHaveBeenCalledWith("/?page=2");
  });
});
