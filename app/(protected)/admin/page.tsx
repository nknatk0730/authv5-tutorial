'use client';

import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

export default function Page() {
  const onServerActionClick = async () => {
    const res = await admin();

    if (res.success) {
      toast.success(res.success);
    };

    if (res.error) {
      toast.error(res.error);
    };
  };

  const onApiRouteClick = async () => {
    const res = await fetch('/api/admin');
    if (res.ok) {
      toast.success('Allowed API Route');
    } else {
      toast.error("Forbidden API Route");
    };
  };

  return (
    <div>
      <Card className="w-[430px]">
        <CardHeader>
          <p className="text-2xl font-semibold text-center">🔑 Admin</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <RoleGate allowedRole={UserRole.ADMIN}>
            <FormSuccess message="You are allowed to see this content" />
          </RoleGate>
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-md">
            <p className="text-sm font-medium">Admin-only API Route</p>
            <Button onClick={onApiRouteClick}>Click to test</Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-md">
            <p className="text-sm font-medium">Admin-only Server Action</p>
            <Button onClick={onServerActionClick}>Click to test</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
