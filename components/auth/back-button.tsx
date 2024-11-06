'use client';

import Link from "next/link";
import { Button } from "../ui/button";

type BackButtonProps = {
  label: string;
  href: string;
}

export const BackButton = ({
  label,
  href,
}: BackButtonProps) => {
  return (
    <Button variant="link" size="sm" className="w-full" asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
}