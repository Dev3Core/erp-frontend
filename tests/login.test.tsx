import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm as LoginPage } from "@/app/auth/login/login-form";

// Mock next/navigation
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock auth context
const loginMock = vi.fn();
vi.mock("@/context/auth-context", () => ({
  useAuth: () => ({
    login: loginMock,
    user: null,
    loading: false,
    mfaRequired: false,
    register: vi.fn(),
    verifyMfa: vi.fn(),
    logout: vi.fn(),
  }),
}));

beforeEach(() => {
  pushMock.mockReset();
  loginMock.mockReset();
});

describe("LoginPage", () => {
  it("renders the login form", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contrasena/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /iniciar sesion/i })).toBeInTheDocument();
  });

  it("calls login and redirects OWNER to admin dashboard", async () => {
    loginMock.mockResolvedValueOnce({
      user_id: "u1",
      email: "a@b.com",
      role: "OWNER",
      mfa_required: false,
    });

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), "a@b.com");
    await user.type(screen.getByLabelText(/contrasena/i), "12345678");
    await user.click(screen.getByRole("button", { name: /iniciar sesion/i }));

    expect(loginMock).toHaveBeenCalledWith({ email: "a@b.com", password: "12345678" });
    expect(pushMock).toHaveBeenCalledWith("/admin/dashboard");
  });

  it("redirects to MFA page when mfa_required is true", async () => {
    loginMock.mockResolvedValueOnce({
      user_id: "u1",
      email: "a@b.com",
      role: "OWNER",
      mfa_required: true,
    });

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), "a@b.com");
    await user.type(screen.getByLabelText(/contrasena/i), "12345678");
    await user.click(screen.getByRole("button", { name: /iniciar sesion/i }));

    expect(pushMock).toHaveBeenCalledWith("/auth/mfa");
  });

  it("shows error on failed login", async () => {
    const { ApiError } = await import("@/lib/api");
    loginMock.mockRejectedValueOnce(new ApiError(401, "Invalid credentials"));

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), "a@b.com");
    await user.type(screen.getByLabelText(/contrasena/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /iniciar sesion/i }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });

  it("has link to register page", () => {
    render(<LoginPage />);

    const link = screen.getByRole("link", { name: /registra tu estudio/i });
    expect(link).toHaveAttribute("href", "/auth/register");
  });
});
