export interface CreateStoryData {
  title: string;
  author: string;
  description: string;
  storyType: string;
  storyLanguage: string;
  isColor: boolean;
  direction: string;
  status: string;
  genres: string[];
  tags: string[];
  cover: File;
}