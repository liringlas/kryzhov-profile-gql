import { PrismaPg } from '@prisma/adapter-pg';
import { z } from 'zod';
import { type Prisma, PrismaClient } from '../generated/prisma/client.ts';
import profileJson from './profile.json' with { type: 'json' };

const text = z.string().min(1);
const httpUrl = z.url({ protocol: /^https?$/ });
const isoDate = z.iso.date().transform((value) => new Date(value));

// Strict seed data type
const SeedProfileSchema = z.strictObject({
  name: text,
  description: text,
  links: z.array(z.strictObject({ name: text, url: httpUrl })),
  skills: z.array(text),
  experiences: z.array(
    z.strictObject({
      title: text,
      company: text,
      startDate: isoDate,
      endDate: isoDate.nullish(),
      achievements: z.array(text).default([]),
    }),
  ),
  projects: z.array(
    z.strictObject({ name: text, description: text, url: httpUrl.nullish() }),
  ),
});

type SeedProfile = z.output<typeof SeedProfileSchema>;

// Parse and validate the seed data, throwing an error if invalid
function parseProfile(): SeedProfile {
  const raw: z.input<typeof SeedProfileSchema> = profileJson;
  const result = SeedProfileSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `profile.json is invalid:\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}

function toCreateInput(seed: SeedProfile): Prisma.ProfileCreateInput {
  return {
    name: seed.name,
    description: seed.description,
    links: { create: seed.links },
    // For future case if there will be more profiles,
    // so we reuse existing Skill rows instead of creating duplicates
    skills: {
      connectOrCreate: seed.skills.map((name) => ({
        where: { name },
        create: { name },
      })),
    },
    experiences: {
      create: seed.experiences.map(({ achievements, ...experience }) => ({
        ...experience,
        achievements: {
          create: achievements.map((description) => ({ description })),
        },
      })),
    },
    projects: { create: seed.projects },
  };
}

const databaseUrl = process.env['DATABASE_URL'];
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

// Validated before connecting, so invalid data fails without touching the database
const profile = parseProfile();
const data = toCreateInput(profile);

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

try {
  await prisma.$transaction(async (tx) => {
    // IMPORTANT: Purging tables before seeding
    await tx.profile.deleteMany();
    await tx.skill.deleteMany();
    // Recreate
    await tx.profile.create({ data });
  });
  console.log(
    `Seeded profile "${profile.name}": ${profile.links.length} links, ` +
      `${profile.skills.length} skills, ${profile.experiences.length} experiences, ` +
      `${profile.projects.length} projects`,
  );
} finally {
  await prisma.$disconnect();
}
