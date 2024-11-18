import { useSession } from "next-auth/react"

export const useCurrentUser = () => {
  const { data, status } = useSession();

  if (status === 'loading') {
    return { user: null, loading: true };
  };
  return { user: data?.user, loading: false };
};