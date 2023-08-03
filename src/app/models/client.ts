import { Organization } from "./org";
import { Area } from "./core";

export type RemoteAccess = {
  id: number;
  name: string;
  serverUrl: string;
  apiKeyPrefix: string;
  default: boolean;
  org: Organization;
  area: Area
};
