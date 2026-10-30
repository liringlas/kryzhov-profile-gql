import { Field, ObjectType } from '@nestjs/graphql';

// Relations (links, skills, experiences, projects) are declared as
// @ResolveField in ProfileResolver, so they load only when a query asks for them
@ObjectType()
export class Profile {
  @Field()
  name: string;

  @Field()
  description: string;
}
