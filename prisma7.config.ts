import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { defineConfig } from "prisma/config";

// .env builds DATABASE_URL from other variables via ${...}
expand(config());

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // Local `prisma db seed`; the container runs the compiled dist/seed/seed.js
    // from docker-entrypoint.sh, since the runtime image has no tsx
    seed: "tsx src/seed/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
