import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SigninForm from "./SigninForm";
import { useSignin } from "@/api";
import { useRouter } from "next/navigation";

jest.mock("next-intl", () => ({
  useTranslations: () => {
    const translations: Record<string, string> = {
      EMAIL: "Email",
      PASSWORD: "Password",
      REMEMBER_ME: "Remember Me",
      LOGIN: "Login",
      INVALID_EMAIL_ERROR: "Invalid email",
      PASSWORD_ERROR: "Password is required",
      GENERIC_ERROR: "An error occurred",
      LOADING: "Loading...",
    };

    const t = (key: string) => translations[key] || key;

    t.has = (key: string) => key in translations;

    return t;
  },
}));

jest.mock("@/api", () => ({
  useSignin: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// // Mock child components
// jest.mock("@/components/Button", () => ({
//   __esModule: true,
//   default: ({ children, ...props }: any) => (
//     <button {...props}>{children}</button>
//   ),
// }));

// jest.mock("@/components/Checkbox", () => ({
//   __esModule: true,
//   default: ({ children, ...props }: any) => (
//     <label>
//       <input type="checkbox" {...props} />
//       {children}
//     </label>
//   ),
// }));

// jest.mock("@/components/ErrorDescription", () => ({
//   __esModule: true,
//   default: ({ children }: any) => <div>{children}</div>,
// }));

// jest.mock("@/components/Input", () => ({
//   __esModule: true,
//   default: ({ ...props }: any) => <input {...props} />,
// }));

// jest.mock("@/components/Loader", () => ({
//   __esModule: true,
//   default: () => <div>Loading...</div>,
// }));

describe("SigninForm Component", () => {
  const mockMutateAsync = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    (useSignin as jest.Mock).mockReturnValue({
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

  it("should render the form fields and submit button", () => {
    render(<SigninForm />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Remember Me")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("should display validation errors for invalid email and password", async () => {
    render(<SigninForm />);

    const submitButton = screen.getByText("Login");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid email")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  it("should submit the form and redirects to home page on success", async () => {
    render(<SigninForm />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByText("Login");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
        rememberMe: false,
      });
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("should display an error message when submission fails", async () => {
    const errorMessage = "GENERIC_ERROR";
    mockMutateAsync.mockRejectedValueOnce(new Error(errorMessage));

    render(<SigninForm />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByText("Login");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("An error occurred")).toBeInTheDocument();
    });
  });

  it("should display a loading state when isPending is true", () => {
    (useSignin as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
    });

    render(<SigninForm />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
