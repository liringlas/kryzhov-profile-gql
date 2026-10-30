import { join } from 'node:path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ProfileModule } from './profile/profile.module.ts';

const isProduction = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // The schema file is generated in development, but not in production, where the schema is built into the Docker image.
      autoSchemaFile: isProduction ? true : join(process.cwd(), 'schema.gql'),
      sortSchema: true,
      // Apollo Sandbox instead of GraphiQL, which Nest enables by default
      graphiql: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      // Apollo disables introspection when NODE_ENV=production; Sandbox needs it
      introspection: true,
    }),
    ProfileModule,
  ],
})
export class AppModule {}
