import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiKey, Organization } from '../models/org';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class OrgService {

  constructor(
    private http: HttpClient,
  ) { }

  getOrgs(): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${environment.serverHost}/api/orgs/`);
  }

  getOrg(orgId: number): Observable<Organization> {
    return this.http.get<Organization>(`${environment.serverHost}/api/orgs/${orgId}/?expand=members,api_keys`);
  }

  createOrg(data: any): Observable<Organization> {
    return this.http.post<Organization>(`${environment.serverHost}/api/orgs/`, data);
  }

  revokeApiKey(orgId: number, apiKeyId: number) {
    let key = encodeURIComponent(apiKeyId)
    return this.http.delete(`${environment.serverHost}/api/orgs/${orgId}/revoke_key/?key=${key}`);
  }

  createApiKey(data:any): Observable<any> {
    return this.http.post<any>(`${environment.serverHost}/api/orgs/${data.orgId}/create_key/`, data);
  }
}
