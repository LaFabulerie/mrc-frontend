export type Organization = {
  id: number;
  name: string;
};


export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isSuperuser: boolean;
  organization: Organization;
}
