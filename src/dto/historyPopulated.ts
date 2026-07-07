import type { BaseModel, Chapter, Story, User } from "../models";

export interface HistoryPopulated extends BaseModel {
  user: User;
  story: Story;
  chapter: Chapter;
  lastReadAt: string;
}