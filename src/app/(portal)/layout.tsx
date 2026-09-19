import { PortalShell } from "@/components/layout/portal-shell";
import { requireUser } from "@/features/auth/session";

export default async function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();
  return <PortalShell user={user}>{children}</PortalShell>;
}
