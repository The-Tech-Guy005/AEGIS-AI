import Link from "next/link";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export async function Header() {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            A
          </div>
          <span className="text-lg font-semibold tracking-tight">AEGIS AI</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="hidden text-muted-foreground transition hover:text-foreground md:inline"
            >
              Dashboard
            </Link>
            <Link
              href="/map"
              className="hidden text-muted-foreground transition hover:text-foreground md:inline"
            >
              Map
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            />
          </Show>

          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                type="button"
                className="text-muted-foreground transition hover:text-foreground"
              >
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                type="button"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Get Started
              </button>
            </SignUpButton>
          </Show>
        </nav>
      </div>
    </header>
  );
}
