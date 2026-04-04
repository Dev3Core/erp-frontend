import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-8 p-8">
        <h1 className="text-3xl font-bold tracking-tight">
          ERP - Webcam Studio Management
        </h1>
        <p className="text-muted-foreground">Development Navigation</p>
        <nav className="flex flex-col gap-3">
          <Link
            href="/auth/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Login
          </Link>
          <Link
            href="/admin/dashboard"
            className="text-primary underline-offset-4 hover:underline"
          >
            Admin Dashboard
          </Link>
          <Link
            href="/monitor/dashboard"
            className="text-primary underline-offset-4 hover:underline"
          >
            Monitor Dashboard
          </Link>
          <Link
            href="/modelo/dashboard"
            className="text-primary underline-offset-4 hover:underline"
          >
            Model Dashboard
          </Link>
        </nav>
      </div>
    </div>
  );
}
