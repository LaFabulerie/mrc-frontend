import { Organization } from "./org";

export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isSuperuser: boolean;
  org: Organization;
  orgId: number;
}
