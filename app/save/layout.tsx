import { LoginWall } from "@/components/LoginWall";

export default function SaveLayout({ children }: { children: React.ReactNode }) {
  return <LoginWall>{children}</LoginWall>;
}
