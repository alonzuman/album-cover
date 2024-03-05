"use client";
import React from "react";
import { Covers } from "./covers";

export default function Page() {
  return (
    <main className="max-w-2xl mx-auto p-4">
      <h2 className="font-medium mb-2">Latest</h2>
      <Covers />
    </main>
  );
}
