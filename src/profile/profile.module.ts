import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { ProfileRepository } from './profile.repository.ts';
import { ProfileResolver } from './profile.resolver.ts';
import { ProfileService } from './profile.service.ts';

@Module({
  imports: [PrismaModule],
  providers: [ProfileRepository, ProfileService, ProfileResolver],
})
export class ProfileModule {}
