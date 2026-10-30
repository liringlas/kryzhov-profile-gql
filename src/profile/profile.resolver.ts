import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
// Models
import { Link } from './models/link.model.ts';
import { Skill } from './models/skill.model.ts';
import { Profile } from './models/profile.model.ts';
import { Project } from './models/project.model.ts';
import { Experience } from './models/experience.model.ts';
//
import { DEFAULT_PROFILE_NAME } from './profile.constants.ts';
import { ProfileService } from './profile.service.ts';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profiles: ProfileService) {}

  @Query(() => Profile, { nullable: true })
  profile(
    @Args('name', { defaultValue: DEFAULT_PROFILE_NAME }) name: string,
  ): Promise<Profile | null> {
    return this.profiles.findByName(name);
  }

  // Each relation is a separate field resolver

  @ResolveField(() => [Link])
  links(@Parent() profile: Profile): Promise<Link[]> {
    return this.profiles.findLinksByProfileName(profile.name);
  }

  @ResolveField(() => [Skill])
  skills(@Parent() profile: Profile): Promise<Skill[]> {
    return this.profiles.findSkillsByProfileName(profile.name);
  }

  @ResolveField(() => [Experience])
  experiences(@Parent() profile: Profile): Promise<Experience[]> {
    return this.profiles.findExperiencesByProfileName(profile.name);
  }

  @ResolveField(() => [Project])
  projects(@Parent() profile: Profile): Promise<Project[]> {
    return this.profiles.findProjectsByProfileName(profile.name);
  }
}
