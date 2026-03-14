import { LoginWall } from "@/components/LoginWall";

export default function ImportLayout({ children }: { children: React.ReactNode }) {
  return <LoginWall>{children}</LoginWall>;
}
