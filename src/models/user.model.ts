import type { BaseModel } from './base.model';

export interface User extends BaseModel {
  name: string;
  email: string;
  password?: string;
  role?: string;
}