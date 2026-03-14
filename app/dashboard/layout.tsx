import { LoginWall } from "@/components/LoginWall";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <LoginWall>{children}</LoginWall>;
}
