// models/paginated-story.model.ts

import type { Story } from "../models/story.model";

export interface PaginatedStories {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stories: Story[];
}