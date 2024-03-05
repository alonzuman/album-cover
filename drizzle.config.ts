import type { Config } from "drizzle-kit";
export default {
  schema: "./lib/db.ts",
  out: "./drizzle",
} satisfies Config;
