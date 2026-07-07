import type { BaseModel, ObjectId } from './base.model';
import type { User } from './user.model';
import type { Story } from './story.model';

export interface Favorite extends BaseModel {
  user: ObjectId | User;
  story: ObjectId | Story;
}