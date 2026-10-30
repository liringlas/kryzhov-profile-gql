import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.ts';
import { PrismaService } from './../src/prisma/prisma.service.ts';

const PROFILE_QUERY = `
  query Profile($name: String!) {
    profile(name: $name) {
      name
      description
    }
  }
`;

describe('profile query (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  // Unique per run so the test never touches real profile data
  const name = `e2e-${Date.now()}`;
  const description = 'Created by the e2e test';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
    await prisma.profile.create({ data: { name, description } });
  });

  afterAll(async () => {
    await prisma.profile.delete({ where: { name } });
    await app.close();
  });

  it('returns the profile by name', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: PROFILE_QUERY, variables: { name } })
      .expect(200)
      .expect({ data: { profile: { name, description } } });
  });

  it('returns null for an unknown name', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: PROFILE_QUERY, variables: { name: `${name}-missing` } })
      .expect(200)
      .expect({ data: { profile: null } });
  });
});
