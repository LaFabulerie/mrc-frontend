import { Organization } from "./org";
import { Area } from "./use";

export type RemoteAccess = {
  id: number;
  name: string;
  serverUrl: string;
  apiKeyPrefix: string;
  default: boolean;
  org: Organization;
  area: Area
};
