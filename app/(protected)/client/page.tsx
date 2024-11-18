'use client';

import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function Page() {
  const { user, loading } = useCurrentUser();

  if (loading) {
    return (
      <div>
        Loading...
      </div>
    );
  };

  if (!user) {
    return (
      <div>
        User undefined
      </div>
    )
  }

  return (
    <UserInfo label="📱 Client component" user={user} />
  );
};
