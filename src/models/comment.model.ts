import type { BaseModel, ObjectId } from './base.model';
import type { User } from './user.model';
import type { Story } from './story.model';
import type { Chapter } from './chapter.model';

export interface Comment extends BaseModel {
  userId: ObjectId | User;
  storyId: ObjectId | Story;
  chapterId?: ObjectId | Chapter | null;
  content: string;
}