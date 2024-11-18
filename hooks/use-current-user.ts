import { useSession } from "next-auth/react"

export const useCurrentUser = () => {
  const session = useSession();

  if (session.status === "loading") {
    return null; // セッション情報の取得中は null を返す
  };

  return session.data?.user || null;

};