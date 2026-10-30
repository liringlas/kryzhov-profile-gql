import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Achievement {
  @Field(() => Int)
  id: number;

  @Field()
  description: string;
}
