import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Input type="email" placeholder="Email" disabled />
            <Input type="password" placeholder="Password" disabled />
            <Button disabled className="w-full">
              Sign In
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Authentication not yet implemented
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
