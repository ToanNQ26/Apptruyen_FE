export type ObjectId = string;

export interface BaseModel {
  _id: ObjectId;
  createdAt: string;
  updatedAt: string;
}