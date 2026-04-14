import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "@/app/auth/register/page";

// Mock next/navigation
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock auth context
const registerMock = vi.fn();
vi.mock("@/context/auth-context", () => ({
  useAuth: () => ({
    register: registerMock,
    user: null,
    loading: false,
    mfaRequired: false,
    login: vi.fn(),
    verifyMfa: vi.fn(),
    logout: vi.fn(),
  }),
}));

beforeEach(() => {
  pushMock.mockReset();
  registerMock.mockReset();
});

describe("RegisterPage", () => {
  it("renders the registration form", () => {
    render(<RegisterPage />);

    expect(screen.getByLabelText(/nombre del estudio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tu nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contrasena/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /crear estudio/i })).toBeInTheDocument();
  });

  it("calls register with form data", async () => {
    registerMock.mockResolvedValueOnce(undefined);

    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/nombre del estudio/i), "Mi Estudio");
    await user.type(screen.getByLabelText(/tu nombre completo/i), "Juan Perez");
    await user.type(screen.getByLabelText(/email/i), "juan@test.com");
    await user.type(screen.getByLabelText(/contrasena/i), "12345678");
    await user.click(screen.getByRole("button", { name: /crear estudio/i }));

    expect(registerMock).toHaveBeenCalledWith({
      studio_name: "Mi Estudio",
      full_name: "Juan Perez",
      email: "juan@test.com",
      password: "12345678",
    });
  });

  it("shows error on failed registration", async () => {
    const { ApiError } = await import("@/lib/api");
    registerMock.mockRejectedValueOnce(new ApiError(409, "Email already registered"));

    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/nombre del estudio/i), "Test");
    await user.type(screen.getByLabelText(/tu nombre completo/i), "Test");
    await user.type(screen.getByLabelText(/email/i), "dup@test.com");
    await user.type(screen.getByLabelText(/contrasena/i), "12345678");
    await user.click(screen.getByRole("button", { name: /crear estudio/i }));

    expect(await screen.findByText("Email already registered")).toBeInTheDocument();
  });

  it("has link to login page", () => {
    render(<RegisterPage />);

    const link = screen.getByRole("link", { name: /inicia sesion/i });
    expect(link).toHaveAttribute("href", "/auth/login");
  });
});
