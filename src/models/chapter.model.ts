import type { BaseModel, ObjectId } from './base.model';
import type { Story } from './story.model';

export interface Chapter extends BaseModel {
  story:  string;
  chapterNumber: number;
  title?: string;
  images: string[];
}