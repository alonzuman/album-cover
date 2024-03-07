"use client";
import { BlendIcon } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import { useSelect } from "./select-provider";
import { Button } from "@/components/ui/button";

export function Header() {
  const { selecting, toggleSelecting } = useSelect();

  return (
    <>
      <header className="p-4 flex items-center gap-4 justify-between sticky top-0 bg-background z-10">
        <Link className="flex gap-1" href="/">
          <BlendIcon size={24} />
          <h1 className="font-medium mb-2">Coverge</h1>
        </Link>
        {/* <h1 className="text-xl mb-2 rotate-[35deg]">|</h1> */}
        {/* <Link href="/">
            <h1 className="text-xl font-medium mb-2">Explore</h1>
          </Link> */}
        <Button size="lg" variant="outline" onClick={toggleSelecting}>
          {selecting ? "Cancel" : "Select"}
        </Button>
      </header>
    </>
  );
}
