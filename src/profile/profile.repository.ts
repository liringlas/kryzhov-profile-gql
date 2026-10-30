import { Injectable } from '@nestjs/common';
import type { Profile } from '../generated/prisma/client.ts';
import { PrismaService } from '../prisma/prisma.service.ts';

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByName(name: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { name } });
  }
}
