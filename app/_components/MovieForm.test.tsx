import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MovieForm from "./MovieForm";
import { MovieEntity } from "@/types";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      CANCEL: "Cancel",
      UPDATE: "Update",
      SUBMIT: "Submit",
      TITLE: "Title",
      PUBLISHING_YEAR: "Publishing Year",
      TITLE_ERROR: "Title is required",
      YEAR_ERROR: "Year is required",
      IMAGE_ERROR: "Image is required",
    };
    return translations[key];
  },
}));

jest.mock("@/components", () => {
  const actualComponents = jest.requireActual("@/components");
  return {
    ...actualComponents,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    DropBox: ({ onChange, className }: any) => (
      <input
        type="file"
        data-testid="dropbox"
        className={className}
        onChange={onChange}
      />
    ),
  };
});

describe("MovieForm Component", () => {
  const onSubmitMock = jest.fn();
  const movie: MovieEntity = {
    id: "123",
    title: "Test Movie",
    year: 2020,
    image: "test-image-url",
    slug: "test-movie",
  };

  const renderMovieForm = (
    props: Partial<React.ComponentProps<typeof MovieForm>> = {},
  ) => {
    const defaultProps = {
      isPending: false,
      error: undefined,
      onSubmit: onSubmitMock,
      ...props,
    };
    return render(<MovieForm {...defaultProps} />);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render form for new movie", () => {
    renderMovieForm();
    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Publishing Year")).toBeInTheDocument();
    expect(screen.getByTestId("dropbox")).toBeInTheDocument();
  });

  it("should render with the values of movie to edit", () => {
    renderMovieForm({ movie });
    expect(screen.getByDisplayValue("Test Movie")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2020")).toBeInTheDocument();
  });

  it("should display validation errors when required fields are empty", async () => {
    renderMovieForm();
    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
      expect(screen.getByText("Year is required")).toBeInTheDocument();
      expect(screen.getByText("Image is required")).toBeInTheDocument();
    });
  });

  it("should call onSubmit with the correct data when the form is submitted", async () => {
    renderMovieForm();
    fireEvent.input(screen.getByPlaceholderText("Title"), {
      target: { value: "New Movie" },
    });
    fireEvent.input(screen.getByPlaceholderText("Publishing Year"), {
      target: { value: "2023" },
    });
    fireEvent.change(screen.getByTestId("dropbox"), {
      target: { files: [new File([""], "test.png", { type: "image/png" })] },
    });
    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith({
        title: "New Movie",
        year: "2023",
        image: expect.any(File),
      });
    });
  });

  it("should disable the submit button when isPending is true", () => {
    renderMovieForm({ isPending: true });
    expect(screen.getAllByText("Submit").length).toBe(2);
    screen.getAllByText("Submit").forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("should display the error message when error is provided", () => {
    renderMovieForm({ error: "An error occurred" });
    expect(screen.getAllByText("An error occurred").length).toBe(2);
    screen.getAllByText("An error occurred").forEach((element) => {
      expect(element).toBeInTheDocument();
    });
  });

  it("should render the Update button when editing movie", () => {
    renderMovieForm({ movie });
    expect(screen.getAllByText("Update").length).toBe(2);
    screen.getAllByText("Update").forEach((button) => {
      expect(button).toBeInTheDocument();
    });
  });

  it("should render the Submit button when creating movie", () => {
    renderMovieForm();
    expect(screen.getAllByText("Submit").length).toBe(2);
    screen.getAllByText("Submit").forEach((button) => {
      expect(button).toBeInTheDocument();
    });
  });
});
