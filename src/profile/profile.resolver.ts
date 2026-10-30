import { Args, Query, Resolver } from '@nestjs/graphql';
import { Profile } from './models/profile.model.ts';
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
}
