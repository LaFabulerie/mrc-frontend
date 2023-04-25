import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RemoteAccess } from '../models/client';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private remoteAccessesSubject: BehaviorSubject<RemoteAccess[]>;
  public remoteAccesses$: Observable<RemoteAccess[] | undefined>;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.remoteAccessesSubject = new BehaviorSubject<RemoteAccess[]>([]);
    this.remoteAccesses$ = this.remoteAccessesSubject.asObservable();

    this.fetchRemoteAccesses()
  }

  public get remoteAccesses() {
    return this.remoteAccessesSubject.value;
  }

  fetchRemoteAccesses() {
    return this.http.get<any>(`${environment.apiHost}/api/client/remote-accesses/?expand=org,area`).pipe(
      tap(data => {
        const findDefault = data.find((x: RemoteAccess) => x.default);
        this.authService.updateCurrentUser({orgId: findDefault ? findDefault.org.id : null}).subscribe();
      })
    ).subscribe(data => {
      this.remoteAccessesSubject.next(data);
    });
  }

  createRemoteAccess(data: any) {
    return this.http.post<any>(`${environment.apiHost}/api/client/remote-accesses/`, data);
  }

  deleteRemoteAccess(id: number) {
    return this.http.delete<any>(`${environment.apiHost}/api/client/remote-accesses/${id}/`);
  }

  synchronizeRemoteAccess(id: number) {
    return this.http.get<any>(`${environment.apiHost}/api/client/remote-accesses/${id}/synchronize/`);
  }

}
