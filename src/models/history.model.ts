import type { BaseModel, ObjectId } from './base.model';
import type { User } from './user.model';
import type { Story } from './story.model';
import type { Chapter } from './chapter.model';

export interface History extends BaseModel {
  user: ObjectId | User;
  story: ObjectId | Story;
  chapter: ObjectId | Chapter;
  lastReadAt: string;
}