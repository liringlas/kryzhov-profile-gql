import profile from '../seed/profile.json' with { type: 'json' };

// Primary key of the seeded profile; the `profile` query falls back to it.
// Read from the seed data, so the name lives in one place
export const DEFAULT_PROFILE_NAME = profile.name;
