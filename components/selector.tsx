"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";

export function useSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const isSelecting = searchParams.has("select");
  function toggleSelect() {
    if (isSelecting) {
      router.replace(pathname, {
        scroll: false,
      });
    } else {
      router.replace(pathname + "?" + createQueryString("select", "true"), {
        scroll: false,
      });
    }
  }

  return {
    isSelecting,
    toggleSelect,
  };
}

export function Selector() {
  const { toggleSelect, isSelecting } = useSelector();
  return (
    <Button
      type="button"
      onClick={toggleSelect}
      variant="outline"
      size="lg"
    >
      {isSelecting ? "Cancel" : "Select"}
    </Button>
  );
}
