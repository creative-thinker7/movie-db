import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useLogout } from "@/api";
import { useRouter } from "next/navigation";
import Header from "./Header";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      MY_MOVIES: "My Movies",
      LOGOUT: "Logout",
    };
    return translations[key];
  },
}));

jest.mock("@/api", () => ({
  useLogout: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/link", () => {
  return ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ src, width, height, alt }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} width={width} height={height} alt={alt} />
  ),
}));

describe("Header Component", () => {
  const mockMutateAsync = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    (useLogout as jest.Mock).mockReturnValue({
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

  it("should render correctly with movies", () => {
    render(<Header hasMovies={true} />);

    expect(screen.getByText("My Movies")).toBeInTheDocument();
    expect(screen.getByAltText("plus")).toBeInTheDocument();
    expect(screen.getByAltText("logout")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("should render correctly without movies", () => {
    render(<Header hasMovies={false} />);

    expect(screen.queryByText("My Movies")).not.toBeInTheDocument();
    expect(screen.queryByAltText("plus")).not.toBeInTheDocument();
    expect(screen.getByAltText("logout")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("should disable the logout button when isPending is true", () => {
    (useLogout as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
    });

    render(<Header hasMovies={true} />);

    const logoutButton = screen.getByText("Logout").closest("button");
    expect(logoutButton).toBeDisabled();
  });

  it("should call handleLogout when the logout button is clicked", async () => {
    render(<Header hasMovies={true} />);

    const logoutButton = screen.getByText("Logout").closest("button");
    fireEvent.click(logoutButton!);

    expect(mockMutateAsync).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/signin");
    });
  });

  it("should navigate to /create when the plus icon is clicked", () => {
    render(<Header hasMovies={true} />);

    const plusIcon = screen.getByAltText("plus");
    const linkElement = plusIcon.closest("a");

    expect(linkElement).toHaveAttribute("href", "/create");
  });
});
