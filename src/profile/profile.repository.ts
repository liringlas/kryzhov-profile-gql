import { Injectable } from '@nestjs/common';
import type {
  Link,
  Prisma,
  Profile,
  Project,
  Skill,
} from '../generated/prisma/client.ts';
import { PrismaService } from '../prisma/prisma.service.ts';

const withAchievements = {
  achievements: { orderBy: { id: 'asc' } },
} satisfies Prisma.ExperienceInclude;

export type ExperienceWithAchievements = Prisma.ExperienceGetPayload<{
  include: typeof withAchievements;
}>;

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByName(name: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { name } });
  }

  findLinksByProfileName(profileName: string): Promise<Link[]> {
    return this.prisma.link.findMany({
      where: { profileName },
      orderBy: { id: 'asc' },
    });
  }

  findSkillsByProfileName(profileName: string): Promise<Skill[]> {
    return this.prisma.skill.findMany({
      where: { profiles: { some: { name: profileName } } },
      orderBy: { id: 'asc' },
    });
  }

  // Newest position first, as on a CV
  findExperiencesByProfileName(
    profileName: string,
  ): Promise<ExperienceWithAchievements[]> {
    return this.prisma.experience.findMany({
      where: { profileName },
      orderBy: { startDate: 'desc' },
      include: withAchievements,
    });
  }

  findProjectsByProfileName(profileName: string): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: { profileName },
      orderBy: { id: 'asc' },
    });
  }
}
