import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    super({
      adapter: new PrismaPg({
        connectionString: config.getOrThrow<string>('DATABASE_URL'),
      }),
    });
  }

  async onModuleInit(): Promise<void> {
    // $connect() is lazy with driver adapters: the pg pool connects on the first
    // query. Probe now so a bad DATABASE_URL fails at startup, not on a request.
    await this.$queryRaw`SELECT 1`;
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
