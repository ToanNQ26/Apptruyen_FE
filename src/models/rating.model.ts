import type { BaseModel, ObjectId } from './base.model';
import type { User } from './user.model';
import type { Story } from './story.model';

export interface Rating extends BaseModel {
  user: ObjectId | User;
  story: ObjectId | Story;
  score: 1 | 2 | 3 | 4 | 5;
}