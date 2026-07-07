import type { ObjectId } from './base.model';

export interface Genre {
  _id: ObjectId;
  name: string;
  description?: string;
}