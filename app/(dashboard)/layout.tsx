import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { TopNav } from "@/components/nav/TopNav";
import { MobileTabBar } from "@/components/nav/MobileTabBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-stone-50">
      <TopNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 sm:pb-8">
        {children}
      </main>
      <MobileTabBar />
    </div>
  );
}
