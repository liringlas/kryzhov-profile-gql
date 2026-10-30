#!/bin/sh
set -e

prisma migrate deploy
# Rebuild the profile from src/seed/profile.json (compiled into dist/ by nest build;
# `prisma db seed` would need tsx, which the runtime image does not have)
node dist/seed/seed.js

# Run the command provided as arguments to this entrypoint script
exec "$@"
