"use client";
import { seed } from "./server";
import { SubmitButton } from "@/app/submit-button";

export function Seed() {
  return (
    <form action={seed}>
      <SubmitButton>
        Seed
      </SubmitButton>
    </form>
  );
}
