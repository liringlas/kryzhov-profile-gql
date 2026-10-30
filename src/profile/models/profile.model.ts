import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Profile {
  @Field()
  name: string;

  @Field()
  description: string;
}
