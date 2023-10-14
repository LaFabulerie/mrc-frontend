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

  members: User[];
  apiKeys: ApiKey[]
};
