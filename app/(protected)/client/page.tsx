'use client';

import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function Page() {
  const user  = useCurrentUser();

  if (!user) {
    return <p>ユーザー情報を取得中です...</p>; // ローディング中や未ログイン時の表示
  };
  
  return (
    <UserInfo label="📱 Client component" user={user} />
  );
};
