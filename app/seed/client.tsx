"use client";
import { seed } from "./server";
import { SubmitButton } from "@/components/submit-button";

export function Seed() {
  return (
    <form action={seed}>
      <SubmitButton>
        Seed
      </SubmitButton>
    </form>
  );
}
