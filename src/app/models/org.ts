import { Area } from "./use";
import { User } from "./user";

export type ApiKey = {
  id: number;
  name: string;
  prefix: string;
  createdAt: string;
  createdBy: string;
  revoked: boolean;
};


export type Organization = {
  id: number;
  name: string;
  area: Area;

  members: User[];
  apiKeys: ApiKey[]
};
