#!/bin/sh
set -e

prisma migrate deploy
# Seed the database with sample data
prisma db seed

# Run the command provided as arguments to this entrypoint script
exec "$@"
