import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UpdateForm from "./UpdateForm";
import { useUpdateMovie } from "@/api";
import { useRouter } from "next/navigation";
import { MovieEntity } from "@/types";

jest.mock("next-intl", () => ({
  useTranslations: () => {
    const translations: Record<string, string> = {
      GENERIC_ERROR: "An error occurred",
      UPDATE_SUCCESS: "Movie updated successfully",
    };

    // Create a callable function
    const t = (key: string) => translations[key] || key;

    // Add the `has` method to the function
    t.has = (key: string) => key in translations;

    return t;
  },
}));

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => {
    return {
      invalidateQueries: jest.fn(),
    };
  },
}));

jest.mock("@/api", () => ({
  useUpdateMovie: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/components", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MovieForm: ({ isPending, error, onSubmit }: any) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          title: "Updated Movie",
          year: 2024,
          image: "updated-image-url",
        });
      }}
    >
      <div>MovieForm</div>
      {isPending && <div>Loading...</div>}
      {error && <div>{error}</div>}
      <button type="submit">Submit</button>
    </form>
  ),
  useToast: jest.fn(() => jest.fn()),
}));

describe("UpdateForm Component", () => {
  const mockMutateAsync = jest.fn();
  const mockPush = jest.fn();

  const mockMovie: MovieEntity = {
    id: "1",
    title: "Test Movie",
    year: 2020,
    image: "test-image-url",
    slug: "test-movie",
  };

  beforeEach(() => {
    (useUpdateMovie as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the MovieForm component with the correct props", () => {
    render(<UpdateForm movie={mockMovie} />);

    expect(screen.getByText("MovieForm")).toBeInTheDocument();
  });

  it("should submit the form and redirects to home page on success", async () => {
    render(<UpdateForm movie={mockMovie} />);

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        slug: mockMovie.slug,
        data: {
          title: "Updated Movie",
          year: 2024,
          image: "updated-image-url",
        },
      });
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("should display a translatable error message when submission fails", async () => {
    const errorMessage = "GENERIC_ERROR";
    mockMutateAsync.mockRejectedValueOnce(new Error(errorMessage));

    render(<UpdateForm movie={mockMovie} />);

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("An error occurred")).toBeInTheDocument();
    });
  });

  it("should display a non-translatable error message when the error is not translatable", async () => {
    const errorMessage = "Non-translatable error";
    mockMutateAsync.mockRejectedValueOnce(new Error(errorMessage));

    render(<UpdateForm movie={mockMovie} />);

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("should display a loading state when isPending is true", () => {
    (useUpdateMovie as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
    });

    render(<UpdateForm movie={mockMovie} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
