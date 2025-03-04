import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateForm from "./CreateForm";
import { useCreateMovie } from "@/api";
import { useRouter } from "next/navigation";

jest.mock("next-intl", () => ({
  useTranslations: () => {
    const translations: Record<string, string> = {
      GENERIC_ERROR: "An error occurred",
      CREATE_SUCCESS: "Movie created successfully",
      MY_ERROR: "my error",
    };

    const t = (key: string) => translations[key] || key;

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
  useCreateMovie: jest.fn(),
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
        onSubmit({ title: "Test Movie", year: 2023, image: "image-url" });
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

describe("CreateForm Component", () => {
  const mockMutateAsync = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    (useCreateMovie as jest.Mock).mockReturnValue({
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

  it("should render the MovieForm component", () => {
    render(<CreateForm />);

    expect(screen.getByText("MovieForm")).toBeInTheDocument();
  });

  it("should submit the form and redirects to home page on success", async () => {
    render(<CreateForm />);

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        title: "Test Movie",
        year: 2023,
        image: "image-url",
      });
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("should display an error message when submission fails", async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error("MY_ERROR"));

    render(<CreateForm />);

    const submitButtons = screen.getAllByText("Submit");
    fireEvent.click(submitButtons[0]);

    await waitFor(() => {
      expect(screen.getAllByText("my error")[0]).toBeInTheDocument();
    });
  });

  it("should display a generic error message when the error is not translatable", async () => {
    const errorMessage = "Non-translatable error";
    mockMutateAsync.mockRejectedValueOnce(new Error(errorMessage));

    render(<CreateForm />);

    const submitButtons = screen.getAllByText("Submit");
    fireEvent.click(submitButtons[0]);

    await waitFor(() => {
      expect(screen.getAllByText(errorMessage)[0]).toBeInTheDocument();
    });
  });

  it("should display a loading state when isPending is true", () => {
    (useCreateMovie as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
    });

    render(<CreateForm />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
