import { environment } from "src/environments/environment";
import { Organization } from "./org";

export class User {
  id?: number;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  isSuperuser?: boolean;
  org?: Organization;
  orgId?: number;

  constructor(data: any){
    Object.assign(this, data);
  }

  canEdit(): boolean {
    return this.isSuperuser || environment.mode === 'client';
  }

}
