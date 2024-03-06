"use client";
import { Button } from "@/components/ui/button";
import { seed } from "./server";
import { useFormStatus } from "react-dom";

export function Seed() {
  return (
    <form action={seed}>
      <SeedButton />
    </form>
  );
}

function SeedButton() {
  const { pending } = useFormStatus();

  return <Button disabled={pending}>{pending ? "Seeding..." : "Seed"}</Button>;
}
