import { Injectable } from '@nestjs/common';
import type {
  Link,
  Profile,
  Project,
  Skill,
} from '../generated/prisma/client.ts';
import {
  type ExperienceWithAchievements,
  ProfileRepository,
} from './profile.repository.ts';

@Injectable()
export class ProfileService {
  constructor(private readonly profiles: ProfileRepository) {}

  findByName(name: string): Promise<Profile | null> {
    return this.profiles.findByName(name);
  }

  findLinksByProfileName(profileName: string): Promise<Link[]> {
    return this.profiles.findLinksByProfileName(profileName);
  }

  findSkillsByProfileName(profileName: string): Promise<Skill[]> {
    return this.profiles.findSkillsByProfileName(profileName);
  }

  findExperiencesByProfileName(
    profileName: string,
  ): Promise<ExperienceWithAchievements[]> {
    return this.profiles.findExperiencesByProfileName(profileName);
  }

  findProjectsByProfileName(profileName: string): Promise<Project[]> {
    return this.profiles.findProjectsByProfileName(profileName);
  }
}
