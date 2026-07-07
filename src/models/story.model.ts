import type { BaseModel,  } from './base.model';
import type { Genre } from './genre.model.ts';

export type StoryType = 'Manga' | 'Manhua' | 'Manhwa' | 'Webtoon' | 'Comic' | "None";
export type StoryStatus = 'ongoing' | 'completed' | 'hiatus';
export type StoryDirection = 'left-to-right' | 'right-to-left' | 'vertical';

export interface Story extends BaseModel {
  title: string;
  slug: string;
  author?: string;
  description?: string;
  coverUrl?: string;

  storyType: StoryType;
  storyLanguage: string;
  isColor: boolean;
  direction: StoryDirection;
  commentCount: number;
  followersCount: number;
  status: StoryStatus;
  genres:  Genre[];
  tags: string[];
  views: number;
}

export type SafeStory = Partial<Story> & {
  _id: string;
  title: string;
};