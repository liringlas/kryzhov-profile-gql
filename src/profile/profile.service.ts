import { Injectable } from '@nestjs/common';
import type { Profile } from '../generated/prisma/client.ts';
import { ProfileRepository } from './profile.repository.ts';

@Injectable()
export class ProfileService {
  constructor(private readonly profiles: ProfileRepository) {}

  findByName(name: string): Promise<Profile | null> {
    return this.profiles.findByName(name);
  }
}
