import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Link {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  url: string;
}
