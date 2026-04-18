import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/nav";
import { getCurrentUser } from "@/lib/auth";

async function logout(): Promise<void> {
  "use server";

  cookies().set("inferix_dashboard_auth", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  redirect("/login");
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }): Promise<JSX.Element> {
  const user = await getCurrentUser();

  return (
    <main className="dashboard-shell min-h-screen">
      <div className="mx-auto w-full max-w-[1180px] px-6 py-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-[17px] font-semibold tracking-tight text-foreground"
            >
              <Image src="/brand/icon-mark.svg" alt="Inferix" width={16} height={16} className="h-4 w-4" />
              Inferix
            </Link>
            <span className="hidden sm:inline-flex items-center rounded border border-border px-2 py-0.5 text-[10px] text-mutedForeground">
              Control Plane
            </span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-[12px] text-foreground font-medium leading-tight">{user.email}</p>
                  <p className="text-[10px] text-mutedForeground">{user.plan}</p>
                </div>
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-[11px] font-semibold text-foreground uppercase">
                  {user.email[0]}
                </span>
              </div>
            ) : null}
            <form action={logout}>
              <button
                type="submit"
                className="text-[13px] text-mutedForeground hover:text-foreground transition-colors font-medium"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>
        <DashboardNav />
        <section className="mt-7">{children}</section>
      </div>
    </main>
  );
}
