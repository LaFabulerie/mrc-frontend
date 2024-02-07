import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable} from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class ContributeService {

  constructor(
    private http: HttpClient,) {}

  saveData(data: any): Observable<any> {
    return this.http.post(`${environment.serverHost}/api/contribute/saveform/`, data);
  }


}
