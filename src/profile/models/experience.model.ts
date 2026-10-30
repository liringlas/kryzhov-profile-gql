import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Achievement } from './achievement.model.ts';

@ObjectType()
export class Experience {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  company: string;

  @Field()
  startDate: Date;

  // null while the position is ongoing
  @Field(() => Date, { nullable: true })
  endDate: Date | null;

  // A plain field rather than a @ResolveField: the repository loads
  // achievements together with the experiences, in one batched query
  @Field(() => [Achievement])
  achievements: Achievement[];
}
